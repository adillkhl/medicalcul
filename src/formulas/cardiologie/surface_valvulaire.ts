import type { FormulaDefinition } from '../types'

const surface_valvulaire: FormulaDefinition = {
  id: `surface_valvulaire`, slug: `surface_valvulaire`,
  name: `Surface valvulaire (Calcul)`,
  specialty: `cardiologie`, category: `Valvulopathie`,
  description: `Calcul de la surface valvulaire selon le diametre et inversement`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`diametre`,type:`number`,label:`Diametre de l\'anneau`,unit:`mm`},
  ],
  calculate: (values) => {
    const d = parseFloat(values.diametre)||0
        const surface = d > 0 ? Math.round(Math.PI * (d/2) * (d/2) * 10) / 10 : 0
        const retval = surface
        const retlabel = surface + ' mm2'
        const retsev = 'low'
        const ranges = [
          {min:0,max:0,label:`Entrer le diametre de l\'anneau`,severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Surface valvulaire = π × (diametre/2)². Le diametre est mesure en echographie 2D au niveau de l\'anneau valvulaire.`,
  clinicalCommentary: `Utile pour evaluer la stenose aortique. La surface aortique normale est de 3-4 cm2. Stenose serree si surface < 1 cm2. La formule de Gorlin (hemodynamique) est plus precise mais invasive.`,
  references: [
    {type:`pubmed`,title:`Baumgartner H et al. J Am Soc Echocardiogr 2017`,pmid:`28314613`}
  ],
}
export default surface_valvulaire
