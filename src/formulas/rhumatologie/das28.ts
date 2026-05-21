import type { FormulaDefinition } from '../types'

const das28: FormulaDefinition = {
  id: 'das28',
  slug: 'das28',
  name: 'DAS 28 — Score d\'activité de la polyarthrite rhumatoïde (CRP ou VS)',
  specialty: 'rhumatologie',
  category: 'Polyarthrite rhumatoïde',
  description: 'Disease Activity Score 28 — Évaluation de l\'activité de la polyarthrite rhumatoïde (DAS28-CRP ou DAS28-ESR au choix).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'biomarqueur_type',
      type: 'radio',
      label: 'Type de biomarqueur',
      options: [
        { value: 0, label: 'CRP (mg/L) — DAS28-CRP' },
        { value: 1, label: 'VS (mm/h) — DAS28-ESR' },
      ],
    },
    {
      id: 'nb_articulations_douloureuses',
      type: 'number',
      label: 'Nombre d\'articulations douloureuses parmi 28 (NAD/TJC)',
      min: 0,
      max: 28,
      step: 1,
      placeholder: '8',
    },
    {
      id: 'nb_articulations_gonflees',
      type: 'number',
      label: 'Nombre d\'articulations gonflées parmi 28 (NAG/SJC)',
      min: 0,
      max: 28,
      step: 1,
      placeholder: '6',
    },
    {
      id: 'evs',
      type: 'number',
      label: 'Évaluation visuelle de l\'activité par le patient (EVA 0–100 mm ou GH)',
      min: 0,
      max: 100,
      step: 1,
      placeholder: '50',
    },
    {
      id: 'crp',
      type: 'number',
      label: 'CRP (mg/L) — uniquement si CRP sélectionné',
      min: 0,
      max: 200,
      step: 0.1,
      placeholder: '15',
    },
    {
      id: 'vs',
      type: 'number',
      label: 'VS (mm/h) — uniquement si VS sélectionnée',
      min: 0,
      max: 200,
      step: 1,
      placeholder: '30',
    },
  ],
  calculate: (values) => {
    const nad = Number(values.nb_articulations_douloureuses) || 0
    const nag = Number(values.nb_articulations_gonflees) || 0
    const evs = Number(values.evs) || 0
    const useESR = Number(values.biomarqueur_type) === 1

    let das28Val: number
    let formulaName: string

    if (useESR) {
      // DAS28-ESR (Prevoo 1995) : 0.56√(TJC) + 0.28√(SJC) + 0.70×ln(ESR) + 0.014×GH
      const esr = Number(values.vs) || 20
      das28Val = 0.56 * Math.sqrt(nad) + 0.28 * Math.sqrt(nag) + 0.70 * Math.log(esr) + 0.014 * evs
      formulaName = 'DAS28-ESR'
    } else {
      // DAS28-CRP (Wells 2009) : 0.56√(NAD) + 0.28√(NAG) + 0.36×ln(CRP+1) + 0.014×EVA + 0.96
      const crp = Number(values.crp) || 5
      das28Val = 0.56 * Math.sqrt(nad) + 0.28 * Math.sqrt(nag) + 0.36 * Math.log(crp + 1) + 0.014 * evs + 0.96
      formulaName = 'DAS28-CRP'
    }

    const das28Round = Math.round(das28Val * 100) / 100

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'

    if (das28Round <= 2.6) {
      label = `${formulaName} = ${das28Round} — Rémission`
      severity = 'low'
    } else if (das28Round <= 3.2) {
      label = `${formulaName} = ${das28Round} — Faible activité`
      severity = 'low'
    } else if (das28Round <= 5.1) {
      label = `${formulaName} = ${das28Round} — Activité modérée`
      severity = 'moderate'
    } else {
      label = `${formulaName} = ${das28Round} — Activité élevée`
      severity = 'high'
    }

    return {
      value: das28Round,
      label,
      severity,
      details: {
        'Formule': formulaName,
        'NAD/TJC': nad,
        'NAG/SJC': nag,
        'EVA/GH': `${evs} mm`,
        'CRP': useESR ? 'N/A' : `${Number(values.crp) || 5} mg/L`,
        'VS': useESR ? `${Number(values.vs) || 20} mm/h` : 'N/A',
      },
      ranges: [
        { min: 0, max: 2.6, label: '≤ 2.6 : Rémission', severity: 'low' },
        { min: 2.6, max: 3.2, label: '2.6–3.2 : Faible activité', severity: 'low' },
        { min: 3.2, max: 5.1, label: '3.2–5.1 : Activité modérée', severity: 'moderate' },
        { min: 5.1, max: 99, label: '> 5.1 : Activité élevée', severity: 'high' },
      ],
    }
  },
  interpretation: `**DAS28** — Disease Activity Score basé sur 28 articulations.

**Deux formules disponibles :**
1. **DAS28-CRP** : 0,56×√(NAD) + 0,28×√(NAG) + 0,36×ln(CRP+1) + 0,014×EVA + 0,96
2. **DAS28-ESR** : 0,56×√(TJC) + 0,28×√(SJC) + 0,70×ln(VS) + 0,014×GH

⚠️ **Attention :** DAS28-CRP et DAS28-ESR ne sont pas interchangeables. Les valeurs de CRP et VS donnent des scores systématiquement différents (DAS28-CRP tend à sous-estimer vs DAS28-ESR). Toujours préciser la formule utilisée dans les comptes-rendus.

**Articulations évaluées (28) :** Épaules, coudes, poignets, MCP, IPP, MTP (bilatérales).

**Interprétation :**
- ≤ 2,6 : Rémission
- 2,6–3,2 : Faible activité
- 3,2–5,1 : Activité modérée
- > 5,1 : Activité élevée`,
  clinicalCommentary: `Le DAS28 est le score d\'activité le plus utilisé en rhumatologie pour la PR. La cible thérapeutique recommandée par l\'EULAR est la rémission (ou à défaut la faible activité). Une diminution ≥ 1,2 est une bonne réponse EULAR. Attention : ne pas mélanger DAS28-CRP et DAS28-ESR dans le suivi d\'un même patient — utiliser toujours le même biomarqueur.`,
  references: [
    {
      type: 'pubmed',
      title: 'Prevoo ML et al. Modified disease activity scores that include 28-joint counts. Arthritis Rheum 1995',
      pmid: '7840345',
    },
    {
      type: 'pubmed',
      title: 'Wells G et al. Validation of the 28-joint Disease Activity Score (DAS28) and EULAR response criteria. Ann Rheum Dis 2009',
      pmid: '19054820',
    },
  ],
}

export default das28
