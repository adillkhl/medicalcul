import type { FormulaDefinition } from '../types'

const trouanioniqueu: FormulaDefinition = {
  id: 'trouanioniqueu',
  slug: 'trouanioniqueu',
  name: 'Trou anionique urinaire — Calcul',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Calcul du trou anionique urinaire pour le diagnostic différentiel des acidoses métaboliques.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'nau',
      type: 'number',
      label: 'Natrémie urinaire (mmol/L)',
      min: 0,
      max: 300,
      step: 1,
      placeholder: '50',
    },
    {
      id: 'ku',
      type: 'number',
      label: 'Kaliémie urinaire (mmol/L)',
      min: 0,
      max: 200,
      step: 1,
      placeholder: '30',
    },
    {
      id: 'clu',
      type: 'number',
      label: 'Chlorure urinaire (mmol/L)',
      min: 0,
      max: 300,
      step: 1,
      placeholder: '60',
    },
  ],
  calculate: (values) => {
    const nau = values.nau ?? 50
    const ku = values.ku ?? 30
    const clu = values.clu ?? 60
    const tau = (nau + ku) - clu

    if (tau < 0) {
      return {
        value: tau,
        label: `TA urinaire = ${tau} mmol/L — Négatif`,
        severity: 'low',
        ranges: [
          { min: -999, max: -1, label: 'Négatif (< 0) : Réponse tubulaire adaptée — diarrhée', severity: 'low' },
          { min: 0, max: 10, label: 'Bas (0–10) : Équivoque', severity: 'moderate' },
          { min: 10, max: 50, label: 'Élevé (> 10) : ATR ou acidose tubulaire', severity: 'high' },
        ],
      }
    }
    if (tau <= 10) {
      return {
        value: tau,
        label: `TA urinaire = ${tau} mmol/L — Normal`,
        severity: 'low',
        ranges: [
          { min: -999, max: -1, label: 'Négatif : diarrhée', severity: 'low' },
          { min: 0, max: 10, label: 'Bas : équivoque', severity: 'low' },
          { min: 10, max: 50, label: 'Élevé : ATR', severity: 'high' },
        ],
      }
    }
    return {
      value: tau,
      label: `TA urinaire = ${tau} mmol/L — Élevé (ATR)`,
      severity: 'high',
      ranges: [
        { min: -999, max: -1, label: 'Négatif : diarrhée', severity: 'low' },
        { min: 0, max: 10, label: 'Bas : équivoque', severity: 'low' },
        { min: 10, max: 50, label: 'Élevé : ATR', severity: 'high' },
      ],
    }
  },
  interpretation: `**Trou anionique urinaire :** TA_U = (Na_U + K_U) − Cl_U

- **TA_U < 0** (négatif) : Réponse tubulaire adaptée à l\'acidose → **diarrhées** (excrétion urinaire de NH4+ conservée)
- **TA_U > 10** (positif) : Anomalie de l\'excrétion d\'ammonium → **acidose tubulaire rénale (ATR)**

**Limites :** Le TA urinaire n\'est pas fiable en cas d\'alcalose métabolique, d\'hypovolémie sévère, ou de prise de diurétiques.`,
  clinicalCommentary: `Le TA urinaire aide à distinguer entre acidose métabolique d\'origine digestive (diarrhée) et rénale (ATR). Un TA urinaire négatif oriente vers une perte digestive de bicarbonates, un TA urinaire positif vers une ATR (distale ou proximale).`,
  references: [
    {
      type: 'pubmed',
      title: 'Battle DC et al. The urinary anion gap. Am J Nephrol 1988',
      pmid: '3395914',
    },
    {
      type: 'pubmed',
      title: 'Kraut JA, Madias NE. Differential diagnosis of nongap metabolic acidosis. Am J Kidney Dis 2015',
      pmid: '25637909',
    },
  ],
}

export default trouanioniqueu
