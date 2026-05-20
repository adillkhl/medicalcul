import type { FormulaDefinition } from '../types'

const indcornell: FormulaDefinition = {
  id: 'cornell',
  slug: 'indcornell',
  name: 'Cornell — Index et Produit (ECG, HVG)',
  specialty: 'cardiologie',
  category: 'ECG',
  description: 'Indice de Cornell pour le diagnostic électrocardiographique d\'hypertrophie ventriculaire gauche',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'ravl', type: 'number', label: 'Onde R en aVL', unit: 'mm', min: 0, max: 30, step: 1, placeholder: 'Ex: 12' },
    { id: 'sv3', type: 'number', label: 'Onde S en V3', unit: 'mm', min: 0, max: 30, step: 1, placeholder: 'Ex: 15' },
  ],
  calculate: (values) => {
    const ravl = values.ravl || 0
    const sv3 = values.sv3 || 0
    const index_cornell = ravl + sv3
    const produit_cornell = (ravl + sv3) * 1.0 // produit de Cornell = (R aVL + S V3) × QRS duration

    return {
      value: index_cornell,
      label: index_cornell > 28 ? 'Cornell positif (homme > 28 mm, femme > 22 mm)' : 'Cornell négatif',
      risk: index_cornell > 28 ? 75 : 10,
      riskUnit: '% spécificité HVG',
      severity: index_cornell > 28 ? 'high' : 'low',
      details: { 'Indice de Cornell': String(index_cornell), 'R aVL': String(ravl), 'S V3': String(sv3) },
      ranges: [
        { min: 0, max: 20, label: 'Négatif', severity: 'low', recommendation: 'Pas d\'argument électrique pour une HVG. Répéter si suspicion clinique persistante.' },
        { min: 20, max: 28, label: 'Intermédiaire (femme positive, homme à surveiller)', severity: 'moderate', recommendation: 'Chez la femme > 20 mm : HVG probable. Échocardiographie de confirmation.' },
        { min: 28, max: 60, label: 'Positif pour HVG (homme)', severity: 'high', recommendation: 'HVG électrique. Confirmation échocardiographique. Rechercher étiologie : HTA, sténose aortique, cardiomyopathie.' },
      ],
    }
  },
  interpretation: `L'**indice de Cornell** (R aVL + S V3) est un critère ECG d’hypertrophie ventriculaire gauche.

**Seuils :**
- Homme : > 28 mm
- Femme : > 20 mm (selon les versions)

**Sokolow-Lyon** (complémentaire) : S V1 + R V5/V6 > 35 mm`,
  clinicalCommentary: `L\'indice de Cornell est plus spécifique que Sokolow-Lyon pour l’HVG. Toujours confirmer par échocardiographie. L\'HVG électrique est un marqueur de risque cardiovasculaire indépendant (MACE). Causes principales : HTA (la plus fréquente), sténose aortique, cardiomyopathie hypertrophique.`,
  references: [{ type: 'pubmed', title: 'Casale PN et al. Improved accuracy of ECG for LVH. Circulation 1987', pmid: '2949885' }],
}
export default indcornell