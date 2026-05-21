import type { FormulaDefinition } from '../types'

const globe: FormulaDefinition = {
  id: 'globe', slug: 'globe',
  name: 'GLOBE Score — Pronostic de la Cirrhose Biliaire Primitive (CBP)',
  specialty: 'divers', category: 'Hépatologie',
  description: 'GLOBE Score — Score pronostique pour la cirrhose biliaire primitive (CBP, aussi appelée cholangite biliaire primitive). Prédit la survie à long terme des patients traités par acide ursodésoxycholique (AUDC).',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge au moment du traitement', unit: 'ans', min: 18, max: 90, step: 1, placeholder: 'Ex: 55' },
    { id: 'bilirubine', type: 'number', label: 'Bilirubine totale', unit: 'µmol/L', min: 0, max: 600, step: 1, placeholder: 'Ex: 25' },
    { id: 'albumine', type: 'number', label: 'Albumine', unit: 'g/L', min: 10, max: 55, step: 0.5, placeholder: 'Ex: 38' },
    { id: 'alp', type: 'number', label: 'Phosphatases alcalines (PAL)', unit: 'µkat/L', min: 0, max: 100, step: 0.1, placeholder: 'Ex: 2.5' },
    { id: 'plaquettes', type: 'number', label: 'Plaquettes', unit: '×10⁹/L (G/L)', min: 10, max: 800, step: 1, placeholder: 'Ex: 200' },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 55
    const bili = Number(values.bilirubine) || 25
    const albumine = Number(values.albumine) || 38
    const alp = Number(values.alp) || 2.5
    const plaquettes = Number(values.plaquettes) || 200

    if (age <= 0 || bili <= 0 || albumine <= 0 || alp <= 0 || plaquettes <= 0) {
      return { value: 0, label: 'Données insuffisantes', severity: 'low',
        ranges: [{ min: 0, max: 0, label: 'GLOBE score non calculable', severity: 'low' }] }
    }

    // GLOBE score formula (Lammers et al. 2015, Gastroenterology)
    // GLOBE = 0.044378 × age(years) + 0.939825 × ln(bilirubin × ULN) + 0.335648 × ln(ALP/ULN) - 2.266708 × ln(albumin) - 0.002581 × platelets/ULN
    // Where ULN for bilirubin = 20 µmol/L (1 mg/dL = 17.1 µmol/L, so ~20)
    // ULN for ALP = varies by assay. Using 1.5 µkat/L as ULN
    // ULN for platelets = 150 (lower limit of normal used in original)
    const biliULN = 20 // µmol/L
    const alpULN = 1.5 // µkat/L
    const pltULN = 150 // ×10⁹/L

    const lnBili = Math.log(bili / biliULN)
    const lnALP = Math.log(alp / alpULN)
    const lnAlb = Math.log(albumine)
    const pltRatio = plaquettes / pltULN

    const globeScore = 0.044378 * age + 0.939825 * lnBili + 0.335648 * lnALP - 2.266708 * lnAlb - 0.002581 * pltRatio
    const globeRound = Math.round(globeScore * 1000) / 1000

    // Survival prediction at 3, 5, 10 years
    // S(t) = exp(-exp(GLOBE) × (baseline_hazard(t)))
    const baselineHazard3 = 0.005
    const baselineHazard5 = 0.016
    const baselineHazard10 = 0.084

    const surv3 = Math.exp(-Math.exp(globeScore) * baselineHazard3) * 100
    const surv5 = Math.exp(-Math.exp(globeScore) * baselineHazard5) * 100
    const surv10 = Math.exp(-Math.exp(globeScore) * baselineHazard10) * 100

    const surv3Round = Math.round(surv3 * 10) / 10
    const surv5Round = Math.round(surv5 * 10) / 10
    const surv10Round = Math.round(surv10 * 10) / 10

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (globeScore < -0.5) {
      label = `GLOBE score = ${globeRound} — Risque faible`
      severity = 'low'
      recommendation = 'Excellente réponse au traitement par AUDC. Pronostic favorable à long terme. Surveillance standard (6-12 mois).'
    } else if (globeScore < 0) {
      label = `GLOBE score = ${globeRound} — Risque intermédiaire faible`
      severity = 'low'
      recommendation = 'Bonne réponse au traitement. Surveillance rapprochée (6 mois).'
    } else if (globeScore < 0.5) {
      label = `GLOBE score = ${globeRound} — Risque intermédiaire élevé`
      severity = 'moderate'
      recommendation = 'Réponse sous-optimale à l\'AUDC. Envisager thérapie de 2e ligne (fibrates, obéticholique, budésonide). Surveillance trimestrielle.'
    } else if (globeScore < 1.5) {
      label = `GLOBE score = ${globeRound} — Risque élevé`
      severity = 'high'
      recommendation = 'Mauvaise réponse au traitement. Bilan de cirrhose décompensée. Thérapie de 2e ligne. Évaluation pour transplantation hépatique.'
    } else {
      label = `GLOBE score = ${globeRound} — Risque très élevé`
      severity = 'critical'
      recommendation = 'Très mauvaise réponse. Bilan pré-transplantation hépatique urgent.'
    }

    return { value: globeRound, label, severity, recommendation,
      details: {
        'Survie estimée à 3 ans': `${surv3Round}%`,
        'Survie estimée à 5 ans': `${surv5Round}%`,
        'Survie estimée à 10 ans': `${surv10Round}%`,
        'ln(Bilirubine/ULN)': `${lnBili.toFixed(3)}`,
        'ln(PAL/ULN)': `${lnALP.toFixed(3)}`,
        'ln(Albumine)': `${lnAlb.toFixed(3)}`,
      },
      ranges: [
        { min: -10, max: -0.51, label: '< -0.5 — Faible risque', severity: 'low' },
        { min: -0.5, max: 0, label: '-0.5 à 0 — Intermédiaire faible', severity: 'low' },
        { min: 0.01, max: 0.50, label: '0 à 0.5 — Intermédiaire élevé', severity: 'moderate' },
        { min: 0.51, max: 1.50, label: '0.5 à 1.5 — Risque élevé', severity: 'high' },
        { min: 1.51, max: 10, label: '> 1.5 — Très élevé', severity: 'critical' },
      ]}
  },
  interpretation: `**GLOBE Score — Pronostic CBP (Lammers 2015, Gastroenterology)**

GLOBE = 0.044 × Âge + 0.940 × ln(Bili/ULN) + 0.336 × ln(PAL/ULN) − 2.267 × ln(Alb) − 0.0026 × (Pq/ULN)

Où :
- ULN bilirubine = 20 µmol/L
- ULN PAL = 1.5 µkat/L
- ULN plaquettes = 150 × 10⁹/L

**Interprétation :**
- **< -0.5** : Faible risque — excellente réponse à l\'AUDC
- **-0.5 à 0** : Intermédiaire faible — bonne réponse
- **0 à 0.5** : Intermédiaire élevé — réponse sous-optimale
- **0.5 à 1.5** : Risque élevé — discuter thérapie de 2e ligne
- **> 1.5** : Risque très élevé — envisager transplantation`,
  clinicalCommentary: 'Le GLOBE score est validé pour l\'évaluation pronostique des patients avec CBP traités par AUDC. Il est recommandé par les guidelines EASL (2017) pour évaluer la réponse au traitement après 1 an d\'AUDC. Un score GLOBE < 0.30 prédit une excellente survie. Les traitements de 2e ligne (acide obéticholique, fibrates, budésonide) sont indiqués chez les patients avec réponse incomplète. Attention : le score n\'est pas validé chez les patients non traités par AUDC.',
  references: [
    { type: 'pubmed', title: 'Lammers WJ et al. Development and Validation of a Scoring System to Predict Outcomes of Patients With Primary Biliary Cirrhosis Receiving Ursodeoxycholic Acid Therapy. Gastroenterology 2015', pmid: '26299414' },
    { type: 'pubmed', title: 'EASL Clinical Practice Guidelines: The diagnosis and management of patients with primary biliary cholangitis. J Hepatol 2017', pmid: '28427765' },
  ],
}
export default globe
