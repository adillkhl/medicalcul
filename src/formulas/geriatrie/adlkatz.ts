import type { FormulaDefinition } from '../types'

const adlkatz: FormulaDefinition = {
  id: 'adlkatz', slug: 'adlkatz',
  name: 'ADL de Katz — Activités de Base de la Vie Quotidienne',
  specialty: 'geriatrie', category: 'Évaluation gériatrique',
  description: 'Échelle ADL de Katz (Index of Independence in Activities of Daily Living) évaluant 6 activités de base : bain, habillage, toilette, transfert, continence et repas. Score /6 selon l\'autonomie.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'bain', type: 'boolean', label: 'Bain — Autonome (se lave seul, bain ou douche sans aide)', weight: 1 },
    { id: 'habillage', type: 'boolean', label: 'Habillage — Autonome (s\'habille seul, boutons, fermetures éclair)', weight: 1 },
    { id: 'toilette', type: 'boolean', label: 'Toilette — Autonome (se lave le visage et les mains, se brosse les dents)', weight: 1 },
    { id: 'transfert', type: 'boolean', label: 'Transfert — Autonome (se lève du lit, s\'assoit, se déplace)', weight: 1 },
    { id: 'continence', type: 'boolean', label: 'Continence — Autonome (contrôle sphinctérien urinaire et fécal)', weight: 1 },
    { id: 'repas', type: 'boolean', label: 'Repas — Autonome (mange seul, coupe les aliments, boit)', weight: 1 },
  ],
  calculate: (values) => {
    const bain = values.bain ? 1 : 0
    const habillage = values.habillage ? 1 : 0
    const toilette = values.toilette ? 1 : 0
    const transfert = values.transfert ? 1 : 0
    const continence = values.continence ? 1 : 0
    const repas = values.repas ? 1 : 0

    const score = bain + habillage + toilette + transfert + continence + repas

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score === 6) {
      label = 'ADL Katz 6/6 — Indépendance totale'
      severity = 'low'
      recommendation = 'Autonomie complète pour les activités de base. Maintien à domicile possible. Surveillance standard.'
    } else if (score >= 4) {
      label = `ADL Katz ${score}/6 — Dépendance partielle`
      severity = 'moderate'
      recommendation = 'Perte d\'autonomie modérée. Aide partielle nécessaire pour certaines activités. Évaluation gériatrique complète. Aides techniques et humaines à envisager.'
    } else {
      label = `ADL Katz ${score}/6 — Dépendance sévère`
      severity = 'high'
      recommendation = 'Perte d\'autonomie sévère. Aide totale nécessaire. Discussion sur l\'institutionnalisation ou l\'hospitalisation. Prise en charge multidisciplinaire (kiné, ergothérapie, soins infirmiers).'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Bain': bain ? 'Autonome' : 'Aide nécessaire',
        'Habillage': habillage ? 'Autonome' : 'Aide nécessaire',
        'Toilette': toilette ? 'Autonome' : 'Aide nécessaire',
        'Transfert': transfert ? 'Autonome' : 'Aide nécessaire',
        'Continence': continence ? 'Autonome' : 'Aide nécessaire',
        'Repas': repas ? 'Autonome' : 'Aide nécessaire',
        'Score total': `${score}/6`,
      },
      ranges: [
        { min: 6, max: 6, label: '6/6 — Indépendance totale', severity: 'low', recommendation: 'Autonomie complète.' },
        { min: 4, max: 5, label: '4-5/6 — Dépendance partielle', severity: 'moderate', recommendation: 'Aide partielle.' },
        { min: 0, max: 3, label: '0-3/6 — Dépendance sévère', severity: 'high', recommendation: 'Aide totale.' },
      ],
    }
  },
  interpretation: `**ADL de Katz — Index of Independence in Activities of Daily Living**

Évalue 6 activités de base de la vie quotidienne. Chaque item côté 0 (dépendant) ou 1 (autonome). Score total /6.

**Items :**
1. **Bain** : Capacité à se laver seul (baignoire, douche)
2. **Habillage** : Capacité à s\'habiller seul
3. **Toilette** : Capacité à se laver le visage et les mains
4. **Transfert** : Capacité à se lever, s\'asseoir, se déplacer
5. **Continence** : Contrôle urinaire et fécal
6. **Repas** : Capacité à s\'alimenter seul

**Interprétation :**
- **6** : Indépendance totale
- **4-5** : Dépendance partielle (nécessite aide pour certaines activités)
- **0-3** : Dépendance sévère (nécessite aide pour la plupart des activités)

L\'ADL de Katz est la référence pour l\'évaluation de l\'autonomie en gériatrie.`,
  clinicalCommentary: 'L\'ADL de Katz est l\'échelle la plus utilisée dans le monde pour évaluer l\'autonomie des personnes âgées. Elle est simple, rapide (5 minutes) et reproductible. La perte des ADL suit généralement une séquence inverse de l\'acquisition chez l\'enfant : la continence est perdue en premier, puis les repas, le transfert, la toilette, l\'habillage et le bain en dernier. L\'évaluation combinée ADL + IADL permet une vision complète de l\'autonomie.',
  references: [
    { type: 'pubmed', title: 'Katz S et al. Studies of illness in the aged. The index of ADL. JAMA 1963', pmid: '14032433' },
    { type: 'pubmed', title: 'Katz S. Assessing self-maintenance: activities of daily living, mobility, and instrumental activities of daily living. J Am Geriatr Soc 1983', pmid: '6418786' },
    { type: 'guideline', title: 'HAS — Évaluation gériatrique', url: 'https://www.has-sante.fr/' },
  ],
}
export default adlkatz
