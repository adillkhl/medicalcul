import type { FormulaDefinition } from '../types'

const hasbled: FormulaDefinition = {
  id: 'hasbled',
  slug: 'hasbled',
  name: 'HAS-BLED (Risque hemorragique sous anticoagulants pour ACFA)',
  specialty: 'cardiologie',
  category: 'Fibrillation auriculaire',
  description: 'Score de risque hemorragique a 1 an chez les patients sous anticoagulants oraux pour fibrillation auriculaire',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    { id: 'hta', type: 'boolean', label: 'Hypertension non controlee (PAS > 160 mmHg)', weight: 1 },
    { id: 'renal', type: 'boolean', label: 'Insuffisance renale severe (dialyse, creatinine > 200 umol/L)', weight: 1 },
    { id: 'hepatique', type: 'boolean', label: 'Insuffisance hepatique severe (cirrhose, bilirubine > 2xN, transaminases > 3xN)', weight: 1 },
    { id: 'avc', type: 'boolean', label: 'Antecedent d AVC ischemique ou hemorragique', weight: 1 },
    { id: 'saignement', type: 'boolean', label: 'Antecedent de saignement ou predisposition', weight: 1 },
    { id: 'inr_labile', type: 'boolean', label: 'INR labile si sous AVK (TTR < 60 %)', weight: 1 },
    { id: 'age_65', type: 'boolean', label: 'Age > 65 ans', weight: 1 },
    { id: 'medicaments', type: 'boolean', label: 'Medicaments favorisant saignements (antiagregants, AINS)', weight: 1 },
    { id: 'alcool', type: 'boolean', label: 'Alcool (>= 8 verres/semaine)', weight: 1 },
  ],
  calculate: (values) => {
    let score = 0
    if (values.hta) score += 1
    if (values.renal) score += 1
    if (values.hepatique) score += 1
    if (values.avc) score += 1
    if (values.saignement) score += 1
    if (values.inr_labile) score += 1
    if (values.age_65) score += 1
    if (values.medicaments) score += 1
    if (values.alcool) score += 1

    let severity: 'low' | 'moderate' | 'high' = 'low'
    if (score <= 1) severity = 'low'
    else if (score === 2) severity = 'moderate'
    else severity = 'high'

    return {
      value: score,
      severity,
      label: score <= 1 ? 'Risque hemorragique faible' : score === 2 ? 'Risque hemorragique modere' : 'Risque hemorragique eleve',
      risk: score <= 1 ? 1.3 : score === 2 ? 3.7 : 6.7,
      riskUnit: '% hemorragies majeures/an',
      ranges: [
        { min: 0, max: 1, label: 'Risque faible', severity: 'low', recommendation: 'Risque hemorragique faible (0.9-1.9 %/an). Anticoagulation possible sans precaution particuliere.' },
        { min: 2, max: 2, label: 'Risque modere', severity: 'moderate', recommendation: 'Risque modere (2.0-3.7 %/an). Surveillance rapprochee. Corriger facteurs reversibles (INR, HTA, alcool).' },
        { min: 3, max: 9, label: 'Risque eleve', severity: 'high', recommendation: 'Risque eleve (3.7-8.7 %/an). Prudence maximale. Peser soigneusement balance benefice/risque. Corriger facteurs reversibles.' },
      ],
    }
  },
  interpretation: `Le **score HAS-BLED** evalue le risque hemorragique a 1 an chez les patients sous anticoagulants oraux pour fibrillation auriculaire.

- **Score 0-1** : risque faible (0.9-1.9 % hemorragies majeures/an)
- **Score 2** : risque modere (2.0-3.7 %/an)
- **Score >= 3** : risque eleve (3.7-8.7 %/an)

Un score >= 3 indique une vigilance maximale mais n’est pas une contre-indication absolue a l’anticoagulation. L\'objectif est d’identifier les patients necessitant une surveillance renforcee.`,
  clinicalCommentary: `A utiliser systematiquement avec le CHA2DS2-VA pour guider la decision d\'anticoagulation. Un HAS-BLED eleve ne doit pas conduire a priver un patient d\'anticoagulation quand le CHA2DS2-VA l’indique - il invite a la vigilance. Les AODs ont un meilleur profil de securite que les AVK. Le critere INR labile ne concerne que les AVK ; si le patient est sous AOD, ce point est a 0.`,
  references: [
    {
      type: 'pubmed',
      title: 'Pisters R et al. A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation. Chest 2010',
      pmid: '20663822',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines for the management of atrial fibrillation 2024',
      url: 'https://doi.org/10.1093/eurheartj/ehad702',
    },
  ],
}
export default hasbled
