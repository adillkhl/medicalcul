import type { FormulaDefinition } from '../types'

const bronchite_asthme: FormulaDefinition = {
  id: `bronchite_asthme`, slug: `bronchite_asthme`,
  name: `Classification asthme GINA`,
  specialty: `pneumologie`, category: `Asthme`,
  description: `Classification GINA de la severite et du controle de l'asthme`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`freq_sympt`,type:`radio`,label:`Symptomes`,options:[{value:0,label:`< 2x/sem`},{value:1,label:`> 2x/sem`},{value:2,label:`Quotidiens`}]},
    {id:`reveils`,type:`radio`,label:`Reveils nocturnes`,options:[{value:0,label:`Aucun`},{value:1,label:`< 1x/sem`},{value:2,label:`>= 1x/sem`}]},
    {id:`crise_freq`,type:`radio`,label:`Crises`,options:[{value:0,label:`Aucune`},{value:1,label:`Parfois`},{value:2,label:`Frequentes`}]},
    {id:`activite`,type:`radio`,label:`Limitation activite`,options:[{value:0,label:`Aucune`},{value:1,label:`Legere`},{value:2,label:`Importante`}]},
  ],
  calculate: (values) => {
    const s = (parseInt(values.freq_sympt)||0)+(parseInt(values.reveils)||0)+(parseInt(values.crise_freq)||0)+(parseInt(values.activite)||0)
        const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'
        const label = s <= 1 ? 'Asthme bien controle' : s <= 4 ? 'Asthme partiellement controle' : 'Asthme non controle'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Controle - Pallier descendant',severity:'low' as const},
          {min:2,max:4,label:'Partiellement controle - Adapter traitement',severity:'moderate' as const},
          {min:5,max:8,label:'Non controle - Pallier ascendant + avis',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `GINA classe le controle de l'asthme en 3 categories: controle, partiellement controle, non controle.`,
  clinicalCommentary: `Le traitement de l'asthme suit un schema par pallier GINA 1-5. Objectif: controle optimal le plus bas pallier possible.`,
  references: [
    {type:`pubmed`,title:`GINA 2024 Report. https://ginasthma.org`,pmid:`---`}
  ],
}
export default bronchite_asthme
