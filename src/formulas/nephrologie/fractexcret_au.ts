import type { FormulaDefinition } from '../types'

const fractexcret_au: FormulaDefinition = {
  id: 'fractexcret-au', slug: 'fractexcret-au',
  name: 'FEUA — Fraction d\'Excretion Urinaire de l\'Acide Urique',
  specialty: 'nephrologie', category: 'Tubulopathie',
  description: 'Fraction d\'excrétion urinaire de l\'acide urique (FEUA). Aide au diagnostic des tubulopathies rénales et à la classification des hypo-uricémies/hyperuricémies d\'origine rénale.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'au_u', type: 'number', label: 'Acide urique urinaire', unit: 'mmol/24h', min: 0, max: 20, step: 0.1, placeholder: 'Ex: 3.5' },
    { id: 'au_s', type: 'number', label: 'Acide urique sérique', unit: 'µmol/L', min: 0, max: 1000, step: 1, placeholder: 'Ex: 360' },
    { id: 'creat_u', type: 'number', label: 'Créatinine urinaire', unit: 'mmol/24h', min: 0, max: 50, step: 0.1, placeholder: 'Ex: 12' },
    { id: 'creat_s', type: 'number', label: 'Créatinine sérique', unit: 'µmol/L', min: 0, max: 1500, step: 1, placeholder: 'Ex: 80' },
  ],
  calculate: (values) => {
    const auU = Number(values.au_u) || 0
    const auS = Number(values.au_s) || 1
    const creatU = Number(values.creat_u) || 1
    const creatS = Number(values.creat_s) || 1

    if (auU <= 0 || auS <= 0 || creatU <= 0 || creatS <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'FEUA non calculable', severity: 'low' }] }
    }

    const feua = (auU * creatS) / (auS * creatU) * 100
    const feuaRound = Math.round(feua * 100) / 100

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'

    if (feua < 5) {
      label = `FEUA = ${feuaRound}% — Fraction basse, suggestive d\'origine extra-rénale`
      severity = 'low'
    } else if (feua < 12) {
      label = `FEUA = ${feuaRound}% — Fraction normale (5-12%)`
      severity = 'low'
    } else {
      label = `FEUA = ${feuaRound}% — Fraction élevée, suggestive de cause rénale`
      severity = 'moderate'
    }

    return { value: feuaRound, label, severity,
      ranges: [
        { min: 0, max: 4.99, label: 'FEUA < 5% — Fraction basse', severity: 'low', recommendation: 'Suggère une origine extra-rénale (hyperuricémie par surproduction ou cause médicamenteuse).' },
        { min: 5, max: 11.99, label: 'FEUA 5-12% — Normale', severity: 'low', recommendation: 'Excrétion rénale normale d\'acide urique.' },
        { min: 12, max: 100, label: 'FEUA ≥ 12% — Fraction élevée', severity: 'moderate', recommendation: 'Suggère une hyperuricémie d\'origine rénale (tubulopathie proximale, syndrome de Fanconi, médicaments).' },
      ]}
  },
  interpretation: `**FEUA = (AU urinaire × Cr sérique) / (AU sérique × Cr urinaire) × 100**

Interprétation :
- **FEUA < 5 %** : hyperuricémie par surproduction (alimentation, lyse tumorale) ou médicamenteuse (diurétiques)
- **FEUA 5-12 %** : excrétion rénale normale
- **FEUA > 12 %** : hyperuricémie d\'origine rénale (tubulopathie, Fanconi, IRC, syndrome de Dent)

**FEUA > 12 %** est aussi observée dans les hypo-uricémies rénales (mutations URAT1, GLUT9).`,
  clinicalCommentary: 'La FEUA est utile pour différencier les causes rénales des causes extra-rénales d\'hyperuricémie. À interpréter avec la fonction rénale globale. Une FEUA élevée (> 12 %) oriente vers une anomalie tubulaire proximale (baisse de réabsorption de l\'urate).',
  references: [
    { type: 'pubmed', title: 'Hediger MA et al. Molecular physiology of urate transport. Physiology 2005', pmid: '15888533' },
    { type: 'url', title: 'Orphanet — Tubulopathies rénales héréditaires', url: 'https://www.orpha.net/' },
  ],
}
export default fractexcret_au
