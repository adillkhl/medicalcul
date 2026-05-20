import type { FormulaDefinition } from '../types'

const heartScore: FormulaDefinition = {
  id: 'heart', slug: 'heart',
  name: "HEART — Risque coronarien aux urgences",
  specialty: 'cardiologie', category: 'Douleur thoracique',
  description: "Score de risque de syndrome coronarien aigu chez les patients se présentant aux urgences pour douleur thoracique",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    {id:'history',type:'radio',label:'H - Histoire clinique',options:[
      {value:0,label:'Histoire non spécifique'},{value:1,label:'Histoire modérément suggestive'},{value:2,label:'Très suggestive de SCA'},
    ]},
    {id:'ecg',type:'radio',label:'E - ECG',options:[
      {value:0,label:'Normal'},{value:1,label:'Non spécifique (trouble repolarisation)'},{value:2,label:'Sus-décalage ST significatif'},
    ]},
    {id:'age',type:'radio',label:'A - Âge',options:[
      {value:0,label:'< 45 ans'},{value:1,label:'45-64 ans'},{value:2,label:'≥ 65 ans'},
    ]},
    {id:'riskFactors',type:'radio',label:'R - Facteurs de risque CV',options:[
      {value:0,label:'Aucun facteur connu'},{value:1,label:'1-2 facteurs'},{value:2,label:'≥ 3 facteurs ou ATCD d’athérome'},
    ]},
    {id:'troponin',type:'radio',label:'T - Troponine',options:[
      {value:0,label:'Normale (< 2x normale)'},{value:1,label:'1-2x la normale'},{value:2,label:'≥ 3x la normale'},
    ]},
  ],
  calculate: (values) => {
    const score = [values.history,values.ecg,values.age,values.riskFactors,values.troponin].reduce((a,b) => a + (b??0), 0)
    return {
      value: score,
      label: score >= 7 ? 'Haut risque (SCA probable)' : score >= 4 ? 'Risque intermédiaire' : 'Faible risque',
      risk: score >= 7 ? 72 : score >= 4 ? 17 : 2,
      riskUnit: '% risque de MACE à 6 semaines',
      severity: score >= 7 ? 'high' : score >= 4 ? 'moderate' : 'low',
      ranges: [
        {min:0,max:3,label:'0-3 - Faible risque (< 2% MACE)',severity:'low',recommendation:"Sortie possible si troponines normales. Consultation cardiologie sous 72h. Pas d’exploration invasive urgente."},
        {min:4,max:6,label:'4-6 - Risque intermédiaire (~17% MACE)',severity:'moderate',recommendation:"Hospitalisation. Surveillance scopée. Dosage troponines sériées. Épreuve d’effort ou coroscanner avant sortie."},
        {min:7,max:10,label:'7-10 - Haut risque (~72% MACE)',severity:'critical',recommendation:"Hospitalisation en soins intensifs. Coronarographie dans les 72h. Traitement médical intensif. Recherche ischémie."},
      ],
    }
  },
  interpretation: `Le **score HEART** est validé aux urgences pour stratifier le risque de SCA.

**5 items** (0-2 points chacun) : H-Histoire, E-ECG, A-Age, R-Risk factors, T-Troponin

**Seuils :** 0-3 = faible, 4-6 = intermédiaire, 7-10 = élevé.

Un score ≤ 3 + troponines normales = sortie possible en toute sécurité.`,
  clinicalCommentary: `Le HEART score est l’outil le plus utilisé aux urgences pour la douleur thoracique. Sa force : il est simple et validé (> 100 000 patients). Attention : le HEART score n’est pas valable si l’ECG montre un sus-décalage ST (SCA ST+ confirmé). Dans ce cas, le diagnostic est déjà posé.`,
  references: [{type:'pubmed',title:'Six AJ et al. The HEART score for chest pain. Neth Heart J 2008',pmid:'18665288'}],
}
export default heartScore
