import type { FormulaDefinition } from '../types'

const smartcop: FormulaDefinition = {
  id: 'smartcop', slug: 'smartcop',
  name: 'SMART-COP Score (Pneumonie grave)',
  specialty: 'pneumologie', category: 'Pneumonie',
  description: 'Score prédictif de besoin de ventilation mécanique ou vasopresseurs dans la pneumonie communautaire',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'pas_basse', type: 'boolean', label: 'S — PAS < 90 mmHg' },
    { id: 'multilobaire', type: 'boolean', label: 'M — Atteinte multilobaire (radio)' },
    { id: 'albuminemie', type: 'boolean', label: 'A — Albumine < 35 g/L' },
    { id: 'fr_elevee', type: 'radio', label: 'R — FR (adultes)', options: [{ value: 0, label: '< 50 ans : < 25/min ; ≥ 50 ans : < 30/min' }, { value: 1, label: '< 50 ans : ≥ 25/min ; ≥ 50 ans : ≥ 30/min' }] },
    { id: 'tachycardie', type: 'boolean', label: 'T — FC ≥ 125/min' },
    { id: 'confusion', type: 'boolean', label: 'C — Confusion (nouvelle)' },
    { id: 'pao2', type: 'radio', label: 'O — Oxygénation', options: [{ value: 0, label: '< 50 ans : PaO₂ ≥ 70 ; ≥ 50 ans : ≥ 70' }, { value: 1, label: '< 50 ans : PaO₂ < 70 ; ≥ 50 ans : < 70 mmHg' }] },
    { id: 'ph_arteriel', type: 'boolean', label: 'P — pH artériel < 7.35' },
  ],
  calculate: (values) => {
    const total = (values.pas_basse ? 2 : 0) + (values.multilobaire ? 1 : 0) + (values.albuminemie ? 1 : 0) + ((values.fr_elevee ?? 0) >= 1 ? 1 : 0) + (values.tachycardie ? 1 : 0) + (values.confusion ? 1 : 0) + ((values.pao2 ?? 0) >= 1 ? 2 : 0) + (values.ph_arteriel ? 1 : 0)
    return { value: total, label: `SMART-COP : ${total} pts`, severity: total >= 5 ? 'high' : total >= 3 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 2, label: 'Risque faible de ventilation/vasopresseurs', severity: 'low' },
        { min: 3, max: 4, label: 'Risque modéré — Surveillance', severity: 'moderate' },
        { min: 5, max: Infinity, label: 'Risque élevé — Réanimation probable', severity: 'high' },
      ] }
  },
  interpretation: 'Score ≥ 5 : risque élevé de nécessité de ventilation mécanique ou vasopresseurs. La sensibilité est de 92% pour un score ≥ 3.',
  clinicalCommentary: 'Développé en Australie. L\'acronyme SMART-COP correspond aux items (Systolic BP, Multilobar, Albumin, Respiratory rate, Tachycardia, Confusion, Oxygenation, pH).',
  references: [{ type: 'pubmed', title: 'Charles PG et al. SMART-COP score for severe CAP. Clin Infect Dis 2008', pmid: '18680538' }],
}
export default smartcop
