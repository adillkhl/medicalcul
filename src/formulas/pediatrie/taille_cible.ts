import type { FormulaDefinition } from '../types'

const taille_cible: FormulaDefinition = {
  id: 'taille_cible', slug: 'taille_cible',
  name: 'Taille Cible Parentale',
  specialty: 'pediatrie', category: 'Croissance',
  description: 'Estimation de la taille génétique potentielle à partir des tailles parentales (formule de Tanner)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'taille_pere_cm', type: 'number', label: 'Taille du père (cm)', min: 140, max: 220, step: 0.5 },
    { id: 'taille_mere_cm', type: 'number', label: 'Taille de la mère (cm)', min: 130, max: 210, step: 0.5 },
    { id: 'sexe_enfant', type: 'radio', label: 'Sexe de l\'enfant', options: [{ value: 0, label: 'Garçon' }, { value: 1, label: 'Fille' }] },
  ],
  calculate: (values) => {
    const tp = values.taille_pere_cm ?? 175
    const tm = values.taille_mere_cm ?? 165
    const s = values.sexe_enfant ?? 0
    const tc = s === 0 ? (tp + tm + 13) / 2 : (tp + tm - 13) / 2
    return { value: tc, label: `Taille cible : ${tc.toFixed(1)} cm (IC 95% : ±8,5 cm)`, severity: 'low' }
  },
  interpretation: 'Intervalle de confiance à 95% de ±8,5 cm autour de la taille cible.',
  clinicalCommentary: 'Formule de Tanner : (taille père + taille mère ± 13)/2. Un écart > 2 DS justifie un avis endocrinologique.',
  references: [{ type: 'pubmed', title: 'Tanner JM et al. Arch Dis Child 1970' }],
}
export default taille_cible
