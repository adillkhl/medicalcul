import type { FormulaDefinition } from '../types'

const binet: FormulaDefinition = {
  id: 'binet', slug: 'binet',
  name: 'Classification de Binet (Leucémie Lymphoïde Chronique)',
  specialty: 'hematologie', category: 'Leucémie',
  description: 'Classification pronostique de la leucémie lymphoïde chronique (LLC) selon les stades A, B, C de Binet',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'hb', type: 'number', label: 'Hémoglobine', unit: 'g/dL', min: 3, max: 18, step: 0.1, placeholder: 'Ex: 12.0' },
    { id: 'plaquettes', type: 'number', label: 'Plaquettes', unit: 'G/L', min: 10, max: 600, step: 1, placeholder: 'Ex: 200' },
    { id: 'aires_ganglionnaires', type: 'radio', label: 'Nombre d\'aires ganglionnaires atteintes (palpables)', options: [
      { value: 0, label: 'Moins de 3 aires atteintes' },
      { value: 1, label: '3 aires ou plus atteintes' },
    ]},
  ],
  calculate: (values) => {
    const hb = Number(values.hb) || 13
    const plaq = Number(values.plaquettes) || 250
    const aires = Number(values.aires_ganglionnaires) || 0

    let stade: string
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let medianeSurvie: string
    let priseEnCharge: string

    if (hb < 10) {
      stade = 'C'
      severity = 'critical'
      medianeSurvie = '< 5 ans'
      priseEnCharge = 'Traitement indiqué (analogues puriques, immunothérapie)'
    } else if (plaq < 100) {
      stade = 'C'
      severity = 'critical'
      medianeSurvie = '< 5 ans'
      priseEnCharge = 'Traitement indiqué (analogues puriques, immunothérapie)'
    } else if (aires >= 1) {
      stade = 'B'
      severity = 'moderate'
      medianeSurvie = '~ 5-7 ans'
      priseEnCharge = 'Surveillance clinique. Traitement si symptomatique ou évolutif (FCR, ibrutinib, venetoclax)'
    } else {
      stade = 'A'
      severity = 'low'
      medianeSurvie = '> 10 ans'
      priseEnCharge = 'Surveillance simple (abstention thérapeutique jusqu\'à progression)'
    }

    return {
      value: stade === 'A' ? 0 : stade === 'B' ? 1 : 2,
      label: `Stade ${stade} (Binet) — ${priseEnCharge}`,
      severity,
      details: {
        'Stade': stade,
        'Hémoglobine': `${hb} g/dL`,
        'Plaquettes': `${plaq} G/L`,
        'Aires ganglionnaires': aires >= 1 ? '≥ 3 aires' : '< 3 aires',
        'Médiane de survie': medianeSurvie,
        'Prise en charge': priseEnCharge,
      },
      ranges: [
        { min: 0, max: 0, label: 'Stade A : Risque faible', severity: 'low', recommendation: 'Surveillance simple' },
        { min: 1, max: 1, label: 'Stade B : Risque intermédiaire', severity: 'moderate', recommendation: 'Surveillance/TTT si symptomatique' },
        { min: 2, max: 2, label: 'Stade C : Risque élevé', severity: 'critical', recommendation: 'Traitement indiqué' },
      ],
    }
  },
  interpretation: 'La **classification de Binet** est le système pronostique standard pour la LLC en France et en Europe :\n\n• **Stade A** : Hb ≥ 10 g/dL, Plaquettes ≥ 100 G/L, < 3 aires ganglionnaires — Risque faible\n• **Stade B** : Hb ≥ 10 g/dL, Plaquettes ≥ 100 G/L, ≥ 3 aires ganglionnaires — Risque intermédiaire\n• **Stade C** : Hb < 10 g/dL et/ou Plaquettes < 100 G/L — Risque élevé\n\nLes aires ganglionnaires considérées : cervicales, axillaires, inguinales (unilatéral ou bilatéral compte pour 1 aire), rate, foie.\n\nLa classification de Rai (stades 0-IV) est plus utilisée aux États-Unis. Les deux classifications sont complémentaires.',
  clinicalCommentary: 'La classification de Binet reste un outil de pronostic et de décision thérapeutique majeur dans la LLC. Elle est aujourd\'hui complétée par les facteurs pronostiques moléculaires (statut mutationnel IgVH, délétions 17p/11q, TP53). Le traitement de première ligne dépend du stade, de l\'âge, des comorbidités, et du statut moléculaire (FCR chez les jeunes sans délétion 17p ; ibrutinib ou venetoclax + obinutuzumab dans les formes délétion 17p/TP53 muté).',
  references: [
    { type: 'pubmed', title: 'Binet JL et al. A new prognostic classification of chronic lymphocytic leukemia derived from a multivariate survival analysis. Cancer 1981', pmid: '7196285' },
    { type: 'pubmed', title: 'Hallek M et al. iwCLL guidelines for diagnosis, treatment of CLL. Blood 2018', pmid: '29540348' },
  ],
}
export default binet
