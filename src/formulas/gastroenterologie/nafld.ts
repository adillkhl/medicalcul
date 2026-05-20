import type { FormulaDefinition } from '../types'

const nafld: FormulaDefinition = {
  id: 'nafld',
  slug: 'nafld',
  name: 'NAFLD (Score) — Non-Alcoholic Fatty Liver Disease',
  specialty: 'gastroenterologie',
  category: 'Fibrose hépatique',
  description: 'Score de risque de fibrose hépatique dans la stéatose hépatique non alcoolique (NAFLD)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'number',
      label: 'Âge',
      unit: 'ans',
      min: 18,
      max: 120,
      step: 1,
      placeholder: 'Ex: 55',
    },
    {
      id: 'imc',
      type: 'number',
      label: 'IMC',
      unit: 'kg/m²',
      min: 10,
      max: 60,
      step: 0.1,
      placeholder: 'Ex: 32',
    },
    {
      id: 'diabete',
      type: 'boolean',
      label: 'Diabète de type 2 ou intolérance au glucose',
    },
    {
      id: 'asat_alat_ratio',
      type: 'number',
      label: 'Ratio ASAT/ALAT (AST/ALT)',
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: 'Ex: 0.8',
    },
    {
      id: 'plaquettes',
      type: 'number',
      label: 'Plaquettes',
      unit: '×10⁹/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 200',
    },
    {
      id: 'albumine',
      type: 'number',
      label: 'Albumine sérique',
      unit: 'g/L',
      min: 0,
      max: 60,
      step: 1,
      placeholder: 'Ex: 40',
    },
  ],
  calculate: (values) => {
    const age = Number(values.age)
    const imc = Number(values.imc)
    const ratio = Number(values.asat_alat_ratio)
    const plt = Number(values.plaquettes)
    const alb = Number(values.albumine)
    const diabete = values.diabete || false

    if (!age || !imc || !ratio || !plt || !alb || age <= 0 || imc <= 0 || ratio <= 0 || plt <= 0 || alb <= 0) {
      return {
        value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner âge, IMC, ratio ASAT/ALAT, plaquettes et albumine.' }],
      }
    }

    // NAFLD fibrosis score formula
    const score = -1.675 + 0.037 * age + 0.094 * imc + (diabete ? 1.13 : 0) + 0.99 * (ratio) - 0.013 * plt - 0.66 * alb
    const scoreArrondi = Math.round(score * 100) / 100

    let severity: 'low' | 'moderate' | 'high' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi < -1.455) {
      severity = 'low'
      label = 'NAFLD < -1.455 — Fibrose avancée peu probable (F0-F2)'
      recommendation = 'Probabilité élevée d\'absence de fibrose avancée (VPN > 90 %). Surveillance standard. Contrôle des facteurs de risque métaboliques.'
    } else if (scoreArrondi <= 0.676) {
      severity = 'moderate'
      label = 'NAFLD -1.455 à 0.676 — Zone grise'
      recommendation = 'Risque indéterminé. Tests complémentaires recommandés (FibroScan, FIB-4, biopsie hépatique si nécessaire).'
    } else {
      severity = 'high'
      label = 'NAFLD > 0.676 — Fibrose avancée probable (F3-F4)'
      recommendation = 'Probabilité élevée de fibrose avancée ou cirrhose. Avis hépatologique spécialisé. Bilan complet. Envisager biopsie hépatique.'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: -10, max: -1.456, label: '< -1.455 — Fibrose avancée peu probable', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: -1.455, max: 0.676, label: '-1.455 à 0.676 — Zone grise', severity: 'moderate', recommendation: 'Compléter par FibroScan.' },
        { min: 0.677, max: 10, label: '> 0.676 — Fibrose avancée probable', severity: 'high', recommendation: 'Avis hépatologique. Biopsie si nécessaire.' },
      ],
    }
  },
  interpretation: `Le **NAFLD fibrosis score** est un score non invasif validé pour prédire la présence de fibrose avancée (stade F3-F4) chez les patients atteints de stéatose hépatique non alcoolique.\n\n**Formule** :\nNAFLD score = -1.675 + 0.037 × âge + 0.094 × IMC + 1.13 (si diabète) + 0.99 × (ASAT/ALAT) - 0.013 × plaquettes - 0.66 × albumine\n\n| Seuil | Interprétation |\n|-------|---------------|\n| < -1.455 | Fibrose avancée peu probable (VPN 93 %) |\n| -1.455 à 0.676 | Zone grise (indéterminé) |\n| > 0.676 | Fibrose avancée probable (VPP 82 %) |`,
  clinicalCommentary: `Le NAFLD fibrosis score est recommandé par les guidelines EASL et AASLD comme test de première intention pour le dépistage de la fibrose chez les patients NAFLD. En cas de zone grise, le FIB-4 et/ou le FibroScan sont recommandés. Important : le NAFLD score a été validé pour les patients NAFLD, pas pour les autres étiologies d’hépatopathie. Avec la mise à jour de la nomenclature (MASLD), ce score reste valide pour la stéatose métabolique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Angulo P et al. The NAFLD fibrosis score: a noninvasive system that identifies liver fibrosis in patients with NAFLD. Hepatology 2007',
      pmid: '17256703',
    },
    {
      type: 'guideline',
      title: 'EASL-EASD-EASO Clinical Practice Guidelines for the management of NAFLD (2016)',
      url: 'https://easl.eu',
    },
  ],
}

export default nafld
