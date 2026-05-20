import type { FormulaDefinition } from '../types'

const prAcreular: FormulaDefinition = {
  id: 'pr_acreular',
  slug: 'pr_acreular',
  name: 'PR ACR/EULAR 2010 — Critères de classification',
  specialty: 'rhumatologie',
  category: 'Polyarthrite rhumatoïde',
  description: 'Critères ACR/EULAR 2010 pour la classification de la polyarthrite rhumatoïde.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'atteinte_articulaire',
      type: 'radio',
      label: 'Atteinte articulaire (nombre d\'articulations synovites cliniques)',
      options: [
        { value: 0, label: '0 grosse articulation (épaule, coude, hanche, genou, cheville)' },
        { value: 1, label: '1 grosse articulation' },
        { value: 2, label: '2–10 grosses articulations' },
        { value: 3, label: '1–3 petites articulations (MCP, IPP, MTP, poignet)' },
        { value: 5, label: '4–10 petites articulations' },
        { value: 5, label: '≥ 10 articulations (dont au moins 1 petite)' },
      ],
    },
    {
      id: 'serologie',
      type: 'radio',
      label: 'Sérologie (FR et/ou anti-CCP)',
      options: [
        { value: 0, label: 'Négatifs' },
        { value: 2, label: 'FR ou anti-CCP faiblement positifs (> 1× à < 3× normale)' },
        { value: 3, label: 'FR ou anti-CCP fortement positifs (> 3× normale)' },
      ],
    },
    {
      id: 'duree_synovite',
      type: 'radio',
      label: 'Durée de la synovite',
      options: [
        { value: 0, label: '< 6 semaines' },
        { value: 1, label: '≥ 6 semaines' },
      ],
    },
    {
      id: 'biologie_inflam',
      type: 'radio',
      label: 'Syndrome inflammatoire biologique',
      options: [
        { value: 0, label: 'CRP et VS normales' },
        { value: 1, label: 'CRP ou VS élevée' },
      ],
    },
  ],
  calculate: (values) => {
    let score = 0
    score += values.atteinte_articulaire ?? 0
    score += values.serologie ?? 0
    score += values.duree_synovite ?? 0
    score += values.biologie_inflam ?? 0

    if (score >= 6) {
      return {
        value: score,
        label: `Score ACR/EULAR 2010 = ${score}/10 — PR classifiable`,
        severity: 'high',
        ranges: [
          { min: 6, max: 10, label: '≥ 6 : PR classifiable selon critères ACR/EULAR 2010', severity: 'high' },
          { min: 0, max: 5, label: '< 6 : Pas de PR classifiable — réévaluer', severity: 'low' },
        ],
      }
    }
    return {
      value: score,
      label: `Score ACR/EULAR 2010 = ${score}/10 — PR non classifiable`,
      severity: 'low',
      ranges: [
        { min: 0, max: 5, label: '< 6 : Pas de PR classifiable — réévaluer', severity: 'low' },
        { min: 6, max: 10, label: '≥ 6 : PR classifiable', severity: 'high' },
      ],
    }
  },
  interpretation: `**Critères ACR/EULAR 2010** pour la polyarthrite rhumatoïde.

**Conditions préalables :**
- ≥ 1 articulation avec synovite clinique
- Absence de diagnostic alternatif expliquant mieux la synovite

**Score (≥ 6/10 = PR classifiable) :**

| Domaine | Score |
|---|---|
| **Atteinte articulaire** | 0–5 |
| - 1 grosse articulation | 1 |
| - 2–10 grosses | 2 |
| - 1–3 petites | 3 |
| - 4–10 petites | 5 |
| - ≥ 10 (dont ≥ 1 petite) | 5 |
| **Sérologie** (FR/anti-CCP) | 0–3 |
| **Durée synovite ≥ 6 sem** | 1 |
| **CRP/VS élevées** | 1 |

**Ne pas appliquer** si érosion typique sur radio (→ PR certaine).`,
  clinicalCommentary: `Ces critères sont le standard pour inclure les patients dans les essais et définir la PR. En pratique quotidienne, devant une polyarthrite débutante, un score ≥ 6/10 permet de débuter un traitement de fond (méthotrexate).`,
  references: [
    {
      type: 'pubmed',
      title: 'Aletaha D et al. 2010 Rheumatoid arthritis classification criteria. Arthritis Rheum 2010',
      pmid: '20872595',
    },
    {
      type: 'guideline',
      title: 'EULAR 2022 recommendations for the management of rheumatoid arthritis',
      pmid: '35288314',
    },
  ],
}

export default prAcreular
