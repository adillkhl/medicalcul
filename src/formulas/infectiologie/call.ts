import type { FormulaDefinition } from '../types'

const call: FormulaDefinition = {
  id: 'call',
  slug: 'call',
  name: 'CALL (Score)',
  specialty: 'infectiologie',
  category: 'COVID-19',
  description: 'Score CALL (Comorbidity, Age, Lymphocyte, Lactate dehydrogenase) pour prédire le risque d évolution sévère du COVID-19.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 0, label: '< 60 ans' },
        { value: 2, label: '≥ 60 ans' },
      ],
    },
    {
      id: 'comorbidite',
      type: 'radio',
      label: 'Comorbidité (HTA, diabète, cardiopathie, hépatopathie, néphropathie)',
      options: [
        { value: 0, label: 'Aucune' },
        { value: 1, label: '1 comorbidité' },
        { value: 2, label: '≥ 2 comorbidités' },
      ],
    },
    {
      id: 'lymphocytes',
      type: 'radio',
      label: 'Lymphocytes (× 10⁹/L)',
      options: [
        { value: 0, label: '≥ 1.0' },
        { value: 1, label: '< 1.0' },
      ],
    },
    {
      id: 'ldh',
      type: 'radio',
      label: 'LDH (U/L)',
      options: [
        { value: 0, label: '< 250' },
        { value: 1, label: '250-500' },
        { value: 2, label: '> 500' },
      ],
    },
  ],
  calculate: (values) => {
    const age = parseInt(values.age) || 0
    const com = parseInt(values.comorbidite) || 0
    const lympho = parseInt(values.lymphocytes) || 0
    const ldh = parseInt(values.ldh) || 0
    const total = age + com + lympho + ldh

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (total <= 2) severity = 'low'
    else if (total <= 4) severity = 'moderate'
    else severity = 'critical'

    return {
      value: total,
      label: `Score CALL : ${total}/7`,
      severity,
      risk: total <= 2 ? 5 : total <= 4 ? 20 : 60,
      riskUnit: '% risque d évolution sévère (ICU ou décès)',
      ranges: [
        { min: 0, max: 2, label: 'Risque faible (0-2)', severity: 'low', recommendation: 'Surveillance ambulatoire. Pas d hospitalisation systématique. Pas de traitement spécifique. Réévaluer si aggravation clinique.' },
        { min: 3, max: 4, label: 'Risque modéré (3-4)', severity: 'moderate', recommendation: 'Hospitalisation en service de médecine. Surveillance SpO₂, CRP, D-dimères. Oxygénothérapie si SpO₂ < 94 %. Discuter anticoagulation préventive.' },
        { min: 5, max: 7, label: 'Risque élevé (5-7)', severity: 'critical', recommendation: 'Hospitalisation en unité de soins intensifs. Oxygénothérapie haut débit ou VNI si besoin. Corticoïdes (dexaméthasone 6 mg/j). Anticoagulation curative. Tocilizumab si tempête cytokinique. Discuter transfert en réanimation.' },
      ],
    }
  },
  interpretation: `Le **score CALL** a été développé en Chine pour prédire l évolution sévère du COVID-19 (définie par admission en réanimation, ventilation invasive ou décès).

**4 paramètres :**
- **C**omorbidité (0-2)
- **A**ge ≥ 60 ans (0-2)
- **L**ymphocytes < 1.0 × 10⁹/L (0-1)
- **L**actate dehydrogenase > 250 U/L (0-2)

**Seuils :**
- 0-2 : faible risque (5 %)
- 3-4 : risque modéré (20 %)
- 5-7 : risque élevé (60 %)`,
  clinicalCommentary: `Le score CALL a été validé sur une cohorte de 208 patients chinois. Il est simple d utilisation mais n a pas été largement validé en population européenne. Les scores de gravité COVID-19 plus récents (4C Mortality Score, ISARIC) sont plus robustes. Attention : le score CALL date du début de la pandémie (2020) et son utilité a diminué avec l évolution des variants et la vaccination. Il reste intéressant pour un dépistage simple du risque.`,
  references: [
    {
      type: 'pubmed',
      title: 'Ji D et al. Prediction for progression risk in patients with COVID-19. J Hepatol 2020',
      pmid: '32224352',
    },
    {
      type: 'guideline',
      title: 'HAS — Prise en charge du COVID-19 en ambulatoire (2023)',
      url: 'https://www.has-sante.fr',
    },
  ],
}
export default call
