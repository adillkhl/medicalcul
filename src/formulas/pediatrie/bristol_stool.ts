import type { FormulaDefinition } from '../types'

const bristol_stool: FormulaDefinition = {
  id: `bristol_stool`, slug: `bristol_stool`,
  name: `Bristol Stool Scale (Échelle de selles de Bristol)`,
  specialty: `pediatrie`, category: `Gastroenterologie`,
  description: `Classification des selles en 7 types, de la constipation à la diarrhée — utilisée en pédiatrie et gastroentérologie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`type_selles`,type:`radio`,label:`Type de selles`,options:[
      {value:1,label:`Type 1 — Petits morceaux durs séparés (noix)`},
      {value:2,label:`Type 2 — En forme de saucisse mais grumeleuse`},
      {value:3,label:`Type 3 — En forme de saucisse avec fissures en surface`},
      {value:4,label:`Type 4 — En forme de saucisse ou serpent, lisse`},
      {value:5,label:`Type 5 — Petits morceaux mous à bords nets`},
      {value:6,label:`Type 6 — Morceaux floconneux, pâteux`},
      {value:7,label:`Type 7 — Liquide, sans morceaux solides`},
    ]},
  ],
  calculate: (values) => {
    const s = values.type_selles ?? 4
    const cat = s <= 2 ? 'constipation' : s <= 4 ? 'normal' : 'diarrhee'
    const sev = s <= 1 ? 'high' : s === 2 ? 'moderate' : s <= 4 ? 'low' : s <= 5 ? 'moderate' : 'high'
    const label = cat === 'constipation' ? `Type ${s} — Selles de constipation` : cat === 'normal' ? `Type ${s} — Selles normales` : `Type ${s} — Selles de diarrhée`
    return {value:s, label, severity: sev,
      ranges:[
        {min:1,max:1,label:`Type 1 — Constipation sévère (temps de transit > 100h)`,severity:'high'},
        {min:2,max:2,label:`Type 2 — Constipation modérée`,severity:'moderate'},
        {min:3,max:4,label:`Type 3-4 — Normal (transit 24-72h)`,severity:'low'},
        {min:5,max:5,label:`Type 5 — Tendance diarrhéique`,severity:'moderate'},
        {min:6,max:7,label:`Type 6-7 — Diarrhée`,severity:'high'},
      ]}
  },
  interpretation: `L\'échelle de Bristol classe les selles en 7 types selon leur forme et consistance. Types 3-4 : normal. Types 1-2 : constipation (transit lent). Types 5-7 : diarrhée (transit accéléré). Outil validé pour le suivi des troubles fonctionnels intestinaux.`,
  clinicalCommentary: `Simple, reproductible, utilisable dès l\'âge de 4-5 ans avec des pictogrammes. Couramment utilisée pour le suivi de la constipation fonctionnelle de l\'enfant et les diarrhées chroniques. Associée aux critères de Rome IV pour le diagnostic du syndrome de l\'intestin irritable.`,
  references: [
    {type:`pubmed`,title:`Lewis SJ, Heaton KW. Stool form scale as a useful guide to intestinal transit time. Scand J Gastroenterol 1997`,pmid:`9207664`},
    {type:`pubmed`,title:`Rome IV Criteria — Functional GI Disorders (2016)`},
  ],
}
export default bristol_stool
