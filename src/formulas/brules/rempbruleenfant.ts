import type { FormulaDefinition } from '../types'

const rempbruleenfant: FormulaDefinition = {
  id: `rempbruleenfant`, slug: `rempbruleenfant`,
  name: `Brules graves enfants: Remplissage`,
  specialty: `brules`, category: `Remplissage`,
  description: `Volume de remplissage chez l'enfant brule (3 mL/kg/%SCB + maintenance Holliday-Segar)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`poids`,type:`number`,label:`Poids`,unit:`kg`},
    {id:`scb`,type:`number`,label:`Surface cutanee brulee`,unit:`%`},
  ],
  calculate: (values) => {
    const p = parseFloat(values.poids)||20
    const scb = parseFloat(values.scb)||0
    const volParkland = 3 * p * scb
    // Holliday-Segar maintenance
    const maint = p <= 10 ? p*100 : p <= 20 ? 1000 + (p-10)*50 : 1500 + (p-20)*20
    const volTotal = Math.round(volParkland + maint)
    const sev = scb > 20 ? 'high' : scb > 10 ? 'moderate' : 'low'
    return {value:volTotal, label: volTotal + ' mL/24h', severity: sev,
      details: {'Parkland (3mL/kg/%SCB)': Math.round(volParkland) + ' mL', 'Maintenance (Holliday-Segar)': Math.round(maint) + ' mL/24h'},
      ranges:[
        {min:0,max:0,label:'Entrer le poids et le % SCB',severity:'low'},
      ]}
    
  },
  interpretation: `Chez l'enfant brule: Parkland a 3 mL/kg/%SCB + maintenance Holliday-Segar. Objectif diurese: 1-2 mL/kg/h.`,
  clinicalCommentary: `L'enfant a un ratio surface/poids plus eleve, justifiant la formule modifiee a 3 mL/kg. Ne pas oublier les pertes insensibles majorees.`,
  references: [
    {type:`pubmed`,title:`Jeschke MG et al. Lancet 2018`,pmid:`29631388`}
  ],
}
export default rempbruleenfant
