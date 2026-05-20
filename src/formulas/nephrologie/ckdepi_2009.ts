import type { FormulaDefinition } from '../types'

const ckdepi2009: FormulaDefinition = {
  id: 'ckd-epi-2009',
  slug: 'ckdepi-2009',
  name: 'CKD-EPI 2009 (DFG estimé)',
  specialty: 'nephrologie',
  category: 'Fonction rénale',
  description: 'Estimation du débit de filtration glomérulaire par la formule CKD-EPI 2009 (créatinine)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'creatinine',
      type: 'number',
      label: 'Créatininémie',
      unit: 'µmol/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 80',
    },
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
      id: 'sexe',
      type: 'radio',
      label: 'Sexe',
      options: [
        { value: 1, label: 'Femme' },
        { value: 2, label: 'Homme' },
      ],
    },
    {
      id: 'ethnie',
      type: 'radio',
      label: 'Ethnie',
      options: [
        { value: 1, label: 'Non noir' },
        { value: 2, label: 'Noir (Afro-américain)' },
      ],
    },
  ],
  calculate: (values) => {
    const creat = Number(values.creatinine)
    const age = Number(values.age)
    const sexe = Number(values.sexe)
    const ethnie = Number(values.ethnie)

    if (!creat || !age || !sexe || creat <= 0 || age <= 0) {
      return {
        value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'DFG non calculable', severity: 'low', recommendation: 'Renseigner créatinine, âge et sexe.' }],
      }
    }

    const cr = creat / 88.4 // Convert to mg/dL
    const isFemale = sexe === 1
    const isBlack = ethnie === 2

    let kappa = isFemale ? 0.7 : 0.9
    let alpha = isFemale ? -0.329 : -0.411
    let sexFactor = isFemale ? 1.018 : 1
    let ethnieFactor = isBlack ? 1.159 : 1

    const minRatio = Math.min(cr / kappa, 1)
    const maxRatio = Math.max(cr / kappa, 1)

    let dfg = 141 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.209) * Math.pow(0.993, age) * sexFactor * ethnieFactor
    let dfgArrondi = Math.round(dfg)

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
      recommendation = 'Insuffisance rénale modérée. Surveillance semestrielle. Bilan néphrologique. Contrôle facteurs de risque.'
    } else if (dfgArrondi >= 30) {
      severity = 'high'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G3b`
      recommendation = 'Insuffisance rénale modérée à sévère. Suivi néphrologique rapproché. Adaptation posologique des médicaments.'
    } else if (dfgArrondi >= 15) {
      severity = 'high'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G4`
      recommendation = 'Insuffisance rénale sévère. Suivi néphrologique régulier. Préparation à la dialyse ou transplantation.'
    } else {
      severity = 'critical'
      label = `DFG ${dfgArrondi} mL/min/1.73m² — Stade G5`
      recommendation = 'Insuffisance rénale terminale. Dialyse ou transplantation. Avis néphrologique urgent.'
    }

    return {
      value: dfgArrondi,
      label,
      severity,
      ranges: [
        { min: 90, max: 200, label: '>= 90 (G1) — Normal', severity: 'low', recommendation: 'Pas de suivi spécifique.' },
        { min: 60, max: 89, label: '60-89 (G2) — Légèrement diminué', severity: 'low', recommendation: 'Suivi annuel.' },
        { min: 45, max: 59, label: '45-59 (G3a) — Modéré', severity: 'moderate', recommendation: 'Surveillance semestrielle.' },
        { min: 30, max: 44, label: '30-44 (G3b) — Modéré à sévère', severity: 'high', recommendation: 'Suivi néphrologique.' },
        { min: 15, max: 29, label: '15-29 (G4) — Sévère', severity: 'high', recommendation: 'Préparation dialyse.' },
        { min: 0, max: 14, label: '< 15 (G5) — Terminale', severity: 'critical', recommendation: 'Dialyse/transplantation urgente.' },
      ],
    }
  },
  interpretation: `La **formule CKD-EPI 2009** est la formule de référence pour l’estimation du débit de filtration glomérulaire (DFG) à partir de la créatininémie.\n\n**Formule** :\nDFG = 141 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^-1.209 × 0.993^Âge × (1.018 si femme) × (1.159 si noir)\n\nOù κ = 0.7 (femme) ou 0.9 (homme), α = -0.329 (femme) ou -0.411 (homme).\n\n**Stades KDIGO** : G1 (≥ 90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (< 15).\n\nLe DFG estimé est exprimé en mL/min/1.73 m².`,
  clinicalCommentary: `La CKD-EPI 2009 est plus précise que la MDRD pour les DFG > 60 mL/min. Elle est recommandée par les guidelines KDIGO. Depuis 2021, une nouvelle version sans coefficient ethnique a été publiée (CKD-EPI 2021) pour éviter les biais raciaux. Attention : la formule n’est pas validée en insuffisance rénale aiguë, chez les patients dénutris ou amputés, ni en cas de variations brutales de la créatinine.`,
  references: [
    {
      type: 'pubmed',
      title: 'Levey AS et al. A new equation to estimate glomerular filtration rate. Ann Intern Med 2009',
      pmid: '19414839',
    },
    {
      type: 'guideline',
      title: 'KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
      url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/',
    },
  ],
}

export default ckdepi2009
