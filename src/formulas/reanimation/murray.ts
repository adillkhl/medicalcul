import type { FormulaDefinition } from '../types'

const murray: FormulaDefinition = {
  id: `murray`, slug: `murray`,
  name: `Murray Lung Injury Score (LIS)`,
  specialty: `reanimation`, category: `Pneumologie`,
  description: `Evaluation de la severite de la lesion pulmonaire aigue (ALI/SDRA) — 4 items : radiographie, hypoxemie, PEEP, compliance`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`radio`,type:`radio`,label:`Radiographie thoracique (nombre de quadrants atteints)`,options:[{value:0,label:`0 quadrant - Pas d'alveolite`},{value:1,label:`1 quadrant - Alveolite unilaterale`},{value:2,label:`2 quadrants`},{value:3,label:`3 quadrants`},{value:4,label:`4 quadrants - Alveolite bilaterale diffuse`}]},
    {id:`hypoxemie`,type:`radio`,label:`Hypoxemie - PaO2/FiO2 (mmHg)`,options:[{value:0,label:`>= 300`},{value:1,label:`225-299`},{value:2,label:`175-224`},{value:3,label:`100-174`},{value:4,label:`< 100`}]},
    {id:`peep`,type:`radio`,label:`PEEP (cmH2O) sous ventilation`,options:[{value:0,label:`<= 5`},{value:1,label:`6-8`},{value:2,label:`9-11`},{value:3,label:`12-14`},{value:4,label:`>= 15`}]},
    {id:`compliance`,type:`radio`,label:`Compliance respiratoire statique (mL/cmH2O)`,options:[{value:0,label:`>= 80`},{value:1,label:`60-79`},{value:2,label:`40-59`},{value:3,label:`20-39`},{value:4,label:`< 20`}]},
  ],
  calculate: (values) => {
    const radio = values.radio ?? 0
    const hypoxemie = values.hypoxemie ?? 0
    const peep = values.peep ?? 0
    const compliance = values.compliance ?? 0
    const total = radio + hypoxemie + peep + compliance
    const lis = total / 4
    
    let sev: 'low'|'moderate'|'high'
    let label
    if (lis >= 2.5) { sev = 'high'; label = 'SDRA severe' }
    else if (lis >= 1.5) { sev = 'moderate'; label = 'SDRA modere' }
    else { sev = 'low'; label = 'Pas de SDRA ou leger' }

    return {value:Math.round(lis*100)/100, label:`LIS ${Math.round(lis*100)/100} - ${label}`, severity: sev,
      details:{radio:`${radio}`,hypoxemie:`${hypoxemie}`,peep:`${peep}`,compliance:`${compliance}`,score_total:total},
      ranges:[
        {min:0,max:0.9,label:`LIS 0-0.9 - Pas de lesion pulmonaire`,severity:'low',recommendation:`Pas de SDRA. Poursuivre ventilation protectrice si ventile.`},
        {min:1,max:1.4,label:`LIS 1-1.4 - Lesion legere`,severity:'low',recommendation:`Surveillance. Discuter ventilation non-invasive selon le contexte.`},
        {min:1.5,max:2.4,label:`LIS 1.5-2.4 - SDRA modere`,severity:'moderate',recommendation:`Ventilation mecanique protectrice (VT 6 mL/kg, PEEP optimale). Decubitus ventral a discuter.`},
        {min:2.5,max:4,label:`LIS >= 2.5 - SDRA severe`,severity:'high',recommendation:`Ventilation protectrice stricte. Decubitus ventral. Curarisation. ECMO a discuter. Pronostic sombre.`},
      ]}
  },
  interpretation: `Le Murray Lung Injury Score (LIS) evalue la severite de la lesion pulmonaire aigue. 4 items cotes 0-4 : radiographie thoracique (quadrants), hypoxemie (PaO2/FiO2), PEEP, compliance statique. Le LIS est la moyenne des 4 items.`,
  clinicalCommentary: `Utilise dans la definition de l'ALI et du SDRA avant la definition de Berlin. Encore tres utilise dans la litterature pour quantifier la severite de l'atteinte pulmonaire. Un LIS >= 2.5 definit un SDRA severe. La compliance est mesuree en ventilation controlee (VT / (Pplat - PEEP)). Attention : ne pas utiliser seul pour diagnostiquer le SDRA (definition de Berlin requiert criteres temporels, cardiaques, etc.).`,
  references: [
    {type:`pubmed`,title:`Murray JF et al. An expanded definition of the adult respiratory distress syndrome. Am Rev Respir Dis 1988`,pmid:`3279925`},
    {type:`pubmed`,title:`Ranieri VM et al. The Berlin Definition of ARDS. JAMA 2012`,pmid:`22797452`},
  ],
}
export default murray
