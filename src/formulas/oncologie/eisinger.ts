import type { FormulaDefinition } from '../types'

const eisinger: FormulaDefinition = {
  id: 'eisinger',
  slug: 'eisinger',
  name: 'Eisinger (Score)',
  specialty: 'oncologie',
  category: 'Sein',
  description: 'Score d\'Eisinger — outil d\'aide à la décision d\'orientation vers une consultation d\'oncogénétique pour les patientes atteintes d\'un cancer du sein ou à risque familial.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'patient_cancer',
      type: 'boolean',
      label: 'Patiente atteinte d\'un cancer du sein',
    },
    {
      id: 'patient_age_cancer',
      type: 'radio',
      label: 'Âge au diagnostic du cancer du sein de la patiente',
      options: [
        { value: 3, label: '≤ 35 ans' },
        { value: 2, label: '36-40 ans' },
        { value: 1, label: '41-50 ans' },
        { value: 0, label: '> 50 ans' },
      ],
    },
    {
      id: 'bilateral',
      type: 'boolean',
      label: 'Cancer du sein bilatéral ou métachrone (second cancer controlatéral)',
    },
    {
      id: 'male_breast',
      type: 'boolean',
      label: 'Cancer du sein chez un homme dans la famille',
    },
    {
      id: 'ovarian_cancer',
      type: 'boolean',
      label: 'Cancer de l\'ovaire dans la famille (même côté que le cancer du sein)',
    },
    {
      id: 'first_degree',
      type: 'radio',
      label: 'Nombre de parents du 1er degré (mère, soeur, fille) atteints d\'un cancer du sein',
      options: [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2 ou plus' },
      ],
    },
    {
      id: 'second_degree',
      type: 'radio',
      label: 'Nombre de parents du 2e degré (grand-mère, tante) atteints d\'un cancer du sein',
      options: [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2 ou plus' },
      ],
    },
  ],
  calculate: (values) => {
    const hasCancer = values.patient_cancer as boolean
    const ageScore = values.patient_age_cancer as number
    const bilateral = values.bilateral as boolean
    const maleBreast = values.male_breast as boolean
    const ovarianCa = values.ovarian_cancer as boolean
    const firstDeg = values.first_degree as number
    const secondDeg = values.second_degree as number

    let total = 0

    if (hasCancer) {
      total += ageScore
      if (bilateral) total += 2
    }

    if (maleBreast) total += 2
    if (ovarianCa) total += 3

    if (firstDeg === 1) total += 1
    else if (firstDeg >= 2) total += 2

    if (secondDeg === 1) total += 0.5
    else if (secondDeg >= 2) total += 1

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (total < 3) {
      label = `Eisinger ${total} — Risque génétique faible`
      severity = 'low'
      recommendation = 'Pas d\'indication à une consultation d\'oncogénétique. Surveillance standard.'
    } else if (total < 5) {
      label = `Eisinger ${total} — Risque génétique intermédiaire`
      severity = 'moderate'
      recommendation = 'Discuter la consultation d\'oncogénétique. Évaluation selon l\'âge et les antécédents familiaux. Information sur les critères de test BRCA.'
    } else {
      label = `Eisinger ${total} — Risque génétique élevé`
      severity = 'high'
      recommendation = 'Orientation vers une consultation d\'oncogénétique INDISPENSABLE. Recherche de mutation BRCA1/BRCA2. Conseil génétique. Dépistage familial.'
    }

    return {
      value: Math.round(total * 10) / 10,
      label,
      severity,
      details: {
        'Âge au diagnostic': ['> 50 ans', '41-50 ans', '36-40 ans', '≤ 35 ans'][Math.min(ageScore, 3)],
        'Bilatéral': bilateral ? 'Oui' : 'Non',
        'Cancer sein homme': maleBreast ? 'Oui' : 'Non',
        'Cancer ovaire famille': ovarianCa ? 'Oui' : 'Non',
        'Parents 1er degré': firstDeg,
        'Parents 2e degré': secondDeg,
      },
      ranges: [
        { min: 0, max: 2.9, label: 'Risque faible — oncogénétique non indiquée', severity: 'low' },
        { min: 3, max: 4.9, label: 'Risque intermédiaire — à discuter', severity: 'moderate' },
        { min: 5, max: 16, label: 'Risque élevé — oncogénétique indiquée', severity: 'high' },
      ],
    }
  },
  interpretation: "Le **score d\'Eisinger** permet d\'évaluer la probabilité d\'une prédisposition génétique (BRCA1/BRCA2) au cancer du sein et de l\'ovaire.\n\n**Critères :**\n- Âge au diagnostic du cancer du sein de la patiente : ≤ 35 ans (3 pts), 36-40 ans (2 pts), 41-50 ans (1 pt)\n- Cancer du sein bilatéral : 2 pts\n- Cancer du sein chez l\'homme (famille) : 2 pts\n- Cancer de l\'ovaire (famille) : 3 pts\n- Parent 1er degré : 1 pt (1 parent), 2 pts (≥ 2)\n- Parent 2e degré : 0,5 pt (1), 1 pt (≥ 2)\n\n**Seuil :** ≥ 5 → consultation d\'oncogénétique recommandée.",
  clinicalCommentary: "Le score d\'Eisinger est un outil simple de pré-sélection pour l\'oncogénétique. Il ne remplace pas l\'évaluation spécialisée. Les critères de test BRCA ont évolué : en France, la HAS recommande le test chez toute patiente avec cancer du sein ≤ 40 ans, cancer du sein triple négatif ≤ 60 ans, cancer ovariens tous âges, ou antécédent familial évocateur. La recherche de BRCA1/BRCA2 a des implications thérapeutiques (inhibiteurs PARP) et préventives (mammectomie prophylactique, annexectomie).",
  references: [
    {
      type: 'pubmed',
      title: 'Eisinger F et al. Identification of women at high risk for breast cancer: a simple scoring system. Bull Cancer 2001',
      pmid: '11562619',
    },
    {
      type: 'pubmed',
      title: 'Eisinger F et al. A scoring system for genetic counselling of women with familial breast cancer. Lancet 2000',
      pmid: '10891563',
    },
  ],
}

export default eisinger
