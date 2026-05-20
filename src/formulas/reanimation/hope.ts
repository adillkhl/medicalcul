import type { FormulaDefinition } from '../types'

const hope: FormulaDefinition = {
  id: 'hope', slug: 'hope',
  name: 'HOPE Score (Hypotension artérielle et pronostic)',
  specialty: 'reanimation', category: 'Hémodynamique',
  description: 'Score pronostique d\'hypotension artérielle aux urgences/réanimation — prédiction de complication à 72h',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_ans', type: 'number', label: 'Âge (ans)', min: 0, max: 120, step: 1 },
    { id: 'lactates', type: 'radio', label: 'Lactates artériels', options: [{ value: 0, label: '< 2 mmol/L' }, { value: 2, label: '2-4 mmol/L' }, { value: 4, label: '> 4 mmol/L' }] },
    { id: 'insuf_renale', type: 'boolean', label: 'Insuffisance rénale aiguë (créat > 150 µmol/L ou débit urinaire < 0.5 mL/kg/h)' },
    { id: 'trouble_conscience', type: 'boolean', label: 'Trouble de conscience (Glasgow < 14)' },
    { id: 'pas_basse', type: 'boolean', label: 'PAS < 90 mmHg persistante après 1L de cristalloïdes' },
    { id: 'inotropes', type: 'boolean', label: 'Nécessité d\'inotropes/vasopresseurs' },
    { id: 'ventilation', type: 'boolean', label: 'Nécessité de ventilation mécanique' },
  ],
  calculate: (values) => {
    const age = values.age_ans ?? 60
    const pts = (age > 75 ? 3 : age > 65 ? 2 : age > 50 ? 1 : 0) + (values.lactates ?? 0) + (values.insuf_renale ? 2 : 0) + (values.trouble_conscience ? 2 : 0) + (values.pas_basse ? 2 : 0) + (values.inotropes ? 3 : 0) + (values.ventilation ? 3 : 0)
    return { value: pts, label: `HOPE Score : ${pts}`, severity: pts >= 8 ? 'high' : pts >= 4 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 8 : pronostic défavorable (complications sévères à 72h). Score ≥ 4 : surveillance rapprochée.',
  clinicalCommentary: 'Score simple pour évaluer le pronostic à court terme d\'une hypotension persistante malgré le remplissage.',
  references: [{ type: 'pubmed', title: 'HOPE score — hypotension outcome prediction in ED' }],
}
export default hope
