import type { FormulaDefinition } from '../types'

const volventiladulte: FormulaDefinition = {
  id: `volventiladulte`, slug: `volventiladulte`,
  name: `Volume courant de ventilation (adulte)`,
  specialty: `anesthesie`, category: `Ventilation`,
  description: `Calcul du volume courant pour parametrage du respirateur (6-8 mL/kg poids ideal)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`poids_ideal`,type:`number`,label:`Poids ideal`,unit:`kg`,placeholder:`70`},
    {id:`mode`,type:`radio`,label:`Mode ventilatoire`,options:[{value:6,label:`Protection pulmonaire (6 mL/kg)`},{value:7,label:`Standard (7 mL/kg)`},{value:8,label:`Ventilation minute (8 mL/kg)`}]},
  ],
  calculate: (values) => {
    const p = values.poids_ideal ?? 70
    const m = values.mode ?? 7
    const vc = Math.round(p * m)
    return {value:vc, label: vc + ' mL', severity: 'low',
      ranges:[
      {min:0,max:0,label:`Veuillez entrer un poids et choisir un mode`,severity:`low`},
      ]}
  },
  interpretation: `Le volume courant se calcule sur le poids ideal. Protection pulmonaire: 6 mL/kg/PI avec PEEP.`,
  clinicalCommentary: `En SDRA, 6 mL/kg reduit la mortalite. Pression plateau < 30 cmH2O.`,
  references: [
    {type:`pubmed`,title:`ARDS Network. N Engl J Med 2000`,pmid:`10752862`}
  ],
}
export default volventiladulte
