import type { FormulaDefinition } from '../types'

const urea_interpretation: FormulaDefinition = {
  id: `urea_interpretation`, slug: `urea_interpretation`,
  name: `Uree (Interpretation)`,
  specialty: `nephrologie`, category: `Metabolisme`,
  description: `Interpretation de l'uree plasmatique et rapport uree/creatinine`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`uree`,type:`number`,label:`Uree`,unit:`mmol/L`},
    {id:`creatinine`,type:`number`,label:`Creatinine`,unit:`micromol/L`},
  ],
  calculate: (values) => {
    const uree = parseFloat(values.uree)||5; const creat = parseFloat(values.creatinine)||80
        const ratio = creat > 0 ? Math.round(uree / (creat/88.4) * 100) / 100 : 0
        const sev = uree > 20 ? 'high' : uree > 10 ? 'moderate' : 'low'
        let label = uree + ' mmol/L'
        if (uree > 20) label += ' - IRA/IRC severe'
        else if (ratio > 80) label += ' - IRA pre-renale, saignement digestif, catabolisme'
        else if (ratio < 40) label += ' - Reduction volernique, hepatopathie, dialyse'
        const retval = uree; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:6.9,label:'Uree normale (2.5-7.5 mmol/L)',severity:'low' as const},
          {min:7,max:10,label:'Uree legerement elevee',severity:'low' as const},
          {min:10.1,max:20,label:'Uree elevee - Explorer IRA/IRC',severity:'moderate' as const},
          {min:20.1,max:999,label:'Uree tres elevee - IRA/IRC severe',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'uree est moins specifique que la creatinine pour la fonction renale mais le rapport Uree/Creatinine aide au diagnostic differentiel de l'IRA.`,
  clinicalCommentary: `Rapport U/Cre: > 80-100 = IRA pre-renale ou saignement digestif. Ratio bas (< 40) = hepatopathie ou reduction de masse musculaire.`,
  references: [
    {type:`pubmed`,title:`Morgan DB et al. Br Med J 1977`,pmid:`589285`}
  ],
}
export default urea_interpretation
