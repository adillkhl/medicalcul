import type { FormulaDefinition } from '../types'

const tubulopathie: FormulaDefinition = {
  id: `tubulopathie`, slug: `tubulopathie`,
  name: `Tubulopathie (Diagnostic)`,
  specialty: `nephrologie`, category: `Tubule`,
  description: `Classification diagnostique des tubulopathies renales`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`trouble`,type:`radio`,label:`Trouble principal`,options:[{value:0,label:`Acidose metabolique`},{value:1,label:`Hypokaliemie`},{value:2,label:`Hypophosphatemie`},{value:3,label:`Polyurie`}]},
    {id:`fanconi`,type:`boolean`,label:`Syndrome de Fanconi`,weight:1},
    {id:`diabete`,type:`boolean`,label:`Diabete nephrogene`,weight:1},
    {id:`nephrocalcinose`,type:`boolean`,label:`Nephrocalcinose / lithiase`,weight:1},
  ],
  calculate: (values) => {
    const trouble = parseInt(values.trouble)||0; const fan = values.fanconi?1:0; const dn = values.diabete?1:0; const nc = values.nephrocalcinose?1:0
        const s = fan + dn + nc
        const sev = s >= 2 ? 'high' : s === 1 ? 'moderate' : 'low'
        const retval = s; const retlabel = 'Score: ' + s; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Bilan ionique',severity:'low' as const},
          {min:1,max:1,label:'Atteinte tubulaire moderee',severity:'moderate' as const},
          {min:2,max:3,label:'Avis specialise',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Tubulopathies: maladies du tube renal entrainant des perturbations electrolytiques.`,
  clinicalCommentary: `Devant une tubulopathie: bilan phosphocalcique, glycosurie, aminoacidurie, pH urinaire.`,
  references: [
    {type:`pubmed`,title:`Downie ML et al. Pediatr Nephrol 2023`,pmid:`35907936`}
  ],
}
export default tubulopathie
