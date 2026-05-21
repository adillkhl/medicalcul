import type { FormulaDefinition } from '../types'

const diurese_horaire: FormulaDefinition = {
  id: 'diurese_horaire', slug: 'diurese_horaire',
  name: 'Interprétation du Débit Urinaire Horaire',
  specialty: 'reanimation', category: 'Hémodynamique',
  description: 'Interprétation du débit urinaire horaire (diurèse) en réanimation — évaluation de la fonction rénale',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'volume_urine_ml', type: 'number', label: 'Volume urinaire (mL)', min: 0, max: 2000, step: 10 },
    { id: 'temps_h', type: 'number', label: 'Temps de recueil (heures)', min: 1, max: 24, step: 1 },
    { id: 'poids_kg', type: 'number', label: 'Poids (kg)', min: 2, max: 200, step: 0.5 },
  ],
  calculate: (values) => {
    const vol = values.volume_urine_ml ?? 0
    const t = values.temps_h ?? 1
    const p = values.poids_kg ?? 70
    const debit_ml_h = vol / t
    const debit_ml_kg_h = debit_ml_h / p
    return { value: parseFloat(debit_ml_kg_h.toFixed(2)), label: `Débit urinaire : ${debit_ml_kg_h.toFixed(2)} mL/kg/h (${debit_ml_h.toFixed(0)} mL/h)`,
      severity: debit_ml_kg_h < 0.5 ? 'high' : debit_ml_kg_h < 1 ? 'moderate' : 'low',
      details: { Débit: `${debit_ml_h.toFixed(0)} mL/h`, 'mL/kg/h': `${debit_ml_kg_h.toFixed(2)}` } }
  },
  interpretation: 'Diurèse normale : ≥ 1 mL/kg/h. Oligurie : < 0.5 mL/kg/h (critère KDIGO stade 2/3 d\'IRA).',
  clinicalCommentary: 'La diurèse est un marqueur précoce de l\'insuffisance rénale aiguë. Toujours interpréter avec la volémie et la PA. Les diurétiques peuvent fausser l\'interprétation.',
  references: [{ type: 'pubmed', title: 'KDIGO — Acute Kidney Injury Work Group. Kidney Int Suppl 2012' }],
}
export default diurese_horaire
