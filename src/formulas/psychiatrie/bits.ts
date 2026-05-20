import type { FormulaDefinition } from '../types'

const bits: FormulaDefinition = {
  id: 'bits', slug: 'bits',
  name: 'BITS-Test (Bref Inventaire de Troubles du Sommeil)',
  specialty: 'psychiatrie', category: 'Sommeil',
  description: 'Questionnaire d\'évaluation rapide des troubles du sommeil',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'q1', type: 'radio', label: 'Difficultés d\'endormissement', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
    { id: 'q2', type: 'radio', label: 'Réveils nocturnes fréquents', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
    { id: 'q3', type: 'radio', label: 'Réveil précoce sans re-endormissement', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
    { id: 'q4', type: 'radio', label: 'Sommeil non récupérateur', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
    { id: 'q5', type: 'radio', label: 'Somnolence diurne excessive', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
  ],
  calculate: (values) => {
    const total = (values.q1 ?? 0) + (values.q2 ?? 0) + (values.q3 ?? 0) + (values.q4 ?? 0) + (values.q5 ?? 0)
    return { value: total, label: `BITS-Test : ${total}/15`, severity: total >= 8 ? 'high' : total >= 5 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 8 : trouble du sommeil significatif. Score 5-7 : à surveiller.',
  clinicalCommentary: 'Outil simple pour le dépistage en médecine générale. Ne remplace pas un agenda du sommeil ni une polysomnographie.',
  references: [{ type: 'pubmed', title: 'BITS — Questionnaire de dépistage des troubles du sommeil' }],
}
export default bits
