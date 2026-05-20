import type { FormulaDefinition } from '../types'

const duree: FormulaDefinition = {
  id: 'duree', slug: 'duree',
  name: 'Calcul de Durée (entre deux dates)',
  specialty: 'divers', category: 'Outils',
  description: 'Calcul du nombre de jours, mois et années entre deux dates',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'avis',
  inputs: [
    { id: 'date_debut_j', type: 'number', label: 'Jour début (1-31)', min: 1, max: 31, step: 1 },
    { id: 'date_debut_m', type: 'number', label: 'Mois début (1-12)', min: 1, max: 12, step: 1 },
    { id: 'date_debut_a', type: 'number', label: 'Année début', min: 1900, max: 2100, step: 1 },
    { id: 'date_fin_j', type: 'number', label: 'Jour fin (1-31)', min: 1, max: 31, step: 1 },
    { id: 'date_fin_m', type: 'number', label: 'Mois fin (1-12)', min: 1, max: 12, step: 1 },
    { id: 'date_fin_a', type: 'number', label: 'Année fin', min: 1900, max: 2100, step: 1 },
  ],
  calculate: (values) => {
    const d1 = new Date(values.date_debut_a ?? 2024, (values.date_debut_m ?? 1) - 1, values.date_debut_j ?? 1)
    const d2 = new Date(values.date_fin_a ?? 2024, (values.date_fin_m ?? 1) - 1, values.date_fin_j ?? 1)
    const diff_j = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24))
    const ans = Math.floor(diff_j / 365.25)
    const mois = Math.floor((diff_j % 365.25) / 30.44)
    const jours = Math.round(diff_j - ans * 365.25 - mois * 30.44)
    return { value: diff_j, label: `Durée : ${diff_j} jours (${ans} an(s), ${mois} mois, ${jours} jours)`, severity: 'low' }
  },
  interpretation: 'Calcul de durée entre deux dates. Attention aux années bissextiles et aux mois de 28-31 jours.',
  clinicalCommentary: 'Utile pour le suivi des traitements, la date présumée d\'accouchement, la durée des arrêts de travail.',
  references: [{ type: 'guideline', title: 'Calcul calendaire standard' }],
}
export default duree
