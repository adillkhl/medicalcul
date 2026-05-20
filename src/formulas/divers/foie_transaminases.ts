import type { FormulaDefinition } from '../types'

const foie_transaminases: FormulaDefinition = {
  id: `foie_transaminases`, slug: `foie_transaminases`,
  name: `Transaminases (Interpretation)`,
  specialty: `divers`, category: `Foie`,
  description: `Interpretation des transaminases et cytolyse hepatique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`alatt`,type:`number`,label:`ALT`,unit:`U/L`},
    {id:`asatt`,type:`number`,label:`AST`,unit:`U/L`},
    {id:`profil`,type:`radio`,label:`Profil`,options:[{value:0,label:`Cytolytique ALT>AST`},{value:1,label:`Cholestatique PAL+GGT`}]},
  ],
  calculate: (values) => {
    const alt = parseFloat(values.alatt)||0; const ast = parseFloat(values.asatt)||0
        let sev = 'low'; let label = 'ALT ' + alt + ' AST ' + ast
        if (alt > 10) { sev = 'high'; label += ' - Hepatite severe' }
        else if (alt > 5) { sev = 'high'; label += ' - Cytolyse severe' }
        else if (alt > 3) { sev = 'moderate'; label += ' - Cytolyse moderee' }
        else { label += ' - Normales/legere' }
        const retval = alt; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:1.4,label:'Normales',severity:'low' as const},{min:1.5,max:3,label:'Legere (< 3N)',severity:'low' as const},{min:3.1,max:5,label:'Moderee (< 5N)',severity:'moderate' as const},{min:5.1,max:999,label:'Severe (> 5N)',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Cytolyse: ALT > AST evoque hepatite virale/medicamenteuse. AST > ALT et GGT elevee evoque alcool. PAL+GGT = cholestase.`,
  clinicalCommentary: `Hospitaliser si ALT > 10N ou INR > 1.5.`,
  references: [
    {type:`pubmed`,title:`Kwo PY. Am J Gastroenterol 2017`,pmid:`28081316`}
  ],
}
export default foie_transaminases
