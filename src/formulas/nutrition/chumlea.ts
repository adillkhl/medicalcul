import type { FormulaDefinition } from '../types'

const chumlea: FormulaDefinition = {
  id: 'chumlea', slug: 'chumlea',
  name: 'Formule de Chumlea — Estimation de la taille par la hauteur du genou',
  specialty: 'nutrition', category: 'Anthropométrie',
  description: 'Estimation de la taille chez la personne âgée à partir de la hauteur du genou (knee height) selon les équations de Chumlea (1985, 1994). Utile chez les patients non mesurables (alités, tassements vertébraux).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'knee_height', type: 'number', label: 'Hauteur du genou (knee height)', unit: 'cm', min: 30, max: 70, step: 0.5, placeholder: 'Ex: 50' },
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 110, step: 1, placeholder: 'Ex: 75' },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 1, label: 'Femme' }, { value: 2, label: 'Homme' }] },
    { id: 'origine', type: 'radio', label: 'Origine ethnique', options: [{ value: 0, label: 'Caucasienne' }, { value: 1, label: 'Noire (Afro-américaine)' }] },
  ],
  calculate: (values) => {
    const kh = Number(values.knee_height) || 50
    const age = Number(values.age) || 75
    const sexe = Number(values.sexe) || 2
    const origine = Number(values.origine) || 0

    if (kh <= 0 || age <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Taille non estimable', severity: 'low' }] }
    }

    let tailleEstimee: number

    if (origine === 0) {
      // Caucasien
      if (sexe === 1) {
        // Femme: Taille = 84.88 - (0.24 × age) + (1.83 × knee height)
        tailleEstimee = 84.88 - (0.24 * age) + (1.83 * kh)
      } else {
        // Homme: Taille = 59.01 - (0.04 × age) + (2.08 × knee height)
        tailleEstimee = 59.01 - (0.04 * age) + (2.08 * kh)
      }
    } else {
      // Noir (Afro-américain)
      if (sexe === 1) {
        // Femme: Taille = 75.48 - (0.13 × age) + (1.91 × knee height)
        tailleEstimee = 75.48 - (0.13 * age) + (1.91 * kh)
      } else {
        // Homme: Taille = 60.83 - (0.03 × age) + (2.13 × knee height)
        tailleEstimee = 60.83 - (0.03 * age) + (2.13 * kh)
      }
    }

    const tailleArrondie = Math.round(tailleEstimee * 10) / 10

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'

    if (tailleArrondie < 130) {
      label = `Taille estimée : ${tailleArrondie} cm — Petite taille (hors limites de confiance)`
      severity = 'moderate'
    } else if (tailleArrondie > 200) {
      label = `Taille estimée : ${tailleArrondie} cm — Grande taille (hors limites de confiance)`
      severity = 'moderate'
    } else {
      label = `Taille estimée : ${tailleArrondie} cm`
      severity = 'low'
    }

    return { value: tailleArrondie, label, severity,
      details: {
        'Hauteur du genou': `${kh} cm`,
        'Âge': `${age} ans`,
        'Origine': origine === 0 ? 'Caucasienne' : 'Noire',
        'Équation utilisée': sexe === 1 ? 'Femme' : 'Homme',
      },
      ranges: [
        { min: 0, max: 129, label: '< 130 cm', severity: 'moderate' },
        { min: 130, max: 200, label: '130-200 cm — Estimation valide', severity: 'low' },
        { min: 200.1, max: 300, label: '> 200 cm', severity: 'moderate' },
      ]}
  },
  interpretation: `**Formule de Chumlea (1985, 1994) — Estimation taille par hauteur du genou**

**Équations caucasiennes :**
- Homme : Taille = 59.01 - (0.04 × Âge) + (2.08 × KH)
- Femme : Taille = 84.88 - (0.24 × Âge) + (1.83 × KH)

**Équations (noir afro-américain) :**
- Homme : Taille = 60.83 - (0.03 × Âge) + (2.13 × KH)
- Femme : Taille = 75.48 - (0.13 × Âge) + (1.91 × KH)

*KH = Knee Height (hauteur du genou en cm)*

**Mesure de la hauteur du genou :** patient assis ou allongé, genou fléchi à 90°, mesurer entre le talon et la face antérieure de la cuisse (au-dessus de la rotule).`,
  clinicalCommentary: 'La formule de Chumlea est utile en gériatrie pour estimer la taille chez les patients qui ne peuvent pas se tenir debout (tassements vertébraux, cyphose, alitement). L\'estimation est fiable à ± 5 cm. Alternative : utiliser la demi-envergure (demi-span) ou la longueur bras-talon. La taille estimée peut ensuite être utilisée pour calculer l\'IMC ou les besoins énergétiques.',
  references: [
    { type: 'pubmed', title: 'Chumlea WC et al. Estimating stature from knee height in persons 60 to 90 years of age. J Am Geriatr Soc 1985', pmid: '3989188' },
    { type: 'pubmed', title: 'Chumlea WC et al. Prediction of stature from knee height in African-American adults. J Am Diet Assoc 1994', pmid: '8046171' },
  ],
}
export default chumlea
