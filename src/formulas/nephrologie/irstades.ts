import type { FormulaDefinition } from '../types'

const irstades: FormulaDefinition = {
  id: 'irstades', slug: 'irstades',
  name: 'Stades de l\'Insuffisance Rénale Chronique (IRC)',
  specialty: 'nephrologie', category: 'IRC',
  description: 'Classification KDIGO des stades d\'insuffisance rénale chronique selon le DFG',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'dfg_ml_min', type: 'number', label: 'DFG estimé (mL/min/1.73m²)', min: 0, max: 150, step: 1 },
    { id: 'albuminurie', type: 'radio', label: 'Albuminurie (RAC)', options: [
      { value: 0, label: 'A1 — Normale (< 30 mg/g)' },
      { value: 1, label: 'A2 — Modérée (30-300 mg/g)' },
      { value: 2, label: 'A3 — Sévère (> 300 mg/g)' },
    ]},
  ],
  calculate: (values) => {
    const dfg = values.dfg_ml_min ?? 90
    const alb = values.albuminurie ?? 0
    let stade = 'G1', sev: 'high'|'moderate'|'low' = 'low'
    if (dfg >= 90) { stade = 'G1'; sev = 'low' }
    else if (dfg >= 60) { stade = 'G2'; sev = 'low' }
    else if (dfg >= 45) { stade = 'G3a'; sev = 'moderate' }
    else if (dfg >= 30) { stade = 'G3b'; sev = 'moderate' }
    else if (dfg >= 15) { stade = 'G4'; sev = 'high' }
    else { stade = 'G5'; sev = 'high' }
    const risque = (stade === 'G1' || stade === 'G2') && alb === 0 ? 'Faible' : alb >= 1 ? 'Élevé' : 'Modéré'
    return { value: dfg, label: `IRC ${stade} — Risque ${risque}`, severity: sev }
  },
  interpretation: 'KDIGO classe l\'IRC par G (DFG) et A (albuminurie). G1-2 + A1 = suivi habituel. G3-4 + A2-3 = néphroprotection. G5 = préparation dialyse.',
  clinicalCommentary: 'La stadification combine DFG et albuminurie (RAC = ratio albumine/créatinine urinaire). La progression dépend de l\'étiologie et du contrôle tensionnel.',
  references: [{ type: 'pubmed', title: 'KDIGO 2024 CKD Guidelines', url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/' }],
}
export default irstades
