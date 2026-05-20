import type { FormulaDefinition } from '../types'

const drake: FormulaDefinition = {
  id: `drake`, slug: `drake`,
  name: `Drake (Index)`,
  specialty: `nephrologie`, category: `Indice`,
  description: `Index de Drake pour le diagnostic de l'IRA fonctionnelle vs organique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`na_u`,type:`number`,label:`Sodium urinaire`,unit:`mmol/L`},
    {id:`creatinine_u`,type:`number`,label:`Creatinine urinaire`,unit:`mmol/L`},
    {id:`creatinine_s`,type:`number`,label:`Creatinine serique`,unit:`micromol/L`},
  ],
  calculate: (values) => {
    const naU = parseFloat(values.na_u)||0; const creatU = parseFloat(values.creatinine_u)||0; const creatS = parseFloat(values.creatinine_s)||80
        const feNa = creatU > 0 && creatS > 0 ? (naU * creatS) / (creatU * 140) * 100 : 0
        const arr = Math.round(feNa * 100) / 100
        const sev = arr < 1 ? 'low' : arr >= 2 ? 'high' : 'moderate'
        const retval = arr; const retlabel = 'FENa = ' + arr + '%'; const retsev = sev
        const ranges = [
          {min:0,max:0.99,label:'< 1% - IRA pre-renale',severity:'low' as const},
          {min:1,max:1.99,label:'1-2% - Zone indeterminee',severity:'moderate' as const},
          {min:2,max:999,label:'>= 2% - IRA organique (NTA)',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `La FENa distingue IRA fonctionnelle (< 1%) d'organique (> 2%).`,
  clinicalCommentary: `Faussement basse si cirrhose, ICC ou contraste IV. Utiliser FEUree si diuretiques.`,
  references: [
    {type:`pubmed`,title:`Miller TR et al. Am J Med 1978`,pmid:`757214`}
  ],
}
export default drake
