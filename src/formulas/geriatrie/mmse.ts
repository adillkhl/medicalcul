import type { FormulaDefinition } from '../types'

const mmse: FormulaDefinition = {
  id: `mmse`, slug: `mmse`,
  name: `MMSE de Folstein (Mini Mental State Examination)`,
  specialty: `geriatrie`, category: `Evaluation Cognitive`,
  description: `Evaluation cognitive globale (30 points: orientation 10, apprentissage 3, attention 5, rappel 3, langage 9)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`orientation_temps`,type:`radio`,label:`Orientation temporelle (annee, saison, mois, jour, date)`,options:[
      {value:0,label:`0/5`},{value:1,label:`1/5`},{value:2,label:`2/5`},{value:3,label:`3/5`},{value:4,label:`4/5`},{value:5,label:`5/5`},
    ]},
    {id:`orientation_lieu`,type:`radio`,label:`Orientation spatiale (pays, region, ville, hopital, etage)`,options:[
      {value:0,label:`0/5`},{value:1,label:`1/5`},{value:2,label:`2/5`},{value:3,label:`3/5`},{value:4,label:`4/5`},{value:5,label:`5/5`},
    ]},
    {id:`apprentissage`,type:`radio`,label:`Apprentissage (3 mots: citron, cle, ballon)`,options:[
      {value:0,label:`0/3`},{value:1,label:`1/3`},{value:2,label:`2/3`},{value:3,label:`3/3`},
    ]},
    {id:`attention`,type:`radio`,label:`Attention/Calcul (soustraire 7 de 100, 5 fois)`,options:[
      {value:0,label:`0/5`},{value:1,label:`1/5`},{value:2,label:`2/5`},{value:3,label:`3/5`},{value:4,label:`4/5`},{value:5,label:`5/5`},
    ]},
    {id:`rappel`,type:`radio`,label:`Rappel differe des 3 mots`,options:[
      {value:0,label:`0/3`},{value:1,label:`1/3`},{value:2,label:`2/3`},{value:3,label:`3/3`},
    ]},
    {id:`langage_nommage`,type:`boolean`,label:`Nommer un crayon et une montre`,weight:1},
    {id:`langage_repetition`,type:`boolean`,label:`Repeter \"pas de mais, ni de et, ni de cependant\"`,weight:1},
    {id:`langage_consigne3`,type:`boolean`,label:`Executer ordre 3 temps (prenez papier, pliez, posez par terre)`,weight:1},
    {id:`langage_lecture`,type:`boolean`,label:`Lire et executer \"Fermez les yeux\"`,weight:1},
    {id:`langage_ecriture`,type:`boolean`,label:`Ecrire une phrase complete`,weight:1},
    {id:`langage_copie`,type:`boolean`,label:`Copier le dessin des pentagones qui se coupent`,weight:1},
  ],
  calculate: (values) => {
    const orient = (values.orientation_temps??5)+(values.orientation_lieu??5)
    const apprend = values.apprentissage??3
    const attent = values.attention??5
    const rapp = values.rappel??3
    const lang = (values.langage_nommage?1:0)+(values.langage_repetition?1:0)+(values.langage_consigne3?1:0)+(values.langage_lecture?1:0)+(values.langage_ecriture?1:0)+(values.langage_copie?1:0)
    const s = orient+apprend+attent+rapp+lang
    return {value:s, label:s>=27?'Normal':s>=24?'Subnormal':s>=18?'Troubles legers a moderes':'Troubles severes', severity: s>=27?'low':s>=24?'low':s>=18?'moderate':'high',
      ranges:[
        {min:27,max:30,label:'Normal',severity:'low'},
        {min:24,max:26,label:'Subnormal (possible declin)',severity:'low'},
        {min:18,max:23,label:'Troubles cognitifs legers a moderes',severity:'moderate'},
        {min:0,max:17,label:'Troubles cognitifs severes',severity:'high'},
      ]}
  },
  interpretation: `Le MMSE est le test de reference pour l\'evaluation cognitive globale. Le score maximal est de 30 points. Un score ≤ 24 suggere des troubles cognitifs. La sensibilite et la specificite dependent du niveau d\'education et de l\'age. Ne remplace pas un bilan neuropsychologique complet.`,
  clinicalCommentary: `Le MMSE est influence par le niveau socio-culturel et l\'age. Un score normal n\'exclut pas un declin cognitif (sujets tres cultivés). Le MOCA est parfois preferable pour les stades precoces. Utiliser les courbes de correction selon l\'age et le niveau d\'etudes.`,
  references: [
    {type:`pubmed`,title:`Folstein MF et al. J Psychiatr Res 1975`,pmid:`1202204`},
    {type:`pubmed`,title:`Crum RM et al. JAMA 1993`,pmid:`8418486`},
  ],
}
export default mmse
