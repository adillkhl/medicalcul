import type { FormulaDefinition } from '../types'

const stesmith4v: FormulaDefinition = {
  id: 'stesmith4v',
  slug: 'stesmith4v',
  name: 'Elevation ST par Smith (Equation 4 variables)',
  specialty: 'cardiologie',
  category: 'ECG',
  description: 'Equation de Smith a 4 variables pour differencier sus-ST du SCA vs repolarisation precoce',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'st_elev_v3', type: 'number', label: 'Sous-decalage ST 60 ms apres J point en V3', unit: 'mm', min: -10, max: 10, step: 0.5, placeholder: 'Ex: 1.5' },
    { id: 'racine_t_v1', type: 'number', label: 'Amplitude onde T negative en V1 (si negative, valeur negative)', unit: 'mm', min: -30, max: 30, step: 0.5, placeholder: 'Ex: -2' },
    { id: 'st_elev_v4', type: 'number', label: 'Sous-decalage ST 60 ms apres J point en V4', unit: 'mm', min: -10, max: 10, step: 0.5, placeholder: 'Ex: 2' },
    { id: 'qrs_penn', type: 'number', label: 'Produit QRS de Cornell (R aVL + S V3) x duree QRS', unit: 'mm*ms', min: 0, max: 10000, step: 10, placeholder: 'Ex: 2500' },
  ],
  calculate: (values) => {
    const stV3 = Number(values.st_elev_v3)
    const tV1 = Number(values.racine_t_v1)
    const stV4 = Number(values.st_elev_v4)
    const qrs = Number(values.qrs_penn)

    const resultat = -0.065 * (stV3 * 0.1) - 0.212 * (tV1 * 0.1) + 0.082 * (stV4 * 0.1) - 0.001 * (qrs * 0.1) - 0.043
    const r_sm = Math.exp(resultat) / (1 + Math.exp(resultat))
    const probPct = parseFloat((r_sm * 100).toFixed(1))

    const isPositive = r_sm > 0.5

    return {
      value: parseFloat(resultat.toFixed(4)),
      label: isPositive ? 'Smith 4v POSITIF (SCA suspecte)' : 'Smith 4v NEGATIF (repolarisation precoce probable)',
      risk: probPct,
      riskUnit: '% probabilite SCA',
      severity: isPositive ? 'high' : 'low',
      details: { 'Equation (log odds)': resultat.toFixed(4), 'Probabilite SCA': `${probPct}%` },
      ranges: [
        { min: -10, max: 0, label: 'SCA peu probable (< 50 %)', severity: 'low', recommendation: 'Repolarisation precoce probable. Surveillance ECG +/- troponine si doute clinique.' },
        { min: 0, max: 10, label: 'SCA probable (> 50 %)', severity: 'high', recommendation: 'SCA suspectee. Troponine, coronarographie en urgence si clinique compatible.' },
      ],
    }
  },
  interpretation: `L'**equation de Smith a 4 variables** est une version enrichie du modele a 3 variables, integrant le produit de Cornell (indice d’HVG) pour ameliorer la discrimination.

Les 4 variables sont :
1. Sous-decalage ST a 60 ms apres J point en V3
2. Amplitude de l’onde T negative en V1
3. Sous-decalage ST a 60 ms apres J point en V4
4. Produit de Cornell (R aVL + S V3) x duree QRS

L'ajout du produit de Cornell permet de mieux distinguer les sus-ST lies a l'HVG de ceux lies au SCA.`,
  clinicalCommentary: `L'equation 4 variables est plus specifique que la version 3 variables grace a l’ajout du produit de Cornell qui corrige pour l'HVG. Utile chez les patients hypertendus avec HVG connue. Meme remarque : ne remplace pas le jugement clinique. Si le patient a une douleur typique + sus-ST, la decision de coronarographie est clinique avant tout.`,
  references: [
    {
      type: 'pubmed',
      title: 'Smith SW et al. Electrocardiographic differentiation of ST-elevation myocardial infarction from early repolarization. Am J Cardiol 2013',
      pmid: '23725911',
    },
    {
      type: 'pubmed',
      title: 'Driver BE et al. A 4-variable formula to differentiate STEMI from early repolarization. J Electrocardiol 2016',
      pmid: '27742105',
    },
  ],
}
export default stesmith4v
