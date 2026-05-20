import type { FormulaDefinition } from '../types'

const perc: FormulaDefinition = {
  id: 'perc',
  slug: 'perc',
  name: 'PERC Rule',
  specialty: 'urgence',
  category: 'Cardiologie',
  description: 'Règle de décision clinique pour exclure une embolie pulmonaire sans D-dimères (patients à faible probabilité)',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'age_50', type: 'boolean', label: 'Âge &gt; 50 ans', weight: 1 },
    { id: 'freq', type: 'boolean', label: 'Fréquence cardiaque &gt; 100/min', weight: 1 },
    { id: 'saturation', type: 'boolean', label: 'SpO₂ &lt; 95 %', weight: 1 },
    { id: 'tvp', type: 'boolean', label: 'Signes cliniques de TVP', weight: 1 },
    { id: 'hemoptysie', type: 'boolean', label: 'Hémoptysie', weight: 1 },
    { id: 'chirurgie', type: 'boolean', label: 'Chirurgie ou traumatisme récent (&lt; 4 semaines)', weight: 1 },
    { id: 'anticoagulants', type: 'boolean', label: 'Traitement anticoagulant en cours', weight: 1 },
    { id: 'estrogenes', type: 'boolean', label: 'Œstrogènes (contraception, THS)', weight: 1 },
  ],
  calculate: (values) => {
    let score = 0
    if (values.age_50) score += 1
    if (values.freq) score += 1
    if (values.saturation) score += 1
    if (values.tvp) score += 1
    if (values.hemoptysie) score += 1
    if (values.chirurgie) score += 1
    if (values.anticoagulants) score += 1
    if (values.estrogenes) score += 1

    const isNeg = score === 0

    return {
      value: score,
      label: isNeg ? 'PERC négatif' : 'PERC positif',
      severity: isNeg ? 'low' : 'moderate',
      ranges: [
        {
          min: 0, max: 0, label: 'PERC négatif',
          severity: 'low',
          recommendation: 'EP exclue cliniquement. Pas de D-dimères ni d\'imagerie nécessaires.',
        },
        {
          min: 1, max: 8, label: 'PERC positif',
          severity: 'moderate',
          recommendation: 'Ne permet pas d\'exclure l\'EP. Réévaluer avec le score de Wells, D-dimères ou imagerie.',
        },
      ],
    }
  },
  interpretation: `La règle PERC (Pulmonary Embolism Rule-out Criteria) permet d’exclure une EP sans dosage des D-dimères chez les patients à faible probabilité clinique (Wells ≤ 4).

**Si tous les critères PERC sont négatifs (score = 0)** : EP exclue, risque de faux négatif &lt; 2 %. Aucun examen complémentaire nécessaire.

**Si un critère PERC est positif (score ≥ 1)** : ne peut pas exclure l’EP → réaliser un dosage des D-dimères.

La PERC rule ne s’applique QU'aux patients avec une probabilité clinique faible (Wells ≤ 4). Ne pas utiliser si Wells > 4.`,
  clinicalCommentary: `Excellent outil pour les urgences : évite des D-dimères inutiles chez ~20 % des patients suspects d’EP. Gain de temps et d'argent. Mais piège fréquent : l’utiliser chez des patients à probabilité clinique élevée — c'est formellement contre-indiqué (taux de faux négatifs &gt; 5 %). Toujours évaluer le Wells en premier.`,
  references: [
    {
      type: 'pubmed',
      title: 'Pulmonary embolism rule-out criteria (PERC) in emergency department patients',
      pmid: '18405656',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines for the diagnosis and management of pulmonary embolism 2019',
      url: 'https://doi.org/10.1093/eurheartj/ehz405',
    },
  ],
}

export default perc
