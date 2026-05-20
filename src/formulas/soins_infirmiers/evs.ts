import type { FormulaDefinition } from '../types'

const evs: FormulaDefinition = {
  id: `evs`, slug: `evs`,
  name: `EVS (Echelle Verbale Simple)`,
  specialty: `soins_infirmiers`, category: `Douleur`,
  description: `Echelle douleur en 5 niveaux`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`n`,type:`radio`,label:`Niveau`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Intense`},{value:4,label:`Extremement intense`}]},
  ],
  calculate: (values) => {
    const n = parseInt(values.n)||0; const labels : Record<number, string> = {0:'Absente',1:'Legere',2:'Moderee',3:'Intense',4:'Extremement intense'}
        const sev = n >= 3 ? 'high' : n >= 2 ? 'moderate' : 'low'
        const retval = n; const retlabel = labels[n]||''; const retsev = sev
        const ranges = [{min:0,max:0,label:'Absente',severity:'low' as const},{min:1,max:1,label:'Legere',severity:'low' as const},{min:2,max:2,label:'Moderee',severity:'moderate' as const},{min:3,max:3,label:'Intense',severity:'high' as const},{min:4,max:4,label:'Extreme',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `EVS: alternative a l\'EVA, mieux comprise par les personnes agees.`,
  clinicalCommentary: `Utilisee quand l\'EVA est difficile (personnes agees, troubles cognitifs).`,
  references: [
    {type:`pubmed`,title:`Hjermstad MJ. J Pain 2011`,pmid:`21780197`}
  ],
}
export default evs
