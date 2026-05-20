import type { FormulaDefinition } from '../types'

const vitamine_d: FormulaDefinition = {
  id: `vitamine_d`, slug: `vitamine_d`,
  name: `Vitamine D (Interpretation)`,
  specialty: `divers`, category: `Vitamines`,
  description: `Interpretation de la 25-OH vitamine D`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`vitd`,type:`number`,label:`25-OH D`,unit:`ng/mL`},
  ],
  calculate: (values) => {
    const v = parseFloat(values.vitd)||0; let sev = 'low'; let label = v + ' ng/mL'
        if (v < 10) { label += ' - Carence severe'; sev = 'high' }
        else if (v < 20) { label += ' - Carence'; sev = 'moderate' }
        else if (v < 30) { label += ' - Insuffisance'; sev = 'low' }
        else { label += ' - Normal' }
        const retval = v; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:9,label:'Carence severe',severity:'high' as const},{min:10,max:19,label:'Carence',severity:'moderate' as const},{min:20,max:29,label:'Insuffisance',severity:'low' as const},{min:30,max:80,label:'Normal',severity:'low' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `250H D: carence < 20 ng/mL, insuffisance 20-30 ng/mL.`,
  clinicalCommentary: `Supplementation 800-1000 UI/j. Traitement carence: 50000 UI/sem x 8 sem.`,
  references: [
    {type:`pubmed`,title:`Holick MF. N Engl J Med 2007`,pmid:`17634462`}
  ],
}
export default vitamine_d
