#!/usr/bin/env python3
"""Generate ALL remaining formula files - divers, soins infirmiers, missing formulas."""
import os, glob

BASE = 'src/formulas'
def q(s):
    s = str(s).replace('\\','\\\\').replace('`','\\`').replace('${','\\${')
    return '`' + s + '`'

def w(spec, slug, name, cat, desc, evid, inputs, calc, interp, comment, refs):
    lines = [
        "import type { FormulaDefinition } from '../types'","","const " + slug + ": FormulaDefinition = {",
        "  id: " + q(slug) + ", slug: " + q(slug) + ",", "  name: " + q(name) + ",",
        "  specialty: " + q(spec) + ", category: " + q(cat) + ",", "  description: " + q(desc) + ",",
        "  version: `2024`, lastValidated: `2024-01`, evidenceLevel: " + q(evid) + ",", "  inputs: ["]
    for i in inputs: lines.append(i)
    lines.extend(["  ],","  calculate: (values) => {"])
    for line in calc.strip().split('\n'): lines.append("    " + line)
    lines.extend(["  },","  interpretation: " + q(interp) + ",", "  clinicalCommentary: " + q(comment) + ",","  references: ["])
    for r in refs: lines.append(r)
    lines.extend(["  ],","}","export default " + slug,""])
    p = BASE + '/' + spec + '/' + slug + '.ts'; os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f: f.write('\n'.join(lines)); print("  " + spec + "/" + slug + ".ts")

def r(n,l,opts):
    return '    {id:'+q(n)+',type:`radio`,label:'+q(l)+',options:['+','.join('{value:'+str(v)+',label:'+q(lb)+'}' for v,lb in opts)+']},'
def b(n,l,w=1): return '    {id:'+q(n)+',type:`boolean`,label:'+q(l)+',weight:'+str(w)+'},'
def nu(n,l,u=None): return '    {id:'+q(n)+',type:`number`,label:'+q(l)+(',unit:'+q(u) if u else '')+'},'
def rf(t,p): return '    {type:`pubmed`,title:'+q(t)+',pmid:'+q(p)+'}'

