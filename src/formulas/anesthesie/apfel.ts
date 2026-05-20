import type { FormulaDefinition } from '../types'

const apfel: FormulaDefinition = {
  id: `apfel`, slug: `apfel`,
  name: `Apfel (Score)`,
  specialty: `anesthesie`, category: `Nausees post-op`,
  description: `Prediction de nausees-vomissements postoperatoires (NVPO)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`femme`,type:`boolean`,label:`Sexe feminin`,weight:1},
    {id:`tabac`,type:`boolean`,label:`Non-fumeur`,weight:1},
    {id:`atcd_nvpo`,type:`boolean`,label:`Antecedent de NVPO / cinetose`,weight:1},
    {id:`opiacés`,type:`boolean`,label:`Opiaces post-operatoires`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.femme?1:0)+(values.tabac?1:0)+(values.atcd_nvpo?1:0)+(values.opiacés?1:0)
    const risks = [10,21,39,61,79]
    const sev = s>=3?'high':s>=2?'moderate':'low'
    const label = s === 0 ? 'Risque faible' : s <= 2 ? 'Risque modere' : 'Risque eleve'
    return {value:s, label, risk:risks[s]||79, riskUnit:'% NVPO', severity: sev,
      ranges:[
      {min:0,max:0,label:`0 facteur - 10%`,severity:`low`},
      {min:1,max:1,label:`1 facteur - 21%`,severity:`low`},
      {min:2,max:2,label:`2 facteurs - 39%`,severity:`moderate`},
      {min:3,max:3,label:`3 facteurs - 61%`,severity:`high`},
      {min:4,max:4,label:`4 facteurs - 79%`,severity:`high`},
      ]}
  },
  interpretation: `Le score d\'Apfel predit le risque de NVPO. Chaque facteur = 1 point. Prophylaxie antiemetique adaptee.`,
  clinicalCommentary: `Score le plus utilise en SSPI. Une prophylaxie a 2 ou 3 agents est recommandee si >= 3 facteurs.`,
  references: [
    {type:`pubmed`,title:`Apfel CC et al. Anesthesiology 1999`,pmid:`10485781`}
  ],
}
export default apfel
