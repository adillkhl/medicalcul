import type { FormulaDefinition } from '../types'

const doloplus: FormulaDefinition = {
  id: 'doloplus', slug: 'doloplus',
  name: 'Doloplus — Échelle de Douleur Chronique pour la Personne Âgée',
  specialty: 'geriatrie', category: 'Douleur',
  description: 'Échelle comportementale d\'évaluation de la douleur chronique chez la personne âgée, communicante ou non. 10 items répartis en 3 dimensions : somatique (5 items), psychomotrice (2 items), psychosociale (3 items). Chaque item coté de 0 à 3, score total /30.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    // Dimension somatique (5 items)
    { id: 'plaintes_somatiques', type: 'radio', label: 'Plaintes somatiques', options: [
      { value: 0, label: 'Pas de plaintes' },
      { value: 1, label: 'Plaintes uniquement à l\'interrogatoire' },
      { value: 2, label: 'Plaintes spontanées occasionnelles' },
      { value: 3, label: 'Plaintes spontanées continues' },
    ]},
    { id: 'positions_antalgiques', type: 'radio', label: 'Positions antalgiques au repos', options: [
      { value: 0, label: 'Aucune position antalgique' },
      { value: 1, label: 'Le sujet évite certaines positions de façon occasionnelle' },
      { value: 2, label: 'Position antalgique permanente et efficace' },
      { value: 3, label: 'Position antalgique permanente et inefficace (recherche de soulagement incessante)' },
    ]},
    { id: 'protection', type: 'radio', label: 'Protection de zones douloureuses', options: [
      { value: 0, label: 'Pas de protection' },
      { value: 1, label: 'Protection à la demande verbale ou au soin' },
      { value: 2, label: 'Protection spontanée en l\'absence de toute sollicitation' },
      { value: 3, label: 'Protection spontanée avec attitude de retrait ou de fuite' },
    ]},
    { id: 'mimique', type: 'radio', label: 'Mimique (expression du visage)', options: [
      { value: 0, label: 'Mimique habituelle' },
      { value: 1, label: 'Mimique tendue et figée' },
      { value: 2, label: 'Mimique crispée (grimaces)' },
      { value: 3, label: 'Mimique angoissée (regard effrayé)' },
    ]},
    { id: 'sommeil', type: 'radio', label: 'Sommeil', options: [
      { value: 0, label: 'Sommeil habituel' },
      { value: 1, label: 'Difficulté d\'endormissement' },
      { value: 2, label: 'Réveils fréquents (agitation nocturne)' },
      { value: 3, label: 'Insomnie avec retentissement sur les activités diurnes' },
    ]},
    // Dimension psychomotrice (2 items)
    { id: 'toilette_habillage', type: 'radio', label: 'Toilette et/ou habillage', options: [
      { value: 0, label: 'Capacités habituelles inchangées' },
      { value: 1, label: 'Capacités peu diminuées (précautionneux)' },
      { value: 2, label: 'Toilette et habillage difficiles, partiels, imposés' },
      { value: 3, label: 'Soins d\'hygiène rendus impossibles (patient refuse, se débat)' },
    ]},
    { id: 'mobilite', type: 'radio', label: 'Mobilité (déplacements, gestes)', options: [
      { value: 0, label: 'Mobilité habituelle inchangée' },
      { value: 1, label: 'Mobilité active peu diminuée (évite certains mouvements)' },
      { value: 2, label: 'Mobilité active réduite (difficultés de déplacement)' },
      { value: 3, label: 'Immobilité (alitement ou fauteuil)' },
    ]},
    // Dimension psychosociale (3 items)
    { id: 'communication', type: 'radio', label: 'Communication (relations interpersonnelles)', options: [
      { value: 0, label: 'Communication habituelle inchangée' },
      { value: 1, label: 'Communication verbale diminuée (isolement)' },
      { value: 2, label: 'Communication uniquement non verbale (regards, gestes)' },
      { value: 3, label: 'Absence de communication (refus ou impossibilité)' },
    ]},
    { id: 'vie_sociale', type: 'radio', label: 'Vie sociale (activités, loisirs)', options: [
      { value: 0, label: 'Participation habituelle aux activités' },
      { value: 1, label: 'Participation aux activités uniquement si sollicité' },
      { value: 2, label: 'Refus partiel de participation' },
      { value: 3, label: 'Refus total de toute activité ou relation' },
    ]},
    { id: 'troubles_comportement', type: 'radio', label: 'Troubles du comportement (agressivité, apathie)', options: [
      { value: 0, label: 'Comportement habituel' },
      { value: 1, label: 'Troubles du comportement à l\'interrogatoire ou au soin' },
      { value: 2, label: 'Troubles du comportement spontanés' },
      { value: 3, label: 'Troubles du comportement permanents (agitation, agressivité)' },
    ]},
  ],
  calculate: (values) => {
    const plaintes = Number(values.plaintes_somatiques) || 0
    const positions = Number(values.positions_antalgiques) || 0
    const protection = Number(values.protection) || 0
    const mimique = Number(values.mimique) || 0
    const sommeil = Number(values.sommeil) || 0
    const toilette = Number(values.toilette_habillage) || 0
    const mobilite = Number(values.mobilite) || 0
    const communication = Number(values.communication) || 0
    const vieSociale = Number(values.vie_sociale) || 0
    const troubles = Number(values.troubles_comportement) || 0

    const score = plaintes + positions + protection + mimique + sommeil + toilette + mobilite + communication + vieSociale + troubles

    const dimensionSomatique = plaintes + positions + protection + mimique + sommeil
    const dimensionPsychomotrice = toilette + mobilite
    const dimensionPsychosociale = communication + vieSociale + troubles

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score < 5) {
      label = `Doloplus ${score}/30 — Douleur absente ou faible`
      severity = 'low'
      recommendation = 'Absence de douleur chronique significative. Poursuivre les mesures habituelles.'
    } else if (score <= 10) {
      label = `Doloplus ${score}/30 — Douleur légère à modérée`
      severity = 'low'
      recommendation = 'Douleur chronique légère. Évaluation régulière. Antalgiques palier 1 si nécessaire.'
    } else if (score <= 15) {
      label = `Doloplus ${score}/30 — Douleur modérée à sévère`
      severity = 'moderate'
      recommendation = 'Douleur chronique modérée. Traitement antalgique adapté (palier 2). Consultation spécialisée douleur chronique.'
    } else if (score <= 20) {
      label = `Doloplus ${score}/30 — Douleur sévère`
      severity = 'high'
      recommendation = 'Douleur chronique sévère. Traitement antalgique palier 2-3. Réévaluation rapide. Avis spécialisé douleur.'
    } else {
      label = `Doloplus ${score}/30 — Douleur très sévère`
      severity = 'critical'
      recommendation = 'Douleur chronique très sévère. Antalgiques palier 3. Urgence thérapeutique. Avis algologue.'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Somatique': `${dimensionSomatique}/15`,
        'Psychomotrice': `${dimensionPsychomotrice}/6`,
        'Psychosociale': `${dimensionPsychosociale}/9`,
        'Plaintes': `${plaintes}/3`,
        'Positions antalgiques': `${positions}/3`,
        'Protection': `${protection}/3`,
        'Mimique': `${mimique}/3`,
        'Sommeil': `${sommeil}/3`,
        'Toilette/Habillage': `${toilette}/3`,
        'Mobilité': `${mobilite}/3`,
        'Communication': `${communication}/3`,
        'Vie sociale': `${vieSociale}/3`,
        'Troubles comportement': `${troubles}/3`,
        'Score total': `${score}/30`,
      },
      ranges: [
        { min: 0, max: 4, label: '0-4 — Absence de douleur', severity: 'low', recommendation: 'Surveillance.' },
        { min: 5, max: 10, label: '5-10 — Légère à modérée', severity: 'low', recommendation: 'Palier 1.' },
        { min: 11, max: 15, label: '11-15 — Modérée à sévère', severity: 'moderate', recommendation: 'Palier 2.' },
        { min: 16, max: 20, label: '16-20 — Sévère', severity: 'high', recommendation: 'Palier 2-3, avis spécialisé.' },
        { min: 21, max: 30, label: '21-30 — Très sévère', severity: 'critical', recommendation: 'Palier 3, urgence.' },
      ],
    }
  },
  interpretation: `**Doloplus — Échelle de douleur chronique pour la personne âgée**

**10 items en 3 dimensions :**
| Dimension | Items | Score max |
|-----------|-------|-----------|
| **Somatique** (5 items) | Plaintes somatiques, Positions antalgiques, Protection, Mimique, Sommeil | 15 |
| **Psychomotrice** (2 items) | Toilette/habillage, Mobilité | 6 |
| **Psychosociale** (3 items) | Communication, Vie sociale, Troubles du comportement | 9 |

**Seuils :**
- **0-4** : Absence de douleur
- **5-10** : Douleur légère à modérée
- **11-15** : Douleur modérée à sévère
- **16-20** : Douleur sévère
- **21-30** : Douleur très sévère

**Utilisation :** Pour la douleur chronique chez la personne âgée (communicante ou non). Temps de passation : 10-15 minutes. À répéter pour le suivi.`,
  clinicalCommentary: 'Doloplus est l\'échelle de référence pour l\'évaluation de la douleur chronique chez la personne âgée, validée en français. Elle est recommandée par la SFETD et la HAS. Pour la douleur aiguë chez le non-communicant, utiliser Algoplus. Doloplus est plus sensible que l\'EVA chez le sujet âgé dément. Les 3 dimensions permettent de repérer les conséquences de la douleur sur l\'ensemble de la vie du patient. L\'évaluation régulière (hebdomadaire) permet de suivre l\'efficacité thérapeutique.',
  references: [
    { type: 'pubmed', title: 'Wary B, Doloplus C. Doloplus: a scale for pain measurement in the elderly. Psychol Neuropsychiatr Vieil 2005', pmid: '16278050' },
    { type: 'pubmed', title: 'Bernardy S et al. Validation of the Doloplus-2 scale in geriatric patients. Eur J Pain 2011', pmid: '21185201' },
    { type: 'guideline', title: 'SFETD — Recommandations douleur chronique du sujet âgé', url: 'https://www.sfetd-douleur.org/' },
  ],
}
export default doloplus
