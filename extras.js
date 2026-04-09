// ============================================================
// extras.js — Quiz de autoevaluación + Viñetas clínicas
// Consulta Rápida ENF — UDP v1.1
// ============================================================

const EXTRAS = {

// ─── FARMACOLOGÍA ───────────────────────────────────────────

'farm-s1': {
  vignette: {
    text: 'Paciente masculino, 72 años, con IRC en hemodiálisis recibe indicación de vancomicina IV para infección de catéter. Usted administra la dosis habitual sin ajuste.',
    question: '¿Qué parámetro farmacocinético está alterado y qué riesgo genera?',
    answer: 'La excreción renal está severamente reducida → acumulación del fármaco → riesgo de ototoxicidad y nefrotoxicidad adicional. En IRC, se debe ajustar dosis según VFG y monitorizar niveles séricos.'
  },
  quiz: [
    {q:'La biodisponibilidad de un fármaco administrado por vía IV es:', options:['50%','75%','100%','Variable según el fármaco'], correct:2, explanation:'La vía IV deposita el 100% del fármaco directamente en la circulación sistémica, sin pérdidas por absorción ni primer paso hepático.'},
    {q:'El efecto de primer paso hepático afecta principalmente a la vía:', options:['Intravenosa','Oral','Intramuscular','Subcutánea'], correct:1, explanation:'La vía oral pasa primero por la circulación portal → hígado → metabolismo antes de alcanzar la circulación sistémica.'},
    {q:'¿Cuál de los siguientes NO es un mecanismo de absorción de fármacos?', options:['Difusión pasiva','Transporte activo','Filtración glomerular','Pinocitosis'], correct:2, explanation:'La filtración glomerular es un mecanismo de EXCRECIÓN, no de absorción de fármacos.'},
    {q:'Un fármaco liposoluble y no ionizado al pH gástrico se absorberá mejor en:', options:['Estómago','Intestino delgado','Colon','Recto'], correct:0, explanation:'Los fármacos ácidos débiles (no ionizados en pH ácido) se absorben bien en el estómago. Sin embargo, la mayor superficie intestinal favorece la absorción neta en intestino.'},
    {q:'Los "5 correctos" de enfermería incluyen todos EXCEPTO:', options:['Paciente correcto','Dosis correcta','Laboratorio correcto','Hora correcta'], correct:2, explanation:'Los 5 correctos son: paciente, fármaco, dosis, vía y hora. El laboratorio es importante pero no forma parte de esta regla mnemotécnica.'}
  ]
},

'farm-s2': {
  vignette: {
    text: 'Paciente de 65 años, cirrótico, con albúmina de 2.1 g/dL recibe fenitoína (fármaco con alta unión a proteínas) a dosis estándar. A las 48h presenta nistagmo, ataxia y somnolencia.',
    question: '¿Qué mecanismo farmacocinético explica la toxicidad?',
    answer: 'Hipoalbuminemia → ↓unión a proteínas → ↑fracción libre farmacológicamente activa → efecto y toxicidad aumentados con la misma dosis total. Se debe medir fracción libre de fenitoína y ajustar dosis.'
  },
  quiz: [
    {q:'Un fármaco con Vd alto (>1 L/kg) indica:', options:['Retención en plasma','Amplia distribución a tejidos','Alta unión a albúmina','Rápida excreción renal'], correct:1, explanation:'Vd alto significa que el fármaco se distribuye ampliamente fuera del compartimiento vascular hacia los tejidos.'},
    {q:'Las RAM tipo B se caracterizan por ser:', options:['Predecibles y dosis-dependientes','Impredecibles e idiosincráticas','Relacionadas con uso crónico','Diferidas en el tiempo'], correct:1, explanation:'RAM tipo B (bizarre) son impredecibles, no dosis-dependientes y generalmente de base inmunológica o genética (ej. anafilaxia).'},
    {q:'La rifampicina es un inductor de CYP450. Si se coadministra con warfarina:', options:['↑Efecto anticoagulante','↓Efecto anticoagulante','No hay interacción','Efecto variable'], correct:1, explanation:'La inducción enzimática acelera el metabolismo de warfarina → ↓niveles plasmáticos → ↓efecto anticoagulante → riesgo de trombosis.'},
    {q:'La ventana terapéutica estrecha implica que:', options:['El fármaco es muy seguro','La CME y CTM están muy separadas','La CME y CTM están muy cercanas','No requiere monitorización'], correct:2, explanation:'Ventana estrecha = pequeña diferencia entre dosis eficaz y tóxica. Requiere monitorización de niveles séricos (ej. digoxina, litio, aminoglucósidos).'},
    {q:'Un agonista parcial se caracteriza por:', options:['Activar el receptor al máximo','No unirse al receptor','Activar el receptor pero con eficacia menor que un agonista total','Bloquear irreversiblemente el receptor'], correct:2, explanation:'El agonista parcial tiene afinidad por el receptor pero eficacia intrínseca menor → produce un efecto submáximo incluso a concentraciones saturantes.'}
  ]
},

'farm-s3': {
  vignette: {
    text: 'Paciente de 58 años, neutropenia febril post-quimioterapia, hemocultivos pendientes. Se inicia piperacilina/tazobactam + amikacina. Al 3er día, creatinina sube de 0.9 a 2.4 mg/dL.',
    question: '¿Qué fármaco es el probable causante y cuál es el mecanismo de daño renal?',
    answer: 'Amikacina (aminoglucósido) → acumulación en TCP vía receptor megalina → NTA intrarrenal. Se debe suspender o ajustar dosis, monitorizar niveles valle (<2 μg/mL) y asegurar hidratación.'
  },
  quiz: [
    {q:'Un antibiótico bactericida tiempo-dependiente se administra:', options:['En dosis altas e infrecuentes','En dosis frecuentes o infusión prolongada','En dosis única diaria','Solo por vía oral'], correct:1, explanation:'Los β-lactámicos son tiempo-dependientes: la eficacia depende del tiempo que la concentración supera la CMI (T>CMI). Se administran en dosis frecuentes.'},
    {q:'La ceftriaxona (3ª generación) tiene como ventaja principal:', options:['Solo cubre gram positivos','Penetra la BHE → útil en meningitis','No requiere ajuste renal','Es el ATB más barato'], correct:1, explanation:'Ceftriaxona tiene excelente penetración al SNC, por eso es de elección en meningitis bacteriana (junto con ampicilina en >50 años).'},
    {q:'La combinación amoxicilina + ác. clavulánico funciona porque:', options:['Ambos son bactericidas','El clavulánico inhibe las β-lactamasas','El clavulánico potencia la absorción oral','Ambos tienen el mismo espectro'], correct:1, explanation:'El ác. clavulánico es un inhibidor suicida de β-lactamasas → protege a la amoxicilina de la inactivación enzimática → restaura su actividad contra bacterias productoras de β-lactamasa.'},
    {q:'En un paciente con anafilaxia documentada a penicilina, ¿cuál es la alternativa más segura?', options:['Cefalosporinas de 1ª gen','Cefalosporinas de 3ª gen','Carbapenemes','Aztreonam'], correct:3, explanation:'Aztreonam (monobactámico) no tiene reactividad cruzada significativa con penicilinas. Carbapenemes tienen <1% de reactividad cruzada. Cefalosporinas de 1ª gen: evitar.'},
    {q:'El PAE (efecto post-antibiótico) prolongado permite:', options:['Usar dosis más bajas','Usar intervalos más largos entre dosis','No monitorizar niveles','Usar solo vía oral'], correct:1, explanation:'Los aminoglucósidos y quinolonas tienen PAE prolongado → la bacteria sigue inhibida tras retirar el ATB → permite dosis únicas diarias (once-daily dosing).'}
  ]
},

'farm-s4': {
  vignette: {
    text: 'Paciente VIH+ con CD4 de 45 presenta fiebre, cefalea intensa y rigidez de nuca. LCR: tinta china positiva para Cryptococcus neoformans.',
    question: '¿Cuál es el tratamiento de inducción y qué monitorizar?',
    answer: 'Anfotericina B liposomal + flucitosina (inducción 2 semanas) → fluconazol consolidación y mantenimiento. Monitorizar: función renal (creatinina), K+, Mg2+ (anfotericina depleta electrolitos), presión de LCR (riesgo de hipertensión intracraneal).'
  },
  quiz: [
    {q:'La anfotericina B actúa mediante:', options:['Inhibición de la síntesis de ADN','Unión al ergosterol → formación de poros','Inhibición de la β-glucano sintasa','Bloqueo del CYP51 fúngico'], correct:1, explanation:'La anfotericina B se une al ergosterol de la membrana fúngica, formando poros que causan pérdida de iones → muerte celular.'},
    {q:'El voriconazol es el antifúngico de 1ª línea para:', options:['Candida albicans','Cryptococcus neoformans','Aspergillus fumigatus','Dermatofitos'], correct:2, explanation:'Voriconazol es el tratamiento de elección para aspergilosis invasiva. Los azoles inhiben CYP51 (14α-desmetilasa) de la vía del ergosterol.'},
    {q:'El oseltamivir es efectivo si se administra:', options:['En cualquier momento','Dentro de las primeras 48h','Solo por vía IV','Después de 5 días de síntomas'], correct:1, explanation:'Los inhibidores de neuraminidasa (oseltamivir) son efectivos dentro de las primeras 48h del inicio de síntomas de influenza.'},
    {q:'Las equinocandinas NO son efectivas contra:', options:['Candida invasiva','Aspergillus','Cryptococcus','Candida en mucosas'], correct:2, explanation:'Las equinocandinas (caspofungina, micafungina) no tienen actividad contra Cryptococcus neoformans (no tiene β-glucano accesible) ni contra mucorales.'},
    {q:'La TARV en VIH combina al menos:', options:['2 fármacos de la misma clase','3 fármacos de ≥2 clases diferentes','1 solo fármaco potente','4 fármacos de 4 clases'], correct:1, explanation:'TARV estándar combina ≥3 fármacos de al menos 2 clases para reducir resistencia y lograr carga viral indetectable.'}
  ]
},

'farm-s5': {
  vignette: {
    text: 'Paciente de 35 años, asmática, presenta crisis severa en SU. Se administra salbutamol nebulizado + corticoide sistémico. La paciente refiere que toma regularmente clorfenamina para rinitis.',
    question: '¿Es adecuado el uso de antihistamínico de 1ª generación en esta paciente?',
    answer: 'No es ideal. Clorfenamina (1ª gen) tiene efecto anticolinérgico → espesa secreciones bronquiales, contraproducente en asma. Preferir cetirizina o fexofenadina (2ª gen): no sedantes, sin efecto anticolinérgico significativo.'
  },
  quiz: [
    {q:'Los leucotrienos LTC4/D4 son broncoconstrictores _____ más potentes que la histamina:', options:['10×','100×','1000×','Igual de potentes'], correct:2, explanation:'Los leucotrienos son ~1000× más potentes que la histamina como broncoconstrictores, por eso el montelukast (anti-LT) es útil en asma.'},
    {q:'Los antihistamínicos de 2ª generación se prefieren porque:', options:['Son más baratos','No cruzan la BHE → no sedantes','Tienen mayor afinidad H1','Son bactericidas'], correct:1, explanation:'Cetirizina, loratadina, fexofenadina: no penetran SNC significativamente → ausencia de sedación. Selectivos H1 periféricos.'},
    {q:'La vía LOX del ácido araquidónico es bloqueada por:', options:['AINEs','Corticoides','Montelukast','AAS'], correct:2, explanation:'Montelukast bloquea el receptor de leucotrienos (CysLT1). La vía LOX produce leucotrienos. Los AINEs solo bloquean COX, no LOX.'},
    {q:'El cromoglicato sódico es útil como:', options:['Tratamiento de crisis aguda','Profilaxis antes de exposición a alérgeno','Broncodilatador de rescate','Antitérmico'], correct:1, explanation:'El cromoglicato estabiliza mastocitos (impide degranulación). Es PREVENTIVO, no sirve en crisis aguda. Se usa antes de ejercicio o exposición alergénica.'},
    {q:'COX-1 es constitutiva y se relaciona con:', options:['Inflamación y fiebre','Protección gástrica y hemostasia','Broncoconstricción','Dolor nociceptivo'], correct:1, explanation:'COX-1 produce PG con funciones fisiológicas: protección de mucosa gástrica (PGE2), agregación plaquetaria (TXA2), función renal (PGI2). Su inhibición explica los efectos adversos de AINEs.'}
  ]
},

'farm-s6': {
  vignette: {
    text: 'Mujer de 55 años, DM2 con microalbuminuria, PA 155/95 mmHg. Se inicia enalapril 10 mg/día. A los 10 días consulta por tos seca persistente que le impide dormir.',
    question: '¿Cuál es la causa de la tos y cuál es la alternativa terapéutica?',
    answer: 'Tos seca por acumulación de bradicinina (efecto de clase de IECA, 10-15% de pacientes). Cambiar a ARA-II (losartán o valsartán): misma eficacia antihipertensiva y nefroprotectora SIN tos ni angioedema.'
  },
  quiz: [
    {q:'La combinación IECA + ARA-II está contraindicada porque:', options:['Son antagónicos','Producen doble bloqueo del SRAA → hiperpotasemia severa','No tienen efecto combinado','Causan hipotensión letal siempre'], correct:1, explanation:'El estudio ONTARGET demostró que el doble bloqueo SRAA ↑riesgo de hiperkalemia, IRA y eventos adversos sin beneficio adicional.'},
    {q:'¿Cuál β-bloqueante tiene indicación específica en IC con FEVIr?', options:['Propranolol','Atenolol','Carvedilol','Labetalol'], correct:2, explanation:'Carvedilol (α+β bloqueante) es uno de los 3 β-bloqueantes con evidencia de ↓mortalidad en IC (junto con bisoprolol y metoprolol succinato).'},
    {q:'El antihipertensivo de elección en embarazo es:', options:['Enalapril','Losartán','α-metildopa','Amlodipino'], correct:2, explanation:'α-metildopa es el antihipertensivo con mayor evidencia de seguridad en embarazo. IECA y ARA-II están CONTRAINDICADOS (teratogénicos).'},
    {q:'El "triple whammy" en nefrología se refiere a:', options:['3 antibióticos nefrotóxicos','AINE + IECA + diurético','3 dosis de contraste','3 episodios de hipotensión'], correct:1, explanation:'AINE (↓PGE2 aferente) + IECA (dilata eferente) + diurético (↓volumen) = triple agresión renal → alto riesgo de IRA.'},
    {q:'Las dihidropiridinas (amlodipino, nifedipino) se caracterizan por:', options:['↓FC y ↓conducción AV','Selectividad vascular → vasodilatación potente','Bloqueo cardíaco tipo Mobitz','Broncoconstricción refleja'], correct:1, explanation:'Las DHP tienen selectividad 10:1 vascular:cardíaca → predomina la vasodilatación. Pueden causar taquicardia refleja (a diferencia de verapamilo que ↓FC).'}
  ]
},

'farm-s8': {
  vignette: {
    text: 'Paciente de 78 años, IC descompensada con EPA, SatO2 82%, ingurgitación yugular, crepitantes bilaterales. Se administra furosemida 40 mg IV. A las 2h, K+ sérico: 2.9 mEq/L.',
    question: '¿Cuál es la causa de la hipokalemia y cómo se previene?',
    answer: 'Furosemida inhibe NKCC2 → ↑excreción de Na+, K+, Cl- en asa de Henle → hipokalemia. Prevención: asociar espironolactona (ahorrador de K+), suplementar KCl oral/IV, monitorizar K+ sérico cada 6-8h en fase aguda.'
  },
  quiz: [
    {q:'¿Cuál es el diurético más potente?', options:['Hidroclorotiazida','Furosemida','Espironolactona','Acetazolamida'], correct:1, explanation:'Los diuréticos de asa (furosemida) son los más potentes porque actúan donde se reabsorbe ~25% del Na+ filtrado (rama ascendente gruesa del asa de Henle).'},
    {q:'Las tiazidas son ineficaces cuando la VFG es menor a:', options:['90 mL/min','60 mL/min','30 mL/min','10 mL/min'], correct:2, explanation:'Las tiazidas requieren VFG >30 mL/min para funcionar. En ERC avanzada, furosemida mantiene eficacia (ventaja en insuficiencia renal).'},
    {q:'La espironolactona reduce mortalidad en IC por:', options:['Diuresis masiva','Efecto antifibrótico y antiproliferativo (estudio RALES)','Vasodilatación directa','Aumento de la contractilidad'], correct:1, explanation:'RALES demostró 30% ↓mortalidad en IC severa. El beneficio es por bloqueo de aldosterona: antifibrótico, antiinflamatorio, no solo diurético.'},
    {q:'El manitol está CONTRAINDICADO en:', options:['Edema cerebral','Glaucoma','Insuficiencia cardíaca','Rabdomiólisis'], correct:2, explanation:'Manitol es un osmótico que expande el volumen extracelular antes de producir diuresis. En ICC → sobrecarga hídrica → edema pulmonar.'},
    {q:'La combinación furosemida + aminoglucósidos es peligrosa por:', options:['Hepatotoxicidad aditiva','Ototoxicidad aditiva','Nefroprotección cruzada','No hay riesgo'], correct:1, explanation:'Ambos son ototóxicos. La combinación potencia el daño coclear → riesgo de sordera irreversible. Evitar o monitorizar audición.'}
  ]
},

'farm-s9': {
  vignette: {
    text: 'Hombre de 62 años, FA crónica en tratamiento con warfarina (INR objetivo 2-3). Inicia amiodarona por episodios de TV no sostenida. A los 7 días, INR sube a 5.8 con equimosis espontáneas.',
    question: '¿Cuál es el mecanismo de esta interacción y qué hacer?',
    answer: 'Amiodarona inhibe CYP2C9 → ↓metabolismo de warfarina → ↑niveles → ↑INR → sangrado. Se debe reducir warfarina 30-50%, controlar INR semanal. Si INR >5 sin sangrado mayor: suspender warfarina + vitamina K oral.'
  },
  quiz: [
    {q:'La aspirina (AAS) inhibe la COX plaquetaria de forma:', options:['Reversible por 24h','Irreversible por la vida de la plaqueta (8-12 días)','Reversible por 4h','Solo mientras está en plasma'], correct:1, explanation:'AAS ACETILA irreversiblemente la COX-1 plaquetaria. Como la plaqueta no tiene núcleo, no puede sintetizar nueva COX → efecto dura toda su vida (8-12 días).'},
    {q:'El control de laboratorio de la heparina no fraccionada es:', options:['INR','TTPA','TP','Dímero-D'], correct:1, explanation:'HNF se monitoriza con TTPA (objetivo 1.5-2.5× basal). HBPM generalmente no requiere monitorización (se puede medir anti-Xa en obesos, embarazadas, IRC).'},
    {q:'Los ACODs (dabigatrán, rivaroxabán) tienen como ventaja:', options:['Son más baratos','Dosis fijas sin monitorización rutinaria','Pueden usarse en válvulas mecánicas','Tienen antídoto universal'], correct:1, explanation:'ACODs no requieren monitoreo de INR, tienen pocas interacciones alimentarias y dosis fijas. Pero están contraindicados en válvulas mecánicas.'},
    {q:'La amiodarona tiene vida media de:', options:['6-8 horas','1-3 días','14-59 días','Solo minutos IV'], correct:2, explanation:'T1/2 extremadamente larga (14-59 días) con metabolito activo de 60-90 días. Esto explica la lenta carga, los efectos persistentes y la toxicidad acumulativa.'},
    {q:'En SCA/IAMCEST, la doble antiagregación consiste en:', options:['Warfarina + heparina','AAS + clopidogrel (o ticagrelor)','Dos dosis de AAS','Enoxaparina + warfarina'], correct:1, explanation:'Doble antiagregación plaquetaria (DAPT): AAS (bloquea TXA2) + inhibidor P2Y12 (clopidogrel o ticagrelor). Se mantiene 12 meses post-SCA.'}
  ]
},

'farm-slipid': {
  vignette: {
    text: 'Paciente de 50 años inicia atorvastatina 40 mg por LDL de 185 mg/dL. A las 3 semanas refiere dolor muscular intenso en muslos y pantorrillas con orina oscura.',
    question: '¿Qué complicación sospechas y qué examen solicitas de urgencia?',
    answer: 'Rabdomiólisis por estatina. Solicitar CPK (si >10× límite superior: suspender inmediatamente), función renal (riesgo de IRA por mioglobinuria), electrolitos (hiperkalemia por lisis muscular). Hidratación agresiva.'
  },
  quiz: [
    {q:'Las estatinas actúan inhibiendo:', options:['Lipasa pancreática','HMG-CoA reductasa hepática','NPC1L1 intestinal','PPARα'], correct:1, explanation:'Las estatinas inhiben la enzima limitante de la síntesis de colesterol en el hígado → el hepatocito compensa expresando más receptores LDL → capta LDL del plasma → ↓LDL 30-55%.'},
    {q:'Los efectos pleiotrópicos de las estatinas incluyen:', options:['Solo reducción de LDL','Antiinflamatorio, estabilización de placa, mejora de función endotelial','Reducción de triglicéridos exclusivamente','Efecto hipoglicemiante'], correct:1, explanation:'Las estatinas tienen efectos más allá de ↓LDL: ↓PCR (antiinflamatorio), estabilización de placa aterosclerótica, ↑NO endotelial. Son los fármacos con mayor evidencia en prevención CV.'},
    {q:'La combinación estatina + gemfibrozil está contraindicada por:', options:['Ineficacia','↑Riesgo de miopatía/rabdomiólisis','Hepatotoxicidad aditiva','Interacción a nivel intestinal'], correct:1, explanation:'Gemfibrozil inhibe la glucuronidación de estatinas → ↑niveles plasmáticos → ↑riesgo de miopatía. Si se necesita fibrato, preferir fenofibrato.'},
    {q:'¿Cuándo los triglicéridos representan riesgo de pancreatitis aguda?', options:['>150 mg/dL','>250 mg/dL','>500 mg/dL','>1000 mg/dL'], correct:2, explanation:'TG >500 mg/dL → riesgo significativo de pancreatitis aguda. >1000 mg/dL → riesgo inminente. Requiere tratamiento urgente con fibratos.'},
    {q:'La ezetimiba reduce el colesterol mediante:', options:['Inhibición de síntesis hepática','Bloqueo de absorción intestinal (NPC1L1)','Secuestro de ácidos biliares','Activación de lipoproteínlipasa'], correct:1, explanation:'Ezetimiba inhibe el transportador NPC1L1 en el borde en cepillo intestinal → ↓absorción de colesterol dietario y biliar → ↓LDL 15-20%. Se combina con estatinas.'}
  ]
},

'farm-s11': {
  vignette: {
    text: 'Mujer de 32 años, hipertiroidea (Graves), embarazada de 8 semanas. Endocrinología indicó metimazol 20 mg/día.',
    question: '¿Es seguro el metimazol en el 1er trimestre? ¿Cuál es la alternativa?',
    answer: 'NO. Metimazol es teratogénico en 1er trimestre (aplasia cutis, atresia coanal). Se debe usar propiltiouracilo (PTU) durante el 1er trimestre y cambiar a metimazol en el 2º trimestre (PTU tiene riesgo de hepatotoxicidad a largo plazo).'
  },
  quiz: [
    {q:'El metimazol actúa inhibiendo:', options:['Captación de yodo','Peroxidasa tiroidea (TPO)','Conversión periférica T4→T3','Liberación de TSH'], correct:1, explanation:'Metimazol/PTU inhiben la TPO → bloquean la oxidación del yoduro, yodación de tirosinas y acoplamiento. PTU además inhibe conversión periférica T4→T3.'},
    {q:'La levotiroxina se administra preferentemente:', options:['Con alimentos','En ayunas, 30-60 min antes del desayuno','Con antiácidos','En la noche con la cena'], correct:1, explanation:'Ayunas optimiza absorción. Los antiácidos, calcio, hierro y fibra interfieren con su absorción intestinal.'},
    {q:'El yodo radioactivo (I-131) está CONTRAINDICADO en:', options:['Mayores de 60 años','Embarazo y lactancia','Bocio multinodular','Hipertiroidismo recurrente'], correct:1, explanation:'I-131 destruye tejido tiroideo por radiación β. En embarazo → daño fetal (tiroides fetal concentra yodo desde semana 12). Absolutamente contraindicado.'},
    {q:'La crisis tirotóxica se trata inicialmente con:', options:['Levotiroxina IV','PTU + β-bloqueante + corticoide + yodo (después del PTU)','Solo metimazol oral','Cirugía de urgencia'], correct:1, explanation:'Secuencia: 1) PTU (bloquea síntesis + conversión periférica). 2) β-bloqueante (controla taquicardia). 3) Corticoide (↓conversión T4→T3). 4) Yodo 1h DESPUÉS del PTU (si se da antes → combustible para más hormona).'},
    {q:'El hipotiroidismo subclínico se define por:', options:['T4L baja + TSH alta','T4L normal + TSH elevada','T4L baja + TSH normal','Síntomas sin alteración de laboratorio'], correct:1, explanation:'TSH elevada con T4L aún normal indica que la tiroides está fallando pero compensa parcialmente. Se trata si TSH >10 o si hay síntomas/embarazo.'}
  ]
},

'farm-sdiab': {
  vignette: {
    text: 'Paciente DM2, 68 años, VFG 25 mL/min, HbA1c 8.2%, en tratamiento con metformina 1700 mg/día. Ingresa confuso, con lactato de 8 mmol/L y pH 7.15.',
    question: '¿Cuál es el diagnóstico y qué error de prescripción se cometió?',
    answer: 'Acidosis láctica por metformina. La metformina está CONTRAINDICADA con VFG <30 mL/min (KDIGO). Se acumula → inhibe complejo I mitocondrial → metabolismo anaerobio → ↑lactato. Requiere hemodiálisis de urgencia.'
  },
  quiz: [
    {q:'La metformina actúa principalmente en:', options:['Célula β del páncreas','Hígado (↓gluconeogénesis)','Riñón (↑excreción de glucosa)','Intestino (↓absorción)'], correct:1, explanation:'Metformina activa AMPK → ↓gluconeogénesis hepática → ↓producción hepática de glucosa. No estimula secreción de insulina → no produce hipoglicemia.'},
    {q:'Los iSGLT2 (empagliflozina, dapagliflozina) tienen beneficio adicional en:', options:['Solo control glicémico','IC y nefroprotección (independiente de DM)','Prevención de cáncer','Tratamiento de DM1'], correct:1, explanation:'Los iSGLT2 tienen beneficio cardiorrenal demostrado en IC (DAPA-HF, EMPEROR-Reduced) y ERC (DAPA-CKD) incluso en pacientes NO diabéticos.'},
    {q:'Las sulfonilureas (glibenclamida) pueden causar:', options:['Acidosis láctica','Hipoglicemia severa','Cetoacidosis','Infecciones urinarias'], correct:1, explanation:'Las sulfonilureas estimulan secreción de insulina desde la célula β → riesgo de hipoglicemia, especialmente en ancianos y ERC (acumulación de metabolitos activos).'},
    {q:'La insulina de acción ultrarrápida (lispro, aspart) se administra:', options:['30 min antes de comer','Inmediatamente antes o al inicio de la comida','Solo en ayunas','Una vez al día'], correct:1, explanation:'Las ultrarrápidas tienen inicio en 10-15 min → se administran justo antes o al iniciar la comida. Simulan el pico prandial fisiológico de insulina.'},
    {q:'Los agonistas GLP-1 (semaglutida) reducen peso porque:', options:['Producen diarrea','Enlentecen vaciamiento gástrico + ↑saciedad central','Aumentan el metabolismo basal','Inhiben absorción de grasas'], correct:1, explanation:'GLP-1 RA: ↑saciedad hipotalámica + enlentecen vaciamiento gástrico + ↓apetito. Semaglutida logra ↓peso 15-20% (efecto comparable a cirugía bariátrica en algunos estudios).'}
  ]
},

'farm-s12': {
  vignette: {
    text: 'Paciente de 45 años en shock anafiláctico por picadura de abeja: PA 60/40, taquicardia 130 lpm, broncoespasmo severo, urticaria generalizada.',
    question: '¿Cuál es el fármaco de 1ª línea, la dosis y la vía de administración?',
    answer: 'Adrenalina (epinefrina) 0.3-0.5 mg IM en cara anterolateral del muslo. Actúa sobre α1 (vasoconstricción → ↑PA), β1 (↑FC, ↑contractilidad) y β2 (broncodilatación). Repetir cada 5-15 min si no hay respuesta. NUNCA antihistamínicos como 1ª línea en anafilaxia.'
  },
  quiz: [
    {q:'La noradrenalina es el vasopresor de elección en:', options:['Shock anafiláctico','Shock séptico','Shock cardiogénico','Bradicardia sinusal'], correct:1, explanation:'Surviving Sepsis Campaign: NA es el vasopresor de 1ª línea en shock séptico (α1 predominante → vasoconstricción → ↑RVS). Objetivo: PAM ≥65 mmHg.'},
    {q:'La atropina (antimuscarínico) se usa en:', options:['Taquicardia sinusal','Bradicardia sintomática','Hipertensión','Broncoespasmo crónico'], correct:1, explanation:'Atropina bloquea receptores M2 cardíacos → ↑FC. Es 1ª línea en bradicardia sintomática (ACLS). También útil en intoxicación por organofosforados.'},
    {q:'La dobutamina (β1 > β2) es de elección en:', options:['Shock séptico','Shock cardiogénico (↑contractilidad)','Shock hipovolémico','Asma aguda'], correct:1, explanation:'Dobutamina estimula β1 → ↑contractilidad (inotropismo +) con menos taquicardia que adrenalina. Indicada en shock cardiogénico con GC bajo.'},
    {q:'El salbutamol actúa selectivamente sobre receptores:', options:['α1','β1','β2','M3'], correct:2, explanation:'Salbutamol es agonista β2 selectivo → broncodilatación (relajación músculo liso bronquial). Es el SABA de rescate en crisis asmática.'},
    {q:'Los β-bloqueantes pueden enmascarar:', options:['Hipertensión','Signos de hipoglicemia (taquicardia, temblor)','Fiebre','Dolor torácico'], correct:1, explanation:'Los β-bloqueantes bloquean la respuesta adrenérgica a la hipoglicemia (taquicardia, temblor). La sudoración se mantiene (mediada por ACh). Precaución en DM insulinodependiente.'}
  ]
},

'farm-sansio': {
  vignette: {
    text: 'Mujer de 75 años con insomnio crónico recibe diazepam 10 mg/noche por 6 meses. Sufre caída nocturna con fractura de cadera.',
    question: '¿Cuál fue el error farmacológico y qué alternativa habría sido más segura?',
    answer: 'Diazepam es de vida media LARGA (T1/2 20-100h + metabolito activo desmetildiazepam) → acumulación en ancianos → sedación residual diurna → caídas. En adultos mayores: preferir BZD de vida media corta (lorazepam, oxazepam) a dosis bajas y por tiempo limitado, o alternativas no-BZD.'
  },
  quiz: [
    {q:'Las benzodiacepinas actúan potenciando:', options:['Dopamina','GABA (vía receptor GABA-A → ↑frecuencia de apertura del canal Cl-)','Serotonina','Glutamato'], correct:1, explanation:'Las BZD se unen al sitio BZD del receptor GABA-A → aumentan la frecuencia de apertura del canal de cloro → hiperpolarización → efecto sedante/ansiolítico/anticonvulsivante.'},
    {q:'El flumazenilo es el antídoto de:', options:['Opioides','Benzodiacepinas','Barbitúricos','Antidepresivos'], correct:1, explanation:'Flumazenilo es un antagonista competitivo del sitio BZD en el receptor GABA-A. Revierte sedación pero puede precipitar convulsiones en uso crónico de BZD.'},
    {q:'En adultos mayores se prefiere lorazepam sobre diazepam porque:', options:['Es más potente','Tiene vida media más corta y no tiene metabolitos activos','Es más barato','Tiene efecto más rápido'], correct:1, explanation:'Lorazepam: T1/2 10-20h, sin metabolitos activos (conjugación directa). Diazepam: T1/2 hasta 100h con metabolito activo. En ancianos → acumulación → caídas.'},
    {q:'Las "Z drugs" (zolpidem, zopiclona) se diferencian de las BZD en que:', options:['Actúan en receptor diferente','Son más selectivas para el subtipo α1 del GABA-A → más hipnóticas y menos ansiolíticas','No tienen riesgo de dependencia','Son más potentes como anticonvulsivantes'], correct:1, explanation:'Las Z-drugs son selectivas para la subunidad α1 → efecto hipnótico predominante con menor efecto ansiolítico, relajante muscular y anticonvulsivante. Aún tienen potencial de dependencia.'},
    {q:'La dependencia a BZD se desarrolla más rápido con:', options:['Dosis bajas y uso intermitente','Dosis altas y uso continuo >4 semanas','Solo uso por vía IV','Combinación con ISRS'], correct:1, explanation:'El uso continuo >4 semanas a dosis elevadas genera tolerancia y dependencia física. La suspensión debe ser gradual (10-25% semanal) para evitar síndrome de abstinencia (convulsiones).'}
  ]
},

'farm-spsiq': {
  vignette: {
    text: 'Paciente de 28 años, esquizofrenia paranoide, en tratamiento con haloperidol 10 mg/día × 3 semanas. Presenta rigidez muscular generalizada, fiebre 40°C, CPK 12.000 U/L y alteración de conciencia.',
    question: '¿Cuál es el diagnóstico y cuál es el tratamiento de emergencia?',
    answer: 'Síndrome neuroléptico maligno (SNM): reacción idiosincrática grave a antipsicóticos (especialmente típicos de alta potencia). Tríada: rigidez + hipertermia + ↑CPK. Tratamiento: suspender antipsicótico, dantroleno IV (relajante muscular), bromocriptina (agonista DA), enfriamiento activo, hidratación agresiva.'
  },
  quiz: [
    {q:'Los ISRS (fluoxetina, sertralina) actúan:', options:['Bloqueando receptores de dopamina','Inhibiendo selectivamente la recaptación de serotonina','Inhibiendo la MAO','Bloqueando receptores NMDA'], correct:1, explanation:'ISRS bloquean el transportador de serotonina (SERT) → ↑5-HT en la hendidura sináptica. Son 1ª línea en depresión y ansiedad por su perfil de seguridad.'},
    {q:'Los antipsicóticos típicos (haloperidol) tienen mayor riesgo de:', options:['Síndrome metabólico','Efectos extrapiramidales (distonía, acatisia, parkinsonismo)','Sedación excesiva','Prolongación QT'], correct:1, explanation:'Los típicos bloquean D2 fuertemente en vía nigroestriada → distonía aguda (horas), acatisia (días), parkinsonismo (semanas), discinesia tardía (meses-años).'},
    {q:'La L-DOPA se combina con carbidopa porque:', options:['Carbidopa potencia el efecto central','Carbidopa inhibe la DOPA-descarboxilasa periférica → ↓conversión a DA fuera del SNC → ↓náuseas y ↑DA central','Carbidopa es un antiemético','Carbidopa cruza la BHE'], correct:1, explanation:'Sin carbidopa, >95% de la L-DOPA se convierte en dopamina periféricamente → náuseas, hipotensión, sin efecto central. Carbidopa NO cruza BHE → solo bloquea conversión periférica.'},
    {q:'El síndrome serotoninérgico puede ocurrir con:', options:['ISRS + tramadol','ISRS solos a dosis bajas','β-bloqueantes','Antihistamínicos'], correct:0, explanation:'Sd serotoninérgico: exceso de 5-HT → tríada: agitación/clonus + hipertermia + disfunción autonómica. Ocurre por combinación de serotoninérgicos (ISRS + tramadol, ISRS + IMAO, ISRS + linezolid).'},
    {q:'Los antipsicóticos atípicos (olanzapina, quetiapina) se asocian a:', options:['Síndrome metabólico (↑peso, DM2, dislipidemia)','Menor eficacia antipsicótica','Más efectos extrapiramidales','Hepatotoxicidad siempre'], correct:0, explanation:'Los atípicos bloquean 5-HT2A+D2 → menos EPS pero producen síndrome metabólico (especialmente clozapina y olanzapina): ↑peso, hiperglicemia, dislipidemia. Monitorizar perfil metabólico.'}
  ]
},

'farm-saline': {
  vignette: {
    text: 'Paciente de 82 años con Alzheimer moderado (MMSE 15), en tratamiento con donepezilo 10 mg/día, presenta bradicardia sinusal de 42 lpm y mareos.',
    question: '¿Cuál es el mecanismo del efecto adverso cardíaco?',
    answer: 'Donepezilo inhibe AChE → ↑ACh sistémica → efecto vagotónico (M2 cardíaco) → bradicardia. Precaución en pacientes con bloqueo AV, sick sinus o uso concomitante de β-bloqueantes/BCC no-DHP. Considerar reducir dosis o cambiar a rivastigmina parche.'
  },
  quiz: [
    {q:'Los inhibidores de AChE para Alzheimer (donepezilo, rivastigmina) actúan:', options:['Eliminando placas amiloides','↑Acetilcolina en la hendidura sináptica al inhibir su degradación','Bloqueando receptores NMDA','Estimulando neurogénesis'], correct:1, explanation:'En Alzheimer hay déficit colinérgico por destrucción del núcleo basal de Meynert. Los inhibidores de AChE → ↑ACh disponible → mejora cognitiva sintomática (no detienen la enfermedad).'},
    {q:'La memantina es útil en Alzheimer moderado-severo porque:', options:['Es colinérgica','Bloquea receptores NMDA → ↓excitotoxicidad por glutamato','Disuelve placas amiloides','Es un ISRS'], correct:1, explanation:'Memantina es antagonista no competitivo del receptor NMDA → reduce la excitotoxicidad glutamatérgica crónica que contribuye a la neurodegeneración.'},
    {q:'La rivastigmina en parche transdérmico tiene como ventaja:', options:['Mayor eficacia','Menor incidencia de efectos GI (náuseas, vómitos)','Efecto más rápido','Penetración SNC superior'], correct:1, explanation:'La vía transdérmica evita el pico plasmático → menor estimulación colinérgica periférica GI → menos náuseas y vómitos que la vía oral.'},
    {q:'¿Cuál es la principal limitación de los tratamientos actuales para Alzheimer?', options:['Son muy caros','Son sintomáticos, no modifican la progresión de la enfermedad','Tienen muchas contraindicaciones','Solo funcionan en pacientes jóvenes'], correct:1, explanation:'Los inhibidores de AChE y memantina son SINTOMÁTICOS: mejoran cognición temporalmente pero NO detienen la neurodegeneración ni eliminan placas/ovillos. El beneficio es modesto y transitorio.'},
    {q:'La galantamina se diferencia de donepezilo en que además:', options:['Es un agonista nicotínico alostérico','Cruza mejor la BHE','Inhibe la MAO-B','Bloquea receptores D2'], correct:0, explanation:'Galantamina inhibe AChE + modula alostéricamente receptores nicotínicos → potencia la neurotransmisión colinérgica por doble mecanismo. Teóricamente más fisiológica.'}
  ]
},

'farm-sgastro': {
  vignette: {
    text: 'Paciente de 60 años, usuario crónico de omeprazol 40 mg/día × 3 años por ERGE, presenta fractura vertebral con densitometría osteopénica. Mg2+ sérico: 1.1 mg/dL.',
    question: '¿Cuál es la relación del IBP con estos hallazgos?',
    answer: 'Uso prolongado de IBP → ↓absorción de Ca2+ y Mg2+ → osteoporosis/fracturas + hipomagnesemia. También: ↑riesgo de infección por C. difficile, neumonía, déficit B12, nefritis intersticial. Se debe usar la menor dosis efectiva y reevaluar periódicamente la indicación.'
  },
  quiz: [
    {q:'Los IBP (omeprazol) actúan inhibiendo:', options:['Receptores H2 gástricos','La bomba H+/K+ ATPasa del canalículo secretor de la célula parietal','La acetilcolina gástrica','La gastrina'], correct:1, explanation:'Los IBP se unen irreversiblemente a la H+/K+ ATPasa (bomba de protones) → bloquean la etapa final de secreción ácida → ↓HCl >95%. Son los más potentes antisecretores.'},
    {q:'El sucralfato protege la mucosa gástrica porque:', options:['Inhibe la secreción ácida','Forma una barrera protectora sobre la úlcera al unirse a proteínas del lecho ulceroso','Es un antiácido','Inhibe H. pylori'], correct:1, explanation:'Sucralfato es un complejo de aluminio + sacarosa que en medio ácido se polimeriza y se adhiere selectivamente al tejido ulcerado → barrera contra ácido, pepsina y sales biliares.'},
    {q:'El esquema de erradicación de H. pylori incluye:', options:['Solo IBP por 8 semanas','IBP + 2 ATB (claritromicina + amoxicilina) × 14 días','Solo antibióticos','Bismuto solo'], correct:1, explanation:'Triple terapia estándar: IBP (bid) + claritromicina 500mg (bid) + amoxicilina 1g (bid) × 14 días. En alergia a penicilina: reemplazar amoxicilina por metronidazol.'},
    {q:'El misoprostol (PGE1) está indicado en:', options:['ERGE','Prevención de gastropatía por AINEs','Diarrea crónica','Estreñimiento'], correct:1, explanation:'Misoprostol reemplaza las PG gástricas inhibidas por AINEs → citoprotección + ↓secreción ácida. Contraindicado en embarazo (oxitócico → aborto).'},
    {q:'La metoclopramida como procinético tiene como efecto adverso principal:', options:['Diarrea osmótica','Efectos extrapiramidales (distonía, acatisia)','Hepatotoxicidad','Nefrotoxicidad'], correct:1, explanation:'Metoclopramida bloquea D2 → estimula motilidad GI PERO puede causar EPS (especialmente en jóvenes y uso prolongado): distonía aguda, acatisia, parkinsonismo. Domperidona: alternativa con menos EPS (no cruza BHE tanto).'}
  ]
},

'farm-saines': {
  vignette: {
    text: 'Paciente de 70 años, HTA + ERC (VFG 35), toma ibuprofeno 600 mg c/8h × 2 semanas por gonalgia. Creatinina sube de 1.8 a 3.5 mg/dL. K+: 5.9 mEq/L.',
    question: '¿Cuál es el mecanismo del daño renal y por qué está contraindicado el AINE en este paciente?',
    answer: 'AINEs inhiben COX → ↓PGE2 vasodilatadora de arteriola aferente → vasoconstricción → ↓flujo renal → AKI prerrenal funcional. En ERC la función renal depende de PG compensadoras. Además: retención de Na+ y K+ → hiperkalemia. AINEs contraindicados en ERC, especialmente con IECA/ARA-II (triple whammy).'
  },
  quiz: [
    {q:'Los AINEs producen gastropatía porque inhiben:', options:['COX-2','COX-1 (PGE2 protectora de mucosa gástrica)','LOX','Fosfolipasa A2'], correct:1, explanation:'COX-1 produce PGE2 que mantiene la barrera mucosa gástrica (↑moco, ↑bicarbonato, ↑flujo sanguíneo). Su inhibición → úlcera y hemorragia GI.'},
    {q:'Los corticoides sistémicos producen todos EXCEPTO:', options:['Hiperglicemia','Osteoporosis','Inmunosupresión','Hipotensión'], correct:3, explanation:'Los corticoides causan retención de Na+ y agua → HIPERTENSIÓN, no hipotensión. Además: Cushing iatrogénico, hiperglicemia, osteoporosis, supresión suprarrenal, inmunosupresión.'},
    {q:'El paracetamol es el analgésico de elección en:', options:['Dolor inflamatorio agudo','Dolor leve-moderado en pacientes con riesgo GI o renal','Artritis reumatoide activa','Dolor neuropático'], correct:1, explanation:'Paracetamol es analgésico/antipirético SIN efecto antiinflamatorio significativo. No daña mucosa gástrica ni altera función renal → seguro en ERC y riesgo GI. Hepatotóxico en sobredosis (>4g/día).'},
    {q:'La supresión suprarrenal por corticoides ocurre cuando:', options:['Se usan tópicamente','Se usan >7-14 días sistémicamente → requiere retiro gradual','Se usan por vía inhalatoria a dosis bajas','Se da una sola dosis IV'], correct:1, explanation:'Corticoides exógenos → ↓ACTH (feedback negativo) → atrofia suprarrenal. Si se suspenden bruscamente tras uso prolongado → crisis addisoniana (hipotensión, shock). Retiro gradual obligatorio.'},
    {q:'Los coxibs (celecoxib) se diseñaron para:', options:['Mayor efecto antiinflamatorio','Inhibir selectivamente COX-2 → menor gastropatía','Proteger el riñón','Reemplazar a los corticoides'], correct:1, explanation:'Coxibs: selectivos COX-2 → ↓riesgo GI pero mantienen riesgo CV (↓PGI2 sin ↓TXA2 → desequilibrio protrombótico). Rofecoxib fue retirado por ↑eventos CV.'}
  ]
},

'farm-svacunas': {
  vignette: {
    text: 'Paciente trasplantado renal en tratamiento con tacrolimus + micofenolato + prednisona. Consulta si puede vacunarse contra influenza y varicela.',
    question: '¿Cuáles puede recibir y cuáles están contraindicadas?',
    answer: 'Influenza inactivada: SÍ (segura en inmunosuprimidos, aunque respuesta puede ser menor). Varicela (virus vivo atenuado): CONTRAINDICADA en inmunosuprimidos → riesgo de enfermedad diseminada. Las vacunas de virus vivos están contraindicadas en inmunosupresión.'
  },
  quiz: [
    {q:'Las vacunas de virus vivos atenuados están contraindicadas en:', options:['Adultos mayores sanos','Pacientes inmunosuprimidos','Niños >6 meses','Pacientes con alergia al huevo'], correct:1, explanation:'Virus vivos (varicela, BCG, SRP, fiebre amarilla, rotavirus) pueden causar enfermedad diseminada en inmunosuprimidos. Solo se pueden usar vacunas inactivadas.'},
    {q:'El tacrolimus actúa inhibiendo:', options:['Síntesis de ADN','Calcineurina → bloquea IL-2 → supresión de linfocitos T','COX-2','Receptores de histamina'], correct:1, explanation:'Tacrolimus se une a FKBP12 → complejo inhibe calcineurina → ↓NFAT → ↓IL-2 → ↓proliferación de linfocitos T. Es la base de la inmunosupresión en trasplante.'},
    {q:'El micofenolato actúa como:', options:['Inhibidor de calcineurina','Inhibidor de IMPDH (inosina monofosfato deshidrogenasa) → ↓síntesis de purinas en linfocitos','Corticoide sintético','Anticuerpo monoclonal'], correct:1, explanation:'Micofenolato inhibe IMPDH → bloquea la vía de novo de síntesis de purinas. Los linfocitos dependen exclusivamente de esta vía (no pueden usar la vía de salvamento) → selectividad por linfocitos.'},
    {q:'Las vacunas de ARNm (COVID-19) son seguras en inmunosuprimidos porque:', options:['No contienen virus vivo ni atenuado','Son más potentes','No necesitan refuerzos','No producen anticuerpos'], correct:0, explanation:'Las vacunas ARNm no contienen virus → no hay riesgo de enfermedad diseminada. Son seguras en inmunosuprimidos, aunque la respuesta inmune puede ser menor → se recomiendan dosis adicionales.'},
    {q:'La inmunoglobulina humana (IgIV) proporciona:', options:['Inmunidad activa de larga duración','Inmunidad pasiva inmediata pero transitoria','Estimulación de linfocitos T','Protección de por vida'], correct:1, explanation:'La IgIV aporta anticuerpos preformados → protección INMEDIATA pero temporal (semanas). Se usa en post-exposición (hepatitis B, rabia, tétanos) y en enfermedades autoinmunes.'}
  ]
},

// ─── FISIOPATOLOGÍA ─────────────────────────────────────────

'fisio-c01pptx': {
  vignette: {
    text: 'Paciente de 55 años, hipertenso de larga data sin tratamiento, ecocardiograma muestra ventrículo izquierdo con pared de 14 mm (normal <11 mm), sin dilatación de cavidades.',
    question: '¿Qué tipo de adaptación celular presenta y cuál es el estímulo?',
    answer: 'Hipertrofia concéntrica del VI por sobrecarga de presión crónica (HTA). Las células miocárdicas aumentan de tamaño (no de número) → ↑grosor de pared → eventualmente disfunción diastólica → IC con FEVI preservada. Es reversible si se controla la HTA a tiempo.'
  },
  quiz: [
    {q:'La hiperplasia se diferencia de la hipertrofia en que:', options:['Implica aumento del número de células vs aumento del tamaño','Son sinónimos','Solo ocurre en tejido muscular','Es siempre patológica'], correct:0, explanation:'Hiperplasia: ↑número de células (solo en tejidos capaces de dividirse). Hipertrofia: ↑tamaño de cada célula. El miocardio solo hace hipertrofia (cardiomiocitos adultos no se dividen).'},
    {q:'La metaplasia epitelial más frecuente es:', options:['Glandular a escamoso','Escamoso a cilíndrico','Cilíndrico a escamoso (ej. bronquios en fumadores)','Óseo a cartilaginoso'], correct:2, explanation:'En fumadores: el epitelio cilíndrico ciliado bronquial → escamoso estratificado (más resistente al humo, pero pierde función ciliar → no limpia secreciones).'},
    {q:'La displasia se considera:', options:['Siempre benigna','Una lesión preneoplásica potencialmente reversible','Un tipo de neoplasia','Igual que metaplasia'], correct:1, explanation:'Displasia es proliferación desordenada con atipia celular. Es PRENEOPLÁSICA pero potencialmente reversible si se elimina el estímulo. Displasia severa → carcinoma in situ.'},
    {q:'La atrofia muscular por desuso se produce por:', options:['Necrosis celular','↓Síntesis proteica + ↑degradación vía ubiquitina-proteasoma','Apoptosis masiva','Isquemia crónica'], correct:1, explanation:'La falta de uso → señales catabólicas → ↓síntesis proteica y ↑proteólisis vía ubiquitina-proteasoma. Es reversible con rehabilitación si el estímulo se restablece.'},
    {q:'¿Cuál de las siguientes es una adaptación FISIOLÓGICA?', options:['Metaplasia bronquial por tabaco','Hipertrofia del útero en embarazo','Displasia cervical por VPH','Atrofia por denervación'], correct:1, explanation:'La hipertrofia uterina en embarazo es fisiológica (estímulo hormonal: estrógenos). Las demás son patológicas.'}
  ]
},

'fisio-c02pptx': {
  vignette: {
    text: 'Paciente de 22 años, ingesta de paracetamol 15 g en intento suicida hace 24h. GOT 8.500 U/L, GPT 9.200 U/L, INR 4.5, bilirrubina 6 mg/dL.',
    question: '¿Cuál es el mecanismo de daño hepático y cuál es el antídoto?',
    answer: 'Sobredosis de paracetamol → saturación de glucuronidación y sulfatación → más sustrato para CYP2E1 → ↑NAPQI (metabolito tóxico) → depleción de glutatión → necrosis centrolobulillar. Antídoto: N-acetilcisteína (NAC) → restaura glutatión. Más efectivo <8h post-ingesta.'
  },
  quiz: [
    {q:'La necrosis se diferencia de la apoptosis en que:', options:['Es un proceso ordenado','Provoca respuesta inflamatoria','No libera contenido celular','Es siempre programada'], correct:1, explanation:'Necrosis: desordenada, la célula se hincha y revienta → liberación de contenido → INFLAMACIÓN. Apoptosis: ordenada, la célula se encoge, fragmenta el ADN y forma cuerpos apoptóticos → SIN inflamación.'},
    {q:'La lesión por isquemia-reperfusión se produce porque:', options:['La isquemia sola es el único mecanismo','Al restaurar el flujo sanguíneo → entrada masiva de O2 → radicales libres → daño oxidativo','La reperfusión protege al tejido','Los radicales libres son protectores'], correct:1, explanation:'La reperfusión genera un burst de ROS (O2•-, H2O2, OH•) por xantina oxidasa, mitocondria y neutrófilos → daño oxidativo que puede ser peor que la isquemia misma. Base del daño post-IAM y post-AVE.'},
    {q:'El tipo de necrosis más frecuente es:', options:['Caseosa','Coagulativa (por isquemia)','Licuefactiva','Grasa'], correct:1, explanation:'Necrosis coagulativa: la más común. Ocurre por isquemia en la mayoría de tejidos (excepto cerebro → licuefactiva). Se preserva la arquitectura tisular inicialmente.'},
    {q:'Las caspasas son enzimas clave en:', options:['Necrosis','Apoptosis','Inflamación aguda','Fibrosis'], correct:1, explanation:'Las caspasas son proteasas ejecutoras de la apoptosis. Vía intrínseca: citocromo C → Apaf-1 → caspasa 9 → caspasa 3. Vía extrínseca: FasL/TNF → caspasa 8 → caspasa 3.'},
    {q:'El daño celular REVERSIBLE se caracteriza por:', options:['Ruptura de membrana','Cariólisis','Tumefacción celular (edema) y degeneración grasa','Liberación de enzimas al plasma'], correct:2, explanation:'Lesión reversible: hinchazón celular (fallo Na+/K+ ATPasa → entrada de Na+ y agua), degeneración grasa (acumulación de lípidos). Si el estímulo persiste → punto de no retorno → necrosis.'}
  ]
},

'fisio-c01pdf': {
  vignette: {
    text: 'Paciente de 40 años con artritis reumatoide de 10 años de evolución, con deformidad de manos tipo cuello de cisne y ráfaga cubital.',
    question: '¿Por qué la inflamación crónica produce destrucción articular?',
    answer: 'Inflamación crónica → pannus sinovial (tejido granulatorio) → linfocitos T, macrófagos, células plasmáticas → liberación continua de TNF-α, IL-1, IL-6 + MMP (metaloproteasas) → destrucción de cartílago y hueso subcondral. A diferencia de la inflamación aguda (neutrófilos), la crónica es dominada por macrófagos y linfocitos.'
  },
  quiz: [
    {q:'Los signos cardinales de la inflamación aguda son:', options:['Fiebre, tos, disnea, cianosis','Rubor, tumor, calor, dolor, pérdida de función','Necrosis, fibrosis, calcificación','Edema, equimosis, hematoma'], correct:1, explanation:'Rubor y calor (vasodilatación), tumor (edema por ↑permeabilidad), dolor (PGE2 y bradicinina sensibilizan nociceptores), pérdida de función (impotencia funcional).'},
    {q:'La célula predominante en inflamación aguda es:', options:['Linfocito','Macrófago','Neutrófilo','Eosinófilo'], correct:2, explanation:'Los neutrófilos llegan primero (6-24h) a la inflamación aguda. Son los principales fagocitos y liberan enzimas lisosomales y ROS. Los macrófagos predominan en la inflamación crónica.'},
    {q:'La inflamación granulomatosa es característica de:', options:['Apendicitis aguda','Tuberculosis (granuloma caseificante)','Infarto agudo de miocardio','Neumonía bacteriana típica'], correct:1, explanation:'El granuloma TB: macrófagos epitelioides + células gigantes multinucleadas (Langhans) + linfocitos T + necrosis caseosa central. También: sarcoidosis (sin caseosis), cuerpos extraños.'},
    {q:'La PCR (proteína C reactiva) es útil como marcador porque:', options:['Es específica de infección','Se eleva rápidamente (6-8h) en respuesta a IL-6 hepática','Solo se eleva en inflamación crónica','Es intracelular'], correct:1, explanation:'La PCR es un reactante de fase aguda sintetizado en el hígado en respuesta a IL-6. Se eleva en horas, con pico a 48h. Es inespecífica pero sensible → útil para monitorizar actividad inflamatoria.'},
    {q:'La resolución de la inflamación aguda depende de:', options:['Lipoxinas, resolvinas y protectinas (mediadores pro-resolución)','Más neutrófilos','↑COX-2','Fibrosis obligatoria'], correct:0, explanation:'Las lipoxinas (derivadas de araquidónico) y resolvinas/protectinas (derivadas de omega-3) son mediadores activos de resolución: inhiben reclutamiento de neutrófilos, promueven fagocitosis de restos y restauran homeostasis.'}
  ]
},

'fisio-cicatr': {
  vignette: {text:'Paciente diabético, 65 años, úlcera plantar de 6 semanas sin mejoría pese a curaciones diarias. Base fibrinosa, bordes callosos, sin tejido de granulación visible.', question:'¿Qué factores fisiopatológicos de la DM alteran la cicatrización?', answer:'DM → microangiopatía (↓perfusión) + neuropatía (↓sensibilidad → trauma repetido) + hiperglicemia (↓función leucocitaria, ↓quimiotaxis) + AGEs (↓síntesis de colágeno) + biofilm bacteriano. Cicatrización requiere: descarga (bota), desbridamiento, control metabólico estricto, revascularización si PAD.'},
  quiz: [
    {q:'La fase proliferativa de la cicatrización se caracteriza por:', options:['Vasoconstricción','Angiogénesis + formación de tejido de granulación + epitelización','Remodelación de colágeno','Hemostasia primaria'], correct:1, explanation:'Fase proliferativa (3-21 días): angiogénesis (nuevos vasos), fibroplasia (fibroblastos → colágeno tipo III), formación de tejido de granulación (rojo, húmedo, granular) y epitelización desde los bordes.'},
    {q:'El colágeno tipo III es reemplazado por tipo I durante la fase de:', options:['Hemostasia','Inflamación','Proliferación','Remodelación (maduración)'], correct:3, explanation:'Remodelación (21 días a 1-2 años): colágeno III (inmaduro) → colágeno I (maduro, más fuerte). La cicatriz alcanza máximo 80% de la resistencia de la piel original.'},
    {q:'Los corticoides retrasan la cicatrización porque:', options:['Son bactericidas','Inhiben la síntesis de colágeno + suprimen inflamación necesaria + ↓angiogénesis','Causan vasoconstricción local','Producen necrosis tisular'], correct:1, explanation:'Corticoides → ↓fibroblastos, ↓colágeno, ↓angiogénesis, ↓quimiotaxis de neutrófilos/macrófagos. Retrasan TODAS las fases de cicatrización.'},
    {q:'Una herida que cierra por segunda intención se caracteriza por:', options:['Cierre primario con suturas','Granulación desde el fondo + contracción de bordes','Injerto cutáneo obligatorio','Cicatrización sin cicatriz'], correct:1, explanation:'Segunda intención: herida abierta (ej. úlcera, quemadura) → se llena de tejido de granulación desde el fondo → contracción de miofibroblastos → epitelización. Proceso más lento, cicatriz mayor.'},
    {q:'El queloide se diferencia de la cicatriz hipertrófica en que:', options:['Es más pequeño','Se extiende MÁS ALLÁ de los límites de la herida original','Desaparece espontáneamente','Solo ocurre en quemaduras'], correct:1, explanation:'Queloide: excede los márgenes originales de la herida, no regresa espontáneamente, más frecuente en piel oscura. Cicatriz hipertrófica: se mantiene dentro de los límites y tiende a mejorar con el tiempo.'}
  ]
},

'fisio-c02pdf': {
  vignette: {text:'Paciente EPOC, PaCO2 basal 55 mmHg, llega a urgencias con SatO2 78%. Se administra O2 al 100% con mascarilla de alto flujo. A los 30 min, paciente somnoliento, PaCO2 75 mmHg.', question:'¿Qué ocurrió y cuál era la indicación correcta de O2?', answer:'EPOC con CO2 retenedores: el drive respiratorio depende de la hipoxemia (quimiorreceptores periféricos). O2 al 100% → corrige hipoxemia → elimina estímulo ventilatorio → hipoventilación → narcosis por CO2. Indicación: O2 controlado con Venturi 24-28%, objetivo SatO2 88-92%.'},
  quiz: [
    {q:'La relación V/Q normal en un adulto sano es aproximadamente:', options:['0.2','0.8','1.5','2.0'], correct:1, explanation:'V/Q = ventilación alveolar/perfusión ≈ 0.8. Shunt (V/Q=0): perfusión sin ventilación. Espacio muerto (V/Q=∞): ventilación sin perfusión.'},
    {q:'La hipoxemia con gradiente A-a normal sugiere:', options:['TEP','Neumonía','Hipoventilación alveolar global','SDRA'], correct:2, explanation:'Gradiente A-a normal + hipoxemia = hipoventilación global (todas las unidades ventilan menos). Causas: depresión SNC, enfermedades neuromusculares, obesidad severa. El pulmón está sano.'},
    {q:'La curva de disociación de hemoglobina se desplaza a la DERECHA (↓afinidad, ↑liberación de O2) por:', options:['Alcalosis, hipotermia, ↓2,3-DPG','Acidosis, hipertermia, ↑2,3-DPG, ↑CO2','Intoxicación por CO','Hiperventilación'], correct:1, explanation:'Efecto Bohr: ↑H+, ↑CO2, ↑temperatura, ↑2,3-DPG → desplazamiento derecho → Hb libera O2 más fácilmente en tejidos metabólicamente activos (ej. músculo en ejercicio, tejido inflamado).'},
    {q:'El surfactante pulmonar es producido por:', options:['Neumocitos tipo I','Neumocitos tipo II','Macrófagos alveolares','Células de Clara'], correct:1, explanation:'Neumocitos tipo II sintetizan y secretan surfactante (fosfolípidos, principalmente dipalmitoilfosfatidilcolina). Reduce la tensión superficial → evita colapso alveolar en espiración.'},
    {q:'La vasoconstricción pulmonar hipóxica tiene como función:', options:['Proteger el corazón','Desviar sangre de alvéolos mal ventilados hacia los bien ventilados → optimizar V/Q','Aumentar la presión arterial sistémica','Reducir el gasto cardíaco'], correct:1, explanation:'La VPH es un mecanismo local: cuando un alvéolo está hipóxico → vasoconstricción arteriolar local → la sangre se redistribuye a alvéolos bien ventilados → mejora V/Q. Es único del pulmón (en otros órganos la hipoxia causa vasodilatación).'}
  ]
},

'fisio-c03': {
  vignette: {text:'Niño de 8 años con asma alérgica, presenta sibilancias y disnea tras exposición a polvo. Peak flow 55% del predicho. Usa salbutamol inhalado con mejoría parcial.', question:'¿Qué mediadores están involucrados y por qué se necesita además un controlador?', answer:'Fase temprana (min): IgE→mastocitos→histamina, LTC4/D4 (1000× más potente que histamina), PGD2 → broncoespasmo agudo. Fase tardía (4-8h): eosinófilos, Th2, IL-4/5/13 → inflamación crónica → remodelación. SABA alivia el espasmo pero no la inflamación → necesita ICS como controlador.'},
  quiz: [
    {q:'El asma se caracteriza por obstrucción bronquial:', options:['Irreversible','Reversible (espontánea o con broncodilatador)','Solo nocturna','Fija'], correct:1, explanation:'A diferencia del EPOC (irreversible), el asma tiene obstrucción REVERSIBLE. El test de broncodilatación (+) confirma: ↑FEV1 ≥12% y ≥200 mL post-salbutamol.'},
    {q:'El controlador de 1ª línea en asma persistente es:', options:['Salbutamol diario','Corticoide inhalado (ICS)','Montelukast','Teofilina'], correct:1, explanation:'GINA: ICS (budesonida, fluticasona) son la base del tratamiento controlador. Reducen inflamación crónica, hiperreactividad y remodelación. El SABA solo se usa como rescate.'},
    {q:'La tríada de la remodelación bronquial en asma crónica incluye:', options:['Fibrosis, angiogénesis, hipertrofia muscular lisa','Necrosis, calcificación, metaplasia','Edema, eritema, exudado','Bronquiectasias, enfisema, fibrosis'], correct:0, explanation:'Remodelación: engrosamiento de membrana basal (fibrosis subepitelial), hipertrofia/hiperplasia del músculo liso, ↑vascularización, hiperplasia de células caliciformes → obstrucción progresiva.'},
    {q:'El asma casi fatal (near-fatal) se asocia especialmente a:', options:['Uso regular de ICS','Intubación previa + uso excesivo de SABA + mala adherencia','Asma leve intermitente','Rinitis alérgica aislada'], correct:1, explanation:'Factores de riesgo de muerte: intubación previa, >2 hospitalizaciones/año, uso >1 canister SABA/mes, no usa ICS, comorbilidad psiquiátrica. Estos pacientes requieren plan de acción escrito.'},
    {q:'La clasificación GINA del asma se basa en:', options:['Espirometría solamente','Frecuencia de síntomas diurnos/nocturnos + uso de SABA + limitación de actividad + función pulmonar','Radiografía de tórax','Niveles de IgE'], correct:1, explanation:'GINA clasifica en intermitente, persistente leve/moderada/severa según: síntomas diurnos y nocturnos, uso de rescate, limitación de actividades y FEV1.'}
  ]
},

'fisio-c04': {
  vignette: {text:'Hombre de 68 años, fumador de 40 paq/año, disnea progresiva, FEV1/FVC post-BD 0.62, FEV1 38% del predicho. Gasometría: PaO2 52, PaCO2 58.', question:'¿Cuál es la clasificación GOLD y cuál es la base del tratamiento?', answer:'GOLD 3 (severo): FEV1 30-49%. Con hipercapnia crónica. Tratamiento base: LAMA (tiotropio) + LABA + ICS si exacerbaciones. O2 domiciliario (>15h/día) si PaO2 <55 o <60 con cor pulmonale. Meta SatO2 88-92% (NO 100%).'},
  quiz: [
    {q:'La diferencia fundamental entre EPOC y asma es:', options:['El EPOC no produce tos','La obstrucción en EPOC es poco reversible o irreversible','El EPOC no tiene componente inflamatorio','El asma solo afecta niños'], correct:1, explanation:'EPOC: obstrucción progresiva NO completamente reversible (FEV1/FVC <0.7 post-BD). Inflamación neutrofílica + destrucción parenquimatosa (enfisema). El asma es reversible con inflamación eosinofílica.'},
    {q:'El enfisema se caracteriza por:', options:['Fibrosis de la vía aérea pequeña','Destrucción de paredes alveolares → pérdida de retracción elástica','Broncoespasmo reversible','Hiperplasia de glándulas mucosas'], correct:1, explanation:'Enfisema: desequilibrio proteasas/antiproteasas (elastasa > α1-antitripsina) + estrés oxidativo → destrucción de septos alveolares → atrapamiento aéreo, hiperinsuflación, ↓superficie de intercambio.'},
    {q:'El principal broncodilatador de mantenimiento en EPOC es:', options:['Salbutamol','Tiotropio (LAMA)','Aminofilina','Cromoglicato'], correct:1, explanation:'GOLD 2024: LAMA (tiotropio, glicopirronio) es la base del tratamiento de mantenimiento. LABA se añade si persisten síntomas. ICS se añade solo si eosinófilos >300 o exacerbaciones frecuentes.'},
    {q:'La indicación de O2 domiciliario en EPOC es:', options:['SatO2 <95%','PaO2 <55 mmHg (o <60 con cor pulmonale/policitemia)','Cualquier paciente con EPOC','Solo durante exacerbaciones'], correct:1, explanation:'O2 domiciliario si PaO2 ≤55 o PaO2 56-59 + cor pulmonale o policitemia. Meta: SatO2 88-92%. Uso >15h/día demostró ↑sobrevida (estudios NOTT y MRC).'},
    {q:'Las exacerbaciones de EPOC se tratan con:', options:['Solo O2 al 100%','SABA + corticoide sistémico (5 días) + ATB si indicado','Solo antibióticos','Ventilación mecánica invasiva siempre'], correct:1, explanation:'Exacerbación: SABA nebulizado + prednisona 40mg/5días + ATB si esputo purulento/fiebre. VNI si acidosis respiratoria (pH <7.35). La intubación es último recurso.'}
  ]
},

'fisio-c05': {
  vignette: {text:'Paciente de 50 años post-cirugía abdominal, desarrolla disnea aguda, SatO2 85%, crepitantes bilaterales, PaO2/FiO2 = 150, Rx tórax con infiltrados bilaterales. BNP normal.', question:'¿Es edema pulmonar cardiogénico o SDRA? ¿Cómo se diferencia?', answer:'SDRA (Berlín): PaO2/FiO2 <200 (moderado), infiltrados bilaterales no explicados por IC (BNP normal, sin congestión), inicio agudo <7 días. Edema cardiogénico: BNP elevado, congestión, respuesta a diuréticos. Tratamiento SDRA: ventilación protectora (Vt 6 mL/kg, PEEP, plateau <30).'},
  quiz: [
    {q:'El SDRA se clasifica según PaO2/FiO2 (Berlín) como leve cuando:', options:['<100','100-200','200-300','300-400'], correct:2, explanation:'Berlín: leve 200-300, moderado 100-200, severo <100. Todos con PEEP ≥5 cmH2O. El cociente PaO2/FiO2 normal es ~500.'},
    {q:'La ventilación protectora en SDRA usa:', options:['Volumen tidal alto (10-12 mL/kg)','Volumen tidal bajo (6 mL/kg) + PEEP + presión plateau <30 cmH2O','Solo O2 al 100%','CPAP nasal'], correct:1, explanation:'ARDSNet: Vt 4-6 mL/kg de peso ideal + PEEP óptimo + Pplateau <30 cmH2O. El Vt bajo ↓VILI (ventilator-induced lung injury). Es la estrategia con mayor evidencia de ↓mortalidad en SDRA.'},
    {q:'El edema pulmonar cardiogénico se produce por:', options:['↑Permeabilidad capilar','↑Presión hidrostática capilar (presión capilar pulmonar >18 mmHg)','Déficit de surfactante','Infección alveolar'], correct:1, explanation:'IC izquierda → ↑presión AI → ↑presión capilar pulmonar → transudado al intersticio y alvéolo. Se trata con diuréticos + vasodilatadores + soporte de la causa. SDRA en cambio es por ↑permeabilidad (exudado).'},
    {q:'El surfactante es deficiente en SDRA porque:', options:['No se produce suficiente','El daño alveolar difuso destruye neumocitos tipo II + las proteínas plasmáticas inactivan el surfactante','Se reabsorbe rápido','Los macrófagos lo fagocitan'], correct:1, explanation:'SDRA: daño alveolar difuso → destrucción de neumocitos II (productores de surfactante) + exudado proteico inactiva el surfactante restante → atelectasia → shunt → hipoxemia refractaria.'},
    {q:'La posición prono en SDRA moderado-severo:', options:['Está contraindicada','Mejora la oxigenación al redistribuir ventilación y perfusión → ↓mortalidad (estudio PROSEVA)','Solo es de confort','Empeora la ventilación'], correct:1, explanation:'Prono ≥16h/día en SDRA moderado-severo (PaO2/FiO2 <150): redistribuye ventilación a zonas dorsales (más perfundidas) → mejora V/Q → mejora oxigenación. PROSEVA demostró ↓mortalidad significativa.'}
  ]
},

'fisio-c06': {
  vignette: {text:'Paciente de 30 años, Guillain-Barré, debilidad muscular progresiva ascendente, CVF 800 mL (predicha 3500 mL), PaCO2 65 mmHg.', question:'¿Qué tipo de insuficiencia respiratoria y cuál es la conducta?', answer:'IR tipo II (hipercápnica) por falla de bomba ventilatoria (debilidad muscular). CVF <1L o <25% del predicho → indicación de intubación y ventilación mecánica. La hipoxemia se corrige con O2, pero el problema es la hipoventilación → requiere soporte ventilatorio.'},
  quiz: [
    {q:'La insuficiencia respiratoria tipo I se define por:', options:['PaCO2 >45','PaO2 <60 mmHg con PaCO2 normal o baja','Solo desaturación nocturna','pH <7.35'], correct:1, explanation:'IR tipo I (hipoxémica): falla en el intercambio gaseoso (neumonía, SDRA, TEP). PaO2 <60 mmHg con PaCO2 normal o ↓ (hiperventilación compensadora). IR tipo II: PaCO2 >45 (falla de bomba).'},
    {q:'La VNI (ventilación no invasiva) está indicada en:', options:['SDRA severo','Exacerbación de EPOC con acidosis respiratoria (pH 7.25-7.35)','Paro cardíaco','Glasgow <8'], correct:1, explanation:'VNI (BiPAP): indicación principal es exacerbación EPOC con acidosis respiratoria leve-moderada. Contraindicada si: Glasgow <8, inestabilidad hemodinámica, secreciones inmanejables, trauma facial.'},
    {q:'La PEEP en ventilación mecánica sirve para:', options:['↑Volumen tidal','Mantener alvéolos abiertos al final de la espiración → prevenir atelectasia → mejorar oxigenación','Reducir la frecuencia respiratoria','Eliminar CO2'], correct:1, explanation:'PEEP mantiene presión positiva al final de espiración → recluta alvéolos colapsados → ↑CRF, ↑superficie de intercambio → mejora oxigenación. No afecta directamente la eliminación de CO2.'},
    {q:'Un paciente con PaO2 55 y PaCO2 70 tiene:', options:['IR tipo I','IR tipo II','IR mixta (tipo I + II)','Función respiratoria normal'], correct:2, explanation:'PaO2 <60 (tipo I) + PaCO2 >45 (tipo II) = IR mixta o global. Ejemplo: EPOC severo con neumonía sobreagregada → falla de bomba + falla de intercambio.'},
    {q:'La causa más frecuente de IR tipo II en UCI es:', options:['Neumonía','EPOC exacerbado','Depresión del centro respiratorio (sedación, opioides)','Asma'], correct:2, explanation:'En UCI, la sedación y opioides deprimen el centro respiratorio → hipoventilación → ↑CO2. Fuera de UCI: EPOC, enfermedades neuromusculares (Guillain-Barré, miastenia), obesidad severa (Pickwick).'}
  ]
},

'fisio-c07': {
  vignette: {text:'Mujer de 70 años, FEVI 28%, disnea CF III, edema de EEII, ingurgitación yugular, crepitantes bibasales. PA 100/65. Tratamiento: enalapril + furosemida.', question:'¿Qué fármacos faltan según las guías actuales de IC con FEVIr?', answer:'Faltan los 4 pilares: 1) IECA/ARA-II ✓ (enalapril). 2) β-bloqueante (carvedilol/bisoprolol/metoprolol): iniciar a dosis baja cuando estable. 3) ARM (espironolactona/eplerenona). 4) iSGLT2 (dapagliflozina/empagliflozina). Estos 4 reducen mortalidad. La furosemida es sintomática (congestión) pero no reduce mortalidad.'},
  quiz: [
    {q:'En IC con FEVIr, ¿cuántos pilares farmacológicos reducen mortalidad?', options:['2','3','4 (IECA/ARA-II + β-bloq + ARM + iSGLT2)','5'], correct:2, explanation:'Los 4 pilares de IC con FEVIr: 1) IECA/ARNI, 2) β-bloqueante (carvedilol/bisoprolol/metoprolol), 3) ARM (espironolactona), 4) iSGLT2. Cada uno demostró ↓mortalidad en ensayos clínicos independientes.'},
    {q:'El mecanismo de Frank-Starling se refiere a:', options:['↑Contractilidad por catecolaminas','↑Fuerza de contracción cuando ↑precarga (estiramiento de fibras)','↓Postcarga con vasodilatadores','Remodelación ventricular'], correct:1, explanation:'Ley de Frank-Starling: a mayor estiramiento de la fibra miocárdica (precarga), mayor fuerza de contracción (hasta un punto). En IC descompensada, el corazón opera en la parte plana/descendente de la curva.'},
    {q:'El BNP/NT-proBNP se eleva en IC porque:', options:['Se produce en el riñón','Los cardiomiocitos lo secretan en respuesta a la distensión de pared ventricular','Es un marcador hepático','Se acumula por falta de excreción'], correct:1, explanation:'BNP se libera por distensión de los ventrículos → natriuresis, vasodilatación, ↓aldosterona. Su nivel plasmático correlaciona con severidad de IC. Útil para diagnóstico (descarta IC si normal) y pronóstico.'},
    {q:'La IC con FEVI preservada (>50%) se trata principalmente con:', options:['Los mismos 4 pilares que FEVIr','Control de comorbilidades (HTA, FA, DM, obesidad) + diuréticos si congestión + iSGLT2','Digoxina','Milrinone crónico'], correct:1, explanation:'ICFEVIp no tiene los mismos 4 pilares que ICFEVIr (β-bloq, IECA/ARNI no demostraron beneficio claro). Se centra en: control de comorbilidades, diuréticos para congestión, e iSGLT2 (EMPEROR-Preserved demostró beneficio).'},
    {q:'El remodelamiento ventricular adverso en IC implica:', options:['Corazón más pequeño y eficiente','Dilatación + hipertrofia + fibrosis → geometría esférica → ↓eficiencia contráctil','Solo cambio de forma sin consecuencias','Mejora de la FEVI'], correct:1, explanation:'Remodelamiento adverso: activación neurohumoral crónica (SRAA, SNS) → hipertrofia, fibrosis, apoptosis, dilatación → geometría esférica → insuficiencia mitral funcional → más dilatación (ciclo vicioso).'}
  ]
},

'fisio-s8': {
  vignette: {text:'Paciente de 55 años, neumonía comunitaria grave, llega a urgencias: PA 75/45, FC 125, FR 28, lactato 5.2 mmol/L, T° 39.5°C, llenado capilar 5 seg. No responde a 2L de SF.', question:'¿Qué tipo de shock es y cuál es la secuencia de manejo?', answer:'Shock séptico (foco neumónico): vasodilatación + disfunción miocárdica + alteración microcirculatoria. Hour-1 Bundle: 1) Lactato. 2) Hemocultivos ANTES de ATB. 3) ATB empírico amplio espectro <1h. 4) Cristaloides 30 mL/kg si hipotensión o lactato >4. 5) Vasopresores (NA) si PAM <65 post-fluidos.'},
  quiz: [
    {q:'La definición de shock séptico (Sepsis-3) requiere:', options:['Solo fiebre + taquicardia','Sepsis + necesidad de vasopresores para PAM ≥65 + lactato >2 mmol/L pese a resucitación','Hemocultivos positivos obligatoriamente','PAS <90 mmHg por cualquier causa'], correct:1, explanation:'Sepsis-3: sepsis (disfunción orgánica por infección, SOFA ≥2) + vasopresores para mantener PAM ≥65 + lactato >2 mmol/L tras resucitación con fluidos. Mortalidad >40%.'},
    {q:'El vasopresor de 1ª línea en shock séptico es:', options:['Dopamina','Dobutamina','Noradrenalina','Adrenalina'], correct:2, explanation:'NA es 1ª línea (Surviving Sepsis): potente agonista α1 → vasoconstricción → ↑RVS → ↑PAM. Dopamina: más arritmias. Dobutamina: si hay disfunción miocárdica asociada (↓GC). Vasopresina: 2ª línea.'},
    {q:'En shock cardiogénico (IAM extenso), el patrón hemodinámico es:', options:['GC bajo + RVS alta + PCP alta','GC alto + RVS baja','GC normal + presiones normales','GC bajo + RVS baja'], correct:0, explanation:'Shock cardiogénico: falla de bomba → ↓GC + compensación → ↑RVS (vasoconstricción) + ↑PCP (congestión pulmonar). Tratamiento: inotrópico (dobutamina), balón de contrapulsación, revascularización urgente.'},
    {q:'El lactato sérico elevado en shock indica:', options:['Infección urinaria','Hipoperfusión tisular → metabolismo anaerobio','Deshidratación leve','Ejercicio reciente'], correct:1, explanation:'Lactato >2 mmol/L = hipoperfusión tisular. Las células sin O2 suficiente → glicólisis anaerobia → piruvato → lactato. Es marcador de gravedad y guía la resucitación (clearance de lactato).'},
    {q:'La adrenalina es el vasopresor de elección en:', options:['Shock séptico','Shock hipovolémico','Shock anafiláctico','Shock neurogénico'], correct:2, explanation:'Anafilaxia: adrenalina IM 0.3-0.5 mg. Actúa sobre α1 (↑PA), β1 (↑FC), β2 (broncodilatación, ↓edema). Es el ÚNICO fármaco que salva la vida en anafilaxia.'}
  ]
},

'fisio-saterom': {
  vignette: {text:'Hombre de 52 años, fumador, DM2, LDL 165 mg/dL, presenta dolor torácico opresivo de 20 min en reposo. Troponina positiva. Coronariografía: placa ulcerada en DA proximal con trombo.', question:'¿Cuál fue la secuencia fisiopatológica desde la placa estable hasta el evento agudo?', answer:'Placa estable (capa fibrosa gruesa) → factores de vulnerabilidad (inflamación, ↑MMP, core lipídico grande) → placa vulnerable (capa fibrosa delgada) → ruptura/erosión → exposición de colágeno y factor tisular → activación plaquetaria + cascada de coagulación → trombo → oclusión coronaria → IAMCEST.'},
  quiz: [
    {q:'La estría grasa es:', options:['Una lesión avanzada','La lesión aterosclerótica más temprana (macrófagos espumosos subendoteliales)','Un trombo organizado','Solo presente en diabéticos'], correct:1, explanation:'La estría grasa aparece desde la infancia: LDL se oxida en la íntima → macrófagos fagocitan LDL-ox → células espumosas → acumulación subendotelial. Es reversible y asintomática.'},
    {q:'La disfunción endotelial es el evento inicial de la ateromatosis y se caracteriza por:', options:['↑NO, ↓adhesión leucocitaria','↓NO, ↑permeabilidad, ↑adhesión de monocitos, ↑vasoconstricción','Solo vasodilatación','Trombocitopenia'], correct:1, explanation:'Endotelio disfuncional: ↓NO (vasodilatador + antiagregante + antiproliferativo) → vasoconstricción, ↑permeabilidad a LDL, expresión de moléculas de adhesión (VCAM-1) → reclutamiento de monocitos → inicio de placa.'},
    {q:'La placa vulnerable (inestable) se caracteriza por:', options:['Capa fibrosa gruesa y calcificada','Core lipídico grande + capa fibrosa delgada + infiltrado inflamatorio + ↑metaloproteasas','Ausencia de lípidos','Trombosis crónica organizada'], correct:1, explanation:'Placa vulnerable: core necrótico lipídico >40% del volumen, capa fibrosa <65 μm, ↑MMP (degradan colágeno), ↑macrófagos, neovascularización. Propensa a ruptura → trombosis → SCA.'},
    {q:'Las estatinas estabilizan la placa aterosclerótica mediante:', options:['Solo reducción de LDL','Efectos pleiotrópicos: ↓inflamación + ↑colágeno en capa fibrosa + ↑NO endotelial','Disolución directa de la placa','↑TXA2 plaquetario'], correct:1, explanation:'Más allá de ↓LDL, las estatinas: ↓PCR/inflamación intraplaca, ↓MMP, ↑síntesis de colágeno (engrosan capa fibrosa), mejoran función endotelial → estabilización de placa vulnerable.'},
    {q:'Los factores de riesgo cardiovascular NO modificables son:', options:['Tabaquismo, HTA, DM','Edad, sexo masculino, historia familiar prematura','LDL elevado, obesidad, sedentarismo','Estrés y alcohol'], correct:1, explanation:'No modificables: edad (H>45, M>55), sexo masculino, historia familiar de ECV prematura (H<55, M<65). Modificables: tabaco, HTA, DM, dislipidemia, obesidad, sedentarismo.'}
  ]
},

'fisio-c09pptx': {
  vignette: {text:'Mujer de 45 años, PA 180/110, cefalea intensa, visión borrosa, creatinina 2.1 (basal 0.9), proteinuria +++, fondo de ojo con exudados y hemorragias.', question:'¿Qué diferencia esta situación de una HTA esencial no complicada?', answer:'Emergencia hipertensiva: PA severamente elevada + daño agudo de órgano blanco (retinopatía hipertensiva grado III-IV + nefropatía aguda). Requiere ↓PA controlada IV (nitroprusiato, labetalol) con meta ↓25% en 1ª hora. La HTA esencial sin DOB se maneja ambulatoriamente.'},
  quiz: [
    {q:'La ecuación PA = GC × RVS implica que la HTA puede originarse por:', options:['Solo ↑GC','Solo ↑RVS','↑GC y/o ↑RVS','↓GC'], correct:2, explanation:'HTA puede ser por ↑GC (hipervolemia, hipertiroidismo), ↑RVS (vasoconstricción arteriolar, rigidez arterial) o ambos. En la HTA esencial establecida, predomina ↑RVS.'},
    {q:'El SRAA contribuye a la HTA al:', options:['↓Na+ y agua','↑Ang II (vasoconstricción + retención Na+) + ↑aldosterona','↓Renina','Vasodilatación renal'], correct:1, explanation:'SRAA: renina → Ang I → ECA → Ang II → vasoconstricción + retención Na+/H2O + aldosterona + remodelamiento vascular. Es el blanco de IECA, ARA-II y ARM.'},
    {q:'El daño de órgano blanco en HTA incluye todos EXCEPTO:', options:['Hipertrofia ventricular izquierda','Nefroesclerosis','Retinopatía hipertensiva','Hipotiroidismo'], correct:3, explanation:'DOB: corazón (HVI, IC, coronariopatía), cerebro (AVE, encefalopatía), riñón (nefroesclerosis, microalbuminuria), retina (retinopatía), arterias (rigidez, aneurisma). El hipotiroidismo no es DOB.'},
    {q:'La HTA de bata blanca se confirma con:', options:['Ecocardiograma','MAPA (monitoreo ambulatorio de PA 24h)','Holter de ritmo','Fondo de ojo'], correct:1, explanation:'MAPA confirma si la PA elevada en consulta es real o por ansiedad (bata blanca: PA >140/90 en consulta pero <135/85 en MAPA diurno). Evita tratamiento innecesario.'},
    {q:'En emergencia hipertensiva, la PA debe reducirse:', options:['A valores normales inmediatamente','≤25% en la primera hora, luego gradual en 24-48h','No se reduce, solo se observa','50% en los primeros 30 min'], correct:1, explanation:'↓Brusca de PA → hipoperfusión cerebral/coronaria/renal (autorregulación alterada). Meta: ↓25% en 1ª hora → 160/100 en 2-6h → normal en 24-48h. Fármacos IV: labetalol, nitroprusiato, nicardipino.'}
  ]
},

'fisio-c10pptx': {
  vignette: {text:'Hombre de 58 años, dolor torácico opresivo de 45 min, irradiado a brazo izquierdo, diaforético. ECG: supradesnivel ST en V1-V4. Troponina I: 15 ng/mL (N<0.04).', question:'¿Cuál es el diagnóstico, la arteria probablemente comprometida y la conducta prioritaria?', answer:'IAMCEST anterior (DA). Conducta: activar código infarto → ICP primaria (angioplastía + stent) <90 min si disponible, o fibrinolisis <30 min si no hay hemodinamia. AAS + clopidogrel/ticagrelor + heparina + β-bloqueante (si no hay contraindicación). "Time is myocardium".'},
  quiz: [
    {q:'El supradesnivel del ST en el ECG indica:', options:['Isquemia subendocárdica','Lesión transmural aguda (corriente de lesión)','Infarto antiguo','Pericarditis siempre'], correct:1, explanation:'Supradesnivel ST = corriente de lesión → daño transmural agudo → IAMCEST si contexto clínico + troponina (+). Indica oclusión coronaria total → necesita reperfusión urgente.'},
    {q:'La ventana para fibrinolisis en IAMCEST es:', options:['<30 min','<3h (máximo beneficio) hasta 12h','<48h','Sin límite de tiempo'], correct:1, explanation:'Fibrinolisis: máximo beneficio <3h del inicio de síntomas. Aceptable hasta 12h. Alteplasa (activador tisular del plasminógeno) es la más usada. ICP primaria es superior si disponible en <120 min.'},
    {q:'La zona de penumbra isquémica miocárdica:', options:['Ya está necrótica','Es tejido viable pero en riesgo → rescatable con reperfusión oportuna','No existe en el corazón','Solo se ve en TAC'], correct:1, explanation:'Igual que en AVE, existe una zona de penumbra: miocardio isquémico pero viable. La reperfusión temprana puede salvar esta zona → menor tamaño de infarto → mejor FEVI → menor mortalidad.'},
    {q:'El marcador más sensible y específico de necrosis miocárdica es:', options:['CK-MB','LDH','Troponina I o T de alta sensibilidad','Mioglobina'], correct:2, explanation:'Troponina hs: más sensible y específica. Se eleva a las 2-3h, pico 12-24h, permanece elevada 7-14 días. CK-MB es menos específica y se usa menos actualmente.'},
    {q:'La complicación mecánica más grave del IAM es:', options:['Arritmia ventricular','Ruptura de pared libre del VI → taponamiento cardíaco','Pericarditis','Insuficiencia mitral leve'], correct:1, explanation:'Ruptura de pared libre (3-5 días post-IAM): hemopericardio → taponamiento → muerte súbita. También: CIV post-IAM, ruptura de músculo papilar → IM aguda severa. Son complicaciones catastróficas.'}
  ]
},

'fisio-c09pdf': {
  vignette: {text:'Mujer de 42 años, IMC 38, perímetro cintura 105 cm, glicemia ayunas 118 mg/dL, TG 280, HDL 35, PA 142/88.', question:'¿Cumple criterios de síndrome metabólico? ¿Cuál es el mecanismo fisiopatológico central?', answer:'Sí (≥3 de 5 criterios ATP-III): cintura >88cm ✓, TG >150 ✓, HDL <50 (mujer) ✓, glicemia >100 ✓, PA >130/85 ✓. Mecanismo central: obesidad visceral → adipocitoquinas proinflamatorias (TNF-α, IL-6) → resistencia insulínica → hiperinsulinemia compensadora → cascada metabólica.'},
  quiz: [
    {q:'El mejor predictor de riesgo metabólico en obesidad es:', options:['IMC','Perímetro de cintura (grasa visceral)','Peso total','% de grasa corporal'], correct:1, explanation:'La grasa VISCERAL (no subcutánea) es la metabólicamente activa: produce adipocitoquinas proinflamatorias. Perímetro cintura >102cm (H) o >88cm (M) = obesidad abdominal. IMC no distingue distribución grasa.'},
    {q:'La resistencia insulínica se mide clínicamente con:', options:['Glicemia en ayunas sola','HOMA-IR (glucosa × insulina / 405)','HbA1c sola','PTGO de 5 horas'], correct:1, explanation:'HOMA-IR >2.5 indica resistencia insulínica. Es accesible (solo requiere glucosa e insulina en ayunas). No es gold standard (clamp euglucémico) pero sí el más usado en clínica y estudios.'},
    {q:'La semaglutida (GLP-1 RA) produce pérdida de peso porque:', options:['Causa malabsorción','↑Saciedad central + enlentece vaciamiento gástrico','Produce diarrea crónica','Inhibe lipasa pancreática'], correct:1, explanation:'GLP-1 RA: acción sobre hipotálamo (↑saciedad, ↓apetito) + enlentecimiento del vaciamiento gástrico. Semaglutida logra ↓peso 15-20%. Nuevo paradigma en obesidad (antes solo cirugía bariátrica lograba eso).'},
    {q:'La metainflamación en obesidad se caracteriza por:', options:['Inflamación aguda con neutrófilos','Inflamación crónica de bajo grado mediada por adipocitoquinas (TNF-α, IL-6)','Autoinmunidad','Infección del tejido adiposo'], correct:1, explanation:'Metainflamación (inflamación metabólica): los adipocitos hipertrofiados secretan TNF-α, IL-6, leptina, resistina → activan NF-κB y JNK → fosforilación de IRS en serina → ↓señalización de insulina → RI.'},
    {q:'La cirugía bariátrica está indicada cuando:', options:['IMC >25','IMC ≥40 o IMC ≥35 con comorbilidades (DM2, HTA, SAHOS)','Solo por estética','IMC >30 sin comorbilidades'], correct:1, explanation:'Indicaciones: IMC ≥40 (obesidad mórbida) o IMC ≥35 con comorbilidades metabólicas significativas, tras fracaso de tratamiento médico. Logra remisión de DM2 en 60-80% de casos (bypass gástrico).'}
  ]
},

'fisio-c10pdf': {
  vignette: {text:'Joven de 18 años, debut con polidipsia, poliuria, pérdida de peso de 8 kg en 3 semanas. Glicemia 420 mg/dL, pH 7.18, HCO3 8, cetonemia +++.', question:'¿Cuál es el diagnóstico y el tratamiento inmediato?', answer:'Cetoacidosis diabética (CAD) en debut de DM1. Tratamiento: 1) Fluidos (SF 1-2 L en 1ª hora). 2) Insulina cristalina IV en BIC. 3) Potasio (si <5.3, reponer ANTES de insulina → la insulina mete K+ al intracelular → hipokalemia letal). 4) Monitorizar K+, glicemia, AG, pH cada 1-2h.'},
  quiz: [
    {q:'La DM1 se produce por:', options:['Resistencia insulínica','Destrucción autoinmune de células β → déficit absoluto de insulina','Obesidad visceral','Déficit de GLP-1'], correct:1, explanation:'DM1: autoinmunidad mediada por linfocitos T → destrucción de células β del islote de Langerhans → déficit absoluto de insulina → cetoacidosis como debut frecuente (10-30%).'},
    {q:'La HbA1c refleja el control glicémico de:', options:['Las últimas 24 horas','Los últimos 2-3 meses','El último año','Solo el momento de la muestra'], correct:1, explanation:'La HbA1c mide la glucosa unida a hemoglobina → refleja glicemia promedio de 2-3 meses (vida media del eritrocito: 120 días). Meta <7% en la mayoría de pacientes con DM.'},
    {q:'En la CAD, la hiperkalemia inicial es:', options:['Por exceso de potasio real','Por redistribución: acidosis saca K+ del intracelular → K+ sérico ↑ pero K+ corporal total está DEPLETADO','Por insuficiencia renal','Por deshidratación simple'], correct:1, explanation:'Paradoja de K+ en CAD: K+ sérico puede ser normal o alto, pero el K+ corporal total está severamente depletado (diuresis osmótica). Al corregir acidosis + dar insulina → K+ entra a células → hipokalemia severa → arritmias letales.'},
    {q:'Los iSGLT2 protegen el riñón en DM2 mediante:', options:['↑Filtración glomerular','↓Hiperfiltración al restaurar feedback tubuloglomerular (↑Na+ en mácula densa → vasoconstricción aferente)','↑Gluconeogénesis renal','Solo ↓glicemia'], correct:1, explanation:'iSGLT2 bloquean reabsorción de glucosa y Na+ en TCP → más Na+ llega a mácula densa → activación de feedback tubuloglomerular → vasoconstricción aferente → ↓hiperfiltración → nefroprotección. Independiente del control glicémico.'},
    {q:'La nefropatía diabética progresa en esta secuencia:', options:['Proteinuria → microalbuminuria → VFG normal','Hiperfiltración → microalbuminuria → proteinuria → ↓VFG progresiva → ERC terminal','↓VFG directa sin albuminuria','Solo ocurre en DM1'], correct:1, explanation:'Etapas: 1) Hiperfiltración (↑VFG >120). 2) Microalbuminuria (30-300 mg/24h) = marcador temprano. 3) Proteinuria franca. 4) ↓VFG progresiva. 5) ERC terminal. iSGLT2 + IECA/ARA-II frenan la progresión.'}
  ]
},

'fisio-shidro': {
  vignette: {text:'Paciente de 75 años con ICC, Na+ sérico 124 mEq/L, osmolaridad 255, no usa diuréticos. Euvolémica clínicamente.', question:'¿Cuál es la causa más probable y cuál es el riesgo de corrección rápida?', answer:'SIADH (secreción inadecuada de ADH): hiponatremia hipoosmolar euvolémica. En ancianos: fármacos (ISRS, carbamazepina), patología pulmonar/SNC. Corrección: restricción hídrica. Riesgo de corrección rápida (>10-12 mEq/L/24h): mielinólisis central pontina (IRREVERSIBLE). Corregir lentamente.'},
  quiz: [
    {q:'La hiponatremia dilucional (SIADH) se caracteriza por:', options:['Na+ bajo + osmolaridad alta','Na+ bajo + osmolaridad baja + euvolemia + orina concentrada','Na+ bajo + hipovolemia','Na+ normal + osmolaridad baja'], correct:1, explanation:'SIADH: ADH se secreta sin estímulo osmótico → retención de agua libre → dilución de Na+ → hiponatremia hipoosmolar. Orina inapropiadamente concentrada (>100 mOsm/kg). Euvolémica (sin edemas ni depleción).'},
    {q:'La hiperkalemia >6.5 mEq/L es una emergencia porque:', options:['Causa dolor muscular','Produce arritmias letales (ondas T picudas → QRS ancho → FV/asistolia)','Solo causa debilidad','No es una emergencia'], correct:1, explanation:'K+ >6.5: ondas T picudas → ensanchamiento QRS → desaparición onda P → onda sinusoidal → FV/asistolia. Tratamiento inmediato: gluconato Ca2+ IV (estabiliza membrana) → insulina+glucosa → salbutamol NEB.'},
    {q:'La hormona ADH (vasopresina) actúa en:', options:['Asa de Henle','Túbulo contorneado distal','Conducto colector (↑acuaporinas → ↑reabsorción de agua libre)','Túbulo contorneado proximal'], correct:2, explanation:'ADH se une a receptor V2 en el conducto colector → inserción de acuaporinas (AQP2) en membrana apical → ↑permeabilidad al agua → reabsorción de agua libre → orina concentrada.'},
    {q:'La corrección de hiponatremia crónica debe ser:', options:['Lo más rápida posible','≤10-12 mEq/L en 24h para evitar mielinólisis central pontina','20 mEq/L en las primeras 6h','Sin límite si hay síntomas'], correct:1, explanation:'La mielinólisis osmótica (desmielinización) es IRREVERSIBLE y ocurre por corrección demasiado rápida. Las neuronas se habían adaptado → cambio brusco de osmolaridad → daño axonal. Mayor riesgo: hiponatremia crónica, alcohólicos, desnutridos.'},
    {q:'La aldosterona actúa en el riñón promoviendo:', options:['Excreción de Na+ y retención de K+','Retención de Na+ y excreción de K+ (vía ENaC y ROMK)','Excreción de agua libre','Retención de Ca2+'], correct:1, explanation:'Aldosterona → receptor mineralocorticoide en colector → ↑ENaC (reabsorbe Na+) + ↑ROMK (secreta K+) + ↑Na+/K+ ATPasa basolateral. Espironolactona bloquea este receptor → retiene K+, excreta Na+.'}
  ]
},

'fisio-c11': {
  vignette: {text:'Paciente de 22 años, DM1, glicemia 480, pH 7.12, PaCO2 22, HCO3 6, Na+ 138, K+ 5.8, Cl- 100.', question:'Calcule el anion gap e interprete la gasometría completa.', answer:'AG = Na - (Cl + HCO3) = 138 - (100+6) = 32 (elevado, N: 8-12). Acidosis metabólica con AG elevado (CAD). PaCO2 esperada (Winter): 1.5×6 + 8 ± 2 = 15-19. PaCO2 real 22 → compensación respiratoria insuficiente → posible componente respiratorio 2° o fatiga diafragmática. K+ alto por redistribución (acidosis), pero K+ corporal depletado.'},
  quiz: [
    {q:'El anion gap normal es:', options:['0-4','8-12','15-20','25-30'], correct:1, explanation:'AG = Na+ - (Cl- + HCO3-) = 8-12 mEq/L. Representa aniones no medidos (proteínas, fosfato, sulfato). AG elevado indica ácidos endógenos o exógenos acumulados (MUDPILES).'},
    {q:'MUDPILES enumera causas de acidosis metabólica con AG elevado. La "L" corresponde a:', options:['Litio','Lactato','Lidocaína','Leucemia'], correct:1, explanation:'L = Lactato. Es la causa más frecuente de acidosis AG elevado en UCI (shock, sepsis, hipoperfusión). MUDPILES: Metanol, Uremia, Diabética (CAD), Propilenglicol, Isoniazida, Lactato, Etilenglicol, Salicilatos.'},
    {q:'La fórmula de Winter sirve para:', options:['Calcular el anion gap','Predecir la PaCO2 esperada en acidosis metabólica (compensación respiratoria)','Calcular la osmolaridad','Estimar la función renal'], correct:1, explanation:'Winter: PaCO2 esperada = 1.5 × HCO3 + 8 (±2). Si la PaCO2 real es mayor → acidosis respiratoria sobreagregada. Si es menor → alcalosis respiratoria sobreagregada.'},
    {q:'La alcalosis metabólica por vómitos se produce por:', options:['Pérdida de HCO3','Pérdida de HCl gástrico → ↑HCO3 + ↓Cl- + ↓K+ + ↓volumen','Ganancia de ácido','Hiperventilación'], correct:1, explanation:'Vómitos → pérdida de H+ y Cl- → alcalosis hipoclorémica. La contracción de volumen + hipocloremia perpetúan la alcalosis (el riñón retiene Na+ con HCO3 porque no hay Cl- disponible).'},
    {q:'La acidosis respiratoria se compensa mediante:', options:['↓HCO3 renal','↑Reabsorción de HCO3 y generación de nuevo HCO3 por el riñón','Hiperventilación','↑Excreción de fosfato'], correct:1, explanation:'Compensación renal (tarda 3-5 días): ↑reabsorción de HCO3 en TCP + ↑excreción de H+ (acidez titulable + NH4+) → genera nuevo HCO3 → normaliza pH parcialmente. Por eso distinguir aguda (sin compensación) de crónica.'}
  ]
},

'fisio-serc': {
  vignette: {text:'Paciente de 58 años, DM2 e HTA de 15 años, VFG 22 mL/min, Hb 8.5, Ca 7.8, P 6.2, PTH 380, K+ 5.8. Se le indica ibuprofeno por gonalgia.', question:'¿Por qué está contraindicado el AINE y cuáles de las alteraciones de laboratorio son propias de la ERC?', answer:'AINEs contraindicados: ↓PGE2 vasodilatadora aferente → ↓VFG → acelera progresión + retiene Na+/K+. Alteraciones propias de ERC: anemia (↓EPO renal), osteodistrofia (↓1,25-OH Vit D → ↓Ca + ↑P → hiperPTH 2°), hiperkalemia (↓excreción), acidosis metabólica.'},
  quiz: [
    {q:'La anemia de la ERC se produce principalmente por:', options:['Déficit de hierro','↓Producción de eritropoyetina (EPO) por el riñón','Hemólisis autoinmune','Déficit de B12'], correct:1, explanation:'90% de la EPO se produce en células peritubulares renales. En ERC → ↓masa renal → ↓EPO → anemia normocítica normocrómica. Se trata con agentes estimulantes de eritropoyesis (AEE: epoetina, darbepoetina) + hierro.'},
    {q:'La osteodistrofia renal se produce por la secuencia:', options:['↓Ca → ↓PTH → pérdida ósea','↓Vit D activa → ↓absorción Ca → hipocalcemia + ↑P → ↑PTH (hiperparatiroidismo 2°) → resorción ósea','↑Ca → ↑PTH → ↑densidad ósea','Solo por déficit de Ca dietario'], correct:1, explanation:'Riñón produce 1,25-OH vitamina D (calcitriol). En ERC: ↓calcitriol → ↓absorción intestinal de Ca → hipocalcemia + ↓excreción de P → hiperfosfatemia → ambos estimulan PTH → resorción ósea → osteodistrofia.'},
    {q:'La clasificación KDIGO de ERC se basa en:', options:['Solo creatinina','VFG (5 estadios) + albuminuria (3 categorías)','Solo proteinuria','Ecografía renal'], correct:1, explanation:'KDIGO 2012: G1-G5 según VFG + A1-A3 según albuminuria. Un paciente G3aA1 tiene diferente pronóstico que G3aA3. Ambos ejes guían tratamiento y derivación a nefrología.'},
    {q:'La metformina se suspende en ERC cuando la VFG es:', options:['<60 mL/min','<45 mL/min','<30 mL/min','<15 mL/min'], correct:2, explanation:'KDIGO/ADA: metformina contraindicada con VFG <30 por riesgo de acidosis láctica. Reducir dosis si VFG 30-45. Si VFG >45 se puede usar sin restricción.'},
    {q:'Los iSGLT2 en ERC tienen indicación por:', options:['Solo efecto hipoglicemiante','Nefroprotección independiente de DM (DAPA-CKD demostró beneficio en ERC con y sin DM)','Reducción de PTH','Corrección de anemia'], correct:1, explanation:'DAPA-CKD y EMPA-KIDNEY: iSGLT2 ↓progresión de ERC + ↓mortalidad cardiovascular + ↓hospitalización por IC, incluso en pacientes SIN diabetes. Nuevo pilar de tratamiento de ERC.'}
  ]
},

'fisio-s17': {
  vignette: {text:'Paciente de 72 años, post-cirugía cardíaca, hipotensión intraoperatoria sostenida, creatinina pre-op 0.9 → post-op 3.2 mg/dL. Diuresis 15 mL/h × 8h. FENa 0.5%.', question:'¿Qué tipo de AKI es y qué indica la FENa?', answer:'AKI prerrenal: FENa <1% indica que el riñón reabsorbe ávivamente Na+ (está hipoperfundido pero sus túbulos funcionan). Causa: hipotensión intraoperatoria sostenida → ↓flujo renal. Tratamiento: restaurar volemia y PA. Si no se corrige → progresa a NTA (FENa >2%).'},
  quiz: [
    {q:'La causa más frecuente de AKI es:', options:['Postrenal','Intrarrenal','Prerrenal (60-70% de los casos)','Nefrotóxica'], correct:2, explanation:'Prerrenal (60-70%): hipoperfusión renal (hipovolemia, sepsis, ICC, AINEs). Es REVERSIBLE si se restaura el flujo a tiempo. Si persiste → NTA isquémica (intrarrenal).'},
    {q:'La FENa (fracción excretada de sodio) <1% sugiere:', options:['NTA establecida','AKI prerrenal (túbulos funcionantes que reabsorben Na+ ávidamente)','Obstrucción','Nefritis intersticial'], correct:1, explanation:'FENa <1%: riñón responde a hipoperfusión reabsorbiendo Na+ → "riñón ávido". FENa >2%: túbulos dañados, no reabsorben → NTA. Excepción: contraste y mioglobina pueden dar FENa <1% con NTA.'},
    {q:'Los criterios de hemodiálisis urgente (AEIOU) incluyen:', options:['Acidosis, Electrolitos, Intoxicación, Overload, Uremia','Anemia, Edema, Infección, Oliguria, Urticaria','Arritmia, Encefalopatía, Isquemia, Obstrucción, Ulcera','Acidosis, Embolia, Ictericia, Oliguria, Urosepsis'], correct:0, explanation:'AEIOU: Acidosis refractaria, Electrolitos (K+ refractario), Intoxicación dializable (litio, metanol, etilenglicol), Overload (volumen refractario a diuréticos), Uremia sintomática (encefalopatía, pericarditis).'},
    {q:'Los aminoglucósidos causan NTA por:', options:['Vasoconstricción aferente','Acumulación en túbulo contorneado proximal vía receptor megalina → toxicidad directa','Obstrucción tubular','Reacción alérgica'], correct:1, explanation:'Aminoglucósidos se filtran libremente → reabsorción en TCP por receptor megalina → acumulación intracelular → daño mitocondrial y lisosomal → NTA. Riesgo: dosis altas, uso prolongado, deshidratación.'},
    {q:'La nefropatía por contraste se previene con:', options:['Manitol IV','Hidratación con SF antes y después del procedimiento','AINEs profilácticos','No existe prevención'], correct:1, explanation:'Hidratación con SF IV (1 mL/kg/h 6-12h pre y post) es la medida más efectiva. Minimizar volumen de contraste, usar contraste iso-osmolar. Suspender metformina 48h pre-contraste en VFG <45. NAC: evidencia controvertida.'}
  ]
},

'fisio-c13': {
  vignette: {text:'Mujer de 72 años, inicio brusco de afasia de expresión + hemiparesia derecha hace 2 horas. TAC de cerebro sin contraste: normal (sin hemorragia).', question:'¿Cuál es el diagnóstico más probable y cuál es la ventana para trombolisis?', answer:'AVE isquémico (TAC normal descarta hemorragia en fase aguda). Territorio de ACM izquierda (afasia + hemiparesia derecha). Ventana para alteplasa IV: <4.5h. Trombectomía mecánica: hasta 24h si hay penumbra demostrada por imagen (mismatch). "Time is brain" — cada minuto se pierden 1.9M de neuronas.'},
  quiz: [
    {q:'La excitotoxicidad en AVE isquémico se produce por:', options:['↑GABA','Liberación masiva de glutamato → activación NMDA → entrada de Ca2+ → muerte neuronal','↓Serotonina','↑Dopamina'], correct:1, explanation:'Isquemia → falla Na+/K+ ATPasa → despolarización → liberación masiva de glutamato → activación de receptores NMDA → entrada masiva de Ca2+ → activación de proteasas, lipasas, endonucleasas → muerte celular.'},
    {q:'En Alzheimer, el déficit colinérgico se origina en:', options:['Hipocampo','Núcleo basal de Meynert','Sustancia negra pars compacta','Locus coeruleus'], correct:1, explanation:'Alzheimer: destrucción del núcleo basal de Meynert → ↓ACh cortical → déficit cognitivo. Los inhibidores de AChE (donepezilo, rivastigmina, galantamina) intentan compensar este déficit.'},
    {q:'En Parkinson, la bradicinesia se produce por:', options:['↑Dopamina en estriado','↓Dopamina en estriado (degeneración de SNpc)','↓Serotonina','↑Noradrenalina'], correct:1, explanation:'Parkinson: muerte de neuronas dopaminérgicas de sustancia negra pars compacta → ↓dopamina en estriado → predominio de vía indirecta (inhibitoria) → bradicinesia, rigidez, temblor de reposo.'},
    {q:'Los cuerpos de Lewy son inclusiones de:', options:['β-amiloide','Tau hiperfosforilada','α-sinucleína','Priones'], correct:2, explanation:'Cuerpos de Lewy: agregados intracelulares de α-sinucleína mal plegada. Son el marcador histopatológico de Parkinson. La propagación sigue los estadios de Braak (bulbo olfatorio → tronco → límbico → neocorteza).'},
    {q:'La L-DOPA sigue siendo el fármaco más eficaz en Parkinson porque:', options:['Regenera neuronas dopaminérgicas','Es el precursor directo de dopamina → las neuronas restantes la convierten en DA','Bloquea la α-sinucleína','Inhibe la MAO completamente'], correct:1, explanation:'L-DOPA cruza BHE → DOPA-descarboxilasa → dopamina. Es el fármaco más eficaz para síntomas motores. Se combina con carbidopa (inhibe descarboxilasa periférica → ↓efectos GI, ↑DA central). Complicación a largo plazo: fluctuaciones on-off + discinesias.'}
  ]
},

'fisio-s14': {
  vignette: {text:'Mujer de 35 años, menorragia crónica, Hb 8.2, VCM 68, ferritina 5, TIBC 450, saturación transferrina 8%. Se indica sulfato ferroso oral.', question:'¿El perfil férrico confirma ferropenia? ¿Cómo diferenciar de anemia inflamatoria?', answer:'Sí: ferritina BAJA + TIBC ALTO + sat.Tf BAJA = ferropenia. En anemia inflamatoria: ferritina NORMAL/ALTA (reactante de fase aguda), TIBC bajo, sat.Tf variable. La clave es la ferritina: baja = ferropenia verdadera. Tratamiento: sulfato ferroso + vitamina C (mejora absorción), alejado de antiácidos y calcio.'},
  quiz: [
    {q:'La regulación del metabolismo del hierro depende centralmente de:', options:['Transferrina','Hepcidina (producida por el hígado, regula ferroportina)','EPO','Ferritina'], correct:1, explanation:'Hepcidina es el "regulador maestro" del hierro: se une a ferroportina (exportador de Fe en enterocito y macrófago) → la internaliza → bloquea salida de Fe al plasma. ↑IL-6 → ↑hepcidina → anemia inflamatoria (Fe secuestrado).'},
    {q:'En la hemostasia primaria, la agregación plaquetaria depende de:', options:['Factor VIII','GPIIb/IIIa + fibrinógeno','Fibrina','Antitrombina III'], correct:1, explanation:'Agregación: cambio conformacional activa GPIIb/IIIa → se une a fibrinógeno → puente entre plaquetas adyacentes → tapón plaquetario. Es el blanco de abciximab, tirofibán (anti-GPIIb/IIIa).'},
    {q:'El INR monitoriza la vía:', options:['Intrínseca (TTPA)','Extrínseca (TP → INR): factores vitamina K-dependientes (II, VII, IX, X)','Fibrinolítica','Plaquetaria'], correct:1, explanation:'INR (normalización del TP): evalúa vía extrínseca + común. Warfarina inhibe factores K-dependientes → ↑INR. Heparina → ↑TTPA (vía intrínseca). Los ACODs no requieren INR de rutina.'},
    {q:'La anemia megaloblástica por déficit de B12 se caracteriza por:', options:['Microcitosis e hipocromía','Macrocitosis (VCM >100) + neutrófilos hipersegmentados + ↑LDH + ↑homocisteína','Normocitosis siempre','Ferritina baja'], correct:1, explanation:'Déficit B12/folato → ↓síntesis de ADN → eritropoyesis ineficaz → macrocitosis, neutrófilos hipersegmentados (≥5 lóbulos), ↑LDH y bilirrubina indirecta (hemólisis intramedular). B12 además: neuropatía (desmielinización).'},
    {q:'El Dímero-D elevado indica:', options:['Hemofilia','Activación de fibrinólisis (degradación de fibrina estabilizada por plasmina)','Déficit de vitamina K','Trombocitopenia'], correct:1, explanation:'Dímero-D = producto de degradación de fibrina estabilizada (unida por factor XIII) → indica que se formó fibrina Y se activó plasmina para degradarla. Elevado en TEP, TVP, CID, sepsis. Alta sensibilidad pero baja especificidad.'}
  ]
}

}; // fin EXTRAS
