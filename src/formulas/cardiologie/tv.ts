import type { FormulaDefinition } from '../types'

const tv: FormulaDefinition = {
  id: `tv`, slug: `tv`,
  name: `T.V. (Score)`,
  specialty: `cardiologie`, category: `Tachycardie`,
  description: `Diagnostic differentiel: tachycardie ventriculaire vs. supraventriculaire avec bloc de branche`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`rs`,type:`boolean`,label:`QS en V6 (pas de RS)`,weight:1},
    {id:`aVR`,type:`boolean`,label:`Onde R dominante en aVR`,weight:1},
    {id:`dissociation`,type:`boolean`,label:`Dissociation AV (signe majeur)`,weight:1},
    {id:`concordance`,type:`boolean`,label:`Concordance negative V1-V6`,weight:1},
    {id:`lb`,type:`boolean`,label:`Bloc de branche gauche pre-existant`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.rs?1:0)+(values.aVR?1:0)+(values.dissociation?2:0)+(values.concordance?1:0)+(values.lb?1:0)
        const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const label = s >= 3 ? 'Probable TV' : s >= 2 ? 'Possible TV' : 'Probable TSV avec BBD'
        const retval = s
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Plutot TSV avec aberration',severity:'low' as const},
          {min:2,max:2,label:'Indetermine - ECG de reference utile',severity:'moderate' as const},
          {min:3,max:5,label:'TV probable - Traiter comme TV',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Score diagnostique pour differencier TV et TSV + BB. La dissociation AV et la concordance negative sont les signes les plus specifiques de TV.`,
  clinicalCommentary: `Toute tachycardie a QRS large non documentee doit etre traitee comme une TV jusqu\'a preuve du contraire. La manoeuvre vagale et l\'adenosine sont a eviter si criteres de TV. La cardioversion electrique est le traitement de choix si instabilite hemodynamique.`,
  references: [
    {type:`pubmed`,title:`Brugada P et al. Circulation 1991`,pmid:`1863988`}
  ],
}
export default tv
