import type { FormulaDefinition } from '../types'

const nephrocalcinose: FormulaDefinition = {
  id: `nephrocalcinose`, slug: `nephrocalcinose`,
  name: `Nephrocalcinose (Diagnostic)`,
  specialty: `nephrologie`, category: `Calcium`,
  description: `Classification et diagnostic de la nephrocalcinose`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`hypercalcemie`,type:`boolean`,label:`Hypercalcemie`,weight:1},
    {id:`hypercalciurie`,type:`boolean`,label:`Hypercalciurie`,weight:1},
    {id:`tca`,type:`boolean`,label:`TCA allonge / ATCD familial`,weight:1},
    {id:`nephrolithiase`,type:`boolean`,label:`Nephrolithiase recidivante`,weight:1},
    {id:`tubulopathie`,type:`boolean`,label:`Tubulopathie proximale`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.hypercalcemie?1:0)+(values.hypercalciurie?1:0)+(values.tca?1:0)+(values.nephrolithiase?1:0)+(values.tubulopathie?1:0)
        const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const retval = s; const retlabel = 'Score: ' + s; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Surveillance',severity:'low' as const},
          {min:2,max:2,label:'Explorer calcium/phos',severity:'moderate' as const},
          {min:3,max:5,label:'Bilan nephrologique',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Nephrocalcinose: calcification renale diffuse. Causes: hyperparathyroidie, ATR, hyperoxalurie.`,
  clinicalCommentary: `Diagnostic par echo (hyperechogenicite) ou scanner. Bilan etiologique systematique.`,
  references: [
    {type:`pubmed`,title:`Wrong O. Nephrol Dial Transplant 1996`,pmid:`8649642`}
  ],
}
export default nephrocalcinose
