import type { FormulaDefinition } from '../types'

const dyspnee_mrc: FormulaDefinition = {
  id: `dyspnee_mrc`, slug: `dyspnee_mrc`,
  name: `Dyspnee echelle MRC`,
  specialty: `pneumologie`, category: `Dyspnee`,
  description: `Echelle Medical Research Council de gradation de la dyspnee (5 grades)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`grade`,type:`radio`,label:`Grade MRC`,options:[{value:0,label:`Grade 0 - Pas de dyspnee sauf exercice intense`},{value:1,label:`Grade 1 - Essouffle en marchant vite ou en montant une cote`},{value:2,label:`Grade 2 - Marche plus lent que les memes age a cause de la dyspnee`},{value:3,label:`Grade 3 - S arrete pour respirer apres 100 m ou quelques minutes`},{value:4,label:`Grade 4 - Trop essouffle pour quitter la maison / s habille`}]},
  ],
  calculate: (values) => {
    const g = parseInt(values.grade)||0; const labels : Record<number, string> = {0:'Grade 0',1:'Grade 1',2:'Grade 2',3:'Grade 3',4:'Grade 4'}
        const sev = g >= 3 ? 'high' : g >= 2 ? 'moderate' : 'low'
        const retval = g; const retlabel = labels[g]||''; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Grade 0 - Pas de gene',severity:'low' as const},
          {min:1,max:1,label:'Grade 1 - Dyspnee legere',severity:'low' as const},
          {min:2,max:2,label:'Grade 2 - Dyspnee moderee',severity:'moderate' as const},
          {min:3,max:3,label:'Grade 3 - Dyspnee severe',severity:'high' as const},
          {min:4,max:4,label:'Grade 4 - Dyspnee tres severe',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'echelle MRC gradue la dyspnee de 0 (pas de gene) a 4 (essouffle au moindre effort). Grade 2+ est significatif.`,
  clinicalCommentary: `Utilisee dans la BPCO et les maladies respiratoires chroniques. Correllee a la qualite de vie et la mortalite.`,
  references: [
    {type:`pubmed`,title:`Fletcher CM et al. BMJ 1959`,pmid:`14484666`}
  ],
}
export default dyspnee_mrc
