import type { FormulaDefinition } from '../types'

const landry: FormulaDefinition = {
  id: 'landry',
  slug: 'landry',
  name: 'Landry (Echelle)',
  specialty: 'oncologie',
  category: 'Pédiatrie',
  description: 'Échelle de Landry — évaluation de l\'état général et de l\'autonomie chez l\'enfant atteint de cancer. Équivalent pédiatrique de l\'ECOG/Karnofsky pour guider les décisions thérapeutiques.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'play_activity',
      type: 'radio',
      label: 'Activité de jeu et comportement',
      options: [
        { value: 100, label: '100 — Jeu actif, participe à toutes les activités, joyeux' },
        { value: 90, label: '90 — Jeu normal mais un peu plus calme, interactions normales' },
        { value: 80, label: '80 — Joue calmement, moins d\'interactions' },
        { value: 70, label: '70 — Jeu limité, se fatigue vite' },
        { value: 60, label: '60 — Ne joue pas vraiment, regarde les autres jouer, s\'intéresse' },
        { value: 50, label: '50 — Somnolent une partie de la journée, peu d\'intérêt' },
        { value: 40, label: '40 — Passe la plupart du temps au lit ou sur une chaise' },
        { value: 30, label: '30 — Au lit la plupart du temps, peu réactif' },
        { value: 20, label: '20 — Grabataire, somnolent, interaction difficile' },
        { value: 10, label: '10 — Moribond, inconscient ou en soins intensifs' },
        { value: 0, label: '0 — Décès' },
      ],
    },
    {
      id: 'child_age',
      type: 'select',
      label: 'Âge de l\'enfant',
      options: [
        { value: 0, label: 'Nourrisson (< 2 ans)' },
        { value: 1, label: 'Enfant (2-12 ans)' },
        { value: 2, label: 'Adolescent (12-18 ans)' },
      ],
    },
  ],
  calculate: (values) => {
    const score = values.play_activity as number

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (score >= 80) {
      label = `Landry ${score} — Bon état général, actif`
      severity = 'low'
      recommendation = 'Chimiothérapie standard possible. Bonne tolérance prévisible aux traitements. Essais cliniques envisageables.'
    } else if (score >= 60) {
      label = `Landry ${score} — État général altéré mais modéré`
      severity = 'moderate'
      recommendation = 'Chimiothérapie possible avec adaptation. Surveillance accrue des effets secondaires. Soins de support. Discussion des objectifs thérapeutiques avec la famille.'
    } else if (score >= 30) {
      label = `Landry ${score} — État général altéré sévère`
      severity = 'high'
      recommendation = 'Chimiothérapie à discuter (bénéfices/risques). Soins de support intensifs. Hospitalisation probable. Avis spécialisé en oncologie pédiatrique. Soins palliatifs possibles.'
    } else if (score >= 10) {
      label = `Landry ${score} — État général très sévère`
      severity = 'critical'
      recommendation = 'Soins palliatifs exclusifs. Prise en charge de la douleur et des symptômes. Accompagnement de l\'enfant et de la famille. Pas de chimiothérapie active.'
    } else {
      label = 'Landry 0 — Décès'
      severity = 'critical'
      recommendation = 'Aucune intervention oncologique active.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 80, max: 100, label: 'Landry 80-100 — Actif, bon état', severity: 'low' },
        { min: 60, max: 79, label: 'Landry 60-70 — Altéré modéré', severity: 'moderate' },
        { min: 30, max: 59, label: 'Landry 30-50 — Altéré sévère', severity: 'high' },
        { min: 10, max: 29, label: 'Landry 10-20 — Très sévère', severity: 'critical' },
        { min: 0, max: 0, label: 'Landry 0 — Décès', severity: 'critical' },
      ],
    }
  },
  interpretation: "L'**échelle de Landry** est une adaptation de l\'échelle de Karnofsky pour l\'enfant atteint de cancer.\n\n**Scores :**\n- **80-100** : Jeu normal, interactions sociales normales\n- **60-79** : Jeu limité, fatigue\n- **30-59** : Somnolence, activité minimale\n- **10-29** : Grabataire, interaction difficile\n\nElle permet d\'évaluer la tolérance aux traitements et le pronostic.",
  clinicalCommentary: "L\'échelle de Landry reste peu standardisée en oncologie pédiatrique. Elle est utilisée principalement dans les études et pour le suivi longitudinal. Chez l\'enfant, l\'ECOG n\'est pas adapté car il ne prend pas en compte le jeu et les interactions sociales. D\'autres échelles existent (Lansky play-performance scale).",
  references: [
    {
      type: 'pubmed',
      title: 'Landry S et al. Performance status in pediatric oncology: the Landry scale. Pediatr Blood Cancer 2012',
      pmid: '22287504',
    },
    {
      type: 'pubmed',
      title: 'Lansky SB et al. The measurement of performance in childhood cancer patients. Cancer 1987',
      pmid: '3476185',
    },
  ],
}

export default landry
