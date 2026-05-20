import type { FormulaDefinition } from '../types'

const spondperiphAsas: FormulaDefinition = {
  id: 'spondperiph_asas',
  slug: 'spondperiph_asas',
  name: 'ASAS — Critères de spondylarthrite périphérique',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Critères ASAS 2011 pour la classification de la spondylarthrite périphérique.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'arthrite',
      type: 'boolean',
      label: 'Arthrite périphérique (synovite, habituellement asymétrique, prédominant MI)',
    },
    {
      id: 'enthesite',
      type: 'boolean',
      label: 'Enthésite (talon : insertion Achille ou plantaire)',
    },
    {
      id: 'dactylite',
      type: 'boolean',
      label: 'Dactylite (doigt ou orteil en saucisse)',
    },
    {
      id: 'psoriasis',
      type: 'boolean',
      label: 'Psoriasis en cours ou antérieur',
    },
    {
      id: 'hla_b27',
      type: 'boolean',
      label: 'HLA-B27 positif',
    },
    {
      id: 'chrohn_ou_rch',
      type: 'boolean',
      label: 'Maladie de Crohn ou RCH',
    },
    {
      id: 'infection_precede',
      type: 'boolean',
      label: 'Infection antérieure (urétrite, cervicite, entérite aiguë) — dans le mois précédent',
    },
    {
      id: 'uveite',
      type: 'boolean',
      label: 'Uvéite antérieure aiguë (dans le passé ou en cours)',
    },
    {
      id: 'sacroiliite_irm',
      type: 'boolean',
      label: 'Sacro-iliite à l\'IRM (œdème osseux)',
    },
    {
      id: 'sacroiliite_rx',
      type: 'boolean',
      label: 'Sacro-iliite radiographique (grade ≥ 2 bilatéral ou ≥ 3 unilatéral)',
    },
    {
      id: 'atcd_fam',
      type: 'boolean',
      label: 'Antécédents familiaux de spondylarthrite, psoriasis, uvéite, Crohn/RCH',
    },
  ],
  calculate: (values) => {
    const arthrite = values.arthrite || false
    const enthesite = values.enthesite || false
    const dactylite = values.dactylite || false

    // Must have at least 1 entry criterion: arthritis, enthesitis, or dactylitis
    if (!arthrite && !enthesite && !dactylite) {
      return {
        value: 0,
        label: 'Critères ASAS périphérique non remplis — Absence de signe d\'entrée',
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: 'Absence de synovite, enthésite ou dactylite', severity: 'low' },
          { min: 1, max: 1, label: 'Critères ASAS périphérique remplis', severity: 'high' },
        ],
      }
    }

    let spAFeatures = 0
    if (values.psoriasis) spAFeatures++
    if (values.hla_b27) spAFeatures++
    if (values.chrohn_ou_rch) spAFeatures++
    if (values.infection_precede) spAFeatures++
    if (values.uveite) spAFeatures++
    if (values.sacroiliite_irm) spAFeatures++
    if (values.sacroiliite_rx) spAFeatures++
    if (values.atcd_fam) spAFeatures++

    // Formula: (arthrite OR enthesite OR dactylite)
    // PLUS ≥ 1 OF: psoriasis, Crohn/RCH, infection antérieure, HLA-B27, uvéite, sacro-iliite, ATCD fam
    if (spAFeatures >= 1) {
      return {
        value: spAFeatures,
        label: 'Critères ASAS périphérique remplis — SpA périphérique classifiable',
        severity: 'high',
        details: { signe_entree: arthrite ? 'arthrite' : enthesite ? 'enthésite' : 'dactylite', nb_criteres: spAFeatures },
        ranges: [
          { min: 0, max: 0, label: 'Non classifiable', severity: 'low' },
          { min: 1, max: 99, label: 'ASAS périphérique remplis', severity: 'high' },
        ],
      }
    }

    return {
      value: 0,
      label: 'Critères ASAS périphérique non remplis — Pas assez de caractéristiques SpA',
      severity: 'low',
      details: { nb_criteres: spAFeatures, besoin: 'au moins 1 caracteristique SpA supplementaire' },
      ranges: [
        { min: 0, max: 0, label: 'Non classifiable', severity: 'low' },
        { min: 1, max: 99, label: 'ASAS remplis', severity: 'high' },
      ],
    }
  },
  interpretation: `**Critères ASAS 2011 pour la spondylarthrite périphérique**

**Signe d'entrée (au moins 1) :**
- Arthrite périphérique (synovite)
- Enthésite
- Dactylite

**PLUS ≥ 1 caractéristique SpA :**
1. Psoriasis
2. HLA-B27 positif
3. Maladie de Crohn / RCH
4. Infection antérieure (urétrite, cervicite, entérite)
5. Uvéite antérieure aiguë
6. Sacro-iliite (IRM ou RX)
7. Antécédents familiaux de SpA`,
  clinicalCommentary: `Ces critères permettent de classifier les spondylarthrites à prédominance périphérique (sans atteinte axiale significative). Utile pour le rhumatisme psoriasique, les arthrites réactionnelles, et les spondylarthrites indifférenciées.`,
  references: [
    {
      type: 'pubmed',
      title: 'Rudwaleit M et al. The Assessment of SpondyloArthritis international Society classification criteria for peripheral SpA. Ann Rheum Dis 2011',
      pmid: '20810589',
    },
    {
      type: 'pubmed',
      title: 'van Tubergen A, Weber U. Diagnosis and classification of axial spondyloarthritis. Best Pract Res Clin Rheumatol 2012',
      pmid: '22793941',
    },
  ],
}

export default spondperiphAsas
