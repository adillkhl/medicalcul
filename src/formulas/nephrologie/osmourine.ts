import type { FormulaDefinition } from '../types'

const osmourine: FormulaDefinition = {
  id: 'osmourine', slug: 'osmourine',
  name: 'Osmolalité Urinaire — Interprétation',
  specialty: 'nephrologie', category: 'Ionogramme urinaire',
  description: 'Interprétation de l\'osmolalité urinaire avec calcul de l\'osmolalité urinaire estimée à partir des principaux solutés urinaires (urée, sodium, glucose). Aide au diagnostic des troubles de la concentration/dilution rénales et des hyponatrémies.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'urine_na', type: 'number', label: 'Sodium urinaire', unit: 'mmol/L', min: 0, max: 500, step: 1, placeholder: 'Ex: 80' },
    { id: 'urine_k', type: 'number', label: 'Potassium urinaire', unit: 'mmol/L', min: 0, max: 200, step: 1, placeholder: 'Ex: 40' },
    { id: 'urine_urea', type: 'number', label: 'Urée urinaire', unit: 'mmol/L', min: 0, max: 500, step: 1, placeholder: 'Ex: 200' },
    { id: 'urine_glucose', type: 'number', label: 'Glucose urinaire (optionnel)', unit: 'mmol/L', min: 0, max: 500, step: 0.1, placeholder: 'Ex: 0' },
    { id: 'osmo_mesuree', type: 'number', label: 'Osmolalité mesurée (optionnel)', unit: 'mOsm/kg', min: 0, max: 1500, step: 1, placeholder: 'Ex: 600' },
  ],
  calculate: (values) => {
    const na = Number(values.urine_na) || 0
    const k = Number(values.urine_k) || 0
    const urea = Number(values.urine_urea) || 0
    const glucose = Number(values.urine_glucose) || 0
    const osmoMes = values.osmo_mesuree ? Number(values.osmo_mesuree) : undefined

    // Estimated urine osmolality (simplified): 2 × (Na + K) + Urea + Glucose
    const osmoEst = 2 * (na + k) + urea + glucose
    const osmoEstRound = Math.round(osmoEst)

    if (na <= 0 && k <= 0 && urea <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Osmolalité non calculable', severity: 'low' }] }
    }

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''
    let diff = ''

    if (osmoMes && osmoMes > 0) {
      const gap = osmoMes - osmoEst
      diff = `, écart osmolaire : ${gap > 0 ? '+' : ''}${Math.round(gap)} mOsm/kg`
    }

    if (osmoEst < 100) {
      label = `Osmolalité urinaire estimée : ${osmoEstRound} mOsm/kg — Diluée${diff}`
      severity = 'low'
      recommendation = 'Urine diluée : diurèse aqueuse normale (apport hydrique important) ou diabète insipide (central/néphrogénique).'
    } else if (osmoEst < 300) {
      label = `Osmolalité urinaire estimée : ${osmoEstRound} mOsm/kg — Modérément diluée${diff}`
      severity = 'low'
      recommendation = 'Urine modérément diluée. Peut être normale ou signer un début de trouble de concentration.'
    } else if (osmoEst < 600) {
      label = `Osmolalité urinaire estimée : ${osmoEstRound} mOsm/kg — Normale/Isotonique${diff}`
      severity = 'low'
      recommendation = 'Urine isotonique. Capacité de concentration normale.'
    } else if (osmoEst < 900) {
      label = `Osmolalité urinaire estimée : ${osmoEstRound} mOsm/kg — Concentrée${diff}`
      severity = 'low'
      recommendation = 'Bonne capacité de concentration. État de déshydratation possible (réponse rénale adaptée).'
    } else {
      label = `Osmolalité urinaire estimée : ${osmoEstRound} mOsm/kg — Très concentrée${diff}`
      severity = 'low'
      recommendation = 'Urine très concentrée : déshydratation, hyponatrémie de dilution (SIADH), ou réponse appropriée à une hypovolémie.'
    }

    const details: Record<string, string | number | undefined> = {
      'Osmolalité estimée': `${osmoEstRound} mOsm/kg`,
      '2 × (Na + K)': `${2 * (na + k)} mOsm/kg`,
      'Urée': `${urea} mOsm/kg`,
      'Glucose': `${glucose} mOsm/kg`,
    }
    if (osmoMes) { details['Osmolalité mesurée'] = `${osmoMes} mOsm/kg` }

    return { value: osmoEstRound, label, severity, recommendation, details,
      ranges: [
        { min: 0, max: 100, label: '< 100 — Diluée', severity: 'low', recommendation: 'Diabète insipide ou polydipsie.' },
        { min: 100, max: 300, label: '100-300 — Modérément diluée', severity: 'low' },
        { min: 300, max: 600, label: '300-600 — Isotonique', severity: 'low' },
        { min: 600, max: 900, label: '600-900 — Concentrée', severity: 'low' },
        { min: 900, max: 1500, label: '> 900 — Très concentrée', severity: 'low', recommendation: 'Déshydratation ou SIADH.' },
      ]}
  },
  interpretation: `**Osmolalité urinaire estimée (formule simplifiée) :**
Osm_U = 2 × (Na_U + K_U) + Urée_U + Glucose_U

**Interprétation :**
- **< 100 mOsm/kg** : urine très diluée (diabète insipide, potomanie)
- **100-300 mOsm/kg** : urine modérément diluée
- **300-600 mOsm/kg** : isotonique au plasma (capacité de concentration normale)
- **600-900 mOsm/kg** : urine concentrée (déshydratation)
- **> 900 mOsm/kg** : urine très concentrée (SIADH, hypovolémie sévère)

**Écart osmolaire urinaire :**
Osm_mesurée - Osm_calculée > 100 mOsm/kg suggère la présence de solutés non mesurés (osmolalité efficace vs totale).

**Utilité clinique :**
- Diagnostic des hyponatrémies (Uosm > 100 dans SIADH)
- Bilan de polyurie (> 300 exclusion diabète insipide)
- Évaluation de la capacité de concentration rénale`,
  clinicalCommentary: 'L\'osmolalité urinaire est un examen clé dans le bilan des hyponatrémies et des polyuries. En cas de glycosurie ou d\'insuffisance rénale avancée, l\'estimation par formule est moins fiable — préférer une mesure directe. L\'osmolalité urinaire > 100 mOsm/kg est un critère diagnostique du SIADH (en hyponatrémie).',
  references: [
    { type: 'pubmed', title: 'Spasovski G et al. Clinical practice guideline on diagnosis and treatment of hyponatraemia. Eur J Endocrinol 2014', pmid: '24569128' },
    { type: 'guideline', title: 'SFNDT — Exploration des hyponatrémies', url: 'https://www.sfndt.org/' },
  ],
}
export default osmourine
