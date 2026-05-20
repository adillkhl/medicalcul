import type { FormulaDefinition } from '../types'

const cpk: FormulaDefinition = {
  id: `cpk`, slug: `cpk`,
  name: `CPK (Interpretation)`,
  specialty: `divers`, category: `Muscle`,
  description: `Interpretation des CPK elevees`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`cpk`,type:`number`,label:`CPK totales`,unit:`U/L`},
    {id:`douleur`,type:`boolean`,label:`Douleur/faiblesse`,weight:1},
    {id:`urines`,type:`boolean`,label:`Urines foncees`,weight:1},
  ],
  calculate: (values) => {
    const cpk = parseFloat(values.cpk)||0; let sev = 'low'; let label = 'CPK ' + cpk
        if (cpk > 5000) { sev = 'high'; label += ' - Rhabdomyolyse massive - Hydratation IV' }
        else if (cpk > 1000) { sev = 'high'; label += ' - Rhabdomyolyse' }
        else if (cpk > 300) { sev = 'moderate'; label += ' - Elevees' }
        else { label += ' - Normales' }
        if (values.urines) label += ' + Myoglobinurie - Risque IRA'
        const retval = cpk; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:170,label:'Normales',severity:'low' as const},{min:171,max:500,label:'Elevees',severity:'low' as const},{min:501,max:5000,label:'Rhabdomyolyse',severity:'moderate' as const},{min:5001,max:999999,label:'Rhabdomyolyse massive',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Rhabdomyolyse (CPK > 1000) peut entrainer une IRA par myoglobinurie.`,
  clinicalCommentary: `Hydratation IV, alcalinisation si CPK > 5000, surveillance K+ et creatinine.`,
  references: [
    {type:`pubmed`,title:`Chavez LO. J Intensive Care Med 2016`,pmid:`26142297`}
  ],
}
export default cpk
