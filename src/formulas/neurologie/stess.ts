import type { FormulaDefinition } from '../types'

const stess: FormulaDefinition = {
  id: 'stess',
  slug: 'stess',
  name: 'STESS — Status Epilepticus Severity Score',
  specialty: 'neurologie',
  category: 'Épilepsie',
  description: 'Score pronostique de mortalité dans l\'état de mal épileptique (score 0–6)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'conscience',
      type: 'radio',
      label: 'Niveau de conscience avant la crise (antécédent)',
      options: [
        { value: 1, label: '1 — Altération de la conscience (sommeil, coma, confusion chronique)' },
        { value: 0, label: '0 — Conscience normale' },
      ],
    },
    {
      id: 'severite_crise',
      type: 'radio',
      label: 'Type de crise le plus sévère',
      options: [
        { value: 1, label: '1 — Crise généralisée convulsive / tonico-clonique' },
        { value: 0, label: '0 — Crise non convulsive (absence, partielle complexe, myoclonique)' },
      ],
    },
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 2, label: '≥ 65 ans' },
        { value: 0, label: '< 65 ans' },
      ],
    },
    {
      id: 'antiepileptiques',
      type: 'radio',
      label: 'Antécédent de crises épileptiques avant l\'état de mal',
      options: [
        { value: 1, label: '1 — Pas d\'antécédent de crise (première crise)' },
        { value: 0, label: '0 — Antécédent de crises connu (épilepsie connue)' },
      ],
    },
  ],
  calculate: (values) => {
    const conscience = values.conscience ?? 0
    const severiteCrise = values.severite_crise ?? 0
    const age = values.age ?? 0
    const antiepileptiques = values.antiepileptiques ?? 0

    const total = conscience + severiteCrise + age + antiepileptiques

    const mortality = total <= 2 ? 3 : total === 3 ? 8 : total === 4 ? 11 : total >= 5 ? 24 : 0

    const severity = total <= 2 ? 'low' : total === 3 ? 'moderate' : total === 4 ? 'high' : 'critical'

    const label = total <= 2 ? 'STESS faible — bon pronostic' :
      total === 3 ? 'STESS intermédiaire' :
      total >= 4 ? 'STESS élevé — pronostic réservé' : ''

    return {
      value: total,
      label,
      risk: mortality,
      riskUnit: '% mortalité hospitalière estimée',
      severity,
      details: { STESS_total: total, conscience_préexistante: conscience ? 'Oui' : 'Non', crise_TCG: severiteCrise ? 'Oui' : 'Non', âge_65plus: age ? 'Oui' : 'Non', première_crise: antiepileptiques ? 'Oui' : 'Non' },
      ranges: [
        { min: 0, max: 2, label: 'STESS 0–2 — Faible risque', severity: 'low', recommendation: 'Mortalité < 5%. Surveillance standard. Traitement antiépileptique de première ligne (benzodiazépine puis antiépileptique IV). Bilan étiologique adapté.' },
        { min: 3, max: 3, label: 'STESS 3 — Risque intermédiaire', severity: 'moderate', recommendation: 'Mortalité ≈ 8%. Hospitalisation en neurologie ou réanimation selon le terrain. Surveillance EEG si non-récupération rapide.' },
        { min: 4, max: 4, label: 'STESS 4 — Risque élevé', severity: 'high', recommendation: 'Mortalité ≈ 11%. Hospitalisation en réanimation. Traitement agressif précoce. Surveillance EEG continue. Bilan étiologique urgent.' },
        { min: 5, max: 6, label: 'STESS 5–6 — Risque très élevé', severity: 'critical', recommendation: 'Mortalité ≈ 24%. Réanimation neurologique. Anesthésie générale si réfractaire. EEG continu. Monitorage hémodynamique. Pronostic vital engagé.' },
      ],
    }
  },
  interpretation: `Le **STESS** (Status Epilepticus Severity Score) est un score clinique simple pour évaluer le pronostic de mortalité dans l'état de mal épileptique (EME).

**4 items :**
1. Altération préexistante de la conscience (sommeil, confusion, coma) : 1 pt
2. Crise convulsive généralisée (tonico-clonique) : 1 pt
3. Âge ≥ 65 ans : 2 pts
4. Pas d’antécédent de crise épileptique (première crise) : 1 pt

**Score : 0–6.**
- 0–2 : faible risque (mortalité 3%)
- 3 : risque intermédiaire (mortalité 8%)
- 4 : risque élevé (mortalité 11%)
- 5–6 : risque très élevé (mortalité 24%)

Le STESS est validé pour prédire la mortalité hospitalière. Un score ≥ 3 est un facteur de risque d'évolution vers un EME réfractaire.`,
  clinicalCommentary: `Le STESS est utile aux urgences et en réanimation pour évaluer rapidement le pronostic d'un état de mal épileptique. Attention : le STESS ne prédit pas la réponse au traitement. Les facteurs de risque d’EME réfractaire sont : STESS ≥ 3, étiologie aiguë sévère (encéphalite, AVC, tumeur), âge avancé, et délai de traitement > 1h. Ne pas retarder la prise en charge thérapeutique en attendant le score. L'EEG est indispensable si le patient ne récupère pas rapidement la conscience.`,
  references: [
    {
      type: 'pubmed',
      title: 'Rossetti AO et al. Status Epilepticus Severity Score (STESS): a tool to orient early treatment strategy. J Neurol 2008',
      pmid: '18853127',
    },
    {
      type: 'pubmed',
      title: 'Rossetti AO et al. Predicting outcome in status epilepticus: a comparison between two severity scores. Epilepsia 2009',
      pmid: '19236436',
    },
  ],
}

export default stess
