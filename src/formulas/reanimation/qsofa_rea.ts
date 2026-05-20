import type { FormulaDefinition } from '../types'

const qsofa_rea: FormulaDefinition = {
  id: `qsofa_rea`, slug: `qsofa_rea`,
  name: `qSOFA (quick SOFA) - Reanimation`,
  specialty: `reanimation`, category: `Sepsis`,
  description: `Depistage rapide du risque de sepsis severe et de mortalite en reanimation (3 items cliniques)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`glasgow`,type:`radio`,label:`Echelle de Glasgow`,options:[{value:0,label:`Glasgow 15`},{value:1,label:`Glasgow <= 14`}]},
    {id:`pression`,type:`radio`,label:`Pression arterielle systolique`,options:[{value:0,label:`PAS >= 100 mmHg`},{value:1,label:`PAS < 100 mmHg`}]},
    {id:`respi`,type:`radio`,label:`Frequence respiratoire`,options:[{value:0,label:`FR < 22/min`},{value:1,label:`FR >= 22/min`}]},
  ],
  calculate: (values) => {
    const s = (values.glasgow??0)+(values.pression??0)+(values.respi??0)
    const sev = s >= 2 ? 'high' as const : 'low' as const
    return {value:s, label:`qSOFA ${s}/3`, severity: sev,
      ranges:[
        {min:0,max:1,label:`Risque faible`,severity:'low',recommendation:`Probabilite faible de dysfonction d\'organe. Poursuivre surveillance. Ne pas exclure le sepsis cliniquement.`},
        {min:2,max:3,label:`Risque eleve de mortalite`,severity:'high',recommendation:`Probabilite elevee de dysfonction d\'organe (SIRS + defaillance). Admission en reanimation probable. Bilan etiologique et antibiotherapie urgente.`},
      ]}
  },
  interpretation: `Le qSOFA est un outil de chevet rapide pour identifier les patients infectes a risque de decompensation. 3 items : Glasgow, PAS, FR. Un score >= 2 est associe a un risque eleve de mortalite hospitaliere.`,
  clinicalCommentary: `Utilise dans les services d\'urgence et de reanimation. Simple, rapide, purement clinique. Ne remplace pas le SOFA. Un qSOFA = 2 justifie l\'evaluation de la defaillance d\'organe (SOFA) et l\'admission en reanimation. Attention : le qSOFA a une faible sensibilite (ne pas exclure un sepsis sur un score bas).`,
  references: [
    {type:`pubmed`,title:`Seymour CW et al. Assessment of Clinical Criteria for Sepsis. JAMA 2016`,pmid:`26903338`},
    {type:`pubmed`,title:`Vincent JL. qSOFA: a new scoring system for sepsis? J Crit Care 2017`,pmid:`28433835`},
  ],
}
export default qsofa_rea
