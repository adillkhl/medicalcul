import type { FormulaDefinition } from '../types'

const hemoptysie_gravite: FormulaDefinition = {
  id: `hemoptysie_gravite`, slug: `hemoptysie_gravite`,
  name: `Hemoptysie (Gravite)`,
  specialty: `pneumologie`, category: `Hemoptysie`,
  description: `Evaluation de la gravite de l\'hemoptysie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`volume`,type:`radio`,label:`Volume`,options:[{value:0,label:`Stries / crachats hemoptoiques`},{value:1,label:`< 50 mL/24h`},{value:2,label:`50-200 mL/24h`},{value:3,label:`> 200 mL/24h`}]},
    {id:`detresse_resp`,type:`boolean`,label:`Detresse respiratoire`,weight:1},
    {id:`instabilite`,type:`boolean`,label:`Instabilite hemodynamique`,weight:1},
    {id:`anticoagulant`,type:`boolean`,label:`Sous anticoagulant`,weight:1},
    {id:`bronchectasie`,type:`boolean`,label:`ATCD bronchectasies / tuberculose`,weight:1},
  ],
  calculate: (values) => {
    const vol = parseInt(values.volume)||0; const s = vol + (values.detresse_resp?2:0) + (values.instabilite?2:0) + (values.anticoagulant?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        const label = s < 2 ? 'Hemoptysie benigne' : s < 4 ? 'Hemoptysie moderee - Scanner + fibroscopie' : 'Hemoptysie severe - AngioTDM + embolisation possible'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Benigne - Surveillance',severity:'low' as const},
          {min:2,max:3,label:'Moderee - Scanner + FOB',severity:'moderate' as const},
          {min:4,max:999,label:'Severe - Embolisation bronchique',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L\'hemoptysie est une urgence. Le volume et la presence de detresse respiratoire sont les elements cles de la gravite.`,
  clinicalCommentary: `L\'embolisation des arteres bronchiques est le traitement de premiere intention pour les hemoptysies graves (> 200 mL/24h). La fibroscopie bronchique localise le saignement.`,
  references: [
    {type:`pubmed`,title:`Sakr L, Dutau H. Chest 2010`,pmid:`20696760`}
  ],
}
export default hemoptysie_gravite
