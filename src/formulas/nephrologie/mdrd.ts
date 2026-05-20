import type { FormulaDefinition } from '../types'

const mdrd: FormulaDefinition = {
  id: `mdrd`, slug: `mdrd`,
  name: `MDRD (Formule)`,
  specialty: `nephrologie`, category: `Filtration`,
  description: `DFG estime par la formule MDRD simplifiee (Levey) a 4 variables`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`creatinine`,type:`number`,label:`Creatininemie`,unit:`micromol/L`},
    {id:`age`,type:`number`,label:`Age`,unit:`ans`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Femme`},{value:1,label:`Homme`}]},
    {id:`race`,type:`radio`,label:`Race`,options:[{value:0,label:`Non noire`},{value:1,label:`Noire`}]},
  ],
  calculate: (values) => {
    const creat = parseFloat(values.creatinine)||80; const age = parseFloat(values.age)||50; const sexe = parseInt(values.sexe)||1; const race = parseInt(values.race)||0
        const dfg = 175 * Math.pow(creat/88.4, -1.154) * Math.pow(age, -0.203) * (sexe === 0 ? 0.742 : 1) * (race === 1 ? 1.212 : 1)
        const arr = Math.round(dfg * 10) / 10
        const sev = arr < 15 ? 'critical' : arr < 30 ? 'high' : arr < 60 ? 'moderate' : arr < 90 ? 'low' : 'low'
        const retval = arr; const retlabel = arr + ' mL/min/1.73m2'; const retsev = sev
        const ranges = [
          {min:0,max:14,label:'Stade 5',severity:'critical' as const},
          {min:15,max:29,label:'Stade 4',severity:'high' as const},
          {min:30,max:59,label:'Stade 3',severity:'moderate' as const},
          {min:60,max:89,label:'Stade 2',severity:'low' as const},
          {min:90,max:999,label:'Stade 1',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `MDRD: 175 x (creat/88.4)^-1.154 x age^-0.203 x (0.742 si femme) x (1.212 si noir).`,
  clinicalCommentary: `Moins precise que CKD-EPI pour les DFG > 60. Ne pas utiliser chez l\'enfant, la femme enceinte.`,
  references: [
    {type:`pubmed`,title:`Levey AS et al. Ann Intern Med 1999`,pmid:`10493846`}
  ],
}
export default mdrd
