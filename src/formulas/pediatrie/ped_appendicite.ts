import type { FormulaDefinition } from '../types'

const ped_appendicite: FormulaDefinition = {
  id: `ped_appendicite`, slug: `ped_appendicite`,
  name: `Pediatric Appendicitis Score (PAS)`,
  specialty: `pediatrie`, category: `Chirurgie Pediatrique`,
  description: `Score clinique pour le diagnostic d'appendicite aigue chez l'enfant (7 items, 0-10)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`migration_douleur`,type:`boolean`,label:`Migration de la douleur vers la FID`,weight:1},
    {id:`anorexie`,type:`boolean`,label:`Anorexie`,weight:1},
    {id:`nausees_vomissements`,type:`boolean`,label:`Nausees / Vomissements`,weight:1},
    {id:`douleur_fid`,type:`boolean`,label:`Douleur en fosse iliaque droite`,weight:2},
    {id:`rebond`,type:`boolean`,label:`Douleur au relachement (rebond / defense)`,weight:2},
    {id:`fievre`,type:`radio`,label:`Fievre`,options:[{value:0,label:`< 38.0°C`},{value:1,label:`>= 38.0°C`}]},
    {id:`leucocytes`,type:`radio`,label:`Leucocytose`,options:[{value:0,label:`< 10000/mm3`},{value:1,label:`10000-15000/mm3`},{value:2,label:`> 15000/mm3`}]},
  ],
  calculate: (values) => {
    const s = (values.migration_douleur?1:0)+(values.anorexie?1:0)+(values.nausees_vomissements?1:0)+(values.douleur_fid?2:0)+(values.rebond?2:0)+(values.fievre??0)+(values.leucocytes??0)
    const sev = s >= 7 ? `high` : s >= 5 ? `moderate` : `low`
    return {value:s, label:`Score PAS ${s}/10`, severity: sev,
      ranges:[
        {min:0,max:4,label:`Faible probabilite d'appendicite`,severity:`low`,recommendation:`Surveillance clinique. Sortie possible si pas d'autre signe. Pas d'imagerie systematique.`},
        {min:5,max:6,label:`Probabilite intermediaire`,severity:`moderate`,recommendation:`Echographie abdominale. Si non contributive : TDM avec injection. Surveillance hospitaliere courte.`},
        {min:7,max:10,label:`Haute probabilite d'appendicite`,severity:`high`,recommendation:`Consultation chirurgicale. Appendicectomie probable. Bilan pre-operatoire.`},
      ]}
  },
  interpretation: `Le Pediatric Appendicitis Score (PAS) est le score pediatrique de reference pour le diagnostic d'appendicite aigue. 7 items (migration de la douleur, anorexie, nausees/vomissements, douleur FID, rebond, fievre, leucocytose) sur 10 points.`,
  clinicalCommentary: `Valide chez l'enfant de 2 a 18 ans. Meilleure specificite que l'Alvarado en population pediatrique. Un score PAS < 5 a une forte valeur predictive negative (VPP > 95%). L'echographie abdominale est l'imagerie de premiere intention chez l'enfant pour eviter l'irradiation.`,
  references: [
    {type:`pubmed`,title:`Samuel M. Pediatric Appendicitis Score. J Pediatr Surg 2002`,pmid:`12077760`},
    {type:`guideline`,title:`HAS - Appendicite de l'enfant (2021)`,url:`https://www.has-sante.fr/`},
  ],
}
export default ped_appendicite
