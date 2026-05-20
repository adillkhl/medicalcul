import type { FormulaDefinition } from '../types'

const pram: FormulaDefinition = {
  id: 'pram', slug: 'pram',
  name: 'PRAM Score (Preschool Respiratory Assessment Measure)',
  specialty: 'pediatrie', category: 'Pneumologie',
  description: 'Évaluation de la sévérité de l\'asthme aigu chez l\'enfant < 6 ans',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sifflement', type: 'radio', label: 'Sifflements', options: [
      { value: 0, label: 'Absents' },
      { value: 1, label: 'Expiratoires au stéthoscope' },
      { value: 2, label: 'Inspiratoires/expiratoires ou audibles sans stéthoscope' },
    ]},
    { id: 'tirage_supra', type: 'radio', label: 'Tirage sus-sternal', options: [{ value: 0, label: 'Absent' }, { value: 2, label: 'Présent' }] },
    { id: 'balance_thoracique', type: 'radio', label: 'Balance thoracique', options: [{ value: 0, label: 'Absente' }, { value: 2, label: 'Présente' }] },
    { id: 'entonnailes', type: 'radio', label: 'Entonnoir xiphoïdien', options: [{ value: 0, label: 'Absent' }, { value: 2, label: 'Présent' }] },
    { id: 'fr_respiratoire', type: 'radio', label: 'Fréquence respiratoire', options: [{ value: 0, label: 'Normale' }, { value: 1, label: '> +1 DS' }, { value: 2, label: '> +2 DS' }] },
    { id: 'sat_o2', type: 'radio', label: 'SpO₂ (air ambiant)', options: [{ value: 0, label: '≥ 95%' }, { value: 1, label: '92-94%' }, { value: 2, label: '< 92%' }] },
  ],
  calculate: (values) => {
    const total = (values.sifflement ?? 0) + (values.tirage_supra ?? 0) + (values.balance_thoracique ?? 0) + (values.entonnailes ?? 0) + (values.fr_respiratoire ?? 0) + (values.sat_o2 ?? 0)
    return { value: total, label: `PRAM : ${total}/12`, severity: total >= 7 ? 'high' : total >= 4 ? 'moderate' : 'low',
      ranges: [
        { min: 0, max: 3, label: 'Asthme aigu léger', severity: 'low' },
        { min: 4, max: 6, label: 'Asthme aigu modéré', severity: 'moderate' },
        { min: 7, max: 12, label: 'Asthme aigu sévère', severity: 'high' },
      ] }
  },
  interpretation: 'Score ≥ 7 : exacerbation sévère nécessitant bronchodilatateurs intensifs et surveillance continue.',
  clinicalCommentary: 'Validé aux urgences pédiatriques. Réévaluer après chaque traitement.',
  references: [{ type: 'pubmed', title: 'Ducharme FM et al. PRAM score. Chest 2014' }],
}
export default pram
