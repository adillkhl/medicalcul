import type { FormulaDefinition } from '../types'

const ira_indices: FormulaDefinition = {
  id: 'ira_indices', slug: 'ira_indices',
  name: 'Indices d\'Insuffisance Rénale Aiguë',
  specialty: 'nephrologie', category: 'IRA',
  description: 'Interprétation des indices biologiques d\'insuffisance rénale aiguë (FENa, FEUrea, créatinine, débit urinaire)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'creat_mgdl', type: 'number', label: 'Créatinine (mg/dL)', min: 0.3, max: 20, step: 0.1 },
    { id: 'creat_basale', type: 'number', label: 'Créatinine basale (mg/dL)', min: 0.3, max: 15, step: 0.1 },
    { id: 'diurese_6h', type: 'radio', label: 'Diurèse sur 6h', options: [{ value: 0, label: '≥ 0.5 mL/kg/h' }, { value: 1, label: '< 0.5 mL/kg/h' }] },
    { id: 'diurese_12h', type: 'radio', label: 'Diurèse sur 12h', options: [{ value: 0, label: '≥ 0.5 mL/kg/h' }, { value: 1, label: '< 0.5 mL/kg/h' }] },
  ],
  calculate: (values) => {
    const cr = values.creat_mgdl ?? 1.0; const cb = values.creat_basale ?? 0.8
    const ratio = cr / cb; const du6 = values.diurese_6h ?? 0; const du12 = values.diurese_12h ?? 0
    let kdigo = 'Normal', sev: 'high'|'moderate'|'low' = 'low'
    if (ratio >= 3 || cr >= 4 || (du12 === 1)) { kdigo = 'Stade 3 — IRA sévère'; sev = 'high' }
    else if (ratio >= 2 || du12 === 1) { kdigo = 'Stade 2 — IRA modérée'; sev = 'moderate' }
    else if (ratio >= 1.5 || du6 === 1) { kdigo = 'Stade 1 — IRA légère'; sev = 'moderate' }
    return { value: parseFloat(ratio.toFixed(2)), label: `Créatinine ratio : ${ratio.toFixed(2)} — ${kdigo}`, severity: sev }
  },
  interpretation: 'KDIGO : stade 1 = créatinine ×1.5 ou diurèse <0.5 mL/kg/h ×6h. Stade 2 = ×2 ou diurèse <0.5 ×12h. Stade 3 = ×3 ou créatinine ≥4 mg/dL.',
  clinicalCommentary: 'Les indices d\'IRA (FENa, FEUrea) aident à distinguer IRA fonctionnelle (prérénale) de l\'IRA organique (tubulaire). FENa < 1% = prérénale. FEUrea < 35% = prérénale.',
  references: [{ type: 'pubmed', title: 'KDIGO AKI Guidelines. Kidney Int Suppl 2012' }],
}
export default ira_indices
