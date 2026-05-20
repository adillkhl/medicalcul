import type { FormulaDefinition } from '../types'

const killip: FormulaDefinition = {
  id: 'killip', slug: 'killip',
  name: "Killip — Classification clinique IDM",
  specialty: 'cardiologie', category: 'Infarctus',
  description: "Classification de la sévérité de l’insuffisance cardiaque au stade aigu d’un infarctus du myocarde",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [{id:'killip_class',type:'radio',label:'Classe Killip',options:[
    {value:1,label:"Classe I - Pas de signe d’insuffisance cardiaque"},
    {value:2,label:"Classe II - Râles crépitants < 50%, B3, TVC"},
    {value:3,label:"Classe III - OAP franc (râles > 50%)"},
    {value:4,label:"Classe IV - Choc cardiogénique (TAS<90, marbrures, anurie)"},
  ]}],
  calculate: (values) => {
    const c = values.killip_class ?? 1
    const labels: Record<number,string> = {1:'Classe I',2:'Classe II',3:'Classe III',4:'Classe IV'}
    const mort: Record<number,number> = {1:6,2:17,3:38,4:67}
    return {
      value: c, label: labels[c]||'', risk: mort[c]||0, riskUnit: '% mortalité hospitalière',
      severity: c >= 3 ? 'high' : c >= 2 ? 'moderate' : 'low',
      ranges: [
        {min:1,max:1,label:'Classe I',severity:'low' as const,recommendation:"Pas d’IC. Surveillance scopée. IEC + β-bloquant. Coronarographie selon risque."},
        {min:2,max:2,label:'Classe II',severity:'moderate' as const,recommendation:"Diurétiques si congestion. Surveillance ICU. Coronarographie programmée."},
        {min:3,max:3,label:'Classe III - OAP',severity:'high' as const,recommendation:"Oxygène, diurétiques IV, dérivés nitrés. Coronarographie urgente. VNI si nécessaire."},
        {min:4,max:4,label:'Classe IV - Choc cardiogénique',severity:'critical' as const,recommendation:"URGENCE VITALE. Inotropes (dobutamine). Assistance (BIA/ECMO). Coronarographie immédiate. Réanimation hémodynamique."},
      ],
    }
  },
  interpretation: `La **classification de Killip** gradue la gravité de l’IC dans l’IDM.

- **Classe I** : pas d’IC (mort ~6%)
- **Classe II** : IC légère (mort ~17%)
- **Classe III** : OAP (mort ~38%)
- **Classe IV** : choc cardiogénique (mort ~67%)

La mortalité augmente avec chaque classe quel que soit le traitement.`,
  clinicalCommentary: `La classification de Killip reste le meilleur prédicteur de mortalité à court terme dans l’IDM. Coter à l’admission. L’échocardiographie doit être systématique pour éliminer une complication mécanique (CIV, rupture pilier mitral).`,
  references: [{type:'pubmed',title:'Killip T, Kimball JT. Am J Cardiol 1967',pmid:'6059583'}],
}
export default killip
