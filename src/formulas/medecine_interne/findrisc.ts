import type { FormulaDefinition } from '../types'

const findrisc: FormulaDefinition = {
  id: 'findrisc',
  slug: 'findrisc',
  name: 'Findrisc — Risque de diabète de type 2 à 10 ans',
  specialty: 'medecine_interne',
  category: 'Diabétologie',
  description: 'Questionnaire Finnish Diabetes Risk Score — Évaluation du risque de développer un diabète de type 2 dans les 10 ans.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 0, label: '< 45 ans' },
        { value: 2, label: '45–54 ans' },
        { value: 3, label: '55–64 ans' },
        { value: 4, label: '≥ 65 ans' },
      ],
    },
    {
      id: 'imc',
      type: 'radio',
      label: 'Indice de masse corporelle (IMC, kg/m²)',
      options: [
        { value: 0, label: '< 25 kg/m²' },
        { value: 1, label: '25–30 kg/m²' },
        { value: 3, label: '≥ 30 kg/m²' },
      ],
    },
    {
      id: 'tour_taille',
      type: 'radio',
      label: 'Tour de taille mesuré sous les côtes (cm)',
      options: [
        { value: 0, label: '< 94 cm (H) / < 80 cm (F)' },
        { value: 3, label: '94–102 cm (H) / 80–88 cm (F)' },
        { value: 4, label: '> 102 cm (H) / > 88 cm (F)' },
      ],
    },
    {
      id: 'activite_phy',
      type: 'boolean',
      label: 'Activité physique < 30 min/jour (au travail ou loisir)',
    },
    {
      id: 'legumes_fruits',
      type: 'boolean',
      label: 'Consommation quotidienne de légumes/fruits < 1 portion/jour',
    },
    {
      id: 'hta_traitement',
      type: 'boolean',
      label: 'Traitement antihypertenseur (présent ou passé)',
    },
    {
      id: 'glycemie_elevee',
      type: 'boolean',
      label: 'Antécédent de glycémie élevée (ou diabète gestationnel)',
    },
    {
      id: 'diabete_famille',
      type: 'radio',
      label: 'Antécédents familiaux de diabète (type 2)',
      options: [
        { value: 0, label: 'Aucun' },
        { value: 3, label: 'Oui (autre parent, frère/soeur, enfant)' },
        { value: 5, label: 'Oui (les deux parents ou parent + enfant/sibling)' },
      ],
    },
  ],
  calculate: (values) => {
    let score = 0
    score += values.age ?? 0
    score += values.imc ?? 0
    score += values.tour_taille ?? 0
    if (values.activite_phy) score += 2
    if (values.legumes_fruits) score += 1
    if (values.hta_traitement) score += 2
    if (values.glycemie_elevee) score += 5
    score += values.diabete_famille ?? 0

    let risk: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (score >= 20) {
      risk = '> 30%'
      severity = 'critical'
    } else if (score >= 15) {
      risk = '20–30%'
      severity = 'high'
    } else if (score >= 12) {
      risk = '10–20%'
      severity = 'moderate'
    } else {
      risk = score >= 7 ? '5–10%' : '< 5%'
      severity = score >= 7 ? 'moderate' : 'low'
    }

    return {
      value: score,
      label: `Score FINDRISC = ${score} — Risque ${risk} de DT2 à 10 ans`,
      severity,
      risk: parseInt(risk.replace(/[^0-9]/g, '')) || 5,
      riskUnit: '% risque DT2 à 10 ans',
      ranges: [
        { min: 0, max: 6, label: '0–6 : Risque faible (< 5%)', severity: 'low' },
        { min: 7, max: 11, label: '7–11 : Risque légèrement augmenté (5–10%)', severity: 'low' },
        { min: 12, max: 14, label: '12–14 : Risque modéré (10–20%)', severity: 'moderate' },
        { min: 15, max: 19, label: '15–19 : Risque élevé (20–30%)', severity: 'high' },
        { min: 20, max: 99, label: '≥ 20 : Risque très élevé (> 30%)', severity: 'critical' },
      ],
    }
  },
  interpretation: `**FINDRISC** (FINnish Diabetes Risk Score) évalue le risque de développer un diabète de type 2 dans les 10 ans.

| Score | Risque DT2 à 10 ans |
|---|---|
| < 7 | Faible (< 5 %) |
| 7–11 | Légèrement augmenté (5–10 %) |
| 12–14 | Modéré (10–20 %) |
| 15–19 | Élevé (20–30 %) |
| ≥ 20 | Très élevé (> 30 %) |

**Si score ≥ 12 :** proposer une glycémie à jeun ou une HGPO. Conseils hygiéno-diététiques.`,
  clinicalCommentary: `Le FINDRISC est recommandé par la HAS comme outil de dépistage du DT2 en soins primaires. Il permet de cibler les patients à risque élevé pour une prévention primaire efficace (intervention sur le mode de vie, metformine si prédiabète).`,
  references: [
    {
      type: 'pubmed',
      title: 'Lindström J, Tuomilehto J. The diabetes risk score. Diabetes Care 2003',
      pmid: '12610029',
    },
    {
      type: 'guideline',
      title: 'HAS — Stratégie de dépistage du diabète de type 2',
      url: 'https://www.has-sante.fr/jcms/c_2013583',
    },
  ],
}

export default findrisc
