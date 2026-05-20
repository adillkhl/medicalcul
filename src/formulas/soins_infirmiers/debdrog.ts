import type { FormulaDefinition } from '../types'

const debdrog: FormulaDefinition = {
  id: 'debdrog', slug: 'debdrog',
  name: 'Débit PSE — Drogue Vasoactive',
  specialty: 'soins_infirmiers', category: 'Débits',
  description: "Calcul du débit de PSE pour drogue vasoactive (Noradrénaline, Dobutamine, etc.) en mL/h à partir du poids et de la dose prescrite",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'poids_kg', type: 'number', label: 'Poids (kg)', min: 2, max: 200, step: 0.5 },
    { id: 'dose_mcg_kg_min', type: 'number', label: 'Dose prescrite (µg/kg/min)', min: 0, max: 100, step: 0.01 },
    { id: 'dilution_mcg_ml', type: 'number', label: 'Concentration dilution (µg/mL)', min: 10, max: 20000, step: 10 },
  ],
  calculate: (values) => {
    const p = values.poids_kg ?? 70
    const dose = values.dose_mcg_kg_min ?? 0.1
    const conc = values.dilution_mcg_ml ?? 500
    const debit_ml_h = (dose * p * 60) / conc
    return { value: parseFloat(debit_ml_h.toFixed(1)), label: `Débit : ${debit_ml_h.toFixed(1)} mL/h`, severity: 'low',
      details: { Poids: `${p} kg`, Dose: `${dose} µg/kg/min`, Conc: `${conc} µg/mL`, Débit: `${debit_ml_h.toFixed(1)} mL/h` } }
  },
  interpretation: 'Débit (mL/h) = (dose en µg/kg/min × poids × 60) / concentration en µg/mL.',
  clinicalCommentary: 'Préparation standard : Noradrénaline 8 mg dans 50 mL (160 µg/mL). Dobutamine 250 mg dans 50 mL (5000 µg/mL). Doubler le contrôle du calcul.',
  references: [{ type: 'guideline', title: 'SFAR — Administration des drogues vasoactives' }],
}
export default debdrog
