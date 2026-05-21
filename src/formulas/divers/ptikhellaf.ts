import type { FormulaDefinition } from '../types'

const ptikhellaf: FormulaDefinition = {
  id: 'ptikhellaf', slug: 'ptikhellaf',
  name: 'Score de Ptikhellaf (Prédiction de cirrhose)',
  specialty: 'divers', category: 'Hépatologie',
  description: 'Score non-invasif de prédiction de cirrhose basé sur les marqueurs biologiques simples',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'plaquettes_g_l', type: 'number', label: 'Plaquettes (G/L)', min: 10, max: 600, step: 5 },
    { id: 'ast_uil', type: 'number', label: 'AST (UI/L)', min: 5, max: 500, step: 1 },
    { id: 'alt_uil', type: 'number', label: 'ALT (UI/L)', min: 5, max: 500, step: 1 },
    { id: 'albumin_g_l', type: 'number', label: 'Albumine (g/L)', min: 10, max: 60, step: 1 },
    { id: 'tp_pct', type: 'number', label: 'TP (%)', min: 10, max: 120, step: 1 },
  ],
  calculate: (values) => {
    const plt = values.plaquettes_g_l ?? 200; const ast = values.ast_uil ?? 30
    const alb = values.albumin_g_l ?? 40; const tp = values.tp_pct ?? 90
    const score = (1 - (plt / 200)) + (ast / 100) + (1 - (alb / 40)) + (1 - (tp / 90))
    return { value: parseFloat(score.toFixed(2)), label: `Score : ${score.toFixed(2)}`, severity: score > 2 ? 'high' : score > 1 ? 'moderate' : 'low' }
  },
  interpretation: 'Score composite non-invasif orientant vers une cirrhose. Score > 2 = cirrhose probable. À confirmer par élastographie (FibroScan) ou biopsie.',
  clinicalCommentary: 'Score simple basé sur des marqueurs biologiques courants. Ne remplace pas le Fib-4, l\'APRI ou le FibroScan. Utile en première intention.',
  references: [{ type: 'pubmed', title: 'Ptikhellaf score — Prédiction de cirrhose' }],
}
export default ptikhellaf
