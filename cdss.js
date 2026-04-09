// ============================================================
// cdss.js — Motor CDSS (Clinical Decision Support System)
// Consulta Rápida ENF — UDP
// Funciones puras, sin efectos secundarios, 100% testeable
// Basado en patrones healthcare-cdss-patterns
// ============================================================

// ─── INTERACCIONES FARMACOLÓGICAS ───────────────────────────
// Pares bidireccionales: si A interactúa con B, B interactúa con A
const INTERACTION_DB = [
  // ── ANTICOAGULANTES ──
  {drugA:'warfarina', drugB:'aspirina', severity:'critical',
   mechanism:'Inhibición plaquetaria + anticoagulación',
   clinicalEffect:'Riesgo hemorrágico severo (hemorragia GI, intracraneal)',
   recommendation:'Evitar combinación. Si es indispensable, monitorizar INR estricto y signos de sangrado'},
  {drugA:'warfarina', drugB:'ibuprofeno', severity:'critical',
   mechanism:'AINEs inhiben COX-1 plaquetaria + irritación gástrica',
   clinicalEffect:'Riesgo de hemorragia digestiva alta',
   recommendation:'Contraindicado. Usar paracetamol como alternativa analgésica'},
  {drugA:'warfarina', drugB:'amiodarona', severity:'critical',
   mechanism:'Amiodarona inhibe CYP2C9 y CYP3A4',
   clinicalEffect:'Aumento INR → riesgo hemorrágico',
   recommendation:'Reducir dosis de warfarina 30-50%. Control INR semanal'},
  {drugA:'warfarina', drugB:'metronidazol', severity:'major',
   mechanism:'Inhibición CYP2C9',
   clinicalEffect:'Aumento del efecto anticoagulante',
   recommendation:'Monitorizar INR, considerar ajuste de dosis'},
  {drugA:'heparina', drugB:'aspirina', severity:'major',
   mechanism:'Efecto anticoagulante + antiplaquetario aditivo',
   clinicalEffect:'Aumento significativo del riesgo de sangrado',
   recommendation:'Monitorizar TTPA y signos de sangrado activo'},

  // ── ANTIHIPERTENSIVOS ──
  {drugA:'enalapril', drugB:'espironolactona', severity:'major',
   mechanism:'Ambos retienen potasio',
   clinicalEffect:'Hiperkalemia severa → arritmias cardíacas',
   recommendation:'Monitorizar K+ sérico frecuentemente. Evitar si K+ >5.0'},
  {drugA:'enalapril', drugB:'potasio', severity:'major',
   mechanism:'IECA retiene K+ + suplemento exógeno',
   clinicalEffect:'Hiperkalemia → arritmias potencialmente letales',
   recommendation:'No suplementar K+ sin control sérico. Monitorizar ECG'},
  {drugA:'atenolol', drugB:'verapamilo', severity:'critical',
   mechanism:'Doble bloqueo del nodo AV',
   clinicalEffect:'Bradicardia severa, bloqueo AV, asistolia',
   recommendation:'Combinación contraindicada. No administrar juntos'},
  {drugA:'losartan', drugB:'espironolactona', severity:'major',
   mechanism:'ARA-II + ahorrrador de K+',
   clinicalEffect:'Hiperkalemia',
   recommendation:'Control estricto de K+ sérico y función renal'},
  {drugA:'furosemida', drugB:'gentamicina', severity:'major',
   mechanism:'Ambos son ototóxicos y nefrotóxicos',
   clinicalEffect:'Ototoxicidad y nefrotoxicidad aditiva',
   recommendation:'Monitorizar función renal y audiometría. Evitar si es posible'},

  // ── DIABETES ──
  {drugA:'metformina', drugB:'medio de contraste yodado', severity:'critical',
   mechanism:'Contraste puede causar IRA → acumulación metformina',
   clinicalEffect:'Acidosis láctica potencialmente mortal',
   recommendation:'Suspender metformina 48h antes y después del contraste. Verificar creatinina'},
  {drugA:'insulina', drugB:'propranolol', severity:'major',
   mechanism:'Betabloqueantes enmascaran síntomas de hipoglicemia',
   clinicalEffect:'Hipoglicemia inadvertida (oculta taquicardia y temblor)',
   recommendation:'Preferir betabloqueantes cardioselectivos. Educar sobre síntomas neuroglucopénicos'},
  {drugA:'glibenclamida', drugB:'fluconazol', severity:'major',
   mechanism:'Fluconazol inhibe CYP2C9',
   clinicalEffect:'Hipoglicemia severa por aumento de niveles de sulfonilurea',
   recommendation:'Monitorizar glicemia. Considerar reducir dosis de glibenclamida'},

  // ── PSIQUIÁTRICOS ──
  {drugA:'fluoxetina', drugB:'tramadol', severity:'critical',
   mechanism:'Ambos aumentan serotonina (ISRS + opioide serotoninérgico)',
   clinicalEffect:'Síndrome serotoninérgico (hipertermia, rigidez, clonus, delirium)',
   recommendation:'Combinación contraindicada. Usar analgésico alternativo'},
  {drugA:'litio', drugB:'ibuprofeno', severity:'major',
   mechanism:'AINEs reducen excreción renal de litio',
   clinicalEffect:'Toxicidad por litio (temblor grueso, ataxia, convulsiones)',
   recommendation:'Evitar AINEs. Si es necesario, monitorizar litemia cada 48-72h'},
  {drugA:'haloperidol', drugB:'metoclopramida', severity:'major',
   mechanism:'Ambos bloquean receptores D2',
   clinicalEffect:'Efectos extrapiramidales severos, síndrome neuroléptico maligno',
   recommendation:'No combinar. Usar ondansetrón como antiemético alternativo'},
  {drugA:'diazepam', drugB:'morfina', severity:'critical',
   mechanism:'Depresión del SNC aditiva',
   clinicalEffect:'Depresión respiratoria severa, paro respiratorio',
   recommendation:'Si se combinan, reducir dosis y monitorizar FR y SatO2 continuamente'},

  // ── ANTIBIÓTICOS ──
  {drugA:'amoxicilina', drugB:'metotrexato', severity:'major',
   mechanism:'Amoxicilina reduce excreción renal de metotrexato',
   clinicalEffect:'Toxicidad por metotrexato (mielosupresión, mucositis)',
   recommendation:'Monitorizar hemograma y función renal'},
  {drugA:'ciprofloxacino', drugB:'teofilina', severity:'major',
   mechanism:'Ciprofloxacino inhibe CYP1A2',
   clinicalEffect:'Toxicidad por teofilina (convulsiones, arritmias)',
   recommendation:'Reducir dosis de teofilina 30-50%. Monitorizar niveles séricos'},
  {drugA:'vancomicina', drugB:'gentamicina', severity:'major',
   mechanism:'Nefrotoxicidad aditiva',
   clinicalEffect:'Insuficiencia renal aguda',
   recommendation:'Monitorizar niveles séricos de ambos y creatinina diaria'},

  // ── CARDIOVASCULAR ──
  {drugA:'digoxina', drugB:'amiodarona', severity:'critical',
   mechanism:'Amiodarona aumenta niveles de digoxina 70-100%',
   clinicalEffect:'Intoxicación digitálica (arritmias, náuseas, visión amarilla)',
   recommendation:'Reducir digoxina al 50% al iniciar amiodarona. Monitorizar digoxinemia'},
  {drugA:'digoxina', drugB:'furosemida', severity:'major',
   mechanism:'Furosemida causa hipokalemia',
   clinicalEffect:'Hipokalemia potencia toxicidad digitálica → arritmias',
   recommendation:'Monitorizar K+ sérico. Suplementar K+ si <3.5 mEq/L'},
  {drugA:'nitroglicerina', drugB:'sildenafil', severity:'critical',
   mechanism:'Vasodilatación aditiva por óxido nítrico',
   clinicalEffect:'Hipotensión severa refractaria, shock',
   recommendation:'Combinación absolutamente contraindicada. Esperar 24-48h entre fármacos'},

  // ── OPIOIDES ──
  {drugA:'morfina', drugB:'naloxona', severity:'minor',
   mechanism:'Naloxona es antagonista opioide',
   clinicalEffect:'Reversión del efecto analgésico y depresor respiratorio',
   recommendation:'Uso terapéutico como antídoto. Titular dosis para evitar abstinencia aguda'},

  // ── GASTROINTESTINAL ──
  {drugA:'omeprazol', drugB:'clopidogrel', severity:'major',
   mechanism:'Omeprazol inhibe CYP2C19 necesario para activar clopidogrel',
   clinicalEffect:'Reducción del efecto antiplaquetario → riesgo trombótico',
   recommendation:'Preferir pantoprazol como IBP alternativo'},

  // ── INTERACCIONES ADICIONALES (fármacos ampliados) ──
  {drugA:'clopidogrel', drugB:'aspirina', severity:'major',
   mechanism:'Doble antiagregación plaquetaria',
   clinicalEffect:'Riesgo hemorrágico aumentado (especialmente GI)',
   recommendation:'Uso justificado en SCA/stent. Agregar IBP gastroprotector (no omeprazol)'},
  {drugA:'amiodarona', drugB:'atorvastatina', severity:'major',
   mechanism:'Amiodarona inhibe CYP3A4 → acumulación de estatina',
   clinicalEffect:'Rabdomiólisis (dolor muscular, CK elevada, mioglobinuria)',
   recommendation:'Limitar atorvastatina a máx 20 mg/día con amiodarona'},
  {drugA:'ciprofloxacino', drugB:'warfarina', severity:'major',
   mechanism:'Ciprofloxacino inhibe CYP1A2 y altera flora intestinal',
   clinicalEffect:'Aumento del INR → riesgo hemorrágico',
   recommendation:'Monitorizar INR al iniciar/suspender ciprofloxacino'},
  {drugA:'ciprofloxacino', drugB:'metoclopramida', severity:'minor',
   mechanism:'Metoclopramida acelera absorción GI',
   clinicalEffect:'Aumento de niveles plasmáticos de ciprofloxacino',
   recommendation:'Generalmente no significativo. Vigilar RAM de ciprofloxacino'},
  {drugA:'midazolam', drugB:'fentanilo', severity:'critical',
   mechanism:'Depresión del SNC aditiva (BZD + opioide)',
   clinicalEffect:'Depresión respiratoria severa, apnea, paro',
   recommendation:'Si se combinan: reducir ambas dosis 50%. Monitorización continua FR y SatO2'},
  {drugA:'midazolam', drugB:'morfina', severity:'critical',
   mechanism:'Depresión del SNC aditiva (BZD + opioide)',
   clinicalEffect:'Depresión respiratoria severa',
   recommendation:'Reducir dosis de ambos. Monitorizar FR, SatO2 y nivel de conciencia'},
  {drugA:'tramadol', drugB:'ondansetron', severity:'minor',
   mechanism:'Ondansetrón antagoniza 5-HT3, puede reducir analgesia de tramadol',
   clinicalEffect:'Disminución parcial del efecto analgésico del tramadol',
   recommendation:'Considerar analgésico alternativo si dolor no controlado'},
  {drugA:'ketorolaco', drugB:'enoxaparina', severity:'major',
   mechanism:'AINE + anticoagulante: efecto aditivo sobre hemostasia',
   clinicalEffect:'Riesgo hemorrágico significativo',
   recommendation:'Evitar combinación. Si es indispensable, máx 48h y vigilar sangrado'},
  {drugA:'diclofenaco', drugB:'enoxaparina', severity:'major',
   mechanism:'AINE + HBPM: doble inhibición hemostasia (COX-1 plaquetaria + anticoagulación)',
   clinicalEffect:'Riesgo hemorrágico significativo: hemorragia digestiva, hematoma',
   recommendation:'Evitar combinación. Si es necesario, máx 48h, monitorizar signos de sangrado y Hb'},
  {drugA:'diclofenaco', drugB:'enalapril', severity:'major',
   mechanism:'AINEs antagonizan efecto antihipertensivo y reducen flujo renal',
   clinicalEffect:'Hipertensión refractaria e insuficiencia renal aguda',
   recommendation:'Evitar AINEs en pacientes con IECA. Usar paracetamol como alternativa'},
  {drugA:'diclofenaco', drugB:'losartan', severity:'major',
   mechanism:'AINEs antagonizan efecto antihipertensivo de ARA-II y reducen flujo renal',
   clinicalEffect:'Hipertensión refractaria e IRA, especialmente en adulto mayor',
   recommendation:'Evitar AINEs con ARA-II. Preferir paracetamol'},
  {drugA:'potasio cloruro', drugB:'enalapril', severity:'major',
   mechanism:'IECA retiene K+ + suplemento exógeno',
   clinicalEffect:'Hiperkalemia → arritmias potencialmente letales',
   recommendation:'No suplementar K+ sin control sérico. Monitorizar ECG'},
  {drugA:'potasio cloruro', drugB:'losartan', severity:'major',
   mechanism:'ARA-II retiene K+ + suplemento exógeno',
   clinicalEffect:'Hiperkalemia severa',
   recommendation:'Control K+ sérico antes y después de suplementar'},
  {drugA:'dexametasona', drugB:'insulina', severity:'major',
   mechanism:'Corticoides causan hiperglicemia por resistencia insulínica',
   clinicalEffect:'Descompensación glicémica, hiperglicemia severa',
   recommendation:'Aumentar dosis de insulina 20-40%. Monitorizar HGT c/4-6h'},
  {drugA:'prednisona', drugB:'insulina', severity:'major',
   mechanism:'Corticoides inducen resistencia insulínica',
   clinicalEffect:'Hiperglicemia sostenida',
   recommendation:'Ajustar insulina según HGT. Esquema de corrección más agresivo'},
  {drugA:'furosemida', drugB:'hidrocortisona', severity:'major',
   mechanism:'Ambos causan pérdida de potasio',
   clinicalEffect:'Hipokalemia severa → arritmias',
   recommendation:'Monitorizar K+ sérico. Suplementar si <3.5 mEq/L'},
  {drugA:'adrenalina', drugB:'atenolol', severity:'major',
   mechanism:'Betabloqueantes no selectivos antagonizan efecto β2 de adrenalina',
   clinicalEffect:'HTA paradójica por efecto α sin oposición, bradicardia refleja',
   recommendation:'En anafilaxia con betabloqueante: considerar glucagón IV como alternativa'},
  {drugA:'metronidazol', drugB:'alcohol', severity:'critical',
   mechanism:'Inhibición de aldehído deshidrogenasa (efecto antabuse)',
   clinicalEffect:'Náuseas severas, vómitos, enrojecimiento, taquicardia, hipotensión',
   recommendation:'Prohibir alcohol durante tratamiento y 48h después de terminar'},
  {drugA:'clindamicina', drugB:'gentamicina', severity:'minor',
   mechanism:'Potenciación del bloqueo neuromuscular',
   clinicalEffect:'Debilidad muscular, potenciación de relajantes neuromusculares',
   recommendation:'Vigilar en postoperatorio. Combinación común y generalmente segura en infecciones mixtas'},

  // ── INTERACCIONES PATOLOGÍAS CHILE (IAM, ACV, ERC, DHC, EPOC, DM2) ──
  // IAM / Cardiovascular
  {drugA:'alteplasa', drugB:'heparina', severity:'critical',
   mechanism:'Trombolítico + anticoagulante: efecto aditivo sobre hemostasia',
   clinicalEffect:'Hemorragia severa (intracraneal, GI, sitio punción)',
   recommendation:'Secuencia protocolizada: alteplasa primero, heparina después según protocolo. Monitorizar signos sangrado'},
  {drugA:'alteplasa', drugB:'aspirina', severity:'major',
   mechanism:'Fibrinolítico + antiagregante plaquetario',
   clinicalEffect:'Riesgo hemorrágico aumentado',
   recommendation:'Aspirina post-trombolisis según protocolo ACV/IAM. No administrar simultáneamente'},
  {drugA:'carvedilol', drugB:'digoxina', severity:'major',
   mechanism:'Carvedilol aumenta niveles de digoxina y efecto bradicardizante aditivo',
   clinicalEffect:'Bradicardia severa, bloqueo AV',
   recommendation:'Monitorizar FC y digoxinemia. Reducir digoxina si FC <60'},
  {drugA:'carvedilol', drugB:'insulina', severity:'major',
   mechanism:'Betabloqueante enmascara síntomas hipoglicemia',
   clinicalEffect:'Hipoglicemia inadvertida (oculta taquicardia)',
   recommendation:'Educar sobre síntomas neuroglucopénicos. Automonitoreo frecuente'},
  {drugA:'espironolactona', drugB:'potasio cloruro', severity:'critical',
   mechanism:'Ahorrador de K+ + suplemento K+',
   clinicalEffect:'Hiperkalemia letal → arritmia, paro cardíaco',
   recommendation:'Combinación contraindicada. No suplementar K+ con espironolactona'},
  {drugA:'dobutamina', drugB:'atenolol', severity:'major',
   mechanism:'Betabloqueante antagoniza efecto inotrópico β1 de dobutamina',
   clinicalEffect:'Reducción del gasto cardíaco, pérdida efecto terapéutico',
   recommendation:'Evitar betabloqueantes durante infusión de dobutamina'},
  {drugA:'noradrenalina', drugB:'haloperidol', severity:'major',
   mechanism:'Haloperidol tiene efecto α-bloqueante',
   clinicalEffect:'Antagonismo parcial del efecto vasopresor',
   recommendation:'Puede requerir dosis mayores de noradrenalina. Monitorizar PAM'},
  // ACV
  {drugA:'nimodipino', drugB:'fenitoína', severity:'major',
   mechanism:'Fenitoína induce CYP3A4 → reduce niveles de nimodipino',
   clinicalEffect:'Pérdida del efecto neuroprotector en HSA',
   recommendation:'Considerar levetiracetam como antiepiléptico alternativo en HSA'},
  {drugA:'fenitoína', drugB:'ácido valproico', severity:'major',
   mechanism:'Desplazamiento de unión a proteínas + inhibición metabólica mutua',
   clinicalEffect:'Niveles impredecibles de ambos fármacos, toxicidad',
   recommendation:'Monitorizar niveles séricos de ambos. Preferir no combinar'},
  // ERC
  {drugA:'eritropoyetina', drugB:'enalapril', severity:'minor',
   mechanism:'IECA pueden reducir respuesta a eritropoyetina',
   clinicalEffect:'Resistencia a EPO, menor respuesta hematológica',
   recommendation:'Puede requerir dosis mayores de EPO. No suspender IECA'},
  {drugA:'calcio gluconato', drugB:'digoxina', severity:'critical',
   mechanism:'Hipercalcemia potencia toxicidad digitálica',
   clinicalEffect:'Arritmias graves, fibrilación ventricular',
   recommendation:'Administrar calcio con precaución extrema en pacientes digitalizados. Monitorizar ECG'},
  {drugA:'bicarbonato de sodio', drugB:'calcio gluconato', severity:'minor',
   mechanism:'Precipitación en la misma vía IV',
   clinicalEffect:'Obstrucción de vía, pérdida de eficacia',
   recommendation:'NO mezclar en misma vía. Lavar línea entre administraciones'},
  // DHC
  {drugA:'lactulosa', drugB:'rifaximina', severity:'minor',
   mechanism:'Sinergia terapéutica en encefalopatía hepática',
   clinicalEffect:'Efecto aditivo beneficioso en reducción de amonio',
   recommendation:'Combinación recomendada en profilaxis secundaria encefalopatía hepática (GES)'},
  {drugA:'espironolactona', drugB:'furosemida', severity:'minor',
   mechanism:'Efecto complementario: ahorrador + perdedor de K+',
   clinicalEffect:'Balance de potasio más fisiológico',
   recommendation:'Combinación estándar en ascitis DHC (100:40). Monitorizar Na+ y K+'},
  // EPOC
  {drugA:'aminofilina', drugB:'ciprofloxacino', severity:'major',
   mechanism:'Ciprofloxacino inhibe CYP1A2 → acumulación de teofilina',
   clinicalEffect:'Toxicidad por teofilina (convulsiones, arritmias, náuseas)',
   recommendation:'Reducir aminofilina 30-50%. Monitorizar teofilinemia'},
  {drugA:'aminofilina', drugB:'fluconazol', severity:'major',
   mechanism:'Fluconazol inhibe metabolismo de teofilina',
   clinicalEffect:'Aumento niveles teofilina → toxicidad',
   recommendation:'Monitorizar teofilinemia. Ajustar dosis'},
  // DM2
  {drugA:'empagliflozina', drugB:'furosemida', severity:'major',
   mechanism:'Doble efecto diurético y natriurético',
   clinicalEffect:'Deshidratación, hipotensión, IRA',
   recommendation:'Vigilar volemia y PA. Puede requerir reducir furosemida al iniciar iSGLT2'},
  {drugA:'empagliflozina', drugB:'insulina', severity:'major',
   mechanism:'Doble efecto hipoglicemiante + riesgo cetoacidosis euglicémica',
   clinicalEffect:'Hipoglicemia y/o cetoacidosis con glicemia normal',
   recommendation:'Reducir insulina 10-20% al iniciar. Educar signos cetoacidosis'},
  // Sepsis
  {drugA:'meropenem', drugB:'ácido valproico', severity:'critical',
   mechanism:'Carbapenems reducen niveles de ácido valproico hasta 60-90%',
   clinicalEffect:'Pérdida del control antiepiléptico → convulsiones',
   recommendation:'Combinación contraindicada. Usar antiepiléptico alternativo (levetiracetam)'},
  // Anticonvulsivantes
  {drugA:'fenitoína', drugB:'dexametasona', severity:'major',
   mechanism:'Fenitoína induce CYP3A4 → metabolismo acelerado de corticoide',
   clinicalEffect:'Reducción del efecto antiinflamatorio/antiedema',
   recommendation:'Puede requerir duplicar dosis de dexametasona. Considerar levetiracetam'},
  {drugA:'diazepam', drugB:'fenitoína', severity:'minor',
   mechanism:'Competencia por unión a proteínas',
   clinicalEffect:'Aumento transitorio de fenitoína libre',
   recommendation:'Monitorizar niveles. Ambos se usan en status epiléptico (secuencial)'},
  {drugA:'haloperidol', drugB:'fenitoína', severity:'major',
   mechanism:'Fenitoína induce metabolismo de haloperidol',
   clinicalEffect:'Reducción del efecto antipsicótico',
   recommendation:'Puede requerir ajuste de dosis de haloperidol'},
  {drugA:'diclofenaco', drugB:'warfarina', severity:'critical',
   mechanism:'AINEs inhiben COX-1 plaquetaria + irritación gástrica + desplazamiento de proteínas',
   clinicalEffect:'Riesgo muy alto de hemorragia digestiva y sistémica',
   recommendation:'Combinación contraindicada. Usar paracetamol como analgésico. Si inevitables, IBP + control INR estricto'},
  {drugA:'amiodarona', drugB:'levotiroxina', severity:'major',
   mechanism:'Amiodarona contiene 37% de yodo y bloquea conversión T4→T3 (inhibe deiodinasa)',
   clinicalEffect:'Hipo o hipertiroidismo inducido por fármaco. Altera niveles tiroideos significativamente',
   recommendation:'Monitorizar TSH, T3 y T4 libre cada 6 meses. Requiere ajuste de dosis de levotiroxina'},
  {drugA:'levotiroxina', drugB:'calcio carbonato', severity:'minor',
   mechanism:'Calcio forma quelatos con levotiroxina en tracto GI',
   clinicalEffect:'Reducción de absorción de levotiroxina hasta 25-40%',
   recommendation:'Separar administración al menos 4 horas. Tomar levotiroxina en ayunas'},
  {drugA:'metilprednisolona', drugB:'insulina', severity:'major',
   mechanism:'Pulsos de corticoides causan hiperglicemia severa',
   clinicalEffect:'Descompensación glicémica aguda',
   recommendation:'Esquema de insulina intensificado durante pulsos. HGT c/4h'},
];

