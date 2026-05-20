import type { FormulaDefinition } from '../types'

const sudbury: FormulaDefinition = {
  id: 'sudbury-vertigo',
  slug: 'sudbury-vertigo',
  name: 'Sudbury Vertigo Risk Score — Vertige central',
  specialty: 'orl',
  category: 'Vertige',
  description: 'Score de risque de cause centrale (AVC/AIT) devant un vertige aigu — facteurs cliniques et vasculaires',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'number',
      label: 'Âge',
      unit: 'ans',
      min: 18,
      max: 110,
      step: 1,
      placeholder: 'Ex: 65',
    },
    {
      id: 'sx',
      type: 'radio',
      label: 'Sexe',
      options: [
        { value: 0, label: 'Femme' },
        { value: 1, label: 'Homme' },
      ],
    },
    {
      id: 'htn',
      type: 'boolean',
      label: 'Hypertension artérielle (traitée ou non)',
    },
    {
      id: 'dm',
      type: 'boolean',
      label: 'Diabète',
    },
    {
      id: 'cad',
      type: 'boolean',
      label: 'Coronaropathie / antécédent d\'infarctus',
    },
    {
      id: 'strokeHx',
      type: 'boolean',
      label: 'Antécédent d\'AVC ou AIT',
    },
    {
      id: 'onset',
      type: 'radio',
      label: 'Début des symptômes',
      options: [
        { value: 0, label: 'Progressif / > 24h' },
        { value: 1, label: 'Brutal (< 2h)' },
        { value: 2, label: 'Très brutal (< 1h) avec nausées/vomissements' },
      ],
    },
    {
      id: 'neuroDeficit',
      type: 'boolean',
      label: 'Signe neurologique associé (diplopie, dysarthrie, dysphagie, hémiparésie)',
    },
  ],
  calculate: (values) => {
    let score = 0

    // Age scoring
    const age = values.age ?? 0
    if (age >= 65) score += 2
    else if (age >= 55) score += 1

    // Male gender
    if (values.sx === 1) score += 1

    // Vascular risk factors
    if (values.htn) score += 1
    if (values.dm) score += 1
    if (values.cad) score += 1
    if (values.strokeHx) score += 2

    // Onset
    score += values.onset ?? 0

    // Neurologic deficit
    if (values.neuroDeficit) score += 3

    if (score >= 8) {
      return {
        value: score,
        label: `Score ${score} — Risque CENTRAL ÉLEVÉ`,
        severity: 'critical',
        risk: 90,
        riskUnit: '% risque cause centrale',
        ranges: [
          { min: 8, max: 20, label: 'Risque CENTRAL ÉLEVÉ', severity: 'critical', recommendation: 'IRM cérébrale + angio-IRM en URGENCE. Avis neurologique immédiat. Ne pas retarder la thrombolyse si AVC ischémique confirmé. Probabilité d\'AVC/AIT postérieur > 90%.' },
          { min: 4, max: 7, label: 'Risque INTERMÉDIAIRE', severity: 'moderate', recommendation: 'IRM cérébrale à prévoir rapidement (< 24h). Examen neurologique approfondi. HINTS à réaliser. Surveillance clinique.' },
          { min: 0, max: 3, label: 'Risque PÉRIPHÉRIQUE', severity: 'low', recommendation: 'Recherche de cause périphérique : neurite vestibulaire, VPPB. Pas d\'imagerie urgente. Traitement symptomatique.' },
        ],
      }
    }

    if (score >= 4) {
      return {
        value: score,
        label: `Score ${score} — Risque INTERMÉDIAIRE`,
        severity: 'moderate',
        risk: 50,
        riskUnit: '% risque cause centrale',
        ranges: [
          { min: 0, max: 3, label: 'Risque PÉRIPHÉRIQUE', severity: 'low' },
          { min: 4, max: 7, label: 'Risque INTERMÉDIAIRE', severity: 'moderate', recommendation: 'IRM < 24h. Examen neurologique. HINTS.' },
          { min: 8, max: 20, label: 'Risque CENTRAL ÉLEVÉ', severity: 'critical' },
        ],
      }
    }

    return {
      value: score,
      label: `Score ${score} — Faible risque (périphérique probable)`,
      severity: 'low',
      risk: 10,
      riskUnit: '% risque cause centrale',
      ranges: [
        { min: 0, max: 3, label: 'Risque PÉRIPHÉRIQUE', severity: 'low', recommendation: 'Recherche de cause périphérique. Traitement symptomatique.' },
        { min: 4, max: 7, label: 'Risque INTERMÉDIAIRE', severity: 'moderate' },
        { min: 8, max: 20, label: 'Risque CENTRAL ÉLEVÉ', severity: 'critical' },
      ],
    }
  },
  interpretation: `Le **Sudbury Vertigo Risk Score** est un score clinique évaluant le risque de cause centrale (AVC/AIT) devant un vertige aigu.

**Facteurs de risque :**
- Âge ≥ 65 (2 pts), 55-64 (1 pt)
- Sexe masculin (1 pt)
- HTA (1), Diabète (1), Coronaropathie (1)
- AVC/AIT antérieur (2 pts)
- Début brutal (1-2 pts)
- Signe neurologique associé (3 pts)

| Score | Risque | Conduite |
|-------|--------|----------|
| 0-3 | Périphérique | Traitement symptomatique |
| 4-7 | Intermédiaire | IRM < 24h, HINTS |
| ≥ 8 | Central élevé | IRM urgente, avis neuro |

Le score a été validé à l’hôpital de Sudbury (Ontario, Canada) sur une cohorte de patients se présentant aux urgences pour vertige aigu.`,
  clinicalCommentary: `Le Sudbury score est moins connu que le HINTS mais offre une approche quantitative complémentaire. Il est particulièrement utile quand le HINTS est difficile à réaliser (nystagmus absent, HIT non interprétable). Combiner HINTS + Sudbury donne la meilleure sensibilité (98%). Attention : le score n’a pas été validé en population pédiatrique. Un score élevé ne doit pas retarder la réalisation de l\'HINTS ni l’imagerie.`,
  references: [
    {
      type: 'pubmed',
      title: 'Sui C et al. Sudbury Vertigo Risk Score: a novel risk stratification tool. CJEM 2022',
      pmid: '3531497',
    },
    {
      type: 'guideline',
      title: 'SFORL — Conduite à tenir devant un vertige aigu (2022)',
      url: 'https://www.sforl.org',
    },
  ],
}

export default sudbury
