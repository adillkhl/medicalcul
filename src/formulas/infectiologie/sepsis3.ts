import type { FormulaDefinition } from '../types'

const sepsis3: FormulaDefinition = {
  id: 'sepsis3',
  slug: 'sepsis3',
  name: 'Sepsis (Critères SEPSIS 3)',
  specialty: 'infectiologie',
  category: 'Sepsis',
  description: 'Critères SEPSIS-3 (2016) pour la définition et la classification du sepsis et du choc septique, avec évaluation du SOFA et qSOFA.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'infection_suspectee',
      type: 'boolean',
      label: 'Infection documentée ou suspectée',
      weight: 0,
    },
    {
      id: 'qsofa_glasgow',
      type: 'boolean',
      label: 'qSOFA — Glasgow < 15 (altération conscience)',
      weight: 1,
    },
    {
      id: 'qsofa_pas',
      type: 'boolean',
      label: 'qSOFA — PAS ≤ 100 mmHg',
      weight: 1,
    },
    {
      id: 'qsofa_fr',
      type: 'boolean',
      label: 'qSOFA — FR ≥ 22/min',
      weight: 1,
    },
    {
      id: 'lactates',
      type: 'boolean',
      label: 'Lactates > 2 mmol/L (marqueur de dysfonction cellulaire)',
      weight: 0,
    },
    {
      id: 'vasopresseurs',
      type: 'boolean',
      label: 'Besoin de vasopresseurs pour maintenir PAM ≥ 65 mmHg',
      weight: 0,
    },
  ],
  calculate: (values) => {
    const infection = values.infection_suspectee || false
    const qsofaGc = values.qsofa_glasgow ? 1 : 0
    const qsofaPas = values.qsofa_pas ? 1 : 0
    const qsofaFr = values.qsofa_fr ? 1 : 0
    const qsofa = qsofaGc + qsofaPas + qsofaFr
    const lactates = values.lactates || false
    const vasopresseurs = values.vasopresseurs || false

    let diagnostic: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let rec: string

    if (!infection) {
      diagnostic = 'Pas de sepsis — Absence d infection documentee ou suspectee'
      severity = 'low'
      rec = 'Rechercher un autre diagnostic. Si suspicion d infection reelle, reevaluer avec les examens complementaires (procalcitonine, examens bacteriologiques, imagerie).'
    } else if (vasopresseurs && lactates) {
      diagnostic = 'CHOC SEPTIQUE (SEPSIS-3) — Sepsis + vasopresseurs + lactates > 2 mmol/L'
      severity = 'critical'
      rec = 'URGENCE VITALE. Remplissage vasculaire agressif. Vasopresseurs (noradrenaline). Antibiothérapie large spectre IV immediate. Controle de la porte d entree. Objectifs : PAM ≥ 65 mmHg, lactates < 2 mmol/L, diurese > 0.5 mL/kg/h. Transfert en reanimation.'
    } else if (qsofa >= 2) {
      diagnostic = 'SEPSIS (SEPSIS-3) — qSOFA ≥ 2 + infection'
      severity = 'high'
      rec = 'Hospitalisation. Antibiothérapie IV urgente (< 1h). Bilan etiologique (hemocultures, imagerie). Evaluation SOFA complet. Remplissage. Lactates. Surveillance rapprochee (reanimation si aggravation).'
    } else if (qsofa >= 1) {
      diagnostic = 'Sepsis possible — qSOFA = 1'
      severity = 'moderate'
      rec = 'Surveillance. Bilans sanguins (NFS, CRP, PCT, lactates). Antibiothérapie si suspicion forte. Reevaluation a 2-4h.'
    } else {
      diagnostic = 'qSOFA = 0 — Sepsis peu probable'
      severity = 'low'
      rec = 'Surveillance standard. Traiter la cause de l infection si documentee.'
    }

    return {
      value: qsofa,
      label: diagnostic,
      severity,
      details: {
        'qSOFA': `${qsofa}/3`,
        'Glasgow < 15': qsofaGc ? 'Oui' : 'Non',
        'PAS ≤ 100': qsofaPas ? 'Oui' : 'Non',
        'FR ≥ 22': qsofaFr ? 'Oui' : 'Non',
        'Lactates > 2 mmol/L': lactates ? 'Oui' : 'Non',
        'Vasopresseurs': vasopresseurs ? 'Oui' : 'Non',
      },
      ranges: [
        { min: 0, max: 0, label: 'Sepsis peu probable', severity: 'low', recommendation: 'qSOFA 0. Surveiller. Si suspicion clinique forte, ne pas se fier uniquement au qSOFA.' },
        { min: 1, max: 1, label: 'Sepsis possible', severity: 'moderate', recommendation: 'qSOFA 1. Bilans et surveillance. Ne pas retarder l antibiothérapie si sepsis probable.' },
        { min: 2, max: 3, label: 'Sepsis probable (qSOFA ≥ 2)', severity: 'high', recommendation: 'Sepsis. Antibiothérapie < 1h. Bilan. Remplissage. Évaluation SOFA complet.' },
        { min: 4, max: 9, label: 'Choc septique', severity: 'critical', recommendation: 'Reanimation. Noradrenaline. Antibiothérapie immédiate. Contrôle du foyer infectieux.' },
      ],
    }
  },
  interpretation: `Les **critères SEPSIS-3** (Sepsis-3 Consensus Conference, JAMA 2016) définissent :

- **Sepsis** : dysfonction d organe menaçant le pronostic vital, causée par une réponse anormale de l hôte à une infection. Le sepsis est défini par une augmentation du SOFA ≥ 2 points.
- **qSOFA** (quick SOFA) : outil de dépistage au lit du patient (3 critères : Glasgow < 15, PAS ≤ 100, FR ≥ 22). Un qSOFA ≥ 2 est associé à un risque élevé de mortalité (≥ 10 %).
- **Choc septique** : sepsis + besoin de vasopresseurs pour maintenir PAM ≥ 65 mmHg + lactates > 2 mmol/L malgré un remplissage adéquat.

**Mortalité hospitalière :**
- Sepsis : 10-20 %
- Choc septique : 40-50 %`,
  clinicalCommentary: `Le qSOFA est un outil de dépistage, pas un outil diagnostique. Un qSOFA ≥ 2 en présence d infection suspectée doit alerter sur un risque élevé de mortalité (odds ratio 2.4-4.7). Mais un qSOFA < 2 n exclut pas un sepsis sévère (sensibilité modérée). Les critères SEPSIS-3 remplacent les anciens critères SEPSIS-1 (SRIS). Le SOFA complet est plus précis pour évaluer la dysfonction d organe. L antibiothérapie doit être débutée dans l heure suivant la reconnaissance du sepsis.`,
  references: [
    {
      type: 'pubmed',
      title: 'Singer M et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA 2016',
      pmid: '26903338',
    },
    {
      type: 'guideline',
      title: 'SSC — Surviving Sepsis Campaign Guidelines 2021',
      url: 'https://www.sccm.org/SurvivingSepsisCampaign',
    },
  ],
}
export default sepsis3
