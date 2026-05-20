import type { FormulaDefinition } from '../types'

const figomyome: FormulaDefinition = {
  id: 'figomyome',
  slug: 'figomyome',
  name: 'FIGO, fibromes utérins (Classification)',
  specialty: 'gynecologie',
  category: 'Fibromes utérins',
  description: 'Classification FIGO (International Federation of Gynecology and Obstetrics) pour la localisation des fibromes utérins.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'type_subserreux',
      type: 'boolean',
      label: 'Type 0-2 — Sous-séreux (pédiculé ou sessile)',
      weight: 0,
    },
    {
      id: 'type_intramural',
      type: 'boolean',
      label: 'Type 3-5 — Intramural ou contact endomètre',
      weight: 0,
    },
    {
      id: 'type_sousmuqueux',
      type: 'boolean',
      label: 'Type 0-2 — Sous-muqueux (contact cavité)',
      weight: 0,
    },
    {
      id: 'type_cervical',
      type: 'boolean',
      label: 'Type 8 — Cervical / autre',
      weight: 0,
    },
    {
      id: 'taille',
      type: 'radio',
      label: 'Taille du plus gros fibrome',
      options: [
        { value: 0, label: '< 3 cm (petit)' },
        { value: 1, label: '3-6 cm (moyen)' },
        { value: 2, label: '> 6 cm (gros)' },
      ],
    },
    {
      id: 'nombre',
      type: 'radio',
      label: 'Nombre de fibromes',
      options: [
        { value: 0, label: '1 (unique)' },
        { value: 1, label: '2-4 (multiples)' },
        { value: 2, label: '≥ 5 (nombreux)' },
      ],
    },
    {
      id: 'symptomes',
      type: 'radio',
      label: 'Symptômes',
      options: [
        { value: 0, label: 'Asymptomatique' },
        { value: 1, label: 'Ménorragies modérées' },
        { value: 2, label: 'Ménorragies sévères / douleurs / compression' },
      ],
    },
  ],
  calculate: (values) => {
    let typeLabel = 'Non précisé'
    if (values.type_sousmuqueux) typeLabel = 'Type 0-2 — Sous-muqueux (contact avec la cavité endométriale)'
    else if (values.type_subserreux) typeLabel = 'Type 6-7 — Sous-séreux (pédiculé ou sessile)'
    else if (values.type_intramural) typeLabel = 'Type 3-5 — Intramural (atteinte du myomètre)'
    else if (values.type_cervical) typeLabel = 'Type 8 — Cervical / Autre (ligament large, disséminé)'

    const t = parseInt(values.taille) || 0
    const n = parseInt(values.nombre) || 0
    const s = parseInt(values.symptomes) || 0
    const graviteScore = t + n + s

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (graviteScore <= 1) severity = 'low'
    else if (graviteScore <= 3) severity = 'moderate'
    else severity = 'high'

    return {
      value: graviteScore,
      label: typeLabel,
      severity,
      details: {
        'Type FIGO': typeLabel,
        'Taille': ['< 3 cm', '3-6 cm', '> 6 cm'][t] || '',
        'Nombre': ['Unique', '2-4', '≥ 5'][n] || '',
        'Symptômes': ['Asymptomatique', 'Ménorragies modérées', 'Sévère'][s] || '',
      },
      ranges: [
        { min: 0, max: 1, label: 'Fibrome peu symptomatique', severity: 'low', recommendation: 'Surveillance simple. Aucun traitement nécessaire si asymptomatique.' },
        { min: 2, max: 3, label: 'Fibrome modérément symptomatique', severity: 'moderate', recommendation: 'Traitement médical : AINS, progestatifs, SIU au lévonorgestrel. Discuter embolisation ou myomectomie selon projet parental.' },
        { min: 4, max: 6, label: 'Fibrome sévèrement symptomatique', severity: 'high', recommendation: 'Traitement chirurgical discuté : myomectomie (si désir de grossesse) ou hystérectomie (si fin du projet parental). Alternatives : embolisation, ultrason focalisé (HIFU).' },
      ],
    }
  },
  interpretation: `La **classification FIGO** (2011) des fibromes utérins distingue 8 types selon la localisation :

- **Type 0** : Sous-muqueux pédiculé
- **Type 1** : Sous-muqueux sessile (> 50 % dans la cavité)
- **Type 2** : Sous-muqueux (< 50 % dans la cavité)
- **Type 3** : Intramural contact avec l endomètre
- **Type 4** : Intramural strict
- **Type 5** : Intramural contact avec la séreuse
- **Type 6** : Sous-séreux sessile
- **Type 7** : Sous-séreux pédiculé
- **Type 8** : Cervical / intra-ligamentaire / disséminé

Cette classification guide le choix thérapeutique.`,
  clinicalCommentary: `Les fibromes sous-muqueux (type 0-2) sont les plus symptomatiques (ménorragies, infertilité). Les fibromes intramuraux (type 3-5) peuvent comprimer la cavité et altérer la fertilité. Les fibromes sous-séreux (type 6-7) sont souvent asymptomatiques mais peuvent comprimer les organes de voisinage. L IRM pelvienne est l examen de référence pour préciser le type FIGO.`,
  references: [
    {
      type: 'pubmed',
      title: 'Munro MG et al. FIGO classification system (PALM-COEIN) for causes of abnormal uterine bleeding. Int J Gynaecol Obstet 2011',
      pmid: '21550097',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prise en charge des fibromes utérins (Recommandations 2021)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default figomyome
