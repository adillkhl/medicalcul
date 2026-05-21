import type { FormulaDefinition } from '../types'

const fractexcret_uree: FormulaDefinition = {
  id: 'fractexcret-uree', slug: 'fractexcret-uree',
  name: 'FEUrée — Fraction d\'Excrétion Urinaire de l\'Urée',
  specialty: 'nephrologie', category: 'Tubulopathie',
  description: 'Fraction d\'excrétion urinaire de l\'urée (FEUrea). Utile dans le diagnostic différentiel de l\'insuffisance rénale aiguë (distinction IRA fonctionnelle vs organique).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'uree_u', type: 'number', label: 'Urée urinaire', unit: 'mmol/24h', min: 0, max: 1000, step: 1, placeholder: 'Ex: 300' },
    { id: 'uree_s', type: 'number', label: 'Urée sanguine', unit: 'mmol/L', min: 0, max: 80, step: 0.1, placeholder: 'Ex: 15' },
    { id: 'creat_u', type: 'number', label: 'Créatinine urinaire', unit: 'mmol/24h', min: 0, max: 50, step: 0.1, placeholder: 'Ex: 10' },
    { id: 'creat_s', type: 'number', label: 'Créatinine sérique', unit: 'µmol/L', min: 0, max: 1500, step: 1, placeholder: 'Ex: 150' },
  ],
  calculate: (values) => {
    const ureeU = Number(values.uree_u) || 0
    const ureeS = Number(values.uree_s) || 1
    const creatU = Number(values.creat_u) || 1
    const creatS = Number(values.creat_s) || 1

    if (ureeU <= 0 || ureeS <= 0 || creatU <= 0 || creatS <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'FEUrée non calculable', severity: 'low' }] }
    }

    // FEUrea = (Uurea / Surea) / (Ucreat / Sreat) * 100
    // creat_s in µmol/L -> convert to mmol/L: /1000
    const feUrea = (ureeU / ureeS) / (creatU / (creatS / 1000)) * 100
    const feUreaRound = Math.round(feUrea * 100) / 100

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (feUrea < 35) {
      label = `FEUrée = ${feUreaRound}% — IRA fonctionnelle (< 35%)`
      severity = 'moderate'
      recommendation = 'IRA fonctionnelle (prérénale) probable. Réplétion volémique indiquée. Réponse à l\'expansion attendue.'
    } else {
      label = `FEUrée = ${feUreaRound}% — IRA organique (≥ 35%)`
      severity = 'high'
      recommendation = 'IRA organique (parenchymateuse) probable. Bilan étiologique (nécrose tubulaire, glomérulonéphrite, néphrite interstitielle).'
    }

    return { value: feUreaRound, label, severity, recommendation,
      ranges: [
        { min: 0, max: 34.99, label: 'FEUrée < 35% — IRA fonctionnelle', severity: 'moderate', recommendation: 'Réplétion volémique. Surveillance diurèse et créatinine.' },
        { min: 35, max: 100, label: 'FEUrée ≥ 35% — IRA organique', severity: 'high', recommendation: 'Bilan étiologique. Avis néphrologique.' },
      ]}
  },
  interpretation: `**FEUrée = (Urée urinaire / Urée sanguine) / (Créatinine urinaire / Créatinine sérique) × 100**

Interprétation dans l\'IRA :
- **FEUrée < 35 %** : IRA fonctionnelle (prérénale) — le rein réabsorbe l\'urée de façon compensatoire
- **FEUrée ≥ 35 %** : IRA organique (nécrose tubulaire aiguë, autres causes parenchymateuses)

Avantages de la FEUrée vs FENa :
- Moins influencée par les diurétiques
- Pas de valeur seuil modifiée par les diurétiques de l\'anse
- Plus sensible que la FENa pour distinguer IRA fonctionnelle vs organique`,
  clinicalCommentary: 'La FEUrée est un outil diagnostique utile dans l\'IRA, notamment quand la FENa est prise en compte. Elle est moins affectée par les diurétiques que la FENa. Attention : la FEUrée peut être abaissée (< 35%) dans les IRA fonctionnelles mais aussi au début des glomérulonéphrites aiguës. À interpréter avec le contexte clinique et la FENa.',
  references: [
    { type: 'pubmed', title: 'Carvounis CP et al. Fractional excretion of urea in the differential diagnosis of acute renal failure. Am J Nephrol 2002', pmid: '12097741' },
    { type: 'pubmed', title: 'Dewitte A et al. Diagnostic accuracy of fractional excretion of urea in acute kidney injury. Crit Care 2016', pmid: '27079530' },
  ],
}
export default fractexcret_uree
