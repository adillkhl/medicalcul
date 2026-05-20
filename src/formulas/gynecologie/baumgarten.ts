import type { FormulaDefinition } from '../types'

const baumgarten: FormulaDefinition = {
  id: 'baumgarten',
  slug: 'baumgarten',
  name: 'Baumgarten & Grüber, Tocolyse (Index)',
  specialty: 'gynecologie',
  category: 'Menace d accouchement prématuré',
  description: 'Index de Baumgarten et Grüber pour évaluer la sévérité d une menace d accouchement prématuré (MAP).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'contractions',
      type: 'radio',
      label: 'Contractions utérines',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 1, label: 'Irrégulières ou < 5/30 min' },
        { value: 2, label: 'Régulières ≥ 5/30 min' },
        { value: 3, label: 'Régulières ≥ 10/30 min' },
      ],
    },
    {
      id: 'modif_col',
      type: 'radio',
      label: 'Modifications du col utérin',
      options: [
        { value: 0, label: 'Col fermé, long, postérieur' },
        { value: 1, label: 'Col ≤ 1 cm, mi-long, médian' },
        { value: 2, label: 'Col ouvert ≥ 1 cm, court, centré' },
        { value: 3, label: 'Col ouvert ≥ 3 cm, effacé, dilaté' },
      ],
    },
    {
      id: 'saignement',
      type: 'boolean',
      label: 'Saignement génital',
      weight: 1,
    },
    {
      id: 'poche_eaux',
      type: 'boolean',
      label: 'Rupture prématurée des membranes',
      weight: 2,
    },
  ],
  calculate: (values) => {
    const c = parseInt(values.contractions) || 0
    const col = parseInt(values.modif_col) || 0
    const sang = values.saignement ? 1 : 0
    const rpm = values.poche_eaux ? 2 : 0
    const total = c + col + sang + rpm

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let label: string
    if (total <= 1) { severity = 'low'; label = 'MAP peu probable' }
    else if (total <= 3) { severity = 'moderate'; label = 'MAP possible — Surveillance' }
    else if (total <= 5) { severity = 'high'; label = 'MAP probable — Traitement' }
    else { severity = 'critical'; label = 'MAP certaine — Urgence' }

    return {
      value: total,
      label: `Index de Baumgarten : ${total} — ${label}`,
      severity,
      ranges: [
        { min: 0, max: 1, label: 'MAP peu probable', severity: 'low', recommendation: 'Surveillance simple. Réévaluer si persistance des symptômes.' },
        { min: 2, max: 3, label: 'MAP possible', severity: 'moderate', recommendation: 'Surveillance hospitalière. Échographie du col. Test aux contractions. Repos. Réévaluer dans 24-48h.' },
        { min: 4, max: 5, label: 'MAP probable', severity: 'high', recommendation: 'Hospitalisation. Tocolyse (atosiban, nifédipine). Corticothérapie anténatale (bétaméthasone). Transfert en maternité de niveau adapté.' },
        { min: 6, max: 10, label: 'MAP certaine', severity: 'critical', recommendation: 'Hospitalisation en urgence. Tocolyse IV. Corticothérapie immédiate. Transfert en maternité de type III si < 32 SA. Neuroprotection par sulfate de magnésium si < 32 SA.' },
      ],
    }
  },
  interpretation: `L **index de Baumgarten et Grüber** est un outil clinique simple pour évaluer la sévérité d une MAP (menace d accouchement prématuré) entre 22 et 36 SA + 6 jours.

**Critères :**
- **Contractions utérines** (0–3 points)
- **Modifications du col** (0–3 points)
- **Saignement génital** (0–1 point)
- **Rupture des membranes** (0–2 points)

**Seuils :**
- 0–1 : MAP peu probable
- 2–3 : MAP possible
- 4–5 : MAP probable
- 6+ : MAP certaine

Ce guide clinique aide à la décision d hospitalisation et de tocolyse.`,
  clinicalCommentary: `L index de Baumgarten est utilisé en salle de naissance pour standardiser l évaluation clinique. Il ne remplace pas l échographie du col (mesure de la longueur cervicale) ni le test aux contractions. La corticothérapie anténatale (bétaméthasone 12 mg x 2 à 24h d intervalle) est recommandée entre 24 et 34 SA. La tocolyse est indiquée pour permettre la corticothérapie et le transfert in utero.`,
  references: [
    {
      type: 'pubmed',
      title: 'Baumgarten K, Grüber W. The clinical value of the tocolysis index. Z Geburtshilfe Perinatol 1989',
      pmid: '2815961',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prévention de la prématurité (Recommandations 2020)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default baumgarten
