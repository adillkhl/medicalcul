import type { FormulaDefinition } from '../types'

const liege: FormulaDefinition = {
  id: 'liege', slug: 'liege',
  name: 'Score de Liège (Coma)',
  specialty: 'divers', category: 'Neurologie',
  description: 'Score de coma de Liège — évaluation du tronc cérébral (cotations 0-20)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'oculomotrice', type: 'radio', label: 'Motricité oculaire (poursuite, réflexe oculocéphalique)', options: [
      { value: 0, label: 'Réflexe oculocéphalique nul' },
      { value: 1, label: 'Réflexe oculocéphalique partiel' },
      { value: 2, label: 'Réflexe oculocéphalique complet' },
      { value: 3, label: 'Mouvements spontanés orientés' },
    ]},
    { id: 'pupilles', type: 'radio', label: 'Réflexe pupillaire', options: [
      { value: 0, label: 'Nul bilatéral' },
      { value: 1, label: 'Partiel' },
      { value: 2, label: 'Normal' },
    ]},
    { id: 'frontale', type: 'radio', label: 'Réflexe fronto-orbiculaire (percussion glabelle)', options: [
      { value: 0, label: 'Absent' },
      { value: 1, label: 'Présent' },
    ]},
    { id: 'masseterine', type: 'radio', label: 'Réflexe massétérin', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Présent' },
    ]},
    { id: 'ciliospinal', type: 'radio', label: 'Réflexe cilio-spinal (pincement cou)', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Présent' },
    ]},
    { id: 'oculocardiaque', type: 'radio', label: 'Réflexe oculocardiaque', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Présent' },
    ]},
    { id: 'cornéen', type: 'radio', label: 'Réflexe cornéen', options: [
      { value: 0, label: 'Absent' }, { value: 1, label: 'Présent' },
    ]},
  ],
  calculate: (values) => {
    const total = (values.oculomotrice ?? 0) + (values.pupilles ?? 0) + (values.frontale ?? 0) + (values.masseterine ?? 0) + (values.ciliospinal ?? 0) + (values.oculocardiaque ?? 0) + (values.corneen ?? 0)
    return { value: total, label: `Score de Liège : ${total}/20`, severity: total <= 5 ? 'high' : total <= 10 ? 'moderate' : total <= 15 ? 'low' : 'low' }
  },
  interpretation: 'Le score de Liège complète le Glasgow pour le pronostic des comas graves. Score bas = atteinte du tronc cérébral. Pronostic réservé si < 8.',
  clinicalCommentary: 'L\'évaluation des réflexes du tronc cérébral est essentielle dans le coma profond. Le score de Liège évalue 7 items du tronc. Souvent utilisé en réanimation neurochirurgicale.',
  references: [{ type: 'pubmed', title: 'Born JD et al. Le score de Liège. Neurochirurgie 1984' }],
}
export default liege
