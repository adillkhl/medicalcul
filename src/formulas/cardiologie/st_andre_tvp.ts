import type { FormulaDefinition } from '../types'

const st_andre_tvp: FormulaDefinition = {
  id: `st_andre_tvp`, slug: `st_andre_tvp`,
  name: `St Andre, TVP (Score)`,
  specialty: `cardiologie`, category: `Thrombose`,
  description: `Probabilite de thrombose veineuse profonde proximale ou distale (hopital St Andre)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`cancer`,type:`boolean`,label:`Cancer actif`,weight:1},
    {id:`paralysie`,type:`boolean`,label:`Paralysie / platre recent membre inferieur`,weight:1},
    {id:`alitement`,type:`boolean`,label:`Alitement > 3 jours / chirurgie < 4 semaines`,weight:1},
    {id:`douleur`,type:`boolean`,label:`Douleur localisee le long du trajet veineux`,weight:1},
    {id:`jambe_entier`,type:`boolean`,label:`Jambe entiere gonflee`,weight:1},
    {id:`mollet`,type:`boolean`,label:`Mollet gonfle (> 3 cm vs cote sain)`,weight:1},
    {id:`cedeme`,type:`boolean`,label:`Cedeme pre-tibial prenant le godet`,weight:1},
    {id:`veine_collat`,type:`boolean`,label:`Veines collaterales superficielles`,weight:1},
    {id:`atcd_tvp`,type:`boolean`,label:`ATCD de TVP documentee`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.cancer?1:0)+(values.paralysie?1:0)+(values.alitement?1:0)+(values.douleur?1:0)+(values.jambe_entier?1:0)+(values.mollet?1:0)+(values.cedeme?1:0)+(values.veine_collat?1:0)+(values.atcd_tvp?1:0)
        const sev = s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const label = s < 2 ? 'Faible probabilite' : s < 3 ? 'Probabilite moderee' : 'Forte probabilite'
        const retval = s
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Faible (< 10%) - D-Dimeres',severity:'low' as const},
          {min:2,max:2,label:'Moderee (~30%) - Echo-Doppler',severity:'moderate' as const},
          {min:3,max:9,label:'Forte (> 50%) - Echo-Doppler',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le score de St Andre evalue la probabilite clinique de TVP. Combine 9 items cliniques pour stratifier le risque.`,
  clinicalCommentary: `Score francais valide. Alternative au score de Wells. En cas de forte probabilite, un echo-Doppler veineux est indique sans attendre les D-Dimeres.`,
  references: [
    {type:`pubmed`,title:`Miron MJ et al. Arch Intern Med 2000`,pmid:`10904459`}
  ],
}
export default st_andre_tvp
