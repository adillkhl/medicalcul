import type { FormulaDefinition } from '../types'

const toronto: FormulaDefinition = {
  id: `toronto`, slug: `toronto`,
  name: `Toronto (Formule)`,
  specialty: `brules`, category: `Nutrition`,
  description: `Evaluation des besoins energetiques chez le patient brule selon la formule de Toronto`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`age`,type:`number`,label:`Age du patient`,unit:`ans`},
    {id:`taille`,type:`number`,label:`Taille`,unit:`cm`},
    {id:`poids`,type:`number`,label:`Poids actuel`,unit:`kg`},
    {id:`scb`,type:`number`,label:`Surface cutanee brulee`,unit:`%`},
    {id:`temperature`,type:`number`,label:`Temperature`,unit:`°C`},
  ],
  calculate: (values) => {
    const age = parseFloat(values.age)||35
    const taille = parseFloat(values.taille)||170
    const poids = parseFloat(values.poids)||70
    const scb = parseFloat(values.scb)||0
    const temp = parseFloat(values.temperature)||37
    // Basal: Harris-Benedict
    const be = 66.47 + (13.75*poids) + (5.0*taille) - (6.76*age)
    // Toronto: -4343 + (10.5 x SCB) + (0.23 x BE) + (0.84 x Harris-Benedict) + (114 x temperature) - (4.5 x jours post-brulure)
    const besoins = Math.round(-4343 + (10.5*scb) + (0.84*be) + (114*temp))
    const sev = besoins > 3500 ? 'high' : besoins > 2500 ? 'moderate' : 'low'
    return {value:besoins, label: besoins + ' kcal/j', severity: sev,
      ranges:[
        {min:0,max:2000,label:'Besoins normaux',severity:'low'},
        {min:2001,max:3500,label:'Besoins augmentes',severity:'moderate'},
        {min:3501,max:9999,label:'Hypermetabolisme severe',severity:'high'},
      ]}
    
  },
  interpretation: `La formule de Toronto estime les besoins energetiques du brule, qui sont fortement augmentes par l'hypermetabolisme post-brulure.`,
  clinicalCommentary: `Formule de reference pour la nutrition du brule. A ajuster selon la tolerance clinique. Le support nutritionnel precoce (dans les 24h) reduit les complications.`,
  references: [
    {type:`pubmed`,title:`Allard JP et al. Nutr Clin Pract 1990`,pmid:`2122167`}
  ],
}
export default toronto
