import type { FormulaDefinition } from '../types'

const audit: FormulaDefinition = {
  id: `audit`, slug: `audit`,
  name: `AUDIT (Alcohol Use Disorders Identification Test)`,
  specialty: `psychiatrie`, category: `Addictologie`,
  description: `Questionnaire de depistage des troubles de l'usage d'alcool (10 items, 0-40)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`sexe`,type:`radio`,label:`Sexe (pour interpretation adaptee)`,options:[
      {value:0,label:`Homme`},{value:1,label:`Femme`},
    ]},
    {id:`frequence`,type:`radio`,label:`1. Frequence de consommation d'alcool`,options:[
      {value:0,label:`Jamais`},{value:1,label:`1 fois/mois ou moins`},{value:2,label:`2-4 fois/mois`},
      {value:3,label:`2-3 fois/semaine`},{value:4,label:`4 fois ou plus/semaine`},
    ]},
    {id:`quantite`,type:`radio`,label:`2. Nombre de verres standard par occasion`,options:[
      {value:0,label:`1 ou 2`},{value:1,label:`3 ou 4`},{value:2,label:`5 ou 6`},
      {value:3,label:`7 a 9`},{value:4,label:`10 ou plus`},
    ]},
    {id:`occasion_6`,type:`radio`,label:`3. Frequence de >= 6 verres en une occasion`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/mois`},{value:2,label:`1 fois/mois`},
      {value:3,label:`1 fois/semaine`},{value:4,label:`Tous les jours ou presque`},
    ]},
    {id:`controle`,type:`radio`,label:`4. Difficultes a s'arreter apres avoir commence`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/mois`},{value:2,label:`1 fois/mois`},
      {value:3,label:`1 fois/semaine`},{value:4,label:`Tous les jours ou presque`},
    ]},
    {id:`devoir`,type:`radio`,label:`5. Non-accomplissement d'obligations a cause de l'alcool`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/mois`},{value:2,label:`1 fois/mois`},
      {value:3,label:`1 fois/semaine`},{value:4,label:`Tous les jours ou presque`},
    ]},
    {id:`matin`,type:`radio`,label:`6. Alcool le matin pour se remettre d'un exces (boire matinal)`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/mois`},{value:2,label:`1 fois/mois`},
      {value:3,label:`1 fois/semaine`},{value:4,label:`Tous les jours ou presque`},
    ]},
    {id:`culpabilite`,type:`radio`,label:`7. Sentiment de culpabilite apres avoir bu`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/mois`},{value:2,label:`1 fois/mois`},
      {value:3,label:`1 fois/semaine`},{value:4,label:`Tous les jours ou presque`},
    ]},
    {id:`amnésie`,type:`radio`,label:`8. Incapacite a se souvenir de la veille (black-out)`,options:[
      {value:0,label:`Jamais`},{value:1,label:`Moins d'1 fois/mois`},{value:2,label:`1 fois/mois`},
      {value:3,label:`1 fois/semaine`},{value:4,label:`Tous les jours ou presque`},
    ]},
    {id:`blessure`,type:`radio`,label:`9. Blessure ou accident lie a l'alcool`,options:[
      {value:0,label:`Jamais`},{value:2,label:`Oui, mais pas dans l'annee`},{value:4,label:`Oui, dans l'annee`},
    ]},
    {id:`inquietude`,type:`radio`,label:`10. Inquietude de l'entourage sur votre consommation`,options:[
      {value:0,label:`Jamais`},{value:2,label:`Oui, mais pas dans l'annee`},{value:4,label:`Oui, dans l'annee`},
    ]},
  ],
  calculate: (values) => {
    const s = (values.frequence??0)+(values.quantite??0)+(values.occasion_6??0)+(values.controle??0)+(values.devoir??0)+(values.matin??0)+(values.culpabilite??0)+(values.amnésie??0)+(values.blessure??0)+(values.inquietude??0)
    const femme = values.sexe === 1
    const seuilRisque = femme ? 7 : 8
    const sev = s >= 20 ? 'high' as const : s >= 15 ? 'moderate' as const : s >= seuilRisque ? 'moderate' as const : 'low' as const
    return {value:s, label:`AUDIT ${s}/40${femme ? ` (seuil femme: ≥7)` : ` (seuil homme: ≥8)`}`, severity: sev,
      ranges:[
        {min:0,max:seuilRisque-1,label:`Consommation a faible risque`,severity:'low',recommendation:`Pas de probleme d'alcool identifie. Conseils de prevention.`},
        {min:seuilRisque,max:14,label:`Consommation nocive / a risque`,severity:'moderate',recommendation:`Intervention breve. Conseil de reduction de consommation. Surveillance.`},
        {min:15,max:19,label:`Usage nocif probable (dependance legere a moderee)`,severity:'moderate',recommendation:`Evaluation specialisee. Bilan somatique. Proposition de sevrage.`},
        {min:20,max:40,label:`Dependance a l'alcool probable`,severity:'high',recommendation:`Prise en charge specialisee en addictologie. Sevrage medicalise. Traitement de la dependance.`},
      ]}
  },
  interpretation: `L'AUDIT (OMS, 1989) est le gold standard pour le depistage de l'usage d'alcool. 10 items en 3 domaines : consommation (1-3), comportement (4-6), consequences (7-10). Score total 0-40. Seuils differencies selon le sexe : Homme ≥ 8 risque, Femme ≥ 7 risque (WHO recommande des seuils plus bas pour les femmes en raison des differences metaboliques et de morbidite).`,
  clinicalCommentary: `Outil de depistage universel recommande par l'OMS et la HAS. Les questions 1-3 explorent la quantite/frequence. Les questions 4-6 les signes de dependance. Les questions 7-10 les consequences. Un score ≥ 8 chez l'homme ou ≥ 7 chez la femme justifie une intervention. Attention : l'AUDIT-C (3 premieres questions) peut servir de pre-test.`,
  references: [
    {type:`pubmed`,title:`Saunders JB et al. Development of the AUDIT. Addiction 1993`,pmid:`8329970`},
    {type:`guideline`,title:`OMS - AUDIT: Guidelines for Use in Primary Care (2001)`,url:`https://www.who.int/`},
  ],
}
export default audit
