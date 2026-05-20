import type { FormulaDefinition } from '../types'

const afc_colo: FormulaDefinition = {
  id: 'afc_colo', slug: 'afc_colo',
  name: 'AFC Score (Résection Colorectale)',
  specialty: 'chirurgie', category: 'Colorectal',
  description: 'Score de risque de mortalité post-opératoire après résection colorectale pour cancer (AFC score)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_ans', type: 'number', label: 'Âge (ans)', min: 18, max: 100, step: 1 },
    { id: 'perte_poids', type: 'boolean', label: 'Perte de poids > 10% en 6 mois' },
    { id: 'neuro', type: 'boolean', label: 'Neurologique (AVC, démence)' },
    { id: 'cardio', type: 'boolean', label: 'Cardiopathie (insuffisance cardiaque, coronaropathie)' },
    { id: 'insuf_resp', type: 'boolean', label: 'Insuffisance respiratoire chronique' },
    { id: 'insuf_renale', type: 'boolean', label: 'Insuffisance rénale chronique (créat > 150 µmol/L)' },
    { id: 'urgence', type: 'boolean', label: 'Intervention en urgence' },
    { id: 'stade_avance', type: 'boolean', label: 'Cancer stade avancé (T4 / métastases)' },
  ],
  calculate: (values) => {
    const age = values.age_ans ?? 60
    const score_age = age > 85 ? 4 : age > 75 ? 3 : age > 65 ? 2 : age > 50 ? 1 : 0
    const pts = score_age + (values.perte_poids ? 2 : 0) + (values.neuro ? 2 : 0) + (values.cardio ? 1 : 0) + (values.insuf_resp ? 1 : 0) + (values.insuf_renale ? 1 : 0) + (values.urgence ? 2 : 0) + (values.stade_avance ? 1 : 0)
    return { value: pts, label: `AFC Score : ${pts}`, severity: pts >= 7 ? 'high' : pts >= 4 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 3, label: 'Risque faible (mortalité < 2%)', severity: 'low' },
        { min: 4, max: 6, label: 'Risque modéré (mortalité 5-10%)', severity: 'moderate' },
        { min: 7, max: Infinity, label: 'Risque élevé (mortalité > 15%)', severity: 'high' },
      ] }
  },
  interpretation: 'L\'AFC score prédit la mortalité post-opératoire à 30 jours après résection colorectale.',
  clinicalCommentary: 'Validé sur une large cohorte française (AFC = Association Française de Chirurgie). Aide à la décision thérapeutique et à l\'information du patient.',
  references: [{ type: 'pubmed', title: 'AFC Score for colorectal resection — French Surgical Association' }],
}
export default afc_colo
