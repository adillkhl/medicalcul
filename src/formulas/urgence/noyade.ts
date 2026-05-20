import type { FormulaDefinition } from '../types'

const noyade: FormulaDefinition = {
  id: `noyade`, slug: `noyade`,
  name: `Noyade (Gravite)`,
  specialty: `urgence`, category: `Noyade`,
  description: `Classification de la noyade selon la severite`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`conscience`,type:`radio`,label:`Etat de conscience`,options:[{value:0,label:`Conscient, alerte`},{value:1,label:`Alteration de conscience`},{value:2,label:`Inconscient`}]},
    {id:`toux`,type:`boolean`,label:`Toux + crepitants pulmonaires`,weight:1},
    {id:`hypoxie`,type:`boolean`,label:`Hypoxie severe (SpO2 < 90)`,weight:1},
    {id:`instabilite`,type:`boolean`,label:`Instabilite hemodynamique`,weight:1},
    {id:`apnee`,type:`boolean`,label:`Apnee / arret cardiaque`,weight:1},
  ],
  calculate: (values) => {
    const cons = parseInt(values.conscience)||0; const s = cons + (values.toux?1:0) + (values.hypoxie?2:0) + (values.instabilite?2:0) + (values.apnee?5:0)
        const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'
        const label = s < 2 ? 'Surveillance simple' : s < 4 ? 'Hospitalisation + O2' : 'Reanimation'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Surveillance 6h',severity:'low' as const},
          {min:2,max:3,label:'Hospitalisation',severity:'moderate' as const},
          {min:4,max:999,label:'Reanimation',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `La noyade est un processus de detresse respiratoire par submersion. L\'hypoxie est le mecanisme principal de morbi-mortalite.`,
  clinicalCommentary: `Toute noyade symptomatique necessite une hospitalisation pour surveillance. L\'O2 et la VNI sont les traitements de premiere ligne. L\'instabilite hemodynamique peut etre liee a une hypothermie associee.`,
  references: [
    {type:`pubmed`,title:`Szpilman D et al. BMJ 2012`,pmid:`23107601`}
  ],
}
export default noyade
