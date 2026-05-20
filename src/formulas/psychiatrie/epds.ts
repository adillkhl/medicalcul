import type { FormulaDefinition } from '../types'

const epds: FormulaDefinition = {
  id: `epds`, slug: `epds`,
  name: `Edinburgh Postnatal Depression Scale (EPDS)`,
  specialty: `psychiatrie`, category: `Depression`,
  description: `Auto-questionnaire de 10 items pour le depistage de la depression du post-partum et prenatale`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`rire`,type:`radio`,label:`1. Je peux rire et prendre les choses du bon cote`,options:[{value:0,label:`Autant qu'avant`},{value:1,label:`Plutot moins qu'avant`},{value:2,label:`Tres nettement moins`},{value:3,label:`Pas du tout`}]},
    {id:`plaisir`,type:`radio`,label:`2. Je me fais du plaisir en pensant a ce qui m\'attend`,options:[{value:0,label:`Autant qu'avant`},{value:1,label:`Plutot moins qu'avant`},{value:2,label:`Tres nettement moins`},{value:3,label:`Pas du tout`}]},
    {id:`culpabilite`,type:`radio`,label:`3. Je me suis blamee injustement (ou culpabilite)`,options:[{value:0,label:`Non, jamais`},{value:1,label:`Parfois`},{value:2,label:`Assez souvent`},{value:3,label:`Oui, tres souvent`}]},
    {id:`anxiete`,type:`radio`,label:`4. Je me suis sentie inquiete ou anxieuse sans raison`,options:[{value:0,label:`Non`},{value:1,label:`Rarement`},{value:2,label:`Parfois`},{value:3,label:`Tres souvent`}]},
    {id:`panique`,type:`radio`,label:`5. Je me suis sentie effrayee ou paniquee sans raison`,options:[{value:0,label:`Non`},{value:1,label:`Rarement`},{value:2,label:`Parfois`},{value:3,label:`Tres souvent`}]},
    {id:`stress`,type:`radio`,label:`6. Je n\'arrive pas a faire face aux evenements`,options:[{value:0,label:`Non, je m\'adapte`},{value:1,label:`Parfois`},{value:2,label:`Oui, generalement`},{value:3,label:`Oui, completement`}]},
    {id:`sommeil`,type:`radio`,label:`7. J\'ai eu des difficultes a dormir`,options:[{value:0,label:`Non`},{value:1,label:`Parfois`},{value:2,label:`Assez souvent`},{value:3,label:`Tres souvent`}]},
    {id:`tristesse`,type:`radio`,label:`8. Je me suis sentie triste ou malheureuse`,options:[{value:0,label:`Non`},{value:1,label:`Parfois`},{value:2,label:`Assez souvent`},{value:3,label:`Tres souvent`}]},
    {id:`pleurs`,type:`radio`,label:`9. J\'ai pleure sans raison valable`,options:[{value:0,label:`Non`},{value:1,label:`Parfois`},{value:2,label:`Assez souvent`},{value:3,label:`Tres souvent`}]},
    {id:`automutilation`,type:`radio`,label:`10. J\'ai pense a me faire du mal`,options:[{value:0,label:`Jamais`},{value:1,label:`Rarement`},{value:2,label:`Parfois`},{value:3,label:`Oui, souvent`}]},
  ],
  calculate: (values) => {
    const s = (values.rire??0)+(values.plaisir??0)+(values.culpabilite??0)+(values.anxiete??0)+(values.panique??0)+(values.stress??0)+(values.sommeil??0)+(values.tristesse??0)+(values.pleurs??0)+(values.automutilation??0)
    const sev = s >= 13 ? 'high' as const : s >= 10 ? 'moderate' as const : 'low' as const
    return {value:s, label:`EPDS ${s}/30`, severity: sev,
      ranges:[
        {min:0,max:9,label:`Depistage negatif`,severity:'low',recommendation:`Pas de depression post-partum probable. Surveillance clinique habituelle.`},
        {min:10,max:12,label:`Depistage positif - suspicion moderee`,severity:'moderate',recommendation:`Entretien clinique approfondi. Evaluer le risque suicidaire. Discuter psychotherapie.`},
        {min:13,max:30,label:`Depistage positif - depression probable`,severity:'high',recommendation:`Evaluation psychiatrique specialisee. Traitement antidepresseur a discuter. Surveillance du risque de passage a l\'acte.`},
      ]}
  },
  interpretation: `L\'EPDS est un auto-questionnaire de 10 items pour le depistage de la depression du post-partum. Chaque item cote 0 a 3. Score total 0-30. Seuil de depistage : >= 10 (possible), >= 13 (probable). Valide aussi en prenatal.`,
  clinicalCommentary: `Recommandee par la HAS et le CNGOF pour le depistage systematique de la depression post-partum. Administrable en 5 min. L\'item 10 (automutilation) est capital - ne pas hesiter a explorer le risque suicidaire. Attention : ne remplace pas un entretien clinique. Un score bas ne garantit pas l\'absence de pathologie.`,
  references: [
    {type:`pubmed`,title:`Cox JL et al. Detection of postnatal depression. Br J Psychiatry 1987`,pmid:`3651732`},
    {type:`guideline`,title:`HAS - Depression post-partum : depistage et prise en charge (2023)`,url:`https://www.has-sante.fr/`},
  ],
}
export default epds
