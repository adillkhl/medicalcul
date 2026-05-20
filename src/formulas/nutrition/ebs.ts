import type { FormulaDefinition } from '../types'

const ebs: FormulaDefinition = {
  id: 'ebs', slug: 'ebs',
  name: "Échelle de Comportement Alimentaire (EBS)",
  specialty: 'nutrition', category: 'Comportement',
  description: "Questionnaire d\'évaluation du comportement alimentaire (Eating Behavior Scale)",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'grignotage', type: 'radio', label: 'Grignotage entre les repas', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
    { id: 'compulsion', type: 'radio', label: 'Compulsion alimentaire (crise de boulimie)', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
    { id: 'emotionnel', type: 'radio', label: 'Alimentation émotionnelle (stress, tristesse)', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
    { id: 'restriction', type: 'radio', label: 'Restriction alimentaire volontaire', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Parfois' }, { value: 2, label: 'Souvent' }, { value: 3, label: 'Toujours' }] },
  ],
  calculate: (values) => {
    const total = (values.grignotage ?? 0) + (values.compulsion ?? 0) + (values.emotionnel ?? 0) + (values.restriction ?? 0)
    return { value: total, label: `EBS : ${total}/12`, severity: total >= 8 ? 'high' : total >= 5 ? 'moderate' : 'low' }
  },
  interpretation: "Score élevé = trouble du comportement alimentaire probable. Orientation vers diététicien/psychologue.",
  clinicalCommentary: "Échelle simple de repérage. À compléter par le SCOFF (TCA) et un bilan diététique.",
  references: [{ type: 'pubmed', title: 'Eating Behavior Scale — Validation study' }],
}
export default ebs
