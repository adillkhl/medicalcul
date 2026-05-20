import type { FormulaDefinition } from '../types'

const clock_test: FormulaDefinition = {
  id: `clock_test`, slug: `clock_test`,
  name: `Test du Dessin de l'Horloge (Shulman)`,
  specialty: `geriatrie`, category: `Evaluation Cognitive`,
  description: `Test de dessin de l'horloge pour le depistage des troubles visuo-constructifs et executifs (cotation 1-6)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`score`,type:`radio`,label:`Cotation de Shulman`,options:[
      {value:6,label:`1 - Horloge parfaite (cercle, chiffres, aiguilles correctes)`},
      {value:5,label:`2 - Erreurs mineures de positionnement des aiguilles`},
      {value:4,label:`3 - Erreurs moderees (chiffres ou aiguilles mal positionnes)`},
      {value:3,label:`4 - Disorganisation visuo-spatiale moderee`},
      {value:2,label:`5 - Disorganisation visuo-spatiale severe`},
      {value:1,label:`6 - Absence d'horloge reconnaissable`},
    ]},
  ],
  calculate: (values) => {
    const s = values.score??6
    const sev = s >= 5 ? 'low' : s >= 3 ? 'moderate' : 'high'
    return {value:s, label:s>=5?'Normal':s>=3?'Anormal (troubles moderes)':'Anormal (troubles severes)', severity: sev,
      ranges:[
        {min:5,max:6,label:'Normal ou subnormal',severity:'low'},
        {min:3,max:4,label:'Troubles visuo-constructifs moderes',severity:'moderate'},
        {min:1,max:2,label:'Troubles visuo-constructifs severes',severity:'high'},
      ]}
  },
  interpretation: `Le test du dessin de l'horloge est un outil de depistage rapide des troubles cognitifs. La cotation de Shulman va de 1 (horloge parfaite) a 6 (absence d'horloge reconnaissable). Les scores 5-6 sont consideres normaux, 3-4 suggerent des troubles moderes, 1-2 des troubles severes.`,
  clinicalCommentary: `Test rapide (2-3 min) et bien accepte. Sensible aux dysfonctions executives et visuo-spatiales. Peut detecter des troubles meme avec un MMSE normal. Simple a administrer: demander de dessiner une horloge avec les chiffres et les aiguilles indiquant 11h10.`,
  references: [
    {type:`pubmed`,title:`Shulman KI et al. Int J Geriatr Psychiatry 1993`,pmid:`pubmed-link`},
    {type:`pubmed`,title:`Sunderland T et al. J Am Geriatr Soc 1989`,pmid:`2921461`},
  ],
}
export default clock_test
