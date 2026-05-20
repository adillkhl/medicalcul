import type { FormulaDefinition } from '../types'

const detectionAscite: FormulaDefinition = {
  id: 'detection-ascite',
  slug: 'detection-ascite',
  name: 'Détection de l\'Ascite (Clinique)',
  specialty: 'gastroenterologie',
  category: 'Hépatologie',
  description: 'Estimation clinique de la présence et de la quantité d\'ascite',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'matite_flancs',
      type: 'boolean',
      label: 'Matié des flancs (percussion)',
    },
    {
      id: 'circonference_abdo',
      type: 'number',
      label: 'Circonférence abdominale',
      unit: 'cm',
      min: 50,
      max: 200,
      step: 1,
      placeholder: 'Ex: 95',
    },
    {
      id: 'matite_ombilic',
      type: 'boolean',
      label: 'Matié péri-ombilicale mobile',
    },
    {
      id: 'signe_onde',
      type: 'boolean',
      label: 'Signe de l\'onde de choc (liquid thrill)',
    },
    {
      id: 'augmentation_recente',
      type: 'boolean',
      label: 'Augmentation récente du périmètre abdominal',
    },
  ],
  calculate: (values) => {
    const circonference = Number(values.circonference_abdo)
    let points = 0
    if (values.matite_flancs) points += 2
    if (circonference && circonference > 90) points += 1
    if (circonference && circonference > 100) points += 1
    if (values.matite_ombilic) points += 2
    if (values.signe_onde) points += 2
    if (values.augmentation_recente) points += 1

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (points < 3) {
      severity = 'low'
      label = 'Ascite peu probable'
      recommendation = 'Ascite cliniquement peu probable. Si forte suspicion clinique, demander une echographie abdominale.'
    } else if (points < 5) {
      severity = 'moderate'
      label = 'Ascite possible — Quantité modérée'
      recommendation = 'Probabilité clinique modérée d\'ascite. Confirmation par echographie abdominale recommandée. Bilan etiologique si confirmé.'
    } else {
      severity = 'high'
      label = 'Ascite probable — Quantité importante'
      recommendation = 'Ascite cliniquement probable. Ponction exploratrice pour analyse. Bilan etiologique complet (cirrhose, carcinose, insuffisance cardiaque).'
    }

    return {
      value: points,
      label,
      severity,
      ranges: [
        { min: 0, max: 2, label: '< 3 — Ascite peu probable', severity: 'low', recommendation: 'Echographie si forte suspicion.' },
        { min: 3, max: 4, label: '3-4 — Ascite modérée possible', severity: 'moderate', recommendation: 'Confirmation echographique.' },
        { min: 5, max: 10, label: '≥ 5 — Ascite probable', severity: 'high', recommendation: 'Ponction d\'ascite. Bilan etiologique.' },
      ],
    }
  },
  interpretation: `**Détection clinique de l’ascite** : l'examen clinique permet d’estimer la presence d'ascite avec une bonne sensibilité pour les quantités >= 1 500 mL.

**Signes cliniques** :
- Matité des flancs : le signe le plus sensible
- Matité péri-ombilicale mobile : ascite déplacée au changement de position
- Signe de l’onde de choc (liquid thrill) : present si ascite tendue
- Augmentation récente du périmètre abdominal

L'echographie abdominale reste l'examen de référence pour confirmer et quantifier l’ascite.`,
  clinicalCommentary: `L'ascite de grande abondance (>= 1 500 mL) est détectable cliniquement. En deçà, l'echographie est indispensable. L'ascite de novo chez un patient cirrhotique est une complication grave (1ère décompensation). Toujours faire une ponction diagnostique (Gradient Albumine Séro-Ascitique = GASA). GASA >= 11 g/L = hypertension portale.`,
  references: [
    {
      type: 'pubmed',
      title: 'Cattau EL et al. Detection and quantification of ascites. Am J Gastroenterol 1993',
      pmid: '8441596',
    },
    {
      type: 'guideline',
      title: 'EASL — Clinical practice guidelines on the management of ascites in cirrhosis (2023)',
      url: 'https://easl.eu',
    },
  ],
}

export default detectionAscite
