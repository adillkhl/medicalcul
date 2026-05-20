import type { FormulaDefinition } from '../types'

const wfns: FormulaDefinition = {
  id: 'wfns',
  slug: 'wfns',
  name: 'WFNS — World Federation of Neurosurgical Societies (Classification)',
  specialty: 'neurologie',
  category: 'Accident Vasculaire Cérébral',
  description: 'Classification clinique de la sévérité de l\'hémorragie sous-arachnoïdienne anévrismale (score I–V)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'gcs',
      type: 'radio',
      label: 'Glasgow Coma Scale (GCS)',
      options: [
        { value: 1, label: 'I — GCS 15 (conscience normale)' },
        { value: 2, label: 'II — GCS 14–13 (obnubilation légère)' },
        { value: 3, label: 'III — GCS 14–13 avec déficit focal' },
        { value: 4, label: 'IV — GCS 12–7 (coma modéré)' },
        { value: 5, label: 'V — GCS 6–3 (coma profond)' },
      ],
    },
    {
      id: 'deficit',
      type: 'boolean',
      label: 'Déficit moteur focal (hémiplégie, aphasie, etc.)',
    },
  ],
  calculate: (values) => {
    const gcs = values.gcs ?? 1
    const deficit = values.deficit ?? false

    let wfnsGrade: number
    let label: string

    if (gcs === 1) {
      if (!deficit) {
        wfnsGrade = 1
        label = 'Grade I — GCS 15, pas de déficit moteur'
      } else {
        wfnsGrade = 2
        label = 'Grade II — GCS 15, déficit moteur focal'
      }
    } else if (gcs === 2) {
      if (!deficit) {
        wfnsGrade = 2
        label = 'Grade II — GCS 14–13, pas de déficit moteur'
      } else {
        wfnsGrade = 3
        label = 'Grade III — GCS 14–13, avec déficit moteur focal'
      }
    } else if (gcs === 3) {
      wfnsGrade = 3
      label = 'Grade III — GCS 14–13, avec déficit moteur focal'
    } else if (gcs <= 4) {
      wfnsGrade = 4
      label = 'Grade IV — GCS 12–7'
    } else {
      wfnsGrade = 5
      label = 'Grade V — GCS 6–3'
    }

    const severity = wfnsGrade <= 2 ? 'moderate' : wfnsGrade <= 3 ? 'high' : 'critical'
    const mortality = wfnsGrade <= 1 ? 'Faible (< 10 %)' : wfnsGrade <= 2 ? 'Modérée (≈ 15 %)' : wfnsGrade <= 3 ? 'Élevée (≈ 30 %)' : wfnsGrade <= 4 ? 'Très élevée (≈ 50 %)' : 'Extrême (> 70 %)'

    return {
      value: wfnsGrade,
      label: `WFNS Grade ${wfnsGrade} — ${label}`,
      severity,
      details: { Grade_WFNS: wfnsGrade, GCS: gcs === 1 ? 15 : gcs === 2 ? '13–14' : gcs === 3 ? '13–14 avec déficit' : gcs === 4 ? '7–12' : '3–6', déficit_moteur: deficit ? 'Oui' : 'Non', mortalité_estimée: mortality },
      ranges: [
        { min: 1, max: 1, label: 'WFNS Grade I — Bon pronostic', severity: 'moderate', recommendation: 'Mortalité < 10%. Traitement précoce du sac anévrismal (clip ou coil). Surveillance en soins intensifs. Traitement du vasospasme (nimodipine, TCD, volémie).' },
        { min: 2, max: 2, label: 'WFNS Grade II — Pronostic modéré', severity: 'moderate', recommendation: 'Mortalité ≈ 15%. Traitement précoce de l\'anévrisme. Surveillance intensive. Prévention du vasospasme.' },
        { min: 3, max: 3, label: 'WFNS Grade III — Pronostic réservé', severity: 'high', recommendation: 'Mortalité ≈ 30%. Traitement de l\'anévrisme après stabilisation. Surveillance neurologique intensive. Gestion agressive du vasospasme.' },
        { min: 4, max: 4, label: 'WFNS Grade IV — Pronostic sévère', severity: 'critical', recommendation: 'Mortalité ≈ 50%. Stabilisation initiale, puis traitement de l\'anévrisme. Discussion collégiale du pronostic. Gestion du vasospasme et de l\'hypertension intracrânienne.' },
        { min: 5, max: 5, label: 'WFNS Grade V — Pronostic très sévère', severity: 'critical', recommendation: 'Mortalité > 70%. Prise en charge en réanimation. Discussion collégiale des objectifs de soins (limitation, arrêt des thérapeutiques). Traitement de l\'anévrisme si le patient s\'améliore après stabilisation.' },
      ],
    }
  },
  interpretation: `La **classification WFNS** (World Federation of Neurosurgical Societies) est la classification de référence pour évaluer la sévérité clinique de l’hémorragie sous-arachnoïdienne (HSA) anévrismale.

**Grades WFNS :**
- **Grade I** : GCS 15, pas de déficit moteur
- **Grade II** : GCS 14–13, pas de déficit moteur
- **Grade III** : GCS 14–13, avec déficit moteur
- **Grade IV** : GCS 12–7
- **Grade V** : GCS 6–3

La classification WFNS est un facteur prédictif majeur de la mortalité et du devenir fonctionnel après HSA. Elle guide la décision thérapeutique (traitement précoce vs différé) et la stratification dans les essais cliniques.

**Autres classifications complémentaires :** Fisher (épaisseur du sang au TDM), l'échelle de Hunt et Hess.`,
  clinicalCommentary: `Le grade WFNS est le premier facteur pronostique de l'HSA. Les grades I–II sont opérés/coilés précocement. Les grades IV–V posent la question du pronostic et du niveau de soins. Attention : le WFNS classe les patients selon le GCS au moment de l'évaluation, avant toute sédation. Un patient grade V peut récupérer et être traité secondairement. Les complications principales de l’HSA sont : le vasospasme (pic J7–J10), la reprise hémorragique, l'hydrocéphalie aiguë, et les complications médicales (pneumopathie, TVP).`,
  references: [
    {
      type: 'pubmed',
      title: 'Report of World Federation of Neurological Surgeons Committee on a Universal Subarachnoid Hemorrhage Grading Scale. J Neurosurg 1988',
      pmid: '3164379',
    },
    {
      type: 'pubmed',
      title: 'Rosen DS, Macdonald RL. Subarachnoid hemorrhage grading scales: a systematic review. Neurocrit Care 2005',
      pmid: '16100060',
    },
  ],
}

export default wfns
