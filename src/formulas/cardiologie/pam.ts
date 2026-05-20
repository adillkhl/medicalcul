import type { FormulaDefinition } from '../types'

const pam: FormulaDefinition = {
  id: `pam`, slug: `pam`,
  name: `Pression arterielle moyenne (Calcul)`,
  specialty: `cardiologie`, category: `Hemodynamique`,
  description: `Calcul de la pression arterielle moyenne`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`pas`,type:`number`,label:`PA systolique`,unit:`mmHg`},
    {id:`pad`,type:`number`,label:`PA diastolique`,unit:`mmHg`},
  ],
  calculate: (values) => {
    const pas = parseFloat(values.pas)||120
        const pad = parseFloat(values.pad)||80
        const pam = Math.round(pad + (pas - pad) / 3)
        const sev = pam < 65 ? 'high' : pam < 70 ? 'moderate' : 'low'
        const label = pam + ' mmHg'
        const retval = pam
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:64,label:`PAM basse (< 65 mmHg) - Risque d'hypoperfusion`,severity:'high' as const},
          {min:65,max:69,label:'PAM limite (65-69 mmHg)',severity:'moderate' as const},
          {min:70,max:110,label:'PAM normale (70-110 mmHg)',severity:'low' as const},
          {min:111,max:999,label:'PAM elevee (> 110 mmHg)',severity:'moderate' as const},
        ]
        return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `La PAM = PAD + (PAS - PAD)/3. Une PAM < 65 mmHg est associee a un risque d'hypoperfusion d'organe et justifie un remplissage ou des vasopresseurs.`,
  clinicalCommentary: `Objectif de PAM en reanimation: 65 mmHg (≥ 75 si HTA chronique ou atherosclerose). La PAM est un meilleur reflet de la perfusion tissulaire que la PAS isolee.`,
  references: [
    {type:`pubmed`,title:`Vincent JL et al. Intensive Care Med 2016`,pmid:`27084314`}
  ],
}
export default pam
