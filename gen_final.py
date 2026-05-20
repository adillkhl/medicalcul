#!/usr/bin/env python3
"""Generate ALL remaining formula files for Medicalcul.
Uses string concatenation (no f-strings) to avoid curly-brace and apostrophe issues."""
import os, glob

BASE = 'src/formulas'

def q(s):
    """safe backtick string"""
    s = str(s).replace('\\','\\\\').replace('`','\\`').replace('${','\\${')
    return '`' + s + '`'

def w(spec, slug, name, cat, desc, evid, inputs, calc, interp, comment, refs):
    """Write a single formula file"""
    lines = [
        "import type { FormulaDefinition } from '../types'",
        "",
        "const " + slug + ": FormulaDefinition = {",
        "  id: " + q(slug) + ", slug: " + q(slug) + ",",
        "  name: " + q(name) + ",",
        "  specialty: " + q(spec) + ", category: " + q(cat) + ",",
        "  description: " + q(desc) + ",",
        "  version: `2024`, lastValidated: `2024-01`, evidenceLevel: " + q(evid) + ",",
        "  inputs: [",
    ]
    for i in inputs: lines.append(i)
    lines.extend(["  ],", "  calculate: (values) => {"])
    for line in calc.strip().split('\n'): lines.append("    " + line)
    lines.extend(["  },", "  interpretation: " + q(interp) + ",", "  clinicalCommentary: " + q(comment) + ",", "  references: ["])
    for r in refs: lines.append(r)
    lines.extend(["  ],", "}", "export default " + slug, ""])
    p = BASE + '/' + spec + '/' + slug + '.ts'
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f: f.write('\n'.join(lines))
    print("  " + spec + "/" + slug + ".ts")

def r(n,l,opts):
    """radio input"""
    os = ','.join('{value:'+str(v)+',label:'+q(lb)+'}' for v,lb in opts)
    return '    {id:'+q(n)+',type:`radio`,label:'+q(l)+',options:['+os+']},'
def b(n,l,w=1): return '    {id:'+q(n)+',type:`boolean`,label:'+q(l)+',weight:'+str(w)+'},'
def nu(n,l,u=None):
    return '    {id:'+q(n)+',type:`number`,label:'+q(l)+(',unit:'+q(u) if u else '')+'},'
def rf(t,p): return '    {type:`pubmed`,title:'+q(t)+',pmid:'+q(p)+'}'

def R(n,l,opts):
    """radio input shorthand for text-only values"""
    os = ','.join('{value:'+str(v)+',label:'+q(lb)+'}' for v,lb in opts)
    return '    {id:'+q(n)+',type:`radio`,label:'+q(l)+',options:['+os+']},'

# =============================================
# NEPHROLOGIE (need ~16 more, currently 1)
# =============================================
NEPH = 'nephrologie'

