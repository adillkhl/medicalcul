import type { FormulaDefinition } from '../types'

const ptscore: FormulaDefinition = {
  id: 'ptscore', slug: 'ptscore',
  name: 'PT (Pediatric Trauma Score) — Score de Traumatisme Pédiatrique',
  specialty: 'urgence', category: 'Traumatologie',
  description: 'Pediatric Trauma Score (PTS) — score d\'évaluation du traumatisme chez l\'enfant (0-14 ans). 6 items cotés de +2 à -1 selon la gravité, score total de -6 (létal) à +12 (excellent). Prédit le risque de mortalité et la nécessité de transfert en centre de traumatologie.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'weight', type: 'radio', label: 'Poids (enfant)', options: [
      { value: 2, label: '> 20 kg (enfant > 6-7 ans)' },
      { value: 1, label: '10-20 kg (enfant 1-6 ans)' },
      { value: -1, label: '< 10 kg (nourrisson < 1 an)' },
    ]},
    { id: 'airway', type: 'radio', label: 'Voies aériennes (Airway)', options: [
      { value: 2, label: 'Normales (patient parle, crie normalement)' },
      { value: 1, label: 'Maintenues (oxygène simple, snifing position)' },
      { value: -1, label: 'Non maintenues (intubation, crico, trachéo)' },
    ]},
    { id: 'consciousness', type: 'radio', label: 'État de conscience (GCS)', options: [
      { value: 2, label: 'Normal (GCS 13-15, éveillé, orienté)' },
      { value: 1, label: 'Altéré (GCS 9-12, répond aux ordres simples)' },
      { value: -1, label: 'Inconscient (GCS ≤ 8, coma)' },
    ]},
    { id: 'systolic_bp', type: 'radio', label: 'Pression artérielle systolique', options: [
      { value: 2, label: 'Normale (> 90 mmHg ou bonne perfusion périphérique)' },
      { value: 1, label: 'Hypotension modérée (50-90 mmHg, allongement du TRC)' },
      { value: -1, label: 'Hypotension sévère (< 50 mmHg, choc)' },
    ]},
    { id: 'fractures', type: 'radio', label: 'Fractures (ouvertes ou fermées)', options: [
      { value: 2, label: 'Aucune fracture visible ou suspectée' },
      { value: 1, label: 'Fracture fermée unique (os long, clavicule, etc.)' },
      { value: -1, label: 'Fracture ouverte ou multiple (≥ 2 os longs ou complexe)' },
    ]},
    { id: 'cutaneous', type: 'radio', label: 'Lésions cutanées', options: [
      { value: 2, label: 'Aucune lésion visible (peau intacte)' },
      { value: 1, label: 'Contusion, abrasion, lacération < 5 cm' },
      { value: -1, label: 'Plaie pénétrante, brûlure, amputation, avulsion' },
    ]},
  ],
  calculate: (values) => {
    const weight = Number(values.weight) || 2
    const airway = Number(values.airway) || 2
    const consciousness = Number(values.consciousness) || 2
    const sbp = Number(values.systolic_bp) || 2
    const fractures = Number(values.fractures) || 2
    const cutaneous = Number(values.cutaneous) || 2

    const score = weight + airway + consciousness + sbp + fractures + cutaneous

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''
    let mortalite = ''

    if (score >= 9) {
      label = `PTS ${score}/12 — Risque minime`
      severity = 'low'
      mortalite = 'Mortalité : < 0.1%'
      recommendation = 'Traumatisme bénin. Probabilité de survie excellente. Traitement ambulatoire ou hospitalisation courte. Centre de traumatologie non nécessaire.'
    } else if (score >= 7) {
      label = `PTS ${score}/12 — Risque faible`
      severity = 'low'
      mortalite = 'Mortalité : 0.1-1%'
      recommendation = 'Traumatisme léger à modéré. Surveillance hospitalière recommandée (24h). Transfert en centre de traumatologie si aggravation.'
    } else if (score >= 5) {
      label = `PTS ${score}/12 — Risque modéré`
      severity = 'moderate'
      mortalite = 'Mortalité : 1-5%'
      recommendation = 'Traumatisme modéré. Hospitalisation en centre de traumatologie recommandée. Bilan lésionnel complet (scanner corps entier si mécanisme violent).'
    } else if (score >= 1) {
      label = `PTS ${score}/12 — Risque élevé`
      severity = 'high'
      mortalite = 'Mortalité : 5-50%'
      recommendation = 'Traumatisme sévère. Transfert en centre de traumatologie pédiatrique (niveau I). Réanimation pré-hospitalière. Bilan complet en urgence.'
    } else {
      label = `PTS ${score}/12 — Risque très élevé (score critique)`
      severity = 'critical'
      mortalite = 'Mortalité : > 50%'
      recommendation = 'Traumatisme critique. Transport médicalisé vers centre de traumatologie pédiatrique niveau I. Réanimation agressive. Pronostic réservé.'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Poids': weight === 2 ? '> 20 kg' : weight === 1 ? '10-20 kg' : '< 10 kg',
        'Voies aériennes': airway === 2 ? 'Normales' : airway === 1 ? 'Maintenues' : 'Non maintenues',
        'Conscience': consciousness === 2 ? 'Normale' : consciousness === 1 ? 'Altérée' : 'Inconscient',
        'PAS': sbp === 2 ? 'Normale' : sbp === 1 ? 'Hypotension modérée' : 'Hypotension sévère',
        'Fractures': fractures === 2 ? 'Aucune' : fractures === 1 ? 'Fermée unique' : 'Ouverte/multiple',
        'Lésions cutanées': cutaneous === 2 ? 'Aucune' : cutaneous === 1 ? 'Contusion/lacération' : 'Plaie pénétrante',
        'Score total': `${score}/12`,
        'Mortalité estimée': mortalite,
      },
      ranges: [
        { min: 9, max: 12, label: 'PTS 9-12 — Risque minime', severity: 'low', recommendation: 'Surveillance.' },
        { min: 7, max: 8, label: 'PTS 7-8 — Risque faible', severity: 'low', recommendation: 'Hospitalisation.' },
        { min: 5, max: 6, label: 'PTS 5-6 — Risque modéré', severity: 'moderate', recommendation: 'Centre trauma.' },
        { min: 1, max: 4, label: 'PTS 1-4 — Risque élevé', severity: 'high', recommendation: 'Centre trauma niveau I.' },
        { min: -6, max: 0, label: 'PTS ≤ 0 — Risque très élevé', severity: 'critical', recommendation: 'Réanimation urgente.' },
      ],
    }
  },
  interpretation: `**Pediatric Trauma Score (PTS)**

Score validé pour l\'évaluation initiale du traumatisme chez l\'enfant (< 14 ans). 6 items côté de -1 à +2.

| Item | +2 | +1 | -1 |
|------|----|----|----|
| **Poids** | > 20 kg | 10-20 kg | < 10 kg |
| **Voies aériennes** | Normales | Maintenues | Non maintenues |
| **Conscience (GCS)** | 13-15 | 9-12 | ≤ 8 |
| **PAS** | > 90 mmHg | 50-90 mmHg | < 50 mmHg |
| **Fractures** | Aucune | Fermée unique | Ouverte/multiple |
| **Lésions cutanées** | Aucune | Contusion | Pénétrante/brûlure |

**Risque de mortalité :**
- **≥ 9** : < 0.1%
- **7-8** : 0.1-1%
- **5-6** : 1-5%
- **1-4** : 5-50%
- **≤ 0** : > 50%`,
  clinicalCommentary: 'Le Pediatric Trauma Score (PTS) a été développé pour orienter les enfants traumatisés vers un centre de traumatologie pédiatrique. Un PTS < 8 est un critère classique de transfert en centre spécialisé. L\'enfant se décompense plus vite que l\'adulte : une hypotension est un signe tardif de choc. Le PTS est moins utilisé que le GCS pédiatrique ou le ISS (Injury Severity Score) mais reste utile pour le tri pré-hospitalier.',
  references: [
    { type: 'pubmed', title: 'Tepas JJ et al. The Pediatric Trauma Score. J Trauma 1987', pmid: '3625841' },
    { type: 'pubmed', title: 'Tepas JJ et al. The pediatric trauma score as a predictor of injury severity. J Pediatr Surg 1987', pmid: '3437382' },
    { type: 'guideline', title: 'American College of Surgeons — Pediatric Trauma Guidelines', url: 'https://www.facs.org/' },
  ],
}
export default ptscore
