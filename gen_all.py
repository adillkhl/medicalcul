#!/usr/bin/env python3
"""Generate all missing formula files.
Uses backtick template literals for ALL string values.
No f-strings to avoid curly brace conflicts."""
import os, json

BASE = 'src/formulas'

def q(s):
    """Return a safe backtick-quoted string"""
    s = str(s).replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    return '`' + s + '`'

def qlist(items):
    """Quote a list of strings as backtick items"""
    return ','.join(q(item) for item in items)

def write(specialty, slug, body):
    path = BASE + '/' + specialty + '/' + slug + '.ts'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(body)

def radio_input(name, label, options):
    """Generate radio input definition"""
    opts = ','.join('{value:' + str(v) + ',label:' + q(l) + '}' for v,l in options)
    return '    {id:' + q(name) + ',type:`radio`,label:' + q(label) + ',options:[' + opts + ']},'

def bool_input(name, label, weight=1):
    return '    {id:' + q(name) + ',type:`boolean`,label:' + q(label) + ',weight:' + str(weight) + '},'

def number_input(name, label, unit=None, placeholder=None):
    extra = ''
    if unit:
        extra += ',unit:' + q(unit)
    if placeholder:
        extra += ',placeholder:' + q(placeholder)
    return '    {id:' + q(name) + ',type:`number`,label:' + q(label) + extra + '},'

def range_item(minv, maxv, label, severity):
    return '      {min:' + str(minv) + ',max:' + str(maxv) + ',label:' + q(label) + ',severity:' + q(severity) + '}'

def ref_item(title, pmid):
    return '    {type:`pubmed`,title:' + q(title) + ',pmid:' + q(pmid) + '}'

def formula_file(slug, name, specialty, category, desc, evid, inputs, calc_code, interp, comment, refs):
    """Build complete .ts file content"""
    lines = []
    lines.append("import type { FormulaDefinition } from '../types'")
    lines.append("")
    lines.append("const " + slug + ": FormulaDefinition = {")
    lines.append("  id: " + q(slug) + ", slug: " + q(slug) + ",")
    lines.append("  name: " + q(name) + ",")
    lines.append("  specialty: " + q(specialty) + ", category: " + q(category) + ",")
    lines.append("  description: " + q(desc) + ",")
    lines.append("  version: `2024`, lastValidated: `2024-01`, evidenceLevel: " + q(evid) + ",")
    lines.append("  inputs: [")
    for inp in inputs:
        lines.append(inp)
    lines.append("  ],")
    lines.append("  calculate: (values) => {")
    lines.append(calc_code)
    lines.append("  },")
    lines.append("  interpretation: " + q(interp) + ",")
    lines.append("  clinicalCommentary: " + q(comment) + ",")
    lines.append("  references: [")
    for ref in refs:
        lines.append(ref)
    lines.append("  ],")
    lines.append("}")
    lines.append("export default " + slug)
    lines.append("")
    return '\n'.join(lines)

# ============================================
# ANESTHESIE (15 formulas)
# ============================================
ANESTH = 'anesthesie'

