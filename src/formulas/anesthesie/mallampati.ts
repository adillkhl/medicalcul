import type { FormulaDefinition } from '../types'

const mallampati: FormulaDefinition = {
  id: `mallampati`, slug: `mallampati`,
  name: `Mallampati modifie (Score)`,
  specialty: `anesthesie`, category: `Intubation`,
  description: `Prediction d\'intubation difficile par classification oropharyngee`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`classe`,type:`radio`,label:`Classe Mallampati`,options:[{value:1,label:`Classe I - Luette, piliers, palais mou visibles`},{value:2,label:`Classe II - Luette, palais mou visibles`},{value:3,label:`Classe III - Palais mou, base luette visibles`},{value:4,label:`Classe IV - Palais dur seulement visible`}]},
  ],
  calculate: (values) => {
    const c = values.classe??1
    const sev = c >= 3 ? 'moderate' : 'low'
    return {value:c, label:'Classe '+c, severity: sev,
      ranges:[
      {min:1,max:1,label:`Classe I - Facile`,severity:`low`},
      {min:2,max:2,label:`Classe II - Generalement facile`,severity:`low`},
      {min:3,max:3,label:`Classe III - Difficulte potentielle`,severity:`moderate`},
      {min:4,max:4,label:`Classe IV - Difficile probable`,severity:`high`},
      ]}
  },
  interpretation: `Mallampati modifie evalue la visibilite oropharyngee. Classe III-IV = risque d\'intubation difficile x4-7.`,
  clinicalCommentary: `Sensibilite 50% seul. Toujours combine: Mallampati + ouverture bouche + distance thyromentonniere + Cormack.`,
  references: [
    {type:`pubmed`,title:`Mallampati SR et al. Can Anaesth Soc J 1985`,pmid:`4028873`}
  ],
}
export default mallampati
