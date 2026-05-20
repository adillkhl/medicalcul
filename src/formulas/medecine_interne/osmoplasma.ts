import type { FormulaDefinition } from '../types'

const osmoplasma: FormulaDefinition = {
  id: 'osmoplasma',
  slug: 'osmoplasma',
  name: 'Osmolarité plasmatique — Calcul',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Calcul de l\'osmolarité plasmatique à partir de la natrémie, glycémie et urée.',
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
      id: 'glycemie',
      type: 'number',
      label: 'Glycémie (mmol/L)',
      min: 0,
      max: 60,
      step: 0.1,
      placeholder: '5.5',
    },
    {
      id: 'uree',
      type: 'number',
      label: 'Urée sanguine (mmol/L)',
      min: 0,
      max: 80,
      step: 0.1,
      placeholder: '6',
    },
  ],
  calculate: (values) => {
    const na = values.natremie ?? 140
    const glucose = values.glycemie ?? 5.5
    const uree = values.uree ?? 6
    const osm = na * 2 + glucose + uree
    const osmRound = Math.round(osm * 10) / 10

    if (osmRound > 300) {
      return {
        value: osmRound,
        label: `Osmolarité = ${osmRound} mOsm/L — Hyperosmolarité`,
        severity: osmRound > 320 ? 'high' : 'moderate',
        ranges: [
          { min: 0, max: 275, label: 'Hyposmolarité < 275 mOsm/L', severity: 'moderate' },
          { min: 275, max: 300, label: 'Normale : 275–300 mOsm/L', severity: 'low' },
          { min: 300, max: 320, label: 'Hyperosmolarité légère 300–320 mOsm/L', severity: 'moderate' },
          { min: 320, max: 999, label: 'Hyperosmolarité sévère > 320 mOsm/L', severity: 'high' },
        ],
      }
    }
    if (osmRound < 275) {
      return {
        value: osmRound,
        label: `Osmolarité = ${osmRound} mOsm/L — Hyposmolarité`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 275, label: 'Hyposmolarité', severity: 'moderate' },
          { min: 275, max: 300, label: 'Normale', severity: 'low' },
          { min: 300, max: 999, label: 'Hyperosmolarité', severity: 'moderate' },
        ],
      }
    }
    return {
      value: osmRound,
      label: `Osmolarité = ${osmRound} mOsm/L — Normale`,
      severity: 'low',
      ranges: [
        { min: 0, max: 275, label: 'Hyposmolarité < 275 mOsm/L', severity: 'moderate' },
        { min: 275, max: 300, label: 'Normale : 275–300 mOsm/L', severity: 'low' },
        { min: 300, max: 999, label: 'Hyperosmolarité > 300 mOsm/L', severity: 'moderate' },
      ],
    }
  },
  interpretation: `**Formule :** Osm_plasmatique (mOsm/L) = 2 × Na + Glucose + Urée

(avec concentrations en mmol/L)

- **Normale** : 275–300 mOsm/L
- **Hyposmolarité** : < 275 mOsm/L
- **Hyperosmolarité** : > 300 mOsm/L

**Trou osmolaire** : Si l\'osmolarité mesurée diffère de la calculée de > 10 mOsm/L, suspecter la présence d\'alcools (éthanol, méthanol, éthylène glycol, isopropanol).`,
  clinicalCommentary: `Formulaire classique en médecine interne et en réanimation. Le trou osmolaire (osmolarité mesurée − osmolarité calculée) est un outil diagnostique clé pour les intoxications aux alcools. Attention : l\'osmolarité calculée n\'inclut pas l\'alcool éthylique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Dorwart WV, Chalmers L. Comparison of methods for calculating serum osmolality. Clin Chem 1975',
      pmid: '1116256',
    },
    {
      type: 'pubmed',
      title: 'Kraut JA, Madias NE. Serum anion gap: its uses and limitations. Clin J Am Soc Nephrol 2007',
      pmid: '17699439',
    },
  ],
}

export default osmoplasma
