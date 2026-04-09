// ============================================================
// app.js — Consulta Rápida ENF — UDP
// Lógica de navegación, renderizado y búsqueda
// ============================================================

// ─── Estado global ──────────────────────────────────────────
let currentSessionId = null;
let currentSubject = 'farm';
let quizState = {}; // {answered: Set, score: 0}

// ─── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar('farm');
  buildSidebar('fisio');
  buildSidebar('cuid');
  showHome();
  // Neural network canvas starts via showHome() → initHomeCanvas()
});

// ─── Sidebar ────────────────────────────────────────────────
function buildSidebar(subject) {
  const container = document.getElementById('sidebar-' + subject);
  const data = APP_DATA[subject];
  let html = '';
  data.units.forEach(unit => {
    html += `
      <div class="unit-group">
        <div class="unit-header" onclick="toggleUnit(this)">
          ${unit.title}
          <span class="arrow">▶</span>
        </div>
        <div class="unit-items">`;
    unit.sessions.forEach(s => {
      html += `<div class="nav-item" id="nav-${s.id}" onclick="loadSession('${s.id}','${subject}')">
        ${s.title}
      </div>`;
    });
    html += `</div></div>`;
  });
  container.innerHTML = html;
}

function toggleUnit(header) {
  header.classList.toggle('open');
}

function switchSidebarTab(subject, el) {
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active'));
  document.getElementById('sidebar-' + subject).classList.add('active');
  currentSubject = subject;
}

