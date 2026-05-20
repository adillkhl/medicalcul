import type { FormulaDefinition } from '../types'

const schwab_england: FormulaDefinition = {
  id: 'schwab_england', slug: 'schwab_england',
  name: 'Échelle de Schwab et England (Parkinson — Autonomie)',
  specialty: 'divers', category: 'Neurologie',
  description: 'Évaluation du degré d\'autonomie dans la vie quotidienne des patients parkinsoniens (en %)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'autonomie', type: 'radio', label: 'Degré d\'autonomie', options: [
      { value: 100, label: '100% — Complètement indépendant. Capable de tout faire sans difficulté' },
      { value: 90, label: '90% — Indépendant. Fait tout mais avec quelques difficultés' },
      { value: 80, label: '80% — Indépendant pour la plupart des activités. 2× plus de temps' },
      { value: 70, label: '70% — Pas vraiment indépendant. Difficile, 3-4× plus de temps' },
      { value: 60, label: '60% — Dépendance partielle. Fait seul 50-75% des activités' },
      { value: 50, label: '50% — Plus ou moins dépendant. Aide pour 50% des activités' },
      { value: 40, label: '40% — Très dépendant. Peut faire seul 25% des activités' },
      { value: 30, label: '30% — Effort soutenu pour 10-25% des activités' },
      { value: 20, label: '20% — Ne fait rien seul. Un peu d\'aide pour certains repas' },
      { value: 10, label: '10% — Totalement dépendant. Aide pour tout' },
      { value: 0, label: '0% — Alité. Fonctions végétatives' },
    ]},
  ],
  calculate: (values) => {
    const pct = values.autonomie ?? 100
    return { value: pct, label: `Schwab & England : ${pct}%`, severity: pct < 50 ? 'high' : pct < 80 ? 'moderate' : 'low',
      details: { Autonomie: `${pct}%`, 'Interprétation': pct >= 80 ? 'Autonome' : pct >= 50 ? 'Dépendance partielle' : 'Dépendance sévère' } }
  },
  interpretation: 'L\'échelle de Schwab et England est utilisée avec la UPDRS et le Hoehn & Yahr pour évaluer l\'impact fonctionnel de la maladie de Parkinson.',
  clinicalCommentary: 'Échelle simple à administrer. Se concentre sur l\'autonomie réelle. Variabilité possible selon l\'état ON/OFF (périodes de bonne réponse à la L-Dopa).',
  references: [{ type: 'pubmed', title: 'Schwab RS, England AC. Projection technique for evaluating surgery in Parkinson\'s disease. 1969' }],
}
export default schwab_england
