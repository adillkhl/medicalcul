import type { FormulaDefinition } from '../types'

const conversions: FormulaDefinition = {
  id: 'conversions', slug: 'conversions',
  name: 'Conversions d\'Unités Médicales',
  specialty: 'divers', category: 'Outils',
  description: 'Conversions d\'unités médicales courantes : SI ↔ conventionnelles, poids, température, pression',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'avis',
  inputs: [
    { id: 'type_conv', type: 'radio', label: 'Type de conversion', options: [
      { value: 0, label: 'mmol/L ↔ g/L (ex: glucose, urée, créatinine)' },
      { value: 1, label: 'mg/dL ↔ µmol/L (ex: bilirubine)' },
      { value: 2, label: 'kPa ↔ mmHg (pression artérielle, PaO₂, PaCO₂)' },
      { value: 3, label: '°F ↔ °C (température)' },
      { value: 4, label: 'mg/L ↔ µmol/L' },
    ]},
    { id: 'valeur', type: 'number', label: 'Valeur à convertir', min: -1000, max: 10000, step: 0.01 },
  ],
  calculate: (values) => {
    const t = values.type_conv ?? 0
    const v = values.valeur ?? 0
    let resultat = 0, unite_out = ''
    if (t === 0) { resultat = v / 0.0555; unite_out = `${v} mmol/L = ${(v/0.0555).toFixed(2)} g/L (glucose, urea: /0.357)` }
    else if (t === 1) { resultat = v * 17.1; unite_out = `${v} mg/dL = ${(v*17.1).toFixed(1)} µmol/L` }
    else if (t === 2) { resultat = v * 0.133; unite_out = `${v} mmHg = ${(v*0.133).toFixed(2)} kPa` }
    else if (t === 3) { resultat = (v - 32) / 1.8; unite_out = `${v}°F = ${((v-32)/1.8).toFixed(1)}°C` }
    else { resultat = v; unite_out = `Facteurs : Calcium × 0.25, Magnésium × 0.041, Phosphore × 0.323` }
    return { value: parseFloat(resultat.toFixed(2)), label: unite_out, severity: 'low' }
  },
  interpretation: 'Conversions médicales de routine. Les facteurs de conversion varient selon la substance (masse molaire différente).',
  clinicalCommentary: 'Exemples : Glucose 5.5 mmol/L = 1 g/L. Calcium 2.5 mmol/L = 100 mg/L. Bilirubine 10 mg/L = 17 µmol/L.',
  references: [{ type: 'guideline', title: 'Table de conversion SI — Conventionnelles. SFBC' }],
}
export default conversions
