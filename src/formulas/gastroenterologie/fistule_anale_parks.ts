import type { FormulaDefinition } from '../types'

const fistuleAnaleParks: FormulaDefinition = {
  id: 'fistule-anale-parks',
  slug: 'fistule-anale-parks',
  name: 'Fistule Anale — Classification de Parks',
  specialty: 'gastroenterologie',
  category: 'Proctologie',
  description: 'Classification des fistules anales selon le trajet fistuleux par rapport au sphincter',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'trajet',
      type: 'radio',
      label: 'Trajet fistuleux par rapport au sphincter',
      options: [
        { value: 1, label: 'Type I — Trans-sphinctérien (à travers le sphincter interne et externe)' },
        { value: 2, label: 'Type II — Inter-sphinctérien (entre sphincter interne et externe)' },
        { value: 3, label: 'Type III — Supra-sphinctérien (au-dessus du sphincter)' },
        { value: 4, label: "Type IV — Extra-sphinctérien (en dehors de l’appareil sphinctérien)" },
      ],
    },
    {
      id: 'orifice_externe',
      type: 'radio',
      label: 'Nombre d\'orifices externes',
      options: [
        { value: 0, label: 'Un seul orifice externe (fistule simple)' },
        { value: 1, label: 'Plusieurs orifices externes (fistule complexe)' },
      ],
    },
    {
      id: 'abcès',
      type: 'boolean',
      label: 'Abcès associé',
    },
    {
      id: 'maladie_crohn',
      type: 'boolean',
      label: 'Maladie de Crohn connue',
    },
  ],
  calculate: (values) => {
    const trajet = Number(values.trajet)
    const multiple = Number(values.orifice_externe) || 0
    const abces = values.abcès || false
    const crohn = values.maladie_crohn || false

    let complexe = trajet > 2 || multiple === 1 || abces || crohn

    let typeText = ''
    switch (trajet) {
      case 1: typeText = 'Trans-sphinctérien'; break
      case 2: typeText = 'Inter-sphinctérien'; break
      case 3: typeText = 'Supra-sphinctérien'; break
      case 4: typeText = 'Extra-sphinctérien'; break
      default: typeText = 'Non spécifié'
    }

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (!complexe) {
      severity = 'low'
      label = `Parks ${typeText} — Fistule simple`
      recommendation = 'Traitement chirurgical standard (fistulotomie si moins d\'1/3 du sphincter externe concerné, ou mise à plat avec fil seton). Pronostic favorable.'
    } else {
      severity = 'high'
      label = `Parks ${typeText} — Fistule complexe`
      recommendation = 'Fistule complexe. IRM pelvienne préopératoire. Chirurgie spécialisée (lambeau d\'avancement, colle biologique, plug). Risque d\'incontinence plus élevé. Avis proctologique spécialisé.'
    }

    return {
      value: trajet,
      label,
      severity,
      details: {
        'Type Parks': typeText,
        'Complexe': complexe ? 'Oui' : 'Non',
      },
      ranges: [
        { min: 1, max: 1, label: 'Type I — Trans-sphinctérien', severity: 'low', recommendation: 'Fistulotomie si < 1/3 du sphincter.' },
        { min: 2, max: 2, label: 'Type II — Inter-sphinctérien', severity: 'low', recommendation: 'Fistulotomie standard.' },
        { min: 3, max: 3, label: 'Type III — Supra-sphinctérien', severity: 'high', recommendation: 'IRM préop. Lambeau d\'avancement.' },
        { min: 4, max: 4, label: 'Type IV — Extra-sphinctérien', severity: 'high', recommendation: 'IRM préop. Chirurgie spécialisée.' },
      ],
    }
  },
  interpretation: `La **classification de Parks** des fistules anales repose sur le trajet du trajet fistuleux par rapport aux sphincters :

- **Type I — Trans-sphinctérien** : traverse le sphincter externe (le plus fréquent, ~50 %)
- **Type II — Inter-sphinctérien** : entre sphincter interne et externe
- **Type III — Supra-sphinctérien** : contourne le sphincter par le haut
- **Type IV — Extra-sphinctérien** : en dehors total de l’appareil sphinctérien

Une fistule est dite **complexe** si : Parks III/IV, multiple orifices externes, abcès associé, maladie de Crohn, antécédent d’incontinence, ou irradiation pelvienne.`,
  clinicalCommentary: `Dans la maladie de Crohn, les fistules anales sont presque toujours complexes et nécessitent une prise en charge médico-chirurgicale combinée (biothérapie + seton). L'IRM pelvienne est l'examen d’imagerie de référence avant toute chirurgie de fistule complexe. L'écho-endoscopie anale peut compléter le bilan. Le risque principal de la chirurgie est l’incontinence fécale.`,
  references: [
    {
      type: 'pubmed',
      title: 'Parks AG et al. A classification of fistula-in-ano. Br J Surg 1976',
      pmid: '1267897',
    },
    {
      type: 'guideline',
      title: 'SNFCP — Recommandations pour la prise en charge des fistules anales (2020)',
      url: 'https://www.snfcp.org',
    },
  ],
}

export default fistuleAnaleParks
