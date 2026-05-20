import type { FormulaDefinition } from '../types'

const pss: FormulaDefinition = {
  id: 'pss', slug: 'pss',
  name: 'Perceived Stress Scale (PSS-10)',
  specialty: 'psychiatrie', category: 'Évaluation',
  description: "Échelle de stress perçu de Cohen — version 10 items, score 0-40",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'q1', type: 'radio', label: "À quelle fréquence avez-vous été dérangé(e) par un événement inattendu ?", options: [
      { value: 0, label: "Jamais" }, { value: 1, label: "Presque jamais" }, { value: 2, label: "Parfois" },
      { value: 3, label: "Assez souvent" }, { value: 4, label: "Très souvent" },
    ]},
    { id: 'q2', type: 'radio', label: "À quelle fréquence avez-vous senti que vous ne pouviez pas contrôler les choses importantes ?", options: [
      { value: 0, label: "Jamais" }, { value: 1, label: "Presque jamais" }, { value: 2, label: "Parfois" },
      { value: 3, label: "Assez souvent" }, { value: 4, label: "Très souvent" },
    ]},
    { id: 'q3', type: 'radio', label: "Vous êtes-vous senti(e) nerveux(se) ou stressé(e) ?", options: [
      { value: 0, label: "Jamais" }, { value: 1, label: "Presque jamais" }, { value: 2, label: "Parfois" },
      { value: 3, label: "Assez souvent" }, { value: 4, label: "Très souvent" },
    ]},
    { id: 'q4', type: 'radio', label: "Vous êtes-vous senti(e) confiant(e) face à vos problèmes ?", options: [
      { value: 0, label: "Très souvent" }, { value: 1, label: "Assez souvent" }, { value: 2, label: "Parfois" },
      { value: 3, label: "Presque jamais" }, { value: 4, label: "Jamais" }, // inversé
    ]},
  ],
  calculate: (values) => {
    const total = (values.q1 ?? 0) + (values.q2 ?? 0) + (values.q3 ?? 0) + (values.q4 ?? 0)
    return { value: total, label: `PSS-10 : ${total}/40 (version 4 items)`, severity: total >= 12 ? 'high' : total >= 6 ? 'moderate' : 'low' }
  },
  interpretation: 'Le PSS-10 évalue le degré de stress perçu au cours du dernier mois. Score ≥ 20/40 indique un stress élevé. Version simplifiée 4 items présentée.',
  clinicalCommentary: "Échelle validée en population générale et clinique. Utiliser la version complète (10 items) pour un dépistage fiable. La version 4 items est un indicateur rapide.",
  references: [
    { type: 'pubmed', title: 'Cohen S et al. A global measure of perceived stress. J Health Soc Behav 1983', pmid: '6668417' },
  ],
}
export default pss
