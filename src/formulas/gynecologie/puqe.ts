import type { FormulaDefinition } from '../types'

const puqe: FormulaDefinition = {
  id: 'puqe',
  slug: 'puqe',
  name: 'PUQE (Score)',
  specialty: 'gynecologie',
  category: 'Vomissements gravidiques',
  description: 'Score PUQE (Pregnancy-Unique Quantification of Emesis) pour évaluer la sévérité des nausées et vomissements gravidiques.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'nv_jour',
      type: 'radio',
      label: 'Nausées ou sensation de malaise (en moyenne par jour, dernières 24h)',
      options: [
        { value: 1, label: 'Jamais' },
        { value: 2, label: '≤ 1 heure' },
        { value: 3, label: '2-3 heures' },
        { value: 4, label: '4-6 heures' },
        { value: 5, label: '> 6 heures' },
      ],
    },
    {
      id: 'vomissements',
      type: 'radio',
      label: 'Vomissements (nombre par jour, dernières 24h)',
      options: [
        { value: 1, label: 'Aucun' },
        { value: 2, label: '≤ 1 fois' },
        { value: 3, label: '2-3 fois' },
        { value: 4, label: '4-6 fois' },
        { value: 5, label: '> 6 fois' },
      ],
    },
    {
      id: 'hautlecoeur',
      type: 'radio',
      label: 'Haut-le-cœur / renvois secs (nombre par jour, dernières 24h)',
      options: [
        { value: 1, label: 'Aucun' },
        { value: 2, label: '≤ 1 fois' },
        { value: 3, label: '2-3 fois' },
        { value: 4, label: '4-6 fois' },
        { value: 5, label: '> 6 fois' },
      ],
    },
  ],
  calculate: (values) => {
    const nv = parseInt(values.nv_jour) || 1
    const vom = parseInt(values.vomissements) || 1
    const hlc = parseInt(values.hautlecoeur) || 1
    const total = nv + vom + hlc

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let label: string
    if (total <= 6) { severity = 'low'; label = 'NVG légères (score ≤ 6)' }
    else if (total <= 12) { severity = 'moderate'; label = 'NVG modérées (score 7-12)' }
    else { severity = 'critical'; label = 'NVG sévères — Hyperemesis Gravidarum (score ≥ 13)' }

    return {
      value: total,
      label: `PUQE : ${total}/15 — ${label}`,
      severity,
      ranges: [
        { min: 3, max: 6, label: 'NVG légères (≤ 6)', severity: 'low', recommendation: 'Rassurer. Conseils diététiques : repas fractionnés, secs, éviter déclencheurs. Gingembre. Réévaluer à 1 semaine.' },
        { min: 7, max: 12, label: 'NVG modérées (7-12)', severity: 'moderate', recommendation: 'Traitement médicamenteux : doxylamine + vitamine B6 (1er choix). Antihistaminiques H1. Surveillance poids et signes de déshydratation.' },
        { min: 13, max: 15, label: 'Hyperemesis Gravidarum (≥ 13)', severity: 'critical', recommendation: 'Hospitalisation. Bilan biologique : ionogramme, créatinine, bilan hépatique, corps cétoniques urinaires. Réhydratation IV. Antiémétiques : métoclopramide, ondansétron ± corticothérapie (si résistant). Prévention de la carence en thiamine (vitamine B1).' },
      ],
    }
  },
  interpretation: `Le **score PUQE** (Pregnancy-Unique Quantification of Emesis and Nausea) est un outil validé pour évaluer la sévérité des nausées et vomissements gravidiques (NVG) sur les dernières 24 heures.

**Trois questions cotées de 1 à 5 :**
1. Durée des nausées par jour
2. Nombre de vomissements par jour
3. Nombre de haut-le-cœur par jour

**Seuils :**
- ≤ 6 : léger
- 7-12 : modéré
- ≥ 13 : sévère (hyperemesis gravidarum)`,
  clinicalCommentary: `Le PUQE est simple, rapide et validé en français. Il permet de standardiser l évaluation et de guider la thérapeutique. L hyperemesis gravidarum (score ≥ 13) est une urgence médicale : risque de déshydratation, troubles hydro-électrolytiques, carence en thiamine (encéphalopathie de Gayet-Wernicke). La doxylamine + pyridoxine (B6) est le traitement de première ligne validé par les recommandations américaines (ACOG) et canadiennes.`,
  references: [
    {
      type: 'pubmed',
      title: 'Koren G et al. Validation of the PUQE scoring system. Am J Obstet Gynecol 2005',
      pmid: '15847886',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prise en charge des nausées et vomissements gravidiques (Recommandations 2020)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default puqe
