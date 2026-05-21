import type { FormulaDefinition } from '../types'

const lichtiger: FormulaDefinition = {
  id: 'lichtiger', slug: 'lichtiger',
  name: 'Lichtiger Score (Rectocolite Hémorragique — Activité Clinique)',
  specialty: 'gastroenterologie', category: 'Rectocolite',
  description: 'Score de Lichtiger (ou Mayo Clinic Score modifié) pour l\'évaluation de l\'activité clinique de la rectocolite hémorragique — utilisé pour la réponse au traitement et les essais cliniques',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sellessanguin', type: 'radio', label: 'Nombre de selles sanglantes/24h', options: [
      { value: 0, label: '0-1 selle' },
      { value: 1, label: '2-3 selles' },
      { value: 2, label: '4-6 selles' },
      { value: 3, label: '7-9 selles' },
      { value: 4, label: '≥ 10 selles' },
    ]},
    { id: 'selles_total', type: 'radio', label: 'Nombre total de selles/24h', options: [
      { value: 0, label: '0-1 selle' },
      { value: 1, label: '2-3 selles' },
      { value: 2, label: '4-6 selles' },
      { value: 3, label: '7-9 selles' },
      { value: 4, label: '≥ 10 selles' },
    ]},
    { id: 'rectorragie', type: 'radio', label: 'Rectorragies', options: [
      { value: 0, label: 'Absentes' },
      { value: 1, label: 'Présentes (moins de 50% des selles)' },
      { value: 2, label: 'Présentes (> 50% ou en permanence)' },
    ]},
    { id: 'douleur_abdominale', type: 'radio', label: 'Douleur abdominale', options: [
      { value: 0, label: 'Absente' },
      { value: 1, label: 'Légère (spontanée ou à la défécation)' },
      { value: 2, label: 'Modérée (intermittente, non invalidante)' },
      { value: 3, label: 'Sévère (continue, invalidante)' },
    ]},
    { id: 'etat_general', type: 'radio', label: 'État général (bien-être subjectif)', options: [
      { value: 0, label: 'Normal' },
      { value: 1, label: 'Altération légère' },
      { value: 2, label: 'Altération modérée' },
      { value: 3, label: 'Altération sévère' },
    ]},
  ],
  calculate: (values) => {
    const sellesSang = Number(values.sellessanguin) || 0
    const sellesTotal = Number(values.selles_total) || 0
    const rectorragie = Number(values.rectorragie) || 0
    const douleur = Number(values.douleur_abdominale) || 0
    const etatGeneral = Number(values.etat_general) || 0

    const score = sellesSang + sellesTotal + rectorragie + douleur + etatGeneral

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let activite = ''

    if (score < 4) {
      severity = 'low'
      label = `Lichtiger ${score} — Activité clinique minime`
      activite = 'Rémission clinique ou activité minime'
    } else if (score < 7) {
      severity = 'moderate'
      label = `Lichtiger ${score} — Activité clinique modérée`
      activite = 'Poussée modérée'
    } else if (score < 11) {
      severity = 'high'
      label = `Lichtiger ${score} — Activité clinique sévère`
      activite = 'Poussée sévère'
    } else {
      severity = 'critical'
      label = `Lichtiger ${score} — Activité clinique très sévère`
      activite = 'Poussée très sévère (fulminante)'
    }

    return {
      value: score,
      label,
      severity,
      details: {
        'Selles sanglantes': `${sellesSang}/4`,
        'Total selles': `${sellesTotal}/4`,
        'Rectorragies': `${rectorragie}/2`,
        'Douleur abdominale': `${douleur}/3`,
        'État général': `${etatGeneral}/3`,
        'Score total': `${score}/16`,
        'Activité': activite,
      },
      ranges: [
        { min: 0, max: 3, label: 'Rémission / Minime (0-3)', severity: 'low', recommendation: 'Traitement d\'entretien. Surveillance.' },
        { min: 4, max: 6, label: 'Modérée (4-6)', severity: 'moderate', recommendation: 'Optimiser 5-ASA. Discuter corticothérapie ou immunosuppresseur.' },
        { min: 7, max: 10, label: 'Sévère (7-10)', severity: 'high', recommendation: 'Corticothérapie. Hospitalisation si échec ambulatoire. Discuter biothérapie.' },
        { min: 11, max: 16, label: 'Très sévère (11-16)', severity: 'critical', recommendation: 'Hospitalisation. Corticothérapie IV. Biothérapie ou chirurgie urgente.' },
      ],
    }
  },
  interpretation: 'Le **score de Lichtiger** (1994) est un score composite d\'activité clinique de la rectocolite hémorragique, utilisé notamment pour évaluer la réponse au traitement dans les essais cliniques.\n\n**5 items** : fréquence des selles sanglantes (0-4), fréquence totale des selles (0-4), rectorragies (0-2), douleur abdominale (0-3), état général (0-3).\n\n**Score total /16 :** 0-3 = rémission, 4-6 = modérée, 7-10 = sévère, 11-16 = très sévère.',
  clinicalCommentary: 'Le score de Lichtiger est un score simple et pratique d\'activité de la RCH, souvent utilisé en complément du Mayo Score (endoscopique + clinique). Un score ≥ 7 justifie en général une corticothérapie. Les scores cliniques sont utiles mais l\'évaluation endoscopique reste le gold standard pour évaluer l\'activité inflammatoire muqueuse.',
  references: [
    { type: 'pubmed', title: 'Lichtiger S et al. Cyclosporine in severe ulcerative colitis refractory to steroid therapy. NEJM 1994', pmid: '8159195' },
    { type: 'pubmed', title: 'Rutgeerts P et al. Infliximab for induction and maintenance therapy for UC. NEJM 2005', pmid: '16107621' },
  ],
}
export default lichtiger
