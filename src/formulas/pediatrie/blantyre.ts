import type { FormulaDefinition } from '../types'

const blantyre: FormulaDefinition = {
  id: 'blantyre', slug: 'blantyre',
  name: 'Score de Blantyre',
  specialty: 'pediatrie', category: 'Neurologie',
  description: 'Score de coma pour l\'enfant (0-5), utilisé dans le paludisme cérébral',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'meilleur_oeil', type: 'radio', label: 'Meilleure réponse oculaire', options: [
      { value: 1, label: 'Poursuite du regard / clignement à la menace' },
      { value: 0, label: 'Absente ou inappropriée' },
    ]},
    { id: 'meilleur_verbal', type: 'radio', label: 'Meilleure réponse verbale', options: [
      { value: 2, label: 'Crie approprié / pleure normal' },
      { value: 1, label: 'Gémissements / cris inappropriés' },
      { value: 0, label: 'Aucune réponse' },
    ]},
    { id: 'meilleur_moteur', type: 'radio', label: 'Meilleure réponse motrice', options: [
      { value: 2, label: 'Localise la douleur' },
      { value: 1, label: 'Retrait ou flexion à la douleur' },
      { value: 0, label: 'Aucune réponse' },
    ]},
  ],
  calculate: (values) => {
    const total = (values.meilleur_oeil ?? 0) + (values.meilleur_verbal ?? 0) + (values.meilleur_moteur ?? 0)
    return { value: total, label: `Score de Blantyre : ${total}/5`,
      severity: total <= 2 ? 'high' : total <= 3 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≤ 2 définit le coma (paludisme cérébral). Pronostic réservé.',
  clinicalCommentary: 'Développé pour le paludisme cérébral (Afrique). Alternative au Glasgow chez le jeune enfant.',
  references: [{ type: 'pubmed', title: 'Molyneux ME et al. QJM 1989', pmid: '2690254' }],
}
export default blantyre
