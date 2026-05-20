import type { FormulaDefinition } from '../types'

const cauchoix: FormulaDefinition = {
  id: 'cauchoix',
  slug: 'cauchoix',
  name: 'Cauchoix et Duparc (Classification)',
  specialty: 'orthopedie',
  category: 'Fractures',
  description: 'Classification de Cauchoix et Duparc pour les fractures ouvertes des membres. Évalue la gravité de l\'atteinte cutanée, musculaire, vasculaire et nerveuse pour guider la prise en charge chirurgicale.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'skin_wound',
      type: 'radio',
      label: 'Plaie cutanée',
      options: [
        { value: 1, label: 'Type I — Plaie punctiforme, < 1 cm, propre' },
        { value: 2, label: 'Type II — Plaie > 1 cm, sans décollement' },
        { value: 3, label: 'Type IIIa — Plaie large avec décollement cutané' },
        { value: 4, label: 'Type IIIb — Plaie avec délabrement cutané nécessitant une couverture' },
      ],
    },
    {
      id: 'muscle_injury',
      type: 'radio',
      label: 'Atteinte musculaire / parties molles',
      options: [
        { value: 1, label: 'I — Peu ou pas de nécrose musculaire' },
        { value: 2, label: 'II — Nécrose musculaire modérée (< 50% du muscle)' },
        { value: 3, label: 'III — Nécrose musculaire sévère (> 50%) ou compartiment' },
      ],
    },
    {
      id: 'vascular_status',
      type: 'radio',
      label: 'État vasculaire',
      options: [
        { value: 1, label: 'V+ — Pulsations distales présentes' },
        { value: 2, label: 'V± — Pulsations diminuées' },
        { value: 3, label: 'V- — Absence de pulsations distales (ischémie)' },
      ],
    },
    {
      id: 'nerve_status',
      type: 'radio',
      label: 'État neurologique',
      options: [
        { value: 1, label: 'N+ — Sensibilité et motricité normales' },
        { value: 2, label: 'N± — Hypoesthésie, déficit moteur partiel' },
        { value: 3, label: 'N- — Anesthésie, paralysie complète' },
      ],
    },
  ],
  calculate: (values) => {
    const skin = values.skin_wound as number
    const muscle = values.muscle_injury as number
    const vascular = values.vascular_status as number
    const nerve = values.nerve_status as number

    // Determine type
    let type = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (skin === 1 && muscle <= 1 && vascular <= 1 && nerve <= 1) {
      type = 'Type I'
      severity = 'low'
      recommendation = 'Parage chirurgical, fermeture primaire différée. Antibioprophylaxie (céfazoline 2g IV). VAT. Surveillance 24-48h.'
    } else if (skin <= 2 && muscle <= 2 && vascular <= 1 && nerve <= 1) {
      type = 'Type II'
      severity = 'moderate'
      recommendation = 'Parage large, lavage abondant. Stabilisation du foyer de fracture. Antibioprophylaxie (céfazoline + gentamicine). Surveillance de la vitalité cutanée. VAT.'
    } else if (skin >= 3 || muscle === 3 || vascular === 2) {
      type = 'Type IIIa'
      severity = 'high'
      recommendation = 'URGENCE CHIRURGICALE. Parage large + lavage pulsé. Couverture cutanée à discuter. Fixation externe si contamination majeure. ATB large spectre (céfazoline + gentamicine + métronidazole). Surveillance rapprochée (syndrome de loge).'
    } else {
      type = 'Type IIIb'
      severity = 'critical'
      recommendation = 'URGENCE VITALE. Chirurgie en urgence : parage, revascularisation (si V-), réparation nerveuse (si N-). Fixation externe. Couverture différée par lambeau. ATB large spectre prolongé. Surveillance en réanimation.'
    }

    return {
      value: ['Type I', 'Type II', 'Type IIIa', 'Type IIIb'].indexOf(type),
      label: type,
      severity,
      details: {
        'Plaie cutanée': ['I', 'II', 'IIIa', 'IIIb'][skin - 1],
        'Muscle': ['I', 'II', 'III'][muscle - 1],
        'Vasculaire': ['V+', 'V±', 'V-'][vascular - 1],
        'Nerf': ['N+', 'N±', 'N-'][nerve - 1],
      },
      ranges: [
        { min: 0, max: 0, label: 'Type I', severity: 'low', recommendation },
        { min: 1, max: 1, label: 'Type II', severity: 'moderate' },
        { min: 2, max: 2, label: 'Type IIIa', severity: 'high' },
        { min: 3, max: 3, label: 'Type IIIb', severity: 'critical' },
      ],
    }
  },
  interpretation: 'La **classification de Cauchoix et Duparc** (1976) évalue la gravité des fractures ouvertes des membres à partir de 4 critères : peau, muscle, vaisseaux et nerfs.\n\n**Types :**\n- **Type I** : Plaie punctiforme, muscle intact, vaisseaux et nerfs normaux\n- **Type II** : Plaie > 1 cm, nécrose musculaire modérée\n- **Type IIIa** : Délabrement cutané, nécrose musculaire sévère ou ischémie partielle\n- **Type IIIb** : Plaie avec perte de substance cutanée (besoin de lambeau), ischémie et/ou paralysie',
  clinicalCommentary: 'La classification de Cauchoix et Duparc est complémentaire de celle de Gustilo et Anderson. Elle insiste sur la nécessité de prendre en compte le muscle, le nerf et le vaisseau. Une fracture avec ischémie (V-) est une URGENCE ABSOLUE nécessitant une revascularisation dans les 6 heures. Toujours vérifier la vaccination antitétanique (VAT) et discuter l\'antibiothérapie prophylactique selon la contamination.',
  references: [
    {
      type: 'pubmed',
      title: 'Cauchoix J, Duparc J, Boulez P. Traitement des fractures ouvertes de jambe. Rev Chir Orthop 1976',
      pmid: '134430',
    },
    {
      type: 'pubmed',
      title: 'Duparc J. Classification des fractures ouvertes. Conférences d\'enseignement SOFCOT 2000',
      pmid: 'null',
    },
  ],
}

export default cauchoix
