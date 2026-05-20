import type { FormulaDefinition } from '../types'

const nrs_2002: FormulaDefinition = {
  id: `nrs_2002`, slug: `nrs_2002`,
  name: `NRS-2002 (Nutritional Risk Screening)`,
  specialty: `nutrition`, category: `Depistage`,
  description: `Depistage du risque nutritionnel en milieu hospitalier: evaluation initiale et score final (IMC, perte poids, apports, severite maladie)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`imc_inf`,type:`boolean`,label:`IMC < 20.5 ?`,weight:1},
    {id:`perte_poids_3mois`,type:`boolean`,label:`Perte de poids involontaire > 5% en 3 mois ?`,weight:1},
    {id:`apports_7j`,type:`boolean`,label:`Reduction des apports alimentaires > 50% en 1 semaine ?`,weight:1},
    {id:`perte_poids_2mois`,type:`radio`,label:`Perte de poids severe`,options:[
      {value:0,label:`Perte < 5% en 2 mois OU apports reduits 25-50%`},
      {value:1,label:`Perte > 5% en 2 mois OU apports < 25%`},
    ]},
    {id:`nutrition_impairee`,type:`boolean`,label:`Nutrition impairee (IMC 18.5-20.5 et/ou apports reduits)`,weight:1},
    {id:`severite_maladie`,type:`radio`,label:`Severite de la maladie (stress metabolique)`,options:[
      {value:0,label:`Absent - Patient en bon etat general`},
      {value:1,label:`Modere - Fracture, chir. programmee, cancer, IRC, diabete`},
      {value:2,label:`Severe - Chirurgie majeure, AVC, pneumonie severe`},
      {value:3,label:`Tres severe - Sepsis, polytraumatisme, brulure, reanimation`},
    ]},
    {id:`age_sup70`,type:`boolean`,label:`Age ≥ 70 ans (ajuste +1 si score ≥ 3)`,weight:1},
  ],
  calculate: (values) => {
    // Initial screening
    const q1 = values.imc_inf?1:0
    const q2 = values.perte_poids_3mois?1:0
    const q3 = values.apports_7j?1:0
    
    // Si aucun oui, score = 0
    // Si au moins 1 oui, faire le scoring complet
    const screening = q1+q2+q3
    
    if (screening === 0) {
      return {value:0, label:'Risque nutritionnel faible - Pas de scoring necessaire', severity:'low',
        ranges:[
          {min:0,max:0,label:'Pas de risque nutritionnel',severity:'low'},
          {min:1,max:7,label:'Risque nutritionnel',severity:'moderate'},
        ]}
    }
    
    // Scoring complet
    const perte = parseInt(values.perte_poids_2mois||0)
    const nutrition = values.nutrition_impairee?1:0
    const severite = parseInt(values.severite_maladie||0)
    const age70 = values.age_sup70?1:0
    
    const score_nutrition = (q1+q2+q3) + perte + nutrition
    const total = score_nutrition + severite
    const age_ajust = (total >= 3 && age70) ? 1 : 0
    const final_score = total + age_ajust
    
    return {value:final_score, label:final_score < 3 ? 'Pas de risque nutritionnel' : 'Risque nutritionnel eleve', severity: final_score < 3 ? 'low' : 'high',
      details:{ score_nutrition: score_nutrition, score_severite: severite, ajustement_age: age_ajust },
      ranges:[
        {min:0,max:2,label:'Pas de risque nutritionnel - Surveillance hebdomadaire',severity:'low'},
        {min:3,max:7,label:'Risque eleve - Plan de soins nutritionnels',severity:'high'},
      ]}
  },
  interpretation: `Le NRS-2002 comporte 2 etapes:<br/><br/>Etape 1 (screening initial): 3 questions Oui/Non<br/>• IMC < 20.5 ?<br/>• Perte de poids > 5% en 3 mois ?<br/>• Apports alimentaires reduits > 50% en 1 semaine ?<br/>Si OUI a au moins 1 question → Etape 2<br/><br/>Etape 2 (scoring):<br/>• Score nutritionnel (0-3)<br/>• Score de severite de la maladie (0-3)<br/>• Ajustement age: +1 si ≥ 70 ans ET score ≥ 3<br/>Score total ≥ 3 = risque nutritionnel eleve`,
  clinicalCommentary: `Le NRS-2002 est recommande par l'ESPEN pour le depistage nutritionnel hospitalier. Il est valide en geriatrie, oncologie, chirurgie. Un score ≥ 3 est associe a une augmentation du risque de complications post-operatoires et de mortalite. A realiser a l'admission et idealement 1x/semaine.`,
  references: [
    {type:`pubmed`,title:`Kondrup J et al. Clin Nutr 2003`,pmid:`12505347`},
    {type:`pubmed`,title:`Kondrup J et al. Nutr Hosp 2002`,pmid:`12492029`},
  ],
}
export default nrs_2002
