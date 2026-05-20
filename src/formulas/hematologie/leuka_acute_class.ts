import type { FormulaDefinition } from '../types'

const leuka_acute_class: FormulaDefinition = {
  id: `leuka_acute_class`, slug: `leuka_acute_class`,
  name: `Classification FAB des Leucemies Aigues`,
  specialty: `hematologie`, category: `Leucemie`,
  description: `Classification Franco-Americano-Britannique (FAB) des leucemies aigues: LAL (L1-L3) et LAM (M0-M7)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`type_leucemie`,type:`radio`,label:`Type de leucemie aigue`,options:[
      {value:0,label:`LAL (Lymphoblastique)`},
      {value:1,label:`LAM (Myeloblastique)`},
    ]},
    {id:`morpho_lal`,type:`radio`,label:`Si LAL - Morphologie blastique`,options:[
      {value:0,label:`L1 - Petits blastes, rapport N/C eleve, nucleoles discrets`},
      {value:1,label:`L2 - Blastes plus grands, N/C variable, nucleoles visibles`},
      {value:2,label:`L3 - Blastes de type Burkitt (cytoplasme basophile, vacuoles)`},
    ]},
    {id:`morpho_lam`,type:`radio`,label:`Si LAM - Sous-type morphologique`,options:[
      {value:0,label:`M0 - LAM indifferenciee (MPO < 3%, peu de granules)`},
      {value:1,label:`M1 - LAM sans maturation (blastes > 90%, MPO+ > 3%)`},
      {value:2,label:`M2 - LAM avec maturation (blastes 30-90%, differenciation granuleuse)`},
      {value:3,label:`M3 - LAM promyelocytaire (promyelocytes anormaux avec granules)`},
      {value:4,label:`M4 - LAM myelo-monocytaire (monocytes > 20% medullaire)`},
      {value:5,label:`M5 - LAM monocytaire (monoblastes > 80% medullaire)`},
      {value:6,label:`M6 - Erythroleucemie (erythroblastes > 50%)`},
      {value:7,label:`M7 - LAM megacaryoblastique (CD41+, CD61+)`},
    ]},
  ],
  calculate: (values) => {
    const type = parseInt(values.type_leucemie||0)
    const lal = parseInt(values.morpho_lal||0)
    const lam = parseInt(values.morpho_lam||0)
    
    const lal_labels = [`LAL L1`, `LAL L2`, `LAL L3 (type Burkitt)`]
    const lam_labels = [
      `LAM M0 (indifferenciee)`, `LAM M1 (sans maturation)`, `LAM M2 (avec maturation)`,
      `LAM M3 (promyelocytaire)`, `LAM M4 (myelo-monocytaire)`, `LAM M5 (monocytaire)`,
      `LAM M6 (erythroleucemie)`, `LAM M7 (megacaryoblastique)`,
    ]
    
    const label = type === 0 ? lal_labels[lal] : lam_labels[lam]
    
    return {value:type, label, severity: `high`,
      details:{ type_leucemie: type === 0 ? `LAL` : `LAM` },
      ranges:[
        {min:0,max:0,label:`LAL (L1-L3)`,severity:`high`},
        {min:1,max:1,label:`LAM (M0-M7)`,severity:`high`},
      ]}
  },
  interpretation: `La classification FAB (Franco-Americano-Britannique, 1976) est une classification morphologique et cytologique des leucemies aigues:<br/><br/>LAL (Lymphoblastiques):<br/>• L1: Petits blastes homogenes, enfants<br/>• L2: Blastes plus grands, plus heterogenes, adultes<br/>• L3: Type Burkitt, cytoplasme basophile vacuolise<br/><br/>LAM (Myeloblastiques): M0 a M7 selon la differenciation et la lignee impliquee.`,
  clinicalCommentary: `La classification FAB a ete largement remplacee par la classification OMS (2022) qui integre les donnees genetiques et moleculaires. Cependant, la classification FAB reste utile en routine pour une orientation rapide avant les resultats de cytogenetique. La LAM M3 (promyelocytaire) est une urgence therapeutique (risque de CIVD).`,
  references: [
    {type:`pubmed`,title:`Bennett JM et al. Br J Haematol 1976`,pmid:`188440`},
    {type:`pubmed`,title:`Bennett JM et al. Ann Intern Med 1985`,pmid:`3861118`},
  ],
}
export default leuka_acute_class
