import type { FormulaDefinition } from '../types'

const vauthey: FormulaDefinition = {
  id: `vauthey`, slug: `vauthey`,
  name: `Volume hepatique total (Vauthey)`,
  specialty: `chirurgie`, category: `Foie`,
  description: `Calcul du volume hepatique total a partir de la surface corporelle selon Vauthey`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`poids`,type:`number`,label:`Poids`,unit:`kg`},
    {id:`taille`,type:`number`,label:`Taille`,unit:`cm`},
  ],
  calculate: (values) => {
    const p = parseFloat(values.poids)||70
    const t = parseFloat(values.taille)||170
    // BSA (Mosteller): sqrt(hauteur(cm) * poids(kg) / 3600)
    const bsa = Math.sqrt(t * p / 3600)
    // Vauthey: Volume foie (cm3) = -794 + 1267 * BSA
    const vol = Math.round(-794 + 1267 * bsa)
    return {value:vol, label: vol + ' cm3', severity:'low',
      ranges:[
        {min:0,max:0,label:'Entrer poids et taille',severity:'low'},
      ]}
  },
  interpretation: `Volume hepatique total selon Vauthey = -794 + 1267 x BSA. BSA calculee par formule de Mosteller.`,
  clinicalCommentary: `Utilise en chirurgie hepatique pour evaluer le volume du futur foie restant avant hepatectomie. Un futur foie restant < 20-25% est un risque d\'insuffisance hepatique post-op.`,
  references: [
    {type:`pubmed`,title:`Vauthey JN et al. Ann Surg 2002`,pmid:`12154341`}
  ],
}
export default vauthey
