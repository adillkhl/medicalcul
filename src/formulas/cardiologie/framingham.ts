import type { FormulaDefinition } from '../types'

const framingham: FormulaDefinition = {
  id: 'framingham',
  slug: 'framingham',
  name: 'Framingham — Risque coronarien (Hard CHD)',
  specialty: 'cardiologie',
  category: 'Risque CV',
  description: "Score de Framingham de risque coronarien à 10 ans (infarctus du myocarde + décès coronarien) — équations de Wilson 1998",
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {id:'age', type:'number', label:'Âge', unit:'ans', min:30, max:74, step:1, placeholder:'45'},
    {id:'sex', type:'radio', label:'Sexe', options:[{value:0,label:'Femme'},{value:1,label:'Homme'}]},
    {id:'totalChol', type:'number', label:'Cholestérol total', unit:'mg/dL', min:100, max:400, step:1, placeholder:'220'},
    {id:'hdlChol', type:'number', label:'HDL-Cholestérol', unit:'mg/dL', min:10, max:100, step:1, placeholder:'45'},
    {id:'sbp', type:'number', label:'Pression systolique', unit:'mmHg', min:80, max:250, step:1, placeholder:'130'},
    {id:'treated', type:'boolean', label:'Hypertension traitée'},
    {id:'smoker', type:'boolean', label:'Tabagisme actif'},
  ],
  calculate: (values) => {
    const age = Number(values.age) || 50
    const male = values.sex === 1
    const chol = Number(values.totalChol) || 200
    const hdl = Number(values.hdlChol) || 50
    const sbp = Number(values.sbp) || 130
    const treated = !!values.treated
    const smoke = !!values.smoker

    // Modèle Hard CHD (Wilson 1998) — pas de diabète dans ce modèle
    let L: number
    let s0: number

    if (male) {
      // Hommes : coefficients Wilson 1998
      L = 52.00961 * Math.log(age)
        + 20.014077 * Math.log(chol)
        + (-0.905964) * Math.log(hdl)
        + 1.305784 * Math.log(sbp)
        + (treated ? 0.241549 : 0)
        + (smoke ? 12.096316 : 0)
        + (-4.605038) * Math.log(age) * Math.log(chol)
        + (smoke ? (-2.84367) * Math.log(age) : 0)
        + (-2.93323) * Math.log(age) * Math.log(age)
        - 172.300168
      s0 = 0.9402 // baseline 10-year survival — hommes
    } else {
      // Femmes : coefficients Wilson 1998
      L = 31.764001 * Math.log(age)
        + 22.465206 * Math.log(chol)
        + (-1.187731) * Math.log(hdl)
        + 2.552905 * Math.log(sbp)
        + (treated ? 0.420251 : 0)
        + (smoke ? 13.07543 : 0)
        + (-5.060998) * Math.log(age) * Math.log(chol)
        + (smoke ? (-2.996945) * Math.log(age) : 0)
        - 146.593306
      s0 = 0.98767 // baseline 10-year survival — femmes
    }

    const risk = Math.min(99, Math.max(0.1, (1 - Math.pow(s0, Math.exp(L))) * 100))
    const riskRound = Math.round(risk * 10) / 10

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    if (risk < 10) { label = `Framingham ${riskRound}% — Faible risque`; severity = 'low' }
    else if (risk < 20) { label = `Framingham ${riskRound}% — Risque modéré`; severity = 'moderate' }
    else { label = `Framingham ${riskRound}% — Haut risque`; severity = 'high' }

    return {
      value: riskRound,
      label,
      risk: riskRound,
      riskUnit: '% risque coronarien (IDM + décès CV) à 10 ans',
      severity,
      details: {
        'Âge': `${age} ans`,
        'Sexe': male ? 'Homme' : 'Femme',
        'Cholestérol total': `${chol} mg/dL`,
        'HDL-Cholestérol': `${hdl} mg/dL`,
        'PAS': `${sbp} mmHg`,
        'HTA traitée': treated ? 'Oui' : 'Non',
        'Tabagisme': smoke ? 'Oui' : 'Non',
      },
      ranges: [
        {min:0, max:9.9, label:'Risque faible (< 10%)', severity:'low' as const, recommendation:"Conseils hygiène-diététiques. Réévaluation dans 5 ans."},
        {min:10, max:19.9, label:'Risque modéré (10-20%)', severity:'moderate' as const, recommendation:"Prise en charge des facteurs de risque. Statine si LDL > 1.90 ou diabète."},
        {min:20, max:100, label:'Haut risque (≥ 20%)', severity:'high' as const, recommendation:"Statine forte dose + antiagrégant si approprié. Contrôle strict des FDR."},
      ],
    }
  },
  interpretation: 'Le **score de Framingham (Wilson 1998)** estime le risque coronarien à 10 ans (infarctus du myocarde + décès coronarien) à partir des équations de régression originales.\n\n**Modèle Hard CHD** — n\'inclut PAS le diabète (contrairement au modèle ATP III ou au General CVD). Facteurs : âge, sexe, cholestérol total, HDL, PAS, traitement HTA, tabac.\n\n**Seuils :** < 10 % faible; 10-20 % modéré; ≥ 20 % élevé.',
  clinicalCommentary: 'Ce calculateur utilise les équations de régression originales de Wilson 1998 (modèle Hard CHD) plutôt que le système de points approximatif. Il ne prédit pas les AVC (modèle coronarien strict). Le SCORE2 (ESC 2021) est recommandé en Europe comme alternative.',
  references: [
    {type:'pubmed', title:'Wilson PWF et al. Prediction of CHD using risk factor categories. Circulation 1998', pmid:'9741203'},
  ],
}
export default framingham
