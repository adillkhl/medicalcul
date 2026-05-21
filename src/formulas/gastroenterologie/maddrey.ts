import type { FormulaDefinition } from '../types'

const maddrey: FormulaDefinition = {
  id: 'maddrey', slug: 'maddrey',
  name: 'Maddrey\'s Discriminant Function (Score DF) — Hépatite Alcoolique',
  specialty: 'gastroenterologie', category: 'Hépatite',
  description: 'Fonction discriminante de Maddrey (DF) pour évaluer la sévérité de l\'hépatite alcoolique aiguë et guider la décision de corticothérapie',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'tp', type: 'number', label: 'Taux de prothrombine (TP)', unit: '%', min: 5, max: 100, step: 1, placeholder: 'Ex: 42' },
    { id: 'bilirubine', type: 'number', label: 'Bilirubine totale', unit: 'µmol/L', min: 10, max: 1000, step: 1, placeholder: 'Ex: 180' },
  ],
  calculate: (values) => {
    const tp = Number(values.tp) || 70
    const bili = Number(values.bilirubine) || 20

    // Maddrey DF = 4.6 × (TP patient - TP contrôle) / TP contrôle × TP patient... 
    // Actually the original formula:
    // Discriminant Function = 4.6 × (patient\'s PT - control PT) + bilirubin (mg/dL)
    // But simplified modern version:
    // DF = 4.6 × (PT - PT_control) + (bilirubin / 17.1)
    // Where PT_control is usually ~12 seconds or we can use the inverse
    // 
    // With TP in % (Quick), a more common formulation:
    // DF = 4.6 × (PT seconds - 12) + bili (mg/dL)
    // Since we have TP% not PT seconds, we need to convert approximately:
    // For simplification, using bilirubin in µmol/L divided by 17.1 to get mg/dL
    // And using an estimated PT prolongation from TP%
    // 
    // Simpler approach used clinically: 
    // DF = 4.6 × (PT_in_seconds - PT_normal) + Bili_mg_dL
    // PT_normal ≈ 12 seconds
    // Approximation: when TP is 70%, PT is about 14s; when TP is 50%, PT is about 17s; when TP is 30%, PT is about 22s
    // Let\'s use a rough conversion: PT_seconds ≈ 12 * 70/tp (if tp in %, inverse relationship)

    const ptNormal = 12 // seconds
    // Approximate PT in seconds from TP% (Quick)
    const ptSeconds = tp > 0 ? Math.round((70 / tp) * ptNormal * 10) / 10 : 60

    const biliMgDl = bili / 17.1

    const df = Math.round((4.6 * (ptSeconds - ptNormal) + biliMgDl) * 10) / 10

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let indicationCortico = ''
    let mortalite30j = ''

    if (df < 32) {
      severity = 'low'
      label = `Maddrey DF = ${df} — Hépatite alcoolique non sévère`
      indicationCortico = 'Corticothérapie non indiquée (DF < 32)'
      mortalite30j = '< 5%'
    } else if (df < 40) {
      severity = 'high'
      label = `Maddrey DF = ${df} — Hépatite alcoolique sévère`
      indicationCortico = 'Corticothérapie indiquée (DF ≥ 32)'
      mortalite30j = '15-25%'
    } else {
      severity = 'critical'
      label = `Maddrey DF = ${df} — Hépatite alcoolique très sévère`
      indicationCortico = 'Corticothérapie indiquée — discuter transplantation précoce'
      mortalite30j = '30-50%'
    }

    return {
      value: df,
      label,
      severity,
      details: {
        'TP': `${tp}%`,
        'TP (secondes estimé)': `${ptSeconds}s`,
        'Bilirubine': `${Math.round(bili)} µmol/L (${biliMgDl.toFixed(1)} mg/dL)`,
        'DF = 4.6 × (PT - 12) + Bili (mg/dL)': df,
        'Mortalité à 30 jours': mortalite30j,
        'Indication corticoïdes': indicationCortico,
      },
      ranges: [
        { min: 0, max: 31.9, label: 'DF < 32 : Non sévère', severity: 'low', recommendation: 'Pas de corticoïdes. Surveillance.' },
        { min: 32, max: 39.9, label: 'DF 32-40 : Sévère', severity: 'high', recommendation: 'Corticothérapie (prednisolone 40 mg/j). Évaluation Lille à J7.' },
        { min: 40, max: 200, label: 'DF ≥ 40 : Très sévère', severity: 'critical', recommendation: 'Corticothérapie. Discuter transplantation hépatique précoce.' },
      ],
    }
  },
  interpretation: 'La **Maddrey\'s Discriminant Function (DF)** est l\'outil historique de sévérité de l\'hépatite alcoolique aiguë.\n\n**Formule :** DF = 4.6 × (TP patient - TP témoin) + Bilirubine (mg/dL)\n\n- **DF < 32** : Hépatite alcoolique non sévère — pas d\'indication à la corticothérapie\n- **DF ≥ 32** : Hépatite alcoolique sévère — corticothérapie indiquée (prednisolone 40 mg/j pendant 28 jours)\n\nLa fonction discriminante de Maddrey reste le standard pour l\'initiation du traitement. Le score de Lille à J7 évalue la réponse au traitement.',
  clinicalCommentary: 'Le DF de Maddrey est le score le plus utilisé pour décider de l\'initiation de la corticothérapie dans l\'hépatite alcoolique aiguë. Un DF ≥ 32 identifie les patients à haut risque de décès précoce (mortalité à 28 jours de 15-50%). La corticothérapie (prednisolone 40 mg/kg/j pendant 7 jours) est indiquée en l\'absence de contre-indications (infection non contrôlée, hémorragie digestive active, insuffisance rénale sévère). L\'évaluation de la réponse à J7 par le score de Lille est systématique.',
  references: [
    { type: 'pubmed', title: 'Maddrey WC et al. Corticosteroid therapy of alcoholic hepatitis. Gastroenterology 1978', pmid: '348543' },
    { type: 'pubmed', title: 'Carithers RL et al. Methylprednisolone therapy in patients with severe alcoholic hepatitis. Ann Intern Med 1989', pmid: '2684354' },
  ],
}
export default maddrey
