import type { FormulaDefinition } from '../types'

const moore_rate: FormulaDefinition = {
  id: `moore_rate`, slug: `moore_rate`,
  name: `Moore, rate (Classification)`,
  specialty: `chirurgie`, category: `Traumatisme`,
  description: `Classification des traumatismes de la rate selon Moore (grades I-V)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`grade`,type:`radio`,label:`Grade`,options:[{value:1,label:`Grade I - Hematome sous-capsulaire < 10% / plaie capsulaire < 1 cm`},{value:2,label:`Grade II - Hematome sous-capsulaire 10-50% / plaie 1-3 cm`},{value:3,label:`Grade III - Hematome sous-capsulaire > 50% / hematome intra-parenchymateux > 5 cm / plaie > 3 cm`},{value:4,label:`Grade IV - Rupture devascularisante du hile`},{value:5,label:`Grade V - Eclatement de la rate / atteinte vasculaire du hile`}]},
  ],
  calculate: (values) => {
    const g = values.grade??1
    const labels: Record<number, string> = {1:'Grade I - Benin',2:'Grade II - Modere',3:'Grade III - Severe',4:'Grade IV - Critique',5:'Grade V - Catastrophique'}
    const sev = g >= 4 ? 'high' : g >= 3 ? 'moderate' : 'low'
    const prises = {1:'Surveillance',2:'Surveillance / embolisation',3:'Embolisation / chirurgie discutee',4:'Chirurgie probable (splenectomie)',5:'Chirurgie (splenectomie) urgente'}
    return {value:g, label:labels[g]||'', severity: sev,
      ranges:[
        {min:1,max:1,label:'Grade I - Surveillance',severity:'low'},
        {min:2,max:2,label:'Grade II - Surveillance / Embolisation',severity:'low'},
        {min:3,max:3,label:'Grade III - Embolisation / Chirurgie discutee',severity:'moderate'},
        {min:4,max:4,label:'Grade IV - Chirurgie probable',severity:'high'},
        {min:5,max:5,label:'Grade V - Chirurgie urgente',severity:'high'},
      ]}
  },
  interpretation: `Classification de Moore pour les traumatismes spleniques. Grades I-III: traitement conservateur possible. Grades IV-V: splenectomie probable.`,
  clinicalCommentary: `La tendance actuelle est au traitement conservateur (embolisation) pour les grades I-III hemodynamiquement stables. La vaccination anti-pneumococcique est obligatoire apres splenectomie.`,
  references: [
    {type:`pubmed`,title:`Moore EE et al. J Trauma 1989`,pmid:`2709422`}
  ],
}
export default moore_rate
