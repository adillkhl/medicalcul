import type { FormulaDefinition } from '../types'

const iesr: FormulaDefinition = {
  id: 'iesr',
  slug: 'iesr',
  name: 'IES-R — Impact of Event Scale — Révisée',
  specialty: 'neurologie',
  category: 'Neuropsychologie',
  description: 'Évaluation de la détresse psychologique et des symptômes de stress post-traumatique suite à un événement traumatique (score 0–88)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'rappel',
      type: 'radio',
      label: 'Tout rappel de l\'événement provoquait des sentiments pénibles',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'reveil',
      type: 'radio',
      label: 'J\'avais des difficultés à rester endormi(e) ou à me réveiller',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'memories',
      type: 'radio',
      label: 'D\'autres choses me faisaient penser à l\'événement',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'irritable',
      type: 'radio',
      label: 'Je me sentais irritable et en colère',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'humeur',
      type: 'radio',
      label: 'Je n\'étais pas content(e) quand quelque chose me rendait heureux(se)',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'flashback',
      type: 'radio',
      label: 'J\'y repensais sans le vouloir',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'evitement',
      type: 'radio',
      label: 'J\'essayais de ne pas y penser',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'sursaut',
      type: 'radio',
      label: 'J\'avais des réactions de sursaut',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'engourdissement',
      type: 'radio',
      label: 'J\'éprouvais une sensation d\'engourdissement pour tout ce qui m\'entourait',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'images',
      type: 'radio',
      label: 'Des images de l\'événement surgissaient dans ma tête',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'sommeil',
      type: 'radio',
      label: 'J\'avais du mal à m\'endormir',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'evitement2',
      type: 'radio',
      label: 'J\'essayais de ne pas ressentir de sentiments pénibles par rapport à l\'événement',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'evitement3',
      type: 'radio',
      label: 'Je ressentais une sensation d\'absence (comme si rien n\'était réel)',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'reminiscence',
      type: 'radio',
      label: 'J\'avais l\'impression de revivre l\'événement',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'hypervigilance',
      type: 'radio',
      label: 'J\'étais en état d\'hypervigilance',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'evitement4',
      type: 'radio',
      label: 'J\'essayais d\'éviter les lieux ou les personnes associés à l\'événement',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'emo_intrusive',
      type: 'radio',
      label: 'Mes sentiments à propos de l\'événement étaient comme figés',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'concentration',
      type: 'radio',
      label: 'J\'avais du mal à me concentrer',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'declencheur',
      type: 'radio',
      label: 'Des sensations physiques (sueurs, palpitations) me rappelaient l\'événement',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'cauchenars',
      type: 'radio',
      label: 'J\'avais des rêves à propos de l\'événement',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
    {
      id: 'menace',
      type: 'radio',
      label: 'Je me sentais constamment sur mes gardes',
      options: [
        { value: 0, label: '0 — Pas du tout' },
        { value: 1, label: '1 — Un peu' },
        { value: 2, label: '2 — Parfois' },
        { value: 3, label: '3 — Souvent' },
        { value: 4, label: '4 — Très souvent' },
      ],
    },
  ],
  calculate: (values) => {
    const items = [
      'rappel', 'reveil', 'memories', 'irritable', 'humeur', 'flashback',
      'evitement', 'sursaut', 'engourdissement', 'images', 'sommeil',
      'evitement2', 'evitement3', 'reminiscence', 'hypervigilance', 'evitement4',
      'emo_intrusive', 'concentration', 'declencheur', 'cauchenars', 'menace',
    ]

    const scores = items.map(id => values[id] ?? 0)
    const total = scores.reduce((a, b) => a + b, 0)

    const severity = total >= 33 ? 'critical' : total >= 24 ? 'high' : total >= 12 ? 'moderate' : 'low'

    const getSeverityLabel = (s: number) => {
      if (s >= 33) return 'Probable PTSD — Score élevé'
      if (s >= 24) return 'PTSD partiel — Score modéré-sévère'
      if (s >= 12) return 'Réaction de stress significative'
      return 'Réaction de stress normale'
    }

    return {
      value: total,
      label: getSeverityLabel(total),
      severity,
      details: { Total: total },
      ranges: [
        { min: 0, max: 11, label: 'Normale — pas de traumatisme significatif', severity: 'low', recommendation: 'Absence de détresse psychologique significative. Soutien simple, pas de prise en charge spécifique.' },
        { min: 12, max: 23, label: 'Réaction de stress significative', severity: 'moderate', recommendation: 'Symptômes de stress modérés. Proposer un soutien psychologique. Surveiller l\'évolution.' },
        { min: 24, max: 32, label: 'PTSD partiel — modéré à sévère', severity: 'high', recommendation: 'Évaluation psychiatrique recommandée. Thérapie cognitivo-comportementale (TCC) ou EMDR à discuter.' },
        { min: 33, max: 88, label: 'PTSD probable — sévère', severity: 'critical', recommendation: 'Prise en charge psychiatrique urgente. Thérapie EMDR ou TCC validée. Traitement médicamenteux (ISRS) si nécessaire.' },
      ],
    }
  },
  interpretation: `L'**IES-R** (Impact of Event Scale — Révisée) est un auto-questionnaire de 22 items évaluant la détresse psychologique liée à un événement traumatique, sur les 7 derniers jours.

**Trois sous-échelles :**
- **Intrusion** : souvenirs, rêves, flashbacks
- **Évitement** : efforts pour ne pas penser à l\'événement
- **Hyperactivation** : irritabilité, hypervigilance, sursaut

**Score total :** 0–88. Chaque item est côté de 0 (pas du tout) à 4 (très souvent).

**Seuils cliniques :**
- < 12 : normal
- 12–23 : réaction de stress modérée
- 24–32 : PTSD partiel
- ≥ 33 : PTSD probable

L\'IES-R est utile pour le dépistage du trouble de stress post-traumatique (PTSD). Un score ≥ 33 a une bonne spécificité pour le diagnostic de PTSD.`,
  clinicalCommentary: `L\'IES-R est fréquemment utilisé en neurologie chez les patients ayant vécu un AVC, un traumatisme crânien, une épilepsie sévère, ou une pathologie neurologique brutale et engageant le pronostic vital. Attention : les patients avec aphasie ou troubles cognitifs peuvent avoir des difficultés à remplir le questionnaire. L\'IES-R ne remplace pas un entretien clinique structuré (CAPS-5) pour le diagnostic de PTSD. Version française validée par Brunet et al. (2003).`,
  references: [
    {
      type: 'pubmed',
      title: 'Weiss DS, Marmar CR. The Impact of Event Scale — Revised. In: Wilson JP, Keane TM (eds), Assessing Psychological Trauma and PTSD, 1997',
      pmid: 'None',
    },
    {
      type: 'pubmed',
      title: 'Brunet A et al. Validation of a French version of the Impact of Event Scale-Revised. Can J Psychiatry 2003',
      pmid: '12866337',
    },
  ],
}

export default iesr
