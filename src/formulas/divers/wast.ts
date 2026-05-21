import type { FormulaDefinition } from '../types'

const wast: FormulaDefinition = {
  id: 'wast', slug: 'wast',
  name: 'WAST — Work Ability Score (Évaluation de la Capacité de Travail)',
  specialty: 'divers', category: 'Médecine du travail',
  description: 'WAST (Work Ability Score) ou "Indice de capacité de travail". Outil d\'évaluation de la capacité de travail perçue par le patient. Score basé sur l\'auto-évaluation de la capacité à effectuer un travail physique et mental.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'q1_physique', type: 'radio', label: 'Capacité à effectuer un travail physique (porter, soulever, marcher)', options: [
      { value: 0, label: 'Incapable' },
      { value: 1, label: 'Très limité' },
      { value: 2, label: 'Assez limité' },
      { value: 3, label: 'Légèrement limité' },
      { value: 4, label: 'Pas limité' },
    ]},
    { id: 'q2_mental', type: 'radio', label: 'Capacité à effectuer un travail mental (concentration, mémoire, décisions)', options: [
      { value: 0, label: 'Incapable' },
      { value: 1, label: 'Très limité' },
      { value: 2, label: 'Assez limité' },
      { value: 3, label: 'Légèrement limité' },
      { value: 4, label: 'Pas limité' },
    ]},
    { id: 'q3_endurance', type: 'radio', label: 'Endurance / Capacité à tenir une journée de travail', options: [
      { value: 0, label: 'Impossible' },
      { value: 1, label: 'Très difficile' },
      { value: 2, label: 'Difficile' },
      { value: 3, label: 'Assez facile' },
      { value: 4, label: 'Facile' },
    ]},
    { id: 'q4_satisfaction', type: 'radio', label: 'Satisfaction vis-à-vis de sa capacité de travail actuelle', options: [
      { value: 0, label: 'Très insatisfait' },
      { value: 1, label: 'Insatisfait' },
      { value: 2, label: 'Neutre' },
      { value: 3, label: 'Satisfait' },
      { value: 4, label: 'Très satisfait' },
    ]},
  ],
  calculate: (values) => {
    const q1 = Number(values.q1_physique) ?? 4
    const q2 = Number(values.q2_mental) ?? 4
    const q3 = Number(values.q3_endurance) ?? 4
    const q4 = Number(values.q4_satisfaction) ?? 4

    const total = q1 + q2 + q3 + q4
    const max = 16
    const pct = Math.round(total / max * 100)

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (total <= 4) {
      label = `WAST = ${total}/${max} (${pct}%) — Capacité de travail très altérée`
      severity = 'critical'
      recommendation = 'Capacité de travail très sévèrement réduite. Inaptitude probable. Bilan médical approfondi. Orientation vers médecin du travail.'
    } else if (total <= 8) {
      label = `WAST = ${total}/${max} (${pct}%) — Capacité de travail altérée`
      severity = 'high'
      recommendation = 'Capacité de travail significativement réduite. Aménagement de poste à envisager. Suivi spécialisé.'
    } else if (total <= 12) {
      label = `WAST = ${total}/${max} (${pct}%) — Capacité de travail modérément préservée`
      severity = 'moderate'
      recommendation = 'Capacité de travail partiellement limitée. Adaptation possible. Surveillance.'
    } else {
      label = `WAST = ${total}/${max} (${pct}%) — Bonne capacité de travail`
      severity = 'low'
      recommendation = 'Capacité de travail satisfaisante. Pas de limitation significative.'
    }

    return { value: total, label, severity, recommendation,
      details: {
        'Score physique': `${q1}/4`,
        'Score mental': `${q2}/4`,
        'Score endurance': `${q3}/4`,
        'Score satisfaction': `${q4}/4`,
        'Pourcentage': `${pct} %`,
      },
      ranges: [
        { min: 0, max: 4, label: '0-4 — Très altérée', severity: 'critical', recommendation: 'Inaptitude probable.' },
        { min: 5, max: 8, label: '5-8 — Altérée', severity: 'high', recommendation: 'Aménagement de poste.' },
        { min: 9, max: 12, label: '9-12 — Modérément préservée', severity: 'moderate', recommendation: 'Adaptation possible.' },
        { min: 13, max: 16, label: '13-16 — Bonne capacité', severity: 'low', recommendation: 'Aucune limitation.' },
      ]}
  },
  interpretation: `**WAST (Work Ability Score)** — Évaluation de la capacité de travail (0-16)

4 domaines évalués (chacun de 0 à 4) :
1. Capacité physique (porter, soulever, marcher)
2. Capacité mentale (concentration, mémoire, décisions)
3. Endurance (tenir une journée de travail)
4. Satisfaction vis-à-vis de sa capacité actuelle

**Score total :**
- **0-4** : Très altérée — inaptitude probable
- **5-8** : Altérée — aménagement de poste
- **9-12** : Modérément préservée — adaptation
- **13-16** : Bonne capacité — pas de limitation

Le WAST est un outil simple et rapide pour le dépistage des limitations professionnelles.`,
  clinicalCommentary: 'Le WAST est un outil d\'auto-évaluation simple pour le dépistage des limitations au travail. Il ne remplace pas l\'évaluation spécialisée par le médecin du travail. Utile dans le suivi des maladies chroniques, des lombalgies, des troubles musculosquelettiques et des troubles psychiques. À compléter par une évaluation fonctionnelle détaillée si le score est altéré.',
  references: [
    { type: 'pubmed', title: 'Tuomi K et al. Work Ability Index. Helsinki: Finnish Institute of Occupational Health, 1998' },
    { type: 'url', title: 'Work Ability Index (référence)', url: 'https://www.wai.fi/' },
  ],
}
export default wast
