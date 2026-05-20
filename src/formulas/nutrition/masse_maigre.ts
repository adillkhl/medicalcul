import type { FormulaDefinition } from '../types'

const masse_maigre: FormulaDefinition = {
  id: 'masse_maigre', slug: 'masse_maigre',
  name: 'Masse Maigre (formule de James)',
  specialty: 'nutrition', category: 'Composition corporelle',
  description: 'Calcul de la masse maigre (muscle) par la formule de James à partir du poids et de la taille',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'taille_cm', type: 'number', label: 'Taille (cm)', min: 100, max: 250, step: 1 },
    { id: 'poids_kg', type: 'number', label: 'Poids (kg)', min: 20, max: 250, step: 0.1 },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Homme' }, { value: 1, label: 'Femme' }] },
  ],
  calculate: (values) => {
    const t = values.taille_cm ?? 170
    const p = values.poids_kg ?? 70
    const s = values.sexe ?? 0
    const mm = s === 0 ? 1.10 * p - 128 * (p / t) ** 2 : 1.07 * p - 148 * (p / t) ** 2
    const mg = p - mm
    const pct_gras = (mg / p) * 100
    return { value: parseFloat(mm.toFixed(1)), label: `Masse maigre : ${mm.toFixed(1)} kg (${pct_gras.toFixed(1)}% gras)`, severity: pct_gras > 30 ? 'moderate' : pct_gras > 25 ? 'low' : 'low' }
  },
  interpretation: "La masse maigre représente les muscles, organes, os et eau extracellulaire. La masse grasse = poids total - masse maigre.",
  clinicalCommentary: 'Formule de James pour l\'estimation de la masse maigre. La bio-impédancemétrie est plus précise en pratique clinique.',
  references: [{ type: 'pubmed', title: 'James WPT. Research on obesity. HMSO 1976' }],
}
export default masse_maigre
