import type { FormulaDefinition } from '../types'

const depenergie: FormulaDefinition = {
  id: 'depenergie', slug: 'depenergie',
  name: 'Dépense Énergétique — Métabolisme de Base et Dépense Totale',
  specialty: 'nutrition', category: 'Énergie',
  description: 'Calcul de la dépense énergétique de base (DEB / BMR) selon les formules de Harris-Benedict, Mifflin-St Jeor, Black et FAO/WHO. Estimation de la dépense énergétique totale (DET) selon l\'activité.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 1, label: 'Femme' }, { value: 2, label: 'Homme' }] },
    { id: 'poids', type: 'number', label: 'Poids', unit: 'kg', min: 10, max: 300, step: 0.1, placeholder: 'Ex: 70' },
    { id: 'taille', type: 'number', label: 'Taille', unit: 'cm', min: 50, max: 250, step: 0.5, placeholder: 'Ex: 170' },
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 1, max: 120, step: 1, placeholder: 'Ex: 40' },
    { id: 'activite', type: 'radio', label: 'Niveau d\'activité physique', options: [
      { value: 1, label: 'Sédentaire (pas d\'exercice)' },
      { value: 1.12, label: 'Activité légère (1-2 j/sem)' },
      { value: 1.27, label: 'Activité modérée (3-5 j/sem)' },
      { value: 1.45, label: 'Activité intense (6-7 j/sem)' },
      { value: 1.65, label: 'Activité très intense (sportif de haut niveau)' },
    ]},
    { id: 'formule', type: 'radio', label: 'Formule préférée', options: [
      { value: 0, label: 'Mifflin-St Jeor (recommandée)' },
      { value: 1, label: 'Harris-Benedict (1919)' },
      { value: 2, label: 'Black et al. (1996)' },
      { value: 3, label: 'FAO/WHO (1985)' },
    ]},
  ],
  calculate: (values) => {
    const sexe = Number(values.sexe) || 2
    const poids = Number(values.poids) || 70
    const taille = Number(values.taille) || 170
    const age = Number(values.age) || 40
    const activite = Number(values.activite) || 1
    const formule = Number(values.formule) || 0

    if (poids <= 0 || taille <= 0 || age <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'DEB non calculable', severity: 'low' }] }
    }

    let debHarrisBenedict: number
    let debMifflin: number
    let debBlack: number
    let debFAO: number

    if (sexe === 1) {
      // Femme
      debHarrisBenedict = 655.1 + (9.563 * poids) + (1.850 * taille) - (4.676 * age)
      debMifflin = (10 * poids) + (6.25 * taille) - (5 * age) - 161
      debBlack = (0.963 * Math.pow(poids, 0.48) * Math.pow(taille, 0.50) * Math.pow(age, -0.13) * 1000) / 4.184
      debFAO = (14.818 * poids) + 486.6
    } else {
      // Homme
      debHarrisBenedict = 66.5 + (13.75 * poids) + (5.003 * taille) - (6.775 * age)
      debMifflin = (10 * poids) + (6.25 * taille) - (5 * age) + 5
      debBlack = (0.048 * poids + 3.653) * 238.846 // Black simplified for men
      debFAO = (15.057 * poids) + 692.2
    }

    // Store selected DEB
    const debValues = [debMifflin, debHarrisBenedict, debBlack, debFAO]
    const debLabels = ['Mifflin-St Jeor', 'Harris-Benedict', 'Black et al.', 'FAO/WHO']
    const debSelection = debValues[formule]
    const debLabel = debLabels[formule]

    // Total energy expenditure
    const det = debSelection * activite

    const debRound = Math.round(debSelection)
    const detRound = Math.round(det)

    return { value: debRound, label: `DEB = ${debRound} kcal/j (${debLabel})`, severity: 'low',
      details: {
        'DEB Mifflin-St Jeor': `${Math.round(debMifflin)} kcal/j`,
        'DEB Harris-Benedict': `${Math.round(debHarrisBenedict)} kcal/j`,
        'DEB Black et al.': `${Math.round(debBlack)} kcal/j`,
        'DEB FAO/WHO': `${Math.round(debFAO)} kcal/j`,
        'DEB sélectionnée': `${debRound} kcal/j (${debLabel})`,
        'Dépense énergétique totale': `${detRound} kcal/j (activité × ${activite})`,
        'Coefficient d\'activité': `${activite}`,
      },
      ranges: [
        { min: 0, max: 4000, label: `DEB = ${debRound} kcal/j`, severity: 'low' },
      ]}
  },
  interpretation: `**Dépense énergétique de base (DEB) :**

**Mifflin-St Jeor (1990) — recommandée :**
- Homme : DEB = 10 × P + 6.25 × T - 5 × A + 5
- Femme : DEB = 10 × P + 6.25 × T - 5 × A - 161

**Harris-Benedict (1919) :**
- Homme : DEB = 66.5 + 13.75 × P + 5.003 × T - 6.775 × A
- Femme : DEB = 655.1 + 9.563 × P + 1.850 × T - 4.676 × A

**Dépense énergétique totale (DET) = DEB × PAL**

- Sédentaire : × 1.0
- Activité légère : × 1.12
- Activité modérée : × 1.27
- Activité intense : × 1.45
- Très intense : × 1.65

*P = poids (kg), T = taille (cm), A = âge (ans), PAL = Physical Activity Level*`,
  clinicalCommentary: 'La formule de Mifflin-St Jeor est la plus précise pour estimer la DEB chez les sujets non obèses (erreur moyenne ± 10%). Harris-Benedict surestime la DEB de 5-15% chez les sujets modernes. En réanimation ou en pathologie, des facteurs de correction (stress métabolique) doivent être appliqués. Pour la perte de poids : DET - 500 kcal/j.',
  references: [
    { type: 'pubmed', title: 'Mifflin MD et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr 1990', pmid: '2305711' },
    { type: 'pubmed', title: 'Harris JA, Benedict FG. A biometric study of human basal metabolism. Proc Natl Acad Sci 1918', pmid: '16576330' },
    { type: 'pubmed', title: 'FAO/WHO/UNU. Human energy requirements. Rome 2004', url: 'https://www.fao.org/3/y5686e/y5686e.pdf' },
  ],
}
export default depenergie
