import type { FormulaDefinition } from '../types'

const sideremie: FormulaDefinition = {
  id: `sideremie`, slug: `sideremie`,
  name: `Fer serique (Interpretation)`,
  specialty: `divers`, category: `Fer`,
  description: `Interpretation du bilan du fer`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`fer`,type:`number`,label:`Fer`,unit:`micromol/L`},
    {id:`ferritine`,type:`number`,label:`Ferritine`,unit:`microg/L`},
    {id:`ctf`,type:`number`,label:`CTF`,unit:`micromol/L`},
  ],
  calculate: (values) => {
    const fer = parseFloat(values.fer)||15; const ferritine = parseFloat(values.ferritine)||100; const ctf = parseFloat(values.ctf)||60
        const cs = ctf > 0 ? Math.round(fer/ctf*100) : 0; let sev = 'low'; let label = 'CS ' + cs + '%'
        if (ferritine < 15) { label += ' - Carence franche'; sev = 'moderate' }
        else if (cs < 16) { label += ' - Carence possible'; sev = 'low' }
        else if (cs > 45) { label += ' - Surcharge'; sev = 'high' }
        else { label += ' - Normal' }
        const retval = fer; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:999,label:'Voir interpretation',severity:'low' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `CS < 16% = carence martiale. Ferritine basse = carence franche.`,
  clinicalCommentary: `Ferritine est un reactant de phase aigue: peut etre normale malgre carence si inflammation.`,
  references: [
    {type:`pubmed`,title:`Camaschella C. N Engl J Med 2015`,pmid:`26065015`}
  ],
}
export default sideremie
