import type { FormulaDefinition } from '../types'

const ascite: FormulaDefinition = {
  id: `ascite`, slug: `ascite`,
  name: `Ascite (Diagnostic)`,
  specialty: `divers`, category: `Abdominal`,
  description: `Gradient albumine serum-ascite (SAAG) pour diagnostic differentiel`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`albumine_s`,type:`number`,label:`Albumine serique`,unit:`g/L`},
    {id:`albumine_a`,type:`number`,label:`Albumine ascitique`,unit:`g/L`},
  ],
  calculate: (values) => {
    const s = parseFloat(values.albumine_s)||35; const a = parseFloat(values.albumine_a)||10
        const saag = Math.round((s-a)*10)/10; const label = 'SAAG = ' + saag + ' - ' + (saag >= 11 ? 'Transudat (cirrhose/IC)' : 'Exsudat (cancer/tuberculose)')
        const retval = saag; const retlabel = label; const retsev = 'low'
        const ranges = [{min:11,max:999,label:'Transudat (cirrhose/IC)',severity:'low' as const},{min:0,max:10.9,label:'Exsudat (cancer/tuberculose)',severity:'low' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `SAAG >= 11 = transudat (hypertension portale). SAAG < 11 = exsudat.`,
  clinicalCommentary: `Le SAAG est plus fiable que la distinction proteines < 25 vs > 25 g/L.`,
  references: [
    {type:`pubmed`,title:`Runyon BA. Hepatology 1988`,pmid:`3192184`}
  ],
}
export default ascite
