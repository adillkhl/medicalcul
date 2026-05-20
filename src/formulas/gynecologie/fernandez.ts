import type { FormulaDefinition } from '../types'

const fernandez: FormulaDefinition = {
  id: 'fernandez',
  slug: 'fernandez',
  name: 'Fernandez (Score)',
  specialty: 'gynecologie',
  category: 'GEU',
  description: 'Score de Fernandez pour guider la décision thérapeutique dans la grossesse extra-utérine (GEU).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'b_hcg',
      type: 'radio',
      label: 'Taux de β-hCG (UI/L)',
      options: [
        { value: 0, label: '< 1000' },
        { value: 1, label: '1000-5000' },
        { value: 2, label: '> 5000' },
      ],
    },
    {
      id: 'hematosalpinx',
      type: 'radio',
      label: 'Hématosalpinx à l échographie',
      options: [
        { value: 0, label: 'Absent' },
        { value: 1, label: '< 3 cm' },
        { value: 2, label: '≥ 3 cm' },
      ],
    },
    {
      id: 'embryon',
      type: 'radio',
      label: 'Activité cardiaque embryonnaire',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Présente' },
      ],
    },
    {
      id: 'douleur',
      type: 'radio',
      label: 'Douleur pelvienne',
      options: [
        { value: 0, label: 'Absente ou légère' },
        { value: 1, label: 'Modérée' },
        { value: 2, label: 'Sévère ou choc' },
      ],
    },
    {
      id: 'echec_mtu',
      type: 'boolean',
      label: 'Échec d un traitement médical antérieur',
      weight: 1,
    },
  ],
  calculate: (values) => {
    const hcg = parseInt(values.b_hcg) || 0
    const hema = parseInt(values.hematosalpinx) || 0
    const embryo = values.embryon === '1' ? 1 : 0
    const douleur = parseInt(values.douleur) || 0
    const echec = values.echec_mtu ? 1 : 0
    const total = hcg + hema + embryo + douleur + echec

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (total <= 1) severity = 'low'
    else if (total <= 3) severity = 'moderate'
    else if (total <= 5) severity = 'high'
    else severity = 'critical'

    return {
      value: total,
      label: `Score de Fernandez : ${total}/7`,
      severity,
      ranges: [
        { min: 0, max: 1, label: 'Traitement médical probablement efficace', severity: 'low', recommendation: 'Traitement médical par méthotrexate (MTX) en dose unique (50 mg/m²). Surveillance: β-hCG J4, J7. Si baisse > 15% J4-J7: succès. Sinon: seconde dose.' },
        { min: 2, max: 3, label: 'Traitement médical possible', severity: 'moderate', recommendation: 'MTX envisageable si critères remplis. Surveillance rapprochée. Si β-hCG élevées ou hématosalpinx volumineux, discussion cœlioscopie.' },
        { min: 4, max: 5, label: 'Indication chirurgicale probable', severity: 'high', recommendation: 'Cœlioscopie en première intention. Salpingectomie ou salpingotomie selon son désir de fertilité ultérieure.' },
        { min: 6, max: 7, label: 'Urgence chirurgicale', severity: 'critical', recommendation: 'Prise en charge chirurgicale en urgence (cœlioscopie ou laparotomie). Bilan pré-opératoire. Remplissage vasculaire si besoin. Salpingectomie probable.' },
      ],
    }
  },
  interpretation: `Le **score de Fernandez** aide à décider du traitement d une GEU (médical vs chirurgical) en fonction de critères cliniques, biologiques et échographiques.

**Critères :**
- **β-hCG** (0–2) : < 1000 → 0 ; 1000–5000 → 1 ; > 5000 → 2
- **Hématosalpinx** (0–2) : absent → 0 ; < 3 cm → 1 ; ≥ 3 cm → 2
- **Activité cardiaque** (0–1) : absente → 0 ; présente → 1
- **Douleur** (0–2) : absente/légère → 0 ; modérée → 1 ; sévère → 2
- **Échec MTX antérieur** (0–1)

**Total : 0–7**

Un score ≤ 3 oriente vers un traitement médical, ≥ 4 vers un traitement chirurgical.`,
  clinicalCommentary: `Le traitement médical par MTX n est possible que si : GEU non rompue, β-hCG < 5000 UI/L, patiente asymptomatique ou peu symptomatique, absence d activité cardiaque, observance possible. En cas de score ≥ 6, la chirurgie s impose en urgence. La salpingotomie est préférée en cas de désir de grossesse, sauf si trompe déjà lésée. Après MTX, éviter grossesse pendant 3 mois.`,
  references: [
    {
      type: 'pubmed',
      title: 'Fernandez H et al. Predictive score for the treatment of ectopic pregnancy. Fertil Steril 1991',
      pmid: '1827643',
    },
    {
      type: 'guideline',
      title: 'CNGOF — Prise en charge de la grossesse extra-utérine (Recommandations 2020)',
      url: 'https://www.cngof.fr',
    },
  ],
}
export default fernandez
