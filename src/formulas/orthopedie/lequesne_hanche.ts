import type { FormulaDefinition } from '../types'

const lequesne_hanche: FormulaDefinition = {
  id: 'lequesne-hanche',
  slug: 'lequesne_hanche',
  name: 'Lequesne, Hanche (Indice)',
  specialty: 'orthopedie',
  category: 'Hanche',
  description: 'Indice de Lequesne pour l\'évaluation fonctionnelle de la coxarthrose. Évalue la douleur, la gêne fonctionnelle et la distance de marche pour quantifier le handicap lié à l\'arthrose de la hanche.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'hip_pain_night',
      type: 'radio',
      label: 'Douleur nocturne (dans le lit, réveil)',
      options: [
        { value: 0, label: 'Aucune' },
        { value: 1, label: 'Légère — ne gêne pas le sommeil' },
        { value: 2, label: 'Modérée — gêne le sommeil' },
        { value: 3, label: 'Sévère — empêche le sommeil' },
      ],
    },
    {
      id: 'hip_pain_standing',
      type: 'radio',
      label: 'Douleur lors de la station debout ou premiers pas',
      options: [
        { value: 0, label: 'Aucune' },
        { value: 1, label: 'Légère — au début de la marche' },
        { value: 2, label: 'Modérée — douleur constante en marchant' },
        { value: 3, label: 'Sévère — dès les premiers pas, oblige à s\'arrêter' },
      ],
    },
    {
      id: 'hip_pain_walking',
      type: 'radio',
      label: 'Douleur en marchant (après combien de temps)',
      options: [
        { value: 0, label: 'Aucune douleur pendant la marche' },
        { value: 1, label: 'Après 30 minutes de marche' },
        { value: 2, label: 'Après 15 minutes de marche' },
        { value: 3, label: 'Après 5 minutes de marche ou immédiatement' },
      ],
    },
    {
      id: 'max_walk_time',
      type: 'radio',
      label: 'Temps de marche maximal sans canne',
      options: [
        { value: 0, label: 'Illimité (plus de 1 heure)' },
        { value: 1, label: '30 minutes à 1 heure' },
        { value: 2, label: '15 à 30 minutes' },
        { value: 3, label: 'Moins de 15 minutes (uniquement à l\'intérieur)' },
      ],
    },
    {
      id: 'daily_activities',
      type: 'radio',
      label: 'Activités quotidiennes (se chausser, mettre les chaussettes)',
      options: [
        { value: 0, label: 'Sans difficulté' },
        { value: 1, label: 'Avec gêne légère (légèrement limité)' },
        { value: 2, label: 'Avec difficulté modérée (nécessite une aide)' },
        { value: 3, label: 'Impossible ou très difficile (nécessite une aide humaine)' },
      ],
    },
    {
      id: 'get_in_car',
      type: 'radio',
      label: 'Monter/descendre d\'une voiture ou d\'un transport',
      options: [
        { value: 0, label: 'Sans difficulté' },
        { value: 1, label: 'Avec gêne légère' },
        { value: 2, label: 'Avec difficulté modérée' },
        { value: 3, label: 'Impossible' },
      ],
    },
  ],
  calculate: (values) => {
    const painNight = values.hip_pain_night as number
    const painStand = values.hip_pain_standing as number
    const painWalk = values.hip_pain_walking as number
    const walkTime = values.max_walk_time as number
    const dailyAct = values.daily_activities as number
    const getCar = values.get_in_car as number

    const total = painNight + painStand + painWalk + walkTime + dailyAct + getCar

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (total <= 4) {
      label = `Lequesne hanche ${total} — Handicap faible ou nul`
      severity = 'low'
      recommendation = 'Traitement médical conservateur : antalgiques, AINS, kinésithérapie (renforcement fessiers, étirements). Activité physique adaptée (vélo, natation). Perte de poids.'
    } else if (total <= 8) {
      label = `Lequesne hanche ${total} — Handicap modéré`
      severity = 'moderate'
      recommendation = 'Optimisation du traitement médical. Kinésithérapie intensive. Infiltrations de corticoïdes sous échographie/scanner. Canne de marche controlatérale. Discuter traitement chirurgical si échec.'
    } else if (total <= 11) {
      label = `Lequesne hanche ${total} — Handicap sévère`
      severity = 'high'
      recommendation = 'Traitement médical maximal. Canne ou déambulateur. Discuter arthroplastie totale de hanche (PTH) si retentissement majeur sur la qualité de vie et échec du traitement médical.'
    } else {
      label = `Lequesne hanche ${total} — Handicap très sévère (ou extrême)`
      severity = 'critical'
      recommendation = 'Indication chirurgicale quasi certaine : prothèse totale de hanche. Consultation orthopédique rapide. Prise en charge de la douleur par antalgiques de palier III si nécessaire. Bilan pré-opératoire.'
    }

    return {
      value: total,
      label,
      severity,
      details: {
        'Douleur nocturne': painNight,
        'Douleur debout': painStand,
        'Douleur marche': painWalk,
        'Temps de marche': walkTime,
        'Activités quotidiennes': dailyAct,
        'Montée/descente voiture': getCar,
      },
      ranges: [
        { min: 0, max: 4, label: 'Handicap faible/nul', severity: 'low' },
        { min: 5, max: 8, label: 'Handicap modéré', severity: 'moderate' },
        { min: 9, max: 11, label: 'Handicap sévère', severity: 'high' },
        { min: 12, max: 18, label: 'Handicap très sévère/extrême', severity: 'critical' },
      ],
    }
  },
  interpretation: "L'**indice de Lequesne** pour la hanche est un score fonctionnel validé pour l'évaluation de la coxarthrose.\n\n**6 items — score total 0 à 18 :**\n- Douleur nocturne (0-3)\n- Douleur à la station debout (0-3)\n- Douleur à la marche (0-3)\n- Temps de marche maximal (0-3)\n- Activités quotidiennes (0-3)\n- Monter/descendre de voiture (0-3)\n\n**Seuils :** ≤ 4 = handicap faible ; 5-8 = modéré ; 9-11 = sévère ; ≥ 12 = très sévère.",
  clinicalCommentary: "L'indice de Lequesne hanche est utilisé pour l'évaluation de la sévérité de la coxarthrose et la décision de mise en place d'une prothèse totale de hanche. Un score ≥ 9 est généralement considéré comme un seuil d'indication chirurgicale si le traitement médical est insuffisant. La perte de poids, l'activité physique adaptée et la kinésithérapie sont les piliers du traitement conservateur.",
  references: [
    {
      type: 'pubmed',
      title: 'Lequesne MG et al. The Lequesne index for severity of osteoarthritis of the hip and knee. Scand J Rheumatol 1987',
      pmid: '3321421',
    },
    {
      type: 'pubmed',
      title: 'Lequesne MG. The functional index for hip osteoarthritis. Rev Rhum 1997',
      pmid: '9338911',
    },
  ],
}

export default lequesne_hanche
