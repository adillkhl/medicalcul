import type { FormulaDefinition } from '../types'

const asa: FormulaDefinition = {
  id: `asa`, slug: `asa`,
  name: `A.S.A. (Score)`,
  specialty: `anesthesie`, category: `Classification pre-op`,
  description: `Classification ASA de l\'etat general avant anesthesie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`classe`,type:`radio`,label:`Classe ASA`,options:[{value:1,label:`ASA I - Patient sain`},{value:2,label:`ASA II - Maladie legere`},{value:3,label:`ASA III - Maladie severe`},{value:4,label:`ASA IV - Menace vitale`},{value:5,label:`ASA V - Moribond`},{value:6,label:`ASA VI - Mort cerebrale`}]},
    {id:`urgence`,type:`boolean`,label:`Intervention en urgence`,weight:1},
  ],
  calculate: (values) => {
    const c = values.classe??1
    const u = values.urgence ? 'E' : ''
    const labels: Record<number, string> = {1:'ASA I',2:'ASA II',3:'ASA III',4:'ASA IV',5:'ASA V',6:'ASA VI'}
    const sev = c>=4?'high':c>=3?'moderate':'low'
    return {value:c, label:(labels[c]||'')+u, severity: sev,
      ranges:[
      {min:1,max:1,label:`ASA I`,severity:`low`},
      {min:2,max:2,label:`ASA II`,severity:`low`},
      {min:3,max:3,label:`ASA III`,severity:`moderate`},
      {min:4,max:4,label:`ASA IV`,severity:`high`},
      {min:5,max:5,label:`ASA V`,severity:`critical`},
      {min:6,max:6,label:`ASA VI`,severity:`critical`},
      ]}
  },
  interpretation: `La classification ASA evalue le risque anesthesique. Le suffixe E (urgence) majore le risque.`,
  clinicalCommentary: `Classification universelle mais subjective. Forte correlation avec la mortalite post-operatoire.`,
  references: [
    {type:`pubmed`,title:`ASA Physical Status Classification. Anesthesiology 2020`,pmid:`32649373`}
  ],
}
export default asa
