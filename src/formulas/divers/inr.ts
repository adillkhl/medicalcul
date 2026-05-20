import type { FormulaDefinition } from '../types'

const inr: FormulaDefinition = {
  id: `inr`, slug: `inr`,
  name: `INR (Interpretation)`,
  specialty: `divers`, category: `Coagulation`,
  description: `Interpretation de l'INR`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`inr`,type:`number`,label:`INR`},
  ],
  calculate: (values) => {
    const inr = parseFloat(values.inr)||1; let sev = 'low'; let label = 'INR ' + inr
        if (inr >= 5) { sev = 'high'; label += ' - Surdosage severe - Vit K' }
        else if (inr >= 4) { sev = 'moderate'; label += ' - Surdosage - Reduire dose' }
        else if (inr < 2) { label += ' - Sous-dose' }
        else { label += ' - Cible' }
        const retval = inr; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:1.9,label:'Sous-dose',severity:'low' as const},{min:2,max:3,label:'Cible',severity:'low' as const},{min:3.1,max:4.9,label:'Surdosage',severity:'moderate' as const},{min:5,max:999,label:'Surdosage severe',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `INR: cible 2-3. INR > 5 = risque hemorragique eleve.`,
  clinicalCommentary: `INR > 9 sans saignement: Vit K 2-5 mg po. Avec saignement: PPSB + Vit K IV.`,
  references: [
    {type:`pubmed`,title:`Holbrook A. Chest 2012`,pmid:`22315271`}
  ],
}
export default inr
