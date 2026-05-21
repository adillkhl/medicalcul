import type { FormulaDefinition } from '../types'

const annarbor: FormulaDefinition = {
  id: 'annarbor', slug: 'annarbor',
  name: 'Ann Arbor — Classification des Stades des Lymphomes (Simplifiée)',
  specialty: 'hematologie', category: 'Lymphome',
  description: 'Classification simplifiée d\'Ann Arbor pour le staging des lymphomes hodgkiniens et non hodgkiniens — stades I à IV avec symptômes B',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'stade', type: 'radio', label: 'Atteinte anatomique', options: [
      { value: 1, label: 'Stade I : 1 aire ganglionnaire unique' },
      { value: 2, label: 'Stade II : ≥ 2 aires ganglionnaires du même côté du diaphragme' },
      { value: 3, label: 'Stade III : Aires ganglionnaires des deux côtés du diaphragme' },
      { value: 4, label: 'Stade IV : Atteinte viscérale diffuse (foie, poumon, moelle osseuse, etc.)' },
    ]},
    { id: 'symptomes_b', type: 'boolean', label: 'Symptômes B (fièvre > 38°C inexpliquée, sueurs nocturnes profuses, perte de poids > 10% en 6 mois)' },
  ],
  calculate: (values) => {
    const stadeNum = Number(values.stade) || 1
    const symptomesB = !!values.symptomes_b

    const stadeRomains = ['', 'I', 'II', 'III', 'IV']
    const stadeLettres = symptomesB ? 'B' : 'A'
    const stadeComplet = `${stadeRomains[stadeNum]}${stadeLettres}`

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let description = ''
    let priseEnCharge = ''

    if (stadeNum <= 2) {
      if (symptomesB) {
        severity = 'moderate'
      } else {
        severity = 'low'
      }
    } else if (stadeNum === 3) {
      severity = 'high'
    } else {
      severity = 'critical'
    }

    const stadesDesc = [
      '',
      'Atteinte d\'une seule aire ganglionnaire',
      '≥ 2 aires du même côté du diaphragme',
      'Aires ganglionnaires des deux côtés',
      'Atteinte viscérale diffuse (extra-lymphatique)',
    ]

    description = stadesDesc[stadeNum]
    label = `Stade ${stadeComplet} — ${description}`

    if (stadeNum <= 2 && !symptomesB) {
      priseEnCharge = 'Maladie localisée. Radiothérapie ou chimiothérapie courte (± Rituximab si LNH). Pronostic favorable.'
    } else if (stadeNum <= 2 && symptomesB) {
      priseEnCharge = 'Maladie localisée avec symptômes B. Chimiothérapie (ABVD pour LH, R-CHOP pour LNH B).'
    } else if (stadeNum === 3) {
      priseEnCharge = 'Maladie disséminée sus- et sous-diaphragmatique. Chimiothérapie systémique complète.'
    } else {
      priseEnCharge = 'Maladie disséminée avec atteinte viscérale. Chimiothérapie agressive ± radiothérapie ± greffe.'
    }

    return {
      value: stadeNum,
      label,
      severity,
      details: {
        'Stade': stadeRomains[stadeNum],
        'Symptômes': symptomesB ? 'B (présents)' : 'A (absents)',
        'Stade complet': stadeComplet,
        'Description': description,
        'Prise en charge': priseEnCharge,
      },
      ranges: [
        { min: 1, max: 1, label: 'Stade I', severity: 'low', recommendation: 'Traitement localisé. Pronostic favorable.' },
        { min: 2, max: 2, label: 'Stade II', severity: 'low', recommendation: 'Traitement localisé ou systémique court.' },
        { min: 3, max: 3, label: 'Stade III', severity: 'high', recommendation: 'Chimiothérapie systémique complète.' },
        { min: 4, max: 4, label: 'Stade IV', severity: 'critical', recommendation: 'Chimiothérapie agressive ± greffe.' },
      ],
    }
  },
  interpretation: 'La **classification d\'Ann Arbor** (1971) est le système de staging standard pour les lymphomes :\n\n- **Stade I** : 1 aire ganglionnaire unique\n- **Stade II** : ≥ 2 aires du même côté du diaphragme\n- **Stade III** : aires des deux côtés du diaphragme\n- **Stade IV** : atteinte viscérale diffuse (foie, poumon, moelle, etc.)\n\n**Suffixe :** A = asymptomatique, B = symptômes B présents (fièvre, sueurs, perte de poids)\n\nLa classification de Cotswolds (1989) a modifié Ann Arbor en ajoutant la notion de masse tumorale volumineuse.',
  clinicalCommentary: 'Le staging Ann Arbor est essentiel pour la décision thérapeutique et le pronostic. Pour les lymphomes de Hodgkin, les stades I-II sont traités par chimiothérapie courte (ABVD 2-4 cycles) ± radiothérapie. Pour les stades III-IV, une chimiothérapie complète (ABVD 6 cycles) est nécessaire. Le staging TEP-TDM (scanner TEP) a remplacé la lymphangiographie et la laparotomie exploratrice.',
  references: [
    { type: 'pubmed', title: 'Carbone PP et al. Report of the Committee on Hodgkin\'s Disease Staging Classification. Cancer Res 1971', pmid: '5124207' },
    { type: 'pubmed', title: 'Lister TA et al. Report of a committee convened to discuss the evaluation and staging of patients with Hodgkin\'s disease: Cotswolds meeting. J Clin Oncol 1989', pmid: '2677091' },
  ],
}
export default annarbor
