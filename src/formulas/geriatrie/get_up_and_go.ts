import type { FormulaDefinition } from '../types'

const get_up_and_go: FormulaDefinition = {
  id: `get_up_and_go`, slug: `get_up_and_go`,
  name: `Timed Get Up and Go (TUG)`,
  specialty: `geriatrie`, category: `Evaluation Motrice`,
  description: `Test de mobilite et d\'equilibre: temps pour se lever, marcher 3m, faire demi-tour et se rasseoir`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`temps`,type:`number`,label:`Temps (secondes)`,unit:`s`,min:0,step:0.1,placeholder:`Entrez le temps en secondes`},
  ],
  calculate: (values) => {
    const t = parseFloat(values.temps||0)
    const sev = t < 10 ? 'low' : t <= 20 ? 'moderate' : 'high'
    return {value:t, unit:`s`, label:t<10?'Normal (mobilite libre)':t<=20?'Faible risque de chute':'Risque eleve de chute', severity: sev,
      ranges:[
        {min:0,max:9.9,label:'Normal - Mobilite libre',severity:'low'},
        {min:10,max:20,label:'Faible risque de chute',severity:'moderate'},
        {min:20.1,max:999,label:'Risque eleve de chute',severity:'high'},
      ]}
  },
  interpretation: `Le Timed Get Up and Go mesure le temps necessaire pour se lever d\'une chaise, marcher 3 metres, faire demi-tour, revenir et se rasseoir. Un temps < 10 secondes est normal, 10-20 secondes suggere un risque de chute modere, > 20 secondes indique un risque eleve.`,
  clinicalCommentary: `Test simple et reproductible. Le seuil de 13.5 secondes est souvent utilise pour identifier les patients a risque de chute. Necessite une chaise standard (hauteur ~46cm) et un parcours de 3 metres. Le patient peut utiliser son aide technique habituelle.`,
  references: [
    {type:`pubmed`,title:`Podsiadlo D, Richardson S. J Am Geriatr Soc 1991`,pmid:`1991946`},
  ],
}
export default get_up_and_go
