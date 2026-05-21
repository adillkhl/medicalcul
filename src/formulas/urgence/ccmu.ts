import type { FormulaDefinition } from '../types'

const ccmu: FormulaDefinition = {
  id: 'ccmu', slug: 'ccmu',
  name: 'CCMU — Classification Clinique des Malades des Urgences',
  specialty: 'urgence', category: 'Classification',
  description: 'Classification Clinique des Malades des Urgences (CCMU) — évaluation de la gravité des patients consultant aux urgences. 5 classes de CCMU 1 (patient stable) à CCMU 5 (détresse vitale) plus D (décédé) et P (psychiatrique).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'class_ccmu', type: 'radio', label: 'Classe CCMU', options: [
      { value: 1, label: 'CCMU 1 — Patient stable, sans acte complémentaire, orientation externe' },
      { value: 2, label: 'CCMU 2 — Patient stable, acte diagnostique ou thérapeutique aux urgences' },
      { value: 3, label: 'CCMU 3 — Patient instable, pronostic vital non engagé' },
      { value: 4, label: 'CCMU 4 — Patient instable, pronostic vital engagé' },
      { value: 5, label: 'CCMU 5 — Patient instable, prise en charge immédiate des détresses vitales' },
      { value: 6, label: 'CCMU D — Patient décédé avant ou à l\'arrivée aux urgences' },
      { value: 7, label: 'CCMU P — Patient psychiatrique seul (sans pathologie somatique décelée)' },
    ]},
    { id: 'age', type: 'number', label: 'Âge du patient', unit: 'ans', min: 0, max: 120, step: 1, placeholder: 'Ex: 65' },
  ],
  calculate: (values) => {
    const classe = Number(values.class_ccmu) || 1
    const age = Number(values.age) || 40

    const classMap: Record<number, { label: string; description: string; stabilite: string; pronostic: string; orientation: string; severite: 'low' | 'moderate' | 'high' | 'critical' }> = {
      1: {
        label: 'CCMU 1 — Patient stable',
        description: 'Patient dont l\'état clinique est stable et pour lequel aucun acte complémentaire diagnostique ou thérapeutique n\'est nécessaire aux urgences. Orientation externe possible sans hospitalisation.',
        stabilite: 'État stable',
        pronostic: 'Pronostic vital non engagé',
        orientation: 'Retour à domicile ou consultation externe',
        severite: 'low',
      },
      2: {
        label: 'CCMU 2 — Patient stable avec acte',
        description: 'Patient dont l\'état clinique est stable mais nécessitant des actes complémentaires diagnostiques ou thérapeutiques aux urgences (biologie, imagerie, perfusion, suture, etc.).',
        stabilite: 'État stable',
        pronostic: 'Pronostic vital non engagé',
        orientation: 'Retour à domicile ou hospitalisation si nécessaire',
        severite: 'low',
      },
      3: {
        label: 'CCMU 3 — Patient instable, pronostic non engagé',
        description: 'Patient dont l\'état clinique est instable mais sans mise en jeu du pronostic vital. Surveillance continue, bilan étiologique. Exemples : crise d\'asthme, déshydratation, crise douloureuse.',
        stabilite: 'État instable',
        pronostic: 'Pronostic vital non engagé à court terme',
        orientation: 'Hospitalisation (UHCD, service spécialisé)',
        severite: 'moderate',
      },
      4: {
        label: 'CCMU 4 — Patient instable, pronostic engagé',
        description: 'Patient dont l\'état clinique est instable avec mise en jeu du pronostic vital. Prise en charge en urgence, réanimation ou soins intensifs. Exemples : SCA ST+, AVC, sepsis sévère, détresse respiratoire.',
        stabilite: 'État instable',
        pronostic: 'Pronostic vital engagé',
        orientation: 'Réanimation, soins intensifs, déchocage',
        severite: 'high',
      },
      5: {
        label: 'CCMU 5 — Détresse vitale immédiate',
        description: 'Patient nécessitant des manœuvres de réanimation immédiates dès l\'arrivée aux urgences (massage cardiaque, ventilation artificielle, remplissage massif). Pronostic vital immédiatement engagé.',
        stabilite: 'Détresse vitale immédiate',
        pronostic: 'Pronostic vital immédiatement engagé',
        orientation: 'Réanimation en cours, déchocage, soins intensifs',
        severite: 'critical',
      },
      6: {
        label: 'CCMU D — Décédé',
        description: 'Patient décédé avant son arrivée aux urgences ou décès constaté à l\'arrivée. Prise en charge médico-légale.',
        stabilite: 'Décédé',
        pronostic: 'Décès constaté',
        orientation: 'Thanatopraxie, levée de corps, procédure médico-légale',
        severite: 'critical',
      },
      7: {
        label: 'CCMU P — Patient psychiatrique',
        description: 'Patient ne présentant pas de pathologie somatique décelable nécessitant une prise en charge psychiatrique. Aucune lésion traumatique ou médicale associée.',
        stabilite: 'État stable',
        pronostic: 'Pronostic somatique non engagé',
        orientation: 'Orientation psychiatrique (CMP, hospitalisation psychiatrique)',
        severite: 'moderate',
      },
    }

    const cl = classMap[classe] || classMap[1]

    // Check age modifier
    let ageInfo = ''
    if (age >= 75) {
      ageInfo = 'Patient âgé ≥ 75 ans : risque de sous-évaluation des urgences (présentation atypique).'
    } else if (age <= 1) {
      ageInfo = 'Nourrisson : risque de décompensation rapide.'
    }

    return {
      value: classe,
      label: cl.label,
      severity: cl.severite,
      recommendation: cl.orientation,
      details: {
        'Classe': cl.label,
        'Stabilité': cl.stabilite,
        'Pronostic': cl.pronostic,
        'Âge': `${age} ans`,
        'Orientation': cl.orientation,
        'Information': ageInfo || 'Patient sans facteur de risque lié à l\'âge',
      },
      ranges: [
        { min: 1, max: 1, label: 'CCMU 1 — Stable, sans acte', severity: 'low', recommendation: 'Retour à domicile.' },
        { min: 2, max: 2, label: 'CCMU 2 — Stable, avec acte', severity: 'low', recommendation: 'Soins aux urgences.' },
        { min: 3, max: 3, label: 'CCMU 3 — Instable, pronostic non engagé', severity: 'moderate', recommendation: 'Hospitalisation.' },
        { min: 4, max: 4, label: 'CCMU 4 — Instable, pronostic engagé', severity: 'high', recommendation: 'Réanimation.' },
        { min: 5, max: 6, label: 'CCMU 5 — Détresse vitale', severity: 'critical', recommendation: 'Réanimation immédiate.' },
        { min: 7, max: 7, label: 'CCMU P — Psychiatrique', severity: 'moderate', recommendation: 'Orientation psychiatrique.' },
      ],
    }
  },
  interpretation: `**CCMU — Classification Clinique des Malades des Urgences**

Classification française standardisée (SFMU — Société Française de Médecine d\'Urgence) pour évaluer la gravité des patients aux urgences.

**7 classes :**
- **CCMU 1** : Patient stable, aucun acte nécessaire aux urgences
- **CCMU 2** : Patient stable, acte diagnostic/thérapeutique aux urgences
- **CCMU 3** : Patient instable, pronostic vital non engagé
- **CCMU 4** : Patient instable, pronostic vital engagé
- **CCMU 5** : Détresse vitale immédiate (réanimation en cours)
- **CCMU D** : Patient décédé
- **CCMU P** : Patient psychiatrique isolé

Ne pas confondre avec le tri (FRENCH, CRU) qui évalue l\'orientation initiale.`,
  clinicalCommentary: 'La CCMU est une classification rétrospective remplie après la prise en charge, à ne pas confondre avec un score de tri (orientation à l\'arrivée). Elle est utilisée pour l\'évaluation de l\'activité des services d\'urgences, la facturation (ATU) et les études épidémiologiques. Les CCMU 4 et 5 sont corrélés à la mortalité hospitalière. CCMU P est réservé aux patients sans pathologie somatique — si une pathologie somatique est découverte secondairement, reclasser en CCMU 2-5.',
  references: [
    { type: 'pubmed', title: 'SFMU — Classification CCMU. Réanimation Urgences 1999', url: 'https://www.sfmu.org/' },
    { type: 'guideline', title: 'SFMU — Guide d\'utilisation de la CCMU', url: 'https://www.sfmu.org/' },
  ],
}
export default ccmu
