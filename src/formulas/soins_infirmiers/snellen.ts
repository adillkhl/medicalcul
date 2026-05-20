import type { FormulaDefinition } from '../types'

const snellen: FormulaDefinition = {
  id: `snellen`, slug: `snellen`,
  name: `Snellen (Acuite visuelle)`,
  specialty: `soins_infirmiers`, category: `Vision`,
  description: `Echelle de Snellen (20/20 a 20/400)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`r`,type:`radio`,label:`Acuite`,options:[{value:0,label:`20/20 (1.0)`},{value:1,label:`20/30 (0.7)`},{value:2,label:`20/50 (0.4)`},{value:3,label:`20/100 (0.2)`},{value:4,label:`20/200 (0.1)`},{value:5,label:`20/400 (< 0.1)`}]},
  ],
  calculate: (values) => {
    const r = parseInt(values.r)||0; const labels : Record<number, string> = {0:'Normal',1:'Baisse legere',2:'Baisse moderee',3:'Baisse severe',4:'Ce cite legale',5:'Ce cite profonde'}
        const sev = r >= 4 ? 'high' : r >= 2 ? 'moderate' : 'low'
        const retval = r; const retlabel = labels[r]||''; const retsev = sev
        const ranges = [{min:0,max:0,label:'Normal',severity:'low' as const},{min:1,max:1,label:'Legere',severity:'low' as const},{min:2,max:2,label:'Moderee - Avis ophtalmo',severity:'moderate' as const},{min:3,max:5,label:'Severe - Urgence',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Acuite visuelle de Snellen. Baisse brutale = urgence (NOIA, decollement retine).`,
  clinicalCommentary: `Mesurer chaque oeil separement. Baisse brutale unilaterale = urgence.`,
  references: [
    {type:`pubmed`,title:`Snellen H. 1862`,pmid:`---`}
  ],
}
export default snellen
