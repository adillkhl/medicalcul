import type { FormulaDefinition } from '../types'

const urgence_hta: FormulaDefinition = {
  id: `urgence_hta`, slug: `urgence_hta`,
  name: `Crise hypertensive (Urgence vs Urgence)`,
  specialty: `urgence`, category: `HTA`,
  description: `Distinction entre urgence hypertensive et urgence hypertensive (atteinte organe cible)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`pas`,type:`number`,label:`PA systolique`,unit:`mmHg`},
    {id:`pad`,type:`number`,label:`PA diastolique`,unit:`mmHg`},
    {id:`cephalees`,type:`boolean`,label:`Cephalees severes`,weight:1},
    {id:`visuel`,type:`boolean`,label:`Troubles visuels`,weight:1},
    {id:`dyspnee`,type:`boolean`,label:`OAP / Dyspnee`,weight:1},
    {id:`neuro`,type:`boolean`,label:`Symptomes neurologiques (AVC/HTIC)`,weight:1},
    {id:`creatinine`,type:`boolean`,label:`Insuffisance renale aigue`,weight:1},
  ],
  calculate: (values) => {
    const pas = parseFloat(values.pas)||0; const pad = parseFloat(values.pad)||0
        const s = (values.cephalees?2:0)+(values.visuel?2:0)+(values.dyspnee?2:0)+(values.neuro?3:0)+(values.creatinine?2:0)
        const sev = s >= 3 ? 'high' : s >= 1 ? 'moderate' : 'low'
        const label = s < 1 ? 'Pousse hypertensive simple' : (s < 3 ? 'Urgence hypertensive (PA > 180/120)' : 'Urgence hypertensive (AVC, OAP, HTIC) - BAISSE PA PROGRESSIVE')
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Poussee hypertensive - Traitement per os',severity:'low' as const},
          {min:1,max:2,label:'Urgence - Baisse PA progressive (IV)',severity:'moderate' as const},
          {min:3,max:999,label:'Urgence vitale - PEC specialisee',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Urgence hypertensive: PAS > 180 ou PAD > 120 sans atteinte d\'organe. Urgence hypertensive: meme PA avec atteinte d\'organe cible.`,
  clinicalCommentary: `L\'urgence hypertensive necessite une baisse PA progressive (25% en 2h). En cas d\'AVC ischemique, ne pas baisser la PA sauf si > 220/120. Agir vite mais progressivement.`,
  references: [
    {type:`pubmed`,title:`Williams B et al. Eur Heart J 2018`,pmid:`30165516`}
  ],
}
export default urgence_hta
