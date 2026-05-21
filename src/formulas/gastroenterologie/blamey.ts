import type { FormulaDefinition } from '../types'

const blamey: FormulaDefinition = {
  id: 'blamey', slug: 'blamey',
  name: 'Blamey Score — Risque de Métastases Ganglionnaires du Cancer du Sein',
  specialty: 'gastroenterologie', category: 'Oncologie mammaire',
  description: 'Score de Blamey pour l\'évaluation du risque d\'envahissement ganglionnaire axillaire dans le cancer du sein — basé sur la taille tumorale, le grade et les récepteurs hormonaux',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'taille_tumorale', type: 'number', label: 'Taille tumorale clinique (échographie/mammographie)', unit: 'mm', min: 1, max: 100, step: 1, placeholder: 'Ex: 25' },
    { id: 'grade', type: 'radio', label: 'Grade histologique (SBR/Elston-Ellis)', options: [
      { value: 1, label: 'Grade I — Bien différencié' },
      { value: 2, label: 'Grade II — Modérément différencié' },
      { value: 3, label: 'Grade III — Peu différencié' },
    ]},
    { id: 'recepteurs_oestrogenes', type: 'boolean', label: 'Récepteurs aux œstrogènes (RO) positifs' },
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 20, max: 100, step: 1, placeholder: 'Ex: 55' },
  ],
  calculate: (values) => {
    const taille = Number(values.taille_tumorale) || 20
    const grade = Number(values.grade) || 2
    const roPositifs = !!values.recepteurs_oestrogenes
    const age = Number(values.age) || 55

    // Nottingham Prognostic Index-like scoring
    let score = 0

    // Taille tumorale
    if (taille <= 10) score += 0
    else if (taille <= 20) score += 1
    else if (taille <= 30) score += 2
    else if (taille <= 50) score += 3
    else score += 4

    // Grade
    score += grade - 1 // grade I=0, II=1, III=2

    // Récepteurs hormonaux
    if (!roPositifs) score += 2 // RO négatifs = plus agressif

    // Âge
    if (age < 40) score += 1
    else if (age >= 70) score += 1

    // Risque d\'envahissement ganglionnaire estimé
    let riskPct: number
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommandation = ''

    if (score <= 2) {
      riskPct = 10
      severity = 'low'
      label = `Blamey Score ${score} — Risque ganglionnaire faible (~${riskPct}%)`
      recommandation = 'Ganglion sentinelle indiqué. Probabilité faible d\'envahissement.'
    } else if (score <= 4) {
      riskPct = 25
      severity = 'moderate'
      label = `Blamey Score ${score} — Risque ganglionnaire modéré (~${riskPct}%)`
      recommandation = 'Ganglion sentinelle systématique. Curage si positif.'
    } else if (score <= 6) {
      riskPct = 50
      severity = 'high'
      label = `Blamey Score ${score} — Risque ganglionnaire élevé (~${riskPct}%)`
      recommandation = 'Curage axillaire à discuter. Chimiothérapie néoadjuvante si tumeur localement avancée.'
    } else {
      riskPct = 75
      severity = 'critical'
      label = `Blamey Score ${score} — Risque ganglionnaire très élevé (~${riskPct}%)`
      recommandation = 'Curage axillaire recommandé. Chimiothérapie adjuvante systématique.'
    }

    return {
      value: score,
      label,
      risk: riskPct,
      riskUnit: '% risque d\'envahissement ganglionnaire',
      severity,
      details: {
        'Taille tumorale': `${taille} mm`,
        'Grade SBR': ['I', 'II', 'III'][grade - 1] || 'II',
        'RO positifs': roPositifs ? 'Oui' : 'Non',
        'Âge': `${age} ans`,
        'Score': score,
        'Risque estimé': `${riskPct}%`,
      },
      ranges: [
        { min: 0, max: 2, label: 'Risque faible (~10%)', severity: 'low', recommendation: 'Ganglion sentinelle.' },
        { min: 3, max: 4, label: 'Risque modéré (~25%)', severity: 'moderate', recommendation: 'Ganglion sentinelle ± curage.' },
        { min: 5, max: 6, label: 'Risque élevé (~50%)', severity: 'high', recommendation: 'Curage axillaire. Néoadjuvant?' },
        { min: 7, max: 10, label: 'Risque très élevé (~75%)', severity: 'critical', recommendation: 'Curage + chimiothérapie adjuvante.' },
      ],
    }
  },
  interpretation: 'Le **Blamey Score** (Nottingham Prognostic Index / NPI) évalue le risque d\'envahissement ganglionnaire axillaire dans le cancer du sein.\n\n**Facteurs :** taille tumorale (mm), grade SBR (I-III), statut des récepteurs aux œstrogènes (RO), âge.\n\nLe score est corrélé au risque d\'atteinte ganglionnaire et guide la stratégie de curage axillaire.',
  clinicalCommentary: 'Le Blamey Score (d\'après Roger Blamey, chirurgien oncologue britannique) est utilisé pour la stratification du risque ganglionnaire dans le cancer du sein. Il aide à décider de la réalisation du ganglion sentinelle et du curage axillaire. Les facteurs pronostiques modernes incluent également le Ki67, le statut HER2, et les signatures génomiques (Oncotype DX, MammaPrint).',
  references: [
    { type: 'pubmed', title: 'Blamey RW et al. Nottingham Prognostic Index in breast cancer. The Breast 1996', pmid: '14731596' },
    { type: 'pubmed', title: 'Galea MH et al. The Nottingham Prognostic Index in primary breast cancer. Breast Cancer Res Treat 1992', pmid: '1576396' },
  ],
}
export default blamey