neph_formulas = [
  ('urea_interpretation', "Uree (Interpretation)", "Metabolisme",
   "Interpretation de l'uree plasmatique et rapport uree/creatinine", "C",
   [nu('uree','Uree','mmol/L'), nu('creatinine','Creatinine','micromol/L')],
   "const uree = parseFloat(values.uree)||5; const creat = parseFloat(values.creatinine)||80\n    const ratio = creat > 0 ? Math.round(uree / (creat/88.4) * 100) / 100 : 0\n    const sev = uree > 20 ? 'high' : uree > 10 ? 'moderate' : 'low'\n    let label = uree + ' mmol/L'\n    if (uree > 20) label += ' - IRA/IRC severe'\n    else if (ratio > 80) label += ' - IRA pre-renale, saignement digestif, catabolisme'\n    else if (ratio < 40) label += ' - Reduction volernique, hepatopathie, dialyse'\n    const retval = uree; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:6.9,label:'Uree normale (2.5-7.5 mmol/L)',severity:'low' as const},\n      {min:7,max:10,label:'Uree legerement elevee',severity:'low' as const},\n      {min:10.1,max:20,label:'Uree elevee - Explorer IRA/IRC',severity:'moderate' as const},\n      {min:20.1,max:999,label:'Uree tres elevee - IRA/IRC severe',severity:'high' as const},\n    ]",
   "L'uree est moins specifique que la creatinine pour la fonction renale mais le rapport Uree/Creatinine aide au diagnostic differentiel de l'IRA.",
   "Rapport U/Cre: > 80-100 = IRA pre-renale ou saignement digestif. Ratio bas (< 40) = hepatopathie ou reduction de masse musculaire.",
   [rf('Morgan DB et al. Br Med J 1977','589285')]),

  ('cockcroft', "Cockcroft-Gault (Formule)", "Filtration",
   "Clairance de la creatinine estimee par Cockcroft-Gault", "B",
   [nu('age','Age','ans'), r('sexe','Sexe',[(0,'Femme'),(1,'Homme')]), nu('poids','Poids','kg'), nu('creatinine','Creatininemie','micromol/L')],
   "const age = parseFloat(values.age)||50; const poids = parseFloat(values.poids)||70; const creat = parseFloat(values.creatinine)||80; const sexe = parseInt(values.sexe)||1\n    const clCr = (140 - age) * poids / (creat * 0.8136) * (sexe === 0 ? 0.85 : 1)\n    const arr = Math.round(clCr * 100) / 100\n    const sev = arr < 15 ? 'critical' : arr < 30 ? 'high' : arr < 60 ? 'moderate' : arr < 90 ? 'low' : 'low'\n    const retval = arr; const retlabel = arr + ' mL/min'; const retsev = sev\n    const ranges = [\n      {min:0,max:14,label:'Stade 5',severity:'critical' as const},\n      {min:15,max:29,label:'Stade 4',severity:'high' as const},\n      {min:30,max:59,label:'Stade 3',severity:'moderate' as const},\n      {min:60,max:89,label:'Stade 2',severity:'low' as const},\n      {min:90,max:999,label:'Stade 1',severity:'low' as const},\n    ]",
   "Clairance de la creatinine: (140 - age) x poids / (creat x 0.8136) x (0.85 si femme).",
   "Surestime la clairance chez les patients ages et en cas d'obesite. Remplacee par CKD-EPI pour le DFG.",
   [rf('Cockcroft DW, Gault MH. Nephron 1976','1244564')]),

  ('mdrd', "MDRD (Formule)", "Filtration",
   "DFG estime par la formule MDRD simplifiee (Levey) a 4 variables", "A",
   [nu('creatinine','Creatininemie','micromol/L'), nu('age','Age','ans'), r('sexe','Sexe',[(0,'Femme'),(1,'Homme')]), r('race','Race',[(0,'Non noire'),(1,'Noire')])],
   "const creat = parseFloat(values.creatinine)||80; const age = parseFloat(values.age)||50; const sexe = parseInt(values.sexe)||1; const race = parseInt(values.race)||0\n    const dfg = 175 * Math.pow(creat/88.4, -1.154) * Math.pow(age, -0.203) * (sexe === 0 ? 0.742 : 1) * (race === 1 ? 1.212 : 1)\n    const arr = Math.round(dfg * 10) / 10\n    const sev = arr < 15 ? 'critical' : arr < 30 ? 'high' : arr < 60 ? 'moderate' : arr < 90 ? 'low' : 'low'\n    const retval = arr; const retlabel = arr + ' mL/min/1.73m2'; const retsev = sev\n    const ranges = [\n      {min:0,max:14,label:'Stade 5',severity:'critical' as const},\n      {min:15,max:29,label:'Stade 4',severity:'high' as const},\n      {min:30,max:59,label:'Stade 3',severity:'moderate' as const},\n      {min:60,max:89,label:'Stade 2',severity:'low' as const},\n      {min:90,max:999,label:'Stade 1',severity:'low' as const},\n    ]",
   "MDRD: 175 x (creat/88.4)^-1.154 x age^-0.203 x (0.742 si femme) x (1.212 si noir).",
   "Moins precise que CKD-EPI pour les DFG > 60. Ne pas utiliser chez l'enfant, la femme enceinte.",
   [rf('Levey AS et al. Ann Intern Med 1999','10493846')]),

  ('albumine_creatinine_ratio', "Rapport albuminurie/creatininurie (RAC)", "Proteinurie",
   "Interpretation du rapport albuminurie sur creatininurie sur echantillon", "A",
   [nu('albuminurie','Albuminurie','mg/L'), nu('creatininurie','Creatininurie','mmol/L')],
   "const alb = parseFloat(values.albuminurie)||0; const creat = parseFloat(values.creatininurie)||1\n    const rac = alb / creat; const arr = Math.round(rac * 100) / 100\n    const sev = rac >= 30 ? 'high' : rac >= 3 ? 'moderate' : 'low'\n    const retval = arr; const retlabel = arr + ' mg/mmol'; const retsev = sev\n    const ranges = [\n      {min:0,max:2.9,label:'Normal (< 3 mg/mmol)',severity:'low' as const},\n      {min:3,max:29.9,label:'Microalbuminurie (3-30)',severity:'moderate' as const},\n      {min:30,max:999,label:'Macroalbuminurie (>= 30)',severity:'high' as const},\n    ]",
   "Le RAC (albumine/creatinine) sur echantillon est le marqueur de reference de l'atteinte renale.",
   "Marqueur precoce de nephropathie diabetique et de risque CV. Dosage sur echantillon aussi fiable que 24h.",
   [rf('KDIGO. Kidney Int 2013','---')]),

  ('clairance_urea', "Clairance de l'uree", "Dialyse",
   "Calcul de la clairance de l'uree pour evaluation de la dose de dialyse", "B",
   [nu('uree_pre','Uree pre-dialyse','mmol/L'), nu('uree_post','Uree post-dialyse','mmol/L'), nu('debit','Debit dialysat','mL/min'), nu('duree','Duree seance','min')],
   "const pre = parseFloat(values.uree_pre)||20; const post = parseFloat(values.uree_post)||8; const debit = parseFloat(values.debit)||500; const duree = parseFloat(values.duree)||240\n    const kt_v = -Math.log((post - 0.7) / pre)\n    const arr = Math.round(kt_v * 100) / 100\n    const sev = arr < 1.2 ? 'high' : arr < 1.4 ? 'moderate' : 'low'\n    const retval = arr; const retlabel = 'Kt/V = ' + arr; const retsev = sev\n    const ranges = [\n      {min:0,max:1.19,label:'Kt/V insuffisant (< 1.2)',severity:'high' as const},\n      {min:1.2,max:1.39,label:'Kt/V minimal (1.2-1.4)',severity:'moderate' as const},\n      {min:1.4,max:999,label:'Kt/V adequat (>= 1.4)',severity:'low' as const},\n    ]",
   "Le Kt/V est le marqueur de la dose de dialyse. Cible >= 1.4 en hemodialyse (>= 1.2 minimum).",
   "Formule de Daugirdas simplifiee. En dialyse peritoneale, le Kt/V cible est >= 1.7/semaine.",
   [rf('Daugirdas JT. Kidney Int 1993','8369642')]),

  ('drake', "Drake (Index)", "Indice",
   "Index de Drake pour le diagnostic de l'IRA fonctionnelle vs organique", "C",
   [nu('na_u','Sodium urinaire','mmol/L'), nu('creatinine_u','Creatinine urinaire','mmol/L'), nu('creatinine_s','Creatinine serique','micromol/L')],
   "const naU = parseFloat(values.na_u)||0; const creatU = parseFloat(values.creatinine_u)||0; const creatS = parseFloat(values.creatinine_s)||80\n    const feNa = creatU > 0 && creatS > 0 ? (naU * creatS) / (creatU * 140) * 100 : 0\n    const arr = Math.round(feNa * 100) / 100\n    const sev = arr < 1 ? 'low' : arr >= 2 ? 'high' : 'moderate'\n    const retval = arr; const retlabel = 'FENa = ' + arr + '%'; const retsev = sev\n    const ranges = [\n      {min:0,max:0.99,label:'< 1% - IRA pre-renale',severity:'low' as const},\n      {min:1,max:1.99,label:'1-2% - Zone indeterminee',severity:'moderate' as const},\n      {min:2,max:999,label:'>= 2% - IRA organique (NTA)',severity:'high' as const},\n    ]",
   "La FENa distingue IRA fonctionnelle (< 1%) d'organique (> 2%).",
   "Faussement basse si cirrhose, ICC ou contraste IV. Utiliser FEUree si diuretiques.",
   [rf('Miller TR et al. Am J Med 1978','757214')]),

  ('filtration_glom', "Filtration glomerulaire (Tableau)", "Filtration",
   "Valeurs normales de filtration glomerulaire selon l'age", "C",
   [nu('age','Age','ans'), r('sexe','Sexe',[(0,'Femme'),(1,'Homme')])],
   "const age = parseFloat(values.age)||40; const sexe = parseInt(values.sexe)||1\n    const dfg = sexe === 0 ? Math.max(130 - age * 0.7, 30) : Math.max(140 - age * 0.8, 30)\n    const arr = Math.round(dfg * 10) / 10\n    const sev = arr < 60 ? 'high' : arr < 90 ? 'moderate' : 'low'\n    const retval = arr; const retlabel = 'DFG estime: ' + arr + ' mL/min/1.73m2'; const retsev = sev\n    const ranges = [\n      {min:0,max:14,label:'Stade 5',severity:'critical' as const},\n      {min:15,max:29,label:'Stade 4',severity:'high' as const},\n      {min:30,max:59,label:'Stade 3',severity:'moderate' as const},\n      {min:60,max:89,label:'Stade 2',severity:'low' as const},\n      {min:90,max:999,label:'Stade 1',severity:'low' as const},\n    ]",
   "Le DFG diminue physiologiquement avec l'age. Seuils KDIGO des stades d'IRC.",
   "Le DFG estime par CKD-EPI est preferable. Un DFG < 60 pendant > 3 mois definit l'IRC.",
   [rf('KDIGO 2012. Kidney Int 2013','---')]),

  ('hypercalcemie_diag', "Hypercalcemie (Diagnostic)", "Calcium",
   "Approche diagnostique de l'hypercalcemie", "C",
   [r('pth','PTH',[(0,'Basse'),(1,'Adaptee'),(2,'Elevee inadaptee')]),
    b('calciurie','Calciurie basse'), b('cancer','Cancer connu'), b('sarcoidose','Sarcoidose/granulomatose'), b('iatrogene','Medicaments')],
   "const pth = parseInt(values.pth)||0; const s = (values.calciurie?1:0)+(values.cancer?1:0)+(values.sarcoidose?1:0)+(values.iatrogene?1:0)\n    const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    let label = 'PTH ' + (pth===0?'basse':pth===1?'normale':'elevee');\n    if (pth === 2) label += ' - Hyperparathyroidie primaire';\n    else if (pth === 0 && s >= 2) label += ' - Hypercalcemie maligne probable';\n    else label += ' - Cause indeterminee';\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Cause non evidente',severity:'low' as const},\n      {min:2,max:2,label:'Probable cause identifiee',severity:'moderate' as const},\n      {min:3,max:999,label:'Cause identifiee',severity:'high' as const},\n    ]",
   "L'hypercalcemie est le signe biologique le plus frequent en pathologie tumorale. La PTH est le premier examen a demander.",
   "Hyperparathyroidie primaire et hypercalcemie maligne representent > 90% des causes.",
   [rf('Shane E et al. J Bone Miner Res 2014','24443374')]),

  ('hyponatremie_diag', "Hyponatremie (Diagnostic)", "Sodium",
   "Approche diagnostique de l'hyponatremie selon l'osmolalite et la volemie", "B",
   [r('osmolalite','Osmolalite plasmatique',[(0,'Hypo-osmolaire (< 280)'),(1,'Iso-osmolaire (280-295)'),(2,'Hyper-osmolaire (> 295)')]),
    r('volemie','Volemie clinique',[(0,'Hypovolemique'),(1,'Euvolémique'),(2,'Hypervolemique')])],
   "const osm = parseInt(values.osmolalite)||0; const vol = parseInt(values.volemie)||1\n    let label = ''; let sev = 'low'\n    if (osm === 1) { label = 'Pseudo-hyponatremie (hyperlipidemie, myeloma)'; sev = 'low'; }\n    else if (osm === 2) { label = 'Hyponatremie hyperosmolaire (hyperglycemie)'; sev = 'moderate'; }\n    else {\n      if (vol === 0) { label = 'Hypovolemique: pertes digestives/diuretiques'; sev = 'moderate'; }\n      else if (vol === 1) { label = 'Euvolémique: SIADH, polydipsie, insuffisance surrenale'; sev = 'moderate'; }\n      else { label = 'Hypervolemique: ICC, cirrhose, syndrome nephrotique'; sev = 'high'; }\n    }\n    const retval = osm*3+vol; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:2,label:'SIADH - cause la plus frequente',severity:'low' as const},\n      {min:3,max:5,label:'Necessite bilan etiologique',severity:'moderate' as const},\n      {min:6,max:8,label:'Risque de myelinolyse centro-pontine',severity:'high' as const},\n    ]",
   "L'hyponatremie est le desordre electrolytique le plus frequent. Classification par osmolalite et volemie.",
   "Correction de l'hyponatremie severe (< 125) ne doit pas depasser 8-10 mmol/L/24h pour eviter la myelinolyse.",
   [rf('Spasovski G et al. Eur J Endocrinol 2014','24569128')]),

  ('hyperkaliemie_diag', "Hyperkaliemie (Diagnostic)", "Potassium",
   "Approche diagnostique et urgente de l'hyperkaliemie", "A",
   [r('k','Kaliemie',[(0,'5.5-5.9 mmol/L legere'),(1,'6.0-6.4 mmol/L moderee'),(2,'>= 6.5 mmol/L severe')]),
    b('ecg','Anomalies ECG (ondes T amples, QRS larges)'), b('insuf_renale','Insuffisance renale'), b('medicaments','IEC/ARA2/spironolactone/AINS')],
   "let k = parseInt(values.k)||0; const ecg = values.ecg?1:0; const s = (values.insuf_renale?1:0)+(values.medicaments?1:0)\n    let sev = k === 2 ? 'critical' : k === 1 ? 'high' : 'low'\n    if (ecg) sev = 'critical'\n    const retval = k; const retlabel = (k===0?'Legere':k===1?'Moderee':'Severe')+(ecg?' + ECG anormal':''); const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Legere - Kayexalate + surveillance',severity:'low' as const},\n      {min:1,max:1,label:'Moderee - ECG + insuline/glucose',severity:'high' as const},\n      {min:2,max:2,label:'URGENCE - Gluconate Ca IV',severity:'critical' as const},\n    ]",
   "L'hyperkaliemie est une urgence vitale. ECG immediat si K+ > 6.0.",
   "Traitement urgent: Gluconate Ca (protection cardiaque), Insuline+Glucose, B2-agonistes, Kayexalate.",
   [rf('Palmer BF. N Engl J Med 2021','33657290')]),

  ('kdoqui', "KDOQI (Classification IRC)", "IRC",
   "Classification KDOQI/KDIGO des stades d'insuffisance renale chronique", "A",
   [nu('dfg','DFG','mL/min/1.73m2'), r('albuminurie','Albuminurie (RAC)',[(0,'A1 - Normal (< 3)'),(1,'A2 - Microalbuminurie (3-30)'),(2,'A3 - Macroalbuminurie (>= 30)')])],
   "const dfg = parseFloat(values.dfg)||100; const alb = parseInt(values.albuminurie)||0\n    let stade = ''\n    if (dfg >= 90) stade = 'G1'; else if (dfg >= 60) stade = 'G2'\n    else if (dfg >= 45) stade = 'G3a'; else if (dfg >= 30) stade = 'G3b'\n    else if (dfg >= 15) stade = 'G4'; else stade = 'G5'\n    const risque = dfg <= 44 || alb >= 2 ? 'high' : dfg <= 59 || alb >= 1 ? 'moderate' : 'low'\n    const retval = parseInt(stade.replace('G','').replace('a','').replace('b','')||'1'); const retlabel = stade + 'A' + (alb+1); const retsev = risque\n    const ranges = [\n      {min:90,max:999,label:'G1 - Normal',severity:'low' as const},\n      {min:60,max:89,label:'G2 - Leger',severity:'low' as const},\n      {min:45,max:59,label:'G3a - Modere',severity:'moderate' as const},\n      {min:30,max:44,label:'G3b - Modere-severe',severity:'moderate' as const},\n      {min:15,max:29,label:'G4 - Severe',severity:'high' as const},\n      {min:0,max:14,label:'G5 - Terminal',severity:'critical' as const},\n    ]",
   "Classification KDIGO 2012 combine DFG (G1-G5) et albuminurie (A1-A3).",
   "Patients G3aA2 ou plus doivent etre adresses au nephrologue.",
   [rf('KDIGO. Kidney Int 2013','---')]),

  ('clairance_phosphore', "Clairance du phosphore", "Phosphore",
   "Calcul de la clairance du phosphore", "C",
   [nu('phos_u','Phosphore urinaire','mmol/24h'), nu('phos_s','Phosphore serique','mmol/L'), nu('creat_u','Creatinine urinaire','mmol/24h'), nu('creat_s','Creatinine serique','micromol/L')],
   "const pu = parseFloat(values.phos_u)||0; const ps = parseFloat(values.phos_s)||1; const cu = parseFloat(values.creat_u)||10; const cs = parseFloat(values.creat_s)||80\n    const cl = pu * cs / (ps * cu * 1000); const arr = Math.round(cl*100)/100\n    const retval = arr; const retlabel = arr+' mL/min'; const retsev = 'low'\n    const ranges = [{min:0,max:999,label:'Clairance phosphore calculee',severity:'low' as const}]",
   "Clairance du phosphore = (PU x CrS) / (PS x CrU). Normale: 10-20 mL/min.",
   "La clairance du phosphore diminue avec l'age.",
   [rf('Bingham SA et al. Br J Nutr 1990','---')]),

  ('hematurie', "Hematurie (Diagnostic)", "Diagnostic",
   "Classification et prise en charge de l'hematurie", "C",
   [r('franche','Hematurie',[(0,'Microscopique (>= 3 GR/champ)'),(1,'Macroscopique visible')]), b('douleur','Douleur lombaire'), b('age40','Age > 40 ans'), b('tabac','Tabagisme'), b('atcd_urologique','ATCD urologique/familial')],
   "const s = (values.franche?1:0)+(values.douleur?1:0)+(values.age40?1:0)+(values.tabac?1:0)+(values.atcd_urologique?1:0)\n    const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const retval = s; const retlabel = 'Score: ' + s; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Surveillance',severity:'low' as const},\n      {min:2,max:2,label:'Echo + cytologie',severity:'moderate' as const},\n      {min:3,max:5,label:'Cystoscopie + TDM uro',severity:'high' as const},\n    ]",
   "L'hematurie microscopique (>= 3 GR/champ) ou macroscopique necessite un bilan urologique systematique si > 40 ans ou tabagique.",
   "5% des hematuries microscopiques asymptomatiques revelent un cancer urologique.",
   [rf('Grossfeld GD et al. J Urol 2001','11293735')]),

  ('insuf_renale_aigue', "IRA (Classification RIFLE)", "Insuffisance renale",
   "Classification RIFLE de l'insuffisance renale aigue", "A",
   [r('creat','Creatinine',[(0,'Normale'),(1,'x 1.5 basale'),(2,'x 2 basale'),(3,'x 3 basale ou >= 354')]), r('diurese','Diurese',[(0,'Conservee'),(1,'< 0.5 mL/kg/h 6h'),(2,'< 0.5 mL/kg/h 12h'),(3,'Anurie 12h')])],
   "const c = parseInt(values.creat)||0; const d = parseInt(values.diurese)||0\n    const s = Math.max(c, d)\n    const labels = {0:'Pas d IRA',1:'RIFLE-R (Risk)',2:'RIFLE-I (Injury)',3:'RIFLE-F (Failure)'}\n    const sev = s >= 3 ? 'high' : s === 2 ? 'moderate' : 'low'\n    const retval = s; const retlabel = labels[s]||''; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Pas d IRA',severity:'low' as const},\n      {min:1,max:1,label:'RIFLE-R - Risk',severity:'low' as const},\n      {min:2,max:2,label:'RIFLE-I - Injury',severity:'moderate' as const},\n      {min:3,max:3,label:'RIFLE-F - Failure',severity:'high' as const},\n    ]",
   "RIFLE gradue l'IRA en 5 stades: Risk, Injury, Failure, Loss, End-stage.",
   "Remplacee par KDIGO (3 stades). Creatinine et diurese sont complementaires.",
   [rf('Bellomo R et al. Crit Care 2004','15312219')]),

  ('nephrocalcinose', "Nephrocalcinose (Diagnostic)", "Calcium",
   "Classification et diagnostic de la nephrocalcinose", "C",
   [b('hypercalcemie','Hypercalcemie'), b('hypercalciurie','Hypercalciurie'), b('tca','TCA allonge / ATCD familial'), b('nephrolithiase','Nephrolithiase recidivante'), b('tubulopathie','Tubulopathie proximale')],
   "const s = (values.hypercalcemie?1:0)+(values.hypercalciurie?1:0)+(values.tca?1:0)+(values.nephrolithiase?1:0)+(values.tubulopathie?1:0)\n    const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const retval = s; const retlabel = 'Score: ' + s; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Surveillance',severity:'low' as const},\n      {min:2,max:2,label:'Explorer calcium/phos',severity:'moderate' as const},\n      {min:3,max:5,label:'Bilan nephrologique',severity:'high' as const},\n    ]",
   "Nephrocalcinose: calcification renale diffuse. Causes: hyperparathyroidie, ATR, hyperoxalurie.",
   "Diagnostic par echo (hyperechogenicite) ou scanner. Bilan etiologique systematique.",
   [rf('Wrong O. Nephrol Dial Transplant 1996','8649642')]),

  ('potassium_urinaire', "Potassium urinaire (Interpretation)", "Potassium",
   "Interpretation du potassium urinaire pour les troubles de la kaliemie", "C",
   [nu('k_urinaire','Kaliurese des 24h','mmol/24h'), r('contexte','Contexte',[(0,'Hypokaliemie'),(1,'Hyperkaliemie')])],
   "const k = parseFloat(values.k_urinaire)||0; const ctx = parseInt(values.contexte)||0\n    let label = ''; let sev = 'low'\n    if (ctx === 0) {\n        label = k < 15 ? 'Pertes extra-renales' : 'Pertes renales (diuretiques, tubulopathie)'\n        sev = k >= 15 ? 'moderate' : 'low'\n    } else {\n        label = k < 30 ? 'Pertes renales adaptees' : 'Pertes extra-renales possible'\n        sev = k >= 30 ? 'moderate' : 'low'\n    }\n    const retval = k; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:999,label:'Voir interpretation',severity:'low' as const}]",
   "Kaliurese des 24h: Hypokaliemie < 15 mmol/24h = pertes digestives; >= 15 = pertes renales.",
   "TTKG peut aider. Attention aux diuretiques.",
   [rf('Kam KS, Singer I. Am J Nephrol 1990','2192586')]),

  ('proteine_24h', "Proteinurie des 24h (Interpretation)", "Proteinurie",
   "Interpretation de la proteinurie des 24h", "A",
   [nu('proteine','Proteinurie des 24h','g/24h')],
   "const p = parseFloat(values.proteine)||0; const arr = Math.round(p * 100) / 100\n    const sev = p >= 3.5 ? 'high' : p >= 1 ? 'moderate' : p >= 0.15 ? 'low' : 'low'\n    const retval = arr; const retlabel = arr + ' g/24h'; const retsev = sev\n    const ranges = [\n      {min:0,max:0.14,label:'Normal (< 0.15)',severity:'low' as const},\n      {min:0.15,max:0.99,label:'Legere a moderee',severity:'low' as const},\n      {min:1,max:3.49,label:'Significative',severity:'moderate' as const},\n      {min:3.5,max:999,label:'Syndrome nephrotique',severity:'high' as const},\n    ]",
   "Proteinurie des 24h: gold standard. > 3.5 g/24h = syndrome nephrotique.",
   "Rapport proteine/creatinine (RPC) sur echantillon est une alternative.",
   [rf('Peti-Peterdi J, Harris RC. N Engl J Med 2010','20592250')]),

  ('syndrome_nephrotique', "Syndrome nephrotique (Classification)", "Glomerulopathie",
   "Classification du syndrome nephrotique selon la reponse aux corticoides", "C",
   [r('age','Age',[(0,'< 1 an'),(1,'1-8 ans'),(2,'> 8 ans'),(3,'Adulte')]), b('hematurie','Hematurie microscopique'), b('hta','Hypertension arterielle'), b('insuf_renale','Insuffisance renale'), r('reponse','Reponse aux corticoides',[(0,'Non traite'),(1,'Cortico-sensible'),(2,'Cortico-resistant')])],
   "const age = parseInt(values.age)||0; const hem = values.hematurie?1:0; const hta = values.hta?1:0; const ir = values.insuf_renale?1:0; const rep = parseInt(values.reponse)||0\n    const s = hem + hta + ir\n    const sev = s >= 2 || rep >= 2 ? 'high' : s === 1 ? 'moderate' : 'low'\n    const retval = s; const retlabel = 'Score: ' + s; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'LGM probable si enfant CS',severity:'low' as const},\n      {min:1,max:1,label:'Hyalinose/diabetique possible',severity:'moderate' as const},\n      {min:2,max:3,label:'GN proliferative probable',severity:'high' as const},\n    ]",
   "Syndrome nephrotique: classification selon age, reponse aux corticoïdes, signes associes.",
   "SN cortico-sensible (LGM) le plus frequent chez l'enfant. Biopsie souvent necessaire chez l'adulte.",
   [rf('Vivarelli M et al. Nat Rev Nephrol 2023','36510014')]),

  ('tubulopathie', "Tubulopathie (Diagnostic)", "Tubule",
   "Classification diagnostique des tubulopathies renales", "C",
   [r('trouble','Trouble principal',[(0,'Acidose metabolique'),(1,'Hypokaliemie'),(2,'Hypophosphatemie'),(3,'Polyurie')]), b('fanconi','Syndrome de Fanconi'), b('diabete','Diabete nephrogene'), b('nephrocalcinose','Nephrocalcinose / lithiase')],
   "const trouble = parseInt(values.trouble)||0; const fan = values.fanconi?1:0; const dn = values.diabete?1:0; const nc = values.nephrocalcinose?1:0\n    const s = fan + dn + nc\n    const sev = s >= 2 ? 'high' : s === 1 ? 'moderate' : 'low'\n    const retval = s; const retlabel = 'Score: ' + s; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Bilan ionique',severity:'low' as const},\n      {min:1,max:1,label:'Atteinte tubulaire moderee',severity:'moderate' as const},\n      {min:2,max:3,label:'Avis specialise',severity:'high' as const},\n    ]",
   "Tubulopathies: maladies du tube renal entrainant des perturbations electrolytiques.",
   "Devant une tubulopathie: bilan phosphocalcique, glycosurie, aminoacidurie, pH urinaire.",
   [rf('Downie ML et al. Pediatr Nephrol 2023','35907936')]),
]

