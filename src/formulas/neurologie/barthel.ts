import type { FormulaDefinition } from '../types'

const barthel: FormulaDefinition = {
  id: 'barthel',
  slug: 'barthel',
  name: 'Barthel (Index) — Activités de la vie quotidienne',
  specialty: 'neurologie',
  category: 'Autonomie',
  description: 'Évaluation du niveau d\'indépendance fonctionnelle dans les activités de la vie quotidienne (score 0–100)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'alimentation',
      type: 'radio',
      label: 'Alimentation',
      options: [
        { value: 10, label: 'Indépendant : peut manger seul en temps raisonnable' },
        { value: 5, label: 'A besoin d\'aide pour couper, beurrer, etc.' },
        { value: 0, label: 'Dépendant : besoin d\'alimentation assistée' },
      ],
    },
    {
      id: 'bain',
      type: 'radio',
      label: 'Bain / Douche',
      options: [
        { value: 5, label: 'Indépendant : se lave seul (baignoire, douche)' },
        { value: 0, label: 'Dépendant : besoin d\'aide' },
      ],
    },
    {
      id: 'habillage',
      type: 'radio',
      label: 'Habillage',
      options: [
        { value: 10, label: 'Indépendant : s\'habille, se déshabille, lacets' },
        { value: 5, label: 'A besoin d\'aide mais peut faire la moitié' },
        { value: 0, label: 'Dépendant' },
      ],
    },
    {
      id: 'toilette',
      type: 'radio',
      label: 'Toilette (visage, cheveux, dents, rasage)',
      options: [
        { value: 5, label: 'Indépendant : se lave le visage, se coiffe, se brosse les dents' },
        { value: 0, label: 'Dépendant : besoin d\'aide' },
      ],
    },
    {
      id: 'selles',
      type: 'radio',
      label: 'Contrôle des selles',
      options: [
        { value: 10, label: 'Continent : pas d\'accident' },
        { value: 5, label: 'Accident occasionnel (1/semaine max)' },
        { value: 0, label: 'Incontinent (ou besoin de lavement/suppositoire)' },
      ],
    },
    {
      id: 'urines',
      type: 'radio',
      label: 'Contrôle des urines',
      options: [
        { value: 10, label: 'Continent : pas d\'accident (ou autosondage)' },
        { value: 5, label: 'Accident occasionnel (≤ 1/24h)' },
        { value: 0, label: 'Incontinent (ou sondé propre, non autonome)' },
      ],
    },
    {
      id: 'wc',
      type: 'radio',
      label: 'Utilisation des toilettes',
      options: [
        { value: 10, label: 'Indépendant : va aux toilettes seul, se rhabille' },
        { value: 5, label: 'A besoin d\'aide pour l\'équilibre, se nettoyer' },
        { value: 0, label: 'Dépendant' },
      ],
    },
    {
      id: 'transfert',
      type: 'radio',
      label: 'Transfert lit–chaise–fauteuil',
      options: [
        { value: 15, label: 'Indépendant : se transfert seul' },
        { value: 10, label: 'Surveillance minime ou aide verbale' },
        { value: 5, label: 'Aide importante (1–2 personnes)' },
        { value: 0, label: 'Dépendant : incapable de s\'asseoir' },
      ],
    },
    {
      id: 'marche',
      type: 'radio',
      label: 'Déplacements (marche ou fauteuil roulant)',
      options: [
        { value: 15, label: 'Marche indépendant sur 50 m (canne OK)' },
        { value: 10, label: 'Marche avec aide d\'une personne sur 50 m' },
        { value: 5, label: 'Fauteuil roulant autonome (tourne, passe portes)' },
        { value: 0, label: 'Immobile / dépendant pour les déplacements' },
      ],
    },
    {
      id: 'escaliers',
      type: 'radio',
      label: 'Escaliers',
      options: [
        { value: 10, label: 'Indépendant : monte et descend seul (canne OK)' },
        { value: 5, label: 'A besoin d\'aide ou de surveillance' },
        { value: 0, label: 'Incapable' },
      ],
    },
  ],
  calculate: (values) => {
    const alimentation = values.alimentation ?? 0
    const bain = values.bain ?? 0
    const habillage = values.habillage ?? 0
    const toilette = values.toilette ?? 0
    const selles = values.selles ?? 0
    const urines = values.urines ?? 0
    const wc = values.wc ?? 0
    const transfert = values.transfert ?? 0
    const marche = values.marche ?? 0
    const escaliers = values.escaliers ?? 0

    const total = alimentation + bain + habillage + toilette + selles + urines + wc + transfert + marche + escaliers

    const getSeverity = (s: number): 'low' | 'moderate' | 'high' | 'critical' => {
      if (s >= 60) return 'low'
      if (s >= 40) return 'moderate'
      if (s >= 20) return 'high'
      return 'critical'
    }

    return {
      value: total,
      label: total >= 80 ? 'Légère dépendance' : total >= 60 ? 'Dépendance modérée' : total >= 40 ? 'Dépendance sévère' : total >= 20 ? 'Dépendance très sévère' : 'Dépendance totale',
      severity: getSeverity(total),
      details: { Alimentation: alimentation, Bain: bain, Habillage: habillage, Toilette: toilette, Selles: selles, Urines: urines, WC: wc, Transfert: transfert, Marche: marche, Escaliers: escaliers },
      ranges: [
        { min: 80, max: 100, label: 'Légère dépendance', severity: 'low', recommendation: 'Autonomie quasi-normale. Retour à domicile envisageable avec aides légères (aide-ménagère, portage repas).' },
        { min: 60, max: 79, label: 'Dépendance modérée', severity: 'moderate', recommendation: 'Nécessite une aide partielle pour les AVQ. Maintien à domicile avec auxiliaire de vie ou structure de réadaptation.' },
        { min: 40, max: 59, label: 'Dépendance sévère', severity: 'high', recommendation: 'Aide importante nécessaire. Orientation vers structure SSR (soins de suite et réadaptation) ou EHPAD selon contexte.' },
        { min: 20, max: 39, label: 'Dépendance très sévère', severity: 'critical', recommendation: 'Dépendance majeure. Soins de longue durée ou hospitalisation. Aide humaine permanente (IDE, aide-soignant).' },
        { min: 0, max: 19, label: 'Dépendance totale', severity: 'critical', recommendation: 'Dépendance complète. Hospitalisation ou soins palliatifs. Prise en charge pluridisciplinaire.' },
      ],
    }
  },
  interpretation: `L'**Index de Barthel** mesure l’indépendance dans 10 activités de la vie quotidienne (AVQ). Score total de 0 (totalement dépendant) à 100 (totalement indépendant).

**Les 10 items :**
- Alimentation (0–10)
- Bain (0–5)
- Habillage (0–10)
- Toilette (0–5)
- Contrôle des selles (0–10)
- Contrôle des urines (0–10)
- Utilisation WC (0–10)
- Transfert lit/chaise (0–15)
- Déplacements (0–15)
- Escaliers (0–10)

**Interprétation :** 0–19 = dépendance totale, 20–39 = très sévère, 40–59 = sévère, 60–79 = modérée, 80–100 = légère.

L'index de Barthel est largement utilisé en gériatrie, neurologie et réadaptation pour évaluer le handicap et suivre l'évolution fonctionnelle.`,
  clinicalCommentary: `Le Barthel est un standard international, fiable et reproductible. Utilisé en routine dans les unités neurovasculaires (UNV) pour évaluer les séquelles d’AVC. Le score à la sortie d'hospitalisation prédit le devenir à long terme. Attention : il ne mesure pas les activités instrumentales (courses, téléphone, gestion financière) — pour cela, utiliser l’IADL de Lawton. Le temps de passation est d’environ 5 minutes en auto-questionnaire ou 10 minutes par entretien.`,
  references: [
    {
      type: 'pubmed',
      title: 'Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Md State Med J 1965',
      pmid: '14258950',
    },
    {
      type: 'pubmed',
      title: 'Collin C et al. The Barthel ADL Index: a reliability study. Int Disabil Stud 1988',
      pmid: '3403502',
    },
  ],
}

export default barthel
