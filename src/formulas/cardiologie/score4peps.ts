import type { FormulaDefinition } from '../types'

const score4peps: FormulaDefinition = {
  id: 'score-4peps',
  slug: 'score4peps',
  name: '4PEPS — Probabilité embolie pulmonaire (score 4 niveaux)',
  specialty: 'cardiologie',
  category: 'Embolie pulmonaire',
  description: '4-Level Pulmonary Embolism Clinical Probability Score (4PEPS) — Score de probabilité clinique d\'EP en 4 niveaux (Roy et al. 2022)',
  version: '2022',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge', unit: 'ans', min: 18, max: 110, step: 1, placeholder: 'Ex: 60' },
    { id: 'sexe_masculin', type: 'boolean', label: 'Sexe masculin' },
    { id: 'dyspnee_douleur', type: 'boolean', label: 'Dyspnée aiguë ET douleur thoracique associées' },
    { id: 'signes_tvp', type: 'boolean', label: 'Signes cliniques de TVP (douleur mollet, œdème unilatéral)' },
    { id: 'spo2', type: 'boolean', label: 'SpO₂ < 95 % à l\'air ambiant' },
    { id: 'diagnostic_alternatif', type: 'boolean', label: 'Diagnostic alternatif moins probable que l\'EP (EP est le diagnostic le plus probable)' },
    { id: 'atcd_vte', type: 'boolean', label: 'Antécédent de TVP ou EP' },
    { id: 'immobilisation', type: 'boolean', label: 'Immobilisation < 4 semaines (chirurgie, fracture, alitement)' },
    { id: 'fc_basse', type: 'boolean', label: 'Fréquence cardiaque < 80/min' },
    { id: 'resp_chronique', type: 'boolean', label: 'Maladie respiratoire chronique (asthme, BPCO, DDB)' },
    { id: 'oestrogenes', type: 'boolean', label: 'Prise d\'œstrogènes (contraception, THS)' },
    { id: 'syncope', type: 'boolean', label: 'Syncope' },
  ],
  calculate: (values) => {
    let score = 0

    // Âge
    const age = Number(values.age) || 50
    if (age < 50) score -= 2
    else if (age < 65) score -= 1
    // ≥ 65 = 0

    if (values.sexe_masculin) score += 2
    if (values.dyspnee_douleur) score += 1
    if (values.signes_tvp) score += 3
    if (values.spo2) score += 3
    if (values.diagnostic_alternatif) score += 5
    if (values.atcd_vte) score += 2
    if (values.immobilisation) score += 2
    if (values.fc_basse) score -= 1
    if (values.resp_chronique) score -= 1
    if (values.oestrogenes) score += 2
    if (values.syncope) score += 2

    // Niveaux de probabilité 4PEPS
    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let probability = ''

    if (score <= 0) {
      label = 'Probabilité faible (niveau 1)'
      severity = 'low'
      probability = '~8% de probabilité d\'EP'
    } else if (score <= 5) {
      label = 'Probabilité modérée (niveau 2)'
      severity = 'moderate'
      probability = '~25% de probabilité d\'EP'
    } else if (score <= 10) {
      label = 'Probabilité élevée (niveau 3)'
      severity = 'high'
      probability = '~65% de probabilité d\'EP'
    } else {
      label = 'Probabilité très élevée (niveau 4)'
      severity = 'critical'
      probability = '~95% de probabilité d\'EP'
    }

    return {
      value: score,
      label,
      risk: score <= 0 ? 8 : score <= 5 ? 25 : score <= 10 ? 65 : 95,
      riskUnit: '% probabilité EP',
      severity,
      details: {
        'Age': `${age} ans (${age < 50 ? '-2' : age < 65 ? '-1' : '0'} pts)`,
        'Sexe masculin': values.sexe_masculin ? 'Oui (+2)' : 'Non',
        'Dyspnée + douleur thoracique': values.dyspnee_douleur ? 'Oui (+1)' : 'Non',
        'Signes TVP': values.signes_tvp ? 'Oui (+3)' : 'Non',
        'SpO2 < 95%': values.spo2 ? 'Oui (+3)' : 'Non',
        'Diagnostic alternatif moins probable': values.diagnostic_alternatif ? 'Oui (+5)' : 'Non',
        'ATCD TVP/EP': values.atcd_vte ? 'Oui (+2)' : 'Non',
        'Immobilisation < 4 sem': values.immobilisation ? 'Oui (+2)' : 'Non',
        'FC < 80/min': values.fc_basse ? 'Oui (-1)' : 'Non',
        'Maladie respiratoire chronique': values.resp_chronique ? 'Oui (-1)' : 'Non',
        'Œstrogènes': values.oestrogenes ? 'Oui (+2)' : 'Non',
        'Syncope': values.syncope ? 'Oui (+2)' : 'Non',
      },
      ranges: [
        { min: -10, max: 0, label: 'Faible risque (≤ 0)', severity: 'low', recommendation: 'Dosage D-Dimères. Si D-Dimères < 500 ng/mL (âge adapté si > 50 ans) : exclure EP. Pas d\'imagerie urgente.' },
        { min: 1, max: 5, label: 'Risque modéré (1-5)', severity: 'moderate', recommendation: 'Dosage D-Dimères + angioscanner thoracique si positif. Considérer échographie cardiaque.' },
        { min: 6, max: 10, label: 'Haut risque (6-10)', severity: 'high', recommendation: 'Angioscanner thoracique en urgence. Échocardiographie. Anticoagulation immédiate si suspicion forte.' },
        { min: 11, max: 100, label: 'Très haut risque (> 10)', severity: 'critical', recommendation: 'Angioscanner thoracique immédiat. Échocardiographie. Anticoagulation d\'emblée. Avis cardiologue/réanimateur.' },
      ],
    }
  },
  interpretation: `Le **4PEPS** (Roy et al. 2022) est un score clinique à 4 niveaux de probabilité d'embolie pulmonaire, surpassant les scores de Genève et Wells en discrimination.

**12 items :**
- Âge : < 50 ans (-2), 50-64 ans (-1), ≥ 65 (0)
- Sexe masculin : 2
- Dyspnée aiguë ET douleur thoracique : 1
- Signes TVP (douleur mollet/œdème unilatéral) : 3
- SpO₂ < 95 % : 3
- EP diagnostic le plus probable : 5
- ATCD TVP/EP : 2
- Immobilisation < 4 sem : 2
- FC < 80/min : -1
- Maladie respiratoire chronique : -1
- Œstrogènes : 2
- Syncope : 2

**Niveaux :** ≤ 0 faible, 1-5 modéré, 6-10 élevé, > 10 très élevé.`,
  clinicalCommentary: `Le 4PEPS a été validé dans une cohorte de 2000 patients suspects d'EP aux urgences. Il surpasse le score de Genève révisé et le Wells PE en AUC (0.79 vs 0.73-0.75). Utilisez-le aux urgences devant toute suspicion d'EP. N'oubliez pas de demander les D-Dimères pour les scores faibles et modérés. L'angioscanner thoracique est l'examen de référence.`,
  references: [
    { type: 'pubmed', title: 'Roy PM et al. Development and validation of a 4-level pulmonary embolism clinical probability score (4PEPS). J Am Coll Cardiol 2022', pmid: '35618346' },
  ],
}
export default score4peps
