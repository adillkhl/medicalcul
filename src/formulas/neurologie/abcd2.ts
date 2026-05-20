import type { FormulaDefinition } from '../types'

const abcd2: FormulaDefinition = {
  id: 'abcd2',
  slug: 'abcd2',
  name: 'ABCD² — Risque d\'AVC après AIT',
  specialty: 'neurologie',
  category: 'Accident Vasculaire Cérébral',
  description: 'Score prédictif du risque d\'AVC ischémique à 2, 7 et 90 jours après un accident ischémique transitoire (AIT)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 1, label: '≥ 60 ans' },
        { value: 0, label: '< 60 ans' },
      ],
    },
    {
      id: 'bp',
      type: 'radio',
      label: 'Pression artérielle (PA)',
      options: [
        { value: 1, label: 'PAS ≥ 140 mmHg et/ou PAD ≥ 90 mmHg' },
        { value: 0, label: 'PA normale' },
      ],
    },
    {
      id: 'clinical',
      type: 'radio',
      label: 'Clinique',
      options: [
        { value: 2, label: 'Déficit moteur unilatéral (faiblesse d\'un côté)' },
        { value: 1, label: 'Trouble du langage isolé (dysarthrie / aphasie)' },
        { value: 0, label: 'Autres symptômes / aucun déficit focal' },
      ],
    },
    {
      id: 'duration',
      type: 'radio',
      label: 'Durée des symptômes',
      options: [
        { value: 2, label: '≥ 60 minutes' },
        { value: 1, label: '10–59 minutes' },
        { value: 0, label: '< 10 minutes' },
      ],
    },
    {
      id: 'diabetes',
      type: 'boolean',
      label: 'Diabète (antécédent)',
    },
  ],
  calculate: (values) => {
    let score = 0
    score += values.age ?? 0
    score += values.bp ?? 0
    score += values.clinical ?? 0
    score += values.duration ?? 0
    if (values.diabetes) score += 1

    const day2Risk = score <= 3 ? 1.0 : score <= 4 ? 2.1 : score <= 5 ? 3.2 : 5.9
    const day7Risk = score <= 3 ? 1.2 : score <= 4 ? 2.9 : score <= 5 ? 5.2 : 8.8
    const day90Risk = score <= 3 ? 3.1 : score <= 4 ? 5.7 : score <= 5 ? 9.8 : 14.2

    return {
      value: score,
      risk: day2Risk,
      riskUnit: '% risque AVC à 2 jours',
      severity: score <= 3 ? 'low' : score <= 4 ? 'moderate' : score <= 5 ? 'high' : 'critical',
      details: { risque2j: `${day2Risk}%`, risque7j: `${day7Risk}%`, risque90j: `${day90Risk}%` },
      ranges: [
        { min: 0, max: 3, label: 'Score 0–3 — RISQUE FAIBLE', severity: 'low', recommendation: 'Risque à 2j < 1%. Retour à domicile possible si imagerie normale et suivi neurovasculaire organisé dans les 7 jours. Bilan étiologique en ambulatoire (Echo-Doppler TSA, ECG, Holter, IRM cérébrale).' },
        { min: 4, max: 4, label: 'Score 4 — RISQUE INTERMÉDIAIRE', severity: 'moderate', recommendation: 'Risque à 2j ≈ 2,1%. Hospitalisation en unité neurovasculaire (UNV) ou court séjour. Bilan étiologique urgent : IRM cérébrale, Echo-Doppler TSA, ECG, Holter. Traitement antiagrégant et statine.' },
        { min: 5, max: 5, label: 'Score 5 — RISQUE ÉLEVÉ', severity: 'high', recommendation: 'Risque à 2j ≈ 3,2%. Hospitalisation en UNV. Bilan étiologique complet en urgence. Surveillance rapprochée.' },
        { min: 6, max: 7, label: 'Score 6–7 — RISQUE TRÈS ÉLEVÉ', severity: 'critical', recommendation: 'Risque à 2j ≈ 6–9%. Hospitalisation en UNV immédiate. Bilan étiologique en urgence (IRM, angio-IRM, Echo-Doppler, ECG/Holter). Double antiagrégation à discuter selon le mécanisme. Surveillance continue.' },
      ],
    }
  },
  interpretation: `Le **score ABCD²** est utilisé pour évaluer le risque d’AVC dans les 2, 7 et 90 jours après un accident ischémique transitoire (AIT).

**Items (0–7 points) :**
- **A** — Âge ≥ 60 ans : 1 pt
- **B** — BP (PA) ≥ 140/90 : 1 pt
- **C** — Clinique : déficit moteur 2 pt, trouble du langage 1 pt
- **D** — Durée : ≥ 60 min 2 pt, 10–59 min 1 pt
- **D** — Diabète : 1 pt

**Risque d'AVC à 2 jours :**
- 0–3 : 1,0 %
- 4 : 2,1 %
- 5 : 3,2 %
- 6–7 : 5,9 %

Ce score ne remplace pas l’IRM cérébrale qui reste l'examen clé après un AIT.`,
  clinicalCommentary: `L'ABCD² est utile au triage mais ne doit JAMAIS retarder la prise en charge si le score est bas mais la clinique évocatrice. Un AIT est une URGENCE même si les symptômes ont régressé. L'IRM de diffusion (DWI) est positive dans 30-50% des AIT. En pratique : tout AIT doit être adressé aux urgences pour avis neurovasculaire, quel que soit le score ABCD². L'échographie-Doppler des TSA et le bilan cardiovasculaire sont systématiques.`,
  references: [
    {
      type: 'pubmed',
      title: 'Johnston SC et al. Validation and refinement of scores to predict very early stroke risk after transient ischaemic attack. Lancet 2007',
      pmid: '17258668',
    },
    {
      type: 'guideline',
      title: 'HAS — Prise en charge de l\'accident ischémique transitoire (2022)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default abcd2
