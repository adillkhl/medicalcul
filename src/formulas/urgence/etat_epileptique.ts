import type { FormulaDefinition } from '../types'

const etat_epileptique: FormulaDefinition = {
  id: `etat_epileptique`, slug: `etat_epileptique`,
  name: `Etat de mal epileptique (Classification)`,
  specialty: `urgence`, category: `Epilepsie`,
  description: `Classification et prise en charge de l'etat de mal epileptique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`type`,type:`radio`,label:`Type`,options:[{value:0,label:`Convulsif generalise`},{value:1,label:`Partiel simple`},{value:2,label:`Absence / partiel complexe`}]},
    {id:`duree`,type:`radio`,label:`Duree`,options:[{value:0,label:`< 5 min`},{value:1,label:`5-30 min`},{value:2,label:`> 30 min`}]},
    {id:`repetition`,type:`boolean`,label:`Crises repetees sans reprise conscience`,weight:1},
    {id:`resistant`,type:`boolean`,label:`Resistant a 2 anti-epileptiques`,weight:1},
    {id:`etiologie`,type:`boolean`,label:`Cause aigue (AVC, infection, traumatisme)`,weight:1},
  ],
  calculate: (values) => {
    const type = parseInt(values.type)||0; const duree = parseInt(values.duree)||0
        const s = duree + (values.repetition?1:0) + (values.resistant?2:0) + (values.etiologie?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        let label = ''
        if (duree === 0) label = 'Crise epileptique < 5 min - Pas un etat de mal';
        else if (s < 4) label = 'Etat de mal etabli (5-30 min) - Benzodiazepine + Phenytoine';
        else label = 'Etat de mal refractaire - Anesthesie reanimation';
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Crise isolee',severity:'low' as const},
          {min:2,max:3,label:'Etat de mal - Traitement',severity:'moderate' as const},
          {min:4,max:999,label:'Etat de mal refractaire - Reanimation',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'etat de mal epileptique est defini par une crise prolongee > 5 min ou des crises repetees sans reprise de conscience. Urgence therapeutique.`,
  clinicalCommentary: `Protocole: 1) Benzodiazepine IV (diazepam 10 mg ou clonazepam 1 mg). 2) Phenytoine 15-20 mg/kg ou phenobarbital. 3) Anesthesie generale (propofol, midazolam) si refractaire. EEG continu si persistant.`,
  references: [
    {type:`pubmed`,title:`Brophy GM et al. Neurocrit Care 2012`,pmid:`22585041`}
  ],
}
export default etat_epileptique
