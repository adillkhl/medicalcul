import type { FormulaDefinition } from '../types'

const shockidx: FormulaDefinition = {
  id: 'shockidx', slug: 'shockidx',
  name: 'Shock Index (Index de Choc)',
  specialty: 'cardiologie', category: 'Urgence',
  description: 'Index de choc = Fréquence cardiaque / Pression artérielle systolique. Marqueur simple et précoce d\'instabilité hémodynamique et de choc.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'fc', type: 'number', label: 'Fréquence cardiaque (FC)', unit: '/min', min: 20, max: 250, step: 1, placeholder: 'Ex: 120' },
    { id: 'pas', type: 'number', label: 'Pression artérielle systolique (PAS)', unit: 'mmHg', min: 30, max: 300, step: 1, placeholder: 'Ex: 90' },
  ],
  calculate: (values) => {
    const fc = Number(values.fc) || 80
    const pas = Number(values.pas) || 120

    if (pas <= 0) {
      return { value: 0, label: 'PAS invalide — impossible de calculer l\'index de choc', severity: 'critical' }
    }

    const si = Math.round((fc / pas) * 100) / 100

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let interpretation = ''

    if (si < 0.6) {
      severity = 'low'
      label = `Shock Index = ${si.toFixed(2)} — Normal`
      interpretation = 'Paramètres hémodynamiques normaux'
    } else if (si < 0.9) {
      severity = 'low'
      label = `Shock Index = ${si.toFixed(2)} — Limite normale haute`
      interpretation = 'Surveillance. Valeur normale haute.'
    } else if (si < 1.0) {
      severity = 'moderate'
      label = `Shock Index = ${si.toFixed(2)} — État pré-choc`
      interpretation = 'Tachycardie compensatoire. Rechercher une hypovolémie, hémorragie, sepsis débutant.'
    } else if (si < 1.5) {
      severity = 'high'
      label = `Shock Index = ${si.toFixed(2)} — Choc avéré`
      interpretation = 'Index de choc ≥ 1. Instabilité hémodynamique. Action thérapeutique urgente.'
    } else {
      severity = 'critical'
      label = `Shock Index = ${si.toFixed(2)} — Choc sévère`
      interpretation = 'Index de choc ≥ 1.5. Détresse hémodynamique sévère. Réanimation immédiate.'
    }

    return {
      value: si,
      label,
      severity,
      details: {
        'FC': `${fc} /min`,
        'PAS': `${pas} mmHg`,
        'Shock Index (FC/PAS)': si.toFixed(2),
        'Interprétation': interpretation,
      },
      ranges: [
        { min: 0, max: 0.59, label: 'SI < 0.6 : Normal', severity: 'low' },
        { min: 0.6, max: 0.89, label: 'SI 0.6-0.89 : Limite haute', severity: 'low' },
        { min: 0.9, max: 0.99, label: 'SI 0.9-1.0 : Pré-choc', severity: 'moderate' },
        { min: 1.0, max: 1.49, label: 'SI 1.0-1.49 : Choc', severity: 'high' },
        { min: 1.5, max: 10, label: 'SI ≥ 1.5 : Choc sévère', severity: 'critical' },
      ],
    }
  },
  interpretation: 'Le **Shock Index (SI)** est le rapport FC/PAS. Normalement < 0.6-0.8. Il s\'élève précocement en cas d\'hypovolémie, d\'hémorragie ou de choc, avant même l\'apparition d\'une hypotension artérielle.\n\n• **SI < 0.6** : Normal\n• **SI 0.6-0.8** : Normal haut (surveillance)\n• **SI 0.9-1.0** : État pré-choc (tachycardie compensatoire)\n• **SI ≥ 1.0** : Choc avéré (instabilité hémodynamique)\n• **SI ≥ 1.5** : Choc sévère (détresse immédiate)',
  clinicalCommentary: 'L\'index de choc est un marqueur simple mais puissant d\'instabilité hémodynamique. Il est particulièrement utile aux urgences et en traumatologie pour détecter précocement un choc hémorragique occulte (le SI peut être élevé alors que la PA est encore normale du fait de la tachycardie compensatoire). Un SI ≥ 1.0 est associé à une augmentation significative de la mortalité. Chez la personne âgée, un SI > 0.8 peut déjà être alarmant.',
  references: [
    { type: 'pubmed', title: 'Rady MY et al. A comparison of the Shock Index and conventional vital signs to identify acute, critical illness. Crit Care Med 1994', pmid: '8125005' },
    { type: 'pubmed', title: 'Zarzaur BL et al. The utility of the Shock Index in identifying major trauma. J Trauma 2011', pmid: '21045740' },
  ],
}
export default shockidx
