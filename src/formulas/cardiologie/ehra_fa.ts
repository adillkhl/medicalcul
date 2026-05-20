import type { FormulaDefinition } from '../types'

const ehra: FormulaDefinition = {
  id: 'ehra_fa',
  slug: 'ehra_fa',
  name: 'EHRA — Fibrillation Auriculaire (Score de retentissement)',
  specialty: 'cardiologie',
  category: 'Fibrillation auriculaire',
  description: 'Classification EHRA (European Heart Rhythm Association) du retentissement fonctionnel de la fibrillation auriculaire',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'ehra_grade',
      type: 'radio',
      label: 'Sélectionnez le grade EHRA',
      options: [
        { value: 1, label: 'EHRA I — Absence de symptômes. Vie quotidienne normale.' },
        { value: 2, label: 'EHRA IIa — Symptômes légers. Activité quotidienne non affectée.' },
        { value: 3, label: 'EHRA IIb — Symptômes modérés. Activité quotidienne légèrement affectée, mais sans gêne majeure.' },
        { value: 4, label: 'EHRA III — Symptômes sévères. Activité quotidienne significativement affectée.' },
        { value: 5, label: 'EHRA IV — Symptômes invalidants. Incapacité à mener une activité quotidienne.' },
      ],
    },
  ],
  calculate: (values) => {
    const grade = Number(values.ehra_grade)
    const labels: Record<number, string> = {
      1: 'EHRA I - Asymptomatique',
      2: 'EHRA IIa - Symptomes legers',
      3: 'EHRA IIb - Symptomes moderes',
      4: 'EHRA III - Symptomes severes',
      5: 'EHRA IV - Symptomes invalidants',
    }
    const severities: Record<number, 'low' | 'moderate' | 'high' | 'critical'> = {
      1: 'low',
      2: 'low',
      3: 'moderate',
      4: 'high',
      5: 'critical',
    }
    return {
      value: grade,
      label: labels[grade] || 'Non evalue',
      severity: severities[grade] || 'low',
      ranges: [
        { min: 1, max: 1, label: 'EHRA I', severity: 'low', recommendation: 'Pas de traitement symptomatique necessaire. Traitement antithrombotique selon CHA2DS2-VA. Surveillance.' },
        { min: 2, max: 2, label: 'EHRA IIa', severity: 'low', recommendation: 'Discuter traitement antiarythmique (b-bloquant, flecaine, ou amiodarone) selon le profil patient.' },
        { min: 3, max: 3, label: 'EHRA IIb', severity: 'moderate', recommendation: 'Traitement antiarythmique ou ablation par catheter a discuter (controle du rythme).' },
        { min: 4, max: 4, label: 'EHRA III', severity: 'high', recommendation: 'Controle du rythme par ablation ou cardioversion recommande. Optimiser traitement medical.' },
        { min: 5, max: 5, label: 'EHRA IV', severity: 'critical', recommendation: 'Prise en charge specialisee urgente. Ablation par catheter. Discuter la cardioversion electrique.' },
      ],
    }
  },
  interpretation: `La **classification EHRA** (European Heart Rhythm Association) evalue le retentissement fonctionnel de la fibrillation auriculaire (FA) sur la qualite de vie.

- **EHRA I** : asymptomatique (FA silencieuse)
- **EHRA IIa** : symptomes legers, activite quotidienne normale
- **EHRA IIb** : symptomes moderes, activite legerement perturbee
- **EHRA III** : symptomes severes, activite significativement perturbee
- **EHRA IV** : symptomes invalidants, arret de toute activite

Le score EHRA guide la decision therapeutique : controle de la frequence vs controle du rythme (antiarythmiques, ablation).`,
  clinicalCommentary: `L\'EHRA est subjectif et depend de la perception du patient. Un patient sedentaire peut avoir une FA asymptomatique mais un risque thromboembolique eleve. L\'EHRA ne remplace pas l’evaluation du risque thromboembolique (CHA2DS2-VA) et hemorragique (HAS-BLED). Depuis 2020, l\'EHRA a ajoute le grade IIa et IIb pour affiner la stratification. Les patients EHRA III-IV symptomatiques sous traitement medical optimal ont une indication d’ablation.`,
  references: [
    {
      type: 'pubmed',
      title: 'Kirchhof P et al. 2016 ESC Guidelines for the management of atrial fibrillation. Eur Heart J 2016',
      pmid: '27567408',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines for the management of atrial fibrillation 2024',
      url: 'https://doi.org/10.1093/eurheartj/ehad702',
    },
  ],
}
export default ehra
