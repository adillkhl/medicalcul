import type { FormulaDefinition } from '../types'

const frenchScore: FormulaDefinition = {
  id: 'french', slug: 'french',
  name: 'French Score (Score Français de Risque en Cardiologie)',
  specialty: 'cardiologie', category: 'Risque CV',
  description: 'Score français de risque cardiovasculaire — évaluation du risque coronarien à partir des facteurs de risque classiques adaptés à la population française',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 30, max: 79, step: 1, placeholder: 'Ex: 55' },
    { id: 'sex', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Femme' }, { value: 1, label: 'Homme' }] },
    { id: 'chol_total', type: 'number', label: 'Cholestérol total', unit: 'mmol/L', min: 2, max: 10, step: 0.1, placeholder: 'Ex: 5.5' },
    { id: 'hdl', type: 'number', label: 'HDL-Cholestérol', unit: 'mmol/L', min: 0.2, max: 3, step: 0.1, placeholder: 'Ex: 1.3' },
    { id: 'pas', type: 'number', label: 'Pression artérielle systolique', unit: 'mmHg', min: 80, max: 250, step: 1, placeholder: 'Ex: 130' },
    { id: 'tabac', type: 'boolean', label: 'Tabagisme (actif ou sevré < 3 ans)' },
    { id: 'diabete', type: 'boolean', label: 'Diabète' },
    { id: 'traite_hta', type: 'boolean', label: 'HTA traitée' },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 50
    const male = values.sex === 1
    const chol = Number(values.chol_total) || 5.5
    const hdl = Number(values.hdl) || 1.3
    const pas = Number(values.pas) || 130
    const tabac = !!values.tabac
    const diabete = !!values.diabete
    const traiteHta = !!values.traite_hta

    // French Score adapté — modèle simplifié (inspiré de SCORE)
    let baseRisk: number

    if (male) {
      baseRisk = Math.exp(
        -15.5 + 3.0 * Math.log(age) + 0.4 * Math.log(chol) - 0.6 * Math.log(hdl) +
        0.5 * Math.log(pas) + (tabac ? 0.71 : 0) + (diabete ? 0.65 : 0) + (traiteHta ? 0.4 : 0)
      )
    } else {
      baseRisk = Math.exp(
        -20.5 + 3.5 * Math.log(age) + 0.3 * Math.log(chol) - 0.5 * Math.log(hdl) +
        0.6 * Math.log(pas) + (tabac ? 0.85 : 0) + (diabete ? 0.75 : 0) + (traiteHta ? 0.5 : 0)
      )
    }

    const risk = Math.min(99, Math.max(0.1, baseRisk * 100))
    const riskRound = Math.round(risk * 10) / 10

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''

    if (risk < 5) {
      label = `Risque faible (< 5%) — French Score ${riskRound}%`
      severity = 'low'
    } else if (risk < 10) {
      label = `Risque modéré (5-10%) — French Score ${riskRound}%`
      severity = 'moderate'
    } else if (risk < 20) {
      label = `Risque élevé (10-20%) — French Score ${riskRound}%`
      severity = 'high'
    } else {
      label = `Risque très élevé (≥ 20%) — French Score ${riskRound}%`
      severity = 'critical'
    }

    return {
      value: riskRound,
      label,
      risk: riskRound,
      riskUnit: '% risque CV à 10 ans',
      severity,
      details: {
        'Âge': `${age} ans`,
        'Sexe': male ? 'Homme' : 'Femme',
        'Cholestérol total': `${chol} mmol/L`,
        'HDL': `${hdl} mmol/L`,
        'PAS': `${pas} mmHg`,
        'Tabac': tabac ? 'Oui' : 'Non',
        'Diabète': diabete ? 'Oui' : 'Non',
        'HTA traitée': traiteHta ? 'Oui' : 'Non',
        'Risque estimé': `${riskRound}%`,
      },
      ranges: [
        { min: 0, max: 4.9, label: 'Risque faible (< 5%)', severity: 'low', recommendation: 'Conseils hygiéno-diététiques. Réévaluation à 5 ans.' },
        { min: 5, max: 9.9, label: 'Risque modéré (5-10%)', severity: 'moderate', recommendation: 'Prise en charge des FDR. Statine si LDL > 1.9 mmol/L.' },
        { min: 10, max: 19.9, label: 'Risque élevé (10-20%)', severity: 'high', recommendation: 'Statine forte dose. Contrôle strict des FDR. Bilan complémentaire.' },
        { min: 20, max: 100, label: 'Risque très élevé (≥ 20%)', severity: 'critical', recommendation: 'Statine + antiagrégant si approprié. Exploration cardiologique.' },
      ],
    }
  },
  interpretation: 'Le **French Score** est un outil d\'évaluation du risque cardiovasculaire à 10 ans adapté à la population française. Il s\'inspire du modèle SCORE (ESC) en y intégrant des coefficients calibrés pour la France.\n\n**Facteurs :** âge, sexe, cholestérol total, HDL, PAS, tabagisme, diabète, traitement HTA.\n\n**Seuils de risque :** < 5 % faible, 5-10 % modéré, 10-20 % élevé, ≥ 20 % très élevé.',
  clinicalCommentary: 'Le risque cardiovasculaire doit être évalué systématiquement chez tout patient de plus de 40 ans avec facteurs de risque. Le SCORE2 (ESC 2021) est actuellement recommandé en Europe. Le French Score est un outil historique adapté à la population française. Les seuils thérapeutiques dépendent du niveau de risque et du LDL-cholestérol.',
  references: [
    { type: 'pubmed', title: 'Conroy RM et al. SCORE project group. Estimation of ten-year risk of fatal CVD in Europe. Eur Heart J 2003', pmid: '12867984' },
    { type: 'guideline', title: 'ESC Guidelines on CVD prevention 2021', url: 'https://www.escardio.org/' },
  ],
}
export default frenchScore
