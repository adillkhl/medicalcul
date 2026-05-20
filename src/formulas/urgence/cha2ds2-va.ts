import type { FormulaDefinition } from '../types'

const cha2ds2va: FormulaDefinition = {
  id: 'cha2ds2-va',
  slug: 'cha2ds2-va',
  name: 'CHA₂DS₂-VA',
  specialty: 'urgence',
  category: 'Cardiologie',
  description: 'Risque embolique sur fibrillation auriculaire non valvulaire — version ESC 2024 sans le sexe',
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

    // Risques annuels d’AVC selon le score CHA2DS2-VA (ESC 2024)
    const risks = [0.8, 2.1, 3.8, 5.9, 9.3, 15.3, 19.7, 21.5, 22.4]

    return {
      value: score,
      risk: risks[Math.min(score, 8)] ?? 0,
      riskUnit: '% par an',
      severity: score === 0 ? 'low' : score === 1 ? 'moderate' : 'high',
      ranges: [
        { min: 0, max: 0, risk: 0.8, label: 'Risque faible', severity: 'low',
          recommendation: 'Pas d\'anticoagulation. FA isolée idiopathique.' },
        { min: 1, max: 1, risk: 2.1, label: 'Risque modéré', severity: 'moderate',
          recommendation: 'Anticoagulant à discuter selon balance bénéfice/risque.' },
        { min: 2, max: 8, risk: undefined, label: 'Risque élevé', severity: 'high',
          recommendation: 'Indication formelle d\'anticoagulation orale sous réserve d\'un risque hémorragique acceptable.' },
      ],
    }
  },
  interpretation: `Le score CHA₂DS₂-VA est la version 2024 des recommandations ESC (European Society of Cardiology). Il remplace progressivement le CHA₂DS₂-VASc.

**Changement clé :** le sexe féminin n’est plus considéré comme un facteur de risque indépendant d’AVC dans la FA. Le sexe n'est plus un item du score.

- **Score = 0** : FA isolée → pas d'anticoagulation
- **Score = 1** : anticoagulation à discuter
- **Score ≥ 2** : anticoagulation orale formelle

Le risque hémorragique (HAS-BLED) doit être systématiquement associé.`,
  clinicalCommentary: `Nouveau score ESC 2024. Simplifie l’ancien CHA₂DS₂-VASc en retirant le sexe féminin (qui compliquait sans améliorer la prédiction). En pratique, pour les femmes de moins de 65 ans sans autre facteur de risque, le score passe de 1 à 0 → pas d’anticoagulation. C'est un changement important. Certaines sociétés savantes, notamment américaines (ACC/AHA), n’ont pas encore adopté ce changement — l’ancien CHA₂DS₂-VASc reste valide aux États-Unis.`,
  references: [
    {
      type: 'guideline',
      title: 'ESC Guidelines for the management of atrial fibrillation 2024',
      url: 'https://doi.org/10.1093/eurheartj/ehad702',
    },
    {
      type: 'pubmed',
      title: 'CHA2DS2-VA vs CHA2DS2-VASc: removal of sex as a risk factor',
      pmid: '38789170',
    },
  ],
}

export default cha2ds2va
