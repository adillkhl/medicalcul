import type { FormulaDefinition } from '../types'

const fleming: FormulaDefinition = {
  id: `fleming`, slug: `fleming`,
  name: `Fleming - Classification des Leucemies Aigues`,
  specialty: `hematologie`, category: `Leucemie`,
  description: `Classification morphologique et immunophenotypique des leucemies aigues (LAL vs LAM)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`morphologie`,type:`radio`,label:`Morphologie blastique predominante`,options:[
      {value:0,label:`Blastes de petite taille, rapport N/C eleve (LAL L1)`},
      {value:1,label:`Blastes de taille moyenne, nucleoles (LAL L2)`},
      {value:2,label:`Blastes de grande taille, cytoplasme granuleux (LAM)`},
      {value:3,label:`Blastes monocytoides (LAM5)`},
      {value:4,label:`Blastes avec bâtonnets d'Auer (LAM)`},
      {value:5,label:`Erythroblastes anormaux (LAM6)`},
    ]},
    {id:`mpoperoxidase`,type:`radio`,label:`Myeloperoxydase (MPO) / Soudan black`,options:[
      {value:0,label:`Nega`},{value:1,label:`Posi`},
    ]},
    {id:`phenotype_b`,type:`boolean`,label:`CD19+/CD10+ (phenotype B)`},
    {id:`phenotype_t`,type:`boolean`,label:`CD3+/CD7+ (phenotype T)`},
    {id:`phenotype_myelo`,type:`boolean`,label:`CD13+/CD33+/CD117+ (phenotype myeloides)`},
  ],
  calculate: (values) => {
    const morph = parseInt(values.morphologie||0)
    const mpo = parseInt(values.mpoperoxidase||0)
    const b = values.phenotype_b?1:0
    const t = values.phenotype_t?1:0
    const myelo = values.phenotype_myelo?1:0
    
    let classification = ``
    let sev: 'low' | 'moderate' | 'high' = `high`
    if (mpo === 0 && (b === 1 || t === 1)) {
      classification = `Leucemie Aigue Lymphoblastique (LAL)`
    } else if (mpo === 1 || myelo === 1) {
      classification = `Leucemie Aigue Myeloblastique (LAM)`
    } else if (mpo === 0 && b === 0 && t === 0 && myelo === 0) {
      classification = `Classification difficile - LAL vs LAM indifferenciee (MO0/MPO-neg)`
    } else {
      classification = `Phenotype mixte possible - Consulter immunophenotype complet`
    }
    
    return {value:morph, label:classification, severity: sev,
      details:{ mpo: mpo ? 'POS' : 'NEG', phenotype_b: b, phenotype_t: t, phenotype_myeloides: myelo },
      ranges:[
        {min:0,max:1,label:'LAL probable',severity:'high'},
        {min:2,max:5,label:'LAM probable',severity:'high'},
      ]}
  },
  interpretation: `La classification de Fleming distingue les leucemies aigues lymphoblastiques (LAL) et myeloblastiques (LAM) sur des criteres morphologiques, cytologiques et immunophenotypiques. La presence de bâtonnets d'Auer et la positivite de la myeloperoxydase orientent vers une LAM.`,
  clinicalCommentary: `La classification precise necessite un immunophenotypage complet (cytofluorometrie) et des analyses cytogenetiques/moleculaires. La classification OMS 2022 est la reference actuelle, remplacant la classification FAB. Le traitement d'urgence ne depend pas de la classification precise mais de l'urgence therapeutique.`,
  references: [
    {type:`pubmed`,title:`Bennett JM et al. Br J Haematol 1976`,pmid:`188440`},
    {type:`pubmed`,title:`Arber DA et al. Blood 2022`,pmid:`34942123`},
  ],
}
export default fleming
