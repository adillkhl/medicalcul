import type { FormulaDefinition } from '../types'

const wood: FormulaDefinition = {
  id: 'wood', slug: 'wood',
  name: 'Score de Wood (Bronchiolite)',
  specialty: 'pediatrie', category: 'Pneumologie',
  description: 'Évaluation de la sévérité de la bronchiolite aiguë du nourrisson',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sifflements', type: 'radio', label: 'Sifflements', options: [
      { value: 0, label: 'Absents' },
      { value: 1, label: 'Expiratoires (fin expiration)' },
      { value: 2, label: 'Inspiratoires et expiratoires' },
      { value: 3, label: 'Audibles sans stéthoscope / thorax silencieux' },
    ]},
    { id: 'tirage', type: 'radio', label: 'Tirage intercostal', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Léger' },
      { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' },
    ]},
    { id: 'fr_respiratoire', type: 'radio', label: 'Fréquence respiratoire', options: [
      { value: 0, label: '< 40/min' }, { value: 1, label: '40-50/min' },
      { value: 2, label: '50-60/min' }, { value: 3, label: '> 60/min' },
    ]},
    { id: 'cyanose', type: 'radio', label: 'Cyanose / SpO₂', options: [
      { value: 0, label: 'SpO₂ ≥ 95%' },
      { value: 1, label: 'SpO₂ 90-94%' },
      { value: 2, label: 'SpO₂ < 90% ou cyanose' },
    ]},
  ],
  calculate: (values) => {
    const total = (values.sifflements ?? 0) + (values.tirage ?? 0) + (values.fr_respiratoire ?? 0) + (values.cyanose ?? 0)
    return { value: total, label: `Wood : ${total}/11`, severity: total >= 7 ? 'high' : total >= 4 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 3, label: 'Bronchiolite légère', severity: 'low' },
        { min: 4, max: 6, label: 'Bronchiolite modérée', severity: 'moderate' },
        { min: 7, max: 11, label: 'Bronchiolite sévère', severity: 'high' },
      ] }
  },
  interpretation: 'Thorax silencieux = stade le plus sévère (score 3 aux sifflements).',
  clinicalCommentary: 'Réévaluer après aérosols. Le "thorax silencieux" est un signe d\'épuisement respiratoire.',
  references: [{ type: 'pubmed', title: 'Wood DW et al. Pediatrics 1970' }],
}
export default wood
