import type { FormulaDefinition } from '../types'

const mannheim: FormulaDefinition = {
  id: `mannheim`, slug: `mannheim`,
  name: `Mannheim Peritonitis Index`,
  specialty: `chirurgie`, category: `Peritonite`,
  description: `Index de pronostic de mortalite sur peritonite (8 facteurs)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`age`,type:`boolean`,label:`Age > 50 ans`,weight:5},
    {id:`femme`,type:`boolean`,label:`Sexe feminin`,weight:5},
    {id:`insuff_organe`,type:`boolean`,label:`Defaillance d\'organe`,weight:7},
    {id:`cancer`,type:`boolean`,label:`Cancer evolutif`,weight:4},
    {id:`duree`,type:`boolean`,label:`Peritonite > 24h`,weight:4},
    {id:`origine_cc`,type:`boolean`,label:`Origine colique`,weight:4},
    {id:`exsudat`,type:`radio`,label:`Exsudat`,options:[{value:0,label:`Clair / abces`},{value:1,label:`Purulent`},{value:2,label:`Stercoral / feculent`}]},
    {id:`diffuse`,type:`boolean`,label:`Peritonite diffuse (generalisee)`,weight:6},
  ],
  calculate: (values) => {
    const s = (values.age?5:0)+(values.femme?5:0)+(values.insuff_organe?7:0)+(values.cancer?4:0)+(values.duree?4:0)+(values.origine_cc?4:0)+(values.exsudat??0)+(values.diffuse?6:0)
    const sev = s >= 30 ? 'high' : s >= 20 ? 'moderate' : 'low'
    const label = s < 20 ? 'Mortalite faible' : s < 30 ? 'Mortalite moderee' : 'Mortalite elevee'
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:20,label:'< 20 - Mortalite faible (0-5%)',severity:'low'},
        {min:20,max:29,label:'20-29 - Mortalite moderee (10-20%)',severity:'moderate'},
        {min:30,max:999,label:'>= 30 - Mortalite elevee (> 40%)',severity:'high'},
      ]}
  },
  interpretation: `Le Mannheim Peritonitis Index evalue le risque de mortalite dans les peritonites. Score > 29 = mortalite > 40%.`,
  clinicalCommentary: `Valide dans de nombreuses series. L\'age, la defaillance d\'organe et l\'origine colique sont les facteurs les plus ponderes. Necessite une reanimation agressive si score eleve.`,
  references: [
    {type:`pubmed`,title:`Linder MM et al. Chirurg 1987`,pmid:`3608781`}
  ],
}
export default mannheim