data_anesthesie = [
  {
    'slug': 'aldrete', 'name': 'Aldrete (Score)', 'cat': 'Reveil',
    'desc': 'Score de sortie de salle de reveil post-anesthesie',
    'evid': 'C',
    'inputs': [
      radio_input('conscience', 'Conscience', [(0,'Aucune reponse'),(1,'Reponse a la stimulation'),(2,'Eveille, alerte')]),
      radio_input('respiration', 'Respiration', [(0,'Apnee'),(1,'Dyspnee, superficielle'),(2,'Profonde, tousse')]),
      radio_input('circulation', 'Circulation (PA)', [(0,'± 50% normale'),(1,'± 20-50%'),(2,'± 20% normale')]),
      radio_input('motricite', 'Motricite', [(0,'Aucun mouvement'),(1,'2 membres'),(2,'4 membres')]),
      radio_input('saturation', 'SpO2', [(0,'< 90%'),(1,'90-95%'),(2,'> 95%')]),
    ],
    'calc': """    const s = (values.conscience??0)+(values.respiration??0)+(values.circulation??0)+(values.motricite??0)+(values.saturation??0)
    const sev = s < 7 ? 'high' : s < 9 ? 'moderate' : 'low'
    const autorise = s >= 9
    const label = autorise ? "Sortie de SSPI autorisee" : "Surveillance prolongee necessaire"
    return {value:s, label, severity: sev,
      ranges:[""",
    'ranges': [range_item(9,10,'Sortie autorisee','low'),range_item(7,8,'Surveillance prolongee','moderate'),range_item(0,6,'Reveil incomplet, intubation?','high')],
    'interp': "Le score d'Aldrete evalue le reveil post-anesthesie. Un score >= 9/10 autorise la sortie de SSPI.",
    'comment': "Outil valide mais tendance a l'abandon au profit d'echelles plus modernes.",
    'refs': [ref_item('Aldrete JA, Kroulik D. Anesth Analg 1970','5534692')],
  },
  {
    'slug': 'apfel', 'name': 'Apfel (Score)', 'cat': 'Nausees post-op',
    'desc': 'Prediction de nausees-vomissements postoperatoires (NVPO)',
    'evid': 'A',
    'inputs': [
      bool_input('femme','Sexe feminin',1),
      bool_input('tabac','Non-fumeur',1),
      bool_input('atcd_nvpo','Antecedent de NVPO / cinetose',1),
      bool_input('opiacés','Opiaces post-operatoires',1),
    ],
    'calc': """    const s = (values.femme?1:0)+(values.tabac?1:0)+(values.atcd_nvpo?1:0)+(values.opiacés?1:0)
    const risks = [10,21,39,61,79]
    const sev = s>=3?'high':s>=2?'moderate':'low'
    const label = s === 0 ? 'Risque faible' : s <= 2 ? 'Risque modere' : 'Risque eleve'
    return {value:s, label, risk:risks[s]||79, riskUnit:'% NVPO', severity: sev,
      ranges:[""",
    'ranges': [range_item(0,0,'0 facteur - 10%','low'),range_item(1,1,'1 facteur - 21%','low'),range_item(2,2,'2 facteurs - 39%','moderate'),range_item(3,3,'3 facteurs - 61%','high'),range_item(4,4,'4 facteurs - 79%','high')],
    'interp': "Le score d'Apfel predit le risque de NVPO. Chaque facteur = 1 point. Prophylaxie antiemetique adaptee.",
    'comment': "Score le plus utilise en SSPI. Une prophylaxie a 2 ou 3 agents est recommandee si >= 3 facteurs.",
    'refs': [ref_item('Apfel CC et al. Anesthesiology 1999','10485781')],
  },
  {
    'slug': 'ariscat', 'name': 'ARISCAT (Score)', 'cat': 'Complications respiratoires',
    'desc': 'Prediction de complication respiratoire post-operatoire',
    'evid': 'A',
    'inputs': [
      radio_input('age','Age',[(0,'< 50 ans'),(3,'51-80 ans'),(6,'> 80 ans')]),
      radio_input('sp02','SpO2 pre-op',[(0,'>= 96%'),(8,'91-95%'),(24,'<= 90%')]),
      bool_input('infection_resp','Infection respiratoire < 1 mois',12),
      bool_input('anemie','Hb <= 10 g/dL',4),
      radio_input('incision','Site incision',[(0,'Peripherique'),(8,'Thoracique haute'),(15,'Abdominale haute')]),
      radio_input('duree','Duree chirurgie',[(0,'< 2h'),(5,'> 2h')]),
      bool_input('urgence','Urgence',8),
    ],
    'calc': """    const s = (values.age??0)+(values.sp02??0)+(values.infection_resp?12:0)+(values.anemie?4:0)+(values.incision??0)+(values.duree??0)+(values.urgence?8:0)
    const sev = s>=45?'high':s>=26?'moderate':'low'
    const label = s < 26 ? 'Faible' : s < 45 ? 'Modere' : 'Eleve'
    const risk = s < 26 ? 1.6 : s < 45 ? 13.3 : 42.2
    return {value:s, label, risk, riskUnit:'% CPR', severity: sev,
      ranges:[""",
    'ranges': [range_item(0,25,'Faible risque','low'),range_item(26,44,'Risque modere','moderate'),range_item(45,999,'Risque eleve','high')],
    'interp': "L'ARISCAT predit les complications respiratoires post-operatoires (CPR). Score >= 45 = risque eleve.",
    'comment': "Valide en chirurgie non-cardiaque. Optimiser l'Hb, traiter les infections respiratoires, kinesitherapie pre-op.",
    'refs': [ref_item('Canet J et al. Eur Respir J 2010','20525716')],
  },
  {
    'slug': 'asa', 'name': 'A.S.A. (Score)', 'cat': 'Classification pre-op',
    'desc': "Classification ASA de l'etat general avant anesthesie",
    'evid': 'B',
    'inputs': [
      radio_input('classe','Classe ASA',[(1,'ASA I - Patient sain'),(2,'ASA II - Maladie legere'),(3,'ASA III - Maladie severe'),(4,'ASA IV - Menace vitale'),(5,'ASA V - Moribond'),(6,'ASA VI - Mort cerebrale')]),
      bool_input('urgence','Intervention en urgence'),
    ],
    'calc': """    const c = values.classe??1
    const u = values.urgence ? 'E' : ''
    const labels = {1:'ASA I',2:'ASA II',3:'ASA III',4:'ASA IV',5:'ASA V',6:'ASA VI'}
    const sev = c>=4?'high':c>=3?'moderate':'low'
    return {value:c, label:(labels[c]||'')+u, severity: sev,
      ranges:[""",
    'ranges': [range_item(1,1,'ASA I','low'),range_item(2,2,'ASA II','low'),range_item(3,3,'ASA III','moderate'),range_item(4,4,'ASA IV','high'),range_item(5,5,'ASA V','critical'),range_item(6,6,'ASA VI','critical')],
    'interp': "La classification ASA evalue le risque anesthesique. Le suffixe E (urgence) majore le risque.",
    'comment': "Classification universelle mais subjective. Forte correlation avec la mortalite post-operatoire.",
    'refs': [ref_item('ASA Physical Status Classification. Anesthesiology 2020','32649373')],
  },
  {
    'slug': 'caprini', 'name': 'Caprini v.2005 (Score)', 'cat': 'Risque thromboembolique',
    'desc': 'Risque embolique post-operatoire (version 2005)',
    'evid': 'A',
    'inputs': [
      radio_input('age','Age',[(1,'41-60 ans'),(2,'61-74 ans'),(3,'>= 75 ans')]),
      radio_input('chirurgie','Type chirurgie',[(1,'< 45 min'),(2,'> 45 min'),(3,'Laparoscopique > 45 min')]),
      bool_input('cancer','Cancer actif / metastases',2),
      bool_input('atcd_mte','ATCD MTEV personnel',3),
      bool_input('obesite','IMC > 25',1),
      bool_input('grossesse','Grossesse / post-partum',1),
      bool_input('contraception','Contraception hormonale',1),
      bool_input('alitement','Alitement > 72h',2),
      bool_input('varices','Varices / oedeme jambes',1),
      bool_input('thrombophilie','Thrombophilie connue',3),
    ],
    'calc': """    const s = (values.age??0)+(values.chirurgie??0)+(values.cancer?2:0)+(values.atcd_mte?3:0)+(values.obesite?1:0)+(values.grossesse?1:0)+(values.contraception?1:0)+(values.alitement?2:0)+(values.varices?1:0)+(values.thrombophilie?3:0)
    const sev = s>=7?'high':s>=5?'moderate':'low'
    const label = s < 3 ? 'Faible' : s < 5 ? 'Modere' : s < 7 ? 'Eleve' : 'Tres eleve'
    return {value:s, label, severity: sev,
      ranges:[""",
    'ranges': [range_item(0,2,'Faible - Pas de prophylaxie','low'),range_item(3,4,'Modere - HBPM','low'),range_item(5,6,'Eleve - HBPM','moderate'),range_item(7,999,'Tres eleve - HBPM + contention','high')],
    'interp': "Le score de Caprini estime le risque thromboembolique post-operatoire et guide la prophylaxie.",
    'comment': "Utilise en chirurgie generale et orthopedique. Adapter la prophylaxie selon le risque hemorragique.",
    'refs': [ref_item('Caprini JA et al. Dis Mon 2005','15900263')],
  },
  {
    'slug': 'cormack', 'name': 'Cormack et Lehane (Classification)', 'cat': 'Intubation',
    'desc': "Classification de la difficulte d'intubation selon la vision de la glotte",
    'evid': 'B',
    'inputs': [
      radio_input('grade','Grade',[(1,'Grade I - Vue complete de la glotte'),(2,'Grade II - Vue partielle'),(3,'Grade III - Vue de l\'epiglotte seulement'),(4,'Grade IV - Aucune vue')]),
    ],
    'calc': """    const g = values.grade??1
    const labels = {1:'Grade I - Facile',2:'Grade II - Partielle',3:'Grade III - Difficile',4:'Grade IV - Tres difficile'}
    const sev = g>=3?'high':g>=2?'moderate':'low'
    return {value:g, label:labels[g]||'', severity: sev,
      ranges:[""",
    'ranges': [range_item(1,1,'Grade I - Intubation facile','low'),range_item(2,2,'Grade II - Difficulte moderee','moderate'),range_item(3,3,'Grade III - Intubation difficile','high'),range_item(4,4,'Grade IV - Intubation tres difficile','high')],
    'interp': "La classification de Cormack-Lehane evalue la visibilite glottique en laryngoscopie. Grade III-IV = difficile.",
    'comment': "Ne pas resumer le risque a ce seul critere. Utiliser conjointement Mallampati, distance thyromentonniere, ouverture de bouche.",
    'refs': [ref_item('Cormack RS, Lehane J. Anaesthesia 1984','6507927')],
  },
  {
    'slug': 'deltapp', 'name': 'Delta PP (Calcul)', 'cat': 'Hemodynamique',
    'desc': 'Variation de pression pulsee pour evaluer la reponse au remplissage vasculaire',
    'evid': 'B',
    'inputs': [
      number_input('pamax','PA systolique max','mmHg','120'),
      number_input('pamin','PA systolique min','mmHg','80'),
    ],
    'calc': """    const max = values.pamax ?? 120
    const min = values.pamin ?? 80
    const moy = (max + min) / 2
    const deltaPP = moy > 0 ? ((max - min) / moy * 100) : 0
    const arr = Math.round(deltaPP * 100) / 100
    const sev = deltaPP > 13 ? 'moderate' : 'low'
    const label = deltaPP > 13 ? 'Repondeur' : 'Non repondeur'
    return {value:arr, label, severity: sev,
      ranges:[""",
    'ranges': [range_item(0,13,'Non repondeur','low'),range_item(13.1,999,'Repondeur au remplissage','moderate')],
    'interp': "Le Delta PP est un indice dynamique de precharge-dependance. > 13% predit la reponse au remplissage.",
    'comment': "Valide sous ventilation mecanique en rythme sinusal. Invalide si arythmie, respiration spontanee.",
    'refs': [ref_item('Michard F et al. Am J Respir Crit Care Med 2000','10791579')],
  },
  {
    'slug': 'gastvol_perlas', 'name': 'Volume gastrique (Perlas)', 'cat': 'Jeune',
    'desc': 'Evaluation du volume gastrique par echographie selon Perlas',
    'evid': 'B',
    'inputs': [
      radio_input('grade','Grade Perlas',[(0,'Grade 0 - Estomac vide (pas de contenu visible)'),(1,'Grade 1 - Liquide clair en decubitus dorsal'),(2,'Grade 2 - Liquide clair en decubitus dorsal et lateral droit')]),
    ],
    'calc': """    const g = values.grade??0
    const labels = ['Grade 0 - Estomac vide','Grade 1 - Risque modere','Grade 2 - Estomac non a jeun']
    const sev = g === 0 ? 'low' : g === 1 ? 'moderate' : 'high'
    return {value:g, label:labels[g], severity: sev,
      ranges:[""",
    'ranges': [range_item(0,0,"Risque d'inhalation faible",'low'),range_item(1,1,'Jeune insuffisant? Envisager retard','moderate'),range_item(2,2,'Risque d\'inhalation eleve, surseoir si possible','high')],
    'interp': "Le grade de Perlas evalue le volume gastrique par echographie. Grade 2 = risque d'inhalation eleve.",
    'comment': "Outil emergant. Grade 2 a une specificite > 90% pour un volume gastrique > 1.5 mL/kg.",
    'refs': [ref_item('Perlas A et al. Anesthesiology 2009','19277803')],
  },
  {
    'slug': 'lee', 'name': 'Lee (RCRI - Revised Cardiac Risk Index)', 'cat': 'Risque cardiaque',
    'desc': 'Risque cardio-vasculaire perioperatoire en chirurgie non-cardiaque',
    'evid': 'A',
    'inputs': [
      bool_input('chirurgie_haut_risque','Chirurgie haut risque (vasculaire, thoracique, abdominale)'),
      bool_input('coronaropathie','Coronaropathie (IDM, angor, stent)'),
      bool_input('insuffisance_cardiaque','Insuffisance cardiaque congestive'),
      bool_input('aec','AVC / AIT'),
      bool_input('diabete_insuline','Diabete insulino-traite'),
      bool_input('insuffisance_renale','Insuffisance renale (creatinine > 177 micromol/L)'),
    ],
    'calc': """    const s = (values.chirurgie_haut_risque?1:0)+(values.coronaropathie?1:0)+(values.insuffisance_cardiaque?1:0)+(values.aec?1:0)+(values.diabete_insuline?1:0)+(values.insuffisance_renale?1:0)
    const idx = s > 3 ? 3 : s
    const risks = [0.4, 0.9, 6.6, 11]
    const labels = ['Tres faible','Faible','Modere','Eleve']
    const sev = s>=2?'moderate':'low'
    return {value:s, label:labels[idx], risk:risks[idx], riskUnit:'% risque MACE', severity: sev,
      ranges:[""",
    'ranges': [range_item(0,0,'< 1% risque cardiovasculaire','low'),range_item(1,1,'~1% risque','low'),range_item(2,2,'~7% risque, bilan cardiologique','moderate'),range_item(3,6,'> 11% risque, avis cardio obligatoire','high')],
    'interp': "Le RCRI de Lee predit le risque d'evenements cardiaques majeurs en chirurgie non-cardiaque.",
    'comment': "Outil le plus valide pour le risque cardiaque perioperatoire. Si >= 2 facteurs, bilan cardio pre-op recommande.",
    'refs': [ref_item('Lee TH et al. Circulation 1999','10436159')],
  },
  {
    'slug': 'macocha', 'name': 'MACOCHA (Score)', 'cat': 'Intubation',
    'desc': "Prediction d'intubation difficile en reanimation",
    'evid': 'B',
    'inputs': [
      radio_input('mallampati','Mallampati modifie',[(0,'I-II'),(5,'III-IV')]),
      radio_input('ouverture_bouche','Ouverture de bouche',[(0,'> 3 cm'),(3,'< 3 cm')]),
      radio_input('distance_thyr','Distance thyromentonniere',[(0,'> 6.5 cm'),(3,'< 6.5 cm')]),
      bool_input('sniffing','Position sniffing impossible',2),
      bool_input('obstacle','Obstacle VAS connu',2),
      bool_input('coma','Coma / arret cardiaque / hypoxemie',2),
    ],
    'calc': """    const s = (values.mallampati??0)+(values.ouverture_bouche??0)+(values.distance_thyr??0)+(values.sniffing?2:0)+(values.obstacle?2:0)+(values.coma?2:0)
    const sev = s >= 12 ? 'high' : s >= 8 ? 'moderate' : 'low'
    const label = s < 8 ? 'Intubation facile' : s < 12 ? 'Difficulte moderee' : 'Intubation tres difficile'
    return {value:s, label, severity: sev,
      ranges:[""",
    'ranges': [range_item(0,7,'Intubation facile','low'),range_item(8,11,'Difficulte moderee - Preparer alternative','moderate'),range_item(12,999,'Voie difficile anticipee - Masque larynge','high')],
    'interp': "Le MACOCHA est le seul score valide pour predire l'intubation difficile en reanimation. >= 12 = tres difficile.",
    'comment': "Developpe pour la reanimation. Integre l'urgence vitale comme facteur de risque.",
    'refs': [ref_item('De Jong A et al. Intensive Care Med 2013','23765248')],
  },
  {
    'slug': 'mallampati', 'name': 'Mallampati modifie (Score)', 'cat': 'Intubation',
    'desc': "Prediction d'intubation difficile par classification oropharyngee",
    'evid': 'C',
    'inputs': [
      radio_input('classe','Classe Mallampati',[(1,'Classe I - Luette, piliers, palais mou visibles'),(2,'Classe II - Luette, palais mou visibles'),(3,'Classe III - Palais mou, base luette visibles'),(4,'Classe IV - Palais dur seulement visible')]),
    ],
    'calc': """    const c = values.classe??1
    const sev = c >= 3 ? 'moderate' : 'low'
    return {value:c, label:'Classe '+c, severity: sev,
      ranges:[""",
    'ranges': [range_item(1,1,'Classe I - Facile','low'),range_item(2,2,'Classe II - Generalement facile','low'),range_item(3,3,'Classe III - Difficulte potentielle','moderate'),range_item(4,4,'Classe IV - Difficile probable','high')],
    'interp': "Mallampati modifie evalue la visibilite oropharyngee. Classe III-IV = risque d'intubation difficile x4-7.",
    'comment': "Sensibilite 50% seul. Toujours combine: Mallampati + ouverture bouche + distance thyromentonniere + Cormack.",
    'refs': [ref_item('Mallampati SR et al. Can Anaesth Soc J 1985','4028873')],
  },
  {
    'slug': 'ramsay', 'name': 'Ramsay (Echelle)', 'cat': 'Sedation',
    'desc': 'Echelle de niveau de sedation (6 niveaux)',
    'evid': 'C',
    'inputs': [
      radio_input('niveau','Niveau Ramsay',[(1,'1 - Anxieux, agite'),(2,'2 - Cooperant, oriente, calme'),(3,'3 - Repond aux ordres'),(4,'4 - Repond a la stimulation sonore'),(5,'5 - Repond a la stimulation nociceptive'),(6,'6 - Aucune reponse')]),
    ],
    'calc': """    const n = values.niveau??2
    const labels = {1:'Agite',2:'Calme',3:'Repond ordres',4:'Repond bruit',5:'Repond douleur',6:'Aucune reponse'}
    const sev = n >= 5 ? 'high' : n === 1 ? 'moderate' : 'low'
    return {value:n, label:labels[n]||'', severity: sev,
      ranges:[""",
    'ranges': [range_item(1,1,'1 - Agite, anxieux','moderate'),range_item(2,2,'2 - Calme, oriente (objectif ideal)','low'),range_item(3,3,'3 - Sedation legere','low'),range_item(4,4,'4 - Sedation moderee','low'),range_item(5,5,'5 - Sedation profonde','high'),range_item(6,6,'6 - Inconscient','high')],
    'interp': "Ramsay evalue le niveau de sedation. Objectif ideal en reanimation: Ramsay 2-3 (calme et cooperant).",
    'comment': "Premiere echelle de sedation validee. Remplacee par RASS (meilleure reproductibilite).",
    'refs': [ref_item('Ramsay MA et al. Br Med J 1974','4842094')],
  },
  {
    'slug': 'rass', 'name': 'RASS - Richmond (Agitation-Sedation)', 'cat': 'Sedation',
    'desc': 'Richmond Agitation-Sedation Scale: -5 (inconscient) a +4 (combatif)',
    'evid': 'A',
    'inputs': [
      radio_input('niveau','Niveau RASS',[(4,'+4 - Combatif, danger immediat'),(3,'+3 - Tres agite, tire sur les tubes'),(2,'+2 - Agite'),(1,'+1 - Nerveux'),(0,'0 - Alerte et calme'),(-1,'-1 - Somnolent'),(-2,'-2 - Sedation legere'),(-3,'-3 - Sedation moderee'),(-4,'-4 - Sedation profonde'),(-5,'-5 - Inconscient')]),
    ],
    'calc': """    const n = values.niveau ?? 0
    const labels = {4:'Combatif',3:'Tres agite',2:'Agite',1:'Nerveux',0:'Alerte et calme',-1:'Somnolent',-2:'Sedation legere',-3:'Sedation moderee',-4:'Sedation profonde',-5:'Inconscient'}
    const sev = n >= 3 ? 'high' : n >= 1 ? 'moderate' : n <= -4 ? 'high' : n <= -2 ? 'moderate' : 'low'
    return {value:n, label:labels[n]||'', severity: sev,
      ranges:[""",
    'ranges': [range_item(-5,-5,'-5 Inconscient - Trop profond','high'),range_item(-4,-4,'-4 Sedation profonde','high'),range_item(-3,-3,'-3 Sedation moderee','moderate'),range_item(-2,-2,'-2 Sedation legere','low'),range_item(-1,-1,'-1 Somnolent','low'),range_item(0,0,'0 Alerte et calme','low'),range_item(1,1,'+1 Nerveux','moderate'),range_item(2,2,'+2 Agite','moderate'),range_item(3,3,'+3 Tres agite','high'),range_item(4,4,'+4 Combatif','high')],
    'interp': "Le RASS est l'echelle de sedation-agitation de reference en reanimation (-5 a +4). Objectif: 0 a -2.",
    'comment': "Remplace Ramsay. L'arret quotidien de la sedation reduit la duree de ventilation mecanique.",
    'refs': [ref_item('Sessler CN et al. Am J Respir Crit Care Med 2002','12421743')],
  },
  {
    'slug': 'rudkin', 'name': 'Rudkin (Echelle)', 'cat': 'Sedation',
    'desc': 'Echelle de sedation consciente (5 niveaux)',
    'evid': 'C',
    'inputs': [
      radio_input('niveau','Niveau Rudkin',[(1,'1 - Eveille, anxieux'),(2,'2 - Eveille, calme'),(3,'3 - Somnolent, repond aux ordres'),(4,'4 - Endormi, repond a la stimulation'),(5,'5 - Endormi, ne repond pas')]),
    ],
    'calc': """    const n = values.niveau??2
    const labels = {1:'Agite',2:'Calme',3:'Somnolent',4:'Endormi (repond)',5:'Endormi (aucune reponse)'}
    const sev = n >= 4 ? 'high' : n >= 3 ? 'moderate' : 'low'
    return {value:n, label:labels[n]||'', severity: sev,
      ranges:[""",
    'ranges': [range_item(1,1,'1 - Anxieux, agite','low'),range_item(2,2,'2 - Eveille, calme (objectif)','low'),range_item(3,3,'3 - Somnolent, repond aux ordres','moderate'),range_item(4,4,'4 - Endormi, repond a la stimulation','high'),range_item(5,5,'5 - Endormi, aucune reponse','high')],
    'interp': "Rudkin evalue la sedation consciente. Niveau 2 = objectif ideal (eveille, calme, cooperant).",
    'comment': "Utilisee en chirurgie ambulatoire et odontologie. Niveau 5 trop profond sans voie aerienne securisee.",
    'refs': [ref_item('Rudkin GE et al. Anesth Prog 1992','1445099')],
  },
  {
    'slug': 'volventiladulte', 'name': 'Volume courant de ventilation (adulte)', 'cat': 'Ventilation',
    'desc': 'Calcul du volume courant pour parametrage du respirateur (6-8 mL/kg poids ideal)',
    'evid': 'B',
    'inputs': [
      number_input('poids_ideal','Poids ideal','kg','70'),
      radio_input('mode','Mode ventilatoire',[(6,'Protection pulmonaire (6 mL/kg)'),(7,'Standard (7 mL/kg)'),(8,'Ventilation minute (8 mL/kg)')]),
    ],
    'calc': """    const p = values.poids_ideal ?? 70
    const m = values.mode ?? 7
    const vc = Math.round(p * m)
    return {value:vc, label: vc + ' mL', severity: 'low',
      ranges:[""",
    'ranges': [range_item(0,0,'Veuillez entrer un poids et choisir un mode','low')],
    'interp': "Le volume courant se calcule sur le poids ideal. Protection pulmonaire: 6 mL/kg/PI avec PEEP.",
    'comment': "En SDRA, 6 mL/kg reduit la mortalite. Pression plateau < 30 cmH2O.",
    'refs': [ref_item('ARDS Network. N Engl J Med 2000','10752862')],
  },
]

