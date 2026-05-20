import type { FormulaDefinition } from '../types'

const spondyloAsas: FormulaDefinition = {
  id: 'spondylo_asas',
  slug: 'spondylo_asas',
  name: 'ASAS — Critères de spondylarthrite axiale',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Critères ASAS 2009 pour la classification de la spondylarthrite axiale (radiographique et non radiographique).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'douleur_rachis',
      type: 'boolean',
      label: 'Douleur rachidienne ≥ 3 mois débutée avant 45 ans',
    },
    {
      id: 'sacroiliite_irm',
      type: 'boolean',
      label: 'Sacro-iliite active à l\'IRM (œdème osseux / ostéite)',
    },
    {
      id: 'sacroiliite_rx',
      type: 'boolean',
      label: 'Sacro-iliite radiographique (grade ≥ 2 bilatéral ou ≥ 3 unilatéral)',
    },
    {
      id: 'hlab27',
      type: 'radio',
      label: 'HLA-B27',
      options: [
        { value: 1, label: 'Positif' },
        { value: 0, label: 'Négatif' },
      ],
    },
    {
      id: 'douleur_fessier',
      type: 'boolean',
      label: 'Douleur fessière à bascule (alternance fessière)',
    },
    {
      id: 'enthésite',
      type: 'boolean',
      label: 'Enthésite (Achille ou plantaire)',
    },
    {
      id: 'uvéite',
      type: 'boolean',
      label: 'Uvéite antérieure aiguë',
    },
    {
      id: 'dactylite',
      type: 'boolean',
      label: 'Dactylite (doigt ou orteil en saucisse)',
    },
    {
      id: 'rhumatisme_psoriasis',
      type: 'boolean',
      label: 'Rhumatisme psoriasique / psoriasis / maladie de Crohn / RCH',
    },
    {
      id: 'bonne_reponse_ains',
      type: 'boolean',
      label: 'Bonne réponse aux AINS (disparition de la douleur sous AINS en 48h)',
    },
    {
      id: 'crp',
      type: 'boolean',
      label: 'CRP élevée (en l\'absence d\'autre cause)',
    },
    {
      id: 'atcd_fam',
      type: 'boolean',
      label: 'Antécédents familiaux de spondylarthrite (parent ou fratrie)',
    },
  ],
  calculate: (values) => {
    const dxAge = values.douleur_rachis || false
    const sacroIrm = values.sacroiliite_irm || false
    const sacroRx = values.sacroiliite_rx || false
    const hlab27 = values.hlab27 === 1
    const fessier = values.douleur_fessier || false
    const enthesite = values.enthésite || false
    const uveite = values.uvéite || false
    const dactylite = values.dactylite || false
    const psoriasis = values.rhumatisme_psoriasis || false
    const ains = values.bonne_reponse_ains || false
    const crp = values.crp || false
    const fam = values.atcd_fam || false

    // Spondylarthrite axiale (radiographique) : sacro-iliite RX + ≥ 1 critère SpA
    if (sacroRx) {
      let spAFeatures = 0
      if (fessier) spAFeatures++
      if (enthesite) spAFeatures++
      if (uveite) spAFeatures++
      if (dactylite) spAFeatures++
      if (psoriasis) spAFeatures++
      if (ains) spAFeatures++
      if (crp) spAFeatures++
      if (fam) spAFeatures++
      if (hlab27) spAFeatures++

      if (spAFeatures >= 1) {
        return {
          value: 1,
          label: 'Spondylarthrite axiale radiographique (SA) — Critères ASAS remplis',
          severity: 'high',
          details: { voie: 'RX + ≥ 1 caractéristique SpA', sacroiliite: 'RX grade ≥ 2 bilat ou ≥ 3 unilat' },
          ranges: [
            { min: 0, max: 0, label: 'Critères ASAS non remplis', severity: 'low' },
            { min: 1, max: 1, label: 'Critères ASAS remplis — SpA axiale', severity: 'high' },
          ],
        }
      }
    }

    // Spondylarthrite axiale (non radiographique) : sacro-iliite IRM + ≥ 1 critère SpA
    // OU HLA-B27 + ≥ 2 critères SpA
    if (sacroIrm) {
      let spAFeatures = 0
      if (fessier) spAFeatures++
      if (enthesite) spAFeatures++
      if (uveite) spAFeatures++
      if (dactylite) spAFeatures++
      if (psoriasis) spAFeatures++
      if (ains) spAFeatures++
      if (crp) spAFeatures++
      if (fam) spAFeatures++

      if (spAFeatures >= 1) {
        return {
          value: 1,
          label: 'Spondylarthrite axiale non radiographique (nr-axSpA) — IRM + ≥ 1 critère SpA',
          severity: 'high',
          details: { voie: 'IRM + ≥ 1 caractéristique SpA' },
          ranges: [
            { min: 0, max: 0, label: 'Non classifiable', severity: 'low' },
            { min: 1, max: 1, label: 'nr-axSpA — ASAS remplis', severity: 'high' },
          ],
        }
      }
    }

    if (hlab27) {
      let spAFeatures = 0
      if (fessier) spAFeatures++
      if (enthesite) spAFeatures++
      if (uveite) spAFeatures++
      if (dactylite) spAFeatures++
      if (psoriasis) spAFeatures++
      if (ains) spAFeatures++
      if (crp) spAFeatures++
      if (fam) spAFeatures++

      if (spAFeatures >= 2) {
        return {
          value: 1,
          label: 'Spondylarthrite axiale non radiographique (nr-axSpA) — HLA-B27 + ≥ 2 critères',
          severity: 'high',
          details: { voie: 'HLA-B27 + ≥ 2 caractéristiques SpA' },
          ranges: [
            { min: 0, max: 0, label: 'Non classifiable', severity: 'low' },
            { min: 1, max: 1, label: 'nr-axSpA — ASAS remplis', severity: 'high' },
          ],
        }
      }
    }

    return {
      value: 0,
      label: 'Critères ASAS non remplis',
      severity: 'low',
      details: { condition: 'Douleur rachidienne >= 3 mois avant 45 ans requise' },
      ranges: [
        { min: 0, max: 0, label: 'Critères ASAS non remplis', severity: 'low' },
        { min: 1, max: 1, label: 'Critères ASAS remplis', severity: 'high' },
      ],
    }
  },
  interpretation: `**Critères ASAS 2009 pour la spondylarthrite axiale**

**Condition préalable :** Douleur rachidienne ≥ 3 mois débutée avant 45 ans.

**Voies diagnostiques :**

| Voie | Critères |
|---|---|
| **RX** | Sacro-iliite RX + ≥ 1 caractéristique SpA |
| **IRM** | Sacro-iliite IRM + ≥ 1 caractéristique SpA |
| **HLA-B27** | HLA-B27+ + ≥ 2 caractéristiques SpA |

**Caractéristiques SpA :**
1. Douleur fessière à bascule
2. Enthésite (Achille, plantaire)
3. Uvéite antérieure
4. Dactylite
5. Psoriasis / Crohn / RCH
6. Bonne réponse aux AINS
7. CRP élevée
8. Antécédents familiaux de SpA`,
  clinicalCommentary: `Les critères ASAS ont révolutionné le diagnostic de la spondylarthrite axiale en permettant le diagnostic avant l'apparition de l'ankylose radiographique. L'IRM sacro-iliaque avec séquence STIR est l'examen clé pour la nr-axSpA.`,
  references: [
    {
      type: 'pubmed',
      title: 'Rudwaleit M et al. The development of Assessment of SpondyloArthritis international Society classification criteria. Ann Rheum Dis 2009',
      pmid: '19497914',
    },
    {
      type: 'pubmed',
      title: 'Rudwaleit M et al. The Assessment of SpondyloArthritis international Society classification criteria for peripheral SpA. Ann Rheum Dis 2011',
      pmid: '20810589',
    },
  ],
}

export default spondyloAsas
