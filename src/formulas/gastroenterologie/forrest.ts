import type { FormulaDefinition } from '../types'

const forrest: FormulaDefinition = {
  id: 'forrest',
  slug: 'forrest',
  name: 'Forrest (Classification) — Hémorragie digestive haute',
  specialty: 'gastroenterologie',
  category: 'Hémorragie digestive',
  description: 'Classification endoscopique du risque de récidive hémorragique des ulcères gastroduodénaux',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'stade',
      type: 'radio',
      label: 'Stade endoscopique de Forrest',
      options: [
        { value: 1, label: 'IA — Saignement actif en jet (artériel)' },
        { value: 2, label: 'IB — Saignement actif suintant (nappant)' },
        { value: 3, label: 'IIA — Vaisseau visible non hémorragique' },
        { value: 4, label: 'IIB — Caillot adhérent' },
        { value: 5, label: 'IIC — Tâche pigmentée (hématine plate)' },
        { value: 6, label: 'III — Ulcère à base propre (fibre blanche)' },
      ],
    },
  ],
  calculate: (values) => {
    const stade = Number(values.stade)

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (stade === 1) {
      severity = 'critical'
      label = 'Forrest IA — Saignement actif en jet'
      recommendation = 'URGENCE. Hémostase endoscopique immédiate (clip, injection adrénaline, coagulation). IPP haute dose IV. Surveillance en réanimation. Risque de récidive > 90 % sans traitement.'
    } else if (stade === 2) {
      severity = 'high'
      label = 'Forrest IB — Saignement actif suintant'
      recommendation = 'URGENCE. Hémostase endoscopique. IPP haute dose IV. Surveillance en soins intensifs.'
    } else if (stade === 3) {
      severity = 'high'
      label = 'Forrest IIA — Vaisseau visible'
      recommendation = 'Risque élevé de récidive (~50 %). Hémostase endoscopique prophylactique. IPP haute dose IV. Surveillance.'
    } else if (stade === 4) {
      severity = 'moderate'
      label = 'Forrest IIB — Caillot adhérent'
      recommendation = 'Risque modéré (~30 %). Discuter hémostase endoscopique. IPP haute dose IV. Surveillance 24-48h. Certains préfèrent laisser le caillot en place.'
    } else if (stade === 5) {
      severity = 'low'
      label = 'Forrest IIC — Tâche pigmentée'
      recommendation = 'Risque faible (< 10 %). Pas d\'hémostase endoscopique nécessaire. IPP oral. Réintroduction alimentaire.'
    } else {
      severity = 'low'
      label = 'Forrest III — Base propre'
      recommendation = 'Risque très faible (< 3 %). Pas d\'hémostase. IPP oral. Sortie possible selon contexte.'
    }

    return {
      value: stade,
      label,
      severity,
      ranges: [
        { min: 1, max: 1, label: 'IA — Saignement actif en jet', severity: 'critical', recommendation: 'Hémostase endoscopique immédiate. Réanimation.' },
        { min: 2, max: 2, label: 'IB — Saignement actif suintant', severity: 'high', recommendation: 'Hémostase endoscopique. Soins intensifs.' },
        { min: 3, max: 3, label: 'IIA — Vaisseau visible', severity: 'high', recommendation: 'Hémostase prophylactique. IPP haute dose.' },
        { min: 4, max: 4, label: 'IIB — Caillot adhérent', severity: 'moderate', recommendation: 'IPP haute dose. Discuter hémostase.' },
        { min: 5, max: 5, label: 'IIC — Tâche pigmentée', severity: 'low', recommendation: 'Pas d\'hémostase. IPP oral.' },
        { min: 6, max: 6, label: 'III — Base propre', severity: 'low', recommendation: 'Pas d\'hémostase. Sortie envisageable.' },
      ],
    }
  },
  interpretation: `La **classification de Forrest** évalue le risque de récidive hémorragique après une hémorragie digestive haute (ulcère gastrique ou duodénal).

| Stade | Risque récidive | Conduite |
|-------|----------------|----------|
| IA (jet actif) | > 90 % | Hémostase immédiate |
| IB (suintement) | ~50-80 % | Hémostase immédiate |
| IIA (vaisseau visible) | ~50 % | Hémostase prophylactique |
| IIB (caillot adhérent) | ~30 % | Discuter hémostase |
| IIC (tâche pigmentée) | < 10 % | Pas d\'hémostase |
| III (base propre) | < 3 % | Pas d\'hémostase |

Forrest I-IIA nécessitent un traitement endoscopique et IPP haute dose (bolus 80 mg puis 8 mg/h).`,
  clinicalCommentary: `La classification de Forrest est le gold standard endoscopique pour le risque de récidive hémorragique. Combinée au score de Rockall ou Glasgow-Blatchford, elle permet une stratification précise du risque. Depuis l’avènement des IPP haute dose, le risque de récidive des Forrest IIB est controversé : certains recommandent le retrait du caillot et traitement du vaisseau sous-jacent. Les Forrest IA-IIA nécessitent une surveillance en réanimation pendant 24-48h.`,
  references: [
    {
      type: 'pubmed',
      title: 'Forrest JA et al. Endoscopy in upper gastrointestinal bleeding. Lancet 1974',
      pmid: '4143014',
    },
    {
      type: 'guideline',
      title: 'Recommandations SFED — Hémorragie digestive haute (2021)',
      url: 'https://www.sfed.org',
    },
  ],
}

export default forrest
