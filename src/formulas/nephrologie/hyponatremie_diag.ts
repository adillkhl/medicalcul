import type { FormulaDefinition } from '../types'

const hyponatremie_diag: FormulaDefinition = {
  id: `hyponatremie_diag`, slug: `hyponatremie_diag`,
  name: `Hyponatremie (Diagnostic)`,
  specialty: `nephrologie`, category: `Sodium`,
  description: `Approche diagnostique de l\'hyponatremie selon l\'osmolalite et la volemie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`osmolalite`,type:`radio`,label:`Osmolalite plasmatique`,options:[{value:0,label:`Hypo-osmolaire (< 280)`},{value:1,label:`Iso-osmolaire (280-295)`},{value:2,label:`Hyper-osmolaire (> 295)`}]},
    {id:`volemie`,type:`radio`,label:`Volemie clinique`,options:[{value:0,label:`Hypovolemique`},{value:1,label:`Euvolémique`},{value:2,label:`Hypervolemique`}]},
  ],
  calculate: (values) => {
    const osm = parseInt(values.osmolalite)||0; const vol = parseInt(values.volemie)||1
        let label = ''; let sev = 'low'
        if (osm === 1) { label = 'Pseudo-hyponatremie (hyperlipidemie, myeloma)'; sev = 'low'; }
        else if (osm === 2) { label = 'Hyponatremie hyperosmolaire (hyperglycemie)'; sev = 'moderate'; }
        else {
          if (vol === 0) { label = 'Hypovolemique: pertes digestives/diuretiques'; sev = 'moderate'; }
          else if (vol === 1) { label = 'Euvolémique: SIADH, polydipsie, insuffisance surrenale'; sev = 'moderate'; }
          else { label = 'Hypervolemique: ICC, cirrhose, syndrome nephrotique'; sev = 'high'; }
        }
        const retval = osm*3+vol; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:2,label:'SIADH - cause la plus frequente',severity:'low' as const},
          {min:3,max:5,label:'Necessite bilan etiologique',severity:'moderate' as const},
          {min:6,max:8,label:'Risque de myelinolyse centro-pontine',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L\'hyponatremie est le desordre electrolytique le plus frequent. Classification par osmolalite et volemie.`,
  clinicalCommentary: `Correction de l\'hyponatremie severe (< 125) ne doit pas depasser 8-10 mmol/L/24h pour eviter la myelinolyse.`,
  references: [
    {type:`pubmed`,title:`Spasovski G et al. Eur J Endocrinol 2014`,pmid:`24569128`}
  ],
}
export default hyponatremie_diag
