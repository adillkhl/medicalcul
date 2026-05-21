import type { FormulaDefinition } from '../types'

const uvsurp: FormulaDefinition = {
  id: 'uvsurp', slug: 'uvsurp',
  name: 'Volume Urinaire / Surpoids — Ratio Diurèse/Poids',
  specialty: 'nephrologie', category: 'Diurèse',
  description: 'Évaluation du volume urinaire rapporté au poids corporel. Utile pour interpréter la diurèse des 24h en fonction du poids du patient (notamment en cas d\'obésité ou de dénutrition).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'diurese', type: 'number', label: 'Diurèse des 24h', unit: 'L/24h', min: 0.1, max: 10, step: 0.1, placeholder: 'Ex: 2.0' },
    { id: 'poids', type: 'number', label: 'Poids', unit: 'kg', min: 10, max: 300, step: 1, placeholder: 'Ex: 70' },
    { id: 'taille', type: 'number', label: 'Taille (optionnel)', unit: 'cm', min: 50, max: 250, step: 1, placeholder: 'Ex: 170' },
  ],
  calculate: (values) => {
    const diurese = Number(values.diurese) || 2.0
    const poids = Number(values.poids) || 70
    const taille = values.taille ? Number(values.taille) : undefined

    if (diurese <= 0 || poids <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Ratio non calculable', severity: 'low' }] }
    }

    // Ratio volume/poids en mL/kg/24h
    const ratio = (diurese * 1000) / poids
    const ratioRound = Math.round(ratio * 10) / 10

    // Diurèse horaire en mL/kg/h
    const ratioHoraire = ratio / 24
    const ratioHoraireRound = Math.round(ratioHoraire * 10) / 10

    // IMC si taille disponible
    let imc: number | undefined
    if (taille && taille > 0) {
      imc = poids / Math.pow(taille / 100, 2)
    }

    // Masse maigre estimée (formule de Boer si taille disponible)
    let diuresePerKgMM: number | undefined
    if (taille && taille > 0) {
      // Boer formula for lean body mass
      const masseMaigre = (0.407 * poids + 0.267 * taille - 19.2)
      if (masseMaigre > 0) {
        diuresePerKgMM = (diurese * 1000) / masseMaigre
      }
    }

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (ratio < 10) {
      label = `Volume urinaire : ${ratioRound} mL/kg/24h — Oligurie (< 10 mL/kg/24h)`
      severity = 'high'
      recommendation = 'Oligurie significative. Bilan rénal urgent (créatinine, ionogramme, échographie rénale). Cause fonctionnelle ou organique à rechercher.'
    } else if (ratio < 20) {
      label = `Volume urinaire : ${ratioRound} mL/kg/24h — Diminué`
      severity = 'moderate'
      recommendation = 'Diurèse basse. Surveillance rapprochée. Vérifier bilan hydrique et fonction rénale.'
    } else if (ratio < 30) {
      label = `Volume urinaire : ${ratioRound} mL/kg/24h — Normal bas`
      severity = 'low'
      recommendation = 'Diurèse normale. Hydratation standard.'
    } else if (ratio < 40) {
      label = `Volume urinaire : ${ratioRound} mL/kg/24h — Normal`
      severity = 'low'
      recommendation = 'Diurèse normale. Bonne hydratation.'
    } else if (ratio < 50) {
      label = `Volume urinaire : ${ratioRound} mL/kg/24h — Normal haut`
      severity = 'low'
      recommendation = 'Diurèse élevée mais dans les limites physiologiques. Vérifier apports hydriques.'
    } else {
      label = `Volume urinaire : ${ratioRound} mL/kg/24h — Polyurie (> 50 mL/kg/24h)`
      severity = 'moderate'
      recommendation = 'Polyurie. Rechercher causes : diurétiques, diabète sucré (glycosurie), diabète insipide, hypercalcémie, insuffisance rénale chronique.'
    }

    const details: Record<string, string | number | undefined> = {
      'Diurèse totale': `${diurese} L/24h`,
      'Ratio mL/kg/24h': `${ratioRound} mL/kg/24h`,
      'Ratio mL/kg/h': `${ratioHoraireRound} mL/kg/h`,
    }
    if (imc) { details['IMC'] = `${Math.round(imc * 10) / 10} kg/m²` }
    if (diuresePerKgMM) { details['Diurèse/kg masse maigre'] = `${Math.round(diuresePerKgMM * 10) / 10} mL/kgMM/24h` }

    return { value: ratioRound, label, severity, recommendation, details,
      ranges: [
        { min: 0, max: 9.9, label: '< 10 mL/kg/24h — Oligurie', severity: 'high', recommendation: 'Bilan rénal urgent.' },
        { min: 10, max: 19.9, label: '10-20 mL/kg/24h — Diminué', severity: 'moderate', recommendation: 'Surveillance.' },
        { min: 20, max: 39.9, label: '20-40 mL/kg/24h — Normal', severity: 'low', recommendation: 'Diurèse normale.' },
        { min: 40, max: 49.9, label: '40-50 mL/kg/24h — Normal haut', severity: 'low' },
        { min: 50, max: 300, label: '> 50 mL/kg/24h — Polyurie', severity: 'moderate', recommendation: 'Rechercher étiologie.' },
      ]}
  },
  interpretation: `**Volume urinaire rapporté au poids**

Ratio = Diurèse (mL/24h) / Poids (kg)

**Interprétation :**
- **< 10 mL/kg/24h** : oligurie (insuffisance rénale aiguë, déshydratation sévère)
- **10-20 mL/kg/24h** : diurèse basse, risque d\'IRA
- **20-40 mL/kg/24h** : diurèse normale (adulte : 0.5-1 mL/kg/h)
- **> 50 mL/kg/24h** : polyurie (> 3 L/24h ou > 40 mL/kg/24h)

**Utilité :** Ajuster la diurèse au poids est fondamental chez les patients obèses (la diurèse absolue surestime l\'excrétion) et les patients dénutris (la diurèse absolue sous-estime l\'excrétion).`,
  clinicalCommentary: 'Le ratio diurèse/poids est utile pour apprécier la diurèse relative. Chez l\'obèse, la diurèse rapportée au poids total peut sous-estimer la fonction rénale — utiliser le poids idéal ou la masse maigre si possible. La polyurie est définie comme > 3 L/24h ou > 40-50 mL/kg/24h. L\'oligurie est < 400-500 mL/24h ou < 10 mL/kg/24h.',
  references: [
    { type: 'pubmed', title: 'Thomas ME et al. The definition of acute kidney injury and its use in practice. Kidney Int 2015', pmid: '25651366' },
    { type: 'guideline', title: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury 2012', url: 'https://kdigo.org/guidelines/acute-kidney-injury/' },
  ],
}
export default uvsurp
