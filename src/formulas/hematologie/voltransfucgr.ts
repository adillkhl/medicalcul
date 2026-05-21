import type { FormulaDefinition } from '../types'

const voltransfucgr: FormulaDefinition = {
  id: 'voltransfucgr', slug: 'voltransfucgr',
  name: 'Volume de Transfusion de CGR',
  specialty: 'hematologie', category: 'Transfusion',
  description: 'Calcul du volume de concentré de globules rouges (CGR) à transfuser en fonction du poids, de l\'Hb cible et du rendement attendu',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'poids_kg', type: 'number', label: 'Poids (kg)', min: 2, max: 200, step: 0.5 },
    { id: 'hb_actuelle_gdl', type: 'number', label: 'Hb actuelle (g/dL)', min: 3, max: 18, step: 0.1 },
    { id: 'hb_cible_gdl', type: 'number', label: 'Hb cible (g/dL)', min: 5, max: 15, step: 0.1 },
    { id: 'age', type: 'radio', label: 'Patient', options: [{ value: 0, label: 'Adulte (> 12 ans)' }, { value: 1, label: 'Enfant (0-12 ans)' }] },
  ],
  calculate: (values) => {
    const p = values.poids_kg ?? 70; const hb_a = values.hb_actuelle_gdl ?? 8; const hb_c = values.hb_cible_gdl ?? 10
    const ped = values.age ?? 0
    const deficit_hb = hb_c - hb_a
    const vol_sang = ped ? p * 80 : p * 70
    const hb_par_cgr = ped ? 3 : 2
    const nb_cgr = Math.max(0, Math.ceil(deficit_hb * vol_sang / (100 * hb_par_cgr)))
    const vol_estime = nb_cgr * (ped ? 150 : 300)
    return { value: nb_cgr, label: `${nb_cgr} CGR (${vol_estime} mL estimé)`, severity: 'low',
      details: { 'Déficit Hb': `${Math.abs(deficit_hb).toFixed(1)} g/dL`, 'Volémie': `${(vol_sang).toFixed(0)} mL/kg`, 'Nb CGR': `${nb_cgr}`, 'Volume total': `${vol_estime} mL` } }
  },
  interpretation: '1 CGR adulte = 300 mL, augmente Hb de ~1 g/dL. 1 CGR enfant = 150 mL/kg. Rendement post-transfusionnel à contrôler à 24h.',
  clinicalCommentary: 'Transfusion si Hb < 7 g/dL (stable), < 8 g/dL (cardiovasculaire), < 10 g/dL (coronarien). Utiliser du sang phénotypé si antécédent d\'allo-immunisation.',
  references: [{ type: 'guideline', title: 'HAS — Transfusion de globules rouges. 2014', url: 'https://www.has-sante.fr/' }],
}
export default voltransfucgr
