import type { FormulaDefinition } from '../types'

const ckdepi2021: FormulaDefinition = {
  id: 'ckd-epi-2021',
  slug: 'ckdepi-2021',
  name: 'CKD-EPI 2021 (DFG estimé) — Équation sans coefficient ethnique',
  specialty: 'nephrologie',
  category: 'Fonction rénale',
  description: 'Estimation du débit de filtration glomérulaire par la formule CKD-EPI 2021, sans coefficient ethnique. Recommandée par KDIGO 2024.',
  version: '2024',
  lastValidated: '2024-06',
  evidenceLevel: 'A',
  inputs: [
    { id: 'creatinine', type: 'number', label: 'Créatininémie', unit: 'µmol/L', min: 0, max: 2000, step: 1, placeholder: 'Ex: 80' },
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 120, step: 1, placeholder: 'Ex: 50' },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 1, label: 'Femme' }, { value: 2, label: 'Homme' }] },
    { id: 'cystatin', type: 'number', label: 'Cystatine C (optionnel)', unit: 'mg/L', min: 0.1, max: 10, step: 0.01, placeholder: 'Ex: 1.0' },
  ],
  calculate: (values) => {
    const creat = Number(values.creatinine)
    const age = Number(values.age)
    const sexe = Number(values.sexe)
    const cystat = values.cystatin ? Number(values.cystatin) : undefined

    if (!creat || !age || !sexe || creat <= 0 || age <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'DFG non calculable', severity: 'low', recommendation: 'Renseigner créatinine, âge et sexe.' }] }
    }

    const cr = creat / 88.4 // Convert µmol/L to mg/dL
    const isFemale = sexe === 1

    let dfg: number
    let eqLabel: string

    if (cystat && cystat > 0) {
      // CKD-EPI 2021 Creatinine-Cystatin C equation (race-free)
      // GFR = 135 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-0.544 × min(CysC/0.8, 1)^-0.323 × max(CysC/0.8, 1)^-0.778 × 0.9961^Age × 0.963 (if female)
      const kappa = isFemale ? 0.7 : 0.9
      const alpha = isFemale ? -0.219 : -0.281
      const sexFactor = isFemale ? 0.963 : 1

      const minCr = Math.min(cr / kappa, 1)
      const maxCr = Math.max(cr / kappa, 1)
      const minCys = Math.min(cystat / 0.8, 1)
      const maxCys = Math.max(cystat / 0.8, 1)

      dfg = 135 * Math.pow(minCr, alpha) * Math.pow(maxCr, -0.544) * Math.pow(minCys, -0.323) * Math.pow(maxCys, -0.778) * Math.pow(0.9961, age) * sexFactor
      eqLabel = 'CKD-EPI 2021 Créatinine-Cystatine C'
    } else {
      // CKD-EPI 2021 Creatinine equation (race-free)
      const kappa = isFemale ? 0.7 : 0.9
      const alpha = isFemale ? -0.241 : -0.302
      const sexFactor = isFemale ? 1.012 : 1

      const minRatio = Math.min(cr / kappa, 1)
      const maxRatio = Math.max(cr / kappa, 1)

      dfg = 142 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.200) * Math.pow(0.9938, age) * sexFactor
      eqLabel = 'CKD-EPI 2021 Créatinine'
    }

    const dfgArrondi = Math.round(dfg)

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (dfgArrondi >= 90) {
      severity = 'low'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G1`
      recommendation = 'Fonction rénale normale ou augmentée. Pas de suivi néphrologique spécifique si absence de marqueurs d\'atteinte rénale.'
    } else if (dfgArrondi >= 60) {
      severity = 'low'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G2`
      recommendation = 'Fonction rénale légèrement diminuée. Suivi annuel. Dépistage des facteurs de risque CV.'
    } else if (dfgArrondi >= 45) {
      severity = 'moderate'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G3a`
      recommendation = 'Insuffisance rénale modérée. Surveillance semestrielle. Bilan néphrologique.'
    } else if (dfgArrondi >= 30) {
      severity = 'high'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G3b`
      recommendation = 'Insuffisance rénale modérée à sévère. Suivi néphrologique rapproché.'
    } else if (dfgArrondi >= 15) {
      severity = 'high'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G4`
      recommendation = 'Insuffisance rénale sévère. Suivi néphrologique régulier.'
    } else {
      severity = 'critical'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G5`
      recommendation = 'Insuffisance rénale terminale. Dialyse ou transplantation.'
    }

    return {
      value: dfgArrondi,
      label,
      severity,
      details: { Équation: eqLabel },
      ranges: [
        { min: 90, max: 200, label: '≥ 90 (G1) — Normal', severity: 'low', recommendation: 'Pas de suivi spécifique.' },
        { min: 60, max: 89, label: '60-89 (G2) — Légèrement diminué', severity: 'low', recommendation: 'Suivi annuel.' },
        { min: 45, max: 59, label: '45-59 (G3a) — Modéré', severity: 'moderate', recommendation: 'Surveillance semestrielle.' },
        { min: 30, max: 44, label: '30-44 (G3b) — Modéré à sévère', severity: 'high', recommendation: 'Suivi néphrologique.' },
        { min: 15, max: 29, label: '15-29 (G4) — Sévère', severity: 'high', recommendation: 'Préparation dialyse.' },
        { min: 0, max: 14, label: '< 15 (G5) — Terminale', severity: 'critical', recommendation: 'Dialyse/transplantation.' },
      ],
    }
  },
  interpretation: `**CKD-EPI 2021 (sans coefficient ethnique)** — Recommandée par KDIGO 2024.

**Équation créatinine (DFGcr) :**
DFG = 142 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^-1.200 × 0.9938^Âge × (1.012 si femme)
κ = 0.7 (femme) ou 0.9 (homme), α = -0.241 (femme) ou -0.302 (homme)

**Équation créatinine-cystatine C (DFGcr-cys) :**
DFG = 135 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^-0.544 × min(CysC/0.8, 1)^-0.323 × max(CysC/0.8, 1)^-0.778 × 0.9961^Âge × (0.963 si femme)

**Stades KDIGO :** G1 (≥ 90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (< 15).`,
  clinicalCommentary: 'Formule CKD-EPI 2021 sans coefficient ethnique, recommandée par KDIGO 2024 (NEJM 2021, PMID: 34554658). Disponible également en version combinée créatinine-cystatine C (plus précise). Ne pas utiliser en IRA, chez les patients dénutris, amputés, ou en cas de variations brutales de la créatinine.',
  references: [
    { type: 'pubmed', title: 'Inker LA et al. New creatinine- and cystatin C-based equations to estimate GFR without race. NEJM 2021', pmid: '34554658' },
    { type: 'guideline', title: 'KDIGO 2024 Clinical Practice Guideline for CKD', url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/' },
  ],
}
export default ckdepi2021
