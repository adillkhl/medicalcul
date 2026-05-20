import type { FormulaDefinition } from '../types'

const denutrition_has: FormulaDefinition = {
  id: `denutrition_has`, slug: `denutrition_has`,
  name: `Criteres HAS de Denutrition`,
  specialty: `nutrition`, category: `Denutrition`,
  description: `Criteres de la Haute Autorite de Sante (HAS) pour le diagnostic de denutrition chez l\'adulte et le sujet age`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`imc`,type:`radio`,label:`IMC (kg/m²)`,options:[
      {value:0,label:`IMC ≥ 21 (sujet age) ou ≥ 18.5 (adulte)`},
      {value:1,label:`IMC < 21 (sujet age) ou < 18.5 (adulte)`},
      {value:2,label:`IMC < 18 (sujet age) ou < 16 (adulte) - denutrition severe`},
    ]},
    {id:`perte_poids_1mois`,type:`radio`,label:`Perte de poids en 1 mois`,options:[
      {value:0,label:`< 5%`},
      {value:1,label:`≥ 5%`},
      {value:2,label:`≥ 10% - denutrition severe`},
    ]},
    {id:`perte_poids_6mois`,type:`radio`,label:`Perte de poids en 6 mois`,options:[
      {value:0,label:`< 10%`},
      {value:1,label:`≥ 10%`},
      {value:2,label:`≥ 15% (ou > 10% sujet age) - denutrition severe`},
    ]},
    {id:`albuminemie`,type:`radio`,label:`Albuminemie (g/L)`,options:[
      {value:0,label:`≥ 35 (normal)`},
      {value:1,label:`< 35 - Denutrition`},
      {value:2,label:`< 30 - Denutrition severe`},
    ]},
    {id:`apports`,type:`boolean`,label:`Reduction des apports alimentaires depuis > 1 semaine (< 50% des besoins)`},
    {id:`autre_critere`,type:`boolean`,label:`Autre critere: MNA court < 12 ou circonference brachiale reduite`},
  ],
  calculate: (values) => {
    const imc = parseInt(values.imc||0)
    const pp1 = parseInt(values.perte_poids_1mois||0)
    const pp6 = parseInt(values.perte_poids_6mois||0)
    const alb = parseInt(values.albuminemie||0)
    const apports = values.apports?1:0
    const autre = values.autre_critere?1:0
    
    // Compter les criteres
    const criteres_imc = imc >= 1 ? 1 : 0
    const criteres_poids = (pp1 >= 1 || pp6 >= 1) ? 1 : 0
    const criteres_alb = alb >= 1 ? 1 : 0
    const criteres_apports = apports
    const criteres_autre = autre
    
    const total_criteres = criteres_imc + criteres_poids + criteres_alb + criteres_apports + criteres_autre
    
    // Denutrition severe si au moins 1 critere severe
    const severe_imc = imc >= 2 || pp1 >= 2 || pp6 >= 2 || alb >= 2
    
    let diagnostic = `Pas de denutrition`
    let sev: 'low' | 'moderate' | 'high' = `low`
    if ((criteres_imc && criteres_poids) || (criteres_imc && criteres_alb) || (criteres_poids && criteres_alb)) {
      if (severe_imc) { diagnostic = `Denutrition severe (criteres severes)`; sev = `high` }
      else { diagnostic = `Denutrition confirmee (≥ 2 criteres)`; sev = `moderate` }
    } else if (total_criteres >= 2) {
      diagnostic = `Denutrition possible (≥ 2 criteres, dont au moins 1 phenotypique)`
      sev = `moderate`
    }
    
    return {value:total_criteres, label:diagnostic, severity: sev,
      details:{ imc_critere: criteres_imc, perte_poids: criteres_poids, albuminemie: criteres_alb, apports: criteres_apports, autres: criteres_autre },
      ranges:[
        {min:0,max:1,label:'Pas de denutrition',severity:'low'},
        {min:2,max:2,label:'Denutrition possible/moderee',severity:'moderate'},
        {min:3,max:99,label:'Denutrition confirmee/severe',severity:'high'},
      ]}
  },
  interpretation: `Selon la HAS (2021), le diagnostic de denutrition repose sur la presence d\'au moins 2 criteres (dont au moins 1 phenotypique):<br/><br/>Criteres phenotypiques:<br/>• Perte de poids ≥ 5% en 1 mois ou ≥ 10% en 6 mois<br/>• IMC < 21 (≥ 70 ans) ou < 18.5 (< 70 ans)<br/>• Albuminemie < 35 g/L (ou < 30 g/L pour denutrition severe)<br/><br/>Criteres etiologiques:<br/>• Reduction des apports alimentaires<br/>• Hypermetabolisme (maladie, inflammation)<br/><br/>Denutrition severe: 1 critere severe (IMC < 18, perte ≥ 15%, albumine < 30)`,
  clinicalCommentary: `Les criteres HAS 2021 sont la reference en France pour le diagnostic de denutrition. L\'albuminemie est un critere majeur mais doit etre interpretee avec la CRP (inflammation). En cas d\'inflammation, une albumine basse ne reflete pas forcement la denutrition mais l\'activite inflammatoire. Reevaluation a distance de l\'episode aigu.`,
  references: [
    {type:`url`,title:`HAS - Diagnostic de la denutrition 2021`,url:`https://www.has-sante.fr/jcms/c_2837599/fr/diagnostic-de-la-denutrition`},
  ],
}
export default denutrition_has
