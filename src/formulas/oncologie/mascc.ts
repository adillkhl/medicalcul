import type { FormulaDefinition } from '../types'

const mascc: FormulaDefinition = {
  id: 'mascc', slug: 'mascc',
  name: 'MASCC Score (Mucite orale post-chimiothérapie)',
  specialty: 'oncologie', category: 'Support',
  description: 'Score prédictif de mucite orale sévère après chimiothérapie — Multinational Association of Supportive Care in Cancer',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'boolean', label: 'Âge < 65 ans' },
    { id: 'chimio_type', type: 'radio', label: 'Type de chimiothérapie', options: [{ value: 0, label: 'Standard' }, { value: 2, label: 'Hautes doses (greffe)' }] },
    { id: 'radiation', type: 'boolean', label: 'Radiothérapie ORL associée' },
    { id: 'mucite_antecedents', type: 'boolean', label: 'Antécédent de mucite sévère' },
    { id: 'insuf_renale', type: 'boolean', label: 'Insuffisance rénale (DFG < 30)' },
    { id: 'denutrition', type: 'boolean', label: 'Dénutrition (albumine < 30 g/L)' },
    { id: 'tabac', type: 'boolean', label: 'Tabagisme actif' },
    { id: 'neutropenie', type: 'boolean', label: 'Neutropénie (< 500/mm³)' },
  ],
  calculate: (values) => {
    const total = (values.age ? 1 : 0) + (values.chimio_type ?? 0) + (values.radiation ? 1 : 0) + (values.mucite_antecedents ? 2 : 0) + (values.insuf_renale ? 1 : 0) + (values.denutrition ? 1 : 0) + (values.tabac ? 1 : 0) + (values.neutropenie ? 2 : 0)
    return { value: total, label: `Risque de mucite sévère : ${total}`, severity: total >= 6 ? 'high' : total >= 3 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 6 : risque élevé de mucite de grade ≥ 3. Prévention par cryothérapie orale ou palifermine à discuter.',
  clinicalCommentary: 'La mucite orale est une complication fréquente des chimiothérapies à hautes doses (5-FU, MTX, greffe). L\'évaluation quotidienne de la cavité orale est recommandée.',
  references: [{ type: 'pubmed', title: 'MASCC/ISOO — Clinical practice guidelines for mucositis, 2020' }],
}
export default mascc
