import type { FormulaDefinition } from '../types'

const filtration_glom: FormulaDefinition = {
  id: `filtration_glom`, slug: `filtration_glom`,
  name: `Filtration glomerulaire (Tableau)`,
  specialty: `nephrologie`, category: `Filtration`,
  description: `Valeurs normales de filtration glomerulaire selon l'age`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`age`,type:`number`,label:`Age`,unit:`ans`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Femme`},{value:1,label:`Homme`}]},
  ],
  calculate: (values) => {
    const age = parseFloat(values.age)||40; const sexe = parseInt(values.sexe)||1
        const dfg = sexe === 0 ? Math.max(130 - age * 0.7, 30) : Math.max(140 - age * 0.8, 30)
        const arr = Math.round(dfg * 10) / 10
        const sev = arr < 60 ? 'high' : arr < 90 ? 'moderate' : 'low'
        const retval = arr; const retlabel = 'DFG estime: ' + arr + ' mL/min/1.73m2'; const retsev = sev
        const ranges = [
          {min:0,max:14,label:'Stade 5',severity:'critical' as const},
          {min:15,max:29,label:'Stade 4',severity:'high' as const},
          {min:30,max:59,label:'Stade 3',severity:'moderate' as const},
          {min:60,max:89,label:'Stade 2',severity:'low' as const},
          {min:90,max:999,label:'Stade 1',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le DFG diminue physiologiquement avec l'age. Seuils KDIGO des stades d'IRC.`,
  clinicalCommentary: `Le DFG estime par CKD-EPI est preferable. Un DFG < 60 pendant > 3 mois definit l'IRC.`,
  references: [
    {type:`pubmed`,title:`KDIGO 2012. Kidney Int 2013`,pmid:`---`}
  ],
}
export default filtration_glom
