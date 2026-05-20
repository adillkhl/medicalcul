import type { FormulaDefinition } from '../types'

const iadl: FormulaDefinition = {
  id: `iadl`, slug: `iadl`,
  name: `IADL de Lawton (Activites Instrumentales)`,
  specialty: `geriatrie`, category: `Evaluation Geriatrique`,
  description: `Evaluation des activites instrumentales de la vie quotidienne (8 items, score 0-8)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`telephone`,type:`boolean`,label:`Capacite a utiliser le telephone`,weight:1},
    {id:`courses`,type:`boolean`,label:`Capacite a faire les courses`,weight:1},
    {id:`repas`,type:`boolean`,label:`Capacite a preparer les repas`,weight:1},
    {id:`menage`,type:`boolean`,label:`Capacite a faire le menage`,weight:1},
    {id:`lessive`,type:`boolean`,label:`Capacite a faire la lessive`,weight:1},
    {id:`transport`,type:`boolean`,label:`Capacite a utiliser les transports`,weight:1},
    {id:`medicaments`,type:`boolean`,label:`Capacite a gerer les medicaments`,weight:1},
    {id:`finances`,type:`boolean`,label:`Capacite a gerer ses finances`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.telephone?1:0)+(values.courses?1:0)+(values.repas?1:0)+(values.menage?1:0)+(values.lessive?1:0)+(values.transport?1:0)+(values.medicaments?1:0)+(values.finances?1:0)
    return {value:s, label:s===8?'Independance totale':s>=5?'Dependance partielle':'Dependance importante', severity: s===8?'low':s>=5?'moderate':'high',
      ranges:[
        {min:8,max:8,label:'Independance totale',severity:'low'},
        {min:5,max:7,label:'Dependance partielle',severity:'moderate'},
        {min:0,max:4,label:'Dependance importante',severity:'high'},
      ]}
  },
  interpretation: `L\'echelle IADL de Lawton evalue 8 activites instrumentales necessaires a la vie autonome. Chaque item est cote 1 si le patient est autonome, 0 sinon. Un score < 5 suggere une perte d\'autonomie significative necessitant des aides a domicile.`,
  clinicalCommentary: `L\'IADL complete l\'ADL pour une evaluation globale de l\'autonomie. Les femmes sont traditionnellement evaluees sur les 8 items, les hommes sur 5 (telephone, transport, medicaments, finances, courses). L\'adaptation au genre est controversee; on utilise de plus en plus les 8 items pour tous.`,
  references: [
    {type:`pubmed`,title:`Lawton MP, Brody EM. Gerontologist 1969`,pmid:`5309366`},
  ],
}
export default iadl
