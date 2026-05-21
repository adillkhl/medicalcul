import type { FormulaDefinition } from '../types'

const elift: FormulaDefinition = {
  id: 'elift', slug: 'elift',
  name: 'ELIFT (Elderly Life Intervention for Frailty Tool) — Évaluation de Fragilité',
  specialty: 'geriatrie', category: 'Fragilité',
  description: 'ELIFT: outil d\'évaluation de la fragilité de la personne âgée, basé sur 7 critères (fatigue, résistance, mobilité, comorbidités, perte de poids, cognition, chutes). Chaque critère côté 0-1, score /7.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'fatigue', type: 'boolean', label: 'Fatigue (sentiment d\'épuisement fréquent, manque d\'énergie)', weight: 1 },
    { id: 'resistance', type: 'boolean', label: 'Difficulté à monter un étage d\'escalier sans aide', weight: 1 },
    { id: 'mobilite', type: 'boolean', label: 'Difficulté à marcher 500 mètres seul', weight: 1 },
    { id: 'comorbidites', type: 'boolean', label: '≥ 5 maladies chroniques (diabète, HTA, coronaropathie, AVC, IRC, BPCO, cancer, etc.)', weight: 1 },
    { id: 'poids', type: 'boolean', label: 'Perte de poids involontaire > 5% en 6 mois', weight: 1 },
    { id: 'cognition', type: 'boolean', label: 'Plainte cognitive subjective ou trouble objectif (MMS < 26 ou test 5 mots anormal)', weight: 1 },
    { id: 'chutes', type: 'boolean', label: '≥ 2 chutes dans l\'année ou une chute avec traumatisme', weight: 1 },
  ],
  calculate: (values) => {
    const fatigue = values.fatigue ? 1 : 0
    const resistance = values.resistance ? 1 : 0
    const mobilite = values.mobilite ? 1 : 0
    const comorbidites = values.comorbidites ? 1 : 0
    const poids = values.poids ? 1 : 0
    const cognition = values.cognition ? 1 : 0
    const chutes = values.chutes ? 1 : 0

    const score = fatigue + resistance + mobilite + comorbidites + poids + cognition + chutes

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score === 0) {
      label = 'ELIFT 0/7 — Patient robuste, pas de fragilité'
      severity = 'low'
      recommendation = 'Patient robuste. Pas de syndrome de fragilité. Maintenir les activités habituelles. Prévention primaire.'
    } else if (score <= 2) {
      label = `ELIFT ${score}/7 — Fragilité légère (pré-fragile)`
      severity = 'low'
      recommendation = 'Pré-fragilité ou fragilité légère. Proposer des interventions ciblées : activité physique adaptée, nutrition équilibrée, maintien du lien social. Surveillance annuelle.'
    } else if (score <= 4) {
      label = `ELIFT ${score}/7 — Fragilité modérée`
      severity = 'moderate'
      recommendation = 'Fragilité modérée. Évaluation gériatrique standardisée recommandée. Intervention multidimensionnelle : activité physique, nutrition, révision des médicaments, prise en charge des comorbidités. Surveillance rapprochée (3-6 mois).'
    } else {
      label = `ELIFT ${score}/7 — Fragilité sévère`
      severity = 'high'
      recommendation = 'Fragilité sévère. Prise en charge gériatrique pluridisciplinaire urgente. Hospitalisation de jour ou consultation gériatrique. Évaluation complète : cognitive, nutritionnelle, motrice, sociale. Plan de soins personnalisé.'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Fatigue': fatigue ? 'Oui' : 'Non',
        'Difficulté escalier': resistance ? 'Oui' : 'Non',
        'Difficulté marche': mobilite ? 'Oui' : 'Non',
        'Comorbidités (≥5)': comorbidites ? 'Oui' : 'Non',
        'Perte de poids': poids ? 'Oui' : 'Non',
        'Trouble cognitif': cognition ? 'Oui' : 'Non',
        'Chutes': chutes ? 'Oui' : 'Non',
        'Score total': `${score}/7`,
      },
      ranges: [
        { min: 0, max: 0, label: '0 — Robuste', severity: 'low', recommendation: 'Prévention primaire.' },
        { min: 1, max: 2, label: '1-2 — Fragilité légère', severity: 'low', recommendation: 'Interventions ciblées.' },
        { min: 3, max: 4, label: '3-4 — Fragilité modérée', severity: 'moderate', recommendation: 'Évaluation gériatrique.' },
        { min: 5, max: 7, label: '5-7 — Fragilité sévère', severity: 'high', recommendation: 'Prise en charge urgente.' },
      ],
    }
  },
  interpretation: `**ELIFT — Évaluation de la Fragilité**

**7 critères de fragilité :**
1. **Fatigue** : épuisement ressenti fréquemment
2. **Résistance** : difficulté à monter un étage
3. **Mobilité** : difficulté à marcher 500 m
4. **Comorbidités** : ≥ 5 maladies chroniques
5. **Perte de poids** : involontaire > 5% en 6 mois
6. **Cognition** : plainte ou trouble objectif
7. **Chutes** : ≥ 2 chutes/an ou chute traumatique

**Interprétation :**
- **0** : Robuste — pas de fragilité
- **1-2** : Pré-fragile / fragilité légère
- **3-4** : Fragilité modérée
- **5-7** : Fragilité sévère

Le syndrome de fragilité est un état réversible qui précède la dépendance. Son repérage précoce permet d\'instaurer des mesures préventives (activité physique, nutrition, révision médicamenteuse) pour prévenir la perte d\'autonomie.`,
  clinicalCommentary: 'Le concept de fragilité (frailty) est central en gériatrie. Il s\'agit d\'un état de vulnérabilité physiologique lié au vieillissement, réversible si pris en charge précocement. L\'ELIFT est un outil simple de dépistage. Pour une évaluation plus complète, utiliser le phénotype de Fried (5 critères : perte de poids, fatigue, faiblesse musculaire, vitesse de marche lente, faible activité physique) ou l\'échelle de fragilité de Rockwood (Clinical Frailty Scale).',
  references: [
    { type: 'pubmed', title: 'Fried LP et al. Frailty in older adults: evidence for a phenotype. J Gerontol A Biol Sci Med Sci 2001', pmid: '11253156' },
    { type: 'pubmed', title: 'Rockwood K et al. A global clinical measure of fitness and frailty in elderly people. CMAJ 2005', pmid: '16043667' },
    { type: 'guideline', title: 'HAS — Prévention de la perte d\'autonomie chez la personne âgée fragile', url: 'https://www.has-sante.fr/' },
  ],
}
export default elift
