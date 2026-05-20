import type { FormulaDefinition } from '../types'

const hba1c2gpm: FormulaDefinition = {
  id: 'hba1c2gpm',
  slug: 'hba1c2gpm',
  name: 'HbA1c — Glycémie Moyenne Estimée (eAG)',
  specialty: 'medecine_interne',
  category: 'Diabétologie',
  description: 'Conversion de l\'HbA1c en glycémie moyenne estimée (estimated Average Glucose — eAG).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'hba1c_pct',
      type: 'number',
      label: 'HbA1c (%)',
      min: 3,
      max: 20,
      step: 0.1,
      placeholder: '7.0',
    },
  ],
  calculate: (values) => {
    const hba1c = values.hba1c_pct ?? 7.0
    const eagMmol = (hba1c * 28.7 - 46.7) / 18.015
    const eagMgdl = hba1c * 28.7 - 46.7
    const eagMmolRound = Math.round(eagMmol * 10) / 10
    const eagMgdlRound = Math.round(eagMgdl)

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (hba1c < 6.5) severity = 'low'
    else if (hba1c < 8) severity = 'moderate'
    else severity = hba1c < 10 ? 'high' : 'critical'

    return {
      value: eagMmolRound,
      label: `Glycémie moyenne estimée : ${eagMmolRound} mmol/L (${eagMgdlRound} mg/dL) — HbA1c = ${hba1c}%`,
      severity,
      ranges: [
        { min: 0, max: 5.6, label: 'Normale (< 5.6 mmol/L, < 100 mg/dL)', severity: 'low' },
        { min: 5.6, max: 7.0, label: 'Prédiabète (5.6–7.0 mmol/L)', severity: 'low' },
        { min: 7.0, max: 10.0, label: 'Diabète modérément contrôlé (7–10 mmol/L)', severity: 'moderate' },
        { min: 10.0, max: 13.9, label: 'Diabète mal contrôlé (10–13.9 mmol/L)', severity: 'high' },
        { min: 13.9, max: 999, label: 'Diabète très mal contrôlé (≥ 13.9 mmol/L)', severity: 'critical' },
      ],
    }
  },
  interpretation: `**Formule ADAG (A1c-Derived Average Glucose) :**
- eAG (mmol/L) = (28,7 × HbA1c − 46,7) / 18,015
- eAG (mg/dL) = 28,7 × HbA1c − 46,7

| HbA1c (%) | Glycémie moyenne estimée |
|---|---|
| 6 | 7,0 mmol/L (126 mg/dL) |
| 7 | 8,6 mmol/L (154 mg/dL) |
| 8 | 10,2 mmol/L (183 mg/dL) |
| 9 | 11,8 mmol/L (212 mg/dL) |
| 10 | 13,4 mmol/L (240 mg/dL) |
| 11 | 14,9 mmol/L (269 mg/dL) |
| 12 | 16,5 mmol/L (298 mg/dL) |

Utile pour expliquer la correspondance au patient.`,
  clinicalCommentary: `L'eAG est surtout utile pour l'éducation thérapeutique : elle permet au patient de visualiser sa glycémie moyenne sur 3 mois. Attention : la formule ADAG est validée pour l'HbA1c standardisée NGSP. Interpréter avec prudence en cas d'anomalies de l'hémoglobine.`,
  references: [
    {
      type: 'pubmed',
      title: 'Nathan DM et al. Translating the A1C assay into estimated average glucose values. Diabetes Care 2008',
      pmid: '18539919',
    },
    {
      type: 'guideline',
      title: 'American Diabetes Association — Standards of Care 2023',
      pmid: '36507643',
    },
  ],
}

export default hba1c2gpm
