import type { FormulaDefinition } from '../types'

const tripcast: FormulaDefinition = {
  id: 'tripcast', slug: 'tripcast',
  name: 'Trip CAST — Classification des Fractures de la Cheville (Ankle Fractures)',
  specialty: 'orthopedie', category: 'Traumatologie',
  description: 'Classification Trip CAST (Classification and Severity of Ankle Fractures) — évaluation des fractures de la cheville basée sur la hauteur du trait de fracture par rapport au pilon tibial. 3 types principaux (infrasyndesmaux, transsyndesmaux, suprasyndesmaux) basés sur le concept de Lauge-Hansen et Weber.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'fracture_height', type: 'radio', label: 'Hauteur du trait de fracture par rapport à la syndesmose', options: [
      { value: 0, label: 'A — Infrasyndesmal (sous la syndesmose) — Weber A / Lauge-Hansen SA' },
      { value: 1, label: 'B — Transsyndesmal (au niveau de la syndesmose) — Weber B / Lauge-Hansen SER ou PER' },
      { value: 2, label: 'C — Suprasyndesmal (au-dessus de la syndesmose) — Weber C / Lauge-Hansen PER' },
    ]},
    { id: 'fibula_comminution', type: 'boolean', label: 'Fracture comminutive de la fibula (multiples fragments)', weight: 1 },
    { id: 'posterior_malleolus', type: 'boolean', label: 'Fracture du pilon tibial postérieur (malléole postérieure)', weight: 1 },
    { id: 'medial_malleolus', type: 'boolean', label: 'Fracture de la malléole médiale (interne)', weight: 1 },
    { id: 'deltoid_rupture', type: 'boolean', label: 'Rupture du ligament deltoïdien (instabilité médiale)', weight: 1 },
    { id: 'syndesmosis_diastasis', type: 'boolean', label: 'Diastasis tibio-fibulaire (élargissement de la syndesmose)', weight: 1 },
    { id: 'talar_shift', type: 'boolean', label: 'Déplacement du talus (subluxation/luxation talo-crurale)', weight: 1 },
  ],
  calculate: (values) => {
    const fractureHeight = Number(values.fracture_height) || 0
    const comminution = values.fibula_comminution ? 1 : 0
    const posteriorMalleolus = values.posterior_malleolus ? 1 : 0
    const medialMalleolus = values.medial_malleolus ? 1 : 0
    const deltoid = values.deltoid_rupture ? 1 : 0
    const syndesmosis = values.syndesmosis_diastasis ? 1 : 0
    const talarShift = values.talar_shift ? 1 : 0

    // Trip CAST severity score: sum of additional lesion points
    const severityScore = comminution + posteriorMalleolus + medialMalleolus + deltoid + syndesmosis + (talarShift ? 2 : 0)

    // Classification nomenclature
    const fractureLabels = ['A — Infrasyndesmal', 'B — Transsyndesmal', 'C — Suprasyndesmal']
    const fractureLabel = fractureLabels[fractureHeight]

    // Weber correspondence
    const weber = ['Weber A', 'Weber B', 'Weber C'][fractureHeight]

    // Stability assessment
    let stability: string
    let treatment: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'

    if (fractureHeight === 0 && severityScore === 0) {
      // Weber A simple, stable
      stability = 'Stable'
      treatment = 'Traitement orthopédique (botte de marche, botte plâtrée 6 semaines). Pas de chirurgie nécessaire.'
      severity = 'low'
    } else if (fractureHeight === 0 && severityScore > 0) {
      stability = 'Potentiellement instable'
      treatment = 'Traitement orthopédique habituellement. Chirurgie si lésion médiale associée.'
      severity = 'low'
    } else if (fractureHeight === 1 && severityScore <= 1 && !syndesmosis && !talarShift) {
      // Weber B simple, stable
      stability = 'Stable (uni-malléolaire)'
      treatment = 'Traitement orthopédique si fracture non déplacée (< 2mm). Chirurgie si déplacement > 2mm ou instabilité.'
      severity = 'moderate'
    } else if (fractureHeight === 1 && (medialMalleolus || deltoid || syndesmosis)) {
      // Weber B bi/tri-malléolaire
      stability = 'Instable (bi/tri-malléolaire)'
      treatment = 'Traitement chirurgical : ostéosynthèse (plaque vis) de la fibula + vissage malléole médiale. Réparation syndesmose si diastasis.'
      severity = 'high'
    } else if (fractureHeight === 2) {
      // Weber C
      stability = 'Instable (suprasyndesmal)'
      treatment = 'Traitement chirurgical : ostéosynthèse de la fibula + réparation syndesmose (vis de positionnement tibio-fibulaire).'
      severity = 'high'
      if (talarShift) {
        treatment += ' Réduction urgente de la luxation talo-crurale avant chirurgie.'
        severity = 'critical'
      }
    } else {
      stability = 'Instable'
      treatment = 'Évaluation orthopédique. Chirurgie probable.'
      severity = 'moderate'
    }

    // Determine pattern
    let pattern = `${fractureLabel} - ${weber}`
    if (medialMalleolus && posteriorMalleolus) pattern += ' (Trimalléolaire)'
    else if (medialMalleolus) pattern += ' (Bimalléolaire)'
    else if (posteriorMalleolus) pattern += ' (Bimalléolaire postérieure)'

    return {
      value: severityScore,
      label: `Trip CAST: ${pattern}`,
      severity,
      recommendation: treatment,
      details: {
        'Fracture': fractureLabel,
        'Weber': weber,
        'Stabilité': stability,
        'Malléole médiale': medialMalleolus ? 'Fracturée' : 'Intacte',
        'Malléole postérieure': posteriorMalleolus ? 'Fracturée' : 'Intacte',
        'Comminution fibula': comminution ? 'Oui' : 'Non',
        'Ligament deltoïde': deltoid ? 'Rupture' : 'Intact',
        'Syndesmose': syndesmosis ? 'Diastasis' : 'Normale',
        'Talus déplacé': talarShift ? 'Oui (luxation/subluxation)' : 'Non',
        'Score de gravité': `${severityScore}/8`,
      },
      ranges: [
        { min: 0, max: 0, label: 'Type A simple — Stable', severity: 'low', recommendation: 'Traitement orthopédique.' },
        { min: 1, max: 2, label: 'Type A/B — Peu instable', severity: 'low', recommendation: 'Orthopédique ou chirurgical.' },
        { min: 3, max: 4, label: 'Type B/C — Instable', severity: 'high', recommendation: 'Traitement chirurgical.' },
        { min: 5, max: 10, label: 'Type C complexe — Très instable', severity: 'critical', recommendation: 'Chirurgie urgente.' },
      ],
    }
  },
  interpretation: `**Trip CAST — Classification des Fractures de la Cheville**

Classification basée sur la hauteur du trait de fracture par rapport à la syndesmose :

| Type | Description | Weber | Stabilité |
|------|-------------|-------|-----------|
| **A** | Infrasyndesmal (sous la syndesmose) | A | Stable |
| **B** | Transsyndesmal (au niveau) | B | Variable |
| **C** | Suprasyndesmal (au-dessus) | C | Instable |

**Lésions associées aggravant le pronostic :**
- Fracture comminutive de la fibula
- Fracture malléole médiale
- Fracture malléole postérieure
- Rupture du ligament deltoïdien
- Diastasis tibio-fibulaire
- Déplacement/luxation du talus

**Traitement :**
- **Stable** (A simple) : Orthopédique (botte, plâtre 6 semaines)
- **Instable** (B bi/tri-malléolaire, C) : Chirurgical (ostéosynthèse)`,
  clinicalCommentary: 'La classification de Weber (AO) reste la plus utilisée en pratique clinique. La classification de Lauge-Hansen (SER, PER, SA) est plus précise sur le mécanisme lésionnel. Trip CAST ajoute une dimension de sévérité basée sur les lésions associées. En pratique, le traitement dépend du déplacement, de la stabilité et de l\'état cutané. Une fracture ouverte est une urgence chirurgicale. L\'instabilité médiale (malléole médiale ou deltoïde) impose souvent une chirurgie.',
  references: [
    { type: 'pubmed', title: 'Michelson JD et al. Ankle fractures. The Lauge-Hansen classification revisited. Clin Orthop Relat Res 1997' },
    { type: 'pubmed', title: 'Weber BG. Die Verletzungen des oberen Sprunggelenkes. 2nd ed. Bern: Huber 1972' },
    { type: 'pubmed', title: 'Trip CAST classification system. Foot Ankle Clin 2012' },
    { type: 'guideline', title: 'HAS — Prise en charge des fractures de la cheville', url: 'https://www.has-sante.fr/' },
  ],
}
export default tripcast
