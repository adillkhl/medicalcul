import type { FormulaDefinition } from '../types'

const truelovewitts: FormulaDefinition = {
  id: 'truelovewitts', slug: 'truelovewitts',
  name: 'Truelove & Witts — Critères de Sévérité de la Rectocolite Hémorragique',
  specialty: 'gastroenterologie', category: 'Rectocolite',
  description: 'Critères de Truelove & Witts pour la classification de la sévérité des poussées de rectocolite hémorragique (RCH) — classification en 3 catégories : légère, modérée, sévère',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'selles', type: 'radio', label: 'Nombre de selles par jour', options: [
      { value: 0, label: '≤ 4 selles/jour' },
      { value: 1, label: '4-6 selles/jour' },
      { value: 2, label: '> 6 selles/jour (≥ 6)' },
    ]},
    { id: 'rectorragie', type: 'radio', label: 'Rectorragies', options: [
      { value: 0, label: 'Absentes ou traces' },
      { value: 1, label: 'Modérées (visibles mais non abondantes)' },
      { value: 2, label: 'Abondantes (franches, > 50% des selles)' },
    ]},
    { id: 'fievre', type: 'boolean', label: 'Fièvre (> 37.5°C)' },
    { id: 'tachycardie', type: 'boolean', label: 'Tachycardie (> 90/min)' },
    { id: 'anemie', type: 'boolean', label: 'Anémie (Hb < 10 g/dL)' },
    { id: 'vs', type: 'boolean', label: 'VS élevée (> 30 mm/h)' },
  ],
  calculate: (values) => {
    const selles = Number(values.selles) || 0
    const rectorragie = Number(values.rectorragie) || 0
    const fievre = !!values.fievre
    const tachycardie = !!values.tachycardie
    const anemie = !!values.anemie
    const vs = !!values.vs

    let classification: string
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let priseEnCharge = ''
    let detailsActivite: string

    // Truelove & Witts criteria
    if (selles >= 2 && (rectorragie >= 2 || fievre || tachycardie || anemie || vs)) {
      // Check if severe
      const severeCount = [selles >= 2, rectorragie >= 2, fievre, tachycardie, anemie, vs].filter(Boolean).length
      if (severeCount >= 3) {
        classification = 'Poussée sévère'
        severity = 'high'
        priseEnCharge = 'Hospitalisation. Corticothérapie IV. Discuter biothérapie (infliximab, ciclosporine) ou chirurgie.'
        detailsActivite = '≥ 3 critères de sévérité : poussée sévère nécessitant hospitalisation'
      } else {
        classification = 'Poussée modérée'
        severity = 'moderate'
        priseEnCharge = 'Traitement ambulatoire ou hospitalisation courte. Corticothérapie orale. Optimiser 5-ASA.'
        detailsActivite = 'Poussée modérée — surveillance rapprochée'
      }
    } else if (selles === 0 && rectorragie === 0 && !fievre && !tachycardie && !anemie && !vs) {
      classification = 'Poussée légère (Rémission)'
      severity = 'low'
      priseEnCharge = 'Traitement d\'entretien par 5-ASA. Surveillance.'
      detailsActivite = '≤ 4 selles/jour, peu ou pas de rectorragies, pas de signes généraux'
    } else {
      classification = 'Poussée légère'
      severity = 'low'
      priseEnCharge = 'Optimiser 5-ASA. Corticoïdes locaux si nécessaire.'
      detailsActivite = '≤ 4 selles/jour, pas de signes généraux'
    }

    // Score numérique simple associé (0-10)
    const scoreNum = selles + rectorragie + (fievre ? 2 : 0) + (tachycardie ? 2 : 0) + (anemie ? 2 : 0) + (vs ? 1 : 0)

    return {
      value: scoreNum,
      label: `Truelove & Witts : ${classification}`,
      severity,
      details: {
        'Selles/jour': ['≤ 4', '4-6', '> 6'][selles],
        'Rectorragies': ['Absentes', 'Modérées', 'Abondantes'][rectorragie],
        'Fièvre > 37.5°C': fievre ? 'Oui' : 'Non',
        'Tachycardie > 90/min': tachycardie ? 'Oui' : 'Non',
        'Anémie (Hb < 10)': anemie ? 'Oui' : 'Non',
        'VS > 30 mm/h': vs ? 'Oui' : 'Non',
        'Classification': classification,
        'Prise en charge': priseEnCharge,
      },
      ranges: [
        { min: 0, max: 2, label: 'Poussée légère', severity: 'low', recommendation: 'Traitement ambulatoire.' },
        { min: 3, max: 5, label: 'Poussée modérée', severity: 'moderate', recommendation: 'Corticoïdes oraux ± hospitalisation.' },
        { min: 6, max: 10, label: 'Poussée sévère', severity: 'high', recommendation: 'Hospitalisation. Corticoïdes IV.' },
      ],
    }
  },
  interpretation: 'Les **critères de Truelove & Witts** (1955) sont la classification historique de sévérité des poussées de rectocolite hémorragique :\n\n**Poussée légère :** ≤ 4 selles/jour, peu ou pas de rectorragies, absence de signes généraux (pas de fièvre, tachycardie, anémie, VS normale)\n\n**Poussée modérée :** Entre légère et sévère\n\n**Poussée sévère :** ≥ 6 selles/jour + rectorragies abondantes + ≥ 1 signe général (fièvre > 37.5°C, tachycardie > 90/min, anémie Hb < 10 g/dL, VS > 30 mm/h)',
  clinicalCommentary: 'Les critères de Truelove & Witts restent d\'actualité pour définir la sévérité d\'une poussée de RCH et guider la décision d\'hospitalisation. Une poussée sévère nécessite une hospitalisation pour corticothérapie IV et surveillance. En cas d\'échec des corticoïdes IV (à J3-5), un traitement de 2e ligne (infliximab ou ciclosporine) ou une colectomie doivent être discutés. La colite fulminante (score très sévère) peut nécessiter une chirurgie en urgence.',
  references: [
    { type: 'pubmed', title: 'Truelove SC, Witts LJ. Cortisone in ulcerative colitis: final report on a therapeutic trial. BMJ 1955', pmid: '13241655' },
    { type: 'pubmed', title: 'Dignass A et al. Second European evidence-based consensus on the diagnosis and management of UC. J Crohns Colitis 2012', pmid: '22764042' },
  ],
}
export default truelovewitts
