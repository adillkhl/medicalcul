import type { FormulaDefinition } from '../types'

const calorie_besoin: FormulaDefinition = {
  id: `calorie_besoin`, slug: `calorie_besoin`,
  name: `Besoin Calorique (Harris-Benedict)`,
  specialty: `nutrition`, category: `Metabolisme`,
  description: `Calcul du metabolisme de base selon la formule de Harris-Benedict, avec facteurs d'activite et de stress`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[
      {value:0,label:`Femme`},{value:1,label:`Homme`},
    ]},
    {id:`poids`,type:`number`,label:`Poids (kg)`,unit:`kg`,min:0,max:500,step:0.1,placeholder:`Ex: 70`},
    {id:`taille`,type:`number`,label:`Taille (cm)`,unit:`cm`,min:0,max:250,step:0.5,placeholder:`Ex: 170`},
    {id:`age`,type:`number`,label:`Age (ans)`,unit:`ans`,min:0,max:120,step:1,placeholder:`Ex: 30`},
    {id:`activite`,type:`radio`,label:`Niveau d'activite physique`,options:[
      {value:1.2,label:`Sedentaire (peu ou pas d'exercice)`},
      {value:1.375,label:`Activite legere (1-3 jours/sem)`},
      {value:1.55,label:`Activite moderee (3-5 jours/sem)`},
      {value:1.725,label:`Activite intense (6-7 jours/sem)`},
      {value:1.9,label:`Activite tres intense (sportif de haut niveau)`},
    ]},
    {id:`stress`,type:`radio`,label:`Facteur de stress (pathologie)`,options:[
      {value:1,label:`Aucun`},
      {value:1.2,label:`Post-operatoire / Infection moderee`},
      {value:1.5,label:`Sepsis / Polytraumatisme`},
      {value:1.8,label:`Brulure severe (> 40% SC)`},
    ]},
  ],
  calculate: (values) => {
    const poids = parseFloat(values.poids||0)
    const taille = parseFloat(values.taille||0)
    const age = parseFloat(values.age||0)
    const homme = parseInt(values.sexe||0)
    const act = parseFloat(values.activite||1.2)
    const stress = parseFloat(values.stress||1)
    
    let mb = 0
    if (homme) {
      mb = 88.362 + (13.397 * poids) + (4.799 * taille) - (5.677 * age)
    } else {
      mb = 447.593 + (9.247 * poids) + (3.098 * taille) - (4.330 * age)
    }
    
    const besoin = Math.round(mb * act * stress)
    
    return {value:besoin, unit:`kcal/j`, label:`Besoin calorique total: ${besoin} kcal/j`, severity:`low`,
      details:{
        metabolisme_base: Math.round(mb),
        facteur_activite: act,
        facteur_stress: stress,
      },
      ranges:[
        {min:0,max:9999,label:'Besoin calorique estime (depense totale)',severity:'low'},
      ]}
  },
  interpretation: `Le metabolisme de base (MB) represente les depenses energetiques au repos. Il est calcule par la formule de Harris-Benedict (revisee par Mifflin-St Jeor en 1990):<br/><br/>Homme: MB = 88.362 + (13.397 × P) + (4.799 × T) - (5.677 × A)<br/>Femme: MB = 447.593 + (9.247 × P) + (3.098 × T) - (4.330 × A)<br/><br/>Besoin total = MB × facteur d'activite × facteur de stress`,
  clinicalCommentary: `La formule de Harris-Benedict (revisee) tend a surestimer le metabolisme de base de 5-10% par rapport a la calorimetrie indirecte. La formule de Mifflin-St Jeor (1990) est plus precise pour la population générale. Pour les patients obeses, utiliser le poids ideal ou ajuste plutot que le poids reel pour eviter de surestimer les besoins.`,
  references: [
    {type:`pubmed`,title:`Mifflin MD et al. Am J Clin Nutr 1990`,pmid:`2305711`},
    {type:`pubmed`,title:`Harris JA, Benedict FG. Proc Natl Acad Sci USA 1918`,pmid:`16576330`},
  ],
}
export default calorie_besoin
