import type { FormulaDefinition } from '../types'

const agegestHu: FormulaDefinition = {
  id: 'agegest_hu',
  slug: 'agegest_hu',
  name: 'Age gestationnel selon hauteur utérine',
  specialty: 'gynecologie',
  category: 'Grossesse',
  description: 'Estimation de l age gestationnel à partir de la hauteur utérine mesurée en centimètres.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'hu',
      type: 'number',
      label: 'Hauteur utérine (cm)',
      min: 10,
      max: 45,
      step: 0.5,
      placeholder: 'ex: 28',
    },
    {
      id: 'terme_connu',
      type: 'boolean',
      label: 'Terme connu par datation précoce',
      weight: 0,
    },
  ],
  calculate: (values) => {
    const hu = parseFloat(values.hu)
    if (isNaN(hu) || hu <= 0) {
      return { value: 0, label: 'Veuillez entrer une hauteur utérine valide', severity: 'low', ranges: [] }
    }
    const ageSemaines = Math.round((hu + 2) / 0.85)
    const ageMois = Math.floor(ageSemaines / 4.33)
    const joursRestants = Math.round((ageSemaines / 4.33 - ageMois) * 30)
    const percentiles = [
      { sem: 16, p5: 12, p50: 16, p95: 20 },
      { sem: 20, p5: 15, p50: 20, p95: 24 },
      { sem: 24, p5: 20, p50: 24, p95: 28 },
      { sem: 28, p5: 24, p50: 28, p95: 32 },
      { sem: 32, p5: 28, p50: 32, p95: 36 },
      { sem: 36, p5: 30, p50: 34, p95: 38 },
      { sem: 40, p5: 32, p50: 36, p95: 40 },
    ]
    let interpretation = 'Âge gestationnel estimé'
    let severity: 'low' | 'moderate' | 'high' = 'low'
    if (ageSemaines < 24) severity = 'low'
    else if (ageSemaines < 37) severity = 'moderate'
    else severity = 'high'

    return {
      value: ageSemaines,
      label: `Âge gestationnel estimé : ${ageSemaines} SA (${ageMois} mois et ${joursRestants} jours)`,
      severity,
      details: {
        'Hauteur utérine': `${hu} cm`,
        'Âge gestationnel estimé': `${ageSemaines} SA`,
      },
      ranges: [
        { min: 0, max: 22, label: '1er trimestre / début 2e trimestre', severity: 'low', recommendation: 'HU peu fiable avant 20 SA. Utiliser la LCC échographique pour la datation.' },
        { min: 23, max: 27, label: '2e trimestre (23-27 SA)', severity: 'low', recommendation: 'HU corrélée à l âge gestationnel ± 2 semaines. Surveillance de la croissance.' },
        { min: 28, max: 36, label: '3e trimestre (28-36 SA)', severity: 'moderate', recommendation: 'HU fiable. Écart > 3 cm par rapport au terme attendu justifie une échographie de contrôle.' },
        { min: 37, max: 45, label: 'Terme (≥ 37 SA)', severity: 'high', recommendation: 'HU ≥ 37 SA : grossesse à terme. Si HU > 40 cm ou stagnation : rechercher Hydramnios, macrosomie ou retard de croissance.' },
      ],
    }
  },
  interpretation: `La **hauteur utérine (HU)** est mesurée du bord supérieur de la symphyse pubienne au fond utérin, avec un mètre ruban, patiente en décubitus dorsal, vessie vide.

**Formule de référence** : *Âge gestationnel (SA) ≈ (HU + 2) / 0.85*

**Valeurs normales** par terme :
- 16 SA : 12–20 cm
- 20 SA : 15–24 cm
- 24 SA : 20–28 cm
- 28 SA : 24–32 cm
- 32 SA : 28–36 cm
- 36 SA : 30–38 cm
- 40 SA : 32–40 cm

Un écart de plus de 3 cm par rapport à la valeur attendue justifie une échographie.`,
  clinicalCommentary: `La mesure de la HU est un examen simple, reproductible et sans danger. Elle est peu fiable avant 20 SA (utiliser la LCC) et après 38 SA (engagement). Elle reste un excellent outil de dépistage des anomalies de croissance (RCIU, macrosomie) et des troubles du liquide amniotique. En cas d\'obésité ou d\'utérus fibromateux, la fiabilité diminue.`,
  references: [
    {
      type: 'guideline',
      title: 'CNGOF — Mesure de la hauteur utérine (Recommandations 2019)',
      url: 'https://www.cngof.fr',
    },
    {
      type: 'pubmed',
      title: 'Papiernik E et al. Estimation of gestational age by fundal height measurement. Eur J Obstet Gynecol Reprod Biol 1993',
      pmid: '8276169',
    },
  ],
}
export default agegestHu
