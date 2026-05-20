import type { FormulaDefinition } from '../types'

const crusade: FormulaDefinition = {
  id: 'crusade',
  slug: 'crusade',
  name: 'CRUSADE (Score de risque hémorragique SCA non ST+)',
  specialty: 'cardiologie',
  category: 'Syndrome coronarien aigu',
  description: 'Score de risque hémorragique chez les patients avec syndrome coronarien aigu sans sus-ST (SCA non ST+)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    { id: 'hemodynamique', type: 'radio', label: 'Statut hémodynamique à l\'admission',
      options: [
        { value: 0, label: 'Normal (PAS > 100 mmHg, FC < 100/min)' },
        { value: 3, label: 'Tachycardie (FC ≥ 100/min) isolée' },
        { value: 5, label: 'Hypotension (PAS ≤ 100 mmHg) avec ou sans tachycardie' },
      ] },
    { id: 'insuffisance_cardiaque', type: 'boolean', label: 'Signes d\'insuffisance cardiaque à l\'admission', weight: 2 },
    { id: 'diabete', type: 'boolean', label: 'Diabète', weight: 1 },
    { id: 'creatinine', type: 'radio', label: 'Créatinine à l\'admission (clairance Cockcroft)',
      options: [
        { value: 0, label: 'ClCr > 60 mL/min' },
        { value: 2, label: 'ClCr 30–60 mL/min' },
        { value: 5, label: 'ClCr < 30 mL/min' },
      ] },
    { id: 'hematocrite', type: 'radio', label: 'Hématocrite à l\'admission',
      options: [
        { value: 0, label: 'Ht ≥ 36 %' },
        { value: 4, label: 'Ht < 36 %' },
      ] },
    { id: 'sexe_feminin', type: 'boolean', label: 'Sexe féminin', weight: 1 },
    { id: 'poids', type: 'radio', label: 'Poids',
      options: [
        { value: 0, label: 'Poids > 60 kg' },
        { value: 2, label: 'Poids ≤ 60 kg' },
      ] },
  ],
  calculate: (values) => {
    let score = 0
    score += Number(values.hemodynamique)
    if (values.insuffisance_cardiaque) score += 2
    if (values.diabete) score += 1
    score += Number(values.creatinine)
    score += Number(values.hematocrite)
    if (values.sexe_feminin) score += 1
    score += Number(values.poids)

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'

    if (score <= 20) { label = 'Risque hémorragique très faible'; severity = 'low' }
    else if (score <= 30) { label = 'Risque hémorragique faible'; severity = 'low' }
    else if (score <= 40) { label = 'Risque hémorragique modéré'; severity = 'moderate' }
    else if (score <= 50) { label = 'Risque hémorragique élevé'; severity = 'high' }
    else { label = 'Risque hémorragique très élevé'; severity = 'critical' }

    return {
      value: score,
      label,
      severity,
      risk: score <= 20 ? 3.1 : score <= 30 ? 5.5 : score <= 40 ? 8.6 : score <= 50 ? 11.9 : 15.3,
      riskUnit: '% risque hémorragies majeures',
      ranges: [
        { min: 0, max: 20, label: 'Très faible risque', severity: 'low', recommendation: 'Stratégie invasive précoce possible avec risque minimal de saignement.' },
        { min: 21, max: 30, label: 'Faible risque', severity: 'low', recommendation: 'Stratégie invasive standard. Surveillance clinique.' },
        { min: 31, max: 40, label: 'Risque modéré', severity: 'moderate', recommendation: 'Privilégier abord radial. Utiliser bivalirudine ou fondaparinux si anticoagulation.' },
        { min: 41, max: 50, label: 'Risque élevé', severity: 'high', recommendation: 'Abord radial obligatoire. Anticoagulation prudente. Discuter délai de la coronarographie.' },
        { min: 51, max: 100, label: 'Risque très élevé', severity: 'critical', recommendation: 'Précautions maximales. Abord radial exclusif. Surveillance rapprochée. Ponderer l\'urgence de la revascularisation.' },
      ],
    }
  },
  interpretation: `Le **score CRUSADE** estime le risque hémorragique chez les patients hospitalisés pour syndrome coronarien aigu sans sus-ST (SCA non ST+).

- **≤ 20** : très faible risque (3,1 % hémorragies majeures)
- **21–30** : faible risque (5,5 %)
- **31–40** : modéré (8,6 %)
- **41–50** : élevé (11,9 %)
- **> 50** : très élevé (15,3 %)

Le score aide à guider le choix de la voie d’abord (radial vs fémoral), le type et la durée de l’anticoagulation.`,
  clinicalCommentary: `Le CRUSADE est validé pour les SCA non ST+, pas pour les ST+. L'abord radial est associé à une réduction significative des complications hémorragiques par rapport au fémoral, surtout chez les patients à haut risque CRUSADE. Le score a été développé à partir de données américaines (2001–2003) ; les pratiques ont évolué (AOD, abord radial), mais il reste utile pour stratifier le risque. Attention : ne pas utiliser ce score pour décider de ne pas anticoaguler — il guide les précautions.`,
  references: [
    {
      type: 'pubmed',
      title: 'Subherwal S et al. Baseline risk of major bleeding in non-ST-segment-elevation myocardial infarction: the CRUSADE bleeding score. Circulation 2009',
      pmid: '19597049',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines for the management of acute coronary syndromes 2023',
      url: 'https://doi.org/10.1093/eurheartj/ehad191',
    },
  ],
}
export default crusade
