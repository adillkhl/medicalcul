import type { FormulaDefinition } from '../types'

const ckdepi2009: FormulaDefinition = {
  id: 'ckd-epi-2009',
  slug: 'ckdepi-2009',
  name: 'CKD-EPI (DFG estimé) — 2009 avec coefficient ethnique / 2021 sans coefficient',
  specialty: 'nephrologie',
  category: 'Fonction rénale',
  description: 'Estimation du débit de filtration glomérulaire par la formule CKD-EPI. Choix entre 2009 (avec coefficient ethnique) et 2021 (sans race, recommandée par KDIGO 2024)',
  version: '2024',
  lastValidated: '2024-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'equation_version',
      type: 'radio',
      label: 'Version de la formule',
      options: [
        { value: 2009, label: 'CKD-EPI 2009 (avec coefficient ethnique)' },
        { value: 2021, label: 'CKD-EPI 2021 (sans race, recommandée)' },
      ],
    },
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
      label: 'Ethnie (uniquement pour CKD-EPI 2009)',
      options: [
        { value: 1, label: 'Non noir' },
        { value: 2, label: 'Noir (Afro-américain)' },
      ],
    },
  ],
  calculate: (values) => {
    const equationVersion = Number(values.equation_version) || 2009
    const creat = Number(values.creatinine)
    const age = Number(values.age)
    const sexe = Number(values.sexe)

    if (!creat || !age || !sexe || creat <= 0 || age <= 0) {
      return {
        value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'DFG non calculable', severity: 'low', recommendation: 'Renseigner créatinine, âge et sexe.' }],
      }
    }

    const cr = creat / 88.4 // Convert to mg/dL
    const isFemale = sexe === 1
    const isBlack = (Number(values.ethnie) === 2) && (equationVersion === 2009)

    let dfg: number

    if (equationVersion === 2021) {
      // CKD-EPI 2021 Creatinine equation (race-free)
      // GFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Age × 1.012 (if female)
      const kappa = isFemale ? 0.7 : 0.9
      const alpha = isFemale ? -0.241 : -0.302
      const sexFactor = isFemale ? 1.012 : 1

      const minRatio = Math.min(cr / kappa, 1)
      const maxRatio = Math.max(cr / kappa, 1)

      dfg = 142 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.200) * Math.pow(0.9938, age) * sexFactor
    } else {
      // CKD-EPI 2009 Creatinine equation (with race coefficient)
      const kappa = isFemale ? 0.7 : 0.9
      const alpha = isFemale ? -0.329 : -0.411
      const sexFactor = isFemale ? 1.018 : 1
      const ethnieFactor = isBlack ? 1.159 : 1

      const minRatio = Math.min(cr / kappa, 1)
      const maxRatio = Math.max(cr / kappa, 1)

      dfg = 141 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.209) * Math.pow(0.993, age) * sexFactor * ethnieFactor
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
  interpretation: `**CKD-EPI** — Estimation du débit de filtration glomérulaire (DFG) en mL/min/1.73m².

**Deux versions disponibles :**

**CKD-EPI 2021 (recommandée)** :
DFG = 142 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^-1.200 × 0.9938^Âge × (1.012 si femme)
κ = 0.7 (femme) ou 0.9 (homme), α = -0.241 (femme) ou -0.302 (homme)
→ Sans coefficient ethnique. Recommandée par KDIGO 2024. NEJM 2021 (PMID: 34554658)

**CKD-EPI 2009 (legacy)** :
DFG = 141 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^-1.209 × 0.993^Âge × (1.018 si femme) × (1.159 si noir)
→ Avec coefficient ethnique. Ann Intern Med 2009 (PMID: 19414839)

**Stades KDIGO** : G1 (≥ 90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (< 15).`,
  clinicalCommentary: `La CKD-EPI 2021 (sans coefficient ethnique) est désormais la formule recommandée par les guidelines KDIGO 2024. Elle remplace la version 2009 qui incluait un coefficient race (1.159 pour les Noirs) désormais jugé problématique. Les deux formules sont disponibles pour comparaison. Attention : les formules ne sont pas validées en IRA, chez les patients dénutris ou amputés, ni en cas de variations brutales de la créatinine.`,
  references: [
    {
      type: 'pubmed',
      title: 'Levey AS et al. A new equation to estimate glomerular filtration rate. Ann Intern Med 2009',
      pmid: '19414839',
    },
    {
      type: 'pubmed',
      title: 'Inker LA et al. New creatinine- and cystatin C-based equations to estimate GFR without race. NEJM 2021',
      pmid: '34554658',
    },
    {
      type: 'guideline',
      title: 'KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
      url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/',
    },
  ],
}

export default ckdepi2009
