import type { FormulaDefinition } from '../types'

const glasgow: FormulaDefinition = {
  id: 'glasgow',
  slug: 'glasgow',
  name: 'Échelle de Glasgow (GCS)',
  specialty: 'urgence',
  category: 'Neurologie',
  description: 'Évaluation du niveau de conscience et de la gravité neurologique (score 3-15)',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'oeil',
      type: 'radio',
      label: 'Ouverture des yeux',
      options: [
        { value: 4, label: 'Spontanée' },
        { value: 3, label: 'À la demande verbale' },
        { value: 2, label: 'À la douleur' },
        { value: 1, label: 'Aucune' },
      ],
    },
    {
      id: 'verbal',
      type: 'radio',
      label: 'Réponse verbale',
      options: [
        { value: 5, label: 'Orientée' },
        { value: 4, label: 'Confuse' },
        { value: 3, label: 'Inappropriée' },
        { value: 2, label: 'Incompréhensible' },
        { value: 1, label: 'Aucune' },
      ],
    },
    {
      id: 'moteur',
      type: 'radio',
      label: 'Réponse motrice',
      options: [
        { value: 6, label: 'Obéit aux ordres' },
        { value: 5, label: 'Localise la douleur' },
        { value: 4, label: 'Retrait à la douleur' },
        { value: 3, label: 'Flexion à la douleur (décortication)' },
        { value: 2, label: 'Extension à la douleur (décérébration)' },
        { value: 1, label: 'Aucune' },
      ],
    },
  ],
  calculate: (values) => {
    const oeil = values.oeil ?? 0
    const verbal = values.verbal ?? 0
    const moteur = values.moteur ?? 0
    const total = oeil + verbal + moteur

    const getLabel = (t: number) => {
      if (t >= 13) return 'Traumatisme crânien léger'
      if (t >= 9) return 'Traumatisme crânien modéré'
      if (t >= 3) return 'Traumatisme crânien sévère'
      return ''
    }

    return {
      value: total,
      label: getLabel(total),
      severity: total >= 13 ? 'low' : total >= 9 ? 'moderate' : 'high',
      details: {
        Y: oeil,
        V: verbal,
        M: moteur,
      },
      ranges: [
        { min: 13, max: 15, label: 'TC léger', severity: 'low', recommendation: 'Surveillance neurologique. Scanner cérébral selon contexte (règle NICE/New Orleans).' },
        { min: 9, max: 12, label: 'TC modéré', severity: 'moderate', recommendation: 'Scanner cérébral en urgence. Hospitalisation et surveillance neurosensorielle.' },
        { min: 3, max: 8, label: 'TC sévère (coma)', severity: 'high', recommendation: 'Intubation + ventilation en urgence. Bilan TDM. Réanimation. Neurochirurgie.' },
      ],
    }
  },
  interpretation: `L'échelle de Glasgow (Glasgow Coma Scale) est la référence internationale pour quantifier le niveau de conscience. Elle comporte 3 items :

• **Y (ouverture des yeux)** : 1-4
• **V (réponse verbale)** : 1-5
• **M (réponse motrice)** : 1-6

Total = Y + V + M (3 à 15). Un GCS ≤ 8 = coma = indication d’intubation.

Cotation : toujours prendre le meilleur côté pour la réponse motrice. La meilleure réponse (pas la première).`,
  clinicalCommentary: `Score universel aux urgences, réanimation et préhospitalier. GCS 15 = normal. GCS ≤ 8 = coma, protection des voies aériennes nécessaire. Attention aux pièges : patient intubé (V = 1T), aphasique, sédaté, barrière linguistique. Chez l’enfant, utiliser le GCS pédiatrique adapté. La pupille et le réflexe de toux ne font pas partie du GCS officiel. Le score moteur est le plus prédictif du pronostic.`,
  references: [
    {
      type: 'pubmed',
      title: 'Assessment of coma and impaired consciousness. A practical scale',
      pmid: '401731',
    },
    {
      type: 'guideline',
      title: 'HAS — Prise en charge des traumatismes crâniens (2023)',
      url: 'https://www.has-sante.fr/jcms/c_2854883',
    },
  ],
}

export default glasgow
