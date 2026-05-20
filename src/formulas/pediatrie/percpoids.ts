import type { FormulaDefinition } from '../types'

const percpoids: FormulaDefinition = {
  id: 'percpoids', slug: 'percpoids',
  name: 'Pourcentage de Perte de Poids (Nourrisson)',
  specialty: 'pediatrie', category: 'Neonatalogie',
  description: 'Calcul du pourcentage de perte de poids physiologique du nouveau-né',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'poids_naissance_g', type: 'number', label: 'Poids de naissance (g)', min: 500, max: 6000, step: 10 },
    { id: 'poids_actuel_g', type: 'number', label: 'Poids actuel (g)', min: 400, max: 6000, step: 10 },
    { id: 'age_jours', type: 'number', label: 'Âge (jours)', min: 0, max: 30, step: 1 },
  ],
  calculate: (values) => {
    const pn = values.poids_naissance_g ?? 3000
    const pa = values.poids_actuel_g ?? 3000
    const perte = ((pn - pa) / pn) * 100
    return { value: perte, label: `Perte de poids : ${perte.toFixed(1)}%`, severity: perte > 10 ? 'high' : perte > 7 ? 'moderate' : 'low',
      ranges: [
        { min: -Infinity, max: 5, label: 'Perte physiologique normale', severity: 'low' },
        { min: 5, max: 7, label: 'Surveillance renforcée', severity: 'moderate' },
        { min: 7, max: 10, label: 'Risque — Évaluer alimentation', severity: 'moderate' },
        { min: 10, max: Infinity, label: 'Perte excessive — Urgence', severity: 'high' },
      ] }
  },
  interpretation: 'Perte normale 5-7% à J3-J5. Au-delà de 10%, réévaluation nécessaire.',
  clinicalCommentary: 'Perte max à J3-J5. Retour au poids naissance à J10-J14. Allaitement maternel exclusif : avis spécialisé si perte > 7%.',
  references: [{ type: 'pubmed', title: 'AAP — Newborn weight loss' }],
}
export default percpoids
