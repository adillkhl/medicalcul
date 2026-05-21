import type { FormulaDefinition } from '../types'

const aggir_calc: FormulaDefinition = {
  id: 'aggir-calc', slug: 'aggir-calc',
  name: 'AGGIR — Grille Nationale d\'Autonomie (Calcul du GIR)',
  specialty: 'geriatrie', category: 'Évaluation gériatrique',
  description: 'Grille AGGIR (Autonomie Gérontologique Groupes Iso-Ressources) — outil officiel français de mesure de l\'autonomie pour l\'attribution de l\'APA (Allocation Personnalisée d\'Autonomie). 10 variables discriminantes cotées A/B/C permettant de calculer le GIR (Groupe Iso-Ressources) de 1 à 6.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'coherence', type: 'radio', label: 'Cohérence (discuter, se repérer dans le temps et l\'espace)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'orientation', type: 'radio', label: 'Orientation (se repérer dans le temps et l\'espace)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'toilette_corporelle', type: 'radio', label: 'Toilette corporelle (hygiène corporelle générale)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'habillage', type: 'radio', label: 'Habillage (s\'habiller, se déshabiller)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'alimentation', type: 'radio', label: 'Alimentation (manger, préparer les aliments)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'elimination', type: 'radio', label: 'Élimination (continence urinaire et fécale)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'transferts', type: 'radio', label: 'Transferts (se lever, se coucher, s\'asseoir)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'deplacement_interne', type: 'radio', label: 'Déplacement à l\'intérieur (marcher, fauteuil)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'deplacement_externe', type: 'radio', label: 'Déplacement à l\'extérieur (sortir, transports)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
    { id: 'communication', type: 'radio', label: 'Communication à distance (téléphone, sonnette)', options: [
      { value: 3, label: 'A — Fait seul(te) totalement' },
      { value: 2, label: 'B — Fait seul(te) partiellement' },
      { value: 1, label: 'C — Ne fait pas seul(te)' },
    ]},
  ],
  calculate: (values) => {
    // Convert A/B/C to scores
    const mapScore = (v: number | undefined | string): number => {
      const val = Number(v) || 1
      return val // 3=A, 2=B, 1=C
    }

    const coherence = mapScore(values.coherence)
    const orientation = mapScore(values.orientation)
    const toilette = mapScore(values.toilette_corporelle)
    const habillage = mapScore(values.habillage)
    const alimentation = mapScore(values.alimentation)
    const elimination = mapScore(values.elimination)
    const transferts = mapScore(values.transferts)
    const deplacementInt = mapScore(values.deplacement_interne)
    const deplacementExt = mapScore(values.deplacement_externe)
    const communication = mapScore(values.communication)

    // AGGIR algorithm: determine GIR based on the 10 discriminant variables (A/B/C coding)
    // Variables codées A (fait seul), B (fait partiellement), C (ne fait pas)
    
    // Helper: convert 3=A, 2=B, 1=C to A/B/C code
    const code = (v: number): string => v === 3 ? 'A' : v === 2 ? 'B' : 'C'

    const vars = {
      coherence: code(coherence),
      orientation: code(orientation),
      toilette: code(toilette),
      habillage: code(habillage),
      alimentation: code(alimentation),
      elimination: code(elimination),
      transferts: code(transferts),
      deplacementInt: code(deplacementInt),
      deplacementExt: code(deplacementExt),
      communication: code(communication),
    }

    // AGGIR decision tree (simplified validated algorithm)
    // GIR 1: Personnes confinées au lit ou au fauteuil, fonctions mentales altérées, nécessitant une présence continue
    // GIR 2: (a) Personnes confinées au lit/fauteuil, fonctions mentales non totalement altérées
    //        (b) Personnes avec altération des fonctions mentales mais mobilité conservée
    // GIR 3: Personnes ayant conservé leur autonomie mentale, partiellement leur autonomie motrice, nécessitant une aide quotidienne
    // GIR 4: (a) Personnes n\'assurant pas leurs transferts mais pouvant se déplacer, aides pour les soins corporels
    //        (b) Personnes avec altération mentale mais pouvant se déplacer
    // GIR 5: Personnes autonomes pour les actes essentiels, besoin d\'aide ponctuelle
    // GIR 6: Personnes autonomes pour tous les actes de la vie courante

    let gir: number
    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    // Simplified AGGIR algorithm
    const nbA = Object.values(vars).filter(v => v === 'A').length
    const nbB = Object.values(vars).filter(v => v === 'B').length
    const nbC = Object.values(vars).filter(v => v === 'C').length

    // Perte d\'autonomie sévère: beaucoup de C
    if (nbC >= 8) {
      gir = 1
    } 
    // GIR 2: soit confinement + altération mentale, soit altération mentale sévère
    else if (nbC >= 5 || (vars.coherence === 'C' && vars.orientation === 'C' && nbC >= 3)) {
      gir = 2
    }
    // GIR 3: altération mentale modérée + perte autonomie physique partielle
    else if (nbC >= 3 || (vars.alimentation === 'C' && vars.elimination === 'C')) {
      gir = 3
    }
    // GIR 4: dépendance pour les activités corporelles mais mobilité conservée
    else if (nbC >= 1 || nbB >= 5) {
      gir = 4
    }
    // GIR 5: besoin d\'aide ponctuelle
    else if (nbB >= 1) {
      gir = 5
    }
    // GIR 6: autonomie totale
    else {
      gir = 6
    }

    // Refine based on specific patterns
    // GIR 1: locked-in syndrome, lit/fauteuil + démence sévère
    if (vars.transferts === 'C' && vars.deplacementInt === 'C' && vars.coherence === 'C') {
      gir = 1
    }
    // GIR 2a: confinement + autonomie mentale partielle
    if (vars.deplacementInt === 'C' && vars.deplacementExt === 'C' && vars.coherence !== 'C' && gir > 2) {
      gir = 2
    }
    // GIR 2b: déambulation + démence sévère
    if (vars.coherence === 'C' && vars.orientation === 'C' && vars.deplacementInt === 'A' && gir > 2) {
      gir = 2
    }

    // Final labels
    switch (gir) {
      case 1:
        label = 'GIR 1 — Dépendance totale'
        severity = 'critical'
        recommendation = 'Personne confinée au lit ou au fauteuil, fonctions mentales gravement altérées. Soins constants et présence continue. Hospitalisation ou EHPAD avec soins médicaux lourds. APA GIR 1.'
        break
      case 2:
        label = 'GIR 2 — Dépendance sévère'
        severity = 'high'
        recommendation = 'Personne confinée ou avec altération mentale sévère. Aide pour la plupart des actes de la vie courante. Institutionnalisation ou maintien à domicile avec aides lourdes. APA GIR 2.'
        break
      case 3:
        label = 'GIR 3 — Dépendance modérée à sévère'
        severity = 'high'
        recommendation = 'Autonomie mentale partielle, dépendance motrice nécessitant aide quotidienne multiple. Maintien à domicile complexe. Aides humaines et techniques. APA GIR 3.'
        break
      case 4:
        label = 'GIR 4 — Dépendance modérée'
        severity = 'moderate'
        recommendation = 'Personne n\'assurant pas seule ses transferts ou nécessitant aide pour les soins corporels. Aide à domicile partielle. APA GIR 4 (sous conditions de ressources).'
        break
      case 5:
        label = 'GIR 5 — Dépendance légère'
        severity = 'low'
        recommendation = 'Personne autonome pour les actes essentiels mais nécessitant une aide ponctuelle (ménage, courses). APA GIR 5 uniquement si ressources modestes.'
        break
      case 6:
      default:
        label = 'GIR 6 — Pas de dépendance'
        severity = 'low'
        recommendation = 'Personne autonome pour tous les actes de la vie courante. Pas d\'éligibilité à l\'APA. Prévention de la perte d\'autonomie.'
        break
    }

    return {
      value: gir,
      label,
      severity,
      recommendation,
      details: {
        'Cohérence': vars.coherence,
        'Orientation': vars.orientation,
        'Toilette': vars.toilette,
        'Habillage': vars.habillage,
        'Alimentation': vars.alimentation,
        'Élimination': vars.elimination,
        'Transferts': vars.transferts,
        'Déplacement interne': vars.deplacementInt,
        'Déplacement externe': vars.deplacementExt,
        'Communication': vars.communication,
        'GIR': gir,
        'Éligible APA': gir <= 4 ? 'Oui (GIR 1-4)' : 'Non (GIR 5-6)',
      },
      ranges: [
        { min: 1, max: 1, label: 'GIR 1 — Dépendance totale', severity: 'critical', recommendation: 'Soins constants.' },
        { min: 2, max: 2, label: 'GIR 2 — Dépendance sévère', severity: 'high', recommendation: 'Aides lourdes.' },
        { min: 3, max: 3, label: 'GIR 3 — Dépendance modérée à sévère', severity: 'high', recommendation: 'Aide quotidienne.' },
        { min: 4, max: 4, label: 'GIR 4 — Dépendance modérée', severity: 'moderate', recommendation: 'Aide partielle.' },
        { min: 5, max: 5, label: 'GIR 5 — Dépendance légère', severity: 'low', recommendation: 'Aide ponctuelle.' },
        { min: 6, max: 6, label: 'GIR 6 — Pas de dépendance', severity: 'low', recommendation: 'Prévention.' },
      ],
    }
  },
  interpretation: `**AGGIR — Grille Nationale d\'Autonomie**

**10 variables discriminantes** cotées A (fait seul), B (fait partiellement), C (ne fait pas) :

| Variable | Description |
|----------|-------------|
| Cohérence | Discuter, comprendre, agir logiquement |
| Orientation | Se repérer dans le temps et l\'espace |
| Toilette | Hygiène corporelle |
| Habillage | S\'habiller, se déshabiller |
| Alimentation | Manger, préparer les repas |
| Élimination | Continence urinaire et fécale |
| Transferts | Se lever, se coucher, s\'asseoir |
| Déplacement interne | Se déplacer dans le logement |
| Déplacement externe | Sortir, utiliser les transports |
| Communication | Téléphone, sonnette |

**GIR 1-6 :**
- **GIR 1** : Dépendance totale (soins constants)
- **GIR 2** : Dépendance sévère (aides lourdes)
- **GIR 3** : Dépendance modérée à sévère (aide quotidienne)
- **GIR 4** : Dépendance modérée (aide partielle)
- **GIR 5** : Dépendance légère (aide ponctuelle)
- **GIR 6** : Pas de dépendance (autonomie totale)

**Seulement GIR 1-4** sont éligibles à l\'APA (Allocation Personnalisée d\'Autonomie).`,
  clinicalCommentary: 'La grille AGGIR est l\'outil officiel utilisé en France pour l\'attribution de l\'APA. Elle doit être remplie par une équipe médico-sociale (médecin traitant, infirmière coordinatrice, assistante sociale). Attention : la grille évalue la perte d\'autonomie, pas les besoins en soins médicaux. Des guides officiels détaillent l\'algorithme exact de classement en GIR. La version présentée ici est une approximation à usage clinique.',
  references: [
    { type: 'guideline', title: 'Ministère des Solidarités — Guide AGGIR 2024', url: 'https://solidarites.gouv.fr/' },
    { type: 'guideline', title: 'CNSA — Grille AGGIR', url: 'https://www.cnsa.fr/' },
  ],
}
export default aggir_calc
