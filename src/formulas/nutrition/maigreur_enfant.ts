import type { FormulaDefinition } from '../types'

const maigreur_enfant: FormulaDefinition = {
  id: `maigreur_enfant`, slug: `maigreur_enfant`,
  name: `Classification de la Maigreur chez l\'Enfant`,
  specialty: `nutrition`, category: `Pediatrie`,
  description: `Classification OMS de la maigreur et de l\'emaciation chez l\'enfant (poids/taille, IMC-age, PB)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age_mois`,type:`number`,label:`Age (mois)`,unit:`mois`,min:0,max:216,step:1,placeholder:`Ex: 24`},
    {id:`poids`,type:`number`,label:`Poids (kg)`,unit:`kg`,min:0,max:100,step:0.1,placeholder:`Ex: 10`},
    {id:`taille`,type:`number`,label:`Taille (cm)`,unit:`cm`,min:0,max:180,step:0.5,placeholder:`Ex: 85`},
    {id:`pb`,type:`number`,label:`Perimetre brachial (cm) - optionnel`,unit:`cm`,min:0,max:30,step:0.1,placeholder:`Ex: 14`},
    {id:`oedemes`,type:`boolean`,label:`Oedemes bilateraux des membres inferieurs`},
  ],
  calculate: (values) => {
    const age = parseInt(values.age_mois||0)
    const poids = parseFloat(values.poids||0)
    const taille = parseFloat(values.taille||0)
    const pb = parseFloat(values.pb||0)
    const oedemes = values.oedemes?1:0
    
    const imc = taille > 0 ? poids / ((taille/100)*(taille/100)) : 0
    
    // Simplification: seuils generaux OMS
    let classification = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    let z_score = 0
    
    // Emaciation basee sur IMC-pour-age
    if (oedemes) {
      classification = `Kwashiorkor (oedemes bilateraux) - malnutrition aigue severe`
      sev = `high`
    } else if (imc < 13) {
      classification = `Emaciation severe (< -3 SD) - Malnutrition aigue severe`
      sev = `high`
      z_score = -3
    } else if (imc < 14) {
      classification = `Emaciation moderee (< -2 SD) - Malnutrition aigue moderee`
      sev = `moderate`
      z_score = -2
    } else if (pb > 0 && pb < 11.5) {
      classification = `PB < 11.5 cm - Malnutrition aigue severe`
      sev = `high`
    } else if (pb > 0 && pb < 12.5) {
      classification = `PB 11.5-12.4 cm - Malnutrition aigue moderee`
      sev = `moderate`
    } else {
      classification = `Etat nutritionnel normal`
      sev = `low`
    }
    
    return {value:Math.round(imc*10)/10, unit:`kg/m²`, label:classification, severity: sev,
      details:{ age_ans: Math.round(age/12*10)/10, z_score_approx: z_score, pb: pb > 0 ? pb : 'non mesure' },
      ranges:[
        {min:0,max:13,label:'Emaciation severe (< -3 SD)',severity:'high'},
        {min:13.1,max:15,label:'Emaciation moderee (-2 a -3 SD)',severity:'moderate'},
        {min:15.1,max:99,label:'Normal',severity:'low'},
      ]}
  },
  interpretation: `Classification OMS de la malnutrition aigue chez l\'enfant (6-60 mois):<br/>• Emaciation severe: IMC-age < -3 SD OU PB < 115 mm<br/>• Emaciation moderee: IMC-age < -2 SD OU PB 115-124 mm<br/>• Kwashiorkor: oedemes bilateraux (forme oedemateuse)<br/><br/>Le perimetre brachial (PB) est un outil de depistage communautaire simple. Le PB < 115 mm est un critere de malnutrition aigue severe.`,
  clinicalCommentary: `La malnutrition aigue est une urgence pediatrique. Le PB est un outil de depistage simple utilisable en communaute. L\'IMC-pour-age est la reference pour le diagnostic. La prise en charge repose sur les aliments therapeutiques prets a l\'emploi (ATPE). L\'hospitalisation est necessaire si complications (anorexie, infections).`,
  references: [
    {type:`pubmed`,title:`WHO Child Growth Standards 2006`,pmid:`16817681`},
    {type:`url`,title:`WHO - Severe Acute Malnutrition`,url:`https://www.who.int/health-topics/severe-acute-malnutrition`},
  ],
}
export default maigreur_enfant
