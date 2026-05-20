import type { FormulaDefinition } from '../types'

const isis: FormulaDefinition = {
  id: 'isis',
  slug: 'isis',
  name: 'ISIS (Score)',
  specialty: 'orthopedie',
  category: 'Épaule',
  description: 'ISIS (Instability Severity Index Score) — score prédictif du risque de récidive d\'instabilité antérieure de l\'épaule. Permet d\'orienter le choix entre traitement conservateur et chirurgical.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge au moment de la première luxation',
      options: [
        { value: 2, label: '< 20 ans' },
        { value: 0.5, label: '20-40 ans' },
        { value: 0, label: '> 40 ans' },
      ],
    },
    {
      id: 'sports_level',
      type: 'radio',
      label: 'Niveau sportif (avant l\'épisode)',
      options: [
        { value: 2, label: 'Sport de compétition avec mouvement d\'armé (volley, hand, tennis, lancers)' },
        { value: 1, label: 'Sport de loisir avec mouvement d\'armé' },
        { value: 0, label: 'Sport sans mouvement d\'armé ou sédentaire' },
      ],
    },
    {
      id: 'hyperlaxity',
      type: 'boolean',
      label: 'Hyperlaxité ligamentaire (contralatérale positive : signe du sillon, hyper-rotation externe > 85°)',
    },
    {
      id: 'hill_sachs',
      type: 'radio',
      label: 'Lésion de Hill-Sachs (IRM ou arthroscanner)',
      options: [
        { value: 2, label: 'Présente — visible sur les radiographies standard (encoche significative)' },
        { value: 0.5, label: 'Présente — visible uniquement au scanner/IRM (encoche minime)' },
        { value: 0, label: 'Absente' },
      ],
    },
    {
      id: 'glenoid_lesion',
      type: 'radio',
      label: 'Lésion glénoïdienne',
      options: [
        { value: 2, label: 'Perte de substance glénoïdienne > 20% (IRM ou scanner)' },
        { value: 0, label: 'Perte de substance < 20% ou pas de lésion' },
      ],
    },
  ],
  calculate: (values) => {
    const ageScore = values.age as number
    const sportsScore = values.sports_level as number
    const hyperlax = values.hyperlaxity as boolean
    const hsScore = values.hill_sachs as number
    const glenoidScore = values.glenoid_lesion as number

    let total = ageScore + sportsScore + (hyperlax ? 1 : 0) + hsScore + glenoidScore

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (total <= 3) {
      label = `ISIS ${total} — Risque faible de récidive (< 30%)`
      severity = 'low'
      recommendation = 'Traitement conservateur (rééducation proprioceptive, renforcement des rotateurs). Réduction du risque sportif pendant 3-6 mois. Surveillance.'
    } else if (total <= 5) {
      label = `ISIS ${total} — Risque intermédiaire de récidive (30-70%)`
      severity = 'moderate'
      recommendation = 'Discuter traitement chirurgical (stabilisation arthroscopique) selon le niveau sportif et les souhaits du patient. Si refus, rééducation intensive avec restrictions sportives strictes.'
    } else {
      label = `ISIS ${total} — Risque élevé de récidive (> 70%)`
      severity = 'high'
      recommendation = 'Indication chirurgicale formelle (stabilisation par butée coracoïdienne de Latarjet ou réinsertion du labrum). Si perte de substance glénoïdienne > 20%, préférer une butée (Latarjet). Rééducation post-opératoire prolongée.'
    }

    return {
      value: total,
      label,
      severity,
      ranges: [
        { min: 0, max: 3, label: 'Risque faible — récidive < 30%', severity: 'low', recommendation: 'Rééducation + restrictions sportives' },
        { min: 3.5, max: 5, label: 'Risque intermédiaire — récidive 30-70%', severity: 'moderate', recommendation: 'Discussion chirurgicale' },
        { min: 5.5, max: 9, label: 'Risque élevé — récidive > 70%', severity: 'high', recommendation: 'Chirurgie (butée de Latarjet)' },
      ],
    }
  },
  interpretation: 'Le **score ISIS** (Instability Severity Index Score) évalue le risque de récidive d\'instabilité gléno-humérale antérieure après un premier épisode de luxation.\n\n**5 items :**\n- Âge (< 20 ans = 2 pts, 20-40 = 0,5 pt)\n- Sport (compétition avec armé = 2 pts, loisir = 1 pt)\n- Hyperlaxité (1 pt)\n- Hill-Sachs (2 pts si visible, 0,5 pt si minime)\n- Lésion glénoïdienne > 20% (2 pts)\n\n**Score total ≥ 4** : risque de récidive > 70% → indication chirurgicale.\n**Score ≤ 3** : traitement conservateur possible.',
  clinicalCommentary: 'L\'ISIS a été validé comme outil décisionnel fiable pour guider la prise en charge de l\'instabilité antérieure d\'épaule. Un score ≥ 4 points prédit un risque de récidive de 70% avec le traitement conservateur, contre < 10% après chirurgie. Le score intègre l\'hyperlaxité (Beighton) qui majore le risque d\'échec de stabilisation si non corrigée.',
  references: [
    {
      type: 'pubmed',
      title: 'Balestro JC et al. The ISIS score: a reliable tool to predict recurrence after anterior shoulder instability. Orthop Traumatol Surg Res 2018',
      pmid: '29753918',
    },
    {
      type: 'pubmed',
      title: 'Thomazeau H et al. Instability Severity Index Score: a new simple prognostic score to predict recurrence after anterior shoulder dislocation. Orthop Traumatol Surg Res 2022',
      pmid: '35777639',
    },
  ],
}

export default isis
