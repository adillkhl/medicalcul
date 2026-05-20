import type { FormulaDefinition } from '../types'

const das28: FormulaDefinition = {
  id: 'das28',
  slug: 'das28',
  name: 'DAS 28 — Score d\'activité de la polyarthrite rhumatoïde',
  specialty: 'rhumatologie',
  category: 'Polyarthrite rhumatoïde',
  description: 'Disease Activity Score 28 — Évaluation de l\'activité de la polyarthrite rhumatoïde.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'nb_articulations_douloureuses',
      type: 'number',
      label: 'Nombre d\'articulations douloureuses parmi 28 (NAD)',
      min: 0,
      max: 28,
      step: 1,
      placeholder: '8',
    },
    {
      id: 'nb_articulations_gonflees',
      type: 'number',
      label: 'Nombre d\'articulations gonflées parmi 28 (NAG)',
      min: 0,
      max: 28,
      step: 1,
      placeholder: '6',
    },
    {
      id: 'evs',
      type: 'number',
      label: 'Évaluation visuelle de l\'activité par le patient (EVA 0–100 mm)',
      min: 0,
      max: 100,
      step: 1,
      placeholder: '50',
    },
    {
      id: 'crp',
      type: 'number',
      label: 'CRP (mg/L)',
      min: 0,
      max: 200,
      step: 0.1,
      placeholder: '15',
    },
  ],
  calculate: (values) => {
    const nad = values.nb_articulations_douloureuses ?? 0
    const nag = values.nb_articulations_gonflees ?? 0
    const evs = values.evs ?? 0
    const crp = values.crp ?? 5

    const das28Val = 0.56 * Math.sqrt(nad) + 0.28 * Math.sqrt(nag) + 0.36 * Math.log(crp + 1) + 0.014 * evs + 0.96
    const das28Round = Math.round(das28Val * 100) / 100

    if (das28Round <= 2.6) {
      return {
        value: das28Round,
        label: `DAS28-CRP = ${das28Round} — Rémission`,
        severity: 'low',
        ranges: [
          { min: 0, max: 2.6, label: '≤ 2.6 : Rémission', severity: 'low' },
          { min: 2.6, max: 3.2, label: '2.6–3.2 : Faible activité', severity: 'low' },
          { min: 3.2, max: 5.1, label: '3.2–5.1 : Activité modérée', severity: 'moderate' },
          { min: 5.1, max: 99, label: '> 5.1 : Activité élevée', severity: 'high' },
        ],
      }
    }
    if (das28Round <= 3.2) {
      return {
        value: das28Round,
        label: `DAS28-CRP = ${das28Round} — Faible activité`,
        severity: 'low',
        ranges: [
          { min: 0, max: 2.6, label: '≤ 2.6 : Rémission', severity: 'low' },
          { min: 2.6, max: 3.2, label: '2.6–3.2 : Faible', severity: 'low' },
          { min: 3.2, max: 5.1, label: '3.2–5.1 : Modérée', severity: 'moderate' },
          { min: 5.1, max: 99, label: '> 5.1 : Élevée', severity: 'high' },
        ],
      }
    }
    if (das28Round <= 5.1) {
      return {
        value: das28Round,
        label: `DAS28-CRP = ${das28Round} — Activité modérée`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 2.6, label: '≤ 2.6 : Rémission', severity: 'low' },
          { min: 2.6, max: 3.2, label: '2.6–3.2 : Faible', severity: 'low' },
          { min: 3.2, max: 5.1, label: '3.2–5.1 : Modérée', severity: 'moderate' },
          { min: 5.1, max: 99, label: '> 5.1 : Élevée', severity: 'high' },
        ],
      }
    }
    return {
      value: das28Round,
      label: `DAS28-CRP = ${das28Round} — Activité élevée`,
      severity: 'high',
      ranges: [
        { min: 0, max: 2.6, label: '≤ 2.6 : Rémission', severity: 'low' },
        { min: 2.6, max: 3.2, label: '2.6–3.2 : Faible', severity: 'low' },
        { min: 3.2, max: 5.1, label: '3.2–5.1 : Modérée', severity: 'moderate' },
        { min: 5.1, max: 99, label: '> 5.1 : Élevée', severity: 'high' },
      ],
    }
  },
  interpretation: `**DAS28-CRP** — Disease Activity Score basé sur 28 articulations.

**Formule (DAS28-CRP) :**
DAS28 = 0,56 × √(NAD) + 0,28 × √(NAG) + 0,36 × ln(CRP+1) + 0,014 × EVA + 0,96

**Articulations évaluées (28) :** Épaules, coudes, poignets, MCP, IPP, MTP (bilatérales).

**Interprétation :**
- ≤ 2,6 : Rémission
- 2,6–3,2 : Faible activité
- 3,2–5,1 : Activité modérée
- > 5,1 : Activité élevée`,
  clinicalCommentary: `Le DAS28 est le score d'activité le plus utilisé en rhumatologie pour la PR. La cible thérapeutique recommandée par l'EULAR est la rémission (ou à défaut la faible activité). Une diminution ≥ 1,2 est une bonne réponse EULAR.`,
  references: [
    {
      type: 'pubmed',
      title: 'Prevoo ML et al. Modified disease activity scores that include 28-joint counts. Arthritis Rheum 1995',
      pmid: '7840345',
    },
    {
      type: 'pubmed',
      title: 'Wells G et al. Validation of the 28-joint Disease Activity Score. Ann Rheum Dis 2009',
      pmid: '19054820',
    },
  ],
}

export default das28
