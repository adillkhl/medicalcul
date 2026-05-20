import type { FormulaDefinition } from '../types'

const khorana: FormulaDefinition = {
  id: 'khorana',
  slug: 'khorana',
  name: 'Khorana M.T.E.V. (Score)',
  specialty: 'oncologie',
  category: 'Thrombose',
  description: 'Score de Khorana — prédiction du risque de maladie thromboembolique veineuse (MTEV) chez les patients cancéreux débutant une chimiothérapie ambulatoire. Permet de décider d\'une prophylaxie antithrombotique primaire.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'cancer_type',
      type: 'select',
      label: 'Type de cancer (site primitif)',
      options: [
        { value: 0, label: 'Famille à très haut risque : estomac, pancréas, cerveau (glioblastome)' },
        { value: 1, label: 'Famille à haut risque : poumon, gynécologique (ovaire, utérus), lymphome, myélome, vessie, testicule, rein' },
        { value: 2, label: 'Famille à risque standard : sein, colorectal, prostate, autres' },
      ],
    },
    {
      id: 'platelets',
      type: 'radio',
      label: 'Plaquettes sanguines avant chimiothérapie',
      options: [
        { value: 1, label: '≥ 350 000 / mm³ (≥ 350 G/L)' },
        { value: 0, label: '< 350 000 / mm³' },
      ],
    },
    {
      id: 'hemoglobin',
      type: 'radio',
      label: 'Taux d\'hémoglobine',
      options: [
        { value: 1, label: '< 10 g/dL (ou utilisation d\'EPO/fer IV)' },
        { value: 0, label: '≥ 10 g/dL' },
      ],
    },
    {
      id: 'leukocytes',
      type: 'radio',
      label: 'Leucocytes avant chimiothérapie',
      options: [
        { value: 1, label: '> 11 000 / mm³' },
        { value: 0, label: '≤ 11 000 / mm³' },
      ],
    },
    {
      id: 'bmi',
      type: 'radio',
      label: 'Indice de masse corporelle (IMC)',
      options: [
        { value: 1, label: '≥ 35 kg/m² (obésité sévère)' },
        { value: 0, label: '< 35 kg/m²' },
      ],
    },
  ],
  calculate: (values) => {
    const cancerRisk = values.cancer_type as number
    const platHigh = values.platelets as number
    const lowHb = values.hemoglobin as number
    const wbcHigh = values.leukocytes as number
    const highBmi = values.bmi as number

    let total = cancerRisk + platHigh + lowHb + wbcHigh + highBmi

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''
    let riskPercent = ''

    if (total === 0) {
      label = 'Khorana 0 — Risque faible'
      severity = 'low'
      riskPercent = 'Risque de MTEV : < 1%'
      recommendation = 'Pas de prophylaxie antithrombotique systématique. Surveillance clinique. Information sur les signes de thrombose.'
    } else if (total <= 2) {
      label = `Khorana ${total} — Risque intermédiaire`
      severity = 'moderate'
      riskPercent = 'Risque de MTEV : ~2%'
      recommendation = 'Pas de prophylaxie pharmacologique systématique. Considérer HBPM (énoxaparine 40 mg/j SC) si risque hémorragique faible et facteurs de risque additionnels (alitement, voie veineuse centrale, antécédent thrombotique).'
    } else {
      label = `Khorana ${total} — Risque élevé`
      severity = 'high'
      riskPercent = 'Risque de MTEV : ≥ 6% (jusqu\'à 10-15% à 6 mois)'
      recommendation = 'Prophylaxie antithrombotique PRIMAIRE RECOMMANDÉE. HBPM (énoxaparine 40 mg/j SC) ou inhibiteur du facteur Xa (apixaban 2,5 mg × 2/j, rivaroxaban 10 mg/j). Évaluation du risque hémorragique. Poursuivre pendant la chimiothérapie.'
    }

    return {
      value: total,
      label,
      severity,
      risk: total >= 3 ? total : undefined,
      riskUnit: total >= 3 ? 'Khorana - risque élevé' : undefined,
      details: {
        'Risque à 6 mois': riskPercent,
        'Type de cancer': ['Très haut risque', 'Haut risque', 'Risque standard'][cancerRisk],
        'Plaquettes': platHigh ? '≥ 350 G/L' : '< 350 G/L',
        'Hémoglobine': lowHb ? '< 10 g/dL' : '≥ 10 g/dL',
        'Leucocytes': wbcHigh ? '> 11 000/mm³' : '≤ 11 000/mm³',
        'IMC': highBmi ? '≥ 35 kg/m²' : '< 35 kg/m²',
      },
      ranges: [
        { min: 0, max: 0, label: 'Risque faible — pas de prophylaxie', severity: 'low' },
        { min: 1, max: 2, label: 'Risque intermédiaire — prophylaxie à discuter', severity: 'moderate' },
        { min: 3, max: 5, label: 'Risque élevé — prophylaxie primaire recommandée', severity: 'high' },
      ],
    }
  },
  interpretation: "Le **score de Khorana** (2008) stratifie le risque thromboembolique veineux chez les patients cancéreux sous chimiothérapie ambulatoire.\n\n**5 items :**\n- Type de cancer : très haut risque (estomac, pancréas, cerveau) = 2 pts ; haut risque (poumon, gynéco, lymphome, etc.) = 1 pt\n- Plaquettes ≥ 350 G/L : 1 pt\n- Hb < 10 g/dL (ou EPO) : 1 pt\n- Leucocytes > 11 000/mm³ : 1 pt\n- IMC ≥ 35 kg/m² : 1 pt\n\n**Score :** 0 = faible ; 1-2 = intermédiaire ; ≥ 3 = élevé.",
  clinicalCommentary: "Le score de Khorana a été validé dans plusieurs cohortes. Il est recommandé par l'ASCO (American Society of Clinical Oncology) et l'ESMO pour la décision de prophylaxie antithrombotique primaire ambulatoire. Depuis 2019, les inhibiteurs du facteur Xa (apixaban, rivaroxaban) sont une alternative aux HBPM validée dans les essais cliniques (AVERT, CASSINI). Attention au risque hémorragique, notamment dans les cancers digestifs et urologiques.",
  references: [
    {
      type: 'pubmed',
      title: 'Khorana AA et al. Development and validation of a predictive model for chemotherapy-associated thrombosis. Blood 2008',
      pmid: '18216295',
    },
    {
      type: 'pubmed',
      title: 'Carrier M et al. Apixaban to prevent venous thromboembolism in patients with cancer. N Engl J Med 2019',
      pmid: '30699315',
    },
  ],
}

export default khorana
