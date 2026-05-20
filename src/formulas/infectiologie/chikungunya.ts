import type { FormulaDefinition } from '../types'

const chikungunya: FormulaDefinition = {
  id: `chikungunya`, slug: `chikungunya`,
  name: `Chikungunya (Diagnostic)`,
  specialty: `infectiologie`, category: `Arbovirose`,
  description: `Diagnostic clinique du chikungunya: fievre + arthralgies severes + eruption`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`fievre`,type:`boolean`,label:`Fievre > 38.5C`,weight:1},
    {id:`arthralgies`,type:`boolean`,label:`Arthralgies severes/incapacitantes`,weight:1},
    {id:`eruption`,type:`boolean`,label:`Eruption maculopapuleuse`,weight:1},
    {id:`myalgies`,type:`boolean`,label:`Myalgies`,weight:1},
    {id:`cephalees`,type:`boolean`,label:`Cephalees`,weight:1},
    {id:`zones`,type:`boolean`,label:`Zone tropicale/subtropicale retour < 15j`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.fievre?1:0)+(values.arthralgies?2:0)+(values.eruption?1:0)+(values.myalgies?1:0)+(values.cephalees?1:0)+(values.zones?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const retval = s; const retlabel = s >= 4 ? 'Chikungunya probable' : s >= 2 ? 'Possible - Serologie' : 'Peu probable'; const retsev = sev
        const ranges = [{min:0,max:1,label:'Peu probable',severity:'low' as const},{min:2,max:3,label:'Possible - Serologie',severity:'moderate' as const},{min:4,max:7,label:'Probable',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Chikungunya: diagnostic clinique (fievre + arthralgies severe + eruption). Confirmation serologique (IgM).`,
  clinicalCommentary: `Le chikungunya peut entrainer des arthralgies persistantes des mois. Pas de traitement antiviral specifique.`,
  references: [
    {type:`pubmed`,title:`Simon F. Lancet Infect Dis 2011`,pmid:`21890073`}
  ],
}
export default chikungunya
