import type { FormulaDefinition } from '../types'

const homaIr: FormulaDefinition = {
  id: 'homa_ir',
  slug: 'homa_ir',
  name: 'HOMA-IR — Indice d\'insulinorésistance',
  specialty: 'medecine_interne',
  category: 'Diabétologie',
  description: 'Homeostatic Model Assessment of Insulin Resistance — Évaluation de l\'insulinorésistance à jeun.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'glycemie',
      type: 'number',
      label: 'Glycémie à jeun (mmol/L)',
      min: 2.0,
      max: 30,
      step: 0.1,
      placeholder: '5.5',
    },
    {
      id: 'insulinemie',
      type: 'number',
      label: 'Insulinémie à jeun (µU/mL)',
      min: 0.5,
      max: 200,
      step: 0.1,
      placeholder: '10',
    },
  ],
  calculate: (values) => {
    const glycemie = values.glycemie ?? 5.5
    const insulinemie = values.insulinemie ?? 10
    const homa = (glycemie * insulinemie) / 22.5
    const homaRound = Math.round(homa * 100) / 100

    if (homa <= 2.5) {
      return {
        value: homaRound,
        label: `HOMA-IR = ${homaRound} — Insulinorésistance normale`,
        severity: 'low',
        ranges: [
          { min: 0, max: 2.5, label: 'HOMA-IR ≤ 2.5 : Normal (pas d\'insulinorésistance)', severity: 'low' },
          { min: 2.5, max: 5, label: 'HOMA-IR 2.5–5 : Insulinorésistance modérée', severity: 'moderate' },
          { min: 5, max: 999, label: 'HOMA-IR > 5 : Insulinorésistance sévère', severity: 'high' },
        ],
      }
    }
    if (homa <= 5) {
      return {
        value: homaRound,
        label: `HOMA-IR = ${homaRound} — Insulinorésistance modérée`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 2.5, label: 'Normal', severity: 'low' },
          { min: 2.5, max: 5, label: 'Modérée', severity: 'moderate' },
          { min: 5, max: 999, label: 'Sévère', severity: 'high' },
        ],
      }
    }
    return {
      value: homaRound,
      label: `HOMA-IR = ${homaRound} — Insulinorésistance sévère`,
      severity: 'high',
      ranges: [
        { min: 0, max: 2.5, label: 'Normal', severity: 'low' },
        { min: 2.5, max: 5, label: 'Modérée', severity: 'moderate' },
        { min: 5, max: 999, label: 'Sévère', severity: 'high' },
      ],
    }
  },
  interpretation: `**HOMA-IR** = (Glycémie à jeun en mmol/L × Insulinémie à jeun en µU/mL) / 22,5

- **< 2,5** : Pas d\'insulinorésistance significative
- **2,5–5** : Insulinorésistance modérée (prédiabète, syndrome métabolique)
- **> 5** : Insulinorésistance sévère (diabète type 2, obésité sévère)

**Précautions :** Nécessite un dosage de l\'insulinémie à jeun (réalisable à NFS). L\'HOMA-IR n\'est pas validé chez le diabétique traité (insuline exogène).`,
  clinicalCommentary: `L\'HOMA-IR est utile en médecine interne pour quantifier l\'insulinorésistance dans le syndrome métabolique, le SOPK, la stéatose hépatique non alcoolique (NAFLD/MASH). Une valeur > 2,5 est généralement considérée comme pathologique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Matthews DR et al. Homeostasis model assessment: insulin resistance and beta-cell function. Diabetologia 1985',
      pmid: '3899825',
    },
    {
      type: 'pubmed',
      title: 'Wallace TM et al. Use and abuse of HOMA modeling. Diabetes Care 2004',
      pmid: '15273441',
    },
  ],
}

export default homaIr