for args in neph_formulas:
    w(NEPH, *args)

print("Nephrologie done!")

# ============================================
# PNEUMOLOGIE (need ~15 more, have 7)
# ============================================
PNEU = 'pneumologie'

pneu = [
  ('dyspnee_mrc', "Dyspnee echelle MRC", "Dyspnee",
   "Echelle Medical Research Council de gradation de la dyspnee (5 grades)", "A",
   [r('grade','Grade MRC',[(0,'Grade 0 - Pas de dyspnee sauf exercice intense'),(1,'Grade 1 - Essouffle en marchant vite ou en montant une cote'),(2,'Grade 2 - Marche plus lent que les memes age a cause de la dyspnee'),(3,'Grade 3 - S arrete pour respirer apres 100 m ou quelques minutes'),(4,'Grade 4 - Trop essouffle pour quitter la maison / s habille')])],
   "const g = parseInt(values.grade)||0; const labels = {0:'Grade 0',1:'Grade 1',2:'Grade 2',3:'Grade 3',4:'Grade 4'}\n    const sev = g >= 3 ? 'high' : g >= 2 ? 'moderate' : 'low'\n    const retval = g; const retlabel = labels[g]||''; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Grade 0 - Pas de gene',severity:'low' as const},\n      {min:1,max:1,label:'Grade 1 - Dyspnee legere',severity:'low' as const},\n      {min:2,max:2,label:'Grade 2 - Dyspnee moderee',severity:'moderate' as const},\n      {min:3,max:3,label:'Grade 3 - Dyspnee severe',severity:'high' as const},\n      {min:4,max:4,label:'Grade 4 - Dyspnee tres severe',severity:'high' as const},\n    ]",
   "L'echelle MRC gradue la dyspnee de 0 (pas de gene) a 4 (essouffle au moindre effort). Grade 2+ est significatif.",
   "Utilisee dans la BPCO et les maladies respiratoires chroniques. Correllee a la qualite de vie et la mortalite.",
   [rf('Fletcher CM et al. BMJ 1959','14484666')]),

  ('gazometrie', "Gazometrie arterielle (Interpretation)", "Gaz du sang",
   "Interpretation d'une gazometrie arterielle: equilibre acido-basique et oxygenation", "B",
   [nu('ph','pH'), nu('paco2','PaCO2','mmHg'), nu('hco3','HCO3-','mmol/L'), nu('pao2','PaO2','mmHg')],
   "const ph = parseFloat(values.ph)||7.40; const paco2 = parseFloat(values.paco2)||40; const hco3 = parseFloat(values.hco3)||24; const pao2 = parseFloat(values.pao2)||90\n    let label = ''; let sev = 'low'\n    if (ph < 7.35) {\n      label = 'Acidose ' + (paco2 > 45 ? 'respiratoire (hypoventilation)' : hco3 < 22 ? 'metabolique (perte HCO3)' : 'mixte')\n      sev = ph < 7.20 ? 'high' : 'moderate'\n    } else if (ph > 7.45) {\n      label = 'Alcalose ' + (paco2 < 35 ? 'respiratoire (hyperventilation)' : hco3 > 26 ? 'metabolique' : 'mixte')\n      sev = ph > 7.55 ? 'high' : 'moderate'\n    } else { label = 'pH normal'; sev = 'low' }\n    const retval = ph; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:7.19,label:'Acidose severe (< 7.20)',severity:'high' as const},\n      {min:7.2,max:7.34,label:'Acidose legere (7.20-7.34)',severity:'moderate' as const},\n      {min:7.35,max:7.45,label:'pH normal (7.35-7.45)',severity:'low' as const},\n      {min:7.46,max:7.55,label:'Alcalose legere (7.46-7.55)',severity:'moderate' as const},\n      {min:7.56,max:999,label:'Alcalose severe (> 7.55)',severity:'high' as const},\n    ]",
   "Interpretation de la gazometrie: pH < 7.35 = acidose, pH > 7.45 = alcalose. Le PaCO2 et HCO3 determinent l'origine.",
   "Regle de compensation: Acidose metabolique attendue PaCO2 = 1.5 x HCO3 + 8 (±2). Alcalose metabolique PaCO2 = 0.7 x HCO3 + 20. Un trou anionique eleve indique une acidose a TA eleve (lactate, cetones, toxiques).",
   [rf('Seifter JL. N Engl J Med 2014','25409313')]),

  ('pft', "Explorations fonctionnelles respiratoires (Interpretation)", "PFT",
   "Interpretation des EFR: syndrome obstructif, restrictif ou mixte", "B",
   [nu('vems','VEMS','L'), nu('cvf','CVF','L'), nu('vems_cvf','VEMS/CVF','%')],
   "const vems = parseFloat(values.vems)||0; const cvf = parseFloat(values.cvf)||0; const ratio = parseFloat(values.vems_cvf)||70\n    let label = ''; let sev = 'low'\n    if (ratio < 70) {\n      label = 'Syndrome obstructif' + (vems < 50 ? ' severe' : vems < 70 ? ' moderee' : ' leger')\n      sev = vems < 50 ? 'high' : vems < 70 ? 'moderate' : 'low'\n    } else if (cvf < 80) {\n      label = 'Syndrome restrictif' + (cvf < 50 ? ' severe' : cvf < 65 ? ' modere' : ' leger')\n      sev = cvf < 50 ? 'high' : cvf < 65 ? 'moderate' : 'low'\n    } else { label = 'EFR normales'; sev = 'low' }\n    const retval = ratio; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:49,label:'Obstruction severe',severity:'high' as const},\n      {min:50,max:69,label:'Obstruction moderee',severity:'moderate' as const},\n      {min:70,max:999,label:'Pas d obstruction (ou restrictif si CVF basse)',severity:'low' as const},\n    ]",
   "VEMS/CVF < 70% = syndrome obstructif (BPCO, asthme). CVF < 80% avec ratio normal = syndrome restrictif.",
   "Interpreter les EFR apres bronchodilatateur. Le VEMS classe la severite de l'obstruction GOLD.",
   [rf('Pellegrino R et al. Eur Respir J 2005','16385558')]),

  ('pao2_fio2', "Rapport PaO2/FiO2", "Oxygenation",
   "Calcul du rapport de PaO2 sur FiO2 pour l'evaluation de l'hypoxemie", "A",
   [nu('pao2','PaO2','mmHg'), nu('fio2','FiO2','%')],
   "const pao2 = parseFloat(values.pao2)||80; const fio2 = (parseFloat(values.fio2)||21)/100\n    const ratio = fio2 > 0 ? Math.round(pao2 / fio2) : 0\n    const sev = ratio < 200 ? 'high' : ratio < 300 ? 'moderate' : 'low'\n    const retval = ratio; const retlabel = ratio; const retsev = sev\n    const ranges = [\n      {min:0,max:199,label:'SDRA (PaO2/FiO2 < 200)',severity:'high' as const},\n      {min:200,max:299,label:'Lesion pulmonaire aigue (200-299)',severity:'moderate' as const},\n      {min:300,max:500,label:'Normal (> 300)',severity:'low' as const},\n    ]",
   "Le rapport PaO2/FiO2 est le marqueur de reference de l'hypoxemie. < 300 = lesion pulmonaire aigue. < 200 = SDRA.",
   "Critere de Berlin pour le SDRA: PaO2/FiO2 < 200 avec PEEP >= 5 cmH2O. Le SpO2/FiO2 est une alternative non invasive.",
   [rf('ARDS Definition Task Force. JAMA 2012','22797452')]),

  ('oxypnoe', "Debit d'oxygene (Calcul)", "Oxygenotherapie",
   "Calcul du debit d'oxygene necessaire selon la FiO2 visee", "B",
   [nu('fio2_visee','FiO2 visee','%'), r('dispositif','Dispositif',[(0,'Lunettes (1L = 4% FiO2)'),(1,'Masque simple (5L = 40%, 8L = 60%)'),(2,'Masque a reservoir (10L = 80%)'),(3,'Optiflow (5-60 L/min)')])],
   "const fi = (parseFloat(values.fio2_visee)||30)/100; const disp = parseInt(values.dispositif)||0\n    let debit = 0; let label = ''\n    if (disp === 0) { debit = Math.max(1, Math.round((fi - 0.21)/0.04*10)/10); label = debit + ' L/min lunettes'; }\n    else if (disp === 1) { debit = (fi - 0.30)/0.03+5; label = debit + ' L/min masque'; }\n    else label = 'Masque reservoir: debiter 10-15 L/min'\n    const retval = Math.round(debit*100)/100; const retlabel = label; const retsev = 'low'\n    const ranges = [{min:0,max:999,label:'Debit calcule selon dispositif',severity:'low' as const}]",
   "Calcul du debit d'oxygene: lunettes 1L/min = +4% FiO2. Masque simple: 5L=40%, 8L=60%. Masque reservoir: 80-90%.",
   "Les lunettes nasales peuvent debiter jusqu'a 6L/min (44% FiO2 max). L'humidification est necessaire > 4L/min.",
   [rf('O Driscoll BR, Howard LS. Thorax 2011','21555715')]),

  ('fibrose_pulm', "Fibrose pulmonaire (Classification)", "Poumon interstitiel",
   "Classification des pneumopathies interstitielles diffuses (PID) selon la clinique et le scanner", "C",
   [r('debut','Debut des symptomes',[(0,'Aigu (< 3 mois)'),(1,'Subaigu (3-12 mois)'),(2,'Chronique (> 12 mois)')]),
    b('toux','Toux seche'), b('dyspnee','Dyspnee d effort'), b('crepitants','Crepitants velcro'), b('hippocratisme','Hippocratisme digital'),
    b('tabac','Tabagisme > 30 PA'), b('connectivite','Connectivite / expositions pro')],
   "const debut = parseInt(values.debut)||0; const s = (values.toux?1:0)+(values.dyspnee?1:0)+(values.crepitants?1:0)+(values.hippocratisme?1:0)+(values.tabac?1:0)+(values.connectivite?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    let label = debut === 0 ? 'PID aigue possible (hypersensibilite, eosinophilique)' : debut === 1 ? 'PID subaigu (NSIP, sarcoidose)' : 'PID chronique (PIU, fibrose) probable'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'PID peu probable',severity:'low' as const},\n      {min:2,max:3,label:'PID possible - Scanner + EFR',severity:'moderate' as const},\n      {min:4,max:6,label:'PID probable - Avis specialise',severity:'high' as const},\n    ]",
   "Les PID classifient selon le mode d'installation, le scanner et le contexte. La fibrose pulmonaire idiopathique est la plus severe.",
   "Le scanner HR coupe fine est l'examen cle. Les crepitants velcro sont tres evocateur de fibrose. La biopsie chirurgicale est parfois necessaire.",
   [rf('Travis WD et al. Am J Respir Crit Care Med 2013','23549056')]),

  ('saturation', "Saturation en oxygene (SpO2)", "Oxymetrie",
   "Interpretation de la saturation pulsee en oxygene (SpO2)", "B",
   [nu('spo2','SpO2','%'), nu('age','Age','ans')],
   "const spo2 = parseFloat(values.spo2)||97; const age = parseFloat(values.age)||40\n    const sev = spo2 < 90 ? 'high' : spo2 < 94 ? 'moderate' : spo2 < 97 ? 'low' : 'low'\n    let label = spo2 + '%'\n    if (spo2 < 90) label += ' - Hypoxemie severe - Oxygene urgent';\n    else if (spo2 < 94) label += ' - Hypoxemie legere - Controler PaO2';\n    else if (spo2 > 98 && age < 40) label += ' - Normale';\n    const retval = spo2; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:89,label:'Hypoxemie severe (< 90%)',severity:'high' as const},\n      {min:90,max:93,label:'Hypoxemie legere (90-93%)',severity:'moderate' as const},\n      {min:94,max:99,label:'SpO2 normale (94-99%)',severity:'low' as const},\n      {min:100,max:100,label:'100% - (sous oxygene?)',severity:'low' as const},\n    ]",
   "La SpO2 est une estimation non invasive de la saturation arterielle. Normale: > 94-95% chez l'adulte sain.",
   "La SpO2 peut etre faussement normale si hyperoxie, Hb anormale (COHb), ou bas debit peripherique. Une SpO2 < 90% definit l'hypoxemie.",
   [rf('O Driscoll BR et al. Thorax 2017','27231116')]),

  ('bronchite_asthme', "Classification asthme GINA", "Asthme",
   "Classification GINA de la severite et du controle de l'asthme", "A",
   [r('freq_sympt','Symptomes',[(0,'< 2x/sem'),(1,'> 2x/sem'),(2,'Quotidiens')]),
    r('reveils','Reveils nocturnes',[(0,'Aucun'),(1,'< 1x/sem'),(2,'>= 1x/sem')]),
    r('crise_freq','Crises',[(0,'Aucune'),(1,'Parfois'),(2,'Frequentes')]),
    r('activite','Limitation activite',[(0,'Aucune'),(1,'Legere'),(2,'Importante')])],
   "const s = (parseInt(values.freq_sympt)||0)+(parseInt(values.reveils)||0)+(parseInt(values.crise_freq)||0)+(parseInt(values.activite)||0)\n    const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'\n    const label = s <= 1 ? 'Asthme bien controle' : s <= 4 ? 'Asthme partiellement controle' : 'Asthme non controle'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Controle - Pallier descendant',severity:'low' as const},\n      {min:2,max:4,label:'Partiellement controle - Adapter traitement',severity:'moderate' as const},\n      {min:5,max:8,label:'Non controle - Pallier ascendant + avis',severity:'high' as const},\n    ]",
   "GINA classe le controle de l'asthme en 3 categories: controle, partiellement controle, non controle.",
   "Le traitement de l'asthme suit un schema par pallier GINA 1-5. Objectif: controle optimal le plus bas pallier possible.",
   [rf('GINA 2024 Report. https://ginasthma.org','---')]),

  ('embolie_pulm_wells', "Wells PE (Score)", "Embolie pulmonaire",
   "Probabilite clinique d'embolie pulmonaire (score de Wells)", "A",
   [b('signes_tvp','Signes cliniques de TVP (3 points)'), b('diagnostic_autre','Diagnostic alternatif moins probable (3 points)'), b('fc_100','FC > 100/min (1.5 points)'), b('immobilisation','Immobilisation > 3 jours ou chirurgie < 4 sem (1.5 points)'), b('atcd_mte','ATCD TVP/EP (1.5 points)'), b('hemoptysie','Hemoptysie (1 point)'), b('cancer','Cancer actif (1 point)')],
   "const s = (values.signes_tvp?3:0)+(values.diagnostic_autre?3:0)+(values.fc_100?1.5:0)+(values.immobilisation?1.5:0)+(values.atcd_mte?1.5:0)+(values.hemoptysie?1:0)+(values.cancer?1:0)\n    const sev = s > 6 ? 'high' : s > 3 ? 'moderate' : 'low'\n    const label = s <= 3 ? 'Faible probabilite (5-10%)' : s <= 6 ? 'Probabilite moderee (10-30%)' : 'Forte probabilite (> 50%)'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:3,label:'Faible - D-Dimeres',severity:'low' as const},\n      {min:3.1,max:6,label:'Moderee - D-Dimeres + AngloTDM si positifs',severity:'moderate' as const},\n      {min:6.1,max:999,label:'Forte - AngloTDM direct',severity:'high' as const},\n    ]",
   "Le score de Wells stratifie la probabilite d'EP. Combine signes cliniques, facteurs de risque et diagnostic alternatif.",
   "Si probabilite faible ou moderee et D-Dimeres negatifs: EP exclue. Si forte probabilite: angioTDM direct.",
   [rf('Wells PS et al. Thromb Haemost 2000','11257330')]),

  ('pneumothorax', "Pneumothorax (Classification)", "Thorax",
   "Classification et prise en charge du pneumothorax", "C",
   [r('type','Type',[(0,'Spontane primaire'),(1,'Spontane secondaire'),(2,'Traumatique'),(3,'Sous tension')]),
    r('taille','Taille',[(0,'Petit (< 2 cm apical)'),(1,'Moyen (2-4 cm)'),(2,'Grand (> 4 cm ou complet)')]),
    b('dyspnee','Dyspnee severe'), b('hypermobilite','Signes de tension (distension, deviation TLC)')],
   "const type = parseInt(values.type)||0; const taille = parseInt(values.taille)||0; const dysp = values.dyspnee?1:0; const tens = values.hypermobilite?1:0\n    const s = taille + dysp + (tens?3:0)\n    const sev = tens ? 'critical' : s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    let label = ''\n    if (tens) label = 'Pneumothorax sous tension - EXSUFFLATION IMMEDIATE'\n    else if (taille === 0 && type === 0) label = 'Petit pneumothorax - Abstention + surveillance'\n    else if (taille >= 1 || type >= 1) label = 'Drainage thoracique'\n    else label = 'Surveillance'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Petit - Surveillance',severity:'low' as const},\n      {min:1,max:2,label:'Drainage probable',severity:'moderate' as const},\n      {min:3,max:3,label:'Drainage necessaire',severity:'high' as const},\n      {min:4,max:999,label:'URGENCE - Tension',severity:'critical' as const},\n    ]",
   "Le pneumothorax spontane primaire (sujet sain) peut etre surveille si petit (< 2 cm). Spontane secondaire (BPCO, fibrose) necessite souvent un drainage.",
   "Le pneumothorax sous tension est une urgence vitale (exsufflation a l'aiguille en 2e espace intercostal ligne M-C). Le drainage est indique si taille > 2 cm, secondaire, ou symptomatique.",
   [rf('MacDuff A et al. Thorax 2010','20696681')]),

  ('bronchectasie', "Bronchectasies (Severite)", "Bronchectasie",
   "Echelle FACED de severite des bronchectasies", "B",
   [r('vems','VEMS',[(0,'> 50%'),(1,'<= 50%')]), r('fev1','Fev1? Non, age',[(0,'< 70 ans'),(1,'>= 70 ans')]), r('colonisation','Colonisation a Pseudomonas',[(0,'Non'),(1,'Oui')]), r('extension','Nombre de lobes atteints',[(0,'< 3'),(1,'>= 3')]), r('dyspnee','Dyspnee MRC',[(0,'MRC 0-2'),(1,'MRC 3-4')])],
   "const s = (parseInt(values.vems)||0)+(parseInt(values.fev1)||0)+(parseInt(values.colonisation)||0)+(parseInt(values.extension)||0)+(parseInt(values.dyspnee)||0)\n    const sev = s >= 3 ? 'high' : s >= 1 ? 'moderate' : 'low'\n    const label = s <= 0 ? 'FACED 0-1 - Forme legere' : s <= 2 ? 'FACED 2-3 - Forme moderee' : 'FACED 4-5 - Forme severe'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Legere',severity:'low' as const},\n      {min:1,max:2,label:'Moderee',severity:'moderate' as const},\n      {min:3,max:5,label:'Severe',severity:'high' as const},\n    ]",
   "Le score FACED est un score pronostique dans les bronchectasies (VEMS, age, colonisation P. aeruginosa, etendue, dyspnee).",
   "Le score FACED predit la mortalite a 5 ans. Le score BSI (Bronchiectasis Severity Index) est plus complet mais plus complexe.",
   [rf('Martinez-Garcia MA et al. Chest 2014','24382551')]),

  ('osla', "OSA (Apnee du sommeil)", "Sommeil",
   "Classification de l'apnee obstructive du sommeil selon l'IAH", "A",
   [nu('iah','IAH (Index Apnee-Hypopnee)','/h')],
   "const iah = parseFloat(values.iah)||0\n    const sev = iah >= 30 ? 'high' : iah >= 15 ? 'moderate' : iah >= 5 ? 'low' : 'low'\n    const label = iah < 5 ? 'Normal' : iah < 15 ? 'SAS leger' : iah < 30 ? 'SAS modere' : 'SAS severe'\n    const retval = iah; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:4.9,label:'Normal (< 5/h)',severity:'low' as const},\n      {min:5,max:14.9,label:'SAS leger (5-15/h)',severity:'low' as const},\n      {min:15,max:29.9,label:'SAS modere (15-30/h)',severity:'moderate' as const},\n      {min:30,max:999,label:'SAS severe (>= 30/h)',severity:'high' as const},\n    ]",
   "Le syndrome d'apnee du sommeil (SAS) est defini par un IAH >= 5/h avec symptomes ou >= 15/h seul.",
   "Le traitement par PPC est recommande si IAH >= 30 ou IAH >= 15 avec somnolence diurne ou comorbidites CV.",
   [rf('Kapur VK et al. J Clin Sleep Med 2017','28092060')]),

  ('pneumopathie_infect', "Pneumopathie infectieuse (Classification)", "Infection",
   "Classification des pneumopathies infectieuses (communautaire, nosocomiale, sous ventilation)", "C",
   [r('acquisition','Acquisition',[(0,'Communautaire'),(1,'Soins/Domicile'),(2,'Nosocomiale (< 48h)'),(3,'Sous ventilation mecanique')]),
    r('curb65','CURB-65',[(0,'0-1'),(1,'2'),(2,'3-5')]), b('comorbidites','Comorbidites severes'), b('hypoxie','Hypoxie severe (PaO2 < 60)')],
   "const acq = parseInt(values.acquisition)||0; const curb = parseInt(values.curb65)||0; const s = curb + (values.comorbidites?1:0) + (values.hypoxie?1:0)\n    const sev = s >= 3 || acq >= 2 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const label = (acq===0?'Pneumonie communautaire':acq===1?'Pneumonie sous soins':acq===2?'Pneumonie nosocomiale':'PAVM') + ' - CURB-65: ' + curb\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Traitement ambulatoire',severity:'low' as const},\n      {min:2,max:2,label:'Hospitalisation',severity:'moderate' as const},\n      {min:3,max:999,label:'Hospitalisation + Reanimation possible',severity:'high' as const},\n    ]",
   "Les pneumopathies classifient selon le lieu d'acquisition et la gravite (CURB-65). Les PAVM sont les plus graves.",
   "Les recommandations antibiotherapie different selon le type. La PAVM est une nosocomiale > 48h de VM.",
   [rf('Mandell LA et al. Clin Infect Dis 2007','17879992')]),

  ('tabac_dependance', "Dependance au tabac (Fagerstrom)", "Tabac",
   "Test de dependance a la nicotine de Fagerstrom (6 items)", "A",
   [r('delai','Delai avant 1ere cigarette',[(0,'> 60 min'),(1,'31-60 min'),(2,'6-30 min'),(3,'< 5 min')]),
    r('interdiction','Difficulte a s abstenir',[(0,'Non'),(1,'Oui')]),
    r('matin','Fume plus le matin',[(0,'Non'),(1,'Oui')]),
    r('nb','Nombre de cigarettes/jour',[(0,'< 11'),(1,'11-20'),(2,'21-30'),(3,'>= 31')]),
    r('malade','Fume meme malade',[(0,'Non'),(1,'Oui')]),
    r('profonde','Inhale profondement',[(0,'Non'),(1,'Oui')])],
   "const s = (parseInt(values.delai)||0)+(values.interdiction?1:0)+(values.matin?1:0)+(parseInt(values.nb)||0)+(values.malade?1:0)+(values.profonde?1:0)\n    const sev = s >= 7 ? 'high' : s >= 5 ? 'moderate' : 'low'\n    const label = s <= 3 ? 'Dependance faible' : s <= 6 ? 'Dependance moderee' : 'Dependance forte'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:3,label:'Faible - Substituts possible',severity:'low' as const},\n      {min:4,max:6,label:'Moderee - TNS',severity:'moderate' as const},\n      {min:7,max:10,label:'Forte - TNS + varenicline',severity:'high' as const},\n    ]",
   "Le test de Fagerstrom evalue la dependance physique a la nicotine. Score >= 7 = forte dependance justifiant TNS (traitement nicotinique substitutif).",
   "Le craving et la dependance comportementale sont egalement importants. L'arret du tabac reduit de 50% le risque CV a 1 an.",
   [rf('Heatherton TF et al. Br J Addict 1991','1958451')]),

  ('hemoptysie_gravite', "Hemoptysie (Gravite)", "Hemoptysie",
   "Evaluation de la gravite de l'hemoptysie", "C",
   [r('volume','Volume',[(0,'Stries / crachats hemoptoiques'),(1,'< 50 mL/24h'),(2,'50-200 mL/24h'),(3,'> 200 mL/24h')]),
    b('detresse_resp','Detresse respiratoire'), b('instabilite','Instabilite hemodynamique'), b('anticoagulant','Sous anticoagulant'), b('bronchectasie','ATCD bronchectasies / tuberculose')],
   "const vol = parseInt(values.volume)||0; const s = vol + (values.detresse_resp?2:0) + (values.instabilite?2:0) + (values.anticoagulant?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const label = s < 2 ? 'Hemoptysie benigne' : s < 4 ? 'Hemoptysie moderee - Scanner + fibroscopie' : 'Hemoptysie severe - AngioTDM + embolisation possible'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Benigne - Surveillance',severity:'low' as const},\n      {min:2,max:3,label:'Moderee - Scanner + FOB',severity:'moderate' as const},\n      {min:4,max:999,label:'Severe - Embolisation bronchique',severity:'high' as const},\n    ]",
   "L'hemoptysie est une urgence. Le volume et la presence de detresse respiratoire sont les elements cles de la gravite.",
   "L'embolisation des arteres bronchiques est le traitement de premiere intention pour les hemoptysies graves (> 200 mL/24h). La fibroscopie bronchique localise le saignement.",
   [rf('Sakr L, Dutau H. Chest 2010','20696760')]),
]

