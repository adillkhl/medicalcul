import type { FormulaDefinition } from '../types'

const deltapp: FormulaDefinition = {
  id: `deltapp`, slug: `deltapp`,
  name: `Delta PP (Calcul)`,
  specialty: `anesthesie`, category: `Hemodynamique`,
  description: `Variation de pression pulsee pour evaluer la reponse au remplissage vasculaire`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`pamax`,type:`number`,label:`PA systolique max`,unit:`mmHg`,placeholder:`120`},
    {id:`pamin`,type:`number`,label:`PA systolique min`,unit:`mmHg`,placeholder:`80`},
  ],
  calculate: (values) => {
    const max = values.pamax ?? 120
    const min = values.pamin ?? 80
    const moy = (max + min) / 2
    const deltaPP = moy > 0 ? ((max - min) / moy * 100) : 0
    const arr = Math.round(deltaPP * 100) / 100
    const sev = deltaPP > 13 ? 'moderate' : 'low'
    const label = deltaPP > 13 ? 'Repondeur' : 'Non repondeur'
    return {value:arr, label, severity: sev,
      ranges:[
      {min:0,max:13,label:`Non repondeur`,severity:`low`},
      {min:13.1,max:999,label:`Repondeur au remplissage`,severity:`moderate`},
      ]}
  },
  interpretation: `Le Delta PP est un indice dynamique de precharge-dependance. > 13% predit la reponse au remplissage.`,
  clinicalCommentary: `Valide sous ventilation mecanique en rythme sinusal. Invalide si arythmie, respiration spontanee.`,
  references: [
    {type:`pubmed`,title:`Michard F et al. Am J Respir Crit Care Med 2000`,pmid:`10791579`}
  ],
}
export default deltapp
