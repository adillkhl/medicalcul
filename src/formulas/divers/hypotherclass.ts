import type { FormulaDefinition } from '../types'

const hypotherclass: FormulaDefinition = {
  id: 'hypotherclass', slug: 'hypotherclass',
  name: 'Classification de l\'Hypothermie',
  specialty: 'divers', category: 'Urgences',
  description: 'Classification de la sévérité de l\'hypothermie accidentelle selon la température centrale',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'temp_centrale', type: 'number', label: 'Température centrale (°C)', min: 20, max: 37, step: 0.1 },
  ],
  calculate: (values) => {
    const t = values.temp_centrale ?? 37
    let grade = 'Normale', sev = 'low' as 'high'|'moderate'|'low'
    if (t >= 35) { grade = 'Normale (>35°C)'; sev = 'low' }
    else if (t >= 32) { grade = 'Hypothermie légère (32-35°C)'; sev = 'moderate' }
    else if (t >= 28) { grade = 'Hypothermie modérée (28-32°C)'; sev = 'high' }
    else if (t >= 24) { grade = 'Hypothermie sévère (24-28°C)'; sev = 'high' }
    else { grade = 'Hypothermie profonde (<24°C)'; sev = 'high' }
    return { value: t, label: grade, severity: sev }
  },
  interpretation: 'Hypothermie légère : frissons, tachycardie. Modérée : arrêt frissons, somnolence. Sévère : coma, risque AC/FA. Profonde : pronostic vital.',
  clinicalCommentary: 'Réévaluer la T° rectale/œsophagienne. L\'hypothermie sévère modifie le métabolisme des médicaments. Réchauffement actif externe en légère, interne/ECMO si sévère.',
  references: [{ type: 'pubmed', title: 'Brown DJA et al. Accidental hypothermia. NEJM 2012' }],
}
export default hypotherclass
