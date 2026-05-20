import type { FormulaDefinition } from '../types'

const fib4: FormulaDefinition = {
  id: 'fib-4',
  slug: 'fib4',
  name: 'Fibrosis-4 (FIB-4) — Fibrose hépatique',
  specialty: 'gastroenterologie',
  category: 'Fibrose hépatique',
  description: 'Score non invasif de fibrose hépatique basé sur l\'âge, les transaminases et les plaquettes',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'number',
      label: 'Âge',
      unit: 'ans',
      min: 18,
      max: 120,
      step: 1,
      placeholder: 'Ex: 55',
    },
    {
      id: 'ast',
      type: 'number',
      label: 'AST (ASAT)',
      unit: 'UI/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 40',
    },
    {
      id: 'alt',
      type: 'number',
      label: 'ALT (ALAT)',
      unit: 'UI/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 60',
    },
    {
      id: 'plaquettes',
      type: 'number',
      label: 'Plaquettes',
      unit: '×10⁹/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 180',
    },
  ],
  calculate: (values) => {
    const age = Number(values.age)
    const ast = Number(values.ast)
    const alt = Number(values.alt)
    const plt = Number(values.plaquettes)

    if (!age || !ast || !alt || !plt || ast <= 0 || alt <= 0 || plt <= 0 || age <= 0) {
      return {
        value: 0,
        label: 'Données insuffisantes',
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: 'Score non calculable', severity: 'low', recommendation: 'Renseigner âge, AST, ALT et plaquettes.' },
        ],
      }
    }

    const score = (age * ast) / (plt * Math.sqrt(alt))
    const scoreArrondi = Math.round(score * 100) / 100

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (scoreArrondi < 1.30) {
      severity = 'low'
      label = 'FIB-4 < 1.30 — Fibrose minime (F0-F1)'
      recommendation = 'Probabilité élevée (VPN > 90 %) d\'absence de fibrose significative. Pas de biopsie nécessaire. Surveillance standard.'
    } else if (scoreArrondi <= 2.67) {
      severity = 'moderate'
      label = 'FIB-4 1.30-2.67 — Zone grise'
      recommendation = 'Risque intermédiaire de fibrose significative. Tests complémentaires recommandés (FibroScan, élastométrie, FibroTest).'
    } else {
      severity = 'high'
      label = 'FIB-4 > 2.67 — Fibrose significative (≥ F3)'
      recommendation = 'Fibrose significative probable (VPP ~80 %). Adresser en hépatologie. Bilan étiologique complet. Envisager biopsie hépatique.'
    }

    return {
      value: scoreArrondi,
      label,
      severity,
      ranges: [
        { min: 0, max: 1.29, label: '< 1.30 — Fibrose minime (F0-F1)', severity: 'low', recommendation: 'Pas de biopsie. Surveillance.' },
        { min: 1.30, max: 2.67, label: '1.30-2.67 — Zone grise', severity: 'moderate', recommendation: 'Tests complémentaires (FibroScan).' },
        { min: 2.68, max: 100, label: '> 2.67 — Fibrose significative (≥ F3)', severity: 'high', recommendation: 'Avis hépatologique. Biopsie si nécessaire.' },
      ],
    }
  },
  interpretation: `Le **FIB-4 (Fibrosis-4)** est un score non invasif validé pour estimer la fibrose hépatique.

**Formule** : FIB-4 = (Âge × AST) / (Plaquettes × √ALT)

| Seuil | Interprétation |
|-------|---------------|
| < 1.30 | Fibrose minime (F0-F1) — VPN > 90 % |
| 1.30-2.67 | Zone grise — tests complémentaires |
| > 2.67 | Fibrose significative (≥ F3) — VPP ~ 80 % |

Validé initialement dans l’hépatite C et VIH-VHC, utilisable dans la NAFLD et les hépatopathies alcooliques. Supérieur à l\'APRI pour la NAFLD.`,
  clinicalCommentary: `Le FIB-4 est le meilleur score non invasif de première intention (coût nul, toujours disponible). Attention : le seuil de 1.30 est abaissé à 2.0 chez les > 65 ans pour la NAFLD. Le FIB-4 peut être faussement élevé en cas de cytolyse aiguë (AST très élevée). À répéter à distance d’un épisode aigu. Le FibroScan® reste l\'examen de référence pour confirmer le diagnostic de fibrose.`,
  references: [
    {
      type: 'pubmed',
      title: 'Sterling RK et al. Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection. Hepatology 2006',
      pmid: '16871595',
    },
    {
      type: 'guideline',
      title: 'Recommandations EASL pour la NAFLD (2021)',
      url: 'https://easl.eu',
    },
  ],
}

export default fib4
