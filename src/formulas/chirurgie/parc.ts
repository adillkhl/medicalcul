import type { FormulaDefinition } from '../types'

const parc: FormulaDefinition = {
  id: `parc`, slug: `parc`,
  name: `pARC, Appendicite (Score)`,
  specialty: `chirurgie`, category: `Appendicite`,
  description: `Probabilite d\'appendicite aigue chez l\'enfant selon le score pARC (francais)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`douleur_fid`,type:`boolean`,label:`Douleur FID < 48h`,weight:1},
    {id:`vomissements`,type:`boolean`,label:`Vomissements`,weight:1},
    {id:`rebond`,type:`boolean`,label:`Rebond FID`,weight:1},
    {id:`temperature`,type:`boolean`,label:`Temperature > 38°C`,weight:1},
    {id:`crp`,type:`boolean`,label:`CRP > 50 mg/L`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.douleur_fid?1:0)+(values.vomissements?1:0)+(values.rebond?1:0)+(values.temperature?1:0)+(values.crp?1:0)
    const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
    const label = s < 2 ? 'Faible probabilite' : s < 3 ? 'Probabilite intermediaire' : 'Haute probabilite'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:1,label:'Faible - Surveillance',severity:'low'},
        {min:2,max:2,label:'Intermediaire - Echo +/- TDM',severity:'moderate'},
        {min:3,max:5,label:'Eleve - Appendicectomie probable',severity:'high'},
      ]}
  },
  interpretation: `Le score pARC (Pediatric Appendicitis Risk Calculator) est un score francais pour l\'appendicite de l\'enfant (2-17 ans).`,
  clinicalCommentary: `Developpe par l\'association de chirurgie pediatrique. Plus simple que le PAS. L\'echographie est recommandee en premiere intention chez l\'enfant.`,
  references: [
    {type:`pubmed`,title:`Leport V et al. J Pediatr Surg 2022`,pmid:`34743964`}
  ],
}
export default parc
