import type { FormulaDefinition } from '../types'

const short_physical: FormulaDefinition = {
  id: `short_physical`, slug: `short_physical`,
  name: `SPPB (Short Physical Performance Battery)`,
  specialty: `geriatrie`, category: `Evaluation Motrice`,
  description: `Batterie de tests physiques: equilibre, vitesse de marche, lever de chaise (score 0-12)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`equilibre`,type:`radio`,label:`Test d\'equilibre (pieds joints, semi-tandem, tandem 10s)`,options:[
      {value:0,label:`Impossible`},
      {value:1,label:`Tandem < 10s`},
      {value:2,label:`Tandem 10s, semi-tandem < 10s`},
      {value:3,label:`Semi-tandem + tandem 10s mais pieds joints < 10s`},
      {value:4,label:`Pieds joints 10s, semi-tandem 10s, tandem 10s`},
    ]},
    {id:`vitesse`,type:`radio`,label:`Vitesse de marche sur 4 metres`,options:[
      {value:0,label:`Impossible`},
      {value:1,label:`> 8.70s (> 0.46 m/s)`},
      {value:2,label:`6.21 - 8.70s (0.46-0.64 m/s)`},
      {value:3,label:`4.82 - 6.20s (0.65-0.83 m/s)`},
      {value:4,label:`< 4.82s (> 0.83 m/s)`},
    ]},
    {id:`chaise`,type:`radio`,label:`Lever de chaise (5 levers, bras croises sur poitrine)`,options:[
      {value:0,label:`Impossible ou > 60s`},
      {value:1,label:`16.70 - 60s`},
      {value:2,label:`13.70 - 16.69s`},
      {value:3,label:`11.20 - 13.69s`},
      {value:4,label:`< 11.19s`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.equilibre??4)+(values.vitesse??4)+(values.chaise??4)
    const sev = s >= 10 ? 'low' : s >= 7 ? 'moderate' : 'high'
    return {value:s, label:s>=10?'Bonne performance':s>=7?'Performance moderee':'Faible performance / Fragilite', severity: sev,
      ranges:[
        {min:10,max:12,label:'Bonne performance physique',severity:'low'},
        {min:7,max:9,label:'Performance moderee',severity:'moderate'},
        {min:0,max:6,label:'Faible performance - Fragilite elevee',severity:'high'},
      ]}
  },
  interpretation: `Le SPPB evalue la fonction physique des personnes agees a travers 3 tests: equilibre statique, vitesse de marche (4m) et lever de chaise. Chaque test est note de 0 a 4, score total 0-12. Un score ≤ 6 est associe a un risque eleve de chute, d\'hospitalisation et de perte d\'autonomie.`,
  clinicalCommentary: `Le SPPB est un excellent marqueur de fragilite et un predicteur de morbi-mortalite chez le sujet age. Un score ≤ 6 definit la fragilite motrice. Utile pour le suivi de la rehabilitation. Test standardise et reproductible, utilisable en routine clinique (environ 10 min).`,
  references: [
    {type:`pubmed`,title:`Guralnik JM et al. N Engl J Med 1995`,pmid:`7565954`},
    {type:`pubmed`,title:`Guralnik JM et al. J Gerontol A Biol Sci Med Sci 2000`,pmid:`10837169`},
  ],
}
export default short_physical
