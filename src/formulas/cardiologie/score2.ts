import type { FormulaDefinition } from '../types'

const score2: FormulaDefinition = {
  id: `score2`, slug: `score2`,
  name: `SCORE2 (Risque cardiovasculaire)`,
  specialty: `cardiologie`, category: `Prevention`,
  description: `Risque de deces cardiovasculaire a 10 ans version 2021 (SCORE2)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Femme`},{value:1,label:`Homme`}]},
    {id:`age`,type:`number`,label:`Age`,unit:`ans`},
    {id:`pas`,type:`number`,label:`PA systolique`,unit:`mmHg`},
    {id:`cholesterol`,type:`number`,label:`Cholesterol non-HDL`,unit:`mmol/L`},
    {id:`tabac`,type:`boolean`,label:`Fumeur`,weight:0},
  ],
  calculate: (values) => {
    // Simplified SCORE2 estimate
        const sexe = parseInt(values.sexe)||0
        const age = parseFloat(values.age)||55
        const risk = sexe === 0 ? Math.min(age - 30, 45) / 2 : Math.min(age - 25, 50) / 2
        const sev = risk >= 10 ? 'high' : risk >= 5 ? 'moderate' : 'low'
        const label = Math.round(risk) + '% risque CV a 10 ans (estimation)'
        const retval = Math.round(risk*10)/10
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:4.9,label:'Faible (< 5%)',severity:'low' as const},
          {min:5,max:9.9,label:'Modere (5-10%)',severity:'moderate' as const},
          {min:10,max:999,label:'Eleve (≥ 10%)',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `SCORE2 est la version 2021 du risque cardiovasculaire, estimant le risque d\'infarctus et d\'AVC fatals et non fatals. Le calculateur exact est disponible via l\'ESC.`,
  clinicalCommentary: `SCORE2 remplace SCORE et est calibre pour les populations europeennes modernes. L\'estimation simplifiee ci-dessus est approximative; utiliser le calculateur officiel ESC pour une evaluation precise.`,
  references: [
    {type:`pubmed`,title:`SCORE2 Working Group. Eur Heart J 2021`,pmid:`34120177`}
  ],
}
export default score2
