import type { FormulaDefinition } from '../types'

const mgpliscut_durnin: FormulaDefinition = {
  id: 'mgpliscut_durnin', slug: 'mgpliscut_durnin',
  name: 'Masse grasse par plis cutanés (Durnin-Wormseley)',
  specialty: 'nutrition', category: 'Composition corporelle',
  description: 'Estimation du pourcentage de masse grasse par la somme de 4 plis cutanés (méthode Durnin-Wormseley)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'plis_bicipital', type: 'number', label: 'Plis bicipital (mm)', min: 2, max: 40, step: 0.5 },
    { id: 'plis_tricipital', type: 'number', label: 'Plis tricipital (mm)', min: 2, max: 40, step: 0.5 },
    { id: 'plis_sousscap', type: 'number', label: 'Plis sous-scapulaire (mm)', min: 2, max: 40, step: 0.5 },
    { id: 'plis_suprail', type: 'number', label: 'Plis supra-iliaque (mm)', min: 2, max: 40, step: 0.5 },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Homme' }, { value: 1, label: 'Femme' }] },
  ],
  calculate: (values) => {
    const s = (values.plis_bicipital ?? 10) + (values.plis_tricipital ?? 10) + (values.plis_sousscap ?? 10) + (values.plis_suprail ?? 10)
    const log_s = Math.log10(s)
    const densite = (values.sexe ?? 0) === 0 ? 1.1620 - 0.0630 * log_s : 1.1549 - 0.0678 * log_s
    const pct_gras = ((4.95 / densite) - 4.50) * 100
    return { value: parseFloat(pct_gras.toFixed(1)), label: `Masse grasse : ${pct_gras.toFixed(1)}%`, severity: pct_gras > 30 ? 'high' : pct_gras > 25 ? 'moderate' : 'low' }
  },
  interpretation: "Pourcentage de masse grasse estimé par la somme de 4 plis (bicipital, tricipital, sous-scapulaire, supra-iliaque).",
  clinicalCommentary: "Méthode simple et reproductible. L\'opérateur doit être entraîné. Normes : homme 10-20%, femme 18-28%.",
  references: [{ type: 'pubmed', title: 'Durnin JVGA, Wormseley J. Br J Nutr 1974', pmid: '4843940' }],
}
export default mgpliscut_durnin
