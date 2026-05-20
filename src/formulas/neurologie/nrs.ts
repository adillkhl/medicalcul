import type { FormulaDefinition } from '../types'

const nrs: FormulaDefinition = {
  id: 'nrs',
  slug: 'nrs',
  name: 'NRS — Numeric Rating Scale (Échelle Numérique de Douleur)',
  specialty: 'neurologie',
  category: 'Douleur',
  description: 'Évaluation de l\'intensité de la douleur par auto-évaluation numérique de 0 à 10',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'douleur',
      type: 'radio',
      label: 'Quel est le niveau de votre douleur actuellement (moyenne des dernières 24h) ?',
      options: [
        { value: 0, label: '0 — Aucune douleur' },
        { value: 1, label: '1 — Douleur très légère' },
        { value: 2, label: '2 — Douleur légère' },
        { value: 3, label: '3 — Douleur modérée légère' },
        { value: 4, label: '4 — Douleur modérée' },
        { value: 5, label: '5 — Douleur modérée forte' },
        { value: 6, label: '6 — Douleur forte' },
        { value: 7, label: '7 — Douleur très forte' },
        { value: 8, label: '8 — Douleur intense' },
        { value: 9, label: '9 — Douleur très intense' },
        { value: 10, label: '10 — Douleur maximale imaginable' },
      ],
    },
  ],
  calculate: (values) => {
    const score = values.douleur ?? 0

    const severity = score <= 3 ? 'low' : score <= 5 ? 'moderate' : score <= 7 ? 'high' : 'critical'

    const label = score === 0 ? 'Aucune douleur' :
      score <= 3 ? 'Douleur faible (EN ≤ 3)' :
      score <= 5 ? 'Douleur modérée (EN 4–5)' :
      score <= 7 ? 'Douleur forte (EN 6–7)' :
      'Douleur très forte / intense (EN 8–10)'

    return {
      value: score,
      label,
      severity,
      details: { EN: score },
      ranges: [
        { min: 0, max: 0, label: '0 — Aucune douleur', severity: 'low', recommendation: 'Pas de traitement antalgique nécessaire.' },
        { min: 1, max: 3, label: '1–3 — Douleur faible', severity: 'low', recommendation: 'Palier I (paracétamol, AINS si pas de CI). Surveillance.' },
        { min: 4, max: 5, label: '4–5 — Douleur modérée', severity: 'moderate', recommendation: 'Palier I ou II (paracétamol + tramadol ou opioïde faible). Réévaluation à 30–60 min.' },
        { min: 6, max: 7, label: '6–7 — Douleur forte', severity: 'high', recommendation: 'Palier III (morphine titrée si aiguë, oxycodone/norphine si chronique). Avis spécialisé si douleur neuropathique.' },
        { min: 8, max: 10, label: '8–10 — Douleur très forte / intense', severity: 'critical', recommendation: 'Urgence antalgique. Titration morphinique intraveineuse. Évaluation étiologique urgente.' },
      ],
    }
  },
  interpretation: `La **NRS** (Numeric Rating Scale) ou Échelle Numérique (EN) est l’outil d’auto-évaluation de la douleur le plus simple et le plus utilisé en clinique. Le patient évalue sa douleur de 0 (aucune douleur) à 10 (douleur maximale imaginable).

**Grade :**
- 0 : pas de douleur
- 1–3 : douleur faible
- 4–5 : douleur modérée
- 6–7 : douleur forte
- 8–10 : douleur très forte à intense

La NRS est validée pour la douleur aiguë et chronique, adaptable à tous les âges (sauf enfants < 8 ans et troubles cognitifs sévères).`,
  clinicalCommentary: `La NRS est la 4e mesure de la douleur en pratique clinique (après l'EVA). Avantage : simple, rapide (30 secondes), ne nécessite pas de matériel. Idéale pour le suivi antalgique (avant/après traitement). Attention : ne pas utiliser chez les patients avec troubles cognitifs sévères ou confusion (préférer Algoplus ou Doloplus). En neurologie, l'évaluation de la douleur est essentielle : migraine, névralgie du trijumeau, douleur neuropathique, lombalgie. Le « seuil de soulagement » est EN < 3.`,
  references: [
    {
      type: 'pubmed',
      title: 'Farrar JT et al. Clinical importance of changes in chronic pain intensity measured on an 11-point numerical pain rating scale. Pain 2001',
      pmid: '11682335',
    },
    {
      type: 'pubmed',
      title: 'HAS — Évaluation et prise en charge de la douleur chez l\'adulte (2022)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default nrs
