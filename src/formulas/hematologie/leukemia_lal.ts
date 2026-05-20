import type { FormulaDefinition } from '../types'

const leukemia_lal: FormulaDefinition = {
  id: `leukemia_lal`, slug: `leukemia_lal`,
  name: `Classification LAL L1/L2/L3 (FAB)`,
  specialty: `hematologie`, category: `Leucemie`,
  description: `Classification morphologique FAB des leucemies aigues lymphoblastiques (LAL)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`taille_cellule`,type:`radio`,label:`Taille cellulaire predominante`,options:[
      {value:0,label:`Petites cellules homogenes (L1)`},
      {value:1,label:`Cellules de taille moyenne, heterogenes (L2)`},
      {value:2,label:`Grandes cellules avec cytoplasme basophile (L3)`},
    ]},
    {id:`chromatine`,type:`radio`,label:`Chromatine nucleaire`,options:[
      {value:0,label:`Condensee, nucleoles discrets (L1)`},
      {value:1,label:`Fine, nucleoles proeminents (L2)`},
      {value:2,label:`Fine, nucleoles multiples, vacuoles (L3)`},
    ]},
    {id:`cytoplasme`,type:`radio`,label:`Cytoplasme`,options:[
      {value:0,label:`Peu abondant (L1)`},
      {value:1,label:`Moderement abondant (L2)`},
      {value:2,label:`Abondant, basophile, vacuoles (L3)`},
    ]},
    {id:`micropores`,type:`radio`,label:`MPO/Soudan Black`,options:[
      {value:0,label:`Nega`},
      {value:1,label:`Posi`},
    ]},
  ],
  calculate: (values) => {
    const taille = parseInt(values.taille_cellule||0)
    const chromatin = parseInt(values.chromatine||0)
    const cyto = parseInt(values.cytoplasme||0)
    const mpo = parseInt(values.micropores||0)
    
    const score_l1 = (taille === 0 ? 1 : 0) + (chromatin === 0 ? 1 : 0) + (cyto === 0 ? 1 : 0)
    const score_l2 = (taille === 1 ? 1 : 0) + (chromatin === 1 ? 1 : 0) + (cyto === 1 ? 1 : 0)
    const score_l3 = (taille === 2 ? 1 : 0) + (chromatin === 2 ? 1 : 0) + (cyto === 2 ? 1 : 0)
    
    let classification = ``
    if (score_l3 >= 2) classification = `LAL L3 (type Burkitt)`
    else if (score_l1 >= 2) classification = `LAL L1`
    else if (score_l2 >= 2) classification = `LAL L2`
    else classification = `LAL L1/L2 (frontiere)`
    
    if (mpo === 1) classification = `LAM (MPO positive) - Ne correspond pas a une LAL`
    
    return {value:taille, label:classification, severity: `high`,
      ranges:[
        {min:0,max:0,label:'LAL L1 (petits blastes)',severity:'high'},
        {min:1,max:1,label:'LAL L2 (blastes intermediaires)',severity:'high'},
        {min:2,max:2,label:'LAL L3 (type Burkitt)',severity:'high'},
      ]}
  },
  interpretation: `La classification FAB des LAL repose sur la morphologie:<br/>• L1 (75% des LAL pediatriques): petits blastes homogenes, chromatine condensee, peu de cytoplasme<br/>• L2 (50% des LAL adultes): blastes plus grands, nucleoles visibles, cytoplasme modere<br/>• L3 (< 5%): cellules de Burkitt, cytoplasme basophile vacuolise, granules lipidiques`,
  clinicalCommentary: `La classification morphologique L1/L2 a peu d'impact pronostique independant. Elle est supplantee par l'immunophenotype (B/T) et les anomalies cytogenetiques/moleculaires (t(9;22), t(4;11), t(12;21)). La LAL L3 correspond au lymphome de Burkitt (myc rearrangement). La MPO est toujours negative dans les LAL vraies.`,
  references: [
    {type:`pubmed`,title:`Bennett JM et al. Br J Haematol 1976`,pmid:`188440`},
    {type:`pubmed`,title:`Bennett JM et al. Ann Intern Med 1985`,pmid:`3861118`},
  ],
}
export default leukemia_lal
