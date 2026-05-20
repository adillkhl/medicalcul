import type { FormulaDefinition } from '../types'

const taille_enfant: FormulaDefinition = {
  id: `taille_enfant`, slug: `taille_enfant`,
  name: `Estimation de la Taille de l'Enfant (Formules)`,
  specialty: `pediatrie`, category: `Croissance`,
  description: `Estimation de la taille cible et prediction de la taille adulte a partir des tailles parentales et de la taille actuelle de l'enfant`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`sexe`,type:`radio`,label:`Sexe de l'enfant`,options:[{value:0,label:`Fille`},{value:1,label:`Garcon`}]},
    {id:`taille_pere_cm`,type:`number`,label:`Taille du pere (cm)`,min:130,max:220,step:0.5},
    {id:`taille_mere_cm`,type:`number`,label:`Taille de la mere (cm)`,min:120,max:210,step:0.5},
    {id:`age_mois`,type:`number`,label:`Age de l'enfant en mois`,min:0,max:216,step:1},
    {id:`taille_enfant_cm`,type:`number`,label:`Taille actuelle de l'enfant (cm)`,min:20,max:200,step:0.5},
  ],
  calculate: (values) => {
    const sexe = values.sexe ?? 0
    const taillePere = values.taille_pere_cm ?? 175
    const tailleMere = values.taille_mere_cm ?? 163
    const age = values.age_mois ?? 48
    const tailleEnfant = values.taille_enfant_cm ?? 100

    // Taille cible adulte (formule de Tanner)
    let tailleCible
    if (sexe === 1) {
      tailleCible = (taillePere + tailleMere + 13) / 2
    } else {
      tailleCible = (taillePere + tailleMere - 13) / 2
    }

    // Estimation taille a l'age adulte selon la taille actuelle (methode simplifiee)
    const age_ans = age / 12
    let pct_taille_adulte
    if (sexe === 1) {
      if (age_ans < 2) pct_taille_adulte = 49.5
      else if (age_ans < 3) pct_taille_adulte = 53.5
      else if (age_ans < 4) pct_taille_adulte = 57.5
      else if (age_ans < 6) pct_taille_adulte = 64
      else if (age_ans < 8) pct_taille_adulte = 71
      else if (age_ans < 10) pct_taille_adulte = 78
      else if (age_ans < 12) pct_taille_adulte = 83
      else if (age_ans < 14) pct_taille_adulte = 91
      else pct_taille_adulte = 96.5
    } else {
      if (age_ans < 2) pct_taille_adulte = 49.5
      else if (age_ans < 3) pct_taille_adulte = 53.5
      else if (age_ans < 4) pct_taille_adulte = 57
      else if (age_ans < 6) pct_taille_adulte = 63
      else if (age_ans < 8) pct_taille_adulte = 70
      else if (age_ans < 10) pct_taille_adulte = 77
      else if (age_ans < 12) pct_taille_adulte = 83
      else pct_taille_adulte = 90
    }
    const tailleAdulteEstimee = Math.round((tailleEnfant / pct_taille_adulte) * 1000) / 10
    const intervalle = tailleCible >= tailleAdulteEstimee - 8 && tailleCible <= tailleAdulteEstimee + 8

    return {value:Math.round(tailleCible*10)/10, label:`Taille cible adulte : ${Math.round(tailleCible*10)/10} cm`, severity: `low`,
      details:{tailleCible:`${Math.round(tailleCible*10)/10} cm`,tailleEstimee:`${tailleAdulteEstimee} cm`,compatible:intervalle ? `Oui` : `Non`},
      ranges:[
        {min:0,max:300,label:`Taille cible adulte`,severity:`low`},
      ]}
  },
  interpretation: `Estimation de la taille cible adulte (formule de Tanner) : (taille du pere + taille de la mere ± 13) / 2, selon le sexe. Estimation de la taille adulte a partir de la taille actuelle par la methode des pourcentages de taille adulte atteinte selon l'age.`,
  clinicalCommentary: `Formule simple de depistage en consultation. La taille cible est un indicateur, pas une certitude. Ecart significatif si difference de plus de 2 DS (-10 cm) entre taille actuelle et taille cible. Toujours utiliser les courbes de croissance. En cas de decalage, explorer : retard constitutionnel, pathologie endocrinienne, trouble nutritionnel.`,
  references: [
    {type:`pubmed`,title:`Tanner JM et al. Growth and development of children. Arch Dis Child 1970`,pmid:`4243885`},
    {type:`guideline`,title:`HAS - Surveillance de la croissance de l'enfant (2021)`,url:`https://www.has-sante.fr/`},
  ],
}
export default taille_enfant
