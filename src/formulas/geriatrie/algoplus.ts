import type { FormulaDefinition } from '../types'

const algoplus: FormulaDefinition = {
  id: 'algoplus', slug: 'algoplus',
  name: 'Algoplus — Échelle d\'Évaluation de la Douleur chez la Personne Âgée Non Communicante',
  specialty: 'geriatrie', category: 'Douleur',
  description: 'Échelle comportementale d\'évaluation de la douleur aiguë chez la personne âgée de plus de 65 ans, non communicante ou présentant des troubles de la communication (démence, aphasie). 5 items comportementaux côtés 0 ou 1, score total /5.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'visage', type: 'boolean', label: 'Visage (froncement des sourcils, grimaces, crispation)', weight: 1 },
    { id: 'regard', type: 'boolean', label: 'Regard (regard vide, absent, fixe ou suppliant, pleurs)', weight: 1 },
    { id: 'plaintes', type: 'boolean', label: 'Plaintes verbales (hors-contexte, « aïe », grognements, cris)', weight: 1 },
    { id: 'corps', type: 'boolean', label: 'Corps (réactions aux soins, attitudes antalgiques, raideur)', weight: 1 },
    { id: 'comportement', type: 'boolean', label: 'Comportement général (agitation, confusion, refus de soins)', weight: 1 },
  ],
  calculate: (values) => {
    const visage = values.visage ? 1 : 0
    const regard = values.regard ? 1 : 0
    const plaintes = values.plaintes ? 1 : 0
    const corps = values.corps ? 1 : 0
    const comportement = values.comportement ? 1 : 0
    const score = visage + regard + plaintes + corps + comportement

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score === 0) {
      label = 'Algoplus 0/5 — Pas de douleur'
      severity = 'low'
      recommendation = 'Absence de douleur significative. Pas de traitement antalgique nécessaire.'
    } else if (score <= 1) {
      label = `Algoplus ${score}/5 — Douleur peu probable`
      severity = 'low'
      recommendation = 'Doute sur la présence de douleur. Réévaluation dans les 30-60 minutes, notamment avant et après les soins.'
    } else if (score <= 2) {
      label = `Algoplus ${score}/5 — Douleur probable`
      severity = 'moderate'
      recommendation = 'Douleur probable. Antalgiques palier 1 (paracétamol). Rechercher une cause somatique. Réévaluation.'
    } else {
      label = `Algoplus ${score}/5 — Douleur certaine`
      severity = 'high'
      recommendation = 'Douleur certaine. Antalgiques palier 2-3 selon intensité. Bilan étiologique urgent.'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Visage': visage ? 'Oui' : 'Non',
        'Regard': regard ? 'Oui' : 'Non',
        'Plaintes': plaintes ? 'Oui' : 'Non',
        'Corps': corps ? 'Oui' : 'Non',
        'Comportement': comportement ? 'Oui' : 'Non',
        'Score total': `${score}/5`,
      },
      ranges: [
        { min: 0, max: 0, label: '0/5 — Absence de douleur', severity: 'low', recommendation: 'Pas de traitement.' },
        { min: 1, max: 1, label: '1/5 — Douleur peu probable', severity: 'low', recommendation: 'Surveillance.' },
        { min: 2, max: 2, label: '2/5 — Douleur probable', severity: 'moderate', recommendation: 'Palier 1.' },
        { min: 3, max: 5, label: '3-5/5 — Douleur certaine', severity: 'high', recommendation: 'Palier 2-3.' },
      ],
    }
  },
  interpretation: `**Algoplus — Évaluation de la douleur chez la personne âgée non communicante**

**5 items comportementaux** (0 ou 1 chacun) :
1. **Visage** : froncement des sourcils, grimaces, crispation
2. **Regard** : regard vide, absent, fixe ou suppliant, pleurs
3. **Plaintes** : « aïe », grognements, cris, hors-contexte
4. **Corps** : réactions aux soins, attitudes antalgiques, raideur
5. **Comportement** : agitation, confusion, refus de soins

**Seuils d\'interprétation :**
- **0** : Pas de douleur
- **1** : Douleur peu probable → surveiller
- **2** : Douleur probable → antalgique palier 1
- **≥ 3** : Douleur certaine → antalgique palier 2-3

**Indications :** personnes âgées > 65 ans avec troubles de la communication (démence, aphasie, confusion). Valide en soins aigus et en long séjour. Temps de passation : 2-5 minutes.`,
  clinicalCommentary: 'L\'échelle Algoplus est validée pour l\'évaluation de la douleur aiguë chez la personne âgée non communicante. Elle est recommandée par la HAS et la SFETD (Société Française d\'Étude et de Traitement de la Douleur). En cas de doute ou de douleur chronique, préférer Doloplus. L\'évaluation doit être faite avant et après les soins pour objectiver l\'efficacité du traitement. Attention : l\'agitation peut être due à d\'autres causes (soif, faim, inconfort, anxiété).',
  references: [
    { type: 'pubmed', title: 'Rat P et al. Validation of an acute pain-behavior scale for older persons with inability to communicate verbally: Algoplus. Eur J Pain 2011', pmid: '21185200' },
    { type: 'pubmed', title: 'Rostad HM et al. Algplus validation in nursing home patients. BMC Geriatr 2018', pmid: '29530035' },
    { type: 'guideline', title: 'HAS — Évaluation de la douleur chez la personne âgée', url: 'https://www.has-sante.fr/' },
  ],
}
export default algoplus
