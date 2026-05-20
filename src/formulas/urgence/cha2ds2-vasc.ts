import type { FormulaDefinition } from '../types'

const cha2ds2vasc: FormulaDefinition = {
  id: 'cha2ds2-vasc',
  slug: 'cha2ds2-vasc',
  name: 'CHA₂DS₂-VASc',
  specialty: 'urgence',
  category: 'Cardiologie',
  description: 'Risque embolique sur fibrillation auriculaire non valvulaire',
  version: '2024',
  lastValidated: '2024-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'insuffisance_cardiaque',
      type: 'boolean',
      label: 'Insuffisance cardiaque ou FEVG ≤ 40 %',
      weight: 1,
    },
    {
      id: 'hypertension',
      type: 'boolean',
      label: 'Hypertension artérielle',
      weight: 1,
    },
    {
      id: 'age_75',
      type: 'boolean',
      label: 'Âge ≥ 75 ans',
      weight: 2,
    },
    {
      id: 'diabete',
      type: 'boolean',
      label: 'Diabète',
      weight: 1,
    },
    {
      id: 'avc',
      type: 'boolean',
      label: 'Antécédent d\'AVC, AIT ou embolie systémique',
      weight: 2,
    },
    {
      id: 'vasculaire',
      type: 'boolean',
      label: 'Antécédent de maladie vasculaire (AOMI, IDM, plaque aortique)',
      weight: 1,
    },
    {
      id: 'age_65',
      type: 'boolean',
      label: 'Âge entre 65 et 74 ans',
      weight: 1,
    },
    {
      id: 'sexe_feminin',
      type: 'boolean',
      label: 'Sexe féminin',
      weight: 1,
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.insuffisance_cardiaque) score += 1
    if (values.hypertension) score += 1
    if (values.age_75) score += 2
    if (values.diabete) score += 1
    if (values.avc) score += 2
    if (values.vasculaire) score += 1
    if (values.age_65) score += 1
    // Sexe féminin ne compte que si ≥ 65 ans (recommandations 2012-2023)
    if (values.sexe_feminin && (values.age_65 || values.age_75)) score += 1

    const risks = [0.78, 2.01, 3.71, 5.92, 9.27, 15.26, 19.74, 21.5, 22.38, 23.64]

    return {
      value: score,
      risk: risks[Math.min(score, 9)] ?? 0,
      riskUnit: '% par an',
      severity: score === 0 ? 'low' : score === 1 ? 'moderate' : 'high',
      ranges: [
        { min: 0, max: 0, risk: 0.78, label: 'Risque faible', severity: 'low',
          recommendation: 'Pas d\'anticoagulation. FA isolée idiopathique.' },
        { min: 1, max: 1, risk: 2.01, label: 'Risque modéré', severity: 'moderate',
          recommendation: 'Anticoagulant ou aspirine selon balance bénéfice/risque.' },
        { min: 2, max: 9, risk: undefined, label: 'Risque élevé', severity: 'high',
          recommendation: 'Indication formelle d\'anticoagulation sous réserve d\'un risque hémorragique acceptable.' },
      ],
    }
  },
  interpretation: `Le score CHA₂DS₂-VASc estime le risque annuel d'accident thromboembolique (AVC, embolie systémique) chez les patients avec fibrillation auriculaire non valvulaire. Il guide la décision de mise sous anticoagulant oral.

- **Score = 0** : FA isolée idiopathique → pas d'anticoagulation (ni aspirine)
- **Score = 1** : anticoagulation à discuter (bénéfice/risque)
- **Score ≥ 2** : anticoagulation orale formelle si risque hémorragique acceptable

Le sexe féminin n'est plus pris en compte comme facteur de risque indépendant dans les recommandations ESC 2024 (nouveau score CHA₂DS₂-VA).`,
  clinicalCommentary: `Très utilisé aux urgences pour les patients avec FA documentée. Attention :
• Ne s'applique pas aux valvulopathies mitrales significatives (prothèse ou sténose mitrale rhumatismale) — utiliser le CHA₂DS₂-VASc avec prudence.
• Ne pas utiliser chez les patients avec ACFA et valve mécanique (indication AVK d'emblée).
• L'évaluation du risque hémorragique (HAS-BLED) doit être systématiquement associée.
• Depuis 2024, les recommandations ESC simplifient en retirant le sexe comme facteur → le CHA₂DS₂-VA (sans le "Sc" pour sexe) tend à remplacer ce score.`,
  references: [
    {
      type: 'guideline',
      title: 'ESC Guidelines for the management of atrial fibrillation 2024',
      url: 'https://doi.org/10.1093/eurheartj/ehad702',
    },
    {
      type: 'pubmed',
      title: 'CHA2DS2-VASc score for stroke prediction in atrial fibrillation',
      pmid: '28449119',
    },
    {
      type: 'url',
      title: 'HAS — Fibrillation auriculaire : stratégie thérapeutique',
      url: 'https://www.has-sante.fr/jcms/c_2843282',
    },
  ],
}

export default cha2ds2vasc
