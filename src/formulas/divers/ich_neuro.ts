import type { FormulaDefinition } from '../types'

const ich_neuro: FormulaDefinition = {
  id: 'ich_neuro', slug: 'ich_neuro',
  name: 'ICH Score (IntraCerebral Hemorrhage)',
  specialty: 'divers', category: 'Neurologie',
  description: 'Score pronostique de mortalité à 30 jours après hémorragie intracérébrale spontanée (ICH score)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'gcs', type: 'radio', label: 'Glasgow Coma Scale initial', options: [
      { value: 0, label: '13-15' }, { value: 1, label: '5-12' }, { value: 2, label: '3-4' },
    ]},
    { id: 'volume_ml', type: 'radio', label: 'Volume de l\'hématome (mL) — formule ABC/2', options: [
      { value: 0, label: '< 30 mL' }, { value: 1, label: '≥ 30 mL' },
    ]},
    { id: 'hydrocephalie', type: 'boolean', label: 'Hydrocéphalie intraventriculaire (extension IV)' },
    { id: 'sous_tentoriel', type: 'boolean', label: 'Origine sous-tentorielle (tronc/cervelet)' },
    { id: 'age', type: 'radio', label: 'Âge', options: [{ value: 0, label: '< 80 ans' }, { value: 1, label: '≥ 80 ans' }] },
  ],
  calculate: (values) => {
    const total = (values.gcs ?? 0) + (values.volume_ml ?? 0) + (values.hydrocephalie ? 1 : 0) + (values.sous_tentoriel ? 1 : 0) + (values.age ?? 0)
    let mortalite = '0-2%'
    if (total === 1) mortalite = '13%'
    else if (total === 2) mortalite = '26%'
    else if (total === 3) mortalite = '72%'
    else if (total === 4) mortalite = '97%'
    else if (total >= 5) mortalite = '100%'
    return { value: total, label: `ICH Score : ${total}/6 — Mortalité à 30j : ${mortalite}`, severity: total >= 3 ? 'high' : total >= 2 ? 'moderate' : 'low' }
  },
  interpretation: 'ICH Score ≥ 3 : mortalité > 70%. Score 0 : survie probable (mortalité < 2%). Aide à décider de la prise en charge intensive vs palliative.',
  clinicalCommentary: 'Score validé sur plus de 1000 patients. Ne doit pas être le seul élément de décision thérapeutique. La directive anticipée et le contexte clinique priment.',
  references: [{ type: 'pubmed', title: 'Hemphill JC et al. The ICH score. Stroke 2001', pmid: '11387483' }],
}
export default ich_neuro
