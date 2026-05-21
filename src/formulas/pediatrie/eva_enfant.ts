import type { FormulaDefinition } from '../types'

const eva_enfant: FormulaDefinition = {
  id: 'eva-enfant', slug: 'eva-enfant',
  name: 'EVA Enfant — Échelle Visuelle Analogique Pédiatrique (Évaluation de la Douleur)',
  specialty: 'pediatrie', category: 'Douleur',
  description: 'Évaluation de la douleur chez l\'enfant (≥ 6 ans) par l\'échelle visuelle analogique (EVA) adaptée aux enfants. Utilise des repères visuels et verbaux adaptés pour permettre à l\'enfant de quantifier sa douleur de 0 à 10.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge de l\'enfant', unit: 'ans', min: 2, max: 18, step: 1, placeholder: 'Ex: 8' },
    { id: 'type_echelle', type: 'radio', label: 'Type d\'échelle', options: [
      { value: 0, label: 'EVA (visuelle) — Règle graduée 0-10' },
      { value: 1, label: 'Échelle des visages (Wong-Baker FACES)' },
      { value: 2, label: 'Échelle verbale simple (0-10)' },
    ]},
    { id: 'score_eva', type: 'number', label: 'Score de douleur', unit: '/10', min: 0, max: 10, step: 0.5, placeholder: 'Ex: 4' },
    { id: 'fievre', type: 'boolean', label: 'Fièvre (> 38°C)', weight: 1 },
    { id: 'localisation', type: 'boolean', label: 'Douleur localisée précise (vs diffuse)', weight: 1 },
    { id: 'irradiation', type: 'boolean', label: 'Irradiation de la douleur', weight: 1 },
    { id: 'vomissements', type: 'boolean', label: 'Vomissements associés', weight: 1 },
    { id: 'repos', type: 'boolean', label: 'Réveil nocturne ou douleur au repos', weight: 1 },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 8
    const score = Number(values.score_eva) || 0
    const fievre = values.fievre ? 1 : 0
    const localisation = values.localisation ? 1 : 0
    const irradiation = values.irradiation ? 1 : 0
    const vomissements = values.vomissements ? 1 : 0
    const repos = values.repos ? 1 : 0

    // Recommandation de prise en charge selon le score douleur + signes associés
    const signesAssocies = fievre + localisation + irradiation + vomissements + repos

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    // Douleur
    if (score < 1) {
      label = `EVA enfant = ${score}/10 — Pas de douleur`
      severity = 'low'
      recommendation = 'Absence de douleur. Pas de traitement antalgique nécessaire.'
    } else if (score <= 3) {
      label = `EVA enfant = ${score}/10 — Douleur légère`
      severity = 'low'
      recommendation = 'Douleur légère. Paracétamol ou ibuprofène selon l\'âge. Mesures non médicamenteuses (distraction, câlin, glaçage).'
      if (signesAssocies >= 2) {
        recommendation += ' Signes associés présents : avis médical recommandé.'
        severity = 'moderate'
      }
    } else if (score <= 5) {
      label = `EVA enfant = ${score}/10 — Douleur modérée`
      severity = 'moderate'
      recommendation = 'Douleur modérée. Antalgiques palier 1 (paracétamol + AINS). Réévaluation à 30-60 min. Si persistance, passer au palier 2.'
      if (signesAssocies >= 2) {
        recommendation += ' Signes associés : consultation médicale.'
        severity = 'high'
      }
    } else if (score <= 7) {
      label = `EVA enfant = ${score}/10 — Douleur intense`
      severity = 'high'
      recommendation = 'Douleur intense. Antalgiques palier 2 (tramadol, codéine). Avis médical nécessaire. Hospitalisation si étiologie sévère.'
    } else {
      label = `EVA enfant = ${score}/10 — Douleur très intense`
      severity = 'critical'
      recommendation = 'Douleur très intense. Antalgiques palier 3 (morphine). Urgence médicale. Hospitalisation. Traitement étiologique urgent.'
    }

    return { value: score, label, severity, recommendation,
      details: {
        'Âge': `${age} ans`,
        'Signes associés': `${signesAssocies}/5`,
        'Fièvre': fievre ? 'Oui' : 'Non',
        'Irradiation': irradiation ? 'Oui' : 'Non',
        'Vomissements': vomissements ? 'Oui' : 'Non',
        'Réveil nocturne': repos ? 'Oui' : 'Non',
      },
      ranges: [
        { min: 0, max: 0.9, label: '0 — Pas de douleur', severity: 'low' },
        { min: 1, max: 3.9, label: '1-3 — Légère', severity: 'low', recommendation: 'Palier 1.' },
        { min: 4, max: 5.9, label: '4-5 — Modérée', severity: 'moderate', recommendation: 'Palier 1-2.' },
        { min: 6, max: 7.9, label: '6-7 — Intense', severity: 'high', recommendation: 'Palier 2.' },
        { min: 8, max: 10, label: '8-10 — Très intense', severity: 'critical', recommendation: 'Palier 3 (morphine).' },
      ]}
  },
  interpretation: `**EVA Enfant — Évaluation de la douleur chez l\'enfant (≥ 6 ans)**

**Échelles disponibles :**
1. **EVA visuelle** (règle graduée 0-10) — pour enfants ≥ 7-8 ans
2. **Échelle des visages** (Wong-Baker FACES) — pour enfants ≥ 3-4 ans
3. **Échelle verbale simple** — pour enfants ≥ 6-7 ans

**Chez l\'enfant plus jeune (< 6 ans) :**
- **EN** (Échelle des visages) : 0-10 avec visages pour 3-7 ans
- **EVENDOL** : échelle comportementale pour < 6 ans ou non-communicant
- **FLACC** : Face, Legs, Activity, Cry, Consolability

**Seuils de traitement (OMS pédiatrique) :**
- 0 : Pas de douleur
- 1-3 : Légère → Palier 1 (paracétamol, ibuprofène)
- 4-5 : Modérée → Palier 1-2
- 6-7 : Intense → Palier 2 (tramadol, nalbuphine)
- 8-10 : Très intense → Palier 3 (morphine, titration IV)`,
  clinicalCommentary: 'L\'EVA est l\'échelle de référence pour l\'évaluation de la douleur chez l\'enfant de plus de 6-7 ans. Pour les enfants plus jeunes ou non-communicants, utiliser les échelles comportementales (EVENDOL, FLACC, HEDEN). L\'évaluation de la douleur chez l\'enfant doit être systématique et adaptée à l\'âge. Nasopharynx, distraction, MEOPA peuvent compléter la prise en charge.',
  references: [
    { type: 'pubmed', title: 'Wong DL, Baker CM. Pain in children: comparison of assessment scales. Pediatr Nurs 1988', pmid: '3293010' },
    { type: 'guideline', title: 'HAS — Prise en charge de la douleur de l\'enfant', url: 'https://www.has-sante.fr/' },
    { type: 'pubmed', title: 'OMS — Traitement de la douleur chez l\'enfant', url: 'https://www.who.int/' },
  ],
}
export default eva_enfant
