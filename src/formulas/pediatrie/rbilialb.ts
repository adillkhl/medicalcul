import type { FormulaDefinition } from '../types'

const rbilialb: FormulaDefinition = {
  id: 'rbilialb', slug: 'rbilialb',
  name: 'Rapport Bilirubine/Albumine',
  specialty: 'pediatrie', category: 'Neonatalogie',
  description: 'Aide à la décision d\'exsanguino-transfusion en cas d\'ictère néonatal',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'bilirubine_mgdl', type: 'number', label: 'Bilirubine totale (mg/dL)', min: 0, max: 40, step: 0.1 },
    { id: 'albumine_gdl', type: 'number', label: 'Albumine (g/dL)', min: 1, max: 5, step: 0.1 },
    { id: 'age_gest_sa', type: 'radio', label: 'Terme', options: [{ value: 0, label: '≥ 38 SA (terme)' }, { value: 1, label: '< 38 SA (prématuré)' }] },
  ],
  calculate: (values) => {
    const bili = values.bilirubine_mgdl ?? 0
    const alb = values.albumine_gdl ?? 3
    const rapport = bili / alb
    const seuil = (values.age_gest_sa ?? 0) === 1 ? 5.5 : 6.5
    return { value: parseFloat(rapport.toFixed(2)), label: `Rapport B/A : ${rapport.toFixed(2)} (seuil : ${seuil})`, severity: rapport >= seuil ? 'high' : 'moderate' }
  },
  interpretation: 'Ratio ≥ 6.5 (terme) ou ≥ 5.5 (prématuré) est un argument pour l\'exsanguino-transfusion.',
  clinicalCommentary: 'À utiliser avec les courbes de photothérapie AAP. Ne remplace pas l\'évaluation clinique.',
  references: [{ type: 'pubmed', title: 'AAP — Hyperbilirubinemia 2022' }],
}
export default rbilialb
