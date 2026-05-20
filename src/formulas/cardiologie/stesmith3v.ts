import type { FormulaDefinition } from '../types'

const stesmith3v: FormulaDefinition = {
  id: 'stesmith3v',
  slug: 'stesmith3v',
  name: 'Elevation ST par Smith (Equation 3 variables)',
  specialty: 'cardiologie',
  category: 'ECG',
  description: 'Equation de Smith a 3 variables pour differencier sus-ST du SCA vs repolarisation precoce',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'st_elev_v3', type: 'number', label: 'Sous-décalage ST 60 ms après J point en V3', unit: 'mm', min: -10, max: 10, step: 0.5, placeholder: 'Ex: 1.5' },
    { id: 'racine_t_v1', type: 'number', label: 'Amplitude de l\'onde T négative en V1 (si négative, valeur negative)', unit: 'mm', min: -30, max: 30, step: 0.5, placeholder: 'Ex: -2' },
    { id: 'st_elev_v4', type: 'number', label: 'Sous-décalage ST 60 ms après J point en V4', unit: 'mm', min: -10, max: 10, step: 0.5, placeholder: 'Ex: 2' },
  ],
  calculate: (values) => {
    const stV3 = Number(values.st_elev_v3)
    const tV1 = Number(values.racine_t_v1)
    const stV4 = Number(values.st_elev_v4)

    const resultat = -0.065 * (stV3 * 0.1) - 0.212 * (tV1 * 0.1) + 0.082 * (stV4 * 0.1) - 0.043
    const r_sm = Math.exp(resultat) / (1 + Math.exp(resultat))
    const probPct = parseFloat((r_sm * 100).toFixed(1))

    const isPositive = r_sm > 0.5

    return {
      value: parseFloat(resultat.toFixed(4)),
      label: isPositive ? 'Smith 3v POSITIF (SCA suspecte)' : 'Smith 3v NEGATIF (repolarisation precoce probable)',
      risk: probPct,
      riskUnit: '% probabilite SCA',
      severity: isPositive ? 'high' : 'low',
      details: { 'Equation (log odds)': resultat.toFixed(4), 'Probabilite SCA': `${probPct}%` },
      ranges: [
        { min: -10, max: 0, label: 'SCA peu probable (< 50 %)', severity: 'low', recommendation: 'Repolarisation precoce ou autre diagnostic. Surveillance ECG, dosage troponine si doute clinique.' },
        { min: 0, max: 10, label: 'SCA probable (> 50 %)', severity: 'high', recommendation: 'SCA suspecte. Dosage troponine, coronarographie en urgence si clinique compatible.' },
      ],
    }
  },
  interpretation: `L'**equation de Smith a 3 variables** est un outil ECG qui aide a differencier un sus-ST lie a un syndrome coronarien aigu (SCA) d’une repolarisation precoce benigne.

Le modele utilise une regression logistique integrant 3 variables ECG :
1. Sous-decalage ST a 60 ms apres J point en V3
2. Amplitude de l’onde T negative en V1
3. Sous-decalage ST a 60 ms apres J point en V4

**Probabilite > 50 %** : SCA suspecte -> coronarographie
**Probabilite < 50 %** : repolarisation precoce probable -> surveillance

Cette equation est particulierement utile chez les hommes jeunes avec sus-ST anterieur.`,
  clinicalCommentary: `L'equation de Smith est surtout utile chez les hommes < 50 ans avec sus-ST antero-septal et suspicion de repolarisation precoce. Elle a ete validee dans des populations avec sus-ST et troponine negative initiale. Attention : elle ne remplace pas l'evaluation clinique, la troponine et les algorithmes standards. Utilisez-la comme outil d’aide a la decision aux urgences devant un ECG suspect.`,
  references: [
    {
      type: 'pubmed',
      title: 'Smith SW et al. Differentiation of ST elevation myocardial infarction from early repolarization using electrocardiographic criteria. Am J Cardiol 2013',
      pmid: '23725911',
    },
    {
      type: 'pubmed',
      title: 'Driver BE et al. Validation of the Smith vs modified Sgarbossa criteria for LBBB. J Electrocardiol 2017',
      pmid: '27908494',
    },
  ],
}
export default stesmith3v
