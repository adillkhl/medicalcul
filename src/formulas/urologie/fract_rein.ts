import type { FormulaDefinition } from '../types'

const fract_rein: FormulaDefinition = {
  id: 'fract_rein', slug: 'fract_rein',
  name: 'Classification des Fractures du Rein (AAST)',
  specialty: 'urologie', category: 'Traumatologie',
  description: 'Classification des traumatismes rénaux selon l\'AAST (American Association for the Surgery of Trauma)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'contusion', type: 'boolean', label: 'Contusion rénale / hématome sous-capsulaire' },
    { id: 'laceration_cortex', type: 'boolean', label: 'Lacération corticale < 1 cm (sans extension au calice)' },
    { id: 'laceration_profonde', type: 'boolean', label: 'Lacération > 1 cm avec extension au calice' },
    { id: 'atteinte_vasc', type: 'boolean', label: 'Atteinte vasculaire (segmentaire ou pédicule)' },
    { id: 'eclatement', type: 'boolean', label: 'Rein détruit / fragmentation' },
    { id: 'avulsion_pedicule', type: 'boolean', label: 'Avulsion du pédicule rénal' },
  ],
  calculate: (values) => {
    let grade = 1
    if (values.laceration_profonde) grade = 3
    else if (values.laceration_cortex) grade = 2
    if (values.contusion) grade = Math.max(grade, 1)
    if (values.atteinte_vasc) grade = 4
    if (values.eclatement || values.avulsion_pedicule) grade = 5
    return { value: grade, label: `Grade AAST : ${grade}`, severity: grade >= 4 ? 'high' : grade >= 3 ? 'moderate' : 'low' }
  },
  interpretation: 'Grades I-II : traitement conservateur. Grade III : surveillance. Grade IV-V : discuter embolisation ou chirurgie.',
  clinicalCommentary: 'La TDM avec injection est l\'examen de référence. Grade V = néphrectomie souvent nécessaire. L\'hémodynamique guide la décision.',
  references: [{ type: 'pubmed', title: 'AAST — Kidney Injury Scale' }],
}
export default fract_rein
