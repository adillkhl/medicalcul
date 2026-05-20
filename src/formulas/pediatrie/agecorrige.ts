import type { FormulaDefinition } from '../types'

const agecorrige: FormulaDefinition = {
  id: 'agecorrige', slug: 'agecorrige',
  name: 'Âge Corrigé du Prématuré',
  specialty: 'pediatrie', category: 'Neonatalogie',
  description: 'Calcul de l\'âge corrigé pour un enfant né prématuré',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_chrono_mois', type: 'number', label: 'Âge chronologique (mois)', min: 0, max: 36, step: 0.5 },
    { id: 'ag_naiss_sa', type: 'number', label: 'Âge gestationnel naissance (SA)', min: 22, max: 42, step: 1 },
  ],
  calculate: (values) => {
    const ac = values.age_chrono_mois ?? 0
    const ag = values.ag_naiss_sa ?? 40
    const prem_mois = Math.max(0, (40 - ag) * 0.23)
    const corrige = Math.max(0, ac - prem_mois)
    return { value: corrige, label: `Âge corrigé : ${corrige.toFixed(1)} mois (${(corrige * 4.33).toFixed(0)} sem)`, severity: prem_mois > 6 ? 'high' : prem_mois > 3 ? 'moderate' : 'low' }
  },
  interpretation: 'L\'âge corrigé s\'obtient en soustrayant la prématurité. Utilisé jusqu\'à 2 ans.',
  clinicalCommentary: 'Correction jusqu\'à 24 mois pour les < 32 SA. Vaccins : suivre l\'âge chronologique.',
  references: [{ type: 'pubmed', title: 'AAP — Age correction for preterm infants' }],
}
export default agecorrige
