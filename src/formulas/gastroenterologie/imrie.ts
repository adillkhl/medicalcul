import type { FormulaDefinition } from '../types'

const imrie: FormulaDefinition = {
  id: 'imrie', slug: 'imrie',
  name: 'Modified Glasgow / Imrie Score (Pancréatite Aiguë)',
  specialty: 'gastroenterologie', category: 'Pancréatite',
  description: 'Score pronostique de Imrie (Modified Glasgow) pour la stratification de sévérité de la pancréatite aiguë — évalué à 48h de l\'admission',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 100, step: 1, placeholder: 'Ex: 62' },
    { id: 'pao2', type: 'number', label: 'PaO₂ (gaz du sang)', unit: 'mmHg', min: 40, max: 200, step: 1, placeholder: 'Ex: 75' },
    { id: 'albuminemie', type: 'number', label: 'Albuminémie', unit: 'g/L', min: 10, max: 50, step: 1, placeholder: 'Ex: 32' },
    { id: 'calcemie', type: 'number', label: 'Calcémie totale', unit: 'mmol/L', min: 1, max: 4, step: 0.01, placeholder: 'Ex: 2.10' },
    { id: 'glycemie', type: 'number', label: 'Glycémie (si non diabétique)', unit: 'mmol/L', min: 3, max: 30, step: 0.1, placeholder: 'Ex: 9.5' },
    { id: 'ldh', type: 'number', label: 'LDH', unit: 'UI/L', min: 50, max: 5000, step: 1, placeholder: 'Ex: 400' },
    { id: 'uree', type: 'number', label: 'Urée sanguine', unit: 'mmol/L', min: 1, max: 50, step: 0.1, placeholder: 'Ex: 8.0' },
    { id: 'leucocytes', type: 'number', label: 'Leucocytes', unit: 'G/L', min: 1, max: 50, step: 0.1, placeholder: 'Ex: 15.0' },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 50
    const pao2 = Number(values.pao2) || 90
    const albumine = Number(values.albuminemie) || 35
    const calcémie = Number(values.calcemie) || 2.30
    const glycémie = Number(values.glycemie) || 6.5
    const ldh = Number(values.ldh) || 200
    const urée = Number(values.uree) || 5.0
    const leuco = Number(values.leucocytes) || 8.0

    let score = 0

    // Modified Glasgow / Imrie criteria (8 parameters, 1 point each)
    if (age > 55) score += 1
    if (pao2 < 60) score += 1
    if (albumine < 32) score += 1
    if (calcémie < 2.0) score += 1
    if (glycémie > 10) score += 1
    if (ldh > 600) score += 1
    if (urée > 16) score += 1
    if (leuco > 15) score += 1

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let mortalite: string

    if (score <= 2) {
      severity = score === 0 ? 'low' : 'moderate'
      label = `Imrie ${score}/8 — Pancréatite peu sévère`
      mortalite = '< 1%'
    } else if (score <= 4) {
      severity = 'moderate'
      label = `Imrie ${score}/8 — Pancréatite modérément sévère`
      mortalite = '1-5%'
    } else if (score <= 6) {
      severity = 'high'
      label = `Imrie ${score}/8 — Pancréatite sévère`
      mortalite = '5-15%'
    } else {
      severity = 'critical'
      label = `Imrie ${score}/8 — Pancréatite très sévère`
      mortalite = '> 15%'
    }

    return {
      value: score,
      label,
      severity,
      details: {
        'Âge > 55 ans': age > 55 ? 'Oui (+1)' : 'Non',
        'PaO₂ < 60 mmHg': pao2 < 60 ? 'Oui (+1)' : 'Non',
        'Albumine < 32 g/L': albumine < 32 ? 'Oui (+1)' : 'Non',
        'Calcémie < 2.0 mmol/L': calcémie < 2.0 ? 'Oui (+1)' : 'Non',
        'Glycémie > 10 mmol/L': glycémie > 10 ? 'Oui (+1)' : 'Non',
        'LDH > 600 UI/L': ldh > 600 ? 'Oui (+1)' : 'Non',
        'Urée > 16 mmol/L': urée > 16 ? 'Oui (+1)' : 'Non',
        'Leucocytes > 15 G/L': leuco > 15 ? 'Oui (+1)' : 'Non',
        'Score': `${score}/8`,
        'Mortalité estimée': mortalite,
      },
      ranges: [
        { min: 0, max: 2, label: 'Pancréatite peu sévère (0-2/8)', severity: 'low', recommendation: 'Surveillance standard. Alimentation précoce si tolérée.' },
        { min: 3, max: 4, label: 'Pancréatite modérément sévère (3-4/8)', severity: 'moderate', recommendation: 'Surveillance hospitalière. Scan TDM à 48-72h.' },
        { min: 5, max: 6, label: 'Pancréatite sévère (5-6/8)', severity: 'high', recommendation: 'Soins intensifs. TDM injectée. Nutrition entérale précoce.' },
        { min: 7, max: 8, label: 'Pancréatite très sévère (7-8/8)', severity: 'critical', recommendation: 'Réanimation. TDM urgente. Avis chirurgical pour nécrosectomie.' },
      ],
    }
  },
  interpretation: 'Le **score de Imrie (Modified Glasgow Score)** est un score pronostique validé de sévérité de la pancréatite aiguë, évalué à 48h de l\'admission.\n\n**8 critères** (1 point chacun) : âge > 55 ans, PaO₂ < 60 mmHg, albumine < 32 g/L, calcémie < 2.0 mmol/L, glycémie > 10 mmol/L, LDH > 600 UI/L, urée > 16 mmol/L, leucocytes > 15 G/L.\n\n**Interprétation :** 0-2 = peu sévère, 3-4 = modérée, 5-6 = sévère, 7-8 = très sévère.',
  clinicalCommentary: 'Le score de Imrie est un score pronostique historique (1984) qui reste pertinent. Il nécessite 48h pour être complet, contrairement au BISAP ou au Ranson (également à 48h). Il est principalement utilisé en Europe et au Royaume-Uni. La présence d\'une nécrose pancréatique au scanner et l\'évolution clinique restent des éléments décisionnels majeurs. La prise en charge actuelle privilégie la réanimation précoce, la nutrition entérale, et la chirurgie retardée en cas de nécrose infectée.',
  references: [
    { type: 'pubmed', title: 'Imrie CW et al. A simple index of the severity of acute pancreatitis. Gut 1984', pmid: '6546972' },
    { type: 'pubmed', title: 'Blamey SL et al. Prognostic factors in acute pancreatitis. Gut 1984', pmid: '6546973' },
  ],
}
export default imrie
