import type { FormulaDefinition } from '../types'

const packyear: FormulaDefinition = {
  id: 'packyear',
  slug: 'packyear',
  name: 'Paquets-années, tabac (calcul)',
  specialty: 'toxicologie',
  category: 'Tabac',
  description: 'Calcul du nombre de paquets-années (PA) pour quantifier l\'exposition tabagique cumulée. Indicateur clé pour l\'évaluation du risque de cancer bronchique et de BPCO.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'cig_per_day',
      type: 'number',
      label: 'Nombre de cigarettes par jour (moyenne)',
      min: 0,
      max: 100,
      step: 0.5,
    },
    {
      id: 'years_smoking',
      type: 'number',
      label: 'Nombre d\'années de tabagisme',
      min: 0,
      max: 80,
      step: 0.5,
    },
    {
      id: 'cessation_years',
      type: 'number',
      label: 'Années depuis l\'arrêt (0 si fumeur actif)',
      min: 0,
      max: 80,
      step: 0.5,
      placeholder: 'Laisser 0 si tabagisme actif',
    },
  ],
  calculate: (values) => {
    const cigPerDay = values.cig_per_day as number
    const years = values.years_smoking as number
    const cessation = values.cessation_years as number

    const packYears = (cigPerDay / 20) * years
    const roundedPA = Math.round(packYears * 10) / 10

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (packYears === 0) {
      label = 'Exposition tabagique nulle'
      severity = 'low'
      recommendation = 'Aucun dépistage spécifique lié au tabac nécessaire.'
    } else if (packYears < 10) {
      label = `Exposition tabagique faible : ${roundedPA} PA`
      severity = 'low'
      recommendation = 'Informer sur les risques. Encourager l\'arrêt. Dépistage BPCO non systématique.'
    } else if (packYears < 20) {
      label = `Exposition tabagique modérée : ${roundedPA} PA`
      severity = 'moderate'
      recommendation = 'Sevrage tabagique fortement conseillé. Dépistage BPCO (EFR) si symptômes. Suivi clinique régulier.'
    } else if (packYears < 30) {
      label = `Exposition tabagique élevée : ${roundedPA} PA`
      severity = 'high'
      recommendation = 'Dépistage cancer bronchique par scanner thoracique faible dose (ALD) : critères HAS ≥ 30 PA ou ≥ 20 PA + facteur de risque supplémentaire. EFR pour dépistage BPCO. Consultation d\'addictologie.'
    } else {
      label = `Exposition tabagique très élevée : ${roundedPA} PA`
      severity = 'critical'
      recommendation = 'Dépistage cancer bronchique par scanner faible dose annuel. EFR + gazométrie. Bilan cardiovasculaire (risque × 2-4). Sevrage intensif (substituts nicotiniques à haute dose ± varénicline).'
    }

    // Calculate risk reduction if quit
    const riskReduction = cessation > 0
      ? `Arrêt depuis ${cessation} an(s) — le risque cardiovasculaire diminue de 50% à 1 an, le risque de cancer bronchique diminue de 50% à 10 ans`
      : ''

    return {
      value: roundedPA,
      label,
      severity,
      details: {
        'Paquets-années': `${roundedPA} PA`,
        'Période d\'exposition': `${years} ans`,
        'Moyenne/jour': `${cigPerDay} cigarettes/jour`,
        'Années depuis l\'arrêt': cessation > 0 ? `${cessation} ans` : 'Tabagisme actif',
        'Réduction de risque': riskReduction || 'Arrêt du tabac : bénéfice maximal le plus tôt possible',
      },
      ranges: [
        { min: 0, max: 0, label: 'Non fumeur', severity: 'low' },
        { min: 0.1, max: 9.9, label: 'Faible (< 10 PA)', severity: 'low' },
        { min: 10, max: 19.9, label: 'Modéré (10-19 PA)', severity: 'moderate' },
        { min: 20, max: 29.9, label: 'Élevé (20-29 PA)', severity: 'high' },
        { min: 30, max: 500, label: 'Très élevé (≥ 30 PA)', severity: 'critical' },
      ],
    }
  },
  interpretation: `Le **paquet-année (PA)** est l'unité de mesure de l'exposition tabagique cumulée.

**Calcul :** PA = (Nombre de cigarettes par jour / 20) × Nombre d'années de tabagisme

**Seuils cliniques importants :**
- **Sevrage tabagique** : conseillé quel que soit le nombre de PA
- **Dépistage BPCO** : EFR si ≥ 10 PA avec symptômes respiratoires
- **Dépistage cancer bronchique** : scanner thoracique faible dose si ≥ 30 PA (ou ≥ 20 PA si autre facteur de risque), âge 50-74 ans
- **Risque cardiovasculaire** : multiplié par 2-4 pour les fumeurs, quel que soit le PA`,
  clinicalCommentary: `Le PA est un indicateur indispensable en pneumologie, oncologie et médecine générale. Il sous-estime parfois l'exposition réelle (tabac roulé, narguilé, cannabis). Un fumeur de 30 PA et plus doit bénéficier d'un dépistage du cancer bronchique par scanner thoracique faible dose (recommandation HAS). L'arrêt du tabac avant 40 ans réduit de 90% le risque de décès lié au tabac.`,
  references: [
    {
      type: 'pubmed',
      title: 'Vineis P et al. Tobacco and cancer: recent epidemiological evidence. J Natl Cancer Inst 2004',
      pmid: '15100337',
    },
    {
      type: 'pubmed',
      title: 'HAS. Dépistage du cancer bronchique par scanner thoracique faible dose. Recommandation 2022',
      pmid: '35666000',
    },
  ],
}

export default packyear
