import type { FormulaDefinition } from '../types'

const evendol: FormulaDefinition = {
  id: `evendol`, slug: `evendol`,
  name: `EVENDOL (Douleur enfant < 7 ans)`,
  specialty: `soins_infirmiers`, category: `Douleur pediatrique`,
  description: `Echelle EVENDOL 5 items (0-15)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`expr`,type:`radio`,label:`Expression`,options:[{value:0,label:`Sourire`},{value:1,label:`Peu souriant`},{value:2,label:`Pleurs/grimaces`},{value:3,label:`Cris`}]},
    {id:`regard`,type:`radio`,label:`Regard`,options:[{value:0,label:`Habituel`},{value:1,label:`Vif/vigilant`},{value:2,label:`Absent/craintif`},{value:3,label:`Vide`}]},
    {id:`activite`,type:`radio`,label:`Activite`,options:[{value:0,label:`Normale`},{value:1,label:`Suinte/agite`},{value:2,label:`Agite/archure`},{value:3,label:`Prostre`}]},
    {id:`relation`,type:`radio`,label:`Relation`,options:[{value:0,label:`Normale`},{value:1,label:`Difficile`},{value:2,label:`Evite`},{value:3,label:`Aucune`}]},
    {id:`physio`,type:`radio`,label:`Physiologiques`,options:[{value:0,label:`Normaux`},{value:1,label:`Moderement anormaux`},{value:2,label:`Anormaux`}]},
  ],
  calculate: (values) => {
    const s = (parseInt(values.expr)||0)+(parseInt(values.regard)||0)+(parseInt(values.activite)||0)+(parseInt(values.relation)||0)+(parseInt(values.physio)||0)
        const sev = s >= 8 ? 'high' : s >= 4 ? 'moderate' : 'low'
        const retval = s; const retlabel = s <= 3 ? 'Absente/legere' : s <= 7 ? 'Moderee' : 'Severe'; const retsev = sev
        const ranges = [{min:0,max:3,label:'Absente/legere',severity:'low' as const},{min:4,max:7,label:'Moderee',severity:'moderate' as const},{min:8,max:15,label:'Severe',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `EVENDOL: reference pour enfant 0-7 ans. Score >= 4 justifie un traitement antalgique.`,
  clinicalCommentary: `Validee pour le nourrisson et le jeune enfant.`,
  references: [
    {type:`pubmed`,title:`Fivez T. Paediatr Anaesth 2011`,pmid:`21504458`}
  ],
}
export default evendol
