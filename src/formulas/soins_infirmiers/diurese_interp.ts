import type { FormulaDefinition } from '../types'

const diurese_interp: FormulaDefinition = {
  id: `diurese_interp`, slug: `diurese_interp`,
  name: `Diurese (Interpretation)`,
  specialty: `soins_infirmiers`, category: `Diurese`,
  description: `Interpretation de la diurese des 24h`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`d`,type:`number`,label:`Diurese`,unit:`mL/24h`},
  ],
  calculate: (values) => {
    const d = parseFloat(values.d)||1500; let sev = 'low'; let label = d + ' mL/24h'
        if (d < 100) { sev = 'high'; label += ' - Anurie' }
        else if (d < 400) { sev = 'high'; label += ' - Oligurie severe' }
        else if (d < 500) { sev = 'moderate'; label += ' - Oligurie' }
        else if (d > 3000) { sev = 'moderate'; label += ' - Polyurie' }
        else { label += ' - Normale' }
        const retval = d; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:99,label:'Anurie',severity:'high' as const},{min:100,max:399,label:'Oligurie',severity:'high' as const},{min:400,max:799,label:'Oligurie legere',severity:'moderate' as const},{min:800,max:2800,label:'Normale',severity:'low' as const},{min:2801,max:9999,label:'Polyurie',severity:'moderate' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Diurese normale 0.8-2.8 L/24h. Oligurie < 500, anurie < 100, polyurie > 3L.`,
  clinicalCommentary: `Objectif diurese 0.5-1 mL/kg/h.`,
  references: [
    {type:`pubmed`,title:`KDIGO. Kidney Int 2012`,pmid:`---`}
  ],
}
export default diurese_interp
