import type { FormulaDefinition } from '../types'

const spondyloAmor: FormulaDefinition = {
  id: 'spondylo_amor',
  slug: 'spondylo_amor',
  name: 'Amor — Critères de spondylarthrite',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Critères d\'Amor pour le diagnostic des spondylarthropathies — Score pondéré.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'douleur_nocturne',
      type: 'boolean',
      label: 'Douleurs rachidiennes nocturnes ou raideur matinale du rachis',
    },
    {
      id: 'oligoarthrite_asym',
      type: 'boolean',
      label: 'Oligoarthrite asymétrique (≥ 1 articulation MI)',
    },
    {
      id: 'douleur_fessier',
      type: 'boolean',
      label: 'Douleur fessière à bascule ou douleur fessière unilatérale',
    },
    {
      id: 'doigt_saucisse',
      type: 'boolean',
      label: 'Doigt ou orteil en saucisse (dactylite)',
    },
    {
      id: 'talon',
      type: 'boolean',
      label: 'Talalgie ou autre enthésopathie (Achille, Plantar)',
    },
    {
      id: 'uveite',
      type: 'boolean',
      label: 'Uvéite antérieure aiguë',
    },
    {
      id: 'chrohn_rch',
      type: 'boolean',
      label: 'Maladie de Crohn ou RCH',
    },
    {
      id: 'psoriasis',
      type: 'boolean',
      label: 'Psoriasis, urétrite, cervicite ou diarrhée aiguë < 1 mois avant arthrite',
    },
    {
      id: 'sacroiliite_rx',
      type: 'radio',
      label: 'Sacro-iliite radiographique',
      options: [
        { value: 2, label: 'Grade ≥ 2 bilatéral' },
        { value: 2, label: 'Grade ≥ 3 unilatéral' },
        { value: 0, label: 'Absente ou douteuse' },
      ],
    },
    {
      id: 'hlab27_fam',
      type: 'boolean',
      label: 'HLA-B27 positif ou antécédent familial de SpA (psoriasis, uvéite, Crohn/RCH)',
    },
    {
      id: 'ains_efficace',
      type: 'boolean',
      label: 'Bonne efficacité des AINS (disparition de la douleur en 48h)',
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.douleur_nocturne) score += 1
    if (values.oligoarthrite_asym) score += 2
    if (values.douleur_fessier) score += 1
    if (values.doigt_saucisse) score += 2
    if (values.talon) score += 2
    if (values.uveite) score += 2
    if (values.chrohn_rch) score += 2
    if (values.psoriasis) score += 1
    score += values.sacroiliite_rx ?? 0
    if (values.hlab27_fam) score += 2
    if (values.ains_efficace) score += 1

    if (score >= 6) {
      return {
        value: score,
        label: `Score d'Amor = ${score} — Spondylarthrite certaine (≥ 6)`,
        severity: 'high',
        ranges: [
          { min: 6, max: 99, label: '≥ 6 : Spondylarthrite certaine (SpA)', severity: 'high' },
          { min: 5, max: 5, label: '5 : Probable', severity: 'moderate' },
          { min: 0, max: 4, label: '0–4 : Peu probable', severity: 'low' },
        ],
      }
    }
    if (score === 5) {
      return {
        value: score,
        label: `Score d'Amor = ${score} — Spondylarthrite probable`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 4, label: '0–4 : Peu probable', severity: 'low' },
          { min: 5, max: 5, label: '5 : Probable', severity: 'moderate' },
          { min: 6, max: 99, label: '≥ 6 : Certaine', severity: 'high' },
        ],
      }
    }
    return {
      value: score,
      label: `Score d'Amor = ${score} — Spondylarthrite peu probable`,
      severity: 'low',
      ranges: [
        { min: 0, max: 4, label: '0–4 : Peu probable', severity: 'low' },
        { min: 5, max: 5, label: '5 : Probable', severity: 'moderate' },
        { min: 6, max: 99, label: '≥ 6 : Certaine', severity: 'high' },
      ],
    }
  },
  interpretation: `**Critères d'Amor** pour la classification des spondylarthropathies.

| Item | Points |
|---|---|
| Douleur rachidienne nocturne / raideur matinale | 1 |
| Oligoarthrite asymétrique | 2 |
| Douleur fessière à bascule | 1 |
| Dactylite | 2 |
| Enthésopathie (talon) | 2 |
| Uvéite antérieure aiguë | 2 |
| Crohn / RCH | 2 |
| Psoriasis, urétrite, diarrhée | 1 |
| Sacro-iliite RX (grade ≥ 2 bilat ou ≥ 3 unilat) | 2 |
| HLA-B27+ ou ATCD familiaux | 2 |
| Bonne réponse aux AINS | 1 |

**Interprétation :**
- ≥ 6 : Spondylarthropathie certaine
- 5 : Probable
- ≤ 4 : Peu probable`,
  clinicalCommentary: `Les critères d'Amor (1990) ont précédé les critères ASAS. Bien qu'historiques, ils restent utiles en clinique pour leur simplicité. Les critères ASAS (2009) sont désormais la référence pour la spondylarthrite axiale.`,
  references: [
    {
      type: 'pubmed',
      title: 'Amor B et al. Critères de classification des spondylarthropathies. Rev Rhum Mal Osteoartic 1990',
      pmid: '2353106',
    },
    {
      type: 'pubmed',
      title: 'Gomar B et al. Comparison of criteria for spondyloarthropathies. Arthritis Rheum 1991',
      pmid: '2069658',
    },
  ],
}

export default spondyloAmor
