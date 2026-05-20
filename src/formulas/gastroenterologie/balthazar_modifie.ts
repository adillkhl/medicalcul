import type { FormulaDefinition } from '../types'

const balthazarModifie: FormulaDefinition = {
  id: 'balthazar-modifie',
  slug: 'balthazar-modifie',
  name: 'Balthazar Modifié (Score) — Mortele',
  specialty: 'gastroenterologie',
  category: 'Pancréatite',
  description: 'Score tomodensitométrique modifié intégrant les complications extrapancréatiques (score de Mortele)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'inflammation',
      type: 'radio',
      label: 'Inflammation pancréatique',
      options: [
        { value: 0, label: 'Pancréas normal' },
        { value: 2, label: 'Anomalies pancréatiques intrinsèques +/- inflammation péripancréatique' },
        { value: 4, label: 'Coulée de nécrose ou phlegmon ou abcès' },
      ],
    },
    {
      id: 'necrose',
      type: 'radio',
      label: 'Nécrose pancréatique',
      options: [
        { value: 0, label: 'Absente' },
        { value: 2, label: '≤ 30 %' },
        { value: 4, label: '> 30 %' },
      ],
    },
    {
      id: 'extrapancreatique',
      type: 'radio',
      label: 'Complications extrapancréatiques',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 2, label: 'Épanchement pleural ET/OU ascite ET/OU atteintes vasculaires ET/OU atteinte parenchymateuse' },
      ],
    },
  ],
  calculate: (values) => {
    const infl = Number(values.inflammation) || 0
    const nec = Number(values.necrose) || 0
    const extra = Number(values.extrapancreatique) || 0
    const score = infl + nec + extra

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (score <= 4) {
      severity = 'low'
      label = 'Score ≤ 4 — Pancréatite peu sévère'
      recommendation = 'Risque de complications faible (< 5 %). Surveillance standard. Alimentation orale reintroduite dès amélioration.'
    } else if (score <= 8) {
      severity = 'high'
      label = 'Score 6-8 — Modérément sévère'
      recommendation = 'Risque de complications intermédiaire. Surveillance en soins intensifs. TDM de contrôle recommandée.'
    } else {
      severity = 'critical'
      label = 'Score ≥ 10 — Pancréatite sévère'
      recommendation = 'Risque élevé de complications et de mortalité. Réanimation. Discussion drainage / nécrosectomie. TDM injectée urgente.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 4, label: '0-4 — Peu sévère', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 6, max: 8, label: '6-8 — Modérément sévère', severity: 'high', recommendation: 'Soins intensifs. TDM de contrôle.' },
        { min: 10, max: 10, label: '10 — Sévère', severity: 'critical', recommendation: 'Réanimation. Avis chirurgical. Drainage si nécessaire.' },
      ],
    }
  },
  interpretation: `Le **score de Balthazar modifié (score de Mortele)** améliore le score original en intégrant les complications extrapancréatiques :

- Inflammation pancréatique (0, 2 ou 4 pts)
- Nécrose pancréatique (0, 2 ou 4 pts)
- Complications extrapancréatiques (0 ou 2 pts)

Score maximum : 10 points. Un score ≥ 6 est associé à une morbidité élevée et un score de 10 à une mortalité significative.

L\'ajout des complications extrapancréatiques (épanchements pleuraux, ascite, atteinte vasculaire, infarctus splénique ou rénal) améliore la valeur pronostique.`,
  clinicalCommentary: `Préférer la version modifiée (Mortele) à la version originale car elle intègre mieux le pronostic des complications extrapancréatiques. Les épanchements pleuraux sont un marqueur pronostique important. Le score doit être calculé sur un scanner injecté réalisé après 48h d\'évolution. Attention : le scanner précoce sous-estime la nécrose.`,
  references: [
    {
      type: 'pubmed',
      title: 'Mortele KJ et al. A modified CT severity index for evaluating acute pancreatitis: improved correlation with patient outcome. AJR 2004',
      pmid: '15547235',
    },
  ],
}

export default balthazarModifie
