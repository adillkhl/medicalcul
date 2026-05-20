import type { FormulaDefinition } from '../types'

const lee: FormulaDefinition = {
  id: `lee`, slug: `lee`,
  name: `Lee (RCRI - Revised Cardiac Risk Index)`,
  specialty: `anesthesie`, category: `Risque cardiaque`,
  description: `Risque cardio-vasculaire perioperatoire en chirurgie non-cardiaque`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`chirurgie_haut_risque`,type:`boolean`,label:`Chirurgie haut risque (vasculaire, thoracique, abdominale)`,weight:1},
    {id:`coronaropathie`,type:`boolean`,label:`Coronaropathie (IDM, angor, stent)`,weight:1},
    {id:`insuffisance_cardiaque`,type:`boolean`,label:`Insuffisance cardiaque congestive`,weight:1},
    {id:`aec`,type:`boolean`,label:`AVC / AIT`,weight:1},
    {id:`diabete_insuline`,type:`boolean`,label:`Diabete insulino-traite`,weight:1},
    {id:`insuffisance_renale`,type:`boolean`,label:`Insuffisance renale (creatinine > 177 micromol/L)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.chirurgie_haut_risque?1:0)+(values.coronaropathie?1:0)+(values.insuffisance_cardiaque?1:0)+(values.aec?1:0)+(values.diabete_insuline?1:0)+(values.insuffisance_renale?1:0)
    const idx = s > 3 ? 3 : s
    const risks = [0.4, 0.9, 6.6, 11]
    const labels = ['Tres faible','Faible','Modere','Eleve']
    const sev = s>=2?'moderate':'low'
    return {value:s, label:labels[idx], risk:risks[idx], riskUnit:'% risque MACE', severity: sev,
      ranges:[
      {min:0,max:0,label:`< 1% risque cardiovasculaire`,severity:`low`},
      {min:1,max:1,label:`~1% risque`,severity:`low`},
      {min:2,max:2,label:`~7% risque, bilan cardiologique`,severity:`moderate`},
      {min:3,max:6,label:`> 11% risque, avis cardio obligatoire`,severity:`high`},
      ]}
  },
  interpretation: `Le RCRI de Lee predit le risque d\'evenements cardiaques majeurs en chirurgie non-cardiaque.`,
  clinicalCommentary: `Outil le plus valide pour le risque cardiaque perioperatoire. Si >= 2 facteurs, bilan cardio pre-op recommande.`,
  references: [
    {type:`pubmed`,title:`Lee TH et al. Circulation 1999`,pmid:`10436159`}
  ],
}
export default lee
