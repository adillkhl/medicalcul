import type { FormulaDefinition } from '../types'

const ecog: FormulaDefinition = {
  id: 'ecog',
  slug: 'ecog',
  name: 'ECOG de Zubrod (Echelle)',
  specialty: 'oncologie',
  category: 'État général',
  description: 'Échelle de performance status ECOG (Eastern Cooperative Oncology Group) de Zubrod. Évaluation de l\'état général et de l\'autonomie du patient pour guider les décisions thérapeutiques en oncologie (chimiothérapie, radiothérapie, soins palliatifs).',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'activity_level',
      type: 'radio',
      label: 'Quel est le niveau d\'activité du patient ?',
      options: [
        { value: 0, label: 'ECOG 0 — Activité normale sans restriction. Capable de mener toutes les activités de la vie courante sans limitation.' },
        { value: 1, label: 'ECOG 1 — Ambulatoire, capable d\'une activité physique légère (travail de bureau, marche). Symptomatique mais debout > 50% de la journée.' },
        { value: 2, label: 'ECOG 2 — Alité < 50% de la journée. Capable de s\'occuper de soi-même mais incapable de travailler. Nécessite une aide occasionnelle.' },
        { value: 3, label: 'ECOG 3 — Alité > 50% de la journée. Capable de s\'occuper de soi-même partiellement. Nécessite une aide régulière.' },
        { value: 4, label: 'ECOG 4 — Alité en permanence. Incapable de s\'occuper de soi-même. Nécessite des soins médicaux constants.' },
        { value: 5, label: 'ECOG 5 — Décès' },
      ],
    },
    {
      id: 'age',
      type: 'number',
      label: 'Âge du patient',
      unit: 'ans',
      min: 18,
      max: 120,
      step: 1,
    },
  ],
  calculate: (values) => {
    const ecogScore = values.activity_level as number
    const age = values.age as number

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''
    let chemoEligibility = ''
    let survivalPrognosis = ''

    switch (ecogScore) {
      case 0:
        label = 'ECOG 0 — Activité normale'
        severity = 'low'
        chemoEligibility = 'Éligible à toute chimiothérapie, même intensive. Essais cliniques possibles.'
        survivalPrognosis = 'Médiane de survie variable selon pathologie, généralement la plus favorable.'
        recommendation = 'Chimiothérapie standard ou intensive selon le protocole. Chirurgie possible. Essais cliniques envisageables.'
        break
      case 1:
        label = 'ECOG 1 — Ambulatoire, symptômes légers'
        severity = 'low'
        chemoEligibility = 'Éligible à la plupart des chimiothérapies standards.'
        survivalPrognosis = 'Pronostic favorable, légèrement inférieur à ECOG 0.'
        recommendation = 'Chimiothérapie standard possible. Adaptation des doses si nécessaire.'
        break
      case 2:
        label = 'ECOG 2 — Capacité d\'autosoins, alité < 50%'
        severity = 'moderate'
        chemoEligibility = 'Éligible à certaines chimiothérapies (monothérapie, protocoles allégés).'
        survivalPrognosis = 'Pronostic intermédiaire. Survie médiane réduite par rapport à ECOG 0-1.'
        recommendation = 'Chimiothérapie allégée, monothérapie ou thérapie ciblée. Soins de support intensifs. Discuter les risques/bénéfices.'
        break
      case 3:
        label = 'ECOG 3 — Alité > 50%, autosoins limités'
        severity = 'high'
        chemoEligibility = 'Généralement NON éligible à la chimiothérapie cytotoxique. Thérapies ciblées ou hormonothérapie possibles.'
        survivalPrognosis = 'Pronostic défavorable. Survie médiane généralement < 6 mois sans traitement.'
        recommendation = 'Soins palliatifs exclusifs ou thérapie ciblée/hormonothérapie si bon profil moléculaire. Pas de chimiothérapie cytotoxique. Soins de support.'
        break
      case 4:
        label = 'ECOG 4 — Alité permanent, grabataire'
        severity = 'critical'
        chemoEligibility = 'NON éligible à la chimiothérapie. Soins palliatifs exclusifs.'
        survivalPrognosis = 'Pronostic très défavorable. Survie médiane < 3 mois.'
        recommendation = 'Soins palliatifs exclusifs. Prise en charge symptomatique. Antalgiques de palier III. Accompagnement psychologique et social.'
        break
      default:
        label = 'ECOG 5 — Décédé'
        severity = 'critical'
        chemoEligibility = 'Sans objet'
        survivalPrognosis = 'Décédé'
        recommendation = 'Aucune intervention oncologique active.'
    }

    return {
      value: ecogScore,
      label,
      severity,
      risk: ecogScore,
      riskUnit: 'ECOG',
      details: {
        'ECOG': `ECOG ${ecogScore}`,
        'Âge': `${age} ans`,
        'Éligibilité chimiothérapie': chemoEligibility,
        'Pronostic': survivalPrognosis,
      },
      ranges: [
        { min: 0, max: 0, label: 'ECOG 0 — Activité normale', severity: 'low' },
        { min: 1, max: 1, label: 'ECOG 1 — Symptômes légers', severity: 'low' },
        { min: 2, max: 2, label: 'ECOG 2 — Autosoins, alité < 50%', severity: 'moderate' },
        { min: 3, max: 3, label: 'ECOG 3 — Alité > 50%', severity: 'high' },
        { min: 4, max: 4, label: 'ECOG 4 — Grabataire', severity: 'critical' },
        { min: 5, max: 5, label: 'ECOG 5 — Décès', severity: 'critical' },
      ],
    }
  },
  interpretation: "L'**ECOG Performance Status** (Zubrod) est l'échelle de référence pour évaluer l'état général du patient cancéreux.\n\n**Grades :**\n- **0** : Activité normale sans restriction\n- **1** : Ambulatoire, activité physique légère\n- **2** : Capacité d'autosoins, alité < 50%\n- **3** : Alité > 50%, autosoins limités\n- **4** : Alité en permanence, soins constants\n- **5** : Décès\n\n**Impact thérapeutique :** ECOG ≤ 1 → chimiothérapie standard ; ECOG 2 → adaptation ; ECOG ≥ 3 → soins palliatifs.",
  clinicalCommentary: "L'ECOG est le facteur pronostique le plus puissant en cancérologie, indépendamment du type de cancer. Il prédit la tolérance à la chimiothérapie et la survie globale. À âge égal, un patient ECOG 0-1 a un pronostic bien meilleur qu'un patient ECOG 2+. L'ECOG doit être réévalué à chaque consultation et avant chaque cycle de chimiothérapie. Il existe une échelle alternative : le Karnofsky (0-100).",
  references: [
    {
      type: 'pubmed',
      title: 'Oken MM et al. Toxicity and response criteria of the Eastern Cooperative Oncology Group. Am J Clin Oncol 1982',
      pmid: '7165009',
    },
    {
      type: 'pubmed',
      title: 'Zubrod CG et al. Appraisal of methods for the study of chemotherapy of cancer in man. J Chronic Dis 1960',
      pmid: '13807538',
    },
  ],
}

export default ecog
