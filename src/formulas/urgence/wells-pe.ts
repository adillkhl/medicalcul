import type { FormulaDefinition } from '../types'

const wells: FormulaDefinition = {
  id: 'wells-pe',
  slug: 'wells-pe',
  name: 'Wells (Embolie Pulmonaire)',
  specialty: 'urgence',
  category: 'Cardiologie',
  description: 'Probabilité clinique d\'embolie pulmonaire — score de Wells (version simplifiée)',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'A',
  inputs: [
    { id: 'tvp', type: 'boolean', label: 'Signes cliniques de TVP (œdème, douleur jambe)', weight: 3 },
    { id: 'diagnostic', type: 'boolean', label: 'Autre diagnostic moins probable qu\'une EP', weight: 3 },
    { id: 'freq', type: 'boolean', label: 'Fréquence cardiaque &gt; 100/min', weight: 1.5 },
    { id: 'immobilisation', type: 'boolean', label: 'Immobilisation / chirurgie &lt; 4 semaines', weight: 1.5 },
    { id: 'tvp_pe', type: 'boolean', label: 'Antécédent de TVP ou EP', weight: 1.5 },
    { id: 'hemoptysie', type: 'boolean', label: 'Hémoptysie', weight: 1 },
    { id: 'cancer', type: 'boolean', label: 'Cancer actif (traitement en cours, palliatif ou diagnostiqué &lt; 6 mois)', weight: 1 },
  ],
  calculate: (values) => {
    let score = 0
    if (values.tvp) score += 3
    if (values.diagnostic) score += 3
    if (values.freq) score += 1.5
    if (values.immobilisation) score += 1.5
    if (values.tvp_pe) score += 1.5
    if (values.hemoptysie) score += 1
    if (values.cancer) score += 1

    const isHigh = score > 4
    return {
      value: score,
      label: isHigh ? 'Probabilité élevée' : 'Probabilité faible',
      severity: isHigh ? 'high' : 'low',
      ranges: [
        {
          min: 0, max: 4, label: 'Probabilité clinique faible (Wells ≤ 4)',
          severity: 'low',
          recommendation: 'Envisager dosage des D-dimères. Si D-dimères normaux, EP exclue. Si élevés, angioscanner thoracique.',
        },
        {
          min: 4.5, max: 12.5, label: 'Probabilité clinique élevée (Wells &gt; 4)',
          severity: 'high',
          recommendation: 'Angioscanner thoracique en première intention (ou scintillation V/Q si CI). D-dimères non nécessaires.',
        },
      ],
    }
  },
  interpretation: `Le score de Wells (version simplifiée à 7 items) est le score de probabilité clinique d’embolie pulmonaire le plus utilisé.

• **Probabilité faible (≤ 4)** : EP peu probable → D-dimères
• **Probabilité élevée (&gt; 4)** : EP probable → angioscanner thoracique direct

En pré-test, il s’utilise avec les D-dimères pour éviter les examens irradiants inutiles. Attention : le Wells "original" (2 catégories) et le Wells "3 catégories" existent. Cette version est la plus répandue aux urgences.`,
  clinicalCommentary: `Règle d'or : ne pas demander de D-dimères si la probabilité est élevée (faux négatifs si Wells > 4, on fait l’angioscanner directement). Chez la femme enceinte, utiliser le score de Wells + D-dimères adaptés à l'âge gestationnel. Chez le sujet âgé, les D-dimères sont presque toujours élevés → spécificité médiocre → préférer l'angioscanner. Ne pas oublier d'évaluer aussi le risque hémorragique avant anticoagulation.`,
  references: [
    {
      type: 'pubmed',
      title: 'Derivation of a simple clinical model to categorize patients probability of pulmonary embolism',
      pmid: '9809736',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines for the diagnosis and management of pulmonary embolism 2019',
      url: 'https://doi.org/10.1093/eurheartj/ehz405',
    },
  ],
}

export default wells
