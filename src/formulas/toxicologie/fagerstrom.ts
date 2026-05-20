import type { FormulaDefinition } from '../types'

const fagerstrom: FormulaDefinition = {
  id: 'fagerstrom',
  slug: 'fagerstrom',
  name: 'Fagerström (Test)',
  specialty: 'toxicologie',
  category: 'Tabac',
  description: 'Test de Fagerström — évaluation de la dépendance à la nicotine. Utile pour guider l\'intensité du traitement de substitution nicotinique et le sevrage tabagique.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'time_first_cig',
      type: 'radio',
      label: 'Combien de temps après le réveil fumez-vous votre première cigarette ?',
      options: [
        { value: 3, label: 'Dans les 5 minutes' },
        { value: 2, label: 'Entre 6 et 30 minutes' },
        { value: 1, label: 'Entre 31 et 60 minutes' },
        { value: 0, label: 'Après 60 minutes' },
      ],
    },
    {
      id: 'no_smoke_places',
      type: 'boolean',
      label: 'Trouvez-vous difficile de ne pas fumer dans les endroits où c\'est interdit ?',
    },
    {
      id: 'most_important_cig',
      type: 'boolean',
      label: 'Quelle cigarette détesteriez-vous le plus perdre ? (la première du matin ou une autre)',
    },
    {
      id: 'cig_per_day',
      type: 'radio',
      label: 'Combien de cigarettes fumez-vous par jour ?',
      options: [
        { value: 0, label: '10 ou moins' },
        { value: 1, label: '11-20' },
        { value: 2, label: '21-30' },
        { value: 3, label: '31 ou plus' },
      ],
    },
    {
      id: 'more_morning',
      type: 'boolean',
      label: 'Fumez-vous davantage dans les premières heures après le réveil que pendant le reste de la journée ?',
    },
    {
      id: 'sick_when_smoking',
      type: 'boolean',
      label: 'Fumez-vous même si vous êtes très malade, alité ou malade au point de rester au lit presque toute la journée ?',
    },
  ],
  calculate: (values) => {
    const timeFirst = values.time_first_cig as number
    const noSmoke = values.no_smoke_places as boolean
    const mostImportant = values.most_important_cig as boolean
    const cigPerDay = values.cig_per_day as number
    const moreMorning = values.more_morning as boolean
    const sickWhen = values.sick_when_smoking as boolean

    let score = timeFirst

    if (noSmoke) score += 1
    if (mostImportant) score += 1
    score += cigPerDay
    if (moreMorning) score += 1
    if (sickWhen) score += 1

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''
    let nicotineReplacement = ''

    if (score <= 3) {
      label = 'Dépendance faible'
      severity = 'low'
      recommendation = 'Traitement nicotinique non obligatoire. Substituts à la demande (gommes 2 mg, pastilles 2 mg). Accompagnement comportemental.'
      nicotineReplacement = 'Substituts à la demande (gommes 2 mg)'
    } else if (score <= 6) {
      label = 'Dépendance modérée'
      severity = 'moderate'
      recommendation = 'Traitement nicotinique de substitution recommandé (patch 14-21 mg/24h + formes orales si besoin). Suivi spécialisé possible.'
      nicotineReplacement = 'Patch 14-21 mg/24h + formes orales'
    } else {
      label = 'Dépendance forte'
      severity = 'high'
      recommendation = 'Traitement nicotinique substitutif à haute dose (patch 21-35 mg/24h + formes orales) ou varénicline (Champix®). Consultation d\'addictologie recommandée. Association des substituts +++.'
      nicotineReplacement = 'Patch 21-35 mg/24h + formes orales intensives'
    }

    return {
      value: score,
      label,
      severity,
      details: {
        'Substitution suggérée': nicotineReplacement,
      },
      ranges: [
        { min: 0, max: 3, label: 'Dépendance faible', severity: 'low', recommendation: 'Substituts à la demande' },
        { min: 4, max: 6, label: 'Dépendance modérée', severity: 'moderate', recommendation: 'Patch 14-21 mg + formes orales' },
        { min: 7, max: 10, label: 'Dépendance forte', severity: 'high', recommendation: 'Patch 21-35 mg + formes orales ± varénicline' },
      ],
    }
  },
  interpretation: `Le **test de Fagerström** (échelle de dépendance à la nicotine) comporte 6 questions.

**Score total : 0 à 10**
- **0-3** : Dépendance faible
- **4-6** : Dépendance modérée
- **7-10** : Dépendance forte

Un score ≥ 7 indique une dépendance sévère justifiant une substitution nicotinique intensive (patch 21-35 mg + formes orales) ou un traitement pharmacologique de seconde ligne (varénicline).`,
  clinicalCommentary: `Le test de Fagerström est un prérequis à toute consultation de sevrage tabagique. Il permet de déterminer l\'intensité du traitement de substitution nicotinique. La règle générale est de prescrire 1 mg de nicotine par cigarette fumée, soit un patch de 21 mg pour 20 cig/j. Attention aux interactions : la nicotine est un substrat du CYP1A2 — le sevrage tabagique peut augmenter les taux des médicaments métabolisés par cette enzyme (clozapine, caféine, théophylline).`,
  references: [
    {
      type: 'pubmed',
      title: 'Heatherton TF et al. The Fagerström Test for Nicotine Dependence: a revision of the Fagerström Tolerance Questionnaire. Br J Addict 1991',
      pmid: '2379333',
    },
    {
      type: 'pubmed',
      title: 'Fagerström K. Determinants of tobacco use and renaming the FTND to the Fagerström Test for Cigarette Dependence. Nicotine Tob Res 2012',
      pmid: '22180573',
    },
  ],
}

export default fagerstrom
