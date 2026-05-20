import type { FormulaDefinition } from '../types'

const diabetique_acidocetose: FormulaDefinition = {
  id: `diabetique_acidocetose`, slug: `diabetique_acidocetose`,
  name: `Acidocetose diabetique (Gravite)`,
  specialty: `urgence`, category: `Diabete`,
  description: `Evaluation de la severite de l\'acidocetose diabetique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`glycemie`,type:`number`,label:`Glycemie`,unit:`mmol/L`},
    {id:`ph`,type:`number`,label:`pH`},
    {id:`bicarbonates`,type:`number`,label:`Bicarbonates`,unit:`mmol/L`},
    {id:`conscience`,type:`radio`,label:`Conscience`,options:[{value:0,label:`Normale`},{value:1,label:`Somnolent`},{value:2,label:`Coma`}]},
  ],
  calculate: (values) => {
    const gly = parseFloat(values.glycemie)||0; const ph = parseFloat(values.ph)||7.30; const hco3 = parseFloat(values.bicarbonates)||15; const cons = parseInt(values.conscience)||0
        let sev = 'low'; let label = ''
        if (ph < 7.0 || hco3 < 5 || cons >= 2) { sev = 'high'; label = 'Acidocetose severe - Reanimation' }
        else if (ph < 7.2 || hco3 < 10 || cons >= 1) { sev = 'moderate'; label = 'Acidocetose moderee - Hospitalisation' }
        else { sev = 'low'; label = 'Acidocetose legere' }
        const retval = ph; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:6.9,label:'Severe (pH < 7.0) - Reanimation',severity:'high' as const},
          {min:7.0,max:7.24,label:'Moderee (pH 7.0-7.24)',severity:'moderate' as const},
          {min:7.25,max:999,label:'Legere (pH > 7.24)',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L\'acidocetose diabetique est une urgence metabolique. L\'insulinotherapie IV est le traitement de base avec rehydratation et correction de la kaliemie.`,
  clinicalCommentary: `Bicarbonate discute (pH > 6.9). Surveiller K+ toutes les 2h. Ne pas arreter l\'insuline si glycemie > 15, passer au glucose 10%. L\'oedeme cerebral est la complication la plus redoutee chez l\'enfant.`,
  references: [
    {type:`pubmed`,title:`Kitabchi AE et al. Diabetes Care 2009`,pmid:`19109133`}
  ],
}
export default diabetique_acidocetose
