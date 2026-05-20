import type { FormulaDefinition } from '../types'

const rituximab_ipi: FormulaDefinition = {
  id: `rituximab_ipi`, slug: `rituximab_ipi`,
  name: `R-IPI (IPI avec Rituximab - 3 categories)`,
  specialty: `hematologie`, category: `Lymphome`,
  description: `IPI revise pour patients traites par immunochimiotherapie incluant le rituximab (3 categories pronostiques)`,
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
    let label = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    if (s === 0) { label = `Tres bon (0) - Survie sans progression 4 ans: 94%`; sev = `low` }
    else if (s <= 2) { label = `Bon (1-2) - SSP 4 ans: 80%`; sev = `low` }
    else { label = `Mauvais (3-5) - SSP 4 ans: 53%`; sev = `high` }
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:0,label:'Tres bon pronostic (0)',severity:'low'},
        {min:1,max:2,label:'Bon pronostic (1-2)',severity:'low'},
        {min:3,max:5,label:'Mauvais pronostic (3-5)',severity:'high'},
      ]}
  },
  interpretation: `Le R-IPI est une simplification de l'IPI pour les patients traites par R-CHOP (rituximab + cyclophosphamide, doxorubicine, vincristine, prednisone). Les 5 facteurs sont identiques a l'IPI classique mais la categorisation en 3 groupes reflete mieux le pronostic des patients traites avec rituximab.`,
  clinicalCommentary: `Le R-IPI reste le score le plus utilise en pratique clinique pour les LBDGC. Le NCCN-IPI offre une discrimination plus fine mais est plus complexe. L'IPI et le R-IPI ne tiennent pas compte de la biologie moleculaire (Double/Triple Hit, sous-types ABC/GCB).`,
  references: [
    {type:`pubmed`,title:`Sehn LH et al. J Clin Oncol 2007`,pmid:`17369568`},
  ],
}
export default rituximab_ipi
