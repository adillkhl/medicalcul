import type { FormulaDefinition } from '../types'

const higham: FormulaDefinition = {
  id: 'higham',
  slug: 'higham',
  name: 'Higham (Score)',
  specialty: 'gynecologie',
  category: 'Ménorragies',
  description: 'Score de Higham pour la quantification objective des pertes sanguines menstruelles (Pictorial Blood Loss Assessment Chart).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'serviettes_peu',
      type: 'number',
      label: 'Serviettes hygiéniques peu souillées (J1-8)',
      min: 0,
      max: 50,
      step: 1,
      placeholder: 'nombre',
    },
    {
      id: 'serviettes_modere',
      type: 'number',
      label: 'Serviettes modérément souillées (J1-8)',
      min: 0,
      max: 50,
      step: 1,
      placeholder: 'nombre',
    },
    {
      id: 'serviettes_tres',
      type: 'number',
      label: 'Serviettes très souillées (J1-8)',
      min: 0,
      max: 50,
      step: 1,
      placeholder: 'nombre',
    },
    {
      id: 'tampons_peu',
      type: 'number',
      label: 'Tampons peu souillés (J1-8)',
      min: 0,
      max: 50,
      step: 1,
      placeholder: 'nombre',
    },
    {
      id: 'tampons_modere',
      type: 'number',
      label: 'Tampons modérément souillés (J1-8)',
      min: 0,
      max: 50,
      step: 1,
      placeholder: 'nombre',
    },
    {
      id: 'tampons_tres',
      type: 'number',
      label: 'Tampons très souillés (J1-8)',
      min: 0,
      max: 50,
      step: 1,
      placeholder: 'nombre',
    },
    {
      id: 'caillots',
      type: 'number',
      label: 'Nombre de caillots (petits et gros)',
      min: 0,
      max: 50,
      step: 1,
      placeholder: '0',
    },
    {
      id: 'accidents',
      type: 'number',
      label: 'Accidents de protection (fuites)',
      min: 0,
      max: 20,
      step: 1,
      placeholder: '0',
    },
  ],
  calculate: (values) => {
    const sp = parseInt(values.serviettes_peu) || 0
    const sm = parseInt(values.serviettes_modere) || 0
    const st = parseInt(values.serviettes_tres) || 0
    const tp = parseInt(values.tampons_peu) || 0
    const tm = parseInt(values.tampons_modere) || 0
    const tt = parseInt(values.tampons_tres) || 0
    const caill = parseInt(values.caillots) || 0
    const acc = parseInt(values.accidents) || 0

    const score = (sp * 1) + (sm * 5) + (st * 20) + (tp * 1) + (tm * 5) + (tt * 20) + (caill * 3) + (acc * 5)

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (score < 50) severity = 'low'
    else if (score < 100) severity = 'moderate'
    else if (score < 200) severity = 'high'
    else severity = 'critical'

    return {
      value: score,
      label: `Score de Higham : ${score}`,
      severity,
      risk: score >= 100 ? 95 : score >= 50 ? 50 : 10,
      riskUnit: 'probabilité ménorragies (> 80 mL/cycle)',
      ranges: [
        { min: 0, max: 49, label: 'Règles normales', severity: 'low', recommendation: 'Aucune anomalie. Rassurer la patiente. Pas de bilan complémentaire nécessaire.' },
        { min: 50, max: 99, label: 'Règles abondantes limites', severity: 'moderate', recommendation: 'Surveillance. Bilan initial : NFS, ferritine. Discuter traitement si retentissement (asthénie, ferritine basse).' },
        { min: 100, max: 199, label: 'Ménorragies confirmées', severity: 'high', recommendation: 'Bilan complet NFS + ferritine ± échographie pelvienne. Traitement : AINS, acide tranexamique, SIU au lévonorgestrel. Rechercher cause organique (fibrome, polype, adénomyose).' },
        { min: 200, max: 999, label: 'Ménorragies sévères', severity: 'critical', recommendation: 'Bilan urgent : NFS, ferritine, échographie, voire IRM. Traitement médical en 1ère intention. Discuter geste chirurgical (endométrectomie, myomectomie, hystérectomie). Fer IV si anémie sévère.' },
      ],
    }
  },
  interpretation: `Le **score de Higham** (PBAC — Pictorial Blood Loss Assessment Chart) est une méthode semi-quantitative validée pour estimer les pertes sanguines menstruelles.

**Coefficients :**
- Protection peu souillée : × 1
- Protection modérément souillée : × 5
- Protection très souillée : × 20
- Caillots : × 3
- Accidents (fuites) : × 5

**Seuil diagnostique :**
- < 50 : règles normales
- 50–99 : limites
- ≥ 100 : ménorragies (correspond à environ > 80 mL/cycle)`,
  clinicalCommentary: `Le score de Higham est un outil simple et validé pour quantifier les ménorragies. Il est plus fiable que l estimation subjective. Un score ≥ 100 a une sensibilité de 90 % pour détecter des ménorragies (> 80 mL/cycle). Attention aux biais : type de protection variable, oubli de comptage. L acide tranexamique et les AINS réduisent le score de 30 à 50 %. Le SIU au lévonorgestrel le réduit de 80 à 90 %.`,
  references: [
    {
      type: 'pubmed',
      title: 'Higham JM et al. Assessment of menstrual blood loss using a pictorial chart. Br J Obstet Gynaecol 1990',
      pmid: '2390501',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prise en charge des ménorragies (Recommandations 2019)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default higham
