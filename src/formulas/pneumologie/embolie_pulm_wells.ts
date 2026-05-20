import type { FormulaDefinition } from '../types'

const embolie_pulm_wells: FormulaDefinition = {
  id: `embolie_pulm_wells`, slug: `embolie_pulm_wells`,
  name: `Wells PE (Score)`,
  specialty: `pneumologie`, category: `Embolie pulmonaire`,
  description: `Probabilite clinique d'embolie pulmonaire (score de Wells)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`signes_tvp`,type:`boolean`,label:`Signes cliniques de TVP (3 points)`,weight:1},
    {id:`diagnostic_autre`,type:`boolean`,label:`Diagnostic alternatif moins probable (3 points)`,weight:1},
    {id:`fc_100`,type:`boolean`,label:`FC > 100/min (1.5 points)`,weight:1},
    {id:`immobilisation`,type:`boolean`,label:`Immobilisation > 3 jours ou chirurgie < 4 sem (1.5 points)`,weight:1},
    {id:`atcd_mte`,type:`boolean`,label:`ATCD TVP/EP (1.5 points)`,weight:1},
    {id:`hemoptysie`,type:`boolean`,label:`Hemoptysie (1 point)`,weight:1},
    {id:`cancer`,type:`boolean`,label:`Cancer actif (1 point)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.signes_tvp?3:0)+(values.diagnostic_autre?3:0)+(values.fc_100?1.5:0)+(values.immobilisation?1.5:0)+(values.atcd_mte?1.5:0)+(values.hemoptysie?1:0)+(values.cancer?1:0)
        const sev = s > 6 ? 'high' : s > 3 ? 'moderate' : 'low'
        const label = s <= 3 ? 'Faible probabilite (5-10%)' : s <= 6 ? 'Probabilite moderee (10-30%)' : 'Forte probabilite (> 50%)'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:3,label:'Faible - D-Dimeres',severity:'low' as const},
          {min:3.1,max:6,label:'Moderee - D-Dimeres + AngloTDM si positifs',severity:'moderate' as const},
          {min:6.1,max:999,label:'Forte - AngloTDM direct',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le score de Wells stratifie la probabilite d'EP. Combine signes cliniques, facteurs de risque et diagnostic alternatif.`,
  clinicalCommentary: `Si probabilite faible ou moderee et D-Dimeres negatifs: EP exclue. Si forte probabilite: angioTDM direct.`,
  references: [
    {type:`pubmed`,title:`Wells PS et al. Thromb Haemost 2000`,pmid:`11257330`}
  ],
}
export default embolie_pulm_wells
