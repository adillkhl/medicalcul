import type { FormulaDefinition } from '../types'

const basfi: FormulaDefinition = {
  id: 'basfi',
  slug: 'basfi',
  name: 'BASFI — Score fonctionnel de la spondylarthrite',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Bath Ankylosing Spondylitis Functional Index — Évaluation du retentissement fonctionnel de la spondylarthrite ankylosante.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'chaussettes',
      type: 'number',
      label: 'Mettre ses chaussettes ou collants sans aide (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '3',
    },
    {
      id: 'penche',
      type: 'number',
      label: 'Se pencher en avant pour ramasser un stylo (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '4',
    },
    {
      id: 'etagere',
      type: 'number',
      label: 'Atteindre une étagère haute sans aide (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '5',
    },
    {
      id: 'chaise',
      type: 'number',
      label: 'Se lever d\'une chaise sans appui (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '3',
    },
    {
      id: 'sol',
      type: 'number',
      label: 'Se relever du sol sans aide (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '6',
    },
    {
      id: 'sans_appui',
      type: 'number',
      label: 'Rester debout sans appui 10 min (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '2',
    },
    {
      id: 'marches',
      type: 'number',
      label: 'Monter 12–15 marches sans rampe (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '4',
    },
    {
      id: 'regarder_derriere',
      type: 'number',
      label: 'Regarder par-dessus l\'épaule sans tourner le corps (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '5',
    },
    {
      id: 'physique',
      type: 'number',
      label: 'Activité physique pénible (jardinage, sport) (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '7',
    },
    {
      id: 'activites',
      type: 'number',
      label: 'Activités quotidiennes (professionnelles ou domestiques) (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '5',
    },
  ],
  calculate: (values) => {
    const items = [
      values.chaussettes ?? 0,
      values.penche ?? 0,
      values.etagere ?? 0,
      values.chaise ?? 0,
      values.sol ?? 0,
      values.sans_appui ?? 0,
      values.marches ?? 0,
      values.regarder_derriere ?? 0,
      values.physique ?? 0,
      values.activites ?? 0,
    ]
    const sum = items.reduce((a, b) => a + b, 0)
    const basfiVal = sum / 10
    const basfiRound = Math.round(basfiVal * 10) / 10

    if (basfiRound < 4) {
      return {
        value: basfiRound,
        label: `BASFI = ${basfiRound} — Retentissement fonctionnel faible`,
        severity: 'low',
        ranges: [
          { min: 0, max: 4, label: '< 4 : Faible retentissement', severity: 'low' },
          { min: 4, max: 7, label: '4–7 : Modéré', severity: 'moderate' },
          { min: 7, max: 10, label: '≥ 7 : Sévère', severity: 'high' },
        ],
      }
    }
    if (basfiRound < 7) {
      return {
        value: basfiRound,
        label: `BASFI = ${basfiRound} — Retentissement fonctionnel modéré`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 4, label: '< 4 : Faible', severity: 'low' },
          { min: 4, max: 7, label: '4–7 : Modéré', severity: 'moderate' },
          { min: 7, max: 10, label: '≥ 7 : Sévère', severity: 'high' },
        ],
      }
    }
    return {
      value: basfiRound,
      label: `BASFI = ${basfiRound} — Retentissement fonctionnel sévère`,
      severity: 'high',
      ranges: [
        { min: 0, max: 4, label: '< 4 : Faible', severity: 'low' },
        { min: 4, max: 7, label: '4–7 : Modéré', severity: 'moderate' },
        { min: 7, max: 10, label: '≥ 7 : Sévère', severity: 'high' },
      ],
    }
  },
  interpretation: `**BASFI** (Bath Ankylosing Spondylitis Functional Index)

**Calcul :** Moyenne de 10 EVA (0 = facile, 10 = impossible) évaluant la fonction physique.

**Interprétation :**
- < 4 : retentissement fonctionnel faible
- 4–7 : retentissement modéré
- ≥ 7 : retentissement sévère`,
  clinicalCommentary: `Le BASFI est utilisé conjointement avec le BASDAI pour évaluer l'impact de la spondylarthrite. Une amélioration ≥ 2 points est considérée comme cliniquement significative. Le BASFI est sensible au changement après biothérapie.`,
  references: [
    {
      type: 'pubmed',
      title: 'Calin A et al. A new approach to defining functional ability in ankylosing spondylitis. J Rheumatol 1994',
      pmid: '7692013',
    },
    {
      type: 'pubmed',
      title: 'van der Heijde D et al. Assessment of disease activity and functional capacity in AS. Arthritis Rheum 1999',
      pmid: '10400272',
    },
  ],
}

export default basfi
