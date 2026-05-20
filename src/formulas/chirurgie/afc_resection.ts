import type { FormulaDefinition } from '../types'

const afc_resection: FormulaDefinition = {
  id: `afc_resection`, slug: `afc_resection`,
  name: `AFC, resection colorectale (Score)`,
  specialty: `chirurgie`, category: `Resection`,
  description: `Risque operatoire de resection colorectale selon l\'Association Francaise de Chirurgie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`denutrition`,type:`boolean`,label:`Denutrition (albumine < 30, perte poids > 10%)`,weight:1},
    {id:`neuro`,type:`boolean`,label:`ATCD neurologique`,weight:1},
    {id:`cardio`,type:`boolean`,label:`Insuffisance cardiaque / coronaropathie`,weight:1},
    {id:`respiratoire`,type:`boolean`,label:`Insuffisance respiratoire chronique`,weight:1},
    {id:`renale`,type:`boolean`,label:`Insuffisance renale chronique (creatinine > 150)`,weight:1},
    {id:`age`,type:`radio`,label:`Age`,options:[{value:0,label:`< 65 ans`},{value:1,label:`65-75 ans`},{value:2,label:`> 75 ans`}]},
    {id:`urgence`,type:`boolean`,label:`Intervention en urgence`,weight:2},
  ],
  calculate: (values) => {
    const s = (values.denutrition?1:0)+(values.neuro?1:0)+(values.cardio?1:0)+(values.respiratoire?1:0)+(values.renale?1:0)+(values.age??0)+(values.urgence?2:0)
    const sev = s>=4?'high':s>=2?'moderate':'low'
    const label = s < 2 ? 'Risque faible' : s < 4 ? 'Risque modere' : 'Risque eleve'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:1,label:'Risque faible',severity:'low'},
        {min:2,max:3,label:'Risque modere - Optimisation pre-op',severity:'moderate'},
        {min:4,max:999,label:'Risque eleve - Discuter rapport benefice/risque',severity:'high'},
      ]}
  },
  interpretation: `Score AFC pour le risque operatoire de resection colorectale combine les comorbidites et l\'urgence.`,
  clinicalCommentary: `Developpe par l\'Association Francaise de Chirurgie. Une optimisation pre-operatoire (nutritionnelle, cardiologique) peut reduire le risque.`,
  references: [
    {type:`pubmed`,title:`Alves A et al. Ann Surg 2007`,pmid:`17291951`}
  ],
}
export default afc_resection
