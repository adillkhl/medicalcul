import type { FormulaDefinition } from '../types'

const saturation: FormulaDefinition = {
  id: `saturation`, slug: `saturation`,
  name: `Saturation en oxygene (SpO2)`,
  specialty: `pneumologie`, category: `Oxymetrie`,
  description: `Interpretation de la saturation pulsee en oxygene (SpO2)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`spo2`,type:`number`,label:`SpO2`,unit:`%`},
    {id:`age`,type:`number`,label:`Age`,unit:`ans`},
  ],
  calculate: (values) => {
    const spo2 = parseFloat(values.spo2)||97; const age = parseFloat(values.age)||40
        const sev = spo2 < 90 ? 'high' : spo2 < 94 ? 'moderate' : spo2 < 97 ? 'low' : 'low'
        let label = spo2 + '%'
        if (spo2 < 90) label += ' - Hypoxemie severe - Oxygene urgent';
        else if (spo2 < 94) label += ' - Hypoxemie legere - Controler PaO2';
        else if (spo2 > 98 && age < 40) label += ' - Normale';
        const retval = spo2; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:89,label:'Hypoxemie severe (< 90%)',severity:'high' as const},
          {min:90,max:93,label:'Hypoxemie legere (90-93%)',severity:'moderate' as const},
          {min:94,max:99,label:'SpO2 normale (94-99%)',severity:'low' as const},
          {min:100,max:100,label:'100% - (sous oxygene?)',severity:'low' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `La SpO2 est une estimation non invasive de la saturation arterielle. Normale: > 94-95% chez l\'adulte sain.`,
  clinicalCommentary: `La SpO2 peut etre faussement normale si hyperoxie, Hb anormale (COHb), ou bas debit peripherique. Une SpO2 < 90% definit l\'hypoxemie.`,
  references: [
    {type:`pubmed`,title:`O Driscoll BR et al. Thorax 2017`,pmid:`27231116`}
  ],
}
export default saturation
