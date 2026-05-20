import type { FormulaDefinition } from '../types'

const mini_nutritionnel: FormulaDefinition = {
  id: `mini_nutritionnel`, slug: `mini_nutritionnel`,
  name: `MNA Short Form (Mini Nutritional Assessment)`,
  specialty: `geriatrie`, category: `Evaluation Nutritionnelle`,
  description: `Depistage du risque de denutrition chez le sujet age (6 items)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`appetit`,type:`radio`,label:`Diminution de la prise alimentaire (appetit, difficulte mastication/digestion)`,options:[
      {value:0,label:`Anorexie severe (peu mange depuis > 1 mois)`},
      {value:1,label:`Anorexie moderee`},
      {value:2,label:`Pas de probleme`},
    ]},
    {id:`poids`,type:`radio`,label:`Perte de poids recente (< 3 mois)`,options:[
      {value:0,label:`Perte > 3 kg`},
      {value:1,label:`Perte entre 1 et 3 kg`},
      {value:2,label:`Pas de perte`},
      {value:3,label:`Ne sait pas`},
    ]},
    {id:`mobilite`,type:`radio`,label:`Mobilite`,options:[
      {value:0,label:`Alite ou fauteuil`},
      {value:1,label:`Se leve mais ne sort pas`},
      {value:2,label:`Sort`},
    ]},
    {id:`stress`,type:`radio`,label:`Stress psychologique ou maladie aigue dans les 3 derniers mois`,options:[
      {value:0,label:`Oui`},
      {value:2,label:`Non`},
    ]},
    {id:`neuro`,type:`radio`,label:`Problemes neuropsychologiques`,options:[
      {value:0,label:`Demence ou depression severe`},
      {value:1,label:`Demence ou depression moderee`},
      {value:2,label:`Pas de probleme`},
    ]},
    {id:`imc`,type:`radio`,label:`Indice de Masse Corporelle (IMC)`,options:[
      {value:0,label:`IMC < 19`},
      {value:1,label:`19 <= IMC < 21`},
      {value:2,label:`21 <= IMC < 23`},
      {value:3,label:`IMC >= 23`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.appetit??2)+(values.poids??2)+(values.mobilite??2)+(values.stress??2)+(values.neuro??2)+(values.imc??3)
    return {value:s, label:s>=12?'Etat nutritionnel normal':s>=8?'Risque de denutrition':'Denutrition confirmee', severity: s>=12?'low':s>=8?'moderate':'high',
      ranges:[
        {min:12,max:14,label:'Etat nutritionnel normal',severity:'low'},
        {min:8,max:11,label:'Risque de denutrition',severity:'moderate'},
        {min:0,max:7,label:'Denutrition confirmee',severity:'high'},
      ]}
  },
  interpretation: `Le MNA Short Form est un outil de depistage de la denutrition chez le sujet age. Score sur 14 points. Un score ≥ 12 est normal, 8-11 indique un risque de denutrition, ≤ 7 confirme la denutrition. Un score ≤ 11 justifie la réalisation du MNA complet (18 items).`,
  clinicalCommentary: `Le MNA est l'outil de reference pour le depistage nutritionnel en geriatrie. Il est valide chez les patients de plus de 65 ans. En cas de score ≤ 11, completer par le MNA complet et evaluer les apports alimentaires. La denutrition est un facteur de risque independant de mortalite chez le sujet age.`,
  references: [
    {type:`pubmed`,title:`Vellas B et al. Nutrition 1999`,pmid:`10418105`},
    {type:`pubmed`,title:`Rubenstein LZ et al. J Am Geriatr Soc 2001`,pmid:`11280716`},
  ],
}
export default mini_nutritionnel
