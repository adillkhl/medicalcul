import type { FormulaDefinition } from '../types'

const dengue: FormulaDefinition = {
  id: `dengue`, slug: `dengue`,
  name: `Dengue (Classification OMS)`,
  specialty: `infectiologie`, category: `Arbovirose`,
  description: `Classification OMS de la dengue: fievre, signes hemorragiques, severite`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`severite`,type:`radio`,label:`Classification`,options:[{value:0,label:`Dengue (fievre + >= 2 signes)`},{value:1,label:`Dengue avec signes d alerte`},{value:2,label:`Dengue severe (fievre + extravasation/hemorragie/defaillance)`}]},
    {id:`douleur_retro`,type:`boolean`,label:`Douleur retro-orbitaire`,weight:1},
    {id:`myalgies`,type:`boolean`,label:`Myalgies/arthralgies`,weight:1},
    {id:`eruption`,type:`boolean`,label:`Eruption`,weight:1},
    {id:`hemorragie`,type:`boolean`,label:`Signes hemorragiques`,weight:1},
    {id:`hypotension`,type:`boolean`,label:`Hypotension/choc`,weight:1},
  ],
  calculate: (values) => {
    const s = (parseInt(values.severite)||0)+(values.hemorragie?1:0)+(values.hypotension?2:0)
        const sev = s >= 3 ? 'high' : s >= 1 ? 'moderate' : 'low'
        const retval = s; const retlabel = 'Score: ' + s; const retsev = sev
        const ranges = [{min:0,max:0,label:'Dengue - Traitement ambulatoire',severity:'low' as const},{min:1,max:2,label:'Dengue + signes alerte - Hospitalisation',severity:'moderate' as const},{min:3,max:999,label:'Dengue severe - Reanimation',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Classification OMS de la dengue: sans signes alerte, avec signes alerte, severe.`,
  clinicalCommentary: `L\'extravasation plasmatique (hematocrite, albumine, echographie) definit la dengue severe. Pas d\'aspirine/AINS.`,
  references: [
    {type:`pubmed`,title:`WHO. Dengue Guidelines 2009`,pmid:`---`}
  ],
}
export default dengue
