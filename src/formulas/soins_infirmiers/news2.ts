import type { FormulaDefinition } from '../types'

const news2: FormulaDefinition = {
  id: `news2`, slug: `news2`,
  name: `NEWS2 (Score alerte precoce)`,
  specialty: `soins_infirmiers`, category: `Surveillance`,
  description: `National Early Warning Score pour detection deterioration clinique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`fc`,type:`number`,label:`Frequence cardiaque`,unit:`/min`},
    {id:`fr`,type:`number`,label:`Frequence respiratoire`,unit:`/min`},
    {id:`pas`,type:`number`,label:`PA systolique`,unit:`mmHg`},
    {id:`spo2`,type:`number`,label:`SpO2`,unit:`%`},
    {id:`supp_o2`,type:`boolean`,label:`Sous oxygene`,weight:1},
    {id:`temperature`,type:`number`,label:`Temperature`,unit:`C`},
    {id:`conscience`,type:`radio`,label:`Conscience`,options:[{value:0,label:`Alerte`},{value:1,label:`Confuse`}]},
  ],
  calculate: (values) => {
    const fc = parseFloat(values.fc)||75; const fr = parseFloat(values.fr)||16; const pas = parseFloat(values.pas)||130; const spo2 = parseFloat(values.spo2)||97; const supp = values.supp_o2?1:0; const temp = parseFloat(values.temperature)||37; const cons = parseInt(values.conscience)||0
        let s = 0
        if (fc <= 40 || fc >= 131) s += 3; else if (fc <= 50 || fc >= 111) s += 2; else if (fc >= 91) s += 1
        if (fr <= 8 || fr >= 25) s += 3; else if (fr >= 21) s += 2
        if (pas <= 90) s += 3; else if (pas <= 100) s += 2; else if (pas >= 220) s += 3
        if (spo2 <= 83) s += 3; else if (spo2 <= 85) s += 2; else if (spo2 <= 87) s += 1; else if (spo2 <= 93 && !supp) s += 1
        if (supp) s += 2; if (temp <= 35) s += 3; else if (temp >= 39) s += 2; else if (temp >= 38) s += 1
        if (cons) s += 3
        const sev = s >= 7 ? 'high' : s >= 5 ? 'moderate' : s >= 1 ? 'low' : 'low'
        const label = 'NEWS2: ' + s
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:4,label:'Standard',severity:'low' as const},{min:5,max:6,label:'Alerte',severity:'moderate' as const},{min:7,max:999,label:'Urgence vitale',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `NEWS2: score de deterioration clinique (7 parametres). Score >= 5 = alerte. >= 7 = urgence.`,
  clinicalCommentary: `Recommande par NICE pour detection precoce du sepsis.`,
  references: [
    {type:`pubmed`,title:`RCP. NEWS2 2017`,pmid:`---`}
  ],
}
export default news2
