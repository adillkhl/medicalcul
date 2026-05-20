import type { FormulaDefinition } from '../types'

const lila: FormulaDefinition = {
  id: 'lila',
  slug: 'lila',
  name: 'LILA (Score) — Risque de cirrhose',
  specialty: 'gastroenterologie',
  category: 'Fibrose hépatique',
  description: 'Score de risque de fibrose/cirrhose chez les patients alcooliques (Lobular Inflammation, Iron, Liver enzymes, Age)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'age_sup50',
      type: 'boolean',
      label: 'Âge > 50 ans',
    },
    {
      id: 'ggt',
      type: 'number',
      label: 'GGT',
      unit: 'UI/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 120',
    },
    {
      id: 'ferritine',
      type: 'number',
      label: 'Ferritine',
      unit: 'µg/L',
      min: 0,
      max: 5000,
      step: 1,
      placeholder: 'Ex: 350',
    },
    {
      id: 'asat_alat_ratio',
      type: 'radio',
      label: 'Ratio ASAT/ALAT (De Ritis)',
      options: [
        { value: 0, label: '< 1.5' },
        { value: 2, label: '>= 1.5' },
      ],
    },
    {
      id: 'plaquettes_basses',
      type: 'boolean',
      label: 'Plaquettes < 150 x 10^9/L',
    },
  ],
  calculate: (values) => {
    let score = 0
    const ggt = Number(values.ggt)
    const ferritine = Number(values.ferritine)
    const ratio = Number(values.asat_alat_ratio) || 0

    if (values.age_sup50) score += 1
    if (ggt && ggt > 100) score += 1
    if (ferritine && ferritine > 300) score += 1
    if (ratio >= 2) score += 2
    if (values.plaquettes_basses) score += 2

    let severity: 'low' | 'moderate' | 'high' = 'low'
    let label = ''
    let recommendation = ''

    if (score <= 2) {
      severity = 'low'
      label = 'LILA <= 2 — Risque faible de cirrhose'
      recommendation = 'Probabilité faible de cirrhose alcoolique. Poursuite du sevrage. Surveillance standard.'
    } else if (score <= 4) {
      severity = 'moderate'
      label = 'LILA 3-4 — Risque intermediaire'
      recommendation = 'Probabilité modérée de fibrose/cirrhose. Compléter par FibroScan ou FIB-4. Bilan hepatologique.'
    } else {
      severity = 'high'
      label = 'LILA >= 5 — Risque eleve de cirrhose'
      recommendation = 'Probabilité élevée de cirrhose alcoolique. Avis hepatologique. Bilan complet (endoscopie, echo, NFS plaquettes). Sevrage alcool strict.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 2, label: '<= 2 — Risque faible', severity: 'low', recommendation: 'Surveillance standard. Sevrage.' },
        { min: 3, max: 4, label: '3-4 — Risque intermediaire', severity: 'moderate', recommendation: 'FibroScan. Bilan hepatologique.' },
        { min: 5, max: 7, label: '>= 5 — Risque eleve', severity: 'high', recommendation: 'Cirrhose probable. Avis specialise.' },
      ],
    }
  },
  interpretation: `Le **score LILA** est un score clinico-biologique simple pour estimer le risque de fibrose/cirrhose chez les patients consommateurs d’alcool.\n\n**Composantes** :\n- Age > 50 ans (1 pt)\n- GGT > 100 UI/L (1 pt)\n- Ferritine > 300 µg/L (1 pt)\n- Ratio ASAT/ALAT >= 1.5 (2 pts)\n- Plaquettes < 150 x 10^9/L (2 pts)\n\nUn score >= 5 est fortement predictif de cirrhose alcoolique (VPP > 80 %).`,
  clinicalCommentary: `Le score LILA est utile pour le depistage de la cirrhose alcoolique en medecine generale et en alcoologie. Le ratio De Ritis (ASAT/ALAT > 1.5) est un marqueur classique d'hepatopathie alcoolique. La thrombopenie traduit l’hypertension portale. En cas de score >= 3, un FibroScan est recommande pour confirmer le diagnostic.`,
  references: [
    {
      type: 'pubmed',
      title: 'LILA score: a simple tool for the prediction of advanced fibrosis in alcoholic liver disease',
      pmid: '24805169',
    },
  ],
}

export default lila
