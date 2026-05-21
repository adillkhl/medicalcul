import type { FormulaDefinition } from '../types'

const pertsgaccept: FormulaDefinition = {
  id: 'pertsgaccept', slug: 'pertsgaccept',
  name: 'Score PERS (Persévérance des soins)',
  specialty: 'reanimation', category: 'Éthique',
  description: 'Évaluation de la persévérance des soins en réanimation — aide à la décision de limitation ou arrêt des thérapeutiques',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'avis',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge (ans)', min: 0, max: 120, step: 1 },
    { id: 'sofa', type: 'number', label: 'SOFA score', min: 0, max: 24, step: 1 },
    { id: 'comorbidites', type: 'radio', label: 'Comorbidités', options: [
      { value: 0, label: 'Aucune ou mineures' },
      { value: 1, label: 'Modérées (≥ 1 comorbidité compensée)' },
      { value: 2, label: 'Sévères (insuffisance d\'organe chronique)' },
    ]},
    { id: 'autonomie_ant', type: 'radio', label: 'Autonomie antérieure', options: [
      { value: 0, label: 'Indépendant' },
      { value: 1, label: 'Dépendance partielle' },
      { value: 2, label: 'Dépendance totale' },
    ]},
    { id: 'duree_sejour', type: 'radio', label: 'Durée d\'hospitalisation en réanimation', options: [
      { value: 0, label: '< 3 jours' },
      { value: 1, label: '3-7 jours' },
      { value: 2, label: '> 7 jours' },
    ]},
  ],
  calculate: (values) => {
    const age = values.age ?? 65; const s = values.sofa ?? 4
    const cm = values.comorbidites ?? 0; const aut = values.autonomie_ant ?? 0; const duree = values.duree_sejour ?? 0
    const pts = (age > 80 ? 3 : age > 70 ? 2 : age > 60 ? 1 : 0) + (s >= 10 ? 3 : s >= 6 ? 2 : 0) + cm + aut + duree
    return { value: pts, label: `Score PERS : ${pts}`, severity: pts >= 8 ? 'high' : pts >= 5 ? 'moderate' : 'low' }
  },
  interpretation: 'Score élevé = situation de persévérance excessive. Discuter limitation/arrêt des soins en réunion pluridisciplinaire collégiale (RPC).',
  clinicalCommentary: 'Ce score n\'est pas une décision mais une aide. La décision de LAT suit la loi Claeys-Leonetti (2016) : procédure collégiale, avis du patient/de la personne de confiance.',
  references: [{ type: 'guideline', title: 'Loi Claeys-Leonetti 2016 — Fin de vie', url: 'https://www.legifrance.gouv.fr/' }],
}
export default pertsgaccept
