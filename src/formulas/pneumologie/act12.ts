import type { FormulaDefinition } from '../types'

const act12: FormulaDefinition = {
  id: 'act12',
  slug: 'act12',
  name: 'Asthma Control Test (ACT) — Test de contrôle de l\'asthme',
  specialty: 'pneumologie',
  category: 'Asthme',
  description: 'Questionnaire d\'évaluation du contrôle de l\'asthme chez le patient de 12 ans et plus (score 5–25)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'q1_frequence',
      type: 'radio',
      label: 'Au cours des 4 dernières semaines, votre asthme vous a-t-il gêné dans vos activités professionnelles, scolaires ou domestiques ?',
      options: [
        { value: 1, label: '1 — Tout le temps' },
        { value: 2, label: '2 — Très souvent' },
        { value: 3, label: '3 — Parfois' },
        { value: 4, label: '4 — Rarement' },
        { value: 5, label: '5 — Jamais' },
      ],
    },
    {
      id: 'q2_dyspnee',
      type: 'radio',
      label: 'Au cours des 4 dernières semaines, avez-vous ressenti un essoufflement ?',
      options: [
        { value: 1, label: '1 — Plus d\'une fois par jour' },
        { value: 2, label: '2 — Une fois par jour' },
        { value: 3, label: '3 — 3 à 6 fois par semaine' },
        { value: 4, label: '4 — 1 à 2 fois par semaine' },
        { value: 5, label: '5 — Pas du tout' },
      ],
    },
    {
      id: 'q3_reveil',
      type: 'radio',
      label: 'Au cours des 4 dernières semaines, vous êtes-vous réveillé(e) la nuit à cause de votre asthme (toux, essoufflement) ?',
      options: [
        { value: 1, label: '1 — 4 nuits ou plus par semaine' },
        { value: 2, label: '2 — 2 à 3 nuits par semaine' },
        { value: 3, label: '3 — 1 nuit par semaine' },
        { value: 4, label: '4 — 1 à 2 nuits par mois' },
        { value: 5, label: '5 — Pas du tout' },
      ],
    },
    {
      id: 'q4_traitement',
      type: 'radio',
      label: 'Au cours des 4 dernières semaines, avez-vous utilisé votre bronchodilatateur de secours ?',
      options: [
        { value: 1, label: '1 — ≥ 3 fois par jour' },
        { value: 2, label: '2 — 1 à 2 fois par jour' },
        { value: 3, label: '3 — 2 à 3 fois par semaine' },
        { value: 4, label: '4 — 1 fois par semaine ou moins' },
        { value: 5, label: '5 — Pas du tout' },
      ],
    },
    {
      id: 'q5_controle',
      type: 'radio',
      label: 'Comment évalueriez-vous votre contrôle de l\'asthme au cours des 4 dernières semaines ?',
      options: [
        { value: 1, label: '1 — Pas contrôlé du tout' },
        { value: 2, label: '2 — Très mal contrôlé' },
        { value: 3, label: '3 — Un peu contrôlé' },
        { value: 4, label: '4 — Bien contrôlé' },
        { value: 5, label: '5 — Totalement contrôlé' },
      ],
    },
  ],
  calculate: (values) => {
    const q1 = values.q1_frequence ?? 1
    const q2 = values.q2_dyspnee ?? 1
    const q3 = values.q3_reveil ?? 1
    const q4 = values.q4_traitement ?? 1
    const q5 = values.q5_controle ?? 1

    const total = q1 + q2 + q3 + q4 + q5

    const severity = total >= 20 ? 'low' : total >= 16 ? 'moderate' : total >= 12 ? 'high' : 'critical'

    const label = total >= 20 ? 'Asthme BIEN contrôlé' :
      total >= 16 ? 'Asthme PARTIELLEMENT contrôlé' :
      total >= 12 ? 'Asthme NON contrôlé' :
      'Asthme TRÈS MAL contrôlé'

    return {
      value: total,
      label,
      severity,
      details: { ACT_total: total, gêne_activités: q1, essoufflement: q2, réveils_nocturnes: q3, bronchodilatateur: q4, auto_évaluation: q5 },
      ranges: [
        { min: 20, max: 25, label: 'ACT ≥ 20 — Asthme bien contrôlé', severity: 'low', recommendation: 'Contrôle optimal. Maintien du traitement de fond. Surveillance standard tous les 3–6 mois.' },
        { min: 16, max: 19, label: 'ACT 16–19 — Asthme partiellement contrôlé', severity: 'moderate', recommendation: 'Contrôle insuffisant. Réévaluer le traitement de fond : augmentation de palier thérapeutique (GINA). Vérifier l\'observance et la technique d\'inhalation. Traiter les comorbidités (RGO, rhinite).' },
        { min: 12, max: 15, label: 'ACT 12–15 — Asthme non contrôlé', severity: 'high', recommendation: 'Contrôle mauvais. Optimisation thérapeutique urgente (palier GINA 4–5). Bilan spécialisé. Recherche de facteurs aggravants (tabac, allergènes, aspergillose). Discuter biothérapie si asthme sévère.' },
        { min: 5, max: 11, label: 'ACT 5–11 — Asthme très mal contrôlé', severity: 'critical', recommendation: 'URGENCE — Asthme sévère non contrôlé. Consultation spécialisée urgente. Hospitalisation à discuter. Optimisation du traitement (CSI+LABA, corticothérapie orale, biothérapie). Bilan fonctionnel respiratoire complet. Éducation thérapeutique intensive.' },
      ],
    }
  },
  interpretation: `L'**Asthma Control Test (ACT)** est un auto-questionnaire de 5 questions validé pour évaluer le contrôle de l’asthme chez l'adulte et l'adolescent (≥ 12 ans) sur les 4 dernières semaines.

**Score : 5–25** (chaque question de 1 à 5).
- **≥ 20** : asthme bien contrôlé
- **16–19** : partiellement contrôlé
- **≤ 15** : non contrôlé

L'ACT est un outil essentiel pour le suivi : il permet d’objectiver le contrôle et d'ajuster le traitement selon la stratégie GINA. Une amélioration de 3 points est cliniquement significative.`,
  clinicalCommentary: `L'ACT est systématique à chaque consultation d’asthme. Complémentaire des EFR (VEMS). Un ACT < 20 doit faire vérifier l’observance et la technique d'inhalation avant d’augmenter le traitement. L'ACT est sensible au changement (utile pour le suivi). Attention : un ACT normal n'élimine pas un asthme sévère sous traitement lourd. L'ACT enfant (C-ACT) est validé pour les 4–11 ans.`,
  references: [
    {
      type: 'pubmed',
      title: 'Nathan RA et al. Development of the asthma control test: a survey for assessing asthma control. J Allergy Clin Immunol 2004',
      pmid: '14966296',
    },
    {
      type: 'guideline',
      title: 'GINA 2024 — Global Strategy for Asthma Management and Prevention',
      url: 'https://ginasthma.org',
    },
  ],
}

export default act12
