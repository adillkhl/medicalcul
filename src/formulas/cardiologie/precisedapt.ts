import type { FormulaDefinition } from '../types'

const precisedapt: FormulaDefinition = {
  id: 'precise-dapt',
  slug: 'precisedapt',
  name: 'PRECISE-DAPT — Risque hemorragique DAPT',
  specialty: 'cardiologie',
  category: 'Antithrombotique',
  description: 'Score de risque hemorragique pour decider de la duree de la double antiagregation plaquettaire apres stent',
  version: '2024',
  lastValidated: '2024-06',
  evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'radio', label: 'Age', options: [
      { value: 0, label: '< 65 ans' },
      { value: 1, label: '65-74 ans' },
      { value: 2, label: '>= 75 ans' },
    ]},
    { id: 'clcr', type: 'radio', label: 'Clairance creatinine (Cockcroft)', options: [
      { value: 0, label: '>= 60 mL/min' },
      { value: 1, label: '< 60 mL/min et >= 30' },
      { value: 2, label: '< 30 mL/min' },
    ]},
    { id: 'hemoglobine', type: 'radio', label: 'Hemoglobine', options: [
      { value: 0, label: '>= 13 g/dL (H) ou >= 12 g/dL (F)' },
      { value: 1, label: '< 13 / 12 g/dL' },
      { value: 2, label: '< 11 g/dL' },
    ]},
    { id: 'leucocytes', type: 'radio', label: 'Leucocytes', options: [
      { value: 0, label: '< 11 000/mm3' },
      { value: 1, label: '>= 11 000/mm3' },
    ]},
    { id: 'antecedent_saignement', type: 'boolean', label: 'Antecedent de saignement' },
  ],
  calculate: (values) => {
    let s = 0
    const age = values.age ?? 0
    s += age
    s += values.clcr ?? 0
    s += values.hemoglobine ?? 0
    s += values.leucocytes ?? 0
    if (values.antecedent_saignement) s += 1

    return {
      value: s,
      label: s < 10 ? 'Risque faible' : s < 25 ? 'Risque modere' : 'Risque eleve',
      severity: s < 10 ? 'low' : s < 25 ? 'moderate' : 'high',
      risk: s < 10 ? 1.8 : s < 25 ? 3.1 : 5.4,
      riskUnit: '% risque hemorragique',
      ranges: [
        {min: 0, max: 9, label: 'Risque faible (< 10)', severity: 'low', recommendation: 'DAPT courte (1-3 mois) recommandee. Puis AAS seul.'},
        {min: 10, max: 24, label: 'Risque modere (10-24)', severity: 'moderate', recommendation: 'DAPT standard 6-12 mois selon indication. Re-evaluation a 6 mois.'},
        {min: 25, max: 50, label: 'Risque eleve (>= 25)', severity: 'high', recommendation: 'DAPT courte (1 mois) fortement recommandee. Puis clopidogrel seul ou AAS seul. Eviter ticagrelor/prasugrel.'},
      ],
    }
  },
  interpretation: 'Le **PRECISE-DAPT** score (Preventing bleeding complication in patients undergoing stent implantation) evalue le risque hemorragique sous DAPT. 5 items : age, clairance creatinine, Hb, leucocytes, antecedent de saignement. Seuils : < 10 faible, 10-24 modere, >= 25 eleve.',
  clinicalCommentary: 'Le PRECISE-DAPT est le score de reference pour decider de la duree de DAPT. A utiliser systematiquement avant de prescrire une DAPT prolongee. Un score eleve (> 25) contre-indique une DAPT > 1 mois, meme apres IDM.',
  references: [{type: 'pubmed', title: 'Costa F et al. PRECISE-DAPT score. Lancet 2017', pmid: '28494927'}],
}
export default precisedapt
