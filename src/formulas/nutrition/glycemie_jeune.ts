import type { FormulaDefinition } from '../types'

const glycemie_jeune: FormulaDefinition = {
  id: `glycemie_jeune`, slug: `glycemie_jeune`,
  name: `Glycemie a Jeun - Interpretation OMS`,
  specialty: `nutrition`, category: `Metabolisme`,
  description: `Classification OMS des valeurs de glycemie a jeun: normale, prediabete, diabete`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`glycemie`,type:`number`,label:`Glycemie a jeun (mmol/L ou g/L)`,unit:`mmol/L`,min:0,max:50,step:0.1,placeholder:`Ex: 6.1`},
    {id:`unite`,type:`radio`,label:`Unite`,options:[
      {value:0,label:`mmol/L`},{value:1,label:`g/L`},
    ]},
  ],
  calculate: (values) => {
    let gly = parseFloat(values.glycemie||0)
    const unite = parseInt(values.unite||0)
    
    // Convertir en mmol/L si en g/L (1 g/L = 5.55 mmol/L)
    if (unite === 1) gly = gly * 5.55
    
    let label = ``
    let sev: `low`|`moderate`|`high` = `low`
    if (gly < 6.1) { label = `Glycemie normale (< 6.1 mmol/L)`; sev = `low` }
    else if (gly < 7) { label = `Glycemie a jeun anormale / Prediabete (6.1-6.9 mmol/L)`; sev = `moderate` }
    else { label = `Diabete (≥ 7 mmol/L)`; sev = `high` }
    
    const gly_gL = Math.round(gly / 5.55 * 100) / 100
    
    return {value:Math.round(gly*10)/10, unit:`mmol/L`, label, severity: sev,
      details:{ glycemie_gL: `${gly_gL.toFixed(2)} g/L` },
      ranges:[
        {min:0,max:6,label:'Glycemie normale (< 6.1 mmol/L)',severity:'low'},
        {min:6.1,max:6.9,label:'Prediabete (6.1-6.9 mmol/L)',severity:'moderate'},
        {min:7,max:99,label:'Diabete (≥ 7 mmol/L)',severity:'high'},
      ]}
  },
  interpretation: `Classification OMS des valeurs de glycemie a jeun (8h de jeune):<br/>• < 6.1 mmol/L (< 1.10 g/L): Normale<br/>• 6.1-6.9 mmol/L (1.10-1.25 g/L): Glycemie a jeun anormale (prediabete)<br/>• ≥ 7.0 mmol/L (≥ 1.26 g/L): Diabete<br/><br/>Un diabete est confirme si 2 glycemies a jeun ≥ 7.0 mmol/L ou une HbA1c ≥ 6.5% (48 mmol/mol).`,
  clinicalCommentary: `Le prediabete (glycemie a jeun 6.1-6.9 mmol/L) est un facteur de risque de progression vers le diabete (5-10%/an). La glycation (HbA1c) est plus fiable pour le suivi mais moins sensible pour le diagnostic. L'HbA1c peut etre faussement basse en cas d'anemie, d'hemoglobinopathie ou d'insuffisance renale.`,
  references: [
    {type:`url`,title:`OMS - Definition et diagnostic du diabete 2006`,url:`https://www.who.int/publications/i/item/9241594934`},
    {type:`pubmed`,title:`American Diabetes Association. Diabetes Care 2024`,pmid:`38078555`},
  ],
}
export default glycemie_jeune
