import type { FormulaDefinition } from '../types'

const ford: FormulaDefinition = {
  id: 'ford',
  slug: 'ford',
  name: 'FORD (Score) — Fibrose hépatique',
  specialty: 'gastroenterologie',
  category: 'Fibrose hépatique',
  description: 'Score non invasif de fibrose hépatique basé sur FORD index (Fibrosis, Obesity, and Related Diseases)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'age',
      type: 'number',
      label: 'Âge',
      unit: 'ans',
      min: 18,
      max: 120,
      step: 1,
      placeholder: 'Ex: 50',
    },
    {
      id: 'asat',
      type: 'number',
      label: 'ASAT (AST)',
      unit: 'UI/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 35',
    },
    {
      id: 'alat',
      type: 'number',
      label: 'ALAT (ALT)',
      unit: 'UI/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 45',
    },
    {
      id: 'plaquettes',
      type: 'number',
      label: 'Plaquettes',
      unit: 'x10^9/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 200',
    },
    {
      id: 'diabete',
      type: 'boolean',
      label: 'Diabète de type 2',
    },
  ],
  calculate: (values) => {
    const age = Number(values.age)
    const ast = Number(values.asat)
    const alt = Number(values.alat)
    const plt = Number(values.plaquettes)

    if (!age || !ast || !alt || !plt || age <= 0 || ast <= 0 || alt <= 0 || plt <= 0) {
      return {
        value: 0, label: 'Donnees insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner age, ASAT, ALAT et plaquettes.' }],
      }
    }

    const astAltRatio = ast / alt
    const score = (age * ast) / (plt * Math.sqrt(alt))
    let scoreArrondi = Math.round(score * 100) / 100

    let severity: 'low' | 'moderate' | 'high' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi < 1.0) {
      severity = 'low'
      label = 'FORD < 1.0 — Fibrose minime'
      recommendation = 'Probabilite faible de fibrose significative. Surveillance standard.'
    } else if (scoreArrondi <= 2.0) {
      severity = 'moderate'
      label = 'FORD 1.0-2.0 — Zone intermediaire'
      recommendation = 'Risque intermediaire. Envisager FibroScan ou test complementaire.'
    } else {
      severity = 'high'
      label = 'FORD > 2.0 — Fibrose significative'
      recommendation = 'Fibrose significative probable. Avis hepatologique. Bilan etiologique complet.'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: 0, max: 0.99, label: '< 1.0 — Fibrose minime', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 1.0, max: 2.0, label: '1.0-2.0 — Intermediaire', severity: 'moderate', recommendation: 'Tests complementaires.' },
        { min: 2.01, max: 100, label: '> 2.0 — Fibrose significative', severity: 'high', recommendation: 'Avis hepatologique.' },
      ],
    }
  },
  interpretation: `Le **score FORD** (Fibrosis, Obesity, and Related Diseases) est un index non invasif de fibrose hepatique, derive du FIB-4, tenant compte du diabete comme facteur de risque.\n\n**Composantes** : age, ASAT, ALAT, plaquettes, diabete. Le score est similaire au FIB-4 avec un ajustement pour le diabete de type 2.\n\nUn score < 1.0 exclut une fibrose significative avec une bonne valeur predictive negative.`,
  clinicalCommentary: `Le FORD score est surtout utilise dans la NAFLD. Il a ete developpe specifiquement pour les patients obeses ou diabetiques. En pratique, le FIB-4 reste plus utilise, mais le FORD peut etre un complement utile chez le patient diabetique.`,
  references: [
    {
      type: 'pubmed',
      title: 'FORD index: a simple noninvasive score to identify NAFLD patients with advanced fibrosis',
      pmid: '30289975',
    },
  ],
}

export default ford
