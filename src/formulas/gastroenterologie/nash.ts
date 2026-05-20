import type { FormulaDefinition } from '../types'

const nash: FormulaDefinition = {
  id: `nash`, slug: `nash`,
  name: `NASH (Fibrose score)`,
  specialty: `gastroenterologie`, category: `Foie`,
  description: `Score NAFLD fibrosis pour la fibrose dans la NASH`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`age`,type:`number`,label:`Age`,unit:`ans`},
    {id:`imc`,type:`number`,label:`IMC`},
    {id:`diabete`,type:`boolean`,label:`Diabete`,weight:1},
    {id:`asat`,type:`number`,label:`ASAT`,unit:`U/L`},
    {id:`alat`,type:`number`,label:`ALAT`,unit:`U/L`},
    {id:`plaquettes`,type:`number`,label:`Plaquettes`,unit:`G/L`},
    {id:`albumine`,type:`number`,label:`Albumine`,unit:`g/L`},
  ],
  calculate: (values) => {
    const age = parseFloat(values.age)||50; const imc = parseFloat(values.imc)||27; const dm = values.diabete?1:0
        const ast = parseFloat(values.asat)||30; const alt = parseFloat(values.alat)||30; const plt = parseFloat(values.plaquettes)||200; const alb = parseFloat(values.albumine)||40
        const score = -1.675 + 0.037*age + 0.094*imc + 1.13*dm + 0.99*(ast/alt) - 0.013*plt - 0.66*alb
        const sev = score >= 0.676 ? 'high' : score <= -1.455 ? 'low' : 'moderate'
        const label = 'Score: ' + Math.round(score*100)/100
        const retval = Math.round(score*100)/100; const retlabel = label; const retsev = sev
        const ranges = [{min:-999,max:-1.456,label:'Fibrose absente (negatif)',severity:'low' as const},{min:-1.455,max:0.675,label:'Indetermine',severity:'moderate' as const},{min:0.676,max:999,label:'Fibrose significative',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le NAFLD fibrosis score predit la fibrose dans la steatose hepatique non-alcoolique (NASH/NAFLD).`,
  clinicalCommentary: `Score comprenant age, IMC, diabete, AST/ALT, plaquettes, albumine. Un score < -1.455 exclut la fibrose significative avec une VPN > 90%.`,
  references: [
    {type:`pubmed`,title:`Angulo P. Hepatology 2007`,pmid:`17508362`}
  ],
}
export default nash
