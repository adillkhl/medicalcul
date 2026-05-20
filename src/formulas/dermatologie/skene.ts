import type { FormulaDefinition } from '../types'

const skene: FormulaDefinition = {
  id: 'skene', slug: 'skene',
  name: 'Indice de Skene',
  specialty: 'dermatologie', category: 'Brûlures',
  description: 'Classification de la gravité des brûlures selon l\'indice de Skene (âge + surface brûlée)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_ans', type: 'number', label: 'Âge (ans)', min: 0, max: 120, step: 1 },
    { id: 'surface_pct', type: 'number', label: 'Surface brûlée (% SC)', min: 0, max: 100, step: 1 },
  ],
  calculate: (values) => {
    const age = values.age_ans ?? 30
    const sc = values.surface_pct ?? 10
    const index = age + sc
    return { value: index, label: `Indice de Skene : ${index} (âge ${age} + SC ${sc}%)`, severity: index >= 100 ? 'high' : index >= 60 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 30, label: 'Pronostic bon', severity: 'low' },
        { min: 30, max: 59, label: 'Pronostic réservé', severity: 'moderate' },
        { min: 60, max: 99, label: 'Pronostic grave', severity: 'high' },
        { min: 100, max: Infinity, label: 'Pronostic très grave', severity: 'high' },
      ] }
  },
  interpretation: 'L\'indice de Skene (âge + surface brûlée) est un score pronostic simple dans les brûlures graves.',
  clinicalCommentary: 'Plus simple que le Baux score (âge + SC + inhalation). Indice > 100 = pronostic sombre. Utile au triage initial.',
  references: [{ type: 'pubmed', title: 'Skene — A prognostic index for burns' }],
}
export default skene
