import type { FormulaDefinition } from '../types'

const kcorrigee: FormulaDefinition = {
  id: 'kcorrigee',
  slug: 'kcorrigee',
  name: 'Kaliémie corrigée — Ajustement selon le pH',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Correction de la kaliémie en fonction du pH artériel — estimation de la kaliémie corrigée à pH 7,40.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'kaliemie',
      type: 'number',
      label: 'Kaliémie mesurée (mmol/L)',
      min: 1.0,
      max: 9.0,
      step: 0.1,
      placeholder: '5.5',
    },
    {
      id: 'ph',
      type: 'number',
      label: 'pH artériel',
      min: 6.8,
      max: 7.8,
      step: 0.01,
      placeholder: '7.30',
    },
  ],
  calculate: (values) => {
    const k = values.kaliemie ?? 5.5
    const ph = values.ph ?? 7.30
    const deltaPH = 7.40 - ph
    const kCorrigee = k - deltaPH * 0.6
    const kCorrigeeRound = Math.round(kCorrigee * 100) / 100

    if (kCorrigee >= 5.5) {
      return {
        value: kCorrigeeRound,
        label: `Kaliémie corrigée à pH 7,40 = ${kCorrigeeRound} mmol/L — Hyperkaliémie`,
        severity: kCorrigee >= 6.0 ? 'critical' : 'high',
        ranges: [
          { min: 0, max: 3.5, label: 'Hypokaliémie < 3.5 mmol/L', severity: 'moderate' },
          { min: 3.5, max: 5.5, label: 'Normale : 3.5–5.5 mmol/L', severity: 'low' },
          { min: 5.5, max: 6.0, label: 'Hyperkaliémie modérée : 5.5–6.0 mmol/L', severity: 'high' },
          { min: 6.0, max: 999, label: 'Hyperkaliémie sévère ≥ 6.0 mmol/L', severity: 'critical' },
        ],
      }
    }
    if (kCorrigee <= 3.5) {
      return {
        value: kCorrigeeRound,
        label: `Kaliémie corrigée à pH 7,40 = ${kCorrigeeRound} mmol/L — Hypokaliémie`,
        severity: kCorrigee <= 3.0 ? 'high' : 'moderate',
        ranges: [
          { min: 0, max: 3.0, label: 'Hypokaliémie sévère < 3.0 mmol/L', severity: 'high' },
          { min: 3.0, max: 3.5, label: 'Hypokaliémie légère 3.0–3.5 mmol/L', severity: 'moderate' },
          { min: 3.5, max: 5.5, label: 'Normale : 3.5–5.5 mmol/L', severity: 'low' },
          { min: 5.5, max: 999, label: 'Hyperkaliémie > 5.5 mmol/L', severity: 'high' },
        ],
      }
    }
    return {
      value: kCorrigeeRound,
      label: `Kaliémie corrigée à pH 7,40 = ${kCorrigeeRound} mmol/L — Normale`,
      severity: 'low',
      ranges: [
        { min: 0, max: 3.5, label: 'Hypokaliémie < 3.5 mmol/L', severity: 'moderate' },
        { min: 3.5, max: 5.5, label: 'Normale : 3.5–5.5 mmol/L', severity: 'low' },
        { min: 5.5, max: 999, label: 'Hyperkaliémie > 5.5 mmol/L', severity: 'high' },
      ],
    }
  },
  interpretation: `**Règle d'ajustement :** La kaliémie varie de 0,6 mmol/L par 0,1 unité de pH en sens inverse :
- **Acidose** (pH < 7,40) → le K+ sort de la cellule → hyperkaliémie faussée → K_corrigé = K_mesuré − (7,40 − pH) × 0,6
- **Alcalose** (pH > 7,40) → le K+ entre dans la cellule → l'hypokaliémie est sous-estimée → K_corrigé = K_mesuré + (pH − 7,40) × 0,6`,
  clinicalCommentary: `Attention : cette correction est une estimation. Valable pour les variations du pH extracellulaire aiguës. Dans l'insuffisance rénale, l'acidose métabolique et l'hyperkaliémie sont souvent intriquées.`,
  references: [
    {
      type: 'pubmed',
      title: 'Burnell JM et al. The effect of acute and chronic acidosis on the serum potassium. J Clin Invest 1956',
      pmid: '13295487',
    },
    {
      type: 'guideline',
      title: 'SNFMI — Prise en charge des dyskaliémies',
      url: 'https://www.snfmi.org',
    },
  ],
}

export default kcorrigee
