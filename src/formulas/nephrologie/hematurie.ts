import type { FormulaDefinition } from '../types'

const hematurie: FormulaDefinition = {
  id: `hematurie`, slug: `hematurie`,
  name: `Hematurie (Diagnostic)`,
  specialty: `nephrologie`, category: `Diagnostic`,
  description: `Classification et prise en charge de l'hematurie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`franche`,type:`radio`,label:`Hematurie`,options:[{value:0,label:`Microscopique (>= 3 GR/champ)`},{value:1,label:`Macroscopique visible`}]},
    {id:`douleur`,type:`boolean`,label:`Douleur lombaire`,weight:1},
    {id:`age40`,type:`boolean`,label:`Age > 40 ans`,weight:1},
    {id:`tabac`,type:`boolean`,label:`Tabagisme`,weight:1},
    {id:`atcd_urologique`,type:`boolean`,label:`ATCD urologique/familial`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.franche?1:0)+(values.douleur?1:0)+(values.age40?1:0)+(values.tabac?1:0)+(values.atcd_urologique?1:0)
        const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const retval = s; const retlabel = 'Score: ' + s; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Surveillance',severity:'low' as const},
          {min:2,max:2,label:'Echo + cytologie',severity:'moderate' as const},
          {min:3,max:5,label:'Cystoscopie + TDM uro',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'hematurie microscopique (>= 3 GR/champ) ou macroscopique necessite un bilan urologique systematique si > 40 ans ou tabagique.`,
  clinicalCommentary: `5% des hematuries microscopiques asymptomatiques revelent un cancer urologique.`,
  references: [
    {type:`pubmed`,title:`Grossfeld GD et al. J Urol 2001`,pmid:`11293735`}
  ],
}
export default hematurie
