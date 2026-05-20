import type { FormulaDefinition } from '../types'

const purpura: FormulaDefinition = {
  id: `purpura`, slug: `purpura`,
  name: `Purpura (Diagnostic)`,
  specialty: `divers`, category: `Cutane`,
  description: `Diagnostic differentiel du purpura: vasculaire, thrombopenique, vasculitique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`type`,type:`radio`,label:`Type`,options:[{value:0,label:`Petechies`},{value:1,label:`Ecchymoses`},{value:2,label:`Necrotiques/infiltres`}]},
    {id:`non_inflammatoire`,type:`boolean`,label:`Non inflammatoire`,weight:1},
    {id:`fievre`,type:`boolean`,label:`Fievre/signes infectieux`,weight:1},
    {id:`thrombopenie`,type:`boolean`,label:`Thrombopenie < 100000`,weight:1},
    {id:`age`,type:`boolean`,label:`Age > 60 ans`,weight:1},
  ],
  calculate: (values) => {
    const type = parseInt(values.type)||0; const s = (values.non_inflammatoire?1:0)+(values.fievre?1:0)+(values.thrombopenie?2:0)+(values.age?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const retval = s; const retlabel = 'Score: ' + s; const retsev = sev
        const ranges = [{min:0,max:1,label:'Vasculaire simple',severity:'low' as const},{min:2,max:3,label:'Bilan NFS+CRP',severity:'moderate' as const},{min:4,max:999,label:'Urgent - Biopsie',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Purpura thrombopenique = petechies non infiltrees. Purpura vasculitique = infiltre, palpable.`,
  clinicalCommentary: `Purpura febrile + thrombopenie = urgence (meningococcemie).`,
  references: [
    {type:`pubmed`,title:`Rodeghiero F. Blood 2009`,pmid:`19179077`}
  ],
}
export default purpura
