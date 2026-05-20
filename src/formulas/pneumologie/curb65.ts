import type { FormulaDefinition } from '../types'

const curb65: FormulaDefinition = {
  id: 'curb65',
  slug: 'curb65',
  name: 'CURB-65 — Score de gravité des pneumonies',
  specialty: 'pneumologie',
  category: 'Pneumopathie',
  description: 'Score prédictif de mortalité à 30 jours dans les pneumonies acquises en communauté (PAC), incluant l\'urée (score 0–5)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'confusion',
      type: 'boolean',
      label: 'C — Confusion mentale (nouvelle, d\'apparition récente)',
    },
    {
      id: 'uree',
      type: 'boolean',
      label: 'U — Urée sanguine > 7 mmol/L (> 42 mg/dL)',
    },
    {
      id: 'respiratoire',
      type: 'boolean',
      label: 'R — Fréquence respiratoire ≥ 30/min',
    },
    {
      id: 'pression',
      type: 'boolean',
      label: 'B — PAS < 90 mmHg ou PAD ≤ 60 mmHg',
    },
    {
      id: 'age',
      type: 'boolean',
      label: '65 — Âge ≥ 65 ans',
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.confusion) score += 1
    if (values.uree) score += 1
    if (values.respiratoire) score += 1
    if (values.pression) score += 1
    if (values.age) score += 1

    const mortality30j = score <= 1 ? 1.5 : score === 2 ? 9.2 : score === 3 ? 22.0 : 30.0

    return {
      value: score,
      risk: mortality30j,
      riskUnit: '% mortalité à 30 jours',
      severity: score <= 1 ? 'low' : score === 2 ? 'moderate' : score >= 3 ? 'high' : 'low',
      details: { CURB65: score, mortalité_30j: `${mortality30j}%` },
      ranges: [
        { min: 0, max: 1, label: 'CURB-65 0–1 — Risque faible', severity: 'low', recommendation: 'Mortalité < 2%. Traitement ambulatoire possible. Antibiothérapie orale (amoxicilline ou macrolide). Réévaluation à 48h.' },
        { min: 2, max: 2, label: 'CURB-65 2 — Risque intermédiaire', severity: 'moderate', recommendation: 'Mortalité ≈ 9%. Hospitalisation de courte durée. Antibiothérapie IV (amoxicilline + macrolide ou C3G).' },
        { min: 3, max: 3, label: 'CURB-65 3 — Risque élevé', severity: 'high', recommendation: 'Mortalité ≈ 22%. Hospitalisation en pneumologie. Antibiothérapie IV. Oxygenothérapie si SpO2 < 92%.' },
        { min: 4, max: 5, label: 'CURB-65 4–5 — Risque très élevé', severity: 'critical', recommendation: 'Mortalité > 30%. Hospitalisation en réanimation ou USI. Antibiothérapie IV à large spectre. Ventilation non invasive (VNI) si besoin. Prise en charge des défaillances d\'organes.' },
      ],
    }
  },
  interpretation: `Le **CURB-65** est le score de référence pour évaluer la gravité et la mortalité à 30 jours des pneumonies acquises en communauté (PAC).

**5 items (1 point chacun) :**
- **C** — Confusion mentale
- **U** — Urée > 7 mmol/L
- **R** — Respiratory rate ≥ 30/min
- **B** — Blood pressure (PAS < 90 ou PAD ≤ 60)
- **65** — Âge ≥ 65 ans

**Score : 0–5.**
- 0–1 : ambulatoire (mortalité < 2%)
- 2 : hospitalisation courte (mortalité ≈ 9%)
- 3 : hospitalisation (mortalité ≈ 22%)
- 4–5 : réanimation (mortalité > 30%)

Le CURB-65 est plus complet que le CRB-65 (ajout de l’urée). Il est recommandé par les sociétés savantes (SPILF, ATS, IDSA).`,
  clinicalCommentary: `Le CURB-65 est indispensable aux urgences et en pneumologie pour la décision d’hospitalisation. Attention : le score peut sous-estimer la gravité chez les patients avec comorbidités (insuffisance cardiaque, hépatique, rénale) et les immunodéprimés. Dans ces cas, le jugement clinique prime. La version CRB-65 (sans urée) est utile quand la biologie n’est pas disponible. Le CURB-65 est validé pour les PAC, pas pour les pneumonies nosocomiales ou sous ventilation.`,
  references: [
    {
      type: 'pubmed',
      title: 'Lim WS et al. Defining community acquired pneumonia severity on presentation to hospital: an international derivation and validation study. Thorax 2003',
      pmid: '12667830',
    },
    {
      type: 'guideline',
      title: 'SPILF — Prise en charge des pneumonies aiguës communautaires (2023)',
      url: 'https://www.infectiologie.com',
    },
  ],
}

export default curb65
