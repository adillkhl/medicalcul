import type { FormulaDefinition } from '../types'

const sris: FormulaDefinition = {
  id: 'sris', slug: 'sris',
  name: 'Surgical Risk Index Score (Index de Risque Chirurgical)',
  specialty: 'cardiologie', category: 'Chirurgie cardiaque',
  description: 'Index de risque chirurgical global en chirurgie cardiaque — évalue la morbi-mortalité postopératoire',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 60' },
    { id: 'sexe_feminin', type: 'boolean', label: 'Sexe féminin' },
    { id: 'creatinine', type: 'number', label: 'Créatininémie préopératoire', unit: 'µmol/L', min: 30, max: 1000, step: 1, placeholder: 'Ex: 90' },
    { id: 'fevg', type: 'radio', label: 'Fraction d\'éjection VG', options: [
      { value: 0, label: '> 50%' },
      { value: 1, label: '30-50%' },
      { value: 2, label: '< 30%' },
    ]},
    { id: 'nyha', type: 'radio', label: 'Classe NYHA', options: [
      { value: 0, label: 'I — Pas de limitation' },
      { value: 1, label: 'II — Limitation légère' },
      { value: 2, label: 'III — Limitation modérée' },
      { value: 3, label: 'IV — Symptômes au repos' },
    ]},
    { id: 'diabete', type: 'boolean', label: 'Diabète (traité)' },
    { id: 'bpco', type: 'boolean', label: 'BPCO' },
    { id: 'hta_pulm', type: 'boolean', label: 'HTA pulmonaire (PAPs > 55 mmHg)' },
    { id: 'chirurgie_combinee', type: 'boolean', label: 'Chirurgie combinée (PAC + valve ou autre)' },
    { id: 'urgence', type: 'boolean', label: 'Urgence chirurgicale' },
  ],
  calculate: (values) => {
    let score = 0
    const age = Number(values.age) || 60
    const creat = Number(values.creatinine) || 90

    // Âge
    if (age >= 75) score += 3
    else if (age >= 65) score += 2
    else if (age >= 55) score += 1

    if (values.sexe_feminin) score += 1
    if (creat > 200) score += 3
    else if (creat > 130) score += 2
    else if (creat > 100) score += 1

    const fevgVal = Number(values.fevg) || 0
    if (fevgVal === 2) score += 3
    else if (fevgVal === 1) score += 2

    const nyhaVal = Number(values.nyha) || 0
    if (nyhaVal >= 3) score += 3
    else if (nyhaVal >= 2) score += 1

    if (values.diabete) score += 1
    if (values.bpco) score += 2
    if (values.hta_pulm) score += 2
    if (values.chirurgie_combinee) score += 2
    if (values.urgence) score += 3

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let mortalite: number

    if (score < 5) {
      severity = 'low'
      label = `SRIS ${score} — Risque faible`
      mortalite = 1.5
    } else if (score < 10) {
      severity = 'moderate'
      label = `SRIS ${score} — Risque modéré`
      mortalite = 4.5
    } else if (score < 16) {
      severity = 'high'
      label = `SRIS ${score} — Risque élevé`
      mortalite = 10
    } else {
      severity = 'critical'
      label = `SRIS ${score} — Risque très élevé`
      mortalite = 20
    }

    return {
      value: score,
      label,
      risk: mortalite,
      riskUnit: '% mortalité estimée (SRIS)',
      severity,
      details: {
        'Âge': `${age} ans`,
        'Créatinine': `${creat} µmol/L`,
        'FEVG': ['> 50%', '30-50%', '< 30%'][fevgVal],
        'NYHA': ['I', 'II', 'III', 'IV'][nyhaVal],
        'Diabète': values.diabete ? 'Oui' : 'Non',
        'BPCO': values.bpco ? 'Oui' : 'Non',
        'HTAP': values.hta_pulm ? 'Oui' : 'Non',
        'Chirurgie combinée': values.chirurgie_combinee ? 'Oui' : 'Non',
        'Urgence': values.urgence ? 'Oui' : 'Non',
        'Score': score,
      },
      ranges: [
        { min: 0, max: 4, label: 'Risque faible (mortalité ~1.5%)', severity: 'low', recommendation: 'Procédure standard. Surveillance postopératoire habituelle.' },
        { min: 5, max: 9, label: 'Risque modéré (mortalité ~4.5%)', severity: 'moderate', recommendation: 'Optimisation préopératoire. SI postopératoire.' },
        { min: 10, max: 15, label: 'Risque élevé (mortalité ~10%)', severity: 'high', recommendation: 'Réunion de concertation. Discuter alternatives percutanées.' },
        { min: 16, max: 25, label: 'Risque très élevé (mortalité ~20%)', severity: 'critical', recommendation: 'Risque prohibitif. Alternatives thérapeutiques recommandées.' },
      ],
    }
  },
  interpretation: 'Le **Surgical Risk Index Score (SRIS)** est un score composite de morbi-mortalité en chirurgie cardiaque. Il intègre 10 facteurs de risque préopératoires : âge, sexe féminin, créatininémie, FEVG, NYHA, diabète, BPCO, HTAP, chirurgie combinée et urgence.\n\n**Seuils :** < 5 (faible), 5-9 (modéré), 10-15 (élevé), > 15 (très élevé).',
  clinicalCommentary: 'Le SRIS est un index simplifié de stratification du risque en chirurgie cardiaque. Il complète l\'EuroSCORE II en offrant une évaluation rapide au lit du patient. Il ne se substitue pas à une évaluation anesthésique et cardiologique complète préopératoire.',
  references: [
    { type: 'pubmed', title: 'Bernstein AD, Parsonnet V. Bedside estimation of risk as an aid for decision-making in cardiac surgery. Ann Thorac Surg 2000', pmid: '10800819' },
    { type: 'pubmed', title: 'O\'Brien SM et al. The STS risk model for isolated CABG. Ann Thorac Surg 2018', pmid: '29110932' },
  ],
}
export default sris
