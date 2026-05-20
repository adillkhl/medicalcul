import type { FormulaDefinition } from '../types'

const syndrome_nephrotique: FormulaDefinition = {
  id: `syndrome_nephrotique`, slug: `syndrome_nephrotique`,
  name: `Syndrome nephrotique (Classification)`,
  specialty: `nephrologie`, category: `Glomerulopathie`,
  description: `Classification du syndrome nephrotique selon la reponse aux corticoides`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`age`,type:`radio`,label:`Age`,options:[{value:0,label:`< 1 an`},{value:1,label:`1-8 ans`},{value:2,label:`> 8 ans`},{value:3,label:`Adulte`}]},
    {id:`hematurie`,type:`boolean`,label:`Hematurie microscopique`,weight:1},
    {id:`hta`,type:`boolean`,label:`Hypertension arterielle`,weight:1},
    {id:`insuf_renale`,type:`boolean`,label:`Insuffisance renale`,weight:1},
    {id:`reponse`,type:`radio`,label:`Reponse aux corticoides`,options:[{value:0,label:`Non traite`},{value:1,label:`Cortico-sensible`},{value:2,label:`Cortico-resistant`}]},
  ],
  calculate: (values) => {
    const age = parseInt(values.age)||0; const hem = values.hematurie?1:0; const hta = values.hta?1:0; const ir = values.insuf_renale?1:0; const rep = parseInt(values.reponse)||0
        const s = hem + hta + ir
        const sev = s >= 2 || rep >= 2 ? 'high' : s === 1 ? 'moderate' : 'low'
        const retval = s; const retlabel = 'Score: ' + s; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'LGM probable si enfant CS',severity:'low' as const},
          {min:1,max:1,label:'Hyalinose/diabetique possible',severity:'moderate' as const},
          {min:2,max:3,label:'GN proliferative probable',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Syndrome nephrotique: classification selon age, reponse aux corticoïdes, signes associes.`,
  clinicalCommentary: `SN cortico-sensible (LGM) le plus frequent chez l\'enfant. Biopsie souvent necessaire chez l\'adulte.`,
  references: [
    {type:`pubmed`,title:`Vivarelli M et al. Nat Rev Nephrol 2023`,pmid:`36510014`}
  ],
}
export default syndrome_nephrotique
