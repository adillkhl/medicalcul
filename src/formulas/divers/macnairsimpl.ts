import type { FormulaDefinition } from '../types'

const macnairsimpl: FormulaDefinition = {
  id: 'macnairsimpl', slug: 'macnairsimpl',
  name: 'Échelle Simplifiée de Mac Nair (Anxiété)',
  specialty: 'divers', category: 'Psychiatrie',
  description: 'Version simplifiée de l\'échelle d\'anxiété de Mac Nair — auto-questionnaire court',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'tension', type: 'radio', label: 'Tension nerveuse / incapacité à se détendre', options: [{ value: 0, label: 'Pas du tout' }, { value: 1, label: 'Un peu' }, { value: 2, label: 'Modérément' }, { value: 3, label: 'Beaucoup' }, { value: 4, label: 'Extrêmement' }] },
    { id: 'sommeil', type: 'radio', label: 'Troubles du sommeil (endormissement, réveils)', options: [{ value: 0, label: 'Pas du tout' }, { value: 1, label: 'Un peu' }, { value: 2, label: 'Modérément' }, { value: 3, label: 'Beaucoup' }, { value: 4, label: 'Extrêmement' }] },
    { id: 'inquietude', type: 'radio', label: 'Inquiétude excessive (ruminations)', options: [{ value: 0, label: 'Pas du tout' }, { value: 1, label: 'Un peu' }, { value: 2, label: 'Modérément' }, { value: 3, label: 'Beaucoup' }, { value: 4, label: 'Extrêmement' }] },
    { id: 'irritabilite', type: 'radio', label: 'Irritabilité / impatience', options: [{ value: 0, label: 'Pas du tout' }, { value: 1, label: 'Un peu' }, { value: 2, label: 'Modérément' }, { value: 3, label: 'Beaucoup' }, { value: 4, label: 'Extrêmement' }] },
    { id: 'concentration', type: 'radio', label: 'Difficultés de concentration', options: [{ value: 0, label: 'Pas du tout' }, { value: 1, label: 'Un peu' }, { value: 2, label: 'Modérément' }, { value: 3, label: 'Beaucoup' }, { value: 4, label: 'Extrêmement' }] },
  ],
  calculate: (values) => {
    const total = (values.tension ?? 0) + (values.sommeil ?? 0) + (values.inquietude ?? 0) + (values.irritabilite ?? 0) + (values.concentration ?? 0)
    return { value: total, label: `Mac Nair : ${total}/20`, severity: total >= 12 ? 'high' : total >= 7 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 12 : anxiété significative. Score ≥ 7 : anxiété légère à modérée.',
  clinicalCommentary: 'Échelle simple de repérage de l\'anxiété en médecine générale. Ne remplace pas l\'échelle HAD ou une évaluation psychiatrique complète.',
  references: [{ type: 'pubmed', title: 'Mac Nair DM — Anxiety scale simplification' }],
}
export default macnairsimpl
