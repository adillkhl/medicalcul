import type { FormulaDefinition } from '../types'

const diva: FormulaDefinition = {
  id: 'diva', slug: 'diva',
  name: 'DIVA Score (Accès veineux difficile — Enfant)',
  specialty: 'soins_infirmiers', category: 'Accès veineux',
  description: 'Prédiction de la difficulté d\'accès veineux périphérique chez l\'enfant (DIVA score)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'veine_visibilite', type: 'radio', label: 'Visibilité des veines', options: [{ value: 0, label: 'Visibles' }, { value: 2, label: 'Non visibles' }] },
    { id: 'veine_palpation', type: 'radio', label: 'Palpation des veines', options: [{ value: 0, label: 'Palpables' }, { value: 2, label: 'Non palpables' }] },
    { id: 'age_mois', type: 'radio', label: 'Âge', options: [{ value: 0, label: '≥ 12 mois' }, { value: 1, label: '< 12 mois' }] },
    { id: 'antecedent_difficulte', type: 'radio', label: 'Antécédent de prématurité', options: [{ value: 0, label: 'Non' }, { value: 3, label: 'Oui (né prématuré)' }] },
  ],
  calculate: (values) => {
    const total = (values.veine_visibilite ?? 0) + (values.veine_palpation ?? 0) + (values.age_mois ?? 0) + (values.antecedent_difficulte ?? 0)
    return { value: total, label: `DIVA : ${total}/8`, severity: total >= 4 ? 'high' : total >= 2 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 4 : forte probabilité d\'échec au premier essai. Score ≥ 2 : difficulté modérée.',
  clinicalCommentary: 'Le DIVA score est validé aux urgences pédiatriques. Score ≥ 4 : envisager guidage échographique ou équipe spécialisée.',
  references: [{ type: 'pubmed', title: 'Yen K et al. DIVA score for pediatric IV access. Acad Emerg Med 2012' }],
}
export default diva
