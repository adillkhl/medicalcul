import type { FormulaDefinition } from '../types'

const dakar: FormulaDefinition = {
  id: 'dakar',
  slug: 'dakar',
  name: 'Dakar (Score)',
  specialty: 'infectiologie',
  category: 'Tetanos',
  description: 'Score de Dakar pour évaluer la gravité du tétanos et prédire la mortalité.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'incubation',
      type: 'radio',
      label: 'Periode d incubation',
      options: [
        { value: 0, label: '> 7 jours' },
        { value: 1, label: '4-7 jours' },
        { value: 2, label: '< 4 jours ou inconnue' },
      ],
    },
    {
      id: 'porte_entree',
      type: 'radio',
      label: 'Porte d entree',
      options: [
        { value: 0, label: 'Propre ou identifiable' },
        { value: 1, label: 'Sale ou non identifiable' },
      ],
    },
    {
      id: 'generalise',
      type: 'boolean',
      label: 'Tetanos generalise (vs localise)',
      weight: 1,
    },
    {
      id: 'fievre',
      type: 'boolean',
      label: 'Fievre > 38.5°C',
      weight: 1,
    },
    {
      id: 'trismus',
      type: 'radio',
      label: 'Trismus',
      options: [
        { value: 0, label: 'Absent ou leger (< 2 cm)' },
        { value: 1, label: 'Modere (1-2 cm)' },
        { value: 2, label: 'Severe (< 1 cm ou trismus complet)' },
      ],
    },
    {
      id: 'spasmes',
      type: 'radio',
      label: 'Spasmes',
      options: [
        { value: 0, label: 'Absents' },
        { value: 1, label: 'Spasmes provoques' },
        { value: 2, label: 'Spasmes spontanes' },
      ],
    },
    {
      id: 'dysphagie',
      type: 'boolean',
      label: 'Dysphagie / Dyspnee',
      weight: 1,
    },
    {
      id: 'dysautonomie',
      type: 'boolean',
      label: 'Dysautonomie (troubles du rythme, instabilite tensionnelle)',
      weight: 2,
    },
  ],
  calculate: (values) => {
    const score =
      (parseInt(values.incubation) || 0) +
      (parseInt(values.porte_entree) || 0) +
      (values.generalise ? 1 : 0) +
      (values.fievre ? 1 : 0) +
      (parseInt(values.trismus) || 0) +
      (parseInt(values.spasmes) || 0) +
      (values.dysphagie ? 1 : 0) +
      (values.dysautonomie ? 2 : 0)

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let label: string
    if (score <= 3) { severity = 'low'; label = 'Tetanos leger (score ≤ 3)' }
    else if (score <= 6) { severity = 'moderate'; label = 'Tetanos modere (score 4-6)' }
    else if (score <= 9) { severity = 'high'; label = 'Tetanos severe (score 7-9)' }
    else { severity = 'critical'; label = 'Tetanos tres severe (score ≥ 10)' }

    return {
      value: score,
      label: `Score de Dakar : ${score} — ${label}`,
      severity,
      ranges: [
        { min: 0, max: 3, label: 'Tetanos leger', severity: 'low', recommendation: 'Hospitalisation. Diazepam per os ou IV. Soins locaux de la porte d entree. Serotherapie antitétanique (Ig humaines 500 UI). Vaccination antitétanique de rappel.' },
        { min: 4, max: 6, label: 'Tetanos modere', severity: 'moderate', recommendation: 'Hospitalisation en soins intensifs. Diazepam IV continue. Traitement de la porte d entree. Serotherapie. Surveillance respiratoire stricte.' },
        { min: 7, max: 9, label: 'Tetanos severe', severity: 'high', recommendation: 'Reanimation. Diazepam IV haute dose ± curares. Ventilation mecanique inevitable. Serotherapie IV. Antibiothérapie : metronidazole. Soins intensifs prolonges.' },
        { min: 10, max: 15, label: 'Tetanos tres severe', severity: 'critical', recommendation: 'Reanimation lourde. Ventilation mecanique systématique. Curares. Diazepam IV. Traitement de la dysautonomie (morphine, labétalol, clonidine). Pronostic vital engage. Mortalite > 50 %.' },
      ],
    }
  },
  interpretation: `Le **score de Dakar** est un score pronostique validé pour évaluer la sévérité du tétanos et guider la prise en charge.

**Facteurs de risque (pondération) :**
- Incubation < 7 jours (0-2)
- Porte d entrée sale (0-1)
- Tétanos généralisé (0-1)
- Fièvre > 38.5°C (0-1)
- Trismus sévère (0-2)
- Spasmes spontanés (0-2)
- Dysphagie/dyspnée (0-1)
- Dysautonomie (0-2)

**Seuils pronostiques :**
- ≤ 3 : léger (mortalité < 10 %)
- 4-6 : modéré (mortalité 10-30 %)
- 7-9 : sévère (mortalité 30-60 %)
- ≥ 10 : très sévère (mortalité > 60 %)`,
  clinicalCommentary: `Le tétanos reste une maladie grave dans les pays à ressources limitées. La vaccination est la seule prévention efficace. Le traitement repose sur trois piliers : sédation (diazépam), élimination de la toxine (Ig antitétaniques), et éradication de la bactérie (métronidazole). La dysautonomie est la principale cause de décès. Le pronostic est aggravé aux âges extrêmes et en cas d incubation courte.`,
  references: [
    {
      type: 'pubmed',
      title: 'Thwaites CL et al. Predicting the outcome of tetanus. PLoS Negl Trop Dis 2011',
      pmid: '21666794',
    },
    {
      type: 'guideline',
      title: 'OMS — Prise en charge du tétanos (Guide 2021)',
      url: 'https://www.who.int',
    },
  ],
}
export default dakar
