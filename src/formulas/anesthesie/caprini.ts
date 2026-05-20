import type { FormulaDefinition } from '../types'

const caprini: FormulaDefinition = {
  id: `caprini`, slug: `caprini`,
  name: `Caprini v.2005 (Score)`,
  specialty: `anesthesie`, category: `Risque thromboembolique`,
  description: `Risque embolique post-operatoire (version 2005)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age`,type:`radio`,label:`Age`,options:[{value:1,label:`41-60 ans`},{value:2,label:`61-74 ans`},{value:3,label:`>= 75 ans`}]},
    {id:`chirurgie`,type:`radio`,label:`Type chirurgie`,options:[{value:1,label:`< 45 min`},{value:2,label:`> 45 min`},{value:3,label:`Laparoscopique > 45 min`}]},
    {id:`cancer`,type:`boolean`,label:`Cancer actif / metastases`,weight:2},
    {id:`atcd_mte`,type:`boolean`,label:`ATCD MTEV personnel`,weight:3},
    {id:`obesite`,type:`boolean`,label:`IMC > 25`,weight:1},
    {id:`grossesse`,type:`boolean`,label:`Grossesse / post-partum`,weight:1},
    {id:`contraception`,type:`boolean`,label:`Contraception hormonale`,weight:1},
    {id:`alitement`,type:`boolean`,label:`Alitement > 72h`,weight:2},
    {id:`varices`,type:`boolean`,label:`Varices / oedeme jambes`,weight:1},
    {id:`thrombophilie`,type:`boolean`,label:`Thrombophilie connue`,weight:3},
  ],
  calculate: (values) => {
    const s = (values.age??0)+(values.chirurgie??0)+(values.cancer?2:0)+(values.atcd_mte?3:0)+(values.obesite?1:0)+(values.grossesse?1:0)+(values.contraception?1:0)+(values.alitement?2:0)+(values.varices?1:0)+(values.thrombophilie?3:0)
    const sev = s>=7?'high':s>=5?'moderate':'low'
    const label = s < 3 ? 'Faible' : s < 5 ? 'Modere' : s < 7 ? 'Eleve' : 'Tres eleve'
    return {value:s, label, severity: sev,
      ranges:[
      {min:0,max:2,label:`Faible - Pas de prophylaxie`,severity:`low`},
      {min:3,max:4,label:`Modere - HBPM`,severity:`low`},
      {min:5,max:6,label:`Eleve - HBPM`,severity:`moderate`},
      {min:7,max:999,label:`Tres eleve - HBPM + contention`,severity:`high`},
      ]}
  },
  interpretation: `Le score de Caprini estime le risque thromboembolique post-operatoire et guide la prophylaxie.`,
  clinicalCommentary: `Utilise en chirurgie generale et orthopedique. Adapter la prophylaxie selon le risque hemorragique.`,
  references: [
    {type:`pubmed`,title:`Caprini JA et al. Dis Mon 2005`,pmid:`15900263`}
  ],
}
export default caprini
