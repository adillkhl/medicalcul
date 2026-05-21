import type { FormulaDefinition } from '../types'

const cavo2: FormulaDefinition = {
  id: 'cavo2', slug: 'cavo2',
  name: 'CaO₂ / CvO₂ / DO₂ — Contenu Artério-Veineux en Oxygène et Transport d\'Oxygène',
  specialty: 'reanimation', category: 'Oxygénation',
  description: 'Calcul du contenu artériel (CaO₂) et veineux (CvO₂) en oxygène, de la différence artério-veineuse en O₂ (Da-vO₂), du débit d\'oxygène transporté (DO₂), de la consommation d\'oxygène (VO₂) et du coefficient d\'extraction (O₂ER). Paramètres essentiels de la physiologie respiratoire et de la réanimation.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'hb', type: 'number', label: 'Hémoglobine', unit: 'g/dL', min: 3, max: 20, step: 0.1, placeholder: 'Ex: 12' },
    { id: 'pao2', type: 'number', label: 'PaO₂ (pression artérielle en O₂)', unit: 'mmHg', min: 20, max: 700, step: 1, placeholder: 'Ex: 95' },
    { id: 'sao2', type: 'number', label: 'SaO₂ (saturation artérielle en O₂)', unit: '%', min: 20, max: 100, step: 1, placeholder: 'Ex: 98' },
    { id: 'pvo2', type: 'number', label: 'PvO₂ (pression veineuse en O₂, optionnel)', unit: 'mmHg', min: 10, max: 100, step: 1, placeholder: 'Ex: 40' },
    { id: 'svo2', type: 'number', label: 'SvO₂ (saturation veineuse en O₂, optionnel)', unit: '%', min: 10, max: 100, step: 1, placeholder: 'Ex: 75' },
    { id: 'dc', type: 'number', label: 'Débit cardiaque (optionnel)', unit: 'L/min', min: 1, max: 20, step: 0.1, placeholder: 'Ex: 5' },
    { id: 'fio2', type: 'number', label: 'FiO₂ (optionnel)', unit: 'fraction', min: 0.21, max: 1.0, step: 0.01, placeholder: 'Ex: 0.21' },
  ],
  calculate: (values) => {
    const hb = Number(values.hb) || 12
    const pao2 = Number(values.pao2) || 95
    const sao2 = Number(values.sao2) || 98
    const pvo2 = values.pvo2 ? Number(values.pvo2) : undefined
    const svo2 = values.svo2 ? Number(values.svo2) : undefined
    const dc = values.dc ? Number(values.dc) : undefined
    const fio2 = values.fio2 ? Number(values.fio2) : undefined

    if (hb <= 0 || pao2 <= 0 || sao2 <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'CaO₂ non calculable', severity: 'low', recommendation: 'Renseigner Hb, PaO₂, SaO₂.' }] }
    }

    // Constants
    const hbCapacity = 1.34 // mL O₂ per gram of Hb (Hüfner constant)
    const dissolvedO2 = 0.003 // mL O₂ per 100 mL blood per mmHg

    // CaO₂: Arterial oxygen content (mL O₂/100mL blood)
    // CaO₂ = (Hb × 1.34 × SaO₂/100) + (PaO₂ × 0.003)
    const cao2 = (hb * hbCapacity * sao2 / 100) + (pao2 * dissolvedO2)
    const cao2Round = Math.round(cao2 * 10) / 10

    let cvo2: number | undefined
    let cvo2Round: number | undefined
    let davo2: number | undefined
    let davo2Round: number | undefined
    let o2er: number | undefined
    let o2erRound: number | undefined

    if (svo2 !== undefined && pvo2 !== undefined) {
      cvo2 = (hb * hbCapacity * svo2 / 100) + (pvo2 * dissolvedO2)
      cvo2Round = Math.round(cvo2 * 10) / 10
      davo2 = cao2 - cvo2
      davo2Round = Math.round(davo2 * 10) / 10
      o2er = (davo2 / cao2) * 100
      o2erRound = Math.round(o2er * 10) / 10
    } else if (svo2 !== undefined) {
      cvo2 = (hb * hbCapacity * svo2 / 100)
      cvo2Round = Math.round(cvo2 * 10) / 10
      davo2 = cao2 - cvo2
      davo2Round = Math.round(davo2 * 10) / 10
      o2er = (davo2 / cao2) * 100
      o2erRound = Math.round(o2er * 10) / 10
    }

    // DO₂: Oxygen delivery (mL O₂/min)
    let do2: number | undefined
    let do2Round: number | undefined
    if (dc) {
      do2 = cao2 * dc * 10 // *10 to convert per 100mL to per L
      do2Round = Math.round(do2)
    }

    // VO₂: Oxygen consumption (mL O₂/min)
    let vo2: number | undefined
    let vo2Round: number | undefined
    if (dc && davo2) {
      vo2 = davo2 * dc * 10
      vo2Round = Math.round(vo2)
    }

    // PaO₂/FiO₂ ratio
    let pf: number | undefined
    let pfRound: number | undefined
    if (fio2 && fio2 > 0) {
      pf = pao2 / fio2
      pfRound = Math.round(pf)
    }

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (cao2 < 15) {
      label = `CaO₂ = ${cao2Round} mL O₂/100mL — Diminué (hypoxémie)`
      severity = 'moderate'
      recommendation = 'CaO₂ bas. Rechercher cause : anémie, hypoxémie, intoxication CO. Transfusion si Hb < 7-8 g/dL ou instabilité hémodynamique.'
    } else if (cao2 < 18) {
      label = `CaO₂ = ${cao2Round} mL O₂/100mL — Limite`
      severity = 'low'
      recommendation = 'CaO₂ limite bas. Vérifier Hb et SaO₂.'
    } else if (cao2 < 22) {
      label = `CaO₂ = ${cao2Round} mL O₂/100mL — Normal`
      severity = 'low'
      recommendation = 'Capacité de transport d\'oxygène normale.'
    } else {
      label = `CaO₂ = ${cao2Round} mL O₂/100mL — Élevé (polyglobulie)`
      severity = 'low'
      recommendation = 'CaO₂ élevé. Vérifier hématocrite. Rechercher polyglobulie si Hb > 16-17 g/dL.'
    }

    const details: Record<string, string | number | undefined> = {
      'CaO₂': `${cao2Round} mL O₂/100mL`,
      'Équation CaO₂': `(Hb × 1.34 × SaO₂) + (PaO₂ × 0.003)`,
      'Hb × 1.34 × SaO₂/100': `${Math.round(hb * hbCapacity * sao2 / 100 * 10) / 10} mL`,
      'PaO₂ dissous': `${Math.round(pao2 * dissolvedO2 * 10) / 10} mL`,
    }
    if (cvo2Round !== undefined) details['CvO₂'] = `${cvo2Round} mL O₂/100mL`
    if (davo2Round !== undefined) details['Da-vO₂'] = `${davo2Round} mL O₂/100mL`
    if (o2erRound !== undefined) details['O₂ER'] = `${o2erRound}%`
    if (do2Round !== undefined) details['DO₂'] = `${do2Round} mL O₂/min`
    if (vo2Round !== undefined) details['VO₂'] = `${vo2Round} mL O₂/min`
    if (pfRound !== undefined) details['PaO₂/FiO₂'] = `${pfRound} mmHg`

    return { value: cao2Round, label, severity, recommendation, details,
      ranges: [
        { min: 0, max: 14.9, label: '< 15 mL/100mL — Diminué', severity: 'moderate', recommendation: 'Corriger anémie/hypoxémie.' },
        { min: 15, max: 17.9, label: '15-18 mL/100mL — Limite', severity: 'low' },
        { min: 18, max: 22, label: '18-22 mL/100mL — Normal', severity: 'low' },
        { min: 22, max: 35, label: '> 22 mL/100mL — Élevé', severity: 'low', recommendation: 'Polyglobulie possible.' },
      ]}
  },
  interpretation: `**Paramètres d\'oxygénation sanguine**

**CaO₂ (contenu artériel en O₂) :**
CaO₂ = (Hb × 1.34 × SaO₂) + (PaO₂ × 0.003)
- Valeur normale : 18-22 mL O₂/100 mL
- 1.34 = capacité de fixation de l\'Hb (mL O₂/g Hb)
- 0.003 = coefficient de solubilité de l\'O₂ dans le plasma

**CvO₂ (contenu veineux en O₂) :**
CvO₂ = (Hb × 1.34 × SvO₂) + (PvO₂ × 0.003)
- Valeur normale : 13-16 mL O₂/100 mL
- SvO₂ normale : 65-80%

**Da-vO₂ (différence artério-veineuse en O₂) :**
Da-vO₂ = CaO₂ - CvO₂
- Normale : 3-5 mL O₂/100 mL

**DO₂ (débit d\'oxygène transporté) :**
DO₂ = CaO₂ × DC × 10
- Normale : 800-1200 mL O₂/min

**VO₂ (consommation d\'oxygène) :**
VO₂ = (CaO₂ - CvO₂) × DC × 10
- Normale : 200-300 mL O₂/min

**O₂ER (coefficient d\'extraction d\'oxygène) :**
O₂ER = (CaO₂ - CvO₂) / CaO₂ × 100
- Normale : 20-30%`,
  clinicalCommentary: 'Le transport d\'oxygène (DO₂) dépend du débit cardiaque et du CaO₂. En réanimation, le monitorage de la SvO₂ (ou ScvO₂) permet d\'évaluer l\'adéquation entre apport et consommation d\'O₂. Une SvO₂ < 65% indique une insuffisance du transport en O₂ (choc, anémie, hypoxémie). Le CaO₂ est plus sensible à l\'anémie qu\'à l\'hypoxémie. Les objectifs de réanimation précoce (Early Goal-Directed Therapy) incluent ScvO₂ > 70%, DO₂ > 600 mL/min/m².',
  references: [
    { type: 'pubmed', title: 'Rivers E et al. Early goal-directed therapy in the treatment of severe sepsis and septic shock. N Engl J Med 2001', pmid: '11794169' },
    { type: 'pubmed', title: 'Vincent JL et al. The oxygen extraction ratio: a useful indicator of tissue oxygenation. Intensive Care Med 2003' },
    { type: 'guideline', title: 'SRLF — Recommandations pour la prise en charge du choc septique', url: 'https://www.srlf.org/' },
  ],
}
export default cavo2
