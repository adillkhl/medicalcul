import type { FormulaDefinition } from '../types'

const gcs: FormulaDefinition = {
  id: `gcs`, slug: `gcs`,
  name: `Glasgow (Score)`,
  specialty: `divers`, category: `Conscience`,
  description: `Echelle de Glasgow pour l\'evaluation du coma`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`yeux`,type:`radio`,label:`Ouverture des yeux`,options:[{value:4,label:`Spontanee`},{value:3,label:`A la demande`},{value:2,label:`A la douleur`},{value:1,label:`Aucune`}]},
    {id:`verbal`,type:`radio`,label:`Reponse verbale`,options:[{value:5,label:`Orientee`},{value:4,label:`Confuse`},{value:3,label:`Inapproprie`},{value:2,label:`Incomprehensible`},{value:1,label:`Aucune`}]},
    {id:`moteur`,type:`radio`,label:`Reponse motrice`,options:[{value:6,label:`Obéit aux ordres`},{value:5,label:`Localise la douleur`},{value:4,label:`Retrait / flexion`},{value:3,label:`Decortication`},{value:2,label:`Decerebration`},{value:1,label:`Aucune`}]},
  ],
  calculate: (values) => {
    const y = parseInt(values.yeux)||1; const v = parseInt(values.verbal)||1; const m = parseInt(values.moteur)||1
        const gcs = y + v + m; const sev = gcs <= 8 ? 'high' : gcs <= 12 ? 'moderate' : 'low'
        const label = 'GCS ' + gcs
        const retval = gcs; const retlabel = label; const retsev = sev
        const ranges = [{min:3,max:8,label:'Coma severe - Intubation',severity:'high' as const},{min:9,max:12,label:'Coma modere',severity:'moderate' as const},{min:13,max:15,label:'Conserve',severity:'low' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le score de Glasgow evalue le niveau de conscience. GCS <= 8 = coma severe justifiant une intubation.`,
  clinicalCommentary: `GCS est le standard international. L\'evaluation est faussee par l\'intubation (V=1).`,
  references: [
    {type:`pubmed`,title:`Teasdale G. Lancet 1974`,pmid:`4135064`}
  ],
}
export default gcs
