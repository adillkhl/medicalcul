import type { FormulaDefinition } from '../types'

const roxindex: FormulaDefinition = {
  id: 'roxindex', slug: 'roxindex',
  name: 'ROX Index (Respiratory rate OXygenation)',
  specialty: 'reanimation', category: 'Oxygénation',
  description: 'Index prédictif d\'échec de l\'oxygénothérapie à haut débit nasal (Optiflow™) dans l\'insuffisance respiratoire aiguë',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'spo2', type: 'number', label: 'SpO₂ (%)', min: 50, max: 100, step: 1 },
    { id: 'fio2', type: 'number', label: 'FiO₂ (fraction, ex: 0.50)', min: 0.21, max: 1.0, step: 0.01 },
    { id: 'fr', type: 'number', label: 'Fréquence respiratoire (/min)', min: 8, max: 70, step: 1 },
  ],
  calculate: (values) => {
    const spo2 = values.spo2 ?? 95
    const fio2 = values.fio2 ?? 0.50
    const fr = values.fr ?? 25
    const rox = (spo2 / fio2) / fr
    return { value: parseFloat(rox.toFixed(2)), label: `ROX Index : ${rox.toFixed(2)}`, severity: rox < 2.85 ? 'high' : rox < 4.88 ? 'moderate' : 'low',
      ranges: [
        { min: -Infinity, max: 2.85, label: 'ROX < 2.85 — Risque élevé d\'échec OHN', severity: 'high' },
        { min: 2.85, max: 4.88, label: 'ROX 2.85-4.88 — Risque intermédiaire', severity: 'moderate' },
        { min: 4.88, max: Infinity, label: 'ROX ≥ 4.88 — Faible risque d\'échec', severity: 'low' },
      ] }
  },
  interpretation: 'ROX > 4.88 mesuré à H2, H6 et H12 après le début de l\'Optiflow™ est associé à un faible risque d\'intubation. ROX < 2.85 à H2 est prédictif d\'échec.',
  clinicalCommentary: 'L\'index ROX est validé pour les pneumonies hypoxémiantes (dont COVID-19). À mesurer après 2h, 6h et 12h d\'OHNC. Un ROX décroissant est un signe d\'alerte pour envisager l\'intubation.',
  references: [{ type: 'pubmed', title: 'Roca O et al. ROX index for HFNC outcome. Crit Care 2016', pmid: '27974039' }],
}
export default roxindex
