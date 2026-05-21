import type { FormulaDefinition } from '../types'

const hlh2004: FormulaDefinition = {
  id: 'hlh2004', slug: 'hlh2004',
  name: 'HLH-2004 — Critères de Lymphohistiocytose Hémophagocytaire',
  specialty: 'hematologie', category: 'Hémophagocytose',
  description: 'Critères diagnostiques HLH-2004 de la lymphohistiocytose hémophagocytaire (LHH) — syndrome d\'activation macrophagique',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'fievre', type: 'boolean', label: 'Fièvre > 38.5°C persistante > 7 jours' },
    { id: 'splenomegalie', type: 'boolean', label: 'Splénomégalie (débord splénique > 3 cm)' },
    { id: 'cytopenie_2lignees', type: 'boolean', label: 'Cytopénies (≥ 2 lignées) : Hb < 9 g/dL, Plaq < 100 G/L, PNN < 1 G/L' },
    { id: 'hypertriglyceridemie', type: 'boolean', label: 'Hypertriglycéridémie (jeûne ≥ 3 mmol/L) et/ou hypofibrinogénémie ≤ 1.5 g/L' },
    { id: 'hemophagocytose', type: 'boolean', label: 'Hémophagocytose sur biopsie médullaire, rate ou ganglion' },
    { id: 'ferritine', type: 'boolean', label: 'Ferritine ≥ 500 µg/L' },
    { id: 'cd25', type: 'boolean', label: 'CD25 soluble (récepteur IL-2) ≥ 2400 U/mL' },
    { id: 'nk_activite', type: 'boolean', label: 'Activité NK faible ou absente' },
  ],
  calculate: (values) => {
    const criteres = [
      !!values.fievre,
      !!values.splenomegalie,
      !!values.cytopenie_2lignees,
      !!values.hypertriglyceridemie,
      !!values.hemophagocytose,
      !!values.ferritine,
      !!values.cd25,
      !!values.nk_activite,
    ]

    const total = criteres.filter(Boolean).length
    const diagnostic = total >= 5

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''

    if (diagnostic) {
      severity = total >= 7 ? 'critical' : 'high'
      label = `HLH-2004 : ${total}/8 critères — Diagnostic de LHH posé`
    } else if (total >= 3) {
      severity = 'moderate'
      label = `HLH-2004 : ${total}/8 critères — Suspect (surveillance rapprochée)`
    } else {
      severity = 'low'
      label = `HLH-2004 : ${total}/8 critères — Probabilité faible`
    }

    return {
      value: total,
      label,
      severity,
      details: {
        'Fièvre': criteres[0] ? 'Oui' : 'Non',
        'Splénomégalie': criteres[1] ? 'Oui' : 'Non',
        'Cytopénies ≥ 2 lignées': criteres[2] ? 'Oui' : 'Non',
        'HyperTG/Hypofibrinogène': criteres[3] ? 'Oui' : 'Non',
        'Hémophagocytose': criteres[4] ? 'Oui' : 'Non',
        'Ferritine ≥ 500': criteres[5] ? 'Oui' : 'Non',
        'CD25 soluble ≥ 2400': criteres[6] ? 'Oui' : 'Non',
        'Activité NK basse': criteres[7] ? 'Oui' : 'Non',
        'Total': `${total}/8`,
        'Diagnostic': diagnostic ? 'LHH confirmée (≥ 5/8 critères)' : 'LHH non confirmée (< 5/8)',
      },
      ranges: [
        { min: 0, max: 2, label: '0-2/8 : LHH peu probable', severity: 'low' },
        { min: 3, max: 4, label: '3-4/8 : Suspect (surveiller)', severity: 'moderate' },
        { min: 5, max: 6, label: '5-6/8 : LHH diagnostiquée', severity: 'high' },
        { min: 7, max: 8, label: '7-8/8 : LHH sévère', severity: 'critical' },
      ],
    }
  },
  interpretation: 'Le diagnostic de **lymphohistiocytose hémophagocytaire (LHH)** selon les critères HLH-2004 nécessite ≥ 5 critères sur 8 :\n\n1. **Fièvre** > 38.5°C persistante > 7 jours\n2. **Splénomégalie** (débord > 3 cm)\n3. **Cytopénies** ≥ 2 lignées (Hb < 9 g/dL, Plaq < 100 G/L, PNN < 1 G/L)\n4. **Hypertriglycéridémie** ≥ 3 mmol/L **et/ou** hypofibrinogénémie ≤ 1.5 g/L\n5. **Hémophagocytose** sur biopsie (moelle, rate, ganglion)\n6. **Ferritine** ≥ 500 µg/L\n7. **CD25 soluble** ≥ 2400 U/mL\n8. **Activité NK** faible ou absente\n\nLe HLH-2004 protocol (Henter et al. 2007) recommande l\'initiation du traitement si ≥ 5/8 critères sont présents.',
  clinicalCommentary: 'La LHH est une urgence diagnostique et thérapeutique du fait de sa mortalité élevée (50-70% sans traitement). Le dosage de la ferritine est un excellent marqueur de dépistage (sensibilité élevée à des seuils > 10 000 µg/L, spécificité à des seuils > 500 µg/L). Les étiologies sont dominées par les infections (EBV surtout), les hémopathies (lymphomes T/NK), et les maladies auto-immunes. Le traitement repose sur la corticothérapie, l\'étoposide, et la ciclosporine selon le protocole HLH-2004.',
  references: [
    { type: 'pubmed', title: 'Henter JI et al. HLH-2004: Diagnostic and therapeutic guidelines for HLH. Pediatr Blood Cancer 2007', pmid: '16937360' },
    { type: 'pubmed', title: 'Jordan MB et al. How I approach HLH. Blood 2011', pmid: '21536746' },
  ],
}
export default hlh2004
