import type { FormulaDefinition } from '../types'

const cockcroft: FormulaDefinition = {
  id: `cockcroft`, slug: `cockcroft`,
  name: `Cockcroft-Gault (Formule)`,
  specialty: `nephrologie`, category: `Filtration`,
  description: `Clairance de la creatinine estimee par Cockcroft-Gault`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`age`,type:`number`,label:`Age`,unit:`ans`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Femme`},{value:1,label:`Homme`}]},
    {id:`poids`,type:`number`,label:`Poids`,unit:`kg`},
    {id:`creatinine`,type:`number`,label:`Creatininemie`,unit:`micromol/L`},
  ],
  calculate: (values) => {
    const age = parseFloat(values.age)||50; const poids = parseFloat(values.poids)||70; const creat = parseFloat(values.creatinine)||80; const sexe = parseInt(values.sexe)||1
        const clCr = (140 - age) * poids / (creat * 0.8136) * (sexe === 0 ? 0.85 : 1)
        const arr = Math.round(clCr * 100) / 100
        const sev = arr < 15 ? 'critical' : arr < 30 ? 'high' : arr < 60 ? 'moderate' : arr < 90 ? 'low' : 'low'
        const retval = arr; const retlabel = arr + ' mL/min'; const retsev = sev
        const ranges = [
          {min:0,max:14,label:'Stade 5',severity:'critical' as const},
          {min:15,max:29,label:'Stade 4',severity:'high' as const},
          {min:30,max:59,label:'Stade 3',severity:'moderate' as const},
          {min:60,max:89,label:'Stade 2',severity:'low' as const},
          {min:90,max:999,label:'Stade 1',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Clairance de la creatinine: (140 - age) x poids / (creat x 0.8136) x (0.85 si femme).`,
  clinicalCommentary: `Surestime la clairance chez les patients ages et en cas d'obesite. Remplacee par CKD-EPI pour le DFG.`,
  references: [
    {type:`pubmed`,title:`Cockcroft DW, Gault MH. Nephron 1976`,pmid:`1244564`}
  ],
}
export default cockcroft
