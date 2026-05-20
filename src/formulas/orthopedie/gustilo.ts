import type { FormulaDefinition } from '../types'

const gustilo: FormulaDefinition = {
  id: 'gustilo',
  slug: 'gustilo',
  name: 'Gustilo et Anderson (Classification)',
  specialty: 'orthopedie',
  category: 'Fractures',
  description: 'Classification de Gustilo et Anderson pour les fractures ouvertes. Grade l\'étendue de la plaie, la contamination et les lésions associées pour guider le pronostic et la stratégie thérapeutique.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'wound_size',
      type: 'radio',
      label: 'Taille de la plaie',
      options: [
        { value: 1, label: '< 1 cm (propre)' },
        { value: 2, label: '1-10 cm (sans délabrement)' },
        { value: 3, label: '> 10 cm OU délabrement cutané étendu' },
      ],
    },
    {
      id: 'contamination',
      type: 'radio',
      label: 'Contamination',
      options: [
        { value: 0, label: 'Propre — plaie nette, peu de souillures' },
        { value: 1, label: 'Modérée — souillures, corps étrangers' },
        { value: 2, label: 'Sévère — contamination majeure (terre, agricole, eaux usées)' },
      ],
    },
    {
      id: 'muscle_damage',
      type: 'radio',
      label: 'Atteinte musculaire',
      options: [
        { value: 1, label: 'Minime — muscle contus mais viable' },
        { value: 2, label: 'Modérée — nécrose musculaire limitée' },
        { value: 3, label: 'Sévère — nécrose musculaire étendue, syndrome de loge' },
      ],
    },
    {
      id: 'vascular_injury',
      type: 'boolean',
      label: 'Lésion vasculaire nécessitant réparation',
    },
    {
      id: 'avulsion_amputation',
      type: 'boolean',
      label: 'Avulsion sous-cutanée complète ou amputation (Type IIIc)',
    },
  ],
  calculate: (values) => {
    const wound = values.wound_size as number
    const contam = values.contamination as number
    const muscle = values.muscle_damage as number
    const vascular = values.vascular_injury as boolean
    const amputation = values.avulsion_amputation as boolean

    let type = ''
    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''
    let infectionRisk = ''
    let fractureHealing = ''

    if (wound === 1 && contam === 0 && muscle === 1 && !vascular && !amputation) {
      type = 'Type I'
      label = 'Gustilo I — Plaie propre < 1 cm'
      severity = 'low'
      infectionRisk = 'Risque d\'infection : < 2%'
      fractureHealing = 'Consolidation normale (6-12 semaines)'
      recommendation = 'Parage chirurgical simple, fermeture primaire différée. Antibioprophylaxie (céfazoline 2g IV). VAT.'
    } else if (wound <= 2 && contam <= 1 && muscle <= 2 && !vascular && !amputation) {
      type = 'Type II'
      label = 'Gustilo II — Plaie modérée 1-10 cm'
      severity = 'moderate'
      infectionRisk = 'Risque d\'infection : 2-10%'
      fractureHealing = 'Consolidation normale à retardée (8-16 semaines)'
      recommendation = 'Parage chirurgical, lavage abondant. Antibioprophylaxie (céfazoline + gentamicine). Fermeture secondaire.'
    } else if (!amputation && !vascular) {
      type = 'Type IIIa'
      label = 'Gustilo IIIa — Plaie > 10 cm avec couverture possible'
      severity = 'high'
      infectionRisk = 'Risque d\'infection : 5-15%'
      fractureHealing = 'Retard de consolidation fréquent (12-24 semaines)'
      recommendation = 'Parage large + lavage pulsé. Fixation externe si contamination. Antibioprophylaxie large spectre (céfazoline + gentamicine + métronidazole). Couverture secondaire.'
    } else if (vascular && !amputation) {
      type = 'Type IIIc'
      label = 'Gustilo IIIc — Lésion vasculaire nécessitant réparation'
      severity = 'critical'
      infectionRisk = 'Risque d\'infection : 10-50%'
      fractureHealing = 'Consolidation incertaine, risque d\'amputation secondaire élevé'
      recommendation = 'URGENCE ABSOLUE. Réparation vasculaire < 6h (shunt temporaire, pontage). Fixation externe. Parage large. Fasciotomies de principe. ATB large spectre. Réanimation.'
    } else {
      type = 'Type IIIb'
      label = 'Gustilo IIIb — Délabrement avec besoin de lambeau'
      severity = 'critical'
      infectionRisk = 'Risque d\'infection : 10-50%'
      fractureHealing = 'Consolidation retardée ou absence de consolidation'
      recommendation = 'Parage large + lavage pulsé. Couverture par lambeau (musculaire ou fascio-cutané) dans les 72h. Fixation externe. ATB large spectre prolongé.'
    }

    return {
      value: ['Type I', 'Type II', 'Type IIIa', 'Type IIIb', 'Type IIIc'].indexOf(type),
      label,
      severity,
      details: {
        Type: type,
        'Plaie': ['< 1 cm', '1-10 cm', '> 10 cm'][wound - 1],
        'Contamination': ['Propre', 'Modérée', 'Sévère'][contam],
        'Muscle': ['Minime', 'Modérée', 'Sévère'][muscle - 1],
        'Risque d\'infection': infectionRisk,
        'Consolidation': fractureHealing,
      },
      ranges: [
        { min: 0, max: 0, label: 'Type I', severity: 'low' },
        { min: 1, max: 1, label: 'Type II', severity: 'moderate' },
        { min: 2, max: 2, label: 'Type IIIa', severity: 'high' },
        { min: 3, max: 3, label: 'Type IIIb — Lambeau nécessaire', severity: 'critical' },
        { min: 4, max: 4, label: 'Type IIIc — Lésion vasculaire', severity: 'critical' },
      ],
    }
  },
  interpretation: 'La **classification de Gustilo et Anderson** (1984) est la référence pour les fractures ouvertes des membres.\n\n**Types :**\n- **Type I** : Plaie < 1 cm, propre\n- **Type II** : Plaie 1-10 cm, contamination modérée\n- **Type III** : Plaie > 10 cm ou délabrement sévère :\n  - **IIIa** : Couverture possible sans lambeau\n  - **IIIb** : Couverture impossible sans lambeau\n  - **IIIc** : Lésion vasculaire réparable\n\nPlus le type est élevé, plus le risque d\'infection, de pseudarthrose et d\'amputation est important.',
  clinicalCommentary: 'La classification de Gustilo et Anderson est pronostique et guide l\'antibiothérapie et la stratégie chirurgicale. Les types IIIb et IIIc ont un risque majeur d\'infection (jusqu\'à 50%). L\'antibiothérapie prophylactique doit couvrir les Gram+ (céfazoline) et les Gram- (gentamicine) pour les types II et III. Dans les contextes agricoles ou de contamination par la terre, ajouter du métronidazole pour couvrir les anaérobies.',
  references: [
    {
      type: 'pubmed',
      title: 'Gustilo RB, Mendoza RM, Williams DN. Problems in the management of type III (severe) open fractures. J Trauma 1984',
      pmid: '6471139',
    },
    {
      type: 'pubmed',
      title: 'Gustilo RB, Anderson JT. Prevention of infection in the treatment of one thousand and twenty-five open fractures of long bones. J Bone Joint Surg Am 1976',
      pmid: '783184',
    },
  ],
}

export default gustilo
