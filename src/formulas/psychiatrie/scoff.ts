import type { FormulaDefinition } from '../types'

const scoff: FormulaDefinition = {
  id: 'scoff', slug: 'scoff',
  name: 'SCOFF Questionnaire',
  specialty: 'psychiatrie', category: 'TCA',
  description: 'Questionnaire de dépistage des troubles du comportement alimentaire (TCA : anorexie, boulimie)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sick', type: 'boolean', label: 'S — Vous faites-vous vomir parce que vous vous sentez mal d\'avoir mangé ?' },
    { id: 'control', type: 'boolean', label: 'C — Craignez-vous de ne pas pouvoir vous arrêter de manger ?' },
    { id: 'one_stone', type: 'boolean', label: 'O — Avez-vous perdu plus de 6 kg (une grosse livre) en 3 mois ?' },
    { id: 'fat', type: 'boolean', label: 'F — Pensez-vous que vous êtes trop grosse(é) alors que les autres vous trouvent maigre ?' },
    { id: 'food', type: 'boolean', label: 'F — Est-ce que la nourriture domine votre vie ?' },
  ],
  calculate: (values) => {
    const total = (values.sick ? 1 : 0) + (values.control ? 1 : 0) + (values.one_stone ? 1 : 0) + (values.fat ? 1 : 0) + (values.food ? 1 : 0)
    return { value: total, label: `SCOFF : ${total}/5`, severity: total >= 2 ? 'high' : 'low' }
  },
  interpretation: 'Score ≥ 2/5 = suspicion de TCA. Sensibilité 100%, spécificité 87,5% pour l\'anorexie et la boulimie.',
  clinicalCommentary: 'Questionnaire simple et validé, utilisable en médecine générale. Ne remplace pas l\'entretien diagnostique. En cas de positivité, orienter vers un spécialiste des TCA.',
  references: [{ type: 'pubmed', title: 'Morgan JF et al. The SCOFF questionnaire. BMJ 1999', pmid: '10555985' }],
}
export default scoff
