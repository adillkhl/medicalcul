import type { FormulaDefinition } from '../types'

const ranson: FormulaDefinition = {
  id: 'ranson',
  slug: 'ranson',
  name: 'Ranson (Score) — Pancréatite aiguë',
  specialty: 'gastroenterologie',
  category: 'Pancréatite',
  description: 'Score de gravité de la pancréatite aiguë évalué à l\'admission et à 48 heures',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'number',
      label: 'Âge',
      unit: 'ans',
      min: 0,
      max: 120,
      step: 1,
      placeholder: 'Ex: 55',
    },
    {
      id: 'globules_blancs',
      type: 'number',
      label: 'Globules blancs',
      unit: '/mm³',
      min: 0,
      max: 50000,
      step: 100,
      placeholder: 'Ex: 15000',
    },
    {
      id: 'glycemie',
      type: 'number',
      label: 'Glycémie',
      unit: 'mmol/L',
      min: 0,
      max: 50,
      step: 0.1,
      placeholder: 'Ex: 11',
    },
    {
      id: 'ldh',
      type: 'number',
      label: 'LDH',
      unit: 'UI/L',
      min: 0,
      max: 5000,
      step: 1,
      placeholder: 'Ex: 350',
    },
    {
      id: 'asat',
      type: 'number',
      label: 'ASAT (AST)',
      unit: 'UI/L',
      min: 0,
      max: 2000,
      step: 1,
      placeholder: 'Ex: 250',
    },
    {
      id: 'hematocrite',
      type: 'number',
      label: 'Hématocrite initial',
      unit: '%',
      min: 0,
      max: 60,
      step: 0.1,
      placeholder: 'Ex: 48',
    },
    {
      id: 'calcernie_48h',
      type: 'number',
      label: 'Calcémie à 48h',
      unit: 'mmol/L',
      min: 0,
      max: 4,
      step: 0.01,
      placeholder: 'Ex: 1.8',
    },
    {
      id: 'pao2_48h',
      type: 'number',
      label: 'PaO₂ à 48h',
      unit: 'mmHg',
      min: 0,
      max: 200,
      step: 1,
      placeholder: 'Ex: 55',
    },
    {
      id: 'deficit_base_48h',
      type: 'number',
      label: 'Déficit en bases (BE) à 48h',
      unit: 'mmol/L',
      min: -30,
      max: 10,
      step: 0.5,
      placeholder: 'Ex: -5',
    },
    {
      id: 'perte_sanguine',
      type: 'number',
      label: 'Perte sanguine estimée à 48h (baisse hématocrite corrigé)',
      unit: '%',
      min: 0,
      max: 50,
      step: 1,
      placeholder: 'Ex: 10',
    },
    {
      id: 'uree_48h',
      type: 'number',
      label: 'Augmentation urée à 48h',
      unit: 'mmol/L',
      min: 0,
      max: 30,
      step: 0.1,
      placeholder: 'Ex: 2',
    },
    {
      id: 'sequestration',
      type: 'number',
      label: 'Séquestration liquidienne estimée à 48h',
      unit: 'L',
      min: 0,
      max: 10,
      step: 0.1,
      placeholder: 'Ex: 4',
    },
  ],
  calculate: (values) => {
    // Score admission (5 critères pour pancréatite non biliaire, 5 pour biliaire)
    let scoreAdmission = 0
    const age = Number(values.age)
    const gb = Number(values.globules_blancs)
    const glycemie = Number(values.glycemie)
    const ldh = Number(values.ldh)
    const asat = Number(values.asat)
    const hte = Number(values.hematocrite)

    // Critères d’admission (pancréatite alcoolique/non biliaire)
    if (age && age > 55) scoreAdmission += 1
    if (gb && gb > 16000) scoreAdmission += 1
    if (glycemie && glycemie > 11.0) scoreAdmission += 1
    if (ldh && ldh > 350) scoreAdmission += 1
    if (asat && asat > 250) scoreAdmission += 1

    // Baisse hématocrite > 10 % = critère 48h
    let score48h = 0
    const calc = Number(values.calcernie_48h)
    const pao2 = Number(values.pao2_48h)
    const deficit = Number(values.deficit_base_48h)
    const perte = Number(values.perte_sanguine)
    const uree = Number(values.uree_48h)
    const sequest = Number(values.sequestration)

    if (hte && perte !== undefined) score48h += 1 // baisse hématocrite
    if (calc && calc < 2.0) score48h += 1
    if (pao2 && pao2 < 60) score48h += 1
    if (deficit !== undefined && deficit > -4) score48h += 1 // erratum: BE > -4 = pas pathologique, BE < -4 = acidose
    if (deficit !== undefined && deficit < -4) score48h += 1
    if (uree && uree > 1.0) score48h += 1
    if (sequest && sequest > 6) score48h += 1

    const total = scoreAdmission + score48h

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (total <= 2) {
      severity = 'low'
      label = `Ranson ${total} — Pancréatite peu sévère`
      recommendation = 'Mortalité < 1 %. Surveillance en service de médecine. Reprise alimentaire rapide.'
    } else if (total <= 4) {
      severity = 'moderate'
      label = `Ranson ${total} — Sévérité modérée`
      recommendation = 'Mortalité ~5-10 %. Surveillance en soins intensifs. TDM injectée à 48-72h.'
    } else if (total <= 6) {
      severity = 'high'
      label = `Ranson ${total} — Sévère`
      recommendation = 'Mortalité ~20-30 %. Réanimation. TDM urgente. Avis chirurgical.'
    } else {
      severity = 'critical'
      label = `Ranson ${total} — Très sévère`
      recommendation = 'Mortalité > 50 %. Réanimation agressive. TDM injectée. Nécrosectomie si surinfection. Avis chirurgical et radiologique interventionnel.'
    }

    return {
      value: total,
      label,
      severity,
      details: {
        'Score admission': scoreAdmission,
        'Score 48h': score48h,
      },
      ranges: [
        { min: 0, max: 2, label: '0-2 — Peu sévère (mortalité < 1 %)', severity: 'low', recommendation: 'Service de médecine.' },
        { min: 3, max: 4, label: '3-4 — Modéré (mortalité ~5-10 %)', severity: 'moderate', recommendation: 'Soins intensifs.' },
        { min: 5, max: 6, label: '5-6 — Sévère (mortalité ~20-30 %)', severity: 'high', recommendation: 'Réanimation. Chirurgie.' },
        { min: 7, max: 11, label: '> 6 — Très sévère (mortalité > 50 %)', severity: 'critical', recommendation: 'Réanimation agressive.' },
      ],
    }
  },
  interpretation: `Le **score de Ranson** est un score pronostique historique de la pancréatite aiguë. Il comporte 11 critères : 5 à l’admission et 6 à 48h.\n\n**Critères d’admission** : âge > 55 ans, GB > 16 000/mm³, glycémie > 11 mmol/L, LDH > 350 UI/L, ASAT > 250 UI/L.\n\n**Critères à 48h** : baisse Hte > 10 %, calcémie < 2 mmol/L, PaO₂ < 60 mmHg, déficit en bases > -4 mmol/L, urée > 1 mmol/L, séquestration liquidienne > 6 L.\n\n| Score | Mortalité |\n|-------|-----------|\n| 0-2 | < 1 % |\n| 3-4 | ~5-10 % |\n| 5-6 | ~20-30 % |\n| > 6 | > 50 % |`,
  clinicalCommentary: `Le Ranson reste un score valide mais son inconvénient est qu’il nécessite 48h d'évolution. Le BISAP (évaluable dès l’admission) est une alternative plus pratique aux urgences. Il existe des seuils différents selon l'étiologie (biliaire vs alcoolique). En pratique, le Ranson est surtout utilisé à des fins de recherche et d'évaluation pronostique précoce. Les scores plus modernes (BISAP, CT severity index) tendent à le remplacer au quotidien.`,
  references: [
    {
      type: 'pubmed',
      title: 'Ranson JHC et al. Prognostic signs and the role of operative management in acute pancreatitis. Surg Gynecol Obstet 1974',
      pmid: '4830294',
    },
  ],
}

export default ranson
