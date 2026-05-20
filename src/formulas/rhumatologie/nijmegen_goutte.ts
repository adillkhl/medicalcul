import type { FormulaDefinition } from '../types'

const nijmegenGoutte: FormulaDefinition = {
  id: 'nijmegen_goutte',
  slug: 'nijmegen_goutte',
  name: 'Nijmegën — Score diagnostique de la goutte',
  specialty: 'rhumatologie',
  category: 'Goutte',
  description: 'Score clinique de Nijmegën pour le diagnostic de la crise de goutte aiguë.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'sexe',
      type: 'radio',
      label: 'Sexe du patient',
      options: [
        { value: 2, label: 'Homme' },
        { value: 0, label: 'Femme' },
      ],
    },
    {
      id: 'uricemie_max',
      type: 'radio',
      label: 'Uricémie maximale antérieure (mmol/L)',
      options: [
        { value: 3.5, label: '> 0.60 mmol/L (> 10 mg/dL)' },
        { value: 3, label: '0.54–0.60 mmol/L (9–10 mg/dL)' },
        { value: 2, label: '0.42–0.53 mmol/L (7–8.9 mg/dL)' },
        { value: 0, label: '< 0.42 mmol/L (< 7 mg/dL)' },
      ],
    },
    {
      id: 'evolutif',
      type: 'boolean',
      label: 'Crise évolutive depuis moins de 24h',
    },
    {
      id: 'rougeur',
      type: 'boolean',
      label: 'Rougeur articulaire lors de la crise',
    },
    {
      id: 'premier_mtp',
      type: 'boolean',
      label: 'Atteinte de la première articulation métatarso-phalangienne',
    },
    {
      id: 'hta',
      type: 'radio',
      label: 'Antécédent cardiovasculaire ou HTA',
      options: [
        { value: 1.5, label: 'Oui (HTA, coronaropathie, AVC)' },
        { value: 0, label: 'Non' },
      ],
    },
  ],
  calculate: (values) => {
    let score = 0
    score += values.sexe ?? 0
    score += values.uricemie_max ?? 0
    if (values.evolutif) score += 0.5
    if (values.rougeur) score += 1
    if (values.premier_mtp) score += 0.5
    score += values.hta ?? 0

    const scoreRound = Math.round(score * 10) / 10

    if (scoreRound >= 8) {
      return {
        value: scoreRound,
        label: `Score de Nijmegën = ${scoreRound} — Goutte très probable`,
        severity: 'high',
        ranges: [
          { min: 8, max: 99, label: '≥ 8 : Goutte très probable (spécificité > 95%)', severity: 'high' },
          { min: 4, max: 7, label: '4–7.5 : Goutte probable', severity: 'moderate' },
          { min: 0, max: 3.5, label: '0–3.5 : Goutte peu probable', severity: 'low' },
        ],
      }
    }
    if (scoreRound >= 4) {
      return {
        value: scoreRound,
        label: `Score de Nijmegën = ${scoreRound} — Goutte probable`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 3.5, label: '0–3.5 : Peu probable', severity: 'low' },
          { min: 4, max: 7, label: '4–7.5 : Probable', severity: 'moderate' },
          { min: 8, max: 99, label: '≥ 8 : Très probable', severity: 'high' },
        ],
      }
    }
    return {
      value: scoreRound,
      label: `Score de Nijmegën = ${scoreRound} — Goutte peu probable`,
      severity: 'low',
      ranges: [
        { min: 0, max: 3.5, label: '0–3.5 : Peu probable', severity: 'low' },
        { min: 4, max: 7, label: '4–7.5 : Probable', severity: 'moderate' },
        { min: 8, max: 99, label: '≥ 8 : Très probable', severity: 'high' },
      ],
    }
  },
  interpretation: `**Score clinique de Nijmegën** pour la goutte :

| Item | Points |
|---|---|
| Sexe masculin | 2 |
| Uricémie > 0,42 mmol/L | 2 |
| Uricémie > 0,53 mmol/L | 3 |
| Crise < 24h | 0,5 |
| Rougeur articulaire | 1 |
| Atteinte 1ère MTP | 0,5 |
| HTA ou ATCD cardiovasculaire | 1,5 |

| Score | Probabilité |
|---|---|
| < 4 | Goutte peu probable |
| 4–7,5 | Goutte probable |
| ≥ 8 | Goutte très probable (spécificité > 95%) |

**Confirmation :** Ponction articulaire et cristallisation d'urate monosodique (gold standard).`,
  clinicalCommentary: `Le score de Nijmegën est utile en première ligne pour orienter le diagnostic de goutte. En cas de score ≥ 8, la spécificité est excellente (> 95%). Rappel : la confirmation par ponction est recommandée avant un traitement au long cours par hypo-uricémiant.`,
  references: [
    {
      type: 'pubmed',
      title: 'Janssens HJ et al. A diagnostic rule for acute gouty arthritis in primary care. BMJ 2010',
      pmid: '20511643',
    },
    {
      type: 'pubmed',
      title: 'Kienhorst LB et al. Validation of a clinical rule for the diagnosis of acute gout. Rheumatology 2016',
      pmid: '26888820',
    },
  ],
}

export default nijmegenGoutte
