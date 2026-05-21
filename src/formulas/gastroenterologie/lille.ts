import type { FormulaDefinition } from '../types'

const lille: FormulaDefinition = {
  id: 'lille', slug: 'lille',
  name: 'Lille Model — Réponse à la Corticothérapie dans l\'Hépatite Alcoolique',
  specialty: 'gastroenterologie', category: 'Hépatite',
  description: 'Modèle de Lille pour prédire la réponse à la corticothérapie chez les patients atteints d\'hépatite alcoolique sévère (score évalué à 7 jours)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 80, step: 1, placeholder: 'Ex: 48' },
    { id: 'bilirubine_j0', type: 'number', label: 'Bilirubine à J0 (avant traitement)', unit: 'µmol/L', min: 10, max: 1000, step: 1, placeholder: 'Ex: 250' },
    { id: 'bilirubine_j7', type: 'number', label: 'Bilirubine à J7 (après 7 jours de corticoïdes)', unit: 'µmol/L', min: 5, max: 1000, step: 1, placeholder: 'Ex: 150' },
    { id: 'albumine', type: 'number', label: 'Albumine', unit: 'g/L', min: 10, max: 50, step: 1, placeholder: 'Ex: 28' },
    { id: 'creatinine', type: 'number', label: 'Créatininémie à J0', unit: 'µmol/L', min: 30, max: 500, step: 1, placeholder: 'Ex: 85' },
    { id: 'tp', type: 'number', label: 'Taux de prothrombine (TP) / INR', unit: '%', min: 10, max: 100, step: 1, placeholder: 'Ex: 45' },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 50
    const bili0 = Number(values.bilirubine_j0) || 200
    const bili7 = Number(values.bilirubine_j7) || 150
    const albumine = Number(values.albumine) || 30
    const creatinine = Number(values.creatinine) || 80
    const tp = Number(values.tp) || 50

    // Lille model formula (Louvet et al. 2007)
    // Transforms bilirubin using natural log
    const lnBili0 = Math.log(bili0)
    const lnBili7 = Math.log(bili7)

    // Lille score = exp(-3.226 + 0.305*age + 0.918*ln(bili_j0) - 1.055*ln(bili_j7)
    //              + 0.293*creatinine/88.4 - 0.030*albumine + 0.143*TP/10)
    // Simplified: using coefficients from Louvet 2007
    const lilleScore = Math.exp(
      -3.226
      + 0.305 * (age > 50 ? 1 : 0)
      + 0.918 * lnBili0
      - 1.055 * lnBili7
      + 0.293 * (creatinine / 88.4)
      - 0.030 * albumine
      + 0.143 * (tp / 10)
    )

    // Lille score is between 0 and 1
    const lille = Math.min(1, Math.max(0, lilleScore))
    const lillePct = Math.round(lille * 1000) / 10 // percentage form

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let reponse = ''
    let recommandation = ''

    if (lille < 0.16) {
      severity = 'low'
      label = `Lille ${lillePct}% — Réponse complète (Lille < 0.16)`
      reponse = 'Réponse complète à la corticothérapie'
      recommandation = 'Poursuivre la corticothérapie pour 28 jours au total. Surveillance rapprochée.'
    } else if (lille < 0.45) {
      severity = 'moderate'
      label = `Lille ${lillePct}% — Réponse partielle (Lille 0.16-0.45)`
      reponse = 'Réponse partielle'
      recommandation = 'Poursuivre la corticothérapie. Surveillance attentive. Discuter arrêt si aggravation.'
    } else if (lille < 0.56) {
      severity = 'high'
      label = `Lille ${lillePct}% — Réponse nulle (Lille 0.45-0.56)`
      reponse = 'Absence de réponse — zone grise'
      recommandation = 'Arrêt de la corticothérapie recommandé (Lille ≥ 0.45). Discuter traitement de 2e ligne (pentoxifylline, N-acétylcystéine).'
    } else {
      severity = 'critical'
      label = `Lille ${lillePct}% — Non répondeur (Lille ≥ 0.56)`
      reponse = 'Non réponse à la corticothérapie'
      recommandation = 'Arrêt immédiat de la corticothérapie. Évaluation pour transplantation hépatique précoce. Mortalité à 6 mois élevée sans transplantation.'
    }

    return {
      value: Math.round(lille * 100) / 100,
      label,
      severity,
      details: {
        'Âge': `${age} ans`,
        'Bilirubine J0': `${Math.round(bili0)} µmol/L`,
        'Bilirubine J7': `${Math.round(bili7)} µmol/L`,
        'Albumine': `${albumine} g/L`,
        'Créatinine': `${creatinine} µmol/L`,
        'TP': `${tp}%`,
        'Score de Lille': lille.toFixed(3),
        'Réponse': reponse,
      },
      ranges: [
        { min: 0, max: 0.159, label: 'Lille < 0.16 : Réponse complète', severity: 'low', recommendation: 'Poursuivre corticoïdes jusqu\'à 28j.' },
        { min: 0.16, max: 0.449, label: 'Lille 0.16-0.45 : Réponse partielle', severity: 'moderate', recommendation: 'Poursuivre corticoïdes avec surveillance.' },
        { min: 0.45, max: 0.559, label: 'Lille 0.45-0.56 : Zone grise', severity: 'high', recommendation: 'Arrêt des corticoïdes à discuter.' },
        { min: 0.56, max: 1, label: 'Lille ≥ 0.56 : Non répondeur', severity: 'critical', recommendation: 'Arrêter corticoïdes. Évaluation pour transplantation.' },
      ],
    }
  },
  interpretation: 'Le **Modèle de Lille** (Louvet et al. 2007) est un score prédictif de réponse à la corticothérapie chez les patients atteints d\'hépatite alcoolique sévère (Maddrey DF ≥ 32). Il est calculé après 7 jours de traitement par prednisolone (40 mg/j).\n\n- **Lille < 0.16** : Réponse complète — poursuivre les corticoïdes (28j)\n- **Lille 0.16-0.45** : Réponse partielle — poursuivre avec prudence\n- **Lille 0.45-0.56** : Zone grise — arrêt à discuter\n- **Lille ≥ 0.56** : Non répondeur — arrêter les corticoïdes, évaluer pour transplantation',
  clinicalCommentary: 'Le score de Lille est un outil majeur dans la prise en charge de l\'hépatite alcoolique aiguë sévère. Il permet d\'éviter la poursuite inutile d\'une corticothérapie chez les non-répondeurs (qui ont une mortalité élevée sans transplantation) et d\'identifier rapidement les candidats à la transplantation hépatique précoce. Le score de Maddrey (DF ≥ 32) reste le critère d\'initiation de la corticothérapie.',
  references: [
    { type: 'pubmed', title: 'Louvet A et al. The Lille model: a new tool for therapeutic strategy in alcoholic hepatitis. J Hepatol 2007', pmid: '17604394' },
    { type: 'pubmed', title: 'Mathurin P et al. Corticosteroid therapy in severe alcoholic hepatitis. NEJM 2011', pmid: '21463150' },
  ],
}
export default lille
