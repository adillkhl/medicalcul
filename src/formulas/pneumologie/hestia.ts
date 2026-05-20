import type { FormulaDefinition } from '../types'

const hestia: FormulaDefinition = {
  id: 'hestia', slug: 'hestia',
  name: 'Critères d\'Hestia (Embolie Pulmonaire — Traitement Ambulatoire)',
  specialty: 'pneumologie', category: 'Thromboembolie',
  description: 'Critères de sélection des patients avec EP pour un traitement exclusivement ambulatoire',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'hemodynamique', type: 'boolean', label: 'Instabilité hémodynamique (PAS < 100 mmHg, arrêt cardiaque, besoin de vasopresseurs)' },
    { id: 'thrombolyse', type: 'boolean', label: 'Indication à la thrombolyse' },
    { id: 'hypoxemie', type: 'boolean', label: 'Hypoxémie (SpO₂ < 90% ou besoin d\'O₂)' },
    { id: 'ep_retard', type: 'boolean', label: 'EP diagnostiquée sous anticoagulant (ou < 48h)' },
    { id: 'douleur_intense', type: 'boolean', label: 'Douleur intense nécessitant antalgiques IV > 24h' },
    { id: 'hemorragie', type: 'boolean', label: 'Risque hémorragique élevé (GI, post-op, AVC < 2 sem, thrombopénie)' },
    { id: 'clairance_creat', type: 'boolean', label: 'Clairance créatinine < 30 mL/min' },
    { id: 'insuf_hepatique', type: 'boolean', label: 'Insuffisance hépatique sévère' },
    { id: 'grossesse', type: 'boolean', label: 'Grossesse' },
    { id: 'compliance', type: 'boolean', label: 'Non-compliance ou impossibilité de suivi médical' },
    { id: 'hist_htia', type: 'boolean', label: 'Thrombopénie induite par l\'héparine (TIH / HIT)' },
  ],
  calculate: (values) => {
    const total = (values.hemodynamique ? 1 : 0) + (values.thrombolyse ? 1 : 0) + (values.hypoxemie ? 1 : 0) + (values.ep_retard ? 1 : 0) + (values.douleur_intense ? 1 : 0) + (values.hemorragie ? 1 : 0) + (values.clairance_creat ? 1 : 0) + (values.insuf_hepatique ? 1 : 0) + (values.grossesse ? 1 : 0) + (values.compliance ? 1 : 0) + (values.hist_htia ? 1 : 0)
    return { value: total, label: `Hestia : ${total} critères positif(s)`, severity: total >= 1 ? 'high' : 'low' }
  },
  interpretation: 'Si tous les critères sont négatifs (score = 0) : traitement ambulatoire possible. Si ≥ 1 critère positif : hospitalisation recommandée.',
  clinicalCommentary: 'Les critères d\'Hestia ont été validés dans la prise en charge ambulatoire de l\'EP. Excellente valeur prédictive négative. Simple d\'utilisation.',
  references: [{ type: 'pubmed', title: 'Zondag W et al. Hestia criteria for outpatient PE treatment. Eur Respir J 2011', pmid: '21148227' }],
}
export default hestia
