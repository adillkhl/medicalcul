import type { FormulaDefinition } from '../types'

const defSodium: FormulaDefinition = {
  id: 'def_sodium',
  slug: 'def_sodium',
  name: 'Déficit en sodium — Hyponatrémie',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Calcul du déficit en sodium pour guider la correction d\'une hyponatrémie.',
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
      min: 100,
      max: 135,
      step: 0.1,
      placeholder: '125',
    },
    {
      id: 'na_cible',
      type: 'number',
      label: 'Natrémie cible (mmol/L) — ne pas dépasser 130–135',
      min: 120,
      max: 140,
      step: 0.1,
      placeholder: '130',
    },
  ],
  calculate: (values) => {
    const coeff = values.sexe ?? 0.6
    const poids = values.poids ?? 70
    const na = values.na_actuel ?? 125
    const naCible = values.na_cible ?? 130
    const eauTotale = poids * coeff
    const deficit = (naCible - na) * eauTotale
    const deficitRound = Math.round(deficit * 10) / 10

    return {
      value: deficitRound,
      label: `Déficit en sodium estimé : ${deficitRound} mmol`,
      severity: deficitRound > 500 ? 'high' : deficitRound > 200 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 200, label: 'Déficit léger (< 200 mmol)', severity: 'low' },
        { min: 200, max: 500, label: 'Déficit modéré (200–500 mmol)', severity: 'moderate' },
        { min: 500, max: 9999, label: 'Déficit sévère (> 500 mmol)', severity: 'high' },
      ],
    }
  },
  interpretation: `**Formule :** Déficit en sodium (mmol) = (Na_cible − Na_actuel) × Eau corporelle totale

- Eau corporelle totale = Poids × 0,6 (homme) ou 0,5 (femme)
- Na_cible recommandée : 130 mmol/L (ne pas dépasser 135 pour éviter surcorrection)

**Règle de sécurité :** Correction maximale de 8–10 mmol/L en 24 h. Utiliser la formule d\'Adrogué pour déterminer le soluté et le débit.`,
  clinicalCommentary: `L\'hyponatrémie est la première anomalie ionique en médecine interne. Distinguer hypotonique (vraie) vs hypertonique (hyperglycémie) vs isotonique (pseudohyponatrémie). La correction en NaCl 3% (513 mmol/L) est réservée aux formes sévères symptomatiques.`,
  references: [
    {
      type: 'pubmed',
      title: 'Adrogué HJ, Madias NE. Hyponatremia. N Engl J Med 2000',
      pmid: '10742016',
    },
    {
      type: 'pubmed',
      title: 'Spasovski G et al. Clinical practice guideline on diagnosis and treatment of hyponatraemia. Eur J Endocrinol 2014',
      pmid: '24569128',
    },
  ],
}

export default defSodium
