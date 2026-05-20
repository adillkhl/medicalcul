import type { FormulaDefinition } from '../types'

const ccsangina: FormulaDefinition = {
  id: 'ccs-angina',
  slug: 'ccsangina',
  name: 'CCS — Classification angine de poitrine',
  specialty: 'cardiologie',
  category: 'Angor',
  description: 'Classification Canadian Cardiovascular Society de la sévérité de l\'angine de poitrine',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'activity', type: 'radio', label: 'Activité déclenchant l\'angor', options: [
      { value: 1, label: 'Angor pour un effort intense et prolongé (sport, monter 2 étages)' },
      { value: 2, label: 'Angor pour un effort modéré (marcher vite, monter 1 étage, après repas/froid/émotion)' },
      { value: 3, label: 'Angor pour un effort léger (marcher 100-200 m à plat, 1 étage lentement)' },
      { value: 4, label: 'Angor au repos ou au moindre effort (impossibilité de toute activité)' },
    ]},
  ],
  calculate: (values) => {
    const grade = values.activity ?? 1
    const labels = {1: 'Classe I — Angor d\'effort intense', 2: 'Classe II — Angor d\'effort modéré', 3: 'Classe III — Angor d\'effort léger', 4: 'Classe IV — Angor de repos'}
    return {
      value: grade,
      label: labels[grade as keyof typeof labels] || '',
      severity: grade >= 3 ? 'high' : grade >= 2 ? 'moderate' : 'low',
      ranges: [
        { min: 1, max: 1, label: 'Classe I', severity: 'low', recommendation: 'Pas de limitation pour l\'activité habituelle. Traitement médical optimal. Surveillance.' },
        { min: 2, max: 2, label: 'Classe II', severity: 'moderate', recommendation: 'Légère limitation. Traitement anti-angineux (β-bloquant, ivabradine, nitrés). Bilan de revascularisation si persistant.' },
        { min: 3, max: 3, label: 'Classe III', severity: 'high', recommendation: 'Limitation marquée. Bilan de revascularisation en urgence relative (coronarographie). Traitement médical intensif.' },
        { min: 4, max: 4, label: 'Classe IV', severity: 'critical', recommendation: 'Angor de repos — URGENCE. Syndrome coronarien aigu probable. Hospitalisation. Coronarographie en urgence.' },
      ],
    }
  },
  interpretation: `La **classification CCS** gradue l’angine de poitrine en 4 classes.

- **Classe I** : angor pour un effort intense
- **Classe II** : angor pour un effort modéré
- **Classe III** : angor pour un effort léger
- **Classe IV** : angor de repos

Utilisée en routine pour suivre l\'évolution clinique et décider de la revascularisation.`,
  clinicalCommentary: `La classification CCS est utilisée quotidiennement en cardiologie. Associer à la fraction d\'éjection (FEVG) et à la coronarographie. Une aggravation rapide (passage II→III en quelques semaines) doit faire rechercher une instabilité de plaque.`,
  references: [{ type: 'pubmed', title: 'Campeau L. Circulation 1976', pmid: '1253310' }],
}
export default ccsangina