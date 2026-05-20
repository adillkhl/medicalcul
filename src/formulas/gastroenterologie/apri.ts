import type { FormulaDefinition } from '../types'

const apri: FormulaDefinition = {
  id: 'apri',
  slug: 'apri',
  name: 'APRI (Score) — AST to Platelet Ratio Index',
  specialty: 'gastroenterologie',
  category: 'Fibrose hépatique',
  description: 'Évaluation non invasive de la fibrose hépatique basée sur le ratio AST/plaquettes',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'ast',
      type: 'number',
      label: 'AST (ASAT)',
      unit: 'UI/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 45',
    },
    {
      id: 'plaquettes',
      type: 'number',
      label: 'Plaquettes',
      unit: '×10⁹/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 150',
    },
  ],
  calculate: (values) => {
    const ast = Number(values.ast)
    const plt = Number(values.plaquettes)

    if (!ast || !plt || ast <= 0 || plt <= 0) {
      return {
        value: 0,
        label: 'Données insuffisantes',
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner AST et plaquettes.' },
        ],
      }
    }

    const astRatio = ast / 40 // LSN AST = 40 UI/L
    const score = ((astRatio / plt) * 100)
    const scoreArrondi = Math.round(score * 100) / 100

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi < 0.5) {
      severity = 'low'
      label = 'APRI < 0.5 — Fibrose minime (F0-F1)'
      recommendation = 'Probabilité faible de fibrose significative. Surveillance standard. Pas de biopsie nécessaire.'
    } else if (scoreArrondi < 1.0) {
      severity = 'moderate'
      label = 'APRI 0.5-1.0 — Zone grise'
      recommendation = 'Risque intermédiaire. Envisager FibroScan® ou autre test non invasif (FIB-4, FibroTest®).'
    } else if (scoreArrondi < 2.0) {
      severity = 'high'
      label = 'APRI ≥ 1.0 — Fibrose significative (≥ F2)'
      recommendation = 'Fibrose significative probable. Adresser en hépatologie. Bilan étiologique complet. Surveillance rapprochée.'
    } else {
      severity = 'critical'
      label = 'APRI ≥ 2.0 — Cirrhose probable (F4)'
      recommendation = 'Cirrhose très probable. Bilan complet hépatologique. Dépistage des complications (endoscopie œsogastrique, échographie HCC).'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: 0, max: 0.49, label: '< 0.5 — Fibrose minime (F0-F1)', severity: 'low', recommendation: 'Pas de biopsie nécessaire.' },
        { min: 0.5, max: 0.99, label: '0.5-1.0 — Zone grise', severity: 'moderate', recommendation: 'Compléter par FibroScan® ou FIB-4.' },
        { min: 1.0, max: 1.99, label: '≥ 1.0 — Fibrose significative (≥ F2)', severity: 'high', recommendation: 'Avis hépatologique. Bilan étiologique.' },
        { min: 2.0, max: 100, label: '≥ 2.0 — Cirrhose probable (F4)', severity: 'critical', recommendation: 'Bilan complet. Endoscopie digestive haute. Échographie HCC.' },
      ],
    }
  },
  interpretation: `Le **score APRI (AST to Platelet Ratio Index)** est un test non invasif pour estimer le degré de fibrose hépatique.

**Formule** : APRI = (AST / LSN_AST) / Plaquettes × 100

| Seuil | Signification |
|-------|---------------|
| < 0.5 | Fibrose minime (F0-F1) — VPN > 90 % |
| 0.5–1.0 | Zone grise — tests complémentaires recommandés |
| ≥ 1.0 | Fibrose significative (≥ F2) |
| ≥ 2.0 | Cirrhose (F4) — Spécificité > 95 % |

Validé initialement dans l’hépatite C, utilisable dans les hépatopathies virales, NAFLD, et alcooliques.`,
  clinicalCommentary: `L'APRI est un excellent test de première intention, gratuit et toujours disponible. Limite : moins performant que le FIB-4 ou le FibroScan® pour les stades intermédiaires. En cas de score ≥ 1.0, adresser systématiquement en hépatologie. L'APRI est moins fiable en cas de cytolyse aiguë (AST très élevée). Ne pas utiliser seul pour décider d’un traitement.`,
  references: [
    {
      type: 'pubmed',
      title: 'Wai CT et al. A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C. Hepatology 2003',
      pmid: '12668976',
    },
  ],
}

export default apri
