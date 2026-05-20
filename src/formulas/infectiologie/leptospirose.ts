import type { FormulaDefinition } from '../types'

const leptospirose: FormulaDefinition = {
  id: `leptospirose`, slug: `leptospirose`,
  name: `Leptospirose (Diagnostic)`,
  specialty: `infectiologie`, category: `Bacteriose`,
  description: `Score diagnostique de leptospirose (fievre, ictere, insuffisance renale, etc.)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`fievre`,type:`boolean`,label:`Fievre`,weight:1},
    {id:`ictere`,type:`boolean`,label:`Ictere`,weight:1},
    {id:`insuf_renale`,type:`boolean`,label:`Insuffisance renale aigue`,weight:1},
    {id:`cephalees`,type:`boolean`,label:`Cephalees severes`,weight:1},
    {id:`myalgies`,type:`boolean`,label:`Myalgies (mollets, lombaires)`,weight:1},
    {id:`hemorragie`,type:`boolean`,label:`Signes hemorragiques`,weight:1},
    {id:`exposition`,type:`boolean`,label:`Exposition a risque (eau douce, rats, agriculture)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.fievre?1:0)+(values.ictere?1:0)+(values.insuf_renale?1:0)+(values.cephalees?1:0)+(values.myalgies?1:0)+(values.hemorragie?1:0)+(values.exposition?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const label = s < 2 ? 'Peu probable' : s < 4 ? 'Possible - Serologie' : 'Probable - Traitement empirique + serologie'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:1,label:'Peu probable',severity:'low' as const},{min:2,max:3,label:'Possible - Serologie',severity:'moderate' as const},{min:4,max:7,label:'Probable - Amoxicilline',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Leptospirose: fievre + ictere + insuffisance renale + exposition. Traitement: amoxicilline ou doxycycline.`,
  clinicalCommentary: `Incubation 7-12 jours. Maladie professionnelle (agriculteurs, egoutiers).`,
  references: [
    {type:`pubmed`,title:`Bharti AR. Lancet Infect Dis 2003`,pmid:`14506095`}
  ],
}
export default leptospirose
