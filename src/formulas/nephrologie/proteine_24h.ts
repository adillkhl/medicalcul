import type { FormulaDefinition } from '../types'

const proteine_24h: FormulaDefinition = {
  id: `proteine_24h`, slug: `proteine_24h`,
  name: `Proteinurie des 24h (Interpretation)`,
  specialty: `nephrologie`, category: `Proteinurie`,
  description: `Interpretation de la proteinurie des 24h`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`proteine`,type:`number`,label:`Proteinurie des 24h`,unit:`g/24h`},
  ],
  calculate: (values) => {
    const p = parseFloat(values.proteine)||0; const arr = Math.round(p * 100) / 100
        const sev = p >= 3.5 ? 'high' : p >= 1 ? 'moderate' : p >= 0.15 ? 'low' : 'low'
        const retval = arr; const retlabel = arr + ' g/24h'; const retsev = sev
        const ranges = [
          {min:0,max:0.14,label:'Normal (< 0.15)',severity:'low' as const},
          {min:0.15,max:0.99,label:'Legere a moderee',severity:'low' as const},
          {min:1,max:3.49,label:'Significative',severity:'moderate' as const},
          {min:3.5,max:999,label:'Syndrome nephrotique',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Proteinurie des 24h: gold standard. > 3.5 g/24h = syndrome nephrotique.`,
  clinicalCommentary: `Rapport proteine/creatinine (RPC) sur echantillon est une alternative.`,
  references: [
    {type:`pubmed`,title:`Peti-Peterdi J, Harris RC. N Engl J Med 2010`,pmid:`20592250`}
  ],
}
export default proteine_24h
