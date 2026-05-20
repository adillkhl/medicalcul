import type { FormulaDefinition } from '../types'

const lipides: FormulaDefinition = {
  id: `lipides`, slug: `lipides`,
  name: `Bilan lipidique (Interpretation)`,
  specialty: `divers`, category: `Lipides`,
  description: `Interpretation du bilan lipidique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`ldl`,type:`number`,label:`LDL-cholesterol`,unit:`mmol/L`},
    {id:`hdl`,type:`number`,label:`HDL-cholesterol`,unit:`mmol/L`},
    {id:`tg`,type:`number`,label:`Triglycerides`,unit:`mmol/L`},
  ],
  calculate: (values) => {
    const ldl = parseFloat(values.ldl)||2.5; const hdl = parseFloat(values.hdl)||1.2; const tg = parseFloat(values.tg)||1.2
        let sev = 'low'; let label = ''
        if (ldl >= 4.9) { sev = 'high'; label = 'LDL severe'; }
        else if (ldl >= 3) { sev = 'moderate'; label = 'LDL eleve'; }
        else { label = 'LDL normal'; }
        if (tg >= 5) { label += ' - TG severe (risque pancreatite)'; sev = 'high' }
        const retval = ldl; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:1.8,label:'Optimal',severity:'low' as const},{min:1.9,max:2.9,label:'Normal',severity:'low' as const},{min:3,max:4.8,label:'Eleve',severity:'moderate' as const},{min:4.9,max:999,label:'Tres eleve',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `LDL cibles selon le risque CV global. LDL > 4.9 = toujours severe.`,
  clinicalCommentary: `Objectifs LDL selon SCORE: < 1.4 pour tres haut risque, < 1.8 haut risque.`,
  references: [
    {type:`pubmed`,title:`Mach F. Eur Heart J 2020`,pmid:`31504405`}
  ],
}
export default lipides
