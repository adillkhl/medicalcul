import type { FormulaDefinition } from '../types'

const manning: FormulaDefinition = {
  id: 'manning',
  slug: 'manning',
  name: 'Manning (Score)',
  specialty: 'gynecologie',
  category: 'Grossesse',
  description: 'Score biophysique de Manning pour évaluer le bien-être fœtal au 3e trimestre.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'mouvements',
      type: 'radio',
      label: 'Mouvements actifs du fœtus (en 30 min)',
      options: [
        { value: 2, label: '≥ 3 mouvements distincts' },
        { value: 0, label: '< 3 mouvements' },
      ],
    },
    {
      id: 'tonus',
      type: 'radio',
      label: 'Tonus fœtal (en 30 min)',
      options: [
        { value: 2, label: '≥ 1 mouvement d extension-flexion actif' },
        { value: 0, label: 'Pas de mouvement ou extension sans retour' },
      ],
    },
    {
      id: 'respiration',
      type: 'radio',
      label: 'Mouvements respiratoires fœtaux (en 30 min)',
      options: [
        { value: 2, label: '≥ 1 épisode de > 30 secondes' },
        { value: 0, label: '< 30 secondes ou absence' },
      ],
    },
    {
      id: 'liquide',
      type: 'radio',
      label: 'Volume de liquide amniotique',
      options: [
        { value: 2, label: '≥ 1 poche de liquide ≥ 2 cm (ILA > 5 cm)' },
        { value: 0, label: 'Poche maximale < 2 cm (oligoamnios)' },
      ],
    },
    {
      id: 'rcf',
      type: 'radio',
      label: 'Rythme cardiaque fœtal (RCF) — Non stress test',
      options: [
        { value: 2, label: 'Réactif (≥ 2 accélérations > 15 bpm > 15s en 20 min)' },
        { value: 0, label: 'Non réactif' },
      ],
    },
  ],
  calculate: (values) => {
    const mvt = parseInt(values.mouvements) || 0
    const tonus = parseInt(values.tonus) || 0
    const resp = parseInt(values.respiration) || 0
    const liquide = parseInt(values.liquide) || 0
    const rcf = parseInt(values.rcf) || 0
    const total = mvt + tonus + resp + liquide + rcf

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation: string
    if (total === 10) { severity = 'low'; recommendation = 'Fœtus en bonne santé. Pas d intervention nécessaire. Renouveler dans 1 semaine si indiqué.' }
    else if (total === 8) { severity = 'low'; recommendation = 'Fœtus probablement sain. Nouveau contrôle dans 24-48h si pathologie sous-jacente (RCIU, diabète, HTA).' }
    else if (total === 6) { severity = 'moderate'; recommendation = 'Suspect. Contrôle dans 6-12h. Si score persiste à 6, discuter extraction.' }
    else if (total === 4) { severity = 'high'; recommendation = 'Anormal. Décision d extraction discuté en fonction du terme et du contexte.' }
    else { severity = 'critical'; recommendation = 'Urgence obstétricale. Extraction immédiate (césarienne) sauf si terme très précoce avec RCF normal.' }

    return {
      value: total,
      label: `Score de Manning : ${total}/10`,
      severity,
      details: {
        'Mouvements': mvt === 2 ? 'Normal' : 'Anormal',
        'Tonus': tonus === 2 ? 'Normal' : 'Anormal',
        'Respiration': resp === 2 ? 'Normal' : 'Anormal',
        'Liquide': liquide === 2 ? 'Normal' : 'Anormal',
        'RCF': rcf === 2 ? 'Réactif' : 'Non réactif',
      },
      ranges: [
        { min: 8, max: 10, label: 'Normal (8-10)', severity: 'low', recommendation: 'Fœtus en bonne santé. Pas d intervention urgente. Surveillance adaptée au contexte.' },
        { min: 6, max: 7, label: 'Suspect (6-7)', severity: 'moderate', recommendation: 'Contrôle dans 6-12h. Bilan étiologique (Doppler ombilical, MAP, RCF). Discuter corticothérapie si prématurité.' },
        { min: 4, max: 5, label: 'Anormal (4-5)', severity: 'high', recommendation: 'Extraction discutée. Si terme ≥ 34 SA : déclenchement ou césarienne. Si < 34 SA : test de bien-être rapproché + Doppler.' },
        { min: 0, max: 3, label: 'Très anormal (0-3)', severity: 'critical', recommendation: 'EXTRACTION IMMÉDIATE. Césarienne en urgence. Prévenir néonatologistes. Score < 4 = risque élevé d acidose fœtale.' },
      ],
    }
  },
  interpretation: `Le **score biophysique de Manning** combine 5 paramètres échographiques et le RCF pour évaluer le bien-être fœtal.

**Chaque paramètre est coté 2 (normal) ou 0 (anormal) :**
1. **Mouvements actifs** (≥ 3 en 30 min)
2. **Tonus fœtal** (extension-flexion active)
3. **Mouvements respiratoires** (≥ 1 épisode > 30s)
4. **Liquide amniotique** (poche ≥ 2 cm)
5. **RCF réactif** (≥ 2 accélérations)

**Interprétation :**
- 8-10 : Normal
- 6-7 : Suspect (contrôle 6-12h)
- 4-5 : Anormal (extraction à discuter)
- 0-3 : Très anormal (extraction immédiate)`,
  clinicalCommentary: `Le score de Manning est surtout utile dans les grossesses à risque (RCIU, diabète, HTA, post-terme). Il prend 30 minutes d observation échographique. Le paramètre le plus prédictif de l acidose est l oligoamnios. Un score normal (8-10) a une très bonne valeur prédictive négative (faux négatif < 1 %). L indication d extraction dépend aussi du terme et du contexte. Le Doppler ombilical et le RCF restent souvent suffisants en pratique courante.`,
  references: [
    {
      type: 'pubmed',
      title: 'Manning FA et al. Fetal biophysical profile scoring. Am J Obstet Gynecol 1990',
      pmid: '2205104',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Surveillance fœtale pendant la grossesse (Recommandations 2021)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default manning
