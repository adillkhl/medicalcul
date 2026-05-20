import type { FormulaDefinition } from '../types'

const creus: FormulaDefinition = {
  id: 'creus',
  slug: 'creus',
  name: 'Creus (Score) — Maladie de Crohn',
  specialty: 'gastroenterologie',
  category: 'Maladies inflammatoires',
  description: 'Score d\'activité de la maladie de Crohn',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'selles_liquides',
      type: 'number',
      label: 'Nombre de selles liquides ou molles par jour',
      unit: '/jour',
      min: 0,
      max: 30,
      step: 1,
      placeholder: 'Ex: 5',
    },
    {
      id: 'douleur',
      type: 'radio',
      label: 'Douleur abdominale',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Légère à modérée' },
        { value: 2, label: 'Sévère' },
      ],
    },
    {
      id: 'bien_etre',
      type: 'radio',
      label: 'État général (bien-être)',
      options: [
        { value: 0, label: 'Bon' },
        { value: 1, label: 'Altéré' },
        { value: 2, label: 'Très altéré' },
      ],
    },
    {
      id: 'masse_abdo',
      type: 'boolean',
      label: 'Masse abdominale',
    },
    {
      id: 'fievre',
      type: 'boolean',
      label: 'Fièvre > 38°C',
    },
    {
      id: 'poids',
      type: 'boolean',
      label: 'Perte de poids > 5 % du poids habituel',
    },
    {
      id: 'manifestations',
      type: 'boolean',
      label: 'Manifestations extra-intestinales (articulaires, cutanées, oculaires)',
    },
  ],
  calculate: (values) => {
    let score = 0
    const selles = Number(values.selles_liquides) || 0
    const douleur = Number(values.douleur) || 0
    const bienEtre = Number(values.bien_etre) || 0

    // Creus simplifié : somme pondérée des items
    score += selles * 2
    score += douleur * 3
    score += bienEtre * 2
    if (values.masse_abdo) score += 5
    if (values.fievre) score += 3
    if (values.poids) score += 2
    if (values.manifestations) score += 3

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (score < 5) {
      severity = 'low'
      label = 'Rémission clinique (< 5)'
      recommendation = 'Maladie quiescente. Maintenir le traitement de fond. Surveillance standard selon plan de soins.'
    } else if (score < 10) {
      severity = 'moderate'
      label = 'Activité légère (5-9)'
      recommendation = 'Activité légère à modérée. Envisager adaptation thérapeutique (5-ASA, budésonide, corticoïdes). Réévaluation à 2-4 semaines.'
    } else if (score < 15) {
      severity = 'high'
      label = 'Activité modérée (10-14)'
      recommendation = 'Poussée modérée. Corticothérapie systémique ou biothérapie. Bilan biologique et endoscopique. Avis spécialisé.'
    } else {
      severity = 'critical'
      label = 'Activité sévère (≥ 15)'
      recommendation = 'Poussée sévère. Hospitalisation en gastro-entérologie. Corticothérapie IV ± biothérapie. Bilan complémentaire (endoscopie, IRM entéroscanner).'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 4, label: '< 5 — Rémission', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 5, max: 9, label: '5-9 — Activité légère', severity: 'moderate', recommendation: 'Adaptation thérapeutique.' },
        { min: 10, max: 14, label: '10-14 — Activité modérée', severity: 'high', recommendation: 'Corticothérapie. Biothérapie.' },
        { min: 15, max: 100, label: '≥ 15 — Activité sévère', severity: 'critical', recommendation: 'Hospitalisation. Corticoïdes IV.' },
      ],
    }
  },
  interpretation: `Le **score de Creus** est un index d’activité clinique de la maladie de Crohn, alternatif plus simple que le CDAI (Crohn’s Disease Activity Index).

**Items** : selles liquides (x2), douleur (x3), bien-être (x2), masse abdominale (+5), fièvre (+3), perte de poids (+2), manifestations extra-intestinales (+3).

Le seuil < 5 définit la rémission, 5-9 une activité légère, 10-14 modérée, et ≥ 15 sévère.`,
  clinicalCommentary: `Le score de Creus est moins utilisé que le CDAI ou l’Harvey-Bradshaw en pratique clinique, mais reste pertinent pour une évaluation rapide. En pratique, le CDAI (ou sa version simplifiée Harvey-Bradshaw) est préféré dans les essais cliniques et le suivi. La calprotectine fécale et les biomarqueurs (CRP) complètent l\'évaluation clinique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Creus M et al. Évaluation de l\'activité de la maladie de Crohn — Score de Creus. Gastroenterol Clin Biol 1995',
      url: 'https://www.em-consulte.com',
    },
  ],
}

export default creus
