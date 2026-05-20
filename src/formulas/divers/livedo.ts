import type { FormulaDefinition } from '../types'

const livedo: FormulaDefinition = {
  id: `livedo`, slug: `livedo`,
  name: `Livedo (Classification)`,
  specialty: `divers`, category: `Vasculaire`,
  description: `Classification du livedo racemosa vs cutis`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`type`,type:`radio`,label:`Type`,options:[{value:0,label:`Reticulaires, fins, mailles completes`},{value:1,label:`Racemosa, tronconiques, mailles incompletes`}]},
    {id:`systemique`,type:`boolean`,label:`Signes systemiques`,weight:1},
    {id:`vascularite`,type:`boolean`,label:`Vascularite connue`,weight:1},
    {id:`coagulation`,type:`boolean`,label:`Anticoagulant circulant / SAPL`,weight:1},
  ],
  calculate: (values) => {
    const type = parseInt(values.type)||0; const s = (values.systemique?1:0)+(values.vascularite?1:0)+(values.coagulation?1:0)
        const sev = s >= 2 ? 'high' : s === 1 ? 'moderate' : 'low'
        const label = type === 0 ? 'Livedo reticulare - Benin' : 'Livedo racemosa - Rechercher cause systemique'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:0,label:'Benin',severity:'low' as const},{min:1,max:1,label:'Surveillance + bilan',severity:'moderate' as const},{min:2,max:3,label:'Cause systemique - Avis',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le livedo reticulare est benin (froid). Le livedo racemosa est associe a des pathologies (vascularite, SAPL).`,
  clinicalCommentary: `Le livedo racemosa peut etre lie a un SAPL, une vascularite (PAN), ou une thrombophilie.`,
  references: [
    {type:`pubmed`,title:`Kraemer M. J Neurol 2005`,pmid:`16057946`}
  ],
}
export default livedo
