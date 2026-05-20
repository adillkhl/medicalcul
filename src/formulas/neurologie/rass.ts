import type { FormulaDefinition } from '../types'

const rass: FormulaDefinition = {
  id: 'rass',
  slug: 'rass',
  name: 'RASS — Richmond Agitation-Sedation Scale',
  specialty: 'neurologie',
  category: 'Neurologie',
  description: 'Évaluation du niveau de sédation et d\'agitation chez le patient en réanimation (score –5 à +4)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'comportement',
      type: 'radio',
      label: 'Comportement du patient',
      options: [
        { value: 4, label: '+4 — Combatif : violent, danger immédiat pour l\'équipe' },
        { value: 3, label: '+3 — Très agité : retire tubulures, cathéters, aggressif verbal' },
        { value: 2, label: '+2 — Agité : mouvements fréquents, lutte contre le ventilateur' },
        { value: 1, label: '+1 — Nerveux : anxieux mais mouvements non agressifs' },
        { value: 0, label: '0 — Calme et coopérant' },
        { value: -1, label: '-1 — Somnolent : réveille à la voix (contact > 10s)' },
        { value: -2, label: '-2 — Sédation légère : réveille voix (contact < 10s)' },
        { value: -3, label: '-3 — Sédation modérée : mouvement à la voix (pas de contact)' },
        { value: -4, label: '-4 — Sédation profonde : réponse à la stimulation physique' },
        { value: -5, label: '-5 — Non réveillable : aucune réponse à la voix ni stimulation physique' },
      ],
    },
  ],
  calculate: (values) => {
    const score = values.comportement ?? 0

    const category = score >= 1 ? 'Agitation' : score === 0 ? 'Calme' : 'Sédation'
    const severity = score >= 3 ? 'high' : score >= 1 ? 'moderate' : score <= -4 ? 'high' : score <= -2 ? 'moderate' : 'low'

    const label = score >= 1 ? `RASS +${score} — Agité` :
      score === 0 ? 'RASS 0 — Calme et coopérant' :
      `RASS ${score} — Sédaté`

    return {
      value: score,
      label,
      severity,
      details: { RASS: score, catégorie: category },
      ranges: [
        { min: -5, max: -4, label: 'RASS –5 à –4 — Sédation profonde', severity: 'high', recommendation: 'Patient non réveillable ou réponse à la douleur seulement. Objectif cible pour curarisation ou ventilation complexe. Réduire la sédation dès que possible.' },
        { min: -3, max: -2, label: 'RASS –3 à –2 — Sédation modérée à légère', severity: 'moderate', recommendation: 'Réveil possible à la voix. Cible typique en réanimation pour sevrage ventilatoire. Réévaluation quotidienne de la sédation.' },
        { min: -1, max: 0, label: 'RASS –1 à 0 — Somnolent à calme', severity: 'low', recommendation: 'Patient éveillable, coopérant. Cible idéale pour sevrage et mobilisation. Permet la participation aux soins.' },
        { min: 1, max: 1, label: 'RASS +1 — Nerveux / anxieux', severity: 'moderate', recommendation: 'Anxiété légère. Rechercher une cause (douleur, sevrage, délire, hypoxémie). Traitement non médicamenteux d\'abord.' },
        { min: 2, max: 2, label: 'RASS +2 — Agité', severity: 'moderate', recommendation: 'Agitation modérée. Risque d\'auto-extubation. Sécuriser les voies. Traitement par neuroleptiques si délire associé.' },
        { min: 3, max: 4, label: 'RASS +3 à +4 — Très agité à combatif', severity: 'high', recommendation: 'Agitation sévère. Danger pour le patient et l\'équipe. Sédation d\'urgence (propofol, benzodiazépine, neuroleptiques). Protection des voies aériennes. Rechercher étiologie (delirium, sevrage, hypoxémie, hémorragie intracrânienne).' },
      ],
    }
  },
  interpretation: `Le **RASS** (Richmond Agitation-Sedation Scale) est l'échelle de sédation la plus utilisée en réanimation. Elle évalue le niveau de sédation (–5 à –1), l'état calme (0) et l’agitation (+1 à +4).

**Score :**
- **+1 à +4 :** agitation (croissante)
- **0 :** calme et coopérant
- **–1 à –5 :** sédation (croissante)

**Procédure :**
1. Observer le patient (si éveillé → coter)
2. Stimulation verbale (si pas de réponse → coter –1 à –3)
3. Stimulation physique (si pas de réponse → coter –4 ou –5)

Le RASS est plus fiable que l'échelle de Ramsay et validé pour la détection du délire. Une cible RASS entre –1 et +1 est recommandée pour la plupart des patients de réanimation.`,
  clinicalCommentary: `Le RASS est l'échelle de sédation recommandée par les sociétés savantes (SRLF, SCCM). La cible RASS dépend du contexte : –2 à –3 pour ventilation complexe/curarisation, –1 à 0 pour sevrage, 0 pour mobilisation. Un RASS positif (+) doit faire évoquer un delirium. En neurologie, le RASS est utile pour évaluer la sédation après état de mal épileptique ou AVC grave. Le RASS se fait en 30 secondes. Arrêt quotidien de la sédation pour réévaluation.`,
  references: [
    {
      type: 'pubmed',
      title: 'Sessler CN et al. The Richmond Agitation-Sedation Scale: validity and reliability in adult intensive care unit patients. Am J Respir Crit Care Med 2002',
      pmid: '12421720',
    },
    {
      type: 'pubmed',
      title: 'Ely EW et al. Monitoring sedation status over time in ICU patients: reliability and validity of the Richmond Agitation-Sedation Scale. JAMA 2003',
      pmid: '12700313',
    },
  ],
}

export default rass
