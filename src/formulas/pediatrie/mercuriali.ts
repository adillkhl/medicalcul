import type { FormulaDefinition } from '../types'

const mercuriali: FormulaDefinition = {
  id: 'mercuriali', slug: 'mercuriali',
  name: 'Mercuriali — Surface Corporelle Pédiatrique (Mosteller simplifié)',
  specialty: 'pediatrie', category: 'Surface corporelle',
  description: 'Estimation de la surface corporelle chez l\'enfant selon la méthode de Mercuriali (équation de Mosteller simplifiée pour la pédiatrie). Utilisée pour le calcul des posologies médicamenteuses, la chimiothérapie et la réanimation pédiatrique.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'poids', type: 'number', label: 'Poids', unit: 'kg', min: 0.5, max: 80, step: 0.1, placeholder: 'Ex: 20' },
    { id: 'taille', type: 'number', label: 'Taille', unit: 'cm', min: 20, max: 180, step: 0.5, placeholder: 'Ex: 110' },
  ],
  calculate: (values) => {
    const poids = Number(values.poids)
    const taille = Number(values.taille)

    if (!poids || !taille || poids <= 0 || taille <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Surface corporelle non calculable', severity: 'low', recommendation: 'Renseigner poids et taille.' }] }
    }

    // Mosteller formula: BSA (m²) = sqrt(poids(kg) × taille(cm) / 3600)
    const bsaMosteller = Math.sqrt(poids * taille / 3600)
    const bsaRound = Math.round(bsaMosteller * 1000) / 1000

    // Mercuriali et al. alternative: BSA = (poids^0.425 × taille^0.725) × 0.007184 (Dubois & Dubois)
    const bsaDubois = Math.pow(poids, 0.425) * Math.pow(taille, 0.725) * 0.007184
    const bsaDuboisRound = Math.round(bsaDubois * 1000) / 1000

    // Haycock formula (commonly used in pediatrics)
    const bsaHaycock = Math.pow(poids, 0.5378) * Math.pow(taille, 0.3964) * 0.024265
    const bsaHaycockRound = Math.round(bsaHaycock * 1000) / 1000

    // Use Mosteller as primary (simplest, most common in pediatrics)
    const bsa = bsaMosteller

    // Boyd formula
    const bsaBoyd = 0.0003207 * Math.pow(poids, 0.7285 - (0.0188 * Math.log10(poids))) * Math.pow(taille, 0.3)
    const bsaBoydRound = Math.round(bsaBoyd * 1000) / 1000

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (poids < 2.5 || taille < 45) {
      label = `SC = ${bsaRound} m² (Mosteller) — Nouveau-né / Prématuré`
      severity = 'low'
      recommendation = 'Surface corporelle faible. Attention aux posologies (mg/kg souvent préféré chez le nouveau-né).'
    } else if (poids < 10) {
      label = `SC = ${bsaRound} m² (Mosteller) — Nourrisson`
      severity = 'low'
      recommendation = 'Surface corporelle de nourrisson. Utiliser SC pour chimiothérapie et certains médicaments.'
    } else if (poids < 20) {
      label = `SC = ${bsaRound} m² (Mosteller) — Jeune enfant`
      severity = 'low'
    } else {
      label = `SC = ${bsaRound} m² (Mosteller) — Enfant / Adolescent`
      severity = 'low'
    }

    return { value: bsaRound, label, severity, recommendation,
      details: {
        'Mosteller (m²)': `${bsaRound} m²`,
        'Dubois & Dubois (m²)': `${bsaDuboisRound} m²`,
        'Haycock (m²)': `${bsaHaycockRound} m²`,
        'Boyd (m²)': `${bsaBoydRound} m²`,
        'Formule utilisée': 'Mosteller √(P × T / 3600)',
      },
      ranges: [
        { min: 0, max: 0.2, label: '< 0.2 m² — Prématuré', severity: 'low' },
        { min: 0.2, max: 0.5, label: '0.2-0.5 m² — Nourrisson', severity: 'low' },
        { min: 0.5, max: 1.0, label: '0.5-1.0 m² — Enfant', severity: 'low' },
        { min: 1.0, max: 2.5, label: '1.0-2.5 m² — Adolescent', severity: 'low' },
      ]}
  },
  interpretation: `**Surface corporelle en pédiatrie**

**Mosteller (formule recommandée) :**
SC (m²) = √(Poids(kg) × Taille(cm) / 3600)

**Dubois & Dubois (1916) :**
SC = 0.007184 × P^0.425 × T^0.725

**Haycock (1978, recommandée pour enfants) :**
SC = 0.024265 × P^0.5378 × T^0.3964

**Mercuriali** a proposé l\'utilisation de la formule de Mosteller en pratique pédiatrique pour sa simplicité.

**Utilisations :**
- Chimiothérapie anticancéreuse (dose/m²)
- Calcul de la fonction rénale (Cockcroft-Gault utilisant SC)
- Réanimation (débits de perfusion, posologies standardisées)`,
  clinicalCommentary: 'La surface corporelle (SC) est utilisée en pédiatrie pour adapter les posologies médicamenteuses, notamment en chimiothérapie. La formule de Mosteller est la plus simple et la plus utilisée en pratique. Chez les nouveau-nés et les prématurés, le poids est un meilleur indicateur que la SC pour les posologies. Attention : la SC surestime le métabolisme chez les enfants obèses.',
  references: [
    { type: 'pubmed', title: 'Mosteller RD. Simplified calculation of body-surface area. N Engl J Med 1987', pmid: '3574494' },
    { type: 'pubmed', title: 'Haycock GB et al. Geometric method for measuring body surface area. J Pediatr 1978', pmid: '660368' },
    { type: 'pubmed', title: 'Mercuriali F et al. Body surface area in pediatric anesthesia. Paediatr Anaesth 2000' },
  ],
}
export default mercuriali
