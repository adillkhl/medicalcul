import type { FormulaDefinition } from '../types'

const must: FormulaDefinition = {
  id: `must`, slug: `must`,
  name: `MUST (Malnutrition Universal Screening Tool)`,
  specialty: `nutrition`, category: `Depistage`,
  description: `Outil universel de depistage de la denutrition: IMC, perte de poids, maladie aigue`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`imc`,type:`radio`,label:`IMC (kg/m²)`,options:[
      {value:0,label:`IMC ≥ 20`},
      {value:1,label:`IMC 18.5-20`},
      {value:2,label:`IMC < 18.5`},
    ]},
    {id:`perte_poids`,type:`radio`,label:`Perte de poids involontaire < 3-6 mois`,options:[
      {value:0,label:`< 5%`},
      {value:1,label:`5-10%`},
      {value:2,label:`> 10%`},
    ]},
    {id:`maladie_aigue`,type:`radio`,label:`Maladie aigue avec arret des apports alimentaires > 5 jours`,options:[
      {value:0,label:`Non`},
      {value:2,label:`Oui (ou probable)`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.imc??0)+(values.perte_poids??0)+(values.maladie_aigue??0)
    return {value:s, label:s===0?'Risque faible':s===1?'Risque modere':'Risque eleve', severity: s===0?'low':s===1?'moderate':'high',
      ranges:[
        {min:0,max:0,label:'Risque faible - Soins de routine',severity:'low'},
        {min:1,max:1,label:'Risque modere - Surveillance alimentaire 3j',severity:'moderate'},
        {min:2,max:6,label:'Risque eleve - Prise en charge nutritionnelle',severity:'high'},
      ]}
  },
  interpretation: `Le MUST est un outil de depistage de la denutrition valide en soins aigus et communautaires:<br/>• Score 0: Risque faible. Soins de routine. Refaire le screening 1x/sem (hopital) ou 1x/mois (domicile)<br/>• Score 1: Risque modere. Surveiller les apports alimentaires 3 jours. Si apports insuffisants -> score eleve<br/>• Score ≥ 2: Risque eleve. Referer au dieteticien ou equipe nutritionnelle. Implementer un plan de soins nutritionnels`,
  clinicalCommentary: `Le MUST est largement utilise au Royaume-Uni et recommande par la BAPEN. Il ne necessite pas de mesure de l'albumine. Simple et rapide (3-5 min). Valide pour tous les adultes (pas de limite d'age). Le MUST a une bonne valeur predictive: un score ≥ 2 est associe a une duree de sejour prolongee et a une mortalite accrue.`,
  references: [
    {type:`pubmed`,title:`Elia M. BAPEN 2003`,pmid:`pubmed-link`},
    {type:`pubmed`,title:`Stratton RJ et al. Clin Nutr 2004`,pmid:`15380902`},
  ],
}
export default must
