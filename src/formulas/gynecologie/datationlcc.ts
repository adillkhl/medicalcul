import type { FormulaDefinition } from '../types'

const datationlcc: FormulaDefinition = {
  id: 'datationlcc',
  slug: 'datationlcc',
  name: 'Datation grossesse via LCC',
  specialty: 'gynecologie',
  category: 'Grossesse',
  description: 'Datation de la grossesse par mesure de la longueur cranio-caudale (LCC) au 1er trimestre.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'lcc_mm',
      type: 'number',
      label: 'LCC mesurée (mm)',
      min: 10,
      max: 84,
      step: 0.5,
      placeholder: 'ex: 45',
    },
  ],
  calculate: (values) => {
    const lcc = parseFloat(values.lcc_mm)
    if (isNaN(lcc) || lcc <= 0 || lcc > 84) {
      return { value: 0, label: 'Veuillez entrer une LCC valide entre 10 et 84 mm', severity: 'low', ranges: [] }
    }

    const saJour = 47.96 + (0.82 * lcc) + (0.000376 * lcc * lcc)
    const sa = Math.floor(saJour / 7)
    const jours = Math.round(saJour % 7)

    const terme40 = saJour > 0 ? 280 - saJour : 0
    const termeDate = terme40 >= 0 ? `${Math.floor(terme40)} jours` : 'Dépassée'

    return {
      value: parseFloat(saJour.toFixed(1)),
      label: `Âge gestationnel : ${sa} SA + ${jours} jours (${saJour.toFixed(1)} jours)`,
      severity: 'moderate',
      details: {
        'LCC (mm)': lcc.toString(),
        'Âge gestationnel': `${sa} SA + ${jours} jours`,
        'Jours depuis conception': saJour.toFixed(1),
        'Jours restants jusqu à terme': typeof termeDate === 'string' ? termeDate : `${Math.round(termeDate)}j`,
      },
      ranges: [
        { min: 0, max: 42, label: '< 6 SA (LCC < 5 mm)', severity: 'low', recommendation: 'Grossesse très précoce. Contrôle échographique dans 7-14 jours pour confirmer la viabilité (activité cardiaque visible à 6-7 SA).' },
        { min: 42, max: 84, label: '6-12 SA (LCC 5-60 mm)', severity: 'low', recommendation: 'Période idéale pour la datation précise. Marge d erreur ± 5 jours. Planifier l échographie T1 entre 11 et 13 SA + 6j.' },
        { min: 84, max: 98, label: '12-14 SA (LCC 60-84 mm)', severity: 'low', recommendation: 'Datation encore fiable (± 7 jours). Préparez le dépistage combiné T21 avant 13 SA + 6j.' },
      ],
    }
  },
  interpretation: `La **longueur cranio-caudale (LCC)** mesurée par échographie est la méthode la plus fiable pour dater une grossesse au 1er trimestre.

**Formule de référence** (Hadlock) :
*Âge gestationnel (jours) = 47.96 + 0.82 × LCC (mm) + 0.000376 × LCC²*

**Limites de validité** : LCC entre 10 et 84 mm (soit environ 7 à 14 SA)

**Précision** :
- LCC 10–60 mm (7–12 SA) : ± 5 jours
- LCC 60–84 mm (12–14 SA) : ± 7 jours`,
  clinicalCommentary: `La datation par LCC est la méthode de référence pour dater la grossesse. Elle doit être réalisée entre 11 et 13 SA + 6 jours (LCC 45-84 mm). Une fois la date fixée par cette échographie, elle ne doit plus être modifiée. La fiabilité diminue après 14 SA. En cas de discordance entre la DDR et la LCC > 7 jours, la date retenue est celle de la LCC.`,
  references: [
    {
      type: 'pubmed',
      title: 'Hadlock FP et al. Estimating fetal age: computer-assisted analysis of multiple fetal growth parameters. Radiology 1984',
      pmid: '6695190',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Recommandations sur l échographie obstétricale (2020)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default datationlcc
