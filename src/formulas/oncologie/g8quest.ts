import type { FormulaDefinition } from '../types'

const g8quest: FormulaDefinition = {
  id: 'g8',
  slug: 'g8quest',
  name: 'G8 (Questionnaire)',
  specialty: 'oncologie',
  category: 'Gériatrie',
  description: 'Questionnaire G8 — dépistage de la fragilité gériatrique chez les patients âgés atteints de cancer. Permet d\'identifier les patients nécessitant une évaluation gériatrique avant décision thérapeutique.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'appetite',
      type: 'radio',
      label: 'Au cours des 3 derniers mois, l\'apport alimentaire a-t-il diminué ?',
      options: [
        { value: 0, label: 'Anorexie sévère (diminution très importante)' },
        { value: 1, label: 'Anorexie modérée' },
        { value: 2, label: 'Pas d\'anorexie' },
      ],
    },
    {
      id: 'weight_loss',
      type: 'radio',
      label: 'Perte de poids involontaire au cours des 3 derniers mois',
      options: [
        { value: 0, label: '> 3 kg' },
        { value: 1, label: 'Ne sait pas' },
        { value: 2, label: '1-3 kg' },
        { value: 3, label: 'Pas de perte de poids' },
      ],
    },
    {
      id: 'mobility',
      type: 'radio',
      label: 'Mobilité : se déplace-t-il ?',
      options: [
        { value: 0, label: 'Alité ou chaise' },
        { value: 1, label: 'Peut se lever mais ne sort pas' },
        { value: 2, label: 'Sort' },
      ],
    },
    {
      id: 'neuropsych',
      type: 'boolean',
      label: 'Troubles neuropsychologiques (démence, dépression sévère)',
    },
    {
      id: 'bmi',
      type: 'radio',
      label: 'Indice de masse corporelle (IMC)',
      options: [
        { value: 0, label: '< 18,5 (dénutrition)' },
        { value: 1, label: '18,5 — 21 (risque de dénutrition)' },
        { value: 2, label: '21 — 23 (limite)' },
        { value: 3, label: '≥ 23 (normal)' },
      ],
    },
    {
      id: 'medications',
      type: 'radio',
      label: 'Nombre de médicaments par jour',
      options: [
        { value: 0, label: '> 3 médicaments' },
        { value: 1, label: '1-3 médicaments' },
        { value: 2, label: '0 médicament' },
      ],
    },
    {
      id: 'self_health',
      type: 'radio',
      label: 'Auto-évaluation de la santé (par rapport aux autres personnes du même âge)',
      options: [
        { value: 0, label: 'Moins bonne' },
        { value: 0.5, label: 'Ne sait pas / similaire' },
        { value: 1, label: 'Meilleure' },
      ],
    },
    {
      id: 'age_score',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 0, label: '≥ 85 ans' },
        { value: 0.5, label: '80-84 ans' },
        { value: 1, label: '< 80 ans' },
      ],
    },
  ],
  calculate: (values) => {
    const appetite = values.appetite as number
    const weightLoss = values.weight_loss as number
    const mobility = values.mobility as number
    const neuropsych = values.neuropsych as boolean
    const bmiScore = values.bmi as number
    const meds = values.medications as number
    const selfHealth = values.self_health as number
    const ageScore = values.age_score as number

    let total = appetite + weightLoss + mobility + (neuropsych ? 0 : 1) + bmiScore + meds + selfHealth + ageScore

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (total > 14) {
      label = `G8 : ${Math.round(total * 10) / 10} — G8 normal (non fragilisé)`
      severity = 'low'
      recommendation = 'Patient non fragilisé. Traitement oncologique standard envisageable sans évaluation gériatrique complémentaire. Surveillance standard.'
    } else {
      label = `G8 : ${Math.round(total * 10) / 10} — G8 anormal (fragilité suspectée)`
      severity = 'moderate'
      recommendation = 'Patient FRAGILISÉ. Nécessite une évaluation gériatrique complète (EGS) avant toute décision thérapeutique. Adapter le traitement oncologique selon les recommandations de l\'évaluation gériatrique.'
    }

    return {
      value: Math.round(total * 10) / 10,
      label,
      severity,
      details: {
        'Apport alimentaire': ['Anorexie sévère', 'Anorexie modérée', 'Normal'][appetite],
        'Perte de poids': ['> 3 kg', 'Ne sait pas', '1-3 kg', 'Pas de perte'][weightLoss],
        'Mobilité': ['Alité', 'Lève/ne sort pas', 'Sort'][mobility],
        'IMC': ['< 18,5', '18,5-21', '21-23', '≥ 23'][bmiScore],
      },
      ranges: [
        { min: 0, max: 14, label: 'G8 anormal — évaluation gériatrique nécessaire', severity: 'moderate' },
        { min: 14.5, max: 17, label: 'G8 normal — pas de fragilité', severity: 'low' },
      ],
    }
  },
  interpretation: "Le **G8** (Onco-Geriatric Screening Tool) est un questionnaire de dépistage de la fragilité gériatrique chez le patient âgé (> 70 ans) atteint de cancer.\n\n**8 items — score total de 0 à 17 :**\n- Alimentation (0-2)\n- Perte de poids (0-3)\n- Mobilité (0-2)\n- Troubles neuropsychologiques (0-1)\n- IMC (0-3)\n- Médicaments (0-2)\n- Auto-évaluation santé (0-1)\n- Âge (0-1)\n\n**Seuil :** ≤ 14 → patient fragilisé nécessitant une évaluation gériatrique complète.",
  clinicalCommentary: "Le G8 est l\'outil de dépistage gériatrique le plus utilisé en oncogériatrie. Sa sensibilité est > 85% pour détecter la fragilité. Un score G8 normal (≥ 15) permet d\'éviter une évaluation gériatrique complète dans environ 40% des cas. En cas de G8 ≤ 14, une évaluation gériatrique standardisée (EGS) est nécessaire avant d\'initier ou de poursuivre un traitement oncologique. Le G8 est recommandé par l\'International Society of Geriatric Oncology (SIOG) et la HAS.",
  references: [
    {
      type: 'pubmed',
      title: 'Soubeyran P et al. Validation of the G8 screening tool in geriatric oncology: the ONCODAGE project. J Clin Oncol 2011',
      pmid: '21422412',
    },
    {
      type: 'pubmed',
      title: 'Decoster L et al. Screening tools for the identification of vulnerable elderly patients in oncology. J Geriatr Oncol 2015',
      pmid: '25771967',
    },
  ],
}

export default g8quest
