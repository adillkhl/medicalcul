import type { FormulaDefinition } from '../types'

const macocha: FormulaDefinition = {
  id: `macocha`, slug: `macocha`,
  name: `MACOCHA (Score)`,
  specialty: `anesthesie`, category: `Intubation`,
  description: `Prediction d\'intubation difficile en reanimation`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`mallampati`,type:`radio`,label:`Mallampati modifie`,options:[{value:0,label:`I-II`},{value:5,label:`III-IV`}]},
    {id:`ouverture_bouche`,type:`radio`,label:`Ouverture de bouche`,options:[{value:0,label:`> 3 cm`},{value:3,label:`< 3 cm`}]},
    {id:`distance_thyr`,type:`radio`,label:`Distance thyromentonniere`,options:[{value:0,label:`> 6.5 cm`},{value:3,label:`< 6.5 cm`}]},
    {id:`sniffing`,type:`boolean`,label:`Position sniffing impossible`,weight:2},
    {id:`obstacle`,type:`boolean`,label:`Obstacle VAS connu`,weight:2},
    {id:`coma`,type:`boolean`,label:`Coma / arret cardiaque / hypoxemie`,weight:2},
  ],
  calculate: (values) => {
    const s = (values.mallampati??0)+(values.ouverture_bouche??0)+(values.distance_thyr??0)+(values.sniffing?2:0)+(values.obstacle?2:0)+(values.coma?2:0)
    const sev = s >= 12 ? 'high' : s >= 8 ? 'moderate' : 'low'
    const label = s < 8 ? 'Intubation facile' : s < 12 ? 'Difficulte moderee' : 'Intubation tres difficile'
    return {value:s, label, severity: sev,
      ranges:[
      {min:0,max:7,label:`Intubation facile`,severity:`low`},
      {min:8,max:11,label:`Difficulte moderee - Preparer alternative`,severity:`moderate`},
      {min:12,max:999,label:`Voie difficile anticipee - Masque larynge`,severity:`high`},
      ]}
  },
  interpretation: `Le MACOCHA est le seul score valide pour predire l\'intubation difficile en reanimation. >= 12 = tres difficile.`,
  clinicalCommentary: `Developpe pour la reanimation. Integre l\'urgence vitale comme facteur de risque.`,
  references: [
    {type:`pubmed`,title:`De Jong A et al. Intensive Care Med 2013`,pmid:`23765248`}
  ],
}
export default macocha
