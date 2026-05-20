import type { FormulaDefinition } from '../types'

const maccabe: FormulaDefinition = {
  id: 'maccabe',
  slug: 'maccabe',
  name: 'Mac Cabe (Score)',
  specialty: 'infectiologie',
  category: 'Pronostic',
  description: 'Classification de Mac Cabe pour évaluer la gravité des pathologies sous-jacentes et l espérance de vie avant une infection.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'classe',
      type: 'radio',
      label: 'Classification de l état sous-jacent',
      options: [
        { value: 1, label: 'Classe 1 — Pathologie non fatale (patient sans comorbidité grave, espérance de vie > 5 ans)' },
        { value: 2, label: 'Classe 2 — Pathologie ultimately fatale (maladie évolutive à long terme, espérance de vie 1-5 ans)' },
        { value: 3, label: 'Classe 3 — Pathologie rapidement fatale (maladie à court terme, espérance de vie < 1 an)' },
      ],
    },
  ],
  calculate: (values) => {
    const classe = parseInt(values.classe) || 0

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let label: string
    let mortalite: string
    if (classe === 1) { severity = 'low'; label = 'Classe 1 — Non fatale'; mortalite = 'Mortalite faible' }
    else if (classe === 2) { severity = 'high'; label = 'Classe 2 — Ultimately fatale'; mortalite = 'Mortalite < 50 % a 5 ans' }
    else { severity = 'critical'; label = 'Classe 3 — Rapidement fatale'; mortalite = 'Mortalite > 50 % a 1 an' }

    return {
      value: classe,
      label: `Mac Cabe : ${label}`,
      severity,
      ranges: [
        { min: 1, max: 1, label: 'Classe 1 — Non fatale', severity: 'low', recommendation: 'Pronostic de base bon. Traitement curatif standard de l infection. Pas de limitation thérapeutique a priori.' },
        { min: 2, max: 2, label: 'Classe 2 — Ultimately fatale', severity: 'high', recommendation: 'Comorbidité évolutive sévère. Adapter la prise en charge à l état général. Discuter limitations thérapeutiques. Surveillance renforcée.' },
        { min: 3, max: 3, label: 'Classe 3 — Rapidement fatale', severity: 'critical', recommendation: 'Maladie terminale. Prise en charge palliative si approprié. Discussion collégiale sur les objectifs thérapeutiques. Limitations thérapeutiques à formaliser.' },
      ],
    }
  },
  interpretation: `La **classification de Mac Cabe** (1962) évalue la sévérité des comorbidités sous-jacentes chez un patient hospitalisé pour infection.

**Trois classes :**
- **Classe 1** : Maladie non fatale — patient sans maladie grave sous-jacente, espérance de vie > 5 ans.
- **Classe 2** : Maladie ultimately fatale — maladie évolutive à long terme (cirrhose, insuffisance rénale, BPCO sévère, cancer évolutif...), espérance de vie 1-5 ans.
- **Classe 3** : Maladie rapidement fatale — maladie aiguë à court terme (hémopathie, cancer métastatique, SIDA terminal...), espérance de vie < 1 an.

Cette classification est utilisée dans les scores de gravité (APACHE, MEDS) et en épidémiologie.`,
  clinicalCommentary: `Le score de Mac Cabe est souvent combiné au score de McCabe ou à l index de Charlson pour évaluer le risque de mortalité. Il est intégré dans le score MEDS (Mortality in Emergency Department Sepsis). Bien qu ancien, il reste pertinent pour stratifier le risque. Il ne doit pas être utilisé seul pour des décisions de limitations thérapeutiques. La discussion collégiale et l avis du patient sont primordiaux.`,
  references: [
    {
      type: 'pubmed',
      title: 'MacCabe WR et al. A clinical classification of underlying disease. J Chron Dis 1962',
    },
    {
      type: 'pubmed',
      title: 'Shapiro NI et al. Mortality in Emergency Department Sepsis (MEDS) score. Crit Care Med 2003',
      pmid: '12682487',
    },
  ],
}
export default maccabe
