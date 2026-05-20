import type { FormulaDefinition } from '../types'

const rockall: FormulaDefinition = {
  id: 'rockall',
  slug: 'rockall',
  name: 'Rockall (Score) — Hémorragie digestive haute',
  specialty: 'gastroenterologie',
  category: 'Hémorragie digestive',
  description: 'Score pronostique de mortalité après une hémorragie digestive haute, pré-et post-endoscopique',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 0, label: '< 60 ans' },
        { value: 1, label: '60-79 ans' },
        { value: 2, label: '>= 80 ans' },
      ],
    },
    {
      id: 'choc',
      type: 'radio',
      label: 'État hémodynamique',
      options: [
        { value: 0, label: 'Pas de choc (PAS >= 100, pouls < 100)' },
        { value: 1, label: 'Tachycardie (PAS >= 100, pouls >= 100)' },
        { value: 2, label: 'Hypotension (PAS < 100)' },
      ],
    },
    {
      id: 'comorbidite',
      type: 'radio',
      label: 'Comorbidité',
      options: [
        { value: 0, label: 'Aucune comorbidité majeure' },
        { value: 2, label: 'Insuffisance cardiaque, coronaropathie, comorbidité majeure' },
        { value: 3, label: 'Insuffisance rénale, hépatique, ou cancer métastatique' },
      ],
    },
    {
      id: 'diagnostic_endoscopique',
      type: 'radio',
      label: 'Diagnostic endoscopique',
      options: [
        { value: 0, label: 'Aucune lésion, Mallory-Weiss, ou pas de stigmate de saignement' },
        { value: 1, label: 'Ulcère gastroduodénal, érosions, œsophagite' },
        { value: 2, label: 'Cancer digestif haut' },
        { value: 3, label: 'Pas d\'endoscopie réalisée' },
      ],
    },
    {
      id: 'saignement_recent',
      type: 'radio',
      label: 'Stigmates de saignement récent à l\'endoscopie',
      options: [
        { value: 0, label: 'Pas de stigmate ou base propre (Forrest III, IIC)' },
        { value: 1, label: 'Caillot adhérent, vaisseau visible, ou saignement actif (Forrest IA-IIB)' },
        { value: 2, label: 'Pas d\'endoscopie réalisée' },
      ],
    },
  ],
  calculate: (values) => {
    const age = Number(values.age) || 0
    const choc = Number(values.choc) || 0
    const comorbidite = Number(values.comorbidite) || 0
    const diag = Number(values.diagnostic_endoscopique) || 0
    const saignement = Number(values.saignement_recent) || 0

    // Pre-endoscopic score (age + choc + comorbidite)
    const preEndo = age + choc + comorbidite

    // Post-endoscopic full score (includes endoscopy findings)
    let saignementScore = saignement
    if (diag === 3) saignementScore = 2 // no endoscopy
    const fullScore = preEndo + diag + saignementScore

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (fullScore <= 2) {
      severity = 'low'
      label = `Rockall ${fullScore} — Risque faible`
      recommendation = 'Mortalité < 1 %. Surveillance standard. Sortie envisageable à 24-48h selon le contexte.'
    } else if (fullScore <= 5) {
      severity = 'moderate'
      label = `Rockall ${fullScore} — Risque modéré`
      recommendation = 'Mortalité ~5-12 %. Hospitalisation. Traitements spécifiques selon le diagnostic endoscopique.'
    } else if (fullScore <= 7) {
      severity = 'high'
      label = `Rockall ${fullScore} — Risque élevé`
      recommendation = 'Mortalité ~12-25 %. Surveillance en soins intensifs. Traitement agressif. Transfusion selon Hb.'
    } else {
      severity = 'critical'
      label = `Rockall ${fullScore} — Risque très élevé`
      recommendation = 'Mortalité > 25-45 %. Réanimation. Transfusion. Avis chirurgical. Endoscopie thérapeutique urgente si possible.'
    }

    return {
      value: fullScore,
      label,
      severity,
      details: {
        'Score pré-endoscopique': preEndo,
        'Score post-endoscopique': fullScore,
      },
      ranges: [
        { min: 0, max: 2, label: '0-2 — Risque faible (mortalité < 1 %)', severity: 'low', recommendation: 'Surveillance standard.' },
        { min: 3, max: 5, label: '3-5 — Risque modéré (mortalité ~5-12 %)', severity: 'moderate', recommendation: 'Hospitalisation. Traitements spécifiques.' },
        { min: 6, max: 7, label: '6-7 — Risque élevé (mortalité ~12-25 %)', severity: 'high', recommendation: 'Soins intensifs.' },
        { min: 8, max: 11, label: '8+ — Risque très élevé (mortalité > 25-45 %)', severity: 'critical', recommendation: 'Réanimation. Avis chirurgical.' },
      ],
    }
  },
  interpretation: `Le **score de Rockall** (ou score de l’APACHE) est un score pronostique de mortalité après hémorragie digestive haute, utilisable avant et après endoscopie.\n\n**Score pré-endoscopique** (3 items, max 7 pts) :\n- Age (< 60 = 0, 60-79 = 1, >= 80 = 2)\n- Choc (PAS >= 100 + FC < 100 = 0, PAS >= 100 + FC >= 100 = 1, PAS < 100 = 2)\n- Comorbidité (aucune = 0, IC/coronaire = 2, IR/IH/cancer = 3)\n\n**Score post-endoscopique** complet (ajoute diagnostic et stigmates de saignement).\n\nUn score pre-endoscopique = 0 predit un faible risque de mortalite et peut guider la sortie precoce.`,
  clinicalCommentary: `Le Rockall diffère du Glasgow-Blatchford : le Rockall prédit la mortalité, tandis que le Blatchford prédit le besoin d’intervention. Le Rockall pré-endoscopique est utile pour le triage initial, mais sa valeur prédictive négative (score 0) est inférieure à celle du Blatchford. Le score post-endoscopique nécessite une endoscopie = limitation pratique aux urgences. Pour la décision de sortie, préférer le Blatchford (score 0 = sortie possible).`,
  references: [
    {
      type: 'pubmed',
      title: 'Rockall TA et al. Risk assessment after acute upper gastrointestinal haemorrhage. Gut 1996',
      pmid: '8782073',
    },
    {
      type: 'guideline',
      title: 'Recommandations SFED — Hémorragie digestive haute (2021)',
      url: 'https://www.sfed.org',
    },
  ],
}

export default rockall
