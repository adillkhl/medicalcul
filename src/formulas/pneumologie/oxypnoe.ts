import type { FormulaDefinition } from '../types'

const oxypnoe: FormulaDefinition = {
  id: `oxypnoe`, slug: `oxypnoe`,
  name: `Debit d\'oxygene (Calcul)`,
  specialty: `pneumologie`, category: `Oxygenotherapie`,
  description: `Calcul du debit d\'oxygene necessaire selon la FiO2 visee`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`fio2_visee`,type:`number`,label:`FiO2 visee`,unit:`%`},
    {id:`dispositif`,type:`radio`,label:`Dispositif`,options:[{value:0,label:`Lunettes (1L = 4% FiO2)`},{value:1,label:`Masque simple (5L = 40%, 8L = 60%)`},{value:2,label:`Masque a reservoir (10L = 80%)`},{value:3,label:`Optiflow (5-60 L/min)`}]},
  ],
  calculate: (values) => {
    const fi = (parseFloat(values.fio2_visee)||30)/100; const disp = parseInt(values.dispositif)||0
        let debit = 0; let label = ''
        if (disp === 0) { debit = Math.max(1, Math.round((fi - 0.21)/0.04*10)/10); label = debit + ' L/min lunettes'; }
        else if (disp === 1) { debit = (fi - 0.30)/0.03+5; label = debit + ' L/min masque'; }
        else label = 'Masque reservoir: debiter 10-15 L/min'
        const retval = Math.round(debit*100)/100; const retlabel = label; const retsev = 'low'
        const ranges = [{min:0,max:999,label:'Debit calcule selon dispositif',severity:'low' as const}]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Calcul du debit d\'oxygene: lunettes 1L/min = +4% FiO2. Masque simple: 5L=40%, 8L=60%. Masque reservoir: 80-90%.`,
  clinicalCommentary: `Les lunettes nasales peuvent debiter jusqu\'a 6L/min (44% FiO2 max). L\'humidification est necessaire > 4L/min.`,
  references: [
    {type:`pubmed`,title:`O Driscoll BR, Howard LS. Thorax 2011`,pmid:`21555715`}
  ],
}
export default oxypnoe
