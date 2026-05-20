import type { FormulaDefinition } from '../types'

const herdoo2: FormulaDefinition = {
  id: 'herdoo2',
  slug: 'herdoo2',
  name: 'HERDOO2 (Arret de l anticoagulation apres TVP/EP non provoquee)',
  specialty: 'cardiologie',
  category: 'Thromboembolie veineuse',
  description: 'Score clinique pour identifier les femmes avec TVP/EP non provoquee pouvant arreter l anticoagulation apres 6 mois',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'sexe', type: 'radio', label: 'Sexe',
      options: [
        { value: 0, label: 'Homme' },
        { value: 1, label: 'Femme' },
      ] },
    { id: 'age_65', type: 'boolean', label: 'Age > 65 ans', weight: 1 },
    { id: 'd_dimeres', type: 'boolean', label: 'D-dimeres eleves (> 250 ug/L) apres 6 mois d anticoagulation', weight: 1 },
    { id: 'imc_30', type: 'boolean', label: 'IMC >= 30 kg/m2', weight: 1 },
    { id: 'postpartum', type: 'boolean', label: 'ATCD de TVP/EP en postpartum', weight: 1 },
  ],
  calculate: (values) => {
    if (Number(values.sexe) === 0) {
      return {
        value: -1,
        label: 'HERDOO2 non applicable aux hommes',
        severity: 'moderate',
        ranges: [
          { min: -1, max: -1, label: 'Score non applicable', severity: 'moderate', recommendation: 'Le score HERDOO2 a ete valide uniquement chez les femmes. Chez l homme, la decision d arret ou de prolongation de l anticoagulation repose sur le jugement clinique et le risque de recurrence.' },
        ],
      }
    }

    let score = 0
    if (values.age_65) score += 1
    if (values.d_dimeres) score += 1
    if (values.imc_30) score += 1
    if (values.postpartum) score += 1

    const canStop = score <= 1

    return {
      value: score,
      label: canStop ? 'Arret possible (HERDOO2 <= 1) - Faible risque de recurrence' : 'Prolongation recommandee (HERDOO2 >= 2) - Risque eleve de recurrence',
      severity: canStop ? 'low' : 'high',
      risk: canStop ? 3 : 8,
      riskUnit: '% risque de recurrence annuel',
      ranges: [
        { min: 0, max: 1, label: 'Faible risque de recurrence', severity: 'low', recommendation: 'Arret de l anticoagulation apres 6 mois envisageable. Risque de recurrence annuel estime < 5 %. Surveillance clinique.' },
        { min: 2, max: 4, label: 'Risque eleve de recurrence', severity: 'high', recommendation: 'Prolongation de l anticoagulation au-dela de 6 mois recommandee. Reevaluation annuelle du rapport benefice/risque.' },
      ],
    }
  },
  interpretation: `Le **score HERDOO2** (Hyperpigmentation, Edema, Redness, D-dimer, Obesity, Older) aide a decider si l’anticoagulation peut etre arretee apres 6 mois chez les femmes avec TVP/EP non provoquee.

- **HERDOO2 <= 1** : arret possible (faible risque de recurrence)
- **HERDOO2 >= 2** : prolongation de l\'anticoagulation recommandee

Ce score a ete derive et valide dans l\'etude REVERSE II. Il ne s’applique qu’aux femmes, et uniquement apres 6 mois d’anticoagulation pour un episode non provoque.`,
  clinicalCommentary: `Le HERDOO2 s\'utilise APRES 6 mois d\'anticoagulation bien conduite. Ne s’applique PAS aux hommes. Les D-dimeres doivent etre mesures a 6 mois, sous anticoagulation. Si D-dimeres eleves, le risque de recurrence est plus eleve, ce qui justifie la poursuite. Attention : en cas de TVP/EP provoquee (post-chirurgie, cancer), la decision d’arret est differente (en general 3-6 mois suffisent).`,
  references: [
    {
      type: 'pubmed',
      title: 'Rodger MA et al. Identifying unprovoked thromboembolism patients at low risk for recurrence who can discontinue anticoagulant therapy. CMAJ 2008',
      pmid: '18541728',
    },
    {
      type: 'pubmed',
      title: 'Rodger MA et al. Validating the HERDOO2 rule to guide anticoagulation duration. J Thromb Haemost 2017',
      pmid: '29095950',
    },
  ],
}
export default herdoo2
