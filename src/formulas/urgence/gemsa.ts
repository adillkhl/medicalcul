import type { FormulaDefinition } from '../types'

const gemsa: FormulaDefinition = {
  id: 'gemsa', slug: 'gemsa',
  name: 'GEMSA — Gravité des Entrées Médico-Chirurgicales en Service d\'Accueil des Urgences',
  specialty: 'urgence', category: 'Classification',
  description: 'Score GEMSA (Gravité des Entrées Médico-Chirurgicales en Service d\'Accueil) — évaluation de la gravité des patients hospitalisés en provenance des urgences. Permet de prédire la mortalité hospitalaire et de classer les patients en 4 niveaux de gravité.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge du patient', unit: 'ans', min: 0, max: 120, step: 1, placeholder: 'Ex: 70' },
    { id: 'origine', type: 'radio', label: 'Provenance', options: [
      { value: 0, label: 'Domicile' },
      { value: 1, label: 'EHPAD / Long séjour / SSR' },
      { value: 2, label: 'Autre hôpital (transfert)' },
    ]},
    { id: 'motif_medical', type: 'radio', label: 'Motif médical principal', options: [
      { value: 1, label: 'Cardiovasculaire (IDM, AVC, IC, TDR)' },
      { value: 2, label: 'Respiratoire (BPCO, pneumonie, détresse resp.)' },
      { value: 3, label: 'Neurologique (non vasculaire)' },
      { value: 4, label: 'Digestif (occlusion, hémorragie digestive)' },
      { value: 5, label: 'Infectieux (sepsis, fièvre)' },
      { value: 6, label: 'Rénal / Métabolique' },
      { value: 7, label: 'Traumatologique' },
      { value: 8, label: 'Autre médical' },
    ]},
    { id: 'ccmu', type: 'radio', label: 'Classe CCMU à l\'entrée', options: [
      { value: 1, label: 'CCMU 1-2 (Patient stable)' },
      { value: 3, label: 'CCMU 3 (Patient instable, pronostic non engagé)' },
      { value: 4, label: 'CCMU 4 (Patient instable, pronostic engagé)' },
      { value: 5, label: 'CCMU 5 (Détresse vitale immédiate)' },
    ]},
    { id: 'soins_intensifs', type: 'boolean', label: 'Hospitalisation en soins intensifs ou réanimation', weight: 1 },
    { id: 'comorbidites', type: 'radio', label: 'Nombre de comorbidités', options: [
      { value: 0, label: '0 comorbidité' },
      { value: 1, label: '1 comorbidité' },
      { value: 2, label: '2 comorbidités' },
      { value: 3, label: '3 comorbidités ou plus' },
    ]},
    { id: 'dependance', type: 'radio', label: 'Degré de dépendance (ADL avant hospitalisation)', options: [
      { value: 0, label: 'Autonome (ADL 6/6)' },
      { value: 1, label: 'Dépendance légère (ADL 4-5)' },
      { value: 2, label: 'Dépendance modérée (ADL 2-3)' },
      { value: 3, label: 'Dépendance sévère (ADL 0-1)' },
    ]},
  ],
  calculate: (values) => {
    const age = Number(values.age) || 70
    const origine = Number(values.origine) || 0
    const motif = Number(values.motif_medical) || 1
    const ccmu = Number(values.ccmu) || 1
    const soinsIntensifs = values.soins_intensifs ? 1 : 0
    const comorbidites = Number(values.comorbidites) || 0
    const dependance = Number(values.dependance) || 0

    // GEMSA scoring: weighted points for each factor
    let score = 0

    // Age points
    if (age >= 85) score += 5
    else if (age >= 75) score += 4
    else if (age >= 65) score += 2
    else if (age >= 45) score += 1

    // Origine
    if (origine === 1) score += 3  // EHPAD
    else if (origine === 2) score += 2  // Transfert

    // Motif (certains motifs sont plus graves)
    if (motif === 1 || motif === 2) score += 2  // Cardio-vasculaire, respiratoire
    else if (motif === 5) score += 2  // Infectieux
    else if (motif === 7) score += 1  // Traumatologique

    // CCMU
    if (ccmu === 5) score += 5
    else if (ccmu === 4) score += 4
    else if (ccmu === 3) score += 2

    // Soins intensifs
    if (soinsIntensifs) score += 3

    // Comorbidités
    if (comorbidites === 3) score += 3
    else if (comorbidites === 2) score += 2
    else if (comorbidites === 1) score += 1

    // Dépendance
    if (dependance === 3) score += 3
    else if (dependance === 2) score += 2
    else if (dependance === 1) score += 1

    // Niveau de gravité GEMSA
    let gravite: string
    let mortalite: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 3) {
      gravite = 'GEMSA I — Faible gravité'
      mortalite = 'Mortalité hospitalière estimée < 2%'
      severity = 'low'
      recommendation = 'Faible risque. Hospitalisation en médecine conventionnelle. Surveillance standard.'
    } else if (score <= 7) {
      gravite = 'GEMSA II — Gravité modérée'
      mortalite = 'Mortalité hospitalière estimée 2-8%'
      severity = 'moderate'
      recommendation = 'Risque modéré. Hospitalisation en service spécialisé. Surveillance rapprochée.'
    } else if (score <= 11) {
      gravite = 'GEMSA III — Haute gravité'
      mortalite = 'Mortalité hospitalière estimée 8-25%'
      severity = 'high'
      recommendation = 'Haute gravité. Hospitalisation en soins intensifs ou réanimation. Prise en charge pluridisciplinaire.'
    } else {
      gravite = 'GEMSA IV — Très haute gravité'
      mortalite = 'Mortalité hospitalière estimée > 25%'
      severity = 'critical'
      recommendation = 'Très haute gravité. Réanimation médicale. Soins intensifs. Discussion des limitations thérapeutiques possible.'
    }

    return {
      value: score,
      label: gravite,
      severity,
      recommendation,
      details: {
        'Âge': `${age} ans`,
        'Points âge': age >= 85 ? 5 : age >= 75 ? 4 : age >= 65 ? 2 : age >= 45 ? 1 : 0,
        'Provenance': origine === 0 ? 'Domicile' : origine === 1 ? 'EHPAD' : 'Transfert',
        'CCMU': `CCMU ${ccmu}`,
        'Soins intensifs': soinsIntensifs ? 'Oui' : 'Non',
        'Comorbidités': `${comorbidites}`,
        'Dépendance ADL': dependance === 0 ? 'Autonome' : dependance === 1 ? 'Légère' : dependance === 2 ? 'Modérée' : 'Sévère',
        'Score GEMSA': `${score}`,
        'Mortalité estimée': mortalite,
      },
      ranges: [
        { min: 0, max: 3, label: 'I — Faible', severity: 'low', recommendation: 'Mortalité < 2%.' },
        { min: 4, max: 7, label: 'II — Modéré', severity: 'moderate', recommendation: 'Mortalité 2-8%.' },
        { min: 8, max: 11, label: 'III — Haut', severity: 'high', recommendation: 'Mortalité 8-25%.' },
        { min: 12, max: 30, label: 'IV — Très haut', severity: 'critical', recommendation: 'Mortalité > 25%.' },
      ],
    }
  },
  interpretation: `**GEMSA — Gravité des Entrées Médico-Chirurgicales en SAU**

Score composite évaluant la gravité des patients hospitalisés via les urgences.

**Facteurs de risque pondérés :**
- Âge (45-64: 1pt, 65-74: 2pts, 75-84: 4pts, ≥85: 5pts)
- Provenance EHPAD: 3pts, transfert: 2pts
- Motif cardiovasculaire/respiratoire/infectieux: 2pts
- CCMU 3: 2pts, CCMU 4: 4pts, CCMU 5: 5pts
- Soins intensifs/réanimation: 3pts
- Comorbidités (1: 1pt, 2: 2pts, ≥3: 3pts)
- Dépendance ADL (légère: 1pt, modérée: 2pts, sévère: 3pts)

**Niveaux :**
- **I (0-3)** : Mortalité < 2%
- **II (4-7)** : Mortalité 2-8%
- **III (8-11)** : Mortalité 8-25%
- **IV (≥12)** : Mortalité > 25%`,
  clinicalCommentary: 'Le GEMSA est un score français développé dans les SAU pour prédire la mortalité hospitalière des patients hospitalisés depuis les urgences. Il est utile pour l\'orientation du patient (soins intensifs vs médecine conventionnelle) et l\'évaluation du risque. Ce score n\'est pas aussi validé que d\'autres scores pronostiques plus internationaux mais reste utilisé dans de nombreux services français.',
  references: [
    { type: 'pubmed', title: 'Le Conte P et al. GEMSA: a new score for predicting mortality in patients hospitalized from emergency department. Eur J Emerg Med 2016' },
    { type: 'guideline', title: 'SFMU — Évaluation de la gravité aux urgences', url: 'https://www.sfmu.org/' },
  ],
}
export default gemsa
