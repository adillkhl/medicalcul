import type { FormulaDefinition } from '../types'

const brulure_gravite: FormulaDefinition = {
  id: `brulure_gravite`, slug: `brulure_gravite`,
  name: `Brulure (Gravite)`,
  specialty: `urgence`, category: `Brulure`,
  description: `Evaluation de la gravite d'une brulure (profondeur, surface, circonstances)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`profondeur`,type:`radio`,label:`Profondeur`,options:[{value:0,label:`1er degre (erytheme)`},{value:1,label:`2e degre superficiel`},{value:2,label:`2e degre profond`},{value:3,label:`3e degre (carbonisation)`}]},
    {id:`surface`,type:`radio`,label:`Surface SCB`,options:[{value:0,label:`< 10%`},{value:1,label:`10-20%`},{value:2,label:`20-40%`},{value:3,label:`> 40%`}]},
    {id:`inhalation`,type:`boolean`,label:`Inhalation de fumees`,weight:1},
    {id:`age`,type:`boolean`,label:`Age < 5 ou > 60 ans`,weight:1},
    {id:`localisation`,type:`boolean`,label:`Face/mains/perinee/plis`,weight:1},
  ],
  calculate: (values) => {
    const p = parseInt(values.profondeur)||0; const s = parseInt(values.surface)||0; const s_total = s + (values.inhalation?2:0) + (values.age?1:0) + (values.localisation?1:0)
        const sev = s_total >= 5 ? 'critical' : s_total >= 3 ? 'high' : s_total >= 1 ? 'moderate' : 'low'
        const retval = s_total; const retlabel = 'Score: ' + s_total; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Brulure benigne - Soins locaux',severity:'low' as const},
          {min:1,max:2,label:'Brulure moderee - Consultation',severity:'moderate' as const},
          {min:3,max:4,label:'Brulure grave - Hospitalisation',severity:'high' as const},
          {min:5,max:999,label:'Brulure severe - Centre de brules',severity:'critical' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `La gravite d'une brulure combine profondeur, surface SCB, age, inhalation et localisation. Les brulures du 3e degre > 10% SCB sont graves.`,
  clinicalCommentary: `Les brulures de la face peuvent entrainer un oedeme des VAS. Les brulures circulaires des membres necessitent une escarrotomie.`,
  references: [
    {type:`pubmed`,title:`Hettiaratchy S, Dziewulski P. BMJ 2004`,pmid:`15087358`}
  ],
}
export default brulure_gravite
