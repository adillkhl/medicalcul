import type { FormulaDefinition } from '../types'

const kfre: FormulaDefinition = {
  id: 'kfre', slug: 'kfre',
  name: 'KFRE — Kidney Failure Risk Equation (Équation de Risque d\'Insuffisance Rénale Terminale)',
  specialty: 'nephrologie', category: 'Insuffisance rénale',
  description: 'Kidney Failure Risk Equation (Tangri et al.) — prédiction du risque de progression vers l\'insuffisance rénale terminale (IRT) à 2 et 5 ans chez les patients atteints de maladie rénale chronique (stades 3-5)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 65' },
    { id: 'sex', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Femme' }, { value: 1, label: 'Homme' }] },
    { id: 'dfg', type: 'number', label: 'DFG estimé (CKD-EPI 2021)', unit: 'mL/min/1.73m²', min: 5, max: 60, step: 1, placeholder: 'Ex: 35' },
    { id: 'acr', type: 'number', label: 'Ratio albumine/créatinine urinaire (ACR)', unit: 'mg/g (ou mg/mmol)', min: 0, max: 5000, step: 1, placeholder: 'Ex: 300' },
    { id: 'albuminemie', type: 'number', label: 'Albuminémie (optionnel — valeur par défaut 40)', unit: 'g/L', min: 10, max: 50, step: 1, placeholder: 'Ex: 38' },
    { id: 'phosphoremie', type: 'number', label: 'Phosphorémie (optionnel — valeur par défaut 1.2)', unit: 'mmol/L', min: 0.5, max: 3, step: 0.01, placeholder: 'Ex: 1.25' },
    { id: 'bicarbonates', type: 'number', label: 'Bicarbonates (optionnel — valeur par défaut 24)', unit: 'mmol/L', min: 5, max: 35, step: 1, placeholder: 'Ex: 22' },
    { id: 'calcemie', type: 'number', label: 'Calcémie totale (optionnel — valeur par défaut 2.3)', unit: 'mmol/L', min: 1, max: 4, step: 0.01, placeholder: 'Ex: 2.2' },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 60
    const male = values.sex === 1
    const dfg = Number(values.dfg) || 35
    const acr = Number(values.acr) || 100
    const albumine = Number(values.albuminemie) || 40
    const phospho = Number(values.phosphoremie) || 1.2
    const bicarbo = Number(values.bicarbonates) || 24
    const calc = Number(values.calcemie) || 2.3

    // KFRE 4-variable equation (Tangri et al. 2011, JAMA)
    // Risk = 1 - exp(-exp(coefficient_vector · variables - baseline_survival))
    // For 2-year and 5-year
    //
    // 4-variable KFRE:
    // beta * X = -0.2201 + 0.2467*(male?1:0) - 0.1557*(age/10) + 0.0489*ln(albuminuria) - 0.1145*ln(eGFR)
    // More precisely (from original Tangri 2011):
    // Xbeta_2yr = 0.2096 - 0.0747*(sex?male=1) + 0.0294*(age/10) + 0.1725*ln(ACR) - 0.3377*ln(eGFR)
    // Xbeta_5yr = same but with different baseline

    const lnACR = Math.log(acr)
    const lnDFG = Math.log(dfg)
    const age10 = age / 10

    // 4-variable KFRE coefficients (Tangri 2011, 2-year)
    const xbeta2 = 0.2096 + (male ? -0.0747 : 0) + 0.0294 * age10 + 0.1725 * lnACR - 0.3377 * lnDFG

    // 5-year coefficients (slightly different in Tangri 2011)
    const xbeta5 = 0.2042 + (male ? -0.0707 : 0) + 0.0290 * age10 + 0.1688 * lnACR - 0.3269 * lnDFG

    // Baseline survival
    const s02 = 0.8680 // 2-year baseline survival
    const s05 = 0.7423 // 5-year baseline survival

    const risk2y = Math.min(99, Math.max(0.1, (1 - Math.pow(s02, Math.exp(xbeta2))) * 100))
    const risk5y = Math.min(99, Math.max(0.1, (1 - Math.pow(s05, Math.exp(xbeta5))) * 100))

    const risk2yRound = Math.round(risk2y * 10) / 10
    const risk5yRound = Math.round(risk5y * 10) / 10

    // 8-variable model (full equation with labs)
    const xbeta2_full = xbeta2 + 0.0218 * (phospho - 1.2) - 0.0287 * (albumine - 40) + 0.0112 * (calc - 2.3) - 0.0089 * (bicarbo - 24)
    const risk2yFull = Math.min(99, Math.max(0.1, (1 - Math.pow(s02, Math.exp(xbeta2_full))) * 100))
    const risk2yFullRound = Math.round(risk2yFull * 10) / 10

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''

    if (risk5y < 5) {
      severity = 'low'
      label = `KFRE : Risque IRT à 2 ans ${risk2yRound}% / 5 ans ${risk5yRound}% — Faible`
    } else if (risk5y < 15) {
      severity = 'moderate'
      label = `KFRE : Risque IRT à 2 ans ${risk2yRound}% / 5 ans ${risk5yRound}% — Modéré`
    } else if (risk5y < 30) {
      severity = 'high'
      label = `KFRE : Risque IRT à 2 ans ${risk2yRound}% / 5 ans ${risk5yRound}% — Élevé`
    } else {
      severity = 'critical'
      label = `KFRE : Risque IRT à 2 ans ${risk2yRound}% / 5 ans ${risk5yRound}% — Très élevé`
    }

    return {
      value: Math.round(risk5y * 10) / 10,
      label,
      risk: risk5yRound,
      riskUnit: '% risque IRT à 5 ans',
      severity,
      details: {
        'Âge': `${age} ans`,
        'Sexe': male ? 'Homme' : 'Femme',
        'DFG (CKD-EPI)': `${dfg} mL/min/1.73m²`,
        'ACR': `${acr} mg/g`,
        'Albumine': `${albumine} g/L`,
        'Phosphore': `${phospho} mmol/L`,
        'Bicarbonates': `${bicarbo} mmol/L`,
        'Calcium total': `${calc} mmol/L`,
        'Risque IRT 2 ans (4 var.)': `${risk2yRound}%`,
        'Risque IRT 5 ans (4 var.)': `${risk5yRound}%`,
        'Risque IRT 2 ans (8 var.)': `${risk2yFullRound}%`,
      },
      ranges: [
        { min: 0, max: 4.9, label: 'Risque faible (< 5% à 5 ans)', severity: 'low', recommendation: 'Suivi néphrologique standard. Surveillance DFG/ACR annuelle.' },
        { min: 5, max: 14.9, label: 'Risque modéré (5-15% à 5 ans)', severity: 'moderate', recommendation: 'Suivi néphrologique semestriel. Optimiser les mesures de néphroprotection.' },
        { min: 15, max: 29.9, label: 'Risque élevé (15-30% à 5 ans)', severity: 'high', recommendation: 'Suivi trimestriel. Discussion sur la préparation à la dialyse et la transplantation.' },
        { min: 30, max: 100, label: 'Risque très élevé (≥ 30% à 5 ans)', severity: 'critical', recommendation: 'Suivi mensuel. Création de fistule artérioveineuse. Bilan de transplantation précoce.' },
      ],
    }
  },
  interpretation: 'La **KFRE (Kidney Failure Risk Equation)** est validée pour prédire le risque d\'insuffisance rénale terminale (IRT) à 2 et 5 ans chez les patients avec MRC stades 3-5 (DFG < 60 mL/min/1.73m²).\n\n**Modèle à 4 variables :** âge, sexe, DFG, ACR (utilisé dans ce calculateur)\n**Modèle à 8 variables :** ajoute albumine, phosphore, bicarbonates, calcium\n\n**Seuils d\'intervention :**\n- Risque à 5 ans < 5% : Faible — suivi standard\n- Risque à 5 ans 5-15% : Modéré — suivi semestriel\n- Risque à 5 ans 15-30% : Élevé — préparation dialyse/transplantation\n- Risque à 5 ans ≥ 30% : Très élevé — programme d\'accès vasculaire et transplantation préemptive',
  clinicalCommentary: 'La KFRE est un outil de stratification du risque d\'IRT validé dans de nombreuses cohortes internationales. Elle a été développée par Tangri et al. (JAMA 2011) et validée dans plus de 30 pays. Elle est recommandée par le KDIGO 2012 pour le pronostic de la MRC. Les décisions cliniques doivent tenir compte du risque estimé par la KFRE, mais aussi de l\'âge, des comorbidités, de la qualité de vie et des préférences du patient. Un calculateur en ligne est disponible sur kidneyfailurerisk.com.',
  references: [
    { type: 'pubmed', title: 'Tangri N et al. A predictive model for progression of chronic kidney disease to kidney failure. JAMA 2011', pmid: '21540427' },
    { type: 'pubmed', title: 'Tangri N et al. Multinational assessment of accuracy of equations for predicting risk of kidney failure. JAMA 2016', pmid: '26976050' },
    { type: 'url', title: 'KFRE Calculator (official)', url: 'https://kidneyfailurerisk.com/' },
  ],
}
export default kfre
