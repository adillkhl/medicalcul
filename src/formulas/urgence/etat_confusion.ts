import type { FormulaDefinition } from '../types'

const etat_confusion: FormulaDefinition = {
  id: `etat_confusion`, slug: `etat_confusion`,
  name: `Etat confusionnel aigu (Diagnostic)`,
  specialty: `urgence`, category: `Confusion`,
  description: `Diagnostic differentiel de l\'etat confusionnel aigu: causes infectieuses, metaboliques, toxiques`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`fievre`,type:`boolean`,label:`Fievre / signes infectieux`,weight:1},
    {id:`medicaments`,type:`boolean`,label:`Medicaments (psychotropes, antiparkinsoniens)`,weight:1},
    {id:`sevrage`,type:`boolean`,label:`Sevrage (alcool, benzodiazepines)`,weight:1},
    {id:`metabolique`,type:`boolean`,label:`Trouble metabolique (Na, Ca, uree, glucose)`,weight:1},
    {id:`hypoxie`,type:`boolean`,label:`Hypoxie / retention CO2`,weight:1},
    {id:`age_plus`,type:`boolean`,label:`Age > 65 ans`,weight:1},
    {id:`demence`,type:`boolean`,label:`Atcd demence / AVC`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.fievre?1:0)+(values.medicaments?1:0)+(values.sevrage?1:0)+(values.metabolique?1:0)+(values.hypoxie?1:0)+(values.age_plus?1:0)+(values.demence?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        let label = ''
        if (values.sevrage && values.fievre) label = 'Delirium tremens probable';
        else if (values.fievre) label = 'Sepsis/Infection a explorer';
        else if (values.medicaments) label = 'Iatrogenie medicamenteuse';
        else if (values.metabolique) label = 'Encephalopathie metabolique';
        else label = 'Confusion multifactorielle';
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Cause simple',severity:'low' as const},
          {min:2,max:3,label:'Rechercher cause + bilan',severity:'moderate' as const},
          {min:4,max:7,label:'Multifactoriel - Hospitalisation',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L\'etat confusionnel aigu (delirium) est une urgence medicale dont la cause doit etre identifiee rapidement.`,
  clinicalCommentary: `CAM-ICU est l outil de reference en reanimation. Traiter la cause sous-jacente. Haloperidol en 2e intention si agitation severe.`,
  references: [
    {type:`pubmed`,title:`Inouye SK et al. N Engl J Med 2014`,pmid:`24988296`}
  ],
}
export default etat_confusion
