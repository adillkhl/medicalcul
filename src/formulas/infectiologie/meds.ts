import type { FormulaDefinition } from '../types'

const meds: FormulaDefinition = {
  id: 'meds',
  slug: 'meds',
  name: 'MEDS (Score)',
  specialty: 'infectiologie',
  category: 'Sepsis',
  description: 'Score MEDS (Mortality in Emergency Department Sepsis) pour prédire la mortalité à 28 jours des patients suspects de sepsis aux urgences.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'boolean',
      label: 'Age > 65 ans',
      weight: 3,
    },
    {
      id: 'maison_retraite',
      type: 'boolean',
      label: 'Resident en maison de retraite ou institution',
      weight: 2,
    },
    {
      id: 'comorb_terminale',
      type: 'radio',
      label: 'Maladie terminale (Mac Cabe classe 3 — esperance de vie < 1 an)',
      options: [
        { value: 0, label: 'Non' },
        { value: 6, label: 'Oui' },
      ],
    },
    {
      id: 'dyspnee',
      type: 'boolean',
      label: 'Dyspnee — frequence respiratoire > 20/min',
      weight: 2,
    },
    {
      id: 'choc',
      type: 'boolean',
      label: 'Choc septique (hypotension apres remplissage)',
      weight: 3,
    },
    {
      id: 'plaquettes',
      type: 'boolean',
      label: 'Plaquettes < 150 000/mm³',
      weight: 3,
    },
    {
      id: 'bandemie',
      type: 'boolean',
      label: 'Bandemie > 5 % (formule leucocytaire)',
      weight: 3,
    },
    {
      id: 'comorbidite',
      type: 'boolean',
      label: 'Infection des voies respiratoires basses',
      weight: 2,
    },
    {
      id: 'alteration_conscience',
      type: 'boolean',
      label: 'Alteration de la conscience',
      weight: 2,
    },
  ],
  calculate: (values) => {
    const score =
      (values.age ? 3 : 0) +
      (values.maison_retraite ? 2 : 0) +
      (parseInt(values.comorb_terminale) || 0) +
      (values.dyspnee ? 2 : 0) +
      (values.choc ? 3 : 0) +
      (values.plaquettes ? 3 : 0) +
      (values.bandemie ? 3 : 0) +
      (values.comorbidite ? 2 : 0) +
      (values.alteration_conscience ? 2 : 0)

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let mort: string
    if (score <= 5) { severity = 'low'; mort = '1 %' }
    else if (score <= 8) { severity = 'moderate'; mort = '5 %' }
    else if (score <= 12) { severity = 'high'; mort = '20 %' }
    else { severity = 'critical'; mort = '50 %' }

    return {
      value: score,
      label: `Score MEDS : ${score}/27 — Mortalite a 28 jours : ${mort}`,
      severity,
      risk: score <= 5 ? 1 : score <= 8 ? 5 : score <= 12 ? 20 : 50,
      riskUnit: '% mortalite a 28 jours',
      ranges: [
        { min: 0, max: 5, label: 'Tres bas risque (0-5)', severity: 'low', recommendation: 'Hospitalisation en medecine. Antibiothérapie empirique. Surveillance simple. Mortalite 1 %.' },
        { min: 6, max: 8, label: 'Bas risque (6-8)', severity: 'moderate', recommendation: 'Hospitalisation. Antibiothérapie IV. Monitorage. Bilan etiologique. Mortalite 5 %.' },
        { min: 9, max: 12, label: 'Risque modere (9-12)', severity: 'high', recommendation: 'Hospitalisation en soins intensifs. Antibiothérapie large spectre. Remplissage vasculaire. Lactates. Mortalite 20 %.' },
        { min: 13, max: 27, label: 'Haut risque (≥ 13)', severity: 'critical', recommendation: 'Reanimation. Antibiothérapie IV immediate. Remplissage agressif. Vasopresseurs si besoin. Controle de la porte d entree. Mortalite > 50 %.' },
      ],
    }
  },
  interpretation: `Le **score MEDS** (Mortality in Emergency Department Sepsis) est un score validé pour prédire la mortalité à 28 jours des patients suspects de sepsis aux urgences.

**9 critères ponderes :**
- Age > 65 ans (3)
- Maison de retraite (2)
- Maladie terminale (6)
- Dyspnée (2)
- Choc septique (3)
- Plaquettes < 150 G/L (3)
- Bandémie > 5 % (3)
- Infection respiratoire basse (2)
- Altération conscience (2)

**Risque de mortalité :**
- 0-5 : 1 %
- 6-8 : 5 %
- 9-12 : 20 %
- ≥ 13 : 50 %`,
  clinicalCommentary: `Le score MEDS a été validé en population de patients septiques aux urgences. Il est plus performant que le qSOFA seul. Il aide à décider du niveau de soins (réanimation vs médecine) et de l intensité du traitement. Il ne remplace pas le jugement clinique. Les limites : non validé en pédiatrie, en post-opératoire, ou en immunodéprimés sévères.`,
  references: [
    {
      type: 'pubmed',
      title: 'Shapiro NI et al. Mortality in Emergency Department Sepsis (MEDS) score. Crit Care Med 2003',
      pmid: '12682487',
    },
    {
      type: 'guideline',
      title: 'SFMU — Prise en charge du sepsis aux urgences (Recommandations 2022)',
      url: 'https://www.sfmu.org',
    },
  ],
}
export default meds
