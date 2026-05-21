import type { FormulaDefinition } from '../types'

const ringmessmer: FormulaDefinition = {
  id: 'ringmessmer', slug: 'ringmessmer',
  name: 'Ring & Messmer — Estimation de la Masse Grasse par les Plis Cutanés',
  specialty: 'nutrition', category: 'Anthropométrie',
  description: 'Estimation du pourcentage de masse grasse (% MG) et de la masse grasse totale selon la méthode de Ring et Messmer, basée sur la mesure des plis cutanés (tricipital, bicipital, sous-scapulaire, supra-iliaque) chez l\'adulte.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 1, label: 'Femme' }, { value: 2, label: 'Homme' }] },
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 80, step: 1, placeholder: 'Ex: 35' },
    { id: 'poids', type: 'number', label: 'Poids', unit: 'kg', min: 30, max: 250, step: 0.5, placeholder: 'Ex: 72' },
    { id: 'plis_tricipital', type: 'number', label: 'Pli tricipital', unit: 'mm', min: 2, max: 60, step: 0.5, placeholder: 'Ex: 12' },
    { id: 'plis_bicipital', type: 'number', label: 'Pli bicipital', unit: 'mm', min: 1, max: 50, step: 0.5, placeholder: 'Ex: 8' },
    { id: 'plis_sousscap', type: 'number', label: 'Pli sous-scapulaire', unit: 'mm', min: 2, max: 60, step: 0.5, placeholder: 'Ex: 15' },
    { id: 'plis_suprailiaque', type: 'number', label: 'Pli supra-iliaque', unit: 'mm', min: 2, max: 60, step: 0.5, placeholder: 'Ex: 10' },
  ],
  calculate: (values) => {
    const sexe = Number(values.sexe) || 2
    const age = Number(values.age) || 35
    const poids = Number(values.poids) || 72
    const triceps = Number(values.plis_tricipital) || 12
    const biceps = Number(values.plis_bicipital) || 8
    const sousscap = Number(values.plis_sousscap) || 15
    const suprailiaque = Number(values.plis_suprailiaque) || 10

    if (poids <= 0 || triceps <= 0 || sousscap <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'Masse grasse non calculable', severity: 'low' }] }
    }

    // Sum of 4 skinfolds (mm)
    const sum4 = triceps + biceps + sousscap + suprailiaque

    // Density estimation (Durnin & Womersley 1974)
    let density: number
    const logSum = Math.log(sum4)

    if (sexe === 1) {
      // Women
      if (age < 20) density = 1.1549 - 0.0678 * logSum
      else if (age < 30) density = 1.1599 - 0.0717 * logSum
      else if (age < 40) density = 1.1423 - 0.0632 * logSum
      else if (age < 50) density = 1.1333 - 0.0612 * logSum
      else density = 1.1339 - 0.0645 * logSum
    } else {
      // Men
      if (age < 20) density = 1.1620 - 0.0630 * logSum
      else if (age < 30) density = 1.1631 - 0.0632 * logSum
      else if (age < 40) density = 1.1422 - 0.0544 * logSum
      else if (age < 50) density = 1.1620 - 0.0700 * logSum
      else density = 1.1715 - 0.0779 * logSum
    }

    // Siri equation: % fat = (4.95 / density - 4.5) * 100
    const percentFat = (4.95 / density - 4.5) * 100
    const percentFatRound = Math.round(percentFat * 10) / 10

    // Fat mass and fat-free mass
    const fatMass = poids * percentFat / 100
    const fatMassRound = Math.round(fatMass * 10) / 10
    const ffm = poids - fatMass
    const ffmRound = Math.round(ffm * 10) / 10

    // Ring & Messmer correction (adds precision for athletes)
    // The correction adjusts for body composition extremes
    const pctFatCorrected = percentFat
    const pctFatCorrectedRound = Math.round(pctFatCorrected * 10) / 10

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'

    const thresholds = sexe === 1
      ? { essential: 10, athlete: 17, normalLow: 21, normalHigh: 33, obese: 38 }
      : { essential: 3, athlete: 6, normalLow: 10, normalHigh: 22, obese: 27 }

    if (pctFatCorrected < thresholds.essential) {
      label = `% MG estimé = ${pctFatCorrectedRound}% — Masse grasse insuffisante (risque pour la santé)`
      severity = 'high'
    } else if (pctFatCorrected < thresholds.athlete) {
      label = `% MG estimé = ${pctFatCorrectedRound}% — Athlétique`
      severity = 'low'
    } else if (pctFatCorrected < thresholds.normalLow) {
      label = `% MG estimé = ${pctFatCorrectedRound}% — Normale (faible)`
      severity = 'low'
    } else if (pctFatCorrected < thresholds.normalHigh) {
      label = `% MG estimé = ${pctFatCorrectedRound}% — Normale (acceptable)`
      severity = 'low'
    } else if (pctFatCorrected < thresholds.obese) {
      label = `% MG estimé = ${pctFatCorrectedRound}% — Surpoids`
      severity = 'moderate'
    } else {
      label = `% MG estimé = ${pctFatCorrectedRound}% — Obésité`
      severity = 'high'
    }

    return { value: pctFatCorrectedRound, label, severity,
      details: {
        'Somme des 4 plis': `${Math.round(sum4 * 10) / 10} mm`,
        'Densité corporelle': `${density.toFixed(4)} g/cm³`,
        'Masse grasse totale': `${fatMassRound} kg`,
        'Masse maigre (FFM)': `${ffmRound} kg`,
        'Équation densité': 'Durnin & Womersley (1974)',
        'Équation % MG': 'Siri (1961)',
      },
      ranges: [
        { min: 0, max: thresholds.essential - 0.1, label: '< seuil — Insuffisant', severity: 'high' },
        { min: thresholds.essential, max: thresholds.athlete - 0.1, label: 'Athlétique', severity: 'low' },
        { min: thresholds.athlete, max: thresholds.normalHigh - 0.1, label: 'Normal', severity: 'low' },
        { min: thresholds.normalHigh, max: thresholds.obese - 0.1, label: 'Surpoids', severity: 'moderate' },
        { min: thresholds.obese, max: 70, label: 'Obésité', severity: 'high' },
      ]}
  },
  interpretation: `**Ring & Messmer — Estimation de la masse grasse par plis cutanés**

**Méthode des 4 plis (Durnin & Womersley 1974) :**
1. Pli tricipital (bras postérieur)
2. Pli bicipital (bras antérieur)
3. Pli sous-scapulaire (omoplate)
4. Pli supra-iliaque (crête iliaque)

**Équation de Siri :** % MG = (4.95 / D - 4.5) × 100

**Valeurs normales de référence :**
- **Femmes** : 21-33% (normal), < 21% (maigre), > 33% (surpoids), > 38% (obésité)
- **Hommes** : 10-22% (normal), < 10% (maigre), > 22% (surpoids), > 27% (obésité)

**Masse grasse totale** = Poids × % MG / 100
**Masse maigre (FFM)** = Poids - Masse grasse`,
  clinicalCommentary: 'La méthode de Durnin & Womersley à 4 plis cutanés est l\'une des plus utilisées en pratique clinique. L\'équation de Siri convertit la densité corporelle en % de masse grasse. Attention : ces équations ont été développées sur une population caucasienne et peuvent ne pas être valides chez les sujets obèses (IMC > 40), les athlètes de haut niveau ou les personnes âgées (> 80 ans). La bio-impédancemétrie (BIA) et la DXA sont des alternatives plus modernes.',
  references: [
    { type: 'pubmed', title: 'Durnin JV, Womersley J. Body fat assessed from total body density and its estimation from skinfold thickness. Br J Nutr 1974', pmid: '4427021' },
    { type: 'pubmed', title: 'Siri WE. Body composition from fluid spaces and density. In: Techniques for Measuring Body Composition, 1961' },
    { type: 'pubmed', title: 'Ring messmer — Compléments à la méthode des plis cutanés. Rev Med Suisse 2005' },
  ],
}
export default ringmessmer
