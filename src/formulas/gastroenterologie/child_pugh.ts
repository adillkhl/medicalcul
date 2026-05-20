import type { FormulaDefinition } from '../types'

const childPugh: FormulaDefinition = {
  id: 'child-pugh',
  slug: 'child-pugh',
  name: 'Child-Pugh (Score) — Cirrhose',
  specialty: 'gastroenterologie',
  category: 'Fonction hépatique',
  description: 'Classification pronostique de la cirrhose et évaluation de la fonction hépatique',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'bilirubine',
      type: 'radio',
      label: 'Bilirubine totale',
      options: [
        { value: 1, label: '< 35 µmol/L (2 mg/dL)' },
        { value: 2, label: '35-50 µmol/L (2-3 mg/dL)' },
        { value: 3, label: '> 50 µmol/L (> 3 mg/dL)' },
      ],
    },
    {
      id: 'albumine',
      type: 'radio',
      label: 'Albumine sérique',
      options: [
        { value: 1, label: '> 35 g/L' },
        { value: 2, label: '28-35 g/L' },
        { value: 3, label: '< 28 g/L' },
      ],
    },
    {
      id: 'tp',
      type: 'radio',
      label: 'TP (Taux de prothrombine)',
      options: [
        { value: 1, label: '> 50 % (INR < 1.7)' },
        { value: 2, label: '40-50 % (INR 1.7-2.3)' },
        { value: 3, label: '< 40 % (INR > 2.3)' },
      ],
    },
    {
      id: 'ascite',
      type: 'radio',
      label: 'Ascite',
      options: [
        { value: 1, label: 'Absente' },
        { value: 2, label: 'Minime ou contrôlée par diurétiques' },
        { value: 3, label: 'Modérée à sévère ou réfractaire' },
      ],
    },
    {
      id: 'encephalopathie',
      type: 'radio',
      label: 'Encéphalopathie hépatique',
      options: [
        { value: 1, label: 'Absente' },
        { value: 2, label: 'Stade I-II (confusion, astérixis, trouble sommeil)' },
        { value: 3, label: 'Stade III-IV (coma, somnolence sévère)' },
      ],
    },
  ],
  calculate: (values) => {
    const bil = Number(values.bilirubine) || 1
    const alb = Number(values.albumine) || 1
    const tp = Number(values.tp) || 1
    const asc = Number(values.ascite) || 1
    const enc = Number(values.encephalopathie) || 1
    const score = bil + alb + tp + asc + enc

    let classe: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 6) {
      classe = 'Classe A'
      severity = 'low'
      recommendation = 'Fonction hépatique compensée. Risque opératoire faible. Surveillance annuelle. Dépistage HCC par échographie tous les 6 mois et endoscopie pour varices œsophagiennes.'
    } else if (score <= 9) {
      classe = 'Classe B'
      severity = 'moderate'
      recommendation = 'Fonction hépatique partiellement décompensée. Risque opératoire modéré. Surveillance rapprochée tous les 3-6 mois. Traitement des complications. Évaluation pour transplantation.'
    } else {
      classe = 'Classe C'
      severity = 'critical'
      recommendation = 'Fonction hépatique décompensée sévère. Risque opératoire élevé. Discussion transplantation hépatique urgente. Prise en charge symptomatique des complications.'
    }

    return {
      value: score,
      label: `Child-Pugh ${classe} (${score} pts)`,
      severity,
      ranges: [
        { min: 5, max: 6, label: 'A (5-6 pts) — Compensé', severity: 'low', recommendation: 'Surveillance, dépistage varices et HCC.' },
        { min: 7, max: 9, label: 'B (7-9 pts) — Partiellement décompensé', severity: 'moderate', recommendation: 'Surveillance rapprochée. Traitement complications.' },
        { min: 10, max: 15, label: 'C (10-15 pts) — Décompensé sévère', severity: 'critical', recommendation: 'Transplantation urgente. PEC symptomatique.' },
      ],
    }
  },
  interpretation: `Le **score de Child-Pugh** est la classification historique de la sévérité de la cirrhose.

**5 critères** : bilirubine, albumine, TP (ou INR), ascite, encéphalopathie — chacun coté de 1 à 3.

| Classe | Score | Survie à 1-2 ans |
|--------|-------|------------------|
| A | 5-6 | 95-100 % |
| B | 7-9 | 75-85 % |
| C | 10-15 | 40-55 % |

Utilisé pour estimer le pronostic et le risque chirurgical (MELD lui est préféré pour la priorisation de transplantation).`,
  clinicalCommentary: `Le Child-Pugh reste utilisé pour la stratification du risque opératoire et la décision de prescription de certains médicaments (bêtabloquants, ribavirine). Ses limites : subjectivité des critères ascite et encéphalopathie, et effet plafond. Le MELD lui est préféré pour l’attribution des greffons. Dans la cirrhose biliaire primitive, la bilirubine peut être très élevée sans cirrhose décompensée → un score de 2 ou 3 pour bilirubine peut surévaluer la sévérité.`,
  references: [
    {
      type: 'pubmed',
      title: 'Pugh RN et al. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg 1973',
      pmid: '4541913',
    },
    {
      type: 'guideline',
      title: 'Recommandations AFEF — Prise en charge des complications de la cirrhose',
      url: 'https://afef.asso.fr',
    },
  ],
}

export default childPugh
