import type { FormulaDefinition } from '../types'

const villalta: FormulaDefinition = {
  id: `villalta`, slug: `villalta`,
  name: `Villalta (Score)`,
  specialty: `cardiologie`, category: `Thrombose`,
  description: `Score diagnostique du syndrome post-thrombotique apres TVP`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`douleur`,type:`radio`,label:`Douleur du membre`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Severe`}]},
    {id:`crampes`,type:`radio`,label:`Crampes`,options:[{value:0,label:`Absentes`},{value:1,label:`Leieres`},{value:2,label:`Moderees`},{value:3,label:`Severes`}]},
    {id:`lourdeur`,type:`radio`,label:`Lourdeur du membre`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Severe`}]},
    {id:`prurit`,type:`radio`,label:`Prurit`,options:[{value:0,label:`Absent`},{value:1,label:`Leger`},{value:2,label:`Modere`},{value:3,label:`Severe`}]},
    {id:`paresthesie`,type:`radio`,label:`Paresthesies`,options:[{value:0,label:`Absentes`},{value:1,label:`Legeres`},{value:2,label:`Moderees`},{value:3,label:`Severes`}]},
    {id:`oedeme`,type:`radio`,label:`Oedeme pretibial`,options:[{value:0,label:`Absent`},{value:1,label:`Leger`},{value:2,label:`Modere`},{value:3,label:`Severe`}]},
    {id:`pigmentation`,type:`radio`,label:`Hyperpigmentation cutanee`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Severe`}]},
    {id:`lipodermatosclerose`,type:`radio`,label:`Lipodermatosclerose`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Severe`}]},
    {id:`varices`,type:`radio`,label:`Veines collaterales / ectasies`,options:[{value:0,label:`Absentes`},{value:1,label:`Legeres`},{value:2,label:`Moderees`},{value:3,label:`Severes`}]},
    {id:`ulcere`,type:`radio`,label:`Ulcere veineux`,options:[{value:0,label:`Absent`},{value:1,label:`Present`}]},
  ],
  calculate: (values) => {
    const s = (parseInt(values.douleur)||0)+(parseInt(values.crampes)||0)+(parseInt(values.lourdeur)||0)+(parseInt(values.prurit)||0)+(parseInt(values.paresthesie)||0)+(parseInt(values.oedeme)||0)+(parseInt(values.pigmentation)||0)+(parseInt(values.lipodermatosclerose)||0)+(parseInt(values.varices)||0)+(values.ulcere?1:0)
        const sev = s >= 15 ? 'high' : s >= 10 ? 'moderate' : s >= 5 ? 'low' : 'low'
        const label = s < 5 ? 'Absence de SP' : s < 10 ? 'SP leger' : s < 15 ? 'SP modere' : 'SP severe'
        const retval = s
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:4,label:'Pas de syndrome post-thrombotique',severity:'low' as const},
          {min:5,max:9,label:'Syndrome post-thrombotique leger',severity:'low' as const},
          {min:10,max:14,label:'Syndrome post-thrombotique modere',severity:'moderate' as const},
          {min:15,max:999,label:'Syndrome post-thrombotique severe',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le score de Villalta diagnostique et gradue le syndrome post-thrombotique (SPT) apres une TVP, combinant 5 symptomes et 5 signes cliniques.`,
  clinicalCommentary: `Le SPT est une complication frequente de la TVP (20-50% a 2 ans). Le port de bas de contention pendant au moins 2 ans apres une TVP proximale reduit le risque de SPT. L\'evaluation se fait ≥ 6 mois apres la TVP index.`,
  references: [
    {type:`pubmed`,title:`Villalta S et al. Haemostasis 1994`,pmid:`—`}
  ],
}
export default villalta
