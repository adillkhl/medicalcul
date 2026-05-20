import type { FormulaDefinition } from '../types'

const score: FormulaDefinition = {
  id: `score`, slug: `score`,
  name: `SCORE (Risque cardiovasculaire)`,
  specialty: `cardiologie`, category: `Prevention`,
  description: `Risque de deces cardiovasculaire a 10 ans version europeenne`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Femme`},{value:1,label:`Homme`}]},
    {id:`age`,type:`number`,label:`Age`,unit:`ans`},
    {id:`pas`,type:`number`,label:`PA systolique`,unit:`mmHg`},
    {id:`cholesterol`,type:`number`,label:`Cholesterol total`,unit:`mmol/L`},
    {id:`tabac`,type:`boolean`,label:`Fumeur`,weight:0},
  ],
  calculate: (values) => {
    // Simplified SCORE
        const sexe = parseInt(values.sexe)||0; const age = parseFloat(values.age)||50; const pas = parseFloat(values.pas)||130; const chol = parseFloat(values.cholesterol)||5; const tabac = values.tabac?1:0
        let risk = sexe === 0 ? Math.min(1.5 * (age-45)/10, 15) : Math.min(2 * (age-40)/10, 20)
        if (tabac) risk *= 1.5; if (pas > 160) risk *= 1.3; if (chol > 6) risk *= 1.3
        risk = Math.round(risk * 10) / 10
        const sev = risk >= 10 ? 'high' : risk >= 5 ? 'moderate' : 'low'
        const label = risk + '% risque CV a 10 ans'
        const retval = risk
        const retlabel = label
        const retsev = sev
        const ranges = [ {min:0,max:0.9,label:'Faible',severity:'low' as const}, {min:1,max:4.9,label:'Faible-modere',severity:'low' as const}, {min:5,max:9.9,label:'Modere-eleve',severity:'moderate' as const}, {min:10,max:999,label:'Eleve',severity:'high' as const} ]
        return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `SCORE estime le risque de deces CV a 10 ans. Version simplifiee pour estimation rapide.`,
  clinicalCommentary: `Le SCORE officiel est calcule par les equations HeartScore et differe entre pays Low/High risk.`,
  references: [
    {type:`pubmed`,title:`Conroy RM et al. Eur Heart J 2003`,pmid:`12893104`}
  ],
}
export default score
