import type { FormulaDefinition } from '../types'

const wallace: FormulaDefinition = {
  id: `wallace`, slug: `wallace`,
  name: `Surface brulee (Wallace)`,
  specialty: `brules`, category: `Surface`,
  description: `Regle des 9 de Wallace pour estimation rapide de la surface brulee`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`tete_cou`,type:`number`,label:`Tete et cou`,unit:`%`},
    {id:`tronc_avant`,type:`number`,label:`Tronc avant`,unit:`%`},
    {id:`tronc_arriere`,type:`number`,label:`Tronc arriere`,unit:`%`},
    {id:`ms_droit`,type:`number`,label:`Membre superieur droit`,unit:`%`},
    {id:`ms_gauche`,type:`number`,label:`Membre superieur gauche`,unit:`%`},
    {id:`mi_droit`,type:`number`,label:`Membre inferieur droit`,unit:`%`},
    {id:`mi_gauche`,type:`number`,label:`Membre inferieur gauche`,unit:`%`},
    {id:`perinee`,type:`number`,label:`Perinee`,unit:`%`},
  ],
  calculate: (values) => {
    const pts = [values.tete_cou,values.tronc_avant,values.tronc_arriere,values.ms_droit,values.ms_gauche,values.mi_droit,values.mi_gauche,values.perinee]
    const total = pts.reduce((a,b) => (a||0)+(parseFloat(b)||0), 0)
    const sev = total > 20 ? 'high' : total > 10 ? 'moderate' : 'low'
    return {value:Math.round(total*10)/10, label: Math.round(total) + '% SCB (regle des 9)', severity: sev,
      ranges:[
        {min:0,max:10,label:'< 10% SCB - Brule leger',severity:'low'},
        {min:10.1,max:20,label:'10-20% SCB - Brule modere',severity:'moderate'},
        {min:20.1,max:40,label:'20-40% SCB - Brule grave',severity:'high'},
        {min:40.1,max:100,label:'> 40% SCB - Brule severe',severity:'critical'},
      ]}
    
  },
  interpretation: `La regle des 9 de Wallace permet une estimation rapide de la surface brulee. A utiliser au lit du patient pour le tri initial.`,
  clinicalCommentary: `Valable chez l'adulte. Chez l'enfant, les proportions different: tete 18%, membre inferieur 14%. Reference pour le tri prehospitalier.`,
  references: [
    {type:`pubmed`,title:`Wallace AB. Lancet 1951`,pmid:`14852119`}
  ],
}
export default wallace
