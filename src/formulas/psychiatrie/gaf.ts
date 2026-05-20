import type { FormulaDefinition } from '../types'

const gaf: FormulaDefinition = {
  id: `gaf`, slug: `gaf`,
  name: `Global Assessment of Functioning (GAF)`,
  specialty: `psychiatrie`, category: `Echelles Globales`,
  description: `Echelle d\'evaluation globale du fonctionnement psychologique, social et professionnel (0-100)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`score`,type:`radio`,label:`Niveau de fonctionnement global`,options:[
      {value:100,label:`100-91 : Fonctionnement superieur. Satisfaisant dans tous les domaines.`},
      {value:90,label:`90-81 : Symptomes absents ou minimes. Bon fonctionnement general.`},
      {value:80,label:`80-71 : Symptomes transitoires et reactions normales. Alteration legere.`},
      {value:70,label:`70-61 : Symptomes legers et persistants ou quelques difficultes sociales.`},
      {value:60,label:`60-51 : Symptomes moderes ou difficultes sociales/professionnelles moderees.`},
      {value:50,label:`50-41 : Symptomes graves ou alteration severe du fonctionnement social.`},
      {value:40,label:`40-31 : Alteration de la realite ou de la communication. ou alteration majeure.`},
      {value:30,label:`30-21 : Comportement fortement influence par des idees delirantes/hallucinations.`},
      {value:20,label:`20-11 : Danger de se faire du mal ou de faire du mal aux autres.`},
      {value:10,label:`10-1 : Danger persistant de se faire du mal. ou incapacite totale.`},
      {value:0,label:`0 : Information insuffisante.`},
    ]},
  ],
  calculate: (values) => {
    const s = values.score ?? 60
    const sev = s <= 40 ? 'high' as const : s <= 60 ? 'moderate' as const : 'low' as const
    return {value:s, label:`GAF ${s}`, severity: sev,
      ranges:[
        {min:91,max:100,label:`Fonctionnement superieur`,severity:'low'},
        {min:81,max:90,label:`Symptomes minimes`,severity:'low'},
        {min:71,max:80,label:`Symptomes transitoires`,severity:'low'},
        {min:61,max:70,label:`Symptomes legers persistants`,severity:'moderate'},
        {min:51,max:60,label:`Symptomes moderes`,severity:'moderate'},
        {min:41,max:50,label:`Symptomes graves`,severity:'high'},
        {min:31,max:40,label:`Alteration de la realite`,severity:'high'},
        {min:21,max:30,label:`Influence delirante`,severity:'high'},
        {min:11,max:20,label:`Danger pour soi ou autrui`,severity:'high'},
        {min:1,max:10,label:`Danger persistant`,severity:'high'},
      ]}
  },
  interpretation: `Le GAF (axe V du DSM-IV) evalue le fonctionnement global du patient : psychologique, social et professionnel, sur un continuum allant de la sante (100) a la maladie (1). Ne pas inclure les limitations physiques.`,
  clinicalCommentary: `Outil simple et largement utilise. Limites : subjectivite, manque de fiabilite inter-juges. Dans le DSM-5, la GAF a ete remplacee par le WHODAS. Neanmoins, reste utilise en pratique clinique. Coter le score le plus bas entre la severite des symptomes et l\'alteration du fonctionnement.`,
  references: [
    {type:`pubmed`,title:`Endicott J et al. The Global Assessment Scale. Arch Gen Psychiatry 1976`,pmid:`942250`},
    {type:`guideline`,title:`DSM-IV-TR. Axis V - Global Assessment of Functioning`},
  ],
}
export default gaf
