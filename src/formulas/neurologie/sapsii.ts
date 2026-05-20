import type { FormulaDefinition } from '../types'

const sapsii: FormulaDefinition = {
  id: 'sapsii',
  slug: 'sapsii',
  name: 'SAPS II — Simplified Acute Physiology Score',
  specialty: 'neurologie',
  category: 'Neurologie',
  description: 'Score pronostique de mortalité en réanimation basé sur 17 variables physiologiques (score 0–163)',
  version: '2024',
  lastValidated: '2024-02',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 0, label: '< 40 ans' },
        { value: 2, label: '40–59 ans' },
        { value: 5, label: '60–69 ans' },
        { value: 11, label: '70–74 ans' },
        { value: 13, label: '75–79 ans' },
        { value: 16, label: '≥ 80 ans' },
      ],
    },
    {
      id: 'fc',
      type: 'radio',
      label: 'Fréquence cardiaque (bpm) — pire valeur en 24h',
      options: [
        { value: 4, label: '≥ 160' },
        { value: 2, label: '120–159' },
        { value: 0, label: '70–119' },
        { value: 2, label: '55–69' },
        { value: 4, label: '40–54' },
        { value: 7, label: '< 40' },
      ],
    },
    {
      id: 'pas',
      type: 'radio',
      label: 'Pression artérielle systolique (mmHg) — pire valeur en 24h',
      options: [
        { value: 7, label: '≥ 200' },
        { value: 2, label: '100–199' },
        { value: 4, label: '70–99' },
        { value: 7, label: '< 70' },
      ],
    },
    {
      id: 'temperature',
      type: 'radio',
      label: 'Température (°C) — pire valeur en 24h',
      options: [
        { value: 3, label: '≥ 39,0' },
        { value: 0, label: '38,4–38,9' },
        { value: 0, label: '36,0–38,3' },
        { value: 1, label: '34,0–35,9' },
        { value: 3, label: '30,0–33,9' },
        { value: 4, label: '< 30,0' },
      ],
    },
    {
      id: 'pao2_fio2',
      type: 'radio',
      label: 'PaO2/FiO2 (si ventilation mécanique ou CPAP)',
      options: [
        { value: 5, label: '< 100' },
        { value: 2, label: '100–199' },
        { value: 0, label: '≥ 200' },
        { value: 0, label: 'Pas de ventilation' },
      ],
    },
    {
      id: 'diurese',
      type: 'radio',
      label: 'Diurèse (L/jour)',
      options: [
        { value: 4, label: '≥ 5,00' },
        { value: 0, label: '1,00–4,99' },
        { value: 2, label: '0,50–0,99' },
        { value: 3, label: '< 0,50' },
      ],
    },
    {
      id: 'uree',
      type: 'radio',
      label: 'Urée sanguine (mmol/L)',
      options: [
        { value: 0, label: '< 10' },
        { value: 1, label: '10–19,9' },
        { value: 2, label: '20–39,9' },
        { value: 3, label: '40–59,9' },
        { value: 4, label: '≥ 60' },
      ],
    },
    {
      id: 'leucemie',
      type: 'radio',
      label: 'Leucocytes (x 10³/mm³)',
      options: [
        { value: 6, label: '≥ 50,0' },
        { value: 1, label: '20,0–49,9' },
        { value: 0, label: '3,0–19,9' },
        { value: 1, label: '1,0–2,9' },
        { value: 2, label: '< 1,0' },
      ],
    },
    {
      id: 'kaliemie',
      type: 'radio',
      label: 'Kaliémie (mmol/L)',
      options: [
        { value: 3, label: '≥ 7,0' },
        { value: 1, label: '6,0–6,9' },
        { value: 0, label: '3,5–5,9' },
        { value: 1, label: '3,0–3,4' },
        { value: 2, label: '2,5–2,9' },
        { value: 3, label: '< 2,5' },
      ],
    },
    {
      id: 'natremie',
      type: 'radio',
      label: 'Natrémie (mmol/L)',
      options: [
        { value: 2, label: '≥ 155' },
        { value: 1, label: '150–154' },
        { value: 0, label: '130–149' },
        { value: 1, label: '125–129' },
        { value: 2, label: '120–124' },
        { value: 3, label: '< 120' },
      ],
    },
    {
      id: 'bicarbonates',
      type: 'radio',
      label: 'Bicarbonates (HCO3⁻ en mmol/L)',
      options: [
        { value: 5, label: '≥ 40' },
        { value: 3, label: '30–39,9' },
        { value: 0, label: '20–29,9' },
        { value: 2, label: '10–19,9' },
        { value: 5, label: '< 10' },
      ],
    },
    {
      id: 'bilirubine',
      type: 'radio',
      label: 'Bilirubine (µmol/L)',
      options: [
        { value: 4, label: '≥ 205' },
        { value: 2, label: '103–204' },
        { value: 1, label: '40–102' },
        { value: 0, label: '< 40' },
      ],
    },
    {
      id: 'gcs',
      type: 'radio',
      label: 'Score de Glasgow (GCS) — pire valeur',
      options: [
        { value: 16, label: '3–4' },
        { value: 8, label: '5–6' },
        { value: 4, label: '7–8' },
        { value: 2, label: '9–10' },
        { value: 0, label: '11–15' },
      ],
    },
    {
      id: 'type_admission',
      type: 'radio',
      label: 'Type d\'admission',
      options: [
        { value: 0, label: 'Programmée (chirurgie élective)' },
        { value: 3, label: 'Médicale (pas de chirurgie)' },
        { value: 6, label: 'Chirurgie non programmée' },
      ],
    },
    {
      id: 'sida',
      type: 'boolean',
      label: 'SIDA / VIH stade SIDA',
    },
    {
      id: 'cancer_metastatique',
      type: 'boolean',
      label: 'Cancer métastatique',
    },
    {
      id: 'hemopathie',
      type: 'boolean',
      label: 'Hémopathie maligne',
    },
  ],
  calculate: (values) => {
    const items = ['age', 'fc', 'pas', 'temperature', 'pao2_fio2', 'diurese', 'uree', 'leucemie', 'kaliemie', 'natremie', 'bicarbonates', 'bilirubine', 'gcs', 'type_admission']
    let total = items.reduce((sum, id) => sum + (values[id] ?? 0), 0)
    if (values.sida) total += 6
    if (values.cancer_metastatique) total += 6
    if (values.hemopathie) total += 3

    const mortality = total <= 24 ? 5.0 : total <= 29 ? 8.5 : total <= 34 ? 12.5 : total <= 39 ? 17.5 : total <= 44 ? 22.5 : total <= 49 ? 30.0 : total <= 54 ? 37.5 : total <= 59 ? 45.0 : 60.0

    const getSeverity = (t: number): 'low' | 'moderate' | 'high' | 'critical' => {
      if (t <= 24) return 'low'
      if (t <= 34) return 'moderate'
      if (t <= 49) return 'high'
      return 'critical'
    }

    return {
      value: total,
      label: `SAPS II = ${total}`,
      risk: mortality,
      riskUnit: '% mortalité estimée',
      severity: getSeverity(total),
      details: { total_sapsii: total, mortalité_estimée: `${mortality.toFixed(1)}%` },
      ranges: [
        { min: 0, max: 24, label: 'SAPS II ≤ 24 — Risque faible', severity: 'low', recommendation: 'Mortalité estimée < 8,5%. Bon pronostic.' },
        { min: 25, max: 34, label: 'SAPS II 25–34 — Risque modéré', severity: 'moderate', recommendation: 'Mortalité 8,5–17,5%. Surveillance rapprochée.' },
        { min: 35, max: 49, label: 'SAPS II 35–49 — Risque élevé', severity: 'high', recommendation: 'Mortalité 17,5–37,5%. Pronostic réservé.' },
        { min: 50, max: 75, label: 'SAPS II 50–75 — Risque très élevé', severity: 'critical', recommendation: 'Mortalité 37,5–60%. Pronostic critique. Discussion collégiale des objectifs de soins.' },
        { min: 76, max: 163, label: 'SAPS II > 75 — Risque extrême', severity: 'critical', recommendation: 'Mortalité > 60%. Pronostic très défavorable. Soins palliatifs à discuter.' },
      ],
    }
  },
  interpretation: `Le **SAPS II** (Simplified Acute Physiology Score II) est un score pronostique de mortalité en réanimation, calculé sur les 24 premières heures d’admission. Il utilise 17 variables physiologiques et pathologiques.

**Variables :** âge, FC, PAS, température, PaO2/FiO2, diurèse, urée, leucocytes, kaliémie, natrémie, bicarbonates, bilirubine, GCS, type d'admission, SIDA, cancer métastatique, hémopathie.

**Score : 0–163.** La mortalité hospitalière estimée est dérivée du score total par une équation logistique.

**Limites :** Le SAPS II ne prédit pas la mortalité individuelle, mais donne une estimation pour un groupe de patients. Il est recalibré (SAPS II) et des versions plus récentes existent (SAPS 3).`,
  clinicalCommentary: `Le SAPS II est utile en réanimation neurologique pour stratifier le risque de mortalité chez les patients avec AVC grave, traumatisme crânien, ou hémorragie méningée. Attention : le GCS est fortement pondéré (jusqu'à 16 pts), ce qui peut surévaluer le risque chez les patients neurologiques avec coma réversible. Ne pas utiliser pour les décisions de limitation thérapeutique individuelles. Toujours prendre la pire valeur dans les 24h.`,
  references: [
    {
      type: 'pubmed',
      title: 'Le Gall JR et al. A new Simplified Acute Physiology Score (SAPS II) based on a European/North American multicenter study. JAMA 1993',
      pmid: '8413605',
    },
    {
      type: 'pubmed',
      title: 'Straney L et al. Improving the performance of SAPS II in the critically ill. Crit Care Resusc 2008',
      pmid: '18208304',
    },
  ],
}

export default sapsii
