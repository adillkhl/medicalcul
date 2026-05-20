import type { FormulaDefinition } from '../types'

const crusade: FormulaDefinition = {
  id: 'crusade',
  slug: 'crusade',
  name: 'CRUSADE (Score de risque hémorragique SCA non ST+)',
  specialty: 'cardiologie',
  category: 'Syndrome coronarien aigu',
  description: 'Score de risque hémorragique chez les patients avec syndrome coronarien aigu sans sus-ST (SCA non ST+) — Pondérations CRUSADE originales',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    // Heart rate — continu
    {id:'hr', type:'number', label:'Fréquence cardiaque', unit:'/min', min:30, max:250, step:1, placeholder:'Ex: 85'},
    // PAS — continu
    {id:'sbp', type:'number', label:'Pression artérielle systolique', unit:'mmHg', min:50, max:250, step:1, placeholder:'Ex: 130'},
    // Hématocrite — continu
    {id:'hematocrite', type:'number', label:'Hématocrite', unit:'%', min:10, max:60, step:0.1, placeholder:'Ex: 38'},
    // Clairance de la créatinine — continu
    {id:'crcl', type:'number', label:'Clairance de la créatinine (Cockcroft)', unit:'mL/min', min:5, max:200, step:1, placeholder:'Ex: 85'},
    // Sexe féminin
    {id:'sexe_feminin', type:'boolean', label:'Sexe féminin'},
    // Insuffisance cardiaque
    {id:'insuffisance_cardiaque', type:'boolean', label:'Signes d\'insuffisance cardiaque à l\'admission'},
    // Maladie vasculaire (AOMI, antécédent AVC)
    {id:'vasculaire', type:'boolean', label:'Maladie vasculaire périphérique (AOMI, AVC, AIT)'},
    // Diabète
    {id:'diabete', type:'boolean', label:'Diabète'},
  ],
  calculate: (values) => {
    let score = 0

    const hr = Number(values.hr) || 80
    const sbp = Number(values.sbp) || 130
    const hte = Number(values.hematocrite) || 38
    const crcl = Number(values.crcl) || 85

    // 1. Fréquence cardiaque (bpm) — points CRUSADE
    if (hr > 120) score += 14
    else if (hr >= 111) score += 14
    else if (hr >= 101) score += 11
    else if (hr >= 91) score += 8
    else if (hr >= 81) score += 5
    else if (hr >= 71) score += 2
    // ≤ 70 = 0

    // 2. PAS (mmHg) — points CRUSADE
    if (sbp <= 70) score += 11
    else if (sbp >= 71 && sbp <= 80) score += 10
    else if (sbp >= 81 && sbp <= 90) score += 7
    else if (sbp >= 91 && sbp <= 100) score += 5
    else if (sbp >= 101 && sbp <= 110) score += 3
    else if (sbp >= 111 && sbp <= 120) score += 1
    // > 120 = 0

    // 3. Hématocrite (%) — points CRUSADE
    if (hte < 28) score += 16
    else if (hte < 32) score += 14
    else if (hte < 36) score += 9
    else if (hte < 40) score += 3
    // ≥ 40 = 0

    // 4. Clairance de la créatinine (mL/min) — points CRUSADE
    if (crcl < 30) score += 7
    else if (crcl <= 60) score += 4
    // > 60 = 0

    // 5. Sexe féminin = 8 points
    if (values.sexe_feminin) score += 8

    // 6. Insuffisance cardiaque = 7 points
    if (values.insuffisance_cardiaque) score += 7

    // 7. Maladie vasculaire périphérique = 6 points
    if (values.vasculaire) score += 6

    // 8. Diabète = 6 points
    if (values.diabete) score += 6

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'

    if (score <= 20) { label = 'Très faible risque'; severity = 'low' }
    else if (score <= 30) { label = 'Faible risque'; severity = 'low' }
    else if (score <= 40) { label = 'Risque modéré'; severity = 'moderate' }
    else if (score <= 50) { label = 'Risque élevé'; severity = 'high' }
    else { label = 'Risque très élevé'; severity = 'critical' }

    return {
      value: score,
      label,
      severity,
      risk: score <= 20 ? 3.1 : score <= 30 ? 5.5 : score <= 40 ? 8.6 : score <= 50 ? 11.9 : 15.3,
      riskUnit: '% risque hémorragies majeures',
      details: {
        'FC': `${hr}/min`,
        'PAS': `${sbp} mmHg`,
        'Hématocrite': `${hte}%`,
        'ClCr': `${crcl} mL/min`,
        'Sexe féminin': values.sexe_feminin ? 'Oui (+8)' : 'Non',
        'Insuffisance cardiaque': values.insuffisance_cardiaque ? 'Oui (+7)' : 'Non',
        'Maladie vasculaire': values.vasculaire ? 'Oui (+6)' : 'Non',
        'Diabète': values.diabete ? 'Oui (+6)' : 'Non',
      },
      ranges: [
        { min: 0, max: 20, label: 'Très faible risque (≤20)', severity: 'low', recommendation: 'Stratégie invasive précoce possible avec risque minimal de saignement.' },
        { min: 21, max: 30, label: 'Faible risque (21-30)', severity: 'low', recommendation: 'Stratégie invasive standard. Surveillance clinique.' },
        { min: 31, max: 40, label: 'Risque modéré (31-40)', severity: 'moderate', recommendation: 'Privilégier abord radial. Utiliser bivalirudine ou fondaparinux si anticoagulation.' },
        { min: 41, max: 50, label: 'Risque élevé (41-50)', severity: 'high', recommendation: 'Abord radial obligatoire. Anticoagulation prudente. Discuter délai de la coronarographie.' },
        { min: 51, max: 100, label: 'Risque très élevé (>50)', severity: 'critical', recommendation: 'Précautions maximales. Abord radial exclusif. Surveillance rapprochée. Pondérer l\'urgence de la revascularisation.' },
      ],
    }
  },
  interpretation: `Le **score CRUSADE** estime le risque hémorragique chez les patients hospitalisés pour syndrome coronarien aigu sans sus-ST (SCA non ST+).

**8 facteurs :** FC (continu), PAS (continu), Ht (continu), ClCr (continu), sexe féminin (8 pts), insuffisance cardiaque (7 pts), maladie vasculaire (6 pts), diabète (6 pts).

- **≤ 20** : très faible risque (3,1 % hémorragies majeures)
- **21–30** : faible risque (5,5 %)
- **31–40** : modéré (8,6 %)
- **41–50** : élevé (11,9 %)
- **> 50** : très élevé (15,3 %)`,
  clinicalCommentary: `Le CRUSADE est validé pour les SCA non ST+, pas pour les ST+. L'abord radial est associé à une réduction significative des complications hémorragiques par rapport au fémoral, surtout chez les patients à haut risque CRUSADE. Pondérations issues de Subherwal et al. Circulation 2009.`,
  references: [
    {
      type: 'pubmed',
      title: 'Subherwal S et al. Baseline risk of major bleeding in non-ST-segment-elevation myocardial infarction: the CRUSADE bleeding score. Circulation 2009',
      pmid: '19597049',
    },
    {
      type: 'guideline',
      title: 'ESC Guidelines for the management of acute coronary syndromes 2023',
      url: 'https://doi.org/10.1093/eurheartj/ehad191',
    },
  ],
}
export default crusade
