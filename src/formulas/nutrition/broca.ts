import type { FormulaDefinition } from '../types'

const broca: FormulaDefinition = {
  id: `broca`, slug: `broca`,
  name: `Poids Ideal de Broca`,
  specialty: `nutrition`, category: `Poids Ideal`,
  description: `Calcul du poids ideal selon la formule de Broca (taille - 100)`,
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
    const broca = taille - 100
    const broca_ajuste = homme ? broca : broca * 0.9
    return {value:Math.round(broca_ajuste*10)/10, unit:`kg`, label:`Poids ideal Broca: ${Math.round(broca_ajuste*10)/10} kg`, severity:`low`,
      details:{
        broca_simple: Math.round(broca*10)/10,
        formule: `Taille - 100${homme?'': ' × 0.9'}`,
      },
      ranges:[
        {min:0,max:999,label:'Reference: Poids ideal',severity:'low'},
      ]}
  },
  interpretation: `Formule de Broca (1871): Poids ideal = Taille (cm) - 100<br/>• Homme: Taille - 100<br/>• Femme: (Taille - 100) × 0.9<br/><br/>Simple mais peu precise. Ne tient pas compte de l\'age, de la morphologie ou de la composition corporelle. Valable surtout pour les tailles moyennes (160-180 cm).`,
  clinicalCommentary: `La formule de Broca est obsolete et a ete largement remplacee par l\'IMC et les formules de Devine, Robinson ou Lorentz. Son interet est surtout historique et pedagogique. Elle tend a surestimer le poids ideal chez les personnes de grande taille et a le sous-estimer chez les personnes de petite taille.`,
  references: [
    {type:`url`,title:`Formule de Broca - Histoire et limites`,url:`https://fr.wikipedia.org/wiki/Poids_id%C3%A9al`},
  ],
}
export default broca
