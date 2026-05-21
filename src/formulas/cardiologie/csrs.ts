import type { FormulaDefinition } from '../types'

const csrs: FormulaDefinition = {
  id: 'csrs', slug: 'csrs',
  name: 'Coronary Surgery Risk Score (Score de Risque en Chirurgie Coronaire)',
  specialty: 'cardiologie', category: 'Chirurgie cardiaque',
  description: 'Score de risque de mortalité et complications post-opératoires après pontage aorto-coronarien (PAC)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 65' },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Femme' }, { value: 1, label: 'Homme' }] },
    { id: 'urgent', type: 'boolean', label: 'Chirurgie urgente (< 24h)' },
    { id: 'redos', type: 'boolean', label: 'Chirurgie de reprise (redos)' },
    { id: 'fevg', type: 'radio', label: 'Fraction d\'éjection VG', options: [
      { value: 0, label: 'FEVG > 50%' },
      { value: 1, label: 'FEVG 30-50%' },
      { value: 2, label: 'FEVG < 30%' },
    ]},
    { id: 'insuf_renale', type: 'boolean', label: 'Insuffisance rénale (créatinine > 200 µmol/L ou dialyse)' },
    { id: 'bpco', type: 'boolean', label: 'BPCO sévère' },
    { id: 'aomi', type: 'boolean', label: 'Artériopathie périphérique (AOMI)' },
    { id: 'idm_recent', type: 'boolean', label: 'IDM récent (< 90 jours)' },
    { id: 'choc', type: 'boolean', label: 'Choc cardiogénique préopératoire' },
  ],
  calculate: (values) => {
    let score = 0
    const age = Number(values.age) || 60

    // Âge
    if (age >= 80) score += 6
    else if (age >= 70) score += 4
    else if (age >= 60) score += 2

    // Autres facteurs
    if (values.sexe === 0) score += 2 // Sexe féminin
    if (values.urgent) score += 4
    if (values.redos) score += 5
    if (values.fevg === 1) score += 3
    else if (values.fevg === 2) score += 6
    if (values.insuf_renale) score += 4
    if (values.bpco) score += 2
    if (values.aomi) score += 3
    if (values.idm_recent) score += 2
    if (values.choc) score += 8

    let riskPct: number
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''

    if (score < 5) {
      riskPct = 1
      severity = 'low'
      label = `CSRS ${score} — Risque faible (mortalité < 2%)`
    } else if (score < 10) {
      riskPct = 3
      severity = 'moderate'
      label = `CSRS ${score} — Risque modéré (mortalité 2-5%)`
    } else if (score < 16) {
      riskPct = 8
      severity = 'high'
      label = `CSRS ${score} — Risque élevé (mortalité 5-15%)`
    } else {
      riskPct = 20
      severity = 'critical'
      label = `CSRS ${score} — Risque très élevé (mortalité > 15%)`
    }

    return {
      value: score,
      label,
      risk: riskPct,
      riskUnit: '% mortalité postopératoire estimée',
      severity,
      details: {
        'Âge': `${age} ans`,
        'Sexe': values.sexe === 0 ? 'Femme' : 'Homme',
        'Urgent': values.urgent ? 'Oui' : 'Non',
        'Redos': values.redos ? 'Oui' : 'Non',
        'FEVG': ['> 50%', '30-50%', '< 30%'][Number(values.fevg) || 0],
        'Insuffisance rénale': values.insuf_renale ? 'Oui' : 'Non',
        'BPCO': values.bpco ? 'Oui' : 'Non',
        'AOMI': values.aomi ? 'Oui' : 'Non',
        'IDM récent': values.idm_recent ? 'Oui' : 'Non',
        'Choc cardiogénique': values.choc ? 'Oui' : 'Non',
        'Score total': score,
      },
      ranges: [
        { min: 0, max: 4, label: 'Risque faible (mortalité < 2%)', severity: 'low', recommendation: 'Chirurgie standard. Surveillance postopératoire habituelle.' },
        { min: 5, max: 9, label: 'Risque modéré (mortalité 2-5%)', severity: 'moderate', recommendation: 'Optimiser état clinique. Surveillance rapprochée en soins intensifs.' },
        { min: 10, max: 15, label: 'Risque élevé (mortalité 5-15%)', severity: 'high', recommendation: 'Discussion multidisciplinaire. Alternatives à discuter (angioplastie, TAVI si associé).' },
        { min: 16, max: 40, label: 'Risque très élevé (mortalité > 15%)', severity: 'critical', recommendation: 'Risque prohibitif. Discuter alternatives percutanées ou traitement médical.' },
      ],
    }
  },
  interpretation: 'Le **Coronary Surgery Risk Score (CSRS)** est un score simple de stratification du risque de mortalité postopératoire après pontage aorto-coronarien (PAC). Il prend en compte l\'âge, le sexe, le caractère urgent, la reprise chirurgicale, la FEVG, l\'insuffisance rénale, la BPCO, l\'AOMI, l\'IDM récent et le choc cardiogénique.\n\n**Seuils :** < 5 (faible), 5-9 (modéré), 10-15 (élevé), > 15 (très élevé).',
  clinicalCommentary: 'Le CSRS est un score simplifié comparable à l\'EuroSCORE mais spécifiquement dédié à la chirurgie coronaire. Il permet une estimation rapide du risque peropératoire et facilite la discussion avec le patient et l\'équipe médico-chirurgicale. Les scores de risque cardiovasculaire doivent être utilisés comme outils d\'aide à la décision et non comme seul critère de sélection des patients.',
  references: [
    { type: 'pubmed', title: 'Nashef SA et al. EuroSCORE II. Eur J Cardiothorac Surg 2012', pmid: '22679151' },
    { type: 'pubmed', title: 'Parsonnet V et al. A method of uniform stratification of risk for evaluating the results of surgery. Circulation 1989', pmid: '2785909' },
  ],
}
export default csrs
