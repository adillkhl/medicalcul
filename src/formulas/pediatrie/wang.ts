import type { FormulaDefinition } from '../types'

const wang: FormulaDefinition = {
  id: 'wang', slug: 'wang',
  name: 'Score de Wang',
  specialty: 'pediatrie', category: 'Pneumologie',
  description: 'Prédiction de la persistance du wheezing chez l\'enfant < 3 ans',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sexe', type: 'radio', label: 'Sexe masculin', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'asthme_parental', type: 'radio', label: 'Antécédent d\'asthme parental', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'eczema', type: 'radio', label: 'Eczéma chez l\'enfant', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'debut_precoce', type: 'radio', label: 'Début < 6 mois', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'frequence', type: 'radio', label: '≥ 3 épisodes/an', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
    { id: 'dyspnee_sev', type: 'radio', label: 'Dyspnée sévère (hospitalisation)', options: [{ value: 1, label: 'Oui' }, { value: 0, label: 'Non' }] },
  ],
  calculate: (values) => {
    const total = (values.sexe ?? 0) + (values.asthme_parental ?? 0) + (values.eczema ?? 0) + (values.debut_precoce ?? 0) + (values.frequence ?? 0) + (values.dyspnee_sev ?? 0)
    return { value: total, label: `Score Wang : ${total}/6`, severity: total >= 4 ? 'high' : total >= 2 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 1, label: 'Faible risque', severity: 'low' },
        { min: 2, max: 3, label: 'Risque modéré', severity: 'moderate' },
        { min: 4, max: 6, label: 'Risque élevé — Évoquer asthme', severity: 'high' },
      ] }
  },
  interpretation: 'Score ≥ 4 : forte probabilité d\'asthme persistant à 6 ans.',
  clinicalCommentary: 'Aide à distinguer wheezers transitoires des futurs asthmatiques. Comparer à l\'API (Asthma Predictive Index).',
  references: [{ type: 'pubmed', title: 'Wang Q et al. Pediatr Pulmonol 2012' }],
}
export default wang
