import type { FormulaDefinition } from '../types'

const deficitfer: FormulaDefinition = {
  id: 'deficitfer', slug: 'deficitfer',
  name: 'Déficit en fer — Calcul des besoins en fer (Ganzoni)',
  specialty: 'medecine_interne', category: 'Hématologie',
  description: 'Calcul du déficit en fer total (mg) selon la formule de Ganzoni pour déterminer les besoins en fer intraveineux. Basé sur le poids, le taux d\'hémoglobine et les réserves en fer (ferritine).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'poids', type: 'number', label: 'Poids', unit: 'kg', min: 20, max: 250, step: 1, placeholder: 'Ex: 70' },
    { id: 'hb', type: 'number', label: 'Hémoglobine actuelle', unit: 'g/dL', min: 3, max: 18, step: 0.1, placeholder: 'Ex: 9.5' },
    { id: 'hb_cible', type: 'number', label: 'Hémoglobine cible', unit: 'g/dL', min: 8, max: 18, step: 0.1, placeholder: 'Ex: 13' },
    { id: 'ferritine', type: 'number', label: 'Ferritine', unit: 'µg/L (ng/mL)', min: 0, max: 2000, step: 1, placeholder: 'Ex: 30' },
    { id: 'coefficient_saturation', type: 'number', label: 'Coefficient de saturation de la transferrine (CST)', unit: '%', min: 0, max: 100, step: 1, placeholder: 'Ex: 15' },
  ],
  calculate: (values) => {
    const poids = Number(values.poids) || 70
    const hb = Number(values.hb) || 12
    const hbCible = Number(values.hb_cible) || 14
    const ferritine = Number(values.ferritine) || 0
    const cst = Number(values.coefficient_saturation) || 0

    // Ganzoni formula: Déficit en fer (mg) = Poids (kg) × (Hb cible - Hb réelle) × 2.4 + Réserves en fer
    // Réserves en fer = 500 mg si poids ≥ 35 kg (sinon 15 mg/kg)
    const reserves = poids >= 35 ? 500 : poids * 15
    const deficit = (poids * (hbCible - hb) * 2.4) + reserves
    const deficitRound = Math.round(deficit)

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (deficitRound <= 0) {
      label = 'Pas de déficit en fer significatif'
      severity = 'low'
      recommendation = 'Absence de déficit martial. Vérifier autres causes d\'anémie.'
    } else if (deficitRound <= 500) {
      label = `Déficit en fer estimé : ${deficitRound} mg — Faible`
      severity = 'low'
      recommendation = 'Supplémentation martiale orale possible (fer ferreux 80-200 mg/j).'
    } else if (deficitRound <= 1000) {
      label = `Déficit en fer estimé : ${deficitRound} mg — Modéré`
      severity = 'moderate'
      recommendation = 'Fer IV (ex: fer carboxymaltose) ou fortes doses orales selon tolérance.'
    } else if (deficitRound <= 1500) {
      label = `Déficit en fer estimé : ${deficitRound} mg — Élevé`
      severity = 'high'
      recommendation = 'Fer IV recommandé. Vérifier ferritine et CST pour confirmer la carence martiale.'
    } else {
      label = `Déficit en fer estimé : ${deficitRound} mg — Sévère`
      severity = 'high'
      recommendation = 'Fer IV en dose fractionnée. Bilan étiologique approfondi (pertes digestives, gynécologiques).'
    }

    return {
      value: deficitRound,
      label,
      severity,
      details: {
        'Réserves en fer': `${reserves} mg`,
        'Déficit lié à l\'anémie': `${Math.round(poids * (hbCible - hb) * 2.4)} mg`,
        'Ferritine': `${ferritine} µg/L`,
        'CST': `${cst} %`,
      },
      ranges: [
        { min: -Infinity, max: 0, label: 'Pas de déficit', severity: 'low', recommendation: 'Vérifier autre cause d\'anémie.' },
        { min: 1, max: 500, label: 'Déficit faible (1-500 mg)', severity: 'low', recommendation: 'Fer oral.' },
        { min: 501, max: 1000, label: 'Déficit modéré (500-1000 mg)', severity: 'moderate', recommendation: 'Fer IV ou fortes doses orales.' },
        { min: 1001, max: 1500, label: 'Déficit élevé (1000-1500 mg)', severity: 'high', recommendation: 'Fer IV recommandé.' },
        { min: 1501, max: 5000, label: 'Déficit sévère (> 1500 mg)', severity: 'high', recommendation: 'Fer IV + bilan étiologique.' },
      ],
    }
  },
  interpretation: `**Formule de Ganzoni :**
Déficit en fer total (mg) = Poids (kg) × (Hb cible − Hb réelle) × 2,4 + Réserves en fer

- Réserves en fer : 500 mg si poids ≥ 35 kg, sinon 15 mg/kg
- Hb cible : généralement 13-15 g/dL (selon sexe et contexte)

**Seuils de carence martiale :**
- Ferritine < 30 µg/L : carence absolue
- Ferritine 30-100 µg/L + CST < 20 % : carence fonctionnelle possible
- CST < 16 % : carence en fer (OMS)

**Fer IV disponible :**
- Fer carboxymaltose : max 1000 mg/semaine
- Fer sucrose : max 200 mg/séance
- Fer isomaltoside 1000 : dose totale en une perfusion`,
  clinicalCommentary: 'La formule de Ganzoni est une estimation des besoins en fer. En pratique, le fer IV est dosé selon les recommandations du fabricant. La ferritine est un marqueur de l\'inflammation : en contexte inflammatoire, un seuil > 100 µg/L peut être nécessaire pour affirmer l\'absence de carence. Le CST est plus fiable en contexte inflammatoire car moins influencé par la CRP.',
  references: [
    { type: 'pubmed', title: 'Ganzoni AM. Intravenous iron-dextran: therapeutic and experimental possibilities. Schweiz Med Wochenschr 1970', pmid: '4915103' },
    { type: 'guideline', title: 'HAS — Carence martiale et anémie ferriprive', url: 'https://www.has-sante.fr/' },
  ],
}
export default deficitfer
