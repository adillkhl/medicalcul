import type { FormulaDefinition } from '../types'

const edssech: FormulaDefinition = {
  id: 'edssech',
  slug: 'edssech',
  name: 'EDSS — Expanded Disability Status Scale (Score)',
  specialty: 'neurologie',
  category: 'Sclérose en Plaques',
  description: 'Évaluation du handicap neurologique dans la sclérose en plaques (SEP), score 0–10 par pas de 0,5',
  version: '2024',
  lastValidated: '2024-02',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'pyramidal',
      type: 'radio',
      label: 'FS Pyramidal (motricité)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Signes anormaux sans handicap' },
        { value: 2, label: '2 — Handicap léger (fatigabilité, ROT vifs, Babinski)' },
        { value: 3, label: '3 — Paraparésie ou hémiplégie modérée' },
        { value: 4, label: '4 — Paraparésie ou hémiplégie marquée' },
        { value: 5, label: '5 — Plégie (tétraplégie, paraplégie)' },
      ],
    },
    {
      id: 'cerebelleux',
      type: 'radio',
      label: 'FS Cérébelleux (coordination, ataxie)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Signes anormaux sans handicap' },
        { value: 2, label: '2 — Ataxie légère (tremblement discret, dysmétrie)' },
        { value: 3, label: '3 — Ataxie modérée (tronc/membres, gène fonction)' },
        { value: 4, label: '4 — Ataxie sévère (nécessite aide pour la marche)' },
        { value: 5, label: '5 — Incapable de mouvements coordonnés' },
      ],
    },
    {
      id: 'tronc',
      type: 'radio',
      label: 'FS Tronc cérébral (nerfs crâniens)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Signes anormaux sans handicap' },
        { value: 2, label: '2 — Nystagmus modéré, faiblesse faciale légère' },
        { value: 3, label: '3 — Nystagmus sévère, diplopie, OPK altéré' },
        { value: 4, label: '4 — Dysarthrie marquée, paralysie faciale sévère' },
        { value: 5, label: '5 — Incapacité d\'avaler ou de parler' },
      ],
    },
    {
      id: 'sensoriel',
      type: 'radio',
      label: 'FS Sensoriel',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Diminution légère (vibration, tact)' },
        { value: 2, label: '2 — Diminution modérée (1–2 membres)' },
        { value: 3, label: '3 — Diminution sévère (≥ 2 membres)' },
        { value: 4, label: '4 — Perte sensorielle marquée' },
        { value: 5, label: '5 — Perte sensorielle complète (1 ou plusieurs membres)' },
      ],
    },
    {
      id: 'sphincterien',
      type: 'radio',
      label: 'FS Sphinctérien (vésical, anal)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Urgence mictionnelle légère' },
        { value: 2, label: '2 — Incontinence urinaire modérée (sonde intermittente)' },
        { value: 3, label: '3 — Incontinence fréquente (nécessite sonde permanente)' },
        { value: 4, label: '4 — Incontinence urinaire et fécale' },
        { value: 5, label: '5 — Perte complète de la fonction vésico-sphinctérienne' },
      ],
    },
    {
      id: 'visuel',
      type: 'radio',
      label: 'FS Visuel',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Scotome, acuité > 6/9' },
        { value: 2, label: '2 — Acuité 6/12–6/18 (œil le mieux corrigé)' },
        { value: 3, label: '3 — Acuité 6/18–6/30' },
        { value: 4, label: '4 — Acuité 6/30–6/60' },
        { value: 5, label: '5 — Acuité < 6/60' },
      ],
    },
    {
      id: 'cerebral',
      type: 'radio',
      label: 'FS Cérébral (fonctions supérieures)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Altération légère (fatigue, humeur)' },
        { value: 2, label: '2 — Altération modérée (ralentissement idéique)' },
        { value: 3, label: '3 — Altération marquée (démence modérée)' },
        { value: 4, label: '4 — Démence sévère' },
        { value: 5, label: '5 — Démence terminale / végétatif' },
      ],
    },
    {
      id: 'deambulation',
      type: 'radio',
      label: 'Périmètre de marche (détermine le score EDSS au-delà de 4,0)',
      options: [
        { value: 0, label: 'Illimité — marche normale' },
        { value: 1, label: '≥ 500 m sans aide / avec fatigue' },
        { value: 2, label: '≥ 300 m sans aide' },
        { value: 3, label: '≥ 200 m sans aide' },
        { value: 4, label: '≥ 100 m sans aide' },
        { value: 5, label: '≥ 20 m sans aide (marche limitée)' },
        { value: 6, label: 'Fauteuil roulant : se déplace seul' },
        { value: 7, label: 'Fauteuil roulant : transféré seul' },
        { value: 8, label: 'Fauteuil roulant : dépendant' },
        { value: 9, label: 'Alité / grabataire' },
        { value: 10, label: 'Décès' },
      ],
    },
  ],
  calculate: (values) => {
    const pyramidal = values.pyramidal ?? 0
    const cerebelleux = values.cerebelleux ?? 0
    const tronc = values.tronc ?? 0
    const sensoriel = values.sensoriel ?? 0
    const sphincterien = values.sphincterien ?? 0
    const visuel = values.visuel ?? 0
    const cerebral = values.cerebral ?? 0
    const deambulation = values.deambulation ?? 0

    const totalFs = pyramidal + cerebelleux + tronc + sensoriel + sphincterien + visuel + cerebral
    const maxFs = Math.max(pyramidal, cerebelleux, tronc, sensoriel, sphincterien, visuel, cerebral)

    let edssScore: number

    if (deambulation <= 0 && maxFs <= 1 && totalFs <= 1) {
      edssScore = 0
    } else if (deambulation <= 0 && maxFs <= 1 && totalFs <= 3) {
      edssScore = 1.0
    } else if (deambulation <= 0 && maxFs >= 1 && totalFs <= 4) {
      edssScore = maxFs === 1 && totalFs <= 3 ? 1.5 : maxFs <= 2 ? 2.0 : 2.5
    } else if (deambulation <= 0 && maxFs <= 3 && totalFs <= 10) {
      edssScore = maxFs <= 2 ? 3.0 : 3.5
    } else if (deambulation <= 0 && maxFs <= 4 && totalFs <= 16) {
      edssScore = 4.0
    } else if (deambulation <= 2) {
      edssScore = deambulation <= 0 ? 4.5 : deambulation === 1 ? 5.0 : 5.5
    } else if (deambulation <= 5) {
      edssScore = deambulation === 3 ? 6.0 : deambulation === 4 ? 6.5 : 7.0
    } else if (deambulation <= 8) {
      edssScore = deambulation === 6 ? 7.5 : deambulation === 7 ? 8.0 : 8.5
    } else {
      edssScore = deambulation === 9 ? 9.0 : 9.5
    }

    const getSeverity = (s: number): 'low' | 'moderate' | 'high' | 'critical' => {
      if (s <= 3.0) return 'low'
      if (s <= 5.5) return 'moderate'
      if (s <= 7.5) return 'high'
      return 'critical'
    }

    return {
      value: edssScore,
      label: `EDSS ${edssScore.toFixed(1)} — ${edssScore <= 3 ? 'Handicap léger' : edssScore <= 5.5 ? 'Handicap modéré' : edssScore <= 7.5 ? 'Handicap sévère' : 'Handicap très sévère'}`,
      severity: getSeverity(edssScore),
      details: { FS_Pyramidal: pyramidal, FS_Cérébelleux: cerebelleux, FS_Tronc: tronc, FS_Sensoriel: sensoriel, FS_Sphinctérien: sphincterien, FS_Visuel: visuel, FS_Cérébral: cerebral, Total_FS: totalFs, Max_FS: maxFs },
      ranges: [
        { min: 0, max: 2.5, label: 'Handicap minime (EDSS ≤ 2,5)', severity: 'low', recommendation: 'Aucune limitation fonctionnelle significative. Poursuite du traitement de fond selon le profil évolutif. Suivi neurologique régulier.' },
        { min: 3, max: 4.5, label: 'Handicap modéré (EDSS 3,0–4,5)', severity: 'moderate', recommendation: 'Gêne fonctionnelle mais marche autonome. Réadaptation fonctionnelle. Adaptation thérapeutique si progression.' },
        { min: 5, max: 6.5, label: 'Handicap sévère (EDSS 5,0–6,5)', severity: 'high', recommendation: 'Aide à la marche nécessaire (canne, déambulateur). Rééducation intensive. Aides techniques et ergothérapie.' },
        { min: 7, max: 9.5, label: 'Handicap très sévère (EDSS ≥ 7,0)', severity: 'critical', recommendation: 'Fauteuil roulant ou alité. Soins de support, nursing, soins palliatifs si nécessaire. Accompagnement pluridisciplinaire.' },
      ],
    }
  },
  interpretation: `L'**EDSS** (Expanded Disability Status Scale) de Kurtzke est l'échelle de référence pour quantifier le handicap dans la sclérose en plaques (SEP). Score de 0 (normal) à 10 (décès par SEP).

Il combine :
- **7 scores fonctionnels (FS)** : pyramidal, cérébelleux, tronc cérébral, sensoriel, sphinctérien, visuel, cérébral (0–5 chacun)
- **Le périmètre de marche** qui détermine l’EDSS à partir de 4,0

**Grades clés :**
- EDSS ≤ 3,5 : marche normale
- EDSS 4,0–5,5 : marche limitée mais sans aide
- EDSS ≥ 6,0 : aide à la marche nécessaire
- EDSS ≥ 7,0 : fauteuil roulant

L'EDSS est utilisé pour le suivi évolutif, les décisions thérapeutiques, et comme critère dans les essais cliniques.`,
  clinicalCommentary: `L'EDSS est l'échelle de référence pour la SEP mais a des limites : pondération importante de la marche, sous-estimation des troubles cognitifs et de la fatigue. Un score EDSS stable ne signifie pas forcément absence d’activité (poussées, IRM). En pratique clinique, on utilise l’EDSS conjointement à l'IRM et à l'évaluation des poussées. La cotation nécessite une formation et environ 20–30 minutes. Le score EDSS 6.0 (canne unilatérale 100 m) est un seuil important pour le pronostic.`,
  references: [
    {
      type: 'pubmed',
      title: 'Kurtzke JF. Rating neurologic impairment in multiple sclerosis: an expanded disability status scale (EDSS). Neurology 1983',
      pmid: '6685237',
    },
    {
      type: 'guideline',
      title: 'HAS — Sclérose en plaques : prise en charge (2022)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default edssech
