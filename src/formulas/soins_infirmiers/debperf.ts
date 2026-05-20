import type { FormulaDefinition } from '../types'

const debperf: FormulaDefinition = {
  id: 'debperf', slug: 'debperf',
  name: 'Débit de Perfusion Intraveineuse',
  specialty: 'soins_infirmiers', category: 'Débits',
  description: 'Calcul du débit d\'une perfusion IV (gouttes/min) à partir du volume et du temps',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'volume_ml', type: 'number', label: 'Volume à perfuser (mL)', min: 10, max: 5000, step: 10 },
    { id: 'temps_h', type: 'number', label: 'Temps de perfusion (heures)', min: 0.25, max: 72, step: 0.5 },
    { id: 'calibre', type: 'radio', label: 'Calibre du perfuseur', options: [{ value: 15, label: 'Perfuseur standard (15 gouttes/mL)' }, { value: 20, label: 'Perfuseur standard (20 gouttes/mL)' }, { value: 60, label: 'Microperfuseur (60 gouttes/mL = pédiatrie)' }] },
  ],
  calculate: (values) => {
    const v = values.volume_ml ?? 500
    const t = values.temps_h ?? 8
    const cal = values.calibre ?? 20
    const gtt_min = (v * cal) / (t * 60)
    const ml_h = v / t
    return { value: parseFloat(gtt_min.toFixed(0)), label: `${gtt_min.toFixed(0)} gouttes/min (${ml_h.toFixed(1)} mL/h)`, severity: 'low' }
  },
  interpretation: 'Débit (gouttes/min) = (volume × calibre du perfuseur) / (temps en heures × 60).',
  clinicalCommentary: 'Perfuseur standard = 20 gouttes/mL (certains 15). Microperfuseur pédiatrique = 60 gouttes/mL. Vérifier la prescription médicale.',
  references: [{ type: 'guideline', title: 'SFARM — Calculs de débits de perfusion' }],
}
export default debperf
