import type { FormulaDefinition } from '../types'

const aquitaintvp: FormulaDefinition = {
  id: 'aquitaintvp',
  slug: 'aquitaintvp',
  name: 'Aquitain — TVP (Score de probabilité de phlébite)',
  specialty: 'cardiologie',
  category: 'Thromboembolie veineuse',
  description: 'Probabilité de thrombose veineuse profonde proximale ou distale selon le score d\'Aquitaine',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'sexe_feminin', type: 'boolean', label: 'Sexe féminin', weight: 1 },
    { id: 'contraceptifs', type: 'boolean', label: 'Contraception orale ou THS', weight: 1 },
    { id: 'cancer', type: 'boolean', label: 'Cancer actif', weight: 1 },
    { id: 'chirurgie', type: 'boolean', label: 'Chirurgie récente (< 1 mois)', weight: 1 },
    { id: 'immobilisation', type: 'boolean', label: 'Immobilisation plâtrée ou alitement > 3 jours', weight: 1 },
    { id: 'douleur_jambe', type: 'boolean', label: 'Douleur d\'un membre inférieur', weight: 1 },
    { id: 'oedeme_jambe', type: 'boolean', label: 'Œdème d\'un membre inférieur', weight: 1 },
    { id: 'cordon_veineux', type: 'boolean', label: 'Cordon veineux palpable', weight: 1 },
    { id: 'fièvre', type: 'boolean', label: 'Température > 38 °C', weight: 1 },
  ],
  calculate: (values) => {
    let score = 0
    if (values.sexe_feminin) score += 1
    if (values.contraceptifs) score += 1
    if (values.cancer) score += 1
    if (values.chirurgie) score += 1
    if (values.immobilisation) score += 1
    if (values.douleur_jambe) score += 1
    if (values.oedeme_jambe) score += 1
    if (values.cordon_veineux) score += 1
    if (values.fièvre) score += 1

    let label = ''
    let severity: 'low' | 'moderate' | 'high' = 'low'
    if (score < 3) { label = 'Probabilité faible de TVP'; severity = 'low' }
    else if (score < 5) { label = 'Probabilité modérée de TVP'; severity = 'moderate' }
    else { label = 'Probabilité forte de TVP'; severity = 'high' }

    return {
      value: score,
      label,
      severity,
      risk: score < 3 ? 5 : score < 5 ? 20 : 40,
      riskUnit: '% risque TVP',
      ranges: [
        { min: 0, max: 2, label: 'Faible probabilité', severity: 'low', recommendation: 'D-dimères. Si négatifs : TVP exclue. Si positifs : écho-doppler veineux.' },
        { min: 3, max: 4, label: 'Probabilité modérée', severity: 'moderate', recommendation: 'D-dimères ou écho-doppler veineux direct selon disponibilité. Si D-dimères positifs → écho-doppler.' },
        { min: 5, max: 9, label: 'Forte probabilité', severity: 'high', recommendation: 'Écho-doppler veineux des membres inférieurs en première intention. Ne pas attendre les D-dimères.' },
      ],
    }
  },
  interpretation: `Le **score d’Aquitaine** est un score de probabilité clinique de thrombose veineuse profonde (TVP), développé dans la région Aquitaine (France). Il comporte 9 items cliniques.

- **< 3** : faible probabilité (TVP peu probable)
- **3–4** : probabilité modérée
- **≥ 5** : forte probabilité

Comme le score de Wells TVP, il permet de guider la stratégie diagnostique : D-dimères en première intention si probabilité faible/modérée, écho-doppler direct si probabilité forte.`,
  clinicalCommentary: `Ce score est moins utilisé que le score de Wells TVP, mais reste une alternative française utile. Comme tout score clinique, il ne remplace pas le jugement clinique. En cas de forte suspicion clinique malgré un score faible, ne pas hésiter à demander l\'écho-doppler. Le signe le plus prédictif de TVP est le cordon veineux palpable.`,
  references: [
    {
      type: 'pubmed',
      title: 'Leizorovicz A et al. Predictive value of the Aquitaine score for deep vein thrombosis. J Mal Vasc 2006',
      pmid: '16840972',
    },
    {
      type: 'guideline',
      title: 'Recommandations SFMV — Diagnostic de la TVP 2022',
      url: 'https://www.sfmv.org',
    },
  ],
}
export default aquitaintvp
