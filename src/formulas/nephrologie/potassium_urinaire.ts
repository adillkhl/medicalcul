import type { FormulaDefinition } from '../types'

const potassium_urinaire: FormulaDefinition = {
  id: `potassium_urinaire`, slug: `potassium_urinaire`,
  name: `Potassium urinaire (Interpretation)`,
  specialty: `nephrologie`, category: `Potassium`,
  description: `Interpretation du potassium urinaire pour les troubles de la kaliemie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`k_urinaire`,type:`number`,label:`Kaliurese des 24h`,unit:`mmol/24h`},
    {id:`contexte`,type:`radio`,label:`Contexte`,options:[{value:0,label:`Hypokaliemie`},{value:1,label:`Hyperkaliemie`}]},
  ],
  calculate: (values) => {
    const k = parseFloat(values.k_urinaire)||0; const ctx = parseInt(values.contexte)||0
        let label = ''; let sev = 'low'
        if (ctx === 0) {
            label = k < 15 ? 'Pertes extra-renales' : 'Pertes renales (diuretiques, tubulopathie)'
            sev = k >= 15 ? 'moderate' : 'low'
        } else {
            label = k < 30 ? 'Pertes renales adaptees' : 'Pertes extra-renales possible'
            sev = k >= 30 ? 'moderate' : 'low'
        }
        const retval = k; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:999,label:'Voir interpretation',severity:'low' as const}]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Kaliurese des 24h: Hypokaliemie < 15 mmol/24h = pertes digestives; >= 15 = pertes renales.`,
  clinicalCommentary: `TTKG peut aider. Attention aux diuretiques.`,
  references: [
    {type:`pubmed`,title:`Kam KS, Singer I. Am J Nephrol 1990`,pmid:`2192586`}
  ],
}
export default potassium_urinaire
