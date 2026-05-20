import type { FormulaDefinition } from '../types'

const sisbeck: FormulaDefinition = {
  id: 'sisbeck', slug: 'sisbeck',
  name: 'Échelle d\'Intentionnalité Suicidaire (Beck-Pierce)',
  specialty: 'psychiatrie', category: 'Suicidologie',
  description: 'Évaluation du risque suicidaire selon les critères de Beck et Pierce — score sur 20',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'isolement', type: 'radio', label: 'Isolement au moment du passage à l\'acte', options: [{ value: 0, label: 'Non' }, { value: 1, label: 'Partiel (tiers présent possible)' }, { value: 2, label: 'Total (personne à proximité)' }] },
    { id: 'precaution', type: 'radio', label: 'Précautions contre la découverte', options: [{ value: 0, label: 'Aucune' }, { value: 1, label: 'Partielles' }, { value: 2, label: 'Totales' }] },
    { id: 'timing', type: 'radio', label: 'Horaire', options: [{ value: 0, label: 'Jour (présence possible)' }, { value: 1, label: 'Soir (surveillance réduite)' }, { value: 2, label: 'Nuit (aucune surveillance)' }] },
    { id: 'appel_aide', type: 'radio', label: 'Appel à l\'aide après le geste', options: [{ value: 0, label: 'Oui (averti quelqu\'un)' }, { value: 1, label: 'Indirect (laissé entendre)' }, { value: 2, label: 'Non (aucun appel)' }] },
    { id: 'laisse_sousent', type: 'radio', label: 'Avait laissé sous-entendre son intention', options: [{ value: 0, label: 'Oui, explicitement' }, { value: 1, label: 'Indirectement' }, { value: 2, label: 'Non, surprise totale' }] },
    { id: 'but_mortel', type: 'radio', label: 'But ultime du geste (selon le patient)', options: [{ value: 0, label: 'Manipulation/appel' }, { value: 1, label: 'Incertain' }, { value: 2, label: 'Mourir' }] },
  ],
  calculate: (values) => {
    const total = (values.isolement ?? 0) + (values.precaution ?? 0) + (values.timing ?? 0) + (values.appel_aide ?? 0) + (values.laisse_sousent ?? 0) + (values.but_mortel ?? 0)
    return { value: total, label: `Beck-Pierce : ${total}/12`, severity: total >= 8 ? 'high' : total >= 4 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 8 : haute intentionnalité suicidaire, risque élevé de récidive.',
  clinicalCommentary: 'Utiliser en complément de l\'évaluation clinique. L\'intentionnalité élevée est un facteur de risque majeur de récidive. Hospitalisation à discuter si score ≥ 8.',
  references: [{ type: 'pubmed', title: 'Beck AT et al. Classification of suicidal behavior. Arch Gen Psychiatry 1974' }],
}
export default sisbeck
