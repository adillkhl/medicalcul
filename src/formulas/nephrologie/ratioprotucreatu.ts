import type { FormulaDefinition } from '../types'

const ratioprotucreatu: FormulaDefinition = {
  id: 'ratioprotucreatu', slug: 'ratioprotucreatu',
  name: 'Ratio Protéine/Créatinine Urinaire (UPCR)',
  specialty: 'nephrologie', category: 'Protéinurie',
  description: 'Ratio protéine/créatinine urinaire sur échantillon (UPCR). Estimation de la protéinurie des 24h à partir d\'un échantillon urinaire. Alternative au recueil des 24h.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'proteines_u', type: 'number', label: 'Protéines urinaires', unit: 'g/L', min: 0, max: 20, step: 0.01, placeholder: 'Ex: 0.5' },
    { id: 'creatinine_u', type: 'number', label: 'Créatinine urinaire', unit: 'mmol/L', min: 0, max: 50, step: 0.1, placeholder: 'Ex: 8' },
    { id: 'sexe', type: 'radio', label: 'Sexe (pour estimation créatinine attendue)', options: [{ value: 1, label: 'Femme' }, { value: 2, label: 'Homme' }] },
  ],
  calculate: (values) => {
    const protU = Number(values.proteines_u) || 0
    const creatU = Number(values.creatinine_u) || 1
    const sexe = Number(values.sexe) || 2

    if (protU <= 0 || creatU <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'UPCR non calculable', severity: 'low' }] }
    }

    // Prot/créat ratio en g/mmol
    const upcr = protU / creatU
    const upcrRound = Math.round(upcr * 1000) / 1000

    // Prot/créat ratio en mg/mmol
    const upcrMgMmol = upcr * 1000 // convert g/mmol to mg/mmol
    const upcrMgMmolRound = Math.round(upcrMgMmol)

    // Prot/créat ratio en mg/g (US units)
    const upcrMgG = upcr * 1000 * 8.84 // convert g/mmol to mg/g using creat conversion
    const upcrMgGRound = Math.round(upcrMgG)

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''
    let proteinurie24hEst: number

    // Estimation protéinurie des 24h (en g/24h) = UPCR (g/mmol) × Créatinine attendue/24h
    const creatAttendue = sexe === 1 ? 10 : 14 // mmol/24h (femme ~10, homme ~14)
    proteinurie24hEst = upcr * creatAttendue
    const proteinurie24hEstRound = Math.round(proteinurie24hEst * 100) / 100

    if (upcrMgMmol < 15) {
      severity = 'low'
      label = `UPCR = ${upcrMgMmolRound} mg/mmol (${upcrMgGRound} mg/g) — Normal`
      recommendation = 'Protéinurie normale ou non significative (< 150 mg/24h). Pas de suivi spécifique.'
    } else if (upcrMgMmol < 50) {
      severity = 'low'
      label = `UPCR = ${upcrMgMmolRound} mg/mmol (${upcrMgGRound} mg/g) — Limite`
      recommendation = 'Protéinurie limite. Contrôle à 1-3 mois. Si persistance, bilan néphrologique.'
    } else if (upcrMgMmol < 100) {
      severity = 'moderate'
      label = `UPCR = ${upcrMgMmolRound} mg/mmol (${upcrMgGRound} mg/g) — Modérée`
      recommendation = 'Protéinurie modérée (≈ 0.5-1 g/24h). Bilan néphrologique. Débuter IEC/ARA2 si MRC.'
    } else if (upcrMgMmol < 300) {
      severity = 'high'
      label = `UPCR = ${upcrMgMmolRound} mg/mmol (${upcrMgGRound} mg/g) — Élevée`
      recommendation = 'Protéinurie élevée (≈ 1-3 g/24h). Avis néphrologique. Traitement néphroprotecteur (IEC/ARA2).'
    } else {
      severity = 'critical'
      label = `UPCR = ${upcrMgMmolRound} mg/mmol (${upcrMgGRound} mg/g) — Très élevée (syndrome néphrotique)`
      recommendation = 'Protéinurie ≥ 3 g/24h. Syndrome néphrotique possible. Avis néphrologique urgent. Bilan étiologique complet.'
    }

    return { value: upcrMgMmolRound, label, severity, recommendation,
      details: {
        'UPCR (g/mmol)': `${upcrRound} g/mmol`,
        'UPCR (mg/mmol)': `${upcrMgMmolRound} mg/mmol`,
        'UPCR (mg/g)': `${upcrMgGRound} mg/g`,
        'Protéinurie 24h estimée': `${proteinurie24hEstRound} g/24h`,
        'Protéines urinaires': `${protU} g/L`,
        'Créatinine urinaire': `${creatU} mmol/L`,
      },
      ranges: [
        { min: 0, max: 14.99, label: '< 15 mg/mmol — Normal', severity: 'low', recommendation: 'Pas de suivi spécifique.' },
        { min: 15, max: 49.99, label: '15-50 mg/mmol — Limite', severity: 'low', recommendation: 'Contrôle.' },
        { min: 50, max: 99.99, label: '50-100 mg/mmol — Modérée', severity: 'moderate', recommendation: 'Bilan néphrologique.' },
        { min: 100, max: 299.99, label: '100-300 mg/mmol — Élevée', severity: 'high', recommendation: 'Avis néphrologique + IEC/ARA2.' },
        { min: 300, max: 5000, label: '≥ 300 mg/mmol — Syndrome néphrotique', severity: 'critical', recommendation: 'Avis néphrologique urgent.' },
      ]}
  },
  interpretation: `**Ratio Protéine/Créatinine Urinaire (UPCR)** sur échantillon

Calcul : UPCR = Protéines urinaires (g/L) / Créatinine urinaire (mmol/L)

**Correspondance :**
- **< 15 mg/mmol (< 130 mg/g)** : normal
- **15-50 mg/mmol (130-440 mg/g)** : protéinurie limite
- **50-100 mg/mmol (440-880 mg/g)** : protéinurie modérée (≈ 0.5-1 g/24h)
- **100-300 mg/mmol (880-2650 mg/g)** : protéinurie élevée (≈ 1-3 g/24h)
- **≥ 300 mg/mmol (≥ 2650 mg/g)** : syndrome néphrotique (≥ 3 g/24h)

Estimation protéinurie 24h = UPCR × Créatinine attendue/24h (femme 10 mmol, homme 14 mmol)`,
  clinicalCommentary: 'L\'UPCR sur échantillon est une alternative fiable au recueil des 24h (recommandé par KDIGO). Un UPCR > 50 mg/mmol définit une protéinurie significative. Attention : l\'UPCR peut être faussement bas en cas de dilution urinaire (polyurie) ou faussement élevé en cas d\'hématurie ou d\'infection urinaire. L\'albumine/créatinine ratio (ACR) est plus sensible pour la protéinurie de faible débit.',
  references: [
    { type: 'pubmed', title: 'KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of CKD', pmid: '23239214' },
    { type: 'url', title: 'HAS — Évaluation de la protéinurie', url: 'https://www.has-sante.fr/' },
  ],
}
export default ratioprotucreatu
