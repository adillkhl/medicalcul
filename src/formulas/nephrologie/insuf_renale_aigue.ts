import type { FormulaDefinition } from '../types'

const insuf_renale_aigue: FormulaDefinition = {
  id: `insuf_renale_aigue`, slug: `insuf_renale_aigue`,
  name: `IRA (Classification RIFLE)`,
  specialty: `nephrologie`, category: `Insuffisance renale`,
  description: `Classification RIFLE de l\'insuffisance renale aigue`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`creat`,type:`radio`,label:`Creatinine`,options:[{value:0,label:`Normale`},{value:1,label:`x 1.5 basale`},{value:2,label:`x 2 basale`},{value:3,label:`x 3 basale ou >= 354`}]},
    {id:`diurese`,type:`radio`,label:`Diurese`,options:[{value:0,label:`Conservee`},{value:1,label:`< 0.5 mL/kg/h 6h`},{value:2,label:`< 0.5 mL/kg/h 12h`},{value:3,label:`Anurie 12h`}]},
  ],
  calculate: (values) => {
    const c = parseInt(values.creat)||0; const d = parseInt(values.diurese)||0
        const s = Math.max(c, d)
        const labels : Record<number, string> = {0:'Pas d IRA',1:'RIFLE-R (Risk)',2:'RIFLE-I (Injury)',3:'RIFLE-F (Failure)'}
        const sev = s >= 3 ? 'high' : s === 2 ? 'moderate' : 'low'
        const retval = s; const retlabel = labels[s]||''; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Pas d IRA',severity:'low' as const},
          {min:1,max:1,label:'RIFLE-R - Risk',severity:'low' as const},
          {min:2,max:2,label:'RIFLE-I - Injury',severity:'moderate' as const},
          {min:3,max:3,label:'RIFLE-F - Failure',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `RIFLE gradue l\'IRA en 5 stades: Risk, Injury, Failure, Loss, End-stage.`,
  clinicalCommentary: `Remplacee par KDIGO (3 stades). Creatinine et diurese sont complementaires.`,
  references: [
    {type:`pubmed`,title:`Bellomo R et al. Crit Care 2004`,pmid:`15312219`}
  ],
}
export default insuf_renale_aigue