// ─── ALERGIAS CRUZADAS ─────────────────────────────────────
const CROSS_REACTIVITY = [
  {group:'penicilinas', members:['amoxicilina','ampicilina','penicilina','piperacilina','cloxacilina'],
   crossWith:['cefalosporinas de 1° generación'], risk:'5-10%'},
  {group:'cefalosporinas', members:['cefazolina','cefadroxilo','cefalexina','ceftriaxona','cefotaxima','ceftazidima'],
   crossWith:['penicilinas'], risk:'1-2%'},
  {group:'sulfonamidas', members:['sulfametoxazol','trimetoprim-sulfametoxazol','cotrimoxazol'],
   crossWith:['furosemida','tiazidas','sulfonilureas'], risk:'Bajo pero documentado'},
  {group:'AINEs', members:['aspirina','ibuprofeno','naproxeno','diclofenaco','ketorolaco','piroxicam'],
   crossWith:['otros AINEs'], risk:'Variable, mayor con misma clase'},
];

// ─── REGLAS DE DOSIS ────────────────────────────────────────
// Cada fármaco tiene una propiedad _category para agrupar por familia en la UI

const DRUG_CATEGORIES = {
  'analgesicos_antiinflamatorios': '💊 Analgésicos / Antiinflamatorios',
  'antibioticos': '🦠 Antibióticos',
  'anticoagulantes_antiplaquetarios': '🩸 Anticoagulantes / Antiplaquetarios',
  'cardiovascular_antihipertensivos': '❤️ Cardiovascular / Antihipertensivos',
  'cardiovascular_antiarritmicos': '⚡ Cardiovascular / Antiarrítmicos',
  'cardiovascular_otros': '🫀 Cardiovascular / Otros',
  'corticoides': '💉 Corticoides / Antiinflamatorios Sistémicos',
  'diabetes_endocrino': '🔬 Diabetes / Endocrino',
  'diureticos': '💧 Diuréticos',
  'gastrointestinal': '🟢 Gastrointestinal',
  'neurologico_psiquiatrico': '🧠 Neurológico / Psiquiátrico',
  'opioides_sedacion': '😴 Opioides / Sedación / Anestesia',
  'respiratorio': '🌬️ Respiratorio / Broncodilatadores',
  'electrolitos_fluidos': '⚗️ Electrolitos / Fluidos',
  'antidotos_emergencia': '🚨 Antídotos / Emergencia',
  'anticonvulsivantes': '⚡ Anticonvulsivantes'
};

