import type { FormulaDefinition } from '../types'

const hasbled: FormulaDefinition = {
  id: 'has-bled',
  slug: 'has-bled',
  name: 'HAS-BLED',
  specialty: 'urgence',
  category: 'Cardiologie',
  description: 'Risque hémorragique sous anticoagulants oraux chez les patients en fibrillation auriculaire',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    { id: 'hta', type: 'boolean', label: 'Hypertension non contrôlée (PAS &gt; 160 mmHg)', weight: 1 },
    { id: 'renal', type: 'boolean', label: 'Insuffisance rénale sévère (dialyse, transplant, créat &gt; 200 µmol/L)', weight: 1 },
    { id: 'hepatique', type: 'boolean', label: 'Insuffisance hépatique sévère (cirrhose, bilirubine &gt; 2×N, TGO/TGP &gt; 3×N)', weight: 1 },
    { id: 'avc', type: 'boolean', label: 'Antécédent d\'AVC', weight: 1 },
    { id: 'saignement', type: 'boolean', label: 'Antécédent ou prédisposition au saignement', weight: 1 },
    { id: 'inr_labile', type: 'boolean', label: 'INR labile si sous AVK (TTR &lt; 60 %)', weight: 1 },
    { id: 'age_65', type: 'boolean', label: 'Âge &gt; 65 ans', weight: 1 },
    { id: 'medicaments', type: 'boolean', label: 'Médicaments favorisant les saignements (antiplaquettaires, AINS)', weight: 1 },
    { id: 'alcool', type: 'boolean', label: 'Alcool (≥ 8 verres/semaine)', weight: 1 },
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

    return {
      value: score,
      severity: score <= 1 ? 'low' : score === 2 ? 'moderate' : 'high',
      ranges: [
        {
          min: 0, max: 1, label: 'Risque faible',
          severity: 'low',
          recommendation: 'Risque hémorragique faible. L\'anticoagulation peut être initiée sans précaution particulière.',
        },
        {
          min: 2, max: 2, label: 'Risque modéré', severity: 'moderate',
          recommendation: 'Risque hémorragique modéré. Surveillance rapprochée et correction des facteurs de risque réversibles.',
        },
        {
          min: 3, max: 9, label: 'Risque élevé', severity: 'high',
          recommendation: 'Prudence maximale. Peser soigneusement la balance bénéfice/risque. Corriger les facteurs réversibles. Surveillance rapprochée.',
        },
      ],
    }
  },
  interpretation: `Le score HAS-BLED évalue le risque hémorragique à 1 an chez les patients sous anticoagulants oraux pour fibrillation auriculaire.

• **Score 0–1** : risque faible (0,9–1,9 % hémorragies majeures/an)
• **Score 2** : risque modéré (2,0–3,7 %/an)
• **Score ≥ 3** : risque élevé (3,7–8,7 %/an)

Score ≥ 3 = vigilance maximale, mais n’est pas une contre-indication absolue à l’anticoagulation. L'objectif est d’identifier les patients nécessitant une surveillance renforcée et une correction des facteurs réversibles (INR, HTA, alcool, médicaments).`,
  clinicalCommentary: `À utiliser systématiquement avec le CHA₂DS₂-VASc pour guider la décision d'anticoagulation. Un score HAS-BLED élevé ne doit pas conduire à priver un patient d'anticoagulation quand le CHA₂DS₂-VASc l’indique — il invite à la vigilance et au suivi. Les AODs (dabigatran, rivaroxaban, apixaban, edoxaban) ont un meilleur profil de sécurité que les AVK. Note : le critère "INR labile" ne concerne que les AVK ; si le patient est sous AOD, ce point est à 0.`,
  references: [
    {
      type: 'pubmed',
      title: 'HAS-BLED bleeding risk score in atrial fibrillation',
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
