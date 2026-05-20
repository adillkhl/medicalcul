import type { FormulaDefinition } from '../types'

const fructoHba1c: FormulaDefinition = {
  id: 'fructo_hba1c',
  slug: 'fructo_hba1c',
  name: 'Fructosamine-HbA1c — Équivalence',
  specialty: 'medecine_interne',
  category: 'Diabétologie',
  description: 'Conversion entre la fructosamine et l\'hémoglobine glyquée (HbA1c).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'mode',
      type: 'radio',
      label: 'Mode de calcul',
      options: [
        { value: 0, label: 'Fructosamine → HbA1c' },
        { value: 1, label: 'HbA1c → Fructosamine' },
      ],
    },
    {
      id: 'valeur',
      type: 'number',
      label: 'Valeur à convertir',
      min: 100,
      max: 600,
      step: 0.1,
      placeholder: '300',
    },
  ],
  calculate: (values) => {
    const mode = values.mode ?? 0
    const val = values.valeur ?? 300
    let result: number
    let label: string

    if (mode === 0) {
      // Fructosamine (µmol/L) → HbA1c (%)
      result = (val - 38.5) / 45.4
      result = Math.round(result * 10) / 10
      label = `HbA1c estimée = ${result}% (${Math.round(result * 10.93 - 23.5)} mmol/mol) — à partir de fructosamine = ${val} µmol/L`
    } else {
      // HbA1c (%) → Fructosamine (µmol/L)
      result = Math.round(val * 45.4 + 38.5)
      label = `Fructosamine estimée = ${result} µmol/L — à partir de HbA1c = ${val}%`
    }

    return {
      value: result,
      label,
      ranges: [
        { min: 0, max: 285, label: 'Fructosamine normale < 285 µmol/L' },
        { min: 285, max: 400, label: 'Fructosamine modérément élevée' },
        { min: 400, max: 9999, label: 'Fructosamine élevée' },
      ],
    }
  },
  interpretation: `**Formules de conversion :**
- HbA1c (%) = (Fructosamine − 38,5) / 45,4
- Fructosamine (µmol/L) = HbA1c × 45,4 + 38,5

**Valeurs normales :**
- Non diabétique : fructosamine < 285 µmol/L (HbA1c < 5,7 %)
- Diabète équilibré : fructosamine 285–350 µmol/L
- Diabète déséquilibré : fructosamine > 350 µmol/L`,
  clinicalCommentary: `La fructosamine reflète le contrôle glycémique des 2–3 dernières semaines (vs 2–3 mois pour l'HbA1c). Utile dans les situations où l'HbA1c n'est pas fiable (hémoglobinopathies, dialyse, grossesse, anémies hémolytiques).`,
  references: [
    {
      type: 'pubmed',
      title: 'Armbruster DA. Fructosamine: structure, analysis, and clinical usefulness. Clin Chem 1987',
      pmid: '3308187',
    },
    {
      type: 'guideline',
      title: 'HAS — Stratégie médicamenteuse du contrôle glycémique du diabète de type 2 (2023)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default fructoHba1c
