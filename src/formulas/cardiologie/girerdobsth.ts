import type { FormulaDefinition } from '../types'

const girerdobsth: FormulaDefinition = {
  id: 'girerdobsth', slug: 'girerdobsth',
  name: 'Score d\'Observance Thérapeutique de Girerd (Obstacles)',
  specialty: 'cardiologie', category: 'Observance',
  description: 'Questionnaire de Girerd évaluant les obstacles à l\'observance thérapeutique chez le patient hypertendu ou cardiovasculaire',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'q1', type: 'boolean', label: 'Ce matin, avez-vous oublié de prendre votre traitement ?' },
    { id: 'q2', type: 'boolean', label: 'Depuis la dernière consultation, avez-vous été en panne de médicament ?' },
    { id: 'q3', type: 'boolean', label: 'Vous est-il arrivé de prendre votre traitement avec retard par rapport à l\'heure habituelle ?' },
    { id: 'q4', type: 'boolean', label: 'Vous est-il arrivé de ne pas prendre votre traitement parce que, certains jours, vous avez l\'impression que cela vous fait plus de mal que de bien ?' },
    { id: 'q5', type: 'boolean', label: 'Pensez-vous que vous avez trop de comprimés à prendre ?' },
    { id: 'q6', type: 'boolean', label: 'Vous est-il arrivé d\'arrêter votre traitement à cause de ses contraintes au quotidien ?' },
  ],
  calculate: (values) => {
    const total = (values.q1 ? 1 : 0) + (values.q2 ? 1 : 0) + (values.q3 ? 1 : 0) +
      (values.q4 ? 1 : 0) + (values.q5 ? 1 : 0) + (values.q6 ? 1 : 0)

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let evaluation = ''

    if (total === 0) {
      severity = 'low'
      label = 'Score Girerd : 0/6 — Bonne observance'
      evaluation = 'Aucun obstacle majeur à l\'observance. Patient observant.'
    } else if (total <= 2) {
      severity = 'moderate'
      label = `Score Girerd : ${total}/6 — Observance insuffisante`
      evaluation = `Obstacles mineurs (${total}/6). Proposer des conseils d\'organisation et d\'éducation thérapeutique.`
    } else if (total <= 4) {
      severity = 'high'
      label = `Score Girerd : ${total}/6 — Mauvaise observance`
      evaluation = `Obstacles modérés à sévères (${total}/6). Proposer un entretien pharmaceutique, l\'éducation thérapeutique, simplifier le traitement si possible.`
    } else {
      severity = 'critical'
      label = `Score Girerd : ${total}/6 — Très mauvaise observance`
      evaluation = `Obstacles sévères (${total}/6). Recours à l\'éducation thérapeutique, simplification thérapeutique majeure, suivi renforcé nécessaire.`
    }

    return {
      value: total,
      label,
      severity,
      details: {
        'Oubli ce matin': values.q1 ? 'Oui' : 'Non',
        'Panne de médicament': values.q2 ? 'Oui' : 'Non',
        'Prise en retard': values.q3 ? 'Oui' : 'Non',
        'Sensation de nuisance': values.q4 ? 'Oui' : 'Non',
        'Trop de comprimés': values.q5 ? 'Oui' : 'Non',
        'Arrêt par contrainte': values.q6 ? 'Oui' : 'Non',
        'Score total': `${total}/6`,
        'Évaluation': evaluation,
      },
      ranges: [
        { min: 0, max: 0, label: 'Bonne observance (0/6)', severity: 'low', recommendation: 'Renforcer les conseils. Maintenir la confiance.' },
        { min: 1, max: 2, label: 'Observance insuffisante (1-2/6)', severity: 'moderate', recommendation: 'Conseils d\'organisation. Éducation thérapeutique.' },
        { min: 3, max: 4, label: 'Mauvaise observance (3-4/6)', severity: 'high', recommendation: 'Entretien pharmaceutique. Simplifier le traitement.' },
        { min: 5, max: 6, label: 'Très mauvaise observance (5-6/6)', severity: 'critical', recommendation: 'Éducation thérapeutique intensive. Suivi rapproché.' },
      ],
    }
  },
  interpretation: 'Le **Score de Girerd** (2006) est un questionnaire validé en français d\'évaluation des obstacles à l\'observance thérapeutique, initialement développé pour les patients hypertendus.\n\n**6 questions** portant sur les obstacles concrets : oubli, panne, retard, sentiment de nuisance, contrainte du nombre de comprimés, contrainte au quotidien.\n\n**Score :** 0 = bonne observance, 1-2 = observance insuffisante, 3-4 = mauvaise observance, 5-6 = très mauvaise observance.',
  clinicalCommentary: 'L\'observance thérapeutique est un enjeu majeur dans les maladies cardiovasculaires et métaboliques. Le score de Girerd est simple, rapide (1 minute) et validé en français. Il permet d\'identifier les obstacles concrets pour y apporter des solutions personnalisées (simplification thérapeutique, éducation, entretien pharmaceutique).',
  references: [
    { type: 'pubmed', title: 'Girerd X et al. Évaluation de l\'observance thérapeutique par auto-questionnaire. Arch Mal Cœur 2001', pmid: '11725712' },
    { type: 'url', title: 'Mesures de l\'observance — HAS 2014', url: 'https://www.has-sante.fr/' },
  ],
}
export default girerdobsth
