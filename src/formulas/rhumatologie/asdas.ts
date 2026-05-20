import type { FormulaDefinition } from '../types'

const asdas: FormulaDefinition = {
  id: 'asdas',
  slug: 'asdas',
  name: 'ASDAS — Score d\'activité de la spondylarthrite',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Ankylosing Spondylitis Disease Activity Score — Évaluation de l\'activité de la spondylarthrite ankylosante.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'douleur_nuit',
      type: 'number',
      label: 'Douleur nocturne (EVA 0–10) — dernier mois',
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: '5',
    },
    {
      id: 'fatigue',
      type: 'number',
      label: 'Fatigue globale (EVA 0–10) — dernier mois',
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: '4',
    },
    {
      id: 'douleur_globale',
      type: 'number',
      label: 'Douleur globale (EVA 0–10) — dernier mois',
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: '5',
    },
    {
      id: 'crp',
      type: 'number',
      label: 'CRP (mg/L)',
      min: 0,
      max: 200,
      step: 0.1,
      placeholder: '10',
    },
    {
      id: 'raid_matinale',
      type: 'number',
      label: 'Durée de raideur matinale (min) — dernier mois',
      min: 0,
      max: 180,
      step: 1,
      placeholder: '30',
    },
  ],
  calculate: (values) => {
    const dn = values.douleur_nuit ?? 0
    const fatigue = values.fatigue ?? 0
    const dg = values.douleur_globale ?? 0
    const crp = values.crp ?? 5
    const raideur = values.raid_matinale ?? 0

    const pain = (dn + dg) / 2

    // ASDAS-CRP formula
    const asdasVal = 0.121 * pain + 0.058 * raideur + 0.110 * fatigue + 0.073 * crp + 0.579
    const asdasRound = Math.round(asdasVal * 100) / 100

    if (asdasRound < 1.3) {
      return {
        value: asdasRound,
        label: `ASDAS = ${asdasRound} — Maladie inactive`,
        severity: 'low',
        ranges: [
          { min: 0, max: 1.3, label: '< 1.3 : Maladie inactive', severity: 'low' },
          { min: 1.3, max: 2.1, label: '1.3–2.1 : Activité modérée', severity: 'moderate' },
          { min: 2.1, max: 3.5, label: '2.1–3.5 : Activité élevée', severity: 'high' },
          { min: 3.5, max: 99, label: '> 3.5 : Activité très élevée', severity: 'critical' },
        ],
      }
    }
    if (asdasRound < 2.1) {
      return {
        value: asdasRound,
        label: `ASDAS = ${asdasRound} — Activité modérée`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 1.3, label: '< 1.3 : Inactive', severity: 'low' },
          { min: 1.3, max: 2.1, label: '1.3–2.1 : Modérée', severity: 'moderate' },
          { min: 2.1, max: 3.5, label: '2.1–3.5 : Élevée', severity: 'high' },
          { min: 3.5, max: 99, label: '> 3.5 : Très élevée', severity: 'critical' },
        ],
      }
    }
    if (asdasRound < 3.5) {
      return {
        value: asdasRound,
        label: `ASDAS = ${asdasRound} — Activité élevée`,
        severity: 'high',
        ranges: [
          { min: 0, max: 1.3, label: '< 1.3 : Inactive', severity: 'low' },
          { min: 1.3, max: 2.1, label: '1.3–2.1 : Modérée', severity: 'moderate' },
          { min: 2.1, max: 3.5, label: '2.1–3.5 : Élevée', severity: 'high' },
          { min: 3.5, max: 99, label: '> 3.5 : Très élevée', severity: 'critical' },
        ],
      }
    }
    return {
      value: asdasRound,
      label: `ASDAS = ${asdasRound} — Activité très élevée`,
      severity: 'critical',
      ranges: [
        { min: 0, max: 1.3, label: '< 1.3 : Inactive', severity: 'low' },
        { min: 1.3, max: 2.1, label: '1.3–2.1 : Modérée', severity: 'moderate' },
        { min: 2.1, max: 3.5, label: '2.1–3.5 : Élevée', severity: 'high' },
        { min: 3.5, max: 99, label: '> 3.5 : Très élevée', severity: 'critical' },
      ],
    }
  },
  interpretation: `**ASDAS** (Ankylosing Spondylitis Disease Activity Score) — Score composite validé par l'ASAS.

**Formule ASDAS-CRP :**
0,121 × Douleur globale + 0,058 × Raideur matinale + 0,110 × Fatigue + 0,073 × CRP + 0,579

| Score | Activité |
|---|---|
| < 1,3 | Inactive |
| 1,3 – < 2,1 | Modérée |
| 2,1 – < 3,5 | Élevée |
| ≥ 3,5 | Très élevée |

**Seuils de réponse clinique :**
- Amélioration ≥ 1,1 : réponse cliniquement importante
- Amélioration ≥ 2,0 : amélioration majeure`,
  clinicalCommentary: `L'ASDAS est plus sensible que le BASDAI pour discriminer l'activité de la spondylarthrite. Il est recommandé par l'ASAS et l'EULAR comme critère de décision thérapeutique (cibles : ASDAS inactive ou faible activité).`,
  references: [
    {
      type: 'pubmed',
      title: 'van der Heijde D et al. ASDAS, a highly discriminatory ASAS-endorsed disease activity score. Ann Rheum Dis 2009',
      pmid: '19297344',
    },
    {
      type: 'pubmed',
      title: 'Machado P et al. Ankylosing Spondylitis Disease Activity Score (ASDAS). Ann Rheum Dis 2011',
      pmid: '21389034',
    },
  ],
}

export default asdas
