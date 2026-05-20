import type { FormulaDefinition } from '../types'

const qsofa: FormulaDefinition = {
  id: 'qsofa',
  slug: 'qsofa',
  name: 'qSOFA (quick SOFA)',
  specialty: 'urgence',
  category: 'Réanimation',
  description: 'Dépistage rapide des patients à risque de sepsis et de mortalité intra-hospitalière (Sepsis-3)',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'glasgow',
      type: 'radio',
      label: 'Échelle de Glasgow',
      options: [
        { value: 0, label: 'Glasgow 15' },
        { value: 1, label: 'Glasgow ≤ 14' },
      ],
    },
    {
      id: 'pression',
      type: 'radio',
      label: 'Pression artérielle systolique',
      options: [
        { value: 0, label: 'PAS ≥ 100 mmHg' },
        { value: 1, label: 'PAS ≤ 100 mmHg' },
      ],
    },
    {
      id: 'respi',
      type: 'radio',
      label: 'Fréquence respiratoire',
      options: [
        { value: 0, label: 'FR &lt; 22/min' },
        { value: 1, label: 'FR ≥ 22/min' },
      ],
    },
  ],
  calculate: (values) => {
    const score = (values.glasgow ?? 0) + (values.pression ?? 0) + (values.respi ?? 0)

    return {
      value: score,
      severity: score >= 2 ? 'high' : 'low',
      ranges: [
        {
          min: 0, max: 1, label: 'Risque faible',
          severity: 'low',
          recommendation: 'Probabilité faible de sepsis avec dysfonction d\'organe. Continuer la surveillance. Le qSOFA n\'est pas un test diagnostique du sepsis.',
        },
        {
          min: 2, max: 3, label: 'Risque élevé',
          severity: 'high',
          recommendation: 'Patient suspect de sepsis avec dysfonction d\'organe. Évaluer rapidement l\'indication d\'admission en soins intensifs. Débuter le bilan étiologique et l\'antibiothérapie si sepsis confirmé.',
        },
      ],
    }
  },
  interpretation: `Le qSOFA fait partie de la définition Sepsis-3 (2016). Il permet d'identifier les patients suspects d'infection qui risquent d'évoluer vers un sepsis avec dysfonction d'organe.

• **qSOFA ≥ 2** : forte probabilité de sepsis avec dysfonction d'organe → mortalité intra-hospitalière ≈ 10 %
• **qSOFA &lt; 2** : probabilité plus faible (mais ne l'exclut pas)

Le qSOFA n'est pas un outil diagnostique du sepsis. Il ne remplace pas le SIRS. Son avantage : rapide, clinique (pas de bilan).`,
  clinicalCommentary: `Depuis Sepsis-3, le qSOFA remplace le SIRS pour prédire le pronostic, mais le SIRS reste utile pour le dépistage précoce (sensibilité meilleure). Aux urgences, on fait souvent les deux. Un qSOFA négatif n'exclut pas un sepsis — si forte suspicion clinique, poursuivre le bilan. Ne pas utiliser pour décider de l'antibiothérapie.`,
  references: [
    {
      type: 'pubmed',
      title: 'Sepsis-3: The Third International Consensus Definitions for Sepsis and Septic Shock',
      pmid: '26903338',
    },
    {
      type: 'guideline',
      title: 'SRLF / SFAR — Prise en charge du sepsis (2023)',
      url: 'https://www.srlf.org/',
    },
  ],
}

export default qsofa
