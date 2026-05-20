import type { FormulaDefinition } from '../types'

const silverman: FormulaDefinition = {
  id: `silverman`, slug: `silverman`,
  name: `Score de Silverman (Detresse Respiratoire du Nouveau-ne)`,
  specialty: `pediatrie`, category: `Neonatalogie`,
  description: `Evaluation de la detresse respiratoire du nouveau-ne par 5 items cliniques (score 0-10)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`balancier`,type:`radio`,label:`Balancement thoraco-abdominal`,options:[{value:0,label:`Absent`},{value:1,label:`Discret`},{value:2,label:`Net (respiration en see-saw)`}]},
    {id:`tirage_intercostal`,type:`radio`,label:`Tirage intercostal`,options:[{value:0,label:`Absent`},{value:1,label:`Discret`},{value:2,label:`Prononce`}]},
    {id:`tirage_xiphoidien`,type:`radio`,label:`Tirage xiphoidien (sus-sternal)`,options:[{value:0,label:`Absent`},{value:1,label:`Discret`},{value:2,label:`Prononce`}]},
    {id:`ailes_nez`,type:`radio`,label:`Battement des ailes du nez`,options:[{value:0,label:`Absent`},{value:1,label:`Discret`},{value:2,label:`Prononce`}]},
    {id:`geignement`,type:`radio`,label:`Geignement expiratoire (grunting)`,options:[{value:0,label:`Absent`},{value:1,label:`Audible au stethoscope`},{value:2,label:`Audible a l'oreille`}]},
  ],
  calculate: (values) => {
    const s = (values.balancier??0)+(values.tirage_intercostal??0)+(values.tirage_xiphoidien??0)+(values.ailes_nez??0)+(values.geignement??0)
    const sev = s >= 7 ? 'high' as const : s >= 4 ? 'moderate' as const : 'low' as const
    return {value:s, label:`Silverman ${s}/10`, severity: sev,
      ranges:[
        {min:0,max:3,label:`Detresse legere - Surveillance simple`,severity:'low',recommendation:`Surveillance. Oxygene si SpO2 < 90%. Aspiration rhinopharyngee.`},
        {min:4,max:6,label:`Detresse moderee - Oxygenotherapie / CPAP`,severity:'moderate',recommendation:`Oxygene. Discuter CPAP nasal. Surveillance cardio-respiratoire continue. Bilan etiologique (radio thorax, gazometrie).`},
        {min:7,max:10,label:`Detresse severe - Ventilation assistee probable`,severity:'high',recommendation:`Ventilation non-invasive (CPAP / NIPPV) ou intubation. Transfert en reanimation neonatale.`},
      ]}
  },
  interpretation: `Le score de Silverman quantifie la detresse respiratoire du nouveau-ne. 5 items : balancement thoraco-abdominal, tirage intercostal, tirage xiphoidien, battement des ailes du nez, geignement expiratoire. Chaque item cote 0-2. Score total /10.`,
  clinicalCommentary: `Outil clinique rapide, ne necessite aucun appareillage. Fondamental dans l'evaluation initiale et la surveillance du nouveau-ne en detresse respiratoire. Correlle a la gravite de la maladie des membranes hyalines et de la tachypnee transitoire. A reevaluer frequemment (toutes les 30-60 min).`,
  references: [
    {type:`pubmed`,title:`Silverman WA, Andersen DH. A controlled clinical trial of oxygen therapy in premature infants. Pediatrics 1956`,pmid:`13334558`},
    {type:`guideline`,title:`HAS - Detresse respiratoire du nouveau-ne (2022)`,url:`https://www.has-sante.fr/`},
  ],
}
export default silverman