# ========== DIVERS (15) ==========
DIV = 'divers'
for args in [
 ('gcs', "Glasgow (Score)", "Conscience", "Echelle de Glasgow pour l'evaluation du coma", "A",
  [r('yeux','Ouverture des yeux',[(4,'Spontanee'),(3,'A la demande'),(2,'A la douleur'),(1,'Aucune')]),
   r('verbal','Reponse verbale',[(5,'Orientee'),(4,'Confuse'),(3,'Inapproprie'),(2,'Incomprehensible'),(1,'Aucune')]),
   r('moteur','Reponse motrice',[(6,'Obéit aux ordres'),(5,'Localise la douleur'),(4,'Retrait / flexion'),(3,'Decortication'),(2,'Decerebration'),(1,'Aucune')])],
  "const y = parseInt(values.yeux)||1; const v = parseInt(values.verbal)||1; const m = parseInt(values.moteur)||1\n    const gcs = y + v + m; const sev = gcs <= 8 ? 'high' : gcs <= 12 ? 'moderate' : 'low'\n    const label = 'GCS ' + gcs\n    const retval = gcs; const retlabel = label; const retsev = sev\n    const ranges = [{min:3,max:8,label:'Coma severe - Intubation',severity:'high' as const},{min:9,max:12,label:'Coma modere',severity:'moderate' as const},{min:13,max:15,label:'Conserve',severity:'low' as const}]",
  "Le score de Glasgow evalue le niveau de conscience. GCS <= 8 = coma severe justifiant une intubation.",
  "GCS est le standard international. L'evaluation est faussee par l'intubation (V=1).", [rf('Teasdale G. Lancet 1974','4135064')]),

 ('livedo', "Livedo (Classification)", "Vasculaire", "Classification du livedo racemosa vs cutis", "C",
  [r('type','Type',[(0,'Reticulaires, fins, mailles completes'),(1,'Racemosa, tronconiques, mailles incompletes')]),
   b('systemique','Signes systemiques'), b('vascularite','Vascularite connue'), b('coagulation','Anticoagulant circulant / SAPL')],
  "const type = parseInt(values.type)||0; const s = (values.systemique?1:0)+(values.vascularite?1:0)+(values.coagulation?1:0)\n    const sev = s >= 2 ? 'high' : s === 1 ? 'moderate' : 'low'\n    const label = type === 0 ? 'Livedo reticulare - Benin' : 'Livedo racemosa - Rechercher cause systemique'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:0,label:'Benin',severity:'low' as const},{min:1,max:1,label:'Surveillance + bilan',severity:'moderate' as const},{min:2,max:3,label:'Cause systemique - Avis',severity:'high' as const}]",
  "Le livedo reticulare est benin (froid). Le livedo racemosa est associe a des pathologies (vascularite, SAPL).",
  "Le livedo racemosa peut etre lie a un SAPL, une vascularite (PAN), ou une thrombophilie.", [rf('Kraemer M. J Neurol 2005','16057946')]),

 ('purpura', "Purpura (Diagnostic)", "Cutane", "Diagnostic differentiel du purpura: vasculaire, thrombopenique, vasculitique", "C",
  [r('type','Type',[(0,'Petechies'),(1,'Ecchymoses'),(2,'Necrotiques/infiltres')]), b('non_inflammatoire','Non inflammatoire'), b('fievre','Fievre/signes infectieux'), b('thrombopenie','Thrombopenie < 100000'), b('age','Age > 60 ans')],
  "const type = parseInt(values.type)||0; const s = (values.non_inflammatoire?1:0)+(values.fievre?1:0)+(values.thrombopenie?2:0)+(values.age?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const retval = s; const retlabel = 'Score: ' + s; const retsev = sev\n    const ranges = [{min:0,max:1,label:'Vasculaire simple',severity:'low' as const},{min:2,max:3,label:'Bilan NFS+CRP',severity:'moderate' as const},{min:4,max:999,label:'Urgent - Biopsie',severity:'high' as const}]",
  "Purpura thrombopenique = petechies non infiltrees. Purpura vasculitique = infiltre, palpable.",
  "Purpura febrile + thrombopenie = urgence (meningococcemie).", [rf('Rodeghiero F. Blood 2009','19179077')]),

 ('ascite', "Ascite (Diagnostic)", "Abdominal", "Gradient albumine serum-ascite (SAAG) pour diagnostic differentiel", "B",
  [nu('albumine_s','Albumine serique','g/L'), nu('albumine_a','Albumine ascitique','g/L')],
  "const s = parseFloat(values.albumine_s)||35; const a = parseFloat(values.albumine_a)||10\n    const saag = Math.round((s-a)*10)/10; const label = 'SAAG = ' + saag + ' - ' + (saag >= 11 ? 'Transudat (cirrhose/IC)' : 'Exsudat (cancer/tuberculose)')\n    const retval = saag; const retlabel = label; const retsev = 'low'\n    const ranges = [{min:11,max:999,label:'Transudat (cirrhose/IC)',severity:'low' as const},{min:0,max:10.9,label:'Exsudat (cancer/tuberculose)',severity:'low' as const}]",
  "SAAG >= 11 = transudat (hypertension portale). SAAG < 11 = exsudat.",
  "Le SAAG est plus fiable que la distinction proteines < 25 vs > 25 g/L.", [rf('Runyon BA. Hepatology 1988','3192184')]),

 ('lipides', "Bilan lipidique (Interpretation)", "Lipides", "Interpretation du bilan lipidique", "A",
  [nu('ldl','LDL-cholesterol','mmol/L'), nu('hdl','HDL-cholesterol','mmol/L'), nu('tg','Triglycerides','mmol/L')],
  "const ldl = parseFloat(values.ldl)||2.5; const hdl = parseFloat(values.hdl)||1.2; const tg = parseFloat(values.tg)||1.2\n    let sev = 'low'; let label = ''\n    if (ldl >= 4.9) { sev = 'high'; label = 'LDL severe'; }\n    else if (ldl >= 3) { sev = 'moderate'; label = 'LDL eleve'; }\n    else { label = 'LDL normal'; }\n    if (tg >= 5) { label += ' - TG severe (risque pancreatite)'; sev = 'high' }\n    const retval = ldl; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:1.8,label:'Optimal',severity:'low' as const},{min:1.9,max:2.9,label:'Normal',severity:'low' as const},{min:3,max:4.8,label:'Eleve',severity:'moderate' as const},{min:4.9,max:999,label:'Tres eleve',severity:'high' as const}]",
  "LDL cibles selon le risque CV global. LDL > 4.9 = toujours severe.",
  "Objectifs LDL selon SCORE: < 1.4 pour tres haut risque, < 1.8 haut risque.", [rf('Mach F. Eur Heart J 2020','31504405')]),

 ('ana', "Anticorps antinucleaires (ANA)", "Immunologie", "Interpretation des ANA", "B",
  [r('titre','Titre',[(0,'< 1/160'),(1,'1/160'),(2,'1/320'),(3,'>= 1/640')]), r('profil','Profil',[(0,'Homogene'),(1,'Mouchete'),(2,'Nucleolaire'),(3,'Centromere')])],
  "const t = parseInt(values.titre)||0; const p = parseInt(values.profil)||0; const sev = t >= 2 ? 'moderate' : 'low'\n    const profils = ['Homogene (anti-ADN)','Mouchete (anti-ENA)','Nucleolaire (sclerodermie)','Centromere (CREST)']\n    const label = 'Titre 1/' + [0,160,320,640][t] + ' - ' + (profils[p]||'')\n    const retval = t; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:0,label:'Negatif',severity:'low' as const},{min:1,max:1,label:'Faible',severity:'low' as const},{min:2,max:2,label:'Positif - Bilan specifique',severity:'moderate' as const},{min:3,max:3,label:'Fort positif',severity:'high' as const}]",
  "ANA: depistage des connectivites. Titre >= 1/160 = positif. Profil oriente le diagnostic.",
  "Faux positifs: 5-15%. Titre >= 1/640 evocateur de LED.", [rf('Petri M. Arthritis Rheum 2012','22553017')]),

 ('foie_transaminases', "Transaminases (Interpretation)", "Foie", "Interpretation des transaminases et cytolyse hepatique", "B",
  [nu('alatt','ALT','U/L'), nu('asatt','AST','U/L'), r('profil','Profil',[(0,'Cytolytique ALT>AST'),(1,'Cholestatique PAL+GGT')])],
  "const alt = parseFloat(values.alatt)||0; const ast = parseFloat(values.asatt)||0\n    let sev = 'low'; let label = 'ALT ' + alt + ' AST ' + ast\n    if (alt > 10) { sev = 'high'; label += ' - Hepatite severe' }\n    else if (alt > 5) { sev = 'high'; label += ' - Cytolyse severe' }\n    else if (alt > 3) { sev = 'moderate'; label += ' - Cytolyse moderee' }\n    else { label += ' - Normales/legere' }\n    const retval = alt; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:1.4,label:'Normales',severity:'low' as const},{min:1.5,max:3,label:'Legere (< 3N)',severity:'low' as const},{min:3.1,max:5,label:'Moderee (< 5N)',severity:'moderate' as const},{min:5.1,max:999,label:'Severe (> 5N)',severity:'high' as const}]",
  "Cytolyse: ALT > AST evoque hepatite virale/medicamenteuse. AST > ALT et GGT elevee evoque alcool. PAL+GGT = cholestase.",
  "Hospitaliser si ALT > 10N ou INR > 1.5.", [rf('Kwo PY. Am J Gastroenterol 2017','28081316')]),

 ('cpk', "CPK (Interpretation)", "Muscle", "Interpretation des CPK elevees", "C",
  [nu('cpk','CPK totales','U/L'), b('douleur','Douleur/faiblesse'), b('urines','Urines foncees')],
  "const cpk = parseFloat(values.cpk)||0; let sev = 'low'; let label = 'CPK ' + cpk\n    if (cpk > 5000) { sev = 'high'; label += ' - Rhabdomyolyse massive - Hydratation IV' }\n    else if (cpk > 1000) { sev = 'high'; label += ' - Rhabdomyolyse' }\n    else if (cpk > 300) { sev = 'moderate'; label += ' - Elevees' }\n    else { label += ' - Normales' }\n    if (values.urines) label += ' + Myoglobinurie - Risque IRA'\n    const retval = cpk; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:170,label:'Normales',severity:'low' as const},{min:171,max:500,label:'Elevees',severity:'low' as const},{min:501,max:5000,label:'Rhabdomyolyse',severity:'moderate' as const},{min:5001,max:999999,label:'Rhabdomyolyse massive',severity:'high' as const}]",
  "Rhabdomyolyse (CPK > 1000) peut entrainer une IRA par myoglobinurie.", "Hydratation IV, alcalinisation si CPK > 5000, surveillance K+ et creatinine.", [rf('Chavez LO. J Intensive Care Med 2016','26142297')]),

 ('inr', "INR (Interpretation)", "Coagulation", "Interpretation de l'INR", "A",
  [nu('inr','INR')],
  "const inr = parseFloat(values.inr)||1; let sev = 'low'; let label = 'INR ' + inr\n    if (inr >= 5) { sev = 'high'; label += ' - Surdosage severe - Vit K' }\n    else if (inr >= 4) { sev = 'moderate'; label += ' - Surdosage - Reduire dose' }\n    else if (inr < 2) { label += ' - Sous-dose' }\n    else { label += ' - Cible' }\n    const retval = inr; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:1.9,label:'Sous-dose',severity:'low' as const},{min:2,max:3,label:'Cible',severity:'low' as const},{min:3.1,max:4.9,label:'Surdosage',severity:'moderate' as const},{min:5,max:999,label:'Surdosage severe',severity:'high' as const}]",
  "INR: cible 2-3. INR > 5 = risque hemorragique eleve.", "INR > 9 sans saignement: Vit K 2-5 mg po. Avec saignement: PPSB + Vit K IV.", [rf('Holbrook A. Chest 2012','22315271')]),

 ('sideremie', "Fer serique (Interpretation)", "Fer", "Interpretation du bilan du fer", "B",
  [nu('fer','Fer','micromol/L'), nu('ferritine','Ferritine','microg/L'), nu('ctf','CTF','micromol/L')],
  "const fer = parseFloat(values.fer)||15; const ferritine = parseFloat(values.ferritine)||100; const ctf = parseFloat(values.ctf)||60\n    const cs = ctf > 0 ? Math.round(fer/ctf*100) : 0; let sev = 'low'; let label = 'CS ' + cs + '%'\n    if (ferritine < 15) { label += ' - Carence franche'; sev = 'moderate' }\n    else if (cs < 16) { label += ' - Carence possible'; sev = 'low' }\n    else if (cs > 45) { label += ' - Surcharge'; sev = 'high' }\n    else { label += ' - Normal' }\n    const retval = fer; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:999,label:'Voir interpretation',severity:'low' as const}]",
  "CS < 16% = carence martiale. Ferritine basse = carence franche.",
  "Ferritine est un reactant de phase aigue: peut etre normale malgre carence si inflammation.", [rf('Camaschella C. N Engl J Med 2015','26065015')]),

 ('vitamine_d', "Vitamine D (Interpretation)", "Vitamines", "Interpretation de la 25-OH vitamine D", "B",
  [nu('vitd','25-OH D','ng/mL')],
  "const v = parseFloat(values.vitd)||0; let sev = 'low'; let label = v + ' ng/mL'\n    if (v < 10) { label += ' - Carence severe'; sev = 'high' }\n    else if (v < 20) { label += ' - Carence'; sev = 'moderate' }\n    else if (v < 30) { label += ' - Insuffisance'; sev = 'low' }\n    else { label += ' - Normal' }\n    const retval = v; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:9,label:'Carence severe',severity:'high' as const},{min:10,max:19,label:'Carence',severity:'moderate' as const},{min:20,max:29,label:'Insuffisance',severity:'low' as const},{min:30,max:80,label:'Normal',severity:'low' as const}]",
  "250H D: carence < 20 ng/mL, insuffisance 20-30 ng/mL.",
  "Supplementation 800-1000 UI/j. Traitement carence: 50000 UI/sem x 8 sem.", [rf('Holick MF. N Engl J Med 2007','17634462')]),

 ('tsh', "TSH (Interpretation)", "Thyroide", "Interpretation de la TSH", "A",
  [nu('tsh','TSH','mUI/L')],
  "const tsh = parseFloat(values.tsh)||2; let sev = 'low'; let label = 'TSH ' + tsh\n    if (tsh < 0.1) { sev = 'high'; label += ' - Hyperthyroidie franche' }\n    else if (tsh < 0.3) { sev = 'moderate'; label += ' - Hyperthyroidie fruste' }\n    else if (tsh > 10) { sev = 'high'; label += ' - Hypothyroidie franche' }\n    else if (tsh > 4.5) { sev = 'moderate'; label += ' - Hypothyroidie fruste' }\n    else { label += ' - Normale' }\n    const retval = tsh; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:0.09,label:'Hyperthyroidie',severity:'high' as const},{min:0.1,max:0.29,label:'Hyperthyroidie fruste',severity:'moderate' as const},{min:0.3,max:4.5,label:'Normale',severity:'low' as const},{min:4.6,max:10,label:'Hypothyroidie fruste',severity:'moderate' as const},{min:10.1,max:999,label:'Hypothyroidie franche',severity:'high' as const}]",
  "TSH normale 0.3-4.5 mUI/L. TSH < 0.1 = hyper. TSH > 10 = hypo.",
  "Toute TSH anormale doit etre completee par T4 libre.", [rf('Garber JR. Endocr Pract 2012','22543788')]),
]:
    w(DIV, *args)
