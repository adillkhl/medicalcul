import type { FormulaDefinition } from '../types'

const melascore: FormulaDefinition = {
  id: `melascore`, slug: `melascore`,
  name: `Score de menace melanocytaire`,
  specialty: `dermatologie`, category: `Melanome`,
  description: `Score clinique de risque de melanome (7 points, items ABCDE)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`asymetrie`,type:`boolean`,label:`Asymetrie`,weight:1},
    {id:`bords`,type:`boolean`,label:`Bords irreguliers`,weight:1},
    {id:`couleur`,type:`boolean`,label:`Couleur inhomogene (>= 3 teintes)`,weight:1},
    {id:`diametre`,type:`boolean`,label:`Diametre > 6 mm`,weight:1},
    {id:`evolution`,type:`boolean`,label:`Evolution recente (taille, forme, couleur, symptomes)`,weight:2},
    {id:`facteur_risque`,type:`boolean`,label:`Facteur de risque (phototype clair, coups de soleil, ATCD familial)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.asymetrie?1:0)+(values.bords?1:0)+(values.couleur?1:0)+(values.diametre?1:0)+(values.evolution?2:0)+(values.facteur_risque?1:0)
    const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
    const label = s < 2 ? 'Naevus probablement benin' : s < 4 ? 'Surveillance dermatologique' : 'Biopsie excision recommandee'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:1,label:'Benin - Surveillance simple',severity:'low'},
        {min:2,max:3,label:'Incertain - Dermatoscopie + surveillance',severity:'moderate'},
        {min:4,max:7,label:'Suspect - Biopsie excision',severity:'high'},
      ]}
  },
  interpretation: `Score ABCDE+Facteurs de risque pour le diagnostic du melanome. Le critere 'evolution' est le plus ponderé (2 points).`,
  clinicalCommentary: `ABCDE est un outil de depistage de premiere ligne. La dermatoscopie par un dermatologue entraine ameliore la specificite. Ne pas differer une biopsie devant une lesion suspecte.`,
  references: [
    {type:`pubmed`,title:`Abbasi NR et al. Arch Dermatol 2004`,pmid:`14751776`}
  ],
}
export default melascore
