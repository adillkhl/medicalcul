import type { FormulaDefinition } from '../types'

const dapt: FormulaDefinition = {
  id: 'dapt',
  slug: 'dapt',
  name: 'DAPT (Score — Risque ischémique et hémorragique post-stent)',
  specialty: 'cardiologie',
  category: 'Bithérapie antiplaquettaire',
  description: 'Score de décision pour la durée de la bithérapie antiplaquettaire (DAPT) après pose de stent coronaire',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    { id: 'diabete', type: 'boolean', label: 'Diabète', weight: 1 },
    { id: 'tabac', type: 'boolean', label: 'Tabagisme actif', weight: 1 },
    { id: 'im_ancien', type: 'boolean', label: 'ATCD infarctus du myocarde ou revascularisation', weight: 1 },
    { id: 'ic_fevg', type: 'boolean', label: 'Insuffisance cardiaque ou FEVG < 30 %', weight: 1 },
    { id: 'veine_saph', type: 'boolean', label: 'Pontage veineux saphène', weight: 1 },
    { id: 'stent_lt1', type: 'boolean', label: 'Stent < 3 mm de diamètre', weight: 1 },
    { id: 'age', type: 'radio', label: 'Âge',
      options: [
        { value: 2, label: '≥ 75 ans' },
        { value: 1, label: '65–74 ans' },
        { value: 0, label: '< 65 ans' },
      ] },
    { id: 'timi_grade', type: 'boolean', label: 'Stent pour IDM ST+ (TIMI grade ≤ 1 post-stent)', weight: 1 },
    { id: 'aomi', type: 'boolean', label: 'ATCD arteriopathie peripherique', weight: 1 },
  ],
  calculate: (values) => {
    let ischemie = 0
    if (values.diabete) ischemie += 1
    if (values.tabac) ischemie += 1
    if (values.im_ancien) ischemie += 1
    if (values.ic_fevg) ischemie += 1
    if (values.veine_saph) ischemie += 1
    if (values.stent_lt1) ischemie += 1
    ischemie += Number(values.age)
    if (values.timi_grade) ischemie += 1
    if (values.aomi) ischemie += 1

    let label = ''
    let severity: 'low' | 'moderate' | 'high' = 'low'

    if (ischemie >= 2) { label = 'Benefice ischemique DAPT prolongee (>= 30 mois)'; severity = 'high' }
    else { label = 'Faible benefice ischemique - DAPT courte (<= 12 mois) recommandee'; severity = 'low' }

    return {
      value: ischemie,
      label,
      severity,
      risk: ischemie >= 2 ? 2.8 : 1.6,
      riskUnit: 'reduction absolue du risque IDM/stent thrombosis (%)',
      ranges: [
        { min: 0, max: 1, label: 'DAPT courte (<= 12 mois)', severity: 'low', recommendation: 'DAPT 6-12 mois selon le risque hemorragique. Puis AAS seule. Pas de benefice a prolonger.' },
        { min: 2, max: 9, label: 'DAPT prolongee (>= 30 mois) a considerer', severity: 'high', recommendation: 'Discuter prolongation DAPT au-dela de 12 mois (jusqu a 30-36 mois) si risque hemorragique acceptable.' },
      ],
    }
  },
  interpretation: 'Le **score DAPT** (Dual AntiPlatelet Therapy) aide a decider de la duree de la bitherpie antiplaquettaire apres pose d un stent coronaire.\n\n- **Score >= 2** : benefice a prolonger la DAPT au-dela de 12 mois (reduction des IDM et thromboses de stent)\n- **Score < 2** : pas de benefice significatif a prolonger au-dela de 12 mois\n\nLe score DAPT predit le benefice ischemique a prolonger la DAPT (et non le risque hemorragique). Il doit etre utilise AVEC le score PRECISE-DAPT.',
  clinicalCommentary: 'Le score DAPT evalue le BENEFICE ischemique d une DAPT prolongee, pas le risque. Associez-le au PRECISE-DAPT pour le risque hemorragique. Les guidelines ESC 2023 recommandent un score DAPT >= 2 pour envisager une DAPT > 12 mois. Attention : si le patient saigne ou a un PRECISE-DAPT eleve, meme un DAPT >= 2 ne justifie pas de prolonger.',
  references: [
    {
      type: 'pubmed',
      title: 'Yeh RW et al. Development and validation of a prediction rule for benefit and harm of dual antiplatelet therapy. JAMA 2016',
      pmid: '26975783',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines for the management of acute coronary syndromes 2023',
      url: 'https://doi.org/10.1093/eurheartj/ehad191',
    },
  ],
}
export default dapt
