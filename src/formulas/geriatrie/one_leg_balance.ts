import type { FormulaDefinition } from '../types'

const one_leg_balance: FormulaDefinition = {
  id: `one_leg_balance`, slug: `one_leg_balance`,
  name: `One Leg Balance Test (Equilibre Unipodal)`,
  specialty: `geriatrie`, category: `Evaluation Motrice`,
  description: `Test d\'equilibre statique: temps maintenu en equilibre sur une jambe`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`temps`,type:`number`,label:`Temps d\'equilibre maximal (en secondes, max 60s)`,unit:`s`,min:0,max:60,step:0.1,placeholder:`Entrez le temps en secondes`},
  ],
  calculate: (values) => {
    const t = parseFloat(values.temps||0)
    const sev = t >= 30 ? 'low' : t >= 10 ? 'moderate' : 'high'
    return {value:t, unit:`s`, label:t>=30?'Equilibre normal':t>=10?'Equilibre reduit':'Risque eleve de chute', severity: sev,
      ranges:[
        {min:30,max:60,label:'Equilibre normal',severity:'low'},
        {min:10,max:29.9,label:'Equilibre reduit - Risque de chute modere',severity:'moderate'},
        {min:0,max:9.9,label:'Risque eleve de chute',severity:'high'},
      ]}
  },
  interpretation: `Le test d\'equilibre unipodal consiste a rester en equilibre sur la jambe dominante, bras le long du corps, sans support. Le temps est chronometre (maximum 60 secondes). Un temps < 10 secondes est associe a un risque de chute eleve chez le sujet age.`,
  clinicalCommentary: `Test simple et rapide (1 min). Seuil de risque de chute: < 10 secondes. L\'impossibilite de tenir 5 secondes est un marqueur de fragilite. A effectuer pres d\'un support pour la securite. Alternative a TUG et SPPB pour une evaluation rapide de l\'equilibre.`,
  references: [
    {type:`pubmed`,title:`Vellas BJ et al. J Am Geriatr Soc 1997`,pmid:`9011486`},
  ],
}
export default one_leg_balance
