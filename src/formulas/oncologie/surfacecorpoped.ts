import type { FormulaDefinition } from '../types'

const surfacecorpoped: FormulaDefinition = {
  id: 'surfacecorpoped', slug: 'surfacecorpoped',
  name: 'Surface Corporelle Pédiatrique',
  specialty: 'oncologie', category: 'Pharmacologie',
  description: 'Calcul de la surface corporelle (SC) chez l\'enfant — formules de Mosteller, Haycock et Du Bois',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'poids_kg', type: 'number', label: 'Poids (kg)', min: 0.5, max: 120, step: 0.1 },
    { id: 'taille_cm', type: 'number', label: 'Taille (cm)', min: 20, max: 200, step: 0.5 },
  ],
  calculate: (values) => {
    const p = values.poids_kg ?? 10
    const t = values.taille_cm ?? 80
    const mosteller = Math.sqrt(p * t / 3600)
    const dubois = 0.007184 * Math.pow(p, 0.425) * Math.pow(t, 0.725)
    return { value: parseFloat(mosteller.toFixed(3)), label: `SC (Mosteller) : ${mosteller.toFixed(3)} m²`,
      details: { Mosteller: `${mosteller.toFixed(3)} m²`, 'Du Bois': `${dubois.toFixed(3)} m²` },
      severity: 'low' }
  },
  interpretation: 'La surface corporelle est utilisée pour le calcul des doses de chimiothérapie, de certains médicaments et l\'évaluation des brûlures.',
  clinicalCommentary: 'Mosteller : la plus simple et la plus utilisée en pédiatrie. Du Bois : formule historique. Utiliser la même formule pour un même patient dans le temps.',
  references: [{ type: 'pubmed', title: 'Mosteller RD. Simplified calculation of body surface area. NEJM 1987', pmid: '3574485' }],
}
export default surfacecorpoped
