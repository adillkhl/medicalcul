import type { FormulaDefinition } from '../types'

const clairance_phosphore: FormulaDefinition = {
  id: `clairance_phosphore`, slug: `clairance_phosphore`,
  name: `Clairance du phosphore`,
  specialty: `nephrologie`, category: `Phosphore`,
  description: `Calcul de la clairance du phosphore`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`phos_u`,type:`number`,label:`Phosphore urinaire`,unit:`mmol/24h`},
    {id:`phos_s`,type:`number`,label:`Phosphore serique`,unit:`mmol/L`},
    {id:`creat_u`,type:`number`,label:`Creatinine urinaire`,unit:`mmol/24h`},
    {id:`creat_s`,type:`number`,label:`Creatinine serique`,unit:`micromol/L`},
  ],
  calculate: (values) => {
    const pu = parseFloat(values.phos_u)||0; const ps = parseFloat(values.phos_s)||1; const cu = parseFloat(values.creat_u)||10; const cs = parseFloat(values.creat_s)||80
        const cl = pu * cs / (ps * cu * 1000); const arr = Math.round(cl*100)/100
        const retval = arr; const retlabel = arr+' mL/min'; const retsev = 'low'
        const ranges = [{min:0,max:999,label:'Clairance phosphore calculee',severity:'low' as const}]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Clairance du phosphore = (PU x CrS) / (PS x CrU). Normale: 10-20 mL/min.`,
  clinicalCommentary: `La clairance du phosphore diminue avec l'age.`,
  references: [
    {type:`pubmed`,title:`Bingham SA et al. Br J Nutr 1990`,pmid:`---`}
  ],
}
export default clairance_phosphore
