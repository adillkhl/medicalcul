import type { FormulaDefinition } from '../types'

const aggir_gir: FormulaDefinition = {
  id: 'aggir-gir', slug: 'aggir-gir',
  name: 'AGGIR — Interprétation du GIR (Groupe Iso-Ressources)',
  specialty: 'geriatrie', category: 'Évaluation gériatrique',
  description: 'Interprétation du GIR (Groupe Iso-Ressources) issu de la grille AGGIR. Description détaillée de chaque niveau de dépendance (GIR 1 à 6) avec les profils types, les besoins en aide humaine et technique, et les droits associés (APA).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'gir', type: 'radio', label: 'GIR (Groupe Iso-Ressources)', options: [
      { value: 1, label: 'GIR 1 — Dépendance totale' },
      { value: 2, label: 'GIR 2 — Dépendance sévère' },
      { value: 3, label: 'GIR 3 — Dépendance modérée à sévère' },
      { value: 4, label: 'GIR 4 — Dépendance modérée' },
      { value: 5, label: 'GIR 5 — Dépendance légère' },
      { value: 6, label: 'GIR 6 — Pas de dépendance' },
    ]},
    { id: 'sexe', type: 'radio', label: 'Sexe du patient', options: [
      { value: 0, label: 'Féminin' },
      { value: 1, label: 'Masculin' },
    ]},
  ],
  calculate: (values) => {
    const gir = Number(values.gir) || 6
    const sexe = Number(values.sexe) || 0

    const girLabels: Record<number, { label: string; description: string; profil: string; aides: string; apa: string; severite: 'low' | 'moderate' | 'high' | 'critical'; montantAPA: string; recours: string }> = {
      1: {
        label: 'GIR 1 — Dépendance totale',
        description: 'Personnes confinées au lit ou au fauteuil, dont les fonctions mentales sont gravement altérées et qui nécessitent une présence continue et indispensable d\'intervenants.',
        profil: 'Patient grabataire, démence sévère (MMS < 10), besoin d\'aide totale pour tous les actes de la vie quotidienne, alimentation artificielle possible, sonde urinaire, soins de nursing constants.',
        aides: '• Aide humaine : présence continue 24h/24 (infirmier, aide-soignant)\n• Aide technique : lits médicalisés, matelas anti-escarres, lève-malade, verticalisateur\n• Aide à la toilette : change complet, soins de bouche, prévention escarres\n• Alimentation : assistance totale, nutrition entérale si nécessaire',
        apa: 'Oui — GIR 1 éligible à l\'APA (Allocation Personnalisée d\'Autonomie)',
        severite: 'critical',
        montantAPA: 'Forfait APA GIR 1 : plan d\'aide maximal (environ 1 900 €/mois selon département)',
        recours: 'EHPAD (Établissement d\'Hébergement pour Personnes Âgées Dépendantes) avec unité de soins adaptés. Hospitalisation de longue durée si besoins médicaux complexes. USLD (Unité de Soins de Longue Durée).',
      },
      2: {
        label: 'GIR 2 — Dépendance sévère',
        description: 'Deux profils : (a) personnes confinées au lit ou au fauteuil dont les fonctions mentales ne sont pas totalement altérées et qui nécessitent une aide pour la plupart des actes de la vie courante ; (b) personnes dont les fonctions mentales sont altérées mais qui ont conservé leurs capacités motrices (déambulateurs déments).',
        profil: 'Profil A : patient alité, fonctions mentales conservées, besoin d\'aide totale pour transferts et déplacements. Profil B : patient déambulant avec troubles cognitifs sévères, besoin de surveillance constante.',
        aides: '• Aide humaine : aide totale pour la toilette, l\'habillage, les transferts\n• Aide technique : déambulateur, fauteuil roulant, téléalarme\n• Pour profil B : surveillance constante, sécurisation du domicile\n• Aide à la vie sociale : stimulation cognitive, accompagnement',
        apa: 'Oui — GIR 2 éligible à l\'APA',
        severite: 'high',
        montantAPA: 'Forfait APA GIR 2 : plan d\'aide élevé (environ 1 600 €/mois selon département)',
        recours: 'Maintien à domicile possible avec aides lourdes (SSIAD, aide-ménagère, auxiliaire de vie). EHPAD conseillé pour profil B (déambulation avec troubles cognitifs).',
      },
      3: {
        label: 'GIR 3 — Dépendance modérée à sévère',
        description: 'Personnes ayant conservé leur autonomie mentale, partiellement leur autonomie motrice, mais qui nécessitent quotidiennement et plusieurs fois par jour des aides pour les soins corporels.',
        profil: 'Patient autonome mentalement (MMS > 20), mais nécessitant aide pour la toilette, l\'habillage, les transferts. Peut se déplacer avec aide technique. Besoin d\'aide pour les activités instrumentales (courses, repas).',
        aides: '• Aide humaine : passage quotidien (matin et soir) pour toilette, habillage, transferts\n• Aide technique : barres d\'appui, rehausseur de WC, siège de douche, déambulateur\n• Téléassistance : téléalarme, visites de prévention\n• Aide à la vie sociale : portage de repas, aide-ménagère',
        apa: 'Oui — GIR 3 éligible à l\'APA',
        severite: 'high',
        montantAPA: 'Forfait APA GIR 3 : plan d\'aide important (environ 1 300 €/mois selon département)',
        recours: 'Maintien à domicile possible avec aides quotidiennes (SSIAD + aide-ménagère). Accueil de jour possible. EHPAD si la charge devient trop lourde.',
      },
      4: {
        label: 'GIR 4 — Dépendance modérée',
        description: 'Deux profils : (a) personnes n\'assurant pas seules leurs transferts mais pouvant se déplacer à l\'intérieur du logement, nécessitant une aide pour les soins corporels et les repas ; (b) personnes avec altération mentale mais pouvant se déplacer.',
        profil: 'Profil A : patient se déplaçant seul dans le logement, mais besoin d\'aide pour la toilette et l\'habillage. Profil B : patient avec troubles cognitifs modérés mais mobilité conservée, nécessitant stimulation pour les actes quotidiens.',
        aides: '• Aide humaine : aide pour la toilette (douche), habillage\n• Aide technique : canne, déambulateur, téléalarme\n• Aide à domicile : aide-ménagère, portage de repas\n• Pour profil B : stimulation cognitive, routine, surveillance',
        apa: 'Oui — GIR 4 éligible à l\'APA (sous conditions de ressources)',
        severite: 'moderate',
        montantAPA: 'Forfait APA GIR 4 : plan d\'aide modéré (environ 1 000 €/mois selon département)',
        recours: 'Maintien à domicile avec aides. Accueil de jour pour stimulations. Adaptation du logement. EHPAD envisageable si aggravation.',
      },
      5: {
        label: 'GIR 5 — Dépendance légère',
        description: 'Personnes autonomes pour les actes essentiels de la vie courante mais nécessitant une aide ponctuelle pour la préparation des repas, le ménage ou les courses.',
        profil: 'Personne âgée autonome pour la toilette, l\'habillage, l\'alimentation et les transferts. Besoin d\'aide uniquement pour les activités instrumentales (ménage, courses, repas). Pas de troubles cognitifs majeurs.',
        aides: '• Aide humaine : aide-ménagère 2-4h/semaine, portage de repas\n• Aide technique : aides légères (canne, barres d\'appui)\n• Aide sociale : portage de courses, service de transport\n• Stimulation : ateliers mémoire, activités sociales',
        apa: 'Oui — GIR 5 éligible à l\'APA mais uniquement allocation ciblée (sous condition de ressources, montant forfaitaire)',
        severite: 'low',
        montantAPA: 'Forfait APA GIR 5 : allocation limitée (environ 600-800 €/mois selon département et ressources)',
        recours: 'Maintien à domicile sans difficulté avec aides légères. Prévention de la perte d\'autonomie. Suivi médical régulier.',
      },
      6: {
        label: 'GIR 6 — Pas de dépendance',
        description: 'Personnes autonomes pour tous les actes de la vie courante, sans perte d\'autonomie significative.',
        profil: 'Personne âgée totalement autonome, vivant à domicile sans aide. Pas de troubles cognitifs ni moteurs. Activités sociales et physiques maintenues.',
        aides: '• Aide humaine : pas d\'aide nécessaire\n• Aide technique : éventuellement canne ou barres d\'appui préventives\n• Prévention : activité physique adaptée, nutrition équilibrée, lien social\n• Surveillance : bilan gériatrique annuel de prévention',
        apa: 'Non — GIR 6 non éligible à l\'APA',
        severite: 'low',
        montantAPA: 'Non éligible',
        recours: 'Autonomie complète. Prévention primaire. Pas de prise en charge spécifique nécessaire. Maintien du lien social et des activités.',
      },
    }

    const interpretation = girLabels[gir] || girLabels[6]

    return {
      value: gir,
      label: interpretation.label,
      severity: interpretation.severite,
      recommendation: interpretation.recours,
      details: {
        'GIR': `${gir}/6`,
        'Profil': interpretation.profil?.substring(0, 200),
        'Éligible APA': gir <= 4 ? 'Oui' : 'Non',
        'Forfait APA': interpretation.montantAPA,
        'Sexe': sexe === 0 ? 'Féminin' : 'Masculin',
      },
      ranges: Object.entries(girLabels).map(([key, val]) => ({
        min: Number(key),
        max: Number(key),
        label: val.label,
        severity: val.severite,
        recommendation: val.description,
      })),
    }
  },
  interpretation: `**AGGIR — Interprétation du GIR (Groupes Iso-Ressources)**

Le GIR est le résultat de la grille AGGIR qui évalue la perte d\'autonomie des personnes âgées. Seuls les GIR 1 à 4 ouvrent droit à l\'APA (Allocation Personnalisée d\'Autonomie).

**Résumé des GIR :**
- **GIR 1** : Dépendance totale — présence continue indispensable
- **GIR 2** : Dépendance sévère — aides lourdes quotidiennes
- **GIR 3** : Dépendance modérée à sévère — aide quotidienne pour les soins
- **GIR 4** : Dépendance modérée — aide pour les transferts et soins corporels
- **GIR 5** : Dépendance légère — aide ponctuelle (ménage, courses)
- **GIR 6** : Pas de dépendance — autonomie totale

**APA :** Allocation mensuelle versée par le Conseil Départemental, calculée selon le GIR et les ressources. Montants indicatifs pour 2024.`,
  clinicalCommentary: 'L\'évaluation AGGIR doit être réalisée par une équipe médico-sociale formée. Le résultat en GIR détermine non seulement l\'éligibilité à l\'APA mais aussi les orientations possibles (maintien à domicile, accueil de jour, EHPAD). Le GIR peut changer avec le temps : des réévaluations régulières sont nécessaires (au moins annuelles). Attention : l\'AGGIR évalue la perte d\'autonomie, pas les besoins en soins médicaux. Un patient en GIR 3 peut nécessiter des soins infirmiers lourds (pansements, perfusions) non pris en compte dans le GIR.',
  references: [
    { type: 'guideline', title: 'Ministère des Solidarités — Grille AGGIR et APA', url: 'https://solidarites.gouv.fr/' },
    { type: 'guideline', title: 'CNSA — Guide pratique de l\'APA', url: 'https://www.cnsa.fr/' },
    { type: 'url', title: 'Service-Public.fr — Allocation Personnalisée d\'Autonomie', url: 'https://www.service-public.fr/' },
  ],
}
export default aggir_gir
