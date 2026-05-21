import type { FormulaDefinition } from '../types'

const pts_score: FormulaDefinition = {
  id: 'pts-score', slug: 'pts-score',
  name: 'PTS — Post-Thrombotic Syndrome Score (Score de Syndrome Post-Thrombotique)',
  specialty: 'divers', category: 'Angiologie',
  description: 'Score de syndrome post-thrombotique (PTS) selon la classification de Villalta. Évalue la sévérité des séquelles après une thrombose veineuse profonde (TVP). Score composite basé sur 5 symptômes et 6 signes cliniques.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    // Symptoms (patient-reported)
    { id: 'douleur', type: 'radio', label: 'Douleur / lourdeur du membre', options: [
      { value: 0, label: 'Absente' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' },
    ]},
    { id: 'crampes', type: 'radio', label: 'Crampes', options: [
      { value: 0, label: 'Absentes' }, { value: 1, label: 'Légères' }, { value: 2, label: 'Modérées' }, { value: 3, label: 'Sévères' },
    ]},
    { id: 'paresthesies', type: 'radio', label: 'Paresthésies (fourmillements)', options: [
      { value: 0, label: 'Absentes' }, { value: 1, label: 'Légères' }, { value: 2, label: 'Modérées' }, { value: 3, label: 'Sévères' },
    ]},
    { id: 'prurit', type: 'radio', label: 'Prurit (démangeaisons)', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Léger' }, { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' },
    ]},
    // Signs (clinical examination)
    { id: 'oedeme', type: 'radio', label: 'Œdème (cheville/mollet)', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Léger' }, { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' },
    ]},
    { id: 'induration', type: 'radio', label: 'Induration cutanée', options: [
      { value: 0, label: 'Absente' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' },
    ]},
    { id: 'hyperpigmentation', type: 'radio', label: 'Hyperpigmentation', options: [
      { value: 0, label: 'Absente' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' },
    ]},
    { id: 'lipodermatosclerose', type: 'radio', label: 'Lipodermatosclérose (peau dure, rétractée)', options: [
      { value: 0, label: 'Absente' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère' },
    ]},
    { id: 'varices', type: 'radio', label: 'Varices secondaires', options: [
      { value: 0, label: 'Absentes' }, { value: 1, label: 'Légères' }, { value: 2, label: 'Modérées' }, { value: 3, label: 'Sévères' },
    ]},
    { id: 'rougeur', type: 'radio', label: 'Rougeur / Érythème', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Léger' }, { value: 2, label: 'Modéré' }, { value: 3, label: 'Sévère' },
    ]},
    { id: 'ulcere', type: 'radio', label: 'Ulcère veineux actif', options: [
      { value: 0, label: 'Absent' }, { value: 3, label: 'Présent' },
    ]},
  ],
  calculate: (values) => {
    const symptomes = [
      Number(values.douleur) || 0,
      Number(values.crampes) || 0,
      Number(values.paresthesies) || 0,
      Number(values.prurit) || 0,
    ]
    const signes = [
      Number(values.oedeme) || 0,
      Number(values.induration) || 0,
      Number(values.hyperpigmentation) || 0,
      Number(values.lipodermatosclerose) || 0,
      Number(values.varices) || 0,
      Number(values.rougeur) || 0,
      Number(values.ulcere) || 0,
    ]

    const symptomesScore = symptomes.reduce((a, b) => a + b, 0)
    const signesScore = signes.reduce((a, b) => a + b, 0)
    const total = symptomesScore + signesScore

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (total < 5) {
      label = `PTS (Villalta) = ${total} — Absent ou minime`
      severity = 'low'
      recommendation = 'Pas de syndrome post-thrombotique cliniquement significatif. Port de contention veineuse si nécessaire. Surveillance clinique.'
    } else if (total < 10) {
      label = `PTS (Villalta) = ${total} — Léger`
      severity = 'low'
      recommendation = 'PTS léger. Contention veineuse élastique (classe 2). Activité physique adaptée. Surveillance annuelle.'
    } else if (total < 15) {
      label = `PTS (Villalta) = ${total} — Modéré`
      severity = 'moderate'
      recommendation = 'PTS modéré. Contention médicale (classe 2-3). Drainage lymphatique. Surveillance spécialisée. Discuter traitement veineux actif.'
    } else if (total < 20) {
      label = `PTS (Villalta) = ${total} — Sévère`
      severity = 'high'
      recommendation = 'PTS sévère. Contention classe 3. Suivi spécialisé en médecine vasculaire. Traitement des ulcères. Envisager chirurgie veineuse ou endovasculaire.'
    } else {
      label = `PTS (Villalta) = ${total} — Très sévère`
      severity = 'critical'
      recommendation = 'PTS très sévère avec retentissement fonctionnel majeur. Prise en charge pluridisciplinaire (vasculaire, dermatologique, rééducation). Traitement des ulcères. Évaluation pré-thrombotique.'
      if (values.ulcere === 3) {
        recommendation += ' Ulcère veineux actif : soins locaux, contention, cicatrisation dirigée.'
      }
    }

    // Also compute CEAP-like clinical classification
    let ceapClass = ''
    if (values.ulcere === 3) ceapClass = 'C6 (ulcère actif)'
    else if (total >= 10) ceapClass = 'C4b-C5 (lipodermatosclérose, ulcère cicatrisé)'
    else if (total >= 5) ceapClass = 'C3-C4a (œdème, pigmentation)'
    else ceapClass = 'C0-C2 (pas de signe à varices)'

    return { value: total, label, severity, recommendation,
      details: {
        'Symptômes (patient)': `Douleur/lourdeur ${symptomes[0]}, Crampes ${symptomes[1]}, Paresthésies ${symptomes[2]}, Prurit ${symptomes[3]}`,
        'Signes (cliniques)': `Œdème ${signes[0]}, Induration ${signes[1]}, Pigmentation ${signes[2]}, LDS ${signes[3]}, Varices ${signes[4]}, Rougeur ${signes[5]}, Ulcère ${signes[6]}`,
        'Sous-score symptômes': `${symptomesScore}/12`,
        'Sous-score signes': `${signesScore}/18`,
        'Classe CEAP': ceapClass,
      },
      ranges: [
        { min: 0, max: 4, label: '0-4 — Absent/minime', severity: 'low' },
        { min: 5, max: 9, label: '5-9 — Léger', severity: 'low' },
        { min: 10, max: 14, label: '10-14 — Modéré', severity: 'moderate' },
        { min: 15, max: 19, label: '15-19 — Sévère', severity: 'high' },
        { min: 20, max: 33, label: '≥ 20 — Très sévère (avec ou sans ulcère)', severity: 'critical' },
      ]}
  },
  interpretation: `**PTS (Post-Thrombotic Syndrome) — Score de Villalta**

Le score de Villalta est la référence pour le diagnostic et la gradation du syndrome post-thrombotique.

**5 symptômes** (cotés 0-3 chacun) :
1. Douleur / lourdeur
2. Crampes
3. Paresthésies
4. Prurit

**6 signes cliniques** (cotés 0-3 chacun) :
1. Œdème
2. Induration cutanée
3. Hyperpigmentation
4. Lipodermatosclérose
5. Varices secondaires
6. Rougeur

+ Ulcère veineux actif (0 ou 3 points)

**Score total /33 :**
- **0-4** : Absent
- **5-9** : Léger
- **10-14** : Modéré
- **15-19** : Sévère
- **≥ 20** : Très sévère

Un score ≥ 5 ou tout ulcère veineux définit un syndrome post-thrombotique.`,
  clinicalCommentary: 'Le syndrome post-thrombotique est une complication fréquente (20-50%) après TVP, affectant la qualité de vie. Le port de contention veineuse élastique (classe 2 ou 3) pendant au moins 2 ans après une TVP proximale réduit le risque de PTS. Le traitement est avant tout préventif (traitement anticoagulant optimal, contention précoce). Les ulcères veineux nécessitent des soins spécialisés (pansements, contention, éventuellement chirurgie).',
  references: [
    { type: 'pubmed', title: 'Villalta S et al. Assessment of validity and reproducibility of a clinical scale for the post-thrombotic syndrome. Haemostasis 1994' },
    { type: 'pubmed', title: 'Kahn SR et al. The post-thrombotic syndrome: progress and pitfalls. Br J Haematol 2006', pmid: '16805885' },
    { type: 'pubmed', title: 'Galanaud JP et al. Long-term risk of post-thrombotic syndrome after symptomatic distal deep vein thrombosis. J Thromb Haemost 2017', pmid: '28055136' },
  ],
}
export default pts_score
