import type { FormulaDefinition } from '../types'

const hypercalcemie_diag: FormulaDefinition = {
  id: `hypercalcemie_diag`, slug: `hypercalcemie_diag`,
  name: `Hypercalcemie (Diagnostic)`,
  specialty: `nephrologie`, category: `Calcium`,
  description: `Approche diagnostique de l'hypercalcemie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`pth`,type:`radio`,label:`PTH`,options:[{value:0,label:`Basse`},{value:1,label:`Adaptee`},{value:2,label:`Elevee inadaptee`}]},
    {id:`calciurie`,type:`boolean`,label:`Calciurie basse`,weight:1},
    {id:`cancer`,type:`boolean`,label:`Cancer connu`,weight:1},
    {id:`sarcoidose`,type:`boolean`,label:`Sarcoidose/granulomatose`,weight:1},
    {id:`iatrogene`,type:`boolean`,label:`Medicaments`,weight:1},
  ],
  calculate: (values) => {
    const pth = parseInt(values.pth)||0; const s = (values.calciurie?1:0)+(values.cancer?1:0)+(values.sarcoidose?1:0)+(values.iatrogene?1:0)
        const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
        let label = 'PTH ' + (pth===0?'basse':pth===1?'normale':'elevee');
        if (pth === 2) label += ' - Hyperparathyroidie primaire';
        else if (pth === 0 && s >= 2) label += ' - Hypercalcemie maligne probable';
        else label += ' - Cause indeterminee';
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Cause non evidente',severity:'low' as const},
          {min:2,max:2,label:'Probable cause identifiee',severity:'moderate' as const},
          {min:3,max:999,label:'Cause identifiee',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'hypercalcemie est le signe biologique le plus frequent en pathologie tumorale. La PTH est le premier examen a demander.`,
  clinicalCommentary: `Hyperparathyroidie primaire et hypercalcemie maligne representent > 90% des causes.`,
  references: [
    {type:`pubmed`,title:`Shane E et al. J Bone Miner Res 2014`,pmid:`24443374`}
  ],
}
export default hypercalcemie_diag
