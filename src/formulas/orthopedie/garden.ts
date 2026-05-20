import type { FormulaDefinition } from '../types'

const garden: FormulaDefinition = {
  id: 'garden',
  slug: 'garden',
  name: 'Garden (Classification)',
  specialty: 'orthopedie',
  category: 'Fractures',
  description: 'Classification de Garden pour les fractures du col du fémur. Basée sur le déplacement de la fracture, elle guide le pronostic et le choix thérapeutique (ostéosynthèse vs prothèse).',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'displacement',
      type: 'radio',
      label: 'Caractéristiques radiologiques de la fracture',
      options: [
        { value: 1, label: 'Garden I — Fracture incomplète/engrenée, col en valgus, travées trabéculaires inféro-médiales intactes' },
        { value: 2, label: 'Garden II — Fracture complète sans déplacement, travées trabéculaires interrompues mais pas de translation' },
        { value: 3, label: 'Garden III — Fracture complète avec déplacement partiel (col en varus), rotation externe du fragment proximal' },
        { value: 4, label: 'Garden IV — Fracture complète avec déplacement complet, contact perdu entre les fragments (col totalement déplacé)' },
      ],
    },
    {
      id: 'patient_age',
      type: 'number',
      label: 'Âge du patient',
      unit: 'ans',
      min: 18,
      max: 120,
      step: 1,
    },
    {
      id: 'bone_quality',
      type: 'radio',
      label: 'Qualité osseuse',
      options: [
        { value: 1, label: 'Bonne (patient jeune, pas d\'ostéoporose connue)' },
        { value: 2, label: 'Ostéoporose modérée (T-score -1 à -2,5)' },
        { value: 3, label: 'Ostéoporose sévère (T-score < -2,5 ou fracture ostéoporotique antérieure)' },
      ],
    },
  ],
  calculate: (values) => {
    const gardenStage = values.displacement as number
    const age = values.patient_age as number
    const boneQuality = values.bone_quality as number

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''
    let riskNecrosis = ''

    if (gardenStage === 1) {
      label = 'Garden I — Fracture engrenée du col fémoral'
      severity = 'low'
      riskNecrosis = 'Risque d\'ostéonécrose céphalique : < 5%'
      recommendation = 'Traitement orthopédique (clou DHS ou vis canulées) ou ostéosynthèse percutanée. Appui précoce possible si engrènement solide.'
    } else if (gardenStage === 2) {
      label = 'Garden II — Fracture complète non déplacée'
      severity = 'moderate'
      riskNecrosis = 'Risque d\'ostéonécrose céphalique : 5-15%'
      recommendation = 'Ostéosynthèse par vis canulées ou DHS. Repos strict pendant 6-8 semaines.'
    } else if (gardenStage === 3) {
      label = 'Garden III — Fracture déplacée partiellement'
      severity = 'high'
      riskNecrosis = 'Risque d\'ostéonécrose céphalique : 15-30%'
      if (age > 70 || boneQuality >= 2) {
        recommendation = 'Prothèse (PTA si âge > 70 ans, PTG si actif jeune). Ostéosynthèse possible chez le sujet jeune (< 60 ans) avec bonne qualité osseuse.'
      } else {
        recommendation = 'Ostéosynthèse par DHS ou vis. Réduction anatomique au préalable.'
      }
    } else {
      label = 'Garden IV — Fracture complètement déplacée'
      severity = 'critical'
      riskNecrosis = 'Risque d\'ostéonécrose céphalique : > 30% (jusqu\'à 50%)'
      if (age > 65 || boneQuality >= 2) {
        recommendation = 'Prothèse totale de hanche (PTA) ou arthroplastie hémi-prothétique selon l\'âge et le niveau d\'activité. Ostéosynthèse contre-indiquée (haut risque de pseudarthrose et ostéonécrose).'
      } else {
        recommendation = 'Ostéosynthèse par DHS ou vis canulées (chez le sujet jeune de moins de 60 ans avec bonne qualité osseuse). Réduction anatomique impérative.'
      }
    }

    return {
      value: gardenStage,
      label,
      severity,
      details: {
        'Stade Garden': `Garden ${['I', 'II', 'III', 'IV'][gardenStage - 1]}`,
        'Âge': `${age} ans`,
        'Qualité osseuse': ['Bonne', 'Ostéoporose modérée', 'Ostéoporose sévère'][boneQuality - 1],
        'Risque d\'ostéonécrose': riskNecrosis,
      },
      ranges: [
        { min: 1, max: 1, label: 'Garden I — Non déplacé/engrené', severity: 'low' },
        { min: 2, max: 2, label: 'Garden II — Complet non déplacé', severity: 'moderate' },
        { min: 3, max: 3, label: 'Garden III — Déplacé partiel', severity: 'high' },
        { min: 4, max: 4, label: 'Garden IV — Totalement déplacé', severity: 'critical' },
      ],
    }
  },
  interpretation: 'La **classification de Garden** (1961) des fractures du col du fémur comporte 4 stades basés sur le déplacement radiographique :\n\n- **Garden I** : fracture engrenée en valgus, incomplète\n- **Garden II** : fracture complète sans déplacement\n- **Garden III** : fracture complète avec déplacement partiel, rotation externe\n- **Garden IV** : fracture complète avec déplacement total\n\nPlus le stade est élevé, plus le risque de nécrose de la tête fémorale est élevé, et plus l\'indication prothétique est forte.',
  clinicalCommentary: 'La classification de Garden est la plus utilisée pour les fractures du col du fémur. Le choix entre ostéosynthèse et prothèse dépend de l\'âge, de la qualité osseuse, du stade Garden et du niveau d\'activité. En règle générale : < 60-65 ans → ostéosynthèse ; > 70 ans → prothèse. Chez les patients âgés, la chirurgie précoce (< 48h) réduit la mortalité à 1 an.',
  references: [
    {
      type: 'pubmed',
      title: 'Garden RS. Low-angle fixation in fractures of the femoral neck. J Bone Joint Surg Br 1961',
      pmid: '13914807',
    },
    {
      type: 'pubmed',
      title: 'Bhandari M et al. Operative management of displaced femoral neck fractures in elderly patients. J Bone Joint Surg Am 2005',
      pmid: '16085616',
    },
  ],
}

export default garden
