import type { FormulaDefinition } from '../types'

const p_xbw: FormulaDefinition = {
  id: 'p_xbw', slug: 'p_xbw',
  name: 'Poids Idéal (IBW) et Poids Ajusté (ABW)',
  specialty: 'nutrition', category: 'Anthropométrie',
  description: 'Calcul du poids idéal théorique (IBW) et du poids ajusté (ABW) selon la formule de Devine',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'taille_cm', type: 'number', label: 'Taille (cm)', min: 130, max: 220, step: 1 },
    { id: 'poids_reel_kg', type: 'number', label: 'Poids réel (kg)', min: 30, max: 250, step: 0.1 },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Homme' }, { value: 1, label: 'Femme' }] },
  ],
  calculate: (values) => {
    const t = values.taille_cm ?? 170
    const pr = values.poids_reel_kg ?? 70
    const s = values.sexe ?? 0
    const ibw = s === 0 ? 50 + 0.91 * (t - 152.4) : 45.5 + 0.91 * (t - 152.4)
    const abw = ibw + 0.25 * (pr - ibw)
    const diff = ((pr - ibw) / ibw) * 100
    return { value: parseFloat(ibw.toFixed(1)), label: `IBW : ${ibw.toFixed(1)} kg | ABW : ${abw.toFixed(1)} kg`,
      details: { 'Poids idéal (IBW)': `${ibw.toFixed(1)} kg`, 'Poids ajusté (ABW)': `${abw.toFixed(1)} kg`, 'Différence': `${diff.toFixed(1)}%` },
      severity: Math.abs(diff) > 20 ? 'high' : Math.abs(diff) > 10 ? 'moderate' : 'low' }
  },
  interpretation: "IBW = poids idéal théorique (Devine). ABW = poids ajusté pour les posologies médicamenteuses (obésité).",
  clinicalCommentary: "L\'ABW est utilisé pour le calcul des doses de médicaments hydrophiles (chimiothérapies, héparines) chez le patient obèse.",
  references: [{ type: 'pubmed', title: 'Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm 1974' }],
}
export default p_xbw
