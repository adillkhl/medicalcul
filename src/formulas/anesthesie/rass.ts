import type { FormulaDefinition } from '../types'

const rass: FormulaDefinition = {
  id: `rass`, slug: `rass`,
  name: `RASS - Richmond (Agitation-Sedation)`,
  specialty: `anesthesie`, category: `Sedation`,
  description: `Richmond Agitation-Sedation Scale: -5 (inconscient) a +4 (combatif)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`niveau`,type:`radio`,label:`Niveau RASS`,options:[{value:4,label:`+4 - Combatif, danger immediat`},{value:3,label:`+3 - Tres agite, tire sur les tubes`},{value:2,label:`+2 - Agite`},{value:1,label:`+1 - Nerveux`},{value:0,label:`0 - Alerte et calme`},{value:-1,label:`-1 - Somnolent`},{value:-2,label:`-2 - Sedation legere`},{value:-3,label:`-3 - Sedation moderee`},{value:-4,label:`-4 - Sedation profonde`},{value:-5,label:`-5 - Inconscient`}]},
  ],
  calculate: (values) => {
    const n = values.niveau ?? 0
    const labels: Record<number, string> = {4:'Combatif',3:'Tres agite',2:'Agite',1:'Nerveux',0:'Alerte et calme','-1':'Somnolent','-2':'Sedation legere','-3':'Sedation moderee','-4':'Sedation profonde','-5':'Inconscient'}
    const sev = n >= 3 ? 'high' : n >= 1 ? 'moderate' : n <= -4 ? 'high' : n <= -2 ? 'moderate' : 'low'
    return {value:n, label:labels[n]||'', severity: sev,
      ranges:[
      {min:-5,max:-5,label:`-5 Inconscient - Trop profond`,severity:`high`},
      {min:-4,max:-4,label:`-4 Sedation profonde`,severity:`high`},
      {min:-3,max:-3,label:`-3 Sedation moderee`,severity:`moderate`},
      {min:-2,max:-2,label:`-2 Sedation legere`,severity:`low`},
      {min:-1,max:-1,label:`-1 Somnolent`,severity:`low`},
      {min:0,max:0,label:`0 Alerte et calme`,severity:`low`},
      {min:1,max:1,label:`+1 Nerveux`,severity:`moderate`},
      {min:2,max:2,label:`+2 Agite`,severity:`moderate`},
      {min:3,max:3,label:`+3 Tres agite`,severity:`high`},
      {min:4,max:4,label:`+4 Combatif`,severity:`high`},
      ]}
  },
  interpretation: `Le RASS est l'echelle de sedation-agitation de reference en reanimation (-5 a +4). Objectif: 0 a -2.`,
  clinicalCommentary: `Remplace Ramsay. L'arret quotidien de la sedation reduit la duree de ventilation mecanique.`,
  references: [
    {type:`pubmed`,title:`Sessler CN et al. Am J Respir Crit Care Med 2002`,pmid:`12421743`}
  ],
}
export default rass
