import type { FormulaDefinition } from '../types'

const rempbruleadulte: FormulaDefinition = {
  id: `rempbruleadulte`, slug: `rempbruleadulte`,
  name: `Brules graves adultes: Remplissage`,
  specialty: `brules`, category: `Remplissage`,
  description: `Calcul du volume de remplissage selon la formule de Parkland (adulte: 4 mL/kg/%SCB)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`poids`,type:`number`,label:`Poids`,unit:`kg`},
    {id:`scb`,type:`number`,label:`Surface cutanee brulee`,unit:`%`},
    {id:`delai`,type:`number`,label:`Delai depuis la brulure`,unit:`h`},
  ],
  calculate: (values) => {
    const p = parseFloat(values.poids)||70
    const scb = parseFloat(values.scb)||0
    const delai = parseFloat(values.delai)||0
    const volTotal = Math.round(4 * p * scb)
    const debit1 = delai < 8 ? Math.round(volTotal / 2 / Math.max(8 - delai, 1)) : 0
    const debit2 = delai < 8 ? Math.round(volTotal / 2 / 16) : Math.round(volTotal / Math.max(24 - delai, 1))
    const sev = scb > 20 ? 'high' : scb > 10 ? 'moderate' : 'low'
    return {value:volTotal, label: volTotal + ' mL total', severity: sev,
      details: { 'Volume 1ere moitie (8h)': Math.round(volTotal/2) + ' mL', 'Debit 1ere moitie': debit1 + ' mL/h', 'Volume 2e moitie (16h)': Math.round(volTotal/2) + ' mL', 'Debit 2e moitie': debit2 + ' mL/h' },
      ranges:[
        {min:0,max:0,label:'Entrer le poids et le % SCB',severity:'low'},
      ]}
    
  },
  interpretation: `Formule de Parkland: 4 mL de Ringer Lactate / kg / % SCB. Moitie dans les 8h, moitie dans les 16h suivantes.`,
  clinicalCommentary: `Standard international. Adapter le debit a la diurese horaire (objectif: 0.5-1 mL/kg/h chez l'adulte).`,
  references: [
    {type:`pubmed`,title:`Baxter CR, Shires T. Adv Surg 1968`,pmid:`4880290`}
  ],
}
export default rempbruleadulte
