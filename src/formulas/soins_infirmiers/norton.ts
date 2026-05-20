import type { FormulaDefinition } from '../types'

const norton: FormulaDefinition = {
  id: 'norton', slug: 'norton',
  name: 'Norton (Échelle de risque d\'escarre)',
  specialty: 'soins_infirmiers', category: 'Évaluation du Risque',
  description: 'Évaluation du risque d\'escarre selon 5 items (état général, état mental, activité, mobilité, incontinence) — score 5-20, plus le score est bas, plus le risque est élevé',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    {
      id: 'etat_general',
      type: 'radio',
      label: 'État général / Condition physique',
      options: [
        { value: 4, label: '4 — Bon (stable, bon état général)' },
        { value: 3, label: '3 — Moyen (assez bon, quelques limitations)' },
        { value: 2, label: '2 — Mauvais (malade, nécessite des soins)' },
        { value: 1, label: '1 — Très mauvais (cachexie, état grabataire)' },
      ],
    },
    {
      id: 'etat_mental',
      type: 'radio',
      label: 'État mental',
      options: [
        { value: 4, label: '4 — Alerte / conscient, réactif' },
        { value: 3, label: '3 — Apathique (ralenti, peu réactif)' },
        { value: 2, label: '2 — Confus (désorienté, agité)' },
        { value: 1, label: '1 — Stuporeux / comateux (ne répond pas)' },
      ],
    },
    {
      id: 'activite',
      type: 'radio',
      label: 'Activité',
      options: [
        { value: 4, label: '4 — Ambulatoire (marche seul, actif)' },
        { value: 3, label: '3 — Marche avec aide (nécessite assistance)' },
        { value: 2, label: '2 — Confiné au fauteuil (ne marche pas)' },
        { value: 1, label: '1 — Alité (ne quitte pas le lit)' },
      ],
    },
    {
      id: 'mobilite',
      type: 'radio',
      label: 'Mobilité',
      options: [
        { value: 4, label: '4 — Complète (se retourne, se mobilise seul)' },
        { value: 3, label: '3 — Légèrement réduite (se retourne avec aide)' },
        { value: 2, label: '2 — Très limitée (ne peut changer de position seul)' },
        { value: 1, label: '1 — Immobile (aucun mouvement spontané)' },
      ],
    },
    {
      id: 'incontinence',
      type: 'radio',
      label: 'Incontinence',
      options: [
        { value: 4, label: '4 — Aucune (contrôle normal)' },
        { value: 3, label: '3 — Occasionnelle (1-2 fois/jour)' },
        { value: 2, label: '2 — Habituellement urinaire (sonde ou incontinence)' },
        { value: 1, label: '1 — Double incontinence (urines + selles)' },
      ],
    },
  ],
  calculate: (values) => {
    const s = (values.etat_general ?? 4) + (values.etat_mental ?? 4) + (values.activite ?? 4) + (values.mobilite ?? 4) + (values.incontinence ?? 4)
    const sev = s <= 8 ? 'high' : s <= 12 ? 'moderate' : s <= 14 ? 'moderate' : 'low'
    const label = s <= 8 ? 'Risque très élevé' : s <= 12 ? 'Risque élevé' : s <= 14 ? 'Risque modéré' : 'Risque faible'
    return {
      value: s,
      label: `Norton ${s}/20 — ${label}`,
      severity: sev,
      ranges: [
        { min: 15, max: 20, label: 'Risque faible (Norton 15-20)', severity: 'low', recommendation: 'Prévention standard. Surveillance cutanée de routine.' },
        { min: 13, max: 14, label: 'Risque modéré (Norton 13-14)', severity: 'moderate', recommendation: 'Surveillance cutanée rapprochée. Changements de position réguliers. Supports adaptés.' },
        { min: 9, max: 12, label: 'Risque élevé (Norton 9-12)', severity: 'moderate', recommendation: 'Matelas anti-escarre. Mobilisation toutes les 2h. Protection des zones d\'appui. Évaluation diététique.' },
        { min: 5, max: 8, label: 'Risque très élevé (Norton 5-8)', severity: 'high', recommendation: 'Prévention intensive. Matelas à pression alternée. Mobilisation systématique. Surveillance pluriquotidienne. Soins de nursing spécialisés.' },
      ],
    }
  },
  interpretation: `L'échelle de Norton est l'une des premières échelles de risque d'escarre (Doreen Norton, 1962). Elle évalue 5 items notés de 1 (mauvais) à 4 (bon) :

• **État général** : 1-4
• **État mental** : 1-4
• **Activité** : 1-4
• **Mobilité** : 1-4
• **Incontinence** : 1-4

**Score total : 5-20.** Plus le score est bas, plus le risque est élevé.
• 15-20 : risque faible
• 13-14 : risque modéré
• 9-12 : risque élevé
• 5-8 : risque très élevé

**Seuil critique : < 14 = patient à risque.**`,
  clinicalCommentary: `Échelle validée et largement utilisée en gériatrie et soins infirmiers. Simple et rapide (moins de 5 minutes). Plus sensible que spécifique — permet un dépistage large. Attention : les scores intermédiaires (11-14) nécessitent une réévaluation régulière. L'association avec le score de Braden ou Waterlow peut améliorer la prédiction. Réévaluer le risque à chaque changement d'état clinique ou au moins 1x/semaine.`,
  references: [
    { type: 'pubmed', title: 'Norton D et al. An investigation of geriatric nursing problems in hospital. 1962' },
    { type: 'pubmed', title: 'Norton D. Calculating the risk: reflections on the Norton Scale. Decubitus 1989', pmid: '2775477' },
  ],
}
export default norton
