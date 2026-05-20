import type { FormulaDefinition } from '../types'

const gerdq: FormulaDefinition = {
  id: 'gerd-q',
  slug: 'gerdq',
  name: 'GerdQ — Reflux gastro-œsophagien',
  specialty: 'gastroenterologie',
  category: 'Œsophage',
  description: 'Questionnaire diagnostique du reflux gastro-œsophagien (RGO)',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'brulure',
      type: 'radio',
      label: 'Fréquence des brûlures rétrosternales (pyrosis)',
      options: [
        { value: 0, label: '0 jour / semaine' },
        { value: 1, label: '1 jour / semaine' },
        { value: 2, label: '2-3 jours / semaine' },
        { value: 3, label: '4-7 jours / semaine' },
      ],
    },
    {
      id: 'regurgitation',
      type: 'radio',
      label: 'Fréquence des régurgitations',
      options: [
        { value: 0, label: '0 jour / semaine' },
        { value: 1, label: '1 jour / semaine' },
        { value: 2, label: '2-3 jours / semaine' },
        { value: 3, label: '4-7 jours / semaine' },
      ],
    },
    {
      id: 'douleur_epigastre',
      type: 'radio',
      label: 'Fréquence des douleurs épigastriques',
      options: [
        { value: 3, label: '0 jour / semaine' },
        { value: 2, label: '1 jour / semaine' },
        { value: 1, label: '2-3 jours / semaine' },
        { value: 0, label: '4-7 jours / semaine' },
      ],
    },
    {
      id: 'nausees',
      type: 'radio',
      label: 'Fréquence des nausées',
      options: [
        { value: 3, label: '0 jour / semaine' },
        { value: 2, label: '1 jour / semaine' },
        { value: 1, label: '2-3 jours / semaine' },
        { value: 0, label: '4-7 jours / semaine' },
      ],
    },
    {
      id: 'troubles_sommeil',
      type: 'radio',
      label: 'Fréquence des troubles du sommeil liés aux symptômes de RGO',
      options: [
        { value: 0, label: '0 jour / semaine' },
        { value: 1, label: '1 jour / semaine' },
        { value: 2, label: '2-3 jours / semaine' },
        { value: 3, label: '4-7 jours / semaine' },
      ],
    },
    {
      id: 'ec_supplement',
      type: 'radio',
      label: 'Prise de médicaments supplémentaires pour les symptômes de RGO (hors prescription habituelle)',
      options: [
        { value: 0, label: '0 jour / semaine' },
        { value: 1, label: '1 jour / semaine' },
        { value: 2, label: '2-3 jours / semaine' },
        { value: 3, label: '4-7 jours / semaine' },
      ],
    },
  ],
  calculate: (values) => {
    const brulure = Number(values.brulure) || 0
    const regurgitation = Number(values.regurgitation) || 0
    const douleur = Number(values.douleur_epigastre) || 3
    const nausees = Number(values.nausees) || 3
    const sommeil = Number(values.troubles_sommeil) || 0
    const ec = Number(values.ec_supplement) || 0

    const score = brulure + regurgitation + douleur + nausees + sommeil + ec

    let severity: 'low' | 'moderate' | 'high' = 'low'
    let label = ''
    let recommendation = ''

    if (score < 8) {
      severity = 'low'
      label = 'GerdQ < 8 — RGO peu probable'
      recommendation = 'Probabilite faible de RGO. Envisager autres diagnostics (dyspepsie fonctionnelle, gastrite, ulcere, pancreatite).'
    } else if (score <= 10) {
      severity = 'moderate'
      label = 'GerdQ 8-10 — Diagnostic probable de RGO'
      recommendation = 'Probabilite intermediaire de RGO. Essai therapeutique d\'IPP pendant 4 semaines. Si reponse, confirme le diagnostic. Si non, envisager PH-metrie oesophagienne et endoscopie.'
    } else {
      severity = 'high'
      label = 'GerdQ > 10 — RGO tres probable'
      recommendation = 'Forte probabilite de RGO. Traitement IPP pendant 8 semaines. Endoscopie oeso-gastro-duodenale recommandee. Si symptomes persistants, PH-metrie oesophagienne.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 7, label: '< 8 — RGO peu probable', severity: 'low', recommendation: 'Envisager autres diagnostics.' },
        { min: 8, max: 10, label: '8-10 — RGO probable', severity: 'moderate', recommendation: 'Essai IPP 4 semaines.' },
        { min: 11, max: 18, label: '> 10 — RGO tres probable', severity: 'high', recommendation: 'IPP 8 semaines. Endoscopie.' },
      ],
    }
  },
  interpretation: `Le **GerdQ** est un questionnaire auto-administre de 6 items validé pour le diagnostic du reflux gastro-oesophagien (RGO) et l’evaluation de la reponse au traitement.\n\n**Items** : brulures retrosternales, regurgitations, douleurs epigastriques, nausees, troubles du sommeil, et prise de medicaments supplementaires.\n\nLes items 1-2-5-6 sont codes positivement (frequence elevee = RGO probable). Les items 3-4 sont codes inversement (frequence elevee = autre diagnostic).\n\n**Seuils** :\n- < 8 : RGO peu probable\n- 8-10 : RGO probable (sensibilite 65 %, specificite 71 %)\n- > 10 : RGO tres probable (sensibilite 80 %, specificite 86 %)`,
  clinicalCommentary: `Le GerdQ est utile en medecine generale pour eviter les endoscopies inutiles. Un score >= 8 avec reponse aux IPP confirme le diagnostic. Ne remplace pas l'endoscopie en cas de signes d’alarme (dysphagie, anemie, perte de poids, hemmorragie, age > 50 ans). L'echelle de Likert en 4 points par item (0, 1, 2, 3) permet un score total de 0 a 18.`,
  references: [
    {
      type: 'pubmed',
      title: 'Dent J et al. The GerdQ questionnaire: a new diagnostic tool for GERD. Aliment Pharmacol Ther 2007',
      pmid: '17931314',
    },
  ],
}

export default gerdq
