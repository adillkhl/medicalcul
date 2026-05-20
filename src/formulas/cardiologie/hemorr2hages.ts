import type { FormulaDefinition } from '../types'

const hemorr2hages: FormulaDefinition = {
  id: 'hemorr2hages',
  slug: 'hemorr2hages',
  name: 'Hemorr2hages (Risque hemorragique sous AVK pour ACFA)',
  specialty: 'cardiologie',
  category: 'Fibrillation auriculaire',
  description: 'Score de risque hemorragique chez les patients sous AVK pour fibrillation auriculaire non valvulaire',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'insuffisance_hepatique', type: 'boolean', label: 'Insuffisance hepatique ou renale severe (cirrhose, creatinine > 200 umol/L)', weight: 1 },
    { id: 'insuffisance_renale', type: 'boolean', label: 'Insuffisance renale severe (dialyse, creatinine > 200 umol/L)', weight: 1 },
    { id: 'alcool', type: 'boolean', label: 'Alcoolisme (>= 8 verres/semaine)', weight: 1 },
    { id: 'cancer', type: 'boolean', label: 'Cancer actif ou antecedent', weight: 1 },
    { id: 'age_75', type: 'boolean', label: 'Age > 75 ans', weight: 1 },
    { id: 'plaquettes', type: 'boolean', label: 'Thrombopenie (plaquettes < 75 G/L)', weight: 1 },
    { id: 'saignement', type: 'boolean', label: 'Antecedent de saignement (AVC hemorragique, hemorragie digestive, etc.)', weight: 2 },
    { id: 'hta_non_controlee', type: 'boolean', label: 'HTA non controlee (PAS > 160 mmHg)', weight: 1 },
    { id: 'anemie', type: 'boolean', label: 'Anemie', weight: 1 },
    { id: 'genetique', type: 'boolean', label: 'Facteurs genetiques (CYP2C9 / VKORC1) - si connus', weight: 1 },
    { id: 'risque_chute', type: 'boolean', label: 'Risque de chute eleve (neurologique, orthopedique)', weight: 1 },
    { id: 'avc_hemorragique', type: 'boolean', label: 'Antecedent d AVC hemorragique', weight: 1 },
  ],
  calculate: (values) => {
    let score = 0
    if (values.insuffisance_hepatique) score += 1
    if (values.insuffisance_renale) score += 1
    if (values.alcool) score += 1
    if (values.cancer) score += 1
    if (values.age_75) score += 1
    if (values.plaquettes) score += 1
    if (values.saignement) score += 2
    if (values.hta_non_controlee) score += 1
    if (values.anemie) score += 1
    if (values.genetique) score += 1
    if (values.risque_chute) score += 1
    if (values.avc_hemorragique) score += 1

    let label = ''
    let severity: 'low' | 'moderate' | 'high' = 'low'
    if (score <= 1) { label = 'Risque hemorragique faible'; severity = 'low' }
    else if (score <= 3) { label = 'Risque hemorragique modere'; severity = 'moderate' }
    else { label = 'Risque hemorragique eleve'; severity = 'high' }

    return {
      value: score,
      label,
      severity,
      risk: score <= 1 ? 1.9 : score <= 3 ? 3.7 : 8.4,
      riskUnit: '% hemorragies majeures/an',
      ranges: [
        { min: 0, max: 1, label: 'Risque faible', severity: 'low', recommendation: 'Surveillance standard. Anticoagulation par AVK possible avec suivi INR usuel.' },
        { min: 2, max: 3, label: 'Risque modere', severity: 'moderate', recommendation: 'Surveillance INR renforcee. Discuter AOD si indication validee. Corriger facteurs reversibles.' },
        { min: 4, max: 12, label: 'Risque eleve', severity: 'high', recommendation: 'Prudence maximale. Si indication formelle d anticoagulation, preferer AOD. Corriger tous les facteurs de risque reversibles.' },
      ],
    }
  },
  interpretation: `Le **score HEMORR2HAGES** (Hepatic/Renal, Ethanol, Malignancy, Older, Reduced Platelet count, Rebleeding risk, Hypertension, Anemia, Genetic, Excessive fall risk, Stroke) est un score de risque hemorragique specifiquement pour les patients sous AVK.

- **0-1** : risque faible (1.9 %/an)
- **2-3** : risque modere (3.7 %/an)
- **>= 4** : risque eleve (8.4 %/an)

Il est plus complet que le HAS-BLED mais moins utilise en pratique courante. Il prend en compte des facteurs genetiques (CYP2C9, VKORC1) et le risque de chute.`,
  clinicalCommentary: `Le HEMORR2HAGES est un score plus ancien et moins utilise que le HAS-BLED. Il est plus specifique des AVK (inclut les facteurs genetiques). Pas tres utile si le patient est sous AOD. Avec les AOD, HAS-BLED reste le score recommande par les guidelines ESC. Mention historique interessante : le nom du score vient de la repetition de "H" (HEMORR2HAGES) correspondant aux 12 items.`,
  references: [
    {
      type: 'pubmed',
      title: 'Gage BF et al. Clinical classification schemes for predicting hemorrhage: results from the National Registry of Atrial Fibrillation (NRAF). Am Heart J 2006',
      pmid: '16442906',
    },
    {
      type: 'url',
      title: 'Outil MDCalc: HEMORR2HAGES bleeding risk score',
      url: 'https://www.mdcalc.com/calc/170/hemorr2hages-bleeding-risk-score',
    },
  ],
}
export default hemorr2hages
