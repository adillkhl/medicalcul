import type { FormulaDefinition } from '../types'

const iadllawton: FormulaDefinition = {
  id: 'iadllawton', slug: 'iadllawton',
  name: 'IADL de Lawton — Activités Instrumentales de la Vie Quotidienne',
  specialty: 'geriatrie', category: 'Évaluation gériatrique',
  description: 'Échelle des activités instrumentales de la vie quotidienne de Lawton. Évalue 8 activités (téléphone, courses, cuisine, lessive, transports, médicaments, finances) côté 0-1 ou 0-3. Version simplifiée à score /8.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'telephone', type: 'boolean', label: 'Téléphone — Capacité à utiliser le téléphone seul (compose, répond)', weight: 1 },
    { id: 'courses', type: 'boolean', label: 'Courses — Capacité à faire les courses seul (achats quotidiens)', weight: 1 },
    { id: 'cuisine', type: 'boolean', label: 'Cuisine — Capacité à préparer les repas seul', weight: 1 },
    { id: 'lessive', type: 'boolean', label: 'Lessive — Capacité à faire la lessive seul', weight: 1 },
    { id: 'transport', type: 'boolean', label: 'Transports — Capacité à utiliser les transports en commun ou conduire', weight: 1 },
    { id: 'medicaments', type: 'boolean', label: 'Médicaments — Capacité à gérer seul sa prise de médicaments (doses, horaires)', weight: 1 },
    { id: 'finances', type: 'boolean', label: 'Finances — Capacité à gérer seul son budget (paiements, chéquier)', weight: 1 },
    { id: 'menage', type: 'boolean', label: 'Ménage — Capacité à faire le ménage seul (entretien du domicile)', weight: 1 },
  ],
  calculate: (values) => {
    const telephone = values.telephone ? 1 : 0
    const courses = values.courses ? 1 : 0
    const cuisine = values.cuisine ? 1 : 0
    const lessive = values.lessive ? 1 : 0
    const transport = values.transport ? 1 : 0
    const medicaments = values.medicaments ? 1 : 0
    const finances = values.finances ? 1 : 0
    const menage = values.menage ? 1 : 0

    const score = telephone + courses + cuisine + lessive + transport + medicaments + finances + menage

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score === 8) {
      label = 'IADL Lawton 8/8 — Autonomie totale pour les activités instrumentales'
      severity = 'low'
      recommendation = 'Maintien à domicile possible sans aide extérieure. Surveillance standard.'
    } else if (score >= 5) {
      label = `IADL Lawton ${score}/8 — Dépendance partielle`
      severity = 'low'
      recommendation = 'Perte d\'autonomie modérée. Aide à domicile partielle nécessaire (aide-ménagère, portage de repas, etc.). Évaluation sociale.'
    } else if (score >= 3) {
      label = `IADL Lawton ${score}/8 — Dépendance modérée`
      severity = 'moderate'
      recommendation = 'Dépendance modérée pour les activités instrumentales. Aide à domicile renforcée. Aides techniques (téléalarme, etc.). Suivi gériatrique.'
    } else {
      label = `IADL Lawton ${score}/8 — Dépendance sévère`
      severity = 'high'
      recommendation = 'Dépendance sévère pour les activités instrumentales. Aide humaine importante nécessaire. Discussion sur l\'entrée en institution ou l\'hospitalisation à domicile (HAD).'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Téléphone': telephone ? 'Autonome' : 'Aide nécessaire',
        'Courses': courses ? 'Autonome' : 'Aide nécessaire',
        'Cuisine': cuisine ? 'Autonome' : 'Aide nécessaire',
        'Lessive': lessive ? 'Autonome' : 'Aide nécessaire',
        'Transports': transport ? 'Autonome' : 'Aide nécessaire',
        'Médicaments': medicaments ? 'Autonome' : 'Aide nécessaire',
        'Finances': finances ? 'Autonome' : 'Aide nécessaire',
        'Ménage': menage ? 'Autonome' : 'Aide nécessaire',
        'Score total': `${score}/8`,
      },
      ranges: [
        { min: 8, max: 8, label: '8/8 — Autonomie', severity: 'low', recommendation: 'Maintien à domicile.' },
        { min: 5, max: 7, label: '5-7/8 — Dépendance partielle', severity: 'low', recommendation: 'Aide partielle.' },
        { min: 3, max: 4, label: '3-4/8 — Dépendance modérée', severity: 'moderate', recommendation: 'Aide renforcée.' },
        { min: 0, max: 2, label: '0-2/8 — Dépendance sévère', severity: 'high', recommendation: 'Aide importante.' },
      ],
    }
  },
  interpretation: `**IADL de Lawton — Activités Instrumentales de la Vie Quotidienne**

Évalue 8 activités complexes nécessaires à la vie autonome à domicile. Chaque item est côté 0 (dépendant) ou 1 (autonome). Score total /8.

**Items :**
1. Téléphone (composer, répondre)
2. Courses (achats quotidiens)
3. Cuisine (préparation des repas)
4. Lessive (entretien du linge)
5. Transports (conduite, transports en commun)
6. Médicaments (gestion des prises)
7. Finances (gestion budgétaire)
8. Ménage (entretien du domicile)

**Interprétation :**
- **8** : Autonomie totale
- **5-7** : Dépendance partielle (aide à domicile)
- **3-4** : Dépendance modérée (aide renforcée)
- **0-2** : Dépendance sévère

L\'IADL complète l\'ADL de Katz (activités de base) pour une évaluation globale de l\'autonomie.`,
  clinicalCommentary: 'L\'IADL de Lawton est un outil complémentaire à l\'ADL de Katz. Alors que l\'ADL évalue les activités de base (bain, habillage, toilette, transfert, continence, repas), l\'IADL évalue les activités plus complexes nécessaires à la vie indépendante à domicile. La perte des IADL précède généralement celle des ADL dans le déclin fonctionnel. Utile pour décider des aides à domicile et suivre l\'évolution de l\'autonomie.',
  references: [
    { type: 'pubmed', title: 'Lawton MP, Brody EM. Assessment of older people: self-maintaining and instrumental activities of daily living. Gerontologist 1969', pmid: '5309366' },
    { type: 'pubmed', title: 'Katz S et al. Studies of illness in the aged. The index of ADL. JAMA 1963', pmid: '14032433' },
    { type: 'guideline', title: 'HAS — Évaluation de l\'autonomie de la personne âgée', url: 'https://www.has-sante.fr/' },
  ],
}
export default iadllawton
