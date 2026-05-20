import type { FormulaDefinition } from '../types'

const updrs: FormulaDefinition = {
  id: 'updrs', slug: 'updrs',
  name: 'UPDRS (Unified Parkinson\'s Disease Rating Scale)',
  specialty: 'divers', category: 'Neurologie',
  description: 'Échelle d\'évaluation globale de la maladie de Parkinson — UPDRS (partie III motrice, score 0-108)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'parole', type: 'radio', label: 'Parole', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Légère perte d\'expression' }, { value: 2, label: 'Modérément altérée' }, { value: 3, label: 'Sévèrement altérée' }, { value: 4, label: 'Incompréhensible' }] },
    { id: 'expression_faciale', type: 'radio', label: 'Expression faciale', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Légère hypomimie' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère (faciès figé)' }, { value: 4, label: 'Complètement figé' }] },
    { id: 'tremblement_repos', type: 'radio', label: 'Tremblement de repos', options: [{ value: 0, label: 'Absent' }, { value: 1, label: 'Léger, rare' }, { value: 2, label: 'Léger, presque constant' }, { value: 3, label: 'Modéré, constant' }, { value: 4, label: 'Sévère, gêne fonctionnelle' }] },
    { id: 'rigidite', type: 'radio', label: 'Rigidité (coudes, poignets, genoux)', options: [{ value: 0, label: 'Absente' }, { value: 1, label: 'Légère' }, { value: 2, label: 'Modérée' }, { value: 3, label: 'Sévère, amplitude complète' }, { value: 4, label: 'Très sévère, difficulté amplitude' }] },
    { id: 'bradykinésie', type: 'radio', label: 'Bradykinésie corporelle (lenteur globale)', options: [{ value: 0, label: 'Absente' }, { value: 1, label: 'Légère lenteur' }, { value: 2, label: 'Modérée, difficulté limitée' }, { value: 3, label: 'Sévère, début d\'akinésie' }, { value: 4, label: 'Très sévère, quasi immobilité' }] },
    { id: 'marche', type: 'radio', label: 'Marche', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Léger traînement, diminution balancement' }, { value: 2, label: 'Difficulté modérée, peut s\'arrêter brusquement' }, { value: 3, label: 'Sévère, besoin d\'aide' }, { value: 4, label: 'Ne marche qu\'avec aide' }] },
    { id: 'posture', type: 'radio', label: 'Posture', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Légère flexion du tronc' }, { value: 2, label: 'Flexion modérée, peut s\'incliner' }, { value: 3, label: 'Flexion sévère, cyphose' }, { value: 4, label: 'Flexion extrême' }] },
    { id: 'instabilite', type: 'radio', label: 'Instabilité posturale (pull test)', options: [{ value: 0, label: 'Normale' }, { value: 1, label: 'Rétablit spontanément' }, { value: 2, label: 'A besoin d\'aide' }, { value: 3, label: 'Tendance à tomber' }, { value: 4, label: 'Impossible de se tenir seul' }] },
  ],
  calculate: (values) => {
    const total = (values.parole ?? 0) + (values.expression_faciale ?? 0) + (values.tremblement_repos ?? 0) + (values.rigidite ?? 0) + (values.bradykinésie ?? 0) + (values.marche ?? 0) + (values.posture ?? 0) + (values.instabilite ?? 0)
    return { value: total, label: `UPDRS-III : ${total}/32 (version simplifiée 8 items)`, severity: total >= 20 ? 'high' : total >= 10 ? 'moderate' : 'low' }
  },
  interpretation: 'L\'UPDRS complète comprend 4 parties (I : mental, II : AVQ, III : motrice, IV : complications). La partie III (motrice, 27 items, 0-108) est la plus utilisée.',
  clinicalCommentary: 'Le MDS-UPDRS (version révisée 2008) est maintenant le standard. Ces 8 items sont un échantillon de la partie III. L\'évaluation complète nécessite l\'entraînement.',
  references: [{ type: 'pubmed', title: 'Fahn S, Elton RL. UPDRS development. Recent developments in Parkinson\'s disease. 1987' }],
}
export default updrs
