import type { FormulaDefinition } from '../types'

const pesi: FormulaDefinition = {
  id: 'pesi', slug: 'pesi',
  name: 'PESI Score (Pulmonary Embolism Severity Index)',
  specialty: 'pneumologie', category: 'Thromboembolie',
  description: 'Index de gravité de l\'embolie pulmonaire — prédiction de la mortalité à 30 jours (PESI)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge (ans)', min: 0, max: 120, step: 1 },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Homme' }, { value: 1, label: 'Femme' }] },
    { id: 'cancer', type: 'boolean', label: 'Cancer actif' },
    { id: 'insuf_card', type: 'boolean', label: 'Insuffisance cardiaque chronique' },
    { id: 'insuf_resp', type: 'boolean', label: 'Insuffisance respiratoire chronique' },
    { id: 'fc_110', type: 'boolean', label: 'FC ≥ 110/min' },
    { id: 'pas_100', type: 'boolean', label: 'PAS < 100 mmHg' },
    { id: 'fr_30', type: 'boolean', label: 'FR ≥ 30/min' },
    { id: 'temp_36', type: 'boolean', label: 'T° < 36°C' },
    { id: 'confusion', type: 'boolean', label: 'Confusion / altération conscience' },
    { id: 'sat_90', type: 'boolean', label: 'SpO₂ < 90%' },
  ],
  calculate: (values) => {
    const age = values.age ?? 40
    let total = age
    if ((values.sexe ?? 0) === 1) total += 10
    if (values.cancer) total += 30
    if (values.insuf_card) total += 10
    if (values.insuf_resp) total += 10
    if (values.fc_110) total += 20
    if (values.pas_100) total += 30
    if (values.fr_30) total += 20
    if (values.temp_36) total += 20
    if (values.confusion) total += 60
    if (values.sat_90) total += 20
    let classe = 'I', sev: 'high'|'moderate'|'low' = 'low'
    if (total <= 65) { classe = 'I-II'; sev = 'low' }
    else if (total <= 85) { classe = 'III'; sev = 'moderate' }
    else if (total <= 125) { classe = 'IV'; sev = 'moderate' }
    else { classe = 'V'; sev = 'high' }
    return { value: total, label: `PESI Classe ${classe} (${total} pts)`, severity: sev,
      details: { Classe: classe, Points: `${total}`, 'Mortalité 30j': classe === 'I-II' ? '1-3%' : classe === 'III' ? '3-7%' : classe === 'IV' ? '7-15%' : '> 15%' } }
  },
  interpretation: 'Classes I-II : faible risque (mortalité < 3%). Classe III : risque intermédiaire. Classes IV-V : risque élevé. L\'alternative simplifiée (sPESI) est plus utilisée.',
  clinicalCommentary: 'Le PESI original est plus précis que le sPESI mais plus complexe. Le sPESI (1 pt par item) est recommandé par l\'ESC pour le triage des EP.',
  references: [{ type: 'pubmed', title: 'Aujesky D et al. PESI derivation and validation. Am J Respir Crit Care Med 2005', pmid: '16272209' }],
}
export default pesi
