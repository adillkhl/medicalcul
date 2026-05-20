import type { FormulaDefinition } from '../types'

const stone_score: FormulaDefinition = {
  id: `stone_score`, slug: `stone_score`,
  name: `Score de Prediction d\'Expulsion de Lithiase Ureterale`,
  specialty: `urologie`, category: `Lithiase`,
  description: `Score clinique predictif de l\'expulsion spontanee d\'un calcul ureteral selon la taille, la position et les symptomes`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`taille_mm`,type:`radio`,label:`Taille du calcul (plus grand diametre)`,options:[{value:3,label:`< 4 mm`},{value:1,label:`4-6 mm`},{value:0,label:`> 6 mm`}]},
    {id:`position`,type:`radio`,label:`Position du calcul`,options:[{value:3,label:`Tiers distal (intra-mural / juxta-vesical)`},{value:2,label:`Tiers moyen`},{value:0,label:`Tiers proximal (lombaire)`}]},
    {id:`symptomes`,type:`radio`,label:`Duree des symptomes avant consultation`,options:[{value:2,label:`< 24 heures`},{value:1,label:`24-48 heures`},{value:0,label:`> 48 heures`}]},
    {id:`cotes`,type:`radio`,label:`Cote du calcul`,options:[{value:1,label:`Droit`},{value:0,label:`Gauche`},{value:0,label:`Bilateral`}]},
  ],
  calculate: (values) => {
    const s = (values.taille_mm??0)+(values.position??0)+(values.symptomes??0)+(values.cotes??0)
    let sev: 'low'|'moderate'|'high'
    let probabilite: string
    if (s >= 8) { sev = 'low'; probabilite = 'Forte probabilite (> 90%) d\'expulsion spontanee' }
    else if (s >= 5) { sev = 'moderate'; probabilite = 'Probabilite moderee (60-90%) d\'expulsion spontanee' }
    else { sev = 'high'; probabilite = 'Faible probabilite (< 60%) - Intervention probable' }

    return {value:s, label:`Score ${s}/9 - ${probabilite}`, severity: sev,
      ranges:[
        {min:0,max:4,label:`Score 0-4 - Faible probabilite d\'expulsion`,severity:'high',recommendation:`Traitement actif a discuter : lithotritie extra-corporelle (LEC) ou ureteroscopie. Analgesie.`},
        {min:5,max:7,label:`Score 5-7 - Probabilite moderee d\'expulsion`,severity:'moderate',recommendation:`Traitement medical expulsif (alpha-bloquant type tamsulosine). Surveillance 4-6 semaines. Re-evaluation.`},
        {min:8,max:9,label:`Score 8-9 - Forte probabilite d\'expulsion spontanee`,severity:'low',recommendation:`Traitement medical expulsif (alpha-bloquant). Antalgiques regles. Surveillance simple. Re-evaluation a 4 semaines.`},
      ]}
  },
  interpretation: `Score predictif de l\'expulsion spontanee d\'un calcul ureteral. Criteres : taille (< 4 mm = 3 pts, 4-6 = 1 pt, > 6 = 0 pt), position (distal = 3 pts, moyen = 2, proximal = 0), duree des symptomes (< 24h = 2 pts, 24-48h = 1, > 48h = 0), cote (droit = 1 pt). Score max 9.`,
  clinicalCommentary: `Outil d\'aide a la decision pour la prise en charge des coliques nephretiques avec calcul ureteral. Les calculs distaux < 6 mm ont la meilleure probabilite d\'expulsion spontanee. Le traitement medical expulsif par alpha-bloquant (tamsulosine) est recommande par l\'EAU et l\'AFU. Indications d\'intervention : > 6 mm, echec du traitement medical, infection, obstruction renale, douleur non controlable. Le score n\'est pas valide pour les calculs renaux.`,
  references: [
    {type:`pubmed`,title:`Preminger GM et al. 2007 Guideline for the management of ureteral calculi. J Urol 2007`,pmid:`17714717`},
    {type:`guideline`,title:`EAU - Urolithiasis Guidelines (2023)`,url:`https://uroweb.org/guidelines/urolithiasis`},
  ],
}
export default stone_score
