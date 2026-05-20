import type { FormulaDefinition } from '../types'

const debitPerfusionGlucose: FormulaDefinition = {
  id: 'debit-perfusion-glucose',
  slug: 'debit-perfusion-glucose',
  name: 'Débit de Perfusion Glucosé',
  specialty: 'gastroenterologie',
  category: 'Nutrition',
  description: 'Calcul du débit de perfusion de sérum glucosé pour un apport calorique donné',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'poids',
      type: 'number',
      label: 'Poids du patient',
      unit: 'kg',
      min: 20,
      max: 250,
      step: 0.5,
      placeholder: 'Ex: 70',
    },
    {
      id: 'apport_calorique',
      type: 'number',
      label: 'Apport calorique glucidique souhaité',
      unit: 'kcal/kg/jour',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: 'Ex: 4',
    },
    {
      id: 'concentration_glucose',
      type: 'radio',
      label: 'Concentration du sérum glucosé',
      options: [
        { value: 5, label: 'G5% (5 g/100 mL)' },
        { value: 10, label: 'G10% (10 g/100 mL)' },
        { value: 30, label: 'G30% (30 g/100 mL)' },
        { value: 50, label: 'G50% (50 g/100 mL)' },
      ],
    },
  ],
  calculate: (values) => {
    const poids = Number(values.poids)
    const apport = Number(values.apport_calorique)
    const conc = Number(values.concentration_glucose) || 5

    if (!poids || !apport || poids <= 0 || apport <= 0) {
      return {
        value: 0,
        label: 'Données insuffisantes',
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner le poids et l\'apport calorique souhaité.' },
        ],
      }
    }

    // 1 g de glucose = 4 kcal
    const kcalParJour = apport * poids
    const grammesGlucoseParJour = kcalParJour / 4
    const volumeParJour = (grammesGlucoseParJour / conc) * 100 // mL
    const debit = volumeParJour / 24 // mL/h

    const debitArrondi = Math.round(debit * 10) / 10
    const volumeArrondi = Math.round(volumeParJour)

    return {
      value: debitArrondi,
      label: `Débit : ${debitArrondi} mL/h`,
      severity: 'low',
      details: {
        'Volume total/24h': `${volumeArrondi} mL`,
        'Glucose/jour': `${Math.round(grammesGlucoseParJour)} g`,
        'Calories/jour': `${Math.round(kcalParJour)} kcal`,
      },
      ranges: [
        { min: 0, max: 999, label: 'Débit calculé', severity: 'low', recommendation: 'Adapter le débit selon la tolérance glycémique. Contrôler glycémie capillaire régulièrement.' },
      ],
    }
  },
  interpretation: `Calcul du **débit de perfusion de sérum glucosé** nécessaire pour atteindre un apport calorique glucidique cible.

**Rappel** : 1 g de glucose = 4 kcal

**Formule** : 
1. Calories/jour = apport (kcal/kg/j) × poids (kg)
2. Glucose (g/j) = Calories / 4
3. Volume (mL/j) = (Glucose / concentration%) × 100
4. Débit (mL/h) = Volume / 24

Exemple : patient de 70 kg, apport 4 kcal/kg/j avec G5%
→ 280 kcal/j → 70 g/j → 1 400 mL/j → 58,3 mL/h`,
  clinicalCommentary: `Ne pas dépasser la capacité d’oxydation du glucose (4-5 mg/kg/min, soit environ 5-7 g/kg/j). Chez le patient diabétique ou en réanimation, un apport glucidique excessif peut provoquer une hyperglycémie. Préférer les solutés à 10-30% via une voie veineuse centrale si besoin calorique élevé. Surveiller glycémie toutes les 4-6h.`,
  references: [
    {
      type: 'guideline',
      title: 'SFNCM — Recommandations de nutrition artificielle en réanimation (2022)',
      url: 'https://www.sfncm.org',
    },
  ],
}

export default debitPerfusionGlucose
