import type { FormulaDefinition } from '../types'

const chads2: FormulaDefinition = {
  id: `chads2`, slug: `chads2`,
  name: `CHADS2 (Score)`,
  specialty: `cardiologie`, category: `ACFA`,
  description: `Risque embolique sur ACFA (score CHADS2)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`ic`,type:`radio`,label:`Insuffisance cardiaque`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`hta`,type:`radio`,label:`Hypertension arterielle`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`age75`,type:`radio`,label:`Age ≥ 75 ans`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`diabete`,type:`radio`,label:`Diabete`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`avc`,type:`radio`,label:`AVC / AIT (antecédent)`,options:[{value:0,label:`Non`},{value:2,label:`Oui`}]},
  ],
  calculate: (values) => {
    const s = (values.ic?1:0)+(values.hta?1:0)+(values.age75?1:0)+(values.diabete?1:0)+(values.avc?2:0)
        const sev = s >= 2 ? 'high' : s == 1 ? 'moderate' : 'low'
        const label = s === 0 ? 'Faible risque (0%/an)' : s === 1 ? 'Risque modere (1.3%/an)' : 'Risque eleve (> 2%/an)'
        const retval = s
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:0,label:'0 - Faible (0.5%/an)',severity:'low' as const},
          {min:1,max:1,label:'1 - Modere (1.3%/an)',severity:'moderate' as const},
          {min:2,max:2,label:'2 - Eleve (2.2%/an)',severity:'high' as const},
          {min:3,max:3,label:'3 - Eleve (3.2%/an)',severity:'high' as const},
          {min:4,max:4,label:'4 - Eleve (4.0%/an)',severity:'high' as const},
          {min:5,max:5,label:'5 - Tres eleve (6.7%/an)',severity:'high' as const},
          {min:6,max:6,label:'6 - Tres eleve (9.8%/an)',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le score CHADS2 estime le risque d'AVC ischemique chez les patients en fibrillation atriale. Un score ≥ 2 justifie une anticoagulation.`,
  clinicalCommentary: `Le CHADS2 est progressivement remplace par le CHA2DS2-VASc qui offre une meilleure discrimination pour les faibles risques. L'anticoagulation est recommandee si score ≥ 2 chez l'homme ou ≥ 3 chez la femme.`,
  references: [
    {type:`pubmed`,title:`Gage BF et al. JAMA 2001`,pmid:`11453739`}
  ],
}
export default chads2
