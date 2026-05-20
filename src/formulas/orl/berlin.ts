import type { FormulaDefinition } from '../types'

const berlin: FormulaDefinition = {
  id: 'berlin',
  slug: 'berlin',
  name: 'Berlin — Apnée du sommeil (SAHOS)',
  specialty: 'orl',
  category: 'Apnée du sommeil',
  description: 'Questionnaire de Berlin pour le dépistage du syndrome d\'apnées du sommeil — 3 catégories de risque',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'snoreFreq',
      type: 'radio',
      label: 'Catégorie 1 : Fréquence des ronflements',
      options: [
        { value: 0, label: 'Jamais / presque jamais' },
        { value: 1, label: '1-2 fois par mois' },
        { value: 2, label: '1-2 fois par semaine' },
        { value: 3, label: 'Tous les jours (≥ 3-4x/semaine)' },
      ],
    },
    {
      id: 'snoreVolume',
      type: 'radio',
      label: 'Puissance du ronflement',
      options: [
        { value: 0, label: 'À peine plus fort que la respiration' },
        { value: 1, label: 'Aussi fort que la parole' },
        { value: 2, label: 'Plus fort que la parole' },
        { value: 3, label: 'Très fort (entendu dans la pièce voisine)' },
      ],
    },
    {
      id: 'snoreFreq_3plus',
      type: 'boolean',
      label: 'Ronfle ≥ 3-4x/semaine (exclu si déjà coché ci-dessus)',
    },
    {
      id: 'apneaObserved',
      type: 'boolean',
      label: 'Catégorie 1bis : Apnées observées (≥ 3-4x/semaine)',
    },
    {
      id: 'tiredFreq',
      type: 'radio',
      label: 'Catégorie 2 : Fatigue après le sommeil',
      options: [
        { value: 0, label: 'Jamais / presque jamais' },
        { value: 1, label: '1-2 fois par mois' },
        { value: 2, label: '1-2 fois par semaine' },
        { value: 3, label: 'Tous les jours (≥ 3-4x/semaine)' },
      ],
    },
    {
      id: 'tiredDaytime',
      type: 'radio',
      label: 'Somnolence diurne (endormissement en conduisant / au travail)',
      options: [
        { value: 0, label: 'Jamais' },
        { value: 1, label: '1-2 fois par mois' },
        { value: 2, label: '1-2 fois par semaine' },
        { value: 3, label: 'Tous les jours (≥ 3-4x/semaine)' },
      ],
    },
    {
      id: 'hypertension',
      type: 'boolean',
      label: 'Catégorie 3 : Antécédent d\'hypertension artérielle (HTA)',
    },
    {
      id: 'bmi_calc',
      type: 'number',
      label: 'IMC (≥ 30 kg/m² si présent)', unit: 'kg/m²',
      placeholder: 'Ex: 32',
      min: 10, max: 60, step: 0.1,
    },
  ],
  calculate: (values) => {
    // Category 1: snoring + apnea
    let cat1 = false
    const snoreFreq = values.snoreFreq ?? 0
    const snoreVolume = values.snoreVolume ?? 0
    const snore3plus = !!values.snoreFreq_3plus || snoreFreq >= 3
    const apneaObserved = !!values.apneaObserved

    if (snore3plus) {
      // Check if snore score qualifies
      const snoreScore = snoreFreq >= 3 ? 1 : 0
      const snoreVolScore = snoreVolume >= 2 ? 1 : 0
      if (snoreScore + snoreVolScore >= 2) cat1 = true
    }
    // Alternatively, observed apneas ≥ 3-4x/week
    if (apneaObserved) cat1 = true

    // Category 2: tiredness
    let cat2 = false
    const tiredFreq = values.tiredFreq ?? 0
    const tiredDaytime = values.tiredDaytime ?? 0

    if (tiredFreq >= 3 && tiredDaytime >= 2) cat2 = true
    if (tiredDaytime >= 3 && tiredFreq >= 2) cat2 = true
    if (tiredFreq >= 3 || tiredDaytime >= 3) cat2 = true

    // Category 3: BMI > 30 OR hypertension
    const bmiHigh = values.bmi_calc && values.bmi_calc > 30
    const htn = !!values.hypertension
    const cat3 = bmiHigh || htn

    // Score positive if 2+ categories positive
    const categories = [cat1, cat2, cat3].filter(Boolean).length

    if (categories >= 2) {
      return {
        value: categories,
        label: 'Berlin POSITIF — Risque élevé de SAHOS',
        severity: 'high',
        details: {
          'Catégorie 1 (Ronflement)': cat1 ? 'Oui' : 'Non',
          'Catégorie 2 (Fatigue)': cat2 ? 'Oui' : 'Non',
          'Catégorie 3 (HTA/Obésité)': cat3 ? 'Oui' : 'Non',
        },
        ranges: [
          { min: 0, max: 1, label: 'Berlin NÉGATIF — Faible risque', severity: 'low', recommendation: 'Pas de dépistage polysomnographique systématique. Conseils hygiène du sommeil.' },
          { min: 2, max: 3, label: 'Berlin POSITIF — Risque élevé', severity: 'high', recommendation: 'Orientation vers consultation spécialisée sommeil. Polysomnographie (PSG) ou polygraphie ventilatoire (PV). Risque cardiovasculaire important (HTA, coronaropathie, AVC). Évaluation ORL des causes obstructives.' },
        ],
      }
    }

    return {
      value: categories,
      label: 'Berlin NÉGATIF — Faible risque de SAHOS',
      severity: 'low',
      details: {
        'Catégorie 1 (Ronflement)': cat1 ? 'Oui' : 'Non',
        'Catégorie 2 (Fatigue)': cat2 ? 'Oui' : 'Non',
        'Catégorie 3 (HTA/Obésité)': cat3 ? 'Oui' : 'Non',
      },
      ranges: [
        { min: 0, max: 1, label: 'Berlin NÉGATIF — Faible risque', severity: 'low', recommendation: 'Pas de dépistage polysomnographique systématique.' },
        { min: 2, max: 3, label: 'Berlin POSITIF — Risque élevé', severity: 'high' },
      ],
    }
  },
  interpretation: `Le **questionnaire de Berlin** (1996) est un outil de dépistage du SAHOS validé en population générale. Il comporte 3 catégories.

**Catégories :**
1. **Ronflement** : fréquence + puissance + apnées observées
2. **Fatigue/somnolence diurne** : fatigue au réveil + somnolence diurne
3. **Facteurs de risque** : HTA (traitée ou non) + IMC > 30

**Positif si ≥ 2 catégories actives.**
Sensibilité 86%, spécificité 77% pour SAHOS modéré-sévère (IAH > 15).`,
  clinicalCommentary: `Le questionnaire de Berlin est plus long que le STOP-BANG mais explore mieux la dimension ronflement. En ORL, on utilise souvent les deux : Berlin pour le dépistage initial, STOP-BANG pour le suivi. Attention : le Berlin sous-estime le risque chez les femmes et les sujets minces mais avec un SAHOS positionnel. Le score ne remplace pas la polygraphie ventilatoire qui reste le gold standard diagnostique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Netzer NC et al. Using the Berlin Questionnaire to identify patients with sleep apnea. Ann Intern Med 1999',
      pmid: '10390129',
    },
    {
      type: 'guideline',
      title: 'SFORL — Recommandations SAHOS (2022)',
      url: 'https://www.sforl.org',
    },
  ],
}

export default berlin
