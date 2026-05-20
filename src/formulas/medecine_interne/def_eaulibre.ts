import type { FormulaDefinition } from '../types'

const defEaulibre: FormulaDefinition = {
  id: 'def_eaulibre',
  slug: 'def_eaulibre',
  name: 'Déficit en eau libre — Hypernatrémie',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Calcul du déficit en eau libre en cas d\'hypernatrémie pour guider la réhydratation.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'sexe',
      type: 'radio',
      label: 'Sexe du patient',
      options: [
        { value: 0.6, label: 'Homme' },
        { value: 0.5, label: 'Femme' },
      ],
    },
    {
      id: 'poids',
      type: 'number',
      label: 'Poids (kg)',
      min: 20,
      max: 250,
      step: 0.5,
      placeholder: '70',
    },
    {
      id: 'na_actuel',
      type: 'number',
      label: 'Natrémie actuelle (mmol/L)',
      min: 145,
      max: 200,
      step: 0.1,
      placeholder: '155',
    },
  ],
  calculate: (values) => {
    const coeff = values.sexe ?? 0.6
    const poids = values.poids ?? 70
    const na = values.na_actuel ?? 155
    const eauTotale = poids * coeff
    const deficit = eauTotale * (1 - 140 / na)
    const deficitRound = Math.round(deficit * 10) / 10

    if (deficit > 5) {
      return {
        value: deficitRound,
        label: `Déficit en eau libre estimé : ${deficitRound} L — Déficit sévère`,
        severity: 'high',
        ranges: [
          { min: 0, max: 2, label: 'Déficit léger (< 2 L)', severity: 'low' },
          { min: 2, max: 5, label: 'Déficit modéré (2–5 L)', severity: 'moderate' },
          { min: 5, max: 999, label: 'Déficit sévère (> 5 L)', severity: 'high' },
        ],
      }
    }
    if (deficit > 2) {
      return {
        value: deficitRound,
        label: `Déficit en eau libre estimé : ${deficitRound} L — Déficit modéré`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 2, label: 'Déficit léger (< 2 L)', severity: 'low' },
          { min: 2, max: 5, label: 'Déficit modéré (2–5 L)', severity: 'moderate' },
          { min: 5, max: 999, label: 'Déficit sévère (> 5 L)', severity: 'high' },
        ],
      }
    }
    return {
      value: deficitRound,
      label: `Déficit en eau libre estimé : ${deficitRound} L — Déficit léger`,
      severity: 'low',
      ranges: [
        { min: 0, max: 2, label: 'Déficit léger (< 2 L)', severity: 'low' },
        { min: 2, max: 5, label: 'Déficit modéré (2–5 L)', severity: 'moderate' },
        { min: 5, max: 999, label: 'Déficit sévère (> 5 L)', severity: 'high' },
      ],
    }
  },
  interpretation: `**Formule :** Déficit en eau libre (L) = Eau corporelle totale × (1 − 140 / Na_actuel)

- Eau corporelle totale = Poids × 0,6 (homme) ou 0,5 (femme)
- Correction par eau libre (VO, eau stérile IV, ou soluté hypotonique)

**Correction recommandée :** réduire la natrémie de 0,5 mmol/L/h maximum (ne pas dépasser 8–10 mmol/L en 24 h).`,
  clinicalCommentary: `Ne pas corriger trop rapidement l'hypernatrémie (risque d'œdème cérébral). La moitié du déficit est corrigée sur 24 h, le reste sur 48–72 h. Surveiller la natrémie toutes les 4–6 h initialement.`,
  references: [
    {
      type: 'pubmed',
      title: 'Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med 2000',
      pmid: '10742017',
    },
    {
      type: 'guideline',
      title: 'SNFMI — Prise en charge des hypernatrémies',
      url: 'https://www.snfmi.org',
    },
  ],
}

export default defEaulibre
