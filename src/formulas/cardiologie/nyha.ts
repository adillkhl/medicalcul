import type { FormulaDefinition } from '../types'

const nyha: FormulaDefinition = {
  id: 'nyha', slug: 'nyha',
  name: "NYHA — Classification insuffisance cardiaque",
  specialty: 'cardiologie', category: 'Insuffisance cardiaque',
  description: "Classification New York Heart Association de la gêne fonctionnelle dans l’insuffisance cardiaque",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [{id:'nyha_class',type:'radio',label:'Classe NYHA',options:[
    {value:1,label:"Classe I - Pas de limitation (activité habituelle normale)"},
    {value:2,label:"Classe II - Limitation légère (essoufflement pour effort important)"},
    {value:3,label:"Classe III - Limitation marquée (essoufflement pour effort léger)"},
    {value:4,label:"Classe IV - Symptômes au repos ou au moindre effort"},
  ]}],
  calculate: (values) => {
    const c = values.nyha_class ?? 1
    const labels: Record<number,string> = {1:'Classe I',2:'Classe II',3:'Classe III',4:'Classe IV'}
    return {
      value: c, label: labels[c]||'',
      severity: c >= 3 ? 'high' : c >= 2 ? 'moderate' : 'low',
      ranges: [
        {min:1,max:1,label:'Classe I',severity:'low',recommendation:"Traitement étiologique. IEC/ARA2, β-bloquant. Surveillance annuelle."},
        {min:2,max:2,label:'Classe II',severity:'moderate',recommendation:"Optimiser traitement débuté. Diurétiques si signes de congestion. Réadaptation cardiaque."},
        {min:3,max:3,label:'Classe III',severity:'high',recommendation:"IEC/ARA2 + βB + ARM + diurétique. CRT/Défibrillateur si FEVG ≤35% et QRS large."},
        {min:4,max:4,label:'Classe IV',severity:'critical',recommendation:"IC terminale. Envisager assistance VG, transplantation. Soins palliatifs si CI. Hospitalisation."},
      ],
    }
  },
  interpretation: `La **classification NYHA** est la classification fonctionnelle de référence de l’IC.

- **I** : asymptomatique
- **II** : gêne pour effort important
- **III** : gêne pour effort léger
- **IV** : symptômes de repos`,
  clinicalCommentary: `La NYHA est subjective. Toujours associer FEVG, BNP et test de marche pour une évaluation objective. Un patient NYHA II avec FEVG 30% a un pronostic plus grave qu’un NYHA II avec FEVG 55%.`,
  references: [{type:'pubmed',title:'NYHA Criteria Committee. Diseases of the Heart and Blood Vessels 1964'}],
}
export default nyha
