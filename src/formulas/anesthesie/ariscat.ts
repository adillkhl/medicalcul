import type { FormulaDefinition } from '../types'

const ariscat: FormulaDefinition = {
  id: `ariscat`, slug: `ariscat`,
  name: `ARISCAT (Score)`,
  specialty: `anesthesie`, category: `Complications respiratoires`,
  description: `Prediction de complication respiratoire post-operatoire`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age`,type:`radio`,label:`Age`,options:[{value:0,label:`< 50 ans`},{value:3,label:`51-80 ans`},{value:6,label:`> 80 ans`}]},
    {id:`sp02`,type:`radio`,label:`SpO2 pre-op`,options:[{value:0,label:`>= 96%`},{value:8,label:`91-95%`},{value:24,label:`<= 90%`}]},
    {id:`infection_resp`,type:`boolean`,label:`Infection respiratoire < 1 mois`,weight:12},
    {id:`anemie`,type:`boolean`,label:`Hb <= 10 g/dL`,weight:4},
    {id:`incision`,type:`radio`,label:`Site incision`,options:[{value:0,label:`Peripherique`},{value:8,label:`Thoracique haute`},{value:15,label:`Abdominale haute`}]},
    {id:`duree`,type:`radio`,label:`Duree chirurgie`,options:[{value:0,label:`< 2h`},{value:5,label:`> 2h`}]},
    {id:`urgence`,type:`boolean`,label:`Urgence`,weight:8},
  ],
  calculate: (values) => {
    const s = (values.age??0)+(values.sp02??0)+(values.infection_resp?12:0)+(values.anemie?4:0)+(values.incision??0)+(values.duree??0)+(values.urgence?8:0)
    const sev = s>=45?'high':s>=26?'moderate':'low'
    const label = s < 26 ? 'Faible' : s < 45 ? 'Modere' : 'Eleve'
    const risk = s < 26 ? 1.6 : s < 45 ? 13.3 : 42.2
    return {value:s, label, risk, riskUnit:'% CPR', severity: sev,
      ranges:[
      {min:0,max:25,label:`Faible risque`,severity:`low`},
      {min:26,max:44,label:`Risque modere`,severity:`moderate`},
      {min:45,max:999,label:`Risque eleve`,severity:`high`},
      ]}
  },
  interpretation: `L\'ARISCAT predit les complications respiratoires post-operatoires (CPR). Score >= 45 = risque eleve.`,
  clinicalCommentary: `Valide en chirurgie non-cardiaque. Optimiser l\'Hb, traiter les infections respiratoires, kinesitherapie pre-op.`,
  references: [
    {type:`pubmed`,title:`Canet J et al. Eur Respir J 2010`,pmid:`20525716`}
  ],
}
export default ariscat
