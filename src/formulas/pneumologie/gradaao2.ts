import type { FormulaDefinition } from '../types'

const gradaao2: FormulaDefinition = {
  id: 'gradaao2', slug: 'gradaao2',
  name: 'Gradient Alvéolo-artériel en Oxygène (A-a O₂)',
  specialty: 'pneumologie', category: 'Gazométrie',
  description: 'Calcul du gradient alvéolo-artériel en oxygène — évaluation du trouble d\'oxygénation',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'pao2_mmhg', type: 'number', label: 'PaO₂ (mmHg)', min: 20, max: 600, step: 1 },
    { id: 'paco2_mmhg', type: 'number', label: 'PaCO₂ (mmHg)', min: 10, max: 120, step: 1 },
    { id: 'fio2_pct', type: 'number', label: 'FiO₂ (%)', min: 21, max: 100, step: 1 },
    { id: 'age_ans', type: 'number', label: 'Âge (ans)', min: 0, max: 100, step: 1 },
  ],
  calculate: (values) => {
    const pao2 = values.pao2_mmhg ?? 90
    const paco2 = values.paco2_mmhg ?? 40
    const fio2 = values.fio2_pct ?? 21
    const age = values.age_ans ?? 40
    const pio2 = fio2 / 100 * (760 - 47)
    const pao2_alveolaire = pio2 - (paco2 / 0.8)
    const grad_a_a = pao2_alveolaire - pao2
    const grad_normal = age / 4 + 4
    return { value: parseFloat(grad_a_a.toFixed(1)), label: `Gradient A-a : ${grad_a_a.toFixed(1)} mmHg (N < ${(grad_normal).toFixed(0)})`, severity: grad_a_a > grad_normal ? 'high' : 'low' }
  },
  interpretation: 'Gradient A-a augmenté = trouble de l\'oxygénation (shunt, effet shunt, anomalie de diffusion). Gradient normal + PaO₂ basse = hypoventilation.',
  clinicalCommentary: 'Le gradient A-a O₂ est le reflet de l\'efficacité des échanges gazeux alvéolo-capillaires. Un gradient augmenté dans le cadre d\'une hypoxémie oriente vers une pneumopathie, une embolie pulmonaire, un SDRA.',
  references: [{ type: 'pubmed', title: 'Alveolar-arterial oxygen gradient — clinical interpretation' }],
}
export default gradaao2
