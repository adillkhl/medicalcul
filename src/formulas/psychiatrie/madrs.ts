import type { FormulaDefinition } from '../types'

const madrs: FormulaDefinition = {
  id: `madrs`, slug: `madrs`,
  name: `Montgomery-Asberg Depression Rating Scale (MADRS)`,
  specialty: `psychiatrie`, category: `Depression`,
  description: `Echelle hetero-evaluee de 10 items mesurant la severite de la depression, sensible au changement`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`tristesse_apparente`,type:`radio`,label:`Tristesse apparente`,options:[{value:0,label:`0 — Pas de tristesse`},{value:1,label:`1 —`},{value:2,label:`2 — Semble triste mais peut se detendre`},{value:3,label:`3 —`},{value:4,label:`4 — Tristesse apparente presque tout le temps`},{value:5,label:`5 —`},{value:6,label:`6 — Tristesse permanente, douleur morale`}]},
    {id:`tristesse_exprimee`,type:`radio`,label:`Tristesse exprimee (verbale)`,options:[{value:0,label:`0 — Pas de tristesse`},{value:1,label:`1 —`},{value:2,label:`2 — Tristesse occasionnelle`},{value:3,label:`3 —`},{value:4,label:`4 — Tristesse prolongee`},{value:5,label:`5 —`},{value:6,label:`6 — Tristesse constante, desespoir`}]},
    {id:`tension_interne`,type:`radio`,label:`Tension interne`,options:[{value:0,label:`0 — Tranquille`},{value:1,label:`1 —`},{value:2,label:`2 — Tension legere`},{value:3,label:`3 —`},{value:4,label:`4 — Tension nette avec difficultes`},{value:5,label:`5 —`},{value:6,label:`6 — Panique, terreur`}]},
    {id:`sommeil`,type:`radio`,label:`Sommeil reduit`,options:[{value:0,label:`0 — Sommeil normal`},{value:1,label:`1 —`},{value:2,label:`2 — Legere difficulte`},{value:3,label:`3 —`},{value:4,label:`4 — Sommeil reduit de 2h`},{value:5,label:`5 —`},{value:6,label:`6 — Moins de 3h de sommeil`}]},
    {id:`appetit`,type:`radio`,label:`Appetit reduit`,options:[{value:0,label:`0 — Appetit normal`},{value:1,label:`1 —`},{value:2,label:`2 — Appetit legerement reduit`},{value:3,label:`3 —`},{value:4,label:`4 — Appetit nettement reduit`},{value:5,label:`5 —`},{value:6,label:`6 — Refuse de manger`}]},
    {id:`concentration`,type:`radio`,label:`Difficulte de concentration`,options:[{value:0,label:`0 — Normale`},{value:1,label:`1 —`},{value:2,label:`2 — Difficulte legere`},{value:3,label:`3 —`},{value:4,label:`4 — Difficulte frequente`},{value:5,label:`5 —`},{value:6,label:`6 — Incapacite totale`}]},
    {id:`lassitude`,type:`radio`,label:`Lassitude / ralentissement`,options:[{value:0,label:`0 — Normal`},{value:1,label:`1 —`},{value:2,label:`2 — Difficulte a commencer`},{value:3,label:`3 —`},{value:4,label:`4 — Ralentissement marque`},{value:5,label:`5 —`},{value:6,label:`6 — Stupeur`}]},
    {id:`sentiments`,type:`radio`,label:`Incapacite a ressentir (anhedonie)`,options:[{value:0,label:`0 — Interet normal`},{value:1,label:`1 —`},{value:2,label:`2 — Moins d'interet`},{value:3,label:`3 —`},{value:4,label:`4 — Perte d'interet marquee`},{value:5,label:`5 —`},{value:6,label:`6 — Indifference totale`}]},
    {id:`pessimisme`,type:`radio`,label:`Pensees pessimistes`,options:[{value:0,label:`0 — Optimiste`},{value:1,label:`1 —`},{value:2,label:`2 — Decouragement`},{value:3,label:`3 —`},{value:4,label:`4 — Desespoir`},{value:5,label:`5 —`},{value:6,label:`6 — Idees d'incurabilite`}]},
    {id:`suicide`,type:`radio`,label:`Idees suicidaires`,options:[{value:0,label:`0 — Aucune`},{value:1,label:`1 —`},{value:2,label:`2 — Lassitude de vivre`},{value:3,label:`3 —`},{value:4,label:`4 — Desir de mort`},{value:5,label:`5 —`},{value:6,label:`6 — Projets ou tentatives`}]},
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
  interpretation: `La MADRS est une echelle de 10 items (cotes 0-6 avec intermediaires 1,3,5) sensible au changement therapeutique. Score total 0-60. Seuils : 0-6 (normal), 7-18 (leger), 19-30 (modere), >= 31 (severe). Tres utilisee dans les essais cliniques pour sa sensibilite. Les valeurs impaires (1,3,5) permettent une graduation plus fine entre les descripteurs pairs.`,
  clinicalCommentary: `Plus sensible au changement que la HAM-D, meilleure pour les suivis d'evolution sous traitement. Cotation sur les 7 derniers jours. Les items pairs (cotes 0,2,4,6) offrent plus de granularite avec les intermediaires 1,3,5. Attention aux scores d'anxiete (item tension interne) et de suicide (ne pas sous-estimer).`,
  references: [
    {type:`pubmed`,title:`Montgomery SA, Asberg M. A new depression scale designed to be sensitive to change. Br J Psychiatry 1979`,pmid:`738828`},
  ],
}
export default madrs
