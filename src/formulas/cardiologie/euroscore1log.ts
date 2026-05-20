import type { FormulaDefinition } from '../types'

const euroscore1log: FormulaDefinition = {
  id: 'euroscore1log',
  slug: 'euroscore1log',
  name: 'EuroSCORE Logistique (Risque de mortalite en chirurgie cardiaque)',
  specialty: 'cardiologie',
  category: 'Chirurgie cardiaque',
  description: 'Score europeen de risque de mortalite operatoire en chirurgie cardiaque (version logistique originale)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Age du patient', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 65' },
    { id: 'sexe_feminin', type: 'boolean', label: 'Sexe feminin', weight: 1 },
    { id: 'creatinine', type: 'number', label: 'Creatininemie pre-operatoire', unit: 'umol/L', min: 20, max: 1000, step: 1, placeholder: 'Ex: 100' },
    { id: 'FEVG', type: 'radio', label: 'Fraction d ejection ventriculaire gauche',
      options: [
        { value: 0, label: 'FEVG > 50 % (normale)' },
        { value: 1, label: 'FEVG 30-50 % (moderement alteree)' },
        { value: 2, label: 'FEVG < 30 % (severement alteree)' },
      ] },
    { id: 'hta_pulm', type: 'boolean', label: 'Hypertension pulmonaire (PAPs > 60 mmHg)', weight: 1 },
    { id: 'urgence', type: 'boolean', label: 'Intervention en urgence (avant le lendemain)', weight: 1 },
    { id: 'endocardite', type: 'boolean', label: 'Endocardite active', weight: 1 },
    { id: 'chirurgie_complexe', type: 'boolean', label: 'Chirurgie combinee (plusieurs valves ou pontage + valve)', weight: 1 },
    { id: 'chir_redos', type: 'boolean', label: 'Chirurgie de reprise (re-operation)', weight: 1 },
    { id: 'aomi', type: 'boolean', label: 'Arteriopathie peripherique', weight: 1 },
    { id: 'neuro', type: 'boolean', label: 'Maladie neurologique severe (AVC, AIT)', weight: 1 },
    { id: 'bpco', type: 'boolean', label: 'BPCO severe', weight: 1 },
    { id: 'post_idm', type: 'boolean', label: 'Post-infarctus recent (< 90 jours)', weight: 1 },
    { id: 'instable', type: 'boolean', label: 'Angor instable sous heparine IV', weight: 1 },
  ],
  calculate: (values) => {
    const age = Number(values.age)
    const creatinine = Number(values.creatinine)

    let score = 0
    score += age > 60 ? (age - 60) / 5 : 0
    if (values.sexe_feminin) score += 1
    score += creatinine > 200 ? 2 : creatinine > 100 ? 1 : 0
    score += Number(values.FEVG)
    if (values.hta_pulm) score += 2
    if (values.urgence) score += 2
    if (values.endocardite) score += 3
    if (values.chirurgie_complexe) score += 2
    if (values.chir_redos) score += 2
    if (values.aomi) score += 2
    if (values.neuro) score += 2
    if (values.bpco) score += 2
    if (values.post_idm) score += 2
    if (values.instable) score += 2

    const mortalite = Math.min(99, parseFloat((Math.exp(score - 4.7) / (1 + Math.exp(score - 4.7)) * 100).toFixed(1)))

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    if (mortalite < 2) severity = 'low'
    else if (mortalite < 5) severity = 'moderate'
    else if (mortalite < 10) severity = 'high'
    else severity = 'critical'

    return {
      value: parseFloat(score.toFixed(2)),
      label: `Risque de mortalite : ${mortalite}%`,
      risk: mortalite,
      riskUnit: '% mortalite operatoire',
      severity,
      ranges: [
        { min: 0, max: 2, label: 'Risque faible (< 2 %)', severity: 'low', recommendation: 'Chirurgie envisagee sans sur-risque majeur. Surveillance post-operatoire standard.' },
        { min: 2, max: 5, label: 'Risque modere (2-5 %)', severity: 'moderate', recommendation: 'Optimisation pre-operatoire. Soins intensifs post-operatoires systematiques.' },
        { min: 5, max: 10, label: 'Risque eleve (5-10 %)', severity: 'high', recommendation: 'Discussion multidisciplinaire. Optimiser etat clinique avant chirurgie. Alternatives percutanees a discuter.' },
        { min: 10, max: 100, label: 'Risque tres eleve (> 10 %)', severity: 'critical', recommendation: 'Risque prohibitif. Discuter alternatives (TAVI, angioplastie, traitement medical). Reunion de concertation pluridisciplinaire.' },
      ],
    }
  },
  interpretation: `L'**EuroSCORE logistique** est un modele de prediction de la mortalite operatoire en chirurgie cardiaque (pontage, chirurgicale valvulaire ou combinee).

- **< 2 %** : risque faible
- **2-5 %** : risque modere
- **5-10 %** : risque eleve
- **> 10 %** : risque tres eleve (prohibitif)

Developpe a partir d’une base europeenne de 19 030 patients (1995), il a ete largement valide. Attention : il a tendance a surestimer le risque chez les patients a haut risque par rapport a EuroSCORE II (2008).`,
  clinicalCommentary: `L\'EuroSCORE logistique surestime la mortalite chez les patients a haut risque. La version EuroSCORE II (2008) est plus precise et recommandee actuellement. Ce calculateur implemente la version logistique originale. Utilisez EuroSCORE II pour la pratique clinique courante. L\'EuroSCORE est un outil d’aide a la decision, pas un substitut au jugement clinique. Il ne predit pas les complications non fatales.`,
  references: [
    {
      type: 'pubmed',
      title: 'Nashef SA et al. European system for cardiac operative risk evaluation (EuroSCORE). Eur J Cardiothorac Surg 1999',
      pmid: '10498619',
    },
    {
      type: 'pubmed',
      title: 'Roques F et al. The logistic EuroSCORE. Eur Heart J 2003',
      pmid: '12821454',
    },
  ],
}
export default euroscore1log
