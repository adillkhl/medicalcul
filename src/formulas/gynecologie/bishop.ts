import type { FormulaDefinition } from '../types'

const bishop: FormulaDefinition = {
  id: 'bishop',
  slug: 'bishop',
  name: 'Bishop (Score)',
  specialty: 'gynecologie',
  category: 'Accouchement',
  description: 'Score de Bishop pour évaluer la maturité cervicale et pronostiquer le succès d une induction du travail.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'dilatation',
      type: 'radio',
      label: 'Dilatation cervicale',
      options: [
        { value: 0, label: 'Fermé (0 cm)' },
        { value: 1, label: '1-2 cm' },
        { value: 2, label: '3-4 cm' },
        { value: 3, label: '≥ 5 cm' },
      ],
    },
    {
      id: 'effacement',
      type: 'radio',
      label: 'Effacement du col',
      options: [
        { value: 0, label: '0-30 %' },
        { value: 1, label: '40-50 %' },
        { value: 2, label: '60-70 %' },
        { value: 3, label: '≥ 80 %' },
      ],
    },
    {
      id: 'consistance',
      type: 'radio',
      label: 'Consistance du col',
      options: [
        { value: 0, label: 'Ferme' },
        { value: 1, label: 'Moyenne' },
        { value: 2, label: 'Molle' },
      ],
    },
    {
      id: 'position',
      type: 'radio',
      label: 'Position du col',
      options: [
        { value: 0, label: 'Postérieur' },
        { value: 1, label: 'Médian' },
        { value: 2, label: 'Centré / antérieur' },
      ],
    },
    {
      id: 'presentation',
      type: 'radio',
      label: 'Hauteur de la présentation',
      options: [
        { value: 0, label: 'Mobile / -3 au-dessus des épines' },
        { value: 1, label: 'Appliqué / -2' },
        { value: 2, label: 'Fixé / -1, 0' },
        { value: 3, label: 'Engagé / +1, +2' },
      ],
    },
  ],
  calculate: (values) => {
    const d = parseInt(values.dilatation) || 0
    const e = parseInt(values.effacement) || 0
    const cons = parseInt(values.consistance) || 0
    const pos = parseInt(values.position) || 0
    const pres = parseInt(values.presentation) || 0
    const score = d + e + cons + pos + pres

    let severity: 'low' | 'moderate' | 'high'
    let recommendation: string
    if (score <= 4) { severity = 'low'; recommendation = 'Col défavorable. Préparation cervicale nécessaire avant induction (prostaglandines, ballonnet).' }
    else if (score <= 6) { severity = 'moderate'; recommendation = 'Col intermédiaire. Induction raisonnable. Discuter maturation cervicale préalable.' }
    else { severity = 'high'; recommendation = 'Col favorable. Induction possible directement par oxytocine ou amniotomie.' }

    return {
      value: score,
      label: `Score de Bishop : ${score}/13`,
      severity,
      risk: score >= 6 ? 85 : score >= 4 ? 60 : 30,
      riskUnit: '% succès induction estimé',
      ranges: [
        { min: 0, max: 4, label: 'Col défavorable', severity: 'low', recommendation: 'Échec d induction probable sans maturation. Utiliser prostaglandines (dinoprostone, misoprostol) ou ballonnet de Cook.' },
        { min: 5, max: 6, label: 'Col intermédiaire', severity: 'moderate', recommendation: 'Induction possible. Maturation souhaitable si nullipare ou contexte défavorable.' },
        { min: 7, max: 13, label: 'Col favorable', severity: 'high', recommendation: 'Induction du travail possible directement. Déclenchement par oxytocine IV et/ou amniotomie.' },
      ],
    }
  },
  interpretation: `Le **score de Bishop** évalue la maturité du col utérin avant déclenchement artificiel du travail. Cinq paramètres sont cotés :

- **Dilatation** (0–3)
- **Effacement** (0–3)
- **Consistance** (0–2)
- **Position** (0–2)
- **Présentation** (0–3)

**Total : 0–13**

Un score ≥ 6 prédit un bon pronostic de succès d induction. Un score ≤ 4 nécessite une maturation cervicale préalable.`,
  clinicalCommentary: `Le score de Bishop est un standard en salle de naissance. Il peut être complété par l échographie du col (longueur cervicale). En cas de Bishop défavorable, la maturation par prostaglandines (dinoprostone, misoprostol) ou ballonnet de Cook est indiquée. Les facteurs de mauvais pronostic : nulliparité, obésité, âge maternel avancé, Bishop bas.`,
  references: [
    {
      type: 'pubmed',
      title: 'Bishop EH. Pelvic scoring for elective induction. Obstet Gynecol 1964',
      pmid: '14199558',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Déclenchement artificiel du travail (Recommandations 2021)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default bishop
