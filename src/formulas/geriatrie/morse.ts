import type { FormulaDefinition } from '../types'

const morse: FormulaDefinition = {
  id: `morse`, slug: `morse`,
  name: `Morse Fall Scale (Echelle de risque de chute)`,
  specialty: `geriatrie`, category: `Evaluation du Risque`,
  description: `Evaluation du risque de chute chez le patient hospitalise (6 items)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`chute_ant`,type:`radio`,label:`Antecedent de chute`,options:[
      {value:0,label:`Non`},
      {value:25,label:`Oui`},
    ]},
    {id:`diagnostic_sec`,type:`radio`,label:`Diagnostics secondaires (≥ 2 diagnostics medicaux)`,options:[
      {value:0,label:`Non`},
      {value:15,label:`Oui`},
    ]},
    {id:`aide_marche`,type:`radio`,label:`Aide a la marche`,options:[
      {value:0,label:`Aucune / Infirmiere / Fauteuil roulant`},
      {value:15,label:`Canne / Deambulateur`},
      {value:30,label:`S\'accroche aux meubles`},
    ]},
    {id:`perfusion`,type:`radio`,label:`Perfusion IV ou catheter`,options:[
      {value:0,label:`Non`},
      {value:20,label:`Oui`},
    ]},
    {id:`demarche`,type:`radio`,label:`Demarche`,options:[
      {value:0,label:`Normale / Normale au repos / Fauteuil roulant`},
      {value:10,label:`Faible`},
      {value:20,label:`Troublee / Demarche traînante`},
    ]},
    {id:`mental`,type:`radio`,label:`Etat mental`,options:[
      {value:0,label:`Conscient de ses limites`},
      {value:15,label:`Sur-estime ou oublie ses limites`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.chute_ant??0)+(values.diagnostic_sec??0)+(values.aide_marche??0)+(values.perfusion??0)+(values.demarche??0)+(values.mental??0)
    return {value:s, label:s<45?'Risque faible':s<=75?'Risque modere':'Risque eleve', severity: s<45?'low':s<=75?'moderate':'high',
      ranges:[
        {min:0,max:44,label:'Risque faible',severity:'low'},
        {min:45,max:75,label:'Risque modere',severity:'moderate'},
        {min:76,max:125,label:'Risque eleve',severity:'high'},
      ]}
  },
  interpretation: `L\'echelle de Morse evalue le risque de chute chez le patient hospitalise. Score sur 125 points. Un score ≥ 45 indique un risque de chute significatif justifiant des mesures de prevention (alarme, surveillance, chaussures adaptees, environnement securise).`,
  clinicalCommentary: `Echelle largement utilisee en soins infirmiers. A reevaluer regulierement (au moins toutes les 48h) car le risque de chute evolue avec l\'etat clinique. Ne dispense pas d\'une evaluation individualisee du risque de chute.`,
  references: [
    {type:`pubmed`,title:`Morse JM et al. Nurs Res 1989`,pmid:`2780060`},
    {type:`pubmed`,title:`Morse JM. J Patient Saf 2006`,pmid:`17957199`},
  ],
}
export default morse