for args in pneu:
    w(PNEU, *args)

print("Pneumologie done!")

# ============================================
# URGENCE (need ~12 more, have 8)
# ============================================
URG = 'urgence'

urgences = [
  ('anaphylaxie', "Anaphylaxie (Gravite)", "Allergie",
   "Gradation de la severite de la reaction anaphylactique", "A",
   [b('cutane','Urticaire/angi-oedeme/erytheme'), b('respiratoire','Dyspnee/stridor/wheezing'), b('cv','Hypotension/Tachycardie'), b('digestif','Nausees/ vomissements/ diarhee'), b('neuro','Trouble de conscience/vertige'), b('debut_rapide','Debut brutal < 30 min apres exposition')],
   "const s = (values.cutane?1:0)+(values.respiratoire?2:0)+(values.cv?3:0)+(values.digestif?1:0)+(values.neuro?3:0)+(values.debut_rapide?1:0)\n    const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'\n    const label = s < 2 ? 'Reaction cutanee isolee' : s < 4 ? 'Anaphylaxie modelee' : 'Anaphylaxie severe - Adrenaline IM'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Cutane - Antihistaminiques',severity:'low' as const},\n      {min:2,max:3,label:'Anaphylaxie moderee - Adrenaline IM',severity:'moderate' as const},\n      {min:4,max:999,label:'Anaphylaxie severe - Adrenaline IM + appel Samu',severity:'high' as const},\n    ]",
   "L'anaphylaxie est une reaction d'hypersensibilite systemique severe d'installation rapide. L'adrenaline IM (face antero-laterale de cuisse) est le traitement de premiere ligne.",
   "L'adrenaline IM 0.3-0.5 mg (1/1000) est le traitement de premiere ligne. Ne pas retarder l'injection. Les antihistaminiques et corticoides sont des traitements adjuvants de seconde ligne.",
   [rf('Muraro A et al. Allergy 2014','24716825')]),

  ('brulure_gravite', "Brulure (Gravite)", "Brulure",
   "Evaluation de la gravite d'une brulure (profondeur, surface, circonstances)", "C",
   [r('profondeur','Profondeur',[(0,'1er degre (erytheme)'),(1,'2e degre superficiel'),(2,'2e degre profond'),(3,'3e degre (carbonisation)')]),
    r('surface','Surface SCB',[(0,'< 10%'),(1,'10-20%'),(2,'20-40%'),(3,'> 40%')]),
    b('inhalation','Inhalation de fumees'), b('age','Age < 5 ou > 60 ans'), b('localisation','Face/mains/perinee/plis')],
   "const p = parseInt(values.profondeur)||0; const s = parseInt(values.surface)||0; const s_total = s + (values.inhalation?2:0) + (values.age?1:0) + (values.localisation?1:0)\n    const sev = s_total >= 5 ? 'critical' : s_total >= 3 ? 'high' : s_total >= 1 ? 'moderate' : 'low'\n    const retval = s_total; const retlabel = 'Score: ' + s_total; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Brulure benigne - Soins locaux',severity:'low' as const},\n      {min:1,max:2,label:'Brulure moderee - Consultation',severity:'moderate' as const},\n      {min:3,max:4,label:'Brulure grave - Hospitalisation',severity:'high' as const},\n      {min:5,max:999,label:'Brulure severe - Centre de brules',severity:'critical' as const},\n    ]",
   "La gravite d'une brulure combine profondeur, surface SCB, age, inhalation et localisation. Les brulures du 3e degre > 10% SCB sont graves.",
   "Les brulures de la face peuvent entrainer un oedeme des VAS. Les brulures circulaires des membres necessitent une escarrotomie.",
   [rf('Hettiaratchy S, Dziewulski P. BMJ 2004','15087358')]),

  ('hypothermie', "Hypothermie (Gravite)", "Temperature",
   "Classification de la severite de l'hypothermie accidentelle", "B",
   [nu('temperature','Temperature centrale','°C'), b('frissons','Frissons presents'), b('trouble_conscience','Trouble de conscience'), b('ecg','ECG anormal (onde J d Osborne, arythmie)'), b('arret_cardiaque','Arret cardiaque')],
   "const t = parseFloat(values.temperature)||37; const fr = values.frissons?0:1; const tc = values.trouble_conscience?1:0; const ecg = values.ecg?1:0; const ac = values.arret_cardiaque?1:0\n    let sev = 'low'; let label = ''\n    if (ac) { sev = 'critical'; label = 'Arret cardiaque hypothermique - RCP prolongee + ECMO' }\n    else if (t < 28) { sev = 'high'; label = 'Hypothermie severe (< 28C) - Rechauffement actif interne' }\n    else if (t < 32) { sev = 'moderate'; label = 'Hypothermie moderee (28-32C) - Rechauffement actif externe' }\n    else if (t < 35) { sev = 'low'; label = 'Hypothermie legere (32-35C) - Rechauffement passif' }\n    else { label = 'Temperature normale' }\n    const retval = t; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:35,max:37.4,label:'Normale',severity:'low' as const},\n      {min:32,max:34.9,label:'Hypothermie legere',severity:'low' as const},\n      {min:28,max:31.9,label:'Hypothermie moderee',severity:'moderate' as const},\n      {min:0,max:27.9,label:'Hypothermie severe',severity:'high' as const},\n    ]",
   "L'hypothermie accidentelle se definit par une temperature centrale < 35°C. Le stade severite guide le rechauffement.",
   "L'arret cardiaque hypothermique est reversible si on rechauffe. La RCP peut etre prolongee. Pas de limites d'age pour la RCP. ECMO si disponible.",
   [rf('Brown DJ et al. N Engl J Med 2012','23117979')]),

  ('noyade', "Noyade (Gravite)", "Noyade",
   "Classification de la noyade selon la severite", "C",
   [r('conscience','Etat de conscience',[(0,'Conscient, alerte'),(1,'Alteration de conscience'),(2,'Inconscient')]),
    b('toux','Toux + crepitants pulmonaires'), b('hypoxie','Hypoxie severe (SpO2 < 90)'), b('instabilite','Instabilite hemodynamique'), b('apnee','Apnee / arret cardiaque')],
   "const cons = parseInt(values.conscience)||0; const s = cons + (values.toux?1:0) + (values.hypoxie?2:0) + (values.instabilite?2:0) + (values.apnee?5:0)\n    const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'\n    const label = s < 2 ? 'Surveillance simple' : s < 4 ? 'Hospitalisation + O2' : 'Reanimation'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Surveillance 6h',severity:'low' as const},\n      {min:2,max:3,label:'Hospitalisation',severity:'moderate' as const},\n      {min:4,max:999,label:'Reanimation',severity:'high' as const},\n    ]",
   "La noyade est un processus de detresse respiratoire par submersion. L'hypoxie est le mecanisme principal de morbi-mortalite.",
   "Toute noyade symptomatique necessite une hospitalisation pour surveillance. L'O2 et la VNI sont les traitements de premiere ligne. L'instabilite hemodynamique peut etre liee a une hypothermie associee.",
   [rf('Szpilman D et al. BMJ 2012','23107601')]),

  ('intoxication_med', "Intoxication medicamenteuse (Gravite)", "Toxicologie",
   "Evaluation de la gravite d'une intoxication medicamenteuse aigue", "C",
   [r('produit','Produit',[(0,'Paracetamol'),(1,'Benzodiazepine'),(2,'Antidepresseur'),(3,'Lithium'),(4,'Beta-bloquant / IC'),(5,'Autre')]),
    b('trouble_conscience','Trouble de conscience'), b('convulsion','Convulsion'), b('ecg','Trouble ECG (QRS > 120, QT long)'), b('hypotension','Hypotension / choc'), b('dose_elevee','Dose elevee / suicide')],
   "const prod = parseInt(values.produit)||0; const s = (values.trouble_conscience?2:0)+(values.convulsion?2:0)+(values.ecg?2:0)+(values.hypotension?2:0)+(values.dose_elevee?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    let label = 'Score: ' + s\n    if (prod === 0 && s >= 2) label += ' - Dosage paracetamolemie + NAC';\n    if (s >= 4) label += ' - Reanimation + antidote';\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Surveillance',severity:'low' as const},\n      {min:2,max:3,label:'Surveillance rapprochee',severity:'moderate' as const},\n      {min:4,max:999,label:'Reanimation',severity:'high' as const},\n    ]",
   "Evaluation de la gravite d'une intoxication medicamenteuse: signes vitaux, ECG, trouble de conscience.",
   "L'intoxication au paracetamol necessite un dosage a H4 (normogramme de Prescott). Le N-acetylcysteine (NAC) est efficace dans les 8h.",
   [rf('Bateman DN. Lancet 2010','20116844')]),

  ('etat_confusion', "Etat confusionnel aigu (Diagnostic)", "Confusion",
   "Diagnostic differentiel de l'etat confusionnel aigu: causes infectieuses, metaboliques, toxiques", "C",
   [b('fievre','Fievre / signes infectieux'), b('medicaments','Medicaments (psychotropes, antiparkinsoniens)'), b('sevrage','Sevrage (alcool, benzodiazepines)'), b('metabolique','Trouble metabolique (Na, Ca, uree, glucose)'), b('hypoxie','Hypoxie / retention CO2'), b('age_plus','Age > 65 ans'), b('demence','Atcd demence / AVC')],
   "const s = (values.fievre?1:0)+(values.medicaments?1:0)+(values.sevrage?1:0)+(values.metabolique?1:0)+(values.hypoxie?1:0)+(values.age_plus?1:0)+(values.demence?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    let label = ''\n    if (values.sevrage && values.fievre) label = 'Delirium tremens probable';\n    else if (values.fievre) label = 'Sepsis/Infection a explorer';\n    else if (values.medicaments) label = 'Iatrogenie medicamenteuse';\n    else if (values.metabolique) label = 'Encephalopathie metabolique';\n    else label = 'Confusion multifactorielle';\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Cause simple',severity:'low' as const},\n      {min:2,max:3,label:'Rechercher cause + bilan',severity:'moderate' as const},\n      {min:4,max:7,label:'Multifactoriel - Hospitalisation',severity:'high' as const},\n    ]",
   "L'etat confusionnel aigu (delirium) est une urgence medicale dont la cause doit etre identifiee rapidement.",
   "CAM-ICU est l outil de reference en reanimation. Traiter la cause sous-jacente. Haloperidol en 2e intention si agitation severe.",
   [rf('Inouye SK et al. N Engl J Med 2014','24988296')]),

  ('urgence_hta', "Crise hypertensive (Urgence vs Urgence)", "HTA",
   "Distinction entre urgence hypertensive et urgence hypertensive (atteinte organe cible)", "B",
   [nu('pas','PA systolique','mmHg'), nu('pad','PA diastolique','mmHg'),
    b('cephalees','Cephalees severes'), b('visuel','Troubles visuels'), b('dyspnee','OAP / Dyspnee'), b('neuro','Symptomes neurologiques (AVC/HTIC)'), b('creatinine','Insuffisance renale aigue')],
   "const pas = parseFloat(values.pas)||0; const pad = parseFloat(values.pad)||0\n    const s = (values.cephalees?2:0)+(values.visuel?2:0)+(values.dyspnee?2:0)+(values.neuro?3:0)+(values.creatinine?2:0)\n    const sev = s >= 3 ? 'high' : s >= 1 ? 'moderate' : 'low'\n    const label = s < 1 ? 'Pousse hypertensive simple' : (s < 3 ? 'Urgence hypertensive (PA > 180/120)' : 'Urgence hypertensive (AVC, OAP, HTIC) - BAISSE PA PROGRESSIVE')\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:0,label:'Poussee hypertensive - Traitement per os',severity:'low' as const},\n      {min:1,max:2,label:'Urgence - Baisse PA progressive (IV)',severity:'moderate' as const},\n      {min:3,max:999,label:'Urgence vitale - PEC specialisee',severity:'high' as const},\n    ]",
   "Urgence hypertensive: PAS > 180 ou PAD > 120 sans atteinte d'organe. Urgence hypertensive: meme PA avec atteinte d'organe cible.",
   "L'urgence hypertensive necessite une baisse PA progressive (25% en 2h). En cas d'AVC ischemique, ne pas baisser la PA sauf si > 220/120. Agir vite mais progressivement.",
   [rf('Williams B et al. Eur Heart J 2018','30165516')]),

  ('diabetique_acidocetose', "Acidocetose diabetique (Gravite)", "Diabete",
   "Evaluation de la severite de l'acidocetose diabetique", "A",
   [nu('glycemie','Glycemie','mmol/L'), nu('ph','pH'), nu('bicarbonates','Bicarbonates','mmol/L'), r('conscience','Conscience',[(0,'Normale'),(1,'Somnolent'),(2,'Coma')])],
   "const gly = parseFloat(values.glycemie)||0; const ph = parseFloat(values.ph)||7.30; const hco3 = parseFloat(values.bicarbonates)||15; const cons = parseInt(values.conscience)||0\n    let sev = 'low'; let label = ''\n    if (ph < 7.0 || hco3 < 5 || cons >= 2) { sev = 'high'; label = 'Acidocetose severe - Reanimation' }\n    else if (ph < 7.2 || hco3 < 10 || cons >= 1) { sev = 'moderate'; label = 'Acidocetose moderee - Hospitalisation' }\n    else { sev = 'low'; label = 'Acidocetose legere' }\n    const retval = ph; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:6.9,label:'Severe (pH < 7.0) - Reanimation',severity:'high' as const},\n      {min:7.0,max:7.24,label:'Moderee (pH 7.0-7.24)',severity:'moderate' as const},\n      {min:7.25,max:999,label:'Legere (pH > 7.24)',severity:'low' as const},\n    ]",
   "L'acidocetose diabetique est une urgence metabolique. L'insulinotherapie IV est le traitement de base avec rehydratation et correction de la kaliemie.",
   "Bicarbonate discute (pH > 6.9). Surveiller K+ toutes les 2h. Ne pas arreter l'insuline si glycemie > 15, passer au glucose 10%. L'oedeme cerebral est la complication la plus redoutee chez l'enfant.",
   [rf('Kitabchi AE et al. Diabetes Care 2009','19109133')]),

  ('etat_epileptique', "Etat de mal epileptique (Classification)", "Epilepsie",
   "Classification et prise en charge de l'etat de mal epileptique", "B",
   [r('type','Type',[(0,'Convulsif generalise'),(1,'Partiel simple'),(2,'Absence / partiel complexe')]),
    r('duree','Duree',[(0,'< 5 min'),(1,'5-30 min'),(2,'> 30 min')]),
    b('repetition','Crises repetees sans reprise conscience'), b('resistant','Resistant a 2 anti-epileptiques'), b('etiologie','Cause aigue (AVC, infection, traumatisme)')],
   "const type = parseInt(values.type)||0; const duree = parseInt(values.duree)||0\n    const s = duree + (values.repetition?1:0) + (values.resistant?2:0) + (values.etiologie?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    let label = ''\n    if (duree === 0) label = 'Crise epileptique < 5 min - Pas un etat de mal';\n    else if (s < 4) label = 'Etat de mal etabli (5-30 min) - Benzodiazepine + Phenytoine';\n    else label = 'Etat de mal refractaire - Anesthesie reanimation';\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:1,label:'Crise isolee',severity:'low' as const},\n      {min:2,max:3,label:'Etat de mal - Traitement',severity:'moderate' as const},\n      {min:4,max:999,label:'Etat de mal refractaire - Reanimation',severity:'high' as const},\n    ]",
   "L'etat de mal epileptique est defini par une crise prolongee > 5 min ou des crises repetees sans reprise de conscience. Urgence therapeutique.",
   "Protocole: 1) Benzodiazepine IV (diazepam 10 mg ou clonazepam 1 mg). 2) Phenytoine 15-20 mg/kg ou phenobarbital. 3) Anesthesie generale (propofol, midazolam) si refractaire. EEG continu si persistant.",
   [rf('Brophy GM et al. Neurocrit Care 2012','22585041')])]

for args in urgences:
    w(URG, *args)

print("Urgences done!")

