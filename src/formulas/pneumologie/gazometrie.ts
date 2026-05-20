import type { FormulaDefinition } from '../types'

const gazometrie: FormulaDefinition = {
  id: `gazometrie`, slug: `gazometrie`,
  name: `Gazometrie arterielle (Interpretation)`,
  specialty: `pneumologie`, category: `Gaz du sang`,
  description: `Interpretation d\'une gazometrie arterielle: equilibre acido-basique et oxygenation`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`ph`,type:`number`,label:`pH`},
    {id:`paco2`,type:`number`,label:`PaCO2`,unit:`mmHg`},
    {id:`hco3`,type:`number`,label:`HCO3-`,unit:`mmol/L`},
    {id:`pao2`,type:`number`,label:`PaO2`,unit:`mmHg`},
  ],
  calculate: (values) => {
    const ph = parseFloat(values.ph)||7.40; const paco2 = parseFloat(values.paco2)||40; const hco3 = parseFloat(values.hco3)||24; const pao2 = parseFloat(values.pao2)||90
        let label = ''; let sev = 'low'
        if (ph < 7.35) {
          label = 'Acidose ' + (paco2 > 45 ? 'respiratoire (hypoventilation)' : hco3 < 22 ? 'metabolique (perte HCO3)' : 'mixte')
          sev = ph < 7.20 ? 'high' : 'moderate'
        } else if (ph > 7.45) {
          label = 'Alcalose ' + (paco2 < 35 ? 'respiratoire (hyperventilation)' : hco3 > 26 ? 'metabolique' : 'mixte')
          sev = ph > 7.55 ? 'high' : 'moderate'
        } else { label = 'pH normal'; sev = 'low' }
        const retval = ph; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:7.19,label:'Acidose severe (< 7.20)',severity:'high' as const},
          {min:7.2,max:7.34,label:'Acidose legere (7.20-7.34)',severity:'moderate' as const},
          {min:7.35,max:7.45,label:'pH normal (7.35-7.45)',severity:'low' as const},
          {min:7.46,max:7.55,label:'Alcalose legere (7.46-7.55)',severity:'moderate' as const},
          {min:7.56,max:999,label:'Alcalose severe (> 7.55)',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Interpretation de la gazometrie: pH < 7.35 = acidose, pH > 7.45 = alcalose. Le PaCO2 et HCO3 determinent l\'origine.`,
  clinicalCommentary: `Regle de compensation: Acidose metabolique attendue PaCO2 = 1.5 x HCO3 + 8 (±2). Alcalose metabolique PaCO2 = 0.7 x HCO3 + 20. Un trou anionique eleve indique une acidose a TA eleve (lactate, cetones, toxiques).`,
  references: [
    {type:`pubmed`,title:`Seifter JL. N Engl J Med 2014`,pmid:`25409313`}
  ],
}
export default gazometrie
