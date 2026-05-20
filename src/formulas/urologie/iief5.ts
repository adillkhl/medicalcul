import type { FormulaDefinition } from '../types'

const iief5: FormulaDefinition = {
  id: 'iief5', slug: 'iief5',
  name: 'IIEF-5 (Index de Fonction Érectile — 5 items)',
  specialty: 'urologie', category: 'Sexologie',
  description: "Questionnaire abrégé d\'évaluation de la fonction érectile (IIEF-5) — score 5-25",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'q1_confiance', type: 'radio', label: 'Confiance dans votre capacité à avoir une érection ?', options: [
      { value: 1, label: '1 — Très faible' }, { value: 2, label: '2 — Faible' },
      { value: 3, label: '3 — Moyenne' }, { value: 4, label: '4 — Bonne' }, { value: 5, label: '5 — Très bonne' },
    ]},
    { id: 'q2_erection', type: 'radio', label: 'Érections suffisantes pour la pénétration ?', options: [
      { value: 1, label: '1 — Presque jamais' }, { value: 2, label: '2 — Parfois' },
      { value: 3, label: '3 — Environ la moitié du temps' }, { value: 4, label: '4 — La plupart du temps' },
      { value: 5, label: '5 — Presque toujours' },
    ]},
    { id: 'q3_maintien', type: 'radio', label: 'Capacité à maintenir l\'érection après pénétration ?', options: [
      { value: 1, label: '1 — Presque jamais' }, { value: 2, label: '2 — Parfois' },
      { value: 3, label: '3 — Environ la moitié du temps' }, { value: 4, label: '4 — La plupart du temps' },
      { value: 5, label: '5 — Presque toujours' },
    ]},
    { id: 'q4_difficulte', type: 'radio', label: 'Difficulté à maintenir l\'érection jusqu\'à la fin du rapport ?', options: [
      { value: 1, label: '1 — Extrêmement difficile' }, { value: 2, label: '2 — Très difficile' },
      { value: 3, label: '3 — Difficile' }, { value: 4, label: '4 — Légèrement difficile' }, { value: 5, label: '5 — Pas difficile' },
    ]},
    { id: 'q5_satisfaction', type: 'radio', label: 'Satisfaction sexuelle globale ?', options: [
      { value: 1, label: '1 — Très faible' }, { value: 2, label: '2 — Faible' },
      { value: 3, label: '3 — Moyenne' }, { value: 4, label: '4 — Bonne' }, { value: 5, label: '5 — Très bonne' },
    ]},
  ],
  calculate: (values) => {
    const total = (values.q1_confiance ?? 1) + (values.q2_erection ?? 1) + (values.q3_maintien ?? 1) + (values.q4_difficulte ?? 1) + (values.q5_satisfaction ?? 1)
    return { value: total, label: `IIEF-5 : ${total}/25`, severity: total <= 10 ? 'high' : total <= 16 ? 'moderate' : 'low',
      ranges: [
        { min: 5, max: 7, label: 'Dysfonction érectile sévère', severity: 'high' },
        { min: 8, max: 11, label: 'Dysfonction érectile modérée à sévère', severity: 'high' },
        { min: 12, max: 16, label: 'Dysfonction érectile légère à modérée', severity: 'moderate' },
        { min: 17, max: 21, label: 'Dysfonction érectile légère', severity: 'low' },
        { min: 22, max: 25, label: 'Pas de dysfonction érectile', severity: 'low' },
      ] }
  },
  interpretation: 'IIEF-5 = version abrégée (5 items) de l\'IIEF. Score ≤ 16 = dysfonction érectile. Score ≤ 10 = sévère.',
  clinicalCommentary: 'Questionnaire validé internationalement. Dépistage systématique recommandé chez l\'homme > 40 ans, diabétique, hypertendu, coronarien.',
  references: [{ type: 'pubmed', title: 'Rosen RC et al. IIEF-5. Int J Impot Res 1999', pmid: '10563431' }],
}
export default iief5
