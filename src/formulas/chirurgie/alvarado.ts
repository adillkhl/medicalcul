import type { FormulaDefinition } from '../types'

const alvarado: FormulaDefinition = {
  id: `alvarado`, slug: `alvarado`,
  name: `Alvarado, MANTRELS (Score)`,
  specialty: `chirurgie`, category: `Appendicite`,
  description: `Probabilite d\'appendicite aigue selon le score d\'Alvarado (MANTRELS)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`migration`,type:`boolean`,label:`Migration de la douleur vers FID`,weight:1},
    {id:`anorexie`,type:`boolean`,label:`Anorexie / ace tone urinaire`,weight:1},
    {id:`nausees`,type:`boolean`,label:`Nausees / vomissements`,weight:1},
    {id:`tenderness`,type:`boolean`,label:`Tenderness en FID`,weight:2},
    {id:`rebound`,type:`boolean`,label:`Rebond / defense en FID`,weight:1},
    {id:`temperature`,type:`boolean`,label:`Temperature > 37.3°C`,weight:1},
    {id:`leucocytes`,type:`radio`,label:`Leucocytes`,options:[{value:0,label:`< 10000`},{value:1,label:`10000-15000`},{value:2,label:`> 15000`}]},
    {id:`neutrophiles`,type:`radio`,label:`Neutrophiles`,options:[{value:0,label:`< 75%`},{value:1,label:`> 75%`}]},
  ],
  calculate: (values) => {
    const s = (values.migration?1:0)+(values.anorexie?1:0)+(values.nausees?1:0)+(values.tenderness?2:0)+(values.rebound?1:0)+(values.temperature?1:0)+(values.leucocytes??0)+(values.neutrophiles??0)
    const sev = s>=7?'high':s>=5?'moderate':'low'
    const label = s < 5 ? 'Faible probabilite' : s < 7 ? 'Probabilite intermediaire' : 'Haute probabilite'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:4,label:'Faible - Surveillance ou sortie',severity:'low'},
        {min:5,max:6,label:'Intermediaire - TDM ou echo puis decision',severity:'moderate'},
        {min:7,max:10,label:'Eleve - Appendicectomie probable',severity:'high'},
      ]}
  },
  interpretation: `Score d\'Alvarado (MANTRELS) pour l\'appendicite aigue. Chaque lettre correspond a un item (8 items, 10 points max).`,
  clinicalCommentary: `Score bien valide, meilleure sensibilite que la clinique seule. Un score >= 7 a une forte valeur predictive positive. L\'imagerie (TDM abdo ou echo) reste utile pour les scores intermediaires.`,
  references: [
    {type:`pubmed`,title:`Alvarado A. Ann Emerg Med 1986`,pmid:`3729132`}
  ],
}
export default alvarado
