import type { FormulaDefinition } from '../types'

const uti_d: FormulaDefinition = {
  id: 'uti-d', slug: 'uti-d',
  name: 'Diagnostic d\'Infection Urinaire — Scores et Critères',
  specialty: 'nephrologie', category: 'Infection urinaire',
  description: 'Aide au diagnostic d\'infection urinaire basée sur les critères cliniques et biologiques (BU, ECBU). Inclut les critères de l\'AFU/SPILF pour l\'infection urinaire simple et compliquée.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 1, label: 'Femme' }, { value: 2, label: 'Homme' }] },
    { id: 'symptomes_urinaires', type: 'boolean', label: 'Signes fonctionnels urinaires (brûlures, pollakiurie, urgenturie)', weight: 2 },
    { id: 'fievre', type: 'boolean', label: 'Fièvre ≥ 38°C', weight: 2 },
    { id: 'douleur_lombes', type: 'boolean', label: 'Douleur lombaire (unilatérale)', weight: 2 },
    { id: 'leucocytes_bu', type: 'boolean', label: 'Leucocyturie à la BU (positive)', weight: 1 },
    { id: 'nitrites_bu', type: 'boolean', label: 'Nitrites à la BU (positifs)', weight: 2 },
    { id: 'porte_sonde', type: 'boolean', label: 'Sonde urinaire à demeure', weight: 1 },
    { id: 'recidive', type: 'boolean', label: 'Antécédent d\'infection urinaire récidivante (> 3/an)', weight: 1 },
  ],
  calculate: (values) => {
    const sexe = Number(values.sexe) || 2
    const symptomes = values.symptomes_urinaires ? 1 : 0
    const fievre = values.fievre ? 1 : 0
    const douleur = values.douleur_lombes ? 1 : 0
    const leuco = values.leucocytes_bu ? 1 : 0
    const nitrites = values.nitrites_bu ? 1 : 0
    const sonde = values.porte_sonde ? 1 : 0
    const recidive = values.recidive ? 1 : 0

    // Score diagnostic simple
    const scoreClinique = symptomes * 2 + fievre * 2 + douleur * 2
    const scoreBio = leuco * 1 + nitrites * 2
    const scoreTotal = scoreClinique + scoreBio + sonde + recidive

    // Classification
    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (scoreTotal <= 2) {
      label = 'Infection urinaire peu probable'
      severity = 'low'
      recommendation = 'Diagnostic d\'infection urinaire peu probable. Rechercher autre cause (vulvite, IST, prostatite).'
    } else if (scoreTotal <= 4) {
      label = 'Infection urinaire possible — À confirmer par ECBU'
      severity = 'moderate'
      recommendation = 'Signes évocateurs. Prescrire un ECBU avec antibiogramme avant traitement. Antibiothérapie probabiliste si symptomatologie sévère.'
    } else if (scoreTotal <= 6) {
      label = 'Infection urinaire probable — Traitement à discuter'
      severity = 'high'
      recommendation = 'Probable cystite (femme) ou infection urinaire. ECBU avec antibiogramme. Antibiothérapie à adapter.'
    } else {
      label = 'Infection urinaire très probable — Traitement probablement nécessaire'
      severity = 'critical'
      recommendation = 'Forte suspicion d\'infection urinaire. ECBU avant traitement. Antibiothérapie probabiliste si signes de gravité (fievre, douleur lombaire).'
    }

    const isComplicated = sonde === 1 || sexe === 2 || recidive === 1 || fievre === 1 && douleur === 1

    return { value: scoreTotal, label, severity, recommendation,
      details: {
        'Type': isComplicated ? 'Infection urinaire compliquée' : 'Infection urinaire simple',
        'Score clinique': `${scoreClinique}/6`,
        'Score biologique': `${scoreBio}/3`,
        'Facteurs de risque': sonde ? 'Sonde urinaire' : recidive ? 'Récidives' : 'Aucun',
      },
      ranges: [
        { min: 0, max: 2, label: 'Score 0-2 — Infection peu probable', severity: 'low', recommendation: 'Chercher autre diagnostic.' },
        { min: 3, max: 4, label: 'Score 3-4 — Infection possible', severity: 'moderate', recommendation: 'ECBU nécessaire.' },
        { min: 5, max: 6, label: 'Score 5-6 — Infection probable', severity: 'high', recommendation: 'ECBU + traitement.' },
        { min: 7, max: 14, label: 'Score ≥ 7 — Infection très probable', severity: 'critical', recommendation: 'Traitement urgent.' },
      ]}
  },
  interpretation: `**Score diagnostique d\'infection urinaire (clinique + BU)**

**Symptômes évocateurs :**
- Brûlures mictionnelles, pollakiurie, urgenturie
- Douleur lombaire unilatérale : pyélonéphrite
- Fièvre ≥ 38°C

**Critères biologiques (BU) :**
- Leucocyturie (> 10⁴/mL) : sensible mais non spécifique
- Nitrites (bactéries réductases) : spécifique (≥ 10⁵ UFC/mL)

**Classification :**
- **Infection simple** : femme, pas de sonde, pas d\'immunodépression
- **Infection compliquée** : homme, sonde, anomalies urologiques, IRC, diabète, grossesse

**Seuils ECBU (selon AFU/SPILF 2021) :**
- Cystite ≥ 10³ UFC/mL
- Pyélonéphrite ≥ 10⁴ UFC/mL
- IU masculine ≥ 10³ UFC/mL
- Sonde : ≥ 10³ UFC/mL`,
  clinicalCommentary: 'L\'ECBU avec antibiogramme reste l\'examen de référence. Une BU négative élimine quasi certainement une infection urinaire (VPN > 95%). Chez la femme jeune sans signe de gravité, une cystite non compliquée peut être traitée sans ECBU. Chez l\'homme, toute infection urinaire est considérée comme compliquée jusqu\'à preuve du contraire.',
  references: [
    { type: 'guideline', title: 'SPILF/AFU — Diagnostic et antibiothérapie des infections urinaires 2021', url: 'https://www.infectiologie.com/' },
    { type: 'pubmed', title: 'Nicolle LE et al. Infectious Diseases Society of America guidelines for the diagnosis and treatment of asymptomatic bacteriuria in adults. Clin Infect Dis 2005', pmid: '15887206' },
  ],
}
export default uti_d
