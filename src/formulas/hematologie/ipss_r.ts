import type { FormulaDefinition } from '../types'

const ipss_r: FormulaDefinition = {
  id: `ipss_r`, slug: `ipss_r`,
  name: `IPSS-R (Revised International Prognostic Scoring System) pour SMD`,
  specialty: `hematologie`, category: `Syndrome Myelodysplasique`,
  description: `Score pronostique revise pour les syndromes myelodysplasiques: blastes, Hb, plaquettes, PNN, cytogenetique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`blastes`,type:`radio`,label:`Blastes medullaires (%)`,options:[
      {value:0,label:`≤ 2%`},{value:1,label:`> 2% - < 5%`},{value:2,label:`5-10%`},{value:3,label:`11-30%`},
    ]},
    {id:`hb`,type:`radio`,label:`Hemoglobine (g/dL)`,options:[
      {value:0,label:`≥ 10`},{value:1,label:`8 - < 10`},{value:1.5,label:`< 8`},
    ]},
    {id:`plaquettes`,type:`radio`,label:`Plaquettes (G/L)`,options:[
      {value:0,label:`≥ 100`},{value:0.5,label:`50 - < 100`},{value:1,label:`< 50`},
    ]},
    {id:`pnn`,type:`radio`,label:`Polynucleaires neutrophiles (G/L)`,options:[
      {value:0,label:`≥ 0.8`},{value:0.5,label:`< 0.8`},
    ]},
    {id:`cytogenetique`,type:`radio`,label:`Cytogenetique (caryotype)`,options:[
      {value:0,label:`Tres bon: -Y, del(11q)`},
      {value:1,label:`Bon: normal, del(5q), del(12p), del(20q), double dont del(5q)`},
      {value:2,label:`Intermediaire: del(7q), +8, +19, i(17q), autres anomalies`},
      {value:3,label:`Mauvais: -7, inv(3)/t(3q)/del(3q), double dont -7/del(7q), caryotype complexe (3 anomalies)`},
      {value:4,label:`Tres mauvais: caryotype complexe (> 3 anomalies)`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.blastes??0)+(values.hb??0)+(values.plaquettes??0)+(values.pnn??0)+(values.cytogenetique??0)
    let label = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    if (s <= 1.5) { label = `Very Low (tres faible risque)`; sev = `low` }
    else if (s <= 3) { label = `Low (faible risque)`; sev = `low` }
    else if (s <= 4.5) { label = `Intermediate (risque intermediaire)`; sev = `moderate` }
    else if (s <= 6) { label = `High (risque eleve)`; sev = `moderate` }
    else { label = `Very High (risque tres eleve)`; sev = `high` }
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:1.5,label:'Very Low',severity:'low'},
        {min:2,max:3,label:'Low',severity:'low'},
        {min:3.5,max:4.5,label:'Intermediate',severity:'moderate'},
        {min:5,max:6,label:'High',severity:'moderate'},
        {min:6.5,max:99,label:'Very High',severity:'high'},
      ]}
  },
  interpretation: `L\'IPSS-R est le score de reference pour le pronostic des SMD. 5 categories:<br/>• Very Low: Survie mediane 8.8 ans, risque AML 0.8% a 5 ans<br/>• Low: Survie 5.3 ans, risque AML 3%<br/>• Intermediate: Survie 3.0 ans, risque AML 10%<br/>• High: Survie 1.6 ans, risque AML 27%<br/>• Very High: Survie 0.8 ans, risque AML 50%`,
  clinicalCommentary: `L\'IPSS-R est la version amelioree de l\'IPSS, integrant des seuils plus precis pour l\'hemoglobine, les plaquettes et les PNN, ainsi qu\'une classification cytogenetique plus detaillee en 5 groupes. Recommande par les guidelines NCCN et ELN pour la prise en charge des SMD.`,
  references: [
    {type:`pubmed`,title:`Greenberg PL et al. Blood 2012`,pmid:`22740453`},
  ],
}
export default ipss_r
