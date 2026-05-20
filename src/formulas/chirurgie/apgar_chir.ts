import type { FormulaDefinition } from '../types'

const apgar_chir: FormulaDefinition = {
  id: `apgar_chir`, slug: `apgar_chir`,
  name: `Apgar Chirurgical (Score)`,
  specialty: `chirurgie`, category: `Severite`,
  description: `Score pronostique de severite et de mortalite post-operatoire en 3 items (0-10)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`pertes_sang`,type:`radio`,label:`Pertes sanguines`,options:[{value:0,label:`< 100 mL`},{value:1,label:`100-500 mL`},{value:2,label:`> 500 mL`}]},
    {id:`pam_min`,type:`radio`,label:`PAM minimale per-op`,options:[{value:0,label:`> 100 mmHg`},{value:1,label:`70-100 mmHg`},{value:2,label:`< 70 mmHg`}]},
    {id:`fc_min`,type:`radio`,label:`FC minimale per-op`,options:[{value:0,label:`> 80/min`},{value:1,label:`50-80/min`},{value:2,label:`< 50/min`}]},
  ],
  calculate: (values) => {
    const s = (values.pertes_sang?0:4)+(values.pam_min?0:4)+(values.fc_min?0:3)
    const sev = s <= 4 ? 'high' : s <= 7 ? 'moderate' : 'low'
    const label = s <= 4 ? 'Risque eleve' : s <= 7 ? 'Risque modere' : 'Risque faible'
    return {value:10-s, label: (10-s)+'/10', severity: sev,
      ranges:[
        {min:0,max:4,label:'Apgar < 5 - Risque eleve de complications',severity:'high'},
        {min:5,max:7,label:'Apgar 5-7 - Risque modere',severity:'moderate'},
        {min:8,max:10,label:'Apgar 8-10 - Faible risque',severity:'low'},
      ]}
  },
  interpretation: `L'Apgar Chirurgical evalue le pronostic post-operatoire immediat (pertes sanguines, PAM, FC). Score < 5 = risque eleve de complications majeures.`,
  clinicalCommentary: `Simple, rapide, utilisable en SSPI. Correlle a la mortalite a 30 jours. Un score bas doit alerter pour une surveillance renforcee.`,
  references: [
    {type:`pubmed`,title:`Gawande AA et al. BMJ 2007`,pmid:`17412784`}
  ],
}
export default apgar_chir
