import type { FormulaDefinition } from '../types'

const cash: FormulaDefinition = {
  id: `cash`, slug: `cash`,
  name: `CASH (Algorithme)`,
  specialty: `dermatologie`, category: `Melanome`,
  description: `Algorithme CASH pour le diagnostic precoce des melanomes (7 items)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`asymetrie`,type:`boolean`,label:`Asymetrie (distribution irreguliere)`,weight:1},
    {id:`contour`,type:`boolean`,label:`Contour irregulier (bords mal definis)`,weight:1},
    {id:`couleur`,type:`boolean`,label:`Couleur inhomogene (>= 3 couleurs)`,weight:1},
    {id:`diametre`,type:`boolean`,label:`Diametre > 6 mm`,weight:1},
    {id:`evolution`,type:`boolean`,label:`Evolution recente (taille, forme, couleur)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.asymetrie?1:0)+(values.contour?1:0)+(values.couleur?1:0)+(values.diametre?1:0)+(values.evolution?1:0)
    const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
    const label = s < 2 ? 'Naevus benin probable' : s < 3 ? 'Surveillance rapprochee' : 'Melanome suspect - Biopsie excision'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:1,label:'Risque faible de melanome',severity:'low'},
        {min:2,max:2,label:'Risque intermediaire - Dermatoscopie + surveillance',severity:'moderate'},
        {min:3,max:5,label:`Risque eleve - Biopsie excision d'emblee`,severity:'high'},
      ]}
  },
  interpretation: `L'algorithme CASH aide au diagnostic des melanomes. 3 items ou plus = biopsie excision recommandee.`,
  clinicalCommentary: `Utilise en premiere intention par les dermatologues. La dermatoscopie ameliore la specificite. Toute lesion suspecte doit etre biopsiee (exerese totale).`,
  references: [
    {type:`pubmed`,title:`Argenziano G et al. J Am Acad Dermatol 1998`,pmid:`9525466`}
  ],
}
export default cash
