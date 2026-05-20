import type { FormulaDefinition } from '../types'

const obp: FormulaDefinition = {
  id: `obp`, slug: `obp`,
  name: `Obesite pediatrique (Classification)`,
  specialty: `nutrition`, category: `Pediatrie`,
  description: `Classification de l\'obesite pediatrique selon l\'IMC pour l\'age (courbes OMS)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`poids`,type:`number`,label:`Poids`,unit:`kg`},
    {id:`taille`,type:`number`,label:`Taille`,unit:`cm`},
    {id:`age_mois`,type:`number`,label:`Age`,unit:`mois`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[{value:0,label:`Fille`},{value:1,label:`Garcon`}]},
  ],
  calculate: (values) => {
    const p = parseFloat(values.poids)||0
    const t = (parseFloat(values.taille)||1)/100
    const imc = t > 0 ? Math.round((p/(t*t))*10)/10 : 0
    let label = 'IMC: '+imc
    let sev = 'low'
    if (imc > 30) { label = 'Obesite massive'; sev = 'high' }
    else if (imc > 27) { label = 'Obesite importante'; sev = 'high' }
    else if (imc > 24) { label = 'Surpoids'; sev = 'moderate' }
    return {value:imc, label, severity: sev as 'low'|'moderate'|'high'|'critical',
      ranges:[
        {min:0,max:18.4,label:`Poids insuffisant`,severity:`moderate`},
        {min:18.5,max:24.9,label:`Poids normal`,severity:`low`},
        {min:25,max:29.9,label:`Surpods`,severity:`moderate`},
        {min:30,max:39.9,label:`Obesite`,severity:`high`},
        {min:40,max:999,label:`Obesite massive`,severity:`critical`},
      ]}
  },
  interpretation: `L\'obesite pediatrique est definie par un IMC > 97e percentile des courbes OMS pour l\'age et le sexe. Les seuils IMC adultes sont donnes a titre indicatif.`,
  clinicalCommentary: `Chez l\'enfant, l\'IMC doit etre interprete selon les courbes de croissance OMS. Un rebond d\'adiposite precoce (< 6 ans) est un facteur de risque d\'obesite future.`,
  references: [{type:`pubmed`,title:`OMS. Bull World Health Organ 2007`,pmid:`18026621`}],
}
export default obp
