import type { FormulaDefinition } from '../types'

const jonesraa: FormulaDefinition = {
  id: 'jonesraa',
  slug: 'jonesraa',
  name: 'Jones, RAA (Critères)',
  specialty: 'infectiologie',
  category: 'Rhumatisme articulaire aigu',
  description: 'Critères de Jones révisés (2015) pour le diagnostic du rhumatisme articulaire aigu (RAA).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'cardite',
      type: 'boolean',
      label: 'Cardite clinique ou échographique (valvulite) — Critère MAJEUR',
      weight: 1,
    },
    {
      id: 'arthrite',
      type: 'boolean',
      label: 'Polyarthrite — Critère MAJEUR',
      weight: 1,
    },
    {
      id: 'choree',
      type: 'boolean',
      label: 'Chorée de Sydenham — Critère MAJEUR',
      weight: 1,
    },
    {
      id: 'erytheme',
      type: 'boolean',
      label: 'Érythème marginé — Critère MAJEUR',
      weight: 1,
    },
    {
      id: 'nodules',
      type: 'boolean',
      label: 'Nodules sous-cutanés — Critère MAJEUR',
      weight: 1,
    },
    {
      id: 'fievre',
      type: 'boolean',
      label: 'Fièvre ≥ 38.5°C (ou ≥ 38°C si populations à risque) — Critère MINEUR',
      weight: 1,
    },
    {
      id: 'arthralgies',
      type: 'boolean',
      label: 'Arthralgies (mono-articulaire si populations à risque) — Critère MINEUR',
      weight: 1,
    },
    {
      id: 'vs_crp',
      type: 'boolean',
      label: 'VS > 60 mm/h ou CRP > 30 mg/L — Critère MINEUR',
      weight: 1,
    },
    {
      id: 'pr_long',
      type: 'boolean',
      label: 'PR long (> 200 ms, corrigé de l âge) — Critère MINEUR',
      weight: 1,
    },
    {
      id: 'preuve_strep',
      type: 'boolean',
      label: 'Preuve d infection streptococcique récente (ASLO > 200, culture positive, antigène rapide)',
      weight: 0,
    },
  ],
  calculate: (values) => {
    const majeurs =
      (values.cardite ? 1 : 0) +
      (values.arthrite ? 1 : 0) +
      (values.choree ? 1 : 0) +
      (values.erytheme ? 1 : 0) +
      (values.nodules ? 1 : 0)

    const mineurs =
      (values.fievre ? 1 : 0) +
      (values.arthralgies ? 1 : 0) +
      (values.vs_crp ? 1 : 0) +
      (values.pr_long ? 1 : 0)

    const preuve = values.preuve_strep || false

    let diagnostic = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (preuve && (majeurs >= 2 || (majeurs >= 1 && mineurs >= 2))) {
      diagnostic = 'RAA probable — Critères de Jones remplis'
      severity = 'critical'
      recommendation = 'Confirmer le diagnostic. Hospitalisation. Antibiothérapie (amoxicilline ou pénicilline G). Traitement anti-inflammatoire (aspirine ou AINS ± corticothérapie si cardite sévère). Prévention secondaire : benzathine-pénicilline IM toutes les 3-4 semaines pendant 5 ans minimum (plus si cardite).'
    } else if (majeurs >= 1) {
      diagnostic = 'Critères incomplets — Surveillance'
      severity = 'moderate'
      recommendation = 'Rechercher preuve streptococcique (ASLO, antigène rapide, culture de gorge). Surveillance clinique et échographique. Traitement préventif si forte suspicion épidémiologique.'
    } else {
      diagnostic = 'RAA peu probable'
      severity = 'low'
      recommendation = 'Rechercher autre diagnostic différentiel (arthrite juvénile idiopathique, lupus, leucémie, endocardite infectieuse).'
    }

    return {
      value: majeurs * 10 + mineurs,
      label: diagnostic,
      severity,
      details: {
        'Critères majeurs': `${majeurs}/5`,
        'Critères mineurs': `${mineurs}/4`,
        'Preuve streptococcique': preuve ? 'Oui' : 'Non',
        'Diagnostic': diagnostic,
      },
      ranges: [
        { min: 0, max: 5, label: 'RAA peu probable', severity: 'low', recommendation: 'Rechercher diagnostic alternatif. Si suspicion persiste, répéter ASLO à 2-3 semaines.' },
        { min: 6, max: 20, label: 'RAA possible — critères incomplets', severity: 'moderate', recommendation: 'Surveillance. Preuve streptococcique nécessaire. Échographie cardiaque systématique.' },
        { min: 21, max: 50, label: 'RAA probable', severity: 'critical', recommendation: 'Traitement curatif + prévention secondaire. Cardite: corticothérapie. Arthrite: aspirine/AINS. Chorée: valproate ou carbamazépine.' },
      ],
    }
  },
  interpretation: `Les **critères de Jones révisés (2015)** sont la référence pour le diagnostic du rhumatisme articulaire aigu (RAA). Le diagnostic nécessite la preuve d une infection streptococcique récente + soit 2 critères majeurs, soit 1 critère majeur + 2 critères mineurs.

**Critères majeurs (5) :**
- Cardite (clinique ou échographique)
- Polyarthrite
- Chorée de Sydenham
- Érythème marginé
- Nodules sous-cutanés

**Critères mineurs (4) :**
- Fièvre ≥ 38.5°C
- Arthralgies
- Syndrome inflammatoire (VS/CRP élevées)
- PR long à l ECG`,
  clinicalCommentary: `La prévention secondaire par benzathine-pénicilline IM toutes les 3-4 semaines est fondamentale pour éviter les récidives et l aggravation des valvulopathies. La durée de la prévention dépend de l atteinte cardiaque : 5 ans si absente, 10 ans si légère, à vie si sévère (prothèse). L échographie cardiaque est systématique devant toute suspicion de RAA. La chorée peut apparaître jusqu à 6 mois après l infection streptococcique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Gewitz MH et al. Revision of the Jones Criteria for the diagnosis of acute rheumatic fever. Circulation 2015',
      pmid: '25908771',
    },
    {
      type: 'guideline',
      title: 'WHO — Rheumatic fever and rheumatic heart disease (Technical report 2021)',
      url: 'https://www.who.int',
    },
  ],
}
export default jonesraa
