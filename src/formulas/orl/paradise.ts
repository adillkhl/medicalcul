import type { FormulaDefinition } from '../types'

const paradise: FormulaDefinition = {
  id: 'paradise',
  slug: 'paradise',
  name: 'Paradise — Indications d\'amygdalectomie',
  specialty: 'orl',
  category: 'Pédiatrie ORL',
  description: 'Critères de Paradise pour l\'indication d\'amygdalectomie chez l\'enfant — angines récurrentes',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'freqMin',
      type: 'radio',
      label: 'Fréquence des angines',
      options: [
        { value: 0, label: '< 3 épisodes par an' },
        { value: 1, label: '≥ 3 épisodes par an' },
        { value: 2, label: '≥ 4 épisodes par an' },
        { value: 3, label: '≥ 7 épisodes par an' },
        { value: 4, label: '≥ 7 épisodes par an depuis > 1 an' },
      ],
    },
    {
      id: 'severity',
      type: 'radio',
      label: 'Sévérité des épisodes',
      options: [
        { value: 0, label: 'Angines simples, bien tolérées' },
        { value: 1, label: 'Fièvre > 38,3°C + exsudats + TDR strepto+' },
        { value: 2, label: '≥ 1 complication (abcès, otite, RAA)' },
      ],
    },
    {
      id: 'treatment',
      type: 'radio',
      label: 'Traitement médical préalable',
      options: [
        { value: 0, label: 'Aucun essai de traitement préventif' },
        { value: 1, label: 'Antibiothérapie curative à chaque épisode' },
        { value: 2, label: 'Échec de traitement chirurgical (est un retraitement ?)' },
      ],
    },
    {
      id: 'absenteeism',
      type: 'boolean',
      label: 'Absentéisme scolaire significatif (> 2 semaines/an)',
    },
    {
      id: 'duration',
      type: 'boolean',
      label: 'Symptômes depuis ≥ 1 an',
    },
  ],
  calculate: (values) => {
    const freq = values.freqMin ?? 0
    const sev = values.severity ?? 0
    const treat = values.treatment ?? 0
    const absentee = !!values.absenteeism
    const chronic = !!values.duration

    // Paradise strict criteria: ≥ 7 episodes in 1 year, or ≥ 5/year for 2 years, or ≥ 3/year for 3 years
    const freqStrict = freq >= 3 // 7+ episodes/year or 4-6
    const chronicStrict = chronic && freq >= 2 // ≥ 4/year since > 1 year
    const freqModerate = freq >= 1 && freq < 3 // 3-6 episodes
    const severeEpisodes = sev >= 1

    // Score for indication strength
    const indicationScore = freq + sev + treat + (absentee ? 2 : 0) + (chronic ? 2 : 0)

    if (indicationScore >= 8) {
      return {
        value: indicationScore,
        label: 'Indication FORTE d\'amygdalectomie',
        severity: 'high',
        ranges: [
          { min: 8, max: 14, label: 'Indication FORTE', severity: 'high', recommendation: 'Amygdalectomie indiquée selon critères Paradise ≥ 7 épisodes/an OU ≥ 5/an × 2 ans OU ≥ 3/an × 3 ans avec documentation médicale. Procédure : amygdalectomie extracapsulaire totale (laser CO2, coblator, ou dissection froide). Discussion bénéfices/risques avec la famille.' },
          { min: 4, max: 7, label: 'Indication MODÉRÉE', severity: 'moderate', recommendation: 'Indication discutable. Période d\'observation recommandée (6-12 mois). Traitement médical préventif à discuter. Réévaluation après observation.' },
          { min: 0, max: 3, label: 'Pas d\'indication', severity: 'low', recommendation: 'Pas d\'indication chirurgicale. Traitement symptomatique des épisodes aigus. Surveillance.' },
        ],
      }
    }

    if (indicationScore >= 4) {
      return {
        value: indicationScore,
        label: 'Indication MODÉRÉE — À discuter',
        severity: 'moderate',
        ranges: [
          { min: 0, max: 3, label: 'Pas d\'indication', severity: 'low' },
          { min: 4, max: 7, label: 'Indication MODÉRÉE', severity: 'moderate', recommendation: 'Discussion bénéfices/risques avec la famille. Alternative : période d\'observation de 6-12 mois. L\'amygdalectomie n\'est pas dénuée de risques (hémorragie post-op 1-5%, douleur, déshydratation).' },
          { min: 8, max: 14, label: 'Indication FORTE', severity: 'high' },
        ],
      }
    }

    return {
      value: indicationScore,
      label: 'Pas d\'indication chirurgicale',
      severity: 'low',
      ranges: [
        { min: 0, max: 3, label: 'Pas d\'indication', severity: 'low', recommendation: 'Pas d\'indication chirurgicale. Les critères Paradise ne sont pas remplis. Antibiothérapie curative des épisodes aigus. Éducation parentale.' },
        { min: 4, max: 7, label: 'Indication MODÉRÉE', severity: 'moderate' },
        { min: 8, max: 14, label: 'Indication FORTE', severity: 'high' },
      ],
    }
  },
  interpretation: `Les **critères de Paradise** (1984) sont la référence pour poser l'indication d'amygdalectomie chez l'enfant pour angines récurrentes.

**Critères stricts (Paradise) :**
- ≥ 7 épisodes d'angine dans l'année écoulée
- OU ≥ 5 épisodes/an pendant 2 ans
- OU ≥ 3 épisodes/an pendant 3 ans
- Chaque épisode doit être documenté (fièvre ≥ 38,3°C, exsudats, TDR+)

**Facteurs additionnels :**
- Sévérité des épisodes (complications)
- Absentéisme scolaire
- Retentissement sur la qualité de vie
- Échec du traitement médical

L'amygdalectomie n'est pas une procédure banale : hémorragie post-op (1-5%), douleur (7-10 jours), déshydratation.`,
  clinicalCommentary: `En pratique ORL, les critères de Paradise sont le standard légal et médical pour l'indication d'amygdalectomie chez l'enfant. La HAS et la SFORL recommandent de documenter chaque épisode (carnet de santé, ordo). Attention : ne pas opérer pour des "angines à répétition" non documentées. L'amygdalectomie réduit effectivement le nombre d'angines (NNT ~4), mais le bénéfice décroît avec l'âge. Chez l'adulte, les critères sont moins stricts (≥ 3 épisodes/an documentés). Alternative : amygdalectomie partielle (intracapsulaire) pour le syndrome d'apnée obstructif du sommeil.`,
  references: [
    {
      type: 'pubmed',
      title: 'Paradie JL et al. Efficacy of tonsillectomy for recurrent sore throat. N Engl J Med 1984',
      pmid: '6369137',
    },
    {
      type: 'guideline',
      title: 'HAS — Indications de l\'amygdalectomie (2021)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default paradise
