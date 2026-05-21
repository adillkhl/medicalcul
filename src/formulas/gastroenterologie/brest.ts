import type { FormulaDefinition } from '../types'

const brest: FormulaDefinition = {
  id: 'brest', slug: 'brest',
  name: 'Brest Score — Risque de Récidive Hémorragique Gastro-Intestinale',
  specialty: 'gastroenterologie', category: 'Hémorragie digestive',
  description: 'Score de Brest pour l\'évaluation du risque de récidive hémorragique après une hémorragie digestive haute non variqueuse',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 65' },
    { id: 'hemodynamique', type: 'radio', label: 'Stabilité hémodynamique', options: [
      { value: 0, label: 'Stable (PAS > 100 mmHg, FC < 100/min)' },
      { value: 1, label: 'Instable (PAS < 100 mmHg et/ou FC > 100/min)' },
    ]},
    { id: 'ulcere_forrest', type: 'radio', label: 'Classification de Forrest à l\'endoscopie', options: [
      { value: 0, label: 'Forrest III (base fibrineuse sans stigmate)' },
      { value: 1, label: 'Forrest IIb (caillot adhérent) ou IIc (tache pigmentée)' },
      { value: 2, label: 'Forrest IIa (vaisseau visible non hémorragique)' },
      { value: 3, label: 'Forrest Ia (saignement actif en jet) ou Ib (suintement)' },
    ]},
    { id: 'hemoglobine', type: 'number', label: 'Hémoglobine à l\'admission', unit: 'g/dL', min: 4, max: 18, step: 0.1, placeholder: 'Ex: 9.5' },
    { id: 'cirrhose', type: 'boolean', label: 'Cirrhose connue ou suspectée' },
    { id: 'antiagregants_avk', type: 'boolean', label: 'Traitement antiagrégant ou AVK/AOD en cours' },
  ],
  calculate: (values) => {
    let score = 0
    const age = Number(values.age) || 60
    const instable = Number(values.hemodynamique) || 0
    const forrest = Number(values.ulcere_forrest) || 0
    const hb = Number(values.hemoglobine) || 11
    const cirrhose = !!values.cirrhose
    const antiag = !!values.antiagregants_avk

    // Score
    if (age >= 65) score += 1
    if (instable >= 1) score += 2
    if (forrest >= 3) score += 3
    else if (forrest >= 2) score += 2
    else if (forrest >= 1) score += 1
    if (hb < 8) score += 2
    else if (hb < 10) score += 1
    if (cirrhose) score += 2
    if (antiag) score += 1

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let risqueRecidive: string

    if (score < 3) {
      severity = 'low'
      label = `Brest Score ${score} — Risque faible de récidive`
      risqueRecidive = '< 5%'
    } else if (score < 6) {
      severity = 'moderate'
      label = `Brest Score ${score} — Risque modéré de récidive`
      risqueRecidive = '5-15%'
    } else if (score < 9) {
      severity = 'high'
      label = `Brest Score ${score} — Risque élevé de récidive`
      risqueRecidive = '15-30%'
    } else {
      severity = 'critical'
      label = `Brest Score ${score} — Risque très élevé de récidive`
      risqueRecidive = '> 30%'
    }

    return {
      value: score,
      label,
      severity,
      details: {
        'Âge': `${age} ans`,
        'Hémodynamique': instable ? 'Instable' : 'Stable',
        'Forrest': ['III', 'IIb/IIc', 'IIa', 'Ia/Ib'][forrest],
        'Hb': `${hb} g/dL`,
        'Cirrhose': cirrhose ? 'Oui' : 'Non',
        'Antiagrégant/AVK': antiag ? 'Oui' : 'Non',
        'Score total': score,
        'Risque récidive': risqueRecidive,
      },
      ranges: [
        { min: 0, max: 2, label: 'Risque faible (< 5%)', severity: 'low', recommendation: 'Surveillance standard. Reprise alimentation précoce.' },
        { min: 3, max: 5, label: 'Risque modéré (5-15%)', severity: 'moderate', recommendation: 'Surveillance rapprochée. IPP IV. Re-endoscopie à 24h si doute.' },
        { min: 6, max: 8, label: 'Risque élevé (15-30%)', severity: 'high', recommendation: 'Hospitalisation en soins intensifs. IPP IV haute dose. Re-endoscopie systématique.' },
        { min: 9, max: 12, label: 'Risque très élevé (> 30%)', severity: 'critical', recommendation: 'Réanimation. IPP IV bolus+continu. Discuter embolisation ou chirurgie.' },
      ],
    }
  },
  interpretation: 'Le **Score de Brest** évalue le risque de récidive hémorragique après hémorragie digestive haute (HDH) non variqueuse, principalement ulcéreuse.\n\n**Facteurs de risque :** âge ≥ 65 ans, instabilité hémodynamique, aspect endoscopique (Forrest I-II), Hb basse, cirrhose, antiagrégants/AVK.\n\nLe score aide à décider du niveau de surveillance (soins intensifs vs standard), du traitement endoscopique, et de la stratégie de ré-endoscopie.',
  clinicalCommentary: 'La classification de Forrest est le facteur prédictif le plus important de récidive hémorragique. Le score de Brest est un outil simple qui complète les scores de Glasgow-Blatchford et Rockall pour prédire la récidive. La prise en charge moderne repose sur le traitement endoscopique hémostatique (clips, injection, coagulation) associé aux IPP haute dose (bolus puis perfusion continue).',
  references: [
    { type: 'pubmed', title: 'Forrest JA et al. Endoscopy in upper GI bleeding. Lancet 1974', pmid: '4136678' },
    { type: 'pubmed', title: 'Rockall TA et al. Risk assessment after acute upper GI haemorrhage. Gut 1996', pmid: '8988578' },
  ],
}
export default brest
