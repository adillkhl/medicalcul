import type { FormulaDefinition } from '../types'

const lymphome_annarbor: FormulaDefinition = {
  id: `lymphome_annarbor`, slug: `lymphome_annarbor`,
  name: `Classification de Stade Ann Arbor des Lymphomes`,
  specialty: `hematologie`, category: `Lymphome`,
  description: `Classification des lymphomes (hodgkinien et non hodgkinien) selon le stade Ann Arbor (I-IV)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`atteintes`,type:`radio`,label:`Nombre d\'aires ganglionnaires atteintes`,options:[
      {value:0,label:`1 aire ganglionnaire`},
      {value:1,label:`≥ 2 aires du meme cote du diaphragme`},
      {value:2,label:`Aires des 2 cotes du diaphragme`},
      {value:3,label:`Atteinte diffuse d\'organes extra-lymphatiques`},
    ]},
    {id:`extraganglionnaire`,type:`radio`,label:`Atteinte extraganglionnaire`,options:[
      {value:0,label:`Aucune`},
      {value:1,label:`Atteinte extraganglionnaire localisee (stade E)`},
    ]},
    {id:`symptomes_b`,type:`boolean`,label:`Symptomes B (fievre > 38°C, sueurs nocturnes, amaigrissement > 10% en 6 mois)`},
    {id:`splenique`,type:`boolean`,label:`Atteinte splenique (rate)`},
  ],
  calculate: (values) => {
    const aires = parseInt(values.atteintes||0)
    const extra = parseInt(values.extraganglionnaire||0)
    const sb = values.symptomes_b?1:0
    const spl = values.splenique?1:0
    
    let stade_num = aires + 1
    let stade_romain = ``
    if (aires === 0) stade_romain = `I`
    else if (aires === 1) stade_romain = `II`
    else if (aires === 2) stade_romain = `III`
    else stade_romain = `IV`
    
    let suffixe = extra === 1 ? `E` : ``
    let type_b = sb === 1 ? `B` : `A`
    let splenic = spl === 1 ? `S` : ``
    
    let stade = `${stade_romain}${suffixe}${splenic} ${type_b}`
    
    return {value:stade_num, label:stade, severity: stade_num <= 2 ? 'moderate' : 'high',
      details:{ stade_complet: stade, symptomes_b: sb ? 'Oui' : 'Non' },
      ranges:[
        {min:1,max:1,label:'Stade I - Atteinte 1 aire',severity:'moderate'},
        {min:2,max:2,label:'Stade II - ≥ 2 aires meme cote diaphragme',severity:'moderate'},
        {min:3,max:3,label:'Stade III - Aires des 2 cotes',severity:'high'},
        {min:4,max:4,label:'Stade IV - Atteinte diffuse extra-lymphatique',severity:'high'},
      ]}
  },
  interpretation: `Classification de stade des lymphomes:<br/>• Stade I: 1 seule aire ganglionnaire<br/>• Stade II: ≥ 2 aires du meme cote du diaphragme<br/>• Stade III: aires des 2 cotes du diaphragme<br/>• Stade IV: atteinte diffuse d\'organes extra-lymphatiques<br/><br/>Suffixes: E = atteinte extraganglionnaire localisee, S = splenique<br/>Symptomes B: fievre, sueurs nocturnes, perte de poids<br/>A = asymptomatique, B = symptomes presents`,
  clinicalCommentary: `La classification Ann Arbor a ete modifiee par la classification de Cotswolds (1989). Pour les lymphomes non hodgkiniens, le stade Ann Arbor est utilise conjointement avec l\'IPI. L\'evaluation du stade necessite un bilan complet: TDM TAP/TEP, biopsie ganglionnaire/medullaire.`,
  references: [
    {type:`pubmed`,title:`Carbone PP et al. Cancer Res 1971`,pmid:`5124207`},
    {type:`pubmed`,title:`Lister TA et al. J Clin Oncol 1989`,pmid:`2677091`},
  ],
}
export default lymphome_annarbor
