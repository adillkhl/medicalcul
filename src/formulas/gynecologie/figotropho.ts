import type { FormulaDefinition } from '../types'

const figotropho: FormulaDefinition = {
  id: 'figotropho',
  slug: 'figotropho',
  name: 'FIGO, Maladies Trophoblastiques Gestationnelles (Score et stades)',
  specialty: 'gynecologie',
  category: 'Maladies trophoblastiques',
  description: 'Classification FIGO 2000 pour les maladies trophoblastiques gestationnelles : score pronostique et stade anatomique.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge de la patiente',
      options: [
        { value: 0, label: '< 39 ans' },
        { value: 1, label: '≥ 40 ans' },
      ],
    },
    {
      id: 'antecedent',
      type: 'radio',
      label: 'Antécédent de môle',
      options: [
        { value: 0, label: 'Grossesse môlaire' },
        { value: 2, label: 'Antécédent de tumeur trophoblastique' },
      ],
    },
    {
      id: 'delai',
      type: 'radio',
      label: 'Délai depuis la grossesse index (mois)',
      options: [
        { value: 0, label: '< 4 mois' },
        { value: 1, label: '4-6 mois' },
        { value: 2, label: '7-12 mois' },
        { value: 4, label: '> 12 mois' },
      ],
    },
    {
      id: 'hcg_init',
      type: 'radio',
      label: 'β-hCG initiale (UI/L)',
      options: [
        { value: 0, label: '< 10³' },
        { value: 1, label: '10³-10⁴' },
        { value: 2, label: '10⁴-10⁵' },
        { value: 4, label: '> 10⁵' },
      ],
    },
    {
      id: 'plus_grosse_tumeur',
      type: 'radio',
      label: 'Plus grosse tumeur (cm)',
      options: [
        { value: 0, label: '< 3 cm' },
        { value: 1, label: '3-5 cm' },
        { value: 2, label: '≥ 5 cm' },
      ],
    },
    {
      id: 'metastases_site',
      type: 'radio',
      label: 'Site des métastases',
      options: [
        { value: 0, label: 'Poumon' },
        { value: 1, label: 'Rate / Rein / Digestif' },
        { value: 2, label: 'Foie' },
        { value: 4, label: 'Cerveau / Digestif' },
      ],
    },
    {
      id: 'nombre_metastases',
      type: 'radio',
      label: 'Nombre de métastases',
      options: [
        { value: 0, label: '0' },
        { value: 1, label: '1-4' },
        { value: 2, label: '5-8' },
        { value: 4, label: '> 8' },
      ],
    },
    {
      id: 'chimio_anterieure',
      type: 'boolean',
      label: 'Chimiothérapie antérieure',
      weight: 2,
    },
  ],
  calculate: (values) => {
    const age = parseInt(values.age) || 0
    const ant = parseInt(values.antecedent) || 0
    const delai = parseInt(values.delai) || 0
    const hcg = parseInt(values.hcg_init) || 0
    const tumeur = parseInt(values.plus_grosse_tumeur) || 0
    const site = parseInt(values.metastases_site) || 0
    const nbMeta = parseInt(values.nombre_metastases) || 0
    const chimio = values.chimio_anterieure ? 2 : 0
    const score = age + ant + delai + hcg + tumeur + site + nbMeta + chimio

    let riskLabel: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (score <= 6) { riskLabel = 'Bas risque'; severity = 'low' }
    else if (score <= 8) { riskLabel = 'Risque intermédiaire'; severity = 'moderate' }
    else { riskLabel = 'Haut risque'; severity = 'critical' }

    return {
      value: score,
      label: `Score FIGO MTG : ${score} — ${riskLabel}`,
      severity,
      ranges: [
        { min: 0, max: 6, label: 'Bas risque', severity: 'low', recommendation: 'Monochimiothérapie par méthotrexate (MTX) ou actinomycine D. Surveillance β-hCG hebdomadaire. Bon pronostic (> 98 % de guérison).' },
        { min: 7, max: 8, label: 'Risque intermédiaire', severity: 'moderate', recommendation: 'Polychimiothérapie (EMA-CO ou EP-EMA). Surveillance rapprochée. Discussion en RCP.' },
        { min: 9, max: 25, label: 'Haut risque', severity: 'critical', recommendation: 'Polychimiothérapie intensive (EMA-CO, EP-EMA, TE-TP). Radiothérapie si métastases cérébrales. RCP spécialisée. Pronostic réservé mais guérison possible.' },
      ],
    }
  },
  interpretation: `Le **score FIGO 2000** complète la stadification anatomique pour les tumeurs trophoblastiques gestationnelles (TTG).

**Stade anatomique :**
- **Stade I** : Tumeur limitée à l utérus
- **Stade II** : Extension pelvienne
- **Stade III** : Métastases pulmonaires
- **Stade IV** : Autres métastases viscérales (foie, cerveau, rein, digestif)

**Score pronostique FIGO (0–25+) :**
- Bas risque (≤ 6) : MTX en monothérapie
- Haut risque (≥ 7) : Polychimiothérapie

Plus le score est élevé, plus le traitement doit être agressif.`,
  clinicalCommentary: `La classification FIGO des MTG est pronostique et thérapeutique. Le score intègre 8 facteurs de risque. Les tumeurs trophoblastiques sont parmi les cancers gynécologiques les plus curables, même au stade métastatique (> 90 % de guérison). Le suivi des β-hCG doit être mensuel pendant 12 mois après normalisation. Une contraception est indispensable pendant le suivi.`,
  references: [
    {
      type: 'pubmed',
      title: 'Ngan HYS et al. FIGO staging for gestational trophoblastic neoplasia 2000. Int J Gynaecol Obstet 2021',
      pmid: '33909933',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prise en charge des maladies trophoblastiques (Recommandations 2020)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default figotropho
