import type { FormulaDefinition } from '../types'

const pao2_fio2: FormulaDefinition = {
  id: `pf_ratio`, slug: `pf-ratio`,
  name: `Rapport PaO₂/FiO₂ (PF Ratio) — Indice d'oxygénation`,
  specialty: `pneumologie`, category: `Oxygenation`,
  description: `Rapport PaO₂/FiO₂ pour l'évaluation de l'hypoxémie et classification du SDRA (critères de Berlin)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`pao2`,type:`number`,label:`PaO₂`,unit:`mmHg`},
    {id:`fio2`,type:`number`,label:`FiO₂`,unit:`%`},
  ],
  calculate: (values) => {
    const pao2 = parseFloat(values.pao2)||80; const fio2 = (parseFloat(values.fio2)||21)/100
        const ratio = fio2 > 0 ? Math.round(pao2 / fio2) : 0
        const sev = ratio < 200 ? 'high' : ratio < 300 ? 'moderate' : 'low'
        const retval = ratio; const retlabel = ratio + ''; const retsev = sev
        const ranges = [
          {min:0,max:199,label:'SDRA (PaO2/FiO2 < 200)',severity:'high' as const},
          {min:200,max:299,label:'Lesion pulmonaire aigue (200-299)',severity:'moderate' as const},
          {min:300,max:500,label:'Normal (> 300)',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le rapport PaO2/FiO2 est le marqueur de reference de l\'hypoxemie. < 300 = lesion pulmonaire aigue. < 200 = SDRA.`,
  clinicalCommentary: `Critere de Berlin pour le SDRA: PaO2/FiO2 < 200 avec PEEP >= 5 cmH2O. Le SpO2/FiO2 est une alternative non invasive.`,
  references: [
    {type:`pubmed`,title:`ARDS Definition Task Force. JAMA 2012`,pmid:`22797452`}
  ],
}
export default pao2_fio2
