import type { FormulaDefinition } from '../types'

const fssfatigue: FormulaDefinition = {
  id: 'fssfatigue', slug: 'fssfatigue',
  name: 'FSS (Fatigue Severity Scale) — Échelle de Sévérité de la Fatigue',
  specialty: 'psychiatrie', category: 'Évaluation',
  description: 'Fatigue Severity Scale (FSS) — échelle validée d\'évaluation de la fatigue dans les pathologies médicales et psychiatriques (SEP, fibromyalgie, dépression, fatigue chronique). 9 items cotés de 1 (pas d\'accord) à 7 (tout à fait d\'accord), score total /9.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'q1', type: 'radio', label: '1. Ma motivation est diminuée quand je suis fatigué(e)', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q2', type: 'radio', label: '2. L\'exercice physique provoque ma fatigue', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q3', type: 'radio', label: '3. Je suis facilement fatigué(e)', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q4', type: 'radio', label: '4. La fatigue interfère avec mon fonctionnement physique', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q5', type: 'radio', label: '5. La fatigue me cause fréquemment des problèmes', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q6', type: 'radio', label: '6. Ma fatigue empêche un fonctionnement physique soutenu', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q7', type: 'radio', label: '7. La fatigue interfère avec l\'accomplissement de certaines tâches et responsabilités', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q8', type: 'radio', label: '8. La fatigue est parmi mes trois symptômes les plus invalidants', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
    { id: 'q9', type: 'radio', label: '9. La fatigue interfère avec mon travail, ma famille ou ma vie sociale', options: [
      { value: 1, label: '1 — Pas du tout d\'accord' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4 — Neutre' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7 — Tout à fait d\'accord' },
    ]},
  ],
  calculate: (values) => {
    const q1 = Number(values.q1) || 1
    const q2 = Number(values.q2) || 1
    const q3 = Number(values.q3) || 1
    const q4 = Number(values.q4) || 1
    const q5 = Number(values.q5) || 1
    const q6 = Number(values.q6) || 1
    const q7 = Number(values.q7) || 1
    const q8 = Number(values.q8) || 1
    const q9 = Number(values.q9) || 1

    const total = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9
    const mean = total / 9

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (mean < 3) {
      label = `FSS ${mean.toFixed(1)}/7 — Fatigue légère (pas de fatigue significative)`
      severity = 'low'
      recommendation = 'Absence de fatigue cliniquement significative. Poursuivre les activités habituelles. Étiologie organique peu probable comme cause de fatigue.'
    } else if (mean < 4) {
      label = `FSS ${mean.toFixed(1)}/7 — Fatigue légère à modérée`
      severity = 'low'
      recommendation = 'Fatigue légère à modérée. Bilan étiologique simple (NFS, CRP, TSH, ferritine, vitamine B12). Gestion non médicamenteuse : activité physique adaptée, hygiène de sommeil, gestion du stress.'
    } else if (mean < 5) {
      label = `FSS ${mean.toFixed(1)}/7 — Fatigue modérée`
      severity = 'moderate'
      recommendation = 'Fatigue modérée avec retentissement fonctionnel. Bilan étiologique complet. Rechercher une cause organique (anémie, hypothyroïdie, syndrome d\'apnée du sommeil, dépression, fibromyalgie). Traitement symptomatique.'
    } else if (mean < 6) {
      label = `FSS ${mean.toFixed(1)}/7 — Fatigue sévère`
      severity = 'high'
      recommendation = 'Fatigue sévère. Bilan étiologique approfondi. Consultation spécialisée (médecine interne, neurologie, psychiatrie). Prise en charge pluridisciplinaire. Arrêt de travail possible.'
    } else {
      label = `FSS ${mean.toFixed(1)}/7 — Fatigue très sévère (invalidante)`
      severity = 'critical'
      recommendation = 'Fatigue très sévère invalidante. Hospitalisation si nécessaire. Bilan étiologique exhaustif. Prise en charge pluridisciplinaire. Traitement de la pathologie sous-jacente. Réadaptation fonctionnelle.'
    }

    return {
      value: Math.round(mean * 10) / 10,
      label,
      severity,
      recommendation,
      details: {
        'Q1 — Motivation diminuée': `${q1}/7`,
        'Q2 — Exercice provoque fatigue': `${q2}/7`,
        'Q3 — Facilement fatigué': `${q3}/7`,
        'Q4 — Interfère fonctionnement physique': `${q4}/7`,
        'Q5 — Problèmes fréquents': `${q5}/7`,
        'Q6 — Empêche fonctionnement soutenu': `${q6}/7`,
        'Q7 — Interfère tâches': `${q7}/7`,
        'Q8 — Parmi 3 symptômes invalidants': `${q8}/7`,
        'Q9 — Interfère travail/vie sociale': `${q9}/7`,
        'Score total': `${total}/63`,
        'Moyenne FSS': `${mean.toFixed(1)}/7`,
      },
      ranges: [
        { min: 0, max: 2.9, label: '< 3 — Fatigue légère', severity: 'low', recommendation: 'Pas de fatigue significative.' },
        { min: 3, max: 3.9, label: '3-3.9 — Légère à modérée', severity: 'low', recommendation: 'Bilan simple.' },
        { min: 4, max: 4.9, label: '4-4.9 — Modérée', severity: 'moderate', recommendation: 'Bilan étiologique complet.' },
        { min: 5, max: 5.9, label: '5-5.9 — Sévère', severity: 'high', recommendation: 'Consultation spécialisée.' },
        { min: 6, max: 7, label: '6-7 — Très sévère', severity: 'critical', recommendation: 'Prise en charge pluridisciplinaire.' },
      ],
    }
  },
  interpretation: `**FSS — Fatigue Severity Scale (Krupp 1989)**

Échelle validée de mesure de la fatigue, initialement développée pour la sclérose en plaques (SEP) mais largement utilisée dans de nombreuses pathologies.

**9 items** cotés de 1 (pas d\'accord) à 7 (tout à fait d\'accord).
**Score** = moyenne des 9 items (score total / 9).

**Seuils d\'interprétation :**
- **< 3** : Fatigue légère (non significative cliniquement)
- **3-4** : Fatigue légère à modérée
- **4-5** : Fatigue modérée
- **5-6** : Fatigue sévère
- **6-7** : Fatigue très sévère (invalidante)

**Seuil pathologique usuel :** ≥ 4 (fatigue cliniquement significative).
**SPÉCIFICITÉ :** La FSS mesure la fatigue, pas son étiologie.

**Pathologies associées :** SEP (90%), fibromyalgie, fatigue chronique, dépression, lupus, polyarthrite rhumatoïde, cancer, post-COVID.`,
  clinicalCommentary: 'La FSS est l\'échelle de fatigue la plus utilisée en recherche clinique. Le seuil de 4 (moyenne ≥ 4) est généralement considéré comme le seuil de fatigue cliniquement significative. Elle a été validée dans la SEP, la fatigue chronique, la fibromyalgie, la dépression et le post-COVID. Attention : la FSS évalue l\'impact fonctionnel de la fatigue, pas sa cause. Le diagnostic différentiel de la fatigue chronique inclut : anémie, hypothyroïdie, syndrome d\'apnée du sommeil, dépression, fibromyalgie, syndrome de fatigue chronique, cancer, maladies auto-immunes, infections chroniques.',
  references: [
    { type: 'pubmed', title: 'Krupp LB et al. The Fatigue Severity Scale. Application to patients with multiple sclerosis and systemic lupus erythematosus. Arch Neurol 1989', pmid: '2730574' },
    { type: 'pubmed', title: 'Valko PO et al. Validation of the fatigue severity scale in a Swiss cohort. Sleep 2008', pmid: '18853938' },
    { type: 'guideline', title: 'HAS — Syndrome de fatigue chronique', url: 'https://www.has-sante.fr/' },
  ],
}
export default fssfatigue
