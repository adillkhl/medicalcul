import type { FormulaDefinition } from '../types'

const timi_hemorragies: FormulaDefinition = {
  id: `timi_hemorragies`, slug: `timi_hemorragies`,
  name: `TIMI hemorragies (Classification)`,
  specialty: `cardiologie`, category: `Hemorrhagie`,
  description: `Classification du risque hemorragique sur SCA non ST+ selon TIMI`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`age65`,type:`boolean`,label:`Age ≥ 65 ans`,weight:1},
    {id:`aspirine`,type:`boolean`,label:`Aspirine dans les 7 derniers jours`,weight:1},
    {id:`htc`,type:`boolean`,label:`Hematocrite < 36%`,weight:1},
    {id:`diabete`,type:`boolean`,label:`Diabete`,weight:1},
    {id:`poids`,type:`boolean`,label:`Poids < 60 kg`,weight:1},
    {id:`femme`,type:`boolean`,label:`Sexe feminin`,weight:1},
    {id:`insuf_renale`,type:`boolean`,label:`Insuffisance renale (creatinine > 177)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.age65?1:0)+(values.aspirine?1:0)+(values.htc?1:0)+(values.diabete?1:0)+(values.poids?1:0)+(values.femme?1:0)+(values.insuf_renale?1:0)
        const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'
        const label = s + ' facteur(s) de risque'
        const retval = s
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:2,label:'Faible risque hemorragique',severity:'low' as const},
          {min:3,max:4,label:'Risque modere',severity:'moderate' as const},
          {min:5,max:7,label:'Risque eleve',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le score de risque hemorragique TIMI estime le risque de saignement majeur chez les patients traites pour SCA non ST+.`,
  clinicalCommentary: `Ce score aide a choisir la strategie antithrombotique. Un risque eleve peut orienter vers une voie radiale pour la coronarographie. A combiner avec le CRUSADE pour une evaluation plus complete.`,
  references: [
    {type:`pubmed`,title:`Antman EM et al. J Am Coll Cardiol 2000`,pmid:`11028021`}
  ],
}
export default timi_hemorragies
