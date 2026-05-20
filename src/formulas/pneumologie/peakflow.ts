import type { FormulaDefinition } from '../types'

const peakflow: FormulaDefinition = {
  id: 'peakflow',
  slug: 'peakflow',
  name: 'Débit Expiratoire de Pointe (Peak-Flow) — Valeurs théoriques adultes',
  specialty: 'pneumologie',
  category: 'Exploration Fonctionnelle',
  description: 'Calcul du débit expiratoire de pointe (DEP) théorique chez l\'adulte selon l\'âge, la taille et le sexe',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'sexe',
      type: 'radio',
      label: 'Sexe',
      options: [
        { value: 0, label: 'Femme' },
        { value: 1, label: 'Homme' },
      ],
    },
    {
      id: 'taille',
      type: 'number',
      label: 'Taille',
      unit: 'cm',
      min: 130,
      max: 220,
      step: 1,
      placeholder: 'Ex: 175',
    },
    {
      id: 'age',
      type: 'number',
      label: 'Âge',
      unit: 'ans',
      min: 18,
      max: 90,
      step: 1,
      placeholder: 'Ex: 45',
    },
  ],
  calculate: (values) => {
    const sexe = values.sexe ?? 0
    const taille = values.taille ?? 170
    const age = values.age ?? 40

    // European formula: DEP (L/min)
    // Homme: (3.94 * taille) - (1.84 * age) - 262.5
    // Femme: (3.09 * taille) - (1.59 * age) - 59.5
    let predicted: number
    if (sexe === 1) {
      predicted = (3.94 * taille) - (1.84 * age) - 262.5
    } else {
      predicted = (3.09 * taille) - (1.59 * age) - 59.5
    }

    predicted = Math.round(predicted)
    const minPredicted = Math.round(predicted * 0.8)
    const lowerLimit = Math.round(predicted * 0.6)

    return {
      value: predicted,
      label: `DEP théorique: ${predicted} L/min`,
      severity: 'low' as const,
      details: { DEP_théorique: `${predicted} L/min`, limite_basse_80: `${minPredicted} L/min`, limite_basse_60: `${lowerLimit} L/min` },
      ranges: [
        { min: Math.round(predicted * 0.8), max: predicted, label: 'DEP normal (≥ 80% de la théorique)', severity: 'low', recommendation: 'Fonction ventilatoire normale. Poursuite de la surveillance selon pathologie.' },
        { min: Math.round(predicted * 0.6), max: Math.round(predicted * 0.8) - 1, label: 'DEP modérément diminué (60–79%)', severity: 'moderate', recommendation: 'Obstruction des voies aériennes modérée. Réévaluation clinique et EFR. Ajustement thérapeutique si asthme ou BPCO.' },
        { min: 0, max: Math.round(predicted * 0.6) - 1, label: 'DEP sévèrement diminué (< 60%)', severity: 'high', recommendation: 'Obstruction sévère. Urgence pneumologique. Optimisation du traitement. Hospitalisation à discuter selon contexte.' },
      ],
    }
  },
  interpretation: `Le **Débit Expiratoire de Pointe (DEP)** ou Peak-Flow est la mesure du débit maximal expiré lors d’une expiration forcée après une inspiration maximale. Il reflète le calibre des voies aériennes proximales.

**Valeurs théoriques adultes (formules européennes) :**
- **Homme** : DEP (L/min) = (3,94 × T) − (1,84 × A) − 262,5
- **Femme** : DEP (L/min) = (3,09 × T) − (1,59 × A) − 59,5

Où T = taille en cm, A = âge en années.

**Interprétation :**
- ≥ 80% de la théorique : normal
- 60–79% : diminution modérée
- < 60% : diminution sévère

Le DEP est utile pour le suivi de l’asthme (variabilité diurne > 20% = mauvais contrôle).`,
  clinicalCommentary: `Le DEP est un outil simple et reproductible pour le suivi de l\'asthme. Il ne remplace pas les EFR complètes (VEMS, CVF). En pratique, chaque patient a sa propre « meilleure valeur » personnelle qui peut différer de la théorique. La variabilité diurne (matin vs soir) > 20% est un signe de mauvais contrôle de l\'asthme. Le DEP est aussi utile en médecine du travail pour le dépistage des asthmes professionnels. Attention : le DEP dépend de l’effort du patient (ne pas utiliser chez les patients confus ou fatigués).`,
  references: [
    {
      type: 'pubmed',
      title: 'Nunn AJ, Gregg I. New regression equations for predicting peak expiratory flow in adults. BMJ 1989',
      pmid: '2545286',
    },
    {
      type: 'guideline',
      title: 'GINA 2024 — Peak Flow monitoring in asthma management',
      url: 'https://ginasthma.org',
    },
  ],
}

export default peakflow
