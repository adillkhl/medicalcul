import type { FormulaDefinition } from '../types'

const gastvol_perlas: FormulaDefinition = {
  id: `gastvol_perlas`, slug: `gastvol_perlas`,
  name: `Volume gastrique (Perlas)`,
  specialty: `anesthesie`, category: `Jeune`,
  description: `Evaluation du volume gastrique par echographie selon Perlas`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`grade`,type:`radio`,label:`Grade Perlas`,options:[{value:0,label:`Grade 0 - Estomac vide (pas de contenu visible)`},{value:1,label:`Grade 1 - Liquide clair en decubitus dorsal`},{value:2,label:`Grade 2 - Liquide clair en decubitus dorsal et lateral droit`}]},
  ],
  calculate: (values) => {
    const g = values.grade??0
    const labels = ['Grade 0 - Estomac vide','Grade 1 - Risque modere','Grade 2 - Estomac non a jeun']
    const sev = g === 0 ? 'low' : g === 1 ? 'moderate' : 'high'
    return {value:g, label:labels[g], severity: sev,
      ranges:[
      {min:0,max:0,label:`Risque d'inhalation faible`,severity:`low`},
      {min:1,max:1,label:`Jeune insuffisant? Envisager retard`,severity:`moderate`},
      {min:2,max:2,label:`Risque d'inhalation eleve, surseoir si possible`,severity:`high`},
      ]}
  },
  interpretation: `Le grade de Perlas evalue le volume gastrique par echographie. Grade 2 = risque d'inhalation eleve.`,
  clinicalCommentary: `Outil emergant. Grade 2 a une specificite > 90% pour un volume gastrique > 1.5 mL/kg.`,
  references: [
    {type:`pubmed`,title:`Perlas A et al. Anesthesiology 2009`,pmid:`19277803`}
  ],
}
export default gastvol_perlas
