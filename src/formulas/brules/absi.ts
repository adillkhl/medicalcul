import type { FormulaDefinition } from '../types'

const absi: FormulaDefinition = {
  id: `absi`, slug: `absi`,
  name: `ABSI (Score)`,
  specialty: `brules`, category: `Gravite`,
  description: `Abbreviated Burn Severity Index - probabilite de survie du patient brule`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:1,label:`Masculin`},{value:0,label:`Feminin`}]},
    {id:`age`,type:`radio`,label:`Age`,options:[{value:1,label:`< 40 ans`},{value:2,label:`40-60 ans`},{value:3,label:`61-80 ans`},{value:4,label:`> 80 ans`}]},
    {id:`surface`,type:`number`,label:`Surface brulee`,unit:`% SCB`},
    {id:`inhalation`,type:`radio`,label:`Inhalation`,options:[{value:0,label:`Non`},{value:1,label:`Oui (suspectee ou confirmee)`}]},
    {id:`profondeur`,type:`radio`,label:`Profondeur`,options:[{value:1,label:`2e degre superficiel`},{value:2,label:`2e degre profond / 3e degre`}]},
  ],
  calculate: (values) => {
    const s = (values.sexe??1)+(values.age??1)+(Math.min(Math.max(parseFloat(values.surface)||0,0),100)>20?1:0)+(values.inhalation??0)+(values.profondeur??1)
    const mort: Record<number,number> = {3:0.4,4:0.9,5:2.1,6:4.8,7:10,8:19,9:30,10:45,11:60,12:75,13:85,14:95}
    const sev = s>=9?'high':s>=6?'moderate':'low'
    const labels: Record<number,string> = {3:'Faible',5:'Modere',7:'Modere-eleve',9:'Eleve',11:'Tres eleve',13:'Extreme'}
    const riskVal = mort[s] !== undefined ? mort[s] : (s<3 ? 0.1 : 99)
    return {value:s, label:labels[Math.round(s/2)*2]||'Atteint', risk:riskVal, riskUnit:'% mortalite', severity: sev,
      ranges:[
        {min:0,max:5,label:'Faible risque de mortalite',severity:'low'},
        {min:6,max:8,label:'Risque modere',severity:'moderate'},
        {min:9,max:12,label:'Risque eleve',severity:'high'},
        {min:13,max:999,label:'Risque extreme',severity:'critical'},
      ]}
    
  },
  interpretation: `L'ABSI (Abbreviated Burn Severity Index) est un score pronostique chez le brule. Chaque item augmente le risque de mortalite.`,
  clinicalCommentary: `Score simple et rapide. Ne remplace pas le jugement clinique. Ideal pour le tri initial.`,
  references: [
    {type:`pubmed`,title:`Tobiasen J et al. J Trauma 1982`,pmid:`7108969`}
  ],
}
export default absi
