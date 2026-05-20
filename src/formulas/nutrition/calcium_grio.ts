import type { FormulaDefinition } from '../types'

const calcium_grio: FormulaDefinition = {
  id: 'calcium_grio', slug: 'calcium_grio',
  name: 'Calcium — Apports et Besoins (Questionnaire GRIO)',
  specialty: 'nutrition', category: 'Minéraux',
  description: "Évaluation des apports calciques quotidiens par questionnaire court (GRIO)",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'lait_verres', type: 'number', label: 'Verres de lait/jour (150 mL)', min: 0, max: 10, step: 1 },
    { id: 'yaourts', type: 'number', label: 'Yaourts/jour (125 g)', min: 0, max: 6, step: 1 },
    { id: 'fromage_portions', type: 'number', label: 'Portions de fromage/jour (30 g)', min: 0, max: 6, step: 1 },
    { id: 'eau_calcique', type: 'boolean', label: 'Eau riche en calcium (Hépar, Contrex, etc.)' },
  ],
  calculate: (values) => {
    const lait = (values.lait_verres ?? 0) * 150
    const yaourt = (values.yaourts ?? 0) * 150
    const fromage = (values.fromage_portions ?? 0) * 200
    const eau = values.eau_calcique ? 200 : 0
    const total = lait + yaourt + fromage + eau
    return { value: total, label: `Apport calcique estimé : ${total} mg/j`, severity: total < 500 ? 'high' : total < 800 ? 'moderate' : 'low',
      details: { Lait: `${lait} mg`, Yaourts: `${yaourt} mg`, Fromage: `${fromage} mg`, Eau: `${eau} mg`, 'Total': `${total} mg` } }
  },
  interpretation: "Besoins : 1000-1200 mg/j (adulte), 1200-1500 mg/j (ado, senior, grossesse, allaitement).",
  clinicalCommentary: "Le questionnaire GRIO estime les apports calciques. En cas d\'apports < 800 mg/j, discuter une supplémentation. Associé au risque d\'ostéoporose.",
  references: [{ type: 'pubmed', title: 'GRIO — Évaluation des apports calciques', url: 'https://www.grio.org/' }],
}
export default calcium_grio
