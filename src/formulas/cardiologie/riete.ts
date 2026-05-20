import type { FormulaDefinition } from '../types'

const riete: FormulaDefinition = {
  id: `riete`, slug: `riete`,
  name: `RIETE (Score)`,
  specialty: `cardiologie`, category: `Thrombose`,
  description: `Risque hemorragique sous anticoagulant pour thrombose veineuse`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`saignement`,type:`boolean`,label:`Saignement recent majeur`,weight:1.5},
    {id:`cancer`,type:`boolean`,label:`Cancer actif`,weight:1.5},
    {id:`age75`,type:`boolean`,label:`Age > 75 ans`,weight:1},
    {id:`insuf_renale`,type:`boolean`,label:`Insuffisance renale (ClCr < 30)`,weight:1},
    {id:`anemie`,type:`boolean`,label:`Anemie (Hb < 10)`,weight:1},
    {id:`thrombopenie`,type:`boolean`,label:`Thrombopenie < 100000`,weight:1},
    {id:`avc`,type:`boolean`,label:`AVC ischemique recent`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.saignement?1.5:0)+(values.cancer?1.5:0)+(values.age75?1:0)+(values.insuf_renale?1:0)+(values.anemie?1:0)+(values.thrombopenie?1:0)+(values.avc?1:0)
        const sev = s >= 3 ? 'high' : s >= 1.5 ? 'moderate' : 'low'
        const label = s < 1.5 ? 'Risque faible' : s < 3 ? 'Risque modere' : 'Risque eleve'
        const retval = s
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:1.4,label:'Faible risque hemorragique',severity:'low' as const},
          {min:1.5,max:2.9,label:'Risque modere',severity:'moderate' as const},
          {min:3,max:999,label:'Risque eleve',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le score RIETE estime le risque de saignement majeur sous anticoagulant pour MTEV sur les 3 premiers mois de traitement.`,
  clinicalCommentary: `Score developpe a partir du registre RIETE. Un score eleve ne contre-indique pas l\'anticoagulation mais justifie une surveillance rapprochee. La duree minimale de traitement est de 3 mois pour une TVP proximale.`,
  references: [
    {type:`pubmed`,title:`Ruiz-Gimenez N et al. J Thromb Haemost 2008`,pmid:`18433427`}
  ],
}
export default riete
