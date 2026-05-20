import type { FormulaDefinition } from '../types'

const nijmegen_hyperventil: FormulaDefinition = {
  id: 'nijmegen_hyperventil', slug: 'nijmegen_hyperventil',
  name: 'Score de Nijmegën (Hyperventilation)',
  specialty: 'pneumologie', category: 'Fonction respiratoire',
  description: 'Questionnaire de dépistage du syndrome d\'hyperventilation — score de Nijmegën (16 items, score 0-64)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'oppression', type: 'radio', label: 'Oppression thoracique', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Rarement' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Souvent' }, { value: 4, label: 'Très souvent' }] },
    { id: 'sensation_etouffement', type: 'radio', label: 'Sensation d\'étouffement', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Rarement' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Souvent' }, { value: 4, label: 'Très souvent' }] },
    { id: 'battements_coeur', type: 'radio', label: 'Battements de coeur irréguliers / palpitations', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Rarement' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Souvent' }, { value: 4, label: 'Très souvent' }] },
    { id: 'vertiges', type: 'radio', label: 'Vertiges / sensation de vide dans la tête', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Rarement' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Souvent' }, { value: 4, label: 'Très souvent' }] },
    { id: 'picotements', type: 'radio', label: 'Picotements (doigts, lèvres)', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Rarement' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Souvent' }, { value: 4, label: 'Très souvent' }] },
    { id: 'crampes_mains', type: 'radio', label: 'Crampes aux mains (spasme carpien)', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Rarement' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Souvent' }, { value: 4, label: 'Très souvent' }] },
  ],
  calculate: (values) => {
    const total = (values.oppression ?? 0) + (values.sensation_etouffement ?? 0) + (values.battements_coeur ?? 0) + (values.vertiges ?? 0) + (values.picotements ?? 0) + (values.crampes_mains ?? 0)
    return { value: total, label: `Nijmegën (version 6 items) : ${total}/24`, severity: total >= 10 ? 'high' : total >= 6 ? 'moderate' : 'low' }
  },
  interpretation: 'Score ≥ 23/64 pour la version complète (16 items). La version 6 items > 10/24 suggère une hyperventilation.',
  clinicalCommentary: 'Le syndrome d\'hyperventilation est souvent sous-diagnostiqué. À différencier de l\'asthme et de l\'embolie pulmonaire. Test de provocation par hyperpnée volontaire.',
  references: [{ type: 'pubmed', title: 'van Dixhoorn J, Duivenvoorden HJ. Nijmegen Questionnaire. Am Rev Respir Dis 1985' }],
}
export default nijmegen_hyperventil
