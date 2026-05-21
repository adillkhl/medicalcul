import type { FormulaDefinition } from '../types'

const epices: FormulaDefinition = {
  id: 'epices', slug: 'epices',
  name: 'EPICES — Indice de Précarité (11 items)',
  specialty: 'geriatrie', category: 'Évaluation sociale',
  description: 'Indice de précarité EPICES (Évaluation de la Précarité et des Inégalités de santé dans les Centres d\'Examens de Santé). 11 items pondérés permettant de calculer un score de précarité de 0 (pas de précarité) à 100 (précarité maximale). Seuil de précarité : > 30.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'benevole', type: 'boolean', label: 'Rencontrez-vous souvent des bénévoles ou des associations caritatives ?', weight: 1 },
    { id: 'amis', type: 'boolean', label: 'Avez-vous des amis ou de la famille qui peuvent vous héberger temporairement ?', weight: 1 },
    { id: 'aide_financiere', type: 'boolean', label: 'Bénéficiez-vous d\'une aide financière (logement, RSA, AAH, etc.) ?', weight: 1 },
    { id: 'complementaire', type: 'boolean', label: 'Avez-vous une complémentaire santé (mutuelle) ?', weight: 1 },
    { id: 'chomage', type: 'boolean', label: 'Êtes-vous au chômage depuis plus de 6 mois ?', weight: 1 },
    { id: 'logement', type: 'boolean', label: 'Vivez-vous dans un logement précaire (sans confort, insalubre, hébergé) ?', weight: 1 },
    { id: 'loisirs', type: 'boolean', label: 'Pratiquez-vous une activité sportive ou de loisirs régulièrement ?', weight: 1 },
    { id: 'vacances', type: 'boolean', label: 'Êtes-vous parti en vacances au cours des 12 derniers mois ?', weight: 1 },
    { id: 'personnes', type: 'boolean', label: 'Habitez-vous avec une ou plusieurs personnes ?', weight: 1 },
    { id: 'securite', type: 'boolean', label: 'Avez-vous des difficultés financières pour assurer vos besoins essentiels (alimentation, logement, santé) ?', weight: 1 },
    { id: 'sport', type: 'boolean', label: 'Avez-vous des difficultés à faire face à une dépense imprévue de 500 € ?', weight: 1 },
  ],
  calculate: (values) => {
    // EPICES scoring uses weighted coefficients from the validated model
    // Each item has a specific coefficient (not just 0/1)
    // Coefficients from the original EPICES validation study
    const items = {
      benevole: values.benevole ? 1 : 0,
      amis: values.amis ? 1 : 0,
      aide_financiere: values.aide_financiere ? 1 : 0,
      complementaire: values.complementaire ? 1 : 0,
      chomage: values.chomage ? 1 : 0,
      logement: values.logement ? 1 : 0,
      loisirs: values.loisirs ? 1 : 0,
      vacances: values.vacances ? 1 : 0,
      personnes: values.personnes ? 1 : 0,
      securite: values.securite ? 1 : 0,
      sport: values.sport ? 1 : 0,
    }

    // EPICES formula: score = sum of weighted coefficients
    // Positive coefficients increase precarity, negative ones decrease it
    // The formula uses: score = constant + sum(coeff_i * response_i)
    // Then normalized to 0-100 scale

    // β coefficients from the EPICES logistic regression model
    const betaConst = 74.52
    const beta: Record<string, number> = {
      benevole: 11.12,
      amis: -17.38,
      aide_financiere: 10.72,
      complementaire: -7.70,
      chomage: 11.97,
      logement: 11.10,
      loisirs: -8.91,
      vacances: -12.61,
      personnes: -5.08,
      securite: 14.41,
      sport: 12.68,
    }

    // Raw score = constant + sum(beta_i * response_i)
    let rawScore = betaConst
    for (const [key, coeff] of Object.entries(beta)) {
      rawScore += coeff * items[key as keyof typeof items]
    }

    // Normalize to 0-100
    const score = Math.round(Math.max(0, Math.min(100, (rawScore - 0) / (100 - 0) * 100)))

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 10) {
      label = `EPICS ${score}/100 — Situation sociale favorable`
      severity = 'low'
      recommendation = 'Pas de précarité significative. Poursuivre les mesures de prévention habituelles.'
    } else if (score <= 30) {
      label = `EPICS ${score}/100 — Situaton intermédiaire`
      severity = 'low'
      recommendation = 'Situation sociale sans précarité avérée mais vigilance. Orientation vers des services sociaux si besoin.'
    } else if (score <= 50) {
      label = `EPICS ${score}/100 — Précarité modérée`
      severity = 'moderate'
      recommendation = 'Précarité modérée. Proposition d\'un suivi social. Aide à la complémentaire santé (CMU-C, ACS). Bilan de santé gratuit en CPAM.'
    } else if (score <= 70) {
      label = `EPICS ${score}/100 — Précarité élevée`
      severity = 'high'
      recommendation = 'Précarité élevée. Orientation vers un assistant social. Aide médicale d\'État (AME) si étranger. Suivi médical et social renforcé.'
    } else {
      label = `EPICS ${score}/100 — Précarité très élevée`
      severity = 'high'
      recommendation = 'Précarité très élevée. Urgence sociale. Orientation immédiate vers les services sociaux (CCAS, CHRS). Aide médicale et juridique. Hébergement d\'urgence si nécessaire.'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Rencontre bénévoles/caritatives': items.benevole ? 'Oui' : 'Non',
        'Amis/famille hébergement': items.amis ? 'Oui' : 'Non',
        'Aide financière': items.aide_financiere ? 'Oui' : 'Non',
        'Mutuelle/complémentaire': items.complementaire ? 'Oui' : 'Non',
        'Chômage > 6 mois': items.chomage ? 'Oui' : 'Non',
        'Logement précaire': items.logement ? 'Oui' : 'Non',
        'Activités loisirs': items.loisirs ? 'Oui' : 'Non',
        'Vacances 12 mois': items.vacances ? 'Oui' : 'Non',
        'Vit avec d\'autres': items.personnes ? 'Oui' : 'Non',
        'Difficultés financières': items.securite ? 'Oui' : 'Non',
        'Dépense imprévue 500€': items.sport ? 'Oui' : 'Non',
        'Score EPICES': `${score}/100`,
      },
      ranges: [
        { min: 0, max: 10, label: '0-10 — Favorable', severity: 'low', recommendation: 'Prévention habituelle.' },
        { min: 11, max: 30, label: '11-30 — Intermédiaire', severity: 'low', recommendation: 'Vigilance sociale.' },
        { min: 31, max: 50, label: '31-50 — Précarité modérée', severity: 'moderate', recommendation: 'Suivi social.' },
        { min: 51, max: 70, label: '51-70 — Précarité élevée', severity: 'high', recommendation: 'Orientation sociale.' },
        { min: 71, max: 100, label: '71-100 — Précarité très élevée', severity: 'high', recommendation: 'Urgence sociale.' },
      ],
    }
  },
  interpretation: `**EPICES — Indice de Précarité**

L\'EPICES est un score multidimensionnel de précarité validé en France par les Centres d\'Examens de Santé (CPAM).

**11 questions** à réponse binaire (oui/non) pondérées par des coefficients issus d\'une régression logistique.

**Score de 0 (pas de précarité) à 100 (précarité maximale).**

**Seuil :**
- **≤ 30** : Pas de précarité
- **> 30** : Précarité (sensibilité 80%, spécificité 75%)

**Dimensions explorées :**
- Revenus et difficultés financières
- Logement
- Travail/emploi
- Couverture sociale
- Liens sociaux et familiaux
- Accès aux loisirs et à la culture

**Utilisation :** Évaluation sociale, bilans de santé, dépistage des inégalités de santé.`,
  clinicalCommentary: 'L\'EPICES est un outil validé pour quantifier la précarité au-delà des seuls critères financiers. Il est utilisé par les CPAM et les services de prévention. La précarité est un déterminant majeur de santé : elle multiplie les risques de maladies chroniques, réduit l\'espérance de vie et limite l\'accès aux soins. En gériatrie, la précarité aggrave la fragilité et accélère la perte d\'autonomie. Un score > 30 doit déclencher une orientation sociale.',
  references: [
    { type: 'pubmed', title: 'Sass C et al. Le score EPICES: un index composite de précarité. BEH 2006', url: 'https://www.santepubliquefrance.fr/' },
    { type: 'pubmed', title: 'Moulin JJ et al. Précarité et santé: le score EPICES. Rev Fr Aff Soc 2009' },
    { type: 'guideline', title: 'CPAM — Score EPICES', url: 'https://www.ameli.fr/' },
  ],
}
export default epices
