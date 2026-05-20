import type { FormulaDefinition } from '../types'

const albi: FormulaDefinition = {
  id: 'albi',
  slug: 'albi',
  name: 'ALBI (Score) — Albumin-Bilirubin',
  specialty: 'gastroenterologie',
  category: 'Fonction hépatique',
  description: 'Évaluation de la fonction hépatique basée sur l\'albumine et la bilirubine, alternative au Child-Pugh',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'bilirubine',
      type: 'number',
      label: 'Bilirubine totale',
      unit: 'µmol/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 25',
    },
    {
      id: 'albumine',
      type: 'number',
      label: 'Albumine',
      unit: 'g/L',
      min: 0,
      max: 60,
      step: 1,
      placeholder: 'Ex: 35',
    },
  ],
  calculate: (values) => {
    const bilirubin = Number(values.bilirubine)
    const albumin = Number(values.albumine)

    if (!bilirubin || !albumin || bilirubin <= 0 || albumin <= 0) {
      return {
        value: 0,
        label: 'Données insuffisantes',
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner bilirubine et albumine.' },
        ],
      }
    }

    const score = (Math.log10(bilirubin) * 0.66) + (albumin * -0.085)
    const scoreArrondi = Math.round(score * 100) / 100

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi <= -2.60) {
      severity = 'low'
      label = 'Grade 1 — Bonne fonction hépatique'
      recommendation = 'Fonction hépatique préservée. Surveillance standard. Pronostic favorable.'
    } else if (scoreArrondi <= -1.39) {
      severity = 'moderate'
      label = 'Grade 2 — Fonction hépatique altérée'
      recommendation = 'Altération modérée de la fonction hépatique. Surveillance rapprochée. Évaluation pour traitement adapté.'
    } else {
      severity = 'high'
      label = 'Grade 3 — Fonction hépatique sévèrement altérée'
      recommendation = 'Fonction hépatique sévèrement altérée. Pronostic réservé. Discussion transplant hépatique. Consultation spécialisée urgente.'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: -10, max: -2.61, label: 'Grade 1 (≤ -2.60) — Bonne fonction', severity: 'low', recommendation: 'Fonction hépatique préservée. Pronostic favorable.' },
        { min: -2.60, max: -1.40, label: 'Grade 2 (-2.60 à -1.39) — Altération modérée', severity: 'moderate', recommendation: 'Surveillance rapprochée. Évaluation hépatologique.' },
        { min: -1.39, max: 10, label: 'Grade 3 (≥ -1.39) — Altération sévère', severity: 'high', recommendation: 'Pronostic réservé. Discussion transplant. Avis spécialisé urgent.' },
      ],
    }
  },
  interpretation: `Le **score ALBI (Albumin-Bilirubin)** est un index de la fonction hépatique basé uniquement sur deux paramètres biologiques :

**Formule** : ALBI = (log₁₀ bilirubine × 0.66) + (albumine × -0.085)

| Grade | Score | Interprétation |
|-------|-------|----------------|
| Grade 1 | ≤ -2.60 | Fonction hépatique préservée |
| Grade 2 | -2.60 à -1.39 | Altération modérée |
| Grade 3 | ≥ -1.39 | Altération sévère |

Développé comme alternative objective au Child-Pugh, l’ALBI élimine la subjectivité des critères cliniques (ascite, encéphalopathie). Il est validé dans le carcinome hépatocellulaire et la cirrhose.`,
  clinicalCommentary: `L\'ALBI est particulièrement utile dans l\'évaluation pronostique du carcinome hépatocellulaire. Il est plus objectif que le Child-Pugh car il repose uniquement sur des biomarqueurs. Utilisé en complément du Child-Pugh, pas nécessairement en remplacement. L\'ALBI-2 (avec score modifié) existe également pour une stratification plus fine. Attention : l’ALBI ne prédit pas la décompensation comme le MELD.`,
  references: [
    {
      type: 'pubmed',
      title: 'Johnson PJ et al. Assessment of liver function in patients with hepatocellular carcinoma: a new evidence-based approach — the ALBI grade. J Clin Oncol 2015',
      pmid: '25605835',
    },
  ],
}

export default albi
