import type { FormulaDefinition } from '../types'

const trouanioniquep: FormulaDefinition = {
  id: 'trouanioniquep',
  slug: 'trouanioniquep',
  name: 'Trou anionique plasmatique — Calcul',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Calcul du trou anionique plasmatique (anion gap) pour le diagnostic des acidoses métaboliques.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'natremie',
      type: 'number',
      label: 'Natrémie (mmol/L)',
      min: 100,
      max: 180,
      step: 0.1,
      placeholder: '140',
    },
    {
      id: 'kaliemie',
      type: 'number',
      label: 'Kaliémie (mmol/L)',
      min: 1.0,
      max: 9.0,
      step: 0.1,
      placeholder: '4.0',
    },
    {
      id: 'chlorure',
      type: 'number',
      label: 'Chlorure (mmol/L)',
      min: 60,
      max: 130,
      step: 0.1,
      placeholder: '105',
    },
    {
      id: 'bicarbonates',
      type: 'number',
      label: 'Bicarbonates HCO3- (mmol/L)',
      min: 2,
      max: 50,
      step: 0.1,
      placeholder: '24',
    },
    {
      id: 'albumine',
      type: 'number',
      label: 'Albumine (g/L) — optionnel pour correction',
      min: 0,
      max: 60,
      step: 0.1,
      placeholder: '40',
    },
  ],
  calculate: (values) => {
    const na = values.natremie ?? 140
    const k = values.kaliemie ?? 4.0
    const cl = values.chlorure ?? 105
    const hco3 = values.bicarbonates ?? 24
    const alb = values.albumine ?? 40

    const taSansK = na - (cl + hco3)
    const taAvecK = (na + k) - (cl + hco3)
    const taCorrige = taSansK + 0.25 * (40 - alb) // albumin-corrected

    const taPrinc = Math.round(taSansK * 10) / 10
    const taK = Math.round(taAvecK * 10) / 10
    const taCorr = Math.round(taCorrige * 10) / 10

    if (taCorr > 12) {
      return {
        value: taCorr,
        label: `Trou anionique plasmatique = ${taCorr} (corrigé albumine) — Élevé`,
        severity: 'high',
        details: { sansK: taPrinc, avecK: taK, corrige: taCorr },
        ranges: [
          { min: 0, max: 12, label: 'Normal (8–12 mmol/L)', severity: 'low' },
          { min: 12, max: 20, label: 'Légèrement élevé (12–20 mmol/L)', severity: 'moderate' },
          { min: 20, max: 999, label: 'Élevé > 20 mmol/L — Acidose métabolique', severity: 'high' },
        ],
      }
    }
    return {
      value: taCorr,
      label: `Trou anionique plasmatique = ${taCorr} (corrigé albumine) — Normal`,
      severity: 'low',
      details: { sansK: taPrinc, avecK: taK, corrige: taCorr },
      ranges: [
        { min: 0, max: 12, label: 'Normal (8–12 mmol/L)', severity: 'low' },
        { min: 12, max: 20, label: 'Légèrement élevé (12–20 mmol/L)', severity: 'moderate' },
        { min: 20, max: 999, label: 'Élevé > 20 mmol/L', severity: 'high' },
      ],
    }
  },
  interpretation: `**Trou anionique plasmatique (anion gap) :**
- Standard : TA = Na − (Cl + HCO3) → N = 8–12 mmol/L
- Avec K : TA = (Na + K) − (Cl + HCO3) → N = 10–14 mmol/L
- Corrigé pour l'albumine : TA_corr = TA + 0,25 × (40 − Albumine)

**Causes de TA élevé** (acidose métabolique à TA élevé, MUD PILES) : Méthanol, Urémie, Diabétique/DAO, Propylène glycol/Paraldéhyde, Isoniazide/Isocyanate, Lactique, Éthylène glycol, Salicylés.

**Causes de TA normal** (acidose métabolique hyperchlorémique) : diarrhées, acidose tubulaire rénale (ATR), SRC, hyperparathyroïdie.`,
  clinicalCommentary: `Le trou anionique plasmatique est un outil diagnostique fondamental pour différencier les acidoses métaboliques. Toujours corriger pour l'albumine (l'hypoalbuminémie masque un TA élevé).`,
  references: [
    {
      type: 'pubmed',
      title: 'Kraut JA, Madias NE. Serum anion gap: its uses and limitations. Clin J Am Soc Nephrol 2007',
      pmid: '17699439',
    },
    {
      type: 'pubmed',
      title: 'Gabow PA. Disorders associated with an altered anion gap. Kidney Int 1985',
      pmid: '3894751',
    },
  ],
}

export default trouanioniquep
