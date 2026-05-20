import type { FormulaDefinition } from '../types'

const graceScore: FormulaDefinition = {
  id: 'grace',
  slug: 'grace',
  name: 'GRACE — Risque SCA ST- et ST+',
  specialty: 'cardiologie',
  category: 'Syndrome coronarien',
  description: "Global Registry of Acute Coronary Events - risque de mortalite intra-hospitaliere dans les SCA",
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {id:'age', type:'number', label:'Age', unit:'ans', min:20, max:100, step:1, placeholder:'65'},
    {id:'hr', type:'number', label:'Frequence cardiaque', unit:'/min', min:30, max:250, step:1, placeholder:'90'},
    {id:'sbp', type:'number', label:'PAS', unit:'mmHg', min:50, max:250, step:1, placeholder:'130'},
    {id:'creatinine', type:'number', label:'Creatinine', unit:'mg/dL', min:0.3, max:15, step:0.1, placeholder:'1.0'},
    {id:'killip', type:'radio', label:'Killip', options:[
      {value:0,label:'I - Pas dIC'},{value:1,label:'II - Rales < 50%'},{value:2,label:'III - OAP'},{value:3,label:'IV - Choc cardiogenique'},
    ]},
    {id:'cardiacArrest', type:'boolean', label:'Arret cardiaque a ladmission'},
    {id:'stDeviation', type:'boolean', label:'Sus-decalage ST'},
    {id:'highTroponin', type:'boolean', label:'Troponine elevee (> 3x normale)'},
  ],
  calculate: (values) => {
    let score = 0
    const age = values.age ?? 60; const hr = values.hr ?? 80; const sbp = values.sbp ?? 130
    const creat = values.creatinine ?? 1.0; const k = values.killip ?? 0

    if (age >= 90) score += 100; else if (age >= 80) score += 85; else if (age >= 70) score += 75
    else if (age >= 60) score += 50; else if (age >= 50) score += 30; else if (age >= 40) score += 15
    if (hr >= 150) score += 40; else if (hr >= 110) score += 25; else if (hr >= 90) score += 10
    if (sbp < 80) score += 58; else if (sbp < 100) score += 40; else if (sbp < 120) score += 15
    if (creat > 4.0) score += 50; else if (creat > 2.0) score += 35; else if (creat > 1.2) score += 20
    if (k === 3) score += 39; else if (k === 2) score += 30; else if (k === 1) score += 15
    if (values.cardiacArrest) score += 43
    if (values.stDeviation) score += 28
    if (values.highTroponin) score += 15

    return {
      value: score,
      label: score >= 140 ? 'Tres haut risque' : score >= 100 ? 'Haut risque' : score >= 80 ? 'Risque intermediaire' : 'Faible risque',
      severity: score >= 140 ? 'critical' : score >= 100 ? 'high' : score >= 80 ? 'moderate' : 'low',
      ranges: [
        {min:0, max:79, label:'Faible risque', severity:'low' as const, recommendation:"Traitement medical standard."},
        {min:80, max:99, label:'Risque intermediaire', severity:'moderate' as const, recommendation:"Coronarographie precoce. Traitement anti-thrombotique intensif."},
        {min:100, max:139, label:'Haut risque', severity:'high' as const, recommendation:"Coronarographie urgente (< 24h). Soins intensifs."},
        {min:140, max:300, label:'Tres haut risque', severity:'critical' as const, recommendation:"Coronarographie immediate. Assistance hemodynamique."},
      ],
    }
  },
  interpretation: 'Le score GRACE stratifie le risque de mortalite dans les SCA. Items : age, FC, PAS, creatinine, Killip, arret cardiaque, sus-ST, troponine. Guide la strategie invasive.',
  clinicalCommentary: `Le GRACE score est le score de reference pour les SCA (ESC recommande son calcul systematique).`,
  references: [{type:'pubmed', title:'Granger CB et al. Predictors of hospital mortality in the GRACE. Arch Intern Med 2003', pmid:'14504159'}],
}
export default graceScore
