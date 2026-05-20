import type { FormulaDefinition } from '../types'

const neurodn4: FormulaDefinition = {
  id: 'neurodn4',
  slug: 'neurodn4',
  name: 'DN4 — Douleur Neuropathique (Questionnaire)',
  specialty: 'neurologie',
  category: 'Douleur',
  description: 'Questionnaire de dépistage de la douleur neuropathique en 10 items (score 0–10)',
  version: '2024',
  lastValidated: '2024-02',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'brulure',
      type: 'boolean',
      label: 'La douleur est-elle associée à une sensation de BRÛLURE ?',
    },
    {
      id: 'froid',
      type: 'boolean',
      label: 'La douleur est-elle associée à une sensation de FROID DOULOUREUX ?',
    },
    {
      id: 'decharges',
      type: 'boolean',
      label: 'La douleur est-elle associée à des sensations de DÉCHARGES ÉLECTRIQUES ?',
    },
    {
      id: 'fourmillements',
      type: 'boolean',
      label: 'La douleur est-elle associée à des FOURMILLEMENTS ?',
    },
    {
      id: 'picotements',
      type: 'boolean',
      label: 'La douleur est-elle associée à des PICOTEMENTS ?',
    },
    {
      id: 'engourdissement',
      type: 'boolean',
      label: 'La douleur est-elle associée à des ENGOURDISSEMENTS ?',
    },
    {
      id: 'demangeaisons',
      type: 'boolean',
      label: 'La douleur est-elle associée à des DÉMANGEAISONS ?',
    },
    {
      id: 'hypoesthesie',
      type: 'boolean',
      label: 'Y a-t-il une HYPŒSTHÉSIE AU TACT (diminution de la sensibilité au contact) ?',
    },
    {
      id: 'hypoalgiesie',
      type: 'boolean',
      label: 'Y a-t-il une HYPŒSTHÉSIE À LA PIQÛRE (diminution de la sensibilité à la piqûre) ?',
    },
    {
      id: 'allodynie',
      type: 'boolean',
      label: 'Le frottement (brossage, vêtement) provoque-t-il ou augmente-t-il la douleur ? (ALLODYNIE)',
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.brulure) score += 1
    if (values.froid) score += 1
    if (values.decharges) score += 1
    if (values.fourmillements) score += 1
    if (values.picotements) score += 1
    if (values.engourdissement) score += 1
    if (values.demangeaisons) score += 1
    if (values.hypoesthesie) score += 1
    if (values.hypoalgiesie) score += 1
    if (values.allodynie) score += 1

    const isNeuropathic = score >= 4

    return {
      value: score,
      label: isNeuropathic ? 'Douleur NEUROPATHIQUE probable' : 'Douleur non neuropathique',
      severity: isNeuropathic ? 'moderate' : 'low',
      details: {
        items_positifs: score,
        sensibilite: isNeuropathic ? 'Se : 82,9 %, Sp : 89,9 %' : 'N/A',
      },
      ranges: [
        { min: 0, max: 3, label: 'DN4 négatif — Douleur NON neuropathique', severity: 'low', recommendation: 'Probabilité faible de douleur neuropathique (< 10 %). Réévaluer selon le contexte clinique. Envisager douleur nociceptive ou mixte.' },
        { min: 4, max: 10, label: 'DN4 ≥ 4 — Douleur NEUROPATHIQUE probable', severity: 'moderate', recommendation: 'Spécificité 90 %. Débuter un traitement antalgique adapté : antiépileptiques (gabapentinoïdes) ou antidépresseurs (tricycliques, IRSNA). Avis spécialisé si résistance. Bilan étiologique neurologique.' },
      ],
    }
  },
  interpretation: `Le **DN4** (Douleur Neuropathique 4 questions) est le questionnaire de dépistage de la douleur neuropathique le plus utilisé en France. Il comporte 10 items : 7 items issus de l’interrogatoire et 3 items de l'examen clinique.

**Seuil pathologique : ≥ 4/10.** Sensibilité 82,9 %, spécificité 89,9 %.

**Items interrogatoire :** brûlure, froid douloureux, décharges électriques, fourmillements, picotements, engourdissements, démangeaisons.

**Items examen :** hypœsthésie au tact, hypœsthésie à la piqûre, allodynie au frottement.

Le DN4 est validé en français et en plusieurs langues.`,
  clinicalCommentary: `Le DN4 est indispensable en consultation de neurologie pour distinguer douleur neuropathique et nociceptive. À faire systématiquement devant toute douleur chronique. Si ≥ 4/10, la probabilité de neuropathie est > 80%. Les traitements de première intention sont : gabapentine, prégabaline, amitriptyline, duloxétine. Éviter les AINS et opioïdes faibles peu efficaces sur la douleur neuropathique. L'Allodynie (item 10) est un signe très spécifique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Bouhassira D et al. Comparison of pain syndromes associated with nervous or somatic lesions. Pain 2005',
      pmid: '15885844',
    },
    {
      type: 'pubmed',
      title: 'Bouhassira D et al. Development and validation of the Neuropathic Pain Symptom Inventory. Pain 2004',
      pmid: '15363887',
    },
  ],
}

export default neurodn4
