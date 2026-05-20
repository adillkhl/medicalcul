import type { FormulaDefinition } from '../types'

const cacorrigee: FormulaDefinition = {
  id: 'cacorrigee',
  slug: 'cacorrigee',
  name: 'Calcémie corrigée — Ajustement selon l\'albuminémie',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Calcémie corrigée en fonction du taux d\'albumine pour interpréter la calcémie totale.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'calcemie_totale',
      type: 'number',
      label: 'Calcémie totale (mmol/L)',
      min: 1.0,
      max: 5.0,
      step: 0.01,
      placeholder: '2.40',
    },
    {
      id: 'albumine',
      type: 'number',
      label: 'Albumine (g/L)',
      min: 5,
      max: 60,
      step: 0.1,
      placeholder: '40',
    },
  ],
  calculate: (values) => {
    const ca = values.calcemie_totale ?? 2.40
    const alb = values.albumine ?? 40
    const caCorrigee = ca + (40 - alb) * 0.025
    const caCorrigeeRound = Math.round(caCorrigee * 100) / 100

    if (caCorrigee > 2.60) {
      return {
        value: caCorrigeeRound,
        label: `Calcémie corrigée = ${caCorrigeeRound} mmol/L — Hypercalcémie`,
        severity: 'high',
        ranges: [
          { min: 0, max: 2.20, label: 'Hypocalcémie < 2.20 mmol/L', severity: 'moderate' },
          { min: 2.20, max: 2.60, label: 'Normale : 2.20–2.60 mmol/L', severity: 'low' },
          { min: 2.60, max: 3.0, label: 'Hypercalcémie modérée : 2.60–3.00 mmol/L', severity: 'moderate' },
          { min: 3.0, max: 999, label: 'Hypercalcémie sévère > 3.00 mmol/L', severity: 'high' },
        ],
      }
    }
    if (caCorrigee < 2.20) {
      return {
        value: caCorrigeeRound,
        label: `Calcémie corrigée = ${caCorrigeeRound} mmol/L — Hypocalcémie`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 2.20, label: 'Hypocalcémie', severity: 'moderate' },
          { min: 2.20, max: 2.60, label: 'Normale', severity: 'low' },
          { min: 2.60, max: 3.0, label: 'Hypercalcémie modérée', severity: 'moderate' },
          { min: 3.0, max: 999, label: 'Hypercalcémie sévère', severity: 'high' },
        ],
      }
    }
    return {
      value: caCorrigeeRound,
      label: `Calcémie corrigée = ${caCorrigeeRound} mmol/L — Normale`,
      severity: 'low',
      ranges: [
        { min: 0, max: 2.20, label: 'Hypocalcémie < 2.20 mmol/L', severity: 'moderate' },
        { min: 2.20, max: 2.60, label: 'Normale : 2.20–2.60 mmol/L', severity: 'low' },
        { min: 2.60, max: 3.0, label: 'Hypercalcémie modérée : 2.60–3.00 mmol/L', severity: 'moderate' },
        { min: 3.0, max: 999, label: 'Hypercalcémie sévère > 3.00 mmol/L', severity: 'high' },
      ],
    }
  },
  interpretation: `**Formule :** Ca_corrigée (mmol/L) = Ca_totale + (40 − Albumine) × 0,025

Alternativement (en mg/dL et g/dL) : Ca_corrigée = Ca_totale + 0,8 × (4 − Albumine)

- **Normale** : 2,20–2,60 mmol/L
- **Hypocalcémie** : < 2,20 mmol/L
- **Hypercalcémie** : > 2,60 mmol/L`,
  clinicalCommentary: `La calcémie corrigée reste une estimation. En cas d\'anomalie de la protidémie ou si le patient est en acidose/alcalose, préférer le dosage du calcium ionisé (Ca2+ libre). En réanimation, le calcium ionisé est plus fiable.`,
  references: [
    {
      type: 'pubmed',
      title: 'Pain RW et al. Correcting calcium. BMJ 1975',
      pmid: '1148654',
    },
    {
      type: 'guideline',
      title: 'SFMG — Explorations du métabolisme phosphocalcique',
      url: 'https://www.sfmg.org',
    },
  ],
}

export default cacorrigee
