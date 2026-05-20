import type { FormulaDefinition } from '../types'

const hama: FormulaDefinition = {
  id: `hama`, slug: `hama`,
  name: `Hamilton Anxiety Scale (HAM-A)`,
  specialty: `psychiatrie`, category: `Anxiete`,
  description: `Echelle hetero-evaluee de 14 items mesurant la severite de l\'anxiete psychique et somatique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`anxiete_psychique`,type:`radio`,label:`Anxiete psychique`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Severe`},{value:4,label:`Invalidante`}]},
    {id:`tension`,type:`radio`,label:`Tension`,options:[{value:0,label:`Absente`},{value:1,label:`Sensation de tension`},{value:2,label:`Difficulte a se detendre`},{value:3,label:`Agitation motrice`},{value:4,label:`Tension extreme`}]},
    {id:`peurs`,type:`radio`,label:`Peur (phobies, anticipation)`,options:[{value:0,label:`Absente`},{value:1,label:`Peur discrete`},{value:2,label:`Peur moderee`},{value:3,label:`Peur severe`},{value:4,label:`Peur panique`}]},
    {id:`insomnie`,type:`radio`,label:`Insomnie`,options:[{value:0,label:`Absente`},{value:1,label:`Difficulte d\'endormissement`},{value:2,label:`Reveils nocturnes`},{value:3,label:`Sommeil agite`},{value:4,label:`Insomnie complete`}]},
    {id:`intellectuelles`,type:`radio`,label:`Fonctions intellectuelles (concentration, memoire)`,options:[{value:0,label:`Normales`},{value:1,label:`Difficulte legere`},{value:2,label:`Troubles moderes`},{value:3,label:`Troubles severes`},{value:4,label:`Impossibilite de se concentrer`}]},
    {id:`humeur_depressive`,type:`radio`,label:`Humeur depressive`,options:[{value:0,label:`Absente`},{value:1,label:`Perte d\'interet`},{value:2,label:`Tristesse`},{value:3,label:`Desespoir`},{value:4,label:`Depression severe`}]},
    {id:`moteurs`,type:`radio`,label:`Symptomes moteurs somatiques (courbatures, raideur)`,options:[{value:0,label:`Absents`},{value:1,label:`Legers`},{value:2,label:`Moderes`},{value:3,label:`Severes`},{value:4,label:`Tres severes`}]},
    {id:`sensoriels`,type:`radio`,label:`Symptomes sensoriels somatiques (acouphenes, flou visuel)`,options:[{value:0,label:`Absents`},{value:1,label:`Legers`},{value:2,label:`Moderes`},{value:3,label:`Severes`},{value:4,label:`Tres severes`}]},
    {id:`cardiovasculaires`,type:`radio`,label:`Symptomes cardiovasculaires (palpitations, tachycardie)`,options:[{value:0,label:`Absents`},{value:1,label:`Legers`},{value:2,label:`Moderes`},{value:3,label:`Severes`},{value:4,label:`Tres severes`}]},
    {id:`respiratoires`,type:`radio`,label:`Symptomes respiratoires (oppression, dyspnee)`,options:[{value:0,label:`Absents`},{value:1,label:`Legers`},{value:2,label:`Moderes`},{value:3,label:`Severes`},{value:4,label:`Tres severes`}]},
    {id:`gastro_intestinaux`,type:`radio`,label:`Symptomes gastro-intestinaux (nausees, diarrhee)`,options:[{value:0,label:`Absents`},{value:1,label:`Legers`},{value:2,label:`Moderes`},{value:3,label:`Severes`},{value:4,label:`Tres severes`}]},
    {id:`genito_urinaires`,type:`radio`,label:`Symptomes genito-urinaires (pollakiurie, impuissance)`,options:[{value:0,label:`Absents`},{value:1,label:`Legers`},{value:2,label:`Moderes`},{value:3,label:`Severes`},{value:4,label:`Tres severes`}]},
    {id:`neurovegetatifs`,type:`radio`,label:`Symptomes neurovegetatifs (bouche seche, sueurs)`,options:[{value:0,label:`Absents`},{value:1,label:`Legers`},{value:2,label:`Moderes`},{value:3,label:`Severes`},{value:4,label:`Tres severes`}]},
    {id:`comportement`,type:`radio`,label:`Comportement pendant l\'entretien (agite, nerveux)`,options:[{value:0,label:`Normal`},{value:1,label:`Un peu nerveux`},{value:2,label:`Nerveux`},{value:3,label:`Tendu`},{value:4,label:`Extremement tendu`}]},
  ],
  calculate: (values) => {
    const items = ['anxiete_psychique','tension','peurs','insomnie','intellectuelles','humeur_depressive','moteurs','sensoriels','cardiovasculaires','respiratoires','gastro_intestinaux','genito_urinaires','neurovegetatifs','comportement']
    const s = items.reduce((acc,id) => acc + (values[id]??0), 0)
    const sev = s >= 25 ? 'high' as const : s >= 17 ? 'moderate' as const : 'low' as const
    return {value:s, label:`HAM-A ${s}/56`, severity: sev,
      ranges:[
        {min:0,max:16,label:`Anxiete legere ou absente`,severity:'low',recommendation:`Pas de traitement specifique de l\'anxiete. Surveillance.`},
        {min:17,max:24,label:`Anxiete moderee`,severity:'moderate',recommendation:`Psychotherapie cognitivo-comportementale (TCC) ou traitement pharmacologique (ISRS).`},
        {min:25,max:56,label:`Anxiete severe`,severity:'high',recommendation:`Prise en charge specialisee. Traitement pharmacologique. TCC. Evaluations regulieres.`},
      ]}
  },
  interpretation: `La Hamilton Anxiety Scale (HAM-A) comporte 14 items evaluant l\'anxiete psychique et somatique. Chaque item cote de 0 (absent) a 4 (invalidant/tres severe). Score total de 0 a 56. Seuils : < 17 (anxiete legere), 17-24 (moderee), >= 25 (severe).`,
  clinicalCommentary: `Largement utilise dans les essais cliniques pour mesurer l\'anxiete. Distingue anxiete psychique (items 1-6) et somatique (items 7-14). Attention : certains items (humeur depressive) peuvent se chevaucher avec la depression. L\'echelle evalue les 7 derniers jours. Utile dans le trouble anxieux generalise, le trouble panique et l\'anxiete secondaire.`,
  references: [
    {type:`pubmed`,title:`Hamilton M. The assessment of anxiety states by rating. Br J Med Psychol 1959`,pmid:`13638508`},
    {type:`pubmed`,title:`Hamilton M. Diagnosis and rating of anxiety. Br J Psychiatry 1969`},
  ],
}
export default hama
