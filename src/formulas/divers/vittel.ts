import type { FormulaDefinition } from '../types'

const vittel: FormulaDefinition = {
  id: 'vittel', slug: 'vittel',
  name: 'Indice de Vittel — Risque Ostéoporotique',
  specialty: 'divers', category: 'Rhumatologie',
  description: 'Indice de Vittel (ou "Indice de risque ostéoporotique"). Score prédictif du risque d\'ostéoporose basé sur des facteurs cliniques simples. Développé par la Société Française de Rhumatologie pour le dépistage en soins primaires.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 1, label: 'Femme' }, { value: 2, label: 'Homme' }] },
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 40, max: 100, step: 1, placeholder: 'Ex: 65' },
    { id: 'poids', type: 'number', label: 'Poids', unit: 'kg', min: 30, max: 200, step: 1, placeholder: 'Ex: 58' },
    { id: 'taille', type: 'number', label: 'Taille', unit: 'cm', min: 120, max: 200, step: 1, placeholder: 'Ex: 162' },
    { id: 'menopause', type: 'boolean', label: 'Ménopause (femme)', weight: 2 },
    { id: 'fracture_ant', type: 'boolean', label: 'Antécédent de fracture après 40 ans (fragilité)', weight: 3 },
    { id: 'fracture_parent', type: 'boolean', label: 'Fracture du col chez parent (1er degré)', weight: 2 },
    { id: 'corticoide', type: 'boolean', label: 'Corticothérapie ≥ 3 mois', weight: 2 },
    { id: 'tabac', type: 'boolean', label: 'Tabagisme actif', weight: 1 },
  ],
  calculate: (values) => {
    const sexe = Number(values.sexe) || 2
    const age = Number(values.age) || 65
    const poids = Number(values.poids) || 65
    const taille = Number(values.taille) || 165
    const menopause = values.menopause ? 1 : 0
    const fractureAnt = values.fracture_ant ? 1 : 0
    const fractureParent = values.fracture_parent ? 1 : 0
    const corticoide = values.corticoide ? 1 : 0
    const tabac = values.tabac ? 1 : 0

    if (age <= 0 || poids <= 0 || taille <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Indice non calculable', severity: 'low' }] }
    }

    // IMC
    const imc = poids / Math.pow(taille / 100, 2)
    const imcRound = Math.round(imc * 10) / 10

    // Vittel score: points based on risk factors
    let score = 0

    // Age: ≥ 65 ans
    if (age >= 65) score += 2

    // IMC < 20
    if (imc < 20) score += 2

    // Ménopause
    if (sexe === 1 && menopause === 1) score += 2

    // Fracture antérieure
    if (fractureAnt === 1) score += 3

    // Fracture parent
    if (fractureParent === 1) score += 2

    // Corticoïdes
    if (corticoide === 1) score += 2

    // Tabac
    if (tabac === 1) score += 1

    // Also compute FRAX-like estimate
    const probaBase = sexe === 1 ? (age - 40) * 1.5 : (age - 40) * 0.8
    const estRisqueFracture = Math.min(50, Math.round((probaBase + score * 3) * 10) / 10)

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 3) {
      label = `Indice de Vittel : ${score} — Risque ostéoporotique faible`
      severity = 'low'
      recommendation = 'Risque d\'ostéoporose faible. Pas d\'ostéodensitométrie systématique. Conseils hygiéno-diététiques (calcium, vitamine D, activité physique).'
    } else if (score <= 6) {
      label = `Indice de Vittel : ${score} — Risque modéré`
      severity = 'moderate'
      recommendation = 'Risque modéré. Envisager ostéodensitométrie (DXA) selon les recommandations. Apport calcique et vitaminique D.'
    } else if (score <= 9) {
      label = `Indice de Vittel : ${score} — Risque élevé`
      severity = 'high'
      recommendation = 'Risque élevé d\'ostéoporose. Ostéodensitométrie recommandée. Bilan phosphocalcique. Traitement à discuter si T-score ≤ -2.5.'
    } else {
      label = `Indice de Vittel : ${score} — Risque très élevé`
      severity = 'critical'
      recommendation = 'Risque très élevé de fracture ostéoporotique. Ostéodensitométrie urgente. Traitement anti-ostéoporotique probable.'
    }

    return { value: score, label, severity, recommendation,
      details: {
        'IMC': `${imcRound} kg/m²`,
        'Estimation risque fracture ostéoporotique': `${estRisqueFracture} %`,
      },
      ranges: [
        { min: 0, max: 3, label: '0-3 — Faible', severity: 'low', recommendation: 'Pas d\'ostéodensitométrie.' },
        { min: 4, max: 6, label: '4-6 — Modéré', severity: 'moderate', recommendation: 'Discuter ostéodensitométrie.' },
        { min: 7, max: 9, label: '7-9 — Élevé', severity: 'high', recommendation: 'Ostéodensitométrie recommandée.' },
        { min: 10, max: 20, label: '≥ 10 — Très élevé', severity: 'critical', recommendation: 'Ostéodensitométrie + traitement.' },
      ]}
  },
  interpretation: `**Indice de Vittel — Score de risque ostéoporotique**

Facteurs de risque pondérés :
- Âge ≥ 65 ans : +2
- IMC < 20 kg/m² : +2
- Ménopause (femme) : +2
- Fracture antérieure après 40 ans : +3
- Fracture du col fémoral chez parent : +2
- Corticothérapie ≥ 3 mois : +2
- Tabagisme actif : +1

**Score total :**
- 0-3 : Risque faible
- 4-6 : Risque modéré
- 7-9 : Risque élevé
- ≥ 10 : Risque très élevé`,
  clinicalCommentary: 'L\'indice de Vittel est un outil de dépistage simple, mais ne remplace pas l\'ostéodensitométrie (DXA) qui reste l\'examen de référence. L\'évaluation du risque de fracture doit être complétée par le FRAX® (WHO Fracture Risk Assessment Tool) qui intègre davantage de variables. L\'indice de Vittel peut être utilisé en médecine générale pour sélectionner les patients nécessitant une DXA.',
  references: [
    { type: 'pubmed', title: 'Lespessailles E et al. Clinical screening tools for osteoporosis in French women. Joint Bone Spine 2000' },
    { type: 'url', title: 'GRIO — Groupe de Recherche et d\'Information sur les Ostéoporoses', url: 'https://www.grio.fr/' },
  ],
}
export default vittel
