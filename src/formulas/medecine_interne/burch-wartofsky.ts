import type { FormulaDefinition } from '../types'

const burchWartofsky: FormulaDefinition = {
  id: 'burch-wartofsky',
  slug: 'burch-wartofsky',
  name: 'Burch-Wartofsky — Score d\'orages thyroïdiens',
  specialty: 'medecine_interne',
  category: 'Thyroïde',
  description: 'Score diagnostique de thyrotoxicose sévère (orage thyroïdien / tempête thyroïdienne).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'temperature',
      type: 'radio',
      label: 'Température corporelle',
      options: [
        { value: 5, label: '36.5–37.4 °C' },
        { value: 10, label: '37.5–37.9 °C' },
        { value: 15, label: '38.0–38.4 °C' },
        { value: 20, label: '38.5–38.9 °C' },
        { value: 25, label: '39.0–39.4 °C' },
        { value: 30, label: '≥ 39.5 °C' },
      ],
    },
    {
      id: 'tachycardie',
      type: 'radio',
      label: 'Tachycardie (fréquence cardiaque)',
      options: [
        { value: 0, label: '< 90/min' },
        { value: 5, label: '90–109/min' },
        { value: 10, label: '110–119/min' },
        { value: 15, label: '120–129/min' },
        { value: 20, label: '130–139/min' },
        { value: 25, label: '≥ 140/min' },
      ],
    },
    {
      id: 'fa',
      type: 'boolean',
      label: 'Fibrillation atriale',
    },
    {
      id: 'neuro',
      type: 'radio',
      label: 'Symptômes neurologiques',
      options: [
        { value: 0, label: 'Absents' },
        { value: 10, label: 'Léger : agitation' },
        { value: 20, label: 'Modéré : délire, psychose, léthargie' },
        { value: 30, label: 'Sévère : coma, convulsions' },
      ],
    },
    {
      id: 'gi',
      type: 'radio',
      label: 'Symptômes gastro-intestinaux',
      options: [
        { value: 0, label: 'Absents' },
        { value: 10, label: 'Modéré : diarrhée, nausées' },
        { value: 20, label: 'Sévère : ictère, défaillance hépatique' },
      ],
    },
    {
      id: 'insufcard',
      type: 'radio',
      label: 'Insuffisance cardiaque congestive',
      options: [
        { value: 0, label: 'Absente' },
        { value: 5, label: 'Modérée : œdèmes, crépitants' },
        { value: 10, label: 'Sévère : OAP' },
      ],
    },
    {
      id: 'precipitant',
      type: 'boolean',
      label: 'Facteur précipitant identifié (infection, chirurgie, etc.)',
    },
  ],
  calculate: (values) => {
    const temp = values.temperature ?? 0
    const tachy = values.tachycardie ?? 0
    const fa = values.fa ? 10 : 0
    const neuro = values.neuro ?? 0
    const gi = values.gi ?? 0
    const ic = values.insufcard ?? 0
    const precip = values.precipitant ? 10 : 0
    const score = temp + tachy + fa + neuro + gi + ic + precip
    if (score >= 45) {
      return {
        value: score,
        label: `Score ${score} — Orage thyroïdien probable`,
        severity: 'critical',
        ranges: [
          { min: 45, max: 999, label: 'Score ≥ 45 : orage thyroïdien — Traitement urgent', severity: 'critical', recommendation: 'Hospitalisation en USI/RC. Thionamides (PTU ou carbimazole), β-bloquants, hydrocortisone, iode stable après 1h de thionamide.' },
          { min: 25, max: 44, label: 'Score 25–44 : orage thyroïdien probable', severity: 'high', recommendation: 'Hospitalisation. Thionamides + β-bloquants + corticoïdes.' },
          { min: 0, max: 24, label: 'Score ≤ 24 : orage thyroïdien peu probable', severity: 'low', recommendation: 'Rechercher autre cause. Surveillance ambulatoire possible si euthyroïdie.' },
        ],
      }
    }
    if (score >= 25) {
      return {
        value: score,
        label: `Score ${score} — Orage thyroïdien probable`,
        severity: 'high',
        ranges: [
          { min: 0, max: 24, label: 'Score ≤ 24 — Faible risque', severity: 'low' },
          { min: 25, max: 44, label: 'Score 25–44 — Probable', severity: 'high' },
          { min: 45, max: 999, label: 'Score ≥ 45 — Orage thyroïdien confirmé', severity: 'critical' },
        ],
      }
    }
    return {
      value: score,
      label: `Score ${score} — Orage thyroïdien peu probable`,
      severity: 'low',
      ranges: [
        { min: 0, max: 24, label: 'Score ≤ 24 — Faible risque', severity: 'low' },
        { min: 25, max: 44, label: 'Score 25–44 — Probable', severity: 'high' },
        { min: 45, max: 999, label: 'Score ≥ 45 — Orage thyroïdien confirmé', severity: 'critical' },
      ],
    }
  },
  interpretation: `Le **score de Burch-Wartofsky** (ou score de Wartofsky) permet d\'évaluer la probabilité d\'un **orage thyroïdien** (thyroid storm).

**Points par catégorie :**
- Température : 5–30 points
- Tachycardie : 5–25 points
- Fibrillation atriale : 10 points
- Neurologique : 10–30 points
- Gastro-intestinal : 10–20 points
- Insuffisance cardiaque : 5–10 points
- Facteur précipitant : 10 points

**Interprétation :**
- < 25 : orage thyroïdien peu probable
- 25–44 : orage thyroïdien probable
- ≥ 45 : orage thyroïdien très probable (tempête thyroïdienne)`,
  clinicalCommentary: `L\'orage thyroïdien est une urgence vitale. Traitement : thionamides (PTU 500-1000 mg en charge puis 250 mg/4h ou carbimazole 60-80 mg/j), β-bloquants (propranolol 60-80 mg/4h PO ou IV), corticoïdes (hydrocortisone 300 mg IV puis 100 mg/8h), iode stable (Lugol 5 gouttes/6h) à débuter 1h après la première dose de thionamide. Traiter le facteur déclenchant.`,
  references: [
    {
      type: 'pubmed',
      title: 'Burch HB, Wartofsky L. Life-threatening thyrotoxicosis: thyroid storm. Endocrinol Metab Clin North Am 1993',
      pmid: '8325280',
    },
    {
      type: 'guideline',
      title: 'ATA Guidelines for the Management of Thyrotoxicosis',
      pmid: '27521067',
    },
  ],
}

export default burchWartofsky
