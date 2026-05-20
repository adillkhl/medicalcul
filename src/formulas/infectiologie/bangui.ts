import type { FormulaDefinition } from '../types'

const bangui: FormulaDefinition = {
  id: 'bangui',
  slug: 'bangui',
  name: 'Bangui, SIDA (Définition)',
  specialty: 'infectiologie',
  category: 'VIH',
  description: 'Définition de Bangui pour le diagnostic du stade SIDA en contexte de ressources limitées (sans possibilité de sérologie VIH).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'amyg',
      type: 'boolean',
      label: 'Amaigrissement > 10 % du poids corporel',
      weight: 1,
    },
    {
      id: 'diarrhee',
      type: 'boolean',
      label: 'Diarrhée chronique > 1 mois',
      weight: 1,
    },
    {
      id: 'fievre',
      type: 'boolean',
      label: 'Fièvre prolongée > 1 mois',
      weight: 1,
    },
  ],
  calculate: (values) => {
    const amygrissement = values.amyg ? 1 : 0
    const diarrhee = values.diarrhee ? 1 : 0
    const fievre = values.fievre ? 1 : 0
    const total = amygrissement + diarrhee + fievre

    const estSida = total >= 2

    return {
      value: total,
      label: estSida ? 'SIDA probable (≥ 2 critères sur 3)' : 'SIDA peu probable (< 2 critères)',
      severity: estSida ? 'critical' : 'low',
      details: {
        'Amaigrissement > 10 %': amygrissement ? 'Oui' : 'Non',
        'Diarrhée chronique > 1 mois': diarrhee ? 'Oui' : 'Non',
        'Fièvre prolongée > 1 mois': fievre ? 'Oui' : 'Non',
        'Total': `${total}/3`,
      },
      ranges: [
        { min: 0, max: 1, label: 'SIDA peu probable', severity: 'low', recommendation: 'Si possible, réaliser une sérologie VIH. Rechercher une autre cause (tuberculose, parasitose, cancer).' },
        { min: 2, max: 3, label: 'SIDA probable (≥ 2 critères)', severity: 'critical', recommendation: 'Probable stade SIDA. Traiter les infections opportunistes. Adresser vers centre de traitement VIH si possible. Démarrer ARV selon les protocoles locaux. Sensibilité 75 %, spécificité 90 % pour diagnostic SIDA.' },
      ],
    }
  },
  interpretation: `La **définition de Bangui** (1986) est une définition clinique du stade SIDA pour les pays à ressources limitées, sans possibilité de confirmation sérologique.

**Critères majeurs (3) :**
1. Amaigrissement > 10 % du poids corporel
2. Diarrhée chronique > 1 mois
3. Fièvre prolongée > 1 mois

**Diagnostic SIDA si ≥ 2 critères majeurs présents.**

La sensibilité est de 75 % et la spécificité de 90 % par rapport à la sérologie VIH.`,
  clinicalCommentary: `La définition de Bangui date du début de l épidémie de VIH. Elle reste utilisée en contexte humanitaire et dans les zones où le test VIH n est pas accessible. Dans la pratique actuelle, le test rapide VIH est disponible à faible coût et doit être privilégié. Les critères de Bangui manquent de spécificité dans les zones à forte prévalence de tuberculose. La classification OMS du VIH (stades cliniques 1-4) est aujourd hui plus pertinente.`,
  references: [
    {
      type: 'pubmed',
      title: 'WHO. Provisional WHO clinical case definition for AIDS. Wkly Epidemiol Rec 1986',
      pmid: '3088354',
    },
    {
      type: 'guideline',
      title: 'OMS — Classification clinique du VIH/SIDA (Révision 2006)',
      url: 'https://www.who.int/hiv/pub/guidelines',
    },
  ],
}
export default bangui