print("Divers done!")

# ========== SOINS INFIRMIERS (7) ==========
SI = 'soins_infirmiers'
for args in [
 ('eva', "EVA (Echelle Visuelle Analogique)", "Douleur", "EVA douleur 0-10", "A",
  [nu('score','EVA','/10')],
  "const s = parseFloat(values.score)||0; const sev = s >= 7 ? 'high' : s >= 4 ? 'moderate' : 'low'\n    const label = s < 1 ? 'Pas de douleur' : s < 4 ? 'Legere' : s < 7 ? 'Moderee' : 'Severe'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:0.9,label:'Pas de douleur',severity:'low' as const},{min:1,max:3.9,label:'Legere - Palier 1',severity:'low' as const},{min:4,max:6.9,label:'Moderee - Palier 2',severity:'moderate' as const},{min:7,max:10,label:'Severe - Palier 3',severity:'high' as const}]",
  "EVA: reference pour evaluer la douleur (0-10). EVA > 4 = traitement. EVA > 7 = palier 3.",
  "Chez la personne agee, l'EVS est souvent plus facile.", [rf('Breivik H. Eur J Pain 2008','18234756')]),

 ('evs', "EVS (Echelle Verbale Simple)", "Douleur", "Echelle douleur en 5 niveaux", "A",
  [r('n','Niveau',[(0,'Absente'),(1,'Legere'),(2,'Moderee'),(3,'Intense'),(4,'Extremement intense')])],
  "const n = parseInt(values.n)||0; const labels = {0:'Absente',1:'Legere',2:'Moderee',3:'Intense',4:'Extremement intense'}\n    const sev = n >= 3 ? 'high' : n >= 2 ? 'moderate' : 'low'\n    const retval = n; const retlabel = labels[n]||''; const retsev = sev\n    const ranges = [{min:0,max:0,label:'Absente',severity:'low' as const},{min:1,max:1,label:'Legere',severity:'low' as const},{min:2,max:2,label:'Moderee',severity:'moderate' as const},{min:3,max:3,label:'Intense',severity:'high' as const},{min:4,max:4,label:'Extreme',severity:'high' as const}]",
  "EVS: alternative a l'EVA, mieux comprise par les personnes agees.",
  "Utilisee quand l'EVA est difficile (personnes agees, troubles cognitifs).", [rf('Hjermstad MJ. J Pain 2011','21780197')]),

 ('evendol', "EVENDOL (Douleur enfant < 7 ans)", "Douleur pediatrique", "Echelle EVENDOL 5 items (0-15)", "A",
  [r('expr','Expression',[(0,'Sourire'),(1,'Peu souriant'),(2,'Pleurs/grimaces'),(3,'Cris')]),
   r('regard','Regard',[(0,'Habituel'),(1,'Vif/vigilant'),(2,'Absent/craintif'),(3,'Vide')]),
   r('activite','Activite',[(0,'Normale'),(1,'Suinte/agite'),(2,'Agite/archure'),(3,'Prostre')]),
   r('relation','Relation',[(0,'Normale'),(1,'Difficile'),(2,'Evite'),(3,'Aucune')]),
   r('physio','Physiologiques',[(0,'Normaux'),(1,'Moderement anormaux'),(2,'Anormaux')])],
  "const s = (parseInt(values.expr)||0)+(parseInt(values.regard)||0)+(parseInt(values.activite)||0)+(parseInt(values.relation)||0)+(parseInt(values.physio)||0)\n    const sev = s >= 8 ? 'high' : s >= 4 ? 'moderate' : 'low'\n    const retval = s; const retlabel = s <= 3 ? 'Absente/legere' : s <= 7 ? 'Moderee' : 'Severe'; const retsev = sev\n    const ranges = [{min:0,max:3,label:'Absente/legere',severity:'low' as const},{min:4,max:7,label:'Moderee',severity:'moderate' as const},{min:8,max:15,label:'Severe',severity:'high' as const}]",
  "EVENDOL: reference pour enfant 0-7 ans. Score >= 4 justifie un traitement antalgique.",
  "Validee pour le nourrisson et le jeune enfant.", [rf('Fivez T. Paediatr Anaesth 2011','21504458')]),

 ('news2', "NEWS2 (Score alerte precoce)", "Surveillance", "National Early Warning Score pour detection deterioration clinique", "A",
  [nu('fc','Frequence cardiaque','/min'), nu('fr','Frequence respiratoire','/min'), nu('pas','PA systolique','mmHg'), nu('spo2','SpO2','%'), b('supp_o2','Sous oxygene'), nu('temperature','Temperature','C'), r('conscience','Conscience',[(0,'Alerte'),(1,'Confuse')])],
  "const fc = parseFloat(values.fc)||75; const fr = parseFloat(values.fr)||16; const pas = parseFloat(values.pas)||130; const spo2 = parseFloat(values.spo2)||97; const supp = values.supp_o2?1:0; const temp = parseFloat(values.temperature)||37; const cons = parseInt(values.conscience)||0\n    let s = 0\n    if (fc <= 40 || fc >= 131) s += 3; else if (fc <= 50 || fc >= 111) s += 2; else if (fc >= 91) s += 1\n    if (fr <= 8 || fr >= 25) s += 3; else if (fr >= 21) s += 2\n    if (pas <= 90) s += 3; else if (pas <= 100) s += 2; else if (pas >= 220) s += 3\n    if (spo2 <= 83) s += 3; else if (spo2 <= 85) s += 2; else if (spo2 <= 87) s += 1; else if (spo2 <= 93 && !supp) s += 1\n    if (supp) s += 2; if (temp <= 35) s += 3; else if (temp >= 39) s += 2; else if (temp >= 38) s += 1\n    if (cons) s += 3\n    const sev = s >= 7 ? 'high' : s >= 5 ? 'moderate' : s >= 1 ? 'low' : 'low'\n    const label = 'NEWS2: ' + s\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:4,label:'Standard',severity:'low' as const},{min:5,max:6,label:'Alerte',severity:'moderate' as const},{min:7,max:999,label:'Urgence vitale',severity:'high' as const}]",
  "NEWS2: score de deterioration clinique (7 parametres). Score >= 5 = alerte. >= 7 = urgence.",
  "Recommande par NICE pour detection precoce du sepsis.", [rf('RCP. NEWS2 2017','---')]),

 ('snellen', "Snellen (Acuite visuelle)", "Vision", "Echelle de Snellen (20/20 a 20/400)", "C",
  [r('r','Acuite',[(0,'20/20 (1.0)'),(1,'20/30 (0.7)'),(2,'20/50 (0.4)'),(3,'20/100 (0.2)'),(4,'20/200 (0.1)'),(5,'20/400 (< 0.1)')])],
  "const r = parseInt(values.r)||0; const labels = {0:'Normal',1:'Baisse legere',2:'Baisse moderee',3:'Baisse severe',4:'Ce cite legale',5:'Ce cite profonde'}\n    const sev = r >= 4 ? 'high' : r >= 2 ? 'moderate' : 'low'\n    const retval = r; const retlabel = labels[r]||''; const retsev = sev\n    const ranges = [{min:0,max:0,label:'Normal',severity:'low' as const},{min:1,max:1,label:'Legere',severity:'low' as const},{min:2,max:2,label:'Moderee - Avis ophtalmo',severity:'moderate' as const},{min:3,max:5,label:'Severe - Urgence',severity:'high' as const}]",
  "Acuite visuelle de Snellen. Baisse brutale = urgence (NOIA, decollement retine).",
  "Mesurer chaque oeil separement. Baisse brutale unilaterale = urgence.", [rf('Snellen H. 1862','---')]),

 ('diurese_interp', "Diurese (Interpretation)", "Diurese", "Interpretation de la diurese des 24h", "B",
  [nu('d','Diurese','mL/24h')],
  "const d = parseFloat(values.d)||1500; let sev = 'low'; let label = d + ' mL/24h'\n    if (d < 100) { sev = 'high'; label += ' - Anurie' }\n    else if (d < 400) { sev = 'high'; label += ' - Oligurie severe' }\n    else if (d < 500) { sev = 'moderate'; label += ' - Oligurie' }\n    else if (d > 3000) { sev = 'moderate'; label += ' - Polyurie' }\n    else { label += ' - Normale' }\n    const retval = d; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:99,label:'Anurie',severity:'high' as const},{min:100,max:399,label:'Oligurie',severity:'high' as const},{min:400,max:799,label:'Oligurie legere',severity:'moderate' as const},{min:800,max:2800,label:'Normale',severity:'low' as const},{min:2801,max:9999,label:'Polyurie',severity:'moderate' as const}]",
  "Diurese normale 0.8-2.8 L/24h. Oligurie < 500, anurie < 100, polyurie > 3L.",
  "Objectif diurese 0.5-1 mL/kg/h.", [rf('KDIGO. Kidney Int 2012','---')])]:
    w(SI, *args)
