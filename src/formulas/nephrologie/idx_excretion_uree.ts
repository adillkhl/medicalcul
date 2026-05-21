import type { FormulaDefinition } from '../types'

const idx_excretion_uree: FormulaDefinition = {
  id: 'idx-excretion-uree', slug: 'idx-excretion-uree',
  name: 'Index d\'Excrétion Urinaire de l\'Urée',
  specialty: 'nephrologie', category: 'Évaluation rénale',
  description: 'Index d\'excrétion urinaire de l\'urée (Urée urinaire / Urée sanguine). Permet d\'évaluer la capacité rénale à excréter l\'urée et d\'orienter le diagnostic d\'IRA.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'uree_u', type: 'number', label: 'Urée urinaire', unit: 'mmol/24h', min: 0, max: 1000, step: 1, placeholder: 'Ex: 300' },
    { id: 'uree_s', type: 'number', label: 'Urée sanguine', unit: 'mmol/L', min: 0, max: 80, step: 0.1, placeholder: 'Ex: 15' },
    { id: 'diurese', type: 'number', label: 'Diurèse des 24h', unit: 'L/24h', min: 0.1, max: 10, step: 0.1, placeholder: 'Ex: 1.5' },
  ],
  calculate: (values) => {
    const ureeU = Number(values.uree_u) || 0
    const ureeS = Number(values.uree_s) || 1
    const diurese = Number(values.diurese) || 1.5

    if (ureeU <= 0 || ureeS <= 0 || diurese <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Index non calculable', severity: 'low' }] }
    }

    // Urea excretion index = (Uurea × diurese) / Surea
    // Or simply the ratio Uurea / Surea
    const ratio = ureeU / ureeS
    const ratioRound = Math.round(ratio * 100) / 100

    // Urea excretion rate = Uurea × diurese (mmol/24h)
    const excretionRate = ureeU * diurese
    const excretionRateRound = Math.round(excretionRate * 100) / 100

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'

    if (ratio < 10) {
      label = `Index urée = ${ratioRound} — Excrétion basse`
      severity = 'moderate'
    } else if (ratio < 25) {
      label = `Index urée = ${ratioRound} — Excrétion modérée`
      severity = 'low'
    } else if (ratio < 50) {
      label = `Index urée = ${ratioRound} — Excrétion normale à élevée`
      severity = 'low'
    } else {
      label = `Index urée = ${ratioRound} — Excrétion très élevée`
      severity = 'moderate'
    }

    return {
      value: ratioRound,
      label,
      severity,
      details: {
        'Débit d\'excrétion uréique': `${excretionRateRound} mmol/24h`,
        'Urée urinaire totale': `${ureeU} mmol/24h`,
        'Urée sanguine': `${ureeS} mmol/L`,
        'Diurèse': `${diurese} L/24h`,
      },
      ranges: [
        { min: 0, max: 9.99, label: 'Index < 10 — Bas (IRA fonctionnelle possible)', severity: 'moderate' },
        { min: 10, max: 24.99, label: 'Index 10-25 — Modéré', severity: 'low' },
        { min: 25, max: 49.99, label: 'Index 25-50 — Normal à élevé', severity: 'low' },
        { min: 50, max: 500, label: 'Index ≥ 50 — Très élevé', severity: 'moderate' },
      ],
    }
  },
  interpretation: `**Index d\'excrétion urinaire de l\'urée = Urée urinaire (mmol/24h) / Urée sanguine (mmol/L)**

Cet index reflète la capacité rénale à concentrer et excréter l\'urée.
- **Index bas (< 10)** : diminution de l\'excrétion uréique, peut orienter vers une IRA fonctionnelle
- **Index normal (25-50)** : excrétion rénale conservée
- **Index élevé (> 50)** : augmentation de l\'excrétion d\'urée (régime hyperprotidique, catabolisme)

Utile en complément de la FEUrée et de la FENa pour le diagnostic différentiel de l\'IRA.`,
  clinicalCommentary: 'L\'index d\'excrétion de l\'urée est un paramètre ancien mais utile pour évaluer la fonction rénale. En IRA, un index bas oriente vers une cause fonctionnelle (prérénale). Un index élevé s\'observe en cas de catabolisme ou d\'insuffisance rénale chronique avec adaptation tubulaire.',
  references: [
    { type: 'pubmed', title: 'Bankir L et al. Urea and the kidney. In: The Kidney, Brenner & Rector, 2008' },
    { type: 'url', title: 'SFNDT — Société Francophone de Néphrologie', url: 'https://www.sfndt.org/' },
  ],
}
export default idx_excretion_uree
