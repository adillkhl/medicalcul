import type { FormulaDefinition } from '../types'

const borg: FormulaDefinition = {
  id: 'borg',
  slug: 'borg',
  name: 'Borg — Échelle de Dyspnée (CR-10)',
  specialty: 'pneumologie',
  category: 'Dyspnée',
  description: 'Évaluation de l\'intensité de la dyspnée perçue par le patient lors d\'un effort ou au repos, échelle de Borg CR-10 (score 0–10)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'score',
      type: 'radio',
      label: 'Quel est votre niveau d\'essoufflement actuellement ?',
      options: [
        { value: 0, label: '0 — Rien du tout' },
        { value: 0.5, label: '0,5 — Très, très léger (à peine perceptible)' },
        { value: 1, label: '1 — Très léger' },
        { value: 2, label: '2 — Léger' },
        { value: 3, label: '3 — Modéré' },
        { value: 4, label: '4 — Un peu fort' },
        { value: 5, label: '5 — Fort' },
        { value: 6, label: '6 — Fort +' },
        { value: 7, label: '7 — Très fort' },
        { value: 8, label: '8 — Très fort +' },
        { value: 9, label: '9 — Extrêmement fort (presque max)' },
        { value: 10, label: '10 — Maximum (effort maximal)' },
      ],
    },
  ],
  calculate: (values) => {
    const score = values.score ?? 0

    const severity = score <= 1 ? 'low' : score <= 3 ? 'moderate' : score <= 5 ? 'high' : 'critical'

    const label = score <= 1 ? 'Dyspnée très légère' :
      score <= 3 ? 'Dyspnée légère à modérée' :
      score <= 5 ? 'Dyspnée forte' :
      score <= 8 ? 'Dyspnée très forte' :
      'Dyspnée maximale'

    return {
      value: score,
      label,
      severity,
      details: { Borg: score },
      ranges: [
        { min: 0, max: 1, label: 'Borg 0–1 — Dyspnée très légère', severity: 'low', recommendation: 'Pas de limitation fonctionnelle significative.' },
        { min: 2, max: 3, label: 'Borg 2–3 — Dyspnée légère à modérée', severity: 'moderate', recommendation: 'Gêne à l\'effort. Rechercher une pathologie sous-jacente si persistante. EFR à discuter.' },
        { min: 4, max: 5, label: 'Borg 4–5 — Dyspnée forte', severity: 'high', recommendation: 'Limitation fonctionnelle significative. Bilan pneumologique. Traitement bronchodilatateur si obstruction.' },
        { min: 6, max: 8, label: 'Borg 6–8 — Dyspnée très forte', severity: 'critical', recommendation: 'Dyspnée sévère. Bilan urgent. Oxygenothérapie si SpO2 < 92%. Évaluation de la défaillance respiratoire.' },
        { min: 9, max: 10, label: 'Borg 9–10 — Dyspnée maximale', severity: 'critical', recommendation: 'URGENCE VITALE. Détresse respiratoire. Oxygénothérapie, VNI, intubation à discuter selon étiologie.' },
      ],
    }
  },
  interpretation: `L'**échelle de Borg CR-10** (Category Ratio 10) est l'échelle d’auto-évaluation de la dyspnée la plus utilisée en pratique clinique et à l’effort.

Le patient évalue sa sensation d'essoufflement de 0 (aucune) à 10 (maximale).

**Grades :**
- 0–1 : très léger
- 2–3 : léger à modéré
- 4–5 : fort
- 6–8 : très fort
- 9–10 : extrêmement fort / maximal

L'échelle de Borg est linéaire et permet un suivi reproductible de la dyspnée, notamment lors des épreuves d’effort (test de marche 6 min, épreuve d'effort cardiorespiratoire).`,
  clinicalCommentary: `L'échelle de Borg est complémentaire du mMRC. Avantage : évalue la dyspnée à l’instant T (pas sur la durée). Très utilisée lors des tests de marche ou de réhabilitation respiratoire. Montrer l'échelle visuelle au patient. Demander « à combien évaluez-vous votre essoufflement ? ». La dyspnée est un symptôme subjectif : le même niveau d’obstruction peut donner des scores très variables selon les patients.`,
  references: [
    {
      type: 'pubmed',
      title: 'Borg GA. Psychophysical bases of perceived exertion. Med Sci Sports Exerc 1982',
      pmid: '7154893',
    },
    {
      type: 'pubmed',
      title: 'Kendrick KR et al. Usefulness of the modified 0–10 Borg scale in assessing the degree of dyspnea in patients with COPD. Chest 2000',
      pmid: '10783681',
    },
  ],
}

export default borg
