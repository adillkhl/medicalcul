import type { FormulaDefinition } from '../types'

const lods: FormulaDefinition = {
  id: `lods`, slug: `lods`,
  name: `LODS (Logistic Organ Dysfunction System)`,
  specialty: `reanimation`, category: `Gravite`,
  description: `Score d\'evaluation des dysfonctions d\'organe en reanimation (6 organes, pondere par la severite)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`neurologique`,type:`radio`,label:`Neurologique - Glasgow`,options:[{value:0,label:`15`},{value:1,label:`12-14`},{value:3,label:`9-11`},{value:5,label:`6-8`},{value:5,label:`3-5`}]},
    {id:`cardiovasculaire`,type:`radio`,label:`Cardiovasculaire - FC ou PA`,options:[{value:0,label:`FC 30-139 et PAS >= 90`},{value:1,label:`FC < 30 ou >= 140`},{value:3,label:`PAS 70-89`},{value:5,label:`PAS < 70`},{value:5,label:`PAS < 70 + FC >= 140`}]},
    {id:`renal`,type:`radio`,label:`Renal - Creatinine (mg/dL) ou uree`,options:[{value:0,label:`Crea < 1.2`},{value:1,label:`Crea 1.2-2.0`},{value:3,label:`Crea 2.1-3.4`},{value:3,label:`Crea >= 3.5 ou uree > 100`},{value:5,label:`Crea >= 3.5 avec oligurie`}]},
    {id:`respiratoire`,type:`radio`,label:`Respiratoire - PaO2/FiO2 (mmHg)`,options:[{value:0,label:`>= 250`},{value:1,label:`150-249`},{value:3,label:`75-149`},{value:5,label:`< 75`}]},
    {id:`coagulation`,type:`radio`,label:`Coagulation - Plaquettes (x1000/mm3) ou autres`,options:[{value:0,label:`>= 100`},{value:1,label:`50-99`},{value:3,label:`20-49`},{value:5,label:`< 20`}]},
    {id:`hepatique`,type:`radio`,label:`Hepatique - Bilirubine (mg/dL) ou temps de Quick`,options:[{value:0,label:`Bili < 2 et TQ > 60%`},{value:1,label:`Bili 2-5 ou TQ 30-60%`},{value:3,label:`Bili 5.1-10 ou TQ 15-29%`},{value:5,label:`Bili > 10 ou TQ < 15%`}]},
  ],
  calculate: (values) => {
    const items = ['neurologique','cardiovasculaire','renal','respiratoire','coagulation','hepatique']
    const total = items.reduce((acc,id) => acc + (values[id]??0), 0)
    const sev = total >= 10 ? 'high' as const : total >= 5 ? 'moderate' as const : 'low' as const
    return {value:total, label:`LODS ${total}/30`, severity: sev,
      details:{neurologique:values.neurologique??0,cardiovasculaire:values.cardiovasculaire??0,renal:values.renal??0,respiratoire:values.respiratoire??0,coagulation:values.coagulation??0,hepatique:values.hepatique??0},
      ranges:[
        {min:0,max:4,label:`Dysfonction legere`,severity:'low',recommendation:`Surveillance. Support d\'organe minimal.`},
        {min:5,max:9,label:`Dysfonction moderee`,severity:'moderate',recommendation:`Support d\'organe (ventilation, amines, epuration). Surveillance rapprochee.`},
        {min:10,max:14,label:`Dysfonction severe`,severity:'high',recommendation:`Defaillance multi-organe. Reanimation agressive. Pronostic reserve.`},
        {min:15,max:30,label:`Dysfonction multi-viscérale critique`,severity:'high',recommendation:`Pronostic sombre. Support multi-viscéral maximal.`},
      ]}
  },
  interpretation: `Le LODS est un score de dysfonction d\'organe cree pour mieux ponderer la severite des atteintes. Chacun des 6 organes (neurologique, cardiovasculaire, renal, respiratoire, coagulation, hepatique) est cote de 0 a 5 selon la severite.`,
  clinicalCommentary: `Developpe par Le Gall et al. (1996). Plus complexe que le SOFA mais meilleure discrimination pour les dysfonctions severes. Utilise principalement dans les etudes et les scores composites. Repond a la meme logique que le SOFA mais avec une ponderation plus fine. LODS 0 = pas de dysfonction, LODS 15+ = defaillance multi-viscérale.`,
  references: [
    {type:`pubmed`,title:`Le Gall JR et al. The Logistic Organ Dysfunction system. JAMA 1996`,pmid:`8690912`},
  ],
}
export default lods
