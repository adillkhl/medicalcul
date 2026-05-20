import type { FormulaDefinition } from '../types'

const calgrossesse: FormulaDefinition = {
  id: 'calgrossesse',
  slug: 'calgrossesse',
  name: 'Calendrier de grossesse',
  specialty: 'gynecologie',
  category: 'Grossesse',
  description: 'Calcul des différents termes de grossesse et dates d examens à partir de la date des dernières règles (DDR) ou d une date de conception.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'duree_cycle',
      type: 'number',
      label: 'Durée habituelle du cycle (jours)',
      min: 21,
      max: 42,
      step: 1,
      placeholder: '28',
    },
    {
      id: 'ddr_jour',
      type: 'number',
      label: 'Jour des dernières règles (1-31)',
      min: 1,
      max: 31,
      step: 1,
      placeholder: '15',
    },
    {
      id: 'ddr_mois',
      type: 'number',
      label: 'Mois des dernières règles (1-12)',
      min: 1,
      max: 12,
      step: 1,
      placeholder: '6',
    },
    {
      id: 'ddr_annee',
      type: 'number',
      label: 'Année des dernières règles',
      min: 2020,
      max: 2030,
      step: 1,
      placeholder: '2025',
    },
  ],
  calculate: (values) => {
    const jour = parseInt(values.ddr_jour)
    const mois = parseInt(values.ddr_mois)
    const annee = parseInt(values.ddr_annee)
    const cycle = parseInt(values.duree_cycle) || 28

    if (isNaN(jour) || isNaN(mois) || isNaN(annee)) {
      return { value: 0, label: 'Veuillez entrer une date valide', severity: 'low', ranges: [] }
    }

    const ddr = new Date(annee, mois - 1, jour)
    if (ddr.toString() === 'Invalid Date') {
      return { value: 0, label: 'Date invalide', severity: 'low', ranges: [] }
    }

    const decalage = cycle - 28
    const conception = new Date(ddr)
    conception.setDate(conception.getDate() + 14 + decalage)

    const terme40 = new Date(ddr)
    terme40.setDate(terme40.getDate() + 280 + decalage)

    const terme41 = new Date(ddr)
    terme41.setDate(terme41.getDate() + 287 + decalage)

    const terme42 = new Date(ddr)
    terme42.setDate(terme42.getDate() + 294 + decalage)

    const debutT1 = ddr
    const finT1 = new Date(ddr)
    finT1.setDate(finT1.getDate() + 83 + decalage)

    const debutT2 = new Date(finT1)
    debutT2.setDate(debutT2.getDate() + 1)
    const finT2 = new Date(ddr)
    finT2.setDate(finT2.getDate() + 196 + decalage)

    const debutT3 = new Date(finT2)
    debutT3.setDate(debutT3.getDate() + 1)

    const dateT1echo = new Date(ddr)
    dateT1echo.setDate(dateT1echo.getDate() + 77 + decalage)

    const dateT2echo = new Date(ddr)
    dateT2echo.setDate(dateT2echo.getDate() + 161 + decalage)

    const dateT3echo = new Date(ddr)
    dateT3echo.setDate(dateT3echo.getDate() + 231 + decalage)

    const joursAvant = Math.round((terme40.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    const fmt = (d: Date) =>
      `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`

    return {
      value: 280 + decalage,
      label: `Terme prévu (40 SA) : ${fmt(terme40)}`,
      severity: joursAvant <= 0 ? 'high' : joursAvant <= 30 ? 'moderate' : 'low',
      details: {
        'DDR': fmt(ddr),
        'Conception estimée': fmt(conception),
        'Terme 40 SA': fmt(terme40),
        'Fenêtre accouchement (41 SA)': fmt(terme41),
        'Limite (42 SA)': fmt(terme42),
        'Début T1': fmt(debutT1),
        'Fin T1 (13 SA)': fmt(finT1),
        'Début T2 (14 SA)': fmt(debutT2),
        'Fin T2 (28 SA)': fmt(finT2),
        'Début T3 (29 SA)': fmt(debutT3),
        'Écho T1 (11-13 SA)': fmt(dateT1echo),
        'Écho T2 (22-24 SA)': fmt(dateT2echo),
        'Écho T3 (32-34 SA)': fmt(dateT3echo),
        'Jours restants': `${joursAvant} jours`,
      },
      ranges: [
        { min: 0, max: 83, label: '1er trimestre (0-13 SA)', severity: 'low', recommendation: 'Échographie T1 entre 11 et 13 SA + 6j. Dépistage combiné T21. Prescription acide folique si pas déjà fait.' },
        { min: 84, max: 196, label: '2e trimestre (14-28 SA)', severity: 'low', recommendation: 'Échographie T2 entre 22 et 24 SA. Consultation mensuelle. Dépistage diabète gestationnel (HGPO 75g) entre 24 et 28 SA.' },
        { min: 197, max: 280, label: '3e trimestre (29-40 SA)', severity: 'moderate', recommendation: 'Échographie T3 entre 32 et 34 SA. Consultation bimensuelle à partir de 36 SA. Entretien prénatal précoce si pas déjà fait.' },
        { min: 281, max: 294, label: 'Dépassement (41+ SA)', severity: 'high', recommendation: 'Surveillance renforcée. Déclenchement discuté à 41 SA + 0j, recommandé avant 42 SA + 0j.' },
      ],
    }
  },
  interpretation: `Le **calendrier de grossesse** calcule les dates clés à partir des dernières règles (DDR) et de la durée habituelle du cycle.

**Formule** : *Terme = DDR + 280 jours (40 SA) + (cycle - 28 jours)*

**Trimestres :**
- T1 : 0–13 SA (± 83 jours)
- T2 : 14–28 SA (84–196 jours)
- T3 : 29–40 SA (197–280 jours)

**Examens obligatoires :**
- Échographie T1 : 11–14 SA
- Échographie T2 : 22–24 SA
- Échographie T3 : 32–34 SA`,
  clinicalCommentary: `La datation par DDR est fiable pour des cycles réguliers de 28 jours. Pour des cycles irréguliers ou une date inconnue, se fier à la LCC échographique du 1er trimestre. La date de conception estimée sert surtout pour le calcul du congé maternité. Le dépassement de terme (> 41 SA) nécessite une surveillance rapprochée et un déclenchement avant 42 SA.`,
  references: [
    {
      type: 'guideline',
      title: 'HAS — Suivi et orientation des femmes enceintes (Recommandations 2016)',
      url: 'https://www.has-sante.fr',
    },
    {
      type: 'pubmed',
      title: 'Savitz DA et al. Estimating gestational age from last menstrual period. Am J Epidemiol 2002',
      pmid: '11865493',
    },
  ],
}
export default calgrossesse
