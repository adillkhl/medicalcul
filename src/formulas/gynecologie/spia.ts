import type { FormulaDefinition } from '../types'

const spia: FormulaDefinition = {
  id: 'spia',
  slug: 'spia',
  name: 'SPIA (Score)',
  specialty: 'gynecologie',
  category: 'Menace d accouchement prématuré',
  description: 'Score SPIA pour évaluer le risque d accouchement prématuré à partir de 33 semaines d aménorrhée.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'contraction',
      type: 'radio',
      label: 'Contractions utérines régulières douloureuses',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 2, label: 'Présentes' },
      ],
    },
    {
      id: 'col_tv',
      type: 'radio',
      label: 'Modifications cervicales au toucher vaginal',
      options: [
        { value: 0, label: 'Col fermé, long, postérieur' },
        { value: 1, label: 'Col perméable au doigt, mi-long' },
        { value: 3, label: 'Col ouvert ≥ 2 cm, court ou effacé' },
      ],
    },
    {
      id: 'col_echo',
      type: 'radio',
      label: 'Longueur cervicale échographique',
      options: [
        { value: 0, label: '> 25 mm' },
        { value: 2, label: '≤ 25 mm' },
      ],
    },
    {
      id: 'fibronectine',
      type: 'radio',
      label: 'Fibronectine fœtale (si disponible)',
      options: [
        { value: 0, label: 'Négative (> 50 ng/mL) / Non réalisée' },
        { value: 3, label: 'Positive (< 50 ng/mL)' },
      ],
    },
  ],
  calculate: (values) => {
    const c = parseInt(values.contraction) || 0
    const tv = parseInt(values.col_tv) || 0
    const echo = parseInt(values.col_echo) || 0
    const fibro = parseInt(values.fibronectine) || 0
    const total = c + tv + echo + fibro

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (total <= 2) severity = 'low'
    else if (total <= 4) severity = 'moderate'
    else severity = 'critical'

    return {
      value: total,
      label: `Score SPIA : ${total}/10`,
      severity,
      details: {
        'Contractions': c === 2 ? 'Oui' : 'Non',
        'TV': ['Normal', 'Perméable', 'Ouvert ≥ 2 cm'][tv] || '',
        'Longueur col': echo === 2 ? '≤ 25 mm' : '> 25 mm',
        'Fibronectine': fibro === 3 ? 'Positive' : 'Négative / Non faite',
      },
      ranges: [
        { min: 0, max: 2, label: 'Risque faible', severity: 'low', recommendation: 'Rassurer. Pas de tocolyse ni d hospitalisation. Surveillance standard.' },
        { min: 3, max: 4, label: 'Risque modéré', severity: 'moderate', recommendation: 'Surveillance rapprochée ± hospitalisation de jour. Corticothérapie anténatale si < 34 SA. Tocolyse si besoin. Transfert en maternité adaptée si nécessaire.' },
        { min: 5, max: 10, label: 'Risque élevé', severity: 'critical', recommendation: 'Hospitalisation. Tocolyse (atosiban, nifédipine). Corticothérapie anténatale immédiate (bétaméthasone 12 mg x2). Neuroprotection par sulfate de magnésium si < 32 SA. Transfert in utero vers maternité de niveau adapté.' },
      ],
    }
  },
  interpretation: `Le **score SPIA** (Score Prédictif d Issue pour l Accouchement) évalue le risque d accouchement prématuré chez les patientes symptomatiques à partir de 33 SA.

**Critères (poids 0–3) :**
1. **Contractions utérines** régulières douloureuses (0 ou 2)
2. **Modifications cervicales au TV** (0, 1 ou 3)
3. **Longueur cervicale échographique** ≤ 25 mm (0 ou 2)
4. **Fibronectine fœtale** positive (0 ou 3)

**Interprétation :**
- ≤ 2 : faible risque
- 3-4 : risque modéré
- ≥ 5 : risque élevé

Le score permet de décider de l hospitalisation et du traitement.`,
  clinicalCommentary: `Le SPIA est plus spécifique que le seul examen clinique pour décider d une hospitalisation. La fibronectine fœtale (si disponible) améliore la spécificité : un test négatif a une VPN > 95 % pour l accouchement dans les 7 jours. Entre 33 et 36 SA, la tocolyse est discutée au cas par cas. La corticothérapie anténatale est recommandée jusqu à 34 SA + 6 jours. Au-delà de 36 SA, la MAP est souvent respectée et la prise en charge est expectative.`,
  references: [
    {
      type: 'pubmed',
      title: 'Honest H et al. Accuracy of cervical length and fetal fibronectin for prediction of preterm birth. BMJ 2002',
      pmid: '12064328',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prise en charge de la menace d accouchement prématuré (Recommandations 2020)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default spia
