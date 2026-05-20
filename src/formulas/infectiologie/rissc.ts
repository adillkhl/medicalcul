import type { FormulaDefinition } from '../types'

const rissc: FormulaDefinition = {
  id: 'rissc',
  slug: 'rissc',
  name: 'RISSC (Score)',
  specialty: 'infectiologie',
  category: 'Sepsis',
  description: 'Score RISSC (Risk of Infection in Severe Sepsis in ICU) pour prédire l aggravation du sepsis en réanimation.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'age',
      type: 'boolean',
      label: 'Age ≥ 60 ans',
      weight: 1,
    },
    {
      id: 'diabete',
      type: 'boolean',
      label: 'Diabète',
      weight: 1,
    },
    {
      id: 'hemopathie',
      type: 'boolean',
      label: 'Hémopathie maligne / cancer solide métastatique',
      weight: 2,
    },
    {
      id: 'ventilation',
      type: 'boolean',
      label: 'Ventilation mécanique > 48h',
      weight: 1,
    },
    {
      id: 'catheter',
      type: 'boolean',
      label: 'Cathéter central > 48h',
      weight: 1,
    },
    {
      id: 'antibio_pre',
      type: 'boolean',
      label: 'Antibiothérapie préalable (dans les 7 jours avant sepsis)',
      weight: 1,
    },
    {
      id: 'corticoides',
      type: 'boolean',
      label: 'Corticothérapie systémique (équivalent prednisone > 10 mg/j > 14 jours)',
      weight: 1,
    },
  ],
  calculate: (values) => {
    const score =
      (values.age ? 1 : 0) +
      (values.diabete ? 1 : 0) +
      (values.hemopathie ? 2 : 0) +
      (values.ventilation ? 1 : 0) +
      (values.catheter ? 1 : 0) +
      (values.antibio_pre ? 1 : 0) +
      (values.corticoides ? 1 : 0)

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (score <= 1) severity = 'low'
    else if (score <= 3) severity = 'moderate'
    else severity = 'critical'

    return {
      value: score,
      label: `Score RISSC : ${score}/8`,
      severity,
      ranges: [
        { min: 0, max: 1, label: 'Risque faible', severity: 'low', recommendation: 'Surveillance standard. Pas de modification thérapeutique particulière.' },
        { min: 2, max: 3, label: 'Risque modéré', severity: 'moderate', recommendation: 'Surveillance rapprochée. Prophylaxie anti-infectieuse adaptée. Discuter décontamination digestive sélective. Lavage des mains rigoureux. Optimiser les soins de cathéter.' },
        { min: 4, max: 8, label: 'Risque élevé', severity: 'critical', recommendation: 'Mesures de prévention renforcées. Limiter les dispositifs invasifs. Antibioprophylaxie sélective. Surveillance microbiologique régulière (écrans). Discussion avec l équipe d hygiène et d infectiologie. Réduction de la corticothérapie si possible.' },
      ],
    }
  },
  interpretation: `Le **score RISSC** évalue le risque d infection nosocomiale secondaire chez les patients admis en réanimation pour sepsis sévère.

**7 facteurs de risque pondérés :**
- Âge ≥ 60 ans (1)
- Diabète (1)
- Hémopathie/cancer métastatique (2)
- Ventilation mécanique > 48h (1)
- Cathéter central > 48h (1)
- Antibiothérapie préalable (1)
- Corticothérapie (1)

Plus le score est élevé, plus le risque de surinfection est important, justifiant des mesures de prévention renforcées.`,
  clinicalCommentary: `Le RISSC est un score simple d utilisation en réanimation. Les patients septiques graves ont un risque élevé d infections nosocomiales (pneumonies acquises sous ventilation, infections urinaires sur sonde, bactériémies sur cathéter). La prévention repose sur les mesures de base : hygiène des mains, soins de cathéter, lever précoce, limitation de la sédation. Le score aide à identifier les patients nécessitant une vigilance accrue.`,
  references: [
    {
      type: 'pubmed',
      title: 'Vincent JL et al. Risk factors for infection in ICU patients. Curr Opin Crit Care 2006',
      pmid: '16843781',
    },
    {
      type: 'guideline',
      title: 'SFAR/SRLF — Prévention des infections nosocomiales en réanimation (Recommandations 2020)',
      url: 'https://www.srlf.org',
    },
  ],
}
export default rissc
