import type { FormulaDefinition } from '../types'

const pft: FormulaDefinition = {
  id: `pft`, slug: `pft`,
  name: `Explorations fonctionnelles respiratoires (Interpretation)`,
  specialty: `pneumologie`, category: `PFT`,
  description: `Interpretation des EFR: syndrome obstructif, restrictif ou mixte`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`vems`,type:`number`,label:`VEMS`,unit:`L`},
    {id:`cvf`,type:`number`,label:`CVF`,unit:`L`},
    {id:`vems_cvf`,type:`number`,label:`VEMS/CVF`,unit:`%`},
  ],
  calculate: (values) => {
    const vems = parseFloat(values.vems)||0; const cvf = parseFloat(values.cvf)||0; const ratio = parseFloat(values.vems_cvf)||70
        let label = ''; let sev = 'low'
        if (ratio < 70) {
          label = 'Syndrome obstructif' + (vems < 50 ? ' severe' : vems < 70 ? ' moderee' : ' leger')
          sev = vems < 50 ? 'high' : vems < 70 ? 'moderate' : 'low'
        } else if (cvf < 80) {
          label = 'Syndrome restrictif' + (cvf < 50 ? ' severe' : cvf < 65 ? ' modere' : ' leger')
          sev = cvf < 50 ? 'high' : cvf < 65 ? 'moderate' : 'low'
        } else { label = 'EFR normales'; sev = 'low' }
        const retval = ratio; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:49,label:'Obstruction severe',severity:'high' as const},
          {min:50,max:69,label:'Obstruction moderee',severity:'moderate' as const},
          {min:70,max:999,label:'Pas d obstruction (ou restrictif si CVF basse)',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `VEMS/CVF < 70% = syndrome obstructif (BPCO, asthme). CVF < 80% avec ratio normal = syndrome restrictif.`,
  clinicalCommentary: `Interpreter les EFR apres bronchodilatateur. Le VEMS classe la severite de l'obstruction GOLD.`,
  references: [
    {type:`pubmed`,title:`Pellegrino R et al. Eur Respir J 2005`,pmid:`16385558`}
  ],
}
export default pft
