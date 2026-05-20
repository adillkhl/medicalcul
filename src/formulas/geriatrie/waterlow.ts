import type { FormulaDefinition } from '../types'

const waterlow: FormulaDefinition = {
  id: `waterlow`, slug: `waterlow`,
  name: `Waterlow (Echelle de risque d'escarre)`,
  specialty: `geriatrie`, category: `Evaluation du Risque`,
  description: `Evaluation du risque d'escarre (7 items: IMC, mobilite, incontinence, etc.)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`imc`,type:`radio`,label:`Indice de Masse Corporelle`,options:[
      {value:0,label:`IMC 20-24.9 (normal)`},
      {value:1,label:`IMC 25-29.9 (surpoids)`},
      {value:2,label:`IMC 30-40 (obesite)`},
      {value:3,label:`IMC < 20 (maigreur)`},
    ]},
    {id:`continence`,type:`radio`,label:`Continence`,options:[
      {value:0,label:`Continente / Sonde urinaire`},
      {value:1,label:`Incontinence urinaire occasionnelle`},
      {value:2,label:`Incontinence urinaire (sonde + selles)`},
      {value:3,label:`Incontinence fecale et urinaire`},
    ]},
    {id:`mobilite`,type:`radio`,label:`Mobilite`,options:[
      {value:0,label:`Libre / Aide leger`},
      {value:1,label:`Agite / Agite`},
      {value:2,label:`Apathique / Restreint`},
      {value:3,label:`Inerte / Traction / Immobilise`},
    ]},
    {id:`nutrition`,type:`radio`,label:`Etat nutritionnel`,options:[
      {value:0,label:`Bon - Mange tout`},
      {value:1,label:`Moyen - Mange 50-75%`},
      {value:2,label:`Faible - Mange < 50% / Liquides`},
      {value:3,label:`Tres faible - Anorexie / Jeune / Denutrition`},
    ]},
    {id:`poids_peau`,type:`radio`,label:`Poids / Aspect de la peau`,options:[
      {value:0,label:`Saine / Normale`},
      {value:1,label:`Fine / Seche / Oedeme`},
      {value:2,label:`L'etait du papier a cigarette / Cyanose`},
      {value:3,label:`Fissuree / Escarre stade 1`},
    ]},
    {id:`sexe_age`,type:`radio`,label:`Sexe et age`,options:[
      {value:0,label:`Homme < 50 / Femme < 60`},
      {value:1,label:`Homme 50-70 / Femme 60-70`},
      {value:2,label:`Homme > 70 / Femme > 70`},
      {value:3,label:`> 80`},
    ]},
    {id:`facteurs_risque`,type:`radio`,label:`Facteurs de risque specifiques`,options:[
      {value:0,label:`Aucun`},
      {value:4,label:`Diabete / AVC / Cardiaque / Insuffisance renale`},
      {value:5,label:`Cachexie / Cancer / Immuno / Chirurgie > 2h`},
      {value:8,label:`Insuffisance cardiaque / BPCO / Maladie neurologique`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.imc??0)+(values.continence??0)+(values.mobilite??0)+(values.nutrition??0)+(values.poids_peau??0)+(values.sexe_age??0)+(values.facteurs_risque??0)
    const sev = s >= 20 ? 'high' : s >= 15 ? 'moderate' : s >= 10 ? 'low' : 'low'
    return {value:s, label:s>=20?'Risque tres eleve':s>=15?'Risque eleve':s>=10?'Risque modere':'Risque faible', severity: sev,
      ranges:[
        {min:0,max:9,label:'Risque faible',severity:'low'},
        {min:10,max:14,label:'Risque modere - Surveillance',severity:'low'},
        {min:15,max:19,label:'Risque eleve - Matelas + Changements position',severity:'moderate'},
        {min:20,max:99,label:'Risque tres eleve - Prevention intensive',severity:'high'},
      ]}
  },
  interpretation: `L'echelle de Waterlow evalue le risque d'escarre. Plus le score est eleve, plus le risque est important. Un score ≥ 15 justifie des mesures de prevention specifiques (matelas adapte, mobilisation systematique, surveillance cutanee). Reevaluation hebdomadaire recommandee.`,
  clinicalCommentary: `Echelle plus complete que Braden, integre davantage de facteurs de risque (IMC, age, facteurs specifiques). Utilisee principalement au Royaume-Uni et en Europe. Attention: la ponderation elevee des facteurs de risque peut surestimer le risque chez les patients polypathologiques.`,
  references: [
    {type:`pubmed`,title:`Waterlow J. Care Sci Pract 1988`,pmid:`pubmed-link`},
    {type:`pubmed`,title:`Waterlow J. J Wound Care 2005`,pmid:`15704412`},
  ],
}
export default waterlow
