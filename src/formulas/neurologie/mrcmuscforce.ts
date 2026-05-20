import type { FormulaDefinition } from '../types'

const mrcmuscforce: FormulaDefinition = {
  id: 'mrcmuscforce', slug: 'mrcmuscforce',
  name: 'Échelle MRC de Force Musculaire',
  specialty: 'neurologie', category: 'Examen Clinique',
  description: 'Cotation de la force musculaire selon Medical Research Council (0-5) — MRC sum score',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'm_deltoide', type: 'radio', label: 'Deltoïde (abduction bras)', options: [
      { value: 0, label: '0 — Aucune contraction' }, { value: 1, label: '1 — Contraction visible' },
      { value: 2, label: '2 — Mouvement sans pesanteur' }, { value: 3, label: '3 — Contre pesanteur' },
      { value: 4, label: '4 — Contre résistance' }, { value: 5, label: '5 — Force normale' },
    ]},
    { id: 'm_biceps', type: 'radio', label: 'Biceps (flexion coude)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'm_ext_poignet', type: 'radio', label: 'Extension poignet', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'm_psoas', type: 'radio', label: 'Psoas (flexion hanche)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'm_quadriceps', type: 'radio', label: 'Quadriceps (extension genou)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
    { id: 'm_ta', type: 'radio', label: 'Tibial antérieur (flexion dorsale)', options: [
      { value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' },
      { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' },
    ]},
  ],
  calculate: (values) => {
    const ms = [values.m_deltoide ?? 0, values.m_biceps ?? 0, values.m_ext_poignet ?? 0, values.m_psoas ?? 0, values.m_quadriceps ?? 0, values.m_ta ?? 0]
    const total = ms.reduce((a, b) => a + b, 0)
    const avg = total / 6
    return { value: total, label: `MRC sum score : ${total}/30 (moyenne ${avg.toFixed(1)}/5)`,
      severity: avg < 3 ? 'high' : avg < 4 ? 'moderate' : 'low' }
  },
  interpretation: 'MRC sum score (0-30) = somme de 6 muscles côté dominant. Validé pour le suivi des neuromusculaires.',
  clinicalCommentary: 'Référence en neurologie pour la cotation de la force. Utile pour le pronostic des neuropathies de réanimation.',
  references: [{ type: 'pubmed', title: 'Medical Research Council. 1976', pmid: '13372743' }],
}
export default mrcmuscforce
