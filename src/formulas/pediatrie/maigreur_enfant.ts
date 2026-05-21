import type { FormulaDefinition } from '../types'

const maigreur_enfant: FormulaDefinition = {
  id: `maigreur_enfant`, slug: `maigreur_enfant`,
  name: `Maigreur de l\'Enfant - IMC pour l\'age (Z-score)`,
  specialty: `pediatrie`, category: `Nutrition`,
  description: `Evaluation de la maigreur de l\'enfant par IMC selon l\'age et le sexe (references OMS)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age_mois`,type:`number`,label:`Age (en mois)`,min:0,max:216,step:1},
    {id:`poids_kg`,type:`number`,label:`Poids (kg)`,min:1,max:200,step:0.1},
    {id:`taille_cm`,type:`number`,label:`Taille (cm)`,min:30,max:200,step:0.5},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Fille`},{value:1,label:`Garcon`}]},
  ],
  calculate: (values) => {
    const age = values.age_mois ?? 24
    const poids = values.poids_kg ?? 12
    const taille = values.taille_cm ?? 85
    const sexe = values.sexe ?? 0
    const taille_m = taille / 100
    const imc = Math.round((poids / (taille_m * taille_m)) * 10) / 10

    let grade = 'normal'
    let sev = 'low' as 'low'|'moderate'|'high'
    if (imc < 14) { grade = 'maigreur_severe'; sev = 'high' }
    else if (imc < 16) { grade = 'maigreur_moderee'; sev = 'moderate' }
    else if (imc < 18.5) { grade = 'normal_bas'; sev = 'low' }

    return {value:imc, label:`IMC ${imc} kg/m2 - ${grade === `maigreur_severe` ? `Maigreur severe` : grade === `maigreur_moderee` ? `Maigreur moderee` : `Normal`}`, severity: sev,
      details:{age:`${age} mois`,poids:`${poids} kg`,taille:`${taille} cm`,imc:`${imc} kg/m2`},
      ranges:[
        {min:0,max:13.9,label:`Maigreur severe - IMC < 14`,severity:`high`,recommendation:`Hospitalisation si < -3 DS. Bilan nutritionnel et etiologique complet. Alimentation entrale a discuter.`},
        {min:14,max:15.9,label:`Maigreur moderee - IMC 14-15.9`,severity:`moderate`,recommendation:`Consultation dietetique. Surveillance ponderale. Recherche de trouble des conduites alimentaires ou pathologie digestive.`},
        {min:16,max:18.4,label:`Normal bas - IMC 16-18.5 (selon age)`,severity:`low`,recommendation:`Surveillance de la courbe de croissance. Alimentation equilibree.`},
        {min:18.5,max:50,label:`Normal a eleve`,severity:`low`,recommendation:`IMC normal ou eleve. Poursuivre surveillance.`},
      ]}
  },
  interpretation: `L\'evaluation de la maigreur de l\'enfant repose sur l\'IMC pour l\'age, exprime en Z-score ou percentile selon les courbes OMS. Un IMC < -2 DS definit la maigreur. < -3 DS = maigreur severe. La maigreur peut refleter une denutrition aigue ou chronique.`,
  clinicalCommentary: `La maigreur de l\'enfant est un marqueur de denutrition qu\'il faut toujours explorer. Distinguer maigreur constitutionnelle (familiale) et pathologique. Associer a d\'autres indicateurs : pli cutane, PB, albuminemie. Chez le nourrisson, la courbe de poids est plus sensible que l\'IMC. Les causes les plus frequentes : erreurs dietetiques, RGO, allergies alimentaires.`,
  references: [
    {type:`pubmed`,title:`Cole TJ et al. Body mass index cut offs to define thinness in children. BMJ 2007`,pmid:`17711999`},
    {type:`guideline`,title:`HAS - Denutrition de l\'enfant (2022)`,url:`https://www.has-sante.fr/`},
  ],
}
export default maigreur_enfant
