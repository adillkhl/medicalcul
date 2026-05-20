import type { FormulaDefinition } from '../types'

const cardiacSouffle: FormulaDefinition = {
  id: 'cardiac_souffle',
  slug: 'cardiac_souffle',
  name: 'Intensite du souffle cardiaque (Gradation de 1 a 6)',
  specialty: 'cardiologie',
  category: 'Examen clinique',
  description: 'Gradation de l\'intensite d\'un souffle cardiaque selon la classification de Levine (1/6 a 6/6)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'grade',
      type: 'radio',
      label: 'Grade du souffle (Levine)',
      options: [
        { value: 1, label: 'Grade 1/6 - Souffle tres faible, audible uniquement avec attention' },
        { value: 2, label: 'Grade 2/6 - Souffle faible mais audible immediatement' },
        { value: 3, label: 'Grade 3/6 - Souffle fort, sans fremissement' },
        { value: 4, label: 'Grade 4/6 - Souffle fort, avec fremissement' },
        { value: 5, label: 'Grade 5/6 - Souffle audible stethoscope effleurant le thorax' },
        { value: 6, label: 'Grade 6/6 - Souffle audible a l oreille nue (sans stethoscope)' },
      ],
    },
  ],
  calculate: (values) => {
    const grade = Number(values.grade)
    const labels: Record<number, string> = {
      1: 'Grade 1/6 - Souffle tres faible',
      2: 'Grade 2/6 - Souffle faible',
      3: 'Grade 3/6 - Souffle fort',
      4: 'Grade 4/6 - Souffle fort avec fremissement',
      5: 'Grade 5/6 - Souffle audible stethoscope effleure',
      6: 'Grade 6/6 - Souffle audible a l oreille nue',
    }
    const severities: Record<number, 'low' | 'moderate' | 'high'> = {
      1: 'low', 2: 'low', 3: 'moderate', 4: 'moderate', 5: 'high', 6: 'high',
    }
    return {
      value: grade,
      label: labels[grade] || 'Non determine',
      severity: severities[grade] || 'low',
      ranges: [
        { min: 1, max: 2, label: 'Grade 1-2 (souffle faible)', severity: 'low', recommendation: 'Souffle innocent probable (fonctionnel). Si asymptomatique et sans autre signe, pas d exploration systematique. Surveillance clinique.' },
        { min: 3, max: 4, label: 'Grade 3-4 (souffle fort)', severity: 'moderate', recommendation: 'Echocardiographie transthoracique pour evaluer la valvulopathie sous-jacente. Avis cardiologique.' },
        { min: 5, max: 6, label: 'Grade 5-6 (souffle intense)', severity: 'high', recommendation: 'Valvulopathie probablement serree. Echocardiographie urgente. Avis cardiologique specialise. Discuter chirugie valvulaire.' },
      ],
    }
  },
  interpretation: `La gradation de Levine est la classification standard de l intensite des souffles cardiaques, de 1 a 6.

- Grade 1/6 : tres faible, audible seulement avec attention
- Grade 2/6 : faible mais audible immediatement
- Grade 3/6 : fort sans fremissement palpable
- Grade 4/6 : fort avec fremissement
- Grade 5/6 : audible avec le stethoscope effleurant le thorax
- Grade 6/6 : audible a l oreille nue

Les souffles de grade 1-2 sont souvent innocents (fonctionnels). Les grades >= 3 sont generalement organiques.`,
  clinicalCommentary: `L intensite du souffle ne predit pas parfaitement la severite de la valvulopathie. Un souffle de grade 2 peut correspondre a une stenose aortique serree si le debit cardiaque est bas. Inversement, un souffle de grade 4 peut etre lie a un hyperdebit (anemie, hyperthyroidie). Toujours completer par une echocardiographie si le souffle est grade >= 3 ou si le patient est symptomatique. La palpation du fremissement est specifique mais pas sensible.`,
  references: [
    {
      type: 'guideline',
      title: 'ESC/EACTS Guidelines for the management of valvular heart disease 2021',
      url: 'https://doi.org/10.1093/eurheartj/ehab395',
    },
    {
      type: 'pubmed',
      title: 'Levine SA. The systolic murmur. Its clinical significance. JAMA 1933',
      url: 'https://jamanetwork.com/journals/jama/article-abstract/257863',
    },
  ],
}
export default cardiacSouffle