const DOSE_RULES = {

  // ══════════════════════════════════════════════════════════════
  // 💊 ANALGÉSICOS / ANTIINFLAMATORIOS
  // ══════════════════════════════════════════════════════════════
  'paracetamol': {
    _category: 'analgesicos_antiinflamatorios',
    oral: {weightBased:false, absoluteMax:4000, typicalMin:500, typicalMax:1000, unit:'mg',
           maxPerDay:4000, frequency:'cada 6-8h',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 65 ? 3000 : 4000,
           notes:'Hepatotoxicidad con >4g/día. En adulto mayor máx 3g/día'},
    iv: {weightBased:true, minPerKg:10, maxPerKg:15, absoluteMax:1000, typicalMin:500, typicalMax:1000, unit:'mg',
         renalAdjusted:false, ageAdjusted:false, notes:'Infundir en 15 min'}
  },
  'ibuprofeno': {
    _category: 'analgesicos_antiinflamatorios',
    oral: {weightBased:false, absoluteMax:2400, typicalMin:200, typicalMax:800, unit:'mg',
           maxPerDay:2400, frequency:'cada 6-8h',
           renalAdjusted:true, ageAdjusted:true,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0 : egfr < 60 ? 1200 : 2400,
           getAgeAdjustedMax: (age) => age >= 65 ? 1200 : 2400,
           notes:'Evitar en ERC con eGFR <30. Riesgo GI en adulto mayor'}
  },
  'amoxicilina': {
    _category: 'antibioticos',
    oral: {weightBased:false, absoluteMax:3000, typicalMin:500, typicalMax:1000, unit:'mg',
           maxPerDay:3000, frequency:'cada 8h',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 10 ? 500 : egfr < 30 ? 500 : 1000,
           notes:'Ajustar intervalo en IRC: cada 12-24h si eGFR <30'}
  },
  'gentamicina': {
    _category: 'antibioticos',
    iv: {weightBased:true, minPerKg:3, maxPerKg:7, absoluteMax:500, typicalMin:80, typicalMax:360, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 3 : egfr < 60 ? 5 : 7,
         notes:'Nefrotóxico y ototóxico. Monitorizar niveles séricos'}
  },
  'vancomicina': {
    _category: 'antibioticos',
    iv: {weightBased:true, minPerKg:15, maxPerKg:20, absoluteMax:2000, typicalMin:500, typicalMax:2000, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 10 : egfr < 60 ? 15 : 20,
         notes:'Infundir lento (1g/h) para evitar síndrome del hombre rojo. Monitorizar vancocinemia'}
  },
  'morfina': {
    _category: 'opioides_sedacion',
    iv: {weightBased:true, minPerKg:0.05, maxPerKg:0.15, absoluteMax:15, typicalMin:2, typicalMax:10, unit:'mg',
         renalAdjusted:true, ageAdjusted:true,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 0.05 : 0.15,
         getAgeAdjustedMax: (age) => age >= 65 ? 0.1 : 0.15,
         notes:'Depresión respiratoria. Tener naloxona disponible. Titular en adulto mayor'}
  },
  'furosemida': {
    _category: 'diureticos',
    iv: {weightBased:false, absoluteMax:200, typicalMin:20, typicalMax:80, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Infundir máx 4mg/min para evitar ototoxicidad. Monitorizar K+'},
    oral: {weightBased:false, absoluteMax:600, typicalMin:20, typicalMax:80, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Dosis altas en ICC refractaria bajo monitorización'}
  },
  'enalapril': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:40, typicalMin:2.5, typicalMax:20, unit:'mg',
           renalAdjusted:true, ageAdjusted:true,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 5 : 40,
           getAgeAdjustedMax: (age) => age >= 65 ? 20 : 40,
           notes:'Iniciar con dosis baja. Monitorizar K+ y creatinina'}
  },
  'metformina': {
    _category: 'diabetes_endocrino',
    oral: {weightBased:false, absoluteMax:2550, typicalMin:500, typicalMax:850, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0 : egfr < 45 ? 1000 : 2550,
           notes:'Contraindicada si eGFR <30. Suspender con medio de contraste yodado'}
  },
  'insulina NPH': {
    _category: 'diabetes_endocrino',
    sc: {weightBased:true, minPerKg:0.2, maxPerKg:1.0, absoluteMax:100, typicalMin:10, typicalMax:60, unit:'UI',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 0.5 : 1.0,
         notes:'Reducir dosis 25-50% en IRC. Riesgo de hipoglicemia'}
  },
  'heparina': {
    _category: 'anticoagulantes_antiplaquetarios',
    iv: {weightBased:true, minPerKg:10, maxPerKg:18, absoluteMax:1500, typicalMin:500, typicalMax:1500, unit:'UI/h',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Bolo inicial + infusión continua. Monitorizar TTPA cada 6h'}
  },
  'enoxaparina': {
    _category: 'anticoagulantes_antiplaquetarios',
    sc: {weightBased:true, minPerKg:1.0, maxPerKg:1.5, absoluteMax:150, typicalMin:40, typicalMax:120, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 1.0 : 1.5,
         notes:'En IRC (eGFR<30): 1mg/kg/día. Monitorizar anti-Xa si disponible'}
  },
  'digoxina': {
    _category: 'cardiovascular_antiarritmicos',
    oral: {weightBased:false, absoluteMax:0.25, typicalMin:0.0625, typicalMax:0.25, unit:'mg',
           renalAdjusted:true, ageAdjusted:true,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0.0625 : egfr < 60 ? 0.125 : 0.25,
           getAgeAdjustedMax: (age) => age >= 70 ? 0.125 : 0.25,
           notes:'Estrecho margen terapéutico. Monitorizar digoxinemia y K+'}
  },

  // ─── CARDIOVASCULAR ───
  'amlodipino': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:10, typicalMin:2.5, typicalMax:10, unit:'mg',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 70 ? 5 : 10,
           notes:'Iniciar con 5 mg/día. En adulto mayor iniciar con 2.5 mg. Edema maleolar frecuente'}
  },
  'atorvastatina': {
    _category: 'cardiovascular_otros',
    oral: {weightBased:false, absoluteMax:80, typicalMin:10, typicalMax:80, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Tomar preferentemente en la noche. Monitorizar perfil hepático y CK si mialgia'}
  },
  'clopidogrel': {
    _category: 'anticoagulantes_antiplaquetarios',
    oral: {weightBased:false, absoluteMax:75, typicalMin:75, typicalMax:75, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Dosis carga 300 mg en SCA. Mantención 75 mg/día. Suspender 5-7 días pre-cirugía'}
  },
  'nitroglicerina': {
    _category: 'cardiovascular_otros',
    iv: {weightBased:true, minPerKg:0.5, maxPerKg:5, absoluteMax:400, typicalMin:5, typicalMax:200, unit:'mcg/min',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Titular según PA y dolor. Proteger de la luz. Tolerancia con uso >24h continuo'},
    sl: {weightBased:false, absoluteMax:1.2, typicalMin:0.4, typicalMax:0.8, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Máx 3 dosis cada 5 min. Si persiste dolor → llamar SAMU/urgencias'}
  },
  'amiodarona': {
    _category: 'cardiovascular_antiarritmicos',
    iv: {weightBased:true, minPerKg:5, maxPerKg:7, absoluteMax:450, typicalMin:150, typicalMax:300, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Bolo lento en 10 min, luego infusión 900 mg/24h. Usar vía central o vena gruesa. Fototóxica'},
    oral: {weightBased:false, absoluteMax:400, typicalMin:100, typicalMax:200, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Carga 200 mg c/8h x 1 sem, luego mantención 200 mg/día. Vigilar tiroides y función pulmonar'}
  },
  'losartan': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:100, typicalMin:25, typicalMax:100, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Contraindicado en embarazo. Monitorizar K+ y creatinina. No combinar con IECA'}
  },
  'atenolol': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:100, typicalMin:25, typicalMax:100, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 15 ? 25 : egfr < 35 ? 50 : 100,
           notes:'Reducir dosis en IRC. No suspender abruptamente (riesgo rebote). Monitorizar FC'}
  },

  // ─── ANTIBIÓTICOS ───
  'ceftriaxona': {
    _category: 'antibioticos',
    iv: {weightBased:false, absoluteMax:4000, typicalMin:1000, typicalMax:2000, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Dosis habitual 1-2 g/día. En meningitis: 2 g c/12h. No mezclar con Ca++ en misma vía'},
    im: {weightBased:false, absoluteMax:2000, typicalMin:250, typicalMax:1000, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Diluir con lidocaína 1% para IM. Dosis única diaria en la mayoría de infecciones'}
  },
  'ciprofloxacino': {
    _category: 'antibioticos',
    oral: {weightBased:false, absoluteMax:1500, typicalMin:250, typicalMax:750, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 500 : 750,
           notes:'Riesgo de tendinopatía. No con lácteos ni antiácidos. Fotosensibilidad'},
    iv: {weightBased:false, absoluteMax:800, typicalMin:200, typicalMax:400, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 200 : 400,
         notes:'Infundir en 60 min. Ajustar en IRC. Vigilar QTc'}
  },
  'metronidazol': {
    _category: 'antibioticos',
    iv: {weightBased:true, minPerKg:7.5, maxPerKg:15, absoluteMax:2000, typicalMin:500, typicalMax:500, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Infundir en 30-60 min. Efecto antabuse: prohibido alcohol. Útil en anaerobios y C. difficile'},
    oral: {weightBased:false, absoluteMax:2000, typicalMin:250, typicalMax:500, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Dosis habitual 500 mg c/8h. Sabor metálico frecuente. No alcohol durante tratamiento'}
  },
  'clindamicina': {
    _category: 'antibioticos',
    iv: {weightBased:true, minPerKg:10, maxPerKg:40, absoluteMax:2700, typicalMin:600, typicalMax:900, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Nunca en bolo. Infundir en 20-30 min. Riesgo de colitis por C. difficile'},
    oral: {weightBased:false, absoluteMax:1800, typicalMin:150, typicalMax:450, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Cada 6-8h. Tomar con agua abundante. Vigilar diarrea (C. difficile)'}
  },
  'cotrimoxazol': {
    _category: 'antibioticos',
    oral: {weightBased:false, absoluteMax:1600, typicalMin:400, typicalMax:800, unit:'mg TMP',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 15 ? 0 : egfr < 30 ? 400 : 800,
           notes:'Dosis expresada como TMP. Contraindicado si eGFR <15. Hidratación abundante. Riesgo hiperK+'}
  },

  // ─── RESPIRATORIO / CORTICOIDES ───
  'salbutamol': {
    _category: 'respiratorio',
    inhalatoria: {weightBased:false, absoluteMax:800, typicalMin:200, typicalMax:400, unit:'mcg',
                  renalAdjusted:false, ageAdjusted:false,
                  notes:'2-4 puff cada 4-6h. En crisis: 4-8 puff c/20 min x 3 ciclos. Taquicardia e hipoK+ como RAM'},
    nebulizacion: {weightBased:false, absoluteMax:5, typicalMin:2.5, typicalMax:5, unit:'mg',
                   renalAdjusted:false, ageAdjusted:false,
                   notes:'2.5-5 mg en 3 mL SF. En crisis severa: nebulización continua. Monitorizar FC y K+'}
  },
  'prednisona': {
    _category: 'corticoides',
    oral: {weightBased:true, minPerKg:0.5, maxPerKg:2, absoluteMax:80, typicalMin:5, typicalMax:60, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Tomar con alimento. Retiro gradual si >7 días. Vigilar glicemia, PA, retención hídrica'}
  },
  'dexametasona': {
    _category: 'corticoides',
    iv: {weightBased:true, minPerKg:0.1, maxPerKg:0.5, absoluteMax:40, typicalMin:4, typicalMax:20, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Antiinflamatorio potente. 30x más potente que hidrocortisona. Vigilar glicemia e infecciones'},
    oral: {weightBased:false, absoluteMax:40, typicalMin:0.5, typicalMax:8, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Dosis varía según indicación. En EPOC exacerbado: 40 mg/día x 5 días'}
  },
  'hidrocortisona': {
    _category: 'corticoides',
    iv: {weightBased:true, minPerKg:1, maxPerKg:5, absoluteMax:300, typicalMin:50, typicalMax:100, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Crisis suprarrenal: 100 mg bolo + 50 mg c/8h. Shock séptico: 200 mg/día en infusión continua'}
  },

  // ─── GASTROINTESTINAL ───
  'omeprazol': {
    _category: 'gastrointestinal',
    oral: {weightBased:false, absoluteMax:40, typicalMin:20, typicalMax:40, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Tomar 30 min antes del desayuno. En HDA: 80 mg bolo IV + 8 mg/h infusión'},
    iv: {weightBased:false, absoluteMax:80, typicalMin:40, typicalMax:80, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'HDA activa: bolo 80 mg + infusión 8 mg/h x 72h. Diluir en 100 mL SF'}
  },
  'metoclopramida': {
    _category: 'gastrointestinal',
    iv: {weightBased:true, minPerKg:0.1, maxPerKg:0.15, absoluteMax:30, typicalMin:10, typicalMax:10, unit:'mg',
         renalAdjusted:true, ageAdjusted:true,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 0.075 : 0.15,
         getAgeAdjustedMax: (age) => age >= 65 ? 0.1 : 0.15,
         notes:'Máximo 5 días de uso. Riesgo de distonía aguda (jóvenes) y acatisia. Inyectar lento'},
    oral: {weightBased:false, absoluteMax:30, typicalMin:10, typicalMax:10, unit:'mg',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 65 ? 5 : 10,
           notes:'10 mg c/8h, 30 min antes de comidas. Máx 5 días. Efectos extrapiramidales'}
  },
  'ondansetron': {
    _category: 'gastrointestinal',
    iv: {weightBased:false, absoluteMax:16, typicalMin:4, typicalMax:8, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Antiemético de elección. Administrar lento. Riesgo de prolongar QTc'},
    oral: {weightBased:false, absoluteMax:24, typicalMin:4, typicalMax:8, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'4-8 mg c/8-12h. Constipación frecuente. Vigilar QTc con dosis altas'}
  },

  // ─── DOLOR / SEDACIÓN ───
  'tramadol': {
    _category: 'opioides_sedacion',
    oral: {weightBased:false, absoluteMax:400, typicalMin:50, typicalMax:100, unit:'mg',
           renalAdjusted:true, ageAdjusted:true,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 100 : 200,
           getAgeAdjustedMax: (age) => age >= 75 ? 200 : 400,
           notes:'Cada 6-8h. Riesgo convulsiones. No combinar con ISRS (serotonina). Náuseas frecuentes'},
    iv: {weightBased:true, minPerKg:1, maxPerKg:2, absoluteMax:400, typicalMin:50, typicalMax:100, unit:'mg',
         renalAdjusted:true, ageAdjusted:true,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 1.0 : 2.0,
         getAgeAdjustedMax: (age) => age >= 75 ? 1.0 : 2.0,
         notes:'Infundir lento en 20 min. Máx 400 mg/día. Monitorizar nivel de conciencia'}
  },
  'ketorolaco': {
    _category: 'analgesicos_antiinflamatorios',
    iv: {weightBased:false, absoluteMax:120, typicalMin:10, typicalMax:30, unit:'mg',
         renalAdjusted:false, ageAdjusted:true,
         getAgeAdjustedMax: (age) => age >= 65 ? 60 : 120,
         notes:'Máx 2 días IV. Dosis diaria máx 90-120 mg. Riesgo GI y renal. No en IRC ni úlcera'},
    oral: {weightBased:false, absoluteMax:40, typicalMin:10, typicalMax:20, unit:'mg',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 65 ? 20 : 40,
           notes:'Máx 5 días total (IV+oral). Cada 6-8h. Alto riesgo gastrolesivo'}
  },
  'diclofenaco': {
    _category: 'analgesicos_antiinflamatorios',
    oral: {weightBased:false, absoluteMax:150, typicalMin:25, typicalMax:50, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Cada 8-12h. Con alimento. Riesgo CV y GI. No en IR, IC ni úlcera activa'},
    im: {weightBased:false, absoluteMax:150, typicalMin:75, typicalMax:75, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Máx 2 días IM. Inyectar en cuadrante superoexterno glúteo. Dolor en sitio inyección'}
  },
  'midazolam': {
    _category: 'opioides_sedacion',
    iv: {weightBased:true, minPerKg:0.02, maxPerKg:0.1, absoluteMax:5, typicalMin:1, typicalMax:5, unit:'mg',
         renalAdjusted:false, ageAdjusted:true,
         getAgeAdjustedMax: (age) => age >= 65 ? 0.05 : 0.1,
         notes:'Titular lentamente. Tener flumazenilo disponible. Riesgo depresión respiratoria. Monitorizar SatO2'},
    oral: {weightBased:true, minPerKg:0.25, maxPerKg:0.5, absoluteMax:20, typicalMin:7.5, typicalMax:15, unit:'mg',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 65 ? 0.25 : 0.5,
           notes:'Premedicación: 7.5-15 mg VO 30-60 min antes. Amnesia anterógrada'}
  },
  'fentanilo': {
    _category: 'opioides_sedacion',
    iv: {weightBased:true, minPerKg:0.5, maxPerKg:2, absoluteMax:200, typicalMin:25, typicalMax:100, unit:'mcg',
         renalAdjusted:false, ageAdjusted:true,
         getAgeAdjustedMax: (age) => age >= 65 ? 1.0 : 2.0,
         notes:'100x más potente que morfina. Tener naloxona disponible. Rigidez torácica con bolo rápido. Monitorizar FR y SatO2'},
    transdermica: {weightBased:false, absoluteMax:100, typicalMin:12, typicalMax:75, unit:'mcg/h',
                   renalAdjusted:false, ageAdjusted:true,
                   getAgeAdjustedMax: (age) => age >= 65 ? 50 : 100,
                   notes:'Solo para dolor crónico con tolerancia a opioides. Cambiar cada 72h. Efecto continúa 12-24h post retiro'}
  },

  // ─── ENDOCRINO ───
  'levotiroxina': {
    _category: 'diabetes_endocrino',
    oral: {weightBased:true, minPerKg:1.0, maxPerKg:1.7, absoluteMax:200, typicalMin:25, typicalMax:150, unit:'mcg',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 65 ? 1.0 : 1.7,
           notes:'Tomar en ayunas 30-60 min antes de comer. Inicio gradual en adulto mayor y cardiópatas. Control TSH en 6-8 sem'}
  },
  'insulina cristalina': {
    _category: 'diabetes_endocrino',
    iv: {weightBased:true, minPerKg:0.05, maxPerKg:0.1, absoluteMax:10, typicalMin:2, typicalMax:10, unit:'UI/h',
         renalAdjusted:false, ageAdjusted:false,
         notes:'CAD: 0.1 UI/kg/h en BIC. Monitorizar glicemia c/1h y K+ c/2h. Reponer K+ antes si <3.3'},
    sc: {weightBased:true, minPerKg:0.05, maxPerKg:0.3, absoluteMax:20, typicalMin:2, typicalMax:10, unit:'UI',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Corrección según esquema. Inicio rápido 15-30 min. Pico 1-3h. Riesgo hipoglicemia'}
  },

  // ─── ELECTROLITOS / OTROS ───
  'potasio cloruro': {
    _category: 'electrolitos_fluidos',
    iv: {weightBased:false, absoluteMax:40, typicalMin:10, typicalMax:20, unit:'mEq/h',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 10 : 20,
         notes:'NUNCA en bolo directo (riesgo arritmia letal). Máx 40 mEq/h con monitoreo cardíaco. Diluir adecuadamente. Vigilar K+ sérico'},
    oral: {weightBased:false, absoluteMax:100, typicalMin:8, typicalMax:40, unit:'mEq',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 20 : 40,
           notes:'Con alimento para reducir irritación GI. Control K+ sérico frecuente'}
  },
  'naloxona': {
    _category: 'antidotos_emergencia',
    iv: {weightBased:true, minPerKg:0.005, maxPerKg:0.01, absoluteMax:2, typicalMin:0.4, typicalMax:2, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Antídoto opioides. Repetir cada 2-3 min si no hay respuesta. Vida media corta: vigilar re-sedación'}
  },
  'flumazenilo': {
    _category: 'antidotos_emergencia',
    iv: {weightBased:false, absoluteMax:3, typicalMin:0.2, typicalMax:1, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Antídoto benzodiacepinas. 0.2 mg c/60 seg. Riesgo convulsiones en usuarios crónicos BZD. Vida media corta'}
  },
  'atropina': {
    _category: 'antidotos_emergencia',
    iv: {weightBased:false, absoluteMax:3, typicalMin:0.5, typicalMax:1, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Bradicardia: 0.5-1 mg c/3-5 min (máx 3 mg). Dosis <0.5 mg puede causar bradicardia paradójica'}
  },
  'adrenalina': {
    _category: 'antidotos_emergencia',
    iv: {weightBased:false, absoluteMax:1, typicalMin:0.1, typicalMax:1, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'PCR: 1 mg c/3-5 min. Anafilaxia: 0.3-0.5 mg IM muslo. Infusión: 0.01-0.1 mcg/kg/min'},
    im: {weightBased:true, minPerKg:0.005, maxPerKg:0.01, absoluteMax:0.5, typicalMin:0.3, typicalMax:0.5, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Anafilaxia: inyectar en cara anterolateral del muslo. Repetir cada 5-15 min si necesario'}
  },

  // ══════════════════════════════════════════════════════════════
  // NUEVOS — Patologías alta morbilidad Chile (GES/AUGE)
  // IAM, ACV, ERC, DHC, EPOC, IC, TEP, Sepsis, DM2, HTA
  // ══════════════════════════════════════════════════════════════

  // ── CARDIOVASCULAR: IAM / IC / TEP ──
  'aspirina': {
    _category: 'anticoagulantes_antiplaquetarios',
    oral: {weightBased:false, absoluteMax:500, typicalMin:100, typicalMax:325, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'IAM: masticar 500 mg stat. Mantención 100 mg/día. Antiagregante de primera línea GES'}
  },
  'alteplasa': {
    _category: 'anticoagulantes_antiplaquetarios',
    iv: {weightBased:true, minPerKg:0.6, maxPerKg:0.9, absoluteMax:90, typicalMin:50, typicalMax:90, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'ACV isquémico: 0.9 mg/kg (10% bolo, 90% en 60 min). Ventana 4.5h. IAM: protocolo acelerado. TEP masivo: 100 mg en 2h'}
  },
  'carvedilol': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:50, typicalMin:3.125, typicalMax:25, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'IC: iniciar 3.125 mg c/12h, titular cada 2 sem. Post-IAM. No iniciar en IC descompensada'}
  },
  'espironolactona': {
    _category: 'diureticos',
    oral: {weightBased:false, absoluteMax:100, typicalMin:12.5, typicalMax:50, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0 : egfr < 50 ? 25 : 50,
           notes:'IC NYHA III-IV: 12.5-25 mg/día. DHC con ascitis: 100-400 mg/día. Monitorizar K+ (hiperK+). Contraindicado eGFR <30'}
  },
  'dobutamina': {
    _category: 'antidotos_emergencia',
    iv: {weightBased:true, minPerKg:2.5, maxPerKg:20, absoluteMax:1400, typicalMin:175, typicalMax:700, unit:'mcg/min',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Shock cardiogénico / IC aguda: 2.5-20 mcg/kg/min en BIC. Preparar en SG5%. Monitorizar PA y ECG continuo'}
  },
  'noradrenalina': {
    _category: 'antidotos_emergencia',
    iv: {weightBased:true, minPerKg:0.05, maxPerKg:2, absoluteMax:140, typicalMin:4, typicalMax:30, unit:'mcg/min',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Shock séptico 1ª línea: 0.05-2 mcg/kg/min. Vía central obligatoria (necrosis si extravasa). Titular según PAM ≥65'}
  },
  'isosorbide dinitrato': {
    _category: 'cardiovascular_otros',
    oral: {weightBased:false, absoluteMax:120, typicalMin:10, typicalMax:40, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Angina: 10-40 mg c/8h. Dar intervalo libre de nitrato de 10-12h (tolerancia). No con sildenafil'},
    sl: {weightBased:false, absoluteMax:10, typicalMin:5, typicalMax:10, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Crisis anginosa: 5 mg SL. Puede repetir cada 5 min x 3 dosis'}
  },
  'hidroclorotiazida': {
    _category: 'diureticos',
    oral: {weightBased:false, absoluteMax:50, typicalMin:12.5, typicalMax:25, unit:'mg',
           renalAdjusted:true, ageAdjusted:true,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0 : 25,
           getAgeAdjustedMax: (age) => age >= 70 ? 12.5 : 25,
           notes:'HTA: 12.5-25 mg/día. Ineficaz si eGFR <30 (usar furosemida). Vigilar Na+, K+, ácido úrico y glicemia'}
  },

  // ── ACV ──
  'ácido tranexámico': {
    _category: 'antidotos_emergencia',
    iv: {weightBased:true, minPerKg:10, maxPerKg:15, absoluteMax:1000, typicalMin:500, typicalMax:1000, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 500 : 1000,
         notes:'Hemorragia aguda/politrauma: 1 g en 10 min + 1 g en 8h (protocolo CRASH-2). ACV hemorrágico en estudio'}
  },
  'nimodipino': {
    _category: 'neurologico_psiquiatrico',
    oral: {weightBased:false, absoluteMax:360, typicalMin:60, typicalMax:60, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'HSA: 60 mg c/4h x 21 días (vasoespasmo). ÚNICO bloqueador Ca++ con evidencia en SNC. Administrar por SNG si inconsciente'}
  },

  // ── ERC / DIÁLISIS ──
  'eritropoyetina': {
    _category: 'diabetes_endocrino',
    sc: {weightBased:true, minPerKg:50, maxPerKg:300, absoluteMax:20000, typicalMin:2000, typicalMax:10000, unit:'UI',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Anemia renal ERC: 50-300 UI/kg 1-3x/sem. Meta Hb 10-12 g/dL (no >13). Ferritina >200 y Sat.Tf >20% previo. Riesgo HTA y trombosis'}
  },
  'calcio carbonato': {
    _category: 'electrolitos_fluidos',
    oral: {weightBased:false, absoluteMax:3000, typicalMin:500, typicalMax:1500, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Quelante de fósforo en ERC: tomar CON alimentos. Hipocalcemia: 500-1000 mg c/8h. Monitorizar Ca×P <55'}
  },
  'calcio gluconato': {
    _category: 'electrolitos_fluidos',
    iv: {weightBased:false, absoluteMax:3000, typicalMin:1000, typicalMax:2000, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'HiperK+ severa: 1-2 g IV lento en 10 min (estabiliza miocardio, NO baja K+). Hipocalcemia sintomática. Monitorizar ECG'}
  },
  'bicarbonato de sodio': {
    _category: 'electrolitos_fluidos',
    iv: {weightBased:true, minPerKg:0.5, maxPerKg:1, absoluteMax:100, typicalMin:50, typicalMax:100, unit:'mEq',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Acidosis metabólica severa (pH <7.1): 1 mEq/kg bolo. ERC: corregir si HCO3 <22. PCR: solo si pH <7.0 o hiperK+'}
  },

  // ── DHC (Daño Hepático Crónico) ──
  'lactulosa': {
    _category: 'gastrointestinal',
    oral: {weightBased:false, absoluteMax:120, typicalMin:15, typicalMax:30, unit:'mL',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Encefalopatía hepática: 15-30 mL c/8h, titular hasta 2-3 deposiciones blandas/día. Profilaxis: 15-30 mL c/12h'}
  },
  'rifaximina': {
    _category: 'antibioticos',
    oral: {weightBased:false, absoluteMax:1200, typicalMin:400, typicalMax:550, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Profilaxis encefalopatía hepática DHC: 550 mg c/12h. No absorbible. Combinar con lactulosa. GES Chile'}
  },
  'propranolol': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:320, typicalMin:20, typicalMax:80, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Profilaxis várices esofágicas DHC: titular hasta FC 55-60 lpm. No usar en ascitis refractaria. Vigilar hipotensión'}
  },
  'albumina': {
    _category: 'electrolitos_fluidos',
    iv: {weightBased:true, minPerKg:0.5, maxPerKg:1.5, absoluteMax:100, typicalMin:20, typicalMax:50, unit:'g',
         renalAdjusted:false, ageAdjusted:false,
         notes:'PBE en DHC: 1.5 g/kg día 1 + 1 g/kg día 3. Post-paracentesis >5L: 8g/L extraído. SHR: con terlipresina'}
  },

  // ── EPOC / ASMA ──
  'bromuro de ipratropio': {
    _category: 'respiratorio',
    inhalatoria: {weightBased:false, absoluteMax:320, typicalMin:40, typicalMax:80, unit:'mcg',
                  renalAdjusted:false, ageAdjusted:false,
                  notes:'EPOC: 2-4 puff c/6h. Crisis: 4-8 puff c/20 min con salbutamol. Anticolinérgico, menor broncoespasmo que β2'},
    nebulizacion: {weightBased:false, absoluteMax:1, typicalMin:0.25, typicalMax:0.5, unit:'mg',
                   renalAdjusted:false, ageAdjusted:false,
                   notes:'0.5 mg + salbutamol 2.5 mg en 3 mL SF. Repetir cada 20 min en crisis x 3'}
  },
  'aminofilina': {
    _category: 'respiratorio',
    iv: {weightBased:true, minPerKg:5, maxPerKg:6, absoluteMax:500, typicalMin:250, typicalMax:500, unit:'mg',
         renalAdjusted:false, ageAdjusted:true,
         getAgeAdjustedMax: (age) => age >= 65 ? 4 : 6,
         notes:'Carga: 5-6 mg/kg en 250 mL SF en 20-30 min. Mantención: 0.5-0.7 mg/kg/h. Estrecho margen terapéutico. Monitorizar teofilinemia'}
  },

  // ── SEPSIS ──
  'meropenem': {
    _category: 'antibioticos',
    iv: {weightBased:false, absoluteMax:6000, typicalMin:500, typicalMax:2000, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 10 ? 500 : egfr < 25 ? 1000 : 2000,
         notes:'Sepsis: 1-2 g c/8h. Meningitis: 2 g c/8h. Infundir en 3h (infusión extendida mejora PK/PD). Ajustar en ERC'}
  },
  'piperacilina-tazobactam': {
    _category: 'antibioticos',
    iv: {weightBased:false, absoluteMax:18000, typicalMin:4500, typicalMax:4500, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 20 ? 2250 : egfr < 40 ? 3375 : 4500,
         notes:'Sepsis nosocomial: 4.5 g c/6-8h. Infusión extendida 4h. Cubre Pseudomonas. Ajustar en ERC. Vigilar Na+ (alto contenido)'}
  },

  // ── DM2 ──
  'glibenclamida': {
    _category: 'diabetes_endocrino',
    oral: {weightBased:false, absoluteMax:20, typicalMin:2.5, typicalMax:10, unit:'mg',
           renalAdjusted:true, ageAdjusted:true,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0 : egfr < 60 ? 5 : 20,
           getAgeAdjustedMax: (age) => age >= 70 ? 5 : 20,
           notes:'Sulfonilurea GES Chile. Contraindicada en ERC severa (hipoglicemia prolongada). Administrar con desayuno. Educa signos hipoglicemia'}
  },
  'sitagliptina': {
    _category: 'diabetes_endocrino',
    oral: {weightBased:false, absoluteMax:100, typicalMin:25, typicalMax:100, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 25 : egfr < 50 ? 50 : 100,
           notes:'Inhibidor DPP-4. Bajo riesgo hipoglicemia. Ajustar según eGFR. Puede combinarse con metformina e insulina'}
  },
  'empagliflozina': {
    _category: 'diabetes_endocrino',
    oral: {weightBased:false, absoluteMax:25, typicalMin:10, typicalMax:25, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 20 ? 0 : egfr < 45 ? 10 : 25,
           notes:'iSGLT2: beneficio CV y renal demostrado (EMPA-REG, EMPEROR). IC: 10 mg. Riesgo cetoacidosis euglicémica, ITU, deshidratación'}
  },

  // ── NEUROLÓGICO: ACV / CONVULSIONES ──
  'fenitoína': {
    _category: 'anticonvulsivantes',
    iv: {weightBased:true, minPerKg:15, maxPerKg:20, absoluteMax:1500, typicalMin:1000, typicalMax:1500, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Status epiléptico: 20 mg/kg IV a ≤50 mg/min. Monitorizar ECG (arritmias). No en SF glucosado (precipita). Niveles terapéuticos: 10-20 mcg/mL'},
    oral: {weightBased:false, absoluteMax:600, typicalMin:100, typicalMax:300, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Mantención: 100 mg c/8h o 300 mg/día. Estrecho margen terapéutico. Inducción enzimática. Monitorizar fenitoínemia'}
  },
  'levetiracetam': {
    _category: 'anticonvulsivantes',
    iv: {weightBased:true, minPerKg:20, maxPerKg:60, absoluteMax:4500, typicalMin:500, typicalMax:1500, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 30 ? 500 : egfr < 50 ? 750 : 1500,
         notes:'Carga: 20-60 mg/kg. Mantención: 500-1500 mg c/12h. Menos interacciones que fenitoína. Ajustar en ERC'},
    oral: {weightBased:false, absoluteMax:3000, typicalMin:250, typicalMax:1500, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 500 : egfr < 50 ? 750 : 1500,
           notes:'250-1500 mg c/12h. Titular lento. RAM: irritabilidad, somnolencia. Seguro en DHC'}
  },
  'ácido valproico': {
    _category: 'anticonvulsivantes',
    iv: {weightBased:true, minPerKg:15, maxPerKg:45, absoluteMax:3000, typicalMin:400, typicalMax:1000, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Status epiléptico: 15-45 mg/kg carga. Mantención: 1-2 mg/kg/h. Contraindicado en DHC. Monitorizar amonio y plaquetas'},
    oral: {weightBased:false, absoluteMax:3000, typicalMin:250, typicalMax:1000, unit:'mg',
           renalAdjusted:false, ageAdjusted:false,
           notes:'250-1000 mg c/8-12h. Hepatotóxico. Teratogénico (contraindicado embarazo). Nivel terapéutico: 50-100 mcg/mL'}
  },

  // ── PSIQUIÁTRICO ──
  'haloperidol': {
    _category: 'neurologico_psiquiatrico',
    im: {weightBased:false, absoluteMax:20, typicalMin:2.5, typicalMax:5, unit:'mg',
         renalAdjusted:false, ageAdjusted:true,
         getAgeAdjustedMax: (age) => age >= 65 ? 2.5 : 10,
         notes:'Delirium/agitación: 2.5-5 mg IM c/30 min (máx 20 mg/día). Adulto mayor: 0.5-2.5 mg. Vigilar QTc y SEP'},
    oral: {weightBased:false, absoluteMax:20, typicalMin:0.5, typicalMax:5, unit:'mg',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 65 ? 2.5 : 20,
           notes:'Delirium: 0.5-2 mg c/8h. Agitación: 5 mg. Vigilar síntomas extrapiramidales y QTc'}
  },
  'diazepam': {
    _category: 'neurologico_psiquiatrico',
    iv: {weightBased:true, minPerKg:0.1, maxPerKg:0.3, absoluteMax:20, typicalMin:5, typicalMax:10, unit:'mg',
         renalAdjusted:false, ageAdjusted:true,
         getAgeAdjustedMax: (age) => age >= 65 ? 0.15 : 0.3,
         notes:'Status epiléptico: 0.15-0.3 mg/kg IV lento (máx 5 mg/min). OH: 10-20 mg carga. Vida media larga. Depresión respiratoria'},
    oral: {weightBased:false, absoluteMax:40, typicalMin:2, typicalMax:10, unit:'mg',
           renalAdjusted:false, ageAdjusted:true,
           getAgeAdjustedMax: (age) => age >= 65 ? 5 : 10,
           notes:'Ansiedad: 2-10 mg c/8-12h. Síndrome OH: protocolo CIWA. Potencia depresión SNC con alcohol y opioides'}
  },

  // ── ANTIINFECCIOSOS ADICIONALES ──
  'fluconazol': {
    _category: 'antibioticos',
    iv: {weightBased:true, minPerKg:3, maxPerKg:12, absoluteMax:800, typicalMin:200, typicalMax:400, unit:'mg',
         renalAdjusted:true, ageAdjusted:false,
         getRenalAdjustedMax: (egfr) => egfr < 50 ? 200 : 400,
         notes:'Candidemia: 400-800 mg/día. Candidiasis mucosa: 200 mg/día. Ajustar en ERC. Inhibe CYP2C9/3A4 (muchas interacciones)'},
    oral: {weightBased:false, absoluteMax:400, typicalMin:50, typicalMax:200, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 50 ? 100 : 200,
           notes:'Candidiasis oral: 200 mg día 1, luego 100 mg/día x 7-14 días. Monitorizar función hepática'}
  },
  'oseltamivir': {
    _category: 'antibioticos',
    oral: {weightBased:false, absoluteMax:150, typicalMin:75, typicalMax:75, unit:'mg',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 30 : 75,
           notes:'Influenza: 75 mg c/12h x 5 días. Iniciar <48h de síntomas. GES Chile. Ajustar en ERC'}
  },

  // ── OTROS: GES / Alta Frecuencia Chile ──
  'hierro sacarosa': {
    _category: 'electrolitos_fluidos',
    iv: {weightBased:false, absoluteMax:500, typicalMin:100, typicalMax:200, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Anemia ferropriva ERC: 100-200 mg en 100 mL SF en 15-60 min. Máx 500 mg/sem. Riesgo anafilaxia (observar 30 min). Meta ferritina 200-500'}
  },
  'sulfato ferroso': {
    _category: 'electrolitos_fluidos',
    oral: {weightBased:false, absoluteMax:600, typicalMin:100, typicalMax:200, unit:'mg Fe elemental',
           renalAdjusted:false, ageAdjusted:false,
           notes:'Anemia ferropriva: 100-200 mg Fe elemental/día. Cada 200 mg sulfato ferroso = 60 mg Fe elemental. Tomar en ayunas con vitamina C. Heces negras'}
  },
  'metilprednisolona': {
    _category: 'corticoides',
    iv: {weightBased:true, minPerKg:1, maxPerKg:30, absoluteMax:1000, typicalMin:40, typicalMax:1000, unit:'mg',
         renalAdjusted:false, ageAdjusted:false,
         notes:'Pulsos: 500-1000 mg/día x 3-5 días (LES, rechazo trasplante). Asma severa: 40-80 mg c/6-8h. Vigilar glicemia, infecciones, HTA'}
  },
  'losartan + hidroclorotiazida': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:100, typicalMin:50, typicalMax:100, unit:'mg losartan',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0 : 100,
           notes:'Combinación fija HTA GES: 50/12.5 o 100/25. Contraindicada en ERC severa (componente HCTZ). Monitorizar K+, Na+, creatinina'}
  },
  'enalapril + hidroclorotiazida': {
    _category: 'cardiovascular_antihipertensivos',
    oral: {weightBased:false, absoluteMax:20, typicalMin:5, typicalMax:20, unit:'mg enalapril',
           renalAdjusted:true, ageAdjusted:false,
           getRenalAdjustedMax: (egfr) => egfr < 30 ? 0 : 20,
           notes:'Combinación fija HTA GES: 10/25 o 20/12.5. Contraindicada eGFR <30. Monitorizar K+ y creatinina'}
  }
};

// ─── SCORES CLÍNICOS ────────────────────────────────────────

// NEWS2 (National Early Warning Score 2)
function calculateNEWS2(vitals) {
  const scores = {};

  // Frecuencia respiratoria
  const rr = vitals.respiratoryRate;
  if (rr <= 8) scores.respiratoryRate = 3;
  else if (rr <= 11) scores.respiratoryRate = 1;
  else if (rr <= 20) scores.respiratoryRate = 0;
  else if (rr <= 24) scores.respiratoryRate = 2;
  else scores.respiratoryRate = 3;

  // SpO2 Scale 1 (sin EPOC)
  const spo2 = vitals.oxygenSaturation;
  if (!vitals.useScale2) {
    if (spo2 <= 91) scores.oxygenSaturation = 3;
    else if (spo2 <= 93) scores.oxygenSaturation = 2;
    else if (spo2 <= 95) scores.oxygenSaturation = 1;
    else scores.oxygenSaturation = 0;
  } else {
    // Scale 2 (EPOC con target 88-92%)
    if (spo2 <= 83) scores.oxygenSaturation = 3;
    else if (spo2 <= 85) scores.oxygenSaturation = 2;
    else if (spo2 <= 87) scores.oxygenSaturation = 1;
    else if (spo2 <= 92) scores.oxygenSaturation = 0;
    else if (spo2 <= 94) scores.oxygenSaturation = 1;
    else if (spo2 <= 96) scores.oxygenSaturation = 2;
    else scores.oxygenSaturation = 3;
  }

  // O2 suplementario
  scores.supplementalOxygen = vitals.supplementalOxygen ? 2 : 0;

  // Temperatura
  const temp = vitals.temperature;
  if (temp <= 35.0) scores.temperature = 3;
  else if (temp <= 36.0) scores.temperature = 1;
  else if (temp <= 38.0) scores.temperature = 0;
  else if (temp <= 39.0) scores.temperature = 1;
  else scores.temperature = 2;

  // PA sistólica
  const sbp = vitals.systolicBP;
  if (sbp <= 90) scores.systolicBP = 3;
  else if (sbp <= 100) scores.systolicBP = 2;
  else if (sbp <= 110) scores.systolicBP = 1;
  else if (sbp <= 219) scores.systolicBP = 0;
  else scores.systolicBP = 3;

  // FC
  const hr = vitals.heartRate;
  if (hr <= 40) scores.heartRate = 3;
  else if (hr <= 50) scores.heartRate = 1;
  else if (hr <= 90) scores.heartRate = 0;
  else if (hr <= 110) scores.heartRate = 1;
  else if (hr <= 130) scores.heartRate = 2;
  else scores.heartRate = 3;

  // Conciencia
  const cons = vitals.consciousness;
  scores.consciousness = (cons === 'alert') ? 0 : 3;

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  // Determinar riesgo
  let risk, escalation;
  const has3InAny = Object.values(scores).some(v => v === 3);
  if (total >= 7) {
    risk = 'high'; escalation = 'Activación de equipo de respuesta rápida. Considerar UCI. Monitorización continua.';
  } else if (total >= 5 || has3InAny) {
    risk = 'medium'; escalation = 'Revisión clínica urgente. Evaluar necesidad de escalamiento. Control cada 30 min.';
  } else if (total >= 1) {
    risk = 'low-medium'; escalation = 'Informar a enfermera a cargo. Evaluar en 4-6 horas. Vigilar tendencia.';
  } else {
    risk = 'low'; escalation = 'Monitorización rutinaria cada 12 horas.';
  }

  return { total, risk, components: scores, escalation };
}

// Glasgow Coma Scale
function calculateGlasgow(input) {
  const eye = Math.max(1, Math.min(4, input.eye || 1));
  const verbal = Math.max(1, Math.min(5, input.verbal || 1));
  const motor = Math.max(1, Math.min(6, input.motor || 1));
  const total = eye + verbal + motor;

  let severity, recommendation;
  if (total <= 8) {
    severity = 'severe'; recommendation = 'TEC severo. Asegurar vía aérea (GCS≤8 = intubación). Llamar neurocirugía. TAC urgente.';
  } else if (total <= 12) {
    severity = 'moderate'; recommendation = 'TEC moderado. Observación estricta. TAC cerebral. Control neurológico horario.';
  } else {
    severity = 'mild'; recommendation = 'TEC leve. Observación 24h. Criterios de TAC según protocolo (Canadian CT Head Rule).';
  }

  return { total, eye, verbal, motor, severity, recommendation };
}

// qSOFA (Quick SOFA) — screening sepsis
function calculateQSOFA(input) {
  let score = 0;
  const components = {};

  components.mentalStatus = (input.alteredMental) ? 1 : 0;
  components.respiratoryRate = (input.respiratoryRate >= 22) ? 1 : 0;
  components.systolicBP = (input.systolicBP <= 100) ? 1 : 0;
  score = components.mentalStatus + components.respiratoryRate + components.systolicBP;

  let risk, recommendation;
  if (score >= 2) {
    risk = 'high';
    recommendation = 'qSOFA ≥2: Alta probabilidad de sepsis. Iniciar protocolo HORA-1: lactato, hemocultivos, antibiótico empírico, cristaloides 30mL/kg, vasopresores si PAM<65.';
  } else if (score === 1) {
    risk = 'moderate';
    recommendation = 'qSOFA 1: Vigilancia estrecha. Solicitar lactato, hemograma, PCR/procalcitonina. Re-evaluar en 1 hora.';
  } else {
    risk = 'low';
    recommendation = 'qSOFA 0: Bajo riesgo de sepsis actual. Continuar monitorización estándar.';
  }

  return { score, components, risk, recommendation };
}

// ─── FUNCIONES DEL MOTOR CDSS ────────────────────────────────

function checkInteractions(newDrug, currentMeds, allergies) {
  if (!newDrug || typeof newDrug !== 'string') return [];
  const alerts = [];
  const drugNorm = newDrug.toLowerCase().trim();

  // Verificar interacciones medicamentosas
  for (const med of (currentMeds || [])) {
    const medNorm = med.toLowerCase().trim();
    if (!medNorm || medNorm === drugNorm) continue;

    const interaction = INTERACTION_DB.find(pair =>
      (pair.drugA.toLowerCase() === drugNorm && pair.drugB.toLowerCase() === medNorm) ||
      (pair.drugB.toLowerCase() === drugNorm && pair.drugA.toLowerCase() === medNorm)
    );

    if (interaction) {
      alerts.push({
        type: 'interaction',
        severity: interaction.severity,
        pair: [newDrug, med],
        mechanism: interaction.mechanism,
        message: interaction.clinicalEffect,
        recommendation: interaction.recommendation
      });
    }
  }

  // Verificar reactividad cruzada con alergias
  for (const allergy of (allergies || [])) {
    const allergyNorm = allergy.toLowerCase().trim();
    if (!allergyNorm) continue;

    for (const group of CROSS_REACTIVITY) {
      const drugInGroup = group.members.some(m => m.toLowerCase() === drugNorm);
      const allergyInGroup = group.members.some(m => m.toLowerCase() === allergyNorm);
      const allergyInCross = group.crossWith.some(c => allergyNorm.includes(c.toLowerCase()));

      if (drugInGroup && (allergyInGroup || allergyInCross)) {
        alerts.push({
          type: 'allergy',
          severity: 'critical',
          pair: [newDrug, allergy],
          mechanism: `Reactividad cruzada grupo ${group.group} (riesgo: ${group.risk})`,
          message: `Posible alergia cruzada con ${allergy} documentada`,
          recommendation: `No administrar sin evaluación de alergología. Considerar alternativa fuera del grupo ${group.group}`
        });
      }
    }
  }

  // Ordenar por severidad: critical > major > minor
  const order = {critical: 0, major: 1, minor: 2};
  return alerts.sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9));
}

function validateDose(drug, dose, route, patientWeight, patientAge, renalFunction) {
  const drugNorm = drug.toLowerCase().trim();
  const rules = DOSE_RULES[drugNorm]?.[route];

  if (!rules) {
    return {valid: true, message: 'Sin reglas de validación disponibles para este fármaco/vía',
            suggestedRange: null, factors: [], notes: ''};
  }

  const factors = [];

  // SEGURIDAD: si requiere peso y no se provee, BLOQUEAR
  if (rules.weightBased) {
    if (!patientWeight || patientWeight <= 0) {
      return {valid: false,
              message: `⚠️ Peso requerido para ${drug} (fármaco mg/kg). No se puede validar sin peso.`,
              suggestedRange: null, factors: ['weight_missing'], notes: rules.notes};
    }
    factors.push('peso');
    const maxDose = rules.maxPerKg * patientWeight;
    const minDose = rules.minPerKg * patientWeight;
    if (dose > maxDose) {
      return {valid: false,
              message: `Dosis excede máximo para ${patientWeight}kg: ${dose}${rules.unit} > ${maxDose.toFixed(1)}${rules.unit}`,
              suggestedRange: {min: minDose.toFixed(1), max: maxDose.toFixed(1), unit: rules.unit},
              factors: [...factors, 'weight_exceeded'], notes: rules.notes};
    }
    if (dose < minDose) {
      return {valid: false,
              message: `Dosis inferior al mínimo terapéutico para ${patientWeight}kg`,
              suggestedRange: {min: minDose.toFixed(1), max: maxDose.toFixed(1), unit: rules.unit},
              factors: [...factors, 'subtherapeutic'], notes: rules.notes};
    }
  }

  // Ajuste por edad
  if (rules.ageAdjusted && rules.getAgeAdjustedMax && patientAge !== undefined && patientAge > 0) {
    factors.push('edad');
    const ageMax = rules.getAgeAdjustedMax(patientAge);
    if (ageMax === 0) {
      return {valid: false,
              message: `Contraindicado para edad ${patientAge} años`,
              suggestedRange: null, factors: [...factors, 'age_contraindicated'], notes: rules.notes};
    }
    if (dose > ageMax) {
      return {valid: false,
              message: `Excede máximo ajustado por edad (${patientAge}a): ${dose}${rules.unit} > ${ageMax}${rules.unit}`,
              suggestedRange: {min: rules.typicalMin, max: ageMax, unit: rules.unit},
              factors: [...factors, 'age_exceeded'], notes: rules.notes};
    }
  }

  // Ajuste renal
  if (rules.renalAdjusted && rules.getRenalAdjustedMax && renalFunction !== undefined && renalFunction >= 0) {
    factors.push('renal');
    const renalMax = rules.getRenalAdjustedMax(renalFunction);
    if (renalMax === 0) {
      return {valid: false,
              message: `Contraindicado con eGFR ${renalFunction} mL/min`,
              suggestedRange: null, factors: [...factors, 'renal_contraindicated'], notes: rules.notes};
    }
    // Para weight-based, comparar con renalMax * peso
    if (rules.weightBased && patientWeight) {
      const renalMaxDose = renalMax * patientWeight;
      if (dose > renalMaxDose) {
        return {valid: false,
                message: `Excede dosis renal-ajustada para eGFR ${renalFunction}: ${dose}${rules.unit} > ${renalMaxDose.toFixed(1)}${rules.unit}`,
                suggestedRange: {min: (rules.minPerKg * patientWeight).toFixed(1), max: renalMaxDose.toFixed(1), unit: rules.unit},
                factors: [...factors, 'renal_exceeded'], notes: rules.notes};
      }
    } else if (dose > renalMax) {
      return {valid: false,
              message: `Excede máximo renal-ajustado para eGFR ${renalFunction}: ${dose}${rules.unit} > ${renalMax}${rules.unit}`,
              suggestedRange: {min: rules.typicalMin, max: renalMax, unit: rules.unit},
              factors: [...factors, 'renal_exceeded'], notes: rules.notes};
    }
  }

  // Máximo absoluto
  if (dose > rules.absoluteMax) {
    return {valid: false,
            message: `Excede dosis máxima absoluta: ${dose}${rules.unit} > ${rules.absoluteMax}${rules.unit}`,
            suggestedRange: {min: rules.typicalMin, max: rules.absoluteMax, unit: rules.unit},
            factors: [...factors, 'absolute_max'], notes: rules.notes};
  }

  return {valid: true,
          message: 'Dosis dentro de rango terapéutico',
          suggestedRange: {min: rules.typicalMin, max: rules.typicalMax, unit: rules.unit},
          factors, notes: rules.notes};
}

// ─── LISTAS PARA AUTOCOMPLETADO ──────────────────────────────
function getDrugList() {
  const drugs = new Set();
  INTERACTION_DB.forEach(p => { drugs.add(p.drugA); drugs.add(p.drugB); });
  Object.keys(DOSE_RULES).forEach(d => drugs.add(d));
  return [...drugs].sort();
}

function getDrugListForDoseCheck() {
  return Object.keys(DOSE_RULES).sort();
}

// Devuelve fármacos agrupados por familia: { categoryKey: { label, drugs[] } }
function getDrugsByCategory() {
  const grouped = {};
  for (const [drug, data] of Object.entries(DOSE_RULES)) {
    const cat = data._category || 'otros';
    if (!grouped[cat]) grouped[cat] = { label: DRUG_CATEGORIES[cat] || cat, drugs: [] };
    grouped[cat].drugs.push(drug);
  }
  // Ordenar fármacos dentro de cada categoría
  for (const cat of Object.values(grouped)) cat.drugs.sort();
  return grouped;
}

function getRoutesForDrug(drug) {
  const rules = DOSE_RULES[drug.toLowerCase().trim()];
  if (!rules) return [];
  return Object.keys(rules);
}
