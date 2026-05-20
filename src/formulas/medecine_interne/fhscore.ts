import type { FormulaDefinition } from '../types'

const fhscore: FormulaDefinition = {
  id: 'fhscore',
  slug: 'fhscore',
  name: 'FH Score (Dutch) — Hypercholestérolémie familiale',
  specialty: 'medecine_interne',
  category: 'Lipidologie',
  description: 'Dépistage de l\'hypercholestérolémie familiale (FH) par le score Dutch Lipid Clinic Network (DLCN).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'ldl',
      type: 'radio',
      label: 'LDL-cholestérol (max avant traitement)',
      options: [
        { value: 1, label: '4.0–4.9 mmol/L (155–189 mg/dL)' },
        { value: 3, label: '5.0–6.4 mmol/L (190–249 mg/dL)' },
        { value: 5, label: '6.5–8.4 mmol/L (250–325 mg/dL)' },
        { value: 8, label: '≥ 8.5 mmol/L (> 325 mg/dL)' },
      ],
    },
    {
      id: 'xanthomes',
      type: 'boolean',
      label: 'Xanthomes tendineux (tendon d\'Achille, extenseurs)',
    },
    {
      id: 'arc_corneen',
      type: 'boolean',
      label: 'Arc cornéen (avant 45 ans)',
    },
    {
      id: 'atcd_fam_cv_premature',
      type: 'radio',
      label: 'Antécédents familiaux CV prématurés (H : < 55 ans, F : < 60 ans)',
      options: [
        { value: 1, label: 'Au moins 1 parent ou enfant avec coronaropathie ou AVC prématuré' },
        { value: 2, label: 'Aucun antécédent familial CV prématuré' },
      ],
    },
    {
      id: 'atcd_perso_cv',
      type: 'boolean',
      label: 'Antécédent personnel de coronaropathie prématurée (H < 55, F < 60)',
    },
    {
      id: 'atcd_perso_avc',
      type: 'boolean',
      label: 'Antécédent personnel d\'AVC prématuré (H < 55, F < 60)',
    },
    {
      id: 'mutation_fh',
      type: 'radio',
      label: 'Mutation génétique (LDLR, APOB, PCSK9)',
      options: [
        { value: 8, label: 'Mutation positive documentée' },
        { value: 0, label: 'Non testé / mutation absente' },
      ],
    },
  ],
  calculate: (values) => {
    let score = 0
    const ldl = values.ldl ?? 0
    score += ldl
    if (values.xanthomes) score += 6
    if (values.arc_corneen) score += 4
    const fam = values.atcd_fam_cv_premature ?? 0
    if (fam === 1) score += 1
    if (values.atcd_perso_cv) score += 2
    if (values.atcd_perso_avc) score += 2
    score += values.mutation_fh ?? 0

    if (score >= 8) {
      return {
        value: score,
        label: `Score DLCN = ${score} — FH certaine (> 8)`,
        severity: 'high',
        ranges: [
          { min: 8, max: 999, label: '≥ 8 : FH certaine', severity: 'high' },
          { min: 6, max: 7, label: '6–7 : FH probable', severity: 'moderate' },
          { min: 3, max: 5, label: '3–5 : FH possible', severity: 'low' },
          { min: 0, max: 2, label: '0–2 : FH peu probable', severity: 'low' },
        ],
      }
    }
    if (score >= 6) {
      return {
        value: score,
        label: `Score DLCN = ${score} — FH probable (6–7)`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 2, label: '0–2 : Peu probable', severity: 'low' },
          { min: 3, max: 5, label: '3–5 : Possible', severity: 'low' },
          { min: 6, max: 7, label: '6–7 : Probable', severity: 'moderate' },
          { min: 8, max: 999, label: '≥ 8 : Certaine', severity: 'high' },
        ],
      }
    }
    if (score >= 3) {
      return {
        value: score,
        label: `Score DLCN = ${score} — FH possible (3–5)`,
        severity: 'low',
        ranges: [
          { min: 0, max: 2, label: '0–2 : Peu probable', severity: 'low' },
          { min: 3, max: 5, label: '3–5 : Possible', severity: 'low' },
          { min: 6, max: 7, label: '6–7 : Probable', severity: 'moderate' },
          { min: 8, max: 999, label: '≥ 8 : Certaine', severity: 'high' },
        ],
      }
    }
    return {
      value: score,
      label: `Score DLCN = ${score} — FH peu probable (0–2)`,
      severity: 'low',
      ranges: [
        { min: 0, max: 2, label: '0–2 : Peu probable', severity: 'low' },
        { min: 3, max: 5, label: '3–5 : Possible', severity: 'low' },
        { min: 6, max: 7, label: '6–7 : Probable', severity: 'moderate' },
        { min: 8, max: 999, label: '≥ 8 : Certaine', severity: 'high' },
      ],
    }
  },
  interpretation: `**Dutch Lipid Clinic Network (DLCN) Score** pour le dépistage de l\'hypercholestérolémie familiale (FH) :

- **≥ 8** : FH certaine (diagnostic confirmé)
- **6–7** : FH probable
- **3–5** : FH possible
- **0–2** : FH peu probable

**Conduite :** Si FH certaine ou probable : confirmation génétique et enquête familiale en cascade. Traitement par statine à haute dose ± ézétimibe. Objectif LDL < 2,5 mmol/L (ou < 1,8 mmol/L si coronaropathie).`,
  clinicalCommentary: `La FH touche 1/250 personnes. Elle est sous-diagnostiquée. Penservant aux xanthomes tendineux (pathognomoniques) et à l\'arc cornéen précoce. Le dépistage en cascade familial est recommandé par les sociétés savantes (ESC/EAS).`,
  references: [
    {
      type: 'pubmed',
      title: 'Nordestgaard BG et al. Familial hypercholesterolaemia is underdiagnosed and undertreated. Eur Heart J 2013',
      pmid: '23956253',
    },
    {
      type: 'guideline',
      title: 'ESC/EAS Guidelines for the management of dyslipidaemias 2019',
      pmid: '31545518',
    },
  ],
}

export default fhscore
