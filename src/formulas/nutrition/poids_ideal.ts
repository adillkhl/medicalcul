import type { FormulaDefinition } from '../types'

const poids_ideal: FormulaDefinition = {
  id: `poids_ideal`, slug: `poids_ideal`,
  name: `Poids Ideal (Formules de Devine, Robinson, Miller)`,
  specialty: `nutrition`, category: `Poids Ideal`,
  description: `Calcul du poids ideal selon plusieurs formules: Devine, Robinson, Miller, avec comparaison`,
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
    const t_pouces = taille / 2.54
    const t_pieds = Math.floor(t_pouces / 12)
    const t_restant_pouces = t_pouces - (t_pieds * 12)
    
    // Devine (1974): 50 + 2.3 kg par pouce au-dessus de 5 pieds (H) / 45.5 + 2.3 (F)
    // Robinson (1983): 52 + 1.9 kg par pouce au-dessus de 5 pieds (H) / 49 + 1.7 (F)
    // Miller (1983): 56.2 + 1.41 kg par pouce au-dessus de 5 pieds (H) / 53.1 + 1.36 (F)
    
    const pouces_au_dessus_5pieds = t_pouces - 60
    
    let devine = 0
    let robinson = 0
    let miller = 0
    
    if (homme) {
      devine = 50 + (2.3 * pouces_au_dessus_5pieds)
      robinson = 52 + (1.9 * pouces_au_dessus_5pieds)
      miller = 56.2 + (1.41 * pouces_au_dessus_5pieds)
    } else {
      devine = 45.5 + (2.3 * pouces_au_dessus_5pieds)
      robinson = 49 + (1.7 * pouces_au_dessus_5pieds)
      miller = 53.1 + (1.36 * pouces_au_dessus_5pieds)
    }
    
    const moyenne = (devine + robinson + miller) / 3
    
    return {value:Math.round(devine*10)/10, unit:`kg`, label:`Devine: ${Math.round(devine*10)/10} kg`, severity:`low`,
      details:{
        devine: Math.round(devine*10)/10,
        robinson: Math.round(robinson*10)/10,
        miller: Math.round(miller*10)/10,
        moyenne: Math.round(moyenne*10)/10,
      },
      ranges:[
        {min:0,max:999,label:'Poids ideal selon Devine (valeur principale)',severity:'low'},
      ]}
  },
  interpretation: `Plusieurs formules de poids ideal existent:<br/>• Devine (1974): 50 kg + 2.3 kg/pouce > 5 pieds (H), 45.5 + 2.3 (F)<br/>• Robinson (1983): 52 + 1.9 kg/pouce (H), 49 + 1.7 (F)<br/>• Miller (1983): 56.2 + 1.41 kg/pouce (H), 53.1 + 1.36 (F)<br/><br/>La formule de Devine est la plus utilisee, notamment pour le dosage des medicaments (anesthesie). Robinson et Miller donnent des valeurs plus basses.`,
  clinicalCommentary: `Ces formules sont derivees de tables actuarielles et estiment un poids ideal theorique. Elles ne tiennent pas compte de la composition corporelle, de l\'age, de l\'origine ethnique, ou de la morphologie. Utilisees principalement pour le dosage des medicaments (heparine, propofol) ou l\'estimation des besoins caloriques.`,
  references: [
    {type:`pubmed`,title:`Devine BJ. Drug Intell Clin Pharm 1974`,pmid:`pubmed-link`},
    {type:`pubmed`,title:`Robinson JD et al. J Am Pharm Assoc 1983`,pmid:`6833730`},
    {type:`pubmed`,title:`Miller DR et al. J Clin Anesth 1983`,pmid:`6422067`},
  ],
}
export default poids_ideal
