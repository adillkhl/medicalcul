import type { FormulaDefinition } from '../types'

const chad: FormulaDefinition = {
  id: `chad`, slug: `chad`,
  name: `CHADS2 Score (Risque Embolique dans la Fibrillation Atriale)`,
  specialty: `hematologie`, category: `Thrombose`,
  description: `Score de risque d'accident vasculaire cerebral chez les patients en fibrillation atriale non valvulaire`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`insuf_card`,type:`boolean`,label:`Insuffisance cardiaque (IC)`,weight:1},
    {id:`hta`,type:`boolean`,label:`Hypertension arterielle (HTA)`,weight:1},
    {id:`age`,type:`boolean`,label:`Age ≥ 75 ans`,weight:1},
    {id:`diabete`,type:`boolean`,label:`Diabete (DM)`,weight:1},
    {id:`avc`,type:`boolean`,label:`Antecedent d'AVC ou AIT (Stroke - pondere x2)`,weight:2},
  ],
  calculate: (values) => {
    const s = (values.insuf_card?1:0)+(values.hta?1:0)+(values.age?1:0)+(values.diabete?1:0)+(values.avc?2:0)
    return {value:s, label:s === 0 ? 'Risque faible' : s === 1 ? 'Risque modere' : 'Risque eleve', severity: s === 0 ? 'low' : s === 1 ? 'moderate' : 'high',
      ranges:[
        {min:0,max:0,label:'Risque faible - ASA ou aucun traitement',severity:'low'},
        {min:1,max:1,label:'Risque modere - AOD ou AVK a discuter',severity:'moderate'},
        {min:2,max:6,label:'Risque eleve - AOD ou AVK recommande',severity:'high'},
      ]}
  },
  interpretation: `Le score CHADS2 estime le risque thromboembolique annuel dans la FA non valvulaire:<br/>• Score 0: Risque faible (AVC 1.9%/an) - Pas d'anticoagulation<br/>• Score 1: Risque modere (2.8%/an) - AOD/AVK a discuter selon risque hemorragique<br/>• Score 2: Risque eleve (4.0%/an) - Anticoagulation recommandee<br/>• Score 3: 5.9%/an<br/>• Score 4: 8.5%/an<br/>• Score 5: 12.5%/an<br/>• Score 6: 18.2%/an`,
  clinicalCommentary: `Le CHADS2 a ete largement remplace par le CHA2DS2-VASc qui offre une meilleure discrimination notamment pour les scores faibles (0-1). Le CHADS2 reste utilise pour sa simplicite. Toujours evaluer le risque hemorragique (HAS-BLED) avant d'initier une anticoagulation. Les AODs sont preferes aux AVK dans la FA non valvulaire.`,
  references: [
    {type:`pubmed`,title:`Gage BF et al. JAMA 2001`,pmid:`11368736`},
  ],
}
export default chad
