import type { FormulaDefinition } from '../types'

const bmi: FormulaDefinition = {
  id: `bmi`, slug: `bmi`,
  name: `IMC (Indice de Masse Corporelle)`,
  specialty: `nutrition`, category: `Anthropometrie`,
  description: `Calcul de l'Indice de Masse Corporelle (poids / taille^2) avec classification OMS`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`poids`,type:`number`,label:`Poids (kg)`,unit:`kg`,min:0,max:500,step:0.1,placeholder:`Ex: 70`},
    {id:`taille`,type:`number`,label:`Taille (cm)`,unit:`cm`,min:0,max:250,step:0.5,placeholder:`Ex: 170`},
  ],
  calculate: (values) => {
    const poids = parseFloat(values.poids||0)
    const taille = parseFloat(values.taille||0)
    const imc = taille > 0 ? poids / ((taille/100)*(taille/100)) : 0
    let label = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    if (imc < 16.5) { label = `Denutrition severe`; sev = `high` }
    else if (imc < 18.5) { label = `Insuffisance ponderale`; sev = `moderate` }
    else if (imc < 25) { label = `Corpulence normale`; sev = `low` }
    else if (imc < 30) { label = `Surpoids`; sev = `moderate` }
    else if (imc < 35) { label = `Obesite classe I (moderee)`; sev = `moderate` }
    else if (imc < 40) { label = `Obesite classe II (severe)`; sev = `high` }
    else { label = `Obesite classe III (morbide)`; sev = `high` }
    return {value:Math.round(imc*10)/10, unit:`kg/m²`, label, severity: sev,
      ranges:[
        {min:0,max:16.4,label:'Denutrition severe',severity:'high'},
        {min:16.5,max:18.4,label:'Insuffisance ponderale',severity:'moderate'},
        {min:18.5,max:24.9,label:'Corpulence normale',severity:'low'},
        {min:25,max:29.9,label:'Surpoids',severity:'moderate'},
        {min:30,max:34.9,label:'Obesite classe I',severity:'moderate'},
        {min:35,max:39.9,label:'Obesite classe II',severity:'high'},
        {min:40,max:500,label:'Obesite classe III (morbide)',severity:'high'},
      ]}
  },
  interpretation: `L'Indice de Masse Corporelle (IMC) = poids (kg) / taille² (m). Classification OMS 2000:<br/>• < 16.5: Denutrition severe<br/>• 16.5-18.4: Insuffisance ponderale<br/>• 18.5-24.9: Corpulence normale<br/>• 25-29.9: Surpoids<br/>• 30-34.9: Obesite classe I (moderee)<br/>• 35-39.9: Obesite classe II (severe)<br/>• ≥ 40: Obesite classe III (morbide)`,
  clinicalCommentary: `L'IMC est un indicateur simple mais imparfait: ne tient pas compte de la composition corporelle (masse musculaire vs masse grasse). Chez le sujet age (> 65 ans), le seuil de denutrition est IMC < 21. Chez l'asiatique, les seuils de surpoids (23) et obesite (27.5) sont plus bas. L'IMC ne remplace pas une evaluation nutritionnelle complete.`,
  references: [
    {type:`pubmed`,title:`OMS. World Health Organ Tech Rep Ser 2000`,pmid:`11234459`},
    {type:`pubmed`,title:`Keys A et al. J Chronic Dis 1972`,pmid:`4650929`},
  ],
}
export default bmi
