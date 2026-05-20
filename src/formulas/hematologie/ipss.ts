import type { FormulaDefinition } from '../types'

const ipss: FormulaDefinition = {
  id: `ipss`, slug: `ipss`,
  name: `IPSS (International Prognostic Scoring System) pour SMD`,
  specialty: `hematologie`, category: `Syndrome Myelodysplasique`,
  description: `Indice pronostique international pour les syndromes myelodysplasiques (blastes, cytopenies, cytogenetique)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`blastes`,type:`radio`,label:`Blastes medullaires (%)`,options:[
      {value:0,label:`< 5%`},{value:0.5,label:`5-10%`},{value:1.5,label:`11-20%`},{value:2,label:`21-30%`},
    ]},
    {id:`cytopenies`,type:`radio`,label:`Nombre de cytopenies (Hb < 10, PNN < 1800, Plaquettes < 100000)`,options:[
      {value:0,label:`0 ou 1 cytopenie`},{value:0.5,label:`2 ou 3 cytopenies`},
    ]},
    {id:`cytogenetique`,type:`radio`,label:`Cytogenetique (caryotype)`,options:[
      {value:0,label:`Bon pronostic: normal, -Y, del(5q), del(20q)`},
      {value:0.5,label:`Pronostic intermediaire: autres anomalies`},
      {value:1,label:`Mauvais pronostic: monosomie 7, anomalies du 3, caryotype complexe (≥ 3 anomalies)`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.blastes??0)+(values.cytopenies??0)+(values.cytogenetique??0)
    return {value:s, label:s<=1?'Faible risque (Low)':s<=1.5?'Risque intermediaire-1 (Int-1)':s<=2?'Risque intermediaire-2 (Int-2)':'Risque eleve (High)', severity: s<=1?'low':s<=1.5?'moderate':s<=2?'moderate':'high',
      ranges:[
        {min:0,max:1,label:'Low (faible risque)',severity:'low'},
        {min:1.5,max:1.5,label:'Int-1 (intermediaire-1)',severity:'low'},
        {min:2,max:2,label:'Int-2 (intermediaire-2)',severity:'moderate'},
        {min:2.5,max:99,label:'High (risque eleve)',severity:'high'},
      ]}
  },
  interpretation: `L'IPPS classe les SMD en 4 categories pronostiques:<br/>• Low (0-1): Survie mediane 5.7 ans, risque de transformation AML 5% a 5ans<br/>• Int-1 (1.5): Survie mediane 3.5 ans, risque AML 25%<br/>• Int-2 (2-2.5): Survie mediane 1.2 ans, risque AML 33%<br/>• High (≥3): Survie mediane 0.4 ans, risque AML > 50%`,
  clinicalCommentary: `L'IPSS a ete largement remplace par l'IPSS-R (revise) qui offre une meilleure stratification. Cependant, l'IPSS historique reste reference dans de nombreuses etudes et guidelines. Ne s'applique pas aux SMD de l'enfant. Necessite un caryotype medullaire de bonne qualite.`,
  references: [
    {type:`pubmed`,title:`Greenberg P et al. Blood 1997`,pmid:`9028325`},
  ],
}
export default ipss
