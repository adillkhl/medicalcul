import type { FormulaDefinition } from '../types'

const prematspia: FormulaDefinition = {
  id: 'prematspia',
  slug: 'prematspia',
  name: 'Premat-SPIA, T. < 33SA (Score)',
  specialty: 'gynecologie',
  category: 'Menace d accouchement prématuré',
  description: 'Score Premat-SPIA pour évaluer le risque d accouchement prématuré avant 33 semaines d aménorrhée.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'antecedent_map',
      type: 'boolean',
      label: 'Antécédent de MAP ou accouchement < 37 SA',
      weight: 2,
    },
    {
      id: 'col_court',
      type: 'boolean',
      label: 'Col utérin court (< 25 mm à l échographie)',
      weight: 2,
    },
    {
      id: 'grossesse_multiple',
      type: 'boolean',
      label: 'Grossesse multiple (gémellaire, triple)',
      weight: 2,
    },
    {
      id: 'tabac',
      type: 'boolean',
      label: 'Tabagisme actif pendant la grossesse',
      weight: 1,
    },
    {
      id: 'infection',
      type: 'boolean',
      label: 'Infection cervico-vaginale ou bactériurie asymptomatique',
      weight: 1,
    },
    {
      id: 'age_maternel',
      type: 'boolean',
      label: 'Âge maternel < 20 ans ou ≥ 40 ans',
      weight: 1,
    },
    {
      id: 'imc',
      type: 'boolean',
      label: 'IMC < 18.5 ou > 35 kg/m²',
      weight: 1,
    },
    {
      id: 'saignement',
      type: 'boolean',
      label: 'Métrorragies du 2e ou 3e trimestre',
      weight: 1,
    },
    {
      id: 'conisation',
      type: 'boolean',
      label: 'Antécédent de conisation ou de béance cervicale',
      weight: 1,
    },
  ],
  calculate: (values) => {
    const score =
      (values.antecedent_map ? 2 : 0) +
      (values.col_court ? 2 : 0) +
      (values.grossesse_multiple ? 2 : 0) +
      (values.tabac ? 1 : 0) +
      (values.infection ? 1 : 0) +
      (values.age_maternel ? 1 : 0) +
      (values.imc ? 1 : 0) +
      (values.saignement ? 1 : 0) +
      (values.conisation ? 1 : 0)

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (score <= 2) severity = 'low'
    else if (score <= 4) severity = 'moderate'
    else if (score <= 6) severity = 'high'
    else severity = 'critical'

    return {
      value: score,
      label: `Score Premat-SPIA : ${score}`,
      severity,
      risk: score >= 5 ? 40 : score >= 3 ? 20 : 5,
      riskUnit: '% risque d accouchement < 33 SA',
      ranges: [
        { min: 0, max: 2, label: 'Risque faible', severity: 'low', recommendation: 'Surveillance standard. Pas de mesure spécifique.' },
        { min: 3, max: 4, label: 'Risque modéré', severity: 'moderate', recommendation: 'Surveillance renforcée. Échographie du col à 20-24 SA. Dosage de la fibronectine fœtale si symptômes.' },
        { min: 5, max: 6, label: 'Risque élevé', severity: 'high', recommendation: 'Progestérone vaginale (200 mg/j) si col court. Discuter cerclage si antécédent de béance. Corticothérapie anténatale si MAP. Transfert en maternité de niveau adapté.' },
        { min: 7, max: 12, label: 'Risque très élevé', severity: 'critical', recommendation: 'Prise en charge spécialisée. Progestérone + cerclage si indiqué. Surveillance échographique rapprochée. Hospitalisation si symptômes. Corticothérapie selon âge gestationnel. Transfert in utero vers maternité de type III.' },
      ],
    }
  },
  interpretation: `Le **score Premat-SPIA** est un outil de dépistage du risque d accouchement prématuré avant 33 SA, adapté aux femmes asymptomatiques.

**Facteurs de risque (poids : 1 ou 2) :**
- Antécédent de MAP (×2)
- Col court < 25 mm (×2)
- Grossesse multiple (×2)
- Tabac, infection, âge maternel extrême, IMC anormal, métrorragies, conisation (×1)

**Interprétation :**
- 0-2 : risque faible
- 3-4 : risque modéré
- 5-6 : risque élevé
- ≥ 7 : risque très élevé`,
  clinicalCommentary: `Le score Premat-SPIA est utilisé en consultation de dépistage systématique. Il ne remplace pas l échographie du col (gold standard). La mesure de la longueur cervicale par échographie endovaginale entre 20 et 24 SA est recommandée chez les femmes à risque. La fibronectine fœtale a une excellente valeur prédictive négative. La progestérone vaginale réduit le risque d accouchement prématuré de 40 % en cas de col court (< 25 mm).`,
  references: [
    {
      type: 'pubmed',
      title: 'Rozenberg P et al. Predictive value of cervical length for preterm birth. Am J Obstet Gynecol 2004',
      pmid: '15547504',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prévention de la prématurité (Recommandations 2020)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default prematspia
