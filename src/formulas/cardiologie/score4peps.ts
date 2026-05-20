import type { FormulaDefinition } from '../types'

const score4peps: FormulaDefinition = {
  id: 'score-4peps',
  slug: 'score4peps',
  name: '4PEPS — Probabilité embolie pulmonaire',
  specialty: 'cardiologie',
  category: 'Embolie pulmonaire',
  description: 'Score prédictif de probabilité d\'embolie pulmonaire aux urgences — 4 items',
  version: '2022',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 110, step: 1, placeholder: 'Ex: 65' },
    { id: 'surgery', type: 'boolean', label: 'Chirurgie ou fracture < 4 semaines' },
    { id: 'previous_vte', type: 'boolean', label: 'Antécédent de TVP ou EP' },
    { id: 'dyspnea', type: 'boolean', label: 'Dyspnée aiguë d\'apparition brutale' },
    { id: 'hemoptysis', type: 'boolean', label: 'Hémoptysie' },
    { id: 'tachycardia', type: 'boolean', label: 'Tachycardie > 100/min' },
    { id: 'clinical_signs', type: 'boolean', label: 'Signes cliniques de TVP' },
    { id: 'alternative_dx', type: 'boolean', label: 'Diagnostic alternatif moins probable' },
  ],
  calculate: (values) => {
    let score = 0
    if (values.age && values.age >= 65) score += 2
    if (values.surgery) score += 2
    if (values.previous_vte) score += 2
    if (values.dyspnea) score += 1
    if (values.hemoptysis) score += 2
    if (values.tachycardia) score += 1
    if (values.clinical_signs) score += 3
    if (values.alternative_dx) score += 1

    return {
      value: score,
      label: score >= 6 ? 'Haut risque' : score >= 3 ? 'Risque modéré' : 'Faible risque',
      risk: score >= 6 ? 65 : score >= 3 ? 25 : 8,
      riskUnit: '% probabilité EP',
      severity: score >= 6 ? 'high' : score >= 3 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 2, label: 'Faible risque', severity: 'low', recommendation: 'Pas d\'imagerie urgente. Dosage D-Dimères. Si D-Dimères < 500 ng/mL : exclure EP.' },
        { min: 3, max: 5, label: 'Risque modéré', severity: 'moderate', recommendation: 'Dosage D-Dimères + angioscanner thoracique si positif. Considérer échographie cardiaque.' },
        { min: 6, max: 20, label: 'Haut risque', severity: 'high', recommendation: 'Angioscanner thoracique en urgence. Échocardiographie. Anticoagulation immédiate si suspicion forte. Avis cardiologue.' },
      ],
    }
  },
  interpretation: `Le **4PEPS** est un score clinique récent pour l’embolie pulmonaire.

**Items :** âge ≥ 65 (2), chirurgie (2), ATCD TVP/EP (2), dyspnée brutale (1), hémoptysie (2), tachycardie (1), signes TVP (3), diagnostic alternatif moins probable (1).
**Seuils :** 0-2 faible, 3-5 modéré, ≥ 6 élevé.`,
  clinicalCommentary: `Le 4PEPS a été publié en 2022. Il surpasse le score de Genève et le Wells PE en sensibilité. Utilisez-le aux urgences devant toute suspicion d’EP. N\'oubliez pas de demander les D-Dimères pour les scores faibles et modérés. L\'angioscanner thoracique est l’examen de référence.`,
  references: [
    { type: 'pubmed', title: 'Roy PM et al. J Am Coll Cardiol 2022', pmid: '35618346' },
  ],
}
export default score4peps