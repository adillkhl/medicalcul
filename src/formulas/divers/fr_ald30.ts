import type { FormulaDefinition } from '../types'

const fr_ald30: FormulaDefinition = {
  id: 'fr_ald30', slug: 'fr_ald30',
  name: 'Liste des ALD 30 (Affections de Longue Durée — France)',
  specialty: 'divers', category: 'Administratif',
  description: 'Liste des 30 affections de longue durée (ALD) ouvrant droit au tiers-payant et à l\'exonération du ticket modérateur en France',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'avis',
  inputs: [
    { id: 'num_ald', type: 'number', label: 'Numéro ALD (1-30)', min: 1, max: 30, step: 1 },
  ],
  calculate: (values) => {
    const n = values.num_ald ?? 1
    const alds: Record<number, string> = {
      1: 'AVC invalidant', 2: 'Insuffisance médullaire', 3: 'Artériopathie périphérique', 4: 'Bilharziose',
      5: 'Insuffisance cardiaque', 6: 'Hépatopathie chronique', 7: 'Diabète de type 1 et 2', 8: 'Troubles graves hémostase',
      9: 'VIH', 10: 'Cardiopathie congénitale', 11: 'Lèpre', 12: 'Maladie de Parkinson',
      13: 'Maladies métaboliques héréditaires', 14: 'Mucoviscidose', 15: 'Néphropathie chronique', 16: 'Paraplégie',
      17: 'Périartérite noueuse', 18: 'Polyarthrite rhumatoïde', 19: 'Affections psychiatriques', 20: 'RCH / Crohn',
      21: 'Sclérose en plaques', 22: 'Scoliose > 50°', 23: 'Spondylarthrite', 24: 'Suites de tuberculose',
      25: 'Tuberculose active', 26: 'Tumeur maligne / Cancer', 27: 'Thyroïdectomie', 28: 'Diabète insipide',
      29: 'Insuffisance respiratoire chronique', 30: 'Maladie d\'Alzheimer',
    }
    return { value: n, label: `ALD ${n} : ${alds[n] || 'Inconnue'}`, severity: 'low' }
  },
  interpretation: 'Les ALD 30 permettent une prise en charge à 100% par l\'Assurance Maladie (sans dépassement d\'honoraires).',
  clinicalCommentary: 'Depuis 2011, certaines ALD ont été regroupées (ex: ALD 7 inclut désormais diabète type 1 et 2). Des ALD "hors liste" existent pour les affections graves rares.',
  references: [{ type: 'guideline', title: 'Assurance Maladie — Liste des ALD 30', url: 'https://www.ameli.fr/' }],
}
export default fr_ald30
