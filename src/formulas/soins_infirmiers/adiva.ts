import type { FormulaDefinition } from '../types'

const adiva: FormulaDefinition = {
  id: 'adiva', slug: 'adiva',
  name: 'A-DIVA Score (Accès veineux difficile — Adulte)',
  specialty: 'soins_infirmiers', category: 'Accès veineux',
  description: "Prédiction de la difficulté d\'accès veineux périphérique chez l\'adulte",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'veine_invisible', type: 'boolean', label: 'Veines non visibles' },
    { id: 'veine_non_palpable', type: 'boolean', label: 'Veines non palpables' },
    { id: 'antecedent_difficulte', type: 'boolean', label: 'Antécédent de difficulté d\'accès veineux' },
    { id: 'catheter_prealable', type: 'boolean', label: '≥ 3 cathéters posés dans les 24h' },
  ],
  calculate: (values) => {
    const total = (values.veine_invisible ? 1 : 0) + (values.veine_non_palpable ? 1 : 0) + (values.antecedent_difficulte ? 1 : 0) + (values.catheter_prealable ? 1 : 0)
    return { value: total, label: `A-DIVA : ${total}/4`, severity: total >= 3 ? 'high' : total >= 2 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 2 : difficulté probable. Score ≥ 3 : forte probabilité d\'échec. Envisager guidage échographique.',
  clinicalCommentary: 'Un score A-DIVA ≥ 2 justifie un temps de pose plus long, un garrot plus large et/ou un guidage échographique.',
  references: [{ type: 'pubmed', title: 'A-DIVA score for difficult IV access in adults' }],
}
export default adiva
