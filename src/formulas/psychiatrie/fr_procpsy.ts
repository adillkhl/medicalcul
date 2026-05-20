import type { FormulaDefinition } from '../types'

const fr_procpsy: FormulaDefinition = {
  id: 'fr_procpsy', slug: 'fr_procpsy',
  name: 'Procédures d\'Hospitalisation Psychiatrique (France)',
  specialty: 'psychiatrie', category: 'Législation',
  description: 'Récapitulatif des procédures d\'hospitalisation psychiatrique en France : HDT, HO, SL, Soins ambulatoires',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'avis',
  inputs: [
    { id: 'consentement', type: 'radio', label: 'Le patient consent-il aux soins ?', options: [{ value: 0, label: 'Oui — Soins libres (ambulatoire ou hospitalisation)' }, { value: 1, label: 'Non — Soins sans consentement' }] },
  ],
  calculate: (values) => {
    const consent = values.consentement ?? 0
    return { value: consent, label: consent === 0 ? 'Soins libres possibles' : 'Soins sans consentement à envisager',
      severity: consent === 0 ? 'low' : 'high',
      details: consent === 0
        ? { 'Régime': 'Soins libres', 'Procédure': 'Admission classique (publique ou privée)', 'Durée': 'Libre' }
        : { 'Régime': 'Soins sans consentement', 'Procédure': 'HDT (danger imminent) ou HO (péril grave) ou SL (sûreté)', 'Durée': '72h initiales, renouvelable' },
    }
  },
  interpretation: 'Les soins sans consentement en France comprennent : HDT (Hospitalisation à la Demande d\'un Tiers), HO (Hospitalisation d\'Office par le préfet), SL (Soins Libres avec contrainte).',
  clinicalCommentary: 'Toute admission sans consentement nécessite deux certificats médicaux (sauf urgence). Réévaluation à 72h, puis 12 jours, puis mensuelle. Information du patient et droit de recours.',
  references: [{ type: 'guideline', title: 'Code de la Santé Publique — Loi du 5 juillet 2011', url: 'https://www.legifrance.gouv.fr/' }],
}
export default fr_procpsy
