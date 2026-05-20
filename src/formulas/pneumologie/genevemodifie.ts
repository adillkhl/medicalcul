import type { FormulaDefinition } from '../types'

const genevemodifie: FormulaDefinition = {
  id: 'genevemodifie', slug: 'genevemodifie',
  name: 'Score de Genève Révisé (Embolie Pulmonaire)',
  specialty: 'pneumologie', category: 'Thromboembolie',
  description: 'Probabilité clinique d\'embolie pulmonaire selon le score de Genève révisé',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'radio', label: 'Âge', options: [{ value: 0, label: '< 65 ans' }, { value: 1, label: '65-79 ans' }, { value: 2, label: '≥ 80 ans' }] },
    { id: 'antecedent_tvp', type: 'boolean', label: 'Antécédent de TVP ou EP' },
    { id: 'chirurgie_fracture', type: 'boolean', label: 'Chirurgie ou fracture < 1 mois' },
    { id: 'cancer_actif', type: 'boolean', label: 'Cancer actif (traitement en cours ou palliatif)' },
    { id: 'douleur_uni', type: 'boolean', label: 'Douleur unilatérale d\'un membre inférieur' },
    { id: 'hemoptysie', type: 'boolean', label: 'Hémoptysie' },
    { id: 'fc', type: 'radio', label: 'Fréquence cardiaque', options: [{ value: 0, label: '< 75/min' }, { value: 1, label: '75-94/min' }, { value: 2, label: '≥ 95/min' }] },
    { id: 'signe_tvp', type: 'boolean', label: 'Signe clinique de TVP (œdème, douleur à la palpation)' },
  ],
  calculate: (values) => {
    const total = (values.age ?? 0) + (values.antecedent_tvp ? 3 : 0) + (values.chirurgie_fracture ? 2 : 0) + (values.cancer_actif ? 2 : 0) + (values.douleur_uni ? 3 : 0) + (values.hemoptysie ? 2 : 0) + (values.fc ?? 0) + (values.signe_tvp ? 4 : 0)
    return { value: total, label: `Genève révisé : ${total} pts`, severity: total >= 11 ? 'high' : total >= 5 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 4, label: 'Probabilité faible (EP 8%)', severity: 'low' },
        { min: 5, max: 10, label: 'Probabilité modérée (EP 28%)', severity: 'moderate' },
        { min: 11, max: Infinity, label: 'Probabilité élevée (EP 74%)', severity: 'high' },
      ] }
  },
  interpretation: 'En association avec les D-dimères (si probabilité faible/modérée) ou l\'angioscanner (si probabilité élevée).',
  clinicalCommentary: 'Le score de Genève révisé (2006) a une sensibilité comparable aux règles de Wells mais est standardisé (items objectifs).',
  references: [{ type: 'pubmed', title: 'Le Gal G et al. Revised Geneva score. Ann Intern Med 2006', pmid: '16418420' }],
}
export default genevemodifie
