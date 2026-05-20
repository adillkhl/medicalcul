import type { FormulaDefinition } from '../types'

const had: FormulaDefinition = {
  id: 'had',
  slug: 'had',
  name: 'HAD — Hospital Anxiety and Depression Scale',
  specialty: 'neurologie',
  category: 'Neuropsychologie',
  description: 'Questionnaire de dépistage des troubles anxieux et dépressifs en milieu hospitalier (14 items, scores 0–21 par sous-échelle)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'anx1',
      type: 'radio',
      label: 'A1 — Je me sens tendu(e) ou énervé(e)',
      options: [
        { value: 3, label: '3 — La plupart du temps' },
        { value: 2, label: '2 — Souvent' },
        { value: 1, label: '1 — De temps en temps' },
        { value: 0, label: '0 — Jamais' },
      ],
    },
    {
      id: 'dep1',
      type: 'radio',
      label: 'D1 — Je prends plaisir aux mêmes choses qu\'avant',
      options: [
        { value: 0, label: '0 — Tout autant qu\'avant' },
        { value: 1, label: '1 — Pas autant qu\'avant' },
        { value: 2, label: '2 — Un peu seulement' },
        { value: 3, label: '3 — Presque plus rien ne me fait plaisir' },
      ],
    },
    {
      id: 'anx2',
      type: 'radio',
      label: 'A2 — J\'ai une sensation de peur comme si quelque chose d\'horrible allait arriver',
      options: [
        { value: 3, label: '3 — Oui, très nettement' },
        { value: 2, label: '2 — Oui, mais pas trop fort' },
        { value: 1, label: '1 — Un peu, mais cela ne m\'inquiète pas' },
        { value: 0, label: '0 — Pas du tout' },
      ],
    },
    {
      id: 'dep2',
      type: 'radio',
      label: 'D2 — Je sais rire et voir le bon côté des choses',
      options: [
        { value: 0, label: '0 — Autant que d\'habitude' },
        { value: 1, label: '1 — Plus autant qu\'avant' },
        { value: 2, label: '2 — Vraiment moins qu\'avant' },
        { value: 3, label: '3 — Plus du tout' },
      ],
    },
    {
      id: 'anx3',
      type: 'radio',
      label: 'A3 — Je me fais du souci',
      options: [
        { value: 3, label: '3 — Très souvent' },
        { value: 2, label: '2 — Assez souvent' },
        { value: 1, label: '1 — Occasionnellement' },
        { value: 0, label: '0 — Très occasionnellement' },
      ],
    },
    {
      id: 'dep3',
      type: 'radio',
      label: 'D3 — Je suis de bonne humeur',
      options: [
        { value: 0, label: '0 — La plupart du temps' },
        { value: 1, label: '1 — Assez souvent' },
        { value: 2, label: '2 — Rarement' },
        { value: 3, label: '3 — Jamais' },
      ],
    },
    {
      id: 'anx4',
      type: 'radio',
      label: 'A4 — Je peux rester tranquillement assis(e) à ne rien faire et me sentir décontracté(e)',
      options: [
        { value: 0, label: '0 — Oui, quoi qu\'il arrive' },
        { value: 1, label: '1 — Oui, en général' },
        { value: 2, label: '2 — Rarement' },
        { value: 3, label: '3 — Jamais' },
      ],
    },
    {
      id: 'dep4',
      type: 'radio',
      label: 'D4 — J\'ai l\'impression de fonctionner au ralenti',
      options: [
        { value: 3, label: '3 — Presque toujours' },
        { value: 2, label: '2 — Très souvent' },
        { value: 1, label: '1 — Parfois' },
        { value: 0, label: '0 — Jamais' },
      ],
    },
    {
      id: 'anx5',
      type: 'radio',
      label: 'A5 — J\'éprouve des sensations de peur et j\'ai l\'estomac serré',
      options: [
        { value: 3, label: '3 — Très souvent' },
        { value: 2, label: '2 — Assez souvent' },
        { value: 1, label: '1 — Parfois' },
        { value: 0, label: '0 — Jamais' },
      ],
    },
    {
      id: 'dep5',
      type: 'radio',
      label: 'D5 — Je ne m\'intéresse plus à mon apparence',
      options: [
        { value: 3, label: '3 — Plus du tout' },
        { value: 2, label: '2 — Je n\'y accorde pas autant de temps que je le devrais' },
        { value: 1, label: '1 — Il se peut que je n\'y fasse plus autant attention' },
        { value: 0, label: '0 — J\'y fais autant attention que d\'habitude' },
      ],
    },
    {
      id: 'anx6',
      type: 'radio',
      label: 'A6 — J\'ai la bougeotte et n\'arrive pas à tenir en place',
      options: [
        { value: 3, label: '3 — Oui, beaucoup' },
        { value: 2, label: '2 — Oui, pas mal' },
        { value: 1, label: '1 — Pas tellement' },
        { value: 0, label: '0 — Pas du tout' },
      ],
    },
    {
      id: 'dep6',
      type: 'radio',
      label: 'D6 — Je me réjouis d\'avance à l\'idée de faire certaines choses',
      options: [
        { value: 0, label: '0 — Autant qu\'avant' },
        { value: 1, label: '1 — Plutôt moins qu\'avant' },
        { value: 2, label: '2 — Bien moins qu\'avant' },
        { value: 3, label: '3 — Presque jamais' },
      ],
    },
    {
      id: 'anx7',
      type: 'radio',
      label: 'A7 — J\'éprouve des sensations soudaines de panique',
      options: [
        { value: 3, label: '3 — Très souvent' },
        { value: 2, label: '2 — Assez souvent' },
        { value: 1, label: '1 — Pas très souvent' },
        { value: 0, label: '0 — Jamais' },
      ],
    },
    {
      id: 'dep7',
      type: 'radio',
      label: 'D7 — Je peux prendre plaisir à un bon livre ou à une bonne émission de radio/télé',
      options: [
        { value: 0, label: '0 — Souvent' },
        { value: 1, label: '1 — Parfois' },
        { value: 2, label: '2 — Rarement' },
        { value: 3, label: '3 — Très rarement' },
      ],
    },
  ],
  calculate: (values) => {
    const anxiété = (values.anx1 ?? 0) + (values.anx2 ?? 0) + (values.anx3 ?? 0) + (values.anx4 ?? 0) + (values.anx5 ?? 0) + (values.anx6 ?? 0) + (values.anx7 ?? 0)
    const dépression = (values.dep1 ?? 0) + (values.dep2 ?? 0) + (values.dep3 ?? 0) + (values.dep4 ?? 0) + (values.dep5 ?? 0) + (values.dep6 ?? 0) + (values.dep7 ?? 0)

    const anxLabel = anxiété <= 7 ? 'Anxiété normale' : anxiété <= 10 ? 'Anxiété borderline' : 'Anxiété pathologique'
    const depLabel = dépression <= 7 ? 'Dépression normale' : dépression <= 10 ? 'Dépression borderline' : 'Dépression pathologique'

    const maxSeverity = Math.max(
      anxiété > 10 ? 3 : anxiété > 7 ? 2 : 1,
      dépression > 10 ? 3 : dépression > 7 ? 2 : 1,
    )

    const severity = maxSeverity === 3 ? 'high' : maxSeverity === 2 ? 'moderate' : 'low'

    return {
      value: anxiété + dépression,
      label: `A: ${anxiété}/21 — ${anxLabel} | D: ${dépression}/21 — ${depLabel}`,
      severity,
      details: { Anxiété: anxiété, Dépression: dépression },
      ranges: [
        { min: 0, max: 14, label: 'Normal (A ≤ 7 et D ≤ 7)', severity: 'low', recommendation: 'Pas de trouble anxiodépressif significatif. Pas de prise en charge spécifique nécessaire.' },
        { min: 15, max: 20, label: 'Borderline (A 8–10 ou D 8–10)', severity: 'moderate', recommendation: 'Suspicion de trouble anxiodépressif. Surveillance. Discuter évaluation psychologique.' },
        { min: 21, max: 42, label: 'Pathologique (A ≥ 11 ou D ≥ 11)', severity: 'high', recommendation: 'Trouble anxiodépressif probable. Avis psychiatrique. Prise en charge adaptée (thérapie, traitement médicamenteux si indiqué).' },
      ],
    }
  },
  interpretation: `L'**HAD** (Hospital Anxiety and Depression Scale) est un questionnaire de 14 items, validé en français, conçu pour le dépistage des troubles anxieux et dépressifs en milieu hospitalier non psychiatrique.

**Deux sous-échelles :**
- **Anxiété (A)** : 7 items (A1–A7) — score 0–21
- **Dépression (D)** : 7 items (D1–D7) — score 0–21

**Seuils :**
- 0–7 : normal
- 8–10 : borderline (douteux)
- ≥ 11 : pathologique

L'HAD exclut les symptômes somatiques (fatigue, insomnie) pour éviter les biais chez les patients hospitalisés.`,
  clinicalCommentary: `L'HAD est très utilisé en neurologie car il évite les symptômes somatiques confondants (fatigue, douleur, troubles du sommeil) fréquents dans les pathologies neurologiques. Particulièrement utile dans l'épilepsie, la SEP, les céphalées chroniques, les AVC et les maladies neurodégénératives. Ne pas oublier que l’HAD est un outil de DÉPISTAGE, pas un diagnostic. Un score ≥ 11 justifie un avis spécialisé. Les sous-échelles A et D sont validées séparément.`,
  references: [
    {
      type: 'pubmed',
      title: 'Zigmond AS, Snaith RP. The hospital anxiety and depression scale. Acta Psychiatr Scand 1983',
      pmid: '6880820',
    },
    {
      type: 'pubmed',
      title: 'Bjelland I et al. The validity of the Hospital Anxiety and Depression Scale. An updated literature review. J Psychosom Res 2002',
      pmid: '11832252',
    },
  ],
}

export default had
