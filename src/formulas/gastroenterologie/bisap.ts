import type { FormulaDefinition } from '../types'

const bisap: FormulaDefinition = {
  id: 'bisap',
  slug: 'bisap',
  name: 'BISAP — Bedside Index for Severity in Acute Pancreatitis',
  specialty: 'gastroenterologie',
  category: 'Pancréatite',
  description: 'Score pronostique simple de pancréatite aiguë utilisable à l\'admission',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'bun',
      type: 'number',
      label: 'BUN (Urée sanguine)',
      unit: 'mmol/L',
      min: 0,
      max: 50,
      step: 0.1,
      placeholder: 'Ex: 8.5',
    },
    {
      id: 'impaired_mental',
      type: 'boolean',
      label: 'Trouble de la conscience (Glasgow < 15)',
    },
    {
      id: 'sis',
      type: 'boolean',
      label: 'SIRS (≥ 2 critères : température < 36°C ou > 38°C, FC > 90/min, FR > 20/min ou PaCO₂ < 32 mmHg, GB < 4 000 ou > 12 000/mm³)',
    },
    {
      id: 'age_60',
      type: 'boolean',
      label: 'Âge > 60 ans',
    },
    {
      id: 'pleural_effusion',
      type: 'boolean',
      label: 'Épanchement pleural (radio ou scanner)',
    },
  ],
  calculate: (values) => {
    let score = 0
    const bun = Number(values.bun)
    if (bun && bun > 7.14) score += 1
    if (values.impaired_mental) score += 1
    if (values.sis) score += 1
    if (values.age_60) score += 1
    if (values.pleural_effusion) score += 1

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (score <= 2) {
      severity = score === 0 ? 'low' : 'moderate'
      label = score <= 1 ? 'BISAP 0-1 — Risque faible' : 'BISAP 2 — Risque intermédiaire'
      recommendation = score <= 1
        ? 'Mortalité < 1 %. Surveillance standard en service de médecine.'
        : 'Mortalité ~1.6 %. Surveillance hospitalière. Envisager TDM et bilan pancréatite.'
    } else {
      severity = score === 3 ? 'high' : 'critical'
      label = score === 3 ? 'BISAP 3 — Risque élevé' : `BISAP ${score} — Risque très élevé`
      recommendation = score === 3
        ? 'Mortalité ~6-8 %. Surveillance en soins intensifs. TDM injectée. Bilan complet.'
        : 'Mortalité > 12-20 %. Réanimation. TDM urgente. Avis chirurgical. Surveillance rapprochée.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 1, label: '0-1 — Risque faible (mortalité < 1 %)', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 2, max: 2, label: '2 — Risque intermédiaire (mortalité ~1.6 %)', severity: 'moderate', recommendation: 'Surveillance hospitalière. TDM.' },
        { min: 3, max: 3, label: '3 — Risque élevé (mortalité ~6-8 %)', severity: 'high', recommendation: 'Soins intensifs. TDM injectée.' },
        { min: 4, max: 5, label: '4-5 — Risque très élevé (mortalité > 12-20 %)', severity: 'critical', recommendation: 'Réanimation. TDM urgente. Avis chirurgical.' },
      ],
    }
  },
  interpretation: `Le **score BISAP** (Bedside Index for Severity in Acute Pancreatitis) est un score pronostique simple, validé, utilisable dès l’admission.

**5 critères** (1 point chacun) :
1. BUN > 7.14 mmol/L
2. Troubles de la conscience (Glasgow < 15)
3. SIRS (≥ 2 critères)
4. Âge > 60 ans
5. Épanchement pleural

| Score | Mortalité |
|-------|-----------|
| 0-1   | < 1 % |
| 2     | ~ 1.6 % |
| 3     | ~ 6-8 % |
| 4-5   | ~ 12-20 % |

Avantage : simplicité, se calcule en quelques minutes à l'admission, sans TDM nécessaire.`,
  clinicalCommentary: `Le BISAP est un excellent outil de triage à l'admission. Il ne nécessite que des données cliniques et biologiques basiques. Sa valeur pronostique est comparable à celle du Ranson (qui nécessite 48h) et de l’APACHE II. L'épanchement pleural est un marqueur péjoratif important. Le SIRS est le critère le plus sensible. À utiliser en routine aux urgences.`,
  references: [
    {
      type: 'pubmed',
      title: 'Wu BU et al. The early prediction of mortality in acute pancreatitis: a large population-based study. Gut 2008',
      pmid: '18495936',
    },
  ],
}

export default bisap
