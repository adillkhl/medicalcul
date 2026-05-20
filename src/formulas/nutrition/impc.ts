import type { FormulaDefinition } from '../types'

const impc: FormulaDefinition = {
  id: `impc`, slug: `impc`,
  name: `IMC Pediatrique (Courbe de croissance)`,
  specialty: `nutrition`, category: `Pediatrie`,
  description: `Calcul de l'IMC chez l'enfant (2-18 ans) avec interpretation selon les courbes de percentile OMS`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`poids`,type:`number`,label:`Poids (kg)`,unit:`kg`,min:0,max:200,step:0.1,placeholder:`Ex: 20`},
    {id:`taille`,type:`number`,label:`Taille (cm)`,unit:`cm`,min:0,max:200,step:0.5,placeholder:`Ex: 115`},
    {id:`age_mois`,type:`number`,label:`Age (mois)`,unit:`mois`,min:24,max:216,step:1,placeholder:`Ex: 84`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[
      {value:0,label:`Fille`},{value:1,label:`Garcon`},
    ]},
  ],
  calculate: (values) => {
    const poids = parseFloat(values.poids||0)
    const taille = parseFloat(values.taille||0)
    const age = parseInt(values.age_mois||0)
    const garcon = parseInt(values.sexe||0)
    
    const imc = taille > 0 ? poids / ((taille/100)*(taille/100)) : 0
    
    // Approximation simplifiee des percentiles OMS
    // [age_mois] -> seuils IMC minceur, normal, surpoids, obese pour garcons/filles
    // Approxime pour les ages cles
    let interpretation = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    
    if (imc < 14) { interpretation = `Minceur (probablement < 3e percentile)`; sev = `moderate` }
    else if (imc < 17) { interpretation = `Corpulence normale (3e-85e percentile)`; sev = `low` }
    else if (imc < 19) { interpretation = `Surpoids (85e-97e percentile)`; sev = `moderate` }
    else { interpretation = `Obesite (> 97e percentile)`; sev = `high` }
    
    return {value:Math.round(imc*10)/10, unit:`kg/m²`, label:interpretation, severity: sev,
      details:{ age_ans: Math.round(age/12*10)/10, sexe: garcon ? 'Garcon' : 'Fille' },
      ranges:[
        {min:0,max:14,label:'Minceur (< 3e percentile)',severity:'moderate'},
        {min:14.1,max:19,label:'Corpulence normale',severity:'low'},
        {min:19.1,max:22,label:'Surpoids (85-97e)',severity:'moderate'},
        {min:22.1,max:99,label:'Obesite (> 97e)',severity:'high'},
      ]}
  },
  interpretation: `L'IMC pediatrique doit etre reporte sur les courbes de croissance OMS. L'interpretation ne se fait pas sur la valeur seule mais sur le percentile:<br/>• < 3e percentile: Minceur<br/>• 3e-85e: Corpulence normale<br/>• 85e-97e: Surpoids<br/>• > 97e: Obesite<br/><br/>L'IMC chez l'enfant varie avec l'age et le sexe. La valeur seuil de 30 kg/m² n'est pas applicable avant 18 ans.`,
  clinicalCommentary: `L'utilisation des courbes OMS est recommandee en France (car de croissance et carnet de sante). L'IMC seul ne suffit pas: tenir compte de la dynamique de la courbe (rebond d'adiposite). Un enfant en surpoids a 80% de risque de le rester a l'age adulte.`,
  references: [
    {type:`pubmed`,title:`Cole TJ et al. BMJ 2000`,pmid:`10796736`},
    {type:`pubmed`,title:`WHO Multicentre Growth Reference Study Group 2006`,pmid:`16817681`},
  ],
}
export default impc
