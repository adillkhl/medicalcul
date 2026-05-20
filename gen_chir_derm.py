#!/usr/bin/env python3
"""Generate chirurgie + dermatologie formula files."""
import sys, os
sys.path.insert(0, '/opt/data/medicalcul')
exec(open('gen_all.py').read().split("# ============================================")[0])

CHIR = 'chirurgie'
data = [
  {'slug':'afc_resection','name':'AFC, resection colorectale (Score)','cat':'Resection','evid':'C',
   'desc':'Risque operatoire de resection colorectale selon l\'Association Francaise de Chirurgie',
   'inputs':[bool_input('denutrition','Denutrition (albumine < 30, perte poids > 10%)',1),bool_input('neuro','ATCD neurologique',1),bool_input('cardio','Insuffisance cardiaque / coronaropathie',1),bool_input('respiratoire','Insuffisance respiratoire chronique',1),bool_input('renale','Insuffisance renale chronique (creatinine > 150)',1),radio_input('age','Age',[(0,'< 65 ans'),(1,'65-75 ans'),(2,'> 75 ans')]),bool_input('urgence','Intervention en urgence',2)],
   'calc':"    const s = (values.denutrition?1:0)+(values.neuro?1:0)+(values.cardio?1:0)+(values.respiratoire?1:0)+(values.renale?1:0)+(values.age??0)+(values.urgence?2:0)\n    const sev = s>=4?'high':s>=2?'moderate':'low'\n    const label = s < 2 ? 'Risque faible' : s < 4 ? 'Risque modere' : 'Risque eleve'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:1,label:'Risque faible',severity:'low'},\n        {min:2,max:3,label:'Risque modere - Optimisation pre-op',severity:'moderate'},\n        {min:4,max:999,label:'Risque eleve - Discuter rapport benefice/risque',severity:'high'},\n      ]}",
   'interp':"Score AFC pour le risque operatoire de resection colorectale combine les comorbidites et l'urgence.",
   'comment':"Developpe par l'Association Francaise de Chirurgie. Une optimisation pre-operatoire (nutritionnelle, cardiologique) peut reduire le risque.",
   'refs':[ref_item('Alves A et al. Ann Surg 2007','17291951')]},
  {'slug':'alvarado','name':'Alvarado, MANTRELS (Score)','cat':'Appendicite','evid':'A',
   'desc':'Probabilite d\'appendicite aigue selon le score d\'Alvarado (MANTRELS)',
   'inputs':[bool_input('migration','Migration de la douleur vers FID',1),bool_input('anorexie','Anorexie / ace tone urinaire',1),bool_input('nausees','Nausees / vomissements',1),bool_input('tenderness','Tenderness en FID',2),bool_input('rebound','Rebond / defense en FID',1),bool_input('temperature','Temperature > 37.3°C',1),radio_input('leucocytes','Leucocytes',[(0,'< 10000'),(1,'10000-15000'),(2,'> 15000')]),radio_input('neutrophiles','Neutrophiles',[(0,'< 75%'),(1,'> 75%')])],
   'calc':"    const s = (values.migration?1:0)+(values.anorexie?1:0)+(values.nausees?1:0)+(values.tenderness?2:0)+(values.rebound?1:0)+(values.temperature?1:0)+(values.leucocytes??0)+(values.neutrophiles??0)\n    const sev = s>=7?'high':s>=5?'moderate':'low'\n    const label = s < 5 ? 'Faible probabilite' : s < 7 ? 'Probabilite intermediaire' : 'Haute probabilite'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:4,label:'Faible - Surveillance ou sortie',severity:'low'},\n        {min:5,max:6,label:'Intermediaire - TDM ou echo puis decision',severity:'moderate'},\n        {min:7,max:10,label:'Eleve - Appendicectomie probable',severity:'high'},\n      ]}",
   'interp':"Score d'Alvarado (MANTRELS) pour l'appendicite aigue. Chaque lettre correspond a un item (8 items, 10 points max).",
   'comment':"Score bien valide, meilleure sensibilite que la clinique seule. Un score >= 7 a une forte valeur predictive positive. L'imagerie (TDM abdo ou echo) reste utile pour les scores intermediaires.",
   'refs':[ref_item('Alvarado A. Ann Emerg Med 1986','3729132')]},
  {'slug':'apgar_chir','name':'Apgar Chirurgical (Score)','cat':'Severite','evid':'B',
   'desc':'Score pronostique de severite et de mortalite post-operatoire en 3 items (0-10)',
   'inputs':[radio_input('pertes_sang','Pertes sanguines',[(0,'< 100 mL'),(1,'100-500 mL'),(2,'> 500 mL')]),radio_input('pam_min','PAM minimale per-op',[(0,'> 100 mmHg'),(1,'70-100 mmHg'),(2,'< 70 mmHg')]),radio_input('fc_min','FC minimale per-op',[(0,'> 80/min'),(1,'50-80/min'),(2,'< 50/min')])],
   'calc':"    const s = (values.pertes_sang?0:4)+(values.pam_min?0:4)+(values.fc_min?0:3)\n    const sev = s <= 4 ? 'high' : s <= 7 ? 'moderate' : 'low'\n    const label = s <= 4 ? 'Risque eleve' : s <= 7 ? 'Risque modere' : 'Risque faible'\n    return {value:10-s, label: (10-s)+'/10', severity: sev,\n      ranges:[\n        {min:0,max:4,label:'Apgar < 5 - Risque eleve de complications',severity:'high'},\n        {min:5,max:7,label:'Apgar 5-7 - Risque modere',severity:'moderate'},\n        {min:8,max:10,label:'Apgar 8-10 - Faible risque',severity:'low'},\n      ]}",
   'interp':"L'Apgar Chirurgical evalue le pronostic post-operatoire immediat (pertes sanguines, PAM, FC). Score < 5 = risque eleve de complications majeures.",
   'comment':"Simple, rapide, utilisable en SSPI. Correlle a la mortalite a 30 jours. Un score bas doit alerter pour une surveillance renforcee.",
   'refs':[ref_item('Gawande AA et al. BMJ 2007','17412784')]},
  {'slug':'mannheim','name':'Mannheim Peritonitis Index','cat':'Peritonite','evid':'B',
   'desc':'Index de pronostic de mortalite sur peritonite (8 facteurs)',
   'inputs':[bool_input('age','Age > 50 ans',5),bool_input('femme','Sexe feminin',5),bool_input('insuff_organe','Defaillance d\'organe',7),bool_input('cancer','Cancer evolutif',4),bool_input('duree','Peritonite > 24h',4),bool_input('origine_cc','Origine colique',4),radio_input('exsudat','Exsudat',[(0,'Clair / abces'),(1,'Purulent'),(2,'Stercoral / feculent')]),bool_input('diffuse','Peritonite diffuse (generalisee)',6)],
   'calc':"    const s = (values.age?5:0)+(values.femme?5:0)+(values.insuff_organe?7:0)+(values.cancer?4:0)+(values.duree?4:0)+(values.origine_cc?4:0)+(values.exsudat??0)+(values.diffuse?6:0)\n    const sev = s >= 30 ? 'high' : s >= 20 ? 'moderate' : 'low'\n    const label = s < 20 ? 'Mortalite faible' : s < 30 ? 'Mortalite moderee' : 'Mortalite elevee'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:20,label:'< 20 - Mortalite faible (0-5%)',severity:'low'},\n        {min:20,max:29,label:'20-29 - Mortalite moderee (10-20%)',severity:'moderate'},\n        {min:30,max:999,label:'>= 30 - Mortalite elevee (> 40%)',severity:'high'},\n      ]}",
   'interp':"Le Mannheim Peritonitis Index evalue le risque de mortalite dans les peritonites. Score > 29 = mortalite > 40%.",
   'comment':"Valide dans de nombreuses series. L'age, la defaillance d'organe et l'origine colique sont les facteurs les plus ponderes. Necessite une reanimation agressive si score eleve.",
   'refs':[ref_item('Linder MM et al. Chirurg 1987','3608781')]},
  {'slug':'moore_rate','name':'Moore, rate (Classification)','cat':'Traumatisme','evid':'C',
   'desc':'Classification des traumatismes de la rate selon Moore (grades I-V)',
   'inputs':[radio_input('grade','Grade',[(1,'Grade I - Hematome sous-capsulaire < 10% / plaie capsulaire < 1 cm'),(2,'Grade II - Hematome sous-capsulaire 10-50% / plaie 1-3 cm'),(3,'Grade III - Hematome sous-capsulaire > 50% / hematome intra-parenchymateux > 5 cm / plaie > 3 cm'),(4,'Grade IV - Rupture devascularisante du hile'),(5,'Grade V - Eclatement de la rate / atteinte vasculaire du hile')])],
   'calc':"    const g = values.grade??1\n    const labels = {1:'Grade I - Benin',2:'Grade II - Modere',3:'Grade III - Severe',4:'Grade IV - Critique',5:'Grade V - Catastrophique'}\n    const sev = g >= 4 ? 'high' : g >= 3 ? 'moderate' : 'low'\n    const prises = {1:'Surveillance',2:'Surveillance / embolisation',3:'Embolisation / chirurgie discutee',4:'Chirurgie probable (splenectomie)',5:'Chirurgie (splenectomie) urgente'}\n    return {value:g, label:labels[g]||'', severity: sev,\n      ranges:[\n        {min:1,max:1,label:'Grade I - Surveillance',severity:'low'},\n        {min:2,max:2,label:'Grade II - Surveillance / Embolisation',severity:'low'},\n        {min:3,max:3,label:'Grade III - Embolisation / Chirurgie discutee',severity:'moderate'},\n        {min:4,max:4,label:'Grade IV - Chirurgie probable',severity:'high'},\n        {min:5,max:5,label:'Grade V - Chirurgie urgente',severity:'high'},\n      ]}",
   'interp':"Classification de Moore pour les traumatismes spleniques. Grades I-III: traitement conservateur possible. Grades IV-V: splenectomie probable.",
   'comment':"La tendance actuelle est au traitement conservateur (embolisation) pour les grades I-III hemodynamiquement stables. La vaccination anti-pneumococcique est obligatoire apres splenectomie.",
   'refs':[ref_item('Moore EE et al. J Trauma 1989','2709422')]},
  {'slug':'parc','name':'pARC, Appendicite (Score)','cat':'Appendicite','evid':'B',
   'desc':'Probabilite d\'appendicite aigue chez l\'enfant selon le score pARC (francais)',
   'inputs':[bool_input('douleur_fid','Douleur FID < 48h',1),bool_input('vomissements','Vomissements',1),bool_input('rebond','Rebond FID',1),bool_input('temperature','Temperature > 38°C',1),bool_input('crp','CRP > 50 mg/L',1)],
   'calc':"    const s = (values.douleur_fid?1:0)+(values.vomissements?1:0)+(values.rebond?1:0)+(values.temperature?1:0)+(values.crp?1:0)\n    const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const label = s < 2 ? 'Faible probabilite' : s < 3 ? 'Probabilite intermediaire' : 'Haute probabilite'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:1,label:'Faible - Surveillance',severity:'low'},\n        {min:2,max:2,label:'Intermediaire - Echo +/- TDM',severity:'moderate'},\n        {min:3,max:5,label:'Eleve - Appendicectomie probable',severity:'high'},\n      ]}",
   'interp':"Le score pARC (Pediatric Appendicitis Risk Calculator) est un score francais pour l'appendicite de l'enfant (2-17 ans).",
   'comment':"Developpe par l'association de chirurgie pediatrique. Plus simple que le PAS. L'echographie est recommandee en premiere intention chez l'enfant.",
   'refs':[ref_item('Leport V et al. J Pediatr Surg 2022','34743964')]},
  {'slug':'pas','name':'PAS, Pediatric Appendicitis Score','cat':'Appendicite','evid':'A',
   'desc':'Score d\'appendicite pediatrique de Samuel (5 facteurs)',
   'inputs':[bool_input('migration','Migration douleur FID',1),bool_input('anorexie','Anorexie',1),bool_input('nausees','Nausees / vomissements',1),bool_input('douleur_fid','Douleur FID a la toux / palpation',2),bool_input('temperature','Temperature > 37.5°C',1)],
   'calc':"    const s = (values.migration?1:0)+(values.anorexie?1:0)+(values.nausees?1:0)+(values.douleur_fid?2:0)+(values.temperature?1:0)+(values.leucocytes?2:0)+(values.neutrophiles?1:0)+(values.rebond?2:0)\n    const sev = s >= 7 ? 'high' : s >= 5 ? 'moderate' : 'low'\n    const label = s < 5 ? 'Faible' : s < 7 ? 'Intermediaire' : 'Eleve'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:4,label:'Faible - Surveillance',severity:'low'},\n        {min:5,max:6,label:'Intermediaire - Echo/TDM',severity:'moderate'},\n        {min:7,max:10,label:'Eleve - Appendicectomie',severity:'high'},\n      ]}",
   'interp':"Le PAS de Samuel est un score pediatrique pour l'appendicite aigue. Score >= 7 de forte valeur predictive positive.",
   'comment':"Valide chez l'enfant de 4-15 ans. Les items leucocytes et neutrophiles doivent etre ajoutes (manuels).",
   'refs':[ref_item('Samuel M. J Pediatr Surg 2002','12395342')]},
  {'slug':'vauthey','name':'Volume hepatique total (Vauthey)','cat':'Foie','evid':'C',
   'desc':'Calcul du volume hepatique total a partir de la surface corporelle selon Vauthey',
   'inputs':[number_input('poids','Poids','kg'),number_input('taille','Taille','cm')],
   'calc':"""    const p = parseFloat(values.poids)||70
    const t = parseFloat(values.taille)||170
    // BSA (Mosteller): sqrt(hauteur(cm) * poids(kg) / 3600)
    const bsa = Math.sqrt(t * p / 3600)
    // Vauthey: Volume foie (cm3) = -794 + 1267 * BSA
    const vol = Math.round(-794 + 1267 * bsa)
    return {value:vol, label: vol + ' cm3', severity:'low',
      ranges:[
        {min:0,max:0,label:'Entrer poids et taille',severity:'low'},
      ]}""",
   'interp':"Volume hepatique total selon Vauthey = -794 + 1267 x BSA. BSA calculee par formule de Mosteller.",
   'comment':"Utilise en chirurgie hepatique pour evaluer le volume du futur foie restant avant hepatectomie. Un futur foie restant < 20-25% est un risque d'insuffisance hepatique post-op.",
   'refs':[ref_item('Vauthey JN et al. Ann Surg 2002','12154341')]},
]

