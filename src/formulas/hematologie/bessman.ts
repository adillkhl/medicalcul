import type { FormulaDefinition } from '../types'

const bessman: FormulaDefinition = {
  id: `bessman`, slug: `bessman`,
  name: `Bessman (Classification des anemies par VGM/CV)`,
  specialty: `hematologie`, category: `Anemie`,
  description: `Classification cytometrique des anemies par analyse du VGM et de la Courbe de distribution des Volumes (CV) erythrocytaires`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`vgm`,type:`number`,label:`VGM (fL)`,unit:`fL`,min:0,max:150,step:1,placeholder:`Ex: 85`},
    {id:`cve`,type:`number`,label:`Coefficient de Variation erythrocytaire (CV, %)`,unit:`%`,min:0,max:30,step:0.1,placeholder:`Ex: 14.5`},
  ],
  calculate: (values) => {
    const vgm = parseFloat(values.vgm||0)
    const cv = parseFloat(values.cve||0)
    
    let classification = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    if (vgm < 80) {
      if (cv < 15) { classification = `Anemie microcytaire homogene (thalassemie heterozygote)`; sev = `low` }
      else { classification = `Anemie microcytaire heterogene (carence martiale)`; sev = `moderate` }
    } else if (vgm > 100) {
      if (cv < 15) { classification = `Anemie macrocytaire homogene (alcool, MDS)`; sev = `moderate` }
      else { classification = `Anemie macrocytaire heterogene (carence B12/folates)`; sev = `moderate` }
    } else {
      if (cv < 15) { classification = `Anemie normocytaire homogene (inflammation)`; sev = `low` }
      else { classification = `Anemie normocytaire heterogene (carence mixte)`; sev = `moderate` }
    }
    
    return {value:vgm, label:classification, severity: sev,
      details:{ cve: cv },
      ranges:[
        {min:0,max:79,label:'Microcytaire (< 80 fL)',severity:'moderate'},
        {min:80,max:100,label:'Normocytaire (80-100 fL)',severity:'low'},
        {min:101,max:999,label:'Macrocytaire (> 100 fL)',severity:'moderate'},
      ]}
  },
  interpretation: `La classification de Bessman utilise le VGM et le CV erythrocytaire (coefficient de variation du volume globulaire) pour orienter le diagnostic des anemies:<br/>• CV < 15% = population homogene (thalassemie, alcool, inflammation)<br/>• CV > 15% = population heterogene (carence martiale, B12/folates)`,
  clinicalCommentary: `Cette classification est utile pour differencier thalassemie (CV normal) de la carence martiale (CV eleve) devant une anemie microcytaire. Le CV est parfois appele "RDW" (Red cell Distribution Width) dans la litterature anglophone.`,
  references: [
    {type:`pubmed`,title:`Bessman JD et al. Am J Clin Pathol 1983`,pmid:`6837593`},
  ],
}
export default bessman
