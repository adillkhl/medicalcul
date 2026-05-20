import type { FormulaDefinition } from '../types'

const ottawacheville: FormulaDefinition = {
  id: 'ottawa-cheville',
  slug: 'ottawacheville',
  name: 'Ottawa, Cheville (Critères)',
  specialty: 'orthopedie',
  category: 'Cheville',
  description: 'Règles d\'Ottawa pour la cheville — critères cliniques permettant de déterminer la nécessité de réaliser une radiographie en cas de traumatisme de la cheville, afin d\'éviter des examens inutiles.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 1, label: '< 55 ans' },
        { value: 0, label: '≥ 55 ans — CRITÈRE POSITIF (radio indiquée)' },
      ],
    },
    {
      id: 'malleolar_tenderness',
      type: 'radio',
      label: 'Palpation de la malléole (zone osseuse)',
      options: [
        { value: 0, label: 'Douloureuse — CRITÈRE POSITIF' },
        { value: 1, label: 'Non douloureuse' },
      ],
    },
    {
      id: 'malleolar_zone',
      type: 'radio',
      label: 'Si douleur malléolaire, quelle est la localisation ?',
      options: [
        { value: 0, label: 'Malléole médiale (interne) — bord postérieur ou apex' },
        { value: 1, label: 'Malléole latérale (externe) — bord postérieur ou apex' },
        { value: 2, label: 'Les deux' },
        { value: 3, label: 'Non douloureux' },
      ],
    },
    {
      id: 'navicular_tenderness',
      type: 'boolean',
      label: 'Douleur à la palpation de l\'os naviculaire (scaphoïde tarsien)',
    },
    {
      id: 'fifth_metatarsal_tenderness',
      type: 'boolean',
      label: 'Douleur à la palpation de la base du 5e métatarsien',
    },
    {
      id: 'weight_bearing',
      type: 'radio',
      label: 'Capacité de mise en charge immédiate (à l\'urgence)',
      options: [
        { value: 0, label: 'Incapable de faire 4 pas immédiatement — CRITÈRE POSITIF' },
        { value: 1, label: 'Capable de faire 4 pas (même en boitant)' },
      ],
    },
  ],
  calculate: (values) => {
    const ageOver55 = values.age as number === 0
    const malleolarPain = values.malleolar_tenderness as number === 0
    const navicularPain = values.navicular_tenderness as boolean
    const fifthMetaPain = values.fifth_metatarsal_tenderness as boolean
    const unableBear = values.weight_bearing as number === 0

    // Determine which ankle X-ray criteria are positive (malleolar zone)
    const malleolarZone = values.malleolar_zone as string

    const ankleCriteria = malleolarPain || navicularPain || fifthMetaPain
    const weightCriteria = unableBear

    // Ottawa rules: X-ray needed if:
    // A) Pain in malleolar zone AND (age ≥ 55 OR inability to bear weight)
    // B) Pain at navicular OR 5th metatarsal base
    // Actually standard Ottawa: X-ray needed if:
    // Pain near malleoli AND (age ≥ 55 OR inability to bear weight immediately AND at exam)
    // PLUS: tenderness at posterior edge/tip of either malleolus
    // OR: tenderness at navicular OR base of 5th metatarsal
    // OR: inability to bear weight

    const needAnkleXray = (malleolarPain || navicularPain || fifthMetaPain) &&
      (ageOver55 || unableBear)

    // Need foot X-ray if navicular or 5th metatarsal tenderness
    const needFootXray = navicularPain || fifthMetaPain

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (!needAnkleXray && !needFootXray) {
      label = 'Ottawa NÉGATIF — Radiographie non nécessaire'
      severity = 'low'
      recommendation = 'Pas de radiographie nécessaire. Traitement symptomatique (RICE : repos, glace, compression, élévation). Reprise d\'activité progressive. Consultation si persistance des douleurs > 7 jours.'
    } else {
      label = 'Ottawa POSITIF — Radiographie indiquée'
      severity = 'moderate'
      if (needAnkleXray && needFootXray) {
        recommendation = 'Radiographies cheville (face, profil, mortaise) + pied (face, profil, 3/4) à réaliser. Rechercher fracture malléolaire (Lauge-Hansen, Weber) ou fracture du pied (5e métatarsien, scaphoïde, calcanéum).'
      } else if (needAnkleXray) {
        recommendation = 'Radiographie de la cheville (face, profil, incidence mortaise). Recherche de fracture malléolaire (classification de Weber pour la fibula).'
      } else {
        recommendation = 'Radiographie du pied (face, profil, 3/4). Recherche de fracture du naviculaire ou de la base du 5e métatarsien. Attention : fracture de Jones = base du 5e métatarsien, zone avasculaire à risque de pseudarthrose.'
      }
    }

    return {
      value: needAnkleXray || needFootXray ? 1 : 0,
      label,
      severity,
      details: {
        'Âge ≥ 55': ageOver55 ? 'Oui (CRITÈRE POSITIF)' : 'Non',
        'Douleur malléolaire': malleolarPain ? 'Oui' : 'Non',
        'Douleur naviculaire': navicularPain ? 'Oui' : 'Non',
        'Douleur 5e métatarsien': fifthMetaPain ? 'Oui' : 'Non',
        'Incapacité mise en charge': unableBear ? 'Oui (CRITÈRE POSITIF)' : 'Non',
        'Radio cheville': needAnkleXray ? 'Indiquée' : 'Non nécessaire',
        'Radio pied': needFootXray ? 'Indiquée' : 'Non nécessaire',
      },
      ranges: [
        { min: 0, max: 0, label: 'Radiographie non nécessaire', severity: 'low', recommendation: 'Traitement conservateur RICE' },
        { min: 1, max: 1, label: 'Radiographie INDISPENSABLE', severity: 'moderate', recommendation: 'Radio cheville ± pied' },
      ],
    }
  },
  interpretation: 'Les **règles d\'Ottawa pour la cheville** permettent de réduire le nombre de radiographies inutiles de 30-40%.\n\n**Une radiographie de la cheville est indiquée si :**\n- Douleur près des malléoles **ET** l\'un des suivants :\n  - Âge ≥ 55 ans\n  - Douleur à la palpation du bord postérieur ou de l\'apex de la malléole\n  - Incapacité de faire 4 pas immédiatement ET à l\'examen\n\n**Une radiographie du pied est indiquée si :**\n- Douleur au naviculaire ou à la base du 5e métatarsien\n\nSensibilité > 98%, spécificité ~40%.',
  clinicalCommentary: 'Les règles d\'Ottawa sont validées pour les patients de tout âge avec un traumatisme de la cheville datant de moins de 10 jours. Exception : poly traumatisé, intoxication, trouble neurologique, fracture évidente (déformation). Le critère d\'âge ≥ 55 ans a été ajouté pour améliorer la sensibilité chez les patients ostéoporotiques. En pédiatrie, des adaptations existent (Ottawa pédiatrique, LOW risk rule).',
  references: [
    {
      type: 'pubmed',
      title: 'Stiell IG et al. A study to develop clinical decision rules for the use of radiography in acute ankle injuries. Ann Emerg Med 1992',
      pmid: '1416309',
    },
    {
      type: 'pubmed',
      title: 'Stiell IG et al. Implementation of the Ottawa ankle rules. JAMA 1994',
      pmid: '7935022',
    },
  ],
}

export default ottawacheville
