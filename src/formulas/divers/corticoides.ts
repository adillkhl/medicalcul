import type { FormulaDefinition } from '../types'

const corticoides: FormulaDefinition = {
  id: 'corticoides', slug: 'corticoides',
  name: 'Équivalences Corticoïdes',
  specialty: 'divers', category: 'Pharmacologie',
  description: 'Table d\'équivalence anti-inflammatoire des glucocorticoïdes — doses équivalentes et puissance relative',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'type_cortico', type: 'radio', label: 'Glucocorticoïde source', options: [
      { value: 0, label: 'Prednisone (Cortancyl™)' },
      { value: 1, label: 'Prednisolone (Solupred™)' },
      { value: 2, label: 'Méthylprednisolone (Medrol™, Solumédrol™)' },
      { value: 3, label: 'Hydrocortisone' },
      { value: 4, label: 'Dexaméthasone' },
      { value: 5, label: 'Bétaméthasone (Célestène™)' },
      { value: 6, label: 'Triamcinolone (Kénacort™)' },
    ]},
    { id: 'dose_mg', type: 'number', label: 'Dose source (mg/j)', min: 0, max: 1000, step: 5 },
  ],
  calculate: (values) => {
    const t = values.type_cortico ?? 0
    const d = values.dose_mg ?? 10
    const eq_pred = [1, 1, 0.8, 5, 0.125, 0.125, 0.16][t]
    const dose_pred_eq = d * eq_pred
    const equivalents = [10, 10, 8, 50, 1.25, 1.25, 1.6]
    return { value: parseFloat(dose_pred_eq.toFixed(0)), label: `Équivalent prednisone : ${dose_pred_eq.toFixed(0)} mg/j`,
      details: {
        Prednisone: `${(d * (eq_pred * 1)).toFixed(0)} mg`,
        'Méthylprednisolone': `${(d * (eq_pred * 0.8)).toFixed(0)} mg`,
        Hydrocortisone: `${(d * (eq_pred * 5)).toFixed(0)} mg`,
        Dexaméthasone: `${(d * (eq_pred * 0.125)).toFixed(0)} mg`,
      },
      severity: dose_pred_eq > 40 ? 'moderate' : dose_pred_eq > 10 ? 'low' : 'low' }
  },
  interpretation: 'Puissance relative (prednisone = 1) : hydrocortisone 0.2, prednisolone 1, méthylprednisolone 1.25, dexaméthasone 8, bétaméthasone 8.',
  clinicalCommentary: 'L\'équivalence anti-inflammatoire est différente de l\'équivalence minéralocorticoïde. La dexaméthasone n\'a pas d\'effet minéralocorticoïde.',
  references: [{ type: 'guideline', title: 'Équivalences corticoïdes — Vidal / ANSM' }],
}
export default corticoides
