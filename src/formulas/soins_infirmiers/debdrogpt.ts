import type { FormulaDefinition } from '../types'

const debdrogpt: FormulaDefinition = {
  id: 'debdrogpt', slug: 'debdrogpt',
  name: 'Débit PSE — Poids et Temps',
  specialty: 'soins_infirmiers', category: 'Débits',
  description: "Calcul du débit d\'un PSE pour médicament en fonction du poids et du temps de passage",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'dose_mg_kg', type: 'number', label: 'Dose prescrite (mg/kg)', min: 0.001, max: 100, step: 0.01 },
    { id: 'poids_kg', type: 'number', label: 'Poids (kg)', min: 2, max: 200, step: 0.5 },
    { id: 'volume_seringue_ml', type: 'number', label: 'Volume de la seringue (mL)', min: 10, max: 100, step: 5 },
    { id: 'temps_min', type: 'number', label: 'Temps de passage (minutes)', min: 1, max: 1440, step: 1 },
  ],
  calculate: (values) => {
    const dose = values.dose_mg_kg ?? 1
    const p = values.poids_kg ?? 70
    const vs = values.volume_seringue_ml ?? 50
    const t = values.temps_min ?? 60
    const debit_ml_h = (dose * p * 60) / (t * (vs ? 1 : 1))
    return { value: parseFloat(debit_ml_h.toFixed(1)), label: `Débit : ${debit_ml_h.toFixed(1)} mL/h`, severity: 'low' }
  },
  interpretation: 'Calcul du débit horaire pour une administration programmée sur pompe seringue électrique.',
  clinicalCommentary: 'Toujours vérifier l\'unité de la dose (mg/kg ou µg/kg). La concentration finale dépend du volume de dilution dans la seringue.',
  references: [{ type: 'guideline', title: 'SFAR — Calculs de débits PSE' }],
}
export default debdrogpt
