import type { FormulaDefinition } from '../types'

const madrs: FormulaDefinition = {
  id: `madrs`, slug: `madrs`,
  name: `Montgomery-Asberg Depression Rating Scale (MADRS)`,
  specialty: `psychiatrie`, category: `Depression`,
  description: `Echelle hetero-evaluee de 10 items mesurant la severite de la depression, sensible au changement`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`tristesse_apparente`,type:`radio`,label:`Tristesse apparente`,options:[{value:0,label:`Pas de tristesse`},{value:2,label:`Semble triste mais peut se detendre`},{value:4,label:`Tristesse apparente presque tout le temps`},{value:6,label:`Tristesse permanente, douleur morale`}]},
    {id:`tristesse_exprimee`,type:`radio`,label:`Tristesse exprimee (verbale)`,options:[{value:0,label:`Pas de tristesse`},{value:2,label:`Tristesse occasionnelle`},{value:4,label:`Tristesse prolongee`},{value:6,label:`Tristesse constante, desespoir`}]},
    {id:`tension_interne`,type:`radio`,label:`Tension interne`,options:[{value:0,label:`Tranquille`},{value:2,label:`Tension legere`},{value:4,label:`Tension nette avec difficultes`},{value:6,label:`Panique, terreur`}]},
    {id:`sommeil`,type:`radio`,label:`Sommeil reduit`,options:[{value:0,label:`Sommeil normal`},{value:2,label:`Legere difficulte`},{value:4,label:`Sommeil reduit de 2h`},{value:6,label:`Moins de 3h de sommeil`}]},
    {id:`appetit`,type:`radio`,label:`Appetit reduit`,options:[{value:0,label:`Appetit normal`},{value:2,label:`Appetit legerement reduit`},{value:4,label:`Appetit nettement reduit`},{value:6,label:`Refuse de manger`}]},
    {id:`concentration`,type:`radio`,label:`Difficulte de concentration`,options:[{value:0,label:`Normale`},{value:2,label:`Difficulte legere`},{value:4,label:`Difficulte frequente`},{value:6,label:`Incapacite totale`}]},
    {id:`lassitude`,type:`radio`,label:`Lassitude / ralentissement`,options:[{value:0,label:`Normal`},{value:2,label:`Difficulte a commencer`},{value:4,label:`Ralentissement marque`},{value:6,label:`Stupeur`}]},
    {id:`sentiments`,type:`radio`,label:`Incapacite a ressentir (anhédonie)`,options:[{value:0,label:`Interet normal`},{value:2,label:`Moins d'interet`},{value:4,label:`Perte d'interet marquee`},{value:6,label:`Indifference totale`}]},
    {id:`pessimisme`,type:`radio`,label:`Pensees pessimistes`,options:[{value:0,label:`Optimiste`},{value:2,label:`Decouragement`},{value:4,label:`Desespoir`},{value:6,label:`Idees d'incurabilite`}]},
    {id:`suicide`,type:`radio`,label:`Idees suicidaires`,options:[{value:0,label:`Aucune`},{value:2,label:`Lassitude de vivre`},{value:4,label:`Desir de mort`},{value:6,label:`Projets ou tentatives`}]},
  ],
  calculate: (values) => {
    const items = ['tristesse_apparente','tristesse_exprimee','tension_interne','sommeil','appetit','concentration','lassitude','sentiments','pessimisme','suicide']
    const s = items.reduce((acc,id) => acc + (values[id]??0), 0)
    const sev = s >= 31 ? 'high' as const : s >= 19 ? 'moderate' as const : s >= 7 ? 'moderate' as const : 'low' as const
    return {value:s, label:`MADRS ${s}/60`, severity: sev,
      ranges:[
        {min:0,max:6,label:`Normal / pas de depression`,severity:'low',recommendation:`Pas de depression. Surveillance.`},
        {min:7,max:18,label:`Depression legere`,severity:'moderate',recommendation:`Psychotherapie ou surveillance. Traitement selon l'evolution.`},
        {min:19,max:30,label:`Depression moderee`,severity:'moderate',recommendation:`Antidepresseur indique. Suivi regulier.`},
        {min:31,max:60,label:`Depression severe`,severity:'high',recommendation:`Traitement intensif. Hospitalisation si risque suicidaire.`},
      ]}
  },
  interpretation: `La MADRS est une echelle de 10 items (cotes 0-6) sensible au changement therapeutique. Score total 0-60. Seuils : 0-6 (normal), 7-18 (leger), 19-30 (modere), >= 31 (severe). Tres utilisee dans les essais cliniques pour sa sensibilite.`,
  clinicalCommentary: `Plus sensible au changement que la HAM-D, meilleure pour les suivis d'evolution sous traitement. Cotation sur les 7 derniers jours. Les items pairs (cotes 0,2,4,6) offrent plus de granularite. Attention aux scores d'anxiete (item tension interne) et de suicide (ne pas sous-estimer).`,
  references: [
    {type:`pubmed`,title:`Montgomery SA, Asberg M. A new depression scale designed to be sensitive to change. Br J Psychiatry 1979`,pmid:`738828`},
  ],
}
export default madrs