for d in data:
    calc_code = d['calc']
    body = formula_file(d['slug'], d['name'], CHIR, d['cat'], d['desc'], d['evid'], d['inputs'], calc_code, d['interp'], d['comment'], d['refs'])
    write(CHIR, d['slug'], body)
    print('  ' + CHIR + '/' + d['slug'] + '.ts')

# DERMATOLOGIE
DERM = 'dermatologie'
data_derm = [
  {'slug':'braden','name':'Braden (Echelle)','cat':'Escarre','evid':'A',
   'desc':'Echelle de risque d\'escarre (6 sous-echelles, totale 6-23)',
   'inputs':[radio_input('perception','Perception sensorielle',[(1,'Totalement limite'),(2,'Tres limite'),(3,'Legerement limite'),(4,'Normale')]),
radio_input('humidite','Humidite',[(1,'Constamment humide'),(2,'Souvent humide'),(3,'Parfois humide'),(4,'Rarement humide')]),
radio_input('activite','Activite',[(1,'Alite'),(2,'Fauteuil'),(3,'Marche occasionnelle'),(4,'Marche frequente')]),
radio_input('mobilite','Mobilite',[(1,'Completement immobile'),(2,'Tres limitee'),(3,'Legerement limitee'),(4,'Normale')]),
radio_input('nutrition','Nutrition',[(1,'Tres pauvre'),(2,'Probablement insuffisante'),(3,'Adequate'),(4,'Excellente')]),
radio_input('frottement','Frottement / cisaillement',[(1,'Probleme majeur'),(2,'Probleme potentiel'),(3,'Aucun probleme')])],
   'calc':"    const s = (values.perception??4)+(values.humidite??4)+(values.activite??4)+(values.mobilite??4)+(values.nutrition??4)+(values.frottement??3)\n    const sev = s <= 9 ? 'high' : s <= 12 ? 'moderate' : s <= 15 ? 'low' : 'low'\n    const label = s <= 9 ? 'Risque tres eleve' : s <= 12 ? 'Risque eleve' : s <= 15 ? 'Risque modere' : 'Risque faible'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:6,max:9,label:'Tres eleve - Prevention intensive',severity:'high'},\n        {min:10,max:12,label:'Eleve - Matelas + Changements position',severity:'moderate'},\n        {min:13,max:15,label:'Modere - Surveillance + Matelas',severity:'low'},\n        {min:16,max:23,label:'Faible - Prevention standard',severity:'low'},\n      ]}",
   'interp':"L'echelle de Braden evalue le risque d'escarre. Plus le score est bas, plus le risque est eleve. Prevention adaptee au niveau de risque.",
   'comment':"Echelle la plus utilisee en soins infirmiers. Un score <= 12 est associe a un risque eleve justifiant un matelas anti-escarre et des changements de position toutes les 2h.",
   'refs':[ref_item('Bergstrom N et al. Nurs Res 1987','3632864')]},
  {'slug':'cash','name':'CASH (Algorithme)','cat':'Melanome','evid':'C',
   'desc':'Algorithme CASH pour le diagnostic precoce des melanomes (7 items)',
   'inputs':[bool_input('asymetrie','Asymetrie (distribution irreguliere)',1),bool_input('contour','Contour irregulier (bords mal definis)',1),bool_input('couleur','Couleur inhomogene (>= 3 couleurs)',1),bool_input('diametre','Diametre > 6 mm',1),bool_input('evolution','Evolution recente (taille, forme, couleur)',1)],
   'calc':"    const s = (values.asymetrie?1:0)+(values.contour?1:0)+(values.couleur?1:0)+(values.diametre?1:0)+(values.evolution?1:0)\n    const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const label = s < 2 ? 'Naevus benin probable' : s < 3 ? 'Surveillance rapprochee' : 'Melanome suspect - Biopsie excision'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:1,label:'Risque faible de melanome',severity:'low'},\n        {min:2,max:2,label:'Risque intermediaire - Dermatoscopie + surveillance',severity:'moderate'},\n        {min:3,max:5,label:'Risque eleve - Biopsie excision d\'emblee',severity:'high'},\n      ]}",
   'interp':"L'algorithme CASH aide au diagnostic des melanomes. 3 items ou plus = biopsie excision recommandee.",
   'comment':"Utilise en premiere intention par les dermatologues. La dermatoscopie ameliore la specificite. Toute lesion suspecte doit etre biopsiee (exerese totale).",
   'refs':[ref_item('Argenziano G et al. J Am Acad Dermatol 1998','9525466')]},
  {'slug':'dlqi','name':'DLQI (Questionnaire)','cat':'Qualite de vie','evid':'A',
   'desc':'Dermatology Life Quality Index - impact des maladies de peau sur la qualite de vie (10 questions)',
   'inputs':[radio_input('prurit','Prurit / douleur / brulure cutanee',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres fortement')]),
radio_input('gene','Gene / sentiment d\'embarras',[(0,'Non'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres')]),
radio_input('courses','Courses / travail / ecole',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Beaucoup')]),
radio_input('vetements','Choix des vetements',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres fortement')]),
radio_input('social','Vie sociale / loisirs',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres fortement')]),
radio_input('sport','Sport / activites physiques',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres fortement')]),
radio_input('travail_semaine','Travail / etudes (semaine passee)',[(0,'Oui'),(1,'Non - empeche')]),
radio_input('relation','Relation avec le partenaire',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres fortement')]),
radio_input('sexualite','Sexualite',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres fortement')]),
radio_input('traitement','Traitement (contrainte, temps)',[(0,'Pas du tout'),(1,'Un peu'),(2,'Beaucoup'),(3,'Tres fortement')])],
   'calc':"    const scores = [values.prurit??0,values.gene??0,values.courses??0,values.vetements??0,values.social??0,values.sport??0,values.travail_semaine??0,values.relation??0,values.sexualite??0,values.traitement??0]\n    const s = scores.reduce((a,b) => a + (b === true ? 1 : parseInt(b)||0), 0)\n    const sev = s > 20 ? 'high' : s > 10 ? 'moderate' : s > 5 ? 'low' : 'low'\n    const label = s <= 5 ? 'Impact nul a faible' : s <= 10 ? 'Impact modere' : s <= 20 ? 'Impact severe' : 'Impact tres severe'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:5,label:'Aucun ou faible impact',severity:'low'},\n        {min:6,max:10,label:'Impact modere sur la qualite de vie',severity:'low'},\n        {min:11,max:20,label:'Impact severe',severity:'moderate'},\n        {min:21,max:30,label:'Impact tres severe',severity:'high'},\n      ]}",
   'interp':"Le DLQI est le questionnaire de qualite de vie le plus utilise en dermatologie (10 items, score 0-30). Un score > 10 indique un impact significatif.",
   'comment':"Valide dans de nombreuses langues et dermatoses. Utilise pour evaluer l'efficacite des traitements. Un changement de 4 points est cliniquement significatif.",
   'refs':[ref_item('Finlay AY, Khan GK. Clin Exp Dermatol 1994','8033381')]},
  {'slug':'eczemascorad','name':'SCORAD (Eczema)','cat':'Eczema',
   'desc':'SCORAD (SCORing Atopic Dermatitis) - score de severite de la dermatite atopique',
   'evid':'A',
   'inputs':[number_input('extension','Extension (regle des 9)','%'),
radio_input('erytheme','Erytheme',[(0,'Absent'),(1,'Leger'),(2,'Modere'),(3,'Severe')]),
radio_input('oedeme','Oedeme / Papules',[(0,'Absent'),(1,'Leger'),(2,'Modere'),(3,'Severe')]),
radio_input('suintement','Suintement / Croute',[(0,'Absent'),(1,'Leger'),(2,'Modere'),(3,'Severe')]),
radio_input('excoriations','Excoriations',[(0,'Absent'),(1,'Leger'),(2,'Modere'),(3,'Severe')]),
radio_input('lichenification','Lichenification',[(0,'Absent'),(1,'Leger'),(2,'Modere'),(3,'Severe')]),
radio_input('secheresse','Secheresse (hors zone inflammatoire)',[(0,'Absente'),(1,'Legere'),(2,'Moderee'),(3,'Severe')]),
number_input('prurit','Prurit (EVA)','0-10'),
number_input('sommeil','Perte de sommeil (EVA)','0-10')],
   'calc':"""    const ext = parseFloat(values.extension)||0
    const intensite = (parseInt(values.erytheme)||0)+(parseInt(values.oedeme)||0)+(parseInt(values.suintement)||0)+(parseInt(values.excoriations)||0)+(parseInt(values.lichenification)||0)+(parseInt(values.secheresse)||0)
    const subjectif = (parseFloat(values.prurit)||0) + (parseFloat(values.sommeil)||0)
    const scorad = Math.round(ext/5 + 7*intensite/2 + subjectif)
    const sev = scorad >= 50 ? 'high' : scorad >= 25 ? 'moderate' : 'low'
    const label = scorad < 25 ? 'Faible' : scorad < 50 ? 'Modere' : 'Severe'
    return {value:scorad, label, severity: sev,
      ranges:[
        {min:0,max:24,label:'SCORAD faible - Dermocorticoides classe II',severity:'low'},
        {min:25,max:49,label:'SCORAD modere - Traitement adapte a la poussee',severity:'moderate'},
        {min:50,max:103,label:'SCORAD severe - Prise en charge specialisee',severity:'high'},
      ]}""",
   'interp':"Le SCORAD combine l'extension (A), l'intensite (B: 6 items) et le retentissement subjectif (C: prurit + sommeil).",
   'comment':"Score de reference pour l'eczema atopique. Un changement de 10 points est cliniquement significatif. Objectif therapeutique: scorad < 25.",
   'refs':[ref_item('European Task Force on Atopic Dermatitis. Dermatology 1993','8338808')]},
  {'slug':'melascore','name':'Score de menace melanocytaire','cat':'Melanome','evid':'C',
   'desc':'Score clinique de risque de melanome (7 points, items ABCDE)',
   'inputs':[bool_input('asymetrie','Asymetrie',1),bool_input('bords','Bords irreguliers',1),bool_input('couleur','Couleur inhomogene (>= 3 teintes)',1),bool_input('diametre','Diametre > 6 mm',1),bool_input('evolution','Evolution recente (taille, forme, couleur, symptomes)',2),bool_input('facteur_risque','Facteur de risque (phototype clair, coups de soleil, ATCD familial)',1)],
   'calc':"    const s = (values.asymetrie?1:0)+(values.bords?1:0)+(values.couleur?1:0)+(values.diametre?1:0)+(values.evolution?2:0)+(values.facteur_risque?1:0)\n    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'\n    const label = s < 2 ? 'Naevus probablement benin' : s < 4 ? 'Surveillance dermatologique' : 'Biopsie excision recommandee'\n    return {value:s, label, severity: sev,\n      ranges:[\n        {min:0,max:1,label:'Benin - Surveillance simple',severity:'low'},\n        {min:2,max:3,label:'Incertain - Dermatoscopie + surveillance',severity:'moderate'},\n        {min:4,max:7,label:'Suspect - Biopsie excision',severity:'high'},\n      ]}",
   'interp':"Score ABCDE+Facteurs de risque pour le diagnostic du melanome. Le critere 'evolution' est le plus ponderé (2 points).",
   'comment':"ABCDE est un outil de depistage de premiere ligne. La dermatoscopie par un dermatologue entraine ameliore la specificite. Ne pas differer une biopsie devant une lesion suspecte.",
   'refs':[ref_item('Abbasi NR et al. Arch Dermatol 2004','14751776')]},
  {'slug':'phototype_fitzpatrick','name':'Phototype de Fitzpatrick','cat':'Phototype','evid':'C',
   'desc':'Classification des phototypes cutanes selon Fitzpatrick (6 types)',
   'inputs':[radio_input('type','Phototype',[(1,'I - Peau tres claire, rousseur, taches de rousseur - Brule toujours, ne bronze jamais'),(2,'II - Peau claire, cheveux blonds-roux - Brule facilement, bronze difficilement'),(3,'III - Peau claire a moyenne, cheveux chatain - Brule modere, bronze graduellement'),(4,'IV - Peau olive, cheveux bruns - Brule rarement, bronze bien'),(5,'V - Peau brune, cheveux noirs - Brule tres rarement, bronze tres facilement'),(6,'VI - Peau noire, cheveux noirs - Ne brule jamais, pigmentation maximale')])],
   'calc':"    const t = values.type??3\n    const labels = {1:'Phototype I',2:'Phototype II',3:'Phototype III',4:'Phototype IV',5:'Phototype V',6:'Phototype VI'}\n    return {value:t, label:labels[t]||'', severity:'low',\n      ranges:[\n        {min:1,max:2,label:'Phototype I-II - Risque eleve de coup de soleil et melanome',severity:'high'},\n        {min:3,max:4,label:'Phototype III-IV - Risque modere',severity:'moderate'},\n        {min:5,max:6,label:'Phototype V-VI - Risque faible de coup de soleil',severity:'low'},\n      ]}",
   'interp':"Le phototype de Fitzpatrick classifie la peau selon sa reponse au soleil. Les phototypes I-II ont un risque eleve de cancer cutane.",
   'comment':"Utilise pour le risque de cancer cutane et pour determiner les doses en phototherapie. Protection solaire recommandee pour tous les phototypes.",
   'refs':[ref_item('Fitzpatrick TB. Arch Dermatol 1988','3355231')]},
  {'slug':'psoriasis_pasi','name':'Psoriasis PASI (Score)','cat':'Psoriasis','evid':'A',
   'desc':'Psoriasis Area and Severity Index - severite du psoriasis',
   'inputs':[radio_input('tete_erytheme','Tete - Erytheme',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('tete_induration','Tete - Induration',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('tete_desquamation','Tete - Desquamation',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('tete_surface','Tete - Surface atteinte',[(0,'0'),(1,'< 10%'),(2,'10-30%'),(3,'30-50%'),(4,'50-70%'),(5,'70-90%'),(6,'> 90%')]),
radio_input('tronc_erytheme','Tronc - Erytheme',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('tronc_induration','Tronc - Induration',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('tronc_desquamation','Tronc - Desquamation',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('tronc_surface','Tronc - Surface atteinte',[(0,'0'),(1,'< 10%'),(2,'10-30%'),(3,'30-50%'),(4,'50-70%'),(5,'70-90%'),(6,'> 90%')]),
radio_input('ms_erytheme','MS - Erytheme',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('ms_induration','MS - Induration',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('ms_desquamation','MS - Desquamation',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('ms_surface','MS - Surface atteinte',[(0,'0'),(1,'< 10%'),(2,'10-30%'),(3,'30-50%'),(4,'50-70%'),(5,'70-90%'),(6,'> 90%')]),
radio_input('mi_erytheme','MI - Erytheme',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('mi_induration','MI - Induration',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('mi_desquamation','MI - Desquamation',[(0,'0'),(1,'1'),(2,'2'),(3,'3'),(4,'4')]),
radio_input('mi_surface','MI - Surface atteinte',[(0,'0'),(1,'< 10%'),(2,'10-30%'),(3,'30-50%'),(4,'50-70%'),(5,'70-90%'),(6,'> 90%')])],
   'calc':"""    const tete = (parseInt(values.tete_erytheme)||0)+(parseInt(values.tete_induration)||0)+(parseInt(values.tete_desquamation)||0)
    const tronc = (parseInt(values.tronc_erytheme)||0)+(parseInt(values.tronc_induration)||0)+(parseInt(values.tronc_desquamation)||0)
    const ms = (parseInt(values.ms_erytheme)||0)+(parseInt(values.ms_induration)||0)+(parseInt(values.ms_desquamation)||0)
    const mi = (parseInt(values.mi_erytheme)||0)+(parseInt(values.mi_induration)||0)+(parseInt(values.mi_desquamation)||0)
    const s_tete = parseInt(values.tete_surface)||0
    const s_tronc = parseInt(values.tronc_surface)||0
    const s_ms = parseInt(values.ms_surface)||0
    const s_mi = parseInt(values.mi_surface)||0
    const pasi = Math.round((tete * s_tete * 0.1) + (tronc * s_tronc * 0.2) + (ms * s_ms * 0.2) + (mi * s_mi * 0.3) * 10) / 10
    const sev = pasi >= 10 ? 'high' : pasi >= 5 ? 'moderate' : 'low'
    const label = pasi < 5 ? 'Psoriasis leger' : pasi < 10 ? 'Psoriasis modere' : 'Psoriasis severe'
    return {value:pasi, label, severity: sev,
      ranges:[
        {min:0,max:4.9,label:'Psoriasis leger - Traitement topique',severity:'low'},
        {min:5,max:9.9,label:'Psoriasis modere - Phototherapie ou systemique',severity:'moderate'},
        {min:10,max:72,label:'Psoriasis severe - Biotherapie probable',severity:'high'},
      ]}""",
   'interp':"Le PASI (Psoriasis Area and Severity Index) est le score de reference pour evaluer la severite du psoriasis et la reponse au traitement.",
   'comment':"Le PASI combine 4 regions (tete 10%, tronc 30%, MS 20%, MI 40%). Une reduction de 75% (PASI75) est l'objectif therapeutique standard.",
   'refs':[ref_item('Fredriksson T, Pettersson U. Dermatologica 1978','781267')]},
]

for d in data_derm:
    body = formula_file(d['slug'], d['name'], DERM, d['cat'], d['desc'], d['evid'], d['inputs'], d['calc'], d['interp'], d['comment'], d['refs'])
    write(DERM, d['slug'], body)

for d in data:
    print('  ' + CHIR + '/' + d['slug'] + '.ts')
for d in data_derm:
    print('  ' + DERM + '/' + d['slug'] + '.ts')
print('Done! Chirurgie ' + str(len(data)) + ' + Dermatolgie ' + str(len(data_derm)))