// ─── Utilidad de vistas ─────────────────────────────────────
function hideAllViews() {
  ['home','content-view','subject-view','xref-view','calc-view','progress-view','biblio-view'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
}

// ─── Vistas principales ─────────────────────────────────────
function showHome() {
  hideAllViews();
  document.getElementById('home').style.display = 'block';
  currentSessionId = null;
  clearNavActive();
  setTimeout(initHomeCanvas, 60);
}

// ─── Neural Network Canvas Animation ────────────────────────
let _homeCanvasRunning = false;
function initHomeCanvas() {
  const canvas = document.getElementById('home-canvas');
  if (!canvas || _homeCanvasRunning) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const hero = canvas.parentElement;
    canvas.width  = hero.offsetWidth  || window.innerWidth;
    canvas.height = hero.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  // ─ Colour palette (farm:blue, fisio:green, cuid:purple, neutral:white)
  const PALETTE = [
    {r:59,  g:130, b:246},  // blue
    {r:16,  g:185, b:129},  // green
    {r:139, g:92,  b:246},  // purple
    {r:200, g:220, b:255},  // soft white
  ];

  const N = 70;
  const nodes = Array.from({length: N}, (_, i) => {
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - .5) * .38,
      vy: (Math.random() - .5) * .38,
      r:  Math.random() * 1.8 + 1.2,
      c,
      ph: Math.random() * Math.PI * 2,  // pulse phase
    };
  });
  // Make some "hub" nodes larger
  [2, 8, 15, 25, 40, 55].forEach(i => { nodes[i].r = 3.8; });

  const DIST = 155;
  let animId;
  _homeCanvasRunning = true;

  function frame() {
    if (!document.getElementById('home-canvas')) {
      _homeCanvasRunning = false;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move
    nodes.forEach(n => {
      n.x  += n.vx;
      n.y  += n.vy;
      n.ph += .012;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      n.x = Math.max(0, Math.min(canvas.width,  n.x));
      n.y = Math.max(0, Math.min(canvas.height, n.y));
    });

    // Draw edges
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < DIST) {
          const a = (1 - d/DIST) * .28;
          const c = nodes[i].c;
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
          ctx.lineWidth   = .65;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const pulse = Math.sin(n.ph) * .25 + .75;
      const {r,g,b} = n.c;
      // Glow for hub nodes
      if (n.r > 3) {
        const grad = ctx.createRadialGradient(n.x,n.y,0, n.x,n.y, n.r*5);
        grad.addColorStop(0, `rgba(${r},${g},${b},${.22*pulse})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r*5, 0, Math.PI*2);
        ctx.fill();
      }
      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${r},${g},${b},${.82*pulse})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(frame);
  }

  frame();

  // Stop animation when home is hidden
  const observer = new MutationObserver(() => {
    const home = document.getElementById('home');
    if (home && home.style.display === 'none') {
      cancelAnimationFrame(animId);
      _homeCanvasRunning = false;
      observer.disconnect();
    }
  });
  const home = document.getElementById('home');
  if (home) observer.observe(home, {attributes:true, attributeFilter:['style']});
}

function showSubject(subject) {
  currentSubject = subject;
  // activar tab lateral
  const tabs = document.querySelectorAll('.sidebar-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (subject === 'farm')      tabs[0].classList.add('active');
  else if (subject === 'fisio') tabs[1].classList.add('active');
  else if (subject === 'cuid')  tabs[2].classList.add('active');
  document.querySelectorAll('.sidebar-content').forEach(c => c.classList.remove('active'));
  document.getElementById('sidebar-' + subject).classList.add('active');

  hideAllViews();

  const sv = document.getElementById('subject-view');
  sv.style.display = 'block';

  const data = APP_DATA[subject];
  const label = subject === 'farm' ? '💊 Farmacología en Enfermería'
              : subject === 'fisio' ? '🫀 Fisiopatología en Enfermería'
              : '💙 Cuidados de Enfermería';
  const code  = subject === 'farm' ? 'ENF3013 · 3° semestre'
              : subject === 'fisio' ? 'ENF3014 · 4° semestre'
              : 'ENF2010–ENF2011 · 2°–3° semestre';
  let html = `
    <div class="cv-header">
      <div class="cv-title">${label}</div>
      <div class="cv-meta"><span class="cv-meta-item">${code}</span></div>
    </div>
    <div class="unit-index">`;
  data.units.forEach(unit => {
    html += `<div class="unit-card" onclick="openUnit('${subject}','${unit.id}')">
      <h3>${unit.title}</h3>
      <ul>${unit.sessions.map(s => `<li>${s.title}</li>`).join('')}</ul>
    </div>`;
  });
  html += `</div>`;
  sv.innerHTML = html;
}

function openUnit(subject, unitId) {
  const unit = APP_DATA[subject].units.find(u => u.id === unitId);
  if (!unit) return;
  if (unit.sessions.length === 1) {
    loadSession(unit.sessions[0].id, subject);
  } else {
    loadSession(unit.sessions[0].id, subject);
  }
}

// ─── Carga de sesión/clase ───────────────────────────────────
function findSession(id) {
  for (const subj of ['farm','fisio','cuid']) {
    for (const unit of APP_DATA[subj].units) {
      const s = unit.sessions.find(s => s.id === id);
      if (s) return { session: s, subject: subj, unitTitle: unit.title };
    }
  }
  return null;
}

function loadSession(id, subject) {
  const found = findSession(id);
  if (!found) return;
  const { session, unitTitle } = found;
  subject = found.subject;
  currentSessionId = id;

  // Cerrar sidebar en móvil
  closeSidebarOnNavItem();

  // Ocultar otras vistas
  hideAllViews();
  document.getElementById('content-view').style.display = 'block';

  // Registrar progreso
  trackVisit(id);

  // Actualizar sidebar
  clearNavActive();
  const navEl = document.getElementById('nav-' + id);
  if (navEl) {
    navEl.classList.add('active');
    // Abrir el grupo padre
    const unitItems = navEl.closest('.unit-items');
    if (unitItems) {
      const header = unitItems.previousElementSibling;
      if (header && !header.classList.contains('open')) header.classList.toggle('open');
    }
  }

  // Tabs disponibles
  const hasDiagrams = session.diagrams && session.diagrams.length > 0;
  const hasExtras = typeof EXTRAS !== 'undefined' && EXTRAS[id];
  const tabs = [
    { id: 'contenido', label: '📋 Contenido' },
    { id: 'keywords', label: '🔑 Palabras Clave' },
    { id: 'alertas', label: `⚠️ Alertas (${session.alerts.length})` },
    { id: 'conexiones', label: `🔗 Conexiones (${session.connections.length})` },
  ];
  if (hasDiagrams) tabs.push({ id: 'diagramas', label: '📊 Diagramas' });
  if (hasExtras && EXTRAS[id].quiz) tabs.push({ id: 'quiz', label: '📝 Quiz' });
  if (hasExtras && EXTRAS[id].vignette) tabs.push({ id: 'caso', label: '🏥 Caso Clínico' });

  // Breadcrumb, título y meta
  const subjectLabel = subject === 'farm' ? 'Farmacología'
                     : subject === 'fisio' ? 'Fisiopatología'
                     : 'Cuidados de Enfermería';
  const code = subject === 'farm' ? 'ENF3013'
             : subject === 'fisio' ? 'ENF3014'
             : 'ENF2010–ENF2011';
  document.getElementById('cv-breadcrumb').innerHTML =
    `<span onclick="showHome()">Inicio</span> / <span onclick="showSubject('${subject}')">${subjectLabel}</span> / ${unitTitle}`;
  document.getElementById('cv-title').textContent = session.title;
  document.getElementById('cv-meta').innerHTML = `
    <span class="cv-meta-item"><span class="badge ${subject}">${subjectLabel}</span></span>
    <span class="cv-meta-item">📘 ${code}</span>
    <span class="cv-meta-item">📌 ${unitTitle}</span>`;

  // Tabs HTML
  const tabsContainer = document.getElementById('content-tabs');
  tabsContainer.innerHTML = tabs.map((t, i) =>
    `<div class="content-tab${i===0?' active':''}" onclick="switchContentTab('${t.id}', this)">${t.label}</div>`
  ).join('');

  // Panes
  renderContenido(session);
  renderKeywords(session);
  renderAlertas(session);
  renderConexiones(session, subject);
  if (hasDiagrams) renderDiagramas(session);
  if (hasExtras && EXTRAS[id].quiz) renderQuiz(id);
  if (hasExtras && EXTRAS[id].vignette) renderVignette(id);

  // Activar primer tab
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-contenido').classList.add('active');

  window.scrollTo(0, 0);
}

function clearNavActive() {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
}

function switchContentTab(tabId, el) {
  document.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById('tab-' + tabId);
  if (pane) pane.classList.add('active');
}

// ─── Render: Contenido (accordion con definiciones) ─────────
function renderContenido(session) {
  const pane = document.getElementById('tab-contenido');
  // Mapa sesión → presentación HTML (todas las unidades de Farmacología)
  const SLIDES_MAP = {
    'farm-s1':     { file: 'unidad1-bases-slides.html',        label: 'Bases de la Farmacología',               desc: '12 diapositivas: rol enfermería, ADME, PK/PD, RAM, interacciones y farmacovigilancia.' },
    'farm-s2':     { file: 'unidad1-bases-slides.html',        label: 'Bases de la Farmacología',               desc: '12 diapositivas: rol enfermería, ADME, PK/PD, RAM, interacciones y farmacovigilancia.' },
    'farm-s3':     { file: 'antibioticos-slides.html',         label: 'Farmacología: Antibióticos',             desc: '12 diapositivas: mecanismos, clasificación, resistencia, PK/PD y protocolo sepsis.' },
    'farm-s4':     { file: 'unidad2-antiinfecciosos-slides.html', label: 'Antiinfecciosos, Alergias y Vía Aérea', desc: '12 diapositivas: antifúngicos, antivirales, alergia, anafilaxia y broncodilatadores.' },
    'farm-s5':     { file: 'unidad2-antiinfecciosos-slides.html', label: 'Antiinfecciosos, Alergias y Vía Aérea', desc: '12 diapositivas: antifúngicos, antivirales, alergia, anafilaxia y broncodilatadores.' },
    'farm-s6':     { file: 'unidad3-cardiovascular-slides.html', label: 'Farmacología Cardiovascular',           desc: '12 diapositivas: IECA/ARA-II, BCC, diuréticos, antiarrítmicos, anticoagulantes y estatinas.' },
    'farm-s8':     { file: 'unidad3-cardiovascular-slides.html', label: 'Farmacología Cardiovascular',           desc: '12 diapositivas: IECA/ARA-II, BCC, diuréticos, antiarrítmicos, anticoagulantes y estatinas.' },
    'farm-s9':     { file: 'unidad3-cardiovascular-slides.html', label: 'Farmacología Cardiovascular',           desc: '12 diapositivas: IECA/ARA-II, BCC, diuréticos, antiarrítmicos, anticoagulantes y estatinas.' },
    'slipid':      { file: 'unidad3-cardiovascular-slides.html', label: 'Farmacología Cardiovascular',           desc: '12 diapositivas: IECA/ARA-II, BCC, diuréticos, antiarrítmicos, anticoagulantes y estatinas.' },
    'farm-s11':    { file: 'unidad4-endocrina-slides.html',    label: 'Farmacología Endocrina',                 desc: '12 diapositivas: tiroides, levotiroxina, insulinas, ADO, hipoglucemia y síndrome metabólico.' },
    'sdiab':       { file: 'unidad4-endocrina-slides.html',    label: 'Farmacología Endocrina',                 desc: '12 diapositivas: tiroides, levotiroxina, insulinas, ADO, hipoglucemia y síndrome metabólico.' },
    'farm-s12':    { file: 'unidad5-snc-slides.html',          label: 'Farmacología del SNC',                   desc: '12 diapositivas: SNV, benzodiacepinas, antidepresivos, antipsicóticos y anticonvulsivantes.' },
    'sansio':      { file: 'unidad5-snc-slides.html',          label: 'Farmacología del SNC',                   desc: '12 diapositivas: SNV, benzodiacepinas, antidepresivos, antipsicóticos y anticonvulsivantes.' },
    'spsiq':       { file: 'unidad5-snc-slides.html',          label: 'Farmacología del SNC',                   desc: '12 diapositivas: SNV, benzodiacepinas, antidepresivos, antipsicóticos y anticonvulsivantes.' },
    'saline':      { file: 'unidad5-snc-slides.html',          label: 'Farmacología del SNC',                   desc: '12 diapositivas: SNV, benzodiacepinas, antidepresivos, antipsicóticos y anticonvulsivantes.' },
    'farm-sgastro':{ file: 'unidad6-digestivo-slides.html',    label: 'Digestivo, AINEs y Vacunas',             desc: '12 diapositivas: IBP, H. pylori, AINEs/COX, corticoides, anestésicos locales y vacunas.' },
    'farm-saines': { file: 'unidad6-digestivo-slides.html',    label: 'Digestivo, AINEs y Vacunas',             desc: '12 diapositivas: IBP, H. pylori, AINEs/COX, corticoides, anestésicos locales y vacunas.' },
    'farm-svacunas':{ file: 'unidad6-digestivo-slides.html',   label: 'Digestivo, AINEs y Vacunas',             desc: '12 diapositivas: IBP, H. pylori, AINEs/COX, corticoides, anestésicos locales y vacunas.' },
    // ── Fisiopatología ──────────────────────────────────────────────────────
    // U1 — Biología Celular y Tisular (4 sesiones)
    'fisio-c01pptx': { file: 'fisio-u1-celular-slides.html',       label: 'Fisiopatología Celular y Tisular',        desc: '12 diapositivas: adaptaciones, lesión/muerte, ERO, inflamación y cicatrización.' },
    'fisio-c02pptx': { file: 'fisio-u1-celular-slides.html',       label: 'Fisiopatología Celular y Tisular',        desc: '12 diapositivas: adaptaciones, lesión/muerte, ERO, inflamación y cicatrización.' },
    'fisio-c01pdf':  { file: 'fisio-u1-celular-slides.html',       label: 'Fisiopatología Celular y Tisular',        desc: '12 diapositivas: adaptaciones, lesión/muerte, ERO, inflamación y cicatrización.' },
    'fisio-cicatr':  { file: 'fisio-u1-celular-slides.html',       label: 'Fisiopatología Celular y Tisular',        desc: '12 diapositivas: adaptaciones, lesión/muerte, ERO, inflamación y cicatrización.' },
    // U2 — Respiratoria (5 sesiones)
    'fisio-c02pdf':  { file: 'fisio-u2-respiratoria-slides.html',  label: 'Fisiopatología Respiratoria',             desc: '12 diapositivas: espirometría, asma GINA, EPOC GOLD, SDRA y IR tipo I/II.' },
    'fisio-c03':     { file: 'fisio-u2-respiratoria-slides.html',  label: 'Fisiopatología Respiratoria',             desc: '12 diapositivas: espirometría, asma GINA, EPOC GOLD, SDRA y IR tipo I/II.' },
    'fisio-c04':     { file: 'fisio-u2-respiratoria-slides.html',  label: 'Fisiopatología Respiratoria',             desc: '12 diapositivas: espirometría, asma GINA, EPOC GOLD, SDRA y IR tipo I/II.' },
    'fisio-c05':     { file: 'fisio-u2-respiratoria-slides.html',  label: 'Fisiopatología Respiratoria',             desc: '12 diapositivas: espirometría, asma GINA, EPOC GOLD, SDRA y IR tipo I/II.' },
    'fisio-c06':     { file: 'fisio-u2-respiratoria-slides.html',  label: 'Fisiopatología Respiratoria',             desc: '12 diapositivas: espirometría, asma GINA, EPOC GOLD, SDRA y IR tipo I/II.' },
    // U3 — Cardiovascular (5 sesiones)
    'fisio-c07':     { file: 'fisio-u3-cardiovascular-slides.html','label': 'Fisiopatología Cardiovascular',         desc: '12 diapositivas: IC, shock, ateromatosis, HTA y IAM.' },
    'fisio-s8':      { file: 'fisio-u3-cardiovascular-slides.html','label': 'Fisiopatología Cardiovascular',         desc: '12 diapositivas: IC, shock, ateromatosis, HTA y IAM.' },
    'fisio-saterom': { file: 'fisio-u3-cardiovascular-slides.html','label': 'Fisiopatología Cardiovascular',         desc: '12 diapositivas: IC, shock, ateromatosis, HTA y IAM.' },
    'fisio-c09pptx': { file: 'fisio-u3-cardiovascular-slides.html','label': 'Fisiopatología Cardiovascular',         desc: '12 diapositivas: IC, shock, ateromatosis, HTA y IAM.' },
    'fisio-c10pptx': { file: 'fisio-u3-cardiovascular-slides.html','label': 'Fisiopatología Cardiovascular',         desc: '12 diapositivas: IC, shock, ateromatosis, HTA y IAM.' },
    // U4 — Endocrina (2 sesiones)
    'fisio-c09pdf':  { file: 'fisio-u4-endocrina-slides.html',     label: 'Fisiopatología Endocrina y Metabólica',  desc: '12 diapositivas: obesidad visceral, síndrome metabólico, DM1/DM2 y tiroides.' },
    'fisio-c10pdf':  { file: 'fisio-u4-endocrina-slides.html',     label: 'Fisiopatología Endocrina y Metabólica',  desc: '12 diapositivas: obesidad visceral, síndrome metabólico, DM1/DM2 y tiroides.' },
    // U5 — Renal (4 sesiones)
    'fisio-shidro':  { file: 'fisio-u5-renal-slides.html',         label: 'Fisiopatología Renal e Hidrosalina',     desc: '12 diapositivas: electrolitos, ácido-base, ERC KDIGO y AKI.' },
    'fisio-c11':     { file: 'fisio-u5-renal-slides.html',         label: 'Fisiopatología Renal e Hidrosalina',     desc: '12 diapositivas: electrolitos, ácido-base, ERC KDIGO y AKI.' },
    'fisio-serc':    { file: 'fisio-u5-renal-slides.html',         label: 'Fisiopatología Renal e Hidrosalina',     desc: '12 diapositivas: electrolitos, ácido-base, ERC KDIGO y AKI.' },
    'fisio-s17':     { file: 'fisio-u5-renal-slides.html',         label: 'Fisiopatología Renal e Hidrosalina',     desc: '12 diapositivas: electrolitos, ácido-base, ERC KDIGO y AKI.' },
    // U6 — Neurológica (1 sesión)
    'fisio-c13':     { file: 'fisio-u6-neuro-slides.html',         label: 'Fisiopatología Neurológica',             desc: '12 diapositivas: AVE isquémico/hemorrágico, Alzheimer, Parkinson y epilepsia.' },
    // U7 — Hematología (1 sesión)
    'fisio-s14':     { file: 'fisio-u7-hematologia-slides.html',   label: 'Hematología y Hemostasia',               desc: '12 diapositivas: eritropoyesis, anemias, hemostasia, coagulación y hematooncología.' },
    // ── Cuidados de Enfermería 2 ────────────────────────────────────────────
    'cuid2-u1-humanizado':  { file: 'cuid2-u1-humanizado-slides.html',   label: 'Gestión del Cuidado Humanizado',          desc: '13 diapositivas: cuidado transpersonal, humanitude, burnout, autocuidado profesional.' },
    'cuid2-u2-proceso':     { file: 'cuid2-u2-proceso-slides.html',      label: 'Proceso Enfermero PAE · NANDA · NIC-NOC', desc: '14 diapositivas: PAE 5 etapas, Orem, diagnósticos NANDA, NIC, NOC y plan de cuidados.' },
    'cuid2-u3-iaas':        { file: 'cuid2-u3-iaas-slides.html',         label: 'IAAS · PAPE · Antisépticos',              desc: '15 diapositivas: definición IAAS, cadena epidemiológica, PAPE, antisépticos y desinfectantes.' },
    'cuid2-u4-tmsv':        { file: 'cuid2-u4-tmsv-slides.html',         label: 'Toma de Muestra de Sangre Venosa',        desc: '14 diapositivas: venopunción periférica, dispositivos, vacutainer, sitios, complicaciones.' },
    'cuid2-u5-calculo':     { file: 'cuid2-u5-calculo-slides.html',      label: 'Cálculo de Dosis y Goteo',                desc: '13 diapositivas: macrogoteo/microgoteo, fórmulas, velocidad de infusión, regla de 3.' },
    'cuid2-u6-hidratacion': { file: 'cuid2-u6-hidratacion-slides.html',  label: 'Hidratación Parenteral y Hemoderivados',  desc: '14 diapositivas: accesos vasculares, soluciones IV, hemoderivados, reacciones transfusionales.' },
    'cuid2-u7-eliminacion': { file: 'cuid2-u7-eliminacion-slides.html',  label: 'Eliminación Urinaria y Dispositivos',     desc: '12 diapositivas: fisiología, alteraciones, cateterismo vesical, cuidados de sonda Foley.' },
    'cuid2-u8-nutricion':   { file: 'cuid2-u8-nutricion-slides.html',    label: 'Nutrición Enteral y Dispositivos',        desc: '13 diapositivas: nutrición enteral/parenteral, SNG, PEG, ostomías, cuidados digestivos.' },
    'cuid2-u9-balance':     { file: 'cuid2-u9-balance-slides.html',      label: 'Balance Hídrico',                         desc: '14 diapositivas: ingresos y egresos, pérdidas insensibles, cálculo BH, registro y monitorización.' },
    'cuid2-u10-inhalatoria':{ file: 'cuid2-u10-inhalatoria-slides.html', label: 'Inhalatoria y Aspiración de Secreciones', desc: '12 diapositivas: dispositivos inhalatorios, técnica MDI/nebulizador, aspiración orofaríngea.' },
    'cuid2-u11-rcp':        { file: 'cuid2-u11-rcp-slides.html',         label: 'RCP Intrahospitalaria',                   desc: '14 diapositivas: cadena de supervivencia, SVB, compresiones, BVM, carro de paro, calidad.' },
    'cuid2-u12-visita':     { file: 'cuid2-u12-visita-slides.html',      label: 'Visita de Enfermería',                    desc: '13 diapositivas: estructura visita, entrevista clínica, valoración, comunicación terapéutica.' },
    'cuid2-u13-postmortem': { file: 'cuid2-u13-postmortem-slides.html',  label: 'Cuidados Post Mortem',                    desc: '12 diapositivas: actuación, protocolo, duelo, trauma vicario, autocuidado profesional.' },
  };
  const slideInfo = SLIDES_MAP[session.id];
  const resourceBanner = slideInfo
    ? `<div class="card" style="background:linear-gradient(135deg,#0d3b2e 60%,#1a5c42);border:none;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
          <div style="font-size:2rem">🎞️</div>
          <div style="flex:1;min-width:180px">
            <div style="color:#7fffd4;font-weight:700;font-size:14px;margin-bottom:2px">Presentación disponible — ${slideInfo.label}</div>
            <div style="color:#b2f0e0;font-size:12px">${slideInfo.desc}</div>
          </div>
          <a href="${slideInfo.file}" target="_blank"
             style="display:inline-flex;align-items:center;gap:6px;background:#1a7a4a;color:#fff;text-decoration:none;
                    padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;white-space:nowrap;
                    box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:background 0.2s"
             onmouseover="this.style.background='#25a066'" onmouseout="this.style.background='#1a7a4a'">
            📊 Ver presentación
          </a>
        </div>
      </div>`
    : '';
  let html = resourceBanner + `<div class="card"><h3>📌 Temas principales — haz clic para ver definición rápida</h3>
    <div class="topics-list">`;
  session.topics.forEach((topic, i) => {
    const t = typeof topic === 'string' ? topic : topic.t;
    const def = typeof topic === 'object' && topic.def ? topic.def : '';
    html += `<div class="topic-item" onclick="this.classList.toggle('open')">
      <div class="topic-header">
        <div class="topic-header-left">
          <span class="topic-num">${i + 1}</span>
          <span class="topic-title">${t}</span>
        </div>
        <span class="topic-toggle">▶</span>
      </div>
      ${def ? `<div class="topic-def">${def}</div>` : ''}
    </div>`;
  });
  html += `</div></div>`;
  pane.innerHTML = html;
}

// ─── Render: Keywords (vertical) ────────────────────────────
function renderKeywords(session) {
  const pane = document.getElementById('tab-keywords');
  if (!session.keywords || session.keywords.length === 0) {
    pane.innerHTML = `<div class="card"><p>No hay palabras clave registradas.</p></div>`;
    return;
  }
  let html = `<div class="card"><h3>🔑 Palabras clave — ${session.keywords.length} términos</h3>
    <div class="kw-vertical">`;
  session.keywords.forEach((kw, i) => {
    html += `<div class="kw-vert-item" onclick="searchFromKeyword('${kw.replace(/'/g, "\\'")}')">
      <span class="kw-vert-num">${i + 1}</span>
      <span class="kw-vert-text">${kw}</span>
      <span class="kw-vert-icon">🔍</span>
    </div>`;
  });
  html += `</div></div>`;
  pane.innerHTML = html;
}

// ─── Render: Alertas ────────────────────────────────────────
function renderAlertas(session) {
  const pane = document.getElementById('tab-alertas');
  if (!session.alerts || session.alerts.length === 0) {
    pane.innerHTML = `<div class="card"><div class="alert-box success"><strong>Sin alertas especiales</strong>No se registran alertas farmacológicas críticas para esta sesión.</div></div>`;
    return;
  }
  let html = '';
  session.alerts.forEach(a => {
    html += `<div class="alert-box ${a.type}"><strong>${a.title}</strong>${a.text}</div>`;
  });
  pane.innerHTML = html;
}

// ─── Render: Conexiones ─────────────────────────────────────
function renderConexiones(session, subject) {
  const pane = document.getElementById('tab-conexiones');
  if (!session.connections || session.connections.length === 0) {
    pane.innerHTML = `<div class="card"><p>No se registran conexiones cruzadas para esta sesión.</p></div>`;
    return;
  }
  let html = `<div class="card"><h3>🔗 Integración Fisiopatología ↔ Farmacología</h3>`;
  session.connections.forEach(c => {
    const targetSubj = c.type; // 'farm' o 'fisio'
    const targetLabel = targetSubj === 'farm' ? 'Farmacología' : 'Fisiopatología';
    html += `<div class="conn-item" onclick="loadSession('${c.toId}','${targetSubj}')">
      <div class="conn-dot ${targetSubj}"></div>
      <div>
        <div class="conn-title">${c.title}</div>
        <div class="conn-desc">${c.desc}</div>
        <span class="conn-tag ${targetSubj}">${targetLabel}</span>
      </div>
    </div>`;
  });
  html += `</div>`;
  pane.innerHTML = html;
}

// ─── Render: Diagramas ──────────────────────────────────────
function renderDiagramas(session) {
  const pane = document.getElementById('tab-diagramas');
  if (!session.diagrams || session.diagrams.length === 0) {
    pane.innerHTML = '';
    return;
  }
  let html = '';
  session.diagrams.forEach(d => {
    html += `<div class="flow-container"><div class="flow-title">📊 ${d.title}</div><div class="flow">`;
    d.steps.forEach((step, i) => {
      html += `<div class="flow-row">
        <div class="flow-box ${step.color}">${step.label}${step.note ? `<br><small style="font-weight:400;opacity:.8">${step.note}</small>` : ''}</div>
      </div>`;
      if (i < d.steps.length - 1) {
        html += `<div class="flow-row"><span class="flow-arrow down">↓</span></div>`;
      }
    });
    html += `</div></div>`;
  });
  pane.innerHTML = html;
}

// ─── Bibliografía View ───────────────────────────────────────
function showBibliography() {
  hideAllViews();
  document.getElementById('biblio-view').style.display = 'block';
  clearNavActive();
  renderBibliography();
}

function renderBibliography() {
  const container = document.getElementById('biblio-content');
  if (container.dataset.rendered === '1') return; // solo renderizar una vez
  container.dataset.rendered = '1';

  const BIBLIO = [
    {
      grupo: '🦠 Antiinfecciosos',
      color: '#1a5c42',
      refs: [
        { titulo: 'Surviving Sepsis Campaign Guidelines 2026', tipo: 'Guía clínica', autores: 'ESICM/SCCM', año: '2026', url: 'https://link.springer.com/article/10.1007/s00134-026-08361-1', resumen: 'Actualización de timing antibiótico, programas ASP y metas de reanimación en sepsis.' },
        { titulo: 'ACG Clinical Guideline: Treatment of H. pylori Infection', tipo: 'Guía clínica', autores: 'American College of Gastroenterology', año: '2024', url: 'https://pubmed.ncbi.nlm.nih.gov/39626064/', resumen: 'Terapia cuádruple como primera línea; 14 días; vonoprazan en resistencia múltiple.' },
        { titulo: 'IDSA Antimicrobial Resistance Guidance — Gram-Negatives', tipo: 'Guía clínica', autores: 'IDSA', año: '2024', url: 'https://www.idsociety.org/practice-guideline/amr-guidance/', resumen: 'Manejo de Enterobacterales, P. aeruginosa y A. baumannii resistentes a múltiples fármacos.' },
        { titulo: 'Global Guideline for the Diagnosis and Management of Candida Diseases', tipo: 'Guía clínica', autores: 'ECMM/ISHAM/ASM', año: '2025', url: 'https://www.ecmm.info/news/global-guideline-for-the-diagnosis-and-management-of-candida-diseases/', resumen: 'Echinocandinas como primera línea en candidemia; C. auris: aislamiento estricto.' },
        { titulo: 'ATS Guidelines: Invasive Pulmonary Aspergillosis', tipo: 'Guía clínica', autores: 'American Thoracic Society', año: '2024', url: 'https://www.atsjournals.org/doi/full/10.1164/rccm.202410-2045ST', resumen: 'Voriconazol ± isavuconazol; diagnóstico con PCR y antígeno galactomanano.' },
        { titulo: 'IDSA Guidelines: Antiviral Treatment COVID-19 Adults', tipo: 'Guía clínica', autores: 'IDSA', año: '2025', url: 'https://www.idsociety.org/globalassets/idsa/practice-guidelines/covid-19/treatment/antiviral-treatment-for-mild-to-moderate-covid-19-in-adults.pdf', resumen: 'Nirmatrelvir-ritonavir primera línea leve-moderado; remdesivir IV en hospitalizados graves.' },
        { titulo: 'Antimicrobial Resistance in Gram-Negative Pathogens', tipo: 'Revisión sistemática', autores: 'Nature Reviews Microbiology', año: '2024', url: 'https://www.nature.com/articles/s41579-024-01054-w.pdf', resumen: 'Epidemiología global NDM, VIM, KPC; opciones terapéuticas actuales.' },
      ]
    },
    {
      grupo: '❤️ Cardiovascular',
      color: '#1a3a6b',
      refs: [
        { titulo: '2025 AHA/ACC/AANP et al. Hypertension Guideline', tipo: 'Guía clínica', autores: 'AHA/ACC y 10 sociedades', año: '2025', url: 'https://pubmed.ncbi.nlm.nih.gov/40815242/', resumen: 'Nuevos objetivos de PA, intervención más temprana en adultos jóvenes, énfasis en monitoreo domiciliario.' },
        { titulo: '2024 ESC Guidelines for Arterial Hypertension', tipo: 'Guía clínica', autores: 'European Society of Cardiology', año: '2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11857694/', resumen: 'Enfoque de riesgo CV global para umbral de tratamiento; IECA/ARA-II como primera línea.' },
        { titulo: '2024 ESC Guidelines for Atrial Fibrillation', tipo: 'Guía clínica', autores: 'European Society of Cardiology', año: '2024', url: 'https://pubmed.ncbi.nlm.nih.gov/39210723/', resumen: 'Ablación temprana en FA sintomática; DOACs sobre warfarina; monitoreo amiodarona (TSH, LFT).' },
        { titulo: 'Practical DOAC Guidelines 2025', tipo: 'Guía práctica', autores: 'ISTH International', año: '2025', url: 'https://pubmed.ncbi.nlm.nih.gov/40448969/', resumen: 'Prescripción, monitoreo perioperatorio, manejo de sangrado y reversores (idarucizumab, andexanet alfa).' },
        { titulo: 'SGLT2 Inhibitors for HF Prevention and Treatment', tipo: 'Declaración científica', autores: 'HFA/HFAI', año: '2024', url: 'https://onlinelibrary.wiley.com/doi/10.1002/ehf2.14857', resumen: 'SGLT2i como pilar terapéutico en HFrEF y HFpEF incluso en no diabéticos.' },
        { titulo: 'ACC 2024 Decision Pathway — HFrEF', tipo: 'Vía de decisión clínica', autores: 'American College of Cardiology', año: '2024', url: 'https://www.jacc.org/doi/10.1016/j.jacc.2023.12.024', resumen: 'SGLT2i como cuarto pilar del tratamiento junto a IECA/ARNI, betabloqueador y ARM.' },
        { titulo: '2026 ACC/AHA Dyslipidemia Guideline — Summary', tipo: 'Guía clínica', autores: 'ACC/AHA', año: '2026', url: 'https://www.tctmd.com/news/lower-ldl-levels-starting-earlier-life-new-accaha-dyslipidemia-guidelines', resumen: 'Objetivos específicos de LDL-C; inicio más temprano de terapia; Lp(a) como nuevo marcador de riesgo.' },
        { titulo: '2025 ESC/EAS Dyslipidemia Focused Update', tipo: 'Actualización de guía', autores: 'ESC/EAS', año: '2025', url: 'https://www.atherosclerosis-journal.com/article/S0021-9150(25)01377-2/fulltext', resumen: 'Ajuste de objetivos LDL-C; inclisiran como nueva opción semestral; PCSK9i expandidos.' },
      ]
    },
    {
      grupo: '🩺 Endocrina',
      color: '#5a3e00',
      refs: [
        { titulo: 'ADA Standards of Medical Care in Diabetes 2025', tipo: 'Guía clínica', autores: 'American Diabetes Association', año: '2025', url: 'https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment', resumen: 'Fin de metformina universal; GLP-1 y SGLT2i como primera línea según comorbilidades; MCG en DM2 intensiva.' },
        { titulo: 'ETA Guidelines for Hypothyroidism 2025', tipo: 'Guía clínica', autores: 'European Thyroid Association', año: '2025', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12323320/', resumen: 'Levotiroxina: 1.6–1.8 mcg/kg/día; no tratar hipotiroidismo subclínico leve en mayores de 65 años.' },
        { titulo: 'SCCM Glycemic Control in Critically Ill Adults 2024', tipo: 'Guía clínica', autores: 'Society of Critical Care Medicine', año: '2024', url: 'https://pubmed.ncbi.nlm.nih.gov/38240484/', resumen: 'Objetivo glucémico UCI: 140–180 mg/dL; hipoglucemia <70 mg/dL asociada a mayor mortalidad.' },
        { titulo: 'WHO Global Guideline on GLP-1 Medicines for Obesity', tipo: 'Guía OMS', autores: 'World Health Organization', año: '2025', url: 'https://www.who.int/news/item/01-12-2025-who-issues-global-guideline-on-the-use-of-glp-1-medicines-in-treating-obesity', resumen: 'Semaglutida y tirzepatida como primera línea en obesidad (IMC ≥30); tratamiento crónico.' },
        { titulo: 'Pharmacologic Approaches to Glycemic Treatment 2025', tipo: 'Artículo de revisión', autores: 'Exploration of Medicine', año: '2025', url: 'https://www.explorationpub.com/uploads/Article/A101428/101428.pdf', resumen: 'Algoritmo de terapia individualizada DM2; GLP-1/SGLT2i en primer escalón en ECV/IC/ERC.' },
      ]
    },
    {
      grupo: '🧠 SNC',
      color: '#3b1f6b',
      refs: [
        { titulo: 'CANMAT 2023 Clinical Guidelines — Major Depressive Disorder', tipo: 'Guía clínica', autores: 'Canadian Network for Mood and Anxiety Treatments', año: '2023-2024', url: 'https://journals.sagepub.com/doi/full/10.1177/07067437241245384', resumen: 'SSRI/SNRI primera línea; estrategias de augmentación en depresión resistente; rol de ketamina.' },
        { titulo: 'Treatment-Resistant Depression — AAFP 2024', tipo: 'Revisión clínica', autores: 'American Academy of Family Physicians', año: '2024', url: 'https://www.aafp.org/pubs/afp/issues/2024/0500/treatment-resistant-depression.html', resumen: 'Definición y manejo de depresión refractaria; opciones de segunda y tercera línea.' },
        { titulo: 'AES Summary of Antiseizure Medications 4th Edition', tipo: 'Compendio', autores: 'American Epilepsy Society', año: '2024', url: 'https://aesnet.org/docs/default-source/pdfs-clinical/42981132_aes_summary_of_antiseizure_medications_available_in_the_united_states_4th_edition_april_2024.pdf', resumen: 'Compendio actualizado de FAE disponibles; algoritmos por tipo de convulsión; monitoreo.' },
        { titulo: 'Antipsychotic-Induced Metabolic Syndrome Monitoring 2024', tipo: 'Revisión sistemática', autores: 'PMC / NCBI', año: '2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11903528/', resumen: 'Monitoreo metabólico integral en antipsicóticos de segunda generación; parámetros basales y seguimiento.' },
        { titulo: 'Joint CPG on Benzodiazepine Tapering 2025', tipo: 'Guía de práctica clínica', autores: 'Journal of General Internal Medicine', año: '2025', url: 'https://link.springer.com/article/10.1007/s11606-025-09499-2', resumen: 'Reducción 10–25% cada 2–4 semanas; vigilar abstinencia y riesgo convulsivo.' },
        { titulo: 'Benzodiazepine Deprescribing — International Scoping Review', tipo: 'Revisión', autores: 'Lancet eClinicalMedicine', año: '2024', url: 'https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(24)00086-5/fulltext', resumen: 'Evidencia internacional sobre estrategias de deprescripción segura en ansiedad, insomnio y depresión.' },
        { titulo: 'FDA New Parkinson\'s Medications Under Review 2024', tipo: 'Comunicado FDA', autores: 'Michael J. Fox Foundation', año: '2024', url: 'https://www.michaeljfox.org/news/fda-reviewing-four-new-parkinsons-medications-2024', resumen: 'Cuatro nuevos fármacos en revisión; terapias de infusión SC de levodopa en desarrollo.' },
      ]
    },
    {
      grupo: '🫀 Fisiopatología ENF3014',
      color: '#1a4d5c',
      refs: [
        { titulo: 'Harrison\'s Principles of Internal Medicine, 21ª ed.', tipo: 'Libro de texto', autores: 'Loscalzo J. et al.', año: '2022', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookID=3095', resumen: 'Texto de referencia mundial en medicina interna. Fisiopatología detallada de todas las patologías GES con enfoque mecanístico.' },
        { titulo: 'Robbins & Cotran — Patología Estructural y Funcional, 10ª ed.', tipo: 'Libro de texto', autores: 'Kumar V., Abbas A., Aster J.', año: '2021', url: 'https://www.elsevier.com/books/robbins-and-cotran-pathologic-basis-of-disease/kumar/978-0-323-53113-9', resumen: 'Referencia esencial de fisiopatología celular y tisular: lesión celular, ERO, inflamación, neoplasia, cicatrización.' },
        { titulo: 'Fisiopatología de la Enfermedad, 8ª ed. (Lange)', tipo: 'Libro de texto', autores: 'Hammer G., McPhee S.', año: '2019', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookID=2744', resumen: 'Texto orientado a clínica: explica mecanismos de enfermedad órgano por órgano. Ideal para estudiantes de Enfermería.' },
        { titulo: 'Guías GES MINSAL Chile — Decreto 44/2022', tipo: 'Política sanitaria', autores: 'MINSAL Chile', año: '2022', url: 'https://www.minsal.cl/garantias-explicitas-en-salud-ges/', resumen: 'Decreto actualizado GES con 87 patologías garantizadas: acceso, oportunidad, calidad y protección financiera en Chile.' },
        { titulo: 'AHA/ASA 2021 Stroke Prevention Guideline', tipo: 'Guía clínica', autores: 'American Heart Association/American Stroke Association', año: '2021', url: 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000375', resumen: 'Prevención primaria y secundaria de AVE; manejo de FA, HTA, DM2 y dislipidemia como factores de riesgo.' },
        { titulo: 'KDIGO 2024 CKD Clinical Practice Guideline', tipo: 'Guía clínica', autores: 'Kidney Disease: Improving Global Outcomes', año: '2024', url: 'https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf', resumen: 'Clasificación ERC por TFG y albuminuria; metas terapéuticas; nefroprotección con IECA, SGLT2i.' },
        { titulo: 'GOLD 2024 — Global Strategy for COPD', tipo: 'Guía clínica', autores: 'Global Initiative for Chronic Obstructive Lung Disease', año: '2024', url: 'https://goldcopd.org/2024-gold-report/', resumen: 'Clasificación GOLD I-IV; broncodilatación doble como base; grupos ABCD; manejo de exacerbaciones.' },
        { titulo: 'GINA 2024 — Global Strategy for Asthma', tipo: 'Guía clínica', autores: 'Global Initiative for Asthma', año: '2024', url: 'https://ginasthma.org/2024-gina-report/', resumen: 'Escalera terapéutica actualizada; ICS/formoterol como rescate; biológicos en asma severo.' },
        { titulo: 'WHO Cardiovascular Disease Key Facts 2024', tipo: 'Informe OMS', autores: 'World Health Organization', año: '2024', url: 'https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)', resumen: 'ECV: primera causa de muerte mundial (17.9 millones/año). Factores de riesgo modificables y contexto Chile.' },
        { titulo: 'Programa Nacional de Diabetes y ECV — Chile 2023', tipo: 'Guía nacional', autores: 'MINSAL Chile', año: '2023', url: 'https://www.minsal.cl/programa-de-salud-cardiovascular/', resumen: 'Protocolo nacional para DM2, HTA e IC en APS chilena. Metas, seguimiento y derivación.' },
        { titulo: 'ADA 2025 Standards of Diabetes Care', tipo: 'Guía clínica', autores: 'American Diabetes Association', año: '2025', url: 'https://diabetesjournals.org/care/issue/48/Supplement_1', resumen: 'Estándar de cuidado en DM1 y DM2; fisiopatología, farmacología y manejo de complicaciones.' },
        { titulo: 'European Stroke Journal — Thrombolysis Update 2024', tipo: 'Revisión', autores: 'ESO / European Stroke Organisation', año: '2024', url: 'https://journals.sagepub.com/doi/10.1177/23969873241271096', resumen: 'Ventana extendida para tPA; candidatos a trombectomía mecánica 6-24h; score NIHSS y penumbra.' },
        { titulo: 'Hematología Clínica — Pérez Ruiz et al. 6ª ed.', tipo: 'Libro de texto', autores: 'Pérez Ruiz E., Lemes Castellano A.', año: '2020', url: 'https://www.elsevier.com/books/hematologia-clinica/978-84-9113-399-2', resumen: 'Eritropoyesis, anemias, hemostasia, coagulopatías y hematooncología. Referencia en español para Enfermería.' },
        { titulo: 'ISTH 2021 Guidelines — DIC Diagnosis and Management', tipo: 'Guía clínica', autores: 'International Society on Thrombosis and Haemostasis', año: '2021', url: 'https://pubmed.ncbi.nlm.nih.gov/34216193/', resumen: 'Score diagnóstico CID; anticoagulación, PFC, crioprecipitados; manejo en UCI.' },
      ]
    },
    {
      grupo: '🫁 Digestivo · AINEs · Vacunas',
      color: '#0d3b2e',
      refs: [
        { titulo: 'ACG Clinical Guideline: H. pylori Treatment 2024', tipo: 'Guía clínica', autores: 'American College of Gastroenterology', año: '2024', url: 'https://journals.lww.com/ajg/fulltext/2024/09000/acg_clinical_guideline__treatment_of_helicobacter.13.aspx', resumen: 'Cuádruple terapia primera línea con >15–25% resistencia a claritromicina; 14 días; vonoprazan en rescate.' },
        { titulo: 'PPI Deprescribing — Systematic Review 2024', tipo: 'Revisión sistemática', autores: 'PMC / NCBI', año: '2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11508458/', resumen: 'Estrategias de discontinuación gradual de IBP; RAM a largo plazo (B12, Mg²⁺, fracturas).' },
        { titulo: 'BNSSG NHS PPI Deprescribing Algorithm 2024', tipo: 'Algoritmo clínico', autores: 'NHS BNSSG ICB', año: '2024', url: 'https://remedy.bnssg.icb.nhs.uk/media/w0glm3vl/bnssg-proton-pump-inhibitor-ppi-de-prescribing-algorithm-update-2024.pdf', resumen: 'Algoritmo paso a paso para suspensión segura de IBP en atención primaria.' },
        { titulo: 'KDIGO 2024 CKD Guideline — NSAID Use', tipo: 'Guía clínica', autores: 'Kidney Disease: Improving Global Outcomes', año: '2024', url: 'https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf', resumen: 'Evitar AINEs con eGFR <30 mL/min; riesgo de progresión de ERC y nefrotoxicidad.' },
        { titulo: 'APAGE/APLAR Consensus on NSAID Safety 2025', tipo: 'Consenso', autores: 'APAGE / APLAR', año: '2025', url: 'https://www.proquest.com/openview/db65d2056665c45a806573a82e5a404c/', resumen: 'Dosis mínima por tiempo mínimo; riesgo CV incluso con COX-2 selectivos; gastroprotección si factores de riesgo.' },
        { titulo: 'Glucocorticoid Tapering — Primer for Clinicians 2024', tipo: 'Revisión clínica', autores: 'Indian Journal of Emergency Medicine', año: '2024', url: 'https://journals.lww.com/indjem/fulltext/2024/07000/the_glucocorticoid_taper__a_primer_for_the.4.aspx', resumen: 'Insuficiencia adrenal con prednisona >2.5 mg/día × >3 semanas; tapering 20–30%/semana.' },
        { titulo: 'Corticosteroid Tapering in IBD (Crohn\'s & Colitis Canada 2024)', tipo: 'Guía clínica', autores: 'Crohn\'s and Colitis Canada', año: '2024', url: 'https://crohnsandcolitis.ca/Crohns_and_Colitis/documents/Support/Clinical_Care_Pathways/2024-04_Initiation-and-tapering-of-corticosteroids_vA.pdf', resumen: 'Preferir budesonida sobre prednisona sistémica; reducción 5 mg/semana cuando <20 mg/día.' },
        { titulo: 'Calendario Nacional de Inmunizaciones Chile 2025', tipo: 'Política nacional', autores: 'MINSAL Chile', año: '2025', url: 'https://saludresponde.minsal.cl/wp-content/uploads/2025/03/CALENDARIO-INMUNIZACIONES-2025.pdf', resumen: 'Calendario oficial 2025: énfasis en vacunación adulta, gestacional (TdaP + influenza) y mayores de 65 años.' },
        { titulo: 'Immunization in the Americas — Summary 2024', tipo: 'Informe regional', autores: 'PAHO/OPS', año: '2024', url: 'https://www.paho.org/en/documents/immunization-americas-2024-summary', resumen: 'Cobertura 84.8% en Américas; 1.4 millones de niños sin vacunar; prioridad en comunidades vulnerables.' },
        { titulo: 'WHO Recommendations for Routine Immunization 2025', tipo: 'Recomendación OMS', autores: 'World Health Organization', año: '2025', url: 'https://who.int/teams/immunization-vaccines-and-biologicals/policies/who-recommendations-for-routine-immunization---summary-tables', resumen: '16 vacunas de rutina recomendadas; VPH ampliado a varones; énfasis en equidad (>95% cobertura).' },
      ]
    }
  ];

  let html = `
    <div style="margin-bottom:20px;padding:14px 18px;background:#f0f6ff;border-radius:10px;border-left:4px solid var(--udp-blue);">
      <p style="font-size:13px;color:#1a3a6b;margin:0;">
        <strong>📋 ${BIBLIO.reduce((acc,g)=>acc+g.refs.length,0)} referencias</strong> verificadas de organismos internacionales (IDSA, ADA, ESC, ACC/AHA, WHO, PAHO, MINSAL, ACG, ETA, ECMM, SCCM, AES, CANMAT).
        Búsqueda ejecutada en <strong>Abril 2026</strong> via Exa Web Search. Todas las fuentes son de acceso abierto o institucional.
      </p>
    </div>`;

  BIBLIO.forEach(grupo => {
    html += `
      <div style="margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:10px 14px;background:${grupo.color};border-radius:8px;">
          <span style="font-size:15px;font-weight:700;color:#fff;">${grupo.grupo}</span>
          <span style="font-size:11px;color:rgba(255,255,255,.7);margin-left:auto;">${grupo.refs.length} referencias</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">`;

    grupo.refs.forEach((ref, i) => {
      html += `
          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;">
            <div style="display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;margin-bottom:4px;">
              <span style="font-size:10px;background:#e8f0fb;color:var(--udp-blue);padding:2px 8px;border-radius:10px;font-weight:600;white-space:nowrap;">${ref.tipo}</span>
              <span style="font-size:10px;color:#888;">${ref.autores} · ${ref.año}</span>
            </div>
            <div style="font-weight:600;font-size:13px;color:#1a2540;margin-bottom:4px;">${ref.titulo}</div>
            <div style="font-size:12px;color:#555;margin-bottom:8px;line-height:1.5;">${ref.resumen}</div>
            <a href="${ref.url}" target="_blank" rel="noopener"
               style="display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--udp-blue);text-decoration:none;font-weight:600;padding:4px 10px;border:1px solid #c5d5f0;border-radius:6px;">
              🔗 Acceder a la fuente
            </a>
          </div>`;
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
}

// ─── Cross-References View ───────────────────────────────────
function showCrossRef() {
  hideAllViews();
  document.getElementById('xref-view').style.display = 'block';
  clearNavActive();

  const xrefs = APP_DATA.crossrefs;
  let html = `<div class="card">
    <h3>📋 Tabla de Integración — ${xrefs.length} conexiones registradas</h3>
    <table class="xref-table">
      <thead>
        <tr>
          <th>Fisiopatología (ENF3014)</th>
          <th>Farmacología (ENF3013)</th>
          <th>Nexo clínico</th>
        </tr>
      </thead>
      <tbody>`;
  xrefs.forEach(x => {
    html += `<tr>
      <td><span onclick="loadSession('${x.fisioId}','fisio')" style="cursor:pointer;color:#1a7a4a;font-weight:600">${x.fisioTitle}</span></td>
      <td><span onclick="loadSession('${x.farmId}','farm')" style="cursor:pointer;color:#1a3a6b;font-weight:600">${x.farmTitle}</span></td>
      <td>${x.desc}</td>
    </tr>`;
  });
  html += `</tbody></table></div>`;
  document.getElementById('xref-content').innerHTML = html;
}

// ─── Search ──────────────────────────────────────────────────
function buildSearchIndex() {
  const index = [];
  ['farm','fisio','cuid'].forEach(subj => {
    APP_DATA[subj].units.forEach(unit => {
      unit.sessions.forEach(s => {
        // Título
        index.push({ id: s.id, subject: subj, type: 'session', title: s.title, snippet: unit.title, score: 0 });
        // Keywords
        s.keywords.forEach(kw => {
          index.push({ id: s.id, subject: subj, type: 'keyword', title: kw, snippet: s.title, score: 0 });
        });
        // Topics
        s.topics.forEach(t => {
          const text = typeof t === 'string' ? t : t.t;
          const defText = typeof t === 'object' && t.def ? t.def : '';
          index.push({ id: s.id, subject: subj, type: 'topic', title: text.substring(0,80), snippet: s.title, score: 0 });
          if (defText) index.push({ id: s.id, subject: subj, type: 'topic', title: defText.substring(0,80), snippet: text.substring(0,50), score: 0 });
        });
        // Alerts
        s.alerts.forEach(a => {
          index.push({ id: s.id, subject: subj, type: 'alert', title: a.title, snippet: s.title, score: 0 });
        });
      });
    });
  });
  return index;
}

let _searchIndex = null;

function onSearch(query) {
  const resultsEl = document.getElementById('search-results');
  if (!query || query.trim().length < 2) {
    resultsEl.classList.remove('active');
    return;
  }
  if (!_searchIndex) _searchIndex = buildSearchIndex();
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Puntuar y filtrar
  const hits = [];
  const seen = new Set();
  _searchIndex.forEach(entry => {
    const text = (entry.title + ' ' + entry.snippet).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (text.includes(q)) {
      const key = entry.id + '-' + entry.type + '-' + entry.title;
      if (!seen.has(key)) {
        seen.add(key);
        // Prioridad: session title > keyword > alert > topic
        const priority = { session: 4, keyword: 3, alert: 2, topic: 1 }[entry.type] || 0;
        hits.push({ ...entry, priority });
      }
    }
  });

  // Ordenar por prioridad y deduplicar por session
  hits.sort((a, b) => b.priority - a.priority);
  const sessionsSeen = new Set();
  const final = [];
  hits.forEach(h => {
    if (!sessionsSeen.has(h.id) || h.type === 'keyword') {
      if (!sessionsSeen.has(h.id)) sessionsSeen.add(h.id);
      final.push(h);
    }
  });

  if (final.length === 0) {
    resultsEl.innerHTML = `<div class="sr-item"><div class="sr-item-title" style="color:#888">Sin resultados para "${query}"</div></div>`;
    resultsEl.classList.add('active');
    return;
  }

  resultsEl.innerHTML = final.slice(0, 10).map(h => {
    const badge = h.subject === 'farm' ? 'farm' : h.subject === 'cuid' ? 'cuid' : 'fisio';
    const badgeLabel = h.subject === 'farm' ? 'Farmaco' : h.subject === 'cuid' ? 'Cuidados' : 'Fisiopato';
    const icon = h.type === 'alert' ? '⚠️ ' : h.type === 'keyword' ? '🔑 ' : '';
    return `<div class="sr-item" onclick="loadSession('${h.id}','${h.subject}');closeSearch()">
      <div>
        <span class="sr-badge ${badge}">${badgeLabel}</span>
        <div class="sr-item-title">${icon}${h.title}</div>
        <div class="sr-item-snippet">${h.snippet}</div>
      </div>
    </div>`;
  }).join('');
  resultsEl.classList.add('active');
}

function closeSearch() {
  document.getElementById('search-results').classList.remove('active');
  document.getElementById('search-input').value = '';
}

function searchFromKeyword(kw) {
  const input = document.getElementById('search-input');
  input.value = kw;
  onSearch(kw);
  input.focus();
}

// ─── Mobile sidebar ──────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const isOpen = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open', isOpen);
  // Bloquear scroll del body cuando el sidebar está abierto en móvil
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebarOnNavItem() {
  // Cerrar sidebar automáticamente en móvil al navegar
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open')) toggleSidebar();
  }
}

// ============================================================
// QUIZ — Autoevaluación de 5 preguntas por sesión
// ============================================================
function renderQuiz(sessionId) {
  const pane = document.getElementById('tab-quiz');
  const data = EXTRAS[sessionId];
  if (!data || !data.quiz) { pane.innerHTML = ''; return; }

  quizState = { answered: new Set(), score: 0, total: data.quiz.length };
  const letters = ['A','B','C','D','E'];
  let html = `<div class="quiz-container">`;
  data.quiz.forEach((q, qi) => {
    html += `<div class="quiz-question" id="quiz-q-${qi}">
      <div class="quiz-q-text"><span class="quiz-q-num">${qi+1}</span>${q.q}</div>
      <div class="quiz-options">`;
    q.options.forEach((opt, oi) => {
      html += `<div class="quiz-opt" id="quiz-opt-${qi}-${oi}" onclick="answerQuiz('${sessionId}',${qi},${oi})">
        <span class="quiz-opt-letter">${letters[oi]}</span>${opt}
      </div>`;
    });
    html += `</div>
      <div class="quiz-explanation" id="quiz-exp-${qi}">💡 ${q.explanation}</div>
    </div>`;
  });
  html += `<div id="quiz-score-box"></div></div>`;
  pane.innerHTML = html;
}

function answerQuiz(sessionId, qi, selected) {
  if (quizState.answered.has(qi)) return;
  quizState.answered.add(qi);

  const data = EXTRAS[sessionId].quiz[qi];
  const correct = data.correct;

  // Marcar opciones
  data.options.forEach((_, oi) => {
    const el = document.getElementById(`quiz-opt-${qi}-${oi}`);
    if (oi === correct) el.classList.add('correct', 'reveal-correct');
    if (oi === selected && selected !== correct) el.classList.add('incorrect');
    el.style.pointerEvents = 'none';
  });

  if (selected === correct) quizState.score++;

  // Mostrar explicación
  document.getElementById(`quiz-exp-${qi}`).classList.add('show');

  // Si respondió todo, mostrar score
  if (quizState.answered.size === quizState.total) {
    const pct = Math.round((quizState.score / quizState.total) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📖';
    document.getElementById('quiz-score-box').innerHTML = `
      <div class="quiz-score">
        <h3>${emoji} ${quizState.score} / ${quizState.total} correctas (${pct}%)</h3>
        <p>${pct >= 80 ? '¡Excelente dominio del tema!' : pct >= 60 ? 'Buen avance, repasa los puntos débiles.' : 'Te recomiendo revisar el contenido nuevamente.'}</p>
        <button class="quiz-btn" onclick="renderQuiz('${sessionId}')">🔄 Reintentar</button>
      </div>`;
    // Guardar score
    saveQuizScore(sessionId, quizState.score, quizState.total);
  }
}

// ============================================================
// VIÑETA CLÍNICA
// ============================================================
function renderVignette(sessionId) {
  const pane = document.getElementById('tab-caso');
  const data = EXTRAS[sessionId];
  if (!data || !data.vignette) { pane.innerHTML = ''; return; }

  const v = data.vignette;
  pane.innerHTML = `
    <div class="vignette-card">
      <div class="vignette-header">
        <h3>🏥 Caso Clínico — Viñeta de Integración</h3>
        <p>Lee el escenario, analiza y responde antes de ver la respuesta</p>
      </div>
      <div class="vignette-body">
        <div class="vignette-scenario">${v.text}</div>
        <div class="vignette-question">❓ ${v.question}</div>
        <button class="vignette-toggle" id="vignette-btn" onclick="toggleVignetteAnswer()">
          👁️ Mostrar respuesta
        </button>
        <div class="vignette-answer" id="vignette-answer">✅ ${v.answer}</div>
      </div>
    </div>`;
}

function toggleVignetteAnswer() {
  const ans = document.getElementById('vignette-answer');
  const btn = document.getElementById('vignette-btn');
  if (ans.classList.contains('show')) {
    ans.classList.remove('show');
    btn.textContent = '👁️ Mostrar respuesta';
  } else {
    ans.classList.add('show');
    btn.textContent = '🙈 Ocultar respuesta';
  }
}

// ============================================================
// HERRAMIENTAS CDSS — Soporte a la Decisión Clínica
// ============================================================
function showCalculator() {
  hideAllViews();
  document.getElementById('calc-view').style.display = 'block';
  clearNavActive();
  switchCDSSMode('interactions', document.querySelector('.cdss-mode.active') || document.querySelector('.cdss-mode'));
}

function switchCDSSMode(mode, el) {
  document.querySelectorAll('.cdss-mode').forEach(m => m.classList.remove('active'));
  if (el) el.classList.add('active');
  const area = document.getElementById('cdss-panel');

  if (mode === 'interactions') renderInteractionChecker(area);
  else if (mode === 'dosevalidator') renderDoseValidator(area);
  else if (mode === 'glasgow') renderGlasgow(area);
  else if (mode === 'cincinnati') {
    area.innerHTML = `<div class="calc-card" id="cdss-direct-panel"></div>`;
    renderBasicCalc(document.getElementById('cdss-direct-panel'), 'cincinnati');
  }
  else if (mode === 'gsa') {
    area.innerHTML = `<div class="calc-card" id="cdss-direct-panel"></div>`;
    renderBasicCalc(document.getElementById('cdss-direct-panel'), 'gsa');
  }
  else if (mode === 'calculos') renderCalculosSection(area);
  else if (mode === 'ges') renderGESAnexo(area);
}

// ── CHECKER DE INTERACCIONES ──
function renderInteractionChecker(area) {
  const drugList = getDrugList();
  const opts = drugList.map(d => `<option value="${d}">`).join('');
  area.innerHTML = `
    <div class="calc-card">
      <h3>⚠️ Checker de Interacciones Farmacológicas</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">Ingresa un fármaco nuevo y los medicamentos actuales del paciente. El sistema verificará interacciones y alergias cruzadas.</p>
      <datalist id="dl-drugs">${opts}</datalist>
      <div class="calc-form">
        <div class="calc-field">
          <label>Fármaco nuevo a administrar</label>
          <input type="text" id="cdss-new-drug" list="dl-drugs" placeholder="Ej: warfarina" autocomplete="off">
        </div>
        <div class="calc-field">
          <label>Medicamentos actuales (separados por coma)</label>
          <input type="text" id="cdss-current-meds" placeholder="Ej: aspirina, metformina, enalapril">
        </div>
        <div class="calc-field">
          <label>Alergias documentadas (separados por coma)</label>
          <input type="text" id="cdss-allergies" placeholder="Ej: penicilina, sulfonamidas">
        </div>
        <button class="vignette-toggle" onclick="runInteractionCheck()" style="margin-top:8px">🔍 Verificar interacciones</button>
      </div>
      <div id="cdss-interaction-results" style="margin-top:16px"></div>
    </div>`;
}

function runInteractionCheck() {
  const newDrug = document.getElementById('cdss-new-drug').value.trim();
  const medsRaw = document.getElementById('cdss-current-meds').value;
  const allergiesRaw = document.getElementById('cdss-allergies').value;
  const resultsEl = document.getElementById('cdss-interaction-results');

  if (!newDrug) { resultsEl.innerHTML = '<p style="color:#888">Ingresa el fármaco a verificar.</p>'; return; }

  const meds = medsRaw.split(',').map(s => s.trim()).filter(Boolean);
  const allergies = allergiesRaw.split(',').map(s => s.trim()).filter(Boolean);

  const alerts = checkInteractions(newDrug, meds, allergies);

  if (alerts.length === 0) {
    resultsEl.innerHTML = `
      <div class="cdss-alert-card cdss-safe">
        <div class="cdss-alert-icon">✅</div>
        <div><strong>Sin interacciones detectadas</strong>
        <p>No se encontraron interacciones entre <strong>${newDrug}</strong> y los medicamentos/alergias ingresados.</p>
        <p style="font-size:11px;color:#666;margin-top:6px">Nota: La base de datos cubre las interacciones más frecuentes en enfermería. Consulte siempre fuentes adicionales.</p></div>
      </div>`;
    return;
  }

  let html = '';
  alerts.forEach(a => {
    const sevClass = a.severity === 'critical' ? 'cdss-critical' : a.severity === 'major' ? 'cdss-major' : 'cdss-minor';
    const sevLabel = a.severity === 'critical' ? '🚫 CRÍTICA' : a.severity === 'major' ? '⚠️ MAYOR' : 'ℹ️ MENOR';
    const icon = a.type === 'allergy' ? '🧬' : '💊';
    html += `
      <div class="cdss-alert-card ${sevClass}">
        <div class="cdss-alert-header">
          <span class="cdss-sev-badge ${sevClass}">${sevLabel}</span>
          <span>${icon} ${a.pair[0]} + ${a.pair[1]}</span>
        </div>
        <div class="cdss-alert-body">
          <div><strong>Mecanismo:</strong> ${a.mechanism}</div>
          <div><strong>Efecto clínico:</strong> ${a.message}</div>
          <div class="cdss-recommendation"><strong>Recomendación:</strong> ${a.recommendation}</div>
        </div>
      </div>`;
  });
  resultsEl.innerHTML = html;
}

// ── VALIDADOR DE DOSIS ──
function renderDoseValidator(area) {
  const grouped = getDrugsByCategory();
  const catOrder = ['analgesicos_antiinflamatorios','antibioticos','anticoagulantes_antiplaquetarios',
    'cardiovascular_antihipertensivos','cardiovascular_antiarritmicos','cardiovascular_otros',
    'corticoides','diabetes_endocrino','diureticos','gastrointestinal',
    'neurologico_psiquiatrico','anticonvulsivantes','opioides_sedacion',
    'respiratorio','electrolitos_fluidos','antidotos_emergencia'];
  let opts = '';
  for (const cat of catOrder) {
    if (!grouped[cat]) continue;
    opts += `<optgroup label="${grouped[cat].label}">`;
    opts += grouped[cat].drugs.map(d => `<option value="${d}">${d.charAt(0).toUpperCase()+d.slice(1)}</option>`).join('');
    opts += '</optgroup>';
  }
  area.innerHTML = `
    <div class="calc-card">
      <h3>💊 Validador de Dosis con Ajuste Clínico</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">81 fármacos organizados por familia. Valida dosis según peso, edad y función renal (eGFR).</p>
      <div class="calc-form">
        <div class="calc-field">
          <label>Fármaco (por familia)</label>
          <select id="dv-drug" onchange="updateDoseRoutes()"><option value="">— Seleccionar fármaco —</option>${opts}</select>
        </div>
        <div class="calc-field">
          <label>Vía de administración</label>
          <select id="dv-route"><option value="">— Seleccionar fármaco primero —</option></select>
        </div>
        <div class="calc-field"><label>Dosis indicada</label><input type="number" id="dv-dose" step="any" placeholder="Ej: 1000"></div>
        <div class="calc-field"><label>Peso paciente (kg) — requerido para fármacos mg/kg</label><input type="number" id="dv-weight" step="any" placeholder="Ej: 70"></div>
        <div class="calc-field"><label>Edad (años)</label><input type="number" id="dv-age" step="1" placeholder="Ej: 72"></div>
        <div class="calc-field" id="dv-egfr-field" style="display:none"><label>eGFR (mL/min) — función renal <span style="color:#1a7a4a;font-size:11px">(ajuste renal para antibióticos)</span></label><input type="number" id="dv-egfr" step="any" placeholder="Ej: 45"></div>
        <button class="vignette-toggle" onclick="runDoseValidation()" style="margin-top:8px">🔍 Validar dosis</button>
      </div>
      <div id="cdss-dose-results" style="margin-top:16px"></div>
    </div>`;
}

function updateDoseRoutes() {
  const drug = document.getElementById('dv-drug').value;
  const routeSel = document.getElementById('dv-route');
  const routes = drug ? getRoutesForDrug(drug) : [];
  const routeLabels = {oral:'Oral', iv:'Intravenosa (IV)', im:'Intramuscular (IM)', sc:'Subcutánea (SC)', sl:'Sublingual (SL)', topical:'Tópica', inhalatoria:'Inhalatoria (puff/MDI)', nebulizacion:'Nebulización', transdermica:'Transdérmica (parche)'};
  routeSel.innerHTML = routes.length
    ? routes.map(r => `<option value="${r}">${routeLabels[r] || r}</option>`).join('')
    : '<option value="">Sin vías disponibles</option>';
  // Mostrar eGFR solo si el fármaco es antibiótico (ajuste renal relevante)
  const egfrField = document.getElementById('dv-egfr-field');
  if (egfrField) {
    const isAntibiotic = drug && DOSE_RULES[drug] && DOSE_RULES[drug]._category === 'antibioticos';
    egfrField.style.display = isAntibiotic ? '' : 'none';
    if (!isAntibiotic) document.getElementById('dv-egfr').value = '';
  }
}

function runDoseValidation() {
  const drug = document.getElementById('dv-drug').value;
  const route = document.getElementById('dv-route').value;
  const dose = parseFloat(document.getElementById('dv-dose').value);
  const weight = parseFloat(document.getElementById('dv-weight').value) || undefined;
  const age = parseFloat(document.getElementById('dv-age').value) || undefined;
  const egfr = parseFloat(document.getElementById('dv-egfr').value);
  const renalFn = isNaN(egfr) ? undefined : egfr;
  const el = document.getElementById('cdss-dose-results');

  if (!drug || !route) { el.innerHTML = '<p style="color:#888">Selecciona fármaco y vía.</p>'; return; }
  if (isNaN(dose) || dose <= 0) { el.innerHTML = '<p style="color:#888">Ingresa la dosis.</p>'; return; }

  const result = validateDose(drug, dose, route, weight, age, renalFn);

  const cls = result.valid ? 'cdss-safe' : (result.factors.some(f => f.includes('contraindicated') || f === 'weight_missing') ? 'cdss-critical' : 'cdss-major');
  const icon = result.valid ? '✅' : '🚫';
  let html = `<div class="cdss-alert-card ${cls}">
    <div class="cdss-alert-header"><span>${icon} ${result.message}</span></div>
    <div class="cdss-alert-body">`;

  if (result.suggestedRange) {
    html += `<div><strong>Rango sugerido:</strong> ${result.suggestedRange.min} — ${result.suggestedRange.max} ${result.suggestedRange.unit}</div>`;
  }
  if (result.factors.length > 0) {
    html += `<div><strong>Factores evaluados:</strong> ${result.factors.join(', ')}</div>`;
  }
  if (result.notes) {
    html += `<div class="cdss-recommendation"><strong>Nota clínica:</strong> ${result.notes}</div>`;
  }
  html += `</div></div>`;
  el.innerHTML = html;
}

// ── SCORES CLÍNICOS: GLASGOW ──
function renderGlasgow(area) {
  area.innerHTML = `
    <div class="calc-card">
      <h3>🧠 Escala de Glasgow (GCS)</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">Evaluación del nivel de conciencia. GCS ≤8 = asegurar vía aérea.</p>
      <div class="calc-form" style="max-width:500px">
        <div class="calc-field"><label>Apertura ocular (E)</label>
          <select id="gcs-eye">
            <option value="4">4 — Espontánea</option>
            <option value="3">3 — Al estímulo verbal</option>
            <option value="2">2 — Al dolor</option>
            <option value="1">1 — Sin apertura</option>
          </select>
        </div>
        <div class="calc-field"><label>Respuesta verbal (V)</label>
          <select id="gcs-verbal">
            <option value="5">5 — Orientado</option>
            <option value="4">4 — Confuso</option>
            <option value="3">3 — Palabras inapropiadas</option>
            <option value="2">2 — Sonidos incomprensibles</option>
            <option value="1">1 — Sin respuesta</option>
          </select>
        </div>
        <div class="calc-field"><label>Respuesta motora (M)</label>
          <select id="gcs-motor">
            <option value="6">6 — Obedece órdenes</option>
            <option value="5">5 — Localiza dolor</option>
            <option value="4">4 — Retira al dolor</option>
            <option value="3">3 — Flexión anormal (decorticación)</option>
            <option value="2">2 — Extensión (descerebración)</option>
            <option value="1">1 — Sin respuesta</option>
          </select>
        </div>
        <button class="vignette-toggle" onclick="runGlasgow()" style="margin-top:8px">📊 Calcular Glasgow</button>
      </div>
      <div id="cdss-gcs-results" style="margin-top:16px"></div>
    </div>`;
}

function runGlasgow() {
  const result = calculateGlasgow({
    eye: parseInt(document.getElementById('gcs-eye').value),
    verbal: parseInt(document.getElementById('gcs-verbal').value),
    motor: parseInt(document.getElementById('gcs-motor').value)
  });
  const cls = result.severity === 'severe' ? 'cdss-critical' : result.severity === 'moderate' ? 'cdss-major' : 'cdss-safe';
  const sevLabels = {severe:'SEVERO (≤8)', moderate:'MODERADO (9-12)', mild:'LEVE (13-15)'};
  document.getElementById('cdss-gcs-results').innerHTML = `
    <div class="cdss-alert-card ${cls}">
      <div class="cdss-alert-header">
        <span class="cdss-sev-badge ${cls}">GCS: ${result.total}/15 — ${sevLabels[result.severity]}</span>
      </div>
      <div class="cdss-alert-body">
        <div class="cdss-score-grid">
          <div class="cdss-score-item"><span class="cdss-score-label">Ocular (E)</span><span class="cdss-score-val">${result.eye}/4</span></div>
          <div class="cdss-score-item"><span class="cdss-score-label">Verbal (V)</span><span class="cdss-score-val">${result.verbal}/5</span></div>
          <div class="cdss-score-item"><span class="cdss-score-label">Motor (M)</span><span class="cdss-score-val">${result.motor}/6</span></div>
        </div>
        <div class="cdss-recommendation"><strong>Acción:</strong> ${result.recommendation}</div>
      </div>
    </div>`;
}

// ── SECCIÓN CÁLCULOS (agrupa las 5 calculadoras) ──
function renderCalculosSection(area) {
  area.innerHTML = `
    <div class="calc-card">
      <h3>🧮 Calculadoras Clínicas</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Herramientas de cálculo para dosificación, goteo, dilución, miliequivalentes, unidades internacionales, Escala Cincinnati y Gasometría.</p>
      <div class="cdss-modes" id="calc-sub-tabs" style="margin-bottom:16px;flex-wrap:wrap">
        <div class="cdss-mode active" onclick="switchCalcTab('mgkg',this)">🧮 mg/kg</div>
        <div class="cdss-mode" onclick="switchCalcTab('mlh',this)">💧 Goteo</div>
        <div class="cdss-mode" onclick="switchCalcTab('dilution',this)">💉 Dilución</div>
        <div class="cdss-mode" onclick="switchCalcTab('meq',this)">⚗️ mEq</div>
        <div class="cdss-mode" onclick="switchCalcTab('ui',this)">🔬 UI</div>
        <div class="cdss-mode" onclick="switchCalcTab('cincinnati',this)">🧠 Cincinnati</div>
        <div class="cdss-mode" onclick="switchCalcTab('gsa',this)">🫁 GSA</div>
      </div>
      <div id="calc-sub-panel"></div>
    </div>`;
  // Render default tab
  renderBasicCalc(document.getElementById('calc-sub-panel'), 'mgkg');
}

function switchCalcTab(mode, el) {
  document.querySelectorAll('#calc-sub-tabs .cdss-mode').forEach(m => m.classList.remove('active'));
  if (el) el.classList.add('active');
  renderBasicCalc(document.getElementById('calc-sub-panel'), mode);
}

// ── CALCULADORAS BÁSICAS (mg/kg, mL/h, dilución, mEq, UI) ──
function renderBasicCalc(area, mode) {
  const forms = {
    mgkg: `<h4 style="margin:0 0 12px">🧮 Cálculo mg/kg</h4>
      <div class="calc-form">
        <div class="calc-field"><label>Dosis indicada (mg/kg)</label><input type="number" id="calc-dose" step="any" placeholder="Ej: 15" oninput="calcMgKg()"></div>
        <div class="calc-field"><label>Peso del paciente (kg)</label><input type="number" id="calc-weight" step="any" placeholder="Ej: 70" oninput="calcMgKg()"></div>
        <div class="calc-field"><label>Frecuencia (horas entre dosis)</label><input type="number" id="calc-freq" step="any" placeholder="Ej: 8" oninput="calcMgKg()"></div>
      </div><div id="calc-basic-result" class="calc-result"></div>`,
    mlh: `<h4 style="margin:0 0 12px">💧 Cálculo mL/h (Goteo)</h4>
      <div class="calc-form">
        <div class="calc-field"><label>Volumen total (mL)</label><input type="number" id="calc-vol" step="any" placeholder="Ej: 500" oninput="calcMlH()"></div>
        <div class="calc-field"><label>Tiempo de infusión (horas)</label><input type="number" id="calc-time" step="any" placeholder="Ej: 4" oninput="calcMlH()"></div>
        <div class="calc-field"><label>Factor de goteo (gotas/mL)</label><input type="number" id="calc-factor" step="any" value="20" oninput="calcMlH()"></div>
      </div><div id="calc-basic-result" class="calc-result"></div>`,
    dilution: `<h4 style="margin:0 0 12px">💉 Cálculo de Dilución</h4>
      <div class="calc-form">
        <div class="calc-field"><label>Dosis deseada (mg)</label><input type="number" id="calc-desired" step="any" placeholder="Ej: 80" oninput="calcDilution()"></div>
        <div class="calc-field"><label>Concentración (mg/mL)</label><input type="number" id="calc-conc" step="any" placeholder="Ej: 10" oninput="calcDilution()"></div>
        <div class="calc-field"><label>Volumen final dilución (mL)</label><input type="number" id="calc-finalvol" step="any" placeholder="Ej: 100" oninput="calcDilution()"></div>
      </div><div id="calc-basic-result" class="calc-result"></div>`,

    meq: `<h4 style="margin:0 0 12px">⚗️ Conversor de Miliequivalentes (mEq)</h4>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Convierte entre mEq, mg y gramos. Selecciona el electrolito o ingresa peso atómico y valencia manualmente.</p>
      <div class="calc-form">
        <div class="calc-field"><label>Electrolito</label>
          <select id="meq-electrolyte" onchange="updateMeqFields()">
            <option value="">— Manual —</option>
            <option value="Na">Sodio (Na⁺) — PA: 23, Val: 1</option>
            <option value="K">Potasio (K⁺) — PA: 39.1, Val: 1</option>
            <option value="Ca">Calcio (Ca²⁺) — PA: 40.1, Val: 2</option>
            <option value="Mg">Magnesio (Mg²⁺) — PA: 24.3, Val: 2</option>
            <option value="Cl">Cloro (Cl⁻) — PA: 35.5, Val: 1</option>
            <option value="HCO3">Bicarbonato (HCO₃⁻) — PA: 61, Val: 1</option>
            <option value="NaCl">Cloruro de sodio (NaCl) — PM: 58.4</option>
            <option value="KCl">Cloruro de potasio (KCl) — PM: 74.5</option>
            <option value="CaCl2">Cloruro de calcio (CaCl₂) — PM: 111</option>
            <option value="MgSO4">Sulfato de magnesio (MgSO₄) — PM: 120.4</option>
            <option value="NaHCO3">Bicarbonato de sodio (NaHCO₃) — PM: 84</option>
            <option value="CaGluc">Gluconato de calcio (C₁₂H₂₂CaO₁₄) — PM: 430.4</option>
          </select>
        </div>
        <div class="calc-field"><label>Peso atómico/molecular (g/mol)</label><input type="number" id="meq-mw" step="any" placeholder="Ej: 39.1 para K⁺" oninput="calcMeq()"></div>
        <div class="calc-field"><label>Valencia (carga iónica)</label><input type="number" id="meq-val" step="1" value="1" placeholder="Ej: 1 para Na⁺, 2 para Ca²⁺" oninput="calcMeq()"></div>
        <hr style="border:none;border-top:1px dashed #ccc;margin:8px 0">
        <div class="calc-field"><label>Dirección de conversión</label>
          <select id="meq-dir" onchange="calcMeq()">
            <option value="meq2mg">mEq → mg / g</option>
            <option value="mg2meq">mg → mEq</option>
            <option value="g2meq">g → mEq</option>
          </select>
        </div>
        <div class="calc-field"><label>Cantidad</label><input type="number" id="meq-amount" step="any" placeholder="Ej: 40" oninput="calcMeq()"></div>
      </div>
      <div id="calc-basic-result" class="calc-result"></div>
      <div style="margin-top:12px;padding:10px;background:var(--bg-secondary);border-radius:8px;font-size:11px;color:var(--text-muted)">
        <strong>📐 Fórmulas:</strong><br>
        mEq = (mg × valencia) ÷ peso atómico<br>
        mg = (mEq × peso atómico) ÷ valencia<br>
        g = mg ÷ 1000<br><br>
        <strong>📋 Equivalencias frecuentes:</strong><br>
        • 1 g NaCl = 17.1 mEq Na⁺<br>
        • 1 g KCl = 13.4 mEq K⁺<br>
        • 1 amp KCl 10% (10 mL) = 13.4 mEq K⁺<br>
        • 1 amp CaGluc 10% (10 mL) = 4.65 mEq Ca²⁺<br>
        • 1 amp NaHCO₃ 8.4% (20 mL) = 20 mEq HCO₃⁻<br>
        • 1 amp MgSO₄ 25% (5 mL) = 10.4 mEq Mg²⁺
      </div>`,

    ui: `<h4 style="margin:0 0 12px">🔬 Conversor de Unidades Internacionales (UI)</h4>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Convierte entre UI y mg/mcg para fármacos con dosificación en Unidades Internacionales.</p>
      <div class="calc-form">
        <div class="calc-field"><label>Fármaco</label>
          <select id="ui-drug" onchange="calcUI()">
            <option value="">— Seleccionar —</option>
            <option value="insulina">Insulina (1 UI = 0.0347 mg = 34.7 mcg)</option>
            <option value="heparina">Heparina sódica (1 UI ≈ 0.01 mg = 10 mcg)</option>
            <option value="vitD">Vitamina D (1 UI = 0.025 mcg = 25 ng)</option>
            <option value="vitA">Vitamina A / Retinol (1 UI = 0.3 mcg retinol)</option>
            <option value="vitE">Vitamina E / α-tocoferol (1 UI = 0.67 mg)</option>
            <option value="vitK">Vitamina K (no tiene equivalencia UI estándar)</option>
            <option value="epo">Eritropoyetina (1 UI = 8.4 ng = 0.0084 mcg)</option>
            <option value="calcitonina">Calcitonina (1 UI = 0.2 mcg)</option>
            <option value="penicilina">Penicilina G (1 UI = 0.6 mcg = 0.0006 mg)</option>
          </select>
        </div>
        <div class="calc-field"><label>Dirección de conversión</label>
          <select id="ui-dir" onchange="calcUI()">
            <option value="ui2mg">UI → mg / mcg</option>
            <option value="mg2ui">mg → UI</option>
          </select>
        </div>
        <div class="calc-field"><label>Cantidad</label><input type="number" id="ui-amount" step="any" placeholder="Ej: 100" oninput="calcUI()"></div>
      </div>
      <div id="calc-basic-result" class="calc-result"></div>
      <div style="margin-top:12px;padding:10px;background:var(--bg-secondary);border-radius:8px;font-size:11px;color:var(--text-muted)">
        <strong>⚠️ Importante:</strong> Las UI NO son equivalentes entre fármacos distintos. 1 UI de insulina ≠ 1 UI de heparina.<br><br>
        <strong>📋 Conversiones clínicas frecuentes:</strong><br>
        • Insulina: 100 UI/mL (concentración estándar). 1 mL = 100 UI<br>
        • Heparina: ampollas de 5.000 UI/mL y 25.000 UI/5mL<br>
        • Vitamina D: 400 UI = 10 mcg. Déficit: 50.000 UI/sem<br>
        • Eritropoyetina: ampollas 2.000 / 4.000 / 10.000 UI<br>
        • Penicilina G: 1 millón UI = 600 mg
      </div>`,

    // ── ESCALA DE CINCINNATI ─────────────────────────────────
    cincinnati: `<h4 style="margin:0 0 8px">🧠 Escala Pre-Hospitalaria de Cincinnati (EPOHC)</h4>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px">Herramienta de detección rápida de AVE. <strong>1 hallazgo anormal</strong> = alta probabilidad de AVE → activar código. Sensibilidad 59%, especificidad 89% para AVE isquémico.</p>
      <div class="calc-form" style="max-width:560px">

        <div class="calc-field">
          <label>1️⃣ Asimetría facial — "Muestre los dientes o sonría"</label>
          <select id="cin-facial" onchange="runCincinnati()">
            <option value="">— Seleccionar —</option>
            <option value="0">Normal — ambos lados se mueven igual</option>
            <option value="1">Anormal — un lado no se mueve como el otro</option>
          </select>
        </div>

        <div class="calc-field">
          <label>2️⃣ Caída del brazo — "Extienda ambos brazos palmas arriba, cierre ojos, 10 segundos"</label>
          <select id="cin-arm" onchange="runCincinnati()">
            <option value="">— Seleccionar —</option>
            <option value="0">Normal — ambos brazos se mantienen o caen igual</option>
            <option value="1">Anormal — un brazo no se mueve o cae más rápido</option>
          </select>
        </div>

        <div class="calc-field">
          <label>3️⃣ Lenguaje / Habla — "Repita: El cielo es azul en Cincinnati"</label>
          <select id="cin-speech" onchange="runCincinnati()">
            <option value="">— Seleccionar —</option>
            <option value="0">Normal — palabras correctas, sin arrastre</option>
            <option value="1">Anormal — arrastre, palabras incorrectas, no habla</option>
          </select>
        </div>
      </div>
      <div id="calc-cincinnati-result" style="margin-top:16px"></div>
      <div style="margin-top:12px;padding:10px;background:var(--bg-secondary);border-radius:8px;font-size:11px;color:var(--text-muted)">
        <strong>🏥 Protocolo ante positivo:</strong> Activar código AVE · Hora de inicio síntomas (o última vez visto bien) · Contraindicaciones tPA · Traslado centro con ICP/trombectomía<br><br>
        <strong>Sensibilidad por hallazgo:</strong> Asimetría facial 74% · Caída brazo 70% · Lenguaje 80%<br>
        <strong>1 positivo:</strong> PPV 72% AVE. <strong>3 positivos:</strong> PPV &gt;85%<br><br>
        <em>Limitación: no detecta AVE posterior (cerebelo/tronco). Complementar con NIHSS en urgencias.</em>
      </div>`,

    // ── GASOMETRÍA ARTERIAL ──────────────────────────────────
    gsa: `<h4 style="margin:0 0 8px">🫁 Intérprete de Gasometría Arterial (GSA)</h4>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px">Ingresa los valores del análisis de gases en sangre arterial para obtener interpretación clínica paso a paso.</p>
      <div class="calc-form" style="max-width:560px">
        <div class="calc-field"><label>pH arterial</label><input type="number" id="gsa-ph" step="0.01" min="6.5" max="8.0" placeholder="Ej: 7.38" oninput="runGSA()"></div>
        <div class="calc-field"><label>pCO₂ (mmHg)</label><input type="number" id="gsa-pco2" step="0.1" min="10" max="120" placeholder="Ej: 40" oninput="runGSA()"></div>
        <div class="calc-field"><label>HCO₃ (mEq/L)</label><input type="number" id="gsa-hco3" step="0.1" min="5" max="60" placeholder="Ej: 24" oninput="runGSA()"></div>
        <div class="calc-field"><label>pO₂ (mmHg)</label><input type="number" id="gsa-po2" step="1" min="20" max="700" placeholder="Ej: 90" oninput="runGSA()"></div>
        <div class="calc-field"><label>FiO₂ (fracción O₂ inspirado)</label>
          <select id="gsa-fio2" onchange="runGSA()">
            <option value="0.21">0.21 — Aire ambiente (sin O₂ suplementario)</option>
            <option value="0.24">0.24 — Cánula nasal 1 L/min</option>
            <option value="0.28">0.28 — Cánula nasal 2 L/min</option>
            <option value="0.32">0.32 — Cánula nasal 3 L/min</option>
            <option value="0.36">0.36 — Cánula nasal 4 L/min</option>
            <option value="0.40">0.40 — Cánula nasal 5 L/min / Mascarilla simple</option>
            <option value="0.44">0.44 — Cánula nasal 6 L/min</option>
            <option value="0.50">0.50 — Mascarilla Venturi 50%</option>
            <option value="0.60">0.60 — Mascarilla Venturi 60%</option>
            <option value="1.00">1.00 — Mascarilla reservorio / VM 100%</option>
          </select>
        </div>
        <div class="calc-field"><label>Sodio sérico Na⁺ (mEq/L) — para anion gap</label><input type="number" id="gsa-na" step="1" min="100" max="180" placeholder="Ej: 140" oninput="runGSA()"></div>
        <div class="calc-field"><label>Cloro sérico Cl⁻ (mEq/L) — para anion gap</label><input type="number" id="gsa-cl" step="1" min="60" max="130" placeholder="Ej: 102" oninput="runGSA()"></div>
      </div>
      <div id="calc-gsa-result" style="margin-top:16px"></div>
      <div style="margin-top:12px;padding:10px;background:var(--bg-secondary);border-radius:8px;font-size:11px;color:var(--text-muted)">
        <strong>📋 Valores normales:</strong> pH 7.35-7.45 · pCO₂ 35-45 mmHg · HCO₃ 22-26 mEq/L · pO₂ 80-100 mmHg · SaO₂ &gt;95%<br>
        <strong>Anion Gap:</strong> Na⁺ − (Cl⁻ + HCO₃) = 8-12 mEq/L normal<br>
        <strong>MUDPILES (AG↑):</strong> Metanol · Uremia · DKA · Propilénglicol · Isoniazida · Láctico · Etanol · Salicilatos
      </div>`
  };
  area.innerHTML = forms[mode] || '';
}

function calcMgKg() {
  const dose = parseFloat(document.getElementById('calc-dose').value);
  const weight = parseFloat(document.getElementById('calc-weight').value);
  const freq = parseFloat(document.getElementById('calc-freq').value);
  const r = document.getElementById('calc-basic-result');
  if (!dose || !weight) { r.classList.remove('show'); return; }
  const totalDose = (dose * weight).toFixed(1);
  let txt = `💊 Dosis por toma: <strong>${totalDose} mg</strong>`;
  if (freq) { const daily = ((dose * weight * 24) / freq).toFixed(1); txt += `<br>📅 Dosis diaria: <strong>${daily} mg/día</strong> (c/${freq}h)`; }
  r.innerHTML = txt + `<small>mg/kg × peso = dosis por administración</small>`;
  r.classList.add('show');
}

function calcMlH() {
  const vol = parseFloat(document.getElementById('calc-vol').value);
  const time = parseFloat(document.getElementById('calc-time').value);
  const factor = parseFloat(document.getElementById('calc-factor').value) || 20;
  const r = document.getElementById('calc-basic-result');
  if (!vol || !time) { r.classList.remove('show'); return; }
  r.innerHTML = `💧 <strong>${(vol/time).toFixed(1)} mL/h</strong> · <strong>${((vol*factor)/(time*60)).toFixed(1)} gotas/min</strong> (factor ${factor})<small>Vol × factor ÷ (min) = gpm</small>`;
  r.classList.add('show');
}

function calcDilution() {
  const desired = parseFloat(document.getElementById('calc-desired').value);
  const conc = parseFloat(document.getElementById('calc-conc').value);
  const finalVol = parseFloat(document.getElementById('calc-finalvol').value);
  const r = document.getElementById('calc-basic-result');
  if (!desired || !conc) { r.classList.remove('show'); return; }
  const ml = (desired / conc).toFixed(2);
  let txt = `💉 Extraer: <strong>${ml} mL</strong>`;
  if (finalVol) { const dil = (finalVol - parseFloat(ml)).toFixed(1); txt += ` · Diluyente: <strong>${dil > 0 ? dil : 0} mL</strong>`; }
  r.innerHTML = txt + `<small>dosis ÷ concentración = volumen</small>`;
  r.classList.add('show');
}

// ── CONVERSOR mEq ──
const MEQ_DB = {
  'Na':    {name:'Sodio (Na⁺)', mw:23, val:1},
  'K':     {name:'Potasio (K⁺)', mw:39.1, val:1},
  'Ca':    {name:'Calcio (Ca²⁺)', mw:40.1, val:2},
  'Mg':    {name:'Magnesio (Mg²⁺)', mw:24.3, val:2},
  'Cl':    {name:'Cloro (Cl⁻)', mw:35.5, val:1},
  'HCO3':  {name:'Bicarbonato (HCO₃⁻)', mw:61, val:1},
  'NaCl':  {name:'Cloruro de sodio', mw:58.4, val:1},
  'KCl':   {name:'Cloruro de potasio', mw:74.5, val:1},
  'CaCl2': {name:'Cloruro de calcio', mw:111, val:2},
  'MgSO4': {name:'Sulfato de magnesio', mw:120.4, val:2},
  'NaHCO3':{name:'Bicarbonato de sodio', mw:84, val:1},
  'CaGluc':{name:'Gluconato de calcio', mw:430.4, val:2}
};

function updateMeqFields() {
  const sel = document.getElementById('meq-electrolyte').value;
  const mwEl = document.getElementById('meq-mw');
  const valEl = document.getElementById('meq-val');
  if (sel && MEQ_DB[sel]) {
    mwEl.value = MEQ_DB[sel].mw;
    valEl.value = MEQ_DB[sel].val;
  } else {
    mwEl.value = '';
    valEl.value = 1;
  }
  calcMeq();
}

function calcMeq() {
  const mw = parseFloat(document.getElementById('meq-mw').value);
  const val = parseFloat(document.getElementById('meq-val').value);
  const dir = document.getElementById('meq-dir').value;
  const amt = parseFloat(document.getElementById('meq-amount').value);
  const r = document.getElementById('calc-basic-result');
  if (!mw || !val || !amt) { r.classList.remove('show'); return; }

  let txt = '';
  if (dir === 'meq2mg') {
    const mg = (amt * mw) / val;
    const g = mg / 1000;
    txt = `⚗️ <strong>${amt} mEq</strong> = <strong>${mg.toFixed(2)} mg</strong> = <strong>${g.toFixed(4)} g</strong>`;
    txt += `<small>mEq × (PM ÷ valencia) = mg</small>`;
  } else if (dir === 'mg2meq') {
    const meq = (amt * val) / mw;
    txt = `⚗️ <strong>${amt} mg</strong> = <strong>${meq.toFixed(2)} mEq</strong>`;
    txt += `<small>(mg × valencia) ÷ PM = mEq</small>`;
  } else if (dir === 'g2meq') {
    const mg = amt * 1000;
    const meq = (mg * val) / mw;
    txt = `⚗️ <strong>${amt} g</strong> = <strong>${mg.toFixed(0)} mg</strong> = <strong>${meq.toFixed(2)} mEq</strong>`;
    txt += `<small>g × 1000 = mg → (mg × valencia) ÷ PM = mEq</small>`;
  }
  r.innerHTML = txt;
  r.classList.add('show');
}

// ── CONVERSOR UI ──
const UI_DB = {
  'insulina':   {name:'Insulina', factor:0.0347, unit:'mg', desc:'1 UI = 0.0347 mg = 34.7 mcg'},
  'heparina':   {name:'Heparina sódica', factor:0.01, unit:'mg', desc:'1 UI ≈ 0.01 mg = 10 mcg'},
  'vitD':       {name:'Vitamina D', factor:0.000025, unit:'mg', desc:'1 UI = 0.025 mcg'},
  'vitA':       {name:'Vitamina A', factor:0.0003, unit:'mg', desc:'1 UI = 0.3 mcg retinol'},
  'vitE':       {name:'Vitamina E', factor:0.67, unit:'mg', desc:'1 UI = 0.67 mg α-tocoferol'},
  'epo':        {name:'Eritropoyetina', factor:0.0000084, unit:'mg', desc:'1 UI = 8.4 ng'},
  'calcitonina':{name:'Calcitonina', factor:0.0002, unit:'mg', desc:'1 UI = 0.2 mcg'},
  'penicilina': {name:'Penicilina G', factor:0.0006, unit:'mg', desc:'1 UI = 0.6 mcg'}
};

function calcUI() {
  const drug = document.getElementById('ui-drug').value;
  const dir = document.getElementById('ui-dir').value;
  const amt = parseFloat(document.getElementById('ui-amount').value);
  const r = document.getElementById('calc-basic-result');

  if (!drug || !amt) { r.classList.remove('show'); return; }
  if (drug === 'vitK') {
    r.innerHTML = '⚠️ Vitamina K no tiene equivalencia UI estándar. Se prescribe directamente en mg (ej: 10 mg IV/IM).';
    r.classList.add('show');
    return;
  }

  const info = UI_DB[drug];
  if (!info) { r.classList.remove('show'); return; }

  let txt = '';
  if (dir === 'ui2mg') {
    const mg = amt * info.factor;
    if (mg >= 1) {
      txt = `🔬 <strong>${amt} UI</strong> de ${info.name} = <strong>${mg.toFixed(4)} mg</strong>`;
    } else if (mg >= 0.001) {
      txt = `🔬 <strong>${amt} UI</strong> de ${info.name} = <strong>${(mg*1000).toFixed(2)} mcg</strong> (${mg.toFixed(6)} mg)`;
    } else {
      txt = `🔬 <strong>${amt} UI</strong> de ${info.name} = <strong>${(mg*1000000).toFixed(2)} ng</strong> (${(mg*1000).toFixed(4)} mcg)`;
    }
  } else {
    const ui = amt / info.factor;
    txt = `🔬 <strong>${amt} mg</strong> de ${info.name} = <strong>${ui.toFixed(1)} UI</strong>`;
  }
  txt += `<small>${info.desc}</small>`;
  r.innerHTML = txt;
  r.classList.add('show');
}

// ============================================================
// CALCULADORA: ESCALA DE CINCINNATI
// ============================================================
function runCincinnati() {
  const facial = document.getElementById('cin-facial').value;
  const arm    = document.getElementById('cin-arm').value;
  const speech = document.getElementById('cin-speech').value;
  const r = document.getElementById('calc-cincinnati-result');
  if (facial === '' || arm === '' || speech === '') { r.innerHTML = ''; return; }

  const score = parseInt(facial) + parseInt(arm) + parseInt(speech);
  const items = [
    { label: 'Asimetría facial', val: parseInt(facial) },
    { label: 'Caída del brazo',  val: parseInt(arm)    },
    { label: 'Lenguaje/habla',   val: parseInt(speech) }
  ];

  const rows = items.map(i => {
    const color = i.val === 0 ? '#4ade80' : '#f87171';
    const icon  = i.val === 0 ? '✅' : '🚨';
    const txt   = i.val === 0 ? 'Normal' : 'ANORMAL';
    return `<tr><td style="padding:6px 10px">${icon} <strong>${i.label}</strong></td>
            <td style="padding:6px 10px;color:${color};font-weight:700">${txt}</td></tr>`;
  }).join('');

  let interpretation, colorBg, borderColor, actionHtml;

  if (score === 0) {
    interpretation = 'NEGATIVO — Baja probabilidad de AVE';
    colorBg = 'rgba(74,222,128,.08)';
    borderColor = '#4ade80';
    actionHtml = `<p style="font-size:13px;color:#b2f0d4">✅ Ningún hallazgo anormal. La escala de Cincinnati no sugiere AVE activo.
      Sin embargo, si la clínica es sugestiva (cefalea súbita, vértigo, diplopía), considerar evaluación neurológica.
      La escala tiene <strong>sensibilidad limitada para AVE posterior</strong> (cerebelo/tronco).</p>`;
  } else {
    interpretation = score === 1
      ? '⚠️ POSITIVO LEVE — 1 hallazgo anormal (PPV ≈72% AVE)'
      : score === 2
        ? '🚨 POSITIVO MODERADO — 2 hallazgos anormales (PPV ~80%)'
        : '🔴 POSITIVO ALTO — 3 hallazgos anormales (PPV >85%)';
    colorBg = 'rgba(248,113,113,.1)';
    borderColor = '#f87171';
    actionHtml = `
      <p style="font-size:13px;color:#fca5a5;margin-bottom:8px"><strong>ACTIVAR CÓDIGO AVE INMEDIATAMENTE</strong></p>
      <ul style="list-style:none;padding:0;margin:0;font-size:12px;color:#e8f1fb">
        <li>▸ Registrar <strong>hora exacta de inicio</strong> de síntomas (o última vez visto bien)</li>
        <li>▸ Evaluación neurológica urgente con <strong>NIHSS</strong></li>
        <li>▸ <strong>TAC cerebral sin contraste</strong> — descartar hemorragia antes de tPA</li>
        <li>▸ Si &lt;4.5 h y sin contraindicaciones → valorar <strong>tPA IV</strong> (alteplase 0.9 mg/kg)</li>
        <li>▸ Si NIHSS ≥6 → angiografía TAC → <strong>trombectomía mecánica</strong> (hasta 24 h con imagen)</li>
        <li>▸ Control PA: tolerar hasta <strong>220/120 mmHg</strong> sin tPA · &lt;185/110 mmHg si se administra tPA</li>
        <li>▸ NO dar aspirina hasta confirmar origen isquémico</li>
      </ul>`;
  }

  r.innerHTML = `
    <div style="border:2px solid ${borderColor};border-radius:12px;padding:16px;background:${colorBg}">
      <div style="font-size:18px;font-weight:700;color:${borderColor};margin-bottom:12px">${interpretation}</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:13px">
        <thead><tr style="border-bottom:1px solid rgba(255,255,255,.15)">
          <th style="text-align:left;padding:6px 10px;color:var(--text-muted)">Ítem evaluado</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text-muted)">Resultado</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="padding:10px;background:rgba(0,0,0,.2);border-radius:8px">${actionHtml}</div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-muted)">
        Puntuación: <strong>${score}/3 hallazgos anormales</strong> · Fecha/Hora evaluación: ${new Date().toLocaleString('es-CL')}
      </div>
    </div>`;
}

// ============================================================
// CALCULADORA: GASOMETRÍA ARTERIAL (GSA)
// ============================================================
function runGSA() {
  const ph   = parseFloat(document.getElementById('gsa-ph').value);
  const pco2 = parseFloat(document.getElementById('gsa-pco2').value);
  const hco3 = parseFloat(document.getElementById('gsa-hco3').value);
  const po2  = parseFloat(document.getElementById('gsa-po2').value);
  const fio2 = parseFloat(document.getElementById('gsa-fio2').value);
  const na   = parseFloat(document.getElementById('gsa-na').value);
  const cl   = parseFloat(document.getElementById('gsa-cl').value);
  const r    = document.getElementById('calc-gsa-result');

  if (isNaN(ph) || isNaN(pco2) || isNaN(hco3)) { r.innerHTML = ''; return; }

  // ── PASO 1: pH ───────────────────────────────────────────
  let phStatus, phColor;
  if      (ph < 7.35) { phStatus = 'ACIDEMIA (pH &lt; 7.35)';  phColor = '#f87171'; }
  else if (ph > 7.45) { phStatus = 'ALCALEMIA (pH &gt; 7.45)'; phColor = '#fbbf24'; }
  else                { phStatus = 'pH NORMAL (7.35-7.45)';    phColor = '#4ade80'; }

  // ── PASO 2: Trastorno primario ───────────────────────────
  let primary, primaryColor;
  const co2High = pco2 > 45, co2Low = pco2 < 35;
  const hco3High = hco3 > 26, hco3Low = hco3 < 22;

  if (ph < 7.35) {
    if (co2High && !hco3Low) primary = '🫁 Acidosis RESPIRATORIA (pCO₂↑)';
    else if (hco3Low && !co2High) primary = '🧪 Acidosis METABÓLICA (HCO₃↓)';
    else if (co2High && hco3Low) primary = '🔀 Trastorno MIXTO: Acidosis resp + metabólica';
    else primary = '🔀 Acidosis de origen indeterminado';
  } else if (ph > 7.45) {
    if (co2Low && !hco3High) primary = '🫁 Alcalosis RESPIRATORIA (pCO₂↓)';
    else if (hco3High && !co2Low) primary = '🧪 Alcalosis METABÓLICA (HCO₃↑)';
    else if (co2Low && hco3High) primary = '🔀 Trastorno MIXTO: Alcalosis resp + metabólica';
    else primary = '🔀 Alcalosis de origen indeterminado';
  } else {
    primary = '✅ Valores primarios en rango normal';
  }
  primaryColor = (primary.includes('MIXTO') || primary.includes('indeter')) ? '#fbbf24'
               : (primary.includes('Acido')) ? '#f87171'
               : (primary.includes('Alcalo')) ? '#fbbf24' : '#4ade80';

  // ── PASO 3: Compensación ────────────────────────────────
  let compensation = '';
  if      (hco3 < 22 && pco2 < 35) { // Acidosis met con compensación resp
    const expectedPco2 = 1.5 * hco3 + 8;
    const diff = Math.abs(pco2 - expectedPco2);
    compensation = `<li>▸ Acidosis metabólica: pCO₂ esperado (Winters) = <strong>${expectedPco2.toFixed(1)} ± 2 mmHg</strong>. Medido: ${pco2}. ${diff <= 2 ? '✅ Compensación adecuada' : '⚠️ Compensación inadecuada → posible trastorno mixto'}</li>`;
  } else if (hco3 > 26 && pco2 > 45) { // Alcalosis met con compensación resp
    const expectedPco2 = 0.7 * hco3 + 21;
    const diff = Math.abs(pco2 - expectedPco2);
    compensation = `<li>▸ Alcalosis metabólica: pCO₂ esperado = <strong>${expectedPco2.toFixed(1)} ± 2 mmHg</strong>. Medido: ${pco2}. ${diff <= 2 ? '✅ Compensación adecuada' : '⚠️ Compensación inadecuada → posible trastorno mixto'}</li>`;
  } else if (pco2 > 45 && hco3 > 26) { // Acidosis resp
    const expectedHco3acute = 24 + (pco2 - 40) / 10;
    const expectedHco3chronic = 24 + 3.5 * (pco2 - 40) / 10;
    compensation = `<li>▸ Acidosis respiratoria: HCO₃ esperado = <strong>${expectedHco3acute.toFixed(1)} mEq/L</strong> (aguda) / <strong>${expectedHco3chronic.toFixed(1)} mEq/L</strong> (crónica). Medido: ${hco3}.</li>`;
  } else if (pco2 < 35 && hco3 < 22) { // Alcalosis resp
    const expectedHco3acute = 24 - 2 * (40 - pco2) / 10;
    const expectedHco3chronic = 24 - 5 * (40 - pco2) / 10;
    compensation = `<li>▸ Alcalosis respiratoria: HCO₃ esperado = <strong>${expectedHco3acute.toFixed(1)} mEq/L</strong> (aguda) / <strong>${expectedHco3chronic.toFixed(1)} mEq/L</strong> (crónica). Medido: ${hco3}.</li>`;
  } else {
    compensation = `<li>▸ Sin compensación evidente o trastorno leve.</li>`;
  }

  // ── PASO 4: Anion Gap ───────────────────────────────────
  let agHtml = '';
  if (!isNaN(na) && !isNaN(cl)) {
    const ag = na - (cl + hco3);
    const agNorm = ag >= 8 && ag <= 12;
    agHtml = `<li>▸ <strong>Anion Gap (AG) = ${na} − (${cl} + ${hco3}) = <span style="color:${agNorm ? '#4ade80' : '#f87171'}">${ag.toFixed(1)} mEq/L</span></strong>
      ${agNorm ? '(Normal 8-12 mEq/L)' : ag > 12 ? '⚠️ AG ELEVADO — Causas MUDPILES: Metanol · Uremia · DKA · Propilénglicol · Isoniazida · Láctico · Etanol · Salicilatos'
                                                   : 'AG bajo (&lt;8) → hipoalbuminemia, mieloma, halogenosis'}</li>`;
  }

  // ── PASO 5: Oxigenación ──────────────────────────────────
  let oxHtml = '';
  if (!isNaN(po2) && !isNaN(fio2)) {
    const pafi = po2 / fio2;
    const gradAa = (fio2 * (760 - 47) - pco2 / 0.8) - po2;
    let pafiLabel, pafiColor;
    if      (pafi >= 300) { pafiLabel = 'Sin insuficiencia respiratoria';   pafiColor = '#4ade80'; }
    else if (pafi >= 200) { pafiLabel = 'IR leve / SDRA leve';              pafiColor = '#fbbf24'; }
    else if (pafi >= 100) { pafiLabel = '⚠️ IR moderada / SDRA moderado';  pafiColor = '#fb923c'; }
    else                  { pafiLabel = '🔴 IR grave / SDRA grave';         pafiColor = '#f87171'; }
    oxHtml = `
      <li>▸ <strong>pO₂/FiO₂ (PaFi) = ${pafi.toFixed(0)}</strong> — <span style="color:${pafiColor}">${pafiLabel}</span></li>
      <li>▸ <strong>Gradiente A-a = ${gradAa.toFixed(1)} mmHg</strong> ${gradAa <= 15 ? '(Normal ≤15 mmHg — hipoventilación pura)' : gradAa <= 35 ? '(Levemente ↑ — normal en adultos mayores)' : '(↑ Elevado — shunt, V/Q anómalo, difusión alterada)'}</li>`;
  }

  // ── Causas sugeridas ─────────────────────────────────────
  let causeHtml = '';
  if (hco3 < 22 && ph < 7.35) {
    causeHtml = `<div style="margin-top:8px;font-size:12px;color:#fca5a5">
      <strong>Causas frecuentes acidosis metabólica:</strong><br>
      AG↑: cetoacidosis diabética (DKA), acidosis láctica (sepsis/shock), IR grave, intoxicaciones.<br>
      AG normal (hiperclorémica): diarrea (pérdida HCO₃), acidosis tubular renal, NaCl en exceso.</div>`;
  } else if (hco3 > 26 && ph > 7.45) {
    causeHtml = `<div style="margin-top:8px;font-size:12px;color:#fde68a">
      <strong>Causas frecuentes alcalosis metabólica:</strong><br>
      Vómitos (pérdida HCl), diuréticos tiazídicos/asa (pérdida K⁺+H⁺), hiperaldosteronismo, alcalosis por contracción.</div>`;
  } else if (pco2 > 45 && ph < 7.35) {
    causeHtml = `<div style="margin-top:8px;font-size:12px;color:#fca5a5">
      <strong>Causas frecuentes acidosis respiratoria:</strong><br>
      EPOC exacerbado, sobredosis opiáceos/BZD, síndrome hipoventilación-obesidad, miastenia/Guillain-Barré, neumotórax.</div>`;
  } else if (pco2 < 35 && ph > 7.45) {
    causeHtml = `<div style="margin-top:8px;font-size:12px;color:#fde68a">
      <strong>Causas frecuentes alcalosis respiratoria:</strong><br>
      Hiperventilación ansiedad/dolor, hipoxemia compensatoria, sepsis temprana, ventilación mecánica excesiva, TEP.</div>`;
  }

  r.innerHTML = `
    <div style="border:2px solid #00c9a7;border-radius:12px;padding:16px;background:rgba(0,201,167,.06)">
      <div style="font-size:15px;font-weight:700;margin-bottom:12px">📋 Interpretación GSA — Paso a Paso</div>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;font-size:13px">
        <li>▸ <strong>Paso 1 — pH:</strong> <span style="color:${phColor}">${phStatus}</span></li>
        <li>▸ <strong>Paso 2 — Trastorno primario:</strong> <span style="color:${primaryColor}">${primary}</span></li>
        <li>▸ <strong>Paso 3 — Compensación:</strong></li>
        ${compensation}
        ${agHtml ? '<li>▸ <strong>Paso 4 — Anión Gap:</strong></li>' + agHtml : ''}
        ${oxHtml ? '<li>▸ <strong>Paso 5 — Oxigenación:</strong></li>' + oxHtml : ''}
      </ul>
      ${causeHtml}
      <div style="margin-top:12px;font-size:11px;color:var(--text-muted)">
        Valores ingresados → pH: ${ph} · pCO₂: ${pco2} · HCO₃: ${hco3}${!isNaN(po2) ? ' · pO₂: '+po2 : ''}${!isNaN(fio2) ? ' · FiO₂: '+fio2 : ''}
      </div>
    </div>`;
}

// ============================================================
// PROGRESO DE ESTUDIO (localStorage)
// ============================================================
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('crEnfProgress') || '{}');
  } catch(e) { return {}; }
}

function saveProgress(data) {
  try { localStorage.setItem('crEnfProgress', JSON.stringify(data)); } catch(e) {}
}

function trackVisit(sessionId) {
  const prog = getProgress();
  if (!prog.visits) prog.visits = {};
  if (!prog.visits[sessionId]) prog.visits[sessionId] = { count: 0, first: new Date().toISOString() };
  prog.visits[sessionId].count++;
  prog.visits[sessionId].last = new Date().toISOString();
  saveProgress(prog);
}

function saveQuizScore(sessionId, score, total) {
  const prog = getProgress();
  if (!prog.quizzes) prog.quizzes = {};
  if (!prog.quizzes[sessionId]) prog.quizzes[sessionId] = [];
  prog.quizzes[sessionId].push({ score, total, date: new Date().toISOString() });
  saveProgress(prog);
}

function showProgress() {
  hideAllViews();
  document.getElementById('progress-view').style.display = 'block';
  clearNavActive();

  const prog = getProgress();
  const visits = prog.visits || {};
  const quizzes = prog.quizzes || {};

  // Contar total de sesiones
  let totalSessions = 0;
  let allSessions = [];
  ['farm','fisio'].forEach(subj => {
    APP_DATA[subj].units.forEach(unit => {
      unit.sessions.forEach(s => {
        totalSessions++;
        allSessions.push({ id: s.id, title: s.title, subject: subj });
      });
    });
  });

  const visitedCount = Object.keys(visits).length;
  const pct = totalSessions > 0 ? Math.round((visitedCount / totalSessions) * 100) : 0;

  // Mejor quiz
  let bestQuiz = 0;
  let quizCount = 0;
  Object.values(quizzes).forEach(arr => {
    arr.forEach(q => {
      quizCount++;
      const s = Math.round((q.score / q.total) * 100);
      if (s > bestQuiz) bestQuiz = s;
    });
  });

  let html = `
    <div class="progress-bar-container">
      <div class="progress-stat">
        <div class="ps-val">${visitedCount}/${totalSessions}</div>
        <div class="ps-label">Sesiones visitadas</div>
        <div class="progress-meter"><div class="progress-meter-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="progress-stat">
        <div class="ps-val">${pct}%</div>
        <div class="ps-label">Progreso general</div>
      </div>
      <div class="progress-stat">
        <div class="ps-val">${quizCount}</div>
        <div class="ps-label">Quizzes respondidos</div>
      </div>
      <div class="progress-stat">
        <div class="ps-val">${bestQuiz}%</div>
        <div class="ps-label">Mejor score quiz</div>
      </div>
    </div>`;

  // Mapa visual de sesiones
  ['farm','fisio'].forEach(subj => {
    const label = subj === 'farm' ? '💊 Farmacología' : '🫀 Fisiopatología';
    html += `<div class="card"><h3>${label}</h3><div class="progress-sessions">`;
    APP_DATA[subj].units.forEach(unit => {
      unit.sessions.forEach((s, i) => {
        const visited = visits[s.id] ? 'visited' : '';
        const count = visits[s.id] ? visits[s.id].count : 0;
        const short = s.title.substring(0, 3).toUpperCase();
        html += `<div class="progress-dot ${visited}" onclick="loadSession('${s.id}','${subj}')" title="${s.title} (${count} visitas)">${short}</div>`;
      });
    });
    html += `</div></div>`;
  });

  // Historial de quizzes
  if (quizCount > 0) {
    html += `<div class="card"><h3>📝 Historial de Quizzes</h3><table class="comp-table"><thead><tr><th>Sesión</th><th>Score</th><th>Fecha</th></tr></thead><tbody>`;
    Object.entries(quizzes).forEach(([sid, arr]) => {
      const found = findSession(sid);
      const title = found ? found.session.title : sid;
      arr.slice(-5).reverse().forEach(q => {
        const d = new Date(q.date);
        const dateStr = d.toLocaleDateString('es-CL');
        const scorePct = Math.round((q.score / q.total) * 100);
        const color = scorePct >= 80 ? '#16a34a' : scorePct >= 60 ? '#d97706' : '#dc2626';
        html += `<tr><td>${title}</td><td style="font-weight:700;color:${color}">${q.score}/${q.total} (${scorePct}%)</td><td>${dateStr}</td></tr>`;
      });
    });
    html += `</tbody></table></div>`;
  }

  document.getElementById('progress-content').innerHTML = html;
}

// ============================================================
// ANEXO GES — Garantías Explícitas de Salud (Chile)
// Fuente: Decreto GES vigente MINSAL. Contexto académico ENF UDP.
// ============================================================

const GES_DATA = [
  // ── CARDIOVASCULAR ──────────────────────────────────────────
  {
    id:'ges-hta', sistema:'❤️ Cardiovascular', nombre:'Hipertensión Arterial',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'PA sistólica ≥140 mmHg o diastólica ≥90 mmHg en adultos. GES garantiza diagnóstico, tratamiento farmacológico y control periódico.',
    fisio:'Disfunción endotelial, ↑resistencia vascular periférica, activación SRAA/SNS. Complicaciones: IC, ERC, ACV, retinopatía.',
    farmaco:'IECA/ARA II (primera línea), tiazidas, amlodipino, atenolol. Metas: <130/80 en DM/ERC.',
    enfermeria:'Control adherencia, AMPA, educación DASH, restricción sodio <2 g/día, derivación oportuna.'
  },
  {
    id:'ges-iam', sistema:'❤️ Cardiovascular', nombre:'Infarto Agudo al Miocardio (IAM)',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Urgencia / UCI',
    descripcion:'Necrosis miocárdica por oclusión coronaria (trombo sobre placa ateromatosa). GES garantiza reperfusión (trombólisis o PCI) dentro de plazos definidos.',
    fisio:'Ruptura placa → trombosis → isquemia → necrosis. Zona de penumbra isquémica: isquemia reversible en primeras horas. Enzimas: CK-MB y Troponina I/T.',
    farmaco:'AAS + clopidogrel, heparina, βbloqueadores, IECA, estatinas. Alteplase en STEMI si no hay PCI <2h.',
    enfermeria:'Monitoreo ECG continuo, acceso venoso, O₂ si SatO₂<90%, administrar AAS 300 mg si no contraindicado, preparar para cateterismo.'
  },
  {
    id:'ges-ic', sistema:'❤️ Cardiovascular', nombre:'Insuficiencia Cardíaca (IC)',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Primario / Secundario / Terciario',
    descripcion:'Incapacidad del corazón de mantener el gasto cardíaco. GES cubre IC sistólica (FE<40%). Más prevalente en >65 años.',
    fisio:'↓GC → activación SRAA+SNS → retención Na⁺/H₂O → congestión venosa. IC-FER vs IC-FEP. Clasificación NYHA I-IV.',
    farmaco:'IECA o sacubitrilo-valsartán, βbloqueadores, espironolactona, diuréticos de asa (furosemida), SGLT2 inhibidores.',
    enfermeria:'Control diario de peso (alerta >1 kg/día), balance hídrico, posición semisentada, monitoreo SpO₂ y disnea.'
  },
  {
    id:'ges-fa', sistema:'❤️ Cardiovascular', nombre:'Fibrilación Auricular (FA)',
    ges:'Desde 2022 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Arritmia supraventricular más frecuente. GES garantiza diagnóstico, manejo agudo y anticoagulación crónica.',
    fisio:'Actividad eléctrica auricular caótica → pérdida de contracción auricular → estasis sanguínea → riesgo de embolismo. CHADS₂-VASc para estratificación.',
    farmaco:'Anticoagulación: warfarina (INR 2-3) o DOAC (apixabán, rivaroxabán). Control FC: βbloqueadores, diltiazem. Cardioversión: amiodarona.',
    enfermeria:'Monitoreo pulso y ECG, control INR si warfarina, educar sobre signos de sangrado, toma diaria de anticoagulante.'
  },
  {
    id:'ges-tep', sistema:'❤️ Cardiovascular', nombre:'Tromboembolismo Pulmonar (TEP)',
    ges:'No GES específico · Alta urgencia', nivel:'Urgencia / UCI',
    descripcion:'Obstrucción arterial pulmonar por trombo (generalmente proveniente de TVP). Alta mortalidad si no se trata a tiempo.',
    fisio:'Obstrucción → ↑presión arteria pulmonar → IC derecha aguda → ↓GC → hipoxemia. Score de Wells y D-dímero para diagnóstico.',
    farmaco:'Heparina no fraccionada EV inmediata, LMWH, anticoagulantes orales a largo plazo. Trombólisis en TEP masivo (rtPA).',
    enfermeria:'Posición semisentada, O₂ alto flujo, acceso venoso, monitoreo continuo, preparar heparina, evaluar signos de IC derecha.'
  },
  // ── RESPIRATORIO ────────────────────────────────────────────
  {
    id:'ges-asma', sistema:'🫁 Respiratorio', nombre:'Asma Bronquial',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Inflamación crónica de la vía aérea con hiperreactividad bronquial. GES cubre desde los 3 años. Tratamiento paso a paso según GINA.',
    fisio:'Inflamación eosinofílica (IgE-mediada) → broncoespasmo, edema, hipersecreción mucosa → obstrucción reversible. Espirometría: patrón obstructivo reversible.',
    farmaco:'SABA (salbutamol) de rescate. ICS (budesonida, fluticasona) como controlador. ICS/LABA en moderado-severo. Montelukast. Anti-IgE (omalizumab) en severo.',
    enfermeria:'Técnica inhaladora, Peak-Flow, identifica triggers, plan de acción escrito, evitar AAS en sensibles.'
  },
  {
    id:'ges-epoc', sistema:'🫁 Respiratorio', nombre:'EPOC',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Obstrucción crónica del flujo aéreo no totalmente reversible. GES garantiza espirometría diagnóstica y tratamiento. Principal causa: tabaquismo.',
    fisio:'Inflamación neutrofílica → destrucción alveolar (enfisema) + hipersecreción mucosa (bronquitis crónica) → atrapamiento aéreo, IR tipo I/II. GOLD I-IV.',
    farmaco:'SABA/SAMA de rescate. LABA + LAMA (doble broncodilatación). ICS en exacerbaciones frecuentes. O₂ crónico si PaO₂<55 mmHg.',
    enfermeria:'Cese tabáquico urgente, rehabilitación pulmonar, vacunas (influenza anual, neumocócica), técnica inhaladora, oxímetro domiciliario.'
  },
  {
    id:'ges-neumonia', sistema:'🫁 Respiratorio', nombre:'Neumonía del Adulto',
    ges:'Desde 2007 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Infección aguda del parénquima pulmonar. GES garantiza diagnóstico (Rx tórax) y tratamiento ATB dentro de 4 horas en hospitalizados.',
    fisio:'Invasión alveolar → respuesta inflamatoria → exudado alveolar → consolidación → ↓V/Q → hipoxemia. Score PSI/CURB-65 para hospitalización.',
    farmaco:'NAC: amoxicilina o amoxicilina-clavulánico VO. Neumonía grave: cefalosporina 3ª + macrólido. SARM: vancomicina. Hospitalización: vía EV.',
    enfermeria:'Posición Fowler, O₂ si SpO₂<92%, hidratación EV, control de temperatura, administrar ATB dentro del plazo GES, fisioterapia respiratoria.'
  },
  // ── ENDOCRINO / METABÓLICO ──────────────────────────────────
  {
    id:'ges-dm2', sistema:'🔬 Endocrino / Metabólico', nombre:'Diabetes Mellitus Tipo 2 (DM2)',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Trastorno metabólico por resistencia a la insulina y disfunción de célula β. GES cubre >15 años. Meta HbA1c <7%. Más de 1 millón de pacientes en Chile.',
    fisio:'RI en músculo/hígado/tejido adiposo → hiperglucemia crónica → glicosilación proteica → daño micro/macrovascular (nefropatía, retinopatía, neuropatía, ACV, IAM).',
    farmaco:'Metformina (primera línea). iSGLT2 (empagliflozina) y arGLP-1 (semaglutida) con beneficio CV. Insulina en falla oral. Objetivo HbA1c personalizado.',
    enfermeria:'Educación automanejo, pie diabético, automonitoreo de glicemia, inyección insulina, hipoglicemia: 15 g CHO, DAFO.'
  },
  {
    id:'ges-dm1', sistema:'🔬 Endocrino / Metabólico', nombre:'Diabetes Mellitus Tipo 1 (DM1)',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Primario / Secundario / Terciario',
    descripcion:'Destrucción autoinmune de célula β → déficit absoluto de insulina. GES cubre todos los grupos etarios. Requiere insulinoterapia de por vida.',
    fisio:'Ataque autoinmune mediado por LT CD8 → apoptosis célula β → insulinopenia → CAD si no insulinoterapia. Péptido C indetectable en DM1.',
    farmaco:'Insulinas basales (glargina, detemir) + bolo (lispro, aspártica). Ratio basal:bolo 50:50. Bomba insulina en casos seleccionados.',
    enfermeria:'Cetoacidosis diabética: sospecha con vómitos + glucosa alta. ABC, hidratación EV, insulina EV, corregir K⁺ antes de insulina.'
  },
  {
    id:'ges-hipotir', sistema:'🔬 Endocrino / Metabólico', nombre:'Hipotiroidismo',
    ges:'Desde 2005 (hipotiroides congénito y embarazo) · Decreto 44/2022', nivel:'Primario',
    descripcion:'Déficit de hormonas tiroideas. GES cubre hipotiroidismo congénito (tamizaje neonatal) e hipotiroidismo en embarazo. Causa más común: Hashimoto.',
    fisio:'↓T3/T4 → ↑TSH → ↑TRH. Manifestaciones: bradicardia, intolerancia al frío, constipación, mixedema, bradipsiquia. Coma mixedematoso: emergencia.',
    farmaco:'Levotiroxina (LT4) VO en ayunas. Meta TSH 0.5-2.5 mIU/L en embarazo. Interacción con calcio, hierro, IBP (↓absorción).',
    enfermeria:'Administrar LT4 en ayunas, control TSH semestral, reconocer mixedema (hipotermia, bradipnea, alteración consciencia).'
  },
  // ── RENAL ───────────────────────────────────────────────────
  {
    id:'ges-erc', sistema:'🫘 Renal / Urológico', nombre:'Enfermedad Renal Crónica (ERC)',
    ges:'Desde 2010 · Decreto 44/2022', nivel:'Primario / Secundario / Terciario',
    descripcion:'TFG <60 mL/min/1.73m² o daño renal >3 meses. GES cubre estadios 3b-5 y diálisis. Causas principales en Chile: DM2 e HTA.',
    fisio:'Reducción nefronal → hiperfiltración compensadora → esclerosis progresiva → ↓TFG. Consecuencias: anemia (↓EPO), hiperK⁺, acidosis metabólica, HTP secundaria, osteodistrofia.',
    farmaco:'IECA/ARA II (nefroprotección), eritropoyetina recombinante, vitamina D activa, resinas de intercambio iónico (kayexalato), quelantes de fósforo.',
    enfermeria:'Diálisis: cuidado fístula AV, control de peso interdialítico, restricción K⁺/P, balance hídrico, acceso venoso en brazo opuesto a fístula.'
  },
  {
    id:'ges-itu', sistema:'🫘 Renal / Urológico', nombre:'Infección del Tracto Urinario (ITU)',
    ges:'GES parcial (ITU en embarazo) · Decreto 44/2022', nivel:'Primario',
    descripcion:'Infección bacteriana del tracto urinario bajo (cistitis) o alto (pielonefritis). Alta prevalencia en mujeres. En embarazo: riesgo de parto prematuro.',
    fisio:'Ascenso bacteriano (E. coli 80%) → inflamación urotélio → disuria, polaquiuria, urgencia. Pielonefritis: fiebre, puñopercusión, bacteriemia posible.',
    farmaco:'Cistitis no complicada: nitrofurantoína o fosfomicina 3 días. Pielonefritis: ciprofloxacino 7 días. Embarazo: amoxicilina-clavulánico o cefalosporinas.',
    enfermeria:'Hidratación abundante, higiene perineal, urocultivo antes del ATB, completar tratamiento, seguimiento postratamiento en embarazadas.'
  },
  // ── NEUROLÓGICO ─────────────────────────────────────────────
  {
    id:'ges-avei', sistema:'🧠 Neurológico', nombre:'ACV Isquémico (AVE)',
    ges:'Desde 2013 · Decreto 44/2022', nivel:'Urgencia / Unidad AVC',
    descripcion:'Déficit neurológico focal por oclusión arterial cerebral. GES garantiza reperfusión con tPA EV <4.5h e ingreso a unidad AVC. Tiempo es cerebro.',
    fisio:'Trombo/émbolo → isquemia → zona de penumbra (recuperable en horas) → necrosis si no reperfusión. Excitotoxicidad por glutamato. Score NIHSS.',
    farmaco:'Alteplase 0.9 mg/kg EV dentro de 4.5h (criterios estrictos). Trombectomía mecánica <6-24h en grandes vasos. AAS post-tPA a las 24h.',
    enfermeria:'Escala Cincinnati (PFH), activar código AVC, NO baje PA si no >185/110, monitoreo neurovascular cada 15min, glicemia, temperatura.'
  },
  {
    id:'ges-epilepsia', sistema:'🧠 Neurológico', nombre:'Epilepsia',
    ges:'Desde 2015 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Trastorno caracterizado por ≥2 crisis epilépticas no provocadas. GES garantiza acceso a antiepilépticos y especialista. Afecta ~1% población.',
    fisio:'Hiperactividad neuronal sincrónica → crisis. Tipos: focal (consciencia preservada o alterada), generalizada (ausencia, tónico-clónica, mioclónica). EEG diagnóstico.',
    farmaco:'Fármacos de primera línea: valproato (generalizada), lamotrigina, carbamazepina (focal). Status epilepticus: diacepam/lorazepam EV + fenitoína/levetiracetam.',
    enfermeria:'Crisis: posición lateral de seguridad, NO introducir nada en boca, proteger de golpes, cronometrar, O₂, vía venosa post-crisis, registro detallado.'
  },
  {
    id:'ges-alzheimer', sistema:'🧠 Neurológico', nombre:'Demencia / Alzheimer',
    ges:'Desde 2016 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Síndrome de deterioro cognitivo progresivo. Alzheimer representa 60-70%. GES garantiza diagnóstico, tratamiento y apoyo al cuidador en >65 años.',
    fisio:'Depósitos de Aβ (placas seniles) y proteína Tau hiperfosforilada (ovillos neurofibrilares) → muerte neuronal colinérgica → atrofia hipocampo y corteza.',
    farmaco:'Inhibidores AChE: donepezilo, rivastigmina (moderada eficacia). Memantina en estadios moderado-grave. Sin tratamiento modificador de enfermedad aprobado actualmente.',
    enfermeria:'Seguridad del entorno, rutinas estables, comunicación adaptada, prevención caídas, apoyo familia/cuidador, evaluación MMSE periódica.'
  },
  {
    id:'ges-parkinson', sistema:'🧠 Neurológico', nombre:'Parkinson',
    ges:'Desde 2016 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Trastorno neurodegenerativo con pérdida de neuronas dopaminérgicas en sustancia nigra. GES garantiza tratamiento farmacológico y kinesiología.',
    fisio:'↓Dopamina → desequilibrio DA/Ach en ganglios basales → temblor en reposo (4-6 Hz), rigidez en rueda dentada, bradicinesia, inestabilidad postural. Cuerpos de Lewy (α-sinucleína).',
    farmaco:'Levodopa + carbidopa (más eficaz). Agonistas DA: pramipexol, ropinirol. IMAO-B: selegilina, rasagilina. MAO-B para fases iniciales.',
    enfermeria:'Administrar levodopa 30-45 min antes de comidas, reconocer síndrome hipercinético (discinesias), prevención caídas, rehabilitación motora y del habla.'
  },
  // ── HEMATOLÓGICO / ONCOLÓGICO ───────────────────────────────
  {
    id:'ges-ca-mama', sistema:'🎗️ Oncológico', nombre:'Cáncer de Mama',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Neoplasia maligna más frecuente en mujeres chilenas. GES garantiza diagnóstico dentro de 15 días y tratamiento dentro de 30 días. Cribado: mamografía 50-69 años.',
    fisio:'Proliferación descontrolada epitelio ductal/lobulillar. Subtipos moleculares: Luminal A/B (RE+), HER2+, Triple negativo. Metástasis óseas, pulmonares, hepáticas.',
    farmaco:'Según subtipo: cirugía + radioterapia + quimioterapia (AC→T) + hormonoterapia (tamoxifeno, letrozol) + trastuzumab si HER2+. CDK4/6 inhibidores en metastásico.',
    enfermeria:'Manejo PICC/catéter venoso central, cuidado náuseas/mucositis, linfedema post-mastectomía, apoyo emocional, enseñar autoexamen.'
  },
  {
    id:'ges-ca-cervix', sistema:'🎗️ Oncológico', nombre:'Cáncer Cervicouterino',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Neoplasia maligna del cuello uterino, 99% asociada a VPH. GES garantiza tratamiento dentro de 30 días. Cribado: Papanicolaou cada 3 años (25-64 años).',
    fisio:'VPH oncogénico (16, 18) → integración viral → inhibición p53/Rb → transformación maligna epitelio escamoso. Progresión NIC I→II→III→carcinoma invasor (años).',
    farmaco:'Estadios tempranos: cirugía (histerectomía radical). Estadios avanzados: cisplatino + radioterapia concomitante. Vacuna VPH preventiva (Gardasil/Cervarix).',
    enfermeria:'Educación sexual, promover vacunación VPH adolescentes, apoyo psicoemocional, cuidado post-histerectomía, signos de fístula vesicovaginal.'
  },
  {
    id:'ges-ca-colon', sistema:'🎗️ Oncológico', nombre:'Cáncer Colorrectal',
    ges:'Desde 2010 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Segunda causa de muerte por cáncer en Chile. GES garantiza diagnóstico y tratamiento. Factores de riesgo: dieta occidental, obesidad, tabaco, antecedentes familiares.',
    fisio:'Secuencia adenoma → carcinoma (10-15 años). Mutaciones: APC, KRAS, p53. Metástasis hepáticas y pulmonares frecuentes. Marcador: CEA (seguimiento).',
    farmaco:'Cirugía resectiva (colectomía). QT adyuvante: FOLFOX (5-FU + leucovorín + oxaliplatino). Bevacizumab (anti-VEGF) en metastásico. Cetuximab si KRAS wild-type.',
    enfermeria:'Cuidado ostomía (colostomía/ileostomía), prevención ileo paralítico, control herida, nutricional post-cirugía, educación al paciente ostomizado.'
  },
  {
    id:'ges-ca-prostata', sistema:'🎗️ Oncológico', nombre:'Cáncer de Próstata',
    ges:'Desde 2015 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Neoplasia maligna más frecuente en hombres chilenos. GES garantiza tratamiento dentro de 30 días. Cribado: PSA + tacto rectal >50 años (o >40 en riesgo).',
    fisio:'Adenocarcinoma glándula prostática (zona periférica 70%). Score Gleason para gradificación. Metástasis óseas líticas/blásticas. Dependiente de andrógenos.',
    farmaco:'Localizado bajo riesgo: vigilancia activa o prostatectomía radical. Hormono-sensible: LHRH agonistas (leuprolida) + antiandrógenos. Quimio: docetaxel en RCR.',
    enfermeria:'Cuidado post-prostatectomía: incontinencia urinaria (Kegel), disfunción eréctil, complicaciones DVT, manejo catéter vesical, PSA periódico.'
  },
  {
    id:'ges-linfoma', sistema:'🎗️ Oncológico', nombre:'Linfoma (Hodgkin / No Hodgkin)',
    ges:'Desde 2015 · Decreto 44/2022', nivel:'Terciario',
    descripcion:'Neoplasia del tejido linfoide. LH: más frecuente en jóvenes, alta curabilidad. LNH: grupo heterogéneo, distinto pronóstico. GES garantiza tratamiento.',
    fisio:'LH: células de Reed-Sternberg (CD15+/CD30+). LNH: B (DLBCL, folicular) o T. Estadificación Ann Arbor I-IV. B síntomas: fiebre, sudoración nocturna, baja de peso >10%.',
    farmaco:'LH: ABVD (doxorrubicina, bleomicina, vinblastina, dacarbazina). DLBCL: R-CHOP (rituximab + CHOP). Trasplante autólogo en recaída.',
    enfermeria:'Profilaxis infecciones (neutropenia febril), mucositis, manejo PICC, fatiga oncológica, reconocer síndrome de lisis tumoral (hiperK⁺, hiperúrico, ↑Cr).'
  },
  // ── DIGESTIVO / HEPÁTICO ─────────────────────────────────────
  {
    id:'ges-cirr', sistema:'🫁 Digestivo / Hepático', nombre:'Cirrosis Hepática y DHC',
    ges:'No GES específico · Alto impacto', nivel:'Secundario / Terciario',
    descripcion:'Fibrosis hepática difusa con nódulos regenerativos. En Chile: causa principal es alcohol. Complicaciones: ascitis, encefalopatía, HTP, HDA variceal.',
    fisio:'Necrosis hepatocitaria → fibrosis → ↑resistencia portal → HTP (>12 mmHg) → várices esofágicas + circulación hiperdinámica. Child-Pugh y MELD para pronóstico.',
    farmaco:'Propranolol (profilaxis variceal), furosemida + espironolactona (ascitis), rifaximina + lactulosa (EH), norfloxacino (PBE). Trasplante hepático en estadios terminales.',
    enfermeria:'Balance hídrico estricto, pesaje diario, restricción sodio, evaluación encefalopatía (asterixis, orientación), evitar AINEs/sedantes, cuidado piel.'
  },
  {
    id:'ges-hepatitisb', sistema:'🫁 Digestivo / Hepático', nombre:'Hepatitis B Crónica',
    ges:'Desde 2015 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Infección crónica por VHB (>6 meses). GES garantiza diagnóstico y tratamiento antiviral. Riesgo de cirrosis y CHC. Vacuna VHB en Programa Nacional.',
    fisio:'VHB (ADN) → hepatocito → respuesta inmune → inflamación crónica → fibrosis. Marcadores: HBsAg, Anti-HBc, HBeAg, carga viral. Reactivación en inmunosuprimidos.',
    farmaco:'Tenofovir o entecavir (análogos nucleosídicos/nucleotídicos). INF pegilado en casos seleccionados. Meta: carga viral indetectable.',
    enfermeria:'Precauciones estándar + contacto (sangre), vacunación de contactos, abstinencia alcohólica, control AST/ALT/carga viral periódico, reporte obligatorio.'
  },
  {
    id:'ges-hepatitisc', sistema:'🫁 Digestivo / Hepático', nombre:'Hepatitis C Crónica',
    ges:'Desde 2019 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Infección crónica por VHC (ARN). 80% cronifica. GES garantiza tratamiento con antivirales de acción directa (DAA). Riesgo de cirrosis y CHC.',
    fisio:'VHC → inflamación crónica portal y lobulillar → fibrosis progresiva (Metavir F0-F4). Sin vacuna disponible. Genotipo 1a/1b más frecuente en Chile.',
    farmaco:'DAA: sofosbuvir/ledipasvir o glecaprevir/pibrentasvir. Tasa de curación >95%. Sin interferón en nuevos esquemas. Duración 8-12 semanas.',
    enfermeria:'Adherencia al tratamiento (crítica para curación), precauciones con sangre, abstinencia alcohólica, vigilar interacciones farmacológicas.'
  },
  // ── MUSCULOESQUELÉTICO ──────────────────────────────────────
  {
    id:'ges-ar', sistema:'🦴 Musculoesquelético', nombre:'Artritis Reumatoide (AR)',
    ges:'Desde 2007 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Enfermedad autoinmune sistémica con artritis simétrica periférica. GES garantiza diagnóstico temprano y tratamiento con DMARDs dentro de 45 días.',
    fisio:'Autoimmunidad (anti-CCP, FR) → sinovitis → pannus → destrucción cartílago/hueso. Criterios ACR/EULAR 2010. DAS28 para actividad. Manifestaciones extrarticulares: nódulos, vasculitis.',
    farmaco:'Metotrexato (primera línea), cloroquina, leflunomida. Biológicos (anti-TNF: etanercept, adalimumab; anti-IL6: tocilizumab) en falla DMARD. JAK inhibidores: baricitinib.',
    enfermeria:'Administrar metotrexato 1 vez/semana (no diario → toxicidad fatal), suplementar ácido fólico, protección solar (cloroquina), signos de infección en biológicos.'
  },
  {
    id:'ges-osteoporosis', sistema:'🦴 Musculoesquelético', nombre:'Osteoporosis y Fractura de Cadera',
    ges:'Desde 2007 (fractura cadera) · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Reducción de masa ósea y deterioro de microarquitectura → fragilidad. GES cubre fractura cadera >65 años. DMO: T-score ≤-2.5. Fractura de cadera: alta mortalidad a 1 año.',
    fisio:'Desequilibrio osteoblastos/osteoclastos → pérdida ósea. Posmenopausia: ↓estrógenos → ↑RANKL → ↑resorción. FRAX para riesgo de fractura a 10 años.',
    farmaco:'Bisfosfonatos: alendronato (semanal), zolendronato (anual EV). Denosumab (anti-RANKL). Teriparatida (anabólico). Calcio 1000-1200 mg + Vitamina D 800-1000 UI/día.',
    enfermeria:'Prevención caídas (ambiente, calzado, visión), administrar bisfosfonatos con vaso lleno de agua en ayunas, permanecer 30 min en pie, reconocer osteonecrosis mandibular.'
  },
  {
    id:'ges-artrosis', sistema:'🦴 Musculoesquelético', nombre:'Artrosis de Cadera y Rodilla',
    ges:'Desde 2009 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Degeneración articular por pérdida de cartílago. GES garantiza cirugía de reemplazo articular en casos indicados. Segunda causa de discapacidad en adultos mayores.',
    fisio:'Desequilibrio síntesis/degradación cartílago (metaloproteasas) → exposición hueso subcondral → osteofitos → inflamación sinovial reactiva. Kellgren-Lawrence I-IV.',
    farmaco:'Paracetamol (primera línea). AINEs tópicos/sistémicos (GI corto plazo). Infiltración intraarticular: corticoides o ácido hialurónico. Duloxetina en dolor crónico.',
    enfermeria:'Ejercicio aeróbico en agua, reducción de peso (↓carga articular), calor local, bastón si asimetría, cuidado post-artroplastia (TVP, luxación protésica).'
  },
  // ── INFECCIOSAS ──────────────────────────────────────────────
  {
    id:'ges-vih', sistema:'🦠 Infecciosas', nombre:'VIH / SIDA',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Infección por VIH con destrucción progresiva de LT CD4. GES garantiza TARV gratuito para todos los diagnósticos confirmados y manejo de infecciones oportunistas.',
    fisio:'VIH (retrovirus) → tropismo CD4 → replicación → ↓CD4 → SIDA (<200 cel/μL) → infecciones oportunistas (PCP, toxoplasma, CMV, MAC) y neoplasias (sarcoma Kaposi, LNH).',
    farmaco:'TARV: 2 INTI + 1 InInt (bictegravir/FTC/TAF preferido). Meta: carga viral indetectable <50 cop/mL. PrEP: emtricitabina/tenofovir en alto riesgo.',
    enfermeria:'Adherencia TARV (clave para indetectabilidad), precauciones estándar, manejo accidente corto-punzante (protocolo PEP), confidencialidad, apoyo psicosocial.'
  },
  {
    id:'ges-tbc', sistema:'🦠 Infecciosas', nombre:'Tuberculosis (TBC)',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Infección por Mycobacterium tuberculosis. Notificación obligatoria. GES garantiza diagnóstico bacteriológico (BK + cultivo) y tratamiento DOTS/TAES gratuito.',
    fisio:'M. tuberculosis → fagocitado pero sobrevive en macrófago → granuloma caseoso → reactivación en inmunosupresión. PPD/IGRA detecta infección latente (no enfermedad activa).',
    farmaco:'Primera fase (2 meses): HRZE (isoniacida, rifampicina, pirazinamida, etambutol). Continuación (4 meses): HR. Resistente: amikacina, linezolid, bedaquilina.',
    enfermeria:'Aislamiento respiratorio + mascarilla N95, DOTS (tratamiento supervisado), control de contactos, pesquisar hepatotoxicidad (isoniacida+rifampicina), PPD de contactos.'
  },
  // ── SALUD MENTAL ─────────────────────────────────────────────
  {
    id:'ges-depresion', sistema:'🧩 Salud Mental', nombre:'Depresión',
    ges:'Desde 2006 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'Trastorno del estado de ánimo con tristeza persistente ≥2 semanas + síntomas neurovegetativos. GES garantiza tratamiento en APS. Causa líder de discapacidad en Chile.',
    fisio:'↓monoaminas (serotonina, noradrenalina, dopamina) en sistema límbico. Hiperactividad eje HHA → hipercortisolemia. Reducción volumen hipocampal en crónico. HAMD-17 o PHQ-9.',
    farmaco:'ISRS (sertralina 50-200 mg, escitalopram) como primera línea. IRSN: venlafaxina (ansiedad comórbida). TCA: amitriptilina (dolor crónico). Litio en bipolar.',
    enfermeria:'Escala PHQ-9, psicoeducación, adherencia ATD (4-6 sem efecto pleno), evaluar riesgo suicidio con escala Columbia, no dejar medicación al alcance en riesgo.'
  },
  {
    id:'ges-esquizo', sistema:'🧩 Salud Mental', nombre:'Esquizofrenia',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Secundario / Terciario',
    descripcion:'Trastorno psicótico crónico con síntomas positivos (alucinaciones, delirios) y negativos (abulia, alogia). GES garantiza tratamiento farmacológico y psicosocial.',
    fisio:'Hiperdopaminergia en vía mesolímbica (síntomas positivos) + hipodopaminergia en vía mesocortical (síntomas negativos). Reducción volumen hipocampo/prefrontal.',
    farmaco:'Antipsicóticos típicos: haloperidol, clorpromazina. Atípicos (preferidos): clozapina (refractario), risperidona, olanzapina, quetiapina. Depot mensual para adherencia.',
    enfermeria:'Monitorear síndrome metabólico (olanzapina, clozapina), SPM (haloperidol), adherencia, prevenir recaídas (abandono = principal causa), incluir familia.'
  },
  {
    id:'ges-consumo', sistema:'🧩 Salud Mental', nombre:'Consumo Perjudicial de Alcohol/Drogas',
    ges:'Desde 2013 · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'GES garantiza tratamiento ambulatorio para consumo perjudicial y dependencia de alcohol y drogas en adolescentes y adultos.',
    fisio:'Activación sistema de recompensa (núcleo accumbens, DA) → tolerancia → dependencia → síndrome abstinencia. Wernicke-Korsakoff: déficit tiamina por alcoholismo crónico.',
    farmaco:'Alcohol: diazepam en abstinencia (CIWA), tiamina EV/IM, naltrexona o acamprosato en mantenimiento. Opioides: buprenorfina/naloxona (sustitutivo). Cocaína: no aprobado.',
    enfermeria:'Escala CIWA para monitoreo abstinencia alcohólica, tiamina ANTES de glucosa en sospecha de Wernicke, apoyo motivacional, no juzgar, derivación a programa.'
  },
  // ── MATERNO-INFANTIL ─────────────────────────────────────────
  {
    id:'ges-prematuro', sistema:'👶 Materno-Infantil', nombre:'Prematuridad (<32 semanas)',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Terciario (UCI Neonatal)',
    descripcion:'Nacimiento antes de las 32 semanas de gestación. GES garantiza atención en UCI neonatal, corticoides antenatales y surfactante. Principal causa de mortalidad infantil.',
    fisio:'Inmadurez pulmonar: déficit surfactante → síndrome distrés respiratorio neonatal (SDR). Hemorragia intraventricular, enterocolitis necrotizante, retinopatía del prematuro (ROP).',
    farmaco:'Corticoides antenatales: betametasona IM 2 dosis (reducen SDR 40%). Surfactante exógeno (beractant, poractant) intratraqueal. Cafeína (apnea del prematuro). Indometacina (DAP).',
    enfermeria:'UCIN: posición canguro, control temperatura, monitoreo SpO₂, nutrición parenteral, manejo incubadora, prevenir infecciones nosocomiales, apoyo a padres.'
  },
  {
    id:'ges-rop', sistema:'👶 Materno-Infantil', nombre:'Retinopatía del Prematuro (ROP)',
    ges:'Desde 2005 · Decreto 44/2022', nivel:'Terciario',
    descripcion:'Proliferación anormal de vasos retinianos en prematuros <32 sem o <1500 g. GES garantiza cribado y tratamiento con láser o anti-VEGF antes de progresión a ceguera.',
    fisio:'Hiperóxia → supresión VEGF → detención vascularización → hipoxia relativa → ↑VEGF → proliferación vascular anormal → posible desprendimiento retina.',
    farmaco:'Anti-VEGF intravítreo: bevacizumab o ranibizumab (preferido actualmente). Fotocoagulación láser en estadios avanzados. Cirugía (vitrectomía) en desprendimiento.',
    enfermeria:'Control estricto de saturación O₂ en prematuros (91-95%), coordinación cribado oftalmológico, posición correcta para fotocoagulación, apoyo familiar.'
  },
  {
    id:'ges-embarazo', sistema:'👶 Materno-Infantil', nombre:'Embarazo, Parto y Puerperio',
    ges:'Programa PADB + GES · Decreto 44/2022', nivel:'Primario / Secundario',
    descripcion:'GES garantiza control prenatal desde primer trimestre, parto institucional, puerperio y planificación familiar. Chile tiene alta cobertura de parto hospitalario (>99%).',
    fisio:'Adaptaciones fisiológicas: ↑GC 40%, ↓RVP, anemia dilucional, hipercoagulabilidad, ↓TFG (↑GFR). Complicaciones: preeclampsia, DPPNI, RPM, DPP, HPP.',
    farmaco:'Ácido fólico periconcepcional (previene DTN), hierro en anemia, labetalol/nifedipino en HTA. Sulfato de Mg en preeclampsia grave (anticonvulsivante). Oxitocina en HPP.',
    enfermeria:'PARTOGRAMA OMS, 3 demoras en emergencias obstétricas, manejo activo 3ª etapa del parto (oxitocina + tracción controlada del cordón), vigilancia HPP primeras 2h.'
  },
  // ── URGENCIA / CRÍTICO ───────────────────────────────────────
  {
    id:'ges-sepsis', sistema:'🚨 Crítico / Urgencia', nombre:'Sepsis y Shock Séptico',
    ges:'No GES específico · Alta mortalidad', nivel:'UCI',
    descripcion:'Sepsis: disfunción orgánica amenazante por infección. Shock séptico: sepsis + hipotensión refractaria. Mortalidad 30-50% en shock. Bundle "1 hora" de Surviving Sepsis.',
    fisio:'Infección → respuesta inflamatoria sistémica → disfunción endotelial → coagulopatía → fallo multiorgánico. qSOFA ≥2: sospechar sepsis. SOFA >2: definición diagnóstica.',
    farmaco:'ATB EV de amplio espectro dentro 1h (piperacilina-tazobactam + vancomicina empírico). Norepinefrina primera línea vasopresora. Corticoides si shock refractario. Vitamina C+Tiamina (experimental).',
    enfermeria:'Bundle 1h: hemocultivos → lactato → ATB → 30 mL/kg SF EV. Control temperatura, monitoreo horario diuresis, PAM ≥65 mmHg, escala SOFA diaria.'
  },
  {
    id:'ges-trauma', sistema:'🚨 Crítico / Urgencia', nombre:'Gran Quemado',
    ges:'Desde 2007 · Decreto 44/2022', nivel:'Terciario (Unidad Quemados)',
    descripcion:'GES garantiza atención especializada en quemados graves (>20% SCQ o quemaduras especiales). Chile tiene red de Centros de Quemados distribuidos regionalmente.',
    fisio:'Destrucción barrera cutánea → pérdida fluidos masiva → hipovolemia → shock → respuesta inflamatoria sistémica. Regla de los 9 (Wallace) para SCQ. Profundidad: I, IIA, IIB, III.',
    farmaco:'Fórmula de Parkland: 4 mL/kg/% SCQ en 24h (primer 50% en 8h post-quemadura). Morfina EV para dolor. ATB solo en infección documentada. Escarotomía si circunferencial.',
    enfermeria:'Cálculo fórmula Parkland, control horario diuresis 0.5-1 mL/kg/h, cuidado herida húmeda, nutrición enteral precoz, prevención contracturas, apoyo psicológico.'
  }
];

function renderGESAnexo(area) {
  // Agrupar por sistema
  const sistemas = {};
  GES_DATA.forEach(p => {
    if (!sistemas[p.sistema]) sistemas[p.sistema] = [];
    sistemas[p.sistema].push(p);
  });

  let html = `
    <div class="calc-card">
      <h3>🇨🇱 Patologías GES — Garantías Explícitas de Salud</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px">
        Decreto 44/2022 MINSAL · ${GES_DATA.length} patologías con relevancia para Fisiopatología ENF UDP · Haz clic en cualquier patología para ver descripción, fisiopatología, farmacología y rol de enfermería.
      </p>
      <div style="display:flex;gap:8px;margin-bottom:16px;align-items:center">
        <input type="text" id="ges-search" placeholder="🔍  Buscar patología..." oninput="filterGES(this.value)"
          style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit">
        <span id="ges-count" style="font-size:11px;color:var(--text-muted);white-space:nowrap">${GES_DATA.length} patologías</span>
      </div>
      <div id="ges-list">`;

  Object.entries(sistemas).forEach(([sistema, patologias]) => {
    html += `<div class="ges-sistema-group" data-sistema="${sistema}">
      <div class="ges-sistema-header">${sistema}</div>`;
    patologias.forEach(p => {
      html += `
        <div class="ges-card" id="${p.id}" onclick="toggleGES('${p.id}')">
          <div class="ges-card-header">
            <div>
              <span class="ges-nombre">${p.nombre}</span>
              <span class="ges-badge">${p.ges.split('·')[0].trim()}</span>
            </div>
            <span class="ges-nivel">${p.nivel}</span>
            <span class="ges-chevron" id="chv-${p.id}">▶</span>
          </div>
          <div class="ges-card-body" id="body-${p.id}" style="display:none">
            <div class="ges-section">
              <span class="ges-section-label">📋 GES</span>
              <span>${p.ges}</span>
            </div>
            <div class="ges-section">
              <span class="ges-section-label">🔬 Descripción</span>
              <span>${p.descripcion}</span>
            </div>
            <div class="ges-section">
              <span class="ges-section-label">⚙️ Fisiopatología</span>
              <span>${p.fisio}</span>
            </div>
            <div class="ges-section">
              <span class="ges-section-label">💊 Farmacología</span>
              <span>${p.farmaco}</span>
            </div>
            <div class="ges-section ges-enf">
              <span class="ges-section-label">🩺 Rol Enfermería</span>
              <span>${p.enfermeria}</span>
            </div>
          </div>
        </div>`;
    });
    html += `</div>`;
  });

  html += `
      </div>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-top:10px;padding:8px 12px;background:#f8fafc;border-radius:8px;border:1px solid var(--border)">
      ⚠️ Información con fines académicos basada en Decreto GES 44/2022 MINSAL Chile. Verificar vigencia en <strong>minsal.cl</strong>. No reemplaza protocolos institucionales.
    </div>`;

  area.innerHTML = html;
}

function toggleGES(id) {
  const body = document.getElementById('body-' + id);
  const chv  = document.getElementById('chv-' + id);
  const card = document.getElementById(id);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (chv) chv.textContent = open ? '▶' : '▼';
  if (card) card.classList.toggle('ges-card-open', !open);
}

function filterGES(q) {
  const term = q.toLowerCase().trim();
  let visible = 0;
  GES_DATA.forEach(p => {
    const card = document.getElementById(p.id);
    const match = !term ||
      p.nombre.toLowerCase().includes(term) ||
      p.sistema.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term) ||
      p.fisio.toLowerCase().includes(term) ||
      p.farmaco.toLowerCase().includes(term) ||
      p.enfermeria.toLowerCase().includes(term);
    if (card) card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  // Ocultar encabezados de sistema si no tienen cartas visibles
  document.querySelectorAll('.ges-sistema-group').forEach(grp => {
    const cards = grp.querySelectorAll('.ges-card');
    const anyVisible = Array.from(cards).some(c => c.style.display !== 'none');
    grp.style.display = anyVisible ? '' : 'none';
  });
  const countEl = document.getElementById('ges-count');
  if (countEl) countEl.textContent = visible + ' patología' + (visible !== 1 ? 's' : '');
}
