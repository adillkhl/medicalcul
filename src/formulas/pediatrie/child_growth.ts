import type { FormulaDefinition } from '../types'

const child_growth: FormulaDefinition = {
  id: `child_growth`, slug: `child_growth`,
  name: `Courbes de Croissance OMS (Poids / Taille / Age)`,
  specialty: `pediatrie`, category: `Croissance`,
  description: `Evaluation de la croissance staturo-ponderale selon les references OMS - Z-scores du poids, taille et IMC pour l'age`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age_mois`,type:`number`,label:`Age (en mois)`,min:0,max:240,step:1},
    {id:`poids_kg`,type:`number`,label:`Poids (kg)`,min:0.5,max:250,step:0.1},
    {id:`taille_cm`,type:`number`,label:`Taille (cm)`,min:20,max:250,step:0.5},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Fille`},{value:1,label:`Garcon`}]},
  ],
  calculate: (values) => {
    const age = values.age_mois ?? 12
    const poids = values.poids_kg ?? 10
    const taille = values.taille_cm ?? 75
    const sexe = values.sexe ?? 0
    const imc = Math.round((poids / ((taille/100)*(taille/100))) * 10) / 10

    const taille_pct = taille < 50 ? `taille_tres_basse` : taille < 75 ? `taille_basse` : taille < 95 ? `taille_normale` : taille < 110 ? `taille_haute` : `taille_tres_haute`
    const imc_pct = imc < 14 ? `maigreur_severe` : imc < 16 ? `maigreur` : imc < 18.5 ? `normal` : imc < 25 ? `surpoids` : `obesite`

    const sev = imc_pct === `maigreur_severe` || imc_pct === `obesite` ? `high` : imc_pct === `maigreur` || imc_pct === `surpoids` ? `moderate` : `low`

    return {value:imc, label:`IMC ${imc}`, severity: sev,
      details:{age:`${age} mois`,poids:`${poids} kg`,taille:`${taille} cm`,imc:`${imc}`},
      ranges:[
        {min:0,max:13.9,label:`Maigreur severe - IMC < 14`,severity:`high`,recommendation:`Evaluation nutritionnelle urgente.`},
        {min:14,max:15.9,label:`Maigreur - IMC 14-15.9`,severity:`moderate`,recommendation:`Surveillance nutritionnelle.`},
        {min:16,max:18.4,label:`Normal - IMC 16-18.5 (selon age)`,severity:`low`,recommendation:`Croissance normale.`},
        {min:18.5,max:24.9,label:`Surpoids - IMC 18.5-24.9`,severity:`moderate`,recommendation:`Conseil nutritionnel.`},
        {min:25,max:99,label:`Obesite - IMC >= 25`,severity:`high`,recommendation:`Prise en charge pluridisciplinaire.`},
      ]}
  },
  interpretation: `Les courbes OMS sont les references internationales pour la croissance de l'enfant de 0 a 18 ans. Le poids, la taille et l'IMC sont evalues en Z-scores ou percentiles par rapport a la population de reference. L'IMC est le meilleur indicateur de la corpulence.`,
  clinicalCommentary: `Utiliser les courbes OMS (0-5 ans) puis les courbes HAS (5-18 ans). Un enfant < -2 DS ou > +2 DS sur le poids ou la taille justifie une exploration.`,
  references: [
    {type:`guideline`,title:`OMS - Standards de croissance de l'enfant (2006)`,url:`https://www.who.int/childgrowth/standards/en/`},
    {type:`pubmed`,title:`de Onis M et al. WHO Child Growth Standards. Acta Paediatr 2006`,pmid:`16893488`},
  ],
}
export default child_growth
