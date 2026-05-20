import type { FormulaDefinition } from '../types'

const stopbang: FormulaDefinition = {
  id: 'stop-bang',
  slug: 'stop-bang',
  name: 'STOP-BANG — Apnée du sommeil (SAHOS)',
  specialty: 'orl',
  category: 'Apnée du sommeil',
  description: 'Dépistage du syndrome d\'apnées-hypopnées obstructives du sommeil (SAHOS) — 8 items',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    { id: 'snore', type: 'boolean', label: 'S — Ronflement fort (gênant les autres)' },
    { id: 'tired', type: 'boolean', label: 'T — Fatigue/somnolence diurne' },
    { id: 'observed', type: 'boolean', label: 'O — Apnées observées par l\'entourage' },
    { id: 'pressure', type: 'boolean', label: 'P — Pression artérielle élevée (HTA)' },
    { id: 'bmi', type: 'number', label: 'B — Indice de masse corporelle (IMC)', unit: 'kg/m²', min: 10, max: 60, step: 0.1, placeholder: 'Ex: 28' },
    { id: 'age', type: 'number', label: 'A — Âge', unit: 'ans', min: 18, max: 120, step: 1, placeholder: 'Ex: 55' },
    { id: 'neck', type: 'number', label: 'N — Tour de cou', unit: 'cm', min: 20, max: 70, step: 0.5, placeholder: 'Ex: 42' },
    { id: 'gender', type: 'radio', label: 'G — Sexe masculin', options: [{ value: 1, label: 'Homme' }, { value: 0, label: 'Femme' }] },
  ],
  calculate: (values) => {
    let score = 0
    if (values.snore) score++
    if (values.tired) score++
    if (values.observed) score++
    if (values.pressure) score++
    if (values.bmi && values.bmi > 35) score++
    if (values.age && values.age > 50) score++
    if (values.neck && values.neck > 40) score++
    if (values.gender === 1) score++

    const highRisk = score >= 5
    const moderateRisk = score >= 3 && score <= 4

    if (highRisk) {
      return {
        value: score,
        label: `Score ${score} — Risque ÉLEVÉ de SAHOS`,
        risk: score >= 7 ? 93 : score >= 5 ? 81 : 60,
        riskUnit: '% probabilité SAHOS modéré-sévère',
        severity: 'high',
        ranges: [
          { min: 0, max: 2, label: 'Score 0-2 — FAIBLE RISQUE', severity: 'low', recommendation: 'Pas de dépistage systématique. Si symptômes persistants : réévaluer à 6-12 mois.' },
          { min: 3, max: 4, label: 'Score 3-4 — RISQUE INTERMÉDIAIRE', severity: 'moderate', recommendation: 'Polygraphie ventilatoire (PV) ou polysomnographie (PSG). Consultation spécialisée ORL/médecine du sommeil.' },
          { min: 5, max: 8, label: 'Score ≥ 5 — RISQUE ÉLEVÉ', severity: 'high', recommendation: 'Bilan polysomnographique urgent. Consultation spécialisée sommeil. Risque cardiovasculaire associé (HTA, FA, AVC). Traitement si IAH ≥ 15 (PPC, orthèse d\'avancée mandibulaire, ou chirurgie ORL).' },
        ],
      }
    }

    if (moderateRisk) {
      return {
        value: score,
        label: `Score ${score} — Risque INTERMÉDIAIRE`,
        risk: 50,
        riskUnit: '% probabilité SAHOS',
        severity: 'moderate',
        ranges: [
          { min: 0, max: 2, label: 'Score 0-2 — FAIBLE', severity: 'low' },
          { min: 3, max: 4, label: 'Score 3-4 — INTERMÉDIAIRE', severity: 'moderate', recommendation: 'Polygraphie ventilatoire (PV) ou polysomnographie (PSG). Consultation spécialisée ORL/médecine du sommeil.' },
          { min: 5, max: 8, label: 'Score ≥ 5 — ÉLEVÉ', severity: 'high' },
        ],
      }
    }

    return {
      value: score,
      label: `Score ${score} — Faible risque de SAHOS`,
      risk: 13,
      riskUnit: '% probabilité SAHOS',
      severity: 'low',
      ranges: [
        { min: 0, max: 2, label: 'Score 0-2 — FAIBLE', severity: 'low', recommendation: 'Pas de dépistage systématique.' },
        { min: 3, max: 4, label: 'Score 3-4 — INTERMÉDIAIRE', severity: 'moderate' },
        { min: 5, max: 8, label: 'Score ≥ 5 — ÉLEVÉ', severity: 'high' },
      ],
    }
  },
  interpretation: `Le **STOP-BANG** est le score de dépistage du SAHOS le plus utilisé en ORL et anesthésie.

**8 items (1 point chacun) :**
- **S** — Snoring (ronflement fort)
- **T** — Tiredness (fatigue diurne)
- **O** — Observed apnea (apnées constatées)
- **P** — Pressure (HTA)
- **B** — BMI > 35
- **A** — Age > 50 ans
- **N** — Neck circumference > 40 cm
- **G** — Gender (homme)

**Seuils :**
- 0-2 : faible risque
- 3-4 : risque intermédiaire (PV recommandée)
- 5-8 : risque élevé (PSG, prise en charge)

Sensibilité de 93% pour score ≥ 5 en SAHOS modéré-sévère.`,
  clinicalCommentary: `Le STOP-BANG est systématique en consultation d'ORL devant une suspicion d'apnée du sommeil. Il est aussi utilisé en pré-anesthésie. Le tour de cou > 40 cm est un critère très sensible. Si le score ≥ 5, IAH modéré-sévère probable (VPP 81-93%). Le bilan ORL recherche des causes obstructives (hypertrophie amygdalienne, rétrognathie, obstruction nasale). Les options thérapeutiques : PPC (gold standard), orthèse d'avancée mandibulaire (OAM), chirurgie (UPPP, DOME, hypoglossal nerve stimulation).`,
  references: [
    {
      type: 'pubmed',
      title: 'Chung F et al. STOP-Bang questionnaire: a practical tool for OSA screening. Anesthesiology 2008',
      pmid: '18936531',
    },
    {
      type: 'guideline',
      title: 'HAS — SAHOS : stratégie diagnostique et thérapeutique (2022)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default stopbang
