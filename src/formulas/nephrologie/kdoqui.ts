import type { FormulaDefinition } from '../types'

const kdoqui: FormulaDefinition = {
  id: `kdoqui`, slug: `kdoqui`,
  name: `KDOQI (Classification IRC)`,
  specialty: `nephrologie`, category: `IRC`,
  description: `Classification KDOQI/KDIGO des stades d\'insuffisance renale chronique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`dfg`,type:`number`,label:`DFG`,unit:`mL/min/1.73m2`},
    {id:`albuminurie`,type:`radio`,label:`Albuminurie (RAC)`,options:[{value:0,label:`A1 - Normal (< 3)`},{value:1,label:`A2 - Microalbuminurie (3-30)`},{value:2,label:`A3 - Macroalbuminurie (>= 30)`}]},
  ],
  calculate: (values) => {
    const dfg = parseFloat(values.dfg)||100; const alb = parseInt(values.albuminurie)||0
        let stade = ''
        if (dfg >= 90) stade = 'G1'; else if (dfg >= 60) stade = 'G2'
        else if (dfg >= 45) stade = 'G3a'; else if (dfg >= 30) stade = 'G3b'
        else if (dfg >= 15) stade = 'G4'; else stade = 'G5'
        const risque = dfg <= 44 || alb >= 2 ? 'high' : dfg <= 59 || alb >= 1 ? 'moderate' : 'low'
        const retval = parseInt(stade.replace('G','').replace('a','').replace('b','')||'1'); const retlabel = stade + 'A' + (alb+1); const retsev = risque
        const ranges = [
          {min:90,max:999,label:'G1 - Normal',severity:'low' as const},
          {min:60,max:89,label:'G2 - Leger',severity:'low' as const},
          {min:45,max:59,label:'G3a - Modere',severity:'moderate' as const},
          {min:30,max:44,label:'G3b - Modere-severe',severity:'moderate' as const},
          {min:15,max:29,label:'G4 - Severe',severity:'high' as const},
          {min:0,max:14,label:'G5 - Terminal',severity:'critical' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Classification KDIGO 2012 combine DFG (G1-G5) et albuminurie (A1-A3).`,
  clinicalCommentary: `Patients G3aA2 ou plus doivent etre adresses au nephrologue.`,
  references: [
    {type:`pubmed`,title:`KDIGO. Kidney Int 2013`,pmid:`---`}
  ],
}
export default kdoqui
