import type { FormulaDefinition } from '../types'

const ramsay: FormulaDefinition = {
  id: `ramsay`, slug: `ramsay`,
  name: `Ramsay (Echelle)`,
  specialty: `anesthesie`, category: `Sedation`,
  description: `Echelle de niveau de sedation (6 niveaux)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`niveau`,type:`radio`,label:`Niveau Ramsay`,options:[{value:1,label:`1 - Anxieux, agite`},{value:2,label:`2 - Cooperant, oriente, calme`},{value:3,label:`3 - Repond aux ordres`},{value:4,label:`4 - Repond a la stimulation sonore`},{value:5,label:`5 - Repond a la stimulation nociceptive`},{value:6,label:`6 - Aucune reponse`}]},
  ],
  calculate: (values) => {
    const n = values.niveau??2
    const labels: Record<number, string> = {1:'Agite',2:'Calme',3:'Repond ordres',4:'Repond bruit',5:'Repond douleur',6:'Aucune reponse'}
    const sev = n >= 5 ? 'high' : n === 1 ? 'moderate' : 'low'
    return {value:n, label:labels[n]||'', severity: sev,
      ranges:[
      {min:1,max:1,label:`1 - Agite, anxieux`,severity:`moderate`},
      {min:2,max:2,label:`2 - Calme, oriente (objectif ideal)`,severity:`low`},
      {min:3,max:3,label:`3 - Sedation legere`,severity:`low`},
      {min:4,max:4,label:`4 - Sedation moderee`,severity:`low`},
      {min:5,max:5,label:`5 - Sedation profonde`,severity:`high`},
      {min:6,max:6,label:`6 - Inconscient`,severity:`high`},
      ]}
  },
  interpretation: `Ramsay evalue le niveau de sedation. Objectif ideal en reanimation: Ramsay 2-3 (calme et cooperant).`,
  clinicalCommentary: `Premiere echelle de sedation validee. Remplacee par RASS (meilleure reproductibilite).`,
  references: [
    {type:`pubmed`,title:`Ramsay MA et al. Br Med J 1974`,pmid:`4842094`}
  ],
}
export default ramsay
