import type { FormulaDefinition } from '../types'

const mgap: FormulaDefinition = {
  id: 'mgap', slug: 'mgap',
  name: 'MNA® — Mini Nutritional Assessment (MGAP / Short Form)',
  specialty: 'nutrition', category: 'Dépistage',
  description: 'Mini Nutritional Assessment (MNA®) — version courte MGAP (Mini Geriatric Assessment of Protein-energy). Dépistage du risque de dénutrition chez la personne âgée (≥ 65 ans). 4 items : IMC, perte de poids, apports alimentaires, état de santé.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'imc', type: 'radio', label: 'IMC', options: [
      { value: 0, label: 'IMC < 19 kg/m²' },
      { value: 1, label: '19 ≤ IMC < 21 kg/m²' },
      { value: 2, label: '21 ≤ IMC < 23 kg/m²' },
      { value: 3, label: 'IMC ≥ 23 kg/m²' },
    ]},
    { id: 'perte_poids', type: 'radio', label: 'Perte de poids récente', options: [
      { value: 0, label: 'Perte > 3 kg (en 3 mois)' },
      { value: 1, label: 'Perte entre 1 et 3 kg' },
      { value: 2, label: 'Perte entre 0.5 et 1 kg' },
      { value: 3, label: 'Pas de perte de poids' },
    ]},
    { id: 'apports', type: 'radio', label: 'Apports alimentaires (3 derniers mois)', options: [
      { value: 0, label: 'Baisse sévère des apports' },
      { value: 1, label: 'Baisse modérée des apports' },
      { value: 2, label: 'Pas de baisse des apports' },
    ]},
    { id: 'maladie', type: 'radio', label: 'État de santé / Stress métabolique', options: [
      { value: 0, label: 'Maladie aiguë ou stress majeur (réanimation, cancer, chirurgie majeure)' },
      { value: 1, label: 'Maladie chronique ou stress modéré (IRM, BPCO, diabète, infection)' },
      { value: 2, label: 'Pas de maladie / Bon état général' },
    ]},
  ],
  calculate: (values) => {
    const imc = Number(values.imc) ?? 3
    const perte = Number(values.perte_poids) ?? 3
    const apports = Number(values.apports) ?? 2
    const maladie = Number(values.maladie) ?? 2

    const total = imc + perte + apports + maladie

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (total >= 10) {
      label = `MGAP = ${total}/11 — État nutritionnel satisfaisant`
      severity = 'low'
      recommendation = 'Pas de risque nutritionnel. Pas d\'intervention nécessaire.'
    } else if (total >= 7) {
      label = `MGAP = ${total}/11 — Risque nutritionnel modéré`
      severity = 'moderate'
      recommendation = 'Risque de dénutrition. Surveillance nutritionnelle. Conseil diététique. À compléter par un MNA complet si nécessaire.'
    } else {
      label = `MGAP = ${total}/11 — Dénutrition avérée`
      severity = 'high'
      recommendation = 'Dénutrition. Consultation diététique. Supplémentation nutritionnelle orale. Bilan étiologique. Réaliser un MNA complet.'
    }

    return { value: total, label, severity, recommendation,
      details: {
        'Score IMC': `${imc}/3`,
        'Score perte de poids': `${perte}/3`,
        'Score apports': `${apports}/2`,
        'Score maladie': `${maladie}/2`,
      },
      ranges: [
        { min: 10, max: 11, label: '≥ 10 — État nutritionnel satisfaisant', severity: 'low', recommendation: 'Pas d\'intervention.' },
        { min: 7, max: 9, label: '7-9 — Risque de dénutrition', severity: 'moderate', recommendation: 'Surveillance + conseil diététique.' },
        { min: 0, max: 6, label: '≤ 6 — Dénutrition', severity: 'high', recommendation: 'Intervention nutritionnelle.' },
      ]}
  },
  interpretation: `**MNA® — Mini Nutritional Assessment (version courte MGAP)**

Le MGAP est un outil de dépistage de la dénutrition chez la personne âgée. Il comporte 4 items :

1. **IMC** (0-3 points) : < 19 → 0, 19-21 → 1, 21-23 → 2, ≥ 23 → 3
2. **Perte de poids** (0-3 points) : > 3 kg → 0, 1-3 kg → 1, 0.5-1 kg → 2, pas de perte → 3
3. **Apports alimentaires** (0-2 points) : baisse sévère → 0, modérée → 1, normale → 2
4. **Stress métabolique** (0-2 points) : aigu → 0, chronique → 1, absent → 2

**Score total /11 :**
- **≥ 10** : Satisfaisant
- **7-9** : Risque de dénutrition
- **≤ 6** : Dénutrition

Si MGAP ≤ 9, compléter par le MNA complet (18 items).`,
  clinicalCommentary: 'Le MNA (Mini Nutritional Assessment) est l\'outil de référence pour le dépistage nutritionnel chez la personne âgée. La version courte (MGAP) est validée pour le dépistage. Si le MGAP est ≤ 9, un MNA complet doit être réalisé. Le MNA complet inclut des items sur l\'autonomie, la polymédication, l\'état neuropsychologique et l\'examen clinique (plis cutanés, périmètre brachial).',
  references: [
    { type: 'pubmed', title: 'Guigoz Y et al. The Mini Nutritional Assessment (MNA) review of the literature. J Nutr Health Aging 2006', pmid: '16902899' },
    { type: 'pubmed', title: 'Rubenstein LZ et al. Screening for undernutrition in geriatric practice: developing the short-form mini-nutritional assessment. J Gerontol 2001', pmid: '11256821' },
    { type: 'url', title: 'MNA® Official Website', url: 'https://www.mna-elderly.com/' },
  ],
}
export default mgap
