import type { FormulaDefinition } from '../types'

const hscore: FormulaDefinition = {
  id: 'hscore', slug: 'hscore',
  name: 'H Score — Évaluation Psychosomatique (Score H)',
  specialty: 'psychiatrie', category: 'Psychosomatique',
  description: 'H Score — évaluation des symptômes psychosomatiques et de la somatisation. Outil de dépistage des troubles somatoformes basé sur plusieurs dimensions : anxiété somatique, dépression somatique, plaintes physiques multiples. Score total interprété selon des seuils de gravité.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'fatigue_chronique', type: 'boolean', label: 'Fatigue chronique (> 3 mois) sans cause organique retrouvée', weight: 1 },
    { id: 'douleurs_diffuses', type: 'boolean', label: 'Douleurs diffuses ou multiples (≥ 3 sites) sans étiologie objectivable', weight: 1 },
    { id: 'troubles_sommeil', type: 'boolean', label: 'Troubles du sommeil sévères (insomnie, hypersomnie) avec retentissement diurne', weight: 1 },
    { id: 'anxiete_somatique', type: 'boolean', label: 'Anxiété somatique (palpitations, sueurs, tremblements, oppression thoracique, dyspnée)', weight: 1 },
    { id: 'symptomes_conversion', type: 'boolean', label: 'Symptômes de conversion (motricité, sensibilité, crises pseudo-épileptiques, cécité fonctionnelle)', weight: 2 },
    { id: 'hypocondrie', type: 'boolean', label: 'Préoccupation hypocondriaque (crainte ou conviction d\'avoir une maladie grave)', weight: 1 },
    { id: 'antecedents_trauma', type: 'boolean', label: 'Antécédents de traumatismes (physiques, sexuels, psychologiques) dans l\'enfance ou l\'âge adulte', weight: 1 },
    { id: 'errance_diagnostic', type: 'boolean', label: 'Errance diagnostique ou multiplicité des consultations (≥ 3 spécialistes consultés)', weight: 1 },
    { id: 'depression_atypique', type: 'boolean', label: 'Symptômes dépressifs atypiques (hyperphagie, hypersomnie, fatigue extrême, rejet émotionnel)', weight: 1 },
    { id: 'alexithymie', type: 'boolean', label: 'Difficulté à identifier et exprimer les émotions (alexithymie)', weight: 1 },
    { id: 'de_realisation', type: 'boolean', label: 'Symptômes dissociatifs (déjà-vu, déréalisation, dépersonnalisation)', weight: 1 },
    { id: 'symptomes_fonctionnels', type: 'boolean', label: 'Symptômes fonctionnels multiples (côlon irritable, fibromyalgie, céphalées de tension, fatigue chronique)', weight: 1 },
  ],
  calculate: (values) => {
    const items: Record<string, number> = {}
    const itemLabels: Record<string, string> = {
      fatigue_chronique: 'Fatigue chronique (> 3 mois)',
      douleurs_diffuses: 'Douleurs diffuses/multiples',
      troubles_sommeil: 'Troubles du sommeil sévères',
      anxiete_somatique: 'Anxiété somatique',
      symptomes_conversion: 'Symptômes de conversion',
      hypocondrie: 'Préoccupation hypocondriaque',
      antecedents_trauma: 'Antécédents traumatiques',
      errance_diagnostic: 'Errance diagnostique',
      depression_atypique: 'Dépression atypique',
      alexithymie: 'Alexithymie',
      de_realisation: 'Symptômes dissociatifs',
      symptomes_fonctionnels: 'Symptômes fonctionnels multiples',
    }

    // Items with weight 2 (symptomes_conversion) and weight 1 (others)
    items.fatigue_chronique = values.fatigue_chronique ? 1 : 0
    items.douleurs_diffuses = values.douleurs_diffuses ? 1 : 0
    items.troubles_sommeil = values.troubles_sommeil ? 1 : 0
    items.anxiete_somatique = values.anxiete_somatique ? 1 : 0
    items.symptomes_conversion = values.symptomes_conversion ? 2 : 0
    items.hypocondrie = values.hypocondrie ? 1 : 0
    items.antecedents_trauma = values.antecedents_trauma ? 1 : 0
    items.errance_diagnostic = values.errance_diagnostic ? 1 : 0
    items.depression_atypique = values.depression_atypique ? 1 : 0
    items.alexithymie = values.alexithymie ? 1 : 0
    items.de_realisation = values.de_realisation ? 1 : 0
    items.symptomes_fonctionnels = values.symptomes_fonctionnels ? 1 : 0

    const score = Object.values(items).reduce((a, b) => a + b, 0)

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 2) {
      label = `H Score ${score}/13 — Faible probabilité de trouble somatoforme`
      severity = 'low'
      recommendation = 'Peu d\'éléments en faveur d\'un trouble somatoforme. Rechercher une pathologie organique si symptômes persistants. Surveillance.'
    } else if (score <= 4) {
      label = `H Score ${score}/13 — Probabilité modérée de trouble somatoforme`
      severity = 'low'
      recommendation = 'Quelques éléments évocateurs. Évaluation clinique complémentaire. Bilan somatique minimum (NFS, CRP, TSH). Réévaluation.'
    } else if (score <= 7) {
      label = `H Score ${score}/13 — Probabilité élevée de trouble somatoforme`
      severity = 'moderate'
      recommendation = 'Suspicion de trouble somatoforme ou somatisation. Évaluation psychiatrique spécialisée. TCC (thérapie cognitivo-comportementale). Éviter les examens complémentaires invasifs répétés.'
    } else if (score <= 10) {
      label = `H Score ${score}/13 — Probabilité très élevée de trouble somatoforme`
      severity = 'high'
      recommendation = 'Trouble somatoforme probable. Prise en charge psychiatrique. Thérapie cognitivo-comportementale. Traitement antidépresseur si comorbidité dépressive. Éviter les examens complémentaires non justifiés.'
    } else {
      label = `H Score ${score}/13 — Somatisation sévère`
      severity = 'critical'
      recommendation = 'Somatisation sévère avec retentissement fonctionnel important. Hospitalisation en psychiatrie si nécessaire. Prise en charge pluridisciplinaire (psychiatre, médecin traitant, kinésithérapeute). Traitement antidépresseur si indiqué.'
    }

    // Build details
    const details: Record<string, string | number | undefined> = {}
    for (const [key, val] of Object.entries(items)) {
      details[itemLabels[key]] = val > 0 ? `Oui (${val})` : 'Non'
    }
    details['Score H total'] = `${score}/13`

    return {
      value: score,
      label,
      severity,
      recommendation,
      details,
      ranges: [
        { min: 0, max: 2, label: '0-2 — Faible probabilité', severity: 'low', recommendation: 'Surveillance.' },
        { min: 3, max: 4, label: '3-4 — Probabilité modérée', severity: 'low', recommendation: 'Évaluation.' },
        { min: 5, max: 7, label: '5-7 — Probabilité élevée', severity: 'moderate', recommendation: 'Évaluation psychiatrique.' },
        { min: 8, max: 10, label: '8-10 — Très élevée', severity: 'high', recommendation: 'Prise en charge psychiatrique.' },
        { min: 11, max: 13, label: '11-13 — Somatisation sévère', severity: 'critical', recommendation: 'Hospitalisation si nécessaire.' },
      ],
    }
  },
  interpretation: `**H Score — Évaluation des Symptômes Psychosomatiques**

Score de dépistage des troubles somatoformes et de la somatisation. 12 items explorant plusieurs dimensions :

**Dimensions cliniques explorées :**
1. **Plaintes somatiques** : fatigue chronique, douleurs diffuses
2. **Anxiété somatisée** : anxiété somatique, hypocondrie
3. **Troubles de conversion** : symptômes neurologiques fonctionnels
4. **Traumatismes antérieurs** : antécédents de traumatismes
5. **Comorbidités psychiatriques** : dépression atypique, dissociation
6. **Profil psychologique** : alexithymie, errance diagnostique

**Seuils :**
- **≤ 2** : Faible probabilité
- **3-4** : Probabilité modérée
- **5-7** : Probabilité élevée
- **8-10** : Très élevée
- **≥ 11** : Somatisation sévère`,
  clinicalCommentary: 'Les troubles somatoformes sont fréquents en médecine générale et aux urgences (10-30% des consultations). Le H Score est un outil de dépistage non validé formellement mais utile pour sensibiliser au diagnostic. Le diagnostic de trouble somatoforme (DSM-5 : trouble à symptomatologie somatique) nécessite des critères précis : durée ≥ 6 mois, symptômes multiples, retentissement fonctionnel, absence de pathologie organique après bilan approprié. La TCC, la psychothérapie psychodynamique et les antidépresseurs sont les traitements de référence.',
  references: [
    { type: 'pubmed', title: 'Barsky AJ, Borus JF. Functional somatic syndromes. Ann Intern Med 1999', pmid: '10210661' },
    { type: 'pubmed', title: 'Wessely S et al. Functional somatic syndromes: one or many? Lancet 1999', pmid: '10523904' },
    { type: 'guideline', title: 'HAS — Syndrome de fatigue chronique', url: 'https://www.has-sante.fr/' },
  ],
}
export default hscore
