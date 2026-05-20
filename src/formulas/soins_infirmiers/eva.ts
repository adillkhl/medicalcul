import type { FormulaDefinition } from '../types'

const eva: FormulaDefinition = {
  id: `eva`, slug: `eva`,
  name: `EVA (Echelle Visuelle Analogique)`,
  specialty: `soins_infirmiers`, category: `Douleur`,
  description: `EVA douleur 0-10`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`score`,type:`number`,label:`EVA`,unit:`/10`},
  ],
  calculate: (values) => {
    const s = parseFloat(values.score)||0; const sev = s >= 7 ? 'high' : s >= 4 ? 'moderate' : 'low'
        const label = s < 1 ? 'Pas de douleur' : s < 4 ? 'Legere' : s < 7 ? 'Moderee' : 'Severe'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:0.9,label:'Pas de douleur',severity:'low' as const},{min:1,max:3.9,label:'Legere - Palier 1',severity:'low' as const},{min:4,max:6.9,label:'Moderee - Palier 2',severity:'moderate' as const},{min:7,max:10,label:'Severe - Palier 3',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `EVA: reference pour evaluer la douleur (0-10). EVA > 4 = traitement. EVA > 7 = palier 3.`,
  clinicalCommentary: `Chez la personne agee, l\'EVS est souvent plus facile.`,
  references: [
    {type:`pubmed`,title:`Breivik H. Eur J Pain 2008`,pmid:`18234756`}
  ],
}
export default eva
