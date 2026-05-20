import type { FormulaDefinition } from '../types'

const albcrp: FormulaDefinition = {
  id: 'albcrp', slug: 'albcrp',
  name: 'Albuminémie corrigée selon la CRP',
  specialty: 'nutrition', category: 'Biochimie',
  description: "Correction de l\'albuminémie en fonction du taux de CRP pour estimer l\'albuminémie réelle en cas de syndrome inflammatoire",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'alb_mesuree', type: 'number', label: 'Albuminémie mesurée (g/L)', min: 5, max: 60, step: 0.1 },
    { id: 'crp', type: 'number', label: 'CRP (mg/L)', min: 0, max: 500, step: 1 },
  ],
  calculate: (values) => {
    const a = values.alb_mesuree ?? 35
    const c = values.crp ?? 5
    const correction = c < 10 ? 0 : c < 100 ? (c - 10) * 0.02 : (c - 100) * 0.005 + 1.8
    const alb_corrigee = Math.min(50, a + correction)
    return { value: parseFloat(alb_corrigee.toFixed(1)), label: `Albumine corrigée : ${alb_corrigee.toFixed(1)} g/L`, severity: alb_corrigee < 30 ? 'high' : alb_corrigee < 35 ? 'moderate' : 'low'}
  },
  interpretation: "L\'albuminémie corrigée = albuminémie + (CRP-10) × 0,02 si CRP < 100, ou + (CRP-100) × 0,005 + 1,8 si CRP ≥ 100.",
  clinicalCommentary: "La correction est utile en cas de syndrome inflammatoire car la CRP abaisse l\'albuminémie. Albumine < 30 g/L = dénutrition sévère (critères HAS).",
  references: [{ type: 'pubmed', title: "Correction de l\'albuminémie selon la CRP — SFNEP" }],
}
export default albcrp
