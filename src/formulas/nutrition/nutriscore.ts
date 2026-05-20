import type { FormulaDefinition } from '../types'

const nutriscore: FormulaDefinition = {
  id: `nutriscore`, slug: `nutriscore`,
  name: `Nutri-Score Alimentaire`,
  specialty: `nutrition`, category: `Evaluation Alimentaire`,
  description: `Calcul du Nutri-Score (score nutritionnel A a E) base sur la composition nutritionnelle des aliments transformes`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`energie`,type:`number`,label:`Energie (kJ/100g)`,unit:`kJ`,min:0,max:5000,step:1,placeholder:`Ex: 400`},
    {id:`sucres`,type:`number`,label:`Sucres simples (g/100g)`,unit:`g`,min:0,max:100,step:0.1,placeholder:`Ex: 5`},
    {id:`ags`,type:`number`,label:`Acides gras satures (g/100g)`,unit:`g`,min:0,max:100,step:0.1,placeholder:`Ex: 2`},
    {id:`sodium`,type:`number`,label:`Sodium (mg/100g)`,unit:`mg`,min:0,max:10000,step:1,placeholder:`Ex: 400`},
    {id:`fibres`,type:`number`,label:`Fibres alimentaires (g/100g)`,unit:`g`,min:0,max:100,step:0.1,placeholder:`Ex: 3`},
    {id:`proteines`,type:`number`,label:`Proteines (g/100g)`,unit:`g`,min:0,max:100,step:0.1,placeholder:`Ex: 6`},
    {id:`fruits_legumes`,type:`number`,label:`Fruits, legumes, noix, colza, noix (% de l'aliment)`,unit:`%`,min:0,max:100,step:1,placeholder:`Ex: 40`},
  ],
  calculate: (values) => {
    const energie = parseFloat(values.energie||0)
    const sucres = parseFloat(values.sucres||0)
    const ags = parseFloat(values.ags||0)
    const sodium = parseFloat(values.sodium||0)
    const fibres = parseFloat(values.fibres||0)
    const proteines = parseFloat(values.proteines||0)
    const fln = parseFloat(values.fruits_legumes||0)
    
    // Points negatifs (N)
    let points_energie = 0
    if (energie > 3350) points_energie = 10
    else if (energie > 3015) points_energie = 9
    else if (energie > 2680) points_energie = 8
    else if (energie > 2345) points_energie = 7
    else if (energie > 2010) points_energie = 6
    else if (energie > 1675) points_energie = 5
    else if (energie > 1340) points_energie = 4
    else if (energie > 1005) points_energie = 3
    else if (energie > 670) points_energie = 2
    else if (energie > 335) points_energie = 1
    
    let points_sucres = 0
    if (sucres > 45) points_sucres = 10
    else if (sucres > 40) points_sucres = 9
    else if (sucres > 36) points_sucres = 8
    else if (sucres > 31) points_sucres = 7
    else if (sucres > 27) points_sucres = 6
    else if (sucres > 22.5) points_sucres = 5
    else if (sucres > 18) points_sucres = 4
    else if (sucres > 13.5) points_sucres = 3
    else if (sucres > 9) points_sucres = 2
    else if (sucres > 4.5) points_sucres = 1
    
    let points_ags = 0
    if (ags > 10) points_ags = 10
    else if (ags > 9) points_ags = 9
    else if (ags > 8) points_ags = 8
    else if (ags > 7) points_ags = 7
    else if (ags > 6) points_ags = 6
    else if (ags > 5) points_ags = 5
    else if (ags > 4) points_ags = 4
    else if (ags > 3) points_ags = 3
    else if (ags > 2) points_ags = 2
    else if (ags > 1) points_ags = 1
    
    let points_sodium = 0
    if (sodium > 900) points_sodium = 10
    else if (sodium > 810) points_sodium = 9
    else if (sodium > 720) points_sodium = 8
    else if (sodium > 630) points_sodium = 7
    else if (sodium > 540) points_sodium = 6
    else if (sodium > 450) points_sodium = 5
    else if (sodium > 360) points_sodium = 4
    else if (sodium > 270) points_sodium = 3
    else if (sodium > 180) points_sodium = 2
    else if (sodium > 90) points_sodium = 1
    
    const N = points_energie + points_sucres + points_ags + points_sodium
    
    // Points positifs (P)
    let points_fibres = 0
    if (fibres > 4.7) points_fibres = 5
    else if (fibres > 3.7) points_fibres = 4
    else if (fibres > 2.8) points_fibres = 3
    else if (fibres > 1.9) points_fibres = 2
    else if (fibres > 0.9) points_fibres = 1
    
    let points_proteines = 0
    if (proteines > 8) points_proteines = 5
    else if (proteines > 6.4) points_proteines = 4
    else if (proteines > 4.8) points_proteines = 3
    else if (proteines > 3.2) points_proteines = 2
    else if (proteines > 1.6) points_proteines = 1
    
    let points_fln = 0
    if (fln > 80) points_fln = 5
    else if (fln > 60) points_fln = 4
    else if (fln > 40) points_fln = 3
    else if (fln > 20) points_fln = 2
    else if (fln > 0) points_fln = 1
    
    const P = points_fibres + points_fln + (N >= 11 ? points_proteines : 0)
    
    // Nouveau Nutri-Score 2024: ajout du point pour les proteines seulement si N >= 11
    
    const score_brut = N - P
    
    // Conversion en lettre
    let lettre = `C`
    let sev: 'low' | 'moderate' | 'high' = `moderate`
    if (score_brut <= -1) { lettre = `A`; sev = `low` }
    else if (score_brut <= 2) { lettre = `B`; sev = `low` }
    else if (score_brut <= 10) { lettre = `C`; sev = `moderate` }
    else if (score_brut <= 18) { lettre = `D`; sev = `moderate` }
    else { lettre = `E`; sev = `high` }
    
    let etiquettes = {
      A: `Vert fonce - Bonne qualite nutritionnelle`,
      B: `Vert clair - Qualite nutritionnelle satisfaisante`,
      C: `Jaune - Qualite nutritionnelle moyenne`,
      D: `Orange vif - Qualite nutritionnelle faible`,
      E: `Rouge - Qualite nutritionnelle insuffisante`,
    }
    
    return {value:score_brut, label:`Nutri-Score ${lettre} - ${etiquettes[lettre as keyof typeof etiquettes]}`, severity: sev,
      details:{ N, P, fibres: points_fibres, proteines: points_proteines, fln: points_fln },
      ranges:[
        {min:-99,max:-1,label:'Nutri-Score A',severity:'low'},
        {min:-0,max:2,label:'Nutri-Score B',severity:'low'},
        {min:3,max:10,label:'Nutri-Score C',severity:'moderate'},
        {min:11,max:18,label:'Nutri-Score D',severity:'moderate'},
        {min:19,max:99,label:'Nutri-Score E',severity:'high'},
      ]}
  },
  interpretation: `Le Nutri-Score est un logo nutritionnel appose sur les aliments transformes, allant de A (meilleure qualite nutritionnelle) a E (moins bonne qualite).<br/><br/>Calcul:<br/>• N = points energie + sucres + AGS + sodium (0-40)<br/>• P = points fibres + fruits/legumes (+ proteines si N ≥ 11) (0-15)<br/>• Score final = N - P (de -15 a +40)<br/><br/>Mise a jour 2024: les proteines ne comptent que si N ≥ 11, evitant que des aliments tres sucres/gras soient classes favorablement grace aux proteines.`,
  clinicalCommentary: `Le Nutri-Score est un outil de sante publique visant a informer les consommateurs. Il ne concerne que les aliments transformes et ne s'applique pas aux produits frais non transformes. Le score est base sur 100g (pas par portion), ce qui peut penaliser certains aliments (huiles vegetales riches en bons gras). Il ne remplace pas une alimentation equilibree et variee.`,
  references: [
    {type:`pubmed`,title:`Julia C et al. Am J Clin Nutr 2014`,pmid:`24760967`},
    {type:`url`,title:`Santepublique France - Nutri-Score`,url:`https://www.santepubliquefrance.fr/determinants-de-sante/nutrition-et-activite-physique/articles/nutri-score`},
  ],
}
export default nutriscore
