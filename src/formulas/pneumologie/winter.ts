import type { FormulaDefinition } from '../types'

const winter: FormulaDefinition = {
  id: 'winter', slug: 'winter',
  name: 'Formule de Winter (Gaz du sang)',
  specialty: 'pneumologie', category: 'Gazométrie',
  description: 'Formule de Winter pour l\'interprétation des gaz du sang — compensation respiratoire attendue d\'une acidose métabolique',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'ph', type: 'number', label: 'pH', min: 6.5, max: 7.8, step: 0.01 },
    { id: 'bicarbonates_mmol', type: 'number', label: 'HCO₃⁻ (mmol/L)', min: 0, max: 60, step: 0.5 },
    { id: 'paco2_mmhg', type: 'number', label: 'PaCO₂ (mmHg)', min: 5, max: 150, step: 1 },
  ],
  calculate: (values) => {
    const ph = values.ph ?? 7.40
    const hco3 = values.bicarbonates_mmol ?? 24
    const paco2 = values.paco2_mmhg ?? 40
    const winter_paco2 = 1.5 * hco3 + 8
    const diff = paco2 - winter_paco2
    const reponse = diff > 2 ? 'sur-compensation' : diff < -2 ? 'sous-compensation' : 'compensation adéquate'
    return { value: parseFloat(winter_paco2.toFixed(1)), label: `Winter PaCO₂ attendue : ${winter_paco2.toFixed(1)} mmHg → ${reponse}`,
      severity: Math.abs(diff) > 5 ? 'high' : Math.abs(diff) > 2 ? 'moderate' : 'low',
      details: { pH: `${ph}`, 'HCO₃⁻': `${hco3} mmol/L`, 'PaCO₂ mesurée': `${paco2} mmHg`, 'PaCO₂ attendue': `${winter_paco2.toFixed(1)} mmHg`, 'Interprétation': reponse } }
  },
  interpretation: 'Formule de Winter : PaCO₂ attendue = 1,5 × HCO₃⁻ + 8 ± 2. Si PaCO₂ mesurée est plus basse = alcalose respiratoire associée. Si plus haute = acidose respiratoire associée.',
  clinicalCommentary: 'Règle fondamentale en gazométrie. En acidose métabolique (HCO₃⁻ bas), la PaCO₂ doit baisser proportionnellement. Si PaCO₂ normale = acidose respiratoire associée = détresse respiratoire imminente.',
  references: [{ type: 'pubmed', title: 'Winter RW et al. Acid-base interpretation. Pediatrics 1967' }],
}
export default winter
