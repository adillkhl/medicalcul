import type { FormulaDefinition } from '../types'

const framingham: FormulaDefinition = {
  id: 'framingham',
  slug: 'framingham',
  name: 'Framingham — Risque cardiovasculaire',
  specialty: 'cardiologie',
  category: 'Risque CV',
  description: "Score de Framingham de risque cardiovasculaire à 10 ans (infarctus, AVC, décès CV)",
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {id:'age', type:'number', label:'Âge', unit:'ans', min:18, max:100, step:1, placeholder:'45'},
    {id:'sex', type:'radio', label:'Sexe', options:[{value:0,label:'Femme'},{value:1,label:'Homme'}]},
    {id:'totalChol', type:'number', label:'Cholestérol total', unit:'mg/dL', min:100, max:400, step:1, placeholder:'220'},
    {id:'hdlChol', type:'number', label:'HDL-Cholestérol', unit:'mg/dL', min:10, max:100, step:1, placeholder:'45'},
    {id:'sbp', type:'number', label:'Pression systolique', unit:'mmHg', min:80, max:250, step:1, placeholder:'130'},
    {id:'treated', type:'boolean', label:'Hypertension traitée'},
    {id:'smoker', type:'boolean', label:'Tabagisme actif'},
    {id:'diabetes', type:'boolean', label:'Diabète'},
  ],
  calculate: (values) => {
    const age = values.age ?? 50; const male = values.sex === 1
    const chol = values.totalChol ?? 200; const hdl = values.hdlChol ?? 50
    const sbp = values.sbp ?? 130; const treated = !!values.treated
    const smoke = !!values.smoker; const dm = !!values.diabetes

    let score = 0
    if (male) { if (age >= 70) score += 11; else if (age >= 60) score += 8; else if (age >= 50) score += 5; else if (age >= 40) score += 2 }
    else { if (age >= 70) score += 13; else if (age >= 60) score += 9; else if (age >= 50) score += 6; else if (age >= 40) score += 2 }
    if (chol >= 280) score += 2; else if (chol >= 240) score += 1
    if (hdl < 40) score += 2; else if (hdl < 50) score += 1
    if (treated) { if (sbp >= 160) score += 3; else if (sbp >= 140) score += 2; else if (sbp >= 130) score += 1 }
    else { if (sbp >= 160) score += 2; else if (sbp >= 140) score += 1 }
    if (smoke) score += male ? 4 : 3
    if (dm) score += male ? 3 : 4

    const risk = score >= 20 ? 30 : score >= 15 ? 15 : score >= 10 ? 8 : score >= 5 ? 3 : 1
    return {
      value: score,
      label: risk >= 20 ? 'Haut risque' : risk >= 10 ? 'Risque intermediaire' : 'Faible risque',
      risk, riskUnit: '% risque CV a 10 ans',
      severity: risk >= 20 ? 'high' : risk >= 10 ? 'moderate' : 'low',
      ranges: [
        {min:0, max:5, label:'Faible risque', severity:'low' as const, recommendation:"Conseils hygiene-dietetiques. Reevaluation dans 5 ans."},
        {min:6, max:10, label:'Risque modere', severity:'moderate' as const, recommendation:"Prise en charge des facteurs de risque. Statine si LDL > 1.90 ou diabete."},
        {min:11, max:14, label:'Risque eleve', severity:'high' as const, recommendation:"Statine + antiagregant si approprié. Controle strict des FDR."},
        {min:15, max:30, label:'Risque tres eleve', severity:'critical' as const, recommendation:"Statine forte dose + antiagregant. Objectif LDL < 0.70."},
      ],
    }
  },
  interpretation: 'Le **score de Framingham** evalue le risque cardiovasculaire a 10 ans. Facteurs : age, sexe, cholesterol total, HDL, PAS, HTA traitee, tabac, diabete.',
  clinicalCommentary: `Le score de Framingham tend a sous-estimer le risque chez les jeunes et surestimer chez les ages. Il a ete largement remplace par SCORE2 (ESC 2021).`,
  references: [{type:'pubmed', title:'Wilson PWF et al. Prediction of CHD using risk factor categories. Circulation 1998', pmid:'9741203'}],
}
export default framingham
