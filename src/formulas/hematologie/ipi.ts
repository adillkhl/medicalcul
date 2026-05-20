import type { FormulaDefinition } from '../types'

const ipi: FormulaDefinition = {
  id: `ipi`, slug: `ipi`,
  name: `IPI (International Prognostic Index)`,
  specialty: `hematologie`, category: `Lymphome`,
  description: `Indice pronostique international pour les lymphomes non hodgkiniens agressifs (5 items)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age`,type:`boolean`,label:`Age > 60 ans`,weight:1},
    {id:`ldh`,type:`boolean`,label:`LDH elevee (> N)`,weight:1},
    {id:`stade`,type:`boolean`,label:`Stade Ann Arbor III ou IV`,weight:1},
    {id:`performance`,type:`boolean`,label:`Performance status ECOG ≥ 2`,weight:1},
    {id:`atteintes`,type:`boolean`,label:`Atteintes extraganglionnaires > 1 site`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.age?1:0)+(values.ldh?1:0)+(values.stade?1:0)+(values.performance?1:0)+(values.atteintes?1:0)
    return {value:s, label:s<=1?'Faible risque':s===2?'Risque faible-intermediaire':s===3?'Risque eleve-intermediaire':'Risque eleve', severity: s<=1?'low':s<=2?'low':s===3?'moderate':'high',
      ranges:[
        {min:0,max:1,label:'Faible risque (0-1)',severity:'low'},
        {min:2,max:2,label:'Risque faible-intermediaire (2)',severity:'low'},
        {min:3,max:3,label:'Risque eleve-intermediaire (3)',severity:'moderate'},
        {min:4,max:5,label:'Risque eleve (4-5)',severity:'high'},
      ]}
  },
  interpretation: `L'IPI est un score pronostique pour les lymphomes non hodgkiniens agressifs (notamment LBDGC). 5 facteurs de risque: age > 60, LDH > N, stade III/IV, ECOG ≥ 2, atteintes extraganglionnaires > 1. Score 0-5. Prediction de la survie globale a 5 ans: 73% (0-1), 51% (2), 43% (3), 26% (4-5).`,
  clinicalCommentary: `L'IPI reste valide meme apres l'introduction du rituximab. Le R-IPI est une adaptation pour les patients traites par R-CHOP. Le NCCN-IPI est plus recent et affine le score en utilisant les valeurs continues de LDH et l'age precise.`,
  references: [
    {type:`pubmed`,title:`A predictive model for aggressive NHL. N Engl J Med 1993`,pmid:`8415284`},
  ],
}
export default ipi
