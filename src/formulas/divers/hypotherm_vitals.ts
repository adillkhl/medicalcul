import type { FormulaDefinition } from '../types'

const hypotherm_vitals: FormulaDefinition = {
  id: 'hypotherm_vitals', slug: 'hypotherm_vitals',
  name: 'Constantes vitales selon le degré d\'hypothermie',
  specialty: 'divers', category: 'Urgences',
  description: 'Modifications attendues des constantes vitales en fonction de la température centrale en hypothermie',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'temp_c', type: 'number', label: 'Température centrale (°C)', min: 20, max: 37, step: 0.5 },
  ],
  calculate: (values) => {
    const t = values.temp_c ?? 37
    let fc, fr, pas
    if (t >= 35) { fc = '80-100'; fr = '12-20'; pas = '100-140' }
    else if (t >= 32) { fc = '60-90'; fr = '10-16'; pas = '90-120' }
    else if (t >= 28) { fc = '40-60'; fr = '6-12'; pas = '80-100' }
    else if (t >= 24) { fc = '30-50'; fr = '4-8'; pas = '60-80' }
    else { fc = '<30'; fr = '<4'; pas = '<60' }
    return { value: t, label: `T° ${t}°C — FC: ${fc}/min, FR: ${fr}/min, PAS: ${pas} mmHg`, severity: t < 28 ? 'high' : t < 32 ? 'moderate' : 'low',
      details: { FC: `${fc}/min`, FR: `${fr}/min`, PAS: `${pas} mmHg` } }
  },
  interpretation: 'Les constantes vitales sont modifiées de façon caractéristique par l\'hypothermie. Permet d\'anticiper les seuils critiques.',
  clinicalCommentary: 'En hypothermie sévère, le pouls peut être imprenable (FV lente, asystolie). Prioriser échocardiographie. L\'ECG montre un signe d\'Osborn (onde J) en hypothermie < 32°C.',
  references: [{ type: 'pubmed', title: 'Danzl DF, Pozos RS. Accidental hypothermia. NEJM 1994', pmid: '7935686' }],
}
export default hypotherm_vitals
