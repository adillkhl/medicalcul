import type { FormulaDefinition } from '../types'

const osla: FormulaDefinition = {
  id: `osla`, slug: `osla`,
  name: `OSA (Apnee du sommeil)`,
  specialty: `pneumologie`, category: `Sommeil`,
  description: `Classification de l\'apnee obstructive du sommeil selon l\'IAH`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`iah`,type:`number`,label:`IAH (Index Apnee-Hypopnee)`,unit:`/h`},
  ],
  calculate: (values) => {
    const iah = parseFloat(values.iah)||0
        const sev = iah >= 30 ? 'high' : iah >= 15 ? 'moderate' : iah >= 5 ? 'low' : 'low'
        const label = iah < 5 ? 'Normal' : iah < 15 ? 'SAS leger' : iah < 30 ? 'SAS modere' : 'SAS severe'
        const retval = iah; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:4.9,label:'Normal (< 5/h)',severity:'low' as const},
          {min:5,max:14.9,label:'SAS leger (5-15/h)',severity:'low' as const},
          {min:15,max:29.9,label:'SAS modere (15-30/h)',severity:'moderate' as const},
          {min:30,max:999,label:'SAS severe (>= 30/h)',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le syndrome d\'apnee du sommeil (SAS) est defini par un IAH >= 5/h avec symptomes ou >= 15/h seul.`,
  clinicalCommentary: `Le traitement par PPC est recommande si IAH >= 30 ou IAH >= 15 avec somnolence diurne ou comorbidites CV.`,
  references: [
    {type:`pubmed`,title:`Kapur VK et al. J Clin Sleep Med 2017`,pmid:`28092060`}
  ],
}
export default osla
