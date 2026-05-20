import type { FormulaDefinition } from '../types'

const nodscore: FormulaDefinition = {
  id: `nodscore`, slug: `nodscore`,
  name: `R-IPI (Revised International Prognostic Index)`,
  specialty: `hematologie`, category: `Lymphome`,
  description: `IPI revise pour les lymphomes B diffus a grandes cellules traites par R-CHOP (3 categories)`,
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
    return {value:s, label:s===0?'Tres bon pronostic (0)':s<=2?'Bon pronostic (1-2)':'Mauvais pronostic (3-5)', severity: s===0?'low':s<=2?'low':'high',
      ranges:[
        {min:0,max:0,label:'Tres bon pronostic (0) - Survie 4ans: 94%',severity:'low'},
        {min:1,max:2,label:'Bon pronostic (1-2) - Survie 4ans: 79-80%',severity:'low'},
        {min:3,max:5,label:'Mauvais pronostic (3-5) - Survie 4ans: 53%',severity:'high'},
      ]}
  },
  interpretation: `Le R-IPI (Revised IPI) a ete developpe pour les patients traites par R-CHOP. Il utilise les memes 5 facteurs que l'IPI mais regroupe les scores en 3 categories:<br/>• 0: Tres bon pronostic (survie sans progression a 4 ans: 94%)<br/>• 1-2: Bon pronostic (80%)<br/>• 3-5: Mauvais pronostic (53%)<br/><br/>Contrairement a l'IPI original qui distinguait 4 categories.`,
  clinicalCommentary: `Le R-IPI est plus simple que l'IPI original (3 vs 4 categories) et mieux adapte a l'ere du rituximab. Le NCCN-IPI (2014) offre une stratification encore plus precise utilisant l'age comme variable continue et le rapport LDH/N.`,
  references: [
    {type:`pubmed`,title:`Sehn LH et al. J Clin Oncol 2007`,pmid:`17369568`},
  ],
}
export default nodscore
