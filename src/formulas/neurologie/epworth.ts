import type { FormulaDefinition } from '../types'

const epworth: FormulaDefinition = {
  id: 'epworth',
  slug: 'epworth',
  name: 'Epworth — Échelle de Somnolence Diurne',
  specialty: 'neurologie',
  category: 'Sommeil',
  description: 'Évaluation de la somnolence diurne excessive dans 8 situations de la vie quotidienne (score 0–24)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'assis_lecture',
      type: 'radio',
      label: 'Assis en train de lire',
      options: [
        { value: 0, label: '0 — Ne s\'endort jamais' },
        { value: 1, label: '1 — Faible risque de s\'endormir' },
        { value: 2, label: '2 — Risque modéré de s\'endormir' },
        { value: 3, label: '3 — Risque élevé de s\'endormir' },
      ],
    },
    {
      id: 'assis_tv',
      type: 'radio',
      label: 'Assis devant la télévision',
      options: [
        { value: 0, label: '0 — Jamais' },
        { value: 1, label: '1 — Faible' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Élevé' },
      ],
    },
    {
      id: 'assis_inactif',
      type: 'radio',
      label: 'Assis inactif dans un lieu public (cinéma, théâtre, réunion)',
      options: [
        { value: 0, label: '0 — Jamais' },
        { value: 1, label: '1 — Faible' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Élevé' },
      ],
    },
    {
      id: 'passager_voiture',
      type: 'radio',
      label: 'Passager d\'une voiture pendant 1 heure sans arrêt',
      options: [
        { value: 0, label: '0 — Jamais' },
        { value: 1, label: '1 — Faible' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Élevé' },
      ],
    },
    {
      id: 'allonge_apresmidi',
      type: 'radio',
      label: 'Allongé l\'après-midi (si les circonstances le permettent)',
      options: [
        { value: 0, label: '0 — Jamais' },
        { value: 1, label: '1 — Faible' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Élevé' },
      ],
    },
    {
      id: 'assis_parler',
      type: 'radio',
      label: 'Assis en train de parler avec quelqu\'un',
      options: [
        { value: 0, label: '0 — Jamais' },
        { value: 1, label: '1 — Faible' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Élevé' },
      ],
    },
    {
      id: 'assis_calme_repas',
      type: 'radio',
      label: 'Assis calmement après un repas sans alcool',
      options: [
        { value: 0, label: '0 — Jamais' },
        { value: 1, label: '1 — Faible' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Élevé' },
      ],
    },
    {
      id: 'voiture_arret',
      type: 'radio',
      label: 'En voiture arrêté quelques minutes dans les embouteillages',
      options: [
        { value: 0, label: '0 — Jamais' },
        { value: 1, label: '1 — Faible' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Élevé' },
      ],
    },
  ],
  calculate: (values) => {
    const assisLecture = values.assis_lecture ?? 0
    const assisTv = values.assis_tv ?? 0
    const assisInactif = values.assis_inactif ?? 0
    const passagerVoiture = values.passager_voiture ?? 0
    const allongeApresmidi = values.allonge_apresmidi ?? 0
    const assisParler = values.assis_parler ?? 0
    const assisCalmeRepas = values.assis_calme_repas ?? 0
    const voitureArret = values.voiture_arret ?? 0

    const total = assisLecture + assisTv + assisInactif + passagerVoiture + allongeApresmidi + assisParler + assisCalmeRepas + voitureArret

    const getLabel = (s: number) => {
      if (s <= 6) return 'Somnolence normale'
      if (s <= 10) return 'Somnolence légère (limite)'
      if (s <= 12) return 'Somnolence modérée'
      return 'Somnolence sévère'
    }

    return {
      value: total,
      label: getLabel(total),
      severity: total <= 6 ? 'low' : total <= 10 ? 'moderate' : total <= 12 ? 'high' : 'critical',
      details: { lire: assisLecture, tv: assisTv, inactif: assisInactif, passager: passagerVoiture, allonge: allongeApresmidi, parler: assisParler, repas: assisCalmeRepas, arret: voitureArret },
      ranges: [
        { min: 0, max: 6, label: 'Somnolence normale', severity: 'low', recommendation: 'Absence de somnolence diurne excessive. Pas d\'exploration spécifique. Conseils d\'hygiène du sommeil.' },
        { min: 7, max: 10, label: 'Somnolence légère', severity: 'moderate', recommendation: 'Somnolence modérée. Rechercher une cause : privation de sommeil, SAHOS, médicaments. Discuter polygraphie ventilatoire.' },
        { min: 11, max: 12, label: 'Somnolence modérée', severity: 'high', recommendation: 'Somnolence excessive probable. Bilan spécialisé : polygraphie ou polysomnographie, test d\'endormissement (TILE/TIM). Rechercher narcolepsie, SAHOS, hypersomnie.' },
        { min: 13, max: 24, label: 'Somnolence sévère', severity: 'critical', recommendation: 'Somnolence sévère. Consultation spécialisée urgente (centre du sommeil). Polysomnographie + TILE. Risque accidentel majoré : information sur la conduite automobile et les risques professionnels.' },
      ],
    }
  },
  interpretation: `L'**Échelle de Somnolence d’Epworth** (Epworth Sleepiness Scale, ESS) est le questionnaire d\'auto-évaluation le plus utilisé pour mesurer la somnolence diurne excessive.

Le patient évalue son risque de s’endormir (0–3) dans 8 situations de la vie quotidienne. **Total : 0–24.**

**Seuils :**
- 0–6 : somnolence normale
- 7–10 : somnolence légère
- 11–12 : somnolence modérée
- 13–24 : somnolence sévère (pathologique)

Un score ≥ 11 est évocateur de somnolence diurne excessive et justifie une exploration du sommeil.`,
  clinicalCommentary: `L\'Epworth est le premier outil de dépistage de la somnolence en neurologie. Très utile devant une suspicion de SAHOS, narcolepsie, hypersomnie idiopathique, ou pour évaluer l’impact d’un traitement. Un score > 10 est pathologique. Attention : l\'Epworth mesure la somnolence perçue, pas la somnolence réelle objectivée par le TILE (Test Itératif de Latence d\'Endormissement). Certains patients minimisent ou n’ont pas conscience de leur somnolence (conduite automobile dangereuse).`,
  references: [
    {
      type: 'pubmed',
      title: 'Johns MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. Sleep 1991',
      pmid: '1798888',
    },
    {
      type: 'pubmed',
      title: 'Johns MW. Reliability and factor analysis of the Epworth Sleepiness Scale. Sleep 1992',
      pmid: '1626133',
    },
  ],
}

export default epworth
