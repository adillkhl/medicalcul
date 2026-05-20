import type { FormulaDefinition } from '../types'

const wellstvp: FormulaDefinition = {
  id: 'wells-tvp', slug: 'wellstvp',
  name: "Wells — TVP (Score) / Phlébite",
  specialty: 'cardiologie', category: 'Maladie thromboembolique',
  description: "Score de Wells de probabilité clinique de thrombose veineuse profonde des membres inférieurs",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    {id:'cancer',type:'boolean',label:'Cancer évolutif (traité < 6 mois ou palliatif)'},
    {id:'paralysis',type:'boolean',label:'Paralysie, parésie ou immobilisation récente d’un MI'},
    {id:'bedrest',type:'boolean',label:'Alitement > 3 jours ou chirurgie < 4 semaines'},
    {id:'painLeg',type:'boolean',label:'Douleur localisée sur le trajet veineux'},
    {id:'swellingLeg',type:'boolean',label:'Tuméfaction d’un membre inférieur'},
    {id:'calfSwelling',type:'boolean',label:'Tuméfaction du mollet > 3 cm vs controlatéral'},
    {id:'pitting',type:'boolean',label:'Œdème prenant le godet sur le MI symptomatique'},
    {id:'collateralVeins',type:'boolean',label:'Veines collatérales superficielles (non variqueuses)'},
    {id:'previousDvt',type:'boolean',label:'Antécédent de TVP documentée'},
    {id:'alternativeDx',type:'boolean',label:'Diagnostic alternatif aussi ou plus probable que TVP'},
  ],
  calculate: (values) => {
    let score = 0
    if (values.cancer) score += 1
    if (values.paralysis) score += 1
    if (values.bedrest) score += 1
    if (values.painLeg) score += 1
    if (values.swellingLeg) score += 1
    if (values.calfSwelling) score += 1
    if (values.pitting) score += 1
    if (values.collateralVeins) score += 1
    if (values.previousDvt) score += 1
    if (values.alternativeDx) score -= 2

    if (score >= 3) return {value:score, label:'Probabilité ÉLEVÉE (> 85%)', risk:85, riskUnit:'% probabilité TVP', severity:'high' as const,
      ranges:[{min:3,max:12,label:'Élevé',severity:'high' as const,recommendation:"Écho-Doppler veineux en urgence (< 24h). Débuter HBPM sans attendre si forte suspicion. Hospitalisation si TVP proximale."},
      {min:1,max:2,label:'Modéré (33%)',severity:'moderate' as const,recommendation:"Écho-Doppler veineux. D-Dimères si accès rapide. Si D-Dimères < 500 ng/mL : exclure TVP."},
      {min:-2,max:0,label:'Faible (5%)',severity:'low' as const,recommendation:"D-Dimères. Si négatifs < 500 ng/mL : exclure TVP. Écho-Doppler seulement si D-Dimères positifs."}]}
    if (score >= 1) return {value:score, label:'Probabilité MODÉRÉE', risk:33, riskUnit:'% probabilité TVP', severity:'moderate' as const,
      ranges:[{min:3,max:12,label:'Élevé',severity:'high' as const},{min:1,max:2,label:'Modéré',severity:'moderate' as const,recommendation:"Écho-Doppler veineux. D-Dimères."},{min:-2,max:0,label:'Faible',severity:'low' as const}]}
    return {value:score, label:'Probabilité FAIBLE (5%)', risk:5, riskUnit:'% probabilité TVP', severity:'low' as const,
      ranges:[{min:3,max:12,label:'Élevé',severity:'high' as const},{min:1,max:2,label:'Modéré',severity:'moderate' as const},{min:-2,max:0,label:'Faible',severity:'low' as const,recommendation:"D-Dimères. Si négatifs : pas de TVP. Si positifs : écho-Doppler."}]}
  },
  interpretation: `Le **score de Wells** (version TVP) est le plus utilisé pour l’évaluation clinique de la TVP.

**Items :** cancer (1), paralysie (1), alitement/chirurgie (1), douleur trajet veineux (1), tuméfaction MI (1), mollet > 3 cm (1), œdème prenant le godet (1), veines collatérales (1), ATCD TVP (1), diagnostic alternatif (-2).

**Seuils :** ≤ 0 = faible, 1-2 = modéré, ≥ 3 = élevé.`,
  clinicalCommentary: `Score indispensable en urgence comme en consultation. Le score de Wells est plus performant que le jugement clinique seul. Il permet de réduire les examens d’imagerie inutiles. Un score faible + D-Dimères négatifs exclut la TVP avec une VPN > 99%.`,
  references: [{type:'pubmed',title:'Wells PS et al. JAMA 2006;295:199-207',pmid:'16403930'}],
}
export default wellstvp
