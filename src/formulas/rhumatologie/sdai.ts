import type { FormulaDefinition } from '../types'

const sdai: FormulaDefinition = {
  id: 'sdai',
  slug: 'sdai',
  name: 'SDAI — Score d\'activité simplifié de la PR',
  specialty: 'rhumatologie',
  category: 'Polyarthrite rhumatoïde',
  description: 'Simplified Disease Activity Index — Score composite simplifié pour la polyarthrite rhumatoïde.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'nad',
      type: 'number',
      label: 'Nombre d\'articulations douloureuses parmi 28 (NAD)',
      min: 0,
      max: 28,
      step: 1,
      placeholder: '6',
    },
    {
      id: 'nag',
      type: 'number',
      label: 'Nombre d\'articulations gonflées parmi 28 (NAG)',
      min: 0,
      max: 28,
      step: 1,
      placeholder: '4',
    },
    {
      id: 'evs_patient',
      type: 'number',
      label: 'EVA patient — activité globale (0–10 cm)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '5',
    },
    {
      id: 'evs_medecin',
      type: 'number',
      label: 'EVA médecin — activité globale (0–10 cm)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '4',
    },
    {
      id: 'crp',
      type: 'number',
      label: 'CRP (mg/dL) — attention : unité mg/dL (diviser mg/L par 10)',
      min: 0,
      max: 20,
      step: 0.1,
      placeholder: '1.5',
    },
  ],
  calculate: (values) => {
    const nad = values.nad ?? 0
    const nag = values.nag ?? 0
    const evsP = values.evs_patient ?? 0
    const evsM = values.evs_medecin ?? 0
    const crp = values.crp ?? 0.5

    const sdaiVal = nad + nag + evsP + evsM + crp
    const sdaiRound = Math.round(sdaiVal * 10) / 10

    if (sdaiRound <= 3.3) {
      return {
        value: sdaiRound,
        label: `SDAI = ${sdaiRound} — Rémission`,
        severity: 'low',
        ranges: [
          { min: 0, max: 3.3, label: '≤ 3.3 : Rémission', severity: 'low' },
          { min: 3.3, max: 11, label: '3.3–11 : Faible activité', severity: 'low' },
          { min: 11, max: 26, label: '11–26 : Activité modérée', severity: 'moderate' },
          { min: 26, max: 999, label: '> 26 : Activité élevée', severity: 'high' },
        ],
      }
    }
    if (sdaiRound <= 11) {
      return {
        value: sdaiRound,
        label: `SDAI = ${sdaiRound} — Faible activité`,
        severity: 'low',
        ranges: [
          { min: 0, max: 3.3, label: '≤ 3.3 : Rémission', severity: 'low' },
          { min: 3.3, max: 11, label: '3.3–11 : Faible', severity: 'low' },
          { min: 11, max: 26, label: '11–26 : Modérée', severity: 'moderate' },
          { min: 26, max: 999, label: '> 26 : Élevée', severity: 'high' },
        ],
      }
    }
    if (sdaiRound <= 26) {
      return {
        value: sdaiRound,
        label: `SDAI = ${sdaiRound} — Activité modérée`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 3.3, label: '≤ 3.3 : Rémission', severity: 'low' },
          { min: 3.3, max: 11, label: '3.3–11 : Faible', severity: 'low' },
          { min: 11, max: 26, label: '11–26 : Modérée', severity: 'moderate' },
          { min: 26, max: 999, label: '> 26 : Élevée', severity: 'high' },
        ],
      }
    }
    return {
      value: sdaiRound,
      label: `SDAI = ${sdaiRound} — Activité élevée`,
      severity: 'high',
      ranges: [
        { min: 0, max: 3.3, label: '≤ 3.3 : Rémission', severity: 'low' },
        { min: 3.3, max: 11, label: '3.3–11 : Faible', severity: 'low' },
        { min: 11, max: 26, label: '11–26 : Modérée', severity: 'moderate' },
        { min: 26, max: 999, label: '> 26 : Élevée', severity: 'high' },
      ],
    }
  },
  interpretation: `**SDAI** (Simplified Disease Activity Index) — Somme simple :

**SDAI** = NAD + NAG + EVA_patient + EVA_médecin + CRP (mg/dL)

| Score | Activité |
|---|---|
| ≤ 3,3 | Rémission |
| 3,3 – ≤ 11 | Faible |
| 11 – ≤ 26 | Modérée |
| > 26 | Élevée |

**Avantage :** pas de formule complexe (contrairement au DAS28). Inclut l'évaluation du médecin.`,
  clinicalCommentary: `Le SDAI est un score simple et reproductible. La rémission définie par le SDAI ≤ 3,3 est plus stricte que le DAS28 ≤ 2,6. Recommandé par l'EULAR comme critère de rémission dans les essais cliniques.`,
  references: [
    {
      type: 'pubmed',
      title: 'Smolen JS et al. A simplified disease activity index for rheumatoid arthritis. Arthritis Rheum 2003',
      pmid: '12969405',
    },
    {
      type: 'pubmed',
      title: 'Aletaha D, Smolen J. The Simplified Disease Activity Index. Rheumatology 2010',
      pmid: '20591856',
    },
  ],
}

export default sdai
