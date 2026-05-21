import type { FormulaDefinition } from '../types'

const beck: FormulaDefinition = {
  id: `beck`, slug: `beck`,
  name: `Beck Depression Inventory (BDI)`,
  specialty: `psychiatrie`, category: `Depression`,
  description: `Auto-questionnaire de 21 items evaluant la severite des symptomes depressifs (score 0-63)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`tristesse`,type:`radio`,label:`Tristesse`,options:[{value:0,label:`Je ne me sens pas triste`},{value:1,label:`Je me sens triste`},{value:2,label:`Je suis tout le temps triste`},{value:3,label:`Je suis si triste que je ne peux pas le supporter`}]},
    {id:`pessimisme`,type:`radio`,label:`Pessimisme`,options:[{value:0,label:`Je ne suis pas decourage(e)`},{value:1,label:`Je me sens decourage(e)`},{value:2,label:`Je n\'ai aucun espoir`},{value:3,label:`Je sens que je suis irremediable`}]},
    {id:`echec`,type:`radio`,label:`Sentiment d\'echec`,options:[{value:0,label:`Je n\'ai pas l\'impression d\'avoir echoue`},{value:1,label:`J\'ai plus echoue que la moyenne`},{value:2,label:`J\'ai completement echoue`},{value:3,label:`Je suis un echec total`}]},
    {id:`plaisir`,type:`radio`,label:`Perte de plaisir`,options:[{value:0,label:`Je garde du plaisir`},{value:1,label:`J\'ai moins de plaisir`},{value:2,label:`Je n\'ai plus de vrai plaisir`},{value:3,label:`Je n\'ai aucun plaisir`}]},
    {id:`culpabilite`,type:`radio`,label:`Culpabilite`,options:[{value:0,label:`Je ne me sens pas coupable`},{value:1,label:`Je me sens coupable`},{value:2,label:`Je me sens coupable tres souvent`},{value:3,label:`Je me sens constamment coupable`}]},
    {id:`punition`,type:`radio`,label:`Sentiment d\'etre puni(e)`,options:[{value:0,label:`Je ne pense pas etre puni(e)`},{value:1,label:`Je pense que je peux etre puni(e)`},{value:2,label:`Je m\'attends a etre puni(e)`},{value:3,label:`J\'ai l\'impression d\'etre puni(e)`}]},
    {id:`autodeception`,type:`radio`,label:`Auto-deception`,options:[{value:0,label:`Je suis satisfait(e) de moi`},{value:1,label:`Je suis decu(e) de moi`},{value:2,label:`Je suis degoute(e) de moi`},{value:3,label:`Je me deteste`}]},
    {id:`autocritique`,type:`radio`,label:`Autocritique`,options:[{value:0,label:`Je ne me critique pas`},{value:1,label:`Je suis plus critique que d\'habitude`},{value:2,label:`Je me critique pour mes defauts`},{value:3,label:`Je me blâme pour tout`}]},
    {id:`idees_suicidaires`,type:`radio`,label:`Idees suicidaires`,options:[{value:0,label:`Je ne pense pas a me suicider`},{value:1,label:`J\'ai des idees de mort`},{value:2,label:`Je voudrais me suicider`},{value:3,label:`Je me suiciderai si je pouvais`}]},
    {id:`pleurs`,type:`radio`,label:`Pleurs`,options:[{value:0,label:`Je ne pleure pas plus que d\'habitude`},{value:1,label:`Je pleure plus qu\'avant`},{value:2,label:`Je pleure tout le temps`},{value:3,label:`Je voudrais pleurer mais je ne peux pas`}]},
    {id:`agitation`,type:`radio`,label:`Agitation`,options:[{value:0,label:`Je ne suis pas plus agite(e)`},{value:1,label:`Je suis un peu agite(e)`},{value:2,label:`Je suis tres agite(e)`},{value:3,label:`Je suis sans cesse agite(e)`}]},
    {id:`interet`,type:`radio`,label:`Perte d\'interet`,options:[{value:0,label:`Je m\'interesse toujours aux autres`},{value:1,label:`Je m\'interesse moins aux autres`},{value:2,label:`Je ne m\'interesse plus aux autres`},{value:3,label:`Tout m\'est indifferent`}]},
    {id:`indecision`,type:`radio`,label:`Indecision`,options:[{value:0,label:`Je decide normalement`},{value:1,label:`Je remets a plus tard`},{value:2,label:`J\'ai des difficultes a decider`},{value:3,label:`Je n\'arrive plus a decider`}]},
    {id:`image_corporelle`,type:`radio`,label:`Image corporelle`,options:[{value:0,label:`Mon apparence me satisfait`},{value:1,label:`Je me trouve moins bien`},{value:2,label:`Je me trouve laid(e)`},{value:3,label:`Je me trouve repoussant(e)`}]},
    {id:`travail`,type:`radio`,label:`Ralentissement au travail`,options:[{value:0,label:`Je travaille aussi bien qu\'avant`},{value:1,label:`Je dois faire des efforts`},{value:2,label:`Je dois me pousser beaucoup`},{value:3,label:`Je n\'arrive plus a travailler`}]},
    {id:`sommeil`,type:`radio`,label:`Troubles du sommeil`,options:[{value:0,label:`Je dors comme d\'habitude`},{value:1,label:`Je dors moins bien`},{value:2,label:`Je me reveille plus tot`},{value:3,label:`Je me reveille plusieurs heures plus tot`}]},
    {id:`fatigue`,type:`radio`,label:`Fatigue`,options:[{value:0,label:`Je ne suis pas plus fatigue(e)`},{value:1,label:`Je me fatigue plus vite`},{value:2,label:`Je suis fatigue(e) pour tout`},{value:3,label:`Je suis trop fatigue(e) pour faire quoi que ce soit`}]},
    {id:`appetit`,type:`radio`,label:`Appetit`,options:[{value:0,label:`Mon appetit n\'a pas change`},{value:1,label:`J\'ai moins d\'appetit`},{value:2,label:`J\'ai beaucoup moins d\'appetit`},{value:3,label:`Je n\'ai plus d\'appetit du tout`}]},
    {id:`poids`,type:`radio`,label:`Perte de poids`,options:[{value:0,label:`Mon poids est stable`},{value:1,label:`J\'ai perdu < 2 kg`},{value:2,label:`J\'ai perdu 2-5 kg`},{value:3,label:`J\'ai perdu > 5 kg`}]},
    {id:`sante`,type:`radio`,label:`Sante physique`,options:[{value:0,label:`Ma sante est comme d\'habitude`},{value:1,label:`Je m\'inquiete pour ma sante`},{value:2,label:`Des problemes physiques m\'inquietent`},{value:3,label:`Je suis obnubile par ma sante`}]},
    {id:`libido`,type:`radio`,label:`Libido`,options:[{value:0,label:`Ma libido est normale`},{value:1,label:`Ma libido a diminue`},{value:2,label:`Ma libido a beaucoup diminue`},{value:3,label:`J\'ai perdu tout interet sexuel`}]},
  ],
  calculate: (values) => {
    const items = ['tristesse','pessimisme','echec','plaisir','culpabilite','punition','autodeception','autocritique','idees_suicidaires','pleurs','agitation','interet','indecision','image_corporelle','travail','sommeil','fatigue','appetit','poids','sante','libido']
    const s = items.reduce((acc,id) => acc + (values[id]??0), 0)
    const sev = s >= 30 ? 'high' as const : s >= 17 ? 'moderate' as const : s >= 10 ? 'moderate' as const : 'low' as const
    return {value:s, label:`BDI ${s}/63`, severity: sev,
      ranges:[
        {min:0,max:9,label:`Normale ou pas de depression`,severity:'low',recommendation:`Pas de depression. Surveillance simple.`},
        {min:10,max:16,label:`Depression legere`,severity:'moderate',recommendation:`Psychotherapie en premiere intention. Surveillance de l\'evolution.`},
        {min:17,max:29,label:`Depression moderee`,severity:'moderate',recommendation:`Psychotherapie et/ou traitement antidepresseur. Suivi regulier.`},
        {min:30,max:63,label:`Depression severe`,severity:'high',recommendation:`Prise en charge specialisee. Antidepresseur. Hospitalisation si risque suicidaire.`},
      ]}
  },
  interpretation: `Le Beck Depression Inventory (BDI-II) est un auto-questionnaire de 21 items, chacun cote de 0 a 3. Score total de 0 a 63. Seuils : 0-9 (normal), 10-16 (depression legere), 17-29 (moderee), 30-63 (severe). Utilise en depistage et suivi de la depression.`,
  clinicalCommentary: `Reference internationale pour l\'evaluation de la severite depressive. Ne remplace pas un entretien clinique structure. Attention : certains items (tristesse, suicide) sont essentiels pour l\'evaluation du risque. Le BDI-II est adapte a la population generale et psychiatrique adulte. La passation prend 5-10 min.`,
  references: [
    {type:`pubmed`,title:`Beck AT et al. An inventory for measuring depression. Arch Gen Psychiatry 1961`,pmid:`13688369`},
    {type:`pubmed`,title:`Beck AT et al. BDI-II Manual. San Antonio 1996`},
  ],
}
export default beck
