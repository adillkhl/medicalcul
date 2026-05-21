import type { FormulaDefinition } from '../types'

const omssida: FormulaDefinition = {
  id: 'omssida', slug: 'omssida',
  name: 'Classification OMS du VIH (Stades cliniques 1-4)',
  specialty: 'infectiologie', category: 'VIH',
  description: 'Classification OMS de l\'infection à VIH en 4 stades cliniques — évaluation du stade de la maladie',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'stage', type: 'radio', label: 'Stade clinique', options: [
      { value: 1, label: 'Stade 1 — Asymptomatique ou LAP persistante généralisée' },
      { value: 2, label: 'Stade 2 — Zona, candidose orale, chéilite, chute de poids < 10%' },
      { value: 3, label: 'Stade 3 — Diarrhée/fièvre inexpliquée >1 mois, candidose œso, leucoplasie, TB pulmonaire, pneumopathie bactérienne sévère' },
      { value: 4, label: 'Stade 4 (SIDA) — Toxoplasmose cérébrale, PCP, CMV, MAC, TB extra-pulm, cryptococcose, KS, cachexie, encéphalopathie VIH, lymphoma' },
    ]},
    { id: 'cd4', type: 'number', label: 'CD4 (/mm³)', min: 0, max: 1500, step: 10 },
  ],
  calculate: (values) => {
    const st = values.stage ?? 1; const cd4 = values.cd4 ?? 500
    let sida = st === 4
    if (!sida && cd4 < 200) sida = true
    return { value: st, label: `Stade OMS ${st}${sida ? ' — SIDA' : ''} — CD4: ${cd4}/mm³`,
      severity: st >= 4 || cd4 < 200 ? 'high' : st >= 3 ? 'moderate' : 'low',
      details: { 'Stade OMS': `${st}`, 'CD4': `${cd4}/mm³`, 'SIDA': sida ? 'Oui' : 'Non' } }
  },
  interpretation: 'Stade 4 ou CD4 < 200/mm³ = SIDA. L\'OMS classe cliniquement (stades 1-4), indépendamment des CD4. Les CD4 guident la prophylaxie et le délai de mise sous ARV.',
  clinicalCommentary: 'Stade OMS 3-4 et/ou CD4 < 350 = indication ARV. Prophylaxie PCP si CD4 < 200. Prophylaxie Toxo si CD4 < 100. MAC si CD4 < 50.',
  references: [{ type: 'pubmed', title: 'OMS — WHO staging system for HIV infection, 2007' }],
}
export default omssida
