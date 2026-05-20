import type { FormulaDefinition } from '../types'

const pas: FormulaDefinition = {
  id: `pas`, slug: `pas`,
  name: `PAS, Pediatric Appendicitis Score`,
  specialty: `chirurgie`, category: `Appendicite`,
  description: `Score d'appendicite pediatrique de Samuel (5 facteurs)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`migration`,type:`boolean`,label:`Migration douleur FID`,weight:1},
    {id:`anorexie`,type:`boolean`,label:`Anorexie`,weight:1},
    {id:`nausees`,type:`boolean`,label:`Nausees / vomissements`,weight:1},
    {id:`douleur_fid`,type:`boolean`,label:`Douleur FID a la toux / palpation`,weight:2},
    {id:`temperature`,type:`boolean`,label:`Temperature > 37.5°C`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.migration?1:0)+(values.anorexie?1:0)+(values.nausees?1:0)+(values.douleur_fid?2:0)+(values.temperature?1:0)+(values.leucocytes?2:0)+(values.neutrophiles?1:0)+(values.rebond?2:0)
    const sev = s >= 7 ? 'high' : s >= 5 ? 'moderate' : 'low'
    const label = s < 5 ? 'Faible' : s < 7 ? 'Intermediaire' : 'Eleve'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:4,label:'Faible - Surveillance',severity:'low'},
        {min:5,max:6,label:'Intermediaire - Echo/TDM',severity:'moderate'},
        {min:7,max:10,label:'Eleve - Appendicectomie',severity:'high'},
      ]}
  },
  interpretation: `Le PAS de Samuel est un score pediatrique pour l'appendicite aigue. Score >= 7 de forte valeur predictive positive.`,
  clinicalCommentary: `Valide chez l'enfant de 4-15 ans. Les items leucocytes et neutrophiles doivent etre ajoutes (manuels).`,
  references: [
    {type:`pubmed`,title:`Samuel M. J Pediatr Surg 2002`,pmid:`12395342`}
  ],
}
export default pas
