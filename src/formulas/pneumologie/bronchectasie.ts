import type { FormulaDefinition } from '../types'

const bronchectasie: FormulaDefinition = {
  id: `bronchectasie`, slug: `bronchectasie`,
  name: `Bronchectasies (Severite)`,
  specialty: `pneumologie`, category: `Bronchectasie`,
  description: `Echelle FACED de severite des bronchectasies`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`vems`,type:`radio`,label:`VEMS`,options:[{value:0,label:`> 50%`},{value:1,label:`<= 50%`}]},
    {id:`fev1`,type:`radio`,label:`Fev1? Non, age`,options:[{value:0,label:`< 70 ans`},{value:1,label:`>= 70 ans`}]},
    {id:`colonisation`,type:`radio`,label:`Colonisation a Pseudomonas`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`extension`,type:`radio`,label:`Nombre de lobes atteints`,options:[{value:0,label:`< 3`},{value:1,label:`>= 3`}]},
    {id:`dyspnee`,type:`radio`,label:`Dyspnee MRC`,options:[{value:0,label:`MRC 0-2`},{value:1,label:`MRC 3-4`}]},
  ],
  calculate: (values) => {
    const s = (parseInt(values.vems)||0)+(parseInt(values.fev1)||0)+(parseInt(values.colonisation)||0)+(parseInt(values.extension)||0)+(parseInt(values.dyspnee)||0)
        const sev = s >= 3 ? 'high' : s >= 1 ? 'moderate' : 'low'
        const label = s <= 0 ? 'FACED 0-1 - Forme legere' : s <= 2 ? 'FACED 2-3 - Forme moderee' : 'FACED 4-5 - Forme severe'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Legere',severity:'low' as const},
          {min:1,max:2,label:'Moderee',severity:'moderate' as const},
          {min:3,max:5,label:'Severe',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le score FACED est un score pronostique dans les bronchectasies (VEMS, age, colonisation P. aeruginosa, etendue, dyspnee).`,
  clinicalCommentary: `Le score FACED predit la mortalite a 5 ans. Le score BSI (Bronchiectasis Severity Index) est plus complet mais plus complexe.`,
  references: [
    {type:`pubmed`,title:`Martinez-Garcia MA et al. Chest 2014`,pmid:`24382551`}
  ],
}
export default bronchectasie
