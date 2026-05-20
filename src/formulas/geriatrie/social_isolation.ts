import type { FormulaDefinition } from '../types'

const social_isolation: FormulaDefinition = {
  id: `social_isolation`, slug: `social_isolation`,
  name: `Lubben Social Network Scale (LSNS-6)`,
  specialty: `geriatrie`, category: `Evaluation Psychosociale`,
  description: `Evaluation des contacts sociaux et du risque d'isolement social (6 items)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`famille_nb`,type:`radio`,label:`Nombre de parents/famille vus au moins 1x/mois`,options:[
      {value:0,label:`Aucun`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3-4`},{value:4,label:`5-8`},{value:5,label:`≥ 9`},
    ]},
    {id:`famille_freq`,type:`radio`,label:`Frequence des contacts avec la famille`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Rarement`},{value:2,label:`Parfois`},{value:3,label:`Souvent`},{value:4,label:`Tres souvent`},{value:5,label:`Toujours`},
    ]},
    {id:`famille_proche`,type:`radio`,label:`Nombre de parents sur qui compter pour une confidence`,options:[
      {value:0,label:`Aucun`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3-4`},{value:4,label:`5-8`},{value:5,label:`≥ 9`},
    ]},
    {id:`amis_nb`,type:`radio`,label:`Nombre d'amis vus au moins 1x/mois`,options:[
      {value:0,label:`Aucun`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3-4`},{value:4,label:`5-8`},{value:5,label:`≥ 9`},
    ]},
    {id:`amis_freq`,type:`radio`,label:`Frequence des contacts avec les amis`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Rarement`},{value:2,label:`Parfois`},{value:3,label:`Souvent`},{value:4,label:`Tres souvent`},{value:5,label:`Toujours`},
    ]},
    {id:`amis_proche`,type:`radio`,label:`Nombre d'amis sur qui compter pour une confidence`,options:[
      {value:0,label:`Aucun`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3-4`},{value:4,label:`5-8`},{value:5,label:`≥ 9`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.famille_nb??5)+(values.famille_freq??5)+(values.famille_proche??5)+(values.amis_nb??5)+(values.amis_freq??5)+(values.amis_proche??5)
    const sev = s >= 12 ? 'low' : s >= 6 ? 'moderate' : 'high'
    return {value:s, label:s>=12?'Reseau social adequate':s>=6?'Risque d\u0027isolement modere':'Risque d\u0027isolement eleve', severity: sev,
      ranges:[
        {min:12,max:30,label:'Reseau social adequate',severity:'low'},
        {min:6,max:11,label:'Risque d\u0027isolement social modere',severity:'moderate'},
        {min:0,max:5,label:'Risque d\u0027isolement social eleve',severity:'high'},
      ]}
  },
  interpretation: `Le Lubben Social Network Scale (LSNS-6) evalue le reseau social a travers 3 questions sur la famille et 3 sur les amis. Score total de 0 a 30. Un score < 12 indique un isolement social. L'isolement social est un facteur de risque de mortalite, de depression et de declin cognitif chez le sujet age.`,
  clinicalCommentary: `L'isolement social est un probleme majeur en geriatrie, associe a une surmortalite comparable au tabagisme ou a l'obesite. Le LSNS-6 est rapide (5 min) et bien accepte. Un score < 12 justifie une intervention sociale: groupes de parole, visites a domicile, activites collectives.`,
  references: [
    {type:`pubmed`,title:`Lubben JE. J Gerontol Soc Work 1988`,pmid:`pubmed-link`},
    {type:`pubmed`,title:`Lubben J et al. Gerontologist 2006`,pmid:`16507630`},
  ],
}
export default social_isolation
