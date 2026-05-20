import type { FormulaDefinition } from '../types'

const apgar_nais: FormulaDefinition = {
  id: `apgar_nais`, slug: `apgar_nais`,
  name: `Apgar du Nouveau-né`,
  specialty: `pediatrie`, category: `Neonatalogie`,
  description: `Score d\'évaluation de l\'adaptation à la vie extra-utérine à 1, 5 et 10 minutes de vie (5 items, 0-10)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`coeur`,type:`radio`,label:`Fréquence cardiaque`,options:[{value:0,label:`Absente`},{value:1,label:`< 100/min`},{value:2,label:`≥ 100/min`}]},
    {id:`respiration`,type:`radio`,label:`Effort respiratoire`,options:[{value:0,label:`Absent`},{value:1,label:`Lent / irrégulier`},{value:2,label:`Bon, cri vigoureux`}]},
    {id:`tonus`,type:`radio`,label:`Tonus musculaire`,options:[{value:0,label:`Flaccide`},{value:1,label:`Flexion légère`},{value:2,label:`Mouvements actifs`}]},
    {id:`reflexes`,type:`radio`,label:`Réflexes (irritabilité)`,options:[{value:0,label:`Aucun`},{value:1,label:`Grimace`},{value:2,label:`Éternuement / cri`}]},
    {id:`couleur`,type:`radio`,label:`Coloration`,options:[{value:0,label:`Bleu / pâle`},{value:1,label:`Corps rose, extrémités bleues`},{value:2,label:`Entièrement rose`}]},
  ],
  calculate: (values) => {
    const s = (values.coeur??0)+(values.respiration??0)+(values.tonus??0)+(values.reflexes??0)+(values.couleur??0)
    const sev = s < 4 ? 'high' : s < 7 ? 'moderate' : 'low'
    return {value:s, label:s+'/10', severity: sev,
      ranges:[
        {min:0,max:3,label:`Score 0-3 — Détresse sévère (réanimation complète)`,severity:'high',recommendation:`Réanimation complète immédiate : intubation, massage cardiaque, adrénaline selon protocole. Transférer en réanimation néonatale.`},
        {min:4,max:6,label:`Score 4-6 — Détresse modérée (réanimation intermédiaire)`,severity:'moderate',recommendation:`Ventilation au masque / ballon. Oxygénothérapie. Surveillance continue. Réévaluer à 5 min.`},
        {min:7,max:10,label:`Score 7-10 — Bonne adaptation`,severity:'low',recommendation:`Soins de routine. Séchage, peau-à-peau, clampage différé du cordon si possible. Surveillance clinique simple.`},
      ]}
  },
  interpretation: `Le score d\'Apgar évalue l\'état clinique du nouveau-né à 1, 5 et 10 minutes de vie. Chaque item (cœur, respiration, tonus, réflexes, couleur) côté 0, 1 ou 2. Total sur 10. Un score < 7 à 5 min justifie une réévaluation à 10 min.`,
  clinicalCommentary: `L\'Apgar reste l\'outil de référence universel malgré sa subjectivité. Toujours coter au mieux des capacités du nouveau-né. Le score à 5 min est le plus prédictif du pronostic. Un score bas à 1 min peut simplement refléter une adaptation transitoire — ne pas paniquer, réanimer et réévaluer.`,
  references: [
    {type:`pubmed`,title:`Apgar V. A proposal for a new method of evaluation of the newborn infant. Curr Res Anesth Analg 1953`,pmid:`13083014`},
    {type:`guideline`,title:`HAS — Soins et surveillance du nouveau-né (2023)`,url:`https://www.has-sante.fr/`},
  ],
}
export default apgar_nais