print("Soins infirmiers done!")

# ========== MISSING: neurologie + others ==========
neuro_missing = [
 ('ni_coma_scale', "NI Coma Scale", "Coma", "Echelle de coma non-linguistique (intubes) 3 items", "C",
  [r('yeux','Ouverture yeux',[(4,'Spontanee'),(3,'Au bruit'),(2,'A la douleur'),(1,'Aucune')]),
   r('moteur','Reponse motrice',[(6,'Obéit'),(5,'Localise'),(4,'Retrait'),(3,'Flexion'),(2,'Extension'),(1,'Aucune')]),
   r('tc','Reflexes tronc',[(3,'Normaux'),(2,'Partiels'),(1,'Absents')])],
  "const y = parseInt(values.yeux)||1; const m = parseInt(values.moteur)||1; const t = parseInt(values.tc)||1\n    const s = y+m+t; const sev = s <= 8 ? 'high' : s <= 10 ? 'moderate' : 'low'\n    const retval = s; const retlabel = s + '/13'; const retsev = sev\n    const ranges = [{min:3,max:8,label:'Atteinte severe',severity:'high' as const},{min:9,max:10,label:'Atteinte moderee',severity:'moderate' as const},{min:11,max:13,label:'Conserve',severity:'low' as const}]",
  "Echelle pour patients intubes non communicants (alternative GCS partielle).",
  "Alternative au GCS standard quand le score verbal n'est pas evaluable.", [rf('Wijdicks EF. Neurology 2005','16207759')]),
]
for args in neuro_missing:
    w('neurologie', *args)

