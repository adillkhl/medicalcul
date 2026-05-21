import type { FormulaDefinition } from '../types'

const safe_marche_ryan: FormulaDefinition = {
  id: 'safe_marche_ryan', slug: 'safe_marche_ryan',
  name: 'Safe Marche de Ryan (Test de Marche en Sécurité)',
  specialty: 'cardiologie', category: 'Réadaptation',
  description: 'Évaluation de la capacité fonctionnelle et de la sécurité à l\'effort via le test de marche de Ryan — utilisé en réadaptation cardiaque',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'distance', type: 'number', label: 'Distance parcourue sur 6 minutes', unit: 'mètres', min: 0, max: 1000, step: 10, placeholder: 'Ex: 400' },
    { id: 'age', type: 'number', label: 'Âge du patient', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 60' },
    { id: 'sex', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Femme' }, { value: 1, label: 'Homme' }] },
    { id: 'fc_repos', type: 'number', label: 'Fréquence cardiaque de repos', unit: '/min', min: 40, max: 150, step: 1, placeholder: 'Ex: 72' },
    { id: 'fc_effort', type: 'number', label: 'Fréquence cardiaque maximale à l\'effort', unit: '/min', min: 60, max: 220, step: 1, placeholder: 'Ex: 140' },
    { id: 'dyspnee', type: 'radio', label: 'Dyspnée d\'effort (Borg modifié)', options: [
      { value: 0, label: 'Aucune (0)' },
      { value: 1, label: 'Très légère (0.5-1)' },
      { value: 2, label: 'Légère (2-3)' },
      { value: 3, label: 'Modérée (4-5)' },
      { value: 4, label: 'Sévère (6-8)' },
      { value: 5, label: 'Maximale (9-10)' },
    ]},
    { id: 'desaturation', type: 'boolean', label: 'Désaturation à l\'effort (SpO₂ < 90%)' },
    { id: 'douleur_thoracique', type: 'boolean', label: 'Douleur thoracique à l\'effort' },
    { id: 'trouble_rythme', type: 'boolean', label: 'Trouble du rythme à l\'effort' },
  ],
  calculate: (values) => {
    const distance = Number(values.distance) || 400
    const age = Number(values.age) || 60
    const male = values.sex === 1
    const dyspnee = Number(values.dyspnee) || 0
    const desaturation = !!values.desaturation
    const douleur = !!values.douleur_thoracique
    const troubleRythme = !!values.trouble_rythme

    // Distance théorique attendue (Enright 1998)
    const distance_predite = male
      ? (7.57 * 170) - (5.02 * age) - (1.76 * 70) - 309
      : (2.11 * 165) - (2.29 * age) - (5.78 * 70) + 667

    const pct_theorique = distance_predite > 0 ? Math.round((distance / distance_predite) * 100) : 50
    const pct_clamp = Math.min(150, Math.max(0, pct_theorique))

    // Évaluation de la sécurité
    let nb_criteres_risque = 0
    if (desaturation) nb_criteres_risque++
    if (douleur) nb_criteres_risque++
    if (troubleRythme) nb_criteres_risque++
    if (dyspnee >= 4) nb_criteres_risque++

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let securite = ''

    if (nb_criteres_risque >= 2) {
      severity = 'critical'
      label = `Marche de Ryan — Sécurité compromise. Distance : ${distance}m (${pct_clamp}%)`
      securite = 'Risque élevé — surveillance médicale requise impérativement'
    } else if (nb_criteres_risque === 1) {
      severity = 'high'
      label = `Marche de Ryan — Sécurité modérée. Distance : ${distance}m (${pct_clamp}%)`
      securite = 'Précautions — surveillance recommandée'
    } else if (pct_clamp < 60) {
      severity = 'moderate'
      label = `Marche de Ryan — Capacité réduite. Distance : ${distance}m (${pct_clamp}%)`
      securite = 'Capacité fonctionnelle altérée mais bonne sécurité'
    } else {
      severity = 'low'
      label = `Marche de Ryan — Bonne capacité. Distance : ${distance}m (${pct_clamp}%)`
      securite = 'Bonne capacité et sécurité. Réadaptation possible sans restriction.'
    }

    return {
      value: distance,
      label,
      severity,
      details: {
        'Distance 6 min': `${distance} m`,
        'Distance théorique': `${Math.round(distance_predite)} m`,
        '% de la théorique': `${pct_clamp}%`,
        'Dyspnée (Borg)': ['Aucune', 'Très légère', 'Légère', 'Modérée', 'Sévère', 'Maximale'][dyspnee],
        'Désaturation': desaturation ? 'Oui' : 'Non',
        'Douleur thoracique': douleur ? 'Oui' : 'Non',
        'Trouble du rythme': troubleRythme ? 'Oui' : 'Non',
        'Sécurité': securite,
      },
      ranges: [
        { min: 0, max: 199, label: 'Distance < 200 m : Capacité très réduite', severity: 'high' },
        { min: 200, max: 349, label: 'Distance 200-350 m : Capacité réduite', severity: 'moderate' },
        { min: 350, max: 499, label: 'Distance 350-500 m : Capacité modérée', severity: 'low' },
        { min: 500, max: 1000, label: 'Distance ≥ 500 m : Bonne capacité', severity: 'low' },
      ],
    }
  },
  interpretation: 'Le **Safe Marche de Ryan** évalue la capacité fonctionnelle à l\'effort (distance de marche sur 6 minutes) et la sécurité cardiovasculaire (désaturation, douleur thoracique, trouble du rythme, dyspnée sévère).\n\n• **Distance** : valeur absolue (mètres) et pourcentage de la valeur théorique selon Enright (1998)\n• **Sécurité** : absence de critère de risque = bon, 1 critère = précautions, ≥ 2 critères = risque élevé nécessitant surveillance',
  clinicalCommentary: 'Le test de marche de 6 minutes (TM6) est un outil simple, reproductible et validé pour évaluer la capacité fonctionnelle. La version Safe Marche de Ryan intègre en plus des critères de sécurité cardiovasculaire. Il est utilisé en réadaptation cardiaque pour guider la prescription d\'exercice et détecter les patients nécessitant une surveillance monitorée.',
  references: [
    { type: 'pubmed', title: 'Enright PL, Sherrill DL. Reference equations for the 6-minute walk in healthy adults. AJRCCM 1998', pmid: '9817683' },
    { type: 'pubmed', title: 'ATS Statement. Guidelines for the 6-minute walk test. AJRCCM 2002', pmid: '11909636' },
  ],
}
export default safe_marche_ryan
