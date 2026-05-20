import type { FormulaDefinition } from '../types'

const nicerenut: FormulaDefinition = {
  id: 'nicerenut', slug: 'nicerenut',
  name: "Critères de NICE (Renutrition inappropriée)",
  specialty: 'nutrition', category: 'Dénutrition',
  description: "Critères du NICE pour le syndrome de renutrition inappropriée (Refeeding Syndrome) — évaluation du risque",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'imc', type: 'number', label: 'IMC (kg/m²)', min: 10, max: 40, step: 0.1 },
    { id: 'perte_poids', type: 'radio', label: 'Perte de poids récente', options: [{ value: 0, label: '< 5% en 3-6 mois' }, { value: 1, label: '5-10% en 3-6 mois' }, { value: 2, label: '> 10% en 3-6 mois' }] },
    { id: 'alimentation', type: 'radio', label: "Apports alimentaires", options: [{ value: 0, label: 'Normaux' }, { value: 1, label: 'Réduits > 5 jours' }, { value: 2, label: 'Aucun apport > 5 jours' }] },
    { id: 'facteurs_risque', type: 'radio', label: 'Facteurs de risque', options: [{ value: 0, label: 'Aucun' }, { value: 1, label: 'Un facteur (chimio, alcool, diurétiques)' }, { value: 2, label: 'Plusieurs facteurs' }] },
  ],
  calculate: (values) => {
    const imc = values.imc ?? 25
    const pds = values.perte_poids ?? 0
    const app = values.alimentation ?? 0
    const fr = values.facteurs_risque ?? 0
    const total = (imc < 18.5 ? 2 : imc < 22 ? 1 : 0) + pds + app + fr
    return { value: total, label: `Risque de renutrition inappropriée : ${total}/8`, severity: total >= 4 ? 'high' : total >= 2 ? 'moderate' : 'low' }
  },
  interpretation: "Risque élevé si score ≥ 4 : surveillance électrolytique (K, P, Mg) et renutrition progressive (20-25 kcal/kg/j initial).",
  clinicalCommentary: "Le syndrome de renutrition survient dans les 72h suivant le début de la renutrition. Dosage du phosphore préalable indispensable.",
  references: [{ type: 'pubmed', title: 'NICE guidelines — Refeeding syndrome. CG32, 2006' }],
}
export default nicerenut
