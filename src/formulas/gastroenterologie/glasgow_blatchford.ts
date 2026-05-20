import type { FormulaDefinition } from '../types'

const glasgowBlatchford: FormulaDefinition = {
  id: 'glasgow-blatchford',
  slug: 'glasgow-blatchford',
  name: 'Glasgow-Blatchford (Score) — Hémorragie digestive haute',
  specialty: 'gastroenterologie',
  category: 'Hémorragie digestive',
  description: 'Score pré-endoscopique du risque d\'intervention (transfusion, endoscopie, chirurgie) en cas d\'hémorragie digestive haute',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'uree',
      type: 'number',
      label: 'Urée sanguine',
      unit: 'mmol/L',
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: 'Ex: 10',
    },
    {
      id: 'hemoglobine',
      type: 'number',
      label: 'Hémoglobine',
      unit: 'g/dL',
      min: 0,
      max: 20,
      step: 0.1,
      placeholder: 'Ex: 12',
    },
    {
      id: 'pas',
      type: 'number',
      label: 'Pression artérielle systolique',
      unit: 'mmHg',
      min: 0,
      max: 300,
      step: 1,
      placeholder: 'Ex: 110',
    },
    {
      id: 'pouls',
      type: 'number',
      label: 'Fréquence cardiaque',
      unit: '/min',
      min: 0,
      max: 250,
      step: 1,
      placeholder: 'Ex: 90',
    },
    {
      id: 'melena',
      type: 'boolean',
      label: 'Méléna',
    },
    {
      id: 'syncope',
      type: 'boolean',
      label: 'Syncope',
    },
    {
      id: 'hepatopathie',
      type: 'boolean',
      label: 'Hépatopathie connue',
    },
    {
      id: 'insuffisance_cardiaque',
      type: 'boolean',
      label: 'Insuffisance cardiaque connue',
    },
  ],
  calculate: (values) => {
    let score = 0
    const uree = Number(values.uree)
    const hb = Number(values.hemoglobine)
    const pas = Number(values.pas)
    const pouls = Number(values.pouls)

    // Urée (mmol/L)
    if (uree >= 6.5 && uree < 8.0) score += 2
    else if (uree >= 8.0 && uree < 10.0) score += 3
    else if (uree >= 10.0 && uree < 25.0) score += 4
    else if (uree >= 25.0) score += 6

    // Hémoglobine (g/dL)
    if (hb && hb >= 10 && hb < 12) score += 1
    else if (hb && hb < 10) score += 3

    // PAS
    if (pas && pas >= 100 && pas < 109) score += 1
    else if (pas && pas >= 90 && pas < 99) score += 2
    else if (pas && pas < 90) score += 3

    // Pouls
    if (pouls && pouls >= 100) score += 1

    if (values.melena) score += 1
    if (values.syncope) score += 2
    if (values.hepatopathie) score += 2
    if (values.insuffisance_cardiaque) score += 2

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (score === 0) {
      severity = 'low'
      label = 'Blatchford 0 — Risque tres faible'
      recommendation = 'Risque très faible d\'intervention. Sortie envisageable sans endoscopie en urgence (VPN > 99 % pour nécessité de transfusion).'
    } else if (score <= 3) {
      severity = 'low'
      label = 'Blatchford 1-3 — Risque faible'
      recommendation = 'Surveillance hospitaliere courte. Endoscopie dans les 24h.'
    } else if (score <= 7) {
      severity = 'moderate'
      label = 'Blatchford 4-7 — Risque modere'
      recommendation = 'Surveillance hospitaliere. Transfusion si Hb < 7-8 g/dL. Endoscopie dans les 12-24h.'
    } else if (score <= 11) {
      severity = 'high'
      label = 'Blatchford 8-11 — Risque eleve'
      recommendation = 'Hospitalisation en soins intensifs. Transfusion. Endoscopie en urgence (< 12h).'
    } else {
      severity = 'critical'
      label = 'Blatchford >= 12 — Risque tres eleve'
      recommendation = 'Prise en charge en reanimation. Transfusion immediate. Endoscopie en urgence. Discuter consultation chirurgicale.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 0, label: '0 — Tres faible risque', severity: 'low', recommendation: 'Sortie envisageable.' },
        { min: 1, max: 3, label: '1-3 — Risque faible', severity: 'low', recommendation: 'Surveillance. Endoscopie dans 24h.' },
        { min: 4, max: 7, label: '4-7 — Risque modere', severity: 'moderate', recommendation: 'Hospitalisation. Transfusion si besoin.' },
        { min: 8, max: 11, label: '8-11 — Risque eleve', severity: 'high', recommendation: 'Soins intensifs. Endoscopie urgente.' },
        { min: 12, max: 23, label: '>= 12 — Risque tres eleve', severity: 'critical', recommendation: 'Reanimation. Transfusion. Endoscopie immediate.' },
      ],
    }
  },
  interpretation: `Le **score de Glasgow-Blatchford** (GBS) est un score pre-endoscopique validé pour predire la necessite d’intervention (transfusion, endoscopie, chirurgie) en cas d'hemorragie digestive haute.\n\n**Score 0** : VPN > 99 % pour absence d'intervention necessaire -> sortie possible du SAU.\n\nIl est superieur au Rockall pour identifier les patients a faible risque pouvant etre pris en charge en ambulatoire.\n\n**Composantes** : uree, hemoglobine, PAS, pouls, melena, syncope, hepatopathie, insuffisance cardiaque.`,
  clinicalCommentary: `Le Blatchford est le meilleur score pour le triage aux urgences. Un score de 0 permet de sortir le patient en toute securite (VPN > 99 %). Le Rockall (qui necessite l’endoscopie) est complementaire pour le pronostic. Attention : le Blatchford a ete valide pour les hemorragies digestives hautes non variceuses. En cas de cirrhose connue, le risque est plus eleve et le score peut sous-estimer la gravite.`,
  references: [
    {
      type: 'pubmed',
      title: 'Blatchford O et al. A risk score to predict need for treatment for upper gastrointestinal haemorrhage. Lancet 2000',
      pmid: '10741383',
    },
    {
      type: 'guideline',
      title: 'Recommandations SFED — Prise en charge de l\'hemorragie digestive haute (2021)',
      url: 'https://www.sfed.org',
    },
  ],
}

export default glasgowBlatchford
