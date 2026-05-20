import type { FormulaDefinition } from '../types'

const anaphylaxie: FormulaDefinition = {
  id: `anaphylaxie`, slug: `anaphylaxie`,
  name: `Anaphylaxie (Gravite)`,
  specialty: `urgence`, category: `Allergie`,
  description: `Gradation de la severite de la reaction anaphylactique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`cutane`,type:`boolean`,label:`Urticaire/angi-oedeme/erytheme`,weight:1},
    {id:`respiratoire`,type:`boolean`,label:`Dyspnee/stridor/wheezing`,weight:1},
    {id:`cv`,type:`boolean`,label:`Hypotension/Tachycardie`,weight:1},
    {id:`digestif`,type:`boolean`,label:`Nausees/ vomissements/ diarhee`,weight:1},
    {id:`neuro`,type:`boolean`,label:`Trouble de conscience/vertige`,weight:1},
    {id:`debut_rapide`,type:`boolean`,label:`Debut brutal < 30 min apres exposition`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.cutane?1:0)+(values.respiratoire?2:0)+(values.cv?3:0)+(values.digestif?1:0)+(values.neuro?3:0)+(values.debut_rapide?1:0)
        const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'
        const label = s < 2 ? 'Reaction cutanee isolee' : s < 4 ? 'Anaphylaxie modelee' : 'Anaphylaxie severe - Adrenaline IM'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Cutane - Antihistaminiques',severity:'low' as const},
          {min:2,max:3,label:'Anaphylaxie moderee - Adrenaline IM',severity:'moderate' as const},
          {min:4,max:999,label:'Anaphylaxie severe - Adrenaline IM + appel Samu',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'anaphylaxie est une reaction d'hypersensibilite systemique severe d'installation rapide. L'adrenaline IM (face antero-laterale de cuisse) est le traitement de premiere ligne.`,
  clinicalCommentary: `L'adrenaline IM 0.3-0.5 mg (1/1000) est le traitement de premiere ligne. Ne pas retarder l'injection. Les antihistaminiques et corticoides sont des traitements adjuvants de seconde ligne.`,
  references: [
    {type:`pubmed`,title:`Muraro A et al. Allergy 2014`,pmid:`24716825`}
  ],
}
export default anaphylaxie
