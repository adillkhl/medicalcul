import type { FormulaDefinition } from '../types'

const eczemascorad: FormulaDefinition = {
  id: `eczemascorad`, slug: `eczemascorad`,
  name: `SCORAD (Eczema)`,
  specialty: `dermatologie`, category: `Eczema`,
  description: `SCORAD (SCORing Atopic Dermatitis) - score de severite de la dermatite atopique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`extension`,type:`number`,label:`Extension (regle des 9)`,unit:`%`},
    {id:`erytheme`,type:`radio`,label:`Erytheme`,options:[{value:0,label:`Absent`},{value:1,label:`Leger`},{value:2,label:`Modere`},{value:3,label:`Severe`}]},
    {id:`oedeme`,type:`radio`,label:`Oedeme / Papules`,options:[{value:0,label:`Absent`},{value:1,label:`Leger`},{value:2,label:`Modere`},{value:3,label:`Severe`}]},
    {id:`suintement`,type:`radio`,label:`Suintement / Croute`,options:[{value:0,label:`Absent`},{value:1,label:`Leger`},{value:2,label:`Modere`},{value:3,label:`Severe`}]},
    {id:`excoriations`,type:`radio`,label:`Excoriations`,options:[{value:0,label:`Absent`},{value:1,label:`Leger`},{value:2,label:`Modere`},{value:3,label:`Severe`}]},
    {id:`lichenification`,type:`radio`,label:`Lichenification`,options:[{value:0,label:`Absent`},{value:1,label:`Leger`},{value:2,label:`Modere`},{value:3,label:`Severe`}]},
    {id:`secheresse`,type:`radio`,label:`Secheresse (hors zone inflammatoire)`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Severe`}]},
    {id:`prurit`,type:`number`,label:`Prurit (EVA)`,unit:`0-10`},
    {id:`sommeil`,type:`number`,label:`Perte de sommeil (EVA)`,unit:`0-10`},
  ],
  calculate: (values) => {
    const ext = parseFloat(values.extension)||0
    const intensite = (parseInt(values.erytheme)||0)+(parseInt(values.oedeme)||0)+(parseInt(values.suintement)||0)+(parseInt(values.excoriations)||0)+(parseInt(values.lichenification)||0)+(parseInt(values.secheresse)||0)
    const subjectif = (parseFloat(values.prurit)||0) + (parseFloat(values.sommeil)||0)
    const scorad = Math.round(ext/5 + 7*intensite/2 + subjectif)
    const sev = scorad >= 50 ? 'high' : scorad >= 25 ? 'moderate' : 'low'
    const label = scorad < 25 ? 'Faible' : scorad < 50 ? 'Modere' : 'Severe'
    return {value:scorad, label, severity: sev,
      ranges:[
        {min:0,max:24,label:'SCORAD faible - Dermocorticoides classe II',severity:'low'},
        {min:25,max:49,label:'SCORAD modere - Traitement adapte a la poussee',severity:'moderate'},
        {min:50,max:103,label:'SCORAD severe - Prise en charge specialisee',severity:'high'},
      ]}
  },
  interpretation: `Le SCORAD combine l'extension (A), l'intensite (B: 6 items) et le retentissement subjectif (C: prurit + sommeil).`,
  clinicalCommentary: `Score de reference pour l'eczema atopique. Un changement de 10 points est cliniquement significatif. Objectif therapeutique: scorad < 25.`,
  references: [
    {type:`pubmed`,title:`European Task Force on Atopic Dermatitis. Dermatology 1993`,pmid:`8338808`}
  ],
}
export default eczemascorad
