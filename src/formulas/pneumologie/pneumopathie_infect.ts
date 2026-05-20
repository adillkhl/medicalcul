import type { FormulaDefinition } from '../types'

const pneumopathie_infect: FormulaDefinition = {
  id: `pneumopathie_infect`, slug: `pneumopathie_infect`,
  name: `Pneumopathie infectieuse (Classification)`,
  specialty: `pneumologie`, category: `Infection`,
  description: `Classification des pneumopathies infectieuses (communautaire, nosocomiale, sous ventilation)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`acquisition`,type:`radio`,label:`Acquisition`,options:[{value:0,label:`Communautaire`},{value:1,label:`Soins/Domicile`},{value:2,label:`Nosocomiale (< 48h)`},{value:3,label:`Sous ventilation mecanique`}]},
    {id:`curb65`,type:`radio`,label:`CURB-65`,options:[{value:0,label:`0-1`},{value:1,label:`2`},{value:2,label:`3-5`}]},
    {id:`comorbidites`,type:`boolean`,label:`Comorbidites severes`,weight:1},
    {id:`hypoxie`,type:`boolean`,label:`Hypoxie severe (PaO2 < 60)`,weight:1},
  ],
  calculate: (values) => {
    const acq = parseInt(values.acquisition)||0; const curb = parseInt(values.curb65)||0; const s = curb + (values.comorbidites?1:0) + (values.hypoxie?1:0)
        const sev = s >= 3 || acq >= 2 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const label = (acq===0?'Pneumonie communautaire':acq===1?'Pneumonie sous soins':acq===2?'Pneumonie nosocomiale':'PAVM') + ' - CURB-65: ' + curb
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Traitement ambulatoire',severity:'low' as const},
          {min:2,max:2,label:'Hospitalisation',severity:'moderate' as const},
          {min:3,max:999,label:'Hospitalisation + Reanimation possible',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Les pneumopathies classifient selon le lieu d\'acquisition et la gravite (CURB-65). Les PAVM sont les plus graves.`,
  clinicalCommentary: `Les recommandations antibiotherapie different selon le type. La PAVM est une nosocomiale > 48h de VM.`,
  references: [
    {type:`pubmed`,title:`Mandell LA et al. Clin Infect Dis 2007`,pmid:`17879992`}
  ],
}
export default pneumopathie_infect
