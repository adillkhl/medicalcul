import type { FormulaDefinition } from '../types'

const tsh: FormulaDefinition = {
  id: `tsh`, slug: `tsh`,
  name: `TSH (Interpretation)`,
  specialty: `divers`, category: `Thyroide`,
  description: `Interpretation de la TSH`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`tsh`,type:`number`,label:`TSH`,unit:`mUI/L`},
  ],
  calculate: (values) => {
    const tsh = parseFloat(values.tsh)||2; let sev = 'low'; let label = 'TSH ' + tsh
        if (tsh < 0.1) { sev = 'high'; label += ' - Hyperthyroidie franche' }
        else if (tsh < 0.3) { sev = 'moderate'; label += ' - Hyperthyroidie fruste' }
        else if (tsh > 10) { sev = 'high'; label += ' - Hypothyroidie franche' }
        else if (tsh > 4.5) { sev = 'moderate'; label += ' - Hypothyroidie fruste' }
        else { label += ' - Normale' }
        const retval = tsh; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:0.09,label:'Hyperthyroidie',severity:'high' as const},{min:0.1,max:0.29,label:'Hyperthyroidie fruste',severity:'moderate' as const},{min:0.3,max:4.5,label:'Normale',severity:'low' as const},{min:4.6,max:10,label:'Hypothyroidie fruste',severity:'moderate' as const},{min:10.1,max:999,label:'Hypothyroidie franche',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `TSH normale 0.3-4.5 mUI/L. TSH < 0.1 = hyper. TSH > 10 = hypo.`,
  clinicalCommentary: `Toute TSH anormale doit etre completee par T4 libre.`,
  references: [
    {type:`pubmed`,title:`Garber JR. Endocr Pract 2012`,pmid:`22543788`}
  ],
}
export default tsh
