import type { FormulaDefinition } from '../types'

const adl: FormulaDefinition = {
  id: `adl`, slug: `adl`,
  name: `ADL de Katz (Activites de la Vie Quotidienne)`,
  specialty: `geriatrie`, category: `Evaluation Geriatrique`,
  description: `Evaluation de l\'autonomie pour les activites de base de la vie quotidienne (6 items, score 0-6)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`bain`,type:`boolean`,label:`Bain - Autonome (se lave seul sans aide)`,weight:1},
    {id:`habillage`,type:`boolean`,label:`Habillage - Autonome (s\'habille seul sans aide)`,weight:1},
    {id:`toilette`,type:`boolean`,label:`Toilette - Autonome (se lave le visage, les mains)`,weight:1},
    {id:`transfert`,type:`boolean`,label:`Transfert - Autonome (se leve, se couche seul)`,weight:1},
    {id:`continence`,type:`boolean`,label:`Continence - Autonome (controle sphincterien)`,weight:1},
    {id:`repas`,type:`boolean`,label:`Repas - Autonome (mange seul sans aide)`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.bain?1:0)+(values.habillage?1:0)+(values.toilette?1:0)+(values.transfert?1:0)+(values.continence?1:0)+(values.repas?1:0)
    return {value:s, label:s===6?'Independance totale':s>=4?'Dependance partielle':'Dependance severe', severity: s===6?'low':s>=4?'moderate':'high',
      ranges:[
        {min:6,max:6,label:'Independance totale',severity:'low'},
        {min:4,max:5,label:'Dependance partielle',severity:'moderate'},
        {min:0,max:3,label:'Dependance severe',severity:'high'},
      ]}
  },
  interpretation: `Le score ADL de Katz evalue l\'autonomie pour 6 activites fondamentales de la vie quotidienne. Chaque item est cote 1 si le patient est autonome, 0 s\'il necessite de l\'aide. Un score < 4 indique une dependance severe necessitant une prise en charge multidisciplinaire.`,
  clinicalCommentary: `L\'ADL de Katz est un outil simple et rapide (5 min) pour evaluer la perte d\'autonomie. Il est sensible aux changements dans le temps et permet de suivre l\'evolution des patients geriatriques. A combiner avec l\'IADL pour une evaluation plus complete des activites instrumentales.`,
  references: [
    {type:`pubmed`,title:`Katz S et al. JAMA 1963`,pmid:`14032433`},
    {type:`pubmed`,title:`Katz S. Gerontologist 1970`,pmid:`5506760`},
  ],
}
export default adl
