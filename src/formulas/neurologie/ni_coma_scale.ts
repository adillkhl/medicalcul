import type { FormulaDefinition } from '../types'

const ni_coma_scale: FormulaDefinition = {
  id: `ni_coma_scale`, slug: `ni_coma_scale`,
  name: `NI Coma Scale`,
  specialty: `neurologie`, category: `Coma`,
  description: `Echelle de coma non-linguistique (intubes) 3 items`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`yeux`,type:`radio`,label:`Ouverture yeux`,options:[{value:4,label:`Spontanee`},{value:3,label:`Au bruit`},{value:2,label:`A la douleur`},{value:1,label:`Aucune`}]},
    {id:`moteur`,type:`radio`,label:`Reponse motrice`,options:[{value:6,label:`Obéit`},{value:5,label:`Localise`},{value:4,label:`Retrait`},{value:3,label:`Flexion`},{value:2,label:`Extension`},{value:1,label:`Aucune`}]},
    {id:`tc`,type:`radio`,label:`Reflexes tronc`,options:[{value:3,label:`Normaux`},{value:2,label:`Partiels`},{value:1,label:`Absents`}]},
  ],
  calculate: (values) => {
    const y = parseInt(values.yeux)||1; const m = parseInt(values.moteur)||1; const t = parseInt(values.tc)||1
        const s = y+m+t; const sev = s <= 8 ? 'high' : s <= 10 ? 'moderate' : 'low'
        const retval = s; const retlabel = s + '/13'; const retsev = sev
        const ranges = [{min:3,max:8,label:'Atteinte severe',severity:'high' as const},{min:9,max:10,label:'Atteinte moderee',severity:'moderate' as const},{min:11,max:13,label:'Conserve',severity:'low' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Echelle pour patients intubes non communicants (alternative GCS partielle).`,
  clinicalCommentary: `Alternative au GCS standard quand le score verbal n'est pas evaluable.`,
  references: [
    {type:`pubmed`,title:`Wijdicks EF. Neurology 2005`,pmid:`16207759`}
  ],
}
export default ni_coma_scale
