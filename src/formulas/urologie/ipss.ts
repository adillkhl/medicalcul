import type { FormulaDefinition } from '../types'

const ipss: FormulaDefinition = {
  id: `ipss`, slug: `ipss`,
  name: `IPSS (International Prostate Symptom Score)`,
  specialty: `urologie`, category: `Prostate`,
  description: `Evaluation des symptomes du bas appareil urinaire lies a l'hypertrophie benigne de la prostate (7 questions + qualite de vie)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`vidange`,type:`radio`,label:`1. Sensation de vidange incomplete de la vessie`,options:[{value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/5`},{value:2,label:`Moins de la moitie`},{value:3,label:`Environ la moitie`},{value:4,label:`Plus de la moitie`},{value:5,label:`Presque toujours`}]},
    {id:`frequence`,type:`radio`,label:`2. Besoin d'uriner moins de 2h apres la derniere miction`,options:[{value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/5`},{value:2,label:`Moins de la moitie`},{value:3,label:`Environ la moitie`},{value:4,label:`Plus de la moitie`},{value:5,label:`Presque toujours`}]},
    {id:`interruption`,type:`radio`,label:`3. Interruption du jet (plusieurs fois) en urinant`,options:[{value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/5`},{value:2,label:`Moins de la moitie`},{value:3,label:`Environ la moitie`},{value:4,label:`Plus de la moitie`},{value:5,label:`Presque toujours`}]},
    {id:`urgences`,type:`radio`,label:`4. Difficultes a differer la miction (urgence)`,options:[{value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/5`},{value:2,label:`Moins de la moitie`},{value:3,label:`Environ la moitie`},{value:4,label:`Plus de la moitie`},{value:5,label:`Presque toujours`}]},
    {id:`jet`,type:`radio`,label:`5. Jet faible (diminution du calibre du jet)`,options:[{value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/5`},{value:2,label:`Moins de la moitie`},{value:3,label:`Environ la moitie`},{value:4,label:`Plus de la moitie`},{value:5,label:`Presque toujours`}]},
    {id:`poussée`,type:`radio`,label:`6. Necessite de pousser pour commencer a uriner`,options:[{value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/5`},{value:2,label:`Moins de la moitie`},{value:3,label:`Environ la moitie`},{value:4,label:`Plus de la moitie`},{value:5,label:`Presque toujours`}]},
    {id:`nycturie`,type:`radio`,label:`7. Frequence de levee la nuit pour uriner`,options:[{value:0,label:`0 fois`},{value:1,label:`1 fois`},{value:2,label:`2 fois`},{value:3,label:`3 fois`},{value:4,label:`4 fois`},{value:5,label:`5 fois ou plus`}]},
    {id:`qualite_vie`,type:`radio`,label:`Qualite de vie : si vous deviez vivre avec ces symptomes, comment vous sentiriez-vous ?`,options:[{value:0,label:`Ravi`},{value:1,label:`Satisfait`},{value:2,label:`Plutot satisfait`},{value:3,label:`Mitige`},{value:4,label:`Plutot insatisfait`},{value:5,label:`Malheureux`},{value:6,label:`Tres malheureux`}]},
  ],
  calculate: (values) => {
    const items = ['vidange','frequence','interruption','urgences','jet','poussée','nycturie']
    const s = items.reduce((acc,id) => acc + (values[id]??0), 0)
    const qol = values.qualite_vie ?? 3
    const sev = s >= 20 ? 'high' as const : s >= 8 ? 'moderate' as const : 'low' as const
    return {value:s, label:`IPSS ${s}/35`, severity: sev,
      details:{qualite_vie:`${qol}/6`},
      ranges:[
        {min:0,max:7,label:`Symptomes legers`,severity:'low',recommendation:`Surveillance. Regles hygieno-dietetiques. Pas de traitement systematique.`},
        {min:8,max:19,label:`Symptomes moderes`,severity:'moderate',recommendation:`Traitement medical : alpha-bloquant ou inhibiteur 5-alpha-reductase. Surveillance de l'evolution.`},
        {min:20,max:35,label:`Symptomes severes`,severity:'high',recommendation:`Traitement medical combine. Chirurgie (Resection trans-urethrale de la prostate - RTUP) si echec du traitement medical.`},
      ]}
  },
  interpretation: `L'IPSS est le questionnaire de reference pour evaluer les symptomes du bas appareil urinaire chez l'homme. 7 questions (score 0-35) + qualite de vie (0-6). Score global : 0-7 (leger), 8-19 (modere), 20-35 (severe).`,
  clinicalCommentary: `Recommande par l'Association Francaise d'Urologie (AFU) et l'EAU pour le suivi de l'HBP. A administrer a chaque consultation. La qualite de vie (QoL) est un element important de la decision therapeutique. Un score severe avec retentissement majeur sur la qualite de vie justifie un traitement chirurgical. Attention : l'IPSS evalue les symptomes, pas la fonction renale. Toujours associer un debitmetre et un dosage du PSA.`,
  references: [
    {type:`pubmed`,title:`Barry MJ et al. The American Urological Association symptom index for benign prostatic hyperplasia. J Urol 1992`,pmid:`1376114`},
    {type:`guideline`,title:`EAU Guidelines - Management of Non-Neurogenic Male LUTS (2023)`,url:`https://uroweb.org/guidelines/`},
  ],
}
export default ipss
