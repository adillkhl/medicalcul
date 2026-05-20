import type { FormulaDefinition } from '../types'

const meldNa: FormulaDefinition = {
  id: 'meld-na',
  slug: 'meld-na',
  name: 'MELD-Na (Score) — Model for End-Stage Liver Disease with Sodium',
  specialty: 'gastroenterologie',
  category: 'Fonction hépatique',
  description: 'Score MELD intégrant la natrémie pour améliorer la prédiction de mortalité dans la cirrhose',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'creatinine',
      type: 'number',
      label: 'Créatininémie',
      unit: 'µmol/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 100',
    },
    {
      id: 'bilirubine',
      type: 'number',
      label: 'Bilirubine totale',
      unit: 'µmol/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 50',
    },
    {
      id: 'inr',
      type: 'number',
      label: 'INR',
      min: 0.5,
      max: 10,
      step: 0.1,
      placeholder: 'Ex: 1.5',
    },
    {
      id: 'natremie',
      type: 'number',
      label: 'Natrémie',
      unit: 'mmol/L',
      min: 100,
      max: 160,
      step: 1,
      placeholder: 'Ex: 135',
    },
    {
      id: 'dialyse',
      type: 'boolean',
      label: 'Hémodialyse (au moins 2 séances dans la dernière semaine)',
    },
  ],
  calculate: (values) => {
    const creatinine = Number(values.creatinine)
    const bilirubine = Number(values.bilirubine)
    const inr = Number(values.inr)
    const na = Number(values.natremie)

    if (!creatinine || !bilirubine || !inr || !na || creatinine <= 0 || bilirubine <= 0 || inr <= 0 || na <= 0) {
      return {
        value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner créatinine, bilirubine, INR et natrémie.' }],
      }
    }

    let cr = creatinine / 88.4 // Convert to mg/dL
    if (cr < 1.0) cr = 1.0
    if (cr > 4.0) cr = 4.0
    if (values.dialyse) cr = 4.0

    const bili = Math.max(bilirubine / 17.1, 1.0)
    const inrVal = Math.max(inr, 1.0)

    // MELD original
    const meld = 9.57 * Math.log(cr) + 3.78 * Math.log(bili) + 11.2 * Math.log(inrVal) + 6.43

    // Na contraint entre 125 et 140
    const naContraint = Math.min(Math.max(na, 125), 140)

    // MELD-Na = MELD + 1.32 * (137 - Na) - 0.033 * MELD * (137 - Na)
    const meldNa = meld + 1.32 * (137 - naContraint) - 0.033 * meld * (137 - naContraint)
    const scoreArrondi = Math.max(Math.round(meldNa), 6) // min 6

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi < 10) {
      severity = 'low'
      label = 'MELD-Na < 10'
      recommendation = 'Mortalité à 3 mois < 5 %. Surveillance standard.'
    } else if (scoreArrondi < 20) {
      severity = 'moderate'
      label = `MELD-Na ${scoreArrondi} (10-19)`
      recommendation = 'Mortalité à 3 mois ~5-20 %. Bilan pré-transplantation.'
    } else if (scoreArrondi < 30) {
      severity = 'high'
      label = `MELD-Na ${scoreArrondi} (20-29)`
      recommendation = 'Mortalité ~20-50 %. Évaluation pour transplantation urgente.'
    } else {
      severity = 'critical'
      label = `MELD-Na >= 30 (${scoreArrondi})`
      recommendation = 'Mortalité > 50 %. Inscription super-urgence transplantation.'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: 0, max: 9, label: '< 10', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 10, max: 19, label: '10-19', severity: 'moderate', recommendation: 'Bilan pré-transplantation.' },
        { min: 20, max: 29, label: '20-29', severity: 'high', recommendation: 'Transplantation urgente.' },
        { min: 30, max: 50, label: '>= 30', severity: 'critical', recommendation: 'Super-urgence transplantation.' },
      ],
    }
  },
  interpretation: `Le **MELD-Na** améliore le score MELD en intégrant la natrémie, facteur pronostique majeur dans la cirrhose ascitique.\n\n**Formule** :\nMELD-Na = MELD + 1.32 × (137 - Na) - 0.033 × MELD × (137 - Na)\n\nAvec Na contrainte entre 125 et 140 mmol/L.\n\nL'hyponatrémie (< 135 mmol/L) est fréquente dans la cirrhose décompensée et constitue un facteur de mauvais pronostic indépendant. Le MELD-Na améliore la stratification du risque de mortalité à 3 mois chez les patients cirrhotiques en liste d’attente.`,
  clinicalCommentary: `Le MELD-Na est utilisé par l’UNOS pour l'attribution des greffons depuis 2016. Il est supérieur au MELD seul pour prédire la mortalité chez les patients avec ascite et hyponatrémie. Attention : le MELD-Na ne doit pas être utilisé si le patient a une hyponatrémie de dilution (si le patient reçoit des diurétiques, la natrémie peut être faussement basse). Toujours vérifier la volémie et l'apport en sel avant d’interpréter.`,
  references: [
    {
      type: 'pubmed',
      title: 'Kim WR et al. Hyponatremia and mortality among patients on the liver-transplant waiting list. N Engl J Med 2008',
      pmid: '18650579',
    },
    {
      type: 'guideline',
      title: 'UNOS — Policy change: MELD exception score review (2016)',
      url: 'https://unos.org',
    },
  ],
}

export default meldNa
