import type { FormulaDefinition } from '../types'

const irastades: FormulaDefinition = {
  id: 'irastades', slug: 'irastades',
  name: 'Stades de l\'Insuffisance Rénale Aiguë (IRA)',
  specialty: 'nephrologie', category: 'IRA',
  description: 'Classification KDIGO des stades d\'insuffisance rénale aiguë',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'creatinine', type: 'radio', label: 'Créatinine', options: [
      { value: 0, label: 'Normale ou < ×1.5' },
      { value: 1, label: '×1.5 à ×1.9 (ou augmentation ≥ 0.3 mg/dL)' },
      { value: 2, label: '×2.0 à ×2.9' },
      { value: 3, label: '×3.0 ou ≥ 4.0 mg/dL (ou RRT)' },
    ]},
    { id: 'diurese', type: 'radio', label: 'Diurèse', options: [
      { value: 0, label: '≥ 0.5 mL/kg/h' },
      { value: 1, label: '< 0.5 mL/kg/h pendant 6-12h' },
      { value: 2, label: '< 0.5 mL/kg/h pendant ≥ 12h' },
      { value: 3, label: '< 0.3 mL/kg/h pendant ≥ 24h ou anurie ≥ 12h' },
    ]},
  ],
  calculate: (values) => {
    const c = values.creatinine ?? 0; const d = values.diurese ?? 0
    const stade = Math.max(c, d)
    return { value: stade, label: `IRA — KDIGO Stade ${stade}`, severity: stade >= 3 ? 'high' : stade >= 2 ? 'moderate' : stade >= 1 ? 'low' : 'low' }
  },
  interpretation: 'Stade 1 : surveillance, optimisation volémie, arrêt néphrotoxiques. Stade 2 : discussion RRT. Stade 3 : RRT indiquée.',
  clinicalCommentary: 'Utiliser le pire stade entre créatinine et diurèse. Le KDIGO a remplacé RIFLE et AKIN. La créatinine et la diurèse sont indépendantes.',
  references: [{ type: 'pubmed', title: 'KDIGO AKI, Kidney Int Suppl 2012', pmid: '25018920' }],
}
export default irastades
