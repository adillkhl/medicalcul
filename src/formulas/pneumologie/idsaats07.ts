import type { FormulaDefinition } from '../types'

const idsaats07: FormulaDefinition = {
  id: 'idsaats07', slug: 'idsaats07',
  name: 'Critères IDSA/ATS 2007 (Pneumonie grave)',
  specialty: 'pneumologie', category: 'Pneumonie',
  description: 'Critères majeurs et mineurs IDSA/ATS 2007 pour définir la pneumonie aiguë communautaire grave (PAC grave) — admission en réanimation',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'choc', type: 'boolean', label: 'MAJEUR — Choc septique (vasopresseurs)' },
    { id: 'ventilation_mecanique', type: 'boolean', label: 'MAJEUR — Ventilation mécanique invasive' },
    { id: 'fr', type: 'boolean', label: 'MINEUR — FR ≥ 30/min' },
    { id: 'confusion', type: 'boolean', label: 'MINEUR — Confusion/désorientation' },
    { id: 'uree_mmol', type: 'boolean', label: 'MINEUR — Urée ≥ 11 mmol/L (BUN > 30)' },
    { id: 'pao2_fio2', type: 'boolean', label: 'MINEUR — PaO₂/FiO₂ ≤ 250' },
    { id: 'infiltration', type: 'boolean', label: 'MINEUR — Atteinte multilobaire (radio)' },
    { id: 'pas', type: 'boolean', label: 'MINEUR — PAS < 90 mmHg' },
    { id: 'leucopenie', type: 'boolean', label: 'MINEUR — Leucopénie < 4000/mm³' },
    { id: 'hypothermie', type: 'boolean', label: 'MINEUR — T° centrale < 36°C' },
    { id: 'thrombopenie', type: 'boolean', label: 'MINEUR — Plaquettes < 100000/mm³' },
  ],
  calculate: (values) => {
    const majeurs = (values.choc ? 1 : 0) + (values.ventilation_mecanique ? 1 : 0)
    const mineurs = (values.fr ? 1 : 0) + (values.confusion ? 1 : 0) + (values.uree_mmol ? 1 : 0) + (values.pao2_fio2 ? 1 : 0) + (values.infiltration ? 1 : 0) + (values.pas ? 1 : 0) + (values.leucopenie ? 1 : 0) + (values.hypothermie ? 1 : 0) + (values.thrombopenie ? 1 : 0)
    const grave = (majeurs >= 1 || mineurs >= 3)
    return { value: grave ? 1 : 0, label: grave ? 'PAC grave — Admission réanimation' : 'PAC non grave (SCBU possible)',
      severity: grave ? 'high' : 'low',
      details: { Majeurs: `${majeurs}/2`, Mineurs: `${mineurs}/9` } }
  },
  interpretation: 'PAC grave si ≥ 1 critère majeur OU ≥ 3 critères mineurs. Justifie l\'admission en réanimation ou soins intensifs.',
  clinicalCommentary: 'Critères validés par l\'IDSA/ATS 2007 (mise à jour 2019). La présence d\'un seul critère majeur a une spécificité > 95% pour la prédiction de ventilation mécanique ou choc.',
  references: [{ type: 'pubmed', title: 'Mandell LA et al. IDSA/ATS guidelines for CAP. Clin Infect Dis 2007', pmid: '17278083' }],
}
export default idsaats07
