import type { FormulaDefinition } from '../types'

const timi_coronarographique: FormulaDefinition = {
  id: `timi_coronarographique`, slug: `timi_coronarographique`,
  name: `TIMI coronarographique (Score)`,
  specialty: `cardiologie`, category: `Coronarographie`,
  description: `Evaluation du flux de produit de contraste en coronarographie (grade TIMI 0-3)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`grade`,type:`radio`,label:`Grade TIMI`,options:[{value:0,label:`TIMI 0 - Aucun flux distal`},{value:1,label:`TIMI 1 - Passage partiel du contraste sans opacification distale`},{value:2,label:`TIMI 2 - Opacification complete mais ralentie`},{value:3,label:`TIMI 3 - Flux normal`}]},
  ],
  calculate: (values) => {
    const g = parseInt(values.grade)??3
        const sev = g <= 1 ? 'high' : g === 2 ? 'moderate' : 'low'
        const labels: Record<number, string>= {0:'TIMI 0 - Aucune perfusion',1:'TIMI 1 - Perfusion minime',2:'TIMI 2 - Perfusion partielle',3:'TIMI 3 - Perfusion normale'}
        const retval = g
        const retlabel = labels[g]||''
        const retsev = sev
        const ranges = [
          {min:0,max:0,label:'TIMI 0 - Pas de flux',severity:'high' as const},
          {min:1,max:1,label:'TIMI 1 - Flux minimal',severity:'high' as const},
          {min:2,max:2,label:'TIMI 2 - Flux ralenti',severity:'moderate' as const},
          {min:3,max:3,label:'TIMI 3 - Flux normal',severity:'low' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le grade TIMI coronarographique evalue le flux distal apres thrombolyse ou angioplastie. TIMI 3 = resultat optimal (reperfusion complete).`,
  clinicalCommentary: `Utilise en cardiologie interventionnelle pour evaluer le resultat de l\'angioplastie. Un TIMI < 3 apres procedure est associe a un moins bon pronostic. Le blush myocardique (perfusion tissulaire) est un complement utile.`,
  references: [
    {type:`pubmed`,title:`TIMI Study Group. N Engl J Med 1985`,pmid:`2863757`}
  ],
}
export default timi_coronarographique
