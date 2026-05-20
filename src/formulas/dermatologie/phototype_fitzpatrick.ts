import type { FormulaDefinition } from '../types'

const phototype_fitzpatrick: FormulaDefinition = {
  id: `phototype_fitzpatrick`, slug: `phototype_fitzpatrick`,
  name: `Phototype de Fitzpatrick`,
  specialty: `dermatologie`, category: `Phototype`,
  description: `Classification des phototypes cutanes selon Fitzpatrick (6 types)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`type`,type:`radio`,label:`Phototype`,options:[{value:1,label:`I - Peau tres claire, rousseur, taches de rousseur - Brule toujours, ne bronze jamais`},{value:2,label:`II - Peau claire, cheveux blonds-roux - Brule facilement, bronze difficilement`},{value:3,label:`III - Peau claire a moyenne, cheveux chatain - Brule modere, bronze graduellement`},{value:4,label:`IV - Peau olive, cheveux bruns - Brule rarement, bronze bien`},{value:5,label:`V - Peau brune, cheveux noirs - Brule tres rarement, bronze tres facilement`},{value:6,label:`VI - Peau noire, cheveux noirs - Ne brule jamais, pigmentation maximale`}]},
  ],
  calculate: (values) => {
    const t = values.type??3
    const labels: Record<number, string> = {1:'Phototype I',2:'Phototype II',3:'Phototype III',4:'Phototype IV',5:'Phototype V',6:'Phototype VI'}
    return {value:t, label:labels[t]||'', severity:'low',
      ranges:[
        {min:1,max:2,label:'Phototype I-II - Risque eleve de coup de soleil et melanome',severity:'high'},
        {min:3,max:4,label:'Phototype III-IV - Risque modere',severity:'moderate'},
        {min:5,max:6,label:'Phototype V-VI - Risque faible de coup de soleil',severity:'low'},
      ]}
  },
  interpretation: `Le phototype de Fitzpatrick classifie la peau selon sa reponse au soleil. Les phototypes I-II ont un risque eleve de cancer cutane.`,
  clinicalCommentary: `Utilise pour le risque de cancer cutane et pour determiner les doses en phototherapie. Protection solaire recommandee pour tous les phototypes.`,
  references: [
    {type:`pubmed`,title:`Fitzpatrick TB. Arch Dermatol 1988`,pmid:`3355231`}
  ],
}
export default phototype_fitzpatrick
