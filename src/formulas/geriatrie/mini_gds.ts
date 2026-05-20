import type { FormulaDefinition } from '../types'

const mini_gds: FormulaDefinition = {
  id: `mini_gds`, slug: `mini_gds`,
  name: `Mini GDS (Geriatric Depression Scale)`,
  specialty: `geriatrie`, category: `Evaluation Psychologique`,
  description: `Depistage rapide de la depression chez le sujet age (4 questions oui/non)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`q1`,type:`boolean`,label:`Etes-vous satisfait(e) de votre vie ? (NON = point)`,weight:1},
    {id:`q2`,type:`boolean`,label:`Avez-vous souvent le sentiment d'etre decourage(e) et triste ? (OUI = point)`,weight:1},
    {id:`q3`,type:`boolean`,label:`Avez-vous le sentiment que votre vie est vide ? (OUI = point)`,weight:1},
    {id:`q4`,type:`boolean`,label:`Etes-vous heureux(se) la plupart du temps ? (NON = point)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.q1?1:0)+(values.q2?1:0)+(values.q3?1:0)+(values.q4?1:0)
    return {value:s, label:s<=1?'Depression peu probable':s===2?'Depression possible':'Depression probable', severity: s<=1?'low':s===2?'moderate':'high',
      ranges:[
        {min:0,max:1,label:'Depression peu probable',severity:'low'},
        {min:2,max:2,label:'Depression possible - Evaluation approfondie recommandee',severity:'moderate'},
        {min:3,max:4,label:'Depression probable - Consultation specialisee recommandee',severity:'high'},
      ]}
  },
  interpretation: `Le Mini GDS est une version courte en 4 questions de la Geriatric Depression Scale. Un score de 0-1 rend peu probable une depression. Un score de 2 suggere une depression possible. Un score ≥ 3 indique une forte probabilite de depression et justifie une evaluation geronto-psychiatrique.`,
  clinicalCommentary: `Le Mini GDS est adapte aux patients ages, meme avec des troubles cognitifs legers a moderes. Il est preferable au GDS complet (30 items) pour un depistage rapide en consultation. Attention: ne remplace pas un entretien clinique. Le GDS-15 (version 15 items) peut etre utilise pour un depistage plus fin.`,
  references: [
    {type:`pubmed`,title:`Yesavage JA et al. J Psychiatr Res 1982`,pmid:`7183759`},
    {type:`pubmed`,title:`Clement JP et al. Encephale 1997`,pmid:`9686225`},
  ],
}
export default mini_gds
