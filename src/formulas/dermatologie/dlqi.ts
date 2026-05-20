import type { FormulaDefinition } from '../types'

const dlqi: FormulaDefinition = {
  id: `dlqi`, slug: `dlqi`,
  name: `DLQI (Questionnaire)`,
  specialty: `dermatologie`, category: `Qualite de vie`,
  description: `Dermatology Life Quality Index - impact des maladies de peau sur la qualite de vie (10 questions)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`prurit`,type:`radio`,label:`Prurit / douleur / brulure cutanee`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres fortement`}]},
    {id:`gene`,type:`radio`,label:`Gene / sentiment d'embarras`,options:[{value:0,label:`Non`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres`}]},
    {id:`courses`,type:`radio`,label:`Courses / travail / ecole`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Beaucoup`}]},
    {id:`vetements`,type:`radio`,label:`Choix des vetements`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres fortement`}]},
    {id:`social`,type:`radio`,label:`Vie sociale / loisirs`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres fortement`}]},
    {id:`sport`,type:`radio`,label:`Sport / activites physiques`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres fortement`}]},
    {id:`travail_semaine`,type:`radio`,label:`Travail / etudes (semaine passee)`,options:[{value:0,label:`Oui`},{value:1,label:`Non - empeche`}]},
    {id:`relation`,type:`radio`,label:`Relation avec le partenaire`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres fortement`}]},
    {id:`sexualite`,type:`radio`,label:`Sexualite`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres fortement`}]},
    {id:`traitement`,type:`radio`,label:`Traitement (contrainte, temps)`,options:[{value:0,label:`Pas du tout`},{value:1,label:`Un peu`},{value:2,label:`Beaucoup`},{value:3,label:`Tres fortement`}]},
  ],
  calculate: (values) => {
    const scores = [values.prurit??0,values.gene??0,values.courses??0,values.vetements??0,values.social??0,values.sport??0,values.travail_semaine??0,values.relation??0,values.sexualite??0,values.traitement??0]
    const s = scores.reduce((a,b) => a + (b === true ? 1 : parseInt(b)||0), 0)
    const sev = s > 20 ? 'high' : s > 10 ? 'moderate' : s > 5 ? 'low' : 'low'
    const label = s <= 5 ? 'Impact nul a faible' : s <= 10 ? 'Impact modere' : s <= 20 ? 'Impact severe' : 'Impact tres severe'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:5,label:'Aucun ou faible impact',severity:'low'},
        {min:6,max:10,label:'Impact modere sur la qualite de vie',severity:'low'},
        {min:11,max:20,label:'Impact severe',severity:'moderate'},
        {min:21,max:30,label:'Impact tres severe',severity:'high'},
      ]}
  },
  interpretation: `Le DLQI est le questionnaire de qualite de vie le plus utilise en dermatologie (10 items, score 0-30). Un score > 10 indique un impact significatif.`,
  clinicalCommentary: `Valide dans de nombreuses langues et dermatoses. Utilise pour evaluer l'efficacite des traitements. Un changement de 4 points est cliniquement significatif.`,
  references: [
    {type:`pubmed`,title:`Finlay AY, Khan GK. Clin Exp Dermatol 1994`,pmid:`8033381`}
  ],
}
export default dlqi
