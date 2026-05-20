import type { FormulaDefinition } from '../types'

const irls: FormulaDefinition = {
  id: 'irls', slug: 'irls',
  name: 'IRLS (International Restless Legs Scale)',
  specialty: 'divers', category: 'Neurologie',
  description: 'Échelle de sévérité du syndrome des jambes sans repos (IRLS) — 10 items, score 0-40',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'inconfort', type: 'radio', label: 'Inconfort dans les jambes (fourmillements, besoin de bouger)', options: [{ value: 0, label: 'Aucun' }, { value: 1, label: 'Léger' }, { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
    { id: 'besoin_mouvement', type: 'radio', label: 'Besoin de bouger les jambes', options: [{ value: 0, label: 'Aucun' }, { value: 1, label: 'Léger' }, { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
    { id: 'soulagement', type: 'radio', label: 'Soulagement par le mouvement', options: [{ value: 0, label: 'Complet (soulagement total)' }, { value: 1, label: 'Bon soulagement' }, { value: 2, label: 'Partiel' }, { value: 3, label: 'Léger' }, { value: 4, label: 'Aucun' }] },
    { id: 'somnolence', type: 'radio', label: 'Impact sur le sommeil', options: [{ value: 0, label: 'Aucun' }, { value: 1, label: 'Léger' }, { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
    { id: 'fatigue_diurne', type: 'radio', label: 'Fatigue/somnolence diurne', options: [{ value: 0, label: 'Aucune' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
  ],
  calculate: (values) => {
    const total = (values.inconfort ?? 0) + (values.besoin_mouvement ?? 0) + (values.soulagement ?? 0) + (values.somnolence ?? 0) + (values.fatigue_diurne ?? 0)
    return { value: total, label: `IRLS : ${total}/20 (version 5 items)`, severity: total >= 15 ? 'high' : total >= 10 ? 'moderate' : total >= 5 ? 'low' : 'low' }
  },
  interpretation: 'Score total (version complète 0-40) : 0-10 = léger, 11-20 = modéré, 21-30 = sévère, 31-40 = très sévère.',
  clinicalCommentary: 'L\'IRLS est le gold standard pour évaluer la sévérité du SJSR. La version 5 items est un indicateur rapide. À compléter par le dosage de la ferritine.',
  references: [{ type: 'pubmed', title: 'Walters AS et al. IRLS rating scale. Sleep Med 2003', pmid: '14592347' }],
}
export default irls
