import type { FormulaDefinition } from '../types'

const haq: FormulaDefinition = {
  id: 'haq',
  slug: 'haq',
  name: 'HAQ — Questionnaire d\'évaluation fonctionnelle (Health Assessment Questionnaire)',
  specialty: 'rhumatologie',
  category: 'Polyarthrite rhumatoïde',
  description: 'Health Assessment Questionnaire — Évaluation du retentissement fonctionnel dans la PR et autres rhumatismes.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'habillage',
      type: 'radio',
      label: 'S\'habiller, se laver (boutonner, nouer lacets, se laver les cheveux)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
    {
      id: 'lever',
      type: 'radio',
      label: 'Se lever (se lever d\'une chaise, se mettre au lit)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
    {
      id: 'manger',
      type: 'radio',
      label: 'Manger (couper la viande, porter un verre à la bouche)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
    {
      id: 'marche',
      type: 'radio',
      label: 'Marcher (marcher dehors, monter 5 marches)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
    {
      id: 'hygiene',
      type: 'radio',
      label: 'Hygiène (se laver, prendre un bain, aller aux toilettes)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
    {
      id: 'atteindre',
      type: 'radio',
      label: 'Atteindre (prendre un objet à 2m, attraper quelque chose au-dessus de la tête)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
    {
      id: 'prise',
      type: 'radio',
      label: 'Préhension (ouvrir une porte, tourner une clé, dévisser un bocal)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
    {
      id: 'activites',
      type: 'radio',
      label: 'Autres activités (faire les courses, monter une voiture, passer l\'aspirateur)',
      options: [
        { value: 0, label: 'Sans difficulté (0)' },
        { value: 1, label: 'Avec difficulté (1)' },
        { value: 2, label: 'Avec aide (2)' },
        { value: 3, label: 'Impossible (3)' },
      ],
    },
  ],
  calculate: (values) => {
    const items = [
      values.habillage ?? 0,
      values.lever ?? 0,
      values.manger ?? 0,
      values.marche ?? 0,
      values.hygiene ?? 0,
      values.atteindre ?? 0,
      values.prise ?? 0,
      values.activites ?? 0,
    ]
    const haqScore = items.reduce((a, b) => a + b, 0) / 8
    const haqRound = Math.round(haqScore * 100) / 100

    if (haqRound < 1) {
      return {
        value: haqRound,
        label: `HAQ = ${haqRound} — Handicap léger`,
        severity: 'low',
        ranges: [
          { min: 0, max: 1, label: '0–1 : Handicap léger', severity: 'low' },
          { min: 1, max: 2, label: '1–2 : Handicap modéré', severity: 'moderate' },
          { min: 2, max: 3, label: '≥ 2 : Handicap sévère', severity: 'high' },
        ],
      }
    }
    if (haqRound < 2) {
      return {
        value: haqRound,
        label: `HAQ = ${haqRound} — Handicap modéré`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 1, label: '0–1 : Léger', severity: 'low' },
          { min: 1, max: 2, label: '1–2 : Modéré', severity: 'moderate' },
          { min: 2, max: 3, label: '≥ 2 : Sévère', severity: 'high' },
        ],
      }
    }
    return {
      value: haqRound,
      label: `HAQ = ${haqRound} — Handicap sévère`,
      severity: 'high',
      ranges: [
        { min: 0, max: 1, label: '0–1 : Léger', severity: 'low' },
        { min: 1, max: 2, label: '1–2 : Modéré', severity: 'moderate' },
        { min: 2, max: 3, label: '≥ 2 : Sévère', severity: 'high' },
      ],
    }
  },
  interpretation: `**HAQ** (Health Assessment Questionnaire) — Score de 0 (aucun handicap) à 3 (handicap majeur).

**8 catégories :** habillage, lever, manger, marche, hygiène, atteindre, préhension, activités.

**Interprétation :**
- 0–1 : Handicap léger (autonomie conservée)
- 1–2 : Handicap modéré (gêne dans les activités)
- ≥ 2 : Handicap sévère (dépendance partielle ou totale)

**Seuil de significativité clinique :** ΔHAQ ≥ 0,22 est la différence minimale cliniquement importante (MCID).`,
  clinicalCommentary: `Le HAQ est l\'échelle fonctionnelle de référence dans la PR. Il est sensible au changement. L\'objectif thérapeutique moderne (treat-to-target) vise le HAQ < 0,5. Attention : le score dépend aussi des comorbidités (arthrose, fibromyalgie).`,
  references: [
    {
      type: 'pubmed',
      title: 'Fries JF et al. Measurement of patient outcome in arthritis. Arthritis Rheum 1980',
      pmid: '7362680',
    },
    {
      type: 'pubmed',
      title: 'Bruce B, Fries JF. The Health Assessment Questionnaire. Clin Exp Rheumatol 2005',
      pmid: '16273783',
    },
  ],
}

export default haq
