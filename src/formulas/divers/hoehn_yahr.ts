import type { FormulaDefinition } from '../types'

const hoehn_yahr: FormulaDefinition = {
  id: 'hoehn_yahr', slug: 'hoehn_yahr',
  name: 'Stades de Hoehn et Yahr (Parkinson)',
  specialty: 'divers', category: 'Neurologie',
  description: 'Classification de la progression de la maladie de Parkinson selon le stade de Hoehn et Yahr (0-5)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'signes_uni', type: 'boolean', label: 'Signes unilatéraux seulement' },
    { id: 'signes_bilat', type: 'boolean', label: 'Signes bilatéraux' },
    { id: 'trouble_postural', type: 'boolean', label: 'Trouble postural (instabilité)' },
    { id: 'autonomie', type: 'radio', label: 'Autonomie', options: [{ value: 0, label: 'Autonome' }, { value: 1, label: 'Aide partielle nécessaire' }, { value: 2, label: 'Totalement dépendant / grabataire' }] },
  ],
  calculate: (values) => {
    let stade = 0, desc = 'Aucun signe parkinsonien'
    if (values.autonomie === 2) { stade = 5; desc = 'Stade 5 — Grabataire / fauteuil, dépendance totale' }
    else if (values.autonomie === 1 && values.trouble_postural) { stade = 4; desc = 'Stade 4 — Perte d\'autonomie sévère, marche possible avec aide' }
    else if (values.trouble_postural) { stade = 3; desc = 'Stade 3 — Maladie bilatérale avec trouble postural (instabilité)' }
    else if (values.signes_bilat) { stade = 2; desc = 'Stade 2 — Maladie bilatérale sans trouble postural' }
    else if (values.signes_uni) { stade = 1; desc = 'Stade 1 — Signes unilatéraux' }
    return { value: stade, label: desc, severity: stade >= 4 ? 'high' : stade >= 3 ? 'moderate' : 'low' }
  },
  interpretation: 'Stade 1 : unilatéral. Stade 2 : bilatéral. Stade 3 : instabilité posturale. Stade 4 : dépendance. Stade 5 : grabataire.',
  clinicalCommentary: 'Classification simple et reproductible. Ne tient pas compte des symptômes non-moteurs. L\'UPDRS (MDS-UPDRS) est plus complet mais plus long.',
  references: [{ type: 'pubmed', title: 'Hoehn MM, Yahr MD. Parkinsonism: onset, progression and mortality. Neurology 1967', pmid: '6067254' }],
}
export default hoehn_yahr
