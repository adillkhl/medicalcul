import type { FormulaDefinition } from '../types'

const afsrEndometriose: FormulaDefinition = {
  id: 'afsr_endometriose',
  slug: 'afsr_endometriose',
  name: 'AFSr, Endométriose (Score)',
  specialty: 'gynecologie',
  category: 'Endométriose',
  description: 'Classification AFSr (American Fertility Society révisée) pour la cotation de la sévérité de l endométriose.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'lpa_superficiel',
      type: 'radio',
      label: 'Lésions péritonéales superficielles',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 1, label: '< 1 cm' },
        { value: 2, label: '1-3 cm' },
        { value: 4, label: '> 3 cm' },
      ],
    },
    {
      id: 'lpa_profond',
      type: 'radio',
      label: 'Lésions péritonéales profondes',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 2, label: '< 1 cm' },
        { value: 4, label: '1-3 cm' },
        { value: 6, label: '> 3 cm' },
      ],
    },
    {
      id: 'ovaire_d_superf',
      type: 'radio',
      label: 'Ovaire D — Lésions superficielles',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 1, label: '< 1 cm' },
        { value: 2, label: '1-3 cm' },
        { value: 4, label: '> 3 cm ou endométriome rompu' },
      ],
    },
    {
      id: 'ovaire_d_profond',
      type: 'radio',
      label: 'Ovaire D — Lésions profondes',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 4, label: '< 1 cm' },
        { value: 8, label: '1-3 cm' },
        { value: 16, label: '> 3 cm ou endométriome rompu' },
      ],
    },
    {
      id: 'ovaire_g_superf',
      type: 'radio',
      label: 'Ovaire G — Lésions superficielles',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 1, label: '< 1 cm' },
        { value: 2, label: '1-3 cm' },
        { value: 4, label: '> 3 cm ou endométriome rompu' },
      ],
    },
    {
      id: 'ovaire_g_profond',
      type: 'radio',
      label: 'Ovaire G — Lésions profondes',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 4, label: '< 1 cm' },
        { value: 8, label: '1-3 cm' },
        { value: 16, label: '> 3 cm ou endométriome rompu' },
      ],
    },
    {
      id: 'culsac_oblit',
      type: 'radio',
      label: 'Oblitération du cul-de-sac de Douglas',
      options: [
        { value: 0, label: 'Absente' },
        { value: 4, label: 'Partielle' },
        { value: 40, label: 'Complète' },
      ],
    },
  ],
  calculate: (values) => {
    const score =
      (parseInt(values.lpa_superficiel) || 0) +
      (parseInt(values.lpa_profond) || 0) +
      (parseInt(values.ovaire_d_superf) || 0) +
      (parseInt(values.ovaire_d_profond) || 0) +
      (parseInt(values.ovaire_g_superf) || 0) +
      (parseInt(values.ovaire_g_profond) || 0) +
      (parseInt(values.culsac_oblit) || 0)

    let stage: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (score <= 5) { stage = 'Stade I (Minime)'; severity = 'low' }
    else if (score <= 15) { stage = 'Stade II (Légère)'; severity = 'low' }
    else if (score <= 40) { stage = 'Stade III (Modérée)'; severity = 'moderate' }
    else { stage = 'Stade IV (Sévère)'; severity = 'critical' }

    return {
      value: score,
      label: `Score AFSr : ${score} — ${stage}`,
      severity,
      ranges: [
        { min: 0, max: 5, label: 'Stade I (Minime)', severity: 'low', recommendation: 'Exérèse des lésions. Traitement médical antalgique de 1ère intention (AINS, œstroprogestatifs).' },
        { min: 6, max: 15, label: 'Stade II (Légère)', severity: 'low', recommendation: 'Exérèse chirurgicale des lésions. Traitement hormonal (contraception oestroprogestative ou progestatif seul).' },
        { min: 16, max: 40, label: 'Stade III (Modérée)', severity: 'moderate', recommendation: 'Chirurgie conservatrice par cœlioscopie. Traitement hormonal post-opératoire. Information sur la fertilité.' },
        { min: 41, max: 150, label: 'Stade IV (Sévère)', severity: 'critical', recommendation: 'Chirurgie complexe par cœlioscopie (exérèse complète des lésions profondes). Orientation vers centre spécialisé d endométriose. Préservation de la fertilité à discuter.' },
      ],
    }
  },
  interpretation: `La **classification AFSr** (American Society for Reproductive Medicine, révisée 1996) est la plus utilisée pour coter la sévérité de l endométriose lors de la cœlioscopie.

**Stades :**
- **Stade I (1–5)** : Minime. Lésions superficielles isolées.
- **Stade II (6–15)** : Légère. Lésions plus étendues mais sans atteinte profonde significative.
- **Stade III (16–40)** : Modérée. Endométriomes ovariens et/ou adhérences.
- **Stade IV (41+)** : Sévère. Atteinte profonde, adhérences denses, Douglas oblitéré.

Le score combine la taille, la profondeur, la bilatéralité des lésions et l importance des adhérences.`,
  clinicalCommentary: `La classification AFSr corrèle imparfaitement avec la douleur et la fertilité. Des lésions minimes peuvent être très symptomatiques. Inversement, un stade IV peut être asymptomatique. Ne pas retarder la prise en charge thérapeutique sur le seul score. L examen histologique est indispensable pour confirmer le diagnostic.`,
  references: [
    {
      type: 'pubmed',
      title: 'ASRM. Revised American Society for Reproductive Medicine classification of endometriosis. Fertil Steril 1997',
      pmid: '8981579',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Recommandations pour la prise en charge de l endométriose (2021)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default afsrEndometriose
