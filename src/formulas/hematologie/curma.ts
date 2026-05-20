import type { FormulaDefinition } from '../types'

const curma: FormulaDefinition = {
  id: `curma`, slug: `curma`,
  name: `Curma (Indice Transfusionnel en Reanimation)`,
  specialty: `hematologie`, category: `Transfusion`,
  description: `Score decisionnel de transfusion de culots globulaires en reanimation base sur l'hemoglobine et l'etat clinique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`hb`,type:`number`,label:`Hemoglobine (g/dL)`,unit:`g/dL`,min:0,max:20,step:0.1,placeholder:`Ex: 8.5`},
    {id:`choc`,type:`boolean`,label:`Choc hemodynamique ou instabilite hemodynamique`,weight:1},
    {id:`ic`,type:`boolean`,label:`Insuffisance coronaire aigue ou angor instable`,weight:1},
    {id:`saignement`,type:`boolean`,label:`Saignement actif ou persistant`,weight:1},
    {id:`detresse`,type:`boolean`,label:`Detresse respiratoire ou SpO2 < 92%`,weight:1},
  ],
  calculate: (values) => {
    const hb = parseFloat(values.hb||0)
    const grave = (values.choc?1:0)+(values.ic?1:0)+(values.saignement?1:0)+(values.detresse?1:0)
    
    let indication = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    if (hb < 7) {
      indication = `Transfusion recommandee (Hb < 7 g/dL)`
      sev = `high`
    } else if (hb < 10 && grave >= 1) {
      indication = `Transfusion discutable (Hb 7-10 g/dL avec facteurs de gravite)`
      sev = `moderate`
    } else if (hb >= 10) {
      indication = `Transfusion non recommandee (Hb >= 10 g/dL)`
      sev = `low`
    } else {
      indication = `Transfusion discutable - evaluer le contexte clinique`
      sev = `low`
    }
    
    return {value:hb, unit:`g/dL`, label:indication, severity: sev,
      details:{ facteurs_gravite: grave },
      ranges:[
        {min:0,max:6.9,label:'Transfusion recommandee',severity:'high'},
        {min:7,max:9.9,label:'Transfusion discutable selon contexte',severity:'moderate'},
        {min:10,max:20,label:'Transfusion non recommandee',severity:'low'},
      ]}
  },
  interpretation: `Le score Curma aide a la decision transfusionnelle en reanimation:<br/>• Hb < 7 g/dL: Transfusion recommandee (sauf hemodilution)<br/>• Hb 7-10 g/dL: Transfusion si facteurs de gravite (choc, coronaropathie, saignement, detresse respiratoire)<br/>• Hb ≥ 10 g/dL: Transfusion generalement non recommandee`,
  clinicalCommentary: `Les recommandations transfusionnelles en reanimation sont restrictives (seuil 7 g/dL) sauf syndromes coronaires aigus (seuil 8-10 g/dL). L'hemoglobine seule ne suffit pas: evaluer la tolerance clinique et l'oxygene tissulaire.`,
  references: [
    {type:`pubmed`,title:`Hebert PC et al. N Engl J Med 1999`,pmid:`10090809`},
    {type:`guideline`,title:`Recommandations SFAR/SRLF 2020`,url:`https://sfar.org/`},
  ],
}
export default curma