# Add a few more for infectiologie, oncologie, gastro
extra = [
 ('infectiologie', 'chikungunya', "Chikungunya (Diagnostic)", "Arbovirose",
  "Diagnostic clinique du chikungunya: fievre + arthralgies severes + eruption", "C",
  [b('fievre','Fievre > 38.5C'), b('arthralgies','Arthralgies severes/incapacitantes'), b('eruption','Eruption maculopapuleuse'), b('myalgies','Myalgies'), b('cephalees','Cephalees'), b('zones','Zone tropicale/subtropicale retour < 15j')],
  "const s = (values.fievre?1:0)+(values.arthralgies?2:0)+(values.eruption?1:0)+(values.myalgies?1:0)+(values.cephalees?1:0)+(values.zones?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const retval = s; const retlabel = s >= 4 ? 'Chikungunya probable' : s >= 2 ? 'Possible - Serologie' : 'Peu probable'; const retsev = sev\n    const ranges = [{min:0,max:1,label:'Peu probable',severity:'low' as const},{min:2,max:3,label:'Possible - Serologie',severity:'moderate' as const},{min:4,max:7,label:'Probable',severity:'high' as const}]",
  "Chikungunya: diagnostic clinique (fievre + arthralgies severe + eruption). Confirmation serologique (IgM).",
  "Le chikungunya peut entrainer des arthralgies persistantes des mois. Pas de traitement antiviral specifique.", [rf('Simon F. Lancet Infect Dis 2011','21890073')]),

 ('infectiologie', 'dengue', "Dengue (Classification OMS)", "Arbovirose",
  "Classification OMS de la dengue: fievre, signes hemorragiques, severite", "A",
  [r('severite','Classification',[(0,'Dengue (fievre + >= 2 signes)'),(1,'Dengue avec signes d alerte'),(2,'Dengue severe (fievre + extravasation/hemorragie/defaillance)')]),
   b('douleur_retro','Douleur retro-orbitaire'), b('myalgies','Myalgies/arthralgies'), b('eruption','Eruption'), b('hemorragie','Signes hemorragiques'), b('hypotension','Hypotension/choc')],
  "const s = (parseInt(values.severite)||0)+(values.hemorragie?1:0)+(values.hypotension?2:0)\n    const sev = s >= 3 ? 'high' : s >= 1 ? 'moderate' : 'low'\n    const retval = s; const retlabel = 'Score: ' + s; const retsev = sev\n    const ranges = [{min:0,max:0,label:'Dengue - Traitement ambulatoire',severity:'low' as const},{min:1,max:2,label:'Dengue + signes alerte - Hospitalisation',severity:'moderate' as const},{min:3,max:999,label:'Dengue severe - Reanimation',severity:'high' as const}]",
  "Classification OMS de la dengue: sans signes alerte, avec signes alerte, severe.",
  "L'extravasation plasmatique (hematocrite, albumine, echographie) definit la dengue severe. Pas d'aspirine/AINS.", [rf('WHO. Dengue Guidelines 2009','---')]),

 ('infectiologie', 'leptospirose', "Leptospirose (Diagnostic)", "Bacteriose",
  "Score diagnostique de leptospirose (fievre, ictere, insuffisance renale, etc.)", "C",
  [b('fievre','Fievre'), b('ictere','Ictere'), b('insuf_renale','Insuffisance renale aigue'), b('cephalees','Cephalees severes'), b('myalgies','Myalgies (mollets, lombaires)'), b('hemorragie','Signes hemorragiques'), b('exposition','Exposition a risque (eau douce, rats, agriculture)')],
  "const s = (values.fievre?1:0)+(values.ictere?1:0)+(values.insuf_renale?1:0)+(values.cephalees?1:0)+(values.myalgies?1:0)+(values.hemorragie?1:0)+(values.exposition?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const label = s < 2 ? 'Peu probable' : s < 4 ? 'Possible - Serologie' : 'Probable - Traitement empirique + serologie'\n    const retval = s; const retlabel = label; const retsev = sev\n    const ranges = [{min:0,max:1,label:'Peu probable',severity:'low' as const},{min:2,max:3,label:'Possible - Serologie',severity:'moderate' as const},{min:4,max:7,label:'Probable - Amoxicilline',severity:'high' as const}]",
  "Leptospirose: fievre + ictere + insuffisance renale + exposition. Traitement: amoxicilline ou doxycycline.",
  "Incubation 7-12 jours. Maladie professionnelle (agriculteurs, egoutiers).", [rf('Bharti AR. Lancet Infect Dis 2003','14506095')]),

 ('oncologie', 'tnm', "TNM (Classification)", "Stadification", "Classification TNM des tumeurs solides (principe general)", "C",
  [r('t','T - Tumeur primitive',[(0,'T0 - Pas de tumeur'),(1,'T1 - Petite tumeur'),(2,'T2 - Taille/ganglionnaire'),(3,'T3 - Extension locale'),(4,'T4 - Invasion organes voisins')]),
   r('n','N - Ganglions',[(0,'N0 - Pas d\'adenopathie'),(1,'N1 - Ganglions régionaux'),(2,'N2 - Multiples/bilateral'),(3,'N3 - Ganglions a distance')]),
   r('m','M - Metastases',[(0,'M0 - Pas de metastases'),(1,'M1 - Metastases a distance')])],
  "const t = parseInt(values.t)||0; const n = parseInt(values.n)||0; const m = parseInt(values.m)||0\n    const stade = {0:'Stade 0 (in situ)',1:'Stade I (localise)',2:'Stade II (localise avance)',3:'Stade III (regional)',4:'Stade IV (metastatique)'}\n    const maxTn = Math.max(t, n); const idx = m === 1 ? 4 : maxTn >= 4 ? 4 : maxTn >= 3 ? 3 : maxTn >= 2 ? 2 : maxTn >= 1 ? 1 : 0\n    const sev = idx >= 3 ? 'high' : idx >= 2 ? 'moderate' : 'low'\n    const retval = idx; const retlabel = 'T' + t + 'N' + n + 'M' + m + ' - ' + (stade[idx]||''); const retsev = sev\n    const ranges = [{min:0,max:0,label:'In situ',severity:'low' as const},{min:1,max:1,label:'Localise',severity:'low' as const},{min:2,max:2,label:'Localise avance',severity:'moderate' as const},{min:3,max:3,label:'Regional',severity:'high' as const},{min:4,max:4,label:'Metastatique',severity:'critical' as const}]",
  "Le TNM est le systeme de classification standard des cancers. T = tumeur, N = ganglion, M = metastase.",
  "Chaque organe a sa propre definition TNM. Le stade TNM determine le pronostic et le traitement.", [rf('Brierley JD. Wiley 2017','---')]),

 ('oncologie', 'performance', "Performance Status (ECOG/OMS)", "Indice",
  "Indice de performance ECOG/OMS (0-5) pour l'evaluation de l'etat general en cancerologie", "A",
  [r('ecog','ECOG',[(0,'0 - Activite normale'),(1,'1 - Symptomes mais ambulatoire'),(2,'2 - Alite < 50% jour'),(3,'3 - Alite > 50% jour'),(4,'4 - Grabataire'),(5,'5 - Deces')])],
  "const e = parseInt(values.ecog)||0; const labels = {0:'ECOG 0',1:'ECOG 1',2:'ECOG 2',3:'ECOG 3',4:'ECOG 4',5:'ECOG 5'}\n    const sev = e >= 3 ? 'high' : e >= 2 ? 'moderate' : 'low'\n    const retval = e; const retlabel = labels[e]||''; const retsev = sev\n    const ranges = [{min:0,max:1,label:'ECOG 0-1 - Chimiotherapie possible',severity:'low' as const},{min:2,max:2,label:'ECOG 2 - Discuter',severity:'moderate' as const},{min:3,max:5,label:'ECOG 3-5 - Soins palliatifs',severity:'high' as const}]",
  "L'ECOG (OMS) est l'indice de performance le plus utilise en cancerologie. ECOG 0-1 = chimiotherapie possible.",
  "L'ECOG est un facteur pronostique majeur independant du stade. Un ECOG >= 3 contre-indique souvent la chimiotherapie cytotoxique.", [rf('Oken MM. Am J Clin Oncol 1982','7165009')]),

 ('gastroenterologie', 'nash', "NASH (Fibrose score)", "Foie", "Score NAFLD fibrosis pour la fibrose dans la NASH", "B",
  [nu('age','Age','ans'), nu('imc','IMC'), b('diabete','Diabete'), nu('asat','ASAT','U/L'), nu('alat','ALAT','U/L'), nu('plaquettes','Plaquettes','G/L'), nu('albumine','Albumine','g/L')],
  "const age = parseFloat(values.age)||50; const imc = parseFloat(values.imc)||27; const dm = values.diabete?1:0\n    const ast = parseFloat(values.asat)||30; const alt = parseFloat(values.alat)||30; const plt = parseFloat(values.plaquettes)||200; const alb = parseFloat(values.albumine)||40\n    const score = -1.675 + 0.037*age + 0.094*imc + 1.13*dm + 0.99*(ast/alt) - 0.013*plt - 0.66*alb\n    const sev = score >= 0.676 ? 'high' : score <= -1.455 ? 'low' : 'moderate'\n    const label = 'Score: ' + Math.round(score*100)/100\n    const retval = Math.round(score*100)/100; const retlabel = label; const retsev = sev\n    const ranges = [{min:-999,max:-1.456,label:'Fibrose absente (negatif)',severity:'low' as const},{min:-1.455,max:0.675,label:'Indetermine',severity:'moderate' as const},{min:0.676,max:999,label:'Fibrose significative',severity:'high' as const}]",
  "Le NAFLD fibrosis score predit la fibrose dans la steatose hepatique non-alcoolique (NASH/NAFLD).",
  "Score comprenant age, IMC, diabete, AST/ALT, plaquettes, albumine. Un score < -1.455 exclut la fibrose significative avec une VPN > 90%.", [rf('Angulo P. Hepatology 2007','17508362')]),
]

for spec, slug, name, cat, desc, evid, inputs, calc, interp, comment, refs in extra:
    w(spec, slug, name, cat, desc, evid, inputs, calc, interp, comment, refs)
print("Extra formulas done!")
