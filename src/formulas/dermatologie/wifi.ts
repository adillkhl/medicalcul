import type { FormulaDefinition } from '../types'

const wifi: FormulaDefinition = {
  id: 'wifi', slug: 'wifi',
  name: 'WIfI Classification (Pied Diabétique)',
  specialty: 'dermatologie', category: 'Plaies',
  description: 'Classification WIfI (Wound, Ischemia, foot Infection) pour le risque d\'amputation dans le pied diabétique',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'plaie', type: 'radio', label: 'W — Plaie', options: [
      { value: 0, label: 'W0 : Pas de plaie / ulcère' },
      { value: 1, label: 'W1 : Ulcère superficiel (< 2 cm²)' },
      { value: 2, label: 'W2 : Ulcère profond (tendon/os visible)' },
      { value: 3, label: 'W3 : Gangrène (avant-pied ou total)' },
    ]},
    { id: 'ischemie', type: 'radio', label: 'I — Ischémie (TcpO₂ ou IPS)', options: [
      { value: 0, label: 'I0 : TcpO₂ > 60 mmHg ou IPS > 0.80' },
      { value: 1, label: 'I1 : TcpO₂ 40-60 mmHg ou IPS 0.50-0.79' },
      { value: 2, label: 'I2 : TcpO₂ 30-39 mmHg ou IPS 0.30-0.49' },
      { value: 3, label: 'I3 : TcpO₂ < 30 mmHg ou IPS < 0.30' },
    ]},
    { id: 'infection', type: 'radio', label: 'fi — Infection', options: [
      { value: 0, label: 'fi0 : Pas d\'infection' },
      { value: 1, label: 'fi1 : Infection locale (cellulite < 2 cm)' },
      { value: 2, label: 'fi2 : Infection profonde (abcès, ostéite)' },
      { value: 3, label: 'fi3 : Sepsis / infection systémique' },
    ]},
  ],
  calculate: (values) => {
    const w = values.plaie ?? 0; const i = values.ischemie ?? 0; const fi = values.infection ?? 0
    const total = w + i + fi
    let sev: 'high' | 'moderate' | 'low' = 'low'
    let stage = 'I'
    if (w >= 2 || i >= 2 || fi >= 2) { sev = 'high'; stage = 'III' }
    else if (w >= 1 || i >= 1 || fi >= 1) { sev = 'moderate'; stage = 'II' }
    return { value: total, label: `WIfI Grade : ${stage} (score ${total}/9)`, severity: sev }
  },
  interpretation: 'La classification WIfI évalue le risque d\'amputation à 1 an. Grade III = risque élevé (amputation > 50%).',
  clinicalCommentary: 'Outil standardisé de la SVS (Society for Vascular Surgery). Guide la stratégie thérapeutique : revascularisation, antibiothérapie, amputation.',
  references: [{ type: 'pubmed', title: 'Mills JL et al. SVS WIfI classification. J Vasc Surg 2014', pmid: '24381075' }],
}
export default wifi
