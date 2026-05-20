import type { FormulaDefinition } from '../types'

const bvaswg: FormulaDefinition = {
  id: 'bvaswg',
  slug: 'bvaswg',
  name: 'BVAS/WG — Score d\'activité de la granulomatose avec polyangéite (Wegener)',
  specialty: 'medecine_interne',
  category: 'Vascularites',
  description: 'Birmingham Vasculitis Activity Score for Wegener Granulomatosis — Évaluation de l\'activité de la maladie.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'general',
      type: 'radio',
      label: 'Symptômes généraux (myalgies, arthralgies, fièvre)',
      options: [
        { value: 0, label: 'Absents' },
        { value: 2, label: 'Présents' },
      ],
    },
    {
      id: 'cutane',
      type: 'boolean',
      label: 'Manifestations cutanées (purpura, ulcères, gangrène)',
    },
    {
      id: 'muqueuse',
      type: 'boolean',
      label: 'Manifestations muqueuses / ORL (ulcères, croûtes, sinusite)',
    },
    {
      id: 'thoracique',
      type: 'boolean',
      label: 'Manifestations thoraciques (nodules, hémorragie intra-alvéolaire)',
    },
    {
      id: 'renale',
      type: 'boolean',
      label: 'Atteinte rénale active (hématurie, insuffisance rénale)',
    },
    {
      id: 'neurologique',
      type: 'boolean',
      label: 'Atteinte neurologique (mononévrite, AVC)',
    },
    {
      id: 'ophtalmo',
      type: 'boolean',
      label: 'Atteinte ophtalmologique (sclérite, uvéite)',
    },
    {
      id: 'digestive',
      type: 'boolean',
      label: 'Atteinte digestive (hémorragie, perforation)',
    },
  ],
  calculate: (values) => {
    let score = 0
    const general = values.general ?? 0
    score += general
    if (values.cutane) score += 3
    if (values.muqueuse) score += 4
    if (values.thoracique) score += 4
    if (values.renale) score += 6
    if (values.neurologique) score += 6
    if (values.ophtalmo) score += 3
    if (values.digestive) score += 6

    if (score >= 15) {
      return {
        value: score,
        label: `BVAS/WG = ${score} — Maladie sévère active`,
        severity: 'high',
        ranges: [
          { min: 15, max: 999, label: '≥ 15 : Maladie sévère active — Traitement immunosuppresseur intensif', severity: 'high' },
          { min: 8, max: 14, label: '8–14 : Maladie modérément active', severity: 'moderate' },
          { min: 1, max: 7, label: '1–7 : Maladie peu active', severity: 'low' },
          { min: 0, max: 0, label: '0 : Rémission clinique', severity: 'low' },
        ],
      }
    }
    if (score >= 8) {
      return {
        value: score,
        label: `BVAS/WG = ${score} — Maladie modérément active`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 0, label: '0 : Rémission', severity: 'low' },
          { min: 1, max: 7, label: '1–7 : Peu active', severity: 'low' },
          { min: 8, max: 14, label: '8–14 : Modérément active', severity: 'moderate' },
          { min: 15, max: 999, label: '≥ 15 : Sévère active', severity: 'high' },
        ],
      }
    }
    return {
      value: score,
      label: `BVAS/WG = ${score} — Maladie peu active / rémission`,
      severity: 'low',
      ranges: [
        { min: 0, max: 0, label: '0 : Rémission', severity: 'low' },
        { min: 1, max: 7, label: '1–7 : Peu active', severity: 'low' },
        { min: 8, max: 14, label: '8–14 : Modérément active', severity: 'moderate' },
        { min: 15, max: 999, label: '≥ 15 : Sévère active', severity: 'high' },
      ],
    }
  },
  interpretation: `Le **BVAS/WG** (Birmingham Vasculitis Activity Score for Wegener Granulomatosis) évalue l\'activité de la granulomatose avec polyangéite (GPA, ex-maladie de Wegener). Un score ≥ 15 indique une maladie sévère justifiant un traitement d\'attaque (cyclophosphamide ou rituximab + corticoïdes).`,
  clinicalCommentary: `Le BVAS original comporte plus d\'items. Cette version simplifiée pour la GPA cible les atteintes d\'organe principales. En pratique, l\'évaluation combine le BVAS/WG, la CRP, le dosage des ANCA (anti-PR3), et la fonction rénale.`,
  references: [
    {
      type: 'pubmed',
      title: 'Stone JH et al. A disease-specific activity index for Wegener granulomatosis. Arthritis Rheum 2001',
      pmid: '11212149',
    },
    {
      type: 'pubmed',
      title: 'Mukhtyar C et al. EULAR recommendations for the management of ANCA-associated vasculitis 2022',
      pmid: '35361660',
    },
  ],
}

export default bvaswg
