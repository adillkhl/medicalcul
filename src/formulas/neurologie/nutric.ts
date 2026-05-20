import type { FormulaDefinition } from '../types'

const nutric: FormulaDefinition = {
  id: 'nutric',
  slug: 'nutric',
  name: 'NUTRIC (Score) — NUtritIonal Risk in Critically ill',
  specialty: 'neurologie',
  category: 'Nutrition',
  description: 'Score de risque nutritionnel en réanimation, permettant d\'identifier les patients bénéficiant le plus d\'une nutrition agressive (score 1–10)',
  version: '2024',
  lastValidated: '2024-02',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 2, label: '≥ 70 ans' },
        { value: 0, label: '< 70 ans' },
      ],
    },
    {
      id: 'apache',
      type: 'radio',
      label: 'Score APACHE II',
      options: [
        { value: 2, label: '≥ 28' },
        { value: 0, label: '< 28' },
      ],
    },
    {
      id: 'sofa',
      type: 'radio',
      label: 'Score SOFA',
      options: [
        { value: 2, label: '≥ 6' },
        { value: 0, label: '< 6' },
      ],
    },
    {
      id: 'comorbidites',
      type: 'radio',
      label: 'Nombre de comorbidités',
      options: [
        { value: 1, label: '≥ 2 comorbidités' },
        { value: 0, label: '< 2 comorbidités' },
      ],
    },
    {
      id: 'jai',
      type: 'radio',
      label: 'Jours d\'hospitalisation avant la réanimation',
      options: [
        { value: 1, label: '≥ 1 jour avant admission en réanimation' },
        { value: 0, label: 'Admission directe en réanimation (0 jour)' },
      ],
    },
    {
      id: 'il6',
      type: 'radio',
      label: 'Interleukine-6 (optionnel — IL-6 non disponible = 0)',
      options: [
        { value: 1, label: 'IL-6 ≥ 400 pg/mL' },
        { value: 0, label: 'IL-6 < 400 pg/mL ou non disponible' },
      ],
    },
  ],
  calculate: (values) => {
    const items = ['age', 'apache', 'sofa', 'comorbidites', 'jai', 'il6']
    const scores = items.map(id => values[id] ?? 0)
    const total = scores.reduce((a, b) => a + b, 0)

    const highRisk = total >= 6
    const moderateRisk = total >= 4

    return {
      value: total,
      label: highRisk ? 'Score NUTRIC élevé — Dénutrition sévère' : moderateRisk ? 'Score NUTRIC modéré' : 'Score NUTRIC bas',
      severity: highRisk ? 'high' : moderateRisk ? 'moderate' : 'low',
      details: { NUTRIC_total: total, indicateur: highRisk ? 'Bénéfice nutritionnel maximal attendu' : moderateRisk ? 'Bénéfice nutritionnel modéré' : 'Faible bénéfice nutritionnel' },
      ranges: [
        { min: 1, max: 3, label: 'NUTRIC 1–3 — Risque bas', severity: 'low', recommendation: 'Faible risque nutritionnel. Nutrition entérale standard. Objectif calorique 20–25 kcal/kg/j.' },
        { min: 4, max: 5, label: 'NUTRIC 4–5 — Risque modéré', severity: 'moderate', recommendation: 'Risque nutritionnel intermédiaire. Objectif calorique 25–30 kcal/kg/j. Support nutritionnel précoce (< 48h).' },
        { min: 6, max: 10, label: 'NUTRIC 6–10 — Risque élevé', severity: 'high', recommendation: 'Dénutrition sévère. Nutrition précoce agressive (< 24h). Objectif calorique 25–30 kcal/kg/j avec supplémentation protéique (1,5–2 g/kg/j). Le bénéfice de la nutrition est maximal dans ce groupe.' },
      ],
    }
  },
  interpretation: `Le **score NUTRIC** (NUtritIonal Risk in Critically ill) est un score de risque nutritionnel spécifique à la réanimation, développé pour identifier les patients qui bénéficieront le plus d’une nutrition agressive précoce.

**6 items :**
- Âge ≥ 70 ans : 2 pts
- APACHE II ≥ 28 : 2 pts
- SOFA ≥ 6 : 2 pts
- ≥ 2 comorbidités : 1 pt
- ≥ 1 jour avant admission réa : 1 pt
- IL-6 ≥ 400 pg/mL : 1 pt

**Score : 1–10** (sans IL-6 : 1–9). Un score ≥ 6 indique un haut risque nutritionnel. Le NUTRIC est prédictif de la mortalité en réanimation et de la réponse à la nutrition agressive.`,
  clinicalCommentary: `Le NUTRIC est utile en réanimation neurologique (AVC grave, traumatisme crânien, état de mal épileptique) où la dénutrition est fréquente. Les patients avec NUTRIC élevé bénéficient le plus de la nutrition précoce (entérale ou parentérale). Attention : ne pas utiliser le NUTRIC seul pour décider de la nutrition — le jugement clinique prime. Le NUTRIC ne remplace pas les évaluations nutritionnelles classiques (NRS-2002, MNA) qui ne sont pas validées en réanimation.`,
  references: [
    {
      type: 'pubmed',
      title: 'Heyland DK et al. Identifying critically ill patients who benefit the most from nutrition therapy: the development and initial validation of a novel risk assessment tool. Crit Care 2011',
      pmid: '21996253',
    },
    {
      type: 'pubmed',
      title: 'Rahman A et al. Identifying critically-ill patients who will benefit most from nutritional therapy: Further validation of the "modified NUTRIC" nutritional risk assessment tool. Clin Nutr 2016',
      pmid: '25886718',
    },
  ],
}

export default nutric
