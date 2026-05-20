import type { FormulaDefinition } from '../types'

const guarino: FormulaDefinition = {
  id: 'guarino', slug: 'guarino',
  name: 'Score de Guarino',
  specialty: 'pediatrie', category: 'Gastroentérologie',
  description: 'Prédiction du risque de diarrhée persistante (> 14j) chez l\'enfant',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_mois', type: 'radio', label: 'Âge < 12 mois', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'denutrition', type: 'radio', label: 'Dénutrition (poids/taille < -2 DS)', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'dehydratation', type: 'radio', label: 'Déshydratation modérée à sévère', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'diarrhee_glairo', type: 'radio', label: 'Diarrhée glairo-sanglante', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'antibio_pre', type: 'radio', label: 'Antibiothérapie préalable', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
  ],
  calculate: (values) => {
    const total = (values.age_mois ?? 0) + (values.denutrition ?? 0) + (values.dehydratation ?? 0) + (values.diarrhee_glairo ?? 0) + (values.antibio_pre ?? 0)
    return { value: total, label: `Score Guarino : ${total}/5`, severity: total >= 3 ? 'high' : total >= 2 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 1, label: 'Risque faible', severity: 'low' },
        { min: 2, max: 2, label: 'Risque modéré', severity: 'moderate' },
        { min: 3, max: 5, label: 'Risque élevé', severity: 'high' },
      ] }
  },
  interpretation: 'Score ≥ 3 justifie une prise en charge renforcée et un suivi nutritionnel.',
  clinicalCommentary: 'Validé chez l\'enfant < 5 ans. Diarrhée persistante = > 14 jours.',
  references: [{ type: 'pubmed', title: 'Guarino A et al. JPGN 1992' }],
}
export default guarino
