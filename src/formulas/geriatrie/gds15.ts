import type { FormulaDefinition } from '../types'

const gds15: FormulaDefinition = {
  id: 'gds15', slug: 'gds15',
  name: 'GDS-15 (Geriatric Depression Scale) — Échelle de Dépression Gériatrique (15 items)',
  specialty: 'geriatrie', category: 'Évaluation psychiatrique',
  description: 'GDS-15: version courte de la Geriatric Depression Scale de Yesavage. 15 questions oui/non pour le dépistage de la dépression chez la personne âgée. Score /15. Seuils : 0-4 normal, 5-8 dépression légère, 9-11 dépression modérée, 12-15 dépression sévère.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'q1', type: 'boolean', label: '1. Êtes-vous satisfait(e) de votre vie ? (Si OUI → 0, NON → 1)', weight: 1 },
    { id: 'q2', type: 'boolean', label: '2. Avez-vous abandonné un grand nombre de vos activités ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q3', type: 'boolean', label: '3. Avez-vous le sentiment que votre vie est vide ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q4', type: 'boolean', label: '4. Vous ennuyez-vous souvent ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q5', type: 'boolean', label: '5. Êtes-vous de bonne humeur la plupart du temps ? (OUI → 0, NON → 1)', weight: 1 },
    { id: 'q6', type: 'boolean', label: '6. Avez-vous peur que quelque chose de mauvais vous arrive ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q7', type: 'boolean', label: '7. Êtes-vous heureux(se) la plupart du temps ? (OUI → 0, NON → 1)', weight: 1 },
    { id: 'q8', type: 'boolean', label: '8. Vous sentez-vous souvent impuissant(e) ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q9', type: 'boolean', label: '9. Préférez-vous rester à la maison plutôt que de sortir ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q10', type: 'boolean', label: '10. Pensez-vous avoir plus de problèmes de mémoire que la plupart des gens ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q11', type: 'boolean', label: '11. Pensez-vous qu\'il est merveilleux de vivre ? (OUI → 0, NON → 1)', weight: 1 },
    { id: 'q12', type: 'boolean', label: '12. Vous sentez-vous plutôt inutile ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q13', type: 'boolean', label: '13. Vous sentez-vous plein(e) d\'énergie ? (OUI → 0, NON → 1)', weight: 1 },
    { id: 'q14', type: 'boolean', label: '14. La situation dans laquelle vous vous trouvez vous semble-t-elle désespérée ? (OUI → 1, NON → 0)', weight: 1 },
    { id: 'q15', type: 'boolean', label: '15. Pensez-vous que les autres sont mieux lotis que vous ? (OUI → 1, NON → 0)', weight: 1 },
  ],
  calculate: (values) => {
    // GDS-15: items inversés (réponse dépressive = 1)
    // Items 1,5,7,11,13 sont en positif (OUI = 0, NON = 1)
    // Les autres items (2,3,4,6,8,9,10,12,14,15) sont en négatif (OUI = 1, NON = 0)
    // Since our boolean input gives true for the label being checked,
    // we need to handle the inversion
    
    // Let\'s use a mapping: for items where "Oui" means depressive, we count the boolean directly.
    // For items where "Non" means depressive, we invert.
    
    const invert = (v: boolean | undefined) => v ? 0 : 1
    const direct = (v: boolean | undefined) => v ? 1 : 0

    const q1 = invert(values.q1)     // satisfait? OUI=0
    const q2 = direct(values.q2)     // abandon activités? OUI=1
    const q3 = direct(values.q3)     // vie vide? OUI=1
    const q4 = direct(values.q4)     // ennui? OUI=1
    const q5 = invert(values.q5)     // bonne humeur? OUI=0
    const q6 = direct(values.q6)     // peur? OUI=1
    const q7 = invert(values.q7)     // heureux? OUI=0
    const q8 = direct(values.q8)     // impuissant? OUI=1
    const q9 = direct(values.q9)     // préfère rester? OUI=1
    const q10 = direct(values.q10)   // problèmes mémoire? OUI=1
    const q11 = invert(values.q11)   // merveilleux de vivre? OUI=0
    const q12 = direct(values.q12)   // inutile? OUI=1
    const q13 = invert(values.q13)   // plein d\'énergie? OUI=0
    const q14 = direct(values.q14)   // désespéré? OUI=1
    const q15 = direct(values.q15)   // autres mieux lotis? OUI=1

    const score = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10 + q11 + q12 + q13 + q14 + q15

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 4) {
      label = `GDS-15 ${score}/15 — Normal (pas de dépression)`
      severity = 'low'
      recommendation = 'Absence de syndrome dépressif. Pas d\'intervention spécifique nécessaire.'
    } else if (score <= 8) {
      label = `GDS-15 ${score}/15 — Dépression légère`
      severity = 'low'
      recommendation = 'Syndrome dépressif léger probable. Évaluation clinique complémentaire. Psychothérapie ou soutien psychologique. Surveiller l\'évolution.'
    } else if (score <= 11) {
      label = `GDS-15 ${score}/15 — Dépression modérée`
      severity = 'moderate'
      recommendation = 'Syndrome dépressif modéré. Consultation spécialisée (psychiatre, gériatre). Traitement antidépresseur à envisager. Psychothérapie associée.'
    } else {
      label = `GDS-15 ${score}/15 — Dépression sévère`
      severity = 'high'
      recommendation = 'Syndrome dépressif sévère. Prise en charge psychiatrique urgente. Traitement antidépresseur. Hospitalisation si risque suicidaire ou dénutrition.'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Satisfait de sa vie': q1 ? 'Non' : 'Oui',
        'Abandon activités': q2 ? 'Oui' : 'Non',
        'Vie vide': q3 ? 'Oui' : 'Non',
        'S\'ennuie': q4 ? 'Oui' : 'Non',
        'Bonne humeur': q5 ? 'Non' : 'Oui',
        'Peur de malheur': q6 ? 'Oui' : 'Non',
        'Heureux': q7 ? 'Non' : 'Oui',
        'Impuissant': q8 ? 'Oui' : 'Non',
        'Préfère rester': q9 ? 'Oui' : 'Non',
        'Problèmes mémoire': q10 ? 'Oui' : 'Non',
        'Merveilleux vivre': q11 ? 'Non' : 'Oui',
        'Inutile': q12 ? 'Oui' : 'Non',
        'Plein d\'énergie': q13 ? 'Non' : 'Oui',
        'Désespéré': q14 ? 'Oui' : 'Non',
        'Autres mieux lotis': q15 ? 'Oui' : 'Non',
        'Score total': `${score}/15`,
      },
      ranges: [
        { min: 0, max: 4, label: '0-4 — Normal', severity: 'low', recommendation: 'Pas de dépression.' },
        { min: 5, max: 8, label: '5-8 — Légère', severity: 'low', recommendation: 'Surveillance, soutien.' },
        { min: 9, max: 11, label: '9-11 — Modérée', severity: 'moderate', recommendation: 'Consultation spécialisée.' },
        { min: 12, max: 15, label: '12-15 — Sévère', severity: 'high', recommendation: 'Urgence psychiatrique.' },
      ],
    }
  },
  interpretation: `**GDS-15 — Geriatric Depression Scale (Yesavage)**

Échelle de dépistage de la dépression chez la personne âgée. 15 questions à réponse oui/non.

**Items inversés (réponse NON = point de dépression) :** Q1, Q5, Q7, Q11, Q13

**Seuils :**
- **0-4** : Normal (pas de dépression)
- **5-8** : Dépression légère
- **9-11** : Dépression modérée
- **12-15** : Dépression sévère

**Performance :** Sensibilité 92%, Spécificité 89% pour le seuil > 5.

**Utilisation :** Évaluation gériatrique complète, médecine générale, consultation mémoire. Ne remplace pas l\'entretien clinique structuré (M.I.N.I., DSM-5).`,
  clinicalCommentary: 'La GDS-15 est l\'échelle de dépistage de la dépression la plus utilisée en gériatrie. Elle est validée chez la personne âgée (> 65 ans) y compris avec des troubles cognitifs légers à modérés (MMS > 15). La dépression du sujet âgé est souvent atypique : asthénie, perte d\'appétit, plaintes somatiques, ralentissement psychomoteur. L\'évaluation du risque suicidaire est impérative en cas de dépression. La GDS-15 existe aussi en version 4 items (GDS-4) pour un dépistage ultra-rapide.',
  references: [
    { type: 'pubmed', title: 'Yesavage JA et al. Development and validation of a geriatric depression screening scale. J Psychiatr Res 1982-1983', pmid: '7183759' },
    { type: 'pubmed', title: 'Sheikh JI, Yesavage JA. Geriatric Depression Scale (GDS): recent evidence and development of a shorter version. Clin Gerontol 1986' },
    { type: 'guideline', title: 'HAS — Dépression de la personne âgée', url: 'https://www.has-sante.fr/' },
  ],
}
export default gds15
