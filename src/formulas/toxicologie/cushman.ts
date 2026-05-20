import type { FormulaDefinition } from '../types'

const cushman: FormulaDefinition = {
  id: 'cushman',
  slug: 'cushman',
  name: 'Cushman (Score)',
  specialty: 'toxicologie',
  category: 'Alcool',
  description: 'Score de Cushman pour l\'évaluation de la sévérité du syndrome de sevrage alcoolique et la prédiction du delirium tremens.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'hr',
      type: 'number',
      label: 'Fréquence cardiaque',
      unit: 'bpm',
      min: 40,
      max: 200,
      step: 1,
    },
    {
      id: 'sbp',
      type: 'number',
      label: 'Pression artérielle systolique',
      unit: 'mmHg',
      min: 80,
      max: 250,
      step: 1,
    },
    {
      id: 'temperature',
      type: 'number',
      label: 'Température',
      unit: '°C',
      min: 35,
      max: 42,
      step: 0.1,
    },
    {
      id: 'tremor',
      type: 'boolean',
      label: 'Tremblements présents',
    },
    {
      id: 'sweating',
      type: 'boolean',
      label: 'Sueurs profuses',
    },
    {
      id: 'hallucinations',
      type: 'boolean',
      label: 'Hallucinations (visuelles, tactiles ou auditives)',
    },
    {
      id: 'seizures',
      type: 'boolean',
      label: 'Antécédent de convulsions liées au sevrage',
    },
  ],
  calculate: (values) => {
    const hr = values.hr as number
    const sbp = values.sbp as number
    const temp = values.temperature as number
    const hasTremor = values.tremor as boolean
    const hasSweating = values.sweating as boolean
    const hasHallu = values.hallucinations as boolean
    const hasSeizures = values.seizures as boolean

    let score = 0

    if (hr > 100) score += 1
    if (sbp > 150) score += 1
    if (temp > 37.5) score += 1
    if (hasTremor) score += 1
    if (hasSweating) score += 1
    if (hasHallu) score += 2
    if (hasSeizures) score += 2

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (score <= 2) {
      label = 'Cushman bas — sevrage léger à modéré'
      severity = 'low'
      recommendation = 'Surveillance ambulatoire possible selon le contexte social. Traitement symptomatique si besoin (diazépam 10 mg PO si score ≥ 1).'
    } else if (score <= 4) {
      label = 'Cushman intermédiaire — sevrage modéré à sévère'
      severity = 'moderate'
      recommendation = 'Hospitalisation recommandée. Traitement par benzodiazépines (diazépam 20-40 mg/j PO). Surveillance pluriquotidienne. Vitaminothérapie B1.'
    } else if (score <= 6) {
      label = 'Cushman élevé — risque important de delirium tremens'
      severity = 'high'
      recommendation = 'Hospitalisation en soins intensifs. Titration IV de benzodiazépines. Prévention des convulsions. Bilan étiologique complet.'
    } else {
      label = 'Cushman très élevé — delirium tremens probable'
      severity = 'critical'
      recommendation = 'URGENCE VITALE — Réanimation. BZD IV titration rapide ± neuroleptiques. Recherche de complications : pancréatite, pneumopathie, TCC. Vitaminothérapie B1 IV systématique.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 2, label: 'Sevrage léger — risque faible', severity: 'low', recommendation: 'Surveillance ambulatoire' },
        { min: 3, max: 4, label: 'Sevrage modéré — risque intermédiaire', severity: 'moderate', recommendation: 'Hospitalisation + BZD' },
        { min: 5, max: 6, label: 'Sevrage sévère — risque élevé de delirium', severity: 'high', recommendation: 'Soins intensifs + BZD IV' },
        { min: 7, max: 9, label: 'Delirium tremens probable', severity: 'critical', recommendation: 'Réanimation urgente' },
      ],
    }
  },
  interpretation: `Le **score de Cushman** est un outil simple d\'évaluation du sevrage alcoolique, basé sur 7 items cliniques et paracliniques.

**Items et scores :**
- FC > 100 bpm : 1 point
- PAS > 150 mmHg : 1 point
- Température > 37,5°C : 1 point
- Tremblements : 1 point
- Sueurs profuses : 1 point
- Hallucinations : 2 points
- Convulsions (antécédent lié au sevrage) : 2 points

**Score maximum : 9**

Un score ≥ 5 prédit un risque élevé de delirium tremens et justifie une prise en charge intensive.`,
  clinicalCommentary: `Le score de Cushman est moins utilisé que le CIWA-Ar mais reste pertinent pour une évaluation rapide sans questionnaire détaillé. Combiné au CIWA-Ar, il permet une stratification plus fine du risque de delirium. Ne pas oublier la prévention systématique de l\'encéphalopathie de Gayet-Wernicke par thiamine (vitamine B1) 250 mg IV/24h pendant toute la durée du sevrage hospitalisé.`,
  references: [
    {
      type: 'pubmed',
      title: 'Cushman P Jr. Delirium tremens: a prospective study. Am J Psychiatry 1987',
      pmid: '3605436',
    },
    {
      type: 'pubmed',
      title: 'Goodson CM et al. Predictors of severe alcohol withdrawal: a systematic review. J Clin Med 2021',
      pmid: '34066734',
    },
  ],
}

export default cushman
