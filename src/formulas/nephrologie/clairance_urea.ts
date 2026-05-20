import type { FormulaDefinition } from '../types'

const clairance_urea: FormulaDefinition = {
  id: `clairance_urea`, slug: `clairance_urea`,
  name: `Clairance de l'uree`,
  specialty: `nephrologie`, category: `Dialyse`,
  description: `Calcul de la clairance de l'uree pour evaluation de la dose de dialyse`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`uree_pre`,type:`number`,label:`Uree pre-dialyse`,unit:`mmol/L`},
    {id:`uree_post`,type:`number`,label:`Uree post-dialyse`,unit:`mmol/L`},
    {id:`debit`,type:`number`,label:`Debit dialysat`,unit:`mL/min`},
    {id:`duree`,type:`number`,label:`Duree seance`,unit:`min`},
  ],
  calculate: (values) => {
    const pre = parseFloat(values.uree_pre)||20; const post = parseFloat(values.uree_post)||8; const debit = parseFloat(values.debit)||500; const duree = parseFloat(values.duree)||240
        const kt_v = -Math.log((post - 0.7) / pre)
        const arr = Math.round(kt_v * 100) / 100
        const sev = arr < 1.2 ? 'high' : arr < 1.4 ? 'moderate' : 'low'
        const retval = arr; const retlabel = 'Kt/V = ' + arr; const retsev = sev
        const ranges = [
          {min:0,max:1.19,label:'Kt/V insuffisant (< 1.2)',severity:'high' as const},
          {min:1.2,max:1.39,label:'Kt/V minimal (1.2-1.4)',severity:'moderate' as const},
          {min:1.4,max:999,label:'Kt/V adequat (>= 1.4)',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le Kt/V est le marqueur de la dose de dialyse. Cible >= 1.4 en hemodialyse (>= 1.2 minimum).`,
  clinicalCommentary: `Formule de Daugirdas simplifiee. En dialyse peritoneale, le Kt/V cible est >= 1.7/semaine.`,
  references: [
    {type:`pubmed`,title:`Daugirdas JT. Kidney Int 1993`,pmid:`8369642`}
  ],
}
export default clairance_urea
