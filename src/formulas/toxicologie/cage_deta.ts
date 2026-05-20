import type { FormulaDefinition } from '../types'

const cage_deta: FormulaDefinition = {
  id: 'cage-deta',
  slug: 'cage_deta',
  name: 'CAGE-DETA (Questionnaire)',
  specialty: 'toxicologie',
  category: 'Alcool',
  description: 'Questionnaire de repérage d\'une dépendance à l\'alcool. Le CAGE-DETA est l\'un des outils les plus simples et validés pour le dépistage en soins primaires.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'q_cut',
      type: 'boolean',
      label: 'Avez-vous déjà senti que vous devriez réduire (Cut down) votre consommation d\'alcool ?',
    },
    {
      id: 'q_annoy',
      type: 'boolean',
      label: 'Avez-vous été agacé(e) (Annoyed) par les critiques de votre entourage sur votre consommation d\'alcool ?',
    },
    {
      id: 'q_guilt',
      type: 'boolean',
      label: 'Avez-vous déjà eu honte ou culpabilité (Guilt) à propos de votre consommation d\'alcool ?',
    },
    {
      id: 'q_eye',
      type: 'boolean',
      label: 'Avez-vous déjà eu besoin d\'un verre d\'alcool le matin (Eye-opener) pour vous sentir mieux ou pour calmer les tremblements ?',
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.q_cut) score++
    if (values.q_annoy) score++
    if (values.q_guilt) score++
    if (values.q_eye) score++

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (score === 0) {
      label = 'CAGE-DETA négatif — aucun signe de dépendance'
      severity = 'low'
      recommendation = 'Aucune intervention spécifique nécessaire. Conseils de prévention standard.'
    } else if (score === 1) {
      label = 'CAGE-DETA douteux — 1 réponse positive sur 4'
      severity = 'low'
      recommendation = 'Surveillance et information sur les risques liés à l\'alcool. Réévaluation à 6-12 mois.'
    } else if (score === 2) {
      label = 'CAGE-DETA anormal — suspicion de dépendance à l\'alcool'
      severity = 'moderate'
      recommendation = 'Entretien motivationnel, évaluation plus approfondie (consommation en g/jour), recherche de complications somatiques. Envisager intervention brève.'
    } else {
      label = 'CAGE-DETA très anormal — forte probabilité de dépendance à l\'alcool'
      severity = 'high'
      recommendation = 'Orientation vers une consultation d\'addictologie. Bilan somatique et psychologique complet. Prise en charge spécialisée (sevrage ambulatoire ou hospitalier selon le contexte).'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 0, label: 'Négatif', severity: 'low', recommendation: 'Pas de signe de dépendance' },
        { min: 1, max: 1, label: 'Douteux', severity: 'low', recommendation: 'Surveillance' },
        { min: 2, max: 2, label: 'Anormal — suspicion de dépendance', severity: 'moderate', recommendation: 'Évaluation spécialisée recommandée' },
        { min: 3, max: 4, label: 'Très anormal — forte probabilité de dépendance', severity: 'high', recommendation: 'Orientation addictologie urgente' },
      ],
    }
  },
  interpretation: `Le questionnaire **CAGE-DETA** (Cut-down, Annoyed, Guilt, Eye-opener) est un test de dépistage rapide de la dépendance à l'alcool.

**Interprétation :**
- **0** : Négatif
- **1** : Douteux (nécessite une évaluation complémentaire)
- **≥ 2** : Anormal — suspicion de dépendance (sensibilité ~90%, spécificité ~80%)
- **≥ 3** : Très anormal — forte probabilité de dépendance

⚠️ Le CAGE-DETA explore la **dépendance**, pas le mésusage ni les conséquences. Un test négatif n'exclut pas une consommation à risque.`,
  clinicalCommentary: `Le CAGE-DETA est validé dans de nombreuses langues et populations. Il est recommandé par la HAS pour le dépistage en soins primaires. Les 4 questions peuvent être intégrées dans un entretien systématique. En cas de score ≥ 2, compléter par une évaluation de la consommation quantitative (DETA quantitatif : nombre de verres/semaine, nombre de jours d'ivresse/mois).`,
  references: [
    {
      type: 'pubmed',
      title: 'Ewing JA. Detecting alcoholism. The CAGE questionnaire. JAMA 1984',
      pmid: '6471323',
    },
    {
      type: 'pubmed',
      title: 'Dhalla S, Kopec JA. The CAGE questionnaire for alcohol misuse: a review of reliability and validity studies. Clin Invest Med 2007',
      pmid: '17716538',
    },
  ],
}

export default cage_deta
