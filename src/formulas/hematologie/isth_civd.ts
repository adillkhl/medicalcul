import type { FormulaDefinition } from '../types'

const isth_civd: FormulaDefinition = {
  id: 'isth_civd', slug: 'isth_civd',
  name: 'ISTH DIC Score (CIVD — Coagulation IntraVasculaire Disséminée)',
  specialty: 'hematologie', category: 'CIVD',
  description: 'Score ISTH (International Society on Thrombosis and Haemostasis) pour le diagnostic et la stratification de la CIVD (coagulation intravasculaire disséminée)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'plaquettes', type: 'radio', label: 'Numération plaquettaire', options: [
      { value: 0, label: '> 100 G/L' },
      { value: 1, label: '50-100 G/L' },
      { value: 2, label: '< 50 G/L' },
    ]},
    { id: 'd_dimers', type: 'radio', label: 'D-Dimères / Produits de dégradation de la fibrine', options: [
      { value: 0, label: 'Normaux (< limite supérieure)' },
      { value: 2, label: 'Modérément augmentés (1-5x normale)' },
      { value: 3, label: 'Fortement augmentés (> 5x normale)' },
    ]},
    { id: 'tp', type: 'radio', label: 'Taux de prothrombine (TP)', options: [
      { value: 0, label: '> 70% (normal)' },
      { value: 1, label: '40-70%' },
      { value: 2, label: '< 40%' },
    ]},
    { id: 'fibrinogene', type: 'radio', label: 'Fibrinogène', options: [
      { value: 0, label: '> 1 g/L' },
      { value: 1, label: '< 1 g/L' },
    ]},
  ],
  calculate: (values) => {
    const plaq = Number(values.plaquettes) || 0
    const dd = Number(values.d_dimers) || 0
    const tp = Number(values.tp) || 0
    const fib = Number(values.fibrinogene) || 0

    const score = plaq + dd + tp + fib

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let diagnostic = ''

    if (score >= 5) {
      diagnostic = 'CIVD avérée (score ≥ 5)'
      severity = score >= 6 ? 'critical' : 'high'
      label = `ISTH DIC : ${score}/8 — ${diagnostic}`
    } else if (score >= 3) {
      diagnostic = 'CIVD non confirmée (score 3-4) — répéter dans 24-48h'
      severity = 'moderate'
      label = `ISTH DIC : ${score}/8 — ${diagnostic}`
    } else {
      diagnostic = 'CIVD peu probable (score < 3)'
      severity = 'low'
      label = `ISTH DIC : ${score}/8 — ${diagnostic}`
    }

    return {
      value: score,
      label,
      severity,
      details: {
        'Plaquettes': ['> 100 G/L (0 pt)', '50-100 G/L (1 pt)', '< 50 G/L (2 pts)'][plaq],
        'D-Dimères': ['Normaux (0 pt)', 'Augmentés 1-5x (2 pts)', 'Augmentés > 5x (3 pts)'][dd],
        'TP': ['> 70% (0 pt)', '40-70% (1 pt)', '< 40% (2 pts)'][tp],
        'Fibrinogène': ['> 1 g/L (0 pt)', '< 1 g/L (1 pt)'][fib],
        'Score total': `${score}/8`,
        'Diagnostic': diagnostic,
      },
      ranges: [
        { min: 0, max: 2, label: 'CIVD peu probable (< 3)', severity: 'low' },
        { min: 3, max: 4, label: 'CIVD non confirmée (3-4) — À répéter', severity: 'moderate' },
        { min: 5, max: 5, label: 'CIVD avérée (5)', severity: 'high' },
        { min: 6, max: 8, label: 'CIVD sévère (≥ 6)', severity: 'critical' },
      ],
    }
  },
  interpretation: 'Le **score ISTH de CIVD** (Taylor et al. 2001) permet le diagnostic et la stratification de la coagulation intravasculaire disséminée.\n\n**4 paramètres évalués (score /8) :**\n\n1. **Plaquettes** : 0 (> 100 G/L), 1 (50-100 G/L), 2 (< 50 G/L)\n2. **D-Dimères** : 0 (normaux), 2 (1-5x normale), 3 (> 5x normale)\n3. **Taux de prothrombine (TP)** : 0 (> 70%), 1 (40-70%), 2 (< 40%)\n4. **Fibrinogène** : 0 (> 1 g/L), 1 (< 1 g/L)\n\n**Interprétation :** ≥ 5 = CIVD avérée nécessitant traitement étiologique et substitutif',
  clinicalCommentary: 'Le score ISTH est l\'outil de référence pour le diagnostic de CIVD. Il nécessite une pathologie sous-jacente connue pour être applicable (sepsis, traumatisme, hémopathie, etc.). Un score ≥ 5 justifie un traitement étiologique agressif (traitement de l\'infection, chirurgie) et un support transfusionnel guidé par la clinique plus que par le laboratoire. La CIVD est une urgence vitale avec une mortalité de 30-50%.',
  references: [
    { type: 'pubmed', title: 'Taylor FB et al. Scientific subcommittee on DIC of the ISTH. Towards definition, clinical and laboratory criteria for DIC. Thromb Haemost 2001', pmid: '11510811' },
    { type: 'pubmed', title: 'Levi M et al. Guidelines for the diagnosis and management of DIC. Br J Haematol 2009', pmid: '19496235' },
  ],
}
export default isth_civd
