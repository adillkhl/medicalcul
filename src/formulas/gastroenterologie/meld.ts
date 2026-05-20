import type { FormulaDefinition } from '../types'

const meld: FormulaDefinition = {
  id: 'meld',
  slug: 'meld',
  name: 'MELD-Na (Score) — Model for End-Stage Liver Disease (UNOS/OPTN 2016)',
  specialty: 'gastroenterologie',
  category: 'Fonction hépatique',
  description: 'Score pronostique de survie dans la cirrhose utilisé pour la priorisation des greffons hépatiques (MELD-Na, OPTN 2016)',
  version: '2024',
  lastValidated: '2024-06',
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
      id: 'sodium',
      type: 'number',
      label: 'Natrémie (Na+)',
      unit: 'mmol/L',
      min: 100,
      max: 200,
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
    const sodium = Number(values.sodium)

    if (!creatinine || !bilirubine || !inr || creatinine <= 0 || bilirubine <= 0 || inr <= 0) {
      return {
        value: 0, label: 'Donnees insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner creatinine, bilirubine et INR.' }],
      }
    }

    let cr = creatinine / 88.4 // Convert µmol/L to mg/dL
    if (cr < 1.0) cr = 1.0
    if (cr > 4.0) cr = 4.0
    if (values.dialyse) cr = 4.0

    const bili = Math.max(bilirubine / 17.1, 1.0) // Convert to mg/dL, min 1.0
    const inrVal = Math.max(inr, 1.0) // min 1.0

    // Original MELD (scaled ×10 approach, matching UNOS format)
    // MELD = 9.57 × ln(Cr) + 3.78 × ln(Bili) + 11.2 × ln(INR) + 6.43
    const meldOriginal = 9.57 * Math.log(cr) + 3.78 * Math.log(bili) + 11.2 * Math.log(inrVal) + 6.43

    // MELD-Na: adjust for serum sodium
    // Na clamped between 125 and 140 (as used by UNOS/OPTN for MELD-Na)
    let na = sodium
    if (na && !isNaN(na)) {
      if (na < 125) na = 125
      if (na > 140) na = 140
      // MELD(i) = 0.957 × ln(Cr) + 0.378 × ln(bili) + 1.12 × ln(INR) + 6.43
      // MELD-Na = MELD(i) + 1.32 × (126 - Na) - 0.033 × MELD(i) × (126 - Na)
      const meldi = 0.957 * Math.log(cr) + 0.378 * Math.log(bili) + 1.12 * Math.log(inrVal) + 6.43
      const score = meldi + 1.32 * (126 - na) - 0.033 * meldi * (126 - na)
      const scoreArrondi = Math.max(1, Math.min(40, Math.round(score)))

      let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
      let label = ''
      let recommendation = ''

      if (scoreArrondi <= 9) {
        severity = 'low'
        label = 'MELD-Na ≤ 9'
        recommendation = 'Mortalite a 3 mois ~1.9 %. Surveillance standard. Consultation hepatologique reguliere.'
      } else if (scoreArrondi <= 19) {
        severity = 'moderate'
        label = `MELD-Na ${scoreArrondi} (10-19)`
        recommendation = 'Mortalite a 3 mois ~6.0 %. Surveillance rapprochee. Bilan pre-transplantation si eligible.'
      } else if (scoreArrondi <= 29) {
        severity = 'high'
        label = `MELD-Na ${scoreArrondi} (20-29)`
        recommendation = 'Mortalite a 3 mois ~19.6 %. Evaluation pour transplantation hepatique urgente.'
      } else {
        severity = 'critical'
        label = `MELD-Na ≥ 30 (${scoreArrondi})`
        recommendation = 'Mortalite a 3 mois > 50 %. Inscription en super-urgence pour transplantation hepatique. Hospitalisation en reanimation.'
      }

      return {
        value: scoreArrondi,
        label,
        severity,
        ranges: [
          { min: 1, max: 9, label: '≤ 9', severity: 'low', recommendation: 'Mortalité ~1.9 %. Surveillance standard.' },
          { min: 10, max: 19, label: '10-19', severity: 'moderate', recommendation: 'Mortalité ~6.0 %. Bilan pré-transplantation.' },
          { min: 20, max: 29, label: '20-29', severity: 'high', recommendation: 'Mortalité ~19.6 %. Transplantation urgente.' },
          { min: 30, max: 40, label: '≥ 30', severity: 'critical', recommendation: 'Mortalité ~52.6-71.3 %. Super-urgence transplantation.' },
        ],
      }
    }

    // Fallback: if no sodium provided, return original MELD
    const scoreArrondi = Math.max(1, Math.min(40, Math.round(meldOriginal)))

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi <= 9) {
      severity = 'low'
      label = `MELD ${scoreArrondi} (≤ 9)`
      recommendation = 'Mortalite a 3 mois < 5 %. Surveillance standard.'
    } else if (scoreArrondi <= 19) {
      severity = 'moderate'
      label = `MELD ${scoreArrondi} (10-19)`
      recommendation = 'Mortalite a 3 mois ~6-20 %. Surveillance rapprochee.'
    } else if (scoreArrondi <= 29) {
      severity = 'high'
      label = `MELD ${scoreArrondi} (20-29)`
      recommendation = 'Mortalite a 3 mois ~20-50 %. Evaluation pour transplantation.'
    } else {
      severity = 'critical'
      label = `MELD ≥ 30 (${scoreArrondi})`
      recommendation = 'Mortalite a 3 mois > 50 %. Super-urgence transplantation.'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: 1, max: 9, label: '≤ 9', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 10, max: 19, label: '10-19', severity: 'moderate', recommendation: 'Bilan pré-transplantation.' },
        { min: 20, max: 29, label: '20-29', severity: 'high', recommendation: 'Evaluation transplantation urgente.' },
        { min: 30, max: 40, label: '≥ 30', severity: 'critical', recommendation: 'Super-urgence transplantation.' },
      ],
    }
  },
  interpretation: `Le **score MELD-Na** (Model for End-Stage Liver Disease) est le score de reference pour la priorisation des patients en liste d'attente de transplantation hepatique (UNOS/OPTN 2016).

**Formule MELD** (original) :
MELD = 9.57 × ln(Cr) + 3.78 × ln(Bili) + 11.2 × ln(INR) + 6.43

**Formule MELD-Na** (OPTN 2016) :
MELD(i) = 0.957 × ln(Cr) + 0.378 × ln(Bili) + 1.12 × ln(INR) + 6.43
MELD-Na = MELD(i) + 1.32 × (126 − Na) − 0.033 × MELD(i) × (126 − Na)

Avec :
- Cr = creatinine en mg/dL (min 1, max 4)
- Bili = bilirubine en mg/dL (min 1)
- INR (min 1)
- Na = natrémie en mmol/L (clampée entre 125 et 140)

Si le patient est dialyse, la creatinine est fixee a 4 mg/dL.
Si la natrémie n'est pas renseignée, le MELD original (sans sodium) est calculé.

**Mortalite a 3 mois** (MELD-Na) :
- ≤ 9 : ~1.9 %
- 10-19 : ~6.0 %
- 20-29 : ~19.6 %
- ≥ 30 : ~52.6-71.3 %`,
  clinicalCommentary: `Le MELD-Na (2016) a remplacé le MELD original pour l'attribution des greffons. L'ajout de la natrémie améliore la prédiction de mortalité, particulièrement dans la cirrhose ascitique. Le score doit être recalculé régulièrement (toutes les semaines si MELD > 20). Attention : le MELD peut sous-estimer le risque dans l'hépatite fulminante ou le CHC.`,
  references: [
    {
      type: 'pubmed',
      title: 'Kamath PS et al. A model to predict survival in patients with end-stage liver disease. Hepatology 2001',
      pmid: '11172350',
    },
    {
      type: 'guideline',
      title: 'Recommandations AFEF — Transplantation hépatique',
      url: 'https://afef.asso.fr',
    },
  ],
}

export default meld
