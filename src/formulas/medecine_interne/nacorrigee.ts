import type { FormulaDefinition } from '../types'

const nacorrigee: FormulaDefinition = {
  id: 'nacorrigee',
  slug: 'nacorrigee',
  name: 'Natrémie corrigée — Ajustement selon l\'eau corporelle',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Correction de la natrémie en fonction de la teneur en eau plasmatique (hypo- ou hypervolémie).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'na_mesure',
      type: 'number',
      label: 'Natrémie mesurée (mmol/L)',
      min: 100,
      max: 180,
      step: 0.1,
      placeholder: '130',
    },
    {
      id: 'glycemie',
      type: 'number',
      label: 'Glycémie (mmol/L) — 0 si non hyperglycémique',
      min: 0,
      max: 60,
      step: 0.1,
      placeholder: '5.5',
    },
    {
      id: 'lipidemie',
      type: 'number',
      label: 'Lipémie / Protéinémie anormale ?',
      min: 0,
      max: 1,
      step: 1,
      placeholder: '0',
    },
  ],
  calculate: (values) => {
    const na = values.na_mesure ?? 130
    const glycemie = values.glycemie ?? 5.5
    const lipidemie = values.lipidemie ?? 0

    // Correction for hyperglycemia: 1.6 mmol/L per 5.5 mmol/L glucose above 5.5
    let naCorr = na
    if (glycemie > 5.5) {
      naCorr = na + (glycemie - 5.5) * 1.6 / 5.5
    }
    // If there's severe hyperlipidemia/hyperproteinemia, subtract ~5 mmol/L (pseudohyponatremia)
    if (lipidemie > 0) {
      naCorr = na + 5 // estimate for pseudohyponatremia from lipids/proteins
    }
    naCorr = Math.round(naCorr * 10) / 10

    if (naCorr < 135) {
      return {
        value: naCorr,
        label: `Natrémie corrigée = ${naCorr} mmol/L — Hyponatrémie`,
        severity: naCorr < 125 ? 'high' : 'moderate',
        ranges: [
          { min: 0, max: 125, label: 'Hyponatrémie sévère < 125 mmol/L', severity: 'high' },
          { min: 125, max: 135, label: 'Hyponatrémie légère à modérée 125–135 mmol/L', severity: 'moderate' },
          { min: 135, max: 145, label: 'Normale : 135–145 mmol/L', severity: 'low' },
          { min: 145, max: 999, label: 'Hypernatrémie > 145 mmol/L', severity: 'moderate' },
        ],
      }
    }
    if (naCorr > 145) {
      return {
        value: naCorr,
        label: `Natrémie corrigée = ${naCorr} mmol/L — Hypernatrémie`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 135, label: 'Hyponatrémie < 135 mmol/L', severity: 'moderate' },
          { min: 135, max: 145, label: 'Normale', severity: 'low' },
          { min: 145, max: 150, label: 'Hypernatrémie légère 145–150 mmol/L', severity: 'low' },
          { min: 150, max: 999, label: 'Hypernatrémie sévère > 150 mmol/L', severity: 'high' },
        ],
      }
    }
    return {
      value: naCorr,
      label: `Natrémie corrigée = ${naCorr} mmol/L — Normale`,
      severity: 'low',
      ranges: [
        { min: 0, max: 135, label: 'Hyponatrémie', severity: 'moderate' },
        { min: 135, max: 145, label: 'Normale', severity: 'low' },
        { min: 145, max: 999, label: 'Hypernatrémie', severity: 'moderate' },
      ],
    }
  },
  interpretation: `**Natrémie corrigée pour l\'hyperglycémie :**
- Na_corrigé = Na_mesuré + (Glycémie − 5,5) × 1,6 / 5,5
- Règle simplifiée : Na_corrigé ≈ Na + (Glycémie − 5,5) × 0,3

**Pseudohyponatrémie :** En cas d\'hypertriglycéridémie ou d\'hyperprotéinémie, le sodium mesuré est abaissé artificiellement. Le dosage par électrode ionique sélective (potentiométrie directe) corrige ce biais.

**Conduite :** Ne pas traiter une pseudohyponatrémie. Traiter la cause sous-jacente de l\'hyperglycémie.`,
  clinicalCommentary: `Distinction essentielle en médecine interne : hyponatrémie hypotonique (vraie) vs hypertonique (hyperglycémie) vs isotonique (pseudohyponatrémie). La natrémie corrigée est calculée par le laboratoire si le dosage est fait par potentiométrie indirecte.`,
  references: [
    {
      type: 'pubmed',
      title: 'Hilliard AA et al. Revisiting the correction of sodium for hyperglycemia. J Emerg Med 2012',
      pmid: '22652438',
    },
    {
      type: 'guideline',
      title: 'SNFMI — Prise en charge des hyponatrémies',
      url: 'https://www.snfmi.org',
    },
  ],
}

export default nacorrigee
