import type { FormulaDefinition } from '../types'

const asdas: FormulaDefinition = {
  id: 'asdas',
  slug: 'asdas',
  name: 'ASDAS-CRP — Score d\'activité de la spondylarthrite',
  specialty: 'rhumatologie',
  category: 'Spondylarthrite',
  description: 'Ankylosing Spondylitis Disease Activity Score — Évaluation de l\'activité de la spondylarthrite ankylosante (formule ASDAS-CRP validée par l\'ASAS)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'douleur_rachidienne',
      type: 'number',
      label: 'Douleur rachidienne (échelle 0–5) — dernier mois',
      min: 0,
      max: 5,
      step: 0.1,
      placeholder: '3',
    },
    {
      id: 'douleur_periph',
      type: 'number',
      label: 'Douleur/gonflement périphérique (échelle 0–5) — dernier mois',
      min: 0,
      max: 5,
      step: 0.1,
      placeholder: '2',
    },
    {
      id: 'raid_matinale',
      type: 'number',
      label: 'Raideur matinale (échelle 0–5) — dernier mois',
      min: 0,
      max: 5,
      step: 0.1,
      placeholder: '2',
    },
    {
      id: 'global_patient',
      type: 'number',
      label: 'Évaluation globale du patient (échelle 0–5) — dernier mois',
      min: 0,
      max: 5,
      step: 0.1,
      placeholder: '3',
    },
    {
      id: 'crp',
      type: 'number',
      label: 'CRP (mg/L)',
      min: 0,
      max: 200,
      step: 0.1,
      placeholder: '10',
    },
  ],
  calculate: (values) => {
    const backPain = Number(values.douleur_rachidienne) || 0
    const periphPain = Number(values.douleur_periph) || 0
    const morningStiff = Number(values.raid_matinale) || 0
    const patientGlobal = Number(values.global_patient) || 0
    const crp = Number(values.crp) || 5

    // ASDAS-CRP formula (Machado et al. 2011) — coefficients exacts ASAS
    // 0.12×back_pain + 0.06×morning_stiffness + 0.11×patient_global + 0.07×peripheral_pain + 0.58×ln(CRP+1)
    const asdasVal = 0.12 * backPain
      + 0.06 * morningStiff
      + 0.11 * patientGlobal
      + 0.07 * periphPain
      + 0.58 * Math.log(crp + 1)

    const asdasRound = Math.round(asdasVal * 100) / 100

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'

    if (asdasRound < 1.3) {
      label = `ASDAS-CRP = ${asdasRound} — Maladie inactive`
      severity = 'low'
    } else if (asdasRound < 2.1) {
      label = `ASDAS-CRP = ${asdasRound} — Activité modérée`
      severity = 'moderate'
    } else if (asdasRound < 3.5) {
      label = `ASDAS-CRP = ${asdasRound} — Activité élevée`
      severity = 'high'
    } else {
      label = `ASDAS-CRP = ${asdasRound} — Activité très élevée`
      severity = 'critical'
    }

    return {
      value: asdasRound,
      label,
      severity,
      details: {
        'Douleur rachidienne (0-5)': backPain,
        'Douleur périphérique (0-5)': periphPain,
        'Raideur matinale (0-5)': morningStiff,
        'Global patient (0-5)': patientGlobal,
        'CRP': `${crp} mg/L`,
        'ln(CRP+1)': `${Math.round(Math.log(crp + 1) * 100) / 100}`,
      },
      ranges: [
        { min: 0, max: 1.3, label: '< 1.3 : Maladie inactive', severity: 'low' },
        { min: 1.3, max: 2.1, label: '1.3–2.1 : Activité modérée', severity: 'moderate' },
        { min: 2.1, max: 3.5, label: '2.1–3.5 : Activité élevée', severity: 'high' },
        { min: 3.5, max: 99, label: '> 3.5 : Activité très élevée', severity: 'critical' },
      ],
    }
  },
  interpretation: `**ASDAS** (Ankylosing Spondylitis Disease Activity Score) — Score composite validé par l'ASAS.

**Formule ASDAS-CRP :**
0,12 × Douleur rachidienne (0-5) + 0,06 × Raideur matinale (0-5) + 0,11 × Global patient (0-5) + 0,07 × Douleur périphérique (0-5) + 0,58 × ln(CRP+1)

**Seuils d'activité :**
- < 1,3 : Maladie inactive
- 1,3 – < 2,1 : Activité modérée
- 2,1 – < 3,5 : Activité élevée
- ≥ 3,5 : Activité très élevée

**Seuils de réponse clinique :**
- Amélioration ≥ 1,1 : réponse cliniquement importante
- Amélioration ≥ 2,0 : amélioration majeure

⚠️ Tous les items subjectifs sont sur une échelle 0–5 (et non 0–10 comme le BASDAI).`,
  clinicalCommentary: `L'ASDAS est plus sensible que le BASDAI pour discriminer l'activité de la spondylarthrite. Il est recommandé par l'ASAS et l'EULAR comme critère de décision thérapeutique (cibles : ASDAS inactive ou faible activité). Ce calculateur implémente l'ASDAS-CRP conforme à la publication originale (Machado et al. 2011).`,
  references: [
    {
      type: 'pubmed',
      title: 'van der Heijde D et al. ASDAS, a highly discriminatory ASAS-endorsed disease activity score. Ann Rheum Dis 2009',
      pmid: '19297344',
    },
    {
      type: 'pubmed',
      title: 'Machado P et al. Ankylosing Spondylitis Disease Activity Score (ASDAS). Ann Rheum Dis 2011',
      pmid: '21389034',
    },
  ],
}

export default asdas
