import type { FormulaDefinition } from '../types'

const performance: FormulaDefinition = {
  id: `performance`, slug: `performance`,
  name: `Performance Status (ECOG/OMS)`,
  specialty: `oncologie`, category: `Indice`,
  description: `Indice de performance ECOG/OMS (0-5) pour l'evaluation de l'etat general en cancerologie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`ecog`,type:`radio`,label:`ECOG`,options:[{value:0,label:`0 - Activite normale`},{value:1,label:`1 - Symptomes mais ambulatoire`},{value:2,label:`2 - Alite < 50% jour`},{value:3,label:`3 - Alite > 50% jour`},{value:4,label:`4 - Grabataire`},{value:5,label:`5 - Deces`}]},
  ],
  calculate: (values) => {
    const e = parseInt(values.ecog)||0; const labels : Record<number, string> = {0:'ECOG 0',1:'ECOG 1',2:'ECOG 2',3:'ECOG 3',4:'ECOG 4',5:'ECOG 5'}
        const sev = e >= 3 ? 'high' : e >= 2 ? 'moderate' : 'low'
        const retval = e; const retlabel = labels[e]||''; const retsev = sev
        const ranges = [{min:0,max:1,label:'ECOG 0-1 - Chimiotherapie possible',severity:'low' as const},{min:2,max:2,label:'ECOG 2 - Discuter',severity:'moderate' as const},{min:3,max:5,label:'ECOG 3-5 - Soins palliatifs',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'ECOG (OMS) est l'indice de performance le plus utilise en cancerologie. ECOG 0-1 = chimiotherapie possible.`,
  clinicalCommentary: `L'ECOG est un facteur pronostique majeur independant du stade. Un ECOG >= 3 contre-indique souvent la chimiotherapie cytotoxique.`,
  references: [
    {type:`pubmed`,title:`Oken MM. Am J Clin Oncol 1982`,pmid:`7165009`}
  ],
}
export default performance
