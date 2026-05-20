import type { FormulaDefinition } from '../types'

const salter: FormulaDefinition = {
  id: 'salter-harris',
  slug: 'salter',
  name: 'Salter et Harris (Classification)',
  specialty: 'orthopedie',
  category: 'Fractures',
  description: 'Classification de Salter et Harris pour les fractures du cartilage de croissance (physe) chez l\'enfant. Grade l\'atteinte physo-métaphysaire et guide le pronostic de retentissement sur la croissance.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'fracture_type',
      type: 'radio',
      label: 'Type de fracture selon Salter-Harris',
      options: [
        { value: 1, label: 'Type I — Trait de fracture traversant la physe (cartilage de croissance) sans atteinte métaphysaire ni épiphysaire' },
        { value: 2, label: 'Type II — Trait traversant la physe + atteinte métaphysaire (triangle métaphysaire de Thurston-Holland)' },
        { value: 3, label: 'Type III — Trait traversant la physe + atteinte épiphysaire (dans l\'articulation)' },
        { value: 4, label: 'Type IV — Trait traversant la physe + métaphyse + épiphyse (trait complet trans-articulaire)' },
        { value: 5, label: 'Type V — Compression/écrasement de la physe sans trait visible (diagnostic rétrospectif)' },
      ],
    },
    {
      id: 'bone_site',
      type: 'select',
      label: 'Localisation anatomique',
      options: [
        { value: 'distal_radius', label: 'Radius distal (+++)' },
        { value: 'distal_tibia', label: 'Tibia distal' },
        { value: 'distal_femur', label: 'Fémur distal' },
        { value: 'proximal_tibia', label: 'Tibia proximal' },
        { value: 'distal_fibula', label: 'Fibula distale' },
        { value: 'other', label: 'Autre' },
      ],
    },
    {
      id: 'displacement',
      type: 'radio',
      label: 'Déplacement du fragment',
      options: [
        { value: 0, label: 'Non déplacé (< 2 mm)' },
        { value: 1, label: 'Déplacé modéré (2-5 mm)' },
        { value: 2, label: 'Déplacé sévère (> 5 mm)' },
      ],
    },
  ],
  calculate: (values) => {
    const type = values.fracture_type as number
    const displacement = values.displacement as number

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''
    let growthRisk = ''
    let urgency = ''

    switch (type) {
      case 1:
        label = 'Salter-Harris Type I — Fracture de la physe sans lésion osseuse'
        severity = displacement <= 1 ? 'low' : 'moderate'
        growthRisk = 'Risque de trouble de croissance : < 5% (sauf si circulation compromise)'
        urgency = 'Non urgent (peut attendre 24-48h si non déplacé)'
        recommendation = 'Réduction orthopédique si déplacé. Immobilisation plâtrée 3-4 semaines. Pas de manoeuvre agressive (risque de lésion physo). Contrôle radiologique à J8-J15.'
        break
      case 2:
        label = 'Salter-Harris Type II — Fracture physe + métaphyse (fréquent)'
        severity = displacement <= 1 ? 'moderate' : 'high'
        growthRisk = 'Risque de trouble de croissance : 5-15%'
        urgency = 'Urgence relative (48-72h)'
        recommendation = 'Réduction orthopédique ou chirurgicale selon le déplacement. Si déplacé > 3 mm : réduction + embrochage percutané. Immobilisation 4-6 semaines. Surveillance radiologique de la croissance.'
        break
      case 3:
        label = 'Salter-Harris Type III — Fracture physe + épiphyse (intra-articulaire)'
        severity = 'high'
        growthRisk = 'Risque de trouble de croissance : 15-30%'
        urgency = 'Urgence (24-48h max)'
        recommendation = 'Nécessite une réduction anatomique (intra-articulaire). Embrochage ou vissage percutané si déplacement > 2 mm. IRM pré-opératoire pour évaluer la surface articulaire. Surveillance de la croissance jusqu\'à maturité squelettique.'
        break
      case 4:
        label = 'Salter-Harris Type IV — Fracture complète (physe + métaphyse + épiphyse)'
        severity = 'critical'
        growthRisk = 'Risque de trouble de croissance : 30-50%'
        urgency = 'URGENCE (24h)'
        recommendation = 'Réduction chirurgicale avec ostéosynthèse anatomique. Vissage percutané ou brochage. Nécessité d\'un alignement parfait de la physe. Risque élevé de pont physo (fusion prématurée). Suivi orthopédique long.'
        break
      case 5:
        label = 'Salter-Harris Type V — Compression physe (diagnostic rétrospectif)'
        severity = 'moderate'
        growthRisk = 'Risque de trouble de croissance : > 50% (très élevé)'
        urgency = 'Initialement non décelable'
        recommendation = 'Immobilisation simple. Diagnostic souvent rétrospectif (apparition d\'un raccourcissement ou d\'une déviation axiale dans les mois suivants). IRM pour confirmer le diagnostic. Surveillance prolongée. Résection chirurgicale du pont osseux si nécessaire (épiphysiodèse controlatérale si > 2 cm).'
        break
    }

    return {
      value: type,
      label,
      severity,
      details: {
        Type: `Type ${['I', 'II', 'III', 'IV', 'V'][type - 1]}`,
        'Déplacement': ['Non déplacé', 'Modéré', 'Sévère'][displacement],
        'Risque croissance': growthRisk,
        'Urgence': urgency,
      },
      ranges: [
        { min: 1, max: 1, label: 'Type I — Atteinte physe pure', severity: 'low' },
        { min: 2, max: 2, label: 'Type II — Physe + métaphyse', severity: 'moderate' },
        { min: 3, max: 3, label: 'Type III — Physe + épiphyse (articulaire)', severity: 'high' },
        { min: 4, max: 4, label: 'Type IV — Trans-articulaire complet', severity: 'critical' },
        { min: 5, max: 5, label: 'Type V — Compression physe', severity: 'moderate' },
      ],
    }
  },
  interpretation: "La **classification de Salter et Harris** (1963) est la référence pour les fractures du cartilage de conjugaison (physe) chez l\'enfant.\n\n**5 types :**\n- **Type I** : Traversée de la physe seule (pronostic excellent)\n- **Type II** : Physe + fragment métaphysaire (le plus fréquent)\n- **Type III** : Physe + fragment épiphysaire (articulaire)\n- **Type IV** : Traversée complète (articulaire, pronostic réservé)\n- **Type V** : Écrasement de la physe (diagnostic rétrospectif, haut risque de trouble de croissance)\n\nPlus le type est élevé, plus le risque de trouble de croissance (Raccourcissement, déviation axiale) est important. La mnémonique « **S**ALTER = **S**'arrête (traversée physe) / **A**llonge (métaphyse) / **L**atéral (épiphyse) / **T**out (complet) / **E**nfin (écrasement).",
  clinicalCommentary: "Les fractures de Salter-Harris représentent 15-20% des fractures de l\'enfant. La localisation la plus fréquente est le radius distal (type II). Le pronostic de croissance est corrélé au type et au déplacement. Les types III et IV nécessitent une réduction anatomique parfaite pour restaurer la surface articulaire et la physe. Le suivi doit se poursuivre jusqu'à maturité squelettique (au moins 2 ans après la fracture).",
  references: [
    {
      type: 'pubmed',
      title: 'Salter RB, Harris WR. Injuries involving the epiphyseal plate. J Bone Joint Surg Am 1963',
      pmid: '14077832',
    },
    {
      type: 'pubmed',
      title: 'Peterson HA. Physeal fractures: classification and treatment. J Pediatr Orthop 1994',
      pmid: '8188863',
    },
  ],
}

export default salter
