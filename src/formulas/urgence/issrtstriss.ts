import type { FormulaDefinition } from '../types'

const issrtstriss: FormulaDefinition = {
  id: 'issrtstriss', slug: 'issrtstriss',
  name: 'Scores ISS / RTS / TRISS (Traumatologie)',
  specialty: 'urgence', category: 'Traumatologie',
  description: 'Scores pronostiques en traumatologie : Injury Severity Score (ISS), Revised Trauma Score (RTS), et TRISS (probabilité de survie)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'ais_tete', type: 'radio', label: 'AIS Tête/Cou (0-6)', options: [{ value: 0, label: '0 — Aucune lésion' }, { value: 1, label: '1 — Mineure' }, { value: 2, label: '2 — Modérée' }, { value: 3, label: '3 — Sévère' }, { value: 4, label: '4 — Très sévère' }, { value: 5, label: '5 — Critique' }] },
    { id: 'ais_face', type: 'radio', label: 'AIS Face', options: [{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }] },
    { id: 'ais_thorax', type: 'radio', label: 'AIS Thorax', options: [{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }] },
    { id: 'ais_abdomen', type: 'radio', label: 'AIS Abdomen', options: [{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }] },
    { id: 'ais_extremites', type: 'radio', label: 'AIS Extrémités', options: [{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }] },
    { id: 'rts_gcs', type: 'radio', label: 'RTS — Glasgow', options: [{ value: 4, label: '13-15' }, { value: 3, label: '9-12' }, { value: 2, label: '6-8' }, { value: 1, label: '4-5' }, { value: 0, label: '3' }] },
    { id: 'rts_pas', type: 'radio', label: 'RTS — PAS (mmHg)', options: [{ value: 4, label: '> 89' }, { value: 3, label: '76-89' }, { value: 2, label: '50-75' }, { value: 1, label: '1-49' }, { value: 0, label: '0' }] },
    { id: 'rts_fr', type: 'radio', label: 'RTS — FR (/min)', options: [{ value: 4, label: '10-29' }, { value: 3, label: '> 29' }, { value: 2, label: '6-9' }, { value: 1, label: '1-5' }, { value: 0, label: '0' }] },
  ],
  calculate: (values) => {
    const ais = [values.ais_tete ?? 0, values.ais_face ?? 0, values.ais_thorax ?? 0, values.ais_abdomen ?? 0, values.ais_extremites ?? 0]
    const top3 = [...ais].sort((a,b) => b - a).slice(0, 3)
    const iss = top3.reduce((s, v) => s + v * v, 0)
    const rts = 0.9368 * (values.rts_gcs ?? 4) + 0.7326 * (values.rts_pas ?? 4) + 0.2908 * (values.rts_fr ?? 4)
    const triss = 1 / (1 + Math.exp(1.0 - (-0.4499 + 0.8085 * rts - 0.0835 * iss)))
    return { value: iss, label: `ISS: ${iss} — RTS: ${rts.toFixed(2)} — Survie TRISS: ${(triss * 100).toFixed(1)}%`,
      severity: iss > 25 ? 'high' : iss > 15 ? 'moderate' : 'low',
      details: { 'ISS': `${iss}`, 'RTS': `${rts.toFixed(2)}`, 'Probabilité survie (TRISS)': `${(triss * 100).toFixed(1)}%` } }
  },
  interpretation: 'ISS (0-75) : >15 = polytraumatisme grave, >25 = mortalité élevée. RTS : <4 = pronostic défavorable. TRISS : probabilité de survie combinant ISS + RTS + âge.',
  clinicalCommentary: 'ISS calcule le carré des 3 AIS les plus élevés (6 régions). RTS utilise 3 constantes (GCS, PAS, FR). TRISS est le gold standard pour l\'évaluation pronostique.',
  references: [{ type: 'pubmed', title: 'Baker SP et al. ISS. J Trauma 1974', pmid: '4459437' }],
}
export default issrtstriss
