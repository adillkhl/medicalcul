import type { FormulaDefinition } from '../types'

const dasi: FormulaDefinition = {
  id: 'dasi',
  slug: 'dasi',
  name: 'DASI — Duke Activity Status Index (Capacités fonctionnelles)',
  specialty: 'cardiologie',
  category: 'Capacité fonctionnelle',
  description: 'Indice de capacité fonctionnelle chez le patient cardiaque basé sur un questionnaire d\'activités quotidiennes',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'soins_perso', type: 'boolean', label: 'Pouvez-vous prendre soin de vous-même (manger, s\'habiller, se laver) ?', weight: 2.75 },
    { id: 'marche_int', type: 'boolean', label: 'Pouvez-vous marcher à l\'intérieur ?', weight: 1.75 },
    { id: 'marche_100m', type: 'boolean', label: 'Pouvez-vous marcher 100 mètres sur terrain plat ?', weight: 2.75 },
    { id: 'jardinage', type: 'boolean', label: 'Pouvez-vous jardiner, ratisser, passer l\'aspirateur ?', weight: 3.5 },
    { id: 'monte_etage', type: 'boolean', label: 'Pouvez-vous monter un étage sans vous arrêter ?', weight: 4 },
    { id: 'course_legere', type: 'boolean', label: 'Pouvez-vous faire des courses légères (quelques sacs) ?', weight: 2.7 },
    { id: 'monte_2etages', type: 'boolean', label: 'Pouvez-vous monter 2 étages sans vous arrêter ?', weight: 5.5 },
    { id: 'rapports_sex', type: 'boolean', label: 'Pouvez-vous avoir des rapports sexuels ?', weight: 5.25 },
    { id: 'menage_modere', type: 'boolean', label: 'Pouvez-vous faire du ménage modéré (lavage vitres, rangement) ?', weight: 3.5 },
    { id: 'sport_leger', type: 'boolean', label: 'Pouvez-vous faire du sport léger (bowling, danse, golf) ?', weight: 6 },
    { id: 'sport_intense', type: 'boolean', label: 'Pouvez-vous faire du sport intense (natation, tennis, ski) ?', weight: 7.5 },
    { id: 'marche_rapide', type: 'boolean', label: 'Pouvez-vous marcher rapidement (> 6 km/h) ?', weight: 8 },
    { id: 'course_lente', type: 'boolean', label: 'Pouvez-vous courir lentement (< 10 km/h) ?', weight: 4.5 },
    { id: 'travaux_lourds', type: 'boolean', label: 'Pouvez-vous effectuer des travaux lourds (déménagement, bricolage intense) ?', weight: 9 },
  ],
  calculate: (values) => {
    let score = 0
    if (values.soins_perso) score += 2.75
    if (values.marche_int) score += 1.75
    if (values.marche_100m) score += 2.75
    if (values.jardinage) score += 3.5
    if (values.monte_etage) score += 4
    if (values.course_legere) score += 2.7
    if (values.monte_2etages) score += 5.5
    if (values.rapports_sex) score += 5.25
    if (values.menage_modere) score += 3.5
    if (values.sport_leger) score += 6
    if (values.sport_intense) score += 7.5
    if (values.marche_rapide) score += 8
    if (values.course_lente) score += 4.5
    if (values.travaux_lourds) score += 9

    const met = score > 0 ? parseFloat((score / 5.6 + 2.7).toFixed(1)) : 2.7
    const vo2max = met * 3.5

    let label = ''
    let severity: 'low' | 'moderate' | 'high' = 'low'
    if (score >= 30) { label = 'Bonne capacite fonctionnelle'; severity = 'low' }
    else if (score >= 15) { label = 'Capacite fonctionnelle moderee'; severity = 'moderate' }
    else { label = 'Capacite fonctionnelle reduite'; severity = 'high' }

    return {
      value: parseFloat(score.toFixed(1)),
      label,
      severity,
      details: {
        'MET estime': `${met} METs`,
        'VO2max estimee': `${vo2max} mL/kg/min`,
      },
      ranges: [
        { min: 0, max: 14, label: 'Capacite reduite (< 15)', severity: 'high', recommendation: 'Risque peri-operatoire eleve si chirurgie non cardiaque. Bilan cardiologique pre-operatoire approfondi.' },
        { min: 15, max: 29, label: 'Capacite moderee (15-29)', severity: 'moderate', recommendation: 'Capacite fonctionnelle moyenne. Risque cardiovasculaire peri-operatoire modere. Adapter la prise en charge.' },
        { min: 30, max: 58.2, label: 'Bonne capacite (> 30)', severity: 'low', recommendation: 'Faible risque cardiovasculaire peri-operatoire. Poursuite de l activite physique conseillee.' },
      ],
    }
  },
  interpretation: `Le **DASI** (Duke Activity Status Index) est un questionnaire validé qui estime la capacité fonctionnelle en équivalent métabolique (MET) chez les patients cardiaques.

Le score DASI total est converti en **METs estimés** : MET = (DASI / 5.6) + 2.7
La VO2max estimée est : MET × 3.5 mL/kg/min

- **DASI < 15** (< 5 METs) : mauvaise capacité fonctionnelle
- **DASI 15-29** (5-8 METs) : capacité modérée
- **DASI ≥ 30** (> 8 METs) : bonne capacité

Le DASI est utilisé pour l\'évaluation du risque cardiovasculaire péri-opératoire (chirurgie non cardiaque) et pour le suivi des patients cardiaques.`,
  clinicalCommentary: `Un DASI < 15 (< 5 METs) est associé à un risque péri-opératoire élevé. Le DASI est plus fiable que l’interrogatoire simple ("Combien d\'étages montez-vous ?"). Utile pour suivre l\'évolution après réadaptation cardiaque ou traitement médical. Attention : les coefficients sont ceux de l\'étude originale de 1989 ; des versions simplifiées existent.`,
  references: [
    {
      type: 'pubmed',
      title: 'Hlatky MA et al. A brief self-administered questionnaire to determine functional capacity (the Duke Activity Status Index). Am J Cardiol 1989',
      pmid: '2801544',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines on cardiovascular assessment and management of patients undergoing non-cardiac surgery 2022',
      url: 'https://doi.org/10.1093/eurheartj/ehac270',
    },
  ],
}
export default dasi
