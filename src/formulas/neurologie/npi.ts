import type { FormulaDefinition } from '../types'

const npi: FormulaDefinition = {
  id: 'npi',
  slug: 'npi',
  name: 'NPI — Neuropsychiatric Inventory (Inventaire Neuropsychiatrique)',
  specialty: 'neurologie',
  category: 'Neuropsychologie',
  description: 'Évaluation des troubles neuropsychiatriques chez les patients avec pathologie neurologique ou démence (12 domaines, scores fréquence × sévérité)',
  version: '2024',
  lastValidated: '2024-02',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'delires',
      type: 'radio',
      label: 'DÉLIRES — Le patient a-t-il des croyances fausses ?',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger (croit, pas perturbant)' },
        { value: 6, label: '6 — Modéré (croit, perturbant)' },
        { value: 12, label: '12 — Sévère (très perturbant)' },
      ],
    },
    {
      id: 'hallucinations',
      type: 'radio',
      label: 'HALLUCINATIONS — Voir, entendre ou sentir des choses inexistantes',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'agitation',
      type: 'radio',
      label: 'AGITATION / AGRESSIVITÉ — Résistance aux soins, crises de colère',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'depression',
      type: 'radio',
      label: 'DÉPRESSION / DYSPHORIE — Tristesse, pleurs, découragement',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'anxiete',
      type: 'radio',
      label: 'ANXIÉTÉ — Nervosité, peur, évitement',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'euphorie',
      type: 'radio',
      label: 'EUPHORIE / EXALTATION — Humeur anormalement élevée',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'apathie',
      type: 'radio',
      label: 'APATHIE / INDIFFÉRENCE — Perte d\'intérêt, manque de motivation',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'desinhibition',
      type: 'radio',
      label: 'DÉSINHIBITION — Comportements impulsifs, inappropriés',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'irritabilite',
      type: 'radio',
      label: 'IRRITABILITÉ / INSTABILITÉ — Sautes d\'humeur, impatience',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'comportement_moteur',
      type: 'radio',
      label: 'COMPORTEMENT MOTEUR ABERRANT — Déambulation, agitation motrice',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'sommeil',
      type: 'radio',
      label: 'SOMMEIL / TROUBLES NOCTURNES — Difficultés d\'endormissement, éveils',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
    {
      id: 'appetit',
      type: 'radio',
      label: 'APPÉTIT / TROUBLES ALIMENTAIRES — Perte/gain poids, changement alimentaire',
      options: [
        { value: 0, label: '0 — Absent' },
        { value: 2, label: '2 — Léger' },
        { value: 6, label: '6 — Modéré' },
        { value: 12, label: '12 — Sévère' },
      ],
    },
  ],
  calculate: (values) => {
    const domaines = ['delires', 'hallucinations', 'agitation', 'depression', 'anxiete', 'euphorie', 'apathie', 'desinhibition', 'irritabilite', 'comportement_moteur', 'sommeil', 'appetit']
    const scores = domaines.map(id => values[id] ?? 0)
    const total = scores.reduce((a, b) => a + b, 0)
    const nbDomainesPositifs = scores.filter(s => s > 0).length

    const severity = total <= 2 ? 'low' : total <= 12 ? 'moderate' : total <= 36 ? 'high' : 'critical'

    return {
      value: total,
      label: `NPI total: ${total} (${nbDomainesPositifs}/12 domaines présents)`,
      severity,
      details: { total_npi: total, domaines_presents: nbDomainesPositifs },
      ranges: [
        { min: 0, max: 2, label: 'NPI normal — pas de trouble neuropsychiatrique', severity: 'low', recommendation: 'Absence de trouble neuropsychiatrique significatif.' },
        { min: 3, max: 12, label: 'Troubles légers', severity: 'moderate', recommendation: 'Surveillance. Interventions non médicamenteuses (stimulation cognitive, activités sociales).' },
        { min: 13, max: 36, label: 'Troubles modérés', severity: 'high', recommendation: 'Prise en charge médicamenteuse et non médicamenteuse. Avis gériatrique/neurologique. Adaptation de l\'environnement.' },
        { min: 37, max: 144, label: 'Troubles sévères', severity: 'critical', recommendation: 'Prise en charge spécialisée urgente. Hospitalisation si danger. Traitement antipsychotique à discuter (risque bénéfice). Accompagnement de l\'aidant.' },
      ],
    }
  },
  interpretation: `Le **NPI** (Neuropsychiatric Inventory) de Cummings est l’outil de référence pour l\'évaluation des troubles neuropsychiatriques dans les démences et les pathologies neurologiques.

**12 domaines évalués auprès de l\'aidant :**
1. Idées délirantes
2. Hallucinations
3. Agitation/Agressivité
4. Dépression/Dysphorie
5. Anxiété
6. Euphorie/Exaltation
7. Apathie/Indifférence
8. Désinhibition
9. Irritabilité/Instabilité
10. Comportement moteur aberrant
11. Sommeil
12. Appétit/Troubles alimentaires

Chaque domaine est scoré en fréquence (1–4) × sévérité (1–3) = score (1–12).

**Score total :** 0–144. Plus le score est élevé, plus les troubles neuropsychiatriques sont sévères. L\'apathie est le symptôme le plus fréquent dans les démences.`,
  clinicalCommentary: `Le NPI est essentiel en consultation mémoire et dans le suivi des démences. Il est administré à l’aidant (pas au patient). Le NPI permet de différencier les profils : Alzheimer (surtout apathie), DFT (désinhibition, euphorie, apathie), DCL (hallucinations visuelles). L\'apathie est le symptôme le plus fréquent mais aussi le plus sous-diagnostiqué. Les troubles neuropsychiatriques sont plus prédictifs du fardeau de l\'aidant que les troubles cognitifs eux-mêmes. Version courte (NPI-Q) disponible.`,
  references: [
    {
      type: 'pubmed',
      title: 'Cummings JL et al. The Neuropsychiatric Inventory: comprehensive assessment of psychopathology in dementia. Neurology 1994',
      pmid: '7968090',
    },
    {
      type: 'pubmed',
      title: 'Kaufer DI et al. Validation of the NPI-Q: a brief clinical form of the Neuropsychiatric Inventory. J Neuropsychiatry Clin Neurosci 2000',
      pmid: '11078577',
    },
  ],
}

export default npi
