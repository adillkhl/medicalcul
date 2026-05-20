import type { FormulaDefinition } from '../types'

const basdai: FormulaDefinition = {
  id: 'basdai',
  slug: 'basdai',
  name: 'BASDAI — Score d\'activité de la spondylarthrite',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Bath Ankylosing Spondylitis Disease Activity Index — Évaluation subjective de l\'activité de la spondylarthrite ankylosante.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'fatigue',
      type: 'number',
      label: 'Fatigue générale (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '5',
    },
    {
      id: 'rachis',
      type: 'number',
      label: 'Douleur rachidienne nocturne (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '5',
    },
    {
      id: 'articulaire',
      type: 'number',
      label: 'Douleur articulaire périphérique / gonflement (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '3',
    },
    {
      id: 'enthèse',
      type: 'number',
      label: 'Douleur aux points d\'enthèse (talon, sternum, crête iliaque) (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '2',
    },
    {
      id: 'raideur_intensite',
      type: 'number',
      label: 'Intensité de la raideur matinale (EVA 0–10)',
      min: 0,
      max: 10,
      step: 0.5,
      placeholder: '5',
    },
    {
      id: 'raideur_duree',
      type: 'number',
      label: 'Durée de la raideur matinale (minutes)',
      min: 0,
      max: 180,
      step: 5,
      placeholder: '30',
    },
  ],
  calculate: (values) => {
    const fatigue = values.fatigue ?? 0
    const rachis = values.rachis ?? 0
    const articulaire = values.articulaire ?? 0
    const enthese = values.enthese ?? 0
    const raideurInt = values.raideur_intensite ?? 0
    const raideurDuree = values.raideur_duree ?? 0

    const raideurDureeScore = raideurDuree <= 0 ? 0 : Math.min(raideurDuree / 30, 10)

    const avgRaideur = (raideurInt + raideurDureeScore) / 2
    const basdaiVal = (fatigue + rachis + articulaire + enthese + avgRaideur) / 5
    const basdaiRound = Math.round(basdaiVal * 10) / 10

    if (basdaiRound < 4) {
      return {
        value: basdaiRound,
        label: `BASDAI = ${basdaiRound} — Maladie inactive / faible activité`,
        severity: 'low',
        ranges: [
          { min: 0, max: 4, label: '< 4 : Faible activité', severity: 'low' },
          { min: 4, max: 7, label: '4–7 : Activité modérée', severity: 'moderate' },
          { min: 7, max: 10, label: '≥ 7 : Activité élevée', severity: 'high' },
        ],
      }
    }
    if (basdaiRound < 7) {
      return {
        value: basdaiRound,
        label: `BASDAI = ${basdaiRound} — Activité modérée`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 4, label: '< 4 : Faible activité', severity: 'low' },
          { min: 4, max: 7, label: '4–7 : Modérée', severity: 'moderate' },
          { min: 7, max: 10, label: '≥ 7 : Élevée', severity: 'high' },
        ],
      }
    }
    return {
      value: basdaiRound,
      label: `BASDAI = ${basdaiRound} — Activité élevée`,
      severity: 'high',
      ranges: [
        { min: 0, max: 4, label: '< 4 : Faible activité', severity: 'low' },
        { min: 4, max: 7, label: '4–7 : Modérée', severity: 'moderate' },
        { min: 7, max: 10, label: '≥ 7 : Élevée', severity: 'high' },
      ],
    }
  },
  interpretation: `**BASDAI** (Bath Ankylosing Spondylitis Disease Activity Index)

**Calcul :** Moyenne de 5 items (EVA 0–10) :
- Fatigue
- Douleur rachidienne nocturne
- Douleur/gonflement articulaire
- Douleur enthésitique
- Moyenne de l\'intensité et durée de la raideur matinale

**Interprétation :**
- < 4/10 : maladie inactive ou faible activité
- 4–7/10 : activité modérée
- ≥ 7/10 : activité élevée

**Seuil de décision thérapeutique :** BASDAI ≥ 4 (associé à une échec des AINS) justifie la mise sous biothérapie.`,
  clinicalCommentary: `Le BASDAI est le score historique mais tend à être remplacé par l\'ASDAS (plus discriminant). Utile pour le suivi longitudinal et la décision d\'introduction des anti-TNF. Il ne tient pas compte des manifestations extra-articulaires ou de la CRP.`,
  references: [
    {
      type: 'pubmed',
      title: 'Garrett S et al. A new approach to defining disease status in ankylosing spondylitis. J Rheumatol 1994',
      pmid: '7692012',
    },
    {
      type: 'guideline',
      title: 'EULAR 2022 recommendations for the management of axial spondyloarthritis',
      pmid: '35292732',
    },
  ],
}

export default basdai
