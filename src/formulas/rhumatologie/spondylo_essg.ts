import type { FormulaDefinition } from '../types'

const spondyloEssg: FormulaDefinition = {
  id: 'spondylo_essg',
  slug: 'spondylo_essg',
  name: 'ESSG — Critères de spondylarthropathie',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Critères de l\'ESSG (European Spondyloarthropathy Study Group) pour la classification des spondylarthropathies.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'douleur_rachis',
      type: 'boolean',
      label: 'Douleur rachidienne inflammatoire (début avant 45 ans, réveil nocturne, amélioration à l\'effort)',
    },
    {
      id: 'synovite_asym',
      type: 'boolean',
      label: 'Synovite asymétrique prédominant aux membres inférieurs',
    },
    {
      id: 'douleur_fessier',
      type: 'boolean',
      label: 'Douleur fessière à bascule (alternance fessière)',
    },
    {
      id: 'enthésite',
      type: 'boolean',
      label: 'Enthésite (talonnière, plantaire)',
    },
    {
      id: 'dactylite',
      type: 'boolean',
      label: 'Dactylite',
    },
    {
      id: 'psoriasis',
      type: 'boolean',
      label: 'Psoriasis clinique',
    },
    {
      id: 'chrohn_rch',
      type: 'boolean',
      label: 'Maladie de Crohn ou RCH',
    },
    {
      id: 'uretrite_ent',
      type: 'boolean',
      label: 'Urétrite, cervicite ou entérite aiguë dans le mois précédant l\'arthrite',
    },
    {
      id: 'atcd_fam',
      type: 'boolean',
      label: 'Antécédents familiaux de spondylarthropathie (SpA, psoriasis, Crohn/RCH, uvéite)',
    },
    {
      id: 'hlab27',
      type: 'boolean',
      label: 'HLA-B27 positif',
    },
    {
      id: 'sacroiliite',
      type: 'boolean',
      label: 'Sacro-iliite radiographique ou IRM',
    },
  ],
  calculate: (values) => {
    // ESSG criteria: 2 groups
    // Group 1: Inflammatory spinal pain OR synovitis (asymmetric, predominantly lower limbs)
    const rachis = values.douleur_rachis || false
    const synovite = values.synovite_asym || false

    const group1 = rachis || synovite

    if (!group1) {
      return {
        value: 0,
        label: 'ESSG non remplis — Absence de douleur rachidienne inflammatoire ou de synovite',
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: 'Critères ESSG non remplis', severity: 'low' },
          { min: 1, max: 1, label: 'Critères ESSG remplis', severity: 'high' },
        ],
      }
    }

    let otherFeatures = 0
    if (values.douleur_fessier) otherFeatures++
    if (values.enthésite) otherFeatures++
    if (values.dactylite) otherFeatures++
    if (values.psoriasis) otherFeatures++
    if (values.chrohn_rch) otherFeatures++
    if (values.uretrite_ent) otherFeatures++
    if (values.atcd_fam) otherFeatures++
    if (values.hlab27) otherFeatures++
    if (values.sacroiliite) otherFeatures++

    // Need at least 1 other feature
    if (otherFeatures >= 1) {
      return {
        value: otherFeatures,
        label: 'Critères ESSG remplis — Spondylarthropathie classifiable',
        severity: 'high',
        details: { signe_entree: rachis ? 'douleur rachidienne' : 'synovite', nb_criteres: otherFeatures + 1 },
        ranges: [
          { min: 0, max: 0, label: 'ESSG non remplis', severity: 'low' },
          { min: 1, max: 99, label: 'ESSG remplis — SpA', severity: 'high' },
        ],
      }
    }

    return {
      value: 0,
      label: 'ESSG non remplis — Absence d\'autre caractéristique',
      severity: 'low',
      details: { signe_entree: rachis ? 'douleur rachidienne' : 'synovite', nb_criteres: 1 },
      ranges: [
        { min: 0, max: 0, label: 'ESSG non remplis', severity: 'low' },
        { min: 1, max: 99, label: 'ESSG remplis', severity: 'high' },
      ],
    }
  },
  interpretation: `**Critères ESSG** (European Spondyloarthropathy Study Group, 1991)

**Critère obligatoire (1 des 2) :**
1. Douleur rachidienne inflammatoire
2. Synovite asymétrique prédominant aux membres inférieurs

**PLUS ≥ 1 caractéristique suivante :**
1. Douleur fessière à bascule
2. Enthésite
3. Dactylite
4. Psoriasis
5. Maladie de Crohn / RCH
6. Urétrite ou entérite aiguë < 1 mois avant arthrite
7. Antécédents familiaux de SpA
8. HLA-B27 positif
9. Sacro-iliite (RX ou IRM)

**Sensibilité** ~86%, **Spécificité** ~87% dans les études de validation.`,
  clinicalCommentary: `Les critères ESSG ont été largement utilisés avant les critères ASAS. Ils restent valides et simples d\'utilisation. Leur sensibilité est bonne pour les formes périphériques.`,
  references: [
    {
      type: 'pubmed',
      title: 'Dougados M et al. The European Spondylarthropathy Study Group preliminary criteria for the classification of spondylarthropathy. Arthritis Rheum 1991',
      pmid: '2010300',
    },
    {
      type: 'pubmed',
      title: 'Amor B et al. Comparison of criteria for spondyloarthropathies. Arthritis Rheum 1991',
      pmid: '2069658',
    },
  ],
}

export default spondyloEssg
