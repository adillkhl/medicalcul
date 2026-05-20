import type { FormulaDefinition } from '../types'

const albumine_creatinine_ratio: FormulaDefinition = {
  id: `albumine_creatinine_ratio`, slug: `albumine_creatinine_ratio`,
  name: `Rapport albuminurie/creatininurie (RAC)`,
  specialty: `nephrologie`, category: `Proteinurie`,
  description: `Interpretation du rapport albuminurie sur creatininurie sur echantillon`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`albuminurie`,type:`number`,label:`Albuminurie`,unit:`mg/L`},
    {id:`creatininurie`,type:`number`,label:`Creatininurie`,unit:`mmol/L`},
  ],
  calculate: (values) => {
    const alb = parseFloat(values.albuminurie)||0; const creat = parseFloat(values.creatininurie)||1
        const rac = alb / creat; const arr = Math.round(rac * 100) / 100
        const sev = rac >= 30 ? 'high' : rac >= 3 ? 'moderate' : 'low'
        const retval = arr; const retlabel = arr + ' mg/mmol'; const retsev = sev
        const ranges = [
          {min:0,max:2.9,label:'Normal (< 3 mg/mmol)',severity:'low' as const},
          {min:3,max:29.9,label:'Microalbuminurie (3-30)',severity:'moderate' as const},
          {min:30,max:999,label:'Macroalbuminurie (>= 30)',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le RAC (albumine/creatinine) sur echantillon est le marqueur de reference de l\'atteinte renale.`,
  clinicalCommentary: `Marqueur precoce de nephropathie diabetique et de risque CV. Dosage sur echantillon aussi fiable que 24h.`,
  references: [
    {type:`pubmed`,title:`KDIGO. Kidney Int 2013`,pmid:`---`}
  ],
}
export default albumine_creatinine_ratio
