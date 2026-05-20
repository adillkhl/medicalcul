import type { FormulaDefinition } from '../types'

const tcmasters: FormulaDefinition = {
  id: 'tcmasters', slug: 'tcmasters',
  name: 'Classification TC (Masters)',
  specialty: 'neurologie', category: 'Traumatologie',
  description: 'Stratification du risque de lésion intracrânienne après traumatisme crânien',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'gcs', type: 'radio', label: 'Glasgow initial', options: [
      { value: 3, label: '≤ 12' }, { value: 1, label: '13-14' }, { value: 0, label: '15' },
    ]},
    { id: 'pc_initiale', type: 'boolean', label: 'Perte de connaissance initiale' },
    { id: 'amnesie', type: 'boolean', label: 'Amnésie antérograde > 30 min' },
    { id: 'vomissements', type: 'boolean', label: 'Vomissements (≥ 2)' },
    { id: 'convulsion', type: 'boolean', label: 'Crise convulsive post-traumatique' },
    { id: 'cephalee', type: 'boolean', label: 'Céphalée intense persistante' },
    { id: 'focal', type: 'boolean', label: 'Signe neurologique focal' },
    { id: 'age', type: 'boolean', label: 'Âge > 65 ans' },
    { id: 'mecanisme', type: 'boolean', label: 'Mécanisme violent (AVP, chute > 1m)' },
  ],
  calculate: (values) => {
    const g = values.gcs ?? 0
    const s = (values.pc_initiale ? 1 : 0) + (values.amnesie ? 1 : 0) + (values.vomissements ? 1 : 0) + (values.convulsion ? 1 : 0) + (values.cephalee ? 1 : 0) + (values.focal ? 1 : 0) + (values.age ? 1 : 0) + (values.mecanisme ? 1 : 0)
    let sev: 'high' | 'moderate' | 'low' = 'low'
    let grade = 'Mineur'
    if (g >= 3 || s >= 3 || values.focal) { sev = 'high'; grade = 'Sévère' }
    else if (g >= 1 || s >= 1) { sev = 'moderate'; grade = 'Modéré' }
    return { value: s, label: `TC ${grade}`, severity: sev }
  },
  interpretation: 'Proche des critères SFMU pour la TDM cérébrale après TC.',
  clinicalCommentary: 'TDM immédiate si Glasgow < 15, signe focal, ou risque majeur.',
  references: [{ type: 'pubmed', title: 'Masters SJ et al. Radiology 1987', pmid: '3797458' }],
}
export default tcmasters
