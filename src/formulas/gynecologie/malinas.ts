import type { FormulaDefinition } from '../types'

const malinas: FormulaDefinition = {
  id: 'malinas',
  slug: 'malinas',
  name: 'Malinas (Score)',
  specialty: 'gynecologie',
  category: 'Accouchement',
  description: 'Score de Malinas pour évaluer le temps restant avant un accouchement imminent et guider la décision de transfert.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge gestationnel',
      options: [
        { value: 0, label: '≥ 36 SA' },
        { value: 1, label: '< 36 SA' },
      ],
    },
    {
      id: 'parite',
      type: 'radio',
      label: 'Parité',
      options: [
        { value: 0, label: 'Primipare (nullipare)' },
        { value: 1, label: 'Multipare (≥ 1 accouchement)' },
      ],
    },
    {
      id: 'contractions',
      type: 'radio',
      label: 'Durée des contractions',
      options: [
        { value: 0, label: '< 1 heure' },
        { value: 1, label: '≥ 1 heure' },
      ],
    },
    {
      id: 'rupture',
      type: 'radio',
      label: 'Rupture des membranes',
      options: [
        { value: 0, label: 'Non rompue' },
        { value: 1, label: 'Rompue' },
      ],
    },
    {
      id: 'dilatation',
      type: 'radio',
      label: 'Dilatation cervicale estimée',
      options: [
        { value: 0, label: '< 5 cm' },
        { value: 1, label: '≥ 5 cm' },
      ],
    },
  ],
  calculate: (values) => {
    const age = parseInt(values.age) || 0
    const parite = parseInt(values.parite) || 0
    const contractions = parseInt(values.contractions) || 0
    const rupture = parseInt(values.rupture) || 0
    const dilatation = parseInt(values.dilatation) || 0
    const total = age + parite + contractions + rupture + dilatation

    let tempsEstime: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (total <= 1) { tempsEstime = '> 6 heures'; severity = 'low' }
    else if (total === 2) { tempsEstime = '3-6 heures'; severity = 'moderate' }
    else if (total === 3) { tempsEstime = '1-3 heures'; severity = 'high' }
    else { tempsEstime = '< 1 heure'; severity = 'critical' }

    return {
      value: total,
      label: `Score de Malinas : ${total}/5 — Accouchement estimé dans ${tempsEstime}`,
      severity,
      ranges: [
        { min: 0, max: 1, label: 'Accouchement > 6h', severity: 'low', recommendation: 'Pas d urgence immédiate. Surveillance clinique standard. Préparer le transfert en maternité si nécessaire.' },
        { min: 2, max: 2, label: 'Accouchement dans 3-6h', severity: 'moderate', recommendation: 'Surveillance rapprochée. Organiser le transfert vers une maternité adaptée. Préparer le matériel d accouchement.' },
        { min: 3, max: 3, label: 'Accouchement dans 1-3h', severity: 'high', recommendation: 'Transfert urgent vers maternité la plus proche. Prévenir l équipe obstétricale. Préparer le matériel d accouchement en cas d accouchement inopiné.' },
        { min: 4, max: 5, label: 'Accouchement imminent < 1h', severity: 'critical', recommendation: 'NE PAS TRANSFÉRER. Préparer l accouchement sur place (SAMU / SMUR). Matériel : gants stériles, champs, clamp et ciseaux, oxytocine. Réanimation néonatale si besoin.' },
      ],
    }
  },
  interpretation: `Le **score de Malinas** est un outil d aide à la décision pour les accouchements inopinés extra-hospitaliers ou en salle de naissance, permettant d estimer le délai avant l accouchement.

**Cinq critères binaires (0-1) :**
1. **Âge gestationnel** ≥ 36 SA
2. **Parité** ≥ 1
3. **Contractions** ≥ 1 heure
4. **Rupture des membranes** oui
5. **Dilatation** ≥ 5 cm

**Total : 0–5**
- 0-1 : > 6 heures
- 2 : 3-6 heures
- 3 : 1-3 heures
- 4-5 : < 1 heure (imminent)`,
  clinicalCommentary: `Le score de Malinas est très utilisé par les SMUR et aux urgences gynécologiques. Un score ≥ 4 contre-indique le transfert et impose la préparation de l accouchement sur place. En cas de doute, l examen clinique (toucher vaginal) reste l examen de référence. Toujours préparer le matériel de réanimation néonatale en cas d accouchement inopiné.`,
  references: [
    {
      type: 'pubmed',
      title: 'Malinas Y. Score de risque d accouchement imminent. J Gynecol Obstet Biol Reprod 1990',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Accouchement inopiné extra-hospitalier (Recommandations 2018)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default malinas
