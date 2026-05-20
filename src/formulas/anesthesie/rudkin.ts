import type { FormulaDefinition } from '../types'

const rudkin: FormulaDefinition = {
  id: `rudkin`, slug: `rudkin`,
  name: `Rudkin (Echelle)`,
  specialty: `anesthesie`, category: `Sedation`,
  description: `Echelle de sedation consciente (5 niveaux)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`niveau`,type:`radio`,label:`Niveau Rudkin`,options:[{value:1,label:`1 - Eveille, anxieux`},{value:2,label:`2 - Eveille, calme`},{value:3,label:`3 - Somnolent, repond aux ordres`},{value:4,label:`4 - Endormi, repond a la stimulation`},{value:5,label:`5 - Endormi, ne repond pas`}]},
  ],
  calculate: (values) => {
    const n = values.niveau??2
    const labels: Record<number, string> = {1:'Agite',2:'Calme',3:'Somnolent',4:'Endormi (repond)',5:'Endormi (aucune reponse)'}
    const sev = n >= 4 ? 'high' : n >= 3 ? 'moderate' : 'low'
    return {value:n, label:labels[n]||'', severity: sev,
      ranges:[
      {min:1,max:1,label:`1 - Anxieux, agite`,severity:`low`},
      {min:2,max:2,label:`2 - Eveille, calme (objectif)`,severity:`low`},
      {min:3,max:3,label:`3 - Somnolent, repond aux ordres`,severity:`moderate`},
      {min:4,max:4,label:`4 - Endormi, repond a la stimulation`,severity:`high`},
      {min:5,max:5,label:`5 - Endormi, aucune reponse`,severity:`high`},
      ]}
  },
  interpretation: `Rudkin evalue la sedation consciente. Niveau 2 = objectif ideal (eveille, calme, cooperant).`,
  clinicalCommentary: `Utilisee en chirurgie ambulatoire et odontologie. Niveau 5 trop profond sans voie aerienne securisee.`,
  references: [
    {type:`pubmed`,title:`Rudkin GE et al. Anesth Prog 1992`,pmid:`1445099`}
  ],
}
export default rudkin
