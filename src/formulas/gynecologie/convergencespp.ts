import type { FormulaDefinition } from '../types'

const convergencespp: FormulaDefinition = {
  id: 'convergencespp',
  slug: 'convergencespp',
  name: 'Convergences PP (Score)',
  specialty: 'gynecologie',
  category: 'Douleurs pelvipérinéales',
  description: 'Score des Convergences PP pour l évaluation des douleurs pelvi-périnéales chroniques.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'duree',
      type: 'radio',
      label: 'Durée des douleurs',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: '< 6 mois' },
        { value: 2, label: '6-12 mois' },
        { value: 3, label: '> 12 mois' },
      ],
    },
    {
      id: 'intensite',
      type: 'radio',
      label: 'Intensité (EVA moyenne)',
      options: [
        { value: 0, label: 'EVA 0' },
        { value: 1, label: 'EVA 1-3 (légère)' },
        { value: 2, label: 'EVA 4-6 (modérée)' },
        { value: 3, label: 'EVA 7-10 (sévère)' },
      ],
    },
    {
      id: 'rythme',
      type: 'radio',
      label: 'Rythme des douleurs',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 1, label: 'Cycliques (péri-menstruelles)' },
        { value: 2, label: 'Non cycliques mais intermittentes' },
        { value: 3, label: 'Permanentes' },
      ],
    },
    {
      id: 'retentissement',
      type: 'radio',
      label: 'Retentissement fonctionnel',
      options: [
        { value: 0, label: 'Aucun' },
        { value: 1, label: 'Gêne légère aux activités' },
        { value: 2, label: 'Limitation modérée (sport, vie sociale)' },
        { value: 3, label: 'Retentissement sévère (arrêt de travail, vie quotidienne)' },
      ],
    },
    {
      id: 'dyspareunie',
      type: 'radio',
      label: 'Dyspareunie',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Superficielle' },
        { value: 2, label: 'Profonde' },
        { value: 3, label: 'Impossibilité de rapports' },
      ],
    },
    {
      id: 'examen',
      type: 'radio',
      label: 'Examen clinique (palpation pelvienne)',
      options: [
        { value: 0, label: 'Normal' },
        { value: 1, label: 'Sensibilité légère' },
        { value: 2, label: 'Douleur provoquée modérée' },
        { value: 3, label: 'Douleur sévère / contractures' },
      ],
    },
  ],
  calculate: (values) => {
    const score =
      (parseInt(values.duree) || 0) +
      (parseInt(values.intensite) || 0) +
      (parseInt(values.rythme) || 0) +
      (parseInt(values.retentissement) || 0) +
      (parseInt(values.dyspareunie) || 0) +
      (parseInt(values.examen) || 0)

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (score <= 4) severity = 'low'
    else if (score <= 8) severity = 'moderate'
    else if (score <= 12) severity = 'high'
    else severity = 'critical'

    return {
      value: score,
      label: `Score Convergences PP : ${score}/18`,
      severity,
      ranges: [
        { min: 0, max: 4, label: 'Douleurs légères', severity: 'low', recommendation: 'Auto-rééducation. Conseils hygiéniques. Surveillance simple.' },
        { min: 5, max: 8, label: 'Douleurs modérées', severity: 'moderate', recommendation: 'Rééducation pelvi-périnéale (kinésithérapie, biofeedback). Traitement antalgique. Bilan pluridisciplinaire.' },
        { min: 9, max: 12, label: 'Douleurs sévères', severity: 'high', recommendation: 'Prise en charge spécialisée. Centre de la douleur pelvienne. Infiltrations, neuromodulation, TCC. Bilan gynécologique et digestif approfondi.' },
        { min: 13, max: 18, label: 'Douleurs très sévères / invalidantes', severity: 'critical', recommendation: 'Prise en charge multidisciplinaire urgente. Centre expert douleur pelvienne. Évaluation psychologique. Traitement médicamenteux de palier III si nécessaire. Discuter chirurgie.' },
      ],
    }
  },
  interpretation: `Le **score Convergences PP** est un outil standardisé d évaluation des douleurs pelvi-périnéales chroniques, proposé par le réseau Convergences PP.

Six domaines sont explorés :
1. **Durée** (0–3)
2. **Intensité** (0–3)
3. **Rythme** (0–3)
4. **Retentissement fonctionnel** (0–3)
5. **Dyspareunie** (0–3)
6. **Examen clinique** (0–3)

Total : **0–18**. Plus le score est élevé, plus la prise en charge doit être spécialisée et multidisciplinaire.`,
  clinicalCommentary: `Les douleurs pelvi-périnéales chroniques sont souvent plurifactorielles (gynécologiques, urologiques, digestives, musculo-squelettiques, neurologiques, psycho-sociales). Le score Convergences PP oriente vers une filière de soins adaptée mais ne remplace pas les examens complémentaires (IRM pelvienne, échographie, bilan urodynamique). Une approche multidisciplinaire est la clé.`,
  references: [
    {
      type: 'guideline',
      title: 'Réseau Convergences PP — Évaluation des douleurs pelvi-périnéales chroniques (2022)',
      url: 'https://www.convergencespp.fr',
    },
    {
      type: 'pubmed',
      title: 'Labat JJ et al. Approche clinique des douleurs pelvi-périnéales. Prog Urol 2010',
      pmid: '21147479',
    },
  ],
}
export default convergencespp
