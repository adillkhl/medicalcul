import type { FormulaDefinition } from '../types'

const pdq39: FormulaDefinition = {
  id: 'pdq39', slug: 'pdq39',
  name: 'PDQ-39 (Parkinson\'s Disease Questionnaire-39)',
  specialty: 'divers', category: 'Neurologie',
  description: 'Questionnaire de qualité de vie dans la maladie de Parkinson — 39 items, 8 dimensions',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'mobilite', type: 'radio', label: 'Mobilité (difficultés à marcher, équilibre)', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
    { id: 'avq', type: 'radio', label: 'Activités quotidiennes (habillage, repas)', options: [{ value: 0, label: 'Normales' }, { value: 1, label: 'Légères difficultés' }, { value: 2, label: 'Modérées' }, { value: 3, label: 'Sévères' }, { value: 4, label: 'Très sévères' }] },
    { id: 'bien_etre', type: 'radio', label: 'Bien-être émotionnel (dépression, anxiété)', options: [{ value: 0, label: 'Bon' }, { value: 1, label: 'Altéré léger' }, { value: 2, label: 'Altéré modéré' }, { value: 3, label: 'Altéré sévère' }, { value: 4, label: 'Très sévèrement altéré' }] },
    { id: 'stigmatisation', type: 'radio', label: 'Stigmatisation (gêne, isolement)', options: [{ value: 0, label: 'Aucune' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
    { id: 'soutien', type: 'radio', label: 'Soutien social', options: [{ value: 0, label: 'Excellent' }, { value: 1, label: 'Bon' }, { value: 2, label: 'Moyen' }, { value: 3, label: 'Faible' }, { value: 4, label: 'Inexistant' }] },
    { id: 'cognition', type: 'radio', label: 'Cognition (mémoire, concentration)', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Légère altération' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
    { id: 'communication', type: 'radio', label: 'Communication (parole, écriture)', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Légère altération' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
    { id: 'inconfort', type: 'radio', label: 'Inconfort corporel (douleurs, courbatures)', options: [{ value: 0, label: 'Aucun' }, { value: 1, label: 'Léger' }, { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' }, { value: 4, label: 'Très sévère' }] },
  ],
  calculate: (values) => {
    const total = (values.mobilite ?? 0) + (values.avq ?? 0) + (values.bien_etre ?? 0) + (values.stigmatisation ?? 0) + (values.soutien ?? 0) + (values.cognition ?? 0) + (values.communication ?? 0) + (values.inconfort ?? 0)
    const pct = (total / 32) * 100
    return { value: total, label: `PDQ-39 SI : ${pct.toFixed(0)}% (score ${total}/32)`, severity: pct > 50 ? 'high' : pct > 25 ? 'moderate' : 'low' }
  },
  interpretation: 'Le PDQ-39 est le questionnaire de qualité de vie le plus utilisé dans la maladie de Parkinson. Score élevé = qualité de vie altérée.',
  clinicalCommentary: '8 dimensions : mobilité, AVQ, bien-être émotionnel, stigmatisation, soutien, cognition, communication, inconfort. Un Summary Index (SI) est calculé en %.',
  references: [{ type: 'pubmed', title: 'Peto V et al. PDQ-39 quality of life questionnaire. Age Ageing 1995', pmid: '8669417' }],
}
export default pdq39
