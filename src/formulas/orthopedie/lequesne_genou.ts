import type { FormulaDefinition } from '../types'

const lequesne_genou: FormulaDefinition = {
  id: 'lequesne-genou',
  slug: 'lequesne_genou',
  name: 'Lequesne, Genou (Indice)',
  specialty: 'orthopedie',
  category: 'Genou',
  description: 'Indice de Lequesne pour l\'évaluation fonctionnelle de la gonarthrose. Évalue la douleur, la gêne fonctionnelle et la distance de marche pour quantifier le handicap lié à l\'arthrose du genou.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'pain_night',
      type: 'radio',
      label: 'Douleur nocturne',
      options: [
        { value: 0, label: 'Aucune' },
        { value: 1, label: 'Légère — ne gêne pas le sommeil' },
        { value: 2, label: 'Modérée — gêne le sommeil' },
        { value: 3, label: 'Sévère — empêche le sommeil' },
      ],
    },
    {
      id: 'pain_standing',
      type: 'radio',
      label: 'Douleur en position debout ou lors de la marche (début de la marche)',
      options: [
        { value: 0, label: 'Aucune' },
        { value: 1, label: 'Légère — début de la marche' },
        { value: 2, label: 'Modérée — après quelques pas' },
        { value: 3, label: 'Sévère — dès les premiers pas' },
      ],
    },
    {
      id: 'pain_walking',
      type: 'radio',
      label: 'Douleur lors du changement de position (se lever d\'une chaise, rester assis longtemps)',
      options: [
        { value: 0, label: 'Aucune' },
        { value: 1, label: 'Légère — gêne légère' },
        { value: 2, label: 'Modérée — douleur franche' },
        { value: 3, label: 'Sévère — douleur très gênante' },
      ],
    },
    {
      id: 'walking_distance',
      type: 'radio',
      label: 'Périmètre de marche maximal sans douleur sévère',
      options: [
        { value: 0, label: 'Illimité (plus de 1 km)' },
        { value: 1, label: '500 m à 1 km' },
        { value: 2, label: 'Moins de 500 m' },
        { value: 3, label: 'Moins de 100 m (en intérieur)' },
      ],
    },
    {
      id: 'stairs',
      type: 'radio',
      label: 'Monter / Descendre les escaliers',
      options: [
        { value: 0, label: 'Sans difficulté' },
        { value: 1, label: 'Avec gêne légère' },
        { value: 2, label: 'Avec difficulté modérée (doit s\'aider de la rampe)' },
        { value: 3, label: 'Impossible ou très difficile' },
      ],
    },
    {
      id: 'squat',
      type: 'radio',
      label: 'S\'accroupir / Se baisser pour ramasser un objet',
      options: [
        { value: 0, label: 'Sans difficulté' },
        { value: 1, label: 'Avec gêne légère' },
        { value: 2, label: 'Avec difficulté modérée' },
        { value: 3, label: 'Impossible ou très difficile' },
      ],
    },
  ],
  calculate: (values) => {
    const painNight = values.pain_night as number
    const painStand = values.pain_standing as number
    const painChange = values.pain_walking as number
    const walkDist = values.walking_distance as number
    const stairs = values.stairs as number
    const squat = values.squat as number

    const total = painNight + painStand + painChange + walkDist + stairs + squat

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (total <= 4) {
      label = `Lequesne ${total} — Handicap faible ou nul`
      severity = 'low'
      recommendation = 'Traitement médical de première ligne : antalgiques, AINS si besoin, kinésithérapie (renforcement quadriceps), perte de poids. Poursuite des activités quotidiennes.'
    } else if (total <= 8) {
      label = `Lequesne ${total} — Handicap modéré`
      severity = 'moderate'
      recommendation = 'Traitement médical optimisé : AINS ± paracétamol ± patch de lidocaïne. Kinésithérapie intensive. Infiltrations de corticoïdes ou d\'acide hyaluronique si doute. Orthèse de décharge. Perte de poids impérative.'
    } else if (total <= 11) {
      label = `Lequesne ${total} — Handicap sévère`
      severity = 'high'
      recommendation = 'Traitement médical maximal. Envisager chirurgie (ostéotomie de valgisation si genu varum, ou prothèse totale de genou). Avis orthopédique spécialisé. Canne de marche controlatérale.'
    } else {
      label = `Lequesne ${total} — Handicap très sévère (ou extrême)`
      severity = 'critical'
      recommendation = 'Indication chirurgicale probable (prothèse totale de genou). Consultation orthopédique en vue d\'une arthroplastie. Antalgiques de palier III si besoin. Aide à la marche (déambulateur).'
    }

    return {
      value: total,
      label,
      severity,
      details: {
        'Douleur nocturne': painNight,
        'Douleur debout/marche': painStand,
        'Douleur changement position': painChange,
        'Périmètre de marche': walkDist,
        'Escaliers': stairs,
        'S\'accroupir': squat,
      },
      ranges: [
        { min: 0, max: 4, label: 'Handicap faible/nul', severity: 'low' },
        { min: 5, max: 8, label: 'Handicap modéré', severity: 'moderate' },
        { min: 9, max: 11, label: 'Handicap sévère', severity: 'high' },
        { min: 12, max: 18, label: 'Handicap très sévère/extrême', severity: 'critical' },
      ],
    }
  },
  interpretation: "L'**indice de Lequesne** pour le genou est un score fonctionnel validé pour l\'évaluation de la gonarthrose.\n\n**6 items — score total 0 à 18 :**\n- Douleur nocturne (0-3)\n- Douleur à la marche (0-3)\n- Douleur au changement de position (0-3)\n- Périmètre de marche (0-3)\n- Difficulté aux escaliers (0-3)\n- Difficulté à s\'accroupir (0-3)\n\n**Seuils :** ≤ 4 = handicap faible/nul ; 5-8 = modéré ; 9-11 = sévère ; ≥ 12 = très sévère.",
  clinicalCommentary: "L\'indice de Lequesne est un outil simple et reproductible pour le suivi de la gonarthrose. Il est sensible au changement et permet d\'évaluer l\'efficacité des traitements (médicaux, infiltrations, chirurgie). Il est recommandé par la HAS pour l\'évaluation de la sévérité de l\'arthrose du genou. La perte de poids (≥ 5%) est le traitement le plus efficace pour réduire les symptômes chez les patients en surpoids.",
  references: [
    {
      type: 'pubmed',
      title: 'Lequesne MG et al. The Lequesne index for severity of osteoarthritis of the hip and knee. Scand J Rheumatol 1987',
      pmid: '3321421',
    },
    {
      type: 'pubmed',
      title: 'Lequesne MG. The Lequesne functional index for knee osteoarthritis. Rev Rhum 1997',
      pmid: '9338912',
    },
  ],
}

export default lequesne_genou
