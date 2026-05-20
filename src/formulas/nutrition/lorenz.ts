import type { FormulaDefinition } from '../types'

const lorenz: FormulaDefinition = {
  id: `lorenz`, slug: `lorenz`,
  name: `Poids Ideal de Lorenz`,
  specialty: `nutrition`, category: `Poids Ideal`,
  description: `Calcul du poids ideal selon la formule de Lorenz (taille, age, sexe)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`taille`,type:`number`,label:`Taille (cm)`,unit:`cm`,min:0,max:250,step:0.5,placeholder:`Ex: 170`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[
      {value:0,label:`Femme`},{value:1,label:`Homme`},
    ]},
  ],
  calculate: (values) => {
    const taille = parseFloat(values.taille||0)
    const homme = parseInt(values.sexe||0)
    
    let lorenz = 0
    if (homme) {
      lorenz = taille - 100 - ((taille - 150) / 4)
    } else {
      lorenz = taille - 100 - ((taille - 150) / 2)
    }
    
    return {value:Math.round(lorenz*10)/10, unit:`kg`, label:`Poids ideal Lorenz: ${Math.round(lorenz*10)/10} kg`, severity:`low`,
      details:{ formule: `Taille - 100 - ((Taille - 150)/${homme ? '4' : '2'})` },
      ranges:[
        {min:0,max:999,label:'Reference selon Lorenz',severity:'low'},
      ]}
  },
  interpretation: `Formule de Lorenz: Poids ideal (kg) = Taille (cm) - 100 - ((Taille - 150) / X)<br/>• Homme: X = 4<br/>• Femme: X = 2<br/><br/>Elle donne un poids ideal plus bas que Broca et est consideree plus precise pour les tailles extremes. Toutefois, comme Broca, elle ne tient pas compte de la masse musculaire ni de la morphologie.`,
  clinicalCommentary: `Formule surtout utilisee en France. Moins connue que Devine ou Robinson mais parfois preferee pour sa simplicite. Ne tient pas compte de l'age. Comme toute formule de poids ideal, elle donne une approximation qui doit etre adaptee au contexte clinique individuel.`,
  references: [
    {type:`url`,title:`Formule de Lorenz`,url:`https://fr.wikipedia.org/wiki/Poids_id%C3%A9al`},
  ],
}
export default lorenz
