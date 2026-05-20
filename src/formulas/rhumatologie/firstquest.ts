import type { FormulaDefinition } from '../types'

const firstquest: FormulaDefinition = {
  id: 'firstquest',
  slug: 'firstquest',
  name: 'FiRST — Questionnaire de dépistage de la fibromyalgie',
  specialty: 'rhumatologie',
  category: 'Fibromyalgie',
  description: 'Fibromyalgia Rapid Screening Tool — Questionnaire de dépistage rapide de la fibromyalgie.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'douleur_4membres',
      type: 'boolean',
      label: 'Depuis au moins 3 mois, vos douleurs sont-elles présentes aux 4 membres (bras et jambes) ?',
    },
    {
      id: 'douleur_ceinture',
      type: 'boolean',
      label: 'Vos douleurs sont-elles localisées à la ceinture (côtes, fesses, rachis) ?',
    },
    {
      id: 'douleur_colonne',
      type: 'boolean',
      label: 'Vos douleurs prédominent-elles au niveau du rachis cervical et/ou lombaire ?',
    },
    {
      id: 'fatigue_repas',
      type: 'boolean',
      label: 'La fatigue et/ou le réveil non reposant vous obligent-ils à arrêter vos activités (professionnelles, domestiques ou loisirs) ?',
    },
    {
      id: 'douleur_mains',
      type: 'boolean',
      label: 'Avez-vous des douleurs aux membres supérieurs (coudes, avant-bras, poignets, mains) ?',
    },
    {
      id: 'symptomes_gen',
      type: 'boolean',
      label: 'Au cours du dernier mois, avez-vous présenté des symptômes généraux (maux de tête, syndrome du côlon irritable, fatigue intense, jambes sans repos, troubles de l\'humeur, troubles du sommeil) ?',
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.douleur_4membres) score++
    if (values.douleur_ceinture) score++
    if (values.douleur_colonne) score++
    if (values.fatigue_repas) score++
    if (values.douleur_mains) score++
    if (values.symptomes_gen) score++

    if (score >= 5) {
      return {
        value: score,
        label: `FiRST = ${score}/6 — Fibromyalgie très probable`,
        severity: 'high',
        ranges: [
          { min: 5, max: 6, label: '≥ 5/6 : Fibromyalgie probable — Aiguiller vers une prise en charge spécialisée', severity: 'high' },
          { min: 0, max: 4, label: '0–4/6 : Fibromyalgie peu probable — Rechercher autre diagnostic', severity: 'low' },
        ],
      }
    }
    return {
      value: score,
      label: `FiRST = ${score}/6 — Fibromyalgie peu probable`,
      severity: 'low',
      ranges: [
        { min: 0, max: 4, label: '0–4/6 : Fibromyalgie peu probable — Rechercher autre diagnostic', severity: 'low' },
        { min: 5, max: 6, label: '≥ 5/6 : Fibromyalgie probable', severity: 'high' },
      ],
    }
  },
  interpretation: `**FiRST** (Fibromyalgia Rapid Screening Tool) — 6 questions oui/non.

- **≥ 5/6** : Fibromyalgie probable (sensibilité 90,5%, spécificité 85,7%)
- **0–4/6** : Fibromyalgie peu probable

Le FiRST est un outil de dépistage, pas de diagnostic. En cas de score ≥ 5, une évaluation rhumatologique est recommandée pour confirmer le diagnostic selon les critères ACR 2010/2016.`,
  clinicalCommentary: `Le FiRST simple et rapide (moins de 2 minutes) est utile en consultation de rhumatologie pour ne pas méconnaître une fibromyalgie devant des douleurs diffuses. Il ne remplace pas l\'évaluation clinique complète qui doit éliminer les diagnostics différentiels (PR, spondylarthrite, connectivite, hypothyroïdie).`,
  references: [
    {
      type: 'pubmed',
      title: 'Perrot S et al. Development and validation of the Fibromyalgia Rapid Screening Tool (FiRST). Pain 2010',
      pmid: '20303101',
    },
    {
      type: 'guideline',
      title: 'EULAR 2017 recommendations for the management of fibromyalgia',
      pmid: '28007795',
    },
  ],
}

export default firstquest
