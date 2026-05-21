import type { FormulaDefinition } from '../types'

const ruffierdickson: FormulaDefinition = {
  id: 'ruffierdickson', slug: 'ruffierdickson',
  name: 'Test de Ruffier-Dickson (Indice cardiaque)',
  specialty: 'medecine_sport', category: 'Tests d\'effort',
  description: 'Test d\'évaluation de l\'adaptation cardiaque à l\'effort et de la condition cardiovasculaire (indice de Ruffier-Dickson)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'fc_repos', type: 'number', label: 'FC de repos (bpm)', min: 40, max: 120, step: 1 },
    { id: 'fc_effort', type: 'number', label: 'FC après effort (bpm) — 30 flexions en 45s', min: 60, max: 200, step: 1 },
    { id: 'fc_recup', type: 'number', label: 'FC après 1 min de récupération (bpm)', min: 40, max: 180, step: 1 },
  ],
  calculate: (values) => {
    const p0 = values.fc_repos ?? 70; const p1 = values.fc_effort ?? 120; const p2 = values.fc_recup ?? 80
    const index = ((p1 - 70) + (p2 - p0)) / 10
    return { value: parseFloat(index.toFixed(1)), label: `Indice de Ruffier : ${index.toFixed(1)}`, severity: index > 8 ? 'high' : index > 5 ? 'moderate' : 'low',
      ranges: [
        { min: -Infinity, max: 0, label: 'Excellent', severity: 'low' },
        { min: 0, max: 5, label: 'Bon', severity: 'low' },
        { min: 5, max: 8, label: 'Moyen', severity: 'moderate' },
        { min: 8, max: 12, label: 'Médiocre', severity: 'moderate' },
        { min: 12, max: Infinity, label: 'Mauvais', severity: 'high' },
      ] }
  },
  interpretation: 'L\'indice de Ruffier-Dickson évalue la récupération cardiaque après effort standardisé (30 flexions en 45s). Plus l\'indice est bas, meilleure est la condition cardiovasculaire.',
  clinicalCommentary: 'Test simple de terrain, non invasif. Contre-indiqué en cas de pathologie cardiaque connue. Le test de Ruffier (original) utilise un calcul légèrement différent.',
  references: [{ type: 'pubmed', title: 'Ruffier JE. Considérations sur l\'épreuve fonctionnelle cardiaque. Paris 1951' }],
}
export default ruffierdickson
