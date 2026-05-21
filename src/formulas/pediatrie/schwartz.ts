import type { FormulaDefinition } from '../types'

const schwartz: FormulaDefinition = {
  id: 'schwartz', slug: 'schwartz',
  name: 'Formule de Schwartz — DFG estimé chez l\'enfant',
  specialty: 'pediatrie', category: 'Fonction rénale',
  description: 'Estimation du débit de filtration glomérulaire (DFG) chez l\'enfant par la formule de Schwartz (révisée, équation "bedside"). Basée sur la taille et la créatininémie.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'taille', type: 'number', label: 'Taille', unit: 'cm', min: 20, max: 200, step: 0.5, placeholder: 'Ex: 110' },
    { id: 'creatinine', type: 'number', label: 'Créatininémie', unit: 'µmol/L', min: 0, max: 1000, step: 1, placeholder: 'Ex: 45' },
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 0, max: 18, step: 0.5, placeholder: 'Ex: 6' },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 1, label: 'Fille' }, { value: 2, label: 'Garçon' }] },
  ],
  calculate: (values) => {
    const taille = Number(values.taille)
    const creat = Number(values.creatinine)
    const age = Number(values.age)
    const sexe = Number(values.sexe)

    if (!taille || !creat || !age || !sexe || taille <= 0 || creat <= 0 || age < 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'DFG non calculable', severity: 'low', recommendation: 'Renseigner taille, créatinine, âge et sexe.' }] }
    }

    // Schwartz bedside formula: GFR = k × height(cm) / creatinine(mg/dL)
    // Creatinine in µmol/L -> mg/dL: divide by 88.4
    const creatMgDl = creat / 88.4

    // k factor varies by age and sex (Schwartz 2009 update)
    let k: number
    if (age < 1) {
      // < 1 year (term infant)
      k = 0.33 // infants < 1 year
    } else if (age < 2) {
      // 1-2 years
      k = 0.45
    } else if (sexe === 1) {
      // Female 2-16 years
      k = 0.55
    } else if (age < 13) {
      // Male 2-12 years
      k = 0.55
    } else {
      // Male 13-18 years
      k = 0.70
    }

    const dfg = k * taille / creatMgDl
    const dfgArrondi = Math.round(dfg)

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (dfgArrondi >= 90) {
      severity = 'low'
      label = `DFG estimé ${dfgArrondi} mL/min/1.73m² — Normal`
      recommendation = 'Fonction rénale normale pour l\'âge. Pas de suivi spécifique si absence de protéinurie ou autre anomalie.'
    } else if (dfgArrondi >= 60) {
      severity = 'low'
      label = `DFG estimé ${dfgArrondi} mL/min/1.73m² — Légèrement diminué`
      recommendation = 'Surveillance annuelle. Dépistage des facteurs de risque (HTA, protéinurie).'
    } else if (dfgArrondi >= 45) {
      severity = 'moderate'
      label = `DFG estimé ${dfgArrondi} mL/min/1.73m² — Modéré`
      recommendation = 'Insuffisance rénale modérée. Avis néphrologique pédiatrique. Surveillance semestrielle.'
    } else if (dfgArrondi >= 30) {
      severity = 'high'
      label = `DFG estimé ${dfgArrondi} mL/min/1.73m² — Modéré à sévère`
      recommendation = 'Insuffisance rénale modérée à sévère. Suivi néphrologique spécialisé.'
    } else if (dfgArrondi >= 15) {
      severity = 'high'
      label = `DFG estimé ${dfgArrondi} mL/min/1.73m² — Sévère`
      recommendation = 'Insuffisance rénale sévère. Suivi néphrologique rapproché. Préparation à la suppléance.'
    } else {
      severity = 'critical'
      label = `DFG estimé ${dfgArrondi} mL/min/1.73m² — Terminal`
      recommendation = 'Insuffisance rénale terminale. Dialyse ou transplantation. Avis néphrologique urgent.'
    }

    return { value: dfgArrondi, label, severity, recommendation,
      details: {
        'Constante k': `${k}`,
        'Créatinine': `${creat} µmol/L (${creatMgDl.toFixed(2)} mg/dL)`,
        'Taille': `${taille} cm`,
        'Âge': `${age} ans`,
      },
      ranges: [
        { min: 90, max: 500, label: '≥ 90 — Normal', severity: 'low' },
        { min: 60, max: 89, label: '60-89 — Légèrement diminué', severity: 'low', recommendation: 'Surveillance annuelle.' },
        { min: 45, max: 59, label: '45-59 — Modéré', severity: 'moderate', recommendation: 'Avis néphrologique.' },
        { min: 30, max: 44, label: '30-44 — Modéré à sévère', severity: 'high', recommendation: 'Suivi spécialisé.' },
        { min: 15, max: 29, label: '15-29 — Sévère', severity: 'high', recommendation: 'Préparation suppléance.' },
        { min: 0, max: 14, label: '< 15 — Terminal', severity: 'critical', recommendation: 'Dialyse/transplantation.' },
      ]}
  },
  interpretation: `**Formule de Schwartz (bedside, révisée 2009) :**
DFG (mL/min/1.73m²) = k × Taille (cm) / Créatinine (mg/dL)

**Constante k selon l\'âge (Schwartz 2009) :**
- Nourrisson < 1 an : k = 0.33
- 1-2 ans : k = 0.45
- Fille 2-16 ans / Garçon 2-12 ans : k = 0.55
- Garçon 13-18 ans : k = 0.70

**Stades KDIGO adaptés à l\'enfant :**
- G1 : ≥ 90 mL/min/1.73m²
- G2 : 60-89
- G3a : 45-59
- G3b : 30-44
- G4 : 15-29
- G5 : < 15`,
  clinicalCommentary: 'La formule de Schwartz révisée (2009) remplace l\'ancienne constante k = 0.55 pour tous les enfants. Ne pas utiliser chez les prématurés de moins de 1 an. La cystatine C peut être plus fiable chez l\'enfant. Attention : la créatinine doit être dosée par méthode enzymatique (IDMS traçable).',
  references: [
    { type: 'pubmed', title: 'Schwartz GJ et al. New equations to estimate GFR in children with CKD. J Am Soc Nephrol 2009', pmid: '19158356' },
    { type: 'pubmed', title: 'Schwartz GJ et al. A simple estimate of glomerular filtration rate in children derived from body length and plasma creatinine. Pediatrics 1976', pmid: '1246520' },
  ],
}
export default schwartz
