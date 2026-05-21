import type { FormulaDefinition } from '../types'

const goldbpco: FormulaDefinition = {
  id: 'goldbpco', slug: 'goldbpco',
  name: 'GOLD Spirométrique — Stades 1 à 4 de la BPCO',
  specialty: 'pneumologie', category: 'BPCO',
  description: 'Classification spirométrique GOLD de la sévérité de l\'obstruction bronchique dans la BPCO — basée sur le VEMS post-bronchodilatateur (% de la valeur prédite)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'vems_postbd', type: 'number', label: 'VEMS post-bronchodilatateur', unit: '% de la valeur prédite', min: 10, max: 130, step: 1, placeholder: 'Ex: 55' },
    { id: 'vems_cvf', type: 'number', label: 'Rapport VEMS/CVF post-bronchodilatateur', unit: '%', min: 20, max: 100, step: 1, placeholder: 'Ex: 62' },
  ],
  calculate: (values) => {
    const vems = Number(values.vems_postbd) || 60
    const rapport = Number(values.vems_cvf) || 65

    const obstruction = rapport < 70

    let stade: number
    let stadeLabel: string
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let description = ''
    let fct = ''

    if (!obstruction) {
      stade = 0
      stadeLabel = 'Pas d\'obstruction (VEMS/CVF ≥ 70%)'
      severity = 'low'
      description = 'Absence de trouble ventilatoire obstructif'
      fct = 'Explorez un autre diagnostic. Pas de BPCO selon les critères spirométriques.'
    } else if (vems >= 80) {
      stade = 1
      stadeLabel = 'GOLD 1 — Léger'
      severity = 'low'
      description = 'Obstruction légère (VEMS ≥ 80% prédit)'
      fct = 'Sevrage tabagique. Vaccination. Traitement symptomatique selon besoin.'
    } else if (vems >= 50) {
      stade = 2
      stadeLabel = 'GOLD 2 — Modéré'
      severity = 'moderate'
      description = 'Obstruction modérée (VEMS 50-79% prédit)'
      fct = 'Bronchodilatateurs réguliers (LAMA/LABA). Réhabilitation respiratoire.'
    } else if (vems >= 30) {
      stade = 3
      stadeLabel = 'GOLD 3 — Sévère'
      severity = 'high'
      description = 'Obstruction sévère (VEMS 30-49% prédit)'
      fct = 'Traitement combiné LAMA+LABA+CSI. Réhabilitation. Oxygène si hypoxémie.'
    } else {
      stade = 4
      stadeLabel = 'GOLD 4 — Très sévère'
      severity = 'critical'
      description = 'Obstruction très sévère (VEMS < 30% prédit)'
      fct = 'Traitement maximal. Oxygène longue durée. Évaluation pour chirurgie de réduction ou transplantation.'
    }

    return {
      value: Math.round(vems * 10) / 10,
      label: `${stadeLabel} — VEMS ${vems}%, rapport VEMS/CVF ${rapport}%`,
      severity,
      details: {
        'VEMS post-BD': `${vems}%`,
        'VEMS/CVF': `${rapport}%`,
        'Rapport < 70%': obstruction ? 'Oui (obstruction confirmée)' : 'Non',
        'Stade GOLD': stadeLabel,
        'Description': description,
        'Prise en charge': fct,
      },
      ranges: [
        { min: 80, max: 130, label: 'GOLD 1 : Léger (VEMS ≥ 80%)', severity: 'low', recommendation: 'Sevrage tabagique. Vaccins.' },
        { min: 50, max: 79, label: 'GOLD 2 : Modéré (VEMS 50-79%)', severity: 'moderate', recommendation: 'Bronchodilatateurs réguliers.' },
        { min: 30, max: 49, label: 'GOLD 3 : Sévère (VEMS 30-49%)', severity: 'high', recommendation: 'Traitement combiné. Réhabilitation.' },
        { min: 10, max: 29, label: 'GOLD 4 : Très sévère (VEMS < 30%)', severity: 'critical', recommendation: 'Oxygène. Chirurgie de réduction.' },
      ],
    }
  },
  interpretation: 'La **classification GOLD spirométrique** (stades 1-4) évalue la sévérité de l\'obstruction bronchique dans la BPCO sur la base du VEMS post-bronchodilatateur (% de la valeur prédite), après confirmation d\'un trouble ventilatoire obstructif (rapport VEMS/CVF post-BD < 70%).\n\n**Stades :**\n- **GOLD 1** : Léger — VEMS ≥ 80%\n- **GOLD 2** : Modéré — VEMS 50-79%\n- **GOLD 3** : Sévère — VEMS 30-49%\n- **GOLD 4** : Très sévère — VEMS < 30%\n\nLa spirométrie est indispensable au diagnostic et à la gradation de la BPCO.',
  clinicalCommentary: 'Le diagnostic de BPCO repose sur un rapport VEMS/CVF post-BD < 70%. La classification GOLD spirométrique (1-4) est utilisée conjointement avec l\'évaluation clinique (CAT/mMRC) et le risque d\'exacerbations (groupes A, B, C, D du GOLD 2017/2023). La progression du stade spirométrique est corrélée à l\'augmentation de la mortalité et des exacerbations.',
  references: [
    { type: 'url', title: 'Global Initiative for Chronic Obstructive Lung Disease (GOLD) Report 2023', url: 'https://goldcopd.org/' },
    { type: 'pubmed', title: 'Pauwels RA et al. Global strategy for the diagnosis, management, and prevention of COPD. NHLBI/WHO GOLD workshop summary. Am J Respir Crit Care Med 2001', pmid: '11323418' },
  ],
}
export default goldbpco
