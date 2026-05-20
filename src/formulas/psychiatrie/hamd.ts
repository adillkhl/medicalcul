import type { FormulaDefinition } from '../types'

const hamd: FormulaDefinition = {
  id: `hamd`, slug: `hamd`,
  name: `Hamilton Depression Rating Scale (HAM-D / HDRS)`,
  specialty: `psychiatrie`, category: `Depression`,
  description: `Echelle hetero-evaluee de 17 items mesurant la severite de la depression unipolaire`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`humeur_depressive`,type:`radio`,label:`Humeur depressive (tristesse, abattement)`,options:[{value:0,label:`Absente`},{value:1,label:`Sentiments de tristesse`},{value:2,label:`Acces de tristesse frequents`},{value:3,label:`Tristesse permanente non verbale`},{value:4,label:`Tristesse extreme, pleurs constants`}]},
    {id:`culpabilite`,type:`radio`,label:`Sentiment de culpabilite`,options:[{value:0,label:`Absent`},{value:1,label:`Auto-accusation`},{value:2,label:`Idees de culpabilite`},{value:3,label:`Delire de culpabilite`},{value:4,label:`Hallucinations accusatrices`}]},
    {id:`suicide`,type:`radio`,label:`Idees suicidaires`,options:[{value:0,label:`Absentes`},{value:1,label:`Sentiment que la vie ne vaut pas la peine`},{value:2,label:`Desir de mort passif`},{value:3,label:`Idees ou gestes suicidaires`},{value:4,label:`Tentative de suicide`}]},
    {id:`insomnie_initiale`,type:`radio`,label:`Insomnie initiale`,options:[{value:0,label:`Pas de difficulte`},{value:1,label:`Difficulte d'endormissement`},{value:2,label:`Endormissement > 30 min chaque soir`}]},
    {id:`insomnie_milieu`,type:`radio`,label:`Insomnie du milieu de la nuit`,options:[{value:0,label:`Pas de difficulte`},{value:1,label:`Reveils nocturnes`},{value:2,label:`Plusieurs reveils avec difficulte a se rendormir`}]},
    {id:`insomnie_tardive`,type:`radio`,label:`Insomnie tardive (matinale)`,options:[{value:0,label:`Pas de difficulte`},{value:1,label:`Reveil matinal precoce`},{value:2,label:`Reveil > 2h avant l'heure habituelle`}]},
    {id:`travail_activites`,type:`radio`,label:`Travail et activites`,options:[{value:0,label:`Activite normale`},{value:1,label:`Fatigue au travail`},{value:2,label:`Perte d'interet pour les activites`},{value:3,label:`Reduction du temps de travail`},{value:4,label:`Arret complet pour cause de maladie`}]},
    {id:`ralentissement`,type:`radio`,label:`Ralentissement (bradypsychie, hypokinesie)`,options:[{value:0,label:`Normal`},{value:1,label:`Leger ralentissement`},{value:2,label:`Ralentissement net`},{value:3,label:`Entretien difficile`},{value:4,label:`Stupeur`}]},
    {id:`agitation`,type:`radio`,label:`Agitation psychomotrice`,options:[{value:0,label:`Absente`},{value:1,label:`Agitation legere`},{value:2,label:`Agitation moderee`},{value:3,label:`Agitation severe`},{value:4,label:`Agitation extreme`}]},
    {id:`anxiete_psychique`,type:`radio`,label:`Anxiete psychique`,options:[{value:0,label:`Absente`},{value:1,label:`Tension subjective`},{value:2,label:`Inquietude pour des details`},{value:3,label:`Peur sans objet`},{value:4,label:`Panique`}]},
    {id:`anxiete_somatique`,type:`radio`,label:`Anxiete somatique (symptomes vegetatifs)`,options:[{value:0,label:`Absente`},{value:1,label:`Legere`},{value:2,label:`Moderee`},{value:3,label:`Severe`},{value:4,label:`Tres severe`}]},
    {id:`somatiques_gastro`,type:`radio`,label:`Symptomes somatiques gastro-intestinaux`,options:[{value:0,label:`Aucun`},{value:1,label:`Perte d'appetit`},{value:2,label:`Difficulte a manger sans encouragement`}]},
    {id:`somatiques_generaux`,type:`radio`,label:`Symptomes somatiques generaux`,options:[{value:0,label:`Aucun`},{value:1,label:`Lourdeur, douleurs dorsales`},{value:2,label:`Fatigue extreme, douleurs intenses`}]},
    {id:`sante_sexuelle`,type:`radio`,label:`Symptomes genitaux (libido, regles)`,options:[{value:0,label:`Normaux`},{value:1,label:`Legere perte de libido`},{value:2,label:`Perte totale de libido`}]},
    {id:`hypochondrie`,type:`radio`,label:`Hypochondrie`,options:[{value:0,label:`Absente`},{value:1,label:`Attention excessive au corps`},{value:2,label:`Conviction d'etre malade`},{value:3,label:`Delire hypochondriaque`},{value:4,label:`Hallucinations hypocondriaques`}]},
    {id:`perte_poids`,type:`radio`,label:`Perte de poids`,options:[{value:0,label:`Pas de perte`},{value:1,label:`Perte probable`},{value:2,label:`Perte certaine (declaree)`}]},
    {id:`insight`,type:`radio`,label:`Prise de conscience (insight)`,options:[{value:0,label:`Bonne - reconnait la maladie`},{value:1,label:`Partielle - reconnait les symptomes`},{value:2,label:`Absente - nie toute maladie`}]},
  ],
  calculate: (values) => {
    const items = ['humeur_depressive','culpabilite','suicide','insomnie_initiale','insomnie_milieu','insomnie_tardive','travail_activites','ralentissement','agitation','anxiete_psychique','anxiete_somatique','somatiques_gastro','somatiques_generaux','sante_sexuelle','hypochondrie','perte_poids','insight']
    const s = items.reduce((acc,id) => acc + (values[id]??0), 0)
    const sev = s >= 23 ? 'high' as const : s >= 17 ? 'moderate' as const : s >= 8 ? 'moderate' as const : 'low' as const
    return {value:s, label:`HAM-D ${s}/52`, severity: sev,
      ranges:[
        {min:0,max:7,label:`Pas de depression`,severity:'low',recommendation:`Depression absente ou tres legere. Pas de traitement.`},
        {min:8,max:16,label:`Depression legere a moderee`,severity:'moderate',recommendation:`Psychotherapie ou antidepresseur selon contexte. Surveillance.`},
        {min:17,max:22,label:`Depression moderee a severe`,severity:'moderate',recommendation:`Antidepresseur indique. Suivi regulier.`},
        {min:23,max:52,label:`Depression severe`,severity:'high',recommendation:`Traitement antidepresseur intensif. Hospitalisation a discuter. Surveillance du risque suicidaire.`},
      ]}
  },
  interpretation: `La Hamilton Depression Rating Scale (HAM-D/HDRS) comporte 17 items, chacun cote de 0-2 a 0-4. Score total de 0 a 52. Seuils : 0-7 (normal), 8-16 (leger a modere), 17-22 (modere a severe), >= 23 (severe). Reference pour les essais therapeutiques.`,
  clinicalCommentary: `Gold standard pour l'evaluation de la depression dans les essais cliniques. Evalue les symptomes des 7 derniers jours. Items de sommeil, somatiques et insight importants. Ne pas utiliser seul - complement indispensable de l'entretien clinique. Attention : items ponderes differemment (0-2 vs 0-4).`,
  references: [
    {type:`pubmed`,title:`Hamilton M. A rating scale for depression. J Neurol Neurosurg Psychiatry 1960`,pmid:`14399272`},
    {type:`pubmed`,title:`Hamilton M. Development of a rating scale for primary depressive illness. Br J Soc Psychol 1967`},
  ],
}
export default hamd
