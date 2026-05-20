import type { FormulaDefinition } from '../types'

const sofa: FormulaDefinition = {
  id: `sofa`, slug: `sofa`,
  name: `SOFA Score (Sepsis-related Organ Failure Assessment)`,
  specialty: `reanimation`, category: `Sepsis`,
  description: `Evaluation de la defaillance d\'organe dans le sepsis — 6 organes (respiratoire, coagulation, hepatique, cardiovasculaire, neurologique, renal) — score 0-24`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`pao2_fio2`,type:`radio`,label:`Respiratoire - PaO2/FiO2 (mmHg)`,options:[{value:0,label:`>= 400`},{value:1,label:`300-399`},{value:2,label:`200-299`},{value:3,label:`100-199`},{value:4,label:`< 100`}]},
    {id:`plaquettes`,type:`radio`,label:`Coagulation - Plaquettes (x10^3/mm3)`,options:[{value:0,label:`>= 150`},{value:1,label:`100-149`},{value:2,label:`50-99`},{value:3,label:`20-49`},{value:4,label:`< 20`}]},
    {id:`bilirubine`,type:`radio`,label:`Hepatique - Bilirubine (mg/dL)`,options:[{value:0,label:`< 1.2`},{value:1,label:`1.2-1.9`},{value:2,label:`2.0-5.9`},{value:3,label:`6.0-11.9`},{value:4,label:`>= 12`}]},
    {id:`cardiovasculaire`,type:`radio`,label:`Cardiovasculaire`,options:[{value:0,label:`PAM >= 70 mmHg`},{value:1,label:`PAM < 70 mmHg`},{value:2,label:`Dopamine <= 5 ou dobutamine (toute dose)`},{value:3,label:`Dopamine > 5 ou epinephrine <= 0.1`},{value:4,label:`Dopamine > 15 ou epinephrine > 0.1`}]},
    {id:`glasgow`,type:`radio`,label:`Neurologique - Glasgow`,options:[{value:0,label:`15`},{value:1,label:`13-14`},{value:2,label:`10-12`},{value:3,label:`6-9`},{value:4,label:`< 6`}]},
    {id:`creatinine`,type:`radio`,label:`Renal - Creatinine (mg/dL) ou diurese`,options:[{value:0,label:`< 1.2`},{value:1,label:`1.2-1.9`},{value:2,label:`2.0-3.4`},{value:3,label:`3.5-4.9 ou diurese < 500 mL/j`},{value:4,label:`>= 5.0 ou diurese < 200 mL/j`}]},
  ],
  calculate: (values) => {
    const s = (values.pao2_fio2??0)+(values.plaquettes??0)+(values.bilirubine??0)+(values.cardiovasculaire??0)+(values.glasgow??0)+(values.creatinine??0)
    const sev = s >= 10 ? 'high' as const : s >= 5 ? 'moderate' as const : 'low' as const
    return {value:s, label:`SOFA ${s}/24`, severity: sev,
      details:{respiratoire:values.pao2_fio2??0,coagulation:values.plaquettes??0,hepatique:values.bilirubine??0,cardiovasculaire:values.cardiovasculaire??0,neurologique:values.glasgow??0,renal:values.creatinine??0},
      ranges:[
        {min:0,max:4,label:`Defaillance absente ou minime`,severity:'low',recommendation:`Surveillance. Pas de defaillance d\'organe significative.`},
        {min:5,max:9,label:`Defaillance moderee`,severity:'moderate',recommendation:`Surveillance renforcee. Traitement etiologique du sepsis. Support d\'organe discute.`},
        {min:10,max:14,label:`Defaillance severe`,severity:'high',recommendation:`Reanimation agressive. Ventilation mecanique, amines, epuration extra-renale. Pronostic reserve.`},
        {min:15,max:24,label:`Defaillance multi-viscérale severe`,severity:'high',recommendation:`Pronostic sombre. Support multi-viscéral maximal. Reunion de concertation pluridisciplinaire.`},
      ]}
  },
  interpretation: `Le SOFA score (Sepsis-related Organ Failure Assessment) evalue les defaillances d\'organe dans le sepsis. 6 organes côté de 0 a 4. Score total 0-24. Le delta SOFA (changement du score dans le temps) est predictif de la mortalite.`,
  clinicalCommentary: `Utilise dans la definition Sepsis-3 pour identifier le sepsis (augmentation >= 2 du SOFA). Le qSOFA est l\'equivalent rapide aux urgences. Le SOFA n\'est pas un outil de tri mais un score pronostique. La tendance (SOFA quotidien) est plus predictive que la valeur isolee. Un SOFA >= 15 est de tres mauvais pronostic.`,
  references: [
    {type:`pubmed`,title:`Vincent JL et al. The SOFA score to describe organ dysfunction. Intensive Care Med 1996`,pmid:`8844239`},
    {type:`pubmed`,title:`Singer M et al. The Third International Consensus Definitions for Sepsis. JAMA 2016`,pmid:`26903338`},
  ],
}
export default sofa