# Write all anesthesie files
for d in data_anesthesie:
    ranges_str = ',\n'.join(d['ranges']) + ','
    calc_code = d['calc'] + '\n' + ranges_str + '\n      ]}\n    )'
    body = formula_file(d['slug'], d['name'], ANESTH, d['cat'], d['desc'],
                       d['evid'], d['inputs'], calc_code, d['interp'], d['comment'], d['refs'])
    write(ANESTH, d['slug'], body)
    print('  ' + ANESTH + '/' + d['slug'] + '.ts')

print('Done! ' + str(len(data_anesthesie)) + ' anesthesie formulas')

# ============================================
# BRULES (7 formulas)
# ============================================
BRULES = 'brules'

data_brules = [
  {
    'slug': 'absi', 'name': 'ABSI (Score)', 'cat': 'Gravite',
    'desc': 'Abbreviated Burn Severity Index - probabilite de survie du patient brule',
    'evid': 'B',
    'inputs': [
      radio_input('sexe','Sexe',[(1,'Masculin'),(0,'Feminin')]),
      radio_input('age','Age',[(1,'< 40 ans'),(2,'40-60 ans'),(3,'61-80 ans'),(4,'> 80 ans')]),
      number_input('surface','Surface brulee','% SCB'),
      radio_input('inhalation','Inhalation',[(0,'Non'),(1,'Oui (suspectee ou confirmee)')]),
      radio_input('profondeur','Profondeur',[(1,'2e degre superficiel'),(2,'2e degre profond / 3e degre')]),
    ],
    'calc': """    const s = (values.sexe??1)+(values.age??1)+(Math.min(Math.max(parseFloat(values.surface)||0,0),100)>20?1:0)+(values.inhalation??0)+(values.profondeur??1)
    const mort = {3:0.4,4:0.9,5:2.1,6:4.8,7:10,8:19,9:30,10:45,11:60,12:75,13:85,14:95}[s] || (s<3?0.1:s>14?99:50)
    const sev = s>=9?'high':s>=6?'moderate':'low'
    const labels = {3:'Faible',5:'Modere',7:'Modere-eleve',9:'Eleve',11:'Tres eleve',13:'Extreme'}
    return {value:s, label:labels[Math.round(s/2)*2]||'Atteint', risk:mort, riskUnit:'% mortalite', severity: sev,
      ranges:[
        {min:0,max:5,label:'Faible risque de mortalite',severity:'low'},
        {min:6,max:8,label:'Risque modere',severity:'moderate'},
        {min:9,max:12,label:'Risque eleve',severity:'high'},
        {min:13,max:999,label:'Risque extreme',severity:'critical'},
      ]}
    """,
    'ranges': [],
    'interp': "L'ABSI (Abbreviated Burn Severity Index) est un score pronostique chez le brule. Chaque item augmente le risque de mortalite.",
    'comment': "Score simple et rapide. Ne remplace pas le jugement clinique. Ideal pour le tri initial.",
    'refs': [ref_item('Tobiasen J et al. J Trauma 1982','7108969')],
  },
  {
    'slug': 'inhalation_fumee', 'name': 'Inhalation de fumees (Score)', 'cat': 'Inhalation',
    'desc': 'Score diagnostique clinique de tri pour les inhalations de fumees d\'incendies',
    'evid': 'C',
    'inputs': [
      bool_input('enfermement','Enfermement dans un espace clos',1),
      bool_input('brulure_face','Brulure faciale',1),
      bool_input('poils_nez','Poils nasaux brulees',1),
      bool_input('voix_rauque','Voix rauque / dysphonie',1),
      bool_input('stridor','Stridor / wheezing / toux',1),
      bool_input('expectoration','Expectoration charbonneuse',2),
      bool_input('hypoxie','Hypoxie (SpO2 < 92%)',2),
      bool_input('trou_conscience','Troubles de conscience',2),
    ],
    'calc': """    const s = (values.enfermement?1:0)+(values.brulure_face?1:0)+(values.poils_nez?1:0)+(values.voix_rauque?1:0)+(values.stridor?1:0)+(values.expectoration?2:0)+(values.hypoxie?2:0)+(values.trou_conscience?2:0)
    const sev = s>=5?'high':s>=3?'moderate':'low'
    const label = s < 3 ? 'Faible suspicion' : s < 5 ? 'Suspicion moderee' : 'Forte suspicion d\'inhalation'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:2,label:'Faible suspicion - Surveillance simple',severity:'low'},
        {min:3,max:4,label:'Suspicion moderee - Fibroscopie bronchique',severity:'moderate'},
        {min:5,max:999,label:'Forte suspicion - Intubation prophylactique?',severity:'high'},
      ]}
    """,
    'ranges': [],
    'interp': "Score clinique de suspicion d'inhalation de fumees. Combine l'anamnese et les signes cliniques.",
    'comment': "L'inhalation de fumees est un facteur de mortalite majeur chez le brule. La fibroscopie bronchique reste le gold standard diagnostique.",
    'refs': [ref_item('Mlcak RP et al. Respir Care 2007','17697425')],
  },
  {
    'slug': 'lund_browder', 'name': 'Surface brulee (Lund et Browder)', 'cat': 'Surface',
    'desc': 'Calcul de la surface cutanee brulee selon le diagramme de Lund et Browder avec correction par age',
    'evid': 'C',
    'inputs': [
      number_input('tete','Tete','%'),
      number_input('tronc_avant','Tronc avant','%'),
      number_input('tronc_arriere','Tronc arriere','%'),
      number_input('bras_droit','Bras droit','%'),
      number_input('bras_gauche','Bras gauche','%'),
      number_input('avb_droit','Avant-bras droit','%'),
      number_input('avb_gauche','Avant-bras gauche','%'),
      number_input('main_droite','Main droite','%'),
      number_input('main_gauche','Main gauche','%'),
      number_input('cuisse_droite','Cuisse droite','%'),
      number_input('cuisse_gauche','Cuisse gauche','%'),
      number_input('jambe_droite','Jambe droite','%'),
      number_input('jambe_gauche','Jambe gauche','%'),
      number_input('pied_droit','Pied droit','%'),
      number_input('pied_gauche','Pied gauche','%'),
      number_input('perinee','Perinee / organes genitaux','%'),
    ],
    'calc': """    const pts = [values.tete,values.tronc_avant,values.tronc_arriere,values.bras_droit,values.bras_gauche,values.avb_droit,values.avb_gauche,values.main_droite,values.main_gauche,values.cuisse_droite,values.cuisse_gauche,values.jambe_droite,values.jambe_gauche,values.pied_droit,values.pied_gauche,values.perinee]
    const total = pts.reduce((a,b) => (a||0)+(parseFloat(b)||0), 0)
    const sev = total > 20 ? 'high' : total > 10 ? 'moderate' : 'low'
    return {value:Math.round(total*10)/10, label: Math.round(total) + '% SCB', risk: total > 20 ? 1 : 0, riskUnit: 'Risque de syndrome inflammatoire', severity: sev,
      ranges:[
        {min:0,max:10,label:'Brule leger (< 10% SCB)',severity:'low'},
        {min:10.1,max:20,label:'Brule modere (10-20% SCB)',severity:'moderate'},
        {min:20.1,max:40,label:'Brule grave (20-40% SCB)',severity:'high'},
        {min:40.1,max:100,label:'Brule severe (> 40% SCB)',severity:'critical'},
      ]}
    """,
    'ranges': [],
    'interp': "Le diagramme de Lund et Browder est plus precis que la regle des 9 car il tient compte des variations selon l'age.",
    'comment': "Reference pour l'evaluation de la surface brulee en milieu specialise. A utiliser de preference a la regle de Wallace.",
    'refs': [ref_item('Lund CC, Browder NC. Surg Gynecol Obstet 1944','—')],
  },
  {
    'slug': 'rempbruleadulte', 'name': 'Brules graves adultes: Remplissage', 'cat': 'Remplissage',
    'desc': 'Calcul du volume de remplissage selon la formule de Parkland (adulte: 4 mL/kg/%SCB)',
    'evid': 'B',
    'inputs': [
      number_input('poids','Poids','kg'),
      number_input('scb','Surface cutanee brulee','%'),
      number_input('delai','Delai depuis la brulure','h'),
    ],
    'calc': """    const p = parseFloat(values.poids)||70
    const scb = parseFloat(values.scb)||0
    const delai = parseFloat(values.delai)||0
    const volTotal = Math.round(4 * p * scb)
    const debit1 = delai < 8 ? Math.round(volTotal / 2 / Math.max(8 - delai, 1)) : 0
    const debit2 = delai < 8 ? Math.round(volTotal / 2 / 16) : Math.round(volTotal / Math.max(24 - delai, 1))
    const sev = scb > 20 ? 'high' : scb > 10 ? 'moderate' : 'low'
    return {value:volTotal, label: volTotal + ' mL total', severity: sev,
      details: { 'Volume 1ere moitie (8h)': Math.round(volTotal/2) + ' mL', 'Debit 1ere moitie': debit1 + ' mL/h', 'Volume 2e moitie (16h)': Math.round(volTotal/2) + ' mL', 'Debit 2e moitie': debit2 + ' mL/h' },
      ranges:[
        {min:0,max:0,label:'Entrer le poids et le % SCB',severity:'low'},
      ]}
    """,
    'ranges': [],
    'interp': "Formule de Parkland: 4 mL de Ringer Lactate / kg / % SCB. Moitie dans les 8h, moitie dans les 16h suivantes.",
    'comment': "Standard international. Adapter le debit a la diurese horaire (objectif: 0.5-1 mL/kg/h chez l'adulte).",
    'refs': [ref_item('Baxter CR, Shires T. Adv Surg 1968','4880290')],
  },
  {
    'slug': 'rempbruleenfant', 'name': 'Brules graves enfants: Remplissage', 'cat': 'Remplissage',
    'desc': 'Volume de remplissage chez l\'enfant brule (3 mL/kg/%SCB + maintenance Holliday-Segar)',
    'evid': 'B',
    'inputs': [
      number_input('poids','Poids','kg'),
      number_input('scb','Surface cutanee brulee','%'),
    ],
    'calc': """    const p = parseFloat(values.poids)||20
    const scb = parseFloat(values.scb)||0
    const volParkland = 3 * p * scb
    // Holliday-Segar maintenance
    const maint = p <= 10 ? p*100 : p <= 20 ? 1000 + (p-10)*50 : 1500 + (p-20)*20
    const volTotal = Math.round(volParkland + maint)
    const sev = scb > 20 ? 'high' : scb > 10 ? 'moderate' : 'low'
    return {value:volTotal, label: volTotal + ' mL/24h', severity: sev,
      details: {'Parkland (3mL/kg/%SCB)': Math.round(volParkland) + ' mL', 'Maintenance (Holliday-Segar)': Math.round(maint) + ' mL/24h'},
      ranges:[
        {min:0,max:0,label:'Entrer le poids et le % SCB',severity:'low'},
      ]}
    """,
    'ranges': [],
    'interp': "Chez l'enfant brule: Parkland a 3 mL/kg/%SCB + maintenance Holliday-Segar. Objectif diurese: 1-2 mL/kg/h.",
    'comment': "L'enfant a un ratio surface/poids plus eleve, justifiant la formule modifiee a 3 mL/kg. Ne pas oublier les pertes insensibles majorees.",
    'refs': [ref_item('Jeschke MG et al. Lancet 2018','29631388')],
  },
  {
    'slug': 'toronto', 'name': 'Toronto (Formule)', 'cat': 'Nutrition',
    'desc': 'Evaluation des besoins energetiques chez le patient brule selon la formule de Toronto',
    'evid': 'C',
    'inputs': [
      number_input('age','Age du patient','ans'),
      number_input('taille','Taille','cm'),
      number_input('poids','Poids actuel','kg'),
      number_input('scb','Surface cutanee brulee','%'),
      number_input('temperature','Temperature','°C'),
    ],
    'calc': """    const age = parseFloat(values.age)||35
    const taille = parseFloat(values.taille)||170
    const poids = parseFloat(values.poids)||70
    const scb = parseFloat(values.scb)||0
    const temp = parseFloat(values.temperature)||37
    // Basal: Harris-Benedict
    const be = 66.47 + (13.75*poids) + (5.0*taille) - (6.76*age)
    // Toronto: -4343 + (10.5 x SCB) + (0.23 x BE) + (0.84 x Harris-Benedict) + (114 x temperature) - (4.5 x jours post-brulure)
    const besoins = Math.round(-4343 + (10.5*scb) + (0.84*be) + (114*temp))
    const sev = besoins > 3500 ? 'high' : besoins > 2500 ? 'moderate' : 'low'
    return {value:besoins, label: besoins + ' kcal/j', severity: sev,
      ranges:[
        {min:0,max:2000,label:'Besoins normaux',severity:'low'},
        {min:2001,max:3500,label:'Besoins augmentes',severity:'moderate'},
        {min:3501,max:9999,label:'Hypermetabolisme severe',severity:'high'},
      ]}
    """,
    'ranges': [],
    'interp': "La formule de Toronto estime les besoins energetiques du brule, qui sont fortement augmentes par l'hypermetabolisme post-brulure.",
    'comment': "Formule de reference pour la nutrition du brule. A ajuster selon la tolerance clinique. Le support nutritionnel precoce (dans les 24h) reduit les complications.",
    'refs': [ref_item('Allard JP et al. Nutr Clin Pract 1990','2122167')],
  },
  {
    'slug': 'wallace', 'name': 'Surface brulee (Wallace)', 'cat': 'Surface',
    'desc': 'Regle des 9 de Wallace pour estimation rapide de la surface brulee',
    'evid': 'C',
    'inputs': [
      number_input('tete_cou','Tete et cou','%'),
      number_input('tronc_avant','Tronc avant','%'),
      number_input('tronc_arriere','Tronc arriere','%'),
      number_input('ms_droit','Membre superieur droit','%'),
      number_input('ms_gauche','Membre superieur gauche','%'),
      number_input('mi_droit','Membre inferieur droit','%'),
      number_input('mi_gauche','Membre inferieur gauche','%'),
      number_input('perinee','Perinee','%'),
    ],
    'calc': """    const pts = [values.tete_cou,values.tronc_avant,values.tronc_arriere,values.ms_droit,values.ms_gauche,values.mi_droit,values.mi_gauche,values.perinee]
    const total = pts.reduce((a,b) => (a||0)+(parseFloat(b)||0), 0)
    const sev = total > 20 ? 'high' : total > 10 ? 'moderate' : 'low'
    return {value:Math.round(total*10)/10, label: Math.round(total) + '% SCB (regle des 9)', severity: sev,
      ranges:[
        {min:0,max:10,label:'< 10% SCB - Brule leger',severity:'low'},
        {min:10.1,max:20,label:'10-20% SCB - Brule modere',severity:'moderate'},
        {min:20.1,max:40,label:'20-40% SCB - Brule grave',severity:'high'},
        {min:40.1,max:100,label:'> 40% SCB - Brule severe',severity:'critical'},
      ]}
    """,
    'ranges': [],
    'interp': "La regle des 9 de Wallace permet une estimation rapide de la surface brulee. A utiliser au lit du patient pour le tri initial.",
    'comment': "Valable chez l'adulte. Chez l'enfant, les proportions different: tete 18%, membre inferieur 14%. Reference pour le tri prehospitalier.",
    'refs': [ref_item('Wallace AB. Lancet 1951','14852119')],
  },
]

for d in data_brules:
    calc_code = d['calc']
    body = formula_file(d['slug'], d['name'], BRULES, d['cat'], d['desc'],
                       d['evid'], d['inputs'], calc_code, d['interp'], d['comment'], d['refs'])
    write(BRULES, d['slug'], body)
    print('  ' + BRULES + '/' + d['slug'] + '.ts')

print('Done! ' + str(len(data_brules)) + ' brules formulas')
