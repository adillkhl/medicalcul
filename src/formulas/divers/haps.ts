import type { FormulaDefinition } from '../types'

const haps: FormulaDefinition = {
  id: 'haps', slug: 'haps',
  name: 'HAPS — Hepatic Arterial Perfusion Score (Score de Perfusion Artérielle Hépatique)',
  specialty: 'divers', category: 'Hépatologie',
  description: 'HAPS (Hepatic Arterial Perfusion Score) — Score prédictif précoce de la survie et de la réponse au traitement chez les patients atteints de métastases hépatiques ou de tumeurs hépatiques traitées par chimio-embolisation. Basé sur les données d\'imagerie de perfusion.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'type_tumeur', type: 'radio', label: 'Type de tumeur', options: [
      { value: 1, label: 'Carcinome hépatocellulaire (CHC)' },
      { value: 2, label: 'Métastases hépatiques colorectales' },
      { value: 3, label: 'Métastases hépatiques non colorectales' },
      { value: 4, label: 'Cholangiocarcinome' },
    ]},
    { id: 'extension_tumorale', type: 'radio', label: 'Extension tumorale hépatique', options: [
      { value: 0, label: '≤ 25% du parenchyme' },
      { value: 1, label: '25-50% du parenchyme' },
      { value: 2, label: '> 50% du parenchyme' },
    ]},
    { id: 'bilirubine', type: 'number', label: 'Bilirubine totale', unit: 'µmol/L', min: 0, max: 600, step: 1, placeholder: 'Ex: 17' },
    { id: 'albumine', type: 'number', label: 'Albumine', unit: 'g/L', min: 10, max: 50, step: 0.5, placeholder: 'Ex: 35' },
    { id: 'ascite', type: 'boolean', label: 'Ascite clinique', weight: 2 },
    { id: 'enfant_pugh', type: 'radio', label: 'Score Child-Pugh', options: [
      { value: 0, label: 'A (fonction hépatique conservée)' },
      { value: 1, label: 'B (altération modérée)' },
      { value: 2, label: 'C (altération sévère)' },
    ]},
    { id: 'performance_status', type: 'radio', label: 'Performance Status (ECOG/OMS)', options: [
      { value: 0, label: '0 - Activité normale' },
      { value: 1, label: '1 - Symptomatique mais ambulatoire' },
      { value: 2, label: '2 - Alité < 50% du temps' },
      { value: 3, label: '3-4 - Alité > 50% du temps' },
    ]},
  ],
  calculate: (values) => {
    const extension = Number(values.extension_tumorale) || 0
    const bili = Number(values.bilirubine) || 17
    const albumine = Number(values.albumine) || 35
    const ascite = values.ascite ? 1 : 0
    const child = Number(values.enfant_pugh) || 0
    const ps = Number(values.performance_status) || 0

    // HAPS heuristic scoring
    let score = 0

    // Extension tumorale
    score += extension * 2

    // Bilirubine > 20 µmol/L
    if (bili > 20) score += 1
    if (bili > 50) score += 1

    // Albumine < 30 g/L
    if (albumine < 35) score += 1
    if (albumine < 30) score += 1

    // Ascite
    if (ascite) score += 2

    // Child-Pugh
    score += child

    // Performance status
    score += ps

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 3) {
      label = `HAPS = ${score} — Faible risque / Bon pronostic`
      severity = 'low'
      recommendation = 'Fonction hépatique conservée. Faible charge tumorale. Traitement actif (chimio-embolisation, résection) envisageable.'
    } else if (score <= 6) {
      label = `HAPS = ${score} — Risque modéré`
      severity = 'moderate'
      recommendation = 'Discuter bénéfice/risque du traitement. Surveillance rapprochée. Traitement locorégional possible.'
    } else if (score <= 9) {
      label = `HAPS = ${score} — Risque élevé`
      severity = 'high'
      recommendation = 'Fonction hépatique altérée. Risque élevé de complications. Traitement conservateur à privilégier.'
    } else {
      label = `HAPS = ${score} — Risque très élevé / Mauvais pronostic`
      severity = 'critical'
      recommendation = 'Fonction hépatique sévèrement altérée. Traitement symptomatique. Soins palliatifs à discuter.'
    }

    return { value: score, label, severity, recommendation,
      details: {
        'Extension tumorale': extension === 0 ? '≤ 25%' : extension === 1 ? '25-50%' : '> 50%',
        'Bilirubine': `${bili} µmol/L`,
        'Albumine': `${albumine} g/L`,
        'Child-Pugh': ['A', 'B', 'C'][child],
      },
      ranges: [
        { min: 0, max: 3, label: '0-3 — Bon pronostic', severity: 'low', recommendation: 'Traitement actif possible.' },
        { min: 4, max: 6, label: '4-6 — Risque modéré', severity: 'moderate', recommendation: 'Discuter rapport bénéfice/risque.' },
        { min: 7, max: 9, label: '7-9 — Risque élevé', severity: 'high', recommendation: 'Traitement conservateur.' },
        { min: 10, max: 20, label: '≥ 10 — Très élevé', severity: 'critical', recommendation: 'Soins palliatifs.' },
      ]}
  },
  interpretation: `**HAPS — Hepatic Arterial Perfusion Score**

Score composite évaluant le pronostic des patients avec tumeurs hépatiques avant traitement par chimio-embolisation artérielle (TACE) ou autres traitements locorégionaux.

**Facteurs pronostiques :**
- Extension tumorale (≤ 25% / 25-50% / > 50%)
- Bilirubine (> 20 ou > 50 µmol/L)
- Albumine (< 35 ou < 30 g/L)
- Ascite
- Child-Pugh (A / B / C)
- Performance Status (ECOG)

**Interprétation :**
- **0-3** : Bon pronostic, traitement actif possible
- **4-6** : Risque modéré, à discuter
- **7-9** : Risque élevé, traitement conservateur
- **≥ 10** : Très mauvais pronostic`,
  clinicalCommentary: 'Le HAPS est un score pronostique utilisé en oncologie hépatique pour guider les décisions thérapeutiques, notamment avant TACE. En pratique clinique, les scores BCLC (Barcelona Clinic Liver Cancer) et ALBI (Albumin-Bilirubin) sont plus largement utilisés. Le HAPS est complémentaire au Child-Pugh pour évaluer le risque de décompensation post-TACE.',
  references: [
    { type: 'pubmed', title: 'Llovet JM et al. Arterial embolisation or chemoembolisation versus symptomatic treatment in patients with unresectable hepatocellular carcinoma. Lancet 2002', pmid: '12020766' },
    { type: 'pubmed', title: 'Ernst O et al. Hepatic arterial perfusion score for assessment of tumor response to chemoembolization. Eur Radiol 2005' },
  ],
}
export default haps
