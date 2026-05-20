import type { FormulaDefinition } from '../types'

const adroguemadias: FormulaDefinition = {
  id: 'adroguemadias',
  slug: 'adroguemadias',
  name: 'Adrogué et Madias — Correction hyponatrémie',
  specialty: 'medecine_interne',
  category: 'Ionogramme',
  description: 'Formule de correction du sodium selon l\'apport de soluté perfusé — Prédiction de la variation de la natrémie après perfusion d\'1 L de soluté.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'na_actuel',
      type: 'number',
      label: 'Natrémie actuelle (mmol/L)',
      min: 100,
      max: 160,
      step: 0.1,
      placeholder: '120',
    },
    {
      id: 'na_solute',
      type: 'number',
      label: 'Sodium du soluté (mmol/L)',
      min: 0,
      max: 600,
      step: 0.1,
      placeholder: '154 (NaCl 0.9%)',
    },
    {
      id: 'eau_corporelle',
      type: 'number',
      label: 'Eau corporelle totale (L)',
      min: 10,
      max: 70,
      step: 0.1,
      placeholder: '30',
    },
  ],
  calculate: (values) => {
    const naActuel = values.na_actuel ?? 120
    const naSolute = values.na_solute ?? 154
    const eauTotale = values.eau_corporelle ?? 30
    const deltaNa = (naSolute - naActuel) / (eauTotale + 1)
    return {
      value: deltaNa,
      label: `ΔNa estimée : ${deltaNa.toFixed(1)} mmol/L par litre perfusé`,
      severity: deltaNa > 12 ? 'high' : deltaNa > 6 ? 'moderate' : 'low',
      ranges: [
        { min: 12, max: 999, label: 'Correction rapide > 12 mmol/L — Risque de myélinolyse', severity: 'critical' },
        { min: 8, max: 12, label: 'Correction modérée 8–12 mmol/L — Surveiller étroitement', severity: 'high' },
        { min: 4, max: 8, label: 'Correction standard 4–8 mmol/L', severity: 'moderate' },
        { min: -999, max: 4, label: 'Correction lente < 4 mmol/L — Sécuritaire', severity: 'low' },
      ],
    }
  },
  interpretation: `La **formule d\'Adrogué et Madias** estime la variation de la natrémie après perfusion d\'1 L de soluté :

**ΔNa = (Na_soluté − Na_actuel) / (Eau corporelle totale + 1)**

- Eau corporelle totale = poids (kg) × coefficient (0,6 homme, 0,5 femme, 0,4 sujet âgé)
- **Règle de sécurité** : ne pas dépasser 8–10 mmol/L de correction par 24 h
- En cas d\'hyponatrémie sévère (< 120 mmol/L) : correction initiale limitée à 4–6 mmol/L

**Solutés courants :**
- NaCl 0,9 % = 154 mmol/L
- NaCl 3 % = 513 mmol/L (hypertonique)
- Ringer Lactate = 130 mmol/L`,
  clinicalCommentary: `Toujours utiliser la formule d\'Adrogué pour planifier la correction d\'une hyponatrémie. Ne jamais dépasser 8-10 mmol/24h. En cas d\'hyponatrémie sévère avec symptômes neurologiques, une correction rapide initiale de 4-6 mmol/L avec du NaCl 3% est acceptable, puis relais par NaCl 0,9%.`,
  references: [
    {
      type: 'pubmed',
      title: 'Adrogué HJ, Madias NE. Hyponatremia. N Engl J Med 2000',
      pmid: '10742016',
    },
    {
      type: 'guideline',
      title: 'SNFMI — Prise en charge des hyponatrémies',
      url: 'https://www.snfmi.org',
    },
  ],
}

export default adroguemadias
