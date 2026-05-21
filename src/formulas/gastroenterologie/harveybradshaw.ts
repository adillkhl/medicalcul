import type { FormulaDefinition } from '../types'

const harveybradshaw: FormulaDefinition = {
  id: 'harveybradshaw', slug: 'harveybradshaw',
  name: 'Harvey-Bradshaw Index (HBI) — Maladie de Crohn',
  specialty: 'gastroenterologie', category: 'Maladie de Crohn',
  description: 'Index simplifié d\'activité de la maladie de Crohn (Harvey-Bradshaw Index ou Simple Index) — évaluation clinique de l\'activité sans recours aux examens biologiques',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'etat_general', type: 'radio', label: 'État général (bien-être subjectif la veille)', options: [
      { value: 0, label: 'Bien (0)' },
      { value: 1, label: 'Légèrement altéré (1)' },
      { value: 2, label: 'Modérément altéré (2)' },
      { value: 3, label: 'Très altéré (3)' },
      { value: 4, label: 'Extrêmement altéré (4)' },
    ]},
    { id: 'douleur_abdominale', type: 'radio', label: 'Douleur abdominale (la veille)', options: [
      { value: 0, label: 'Absente (0)' },
      { value: 1, label: 'Légère (1)' },
      { value: 2, label: 'Modérée (2)' },
      { value: 3, label: 'Sévère (3)' },
    ]},
    { id: 'selles_liquides', type: 'number', label: 'Nombre de selles liquides par jour', unit: '/jour', min: 0, max: 30, step: 1, placeholder: 'Ex: 4' },
    { id: 'masse_abdominale', type: 'radio', label: 'Masse abdominale (palpation)', options: [
      { value: 0, label: 'Absente (0)' },
      { value: 1, label: 'Douteuse (1)' },
      { value: 2, label: 'Certaine (2)' },
      { value: 3, label: 'Certaine et douloureuse (3)' },
    ]},
    { id: 'complications', type: 'radio', label: 'Complications extra-intestinales (1 pt chacune)', options: [
      { value: 0, label: 'Aucune' },
      { value: 1, label: '1 complication (arthralgie, uvéite, érythème noueux, pyoderma, aphtes, fissure/fistule)' },
      { value: 2, label: '2 complications' },
      { value: 3, label: '3 complications ou plus' },
    ]},
  ],
  calculate: (values) => {
    const etatGen = Number(values.etat_general) || 0
    const douleur = Number(values.douleur_abdominale) || 0
    const selles = Number(values.selles_liquides) || 0
    const masse = Number(values.masse_abdominale) || 0
    const complications = Number(values.complications) || 0

    const score = etatGen + douleur + selles + masse + complications

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let activite = ''

    if (score < 5) {
      severity = score <= 3 ? 'low' : 'moderate'
      label = `HBI ${score} — Maladie quiescente ou peu active`
      activite = score <= 3 ? 'Rémission' : 'Activité légère'
    } else if (score < 8) {
      severity = 'moderate'
      label = `HBI ${score} — Activité modérée`
      activite = 'Poussée modérée'
    } else if (score < 11) {
      severity = 'high'
      label = `HBI ${score} — Activité sévère`
      activite = 'Poussée sévère'
    } else {
      severity = 'critical'
      label = `HBI ${score} — Activité très sévère`
      activite = 'Poussée très sévère'
    }

    return {
      value: score,
      label,
      severity,
      details: {
        'État général': `${etatGen}/4`,
        'Douleur abdominale': `${douleur}/3`,
        'Selles liquides/jour': `${selles}`,
        'Masse abdominale': `${masse}/3`,
        'Complications': `${complications}/3`,
        'Score HBI total': score,
        'Activité': activite,
      },
      ranges: [
        { min: 0, max: 4, label: 'HBI 0-4 : Rémission/peu active', severity: 'low', recommendation: 'Traitement d\'entretien. Surveillance simple.' },
        { min: 5, max: 7, label: 'HBI 5-7 : Activité modérée', severity: 'moderate', recommendation: 'Optimiser traitement. Discuter corticoïdes ou biothérapie.' },
        { min: 8, max: 10, label: 'HBI 8-10 : Activité sévère', severity: 'high', recommendation: 'Corticothérapie. Bilan biologique. Discuter hospitalisation.' },
        { min: 11, max: 35, label: 'HBI ≥ 11 : Très sévère', severity: 'critical', recommendation: 'Hospitalisation. Corticothérapie IV. Avis chirurgical. Biothérapie.' },
      ],
    }
  },
  interpretation: 'L\'**Harvey-Bradshaw Index (HBI)** ou **Simple Index** est une version simplifiée du CDAI (Crohn\'s Disease Activity Index) pour l\'évaluation clinique de l\'activité de la maladie de Crohn.\n\n**5 items :** état général (0-4), douleur abdominale (0-3), nombre de selles liquides/jour, masse abdominale (0-3), complications extra-intestinales (0-3).\n\n**Seuils :** 0-4 = rémission, 5-7 = modérée, 8-10 = sévère, ≥ 11 = très sévère.',
  clinicalCommentary: 'Le HBI est un outil simple, rapide (2 minutes), réalisable sans prélèvement sanguin, validé et reproductible pour le suivi de la maladie de Crohn. Il corrèle bien avec le CDAI (plus complexe). L\'évaluation endoscopique par iléo-coloscopie (score SES-CD) et les biomarqueurs (CRP, calprotectine fécale) complètent le bilan d\'activité.',
  references: [
    { type: 'pubmed', title: 'Harvey RF, Bradshaw JM. A simple index of Crohn\'s-disease activity. Lancet 1980', pmid: '6102683' },
    { type: 'pubmed', title: 'Best WR et al. Development of a Crohn\'s disease activity index. Gastroenterology 1976', pmid: '71794' },
  ],
}
export default harveybradshaw
