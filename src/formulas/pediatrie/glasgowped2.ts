import type { FormulaDefinition } from '../types'

const glasgowped2: FormulaDefinition = {
  id: 'glasgowped2', slug: 'glasgowped2',
  name: 'Échelle de Glasgow Pédiatrique — Version < 5 ans (Nourrisson)',
  specialty: 'pediatrie', category: 'Neurologie',
  description: 'Glasgow Coma Scale adaptée aux enfants de moins de 5 ans et aux nourrissons. Évaluation de la conscience avec items verbaux et moteurs adaptés à l\'âge pré-verbal. Score de 3 (coma profond) à 15 (conscience normale).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'oeil', type: 'radio', label: 'Ouverture des yeux', options: [
      { value: 4, label: 'Spontanée (l\'enfant ouvre les yeux spontanément)' },
      { value: 3, label: 'À la voix (ouvre les yeux lorsqu\'on l\'appelle ou qu\'on parle)' },
      { value: 2, label: 'À la douleur (ouvre les yeux après stimulation nociceptive)' },
      { value: 1, label: 'Aucune (n\'ouvre pas les yeux même à la douleur)' },
    ]},
    { id: 'verbal', type: 'radio', label: 'Réponse verbale (adaptée au nourrisson < 5 ans)', options: [
      { value: 5, label: 'Sourit, s\'intéresse, suit du regard, vocalises appropriées' },
      { value: 4, label: 'Pleure mais consolable, interagit de façon inappropriée' },
      { value: 3, label: 'Pleure inconsolable, geint, irritable, cris inappropriés' },
      { value: 2, label: 'Agité, gémissements, respiration saccadée, inconsolable' },
      { value: 1, label: 'Aucune réponse verbale (même à la douleur)' },
    ]},
    { id: 'moteur', type: 'radio', label: 'Réponse motrice (adaptée au nourrisson)', options: [
      { value: 6, label: 'Mouvements spontanés normaux, obéit aux ordres simples (si âge ≥ 2 ans)' },
      { value: 5, label: 'Se retire au toucher, localise la douleur (attrape la main qui stimule)' },
      { value: 4, label: 'Retrait à la douleur (retire le membre stimulé)' },
      { value: 3, label: 'Flexion anormale à la douleur (décortication)' },
      { value: 2, label: 'Extension anormale à la douleur (décérébration)' },
      { value: 1, label: 'Aucune réponse motrice (flaccidité, hypotonie)' },
    ]},
  ],
  calculate: (values) => {
    const oeil = Number(values.oeil) || 4
    const verbal = Number(values.verbal) || 5
    const moteur = Number(values.moteur) || 6

    const total = oeil + verbal + moteur

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (total >= 13) {
      label = `GCS Pédiatrique ${total}/15 — Traumatisme crânien léger (conscience normale)`
      severity = 'low'
      recommendation = 'GCS 13-15. Traumatisme crânien léger. Surveillance neurologique 24h. Scanner cérébral selon règles NICE/PECARN. Pas d\'hospitalisation nécessaire si asymptomatique.'
    } else if (total >= 9) {
      label = `GCS Pédiatrique ${total}/15 — Traumatisme crânien modéré`
      severity = 'moderate'
      recommendation = 'GCS 9-12. Traumatisme crânien modéré. Scanner cérébral en urgence. Hospitalisation en unité de soins continus pédiatriques. Surveillance neurologique stricte.'
    } else if (total >= 5) {
      label = `GCS Pédiatrique ${total}/15 — Traumatisme crânien sévère (coma)`
      severity = 'high'
      recommendation = 'GCS 5-8. Coma. Intubation et ventilation mécanique (si GCS ≤ 8). Scanner cérébral en urgence. Transfert en réanimation pédiatrique. Monitorage PIC. Avis neurochirurgical.'
    } else {
      label = `GCS Pédiatrique ${total}/15 — Coma profond`
      severity = 'critical'
      recommendation = 'GCS 3-4. Coma profond. Pronostic réservé. Prise en charge en réanimation pédiatrique. Bilan étiologique complet. Discussion des limitations thérapeutiques possible.'
    }

    return {
      value: total,
      label,
      severity,
      recommendation,
      details: {
        'Œil': `${oeil}/4`,
        'Verbal': `${verbal}/5`,
        'Moteur': `${moteur}/6`,
        'GCS total': `${total}/15`,
        'Âge': '< 5 ans (nourrisson)',
      },
      ranges: [
        { min: 13, max: 15, label: 'GCS 13-15 — Léger', severity: 'low', recommendation: 'Surveillance.' },
        { min: 9, max: 12, label: 'GCS 9-12 — Modéré', severity: 'moderate', recommendation: 'Scanner, hospitalisation.' },
        { min: 5, max: 8, label: 'GCS 5-8 — Sévère (coma)', severity: 'high', recommendation: 'Intubation, réanimation.' },
        { min: 3, max: 4, label: 'GCS 3-4 — Coma profond', severity: 'critical', recommendation: 'Pronostic réservé.' },
      ],
    }
  },
  interpretation: `**Échelle de Glasgow Pédiatrique (< 5 ans)**

Adaptée aux nourrissons et enfants pré-verbaux (< 5 ans). Les items verbaux et moteurs sont adaptés à l\'âge.

**Ouverture des yeux (1-4) :**
- 4 : Spontanée
- 3 : À la voix
- 2 : À la douleur
- 1 : Aucune

**Réponse verbale (1-5) :**
- 5 : Sourit, s\'intéresse, vocalises appropriées
- 4 : Pleure mais consolable
- 3 : Pleure inconsolable, geint
- 2 : Agité, gémissements
- 1 : Aucune

**Réponse motrice (1-6) :**
- 6 : Mouvements spontanés normaux
- 5 : Localise la douleur
- 4 : Retrait à la douleur
- 3 : Flexion anormale (décortication)
- 2 : Extension anormale (décérébration)
- 1 : Aucune (flaccidité)

**Score 3-15 :** < 9 = sévère, < 13 = modéré.`,
  clinicalCommentary: 'L\'échelle de Glasgow pédiatrique pour les moins de 5 ans adapte l\'item verbal aux capacités du nourrisson (vocalises, pleurs, sourires) et conserve les items oculaires et moteurs standards. L\'item moteur intègre la réponse aux ordres simples pour les enfants ≥ 2 ans. Chez le nourrisson, la meilleure réponse motrice spontanée (mouvements normaux) correspond au score 6. Un GCS ≤ 8 est une indication d\'intubation. Attention aux barrières culturelles et linguistiques dans l\'évaluation de l\'item verbal.',
  references: [
    { type: 'pubmed', title: 'James HE, Anas NG. The Glasgow Coma Scale in infants and children. Crit Care Med 1982', pmid: '7083868' },
    { type: 'pubmed', title: 'Simpson DA et al. The assessment of head injuries in infants and young children. Childs Nerv Syst 1991' },
    { type: 'guideline', title: 'PECARN — Pediatric Emergency Care Applied Research Network', url: 'https://pecarn.org/' },
  ],
}
export default glasgowped2
