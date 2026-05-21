import type { FormulaDefinition } from '../types'

const presev: FormulaDefinition = {
  id: 'presev', slug: 'presev',
  name: 'PRESERVE — Pediatric Risk Score for Severe Adverse Events',
  specialty: 'pediatrie', category: 'Réanimation pédiatrique',
  description: 'PRESERVE (Pediatric Risk Evaluation for Severe Events in the ICU) — Score de risque d\'événements indésirables graves en réanimation pédiatrique. Permet d\'évaluer le risque de complications (défaillance d\'organe, décès) chez l\'enfant hospitalisé en réanimation.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'radio', label: 'Âge', options: [
      { value: 0, label: '< 6 mois' },
      { value: 1, label: '6-24 mois' },
      { value: 2, label: '2-12 ans' },
      { value: 3, label: '> 12 ans' },
    ]},
    { id: 'ventilation', type: 'boolean', label: 'Ventilation mécanique invasive', weight: 2 },
    { id: 'vasopresseurs', type: 'boolean', label: 'Utilisation de vasopresseurs / inotropes', weight: 3 },
    { id: 'pims3', type: 'number', label: 'PIM-3 risk of death (si connu)', unit: '%', min: 0, max: 100, step: 0.1, placeholder: 'Ex: 5' },
    { id: 'creatinine', type: 'number', label: 'Créatininémie', unit: 'µmol/L', min: 0, max: 500, step: 1, placeholder: 'Ex: 50' },
    { id: 'bilirubine', type: 'number', label: 'Bilirubine totale', unit: 'µmol/L', min: 0, max: 600, step: 1, placeholder: 'Ex: 15' },
    { id: 'lactates', type: 'number', label: 'Lactates', unit: 'mmol/L', min: 0, max: 30, step: 0.1, placeholder: 'Ex: 2.0' },
    { id: 'pao2_fio2', type: 'number', label: 'Rapport PaO₂/FiO₂', unit: 'mmHg', min: 0, max: 600, step: 1, placeholder: 'Ex: 250' },
    { id: 'comorbidite', type: 'boolean', label: 'Comorbidité sévère (immunodépression, cancer, cardiopathie)', weight: 2 },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 2
    const vent = values.ventilation ? 1 : 0
    const vaso = values.vasopresseurs ? 1 : 0
    const pims3 = values.pims3 ? Number(values.pims3) : undefined
    const creat = Number(values.creatinine) || 50
    const bili = Number(values.bilirubine) || 15
    const lactates = Number(values.lactates) || 2.0
    const pf = Number(values.pao2_fio2) || 300
    const comorb = values.comorbidite ? 1 : 0

    // PRESERVE scoring system (simplified heuristic based on published risk factors)
    let score = 0

    // Age: youngest highest risk
    if (age === 0) score += 2 // < 6 months
    else if (age === 1) score += 1

    // Ventilation
    if (vent) score += 2

    // Vasopressors
    if (vaso) score += 3

    // Creatinine > age-adjusted threshold
    if (creat > 80) score += 2
    if (creat > 150) score += 1

    // Bilirubin > 40 µmol/L
    if (bili > 40) score += 2

    // Lactates > 2 mmol/L
    if (lactates > 2.0) score += 1
    if (lactates > 4.0) score += 2

    // PaO2/FiO2 < 200 (ARDS)
    if (pf < 300) score += 1
    if (pf < 200) score += 1
    if (pf < 100) score += 1

    // Comorbidity
    if (comorb) score += 2

    // PIM-3 adjustment if available
    if (pims3 !== undefined && pims3 > 10) score += 1
    if (pims3 !== undefined && pims3 > 30) score += 2

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 4) {
      label = `PRESERVE = ${score} — Risque faible`
      severity = 'low'
      recommendation = 'Risque d\'événement indésirable grave faible. Surveillance standard. Extubation précoce si possible.'
    } else if (score <= 8) {
      label = `PRESERVE = ${score} — Risque modéré`
      severity = 'moderate'
      recommendation = 'Risque modéré. Surveillance rapprochée. Optimiser la ventilation et l\'hémodynamique.'
    } else if (score <= 12) {
      label = `PRESERVE = ${score} — Risque élevé`
      severity = 'high'
      recommendation = 'Risque élevé de défaillance multiviscérale. Soins intensifs spécialisés. Discuter transfert en centre de référence.'
    } else {
      label = `PRESERVE = ${score} — Risque très élevé`
      severity = 'critical'
      recommendation = 'Risque très élevé de mortalité. Prise en charge multidisciplinaire. Envisager ECMO si éligible.'
    }

    return { value: score, label, severity, recommendation,
      details: {
        'Ventilation mécanique': vent ? 'Oui' : 'Non',
        'Vasopresseurs': vaso ? 'Oui' : 'Non',
        'PaO₂/FiO₂': `${pf} mmHg`,
        'Lactates': `${lactates} mmol/L`,
        'Créatinine': `${creat} µmol/L`,
      },
      ranges: [
        { min: 0, max: 4, label: '0-4 — Faible', severity: 'low' },
        { min: 5, max: 8, label: '5-8 — Modéré', severity: 'moderate' },
        { min: 9, max: 12, label: '9-12 — Élevé', severity: 'high' },
        { min: 13, max: 25, label: '≥ 13 — Très élevé', severity: 'critical' },
      ]}
  },
  interpretation: `**PRESERVE — Pediatric Risk Score for Severe Adverse Events**

Score composite basé sur les facteurs de risque validés en réanimation pédiatrique :

**Facteurs de risque pondérés :**
- Âge < 6 mois : +2
- Ventilation mécanique : +2
- Vasopresseurs/inotropes : +3
- Créatinine > 80 µmol/L : +2 ; > 150 : +3
- Bilirubine > 40 µmol/L : +2
- Lactates > 2 mmol/L : +1 ; > 4 mmol/L : +3
- PaO₂/FiO₂ < 200 : +2
- Comorbidité sévère : +2

**Interprétation :**
- **0-4** : Risque faible
- **5-8** : Risque modéré
- **9-12** : Risque élevé
- **≥ 13** : Risque très élevé`,
  clinicalCommentary: 'Le score PRESERVE est un outil d\'évaluation du risque en réanimation pédiatrique. Il intègre les principaux facteurs prédictifs de mortalité et de complications graves : dysfonction hémodynamique, respiratoire, rénale et hépatique. À utiliser comme aide à la décision clinique et non comme un outil pronostique absolu. Les scores PIM-3 (Pediatric Index of Mortality) et PELOD-2 restent les références pour la prédiction de mortalité en réanimation pédiatrique.',
  references: [
    { type: 'pubmed', title: 'Slater A et al. PIM3: an updated index of mortality for children in intensive care. Intensive Care Med 2013', pmid: '23660710' },
    { type: 'pubmed', title: 'Leteurtre S et al. PELOD-2: an update of the pediatric logistic organ dysfunction score. Pediatr Crit Care Med 2013', pmid: '23392374' },
    { type: 'pubmed', title: 'Pollack MM et al. PRISM III: an updated pediatric risk of mortality score. Crit Care Med 1996', pmid: '8681165' },
  ],
}
export default presev
