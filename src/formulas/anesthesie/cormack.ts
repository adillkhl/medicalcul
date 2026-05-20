import type { FormulaDefinition } from '../types'

const cormack: FormulaDefinition = {
  id: `cormack`, slug: `cormack`,
  name: `Cormack et Lehane (Classification)`,
  specialty: `anesthesie`, category: `Intubation`,
  description: `Classification de la difficulte d'intubation selon la vision de la glotte`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`grade`,type:`radio`,label:`Grade`,options:[{value:1,label:`Grade I - Vue complete de la glotte`},{value:2,label:`Grade II - Vue partielle`},{value:3,label:`Grade III - Vue de l'epiglotte seulement`},{value:4,label:`Grade IV - Aucune vue`}]},
  ],
  calculate: (values) => {
    const g = values.grade??1
    const labels: Record<number, string> = {1:'Grade I - Facile',2:'Grade II - Partielle',3:'Grade III - Difficile',4:'Grade IV - Tres difficile'}
    const sev = g>=3?'high':g>=2?'moderate':'low'
    return {value:g, label:labels[g]||'', severity: sev,
      ranges:[
      {min:1,max:1,label:`Grade I - Intubation facile`,severity:`low`},
      {min:2,max:2,label:`Grade II - Difficulte moderee`,severity:`moderate`},
      {min:3,max:3,label:`Grade III - Intubation difficile`,severity:`high`},
      {min:4,max:4,label:`Grade IV - Intubation tres difficile`,severity:`high`},
      ]}
  },
  interpretation: `La classification de Cormack-Lehane evalue la visibilite glottique en laryngoscopie. Grade III-IV = difficile.`,
  clinicalCommentary: `Ne pas resumer le risque a ce seul critere. Utiliser conjointement Mallampati, distance thyromentonniere, ouverture de bouche.`,
  references: [
    {type:`pubmed`,title:`Cormack RS, Lehane J. Anaesthesia 1984`,pmid:`6507927`}
  ],
}
export default cormack
