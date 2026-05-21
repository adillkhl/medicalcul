import type { FormulaDefinition } from '../types'

const rendplq: FormulaDefinition = {
  id: 'rendplq', slug: 'rendplq',
  name: 'RendPLQ (Rendement Plaquettaire)',
  specialty: 'divers', category: 'Hématologie',
  description: 'Calcul du rendement de transfusion plaquettaire (RendPLQ) — évaluation de l\'efficacité transfusionnelle',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'plaquettes_pre', type: 'number', label: 'Plaquettes pré-transfusion (/mm³)', min: 0, max: 500000, step: 1000 },
    { id: 'plaquettes_post', type: 'number', label: 'Plaquettes post-transfusion (1h, /mm³)', min: 0, max: 500000, step: 1000 },
    { id: 'surface_corporelle', type: 'number', label: 'Surface corporelle (m²)', min: 0.2, max: 2.5, step: 0.01 },
    { id: 'nb_concentres', type: 'number', label: 'Nombre de concentrés plaquettaires', min: 1, max: 20, step: 1 },
  ],
  calculate: (values) => {
    const pre = values.plaquettes_pre ?? 20000; const post = values.plaquettes_post ?? 50000
    const sc = values.surface_corporelle ?? 1.73; const n = values.nb_concentres ?? 1
    const rendplq = ((post - pre) * sc) / (n * 0.5 * 1e11)
    return { value: parseFloat(rendplq.toFixed(1)), label: `RendPLQ : ${rendplq.toFixed(1)} (N > 7.5)`,
      severity: rendplq < 4.5 ? 'high' : rendplq < 7.5 ? 'moderate' : 'low',
      details: { 'RendPLQ': `${rendplq.toFixed(1)}`, 'Interprétation': rendplq >= 7.5 ? 'Bon rendement' : rendplq >= 4.5 ? 'Rendement diminué' : 'Réfractaire' } }
  },
  interpretation: 'RendPLQ > 7.5 = bon rendement. 4.5-7.5 = diminué. < 4.5 = réfractaire (allo-immunisation, CIVD, sepsis, splénomégalie).',
  clinicalCommentary: 'Le RendPLQ corrigé (CCI) est le standard pour évaluer l\'efficacité de la transfusion plaquettaire. Causes de réfractarité : allo-immunisation HLA, fièvre, sepsis, CIVD.',
  references: [{ type: 'pubmed', title: 'CCI — Corrected Count Increment for platelet transfusion' }],
}
export default rendplq
