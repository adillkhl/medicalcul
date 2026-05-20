import type { FormulaDefinition } from '../types'

const saps3: FormulaDefinition = {
  id: `saps3`, slug: `saps3`,
  name: `SAPS 3 (Simplified Acute Physiology Score 3)`,
  specialty: `reanimation`, category: `Gravite`,
  description: `Score pronostique de mortalite en reanimation integrant des donnees physiologiques, l'age, les comorbidites et le contexte d'admission`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age`,type:`radio`,label:`Age`,options:[{value:0,label:`< 40 ans`},{value:5,label:`40-59 ans`},{value:9,label:`60-69 ans`},{value:13,label:`70-79 ans`},{value:16,label:`>= 80 ans`}]},
    {id:`origine`,type:`radio`,label:`Provenance avant admission`,options:[{value:0,label:`Domicile`},{value:5,label:`Salle de réveil / SSPI`},{value:8,label:`Salle d'urgence`},{value:14,label:`Autre hopital / autre service`}]},
    {id:`chirurgie`,type:`radio`,label:`Type de chirurgie (si applicable)`,options:[{value:0,label:`Pas de chirurgie`},{value:5,label:`Chirurgie programmee`},{value:8,label:`Chirurgie urgente`}]},
    {id:`comorbidite`,type:`radio`,label:`Comorbidites chroniques`,options:[{value:0,label:`Aucune`},{value:6,label:`Cancer metastatique`},{value:8,label:`Hemopathie maligne`},{value:11,label:`Cancer avec greffe de moelle`},{value:8,label:`Cirrhose`},{value:5,label:`Insuffisance cardiaque chronique (NYHA IV)`},{value:5,label:`Insuffisance renale chronique`},{value:8,label:`Immunodepression`}]},
    {id:`pam`,type:`radio`,label:`PAM la plus basse (mmHg)`,options:[{value:0,label:`>= 70`},{value:4,label:`50-69`},{value:7,label:`< 50`}]},
    {id:`pao2_fio2`,type:`radio`,label:`PaO2/FiO2 (mmHg) - si ventilation`,options:[{value:0,label:`>= 200`},{value:6,label:`100-199`},{value:9,label:`< 100`}]},
    {id:`bilirubine`,type:`radio`,label:`Bilirubine (mg/dL)`,options:[{value:0,label:`< 2`},{value:4,label:`2-5.9`},{value:7,label:`>= 6`}]},
    {id:`creatinine`,type:`radio`,label:`Creatinine (mg/dL)`,options:[{value:0,label:`< 1.2`},{value:3,label:`1.2-1.9`},{value:7,label:`2-3.4`},{value:11,label:`>= 3.5`}]},
    {id:`ph_arteriel`,type:`radio`,label:`pH arteriel (ou lactates)`,options:[{value:0,label:`>= 7.25`},{value:8,label:`< 7.25`}]},
    {id:`plaquettes`,type:`radio`,label:`Plaquettes (x1000/mm3)`,options:[{value:0,label:`>= 50`},{value:7,label:`< 50`}]},
    {id:`neurologique`,type:`radio`,label:`Neurologique - Glasgow (avant sedation)`,options:[{value:0,label:`GCS 15`},{value:9,label:`GCS 10-14`},{value:15,label:`GCS 3-9`}]},
  ],
  calculate: (values) => {
    const items = ['age','origine','chirurgie','comorbidite','pam','pao2_fio2','bilirubine','creatinine','ph_arteriel','plaquettes','neurologique']
    const total = items.reduce((acc,id) => acc + (values[id]??0), 0)
    const mortalite_predite = total < 40 ? 2 : total < 50 ? 5 : total < 60 ? 10 : total < 70 ? 20 : total < 80 ? 35 : total < 90 ? 50 : total < 100 ? 65 : total < 110 ? 80 : 90
    const sev = total >= 70 ? 'high' as const : total >= 50 ? 'moderate' as const : 'low' as const
    return {value:total, label:`SAPS 3 ${total}`, severity: sev,
      details:{mortalite_estimee:`${mortalite_predite}%`},
      ranges:[
        {min:0,max:39,label:`Gravite faible`,severity:'low'},
        {min:40,max:49,label:`Gravite legere`,severity:'low'},
        {min:50,max:59,label:`Gravite moderee`,severity:'moderate'},
        {min:60,max:69,label:`Gravite moderee a severe`,severity:'moderate'},
        {min:70,max:79,label:`Gravite severe`,severity:'high'},
        {min:80,max:99,label:`Gravite tres severe`,severity:'high'},
        {min:100,max:200,label:`Gravite extreme`,severity:'high'},
      ]}
  },
  interpretation: `Le SAPS 3 est un score pronostique de mortalite en reanimation, developpe par une cohorte internationale multicentrique. Il inclut l'age, les comorbidites, le contexte d'admission et des variables physiologiques (PAM, PaO2/FiO2, bilirubine, creatinine, pH, plaquettes, Glasgow).`,
  clinicalCommentary: `Plus recent que l'APACHE II et mieux calibre. Ne necessite pas de donnees sur les premières 24h - seules les pires valeurs des 1h avant et 1h apres l'admission sont requises. Calibration superieure a l'APACHE II pour la prediction de mortalite. Utile pour l'ajustement du risque dans les comparaisons entre services.`,
  references: [
    {type:`pubmed`,title:`Moreno RP et al. SAPS 3 - From evaluation of the patient to evaluation of the ICU. Intensive Care Med 2005`,pmid:`16132892`},
    {type:`pubmed`,title:`Metnitz PG et al. SAPS 3 admission score. Intensive Care Med 2005`,pmid:`16132893`},
  ],
}
export default saps3
