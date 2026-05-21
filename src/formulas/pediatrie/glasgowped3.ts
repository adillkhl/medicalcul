import type { FormulaDefinition } from '../types'

const glasgowped3: FormulaDefinition = {
  id: 'glasgowped3', slug: 'glasgowped3',
  name: 'Échelle de Glasgow Pédiatrique — Version 5-12 ans (Enfant)',
  specialty: 'pediatrie', category: 'Neurologie',
  description: 'Glasgow Coma Scale adaptée aux enfants de 5 à 12 ans. Items verbaux adaptés à l\'âge scolaire avec capacité de langage. Score de 3 (coma profond) à 15 (conscience normale).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'oeil', type: 'radio', label: 'Ouverture des yeux', options: [
      { value: 4, label: 'Spontanée (ouvre les yeux spontanément)' },
      { value: 3, label: 'À la voix (ouvre les yeux lorsqu\'on l\'appelle)' },
      { value: 2, label: 'À la douleur (ouvre les yeux après stimulation nociceptive)' },
      { value: 1, label: 'Aucune (n\'ouvre pas les yeux même à la douleur)' },
    ]},
    { id: 'verbal', type: 'radio', label: 'Réponse verbale (adaptée à l\'enfant 5-12 ans)', options: [
      { value: 5, label: 'Orienté(e) — répond correctement, discours adapté à l\'âge' },
      { value: 4, label: 'Confus(e) — parle mais discours désorienté, mots inappropriés' },
      { value: 3, label: 'Paroles inappropriées — mots isolés, cris, jurons' },
      { value: 2, label: 'Sons incompréhensibles — gémissements, grognements' },
      { value: 1, label: 'Aucune réponse verbale' },
    ]},
    { id: 'moteur', type: 'radio', label: 'Réponse motrice', options: [
      { value: 6, label: 'Obéit aux ordres (exécute un ordre simple : lève le pouce, serre la main)' },
      { value: 5, label: 'Localise la douleur (attire la main vers le point douloureux)' },
      { value: 4, label: 'Retrait à la douleur (retire le membre stimulé)' },
      { value: 3, label: 'Flexion anormale à la douleur (décortication)' },
      { value: 2, label: 'Extension anormale à la douleur (décérébration)' },
      { value: 1, label: 'Aucune réponse motrice' },
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
      recommendation = 'GCS 13-15. Traumatisme crânien léger. Surveillance neurologique. Scanner selon règles de décision clinique (PECARN, NICE). Si asymptomatique, pas d\'hospitalisation nécessaire.'
    } else if (total >= 9) {
      label = `GCS Pédiatrique ${total}/15 — Traumatisme crânien modéré`
      severity = 'moderate'
      recommendation = 'GCS 9-12. Traumatisme crânien modéré. Scanner cérébral en urgence. Hospitalisation en soins continus ou réanimation pédiatrique. Surveillance rapprochée.'
    } else if (total >= 5) {
      label = `GCS Pédiatrique ${total}/15 — Coma (traumatisme crânien sévère)`
      severity = 'high'
      recommendation = 'GCS 5-8. Coma. Intubation et ventilation mécanique. Scanner cérébral urgent. Transfert en réanimation pédiatrique. Monitorage PIC. Avis neurochirurgical.'
    } else {
      label = `GCS Pédiatrique ${total}/15 — Coma profond`
      severity = 'critical'
      recommendation = 'GCS 3-4. Coma profond. Pronostic réservé. Réanimation pédiatrique. Bilan étiologique. Discussion des limitations thérapeutiques.'
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
        'Âge': '5-12 ans (enfant)',
      },
      ranges: [
        { min: 13, max: 15, label: 'GCS 13-15 — Léger', severity: 'low', recommendation: 'Surveillance.' },
        { min: 9, max: 12, label: 'GCS 9-12 — Modéré', severity: 'moderate', recommendation: 'Scanner, hospitalisation.' },
        { min: 5, max: 8, label: 'GCS 5-8 — Sévère (coma)', severity: 'high', recommendation: 'Intubation, réanimation.' },
        { min: 3, max: 4, label: 'GCS 3-4 — Coma profond', severity: 'critical', recommendation: 'Pronostic réservé.' },
      ],
    }
  },
  interpretation: `**Échelle de Glasgow Pédiatrique (5-12 ans)**

Adaptée aux enfants d\'âge scolaire avec capacités de langage développées. L\'item verbal utilise la version adulte standard (orienté, confus, mots inappropriés, sons, aucun).

**Ouverture des yeux (1-4) :**
- 4 : Spontanée
- 3 : À la voix
- 2 : À la douleur
- 1 : Aucune

**Réponse verbale (1-5) :**
- 5 : Orienté(e) (discours adapté à l\'âge)
- 4 : Confus(e) (désorientation)
- 3 : Mots inappropriés (cris, jurons, mots isolés)
- 2 : Sons incompréhensibles (gémissements)
- 1 : Aucune

**Réponse motrice (1-6) :**
- 6 : Obéit aux ordres
- 5 : Localise la douleur
- 4 : Retrait à la douleur
- 3 : Flexion anormale (décortication)
- 2 : Extension anormale (décérébration)
- 1 : Aucune

**Score :** 3-15. Seuils : 13-15 léger, 9-12 modéré, 3-8 sévère.`,
  clinicalCommentary: 'Pour les enfants de 5-12 ans, l\'échelle de Glasgow est quasiment identique à celle de l\'adulte, avec une adaptation mineure de l\'item verbal (tenir compte du développement langagier). L\'item moteur est identique (obéissance aux ordres simples). L\'item oculaire est également identique. La principale différence avec la version adulte est la prudence dans l\'interprétation de l\'item verbal chez les enfants les plus jeunes (5-6 ans) dont le langage est encore en développement. Un GCS ≤ 8 impose l\'intubation.',
  references: [
    { type: 'pubmed', title: 'Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet 1974', pmid: '4136544' },
    { type: 'pubmed', title: 'Holmes JF et al. Performance of the pediatric Glasgow Coma Scale in injured children. Acad Emerg Med 2005' },
    { type: 'guideline', title: 'PECARN — Pediatric Head Injury Guidelines', url: 'https://pecarn.org/' },
  ],
}
export default glasgowped3
