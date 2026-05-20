import type { FormulaDefinition } from '../types'

const rankin: FormulaDefinition = {
  id: 'rankin',
  slug: 'rankin',
  name: 'Rankin modifiée (mRS) — Échelle de Handicap',
  specialty: 'neurologie',
  category: 'Autonomie',
  description: 'Évaluation globale du handicap fonctionnel après AVC ou autre pathologie neurologique (score 0–6)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'score',
      type: 'radio',
      label: 'Niveau de handicap',
      options: [
        { value: 0, label: '0 — Aucun symptôme' },
        { value: 1, label: '1 — Symptômes sans handicap significatif (peut tout faire)' },
        { value: 2, label: '2 — Handicap léger (ne peut plus faire tout ce qu\'il faisait avant mais peut gérer ses affaires seul)' },
        { value: 3, label: '3 — Handicap modéré (a besoin d\'aide pour les AVQ mais marche seul)' },
        { value: 4, label: '4 — Handicap modérément sévère (ne peut plus marcher ni faire ses AVQ sans aide)' },
        { value: 5, label: '5 — Handicap sévère (alité, grabataire, nécessite soins infirmiers constants)' },
        { value: 6, label: '6 — Décès' },
      ],
    },
  ],
  calculate: (values) => {
    const score = values.score ?? 0

    const labels: Record<number, string> = {
      0: 'Aucun symptôme',
      1: 'Handicap non significatif',
      2: 'Handicap léger',
      3: 'Handicap modéré',
      4: 'Handicap modérément sévère',
      5: 'Handicap sévère',
      6: 'Décès',
    }

    const getSeverity = (s: number): 'low' | 'moderate' | 'high' | 'critical' => {
      if (s <= 1) return 'low'
      if (s <= 3) return 'moderate'
      if (s <= 4) return 'high'
      return 'critical'
    }

    return {
      value: score,
      label: `mRS ${score} — ${labels[score] || ''}`,
      severity: getSeverity(score),
      ranges: [
        { min: 0, max: 0, label: 'mRS 0 — Aucun symptôme', severity: 'low', recommendation: 'Autonomie totale. Pas de suivi spécifique nécessaire.' },
        { min: 1, max: 1, label: 'mRS 1 — Handicap non significatif', severity: 'low', recommendation: 'Autonomie conservée. Reprise des activités normales. Suivi neurologique standard.' },
        { min: 2, max: 2, label: 'mRS 2 — Handicap léger', severity: 'moderate', recommendation: 'Légère limitation mais indépendant dans les AVQ. Réadaptation fonctionnelle si nécessaire.' },
        { min: 3, max: 3, label: 'mRS 3 — Handicap modéré', severity: 'moderate', recommendation: 'Dépendance partielle. Aide à domicile ou SSR. Poursuite rééducation.' },
        { min: 4, max: 4, label: 'mRS 4 — Handicap modérément sévère', severity: 'high', recommendation: 'Dépendance pour la marche et les AVQ. Orientation vers SSR ou EHPAD. Kinésithérapie, ergothérapie.' },
        { min: 5, max: 5, label: 'mRS 5 — Handicap sévère', severity: 'critical', recommendation: 'Grabataire. Soins infirmiers constants. Soins palliatifs si contexte. Discussion des objectifs de soins.' },
        { min: 6, max: 6, label: 'mRS 6 — Décès', severity: 'critical', recommendation: 'N/A — Décès.' },
      ],
    }
  },
  interpretation: `L'**échelle de Rankin modifiée** (mRS) est la mesure de handicap la plus utilisée dans les essais cliniques en neurologie, notamment après un AVC.

**Grades :**
- **0** : aucun symptôme
- **1** : symptômes sans handicap significatif
- **2** : handicap léger (ne peut plus faire tout ce qu’il faisait avant)
- **3** : handicap modéré (aide pour les AVQ, marche seul)
- **4** : handicap modérément sévère (aide pour la marche et les AVQ)
- **5** : handicap sévère (alité, soins constants)
- **6** : décès

Le mRS est simple, rapide (5 minutes) et très largement utilisé avec une bonne reproductibilité inter-observateur. Il est l’outil de référence pour évaluer le pronostic fonctionnel des AVC et des maladies neurodégénératives.`,
  clinicalCommentary: `Le mRS est l\'échelle de référence dans les essais cliniques sur l\'AVC (critère de jugement principal à 3 mois en général). Le seuil « bon pronostic » est habituellement mRS 0–2 (autonomie). Attention à l’interprétation des scores 2 vs 3 : la différence est souvent subtile (marche seul vs besoin d’aide pour les AVQ). Le score 4 est un seuil important puisqu’il marque la perte de la marche autonome. Le mRS est parfois critiqué pour sa subjectivité — une version structurée (smRSq) améliore la reproductibilité.`,
  references: [
    {
      type: 'pubmed',
      title: 'van Swieten JC et al. Interobserver agreement for the assessment of handicap in stroke patients. Stroke 1988',
      pmid: '3201526',
    },
    {
      type: 'pubmed',
      title: 'Banks JL, Marotta CA. Outcomes validity and reliability of the modified Rankin scale. J Stroke Cerebrovasc Dis 2007',
      pmid: '17689407',
    },
  ],
}

export default rankin
