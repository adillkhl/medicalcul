import type { FormulaDefinition } from '../types'

const pomi: FormulaDefinition = {
  id: 'pomi',
  slug: 'pomi',
  name: 'POMI (Questionnaire)',
  specialty: 'toxicologie',
  category: 'Opioïdes',
  description: 'Prescription Opioid Misuse Index — questionnaire de dépistage du mésusage des antalgiques opioïdes prescrits. Permet d\'identifier les patients à risque de dépendance ou d\'usage détourné.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'q_early_refill',
      type: 'boolean',
      label: 'Avez-vous déjà dû demander un renouvellement anticipé de votre ordonnance d\'antalgiques opioïdes ?',
    },
    {
      id: 'q_higher_dose',
      type: 'boolean',
      label: 'Avez-vous déjà augmenté vos doses d\'antalgiques opioïdes sans l\'avis de votre médecin ?',
    },
    {
      id: 'q_euphoria',
      type: 'boolean',
      label: 'Avez-vous déjà ressenti une sensation d\'euphorie ou de « plan » en prenant vos antalgiques opioïdes ?',
    },
    {
      id: 'q_doc_shopping',
      type: 'boolean',
      label: 'Avez-vous déjà consulté plusieurs médecins pour obtenir des prescriptions d\'antalgiques opioïdes ?',
    },
    {
      id: 'q_other_source',
      type: 'boolean',
      label: 'Avez-vous déjà obtenu des antalgiques opioïdes par un autre moyen que la prescription médicale (achat illicite, don, vol) ?',
    },
    {
      id: 'q_social_conflict',
      type: 'boolean',
      label: 'Votre entourage vous a-t-il déjà fait des remarques sur votre consommation d\'antalgiques opioïdes ?',
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.q_early_refill) score++
    if (values.q_higher_dose) score++
    if (values.q_euphoria) score++
    if (values.q_doc_shopping) score++
    if (values.q_other_source) score++
    if (values.q_social_conflict) score++

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (score === 0) {
      label = 'POMI négatif — aucun signe de mésusage'
      severity = 'low'
      recommendation = 'Poursuite du traitement sous surveillance standard. Réévaluation régulière de l\u2019efficacité et de la tolérance.'
    } else if (score <= 2) {
      label = 'POMI douteux — signes de mésusage possibles'
      severity = 'moderate'
      recommendation = 'Entretien motivationnel. Renforcer les règles de prescription. Limiter les quantités délivrées (pas plus de 28 jours). Surveillance rapprochée. Envisager une rotation des opioïdes.'
    } else {
      label = 'POMI positif — mésusage probable'
      severity = 'high'
      recommendation = "ARRÊT OU ROTATION DU TRAITEMENT OPIOÏDE. Orientation vers une consultation spécialisée de la douleur et/ou d\'addictologie. Prescription sécurisée (ordonnance sécurisée, dispensation fractionnée). Évaluation psychologique et sociale."
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 0, label: 'Négatif — pas de mésusage détecté', severity: 'low', recommendation: 'Surveillance standard' },
        { min: 1, max: 2, label: 'Douteux — surveillance renforcée', severity: 'moderate', recommendation: 'Entretien motivationnel + limitation des quantités' },
        { min: 3, max: 6, label: 'Positif — mésusage probable', severity: 'high', recommendation: 'Arrêt/rotation + avis addictologie' },
      ],
    }
  },
  interpretation: 'Le **POMI** (Prescription Opioid Misuse Index) est un questionnaire de dépistage rapide du mésusage des opioïdes prescrits.\n\n**6 questions — score total 0 à 6 :**\n- **0** : Négatif — pas de signe de mésusage\n- **1-2** : Douteux — surveillance renforcée nécessaire\n- **≥ 3** : Positif — mésusage probable, intervention requise\n\nLe POMI explore plusieurs dimensions du mésusage : automédication, comportement addictif, recherche d\'effet euphorique, consommation parallèle.',
  clinicalCommentary: "L\'utilisation du POMI est recommandée avant toute prescription d\'opioïdes au long cours (douleurs chroniques non cancéreuses). En association avec le suivi du score de douleur (EVA) et du score de qualité de vie, il permet une approche globale du risque. En cas de POMI positif, ne pas arrêter brutalement le traitement (risque de syndrome de sevrage) : rotation progressive ou sevrage programmé sous couverture médicale.",
  references: [
    {
      type: 'pubmed',
      title: 'Knisely JS et al. Prescription Opioid Misuse Index: a brief questionnaire to assess misuse. J Opioid Manag 2008',
      pmid: '18444444',
    },
    {
      type: 'pubmed',
      title: 'Passik SD et al. Current concepts in opioid misuse assessment. J Opioid Manag 2016',
      pmid: '27575931',
    },
  ],
}

export default pomi
