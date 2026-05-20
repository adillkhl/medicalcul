import type { FormulaDefinition } from '../types'

const graceScore: FormulaDefinition = {
  id: 'grace',
  slug: 'grace',
  name: 'GRACE 2.0 — Risque SCA ST- et ST+',
  specialty: 'cardiologie',
  category: 'Syndrome coronarien',
  description: "Global Registry of Acute Coronary Events 2.0 — risque de mortalite intra-hospitaliere dans les SCA (modele de regression logistique)",
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {id:'age', type:'number', label:'Age', unit:'ans', min:20, max:100, step:1, placeholder:'65'},
    {id:'hr', type:'number', label:'Frequence cardiaque', unit:'/min', min:20, max:300, step:1, placeholder:'90'},
    {id:'sbp', type:'number', label:'PAS', unit:'mmHg', min:50, max:300, step:1, placeholder:'130'},
    {id:'creatinine', type:'number', label:'Creatinine', unit:'mg/dL', min:0.3, max:15, step:0.1, placeholder:'1.0'},
    // Killip 1-4 (MDCalc standard: I=1, II=2, III=3, IV=4)
    {id:'killip', type:'radio', label:'Killip', options:[
      {value:1,label:'I - Pas d\'IC'},{value:2,label:'II - Rales < 50%'},{value:3,label:'III - OAP'},{value:4,label:'IV - Choc cardiogenique'},
    ]},
    {id:'cardiacArrest', type:'boolean', label:'Arret cardiaque a l\'admission'},
    {id:'stDeviation', type:'boolean', label:'Sus-decalage ST'},
    {id:'highTroponin', type:'boolean', label:'Troponine elevee (> 3x normale)'},
  ],
  calculate: (values) => {
    const age = Number(values.age) || 60
    const hr = Number(values.hr) || 80
    const sbp = Number(values.sbp) || 130
    const creat = Number(values.creatinine) || 1.0
    const k = Number(values.killip) || 1  // Killip I = 1 par defaut

    // GRACE 2.0 coefficients (Fox et al, BMJ 2006 — modele in-hospital)
    const beta0 = -5.4937
    const bAge = 0.0529
    const bHr = 0.0146
    const bSbp = -0.0155
    const bCreat = 0.1806
    const bKillipII = 0.6158
    const bKillipIII = 1.0114
    const bKillipIV = 1.3200
    const bCA = 0.9641
    const bST = 0.3879
    const bEnzymes = 0.5881

    let logit = beta0
      + bAge * age
      + bHr * hr
      + bSbp * sbp
      + bCreat * creat
      + (k === 2 ? bKillipII : k === 3 ? bKillipIII : k === 4 ? bKillipIV : 0)
      + (values.cardiacArrest ? bCA : 0)
      + (values.stDeviation ? bST : 0)
      + (values.highTroponin ? bEnzymes : 0)

    const mortality = Math.min(100, Math.max(0, Math.exp(logit) / (1 + Math.exp(logit)) * 100))

    // Score de points GRACE approxime pour stratification rapide
    let pointScore = 0
    if (age >= 90) pointScore += 100; else if (age >= 80) pointScore += 85; else if (age >= 70) pointScore += 75
    else if (age >= 60) pointScore += 50; else if (age >= 50) pointScore += 30; else if (age >= 40) pointScore += 15
    if (hr >= 150) pointScore += 40; else if (hr >= 110) pointScore += 25; else if (hr >= 90) pointScore += 10
    if (sbp < 80) pointScore += 58; else if (sbp < 100) pointScore += 40; else if (sbp < 120) pointScore += 15
    if (creat > 4.0) pointScore += 50; else if (creat > 2.0) pointScore += 35; else if (creat > 1.2) pointScore += 20
    if (k === 4) pointScore += 39; else if (k === 3) pointScore += 30; else if (k === 2) pointScore += 15
    if (values.cardiacArrest) pointScore += 43
    if (values.stDeviation) pointScore += 28
    if (values.highTroponin) pointScore += 15

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    if (mortality < 1) { label = 'Faible risque'; severity = 'low' }
    else if (mortality < 3) { label = 'Risque intermediaire'; severity = 'moderate' }
    else if (mortality < 8) { label = 'Haut risque'; severity = 'high' }
    else { label = 'Tres haut risque'; severity = 'critical' }

    return {
      value: Math.round(pointScore),
      label,
      risk: Math.round(mortality * 10) / 10,
      riskUnit: '% mortalite intra-hospitaliere (GRACE 2.0)',
      severity,
      details: {
        'Age': `${age} ans`,
        'Frequence cardiaque': `${hr}/min`,
        'PAS': `${sbp} mmHg`,
        'Creatinine': `${creat} mg/dL`,
        'Killip': `Classe ${k}`,
        'Arret cardiaque': values.cardiacArrest ? 'Oui' : 'Non',
        'Sus-ST': values.stDeviation ? 'Oui' : 'Non',
        'Troponine elevee': values.highTroponin ? 'Oui' : 'Non',
        'Score points': Math.round(pointScore),
        'Mortalite estimee': `${Math.round(mortality * 10) / 10}%`,
      },
      ranges: [
        {min:0, max:79, label:'Faible risque', severity:'low' as const, recommendation:"Traitement medical standard."},
        {min:80, max:99, label:'Risque intermediaire', severity:'moderate' as const, recommendation:"Coronarographie precoce. Traitement anti-thrombotique intensif."},
        {min:100, max:139, label:'Haut risque', severity:'high' as const, recommendation:"Coronarographie urgente (< 24h). Soins intensifs."},
        {min:140, max:300, label:'Tres haut risque', severity:'critical' as const, recommendation:"Coronarographie immediate. Assistance hemodynamique."},
      ],
    }
  },
  interpretation: 'Le score GRACE 2.0 (Fox et al. BMJ 2006) utilise un modele de regression logistique pour estimer le risque de mortalite intra-hospitaliere dans les SCA. Facteurs : age, FC, PAS, creatinine, Killip (1-4), arret cardiaque, sus-ST, troponine. Le modele remplace le systeme de points approximatif du GRACE original.',
  clinicalCommentary: 'Le GRACE 2.0 est le score de reference pour les SCA (ESC recommande son calcul systematique). L\'estimation du risque guide la strategie invasive et le choix antithrombotique.',
  references: [
    {type:'pubmed', title:'Granger CB et al. Predictors of hospital mortality in the GRACE. Arch Intern Med 2003', pmid:'14504159'},
    {type:'pubmed', title:'Fox KAA et al. Prediction of risk of death and myocardial infarction in the six months after presentation with ACS. BMJ 2006', pmid:'16908494'},
  ],
}
export default graceScore
