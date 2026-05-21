import type { FormulaDefinition } from '../types'

const gold2017: FormulaDefinition = {
  id: 'gold2017', slug: 'gold2017',
  name: 'GOLD 2017 — Classification ABCD de la BPCO',
  specialty: 'pneumologie', category: 'BPCO',
  description: 'Classification GOLD 2017 de la BPCO combinant la sévérité du trouble ventilatoire (stades spirométriques 1-4) et l\'impact clinique (CAT/mMRC) avec l\'histoire des exacerbations — groupes A, B, C, D',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'vems', type: 'number', label: 'VEMS post-bronchodilatateur (% de la valeur prédite)', unit: '%', min: 10, max: 120, step: 1, placeholder: 'Ex: 55' },
    { id: 'cat', type: 'number', label: 'Score CAT (COPD Assessment Test)', unit: '/40', min: 0, max: 40, step: 1, placeholder: 'Ex: 12' },
    { id: 'mmrc', type: 'radio', label: 'mMRC (Modified Medical Research Council Dyspnea Scale)', options: [
      { value: 0, label: 'mMRC 0 — Dyspnée uniquement pour effort intense' },
      { value: 1, label: 'mMRC 1 — Essoufflé en marchant vite ou en montée légère' },
      { value: 2, label: 'mMRC 2 — Marche plus lent que les gens du même âge ou doit s\'arrêter' },
      { value: 3, label: 'mMRC 3 — S\'arrête pour souffler après 100m ou après quelques minutes' },
      { value: 4, label: 'mMRC 4 — Trop essoufflé pour quitter la maison ou s\'habille' },
    ]},
    { id: 'exacerbations_an', type: 'number', label: 'Nombre d\'exacerbations modérées/sévères dans l\'année écoulée', unit: 'nombre', min: 0, max: 10, step: 1, placeholder: 'Ex: 2' },
    { id: 'hospitalisation_exac', type: 'boolean', label: '≥ 1 hospitalisation pour exacerbation dans l\'année' },
  ],
  calculate: (values) => {
    const vems = Number(values.vems) || 60
    const cat = Number(values.cat) || 10
    const mmrc = Number(values.mmrc) || 0
    const exacAn = Number(values.exacerbations_an) || 0
    const hospit = !!values.hospitalisation_exac

    // Stade spirométrique GOLD
    let stadeSpiro: number
    let stadeSpiroLabel: string
    if (vems >= 80) { stadeSpiro = 1; stadeSpiroLabel = 'GOLD 1 (Léger)' }
    else if (vems >= 50) { stadeSpiro = 2; stadeSpiroLabel = 'GOLD 2 (Modéré)' }
    else if (vems >= 30) { stadeSpiro = 3; stadeSpiroLabel = 'GOLD 3 (Sévère)' }
    else { stadeSpiro = 4; stadeSpiroLabel = 'GOLD 4 (Très sévère)' }

    // Groupe ABCD (GOLD 2017)
    const symptomesEleves = cat >= 10 || mmrc >= 2
    const exacModere = exacAn >= 2
    const exacSevere = exacAn >= 1 && hospit

    let groupe: string
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let priseEnCharge = ''

    if (!symptomesEleves && !exacModere && !exacSevere) {
      groupe = 'A'
      severity = 'low'
      priseEnCharge = 'Bronchodilatateur (LAMA ou LABA) selon besoin ou en continu. Sevrage tabagique. Vaccination. Activité physique.'
    } else if (!symptomesEleves && (exacModere || exacSevere)) {
      groupe = 'C'
      severity = 'high'
      priseEnCharge = 'LAMA en première ligne. Si exacerbations persistantes : LAMA+LABA ou LAMA+CSI. Prévention des exacerbations.'
    } else if (symptomesEleves && !exacModere && !exacSevere) {
      groupe = 'B'
      severity = 'moderate'
      priseEnCharge = 'LAMA+LABA en première ligne. Réhabilitation respiratoire. Prise en charge des comorbidités.'
    } else {
      groupe = 'D'
      severity = 'critical'
      priseEnCharge = 'LAMA+LABA+CSI (± roflumilast, macrolides). Réhabilitation. Oxygène si insuffisance respiratoire. Évaluation pour chirurgie de réduction.'
    }

    return {
      value: stadeSpiro,
      label: `GOLD 2017 : Groupe ${groupe} | ${stadeSpiroLabel}`,
      severity,
      details: {
        'VEMS (% prédit)': `${vems}%`,
        'Stade spirométrique': stadeSpiroLabel,
        'CAT': `${cat}/40`,
        'mMRC': `${mmrc}/4`,
        'Symptômes': symptomesEleves ? 'Élevés (CAT ≥ 10 ou mMRC ≥ 2)' : 'Faibles (CAT < 10 et mMRC < 2)',
        'Exacerbations/an': `${exacAn}`,
        'Hospitalisation': hospit ? 'Oui' : 'Non',
        'Groupe GOLD 2017': `Groupe ${groupe}`,
        'Prise en charge': priseEnCharge,
      },
      ranges: [
        { min: 0, max: 1, label: 'Groupe A : Faible impact / Faible risque', severity: 'low', recommendation: 'Bronchodilatateur. Sevrage tabagique.' },
        { min: 2, max: 2, label: 'Groupe B : Impact élevé / Faible risque', severity: 'moderate', recommendation: 'LAMA+LABA. Réhabilitation.' },
        { min: 3, max: 3, label: 'Groupe C : Faible impact / Risque élevé', severity: 'high', recommendation: 'LAMA. Prévention exacerbations.' },
        { min: 4, max: 4, label: 'Groupe D : Impact élevé / Risque élevé', severity: 'critical', recommendation: 'LAMA+LABA+CSI. Réhabilitation. Oxygène.' },
      ],
    }
  },
  interpretation: 'La **classification GOLD 2017** combine l\'évaluation spirométrique (stades 1-4) avec l\'évaluation symptomatique (CAT ≥ 10 ou mMRC ≥ 2) et le risque d\'exacerbations (≥ 2 exacerbations/an ou ≥ 1 hospitalisation pour exacerbation).\n\n**Groupes GOLD 2017 :**\n- **Groupe A** : Faible risque, peu symptomatique\n- **Groupe B** : Faible risque, plus symptomatique\n- **Groupe C** : Risque élevé, peu symptomatique\n- **Groupe D** : Risque élevé, plus symptomatique\n\nLe traitement médicamenteux est guidé par le groupe.',
  clinicalCommentary: 'La classification GOLD 2017 a modifié les groupes ABCD en séparant l\'évaluation symptomatique du risque d\'exacerbations. Contrairement aux versions antérieures, la spirométrie n\'est plus directement utilisée pour déterminer le groupe, mais uniquement pour le diagnostic et la gradation de l\'obstruction. Le GOLD 2023 continue d\'utiliser ce schéma avec des ajustements thérapeutiques (notamment la place des bithérapies LABA+CSI dans le groupe E).',
  references: [
    { type: 'url', title: 'Global Initiative for Chronic Obstructive Lung Disease (GOLD) 2017 Report', url: 'https://goldcopd.org/' },
    { type: 'pubmed', title: 'Vogelmeier CF et al. Global Strategy for the Diagnosis, Management, and Prevention of COPD. GOLD 2017 Report. Am J Respir Crit Care Med 2017', pmid: '28263182' },
  ],
}
export default gold2017
