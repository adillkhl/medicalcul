import type { FormulaDefinition } from '../types'

const debpse: FormulaDefinition = {
  id: 'debpse', slug: 'debpse',
  name: 'Débit PSE (Pompe Seringue Électrique)',
  specialty: 'soins_infirmiers', category: 'Débits',
  description: "Calcul du débit d\'une PSE en mL/h à partir de la dose, du poids et de la concentration",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'dose_mg_h', type: 'number', label: 'Dose prescrite (mg/h ou UI/h)', min: 0.001, max: 1000, step: 0.1 },
    { id: 'concentration_mg_ml', type: 'number', label: 'Concentration (mg/mL ou UI/mL)', min: 0.01, max: 100, step: 0.1 },
  ],
  calculate: (values) => {
    const d = values.dose_mg_h ?? 5
    const c = values.concentration_mg_ml ?? 1
    const debit = d / c
    return { value: parseFloat(debit.toFixed(1)), label: `Débit PSE : ${debit.toFixed(1)} mL/h`, severity: 'low' }
  },
  interpretation: 'Débit PSE (mL/h) = dose prescrite (mg/h) / concentration (mg/mL).',
  clinicalCommentary: 'Préparation : diluer le médicament dans le volume total de la seringue. Exemple : Héparine 20000 UI/48h → 20000/48 = 416 UI/h, avec 20000 UI dans 50 mL = 400 UI/mL, débit = 1.04 mL/h.',
  references: [{ type: 'guideline', title: 'SFAR — PSE mode d\'emploi' }],
}
export default debpse
