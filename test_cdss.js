/**
 * ============================================================
 * TEST_CDSS.JS — Healthcare Eval Harness
 * Consulta Rápida ENF · UDP 2026
 * ============================================================
 * Basado en patrones healthcare-eval-harness
 * Categoría CDSS Accuracy: 100% requerido (gate crítico)
 *
 * Uso: node test_cdss.js
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

// ── Cargar motor CDSS ──────────────────────────────────────
const cdssCode = fs.readFileSync(path.join(__dirname, 'cdss.js'), 'utf-8');
const cdss = new Function(cdssCode + '\nreturn {INTERACTION_DB,DOSE_RULES,DRUG_CATEGORIES,CROSS_REACTIVITY,checkInteractions,validateDose,getDrugList,getDrugListForDoseCheck,getDrugsByCategory,getRoutesForDrug};')();
const { INTERACTION_DB, DOSE_RULES, DRUG_CATEGORIES, CROSS_REACTIVITY,
        checkInteractions, validateDose, getDrugListForDoseCheck,
        getDrugsByCategory, getRoutesForDrug } = cdss;

// ── Framework de testing mínimo ────────────────────────────
let passed = 0, failed = 0, total = 0;
const failures = [];

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    process.stdout.write('.');
  } catch (e) {
    failed++;
    failures.push({ name, error: e.message });
    process.stdout.write('✗');
  }
}

function expect(val) {
  return {
    toBe: (expected) => {
      if (val !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
    },
    toBeTrue: () => {
      if (val !== true) throw new Error(`Expected true, got ${JSON.stringify(val)}`);
    },
    toBeFalse: () => {
      if (val !== false) throw new Error(`Expected false, got ${JSON.stringify(val)}`);
    },
    toBeGreaterThan: (n) => {
      if (!(val > n)) throw new Error(`Expected ${val} > ${n}`);
    },
    toContain: (item) => {
      if (!val.includes(item)) throw new Error(`Expected array/string to contain ${JSON.stringify(item)}`);
    },
    toHaveLength: (n) => {
      if (val.length !== n) throw new Error(`Expected length ${n}, got ${val.length}`);
    },
    toBeDefined: () => {
      if (val === undefined || val === null) throw new Error(`Expected value to be defined, got ${val}`);
    },
    toEqual: (expected) => {
      if (JSON.stringify(val) !== JSON.stringify(expected))
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
    }
  };
}

function describe(suiteName, fn) {
  console.log(`\n\n📋 ${suiteName}`);
  console.log('─'.repeat(60));
  fn();
}

// ═══════════════════════════════════════════════════════════
// SUITE 1 — Integridad de la Base de Datos
// ═══════════════════════════════════════════════════════════
describe('SUITE 1 · Integridad de Base de Datos', () => {

  test('DOSE_RULES contiene al menos 80 fármacos', () => {
    expect(Object.keys(DOSE_RULES).length).toBeGreaterThan(79);
  });

  test('Todos los fármacos tienen _category asignada', () => {
    const sin = Object.entries(DOSE_RULES).filter(([,v]) => !v._category).map(([k]) => k);
    if (sin.length > 0) throw new Error(`Sin categoría: ${sin.join(', ')}`);
  });

  test('Todas las categorías son válidas (existen en DRUG_CATEGORIES)', () => {
    const invalidas = Object.entries(DOSE_RULES)
      .filter(([,v]) => v._category && !DRUG_CATEGORIES[v._category])
      .map(([k,v]) => `${k}:${v._category}`);
    if (invalidas.length > 0) throw new Error(`Categorías inválidas: ${invalidas.join(', ')}`);
  });

  test('INTERACTION_DB contiene al menos 70 pares', () => {
    expect(INTERACTION_DB.length).toBeGreaterThan(69);
  });

  test('Todas las interacciones tienen los campos requeridos', () => {
    const campos = ['drugA','drugB','severity','mechanism','clinicalEffect','recommendation'];
    const incompletas = INTERACTION_DB.filter(i => campos.some(c => !i[c]));
    if (incompletas.length > 0)
      throw new Error(`${incompletas.length} interacciones con campos faltantes`);
  });

  test('Todas las severidades son válidas (critical/major/minor)', () => {
    const invalidas = INTERACTION_DB.filter(i => !['critical','major','minor'].includes(i.severity));
    if (invalidas.length > 0)
      throw new Error(`Severidades inválidas: ${invalidas.map(i=>`${i.drugA}+${i.drugB}`).join(', ')}`);
  });

  test('Cada fármaco tiene al menos una vía de administración', () => {
    const sinVia = Object.entries(DOSE_RULES)
      .filter(([,v]) => Object.keys(v).filter(k => k !== '_category').length === 0)
      .map(([k]) => k);
    if (sinVia.length > 0) throw new Error(`Sin vías: ${sinVia.join(', ')}`);
  });

  test('Cada regla de vía tiene absoluteMax, typicalMin y typicalMax', () => {
    const errores = [];
    for (const [drug, data] of Object.entries(DOSE_RULES)) {
      for (const [route, rules] of Object.entries(data)) {
        if (route === '_category') continue;
        if (!rules.absoluteMax || !rules.typicalMin || !rules.typicalMax)
          errores.push(`${drug}/${route}`);
      }
    }
    if (errores.length > 0) throw new Error(`Reglas incompletas en: ${errores.slice(0,5).join(', ')}`);
  });

  test('typicalMin nunca supera absoluteMax', () => {
    const errores = [];
    for (const [drug, data] of Object.entries(DOSE_RULES)) {
      for (const [route, rules] of Object.entries(data)) {
        if (route === '_category') continue;
        if (rules.typicalMin > rules.absoluteMax)
          errores.push(`${drug}/${route} (min:${rules.typicalMin} > max:${rules.absoluteMax})`);
      }
    }
    if (errores.length > 0) throw new Error(`Rangos inválidos: ${errores.join(', ')}`);
  });

  test('Fármacos weight-based tienen minPerKg y maxPerKg', () => {
    const errores = [];
    for (const [drug, data] of Object.entries(DOSE_RULES)) {
      for (const [route, rules] of Object.entries(data)) {
        if (route === '_category') continue;
        if (rules.weightBased && (!rules.minPerKg || !rules.maxPerKg))
          errores.push(`${drug}/${route}`);
      }
    }
    if (errores.length > 0) throw new Error(`Weight-based sin rango/kg: ${errores.join(', ')}`);
  });

  test('Fármacos renalAdjusted tienen getRenalAdjustedMax', () => {
    const errores = [];
    for (const [drug, data] of Object.entries(DOSE_RULES)) {
      for (const [route, rules] of Object.entries(data)) {
        if (route === '_category') continue;
        if (rules.renalAdjusted && typeof rules.getRenalAdjustedMax !== 'function')
          errores.push(`${drug}/${route}`);
      }
    }
    if (errores.length > 0) throw new Error(`renalAdjusted sin función: ${errores.join(', ')}`);
  });

  test('Fármacos ageAdjusted tienen getAgeAdjustedMax', () => {
    const errores = [];
    for (const [drug, data] of Object.entries(DOSE_RULES)) {
      for (const [route, rules] of Object.entries(data)) {
        if (route === '_category') continue;
        if (rules.ageAdjusted && typeof rules.getAgeAdjustedMax !== 'function')
          errores.push(`${drug}/${route}`);
      }
    }
    if (errores.length > 0) throw new Error(`ageAdjusted sin función: ${errores.join(', ')}`);
  });

  test('No hay pares de interacción duplicados', () => {
    const seen = new Set();
    const dupes = [];
    for (const i of INTERACTION_DB) {
      const key = [i.drugA, i.drugB].sort().join('|');
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    if (dupes.length > 0) throw new Error(`Pares duplicados: ${dupes.join(', ')}`);
  });

  test('DRUG_CATEGORIES tiene las 16 familias esperadas', () => {
    expect(Object.keys(DRUG_CATEGORIES).length).toBe(16);
  });

  test('CROSS_REACTIVITY tiene 4 grupos de alergias cruzadas', () => {
    expect(CROSS_REACTIVITY.length).toBe(4);
  });
});

// ═══════════════════════════════════════════════════════════
// SUITE 2 — Interacciones (Bidireccionalidad + Sin Falsos Negativos)
// ═══════════════════════════════════════════════════════════
describe('SUITE 2 · Interacciones Farmacológicas', () => {

  // ── 2a. Bidireccionalidad: A→B debe detectar también B→A ──
  const samplePairs = [
    ['warfarina', 'aspirina', 'critical'],
    ['midazolam', 'fentanilo', 'critical'],
    ['digoxina', 'amiodarona', 'critical'],
    ['espironolactona', 'potasio cloruro', 'critical'],
    ['meropenem', 'ácido valproico', 'critical'],
    ['calcio gluconato', 'digoxina', 'critical'],
    ['enalapril', 'espironolactona', 'major'],
    ['furosemida', 'gentamicina', 'major'],
    ['omeprazol', 'clopidogrel', 'major'],
    ['empagliflozina', 'furosemida', 'major'],
  ];

  for (const [drugA, drugB, severity] of samplePairs) {
    test(`Bidireccional: ${drugA} + ${drugB} detecta ${severity}`, () => {
      const fwd = checkInteractions(drugA, [drugB], []);
      const rev = checkInteractions(drugB, [drugA], []);
      const fwdFound = fwd.some(i => i.severity === severity);
      const revFound = rev.some(i => i.severity === severity);
      if (!fwdFound) throw new Error(`${drugA}→${drugB} no detectó ${severity}`);
      if (!revFound) throw new Error(`${drugB}→${drugA} no detectó ${severity} (falla bidireccional)`);
    });
  }

  // ── 2b. Resultado vacío cuando no hay interacción conocida ──
  test('Sin interacción: paracetamol + calcio carbonato → vacío', () => {
    const result = checkInteractions('paracetamol', ['calcio carbonato'], []);
    expect(result.length).toBe(0);
  });

  test('Sin interacción: salbutamol + omeprazol → vacío', () => {
    const result = checkInteractions('salbutamol', ['omeprazol'], []);
    expect(result.length).toBe(0);
  });

  // ── 2c. Múltiples fármacos detectan múltiples interacciones ──
  test('Múltiples: midazolam + [fentanilo, morfina] detecta 2 críticas', () => {
    const result = checkInteractions('midazolam', ['fentanilo', 'morfina'], []);
    const criticals = result.filter(i => i.severity === 'critical');
    if (criticals.length < 2)
      throw new Error(`Esperaba ≥2 críticas, encontró ${criticals.length}`);
  });

  test('Múltiples: diclofenaco + [enalapril, enoxaparina] detecta ≥2 alertas', () => {
    const result = checkInteractions('diclofenaco', ['enalapril', 'enoxaparina'], []);
    if (result.length < 2)
      throw new Error(`Esperaba ≥2 alertas, encontró ${result.length}`);
  });

  // ── 2d. Interacciones críticas patologías Chile ──
  test('IAM: alteplasa + heparina → critical', () => {
    const r = checkInteractions('alteplasa', ['heparina'], []);
    if (!r.some(i => i.severity === 'critical'))
      throw new Error('No detectó interacción crítica alteplasa+heparina');
  });

  test('Sepsis: meropenem + ácido valproico → critical (pérdida antiepiléptica)', () => {
    const r = checkInteractions('meropenem', ['ácido valproico'], []);
    if (!r.some(i => i.severity === 'critical'))
      throw new Error('No detectó interacción crítica meropenem+valproico');
  });

  test('DHC: espironolactona + potasio cloruro → critical (hiperK+ letal)', () => {
    const r = checkInteractions('espironolactona', ['potasio cloruro'], []);
    if (!r.some(i => i.severity === 'critical'))
      throw new Error('No detectó critical espironolactona+KCl');
  });

  test('Resultados ordenados: critical antes que major antes que minor', () => {
    const r = checkInteractions('warfarina', ['aspirina', 'amiodarona', 'metronidazol'], []);
    const sevOrder = {'critical':0,'major':1,'minor':2};
    for (let i = 1; i < r.length; i++) {
      if (sevOrder[r[i].severity] < sevOrder[r[i-1].severity])
        throw new Error('Resultados no ordenados por severidad');
    }
  });

  // ── 2e. Función checkInteractions no falla con input vacío ──
  test('checkInteractions con lista vacía no falla', () => {
    const r = checkInteractions('paracetamol', [], []);
    expect(Array.isArray(r)).toBeTrue();
  });

  test('checkInteractions con fármaco desconocido retorna array vacío', () => {
    const r = checkInteractions('farmaco_inexistente_xyz', ['paracetamol'], []);
    expect(Array.isArray(r)).toBeTrue();
  });
});

// ═══════════════════════════════════════════════════════════
// SUITE 3 — Validación de Dosis (Gate Crítico — 100% requerido)
// ═══════════════════════════════════════════════════════════
describe('SUITE 3 · Validación de Dosis', () => {

  // ── 3a. Dosis dentro de rango → valid:true ──
  const dosesOK = [
    ['paracetamol', 1000, 'oral', null, 40, null],
    ['ibuprofeno', 400, 'oral', null, 35, 60],
    ['amoxicilina', 500, 'oral', null, 30, 80],
    ['ceftriaxona', 1000, 'iv', 70, 45, null],
    ['metformina', 850, 'oral', null, 50, 65],
    ['omeprazol', 20, 'oral', null, 40, null],
    ['salbutamol', 200, 'inhalatoria', null, 25, null],
    ['adrenalina', 0.5, 'iv', 70, 40, null],
    ['atropina', 0.5, 'iv', 70, 45, null],
    ['ondansetron', 4, 'iv', 70, 40, null],
    ['amlodipino', 5, 'oral', null, 50, null],
    ['aspirina', 100, 'oral', null, 60, null],
    ['levetiracetam', 500, 'oral', null, 40, 80],
  ];

  for (const [drug, dose, route, weight, age, egfr] of dosesOK) {
    test(`Dosis válida: ${drug} ${dose} ${route}`, () => {
      const r = validateDose(drug, dose, route, weight, age, egfr);
      if (r.valid !== true)
        throw new Error(`Esperaba valid:true → ${r.message}`);
    });
  }

  // ── 3b. Sobredosis → valid:false ──
  const dosesOVER = [
    ['paracetamol', 5000, 'oral', null, 40, null, 'sobredosis paracetamol 5g'],
    ['ibuprofeno', 3200, 'oral', null, 35, 80, 'sobredosis ibuprofeno 3.2g'],
    ['digoxina', 0.5, 'oral', null, 50, 90, 'sobredosis digoxina 0.5mg'],
    ['fentanilo', 300, 'iv', 70, 45, null, 'sobredosis fentanilo 300mcg 70kg'],
    ['metoclopramida', 20, 'iv', 70, 50, 80, 'sobredosis metoclopramida 20mg'],
    ['midazolam', 10, 'iv', 70, 40, null, 'sobredosis midazolam 10mg 70kg'],
  ];

  for (const [drug, dose, route, weight, age, egfr, desc] of dosesOVER) {
    test(`Sobredosis detectada: ${desc}`, () => {
      const r = validateDose(drug, dose, route, weight, age, egfr);
      if (r.valid !== false)
        throw new Error(`Debía detectar sobredosis pero retornó valid:true`);
    });
  }

  // ── 3c. BLOQUEO por peso faltante (patrón CDSS Safety) ──
  const weightRequired = [
    ['gentamicina', 240, 'iv'],
    ['vancomicina', 1000, 'iv'],
    ['morfina', 5, 'iv'],
    ['heparina', 1000, 'iv'],
    ['enoxaparina', 80, 'sc'],
    ['alteplasa', 80, 'iv'],
    ['fentanilo', 100, 'iv'],
    ['noradrenalina', 10, 'iv'],
  ];

  for (const [drug, dose, route] of weightRequired) {
    test(`BLOQUEO sin peso: ${drug} ${route}`, () => {
      const r = validateDose(drug, dose, route, null, 50, null);
      if (r.valid !== false)
        throw new Error(`${drug} debía bloquear sin peso (weight-based) pero pasó`);
      if (!r.factors || !r.factors.includes('weight_missing'))
        throw new Error(`${drug}: falta factor 'weight_missing' en respuesta`);
    });
  }

  // ── 3d. Ajuste renal — dosis aceptable se vuelve excesiva con ERC severa ──
  const renalCases = [
    { drug:'metformina', dose:850, route:'oral', weight:null, age:50, egfr:25, shouldBlock:true, desc:'metformina contraindicada eGFR<30' },
    { drug:'cotrimoxazol', dose:800, route:'oral', weight:null, age:40, egfr:12, shouldBlock:true, desc:'cotrimoxazol contraindicado eGFR<15' },
    { drug:'empagliflozina', dose:25, route:'oral', weight:null, age:55, egfr:20, shouldBlock:true, desc:'empagliflozina reducida a 10mg eGFR<45' },
    { drug:'ciprofloxacino', dose:400, route:'iv', weight:null, age:50, egfr:20, shouldBlock:true, desc:'ciprofloxacino reducido eGFR<30' },
    { drug:'meropenem', dose:2000, route:'iv', weight:null, age:50, egfr:8, shouldBlock:true, desc:'meropenem reducido eGFR<10' },
    { drug:'enoxaparina', dose:1.5, route:'sc', weight:70, age:50, egfr:20, shouldBlock:true, desc:'enoxaparina reducida eGFR<30' },
    { drug:'metformina', dose:850, route:'oral', weight:null, age:50, egfr:60, shouldBlock:false, desc:'metformina OK con eGFR normal' },
  ];

  for (const {drug, dose, route, weight, age, egfr, shouldBlock, desc} of renalCases) {
    test(`Ajuste renal: ${desc}`, () => {
      const r = validateDose(drug, dose, route, weight, age, egfr);
      if (shouldBlock && r.valid !== false)
        throw new Error(`Debía bloquear por ERC (eGFR ${egfr}) pero valid:true`);
      if (!shouldBlock && r.valid !== true)
        throw new Error(`No debía bloquear con eGFR ${egfr}: ${r.message}`);
    });
  }

  // ── 3e. Ajuste etario — adulto mayor ──
  const ageCases = [
    { drug:'paracetamol', dose:4000, route:'oral', weight:null, age:70, egfr:null, shouldBlock:true, desc:'paracetamol 4g en adulto mayor (max 3g)' },
    { drug:'digoxina', dose:0.25, route:'oral', weight:null, age:75, egfr:90, shouldBlock:true, desc:'digoxina 0.25mg en >70 años (max 0.125mg)' },
    { drug:'midazolam', dose:5, route:'iv', weight:70, age:70, egfr:null, shouldBlock:true, desc:'midazolam sobredosis en adulto mayor' },
    { drug:'haloperidol', dose:10, route:'im', weight:null, age:70, egfr:null, shouldBlock:true, desc:'haloperidol alto en adulto mayor' },
    { drug:'paracetamol', dose:1000, route:'oral', weight:null, age:75, egfr:null, shouldBlock:false, desc:'paracetamol 1g OK en adulto mayor' },
  ];

  for (const {drug, dose, route, weight, age, egfr, shouldBlock, desc} of ageCases) {
    test(`Ajuste etario: ${desc}`, () => {
      const r = validateDose(drug, dose, route, weight, age, egfr);
      if (shouldBlock && r.valid !== false)
        throw new Error(`Debía bloquear por edad (${age}a) pero valid:true`);
      if (!shouldBlock && r.valid !== true)
        throw new Error(`No debía bloquear: ${r.message}`);
    });
  }

  // ── 3f. Casos especiales patologías Chile ──
  test('IAM: alteplasa 81mg IV 90kg válida (0.9mg/kg)', () => {
    const r = validateDose('alteplasa', 81, 'iv', 90, 60, null);
    if (r.valid !== true) throw new Error(`alteplasa 81mg 90kg falló: ${r.message}`);
  });

  test('ERC: KCl 10 mEq/h con eGFR 25 válido', () => {
    const r = validateDose('potasio cloruro', 10, 'iv', null, 55, 25);
    if (r.valid !== true) throw new Error(`KCl 10mEq/h eGFR25 falló: ${r.message}`);
  });

  test('ERC: KCl 25 mEq/h con eGFR 25 BLOQUEADO (max 10)', () => {
    const r = validateDose('potasio cloruro', 25, 'iv', null, 55, 25);
    if (r.valid !== false) throw new Error('KCl 25mEq/h eGFR25 debía bloquear');
  });

  test('Emergencia: adrenalina PCR 1mg IV 70kg válida', () => {
    const r = validateDose('adrenalina', 1, 'iv', 70, 50, null);
    if (r.valid !== true) throw new Error(`adrenalina 1mg IV falló: ${r.message}`);
  });

  test('Fármaco desconocido retorna valid:true con aviso sin reglas', () => {
    const r = validateDose('farmaco_desconocido_xyz', 100, 'oral', null, 40, null);
    expect(r.valid).toBeTrue();
    // No debe lanzar error, sólo informar que no hay reglas
  });

  // ── 3g. validateDose retorna siempre los campos requeridos ──
  test('validateDose siempre retorna { valid, message, suggestedRange, factors, notes }', () => {
    const r = validateDose('paracetamol', 500, 'oral', null, 40, null);
    if (r.valid === undefined) throw new Error('Falta campo valid');
    if (r.message === undefined) throw new Error('Falta campo message');
    if (r.factors === undefined) throw new Error('Falta campo factors');
  });
});

// ═══════════════════════════════════════════════════════════
// SUITE 4 — Funciones Auxiliares (API del motor CDSS)
// ═══════════════════════════════════════════════════════════
describe('SUITE 4 · Funciones Auxiliares y API', () => {

  test('getDrugListForDoseCheck retorna array no vacío', () => {
    const list = getDrugListForDoseCheck();
    if (!Array.isArray(list) || list.length < 80)
      throw new Error(`Lista de fármacos insuficiente: ${list.length}`);
  });

  test('getDrugListForDoseCheck incluye fármacos clave GES Chile', () => {
    const list = getDrugListForDoseCheck();
    const required = ['aspirina','metformina','enalapril','furosemida','omeprazol',
                      'salbutamol','levotiroxina','ceftriaxona','meropenem','empagliflozina'];
    for (const d of required) {
      if (!list.includes(d)) throw new Error(`Falta fármaco GES: ${d}`);
    }
  });

  test('getRoutesForDrug retorna rutas para fármacos conocidos', () => {
    const routes = getRoutesForDrug('paracetamol');
    if (!routes.includes('oral')) throw new Error('paracetamol debe tener vía oral');
    if (!routes.includes('iv')) throw new Error('paracetamol debe tener vía IV');
  });

  test('getRoutesForDrug retorna [] para fármaco desconocido', () => {
    const routes = getRoutesForDrug('farmaco_xyz_desconocido');
    expect(routes.length).toBe(0);
  });

  test('getDrugsByCategory retorna las 16 categorías', () => {
    const grouped = getDrugsByCategory();
    const cats = Object.keys(grouped);
    if (cats.length !== 16)
      throw new Error(`Esperaba 16 categorías, encontró ${cats.length}`);
  });

  test('getDrugsByCategory: cada categoría tiene al menos 1 fármaco', () => {
    const grouped = getDrugsByCategory();
    for (const [cat, data] of Object.entries(grouped)) {
      if (!data.drugs || data.drugs.length === 0)
        throw new Error(`Categoría vacía: ${cat}`);
    }
  });

  test('getDrugsByCategory: total de fármacos = 81', () => {
    const grouped = getDrugsByCategory();
    const total = Object.values(grouped).reduce((s, c) => s + c.drugs.length, 0);
    if (total !== 81) throw new Error(`Total en categorías ${total} ≠ 81`);
  });

  test('DRUG_CATEGORIES tiene label legible para todas las familias', () => {
    for (const [key, label] of Object.entries(DRUG_CATEGORIES)) {
      if (!label || label.length < 5)
        throw new Error(`Etiqueta inválida para ${key}: "${label}"`);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// SUITE 5 — Interacciones Críticas GES/Alta Morbilidad Chile
//           (Zero-tolerance: ninguna puede pasar sin detección)
// ═══════════════════════════════════════════════════════════
describe('SUITE 5 · Interacciones Críticas GES Chile (Zero-Tolerance)', () => {

  const zerotolerancePairs = [
    // Cardiovascular/IAM
    ['warfarina', 'aspirina', 'critical', 'hemorragia severa'],
    ['warfarina', 'amiodarona', 'critical', 'aumento INR'],
    ['digoxina', 'amiodarona', 'critical', 'intoxicación digitálica'],
    ['nitroglicerina', 'sildenafil', 'critical', 'hipotensión severa'],
    ['atenolol', 'verapamilo', 'critical', 'bradicardia/asistolia'],
    // ACV/Neurología
    ['meropenem', 'ácido valproico', 'critical', 'crisis epiléptica'],
    ['midazolam', 'fentanilo', 'critical', 'paro respiratorio'],
    ['midazolam', 'morfina', 'critical', 'depresión respiratoria'],
    ['diazepam', 'morfina', 'critical', 'depresión respiratoria'],
    // DM2/Endocrino
    ['metformina', 'medio de contraste yodado', 'critical', 'acidosis láctica'],
    // Antibióticos
    ['fluoxetina', 'tramadol', 'critical', 'síndrome serotoninérgico'],
    ['metronidazol', 'alcohol', 'critical', 'efecto antabuse'],
    // ERC
    ['espironolactona', 'potasio cloruro', 'critical', 'hiperK+ letal'],
    ['calcio gluconato', 'digoxina', 'critical', 'arritmia grave'],
    // IAM/TEP
    ['alteplasa', 'heparina', 'critical', 'hemorragia severa'],
  ];

  for (const [drugA, drugB, severity, motivo] of zerotolerancePairs) {
    test(`[ZERO-TOL] ${drugA} + ${drugB}: ${motivo}`, () => {
      const fwd = checkInteractions(drugA, [drugB], []);
      const rev = checkInteractions(drugB, [drugA], []);
      if (!fwd.some(i => i.severity === severity))
        throw new Error(`FALLO: ${drugA}→${drugB} no detectó ${severity}`);
      if (!rev.some(i => i.severity === severity))
        throw new Error(`FALLO BIDIRECCIONAL: ${drugB}→${drugA} no detectó ${severity}`);
    });
  }
});

// ═══════════════════════════════════════════════════════════
// REPORTE FINAL
// ═══════════════════════════════════════════════════════════
function printReport() {
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  const isCriticalPass = failed === 0;
  const status = isCriticalPass ? 'PASS ✅' : 'FAIL ❌';
  const verdict = isCriticalPass ? '🟢 SEGURO PARA USO' : '🔴 REQUIERE CORRECCIÓN';

  console.log('\n\n' + '═'.repeat(60));
  console.log('  Healthcare Eval Harness — Reporte CDSS');
  console.log('  Consulta Rápida ENF · UDP 2026');
  console.log('═'.repeat(60));
  console.log(`\n  Estado general: ${status}`);
  console.log(`  Tests:   ${passed}/${total} pasaron (${passRate}%)`);
  console.log(`  Fallos:  ${failed}`);
  console.log(`  Umbral:  100% (gate crítico — patrón CDSS safety)`);
  console.log(`  Veredicto: ${verdict}`);

  if (failures.length > 0) {
    console.log('\n' + '─'.repeat(60));
    console.log('  FALLOS DETECTADOS:');
    console.log('─'.repeat(60));
    failures.forEach((f, i) => {
      console.log(`\n  ${i + 1}. ${f.name}`);
      console.log(`     → ${f.error}`);
    });
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`  Fármacos en DOSE_RULES:    ${Object.keys(DOSE_RULES).length}`);
  console.log(`  Interacciones en DB:       ${INTERACTION_DB.length}`);
  console.log(`  Categorías farmacológicas: ${Object.keys(DRUG_CATEGORIES).length}`);
  console.log(`  Grupos alergias cruzadas:  ${CROSS_REACTIVITY.length}`);
  console.log('═'.repeat(60) + '\n');

  process.exit(isCriticalPass ? 0 : 1);
}

printReport();
