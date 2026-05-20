import type { FormulaDefinition } from '../types'

const crb65: FormulaDefinition = {
  id: 'crb-65',
  slug: 'crb-65',
  name: 'CRB-65',
  specialty: 'urgence',
  category: 'Pneumologie',
  description: 'Score prédictif de mortalité dans les pneumonies acquises en communauté (version simplifiée CURB-65)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    { id: 'confusion', type: 'boolean', label: 'Confusion mentale (nouvelle)', weight: 1 },
    { id: 'respiratoire', type: 'boolean', label: 'Fréquence respiratoire ≥ 30/min', weight: 1 },
    { id: 'pression', type: 'boolean', label: 'PAS &lt; 90 mmHg ou PAD ≤ 60 mmHg', weight: 1 },
    { id: 'age_65', type: 'boolean', label: 'Âge ≥ 65 ans', weight: 1 },
  ],
  calculate: (values) => {
    let score = 0
    if (values.confusion) score += 1
    if (values.respiratoire) score += 1
    if (values.pression) score += 1
    if (values.age_65) score += 1

    return {
      value: score,
      severity: score <= 1 ? 'low' : score === 2 ? 'moderate' : 'high',
      ranges: [
        {
          min: 0, max: 1, label: 'Risque faible',
          severity: 'low',
          recommendation: 'Probablement pas d\'indication hospitalière. Traitement ambulatoire possible.',
        },
        {
          min: 2, max: 2, label: 'Risque intermédiaire',
          severity: 'moderate',
          recommendation: 'Hospitalisation à discuter (court séjour, soins intensifs selon contexte).',
        },
        {
          min: 3, max: 4, label: 'Risque élevé',
          severity: 'high',
          recommendation: 'Hospitalisation urgente. Évaluer admission en soins intensifs.',
        },
      ],
    }
  },
  interpretation: `Le CRB-65 est la version simplifiée du CURB-65, sans dosage de l’urée sanguine. Il permet d\'évaluer la mortalité à 30 jours chez un patient avec pneumonie acquise en communauté (PAC) et d’orienter la décision d\'hospitalisation.

• **Score 0–1** : mortalité ≤ 1,5 % → ambulatoire
• **Score 2** : mortalité ≈ 9,2 % → hospitalisation (court séjour)
• **Score 3–4** : mortalité ≈ 22 % → hospitalisation urgente (réanimation)

Ce score ne remplace pas le jugement clinique. À interpréter selon le terrain (immunodépression, comorbidités sévères).`,
  clinicalCommentary: `Très pratique aux urgences car ne nécessite pas de bilan biologique. Utiliser avec prudence chez le sujet âgé (le seuil des 65 ans est bas, beaucoup de patients ≥ 65 ans sont classés CRB-65 = 1 sans critère de gravité). Si la biologie est disponible, préférer le CURB-65 complet (urée > 7 mmol/L = 1 point).`,
  references: [
    {
      type: 'guideline',
      title: 'SPILF — Prise en charge des pneumonies aiguës communautaires — 2023',
      url: 'https://www.infectiologie.com/fr/prise-en-charge-des-pneumonies-aigues-communautaires_de.html',
    },
    {
      type: 'pubmed',
      title: 'CRB-65 for the assessment of pneumonia severity',
      pmid: '18171682',
    },
  ],
}

export default crb65
