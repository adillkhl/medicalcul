import type { FormulaDefinition } from '../types'

const meld: FormulaDefinition = {
  id: 'meld',
  slug: 'meld',
  name: 'MELD (Score) — Model for End-Stage Liver Disease',
  specialty: 'gastroenterologie',
  category: 'Fonction hépatique',
  description: 'Score pronostique de survie dans la cirrhose utilisé pour la priorisation des greffons hépatiques',
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
      id: 'dialyse',
      type: 'boolean',
      label: 'Hémodialyse (au moins 2 séances dans la dernière semaine)',
    },
  ],
  calculate: (values) => {
    const creatinine = Number(values.creatinine)
    const bilirubine = Number(values.bilirubine)
    const inr = Number(values.inr)

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

    const score = 9.57 * Math.log(cr) + 3.78 * Math.log(bili) + 11.2 * Math.log(inrVal) + 6.43
    const scoreArrondi = Math.round(score)

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi < 10) {
      severity = 'low'
      label = 'MELD < 10'
      recommendation = 'Mortalite a 3 mois < 5 %. Surveillance standard. Consultation hepatologique reguliere.'
    } else if (scoreArrondi < 20) {
      severity = 'moderate'
      label = `MELD ${scoreArrondi} (10-19)`
      recommendation = 'Mortalite a 3 mois ~6-20 %. Surveillance rapprochee. Bilan pre-transplantation si eligible.'
    } else if (scoreArrondi < 30) {
      severity = 'high'
      label = `MELD ${scoreArrondi} (20-29)`
      recommendation = 'Mortalite a 3 mois ~20-50 %. Evaluation pour transplantation hepatique urgente.'
    } else {
      severity = 'critical'
      label = `MELD >= 30 (${scoreArrondi})`
      recommendation = 'Mortalite a 3 mois > 50 %. Inscription en super-urgence pour transplantation hepatique. Hospitalisation en reanimation.'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: 0, max: 9, label: '< 10', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 10, max: 19, label: '10-19', severity: 'moderate', recommendation: 'Bilan pre-transplantation.' },
        { min: 20, max: 29, label: '20-29', severity: 'high', recommendation: 'Evaluation transplantation urgente.' },
        { min: 30, max: 50, label: '>= 30', severity: 'critical', recommendation: 'Super-urgence transplantation.' },
      ],
    }
  },
  interpretation: `Le **score MELD** (Model for End-Stage Liver Disease) est le score de reference pour la priorisation des patients en liste d’attente de transplantation hepatique.\n\n**Formule** (MELD original) :\nMELD = 9.57 × ln(Cr) + 3.78 × ln(Bili) + 11.2 × ln(INR) + 6.43\n\nAvec :\n- Cr = creatinine en mg/dL (min 1, max 4)\n- Bili = bilirubine en mg/dL (min 1)\n- INR (min 1)\n\nSi le patient est dialyse, la creatinine est fixee a 4 mg/dL.\n\n**Mortalite a 3 mois** :\n- MELD < 10 : < 5 %\n- MELD 10-19 : 6-20 %\n- MELD 20-29 : 20-50 %\n- MELD >= 30 : > 50 %`,
  clinicalCommentary: `Le MELD a remplacé le Child-Pugh pour l’attribution des greffons depuis 2002 (UNOS). Le MELD-Na (qui intègre la natrémie) améliore la prédiction de mortalité dans la cirrhose ascitique. Le score peut fluctuer rapidement : il doit être recalculé régulièrement (toutes les semaines si MELD > 20). Attention : le MELD a été initialement validé pour la cirrhose ; il peut sous-estimer le risque dans d\'autres pathologies (hépatite fulminante, CHC).`,
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
