import type { FormulaDefinition } from '../types'

const bref: FormulaDefinition = {
  id: 'bref',
  slug: 'bref',
  name: 'BREF — Batterie Rapide d\'Efficience Frontale',
  specialty: 'neurologie',
  category: 'Neuropsychologie',
  description: 'Évaluation rapide des fonctions exécutives et frontales (score 0–18)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'similitudes',
      type: 'radio',
      label: '1. Similitudes (conceptualisation) — ex: « une pomme et une banane ? »',
      options: [
        { value: 3, label: '3 réponses correctes (3 paires réussies)' },
        { value: 2, label: '2 réponses correctes' },
        { value: 1, label: '1 réponse correcte' },
        { value: 0, label: '0 réponse correcte' },
      ],
    },
    {
      id: 'fluence',
      type: 'radio',
      label: '2. Fluence verbale (flexibilité) — mots commençant par « S » en 1 min',
      options: [
        { value: 3, label: '≥ 9 mots' },
        { value: 2, label: '6–8 mots' },
        { value: 1, label: '3–5 mots' },
        { value: 0, label: '< 3 mots' },
      ],
    },
    {
      id: 'series',
      type: 'radio',
      label: '3. Séquences motrices (programmation) — série poing/tranche/paume',
      options: [
        { value: 3, label: '6 séquences correctes seul' },
        { value: 2, label: '6 séquences correctes avec incitations verbales' },
        { value: 1, label: '≥ 3 séquences correctes' },
        { value: 0, label: '< 3 séquences correctes' },
      ],
    },
    {
      id: 'conflit',
      type: 'radio',
      label: '4. Conflit (sensibilité à l\'interférence) — « tapez 1 fois si je tape 2 fois »',
      options: [
        { value: 3, label: 'Aucune erreur' },
        { value: 2, label: '1–2 erreurs' },
        { value: 1, label: '> 2 erreurs' },
        { value: 0, label: 'Échoue : 4 erreurs consécutives' },
      ],
    },
    {
      id: 'go_nogo',
      type: 'radio',
      label: '5. Go-No-Go (contrôle inhibiteur) — « ne tapez pas quand je tape 2 fois »',
      options: [
        { value: 3, label: 'Aucune erreur' },
        { value: 2, label: '1–2 erreurs' },
        { value: 1, label: '> 2 erreurs' },
        { value: 0, label: 'Échoue : tape au rythme de l\'examinateur' },
      ],
    },
    {
      id: 'prehension',
      type: 'radio',
      label: '6. Préhension (autonomie environnementale) — tendez les mains, paumes vers le haut',
      options: [
        { value: 3, label: 'Ne prend pas les mains de l\'examinateur' },
        { value: 2, label: 'Hésite / demande ce qu\'il doit faire' },
        { value: 1, label: 'Prend sans hésiter' },
        { value: 0, label: 'Prend même après qu\'on lui ait dit de ne pas prendre' },
      ],
    },
  ],
  calculate: (values) => {
    const similitudes = values.similitudes ?? 0
    const fluence = values.fluence ?? 0
    const series = values.series ?? 0
    const conflit = values.conflit ?? 0
    const goNogo = values.go_nogo ?? 0
    const prehension = values.prehension ?? 0

    const total = similitudes + fluence + series + conflit + goNogo + prehension

    const getInterpretation = (s: number) => {
      if (s >= 16) return 'Fonctions frontales normales'
      if (s >= 13) return 'Dysfonctionnement frontal léger'
      if (s >= 10) return 'Dysfonctionnement frontal modéré'
      return 'Dysfonctionnement frontal sévère'
    }

    return {
      value: total,
      label: getInterpretation(total),
      severity: total >= 16 ? 'low' : total >= 13 ? 'moderate' : total >= 10 ? 'high' : 'critical',
      details: { Similitudes: similitudes, Fluence: fluence, Séquences: series, Conflit: conflit, GoNoGo: goNogo, Préhension: prehension },
      ranges: [
        { min: 16, max: 18, label: 'Normal', severity: 'low', recommendation: 'Fonctions exécutives préservées. Aucune exploration complémentaire nécessaire.' },
        { min: 13, max: 15, label: 'Dysfonctionnement frontal léger', severity: 'moderate', recommendation: 'Surveillance évolution. Bilan neuropsychologique complet recommandé.' },
        { min: 10, max: 12, label: 'Dysfonctionnement frontal modéré', severity: 'high', recommendation: 'Bilan neuropsychologique approfondi. Recherche étiologique : IRM cérébrale, bilan cognitif.' },
        { min: 0, max: 9, label: 'Dysfonctionnement frontal sévère', severity: 'critical', recommendation: 'Prise en charge neurologique et neuropsychologique urgente. Bilan étiologique complet (démence fronto-temporale, maladie neurodégénérative, lésion frontale).' },
      ],
    }
  },
  interpretation: `La **BREF** (Batterie Rapide d’Efficience Frontale) est un test court (10 minutes) évaluant 6 dimensions des fonctions exécutives et frontales.

**Les 6 items :**
1. **Similitudes** (conceptualisation) — 0–3
2. **Fluence verbale** (flexibilité mentale) — 0–3
3. **Séquences motrices** (programmation) — 0–3
4. **Conflit** (sensibilité à l’interférence) — 0–3
5. **Go-No-Go** (contrôle inhibiteur) — 0–3
6. **Préhension** (autonomie environnementale) — 0–3

**Total : 0–18.** Pathologique si < 16. La BREF est sensible au dysfonctionnement frontal mais pas spécifique d\'une étiologie particulière.`,
  clinicalCommentary: `La BREF est un outil de repérage qui ne remplace pas un bilan neuropsychologique complet. Très utile au lit du patient pour suspecter une atteinte frontale. Pathologique si < 16/18, mais les normes dépendent de l\'âge et du niveau socioculturel. Attention aux faux négatifs : un patient avec syndrome frontal massif peut réussir quelques items. La BREF est utile dans le diagnostic différentiel : démence fronto-temporale (DFT) vs maladie d’Alzheimer — la DFT donne de moins bons scores à la BREF. L\'item de préhension est très spécifique d\'atteinte frontale.`,
  references: [
    {
      type: 'pubmed',
      title: 'Dubois B et al. The FAB: a frontal assessment battery at bedside. Neurology 2000',
      pmid: '11113207',
    },
    {
      type: 'pubmed',
      title: 'Slachevsky A et al. The FAB: frontal assessment battery. Normative data. Rev Neurol 2004',
      pmid: '14752338',
    },
  ],
}

export default bref
