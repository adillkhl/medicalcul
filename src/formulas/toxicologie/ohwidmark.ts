import type { FormulaDefinition } from '../types'

const ohwidmark: FormulaDefinition = {
  id: 'ohwidmark',
  slug: 'ohwidmark',
  name: 'Alcoolémie (Widmark)',
  specialty: 'toxicologie',
  category: 'Alcool',
  description: 'Calcul de l\'alcoolémie (taux d\'alcool dans le sang) selon la formule de Widmark, basée sur la quantité d\'alcool consommée, le poids, le sexe et le temps écoulé.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'sex',
      type: 'radio',
      label: 'Sexe',
      options: [
        { value: 0.68, label: 'Femme' },
        { value: 0.78, label: 'Homme' },
      ],
    },
    {
      id: 'weight',
      type: 'number',
      label: 'Poids',
      unit: 'kg',
      min: 30,
      max: 250,
      step: 0.1,
    },
    {
      id: 'drinks_standard',
      type: 'number',
      label: 'Nombre de verres standard consommés',
      min: 0,
      max: 50,
      step: 0.5,
      placeholder: '1 verre = 10g d\'alcool pur',
    },
    {
      id: 'hours_elapsed',
      type: 'number',
      label: 'Temps écoulé depuis la première consommation',
      unit: 'heures',
      min: 0,
      max: 48,
      step: 0.5,
    },
  ],
  calculate: (values) => {
    const weight = values.weight as number
    const sexCoeff = values.sex as number
    const drinks = values.drinks_standard as number
    const hours = values.hours_elapsed as number

    const alcoholGrams = drinks * 10
    const widmark = alcoholGrams / (weight * sexCoeff)
    const elimination = hours * 0.15
    const bac = Math.max(0, widmark - elimination)

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'

    if (bac <= 0) {
      label = 'Alcoolémie nulle — en dessous du seuil de détection'
      severity = 'low'
    } else if (bac < 0.5) {
      label = 'Alcoolémie légale (≤ 0.5 g/L pour la conduite en France)'
      severity = 'low'
    } else if (bac < 0.8) {
      label = 'Alcoolémie supérieure à la limite légale (conduite interdite)'
      severity = 'moderate'
    } else if (bac < 2) {
      label = 'Ivresse modérée — ébriété, troubles de l\'équilibre et du jugement'
      severity = 'high'
    } else if (bac < 3) {
      label = 'Ivresse grave — risque de coma éthylique'
      severity = 'high'
    } else {
      label = 'Alcoolémie sévère — coma éthylique possible, urgence vitale'
      severity = 'critical'
    }

    return {
      value: Math.round(bac * 100) / 100,
      label,
      severity,
      risk: bac,
      riskUnit: 'g/L',
      ranges: [
        { min: 0, max: 0.49, label: 'Alcoolémie nulle ou légale', severity: 'low' },
        { min: 0.5, max: 0.79, label: 'Alcoolémie illégale (conduite)', severity: 'moderate' },
        { min: 0.8, max: 1.99, label: 'Ivresse modérée', severity: 'high' },
        { min: 2, max: 2.99, label: 'Ivresse grave', severity: 'high' },
        { min: 3, max: 10, label: 'Intoxication sévère — coma éthylique', severity: 'critical' },
      ],
    }
  },
  interpretation: `La **formule de Widmark** estime l'alcoolémie (concentration d'alcool dans le sang) : 
**Alcoolémie (g/L) = (Alcool ingéré en g) / (Poids × coefficient de diffusion) - (0,15 × heures)**

- Coefficient de diffusion : **0,68** pour la femme, **0,78** pour l'homme
- Élimination : environ **0,15 g/L par heure**
- En France, la limite légale pour la conduite est de **0,5 g/L** (0,2 g/L pour les jeunes conducteurs)

Rappel : les verres standard contiennent environ 10 g d'alcool pur (un verre de vin, une bière 25 cl, un digestif).`,
  clinicalCommentary: `La formule de Widmark donne une estimation théorique. De nombreux facteurs influencent l'alcoolémie réelle : prise alimentaire concomitante, métabolisme hépatique individuel, médicaments, etc. En pratique clinique, le dosage direct par éthylomètre ou prise de sang reste la référence. En cas de coma éthylique : surveillance en réanimation, vitamine B1 pour prévenir la neuropathie alcoolique, et recherche de traumatisme associé.`,
  references: [
    {
      type: 'pubmed',
      title: 'Widmark EMP. Die theoretischen Grundlagen und die praktische Verwendbarkeit der gerichtlich-medizinischen Alkoholbestimmung. 1932',
      pmid: '13641496',
    },
    {
      type: 'pubmed',
      title: 'Jones AW. Pharmacokinetics of ethanol — issues of forensic importance. Forensic Sci Rev 2011',
      pmid: '26231160',
    },
  ],
}

export default ohwidmark
