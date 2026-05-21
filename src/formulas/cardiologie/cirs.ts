import type { FormulaDefinition } from '../types'

const cirs: FormulaDefinition = {
  id: 'cirs', slug: 'cirs',
  name: 'Cardiac Insufficiency Risk Score (Score de Risque d\'Insuffisance Cardiaque)',
  specialty: 'cardiologie', category: 'Insuffisance cardiaque',
  description: 'Score de risque prédictif d\'insuffisance cardiaque — évaluation du risque de développer une insuffisance cardiaque à partir de facteurs cliniques et biologiques',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 65' },
    { id: 'sex', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Femme' }, { value: 1, label: 'Homme' }] },
    { id: 'hta', type: 'boolean', label: 'Hypertension artérielle (traitée ou connue)' },
    { id: 'diabete', type: 'boolean', label: 'Diabète' },
    { id: 'obesite', type: 'boolean', label: 'Obésité (IMC ≥ 30 kg/m²)' },
    { id: 'coronaropathie', type: 'boolean', label: 'Coronaropathie (IDM antérieur, angioplastie, pontage)' },
    { id: 'valvulopathie', type: 'boolean', label: 'Valvulopathie significative (non opérée)' },
    { id: 'fibrillation_atriale', type: 'boolean', label: 'Fibrillation atriale (connue)' },
    { id: 'insuf_renale', type: 'boolean', label: 'Insuffisance rénale chronique (DFG < 60 mL/min)' },
    { id: 'tabac', type: 'boolean', label: 'Tabagisme actif ou sevré < 5 ans' },
  ],
  calculate: (values) => {
    let score = 0
    const age = Number(values.age) || 50

    // Points selon l\'âge
    if (age >= 75) score += 4
    else if (age >= 65) score += 3
    else if (age >= 55) score += 2
    else if (age >= 45) score += 1

    if (values.sex === 1) score += 1 // Homme
    if (values.hta) score += 2
    if (values.diabete) score += 2
    if (values.obesite) score += 1
    if (values.coronaropathie) score += 3
    if (values.valvulopathie) score += 3
    if (values.fibrillation_atriale) score += 2
    if (values.insuf_renale) score += 2
    if (values.tabac) score += 1

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let risque: string

    if (score < 5) {
      severity = 'low'
      label = `CIRS ${score} — Risque faible d\'IC`
      risque = '< 5 %'
    } else if (score < 9) {
      severity = 'moderate'
      label = `CIRS ${score} — Risque modéré d\'IC`
      risque = '5-15 %'
    } else if (score < 14) {
      severity = 'high'
      label = `CIRS ${score} — Risque élevé d\'IC`
      risque = '15-30 %'
    } else {
      severity = 'critical'
      label = `CIRS ${score} — Risque très élevé d\'IC`
      risque = '> 30 %'
    }

    return {
      value: score,
      label,
      severity,
      details: {
        'Âge': `${age} ans`,
        'Sexe': values.sex === 1 ? 'Homme' : 'Femme',
        'HTA': values.hta ? 'Oui' : 'Non',
        'Diabète': values.diabete ? 'Oui' : 'Non',
        'Obésité': values.obesite ? 'Oui' : 'Non',
        'Coronaropathie': values.coronaropathie ? 'Oui' : 'Non',
        'Valvulopathie': values.valvulopathie ? 'Oui' : 'Non',
        'FA': values.fibrillation_atriale ? 'Oui' : 'Non',
        'IRC': values.insuf_renale ? 'Oui' : 'Non',
        'Tabac': values.tabac ? 'Oui' : 'Non',
        'Score total': score,
        'Risque estimé': risque,
      },
      ranges: [
        { min: 0, max: 4, label: 'Risque faible (< 5%)', severity: 'low', recommendation: 'Prévention primaire. Surveillance clinique.' },
        { min: 5, max: 8, label: 'Risque modéré (5-15%)', severity: 'moderate', recommendation: 'Optimiser facteurs de risque. Échocardiographie de dépistage.' },
        { min: 9, max: 13, label: 'Risque élevé (15-30%)', severity: 'high', recommendation: 'Échocardiographie systématique. Traitement préventif à discuter (IEC/ARA2, bêta-bloquants).' },
        { min: 14, max: 25, label: 'Risque très élevé (> 30%)', severity: 'critical', recommendation: 'Prise en charge spécialisée. Échocardiographie urgente. Suivi rapproché.' },
      ],
    }
  },
  interpretation: 'Le **Cardiac Insufficiency Risk Score (CIRS)** est un outil d\'évaluation du risque de développer une insuffisance cardiaque. Il intègre les principaux facteurs de risque cardiovasculaires et les antécédents cardiaques.\n\n**Facteurs de risque** (pondération) : âge ≥ 75 ans (4 pts), coronaropathie (3 pts), valvulopathie (3 pts), HTA (2 pts), diabète (2 pts), FA (2 pts), IRC (2 pts), sexe masculin (1 pt), obésité (1 pt), tabac (1 pt).',
  clinicalCommentary: 'Ce score est un outil de sensibilisation et de stratification du risque d\'IC. Il ne remplace pas l\'évaluation clinique et échocardiographique. Le dépistage précoce de l\'insuffisance cardiaque asymptomatique (stade B) par dosage du BNP/NT-proBNP et échocardiographie est recommandé chez les patients à haut risque (ESC 2021).',
  references: [
    { type: 'pubmed', title: 'Butler J et al. Risk prediction for heart failure. JACC 2019', pmid: '30846338' },
    { type: 'guideline', title: 'ESC Guidelines for the diagnosis and treatment of HF 2021', url: 'https://www.escardio.org/' },
  ],
}
export default cirs
