import type { FormulaDefinition } from '../types'

const wpiSss: FormulaDefinition = {
  id: 'wpi_sss',
  slug: 'wpi_sss',
  name: 'WPI et SSS — Critères diagnostiques de fibromyalgie (ACR 2010/2016)',
  specialty: 'rhumatologie',
  category: 'Fibromyalgie',
  description: 'Widespread Pain Index (WPI) et Symptom Severity Scale (SSS) — Critères ACR 2010/2016 pour le diagnostic de fibromyalgie.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'wpi_epaule_g',
      type: 'boolean',
      label: 'Douleur — Épaule gauche (dernier mois)',
    },
    {
      id: 'wpi_epaule_d',
      type: 'boolean',
      label: 'Douleur — Épaule droite',
    },
    {
      id: 'wpi_bras_g',
      type: 'boolean',
      label: 'Douleur — Bras gauche',
    },
    {
      id: 'wpi_bras_d',
      type: 'boolean',
      label: 'Douleur — Bras droit',
    },
    {
      id: 'wpi_avantbras_g',
      type: 'boolean',
      label: 'Douleur — Avant-bras gauche',
    },
    {
      id: 'wpi_avantbras_d',
      type: 'boolean',
      label: 'Douleur — Avant-bras droit',
    },
    {
      id: 'wpi_hanche_g',
      type: 'boolean',
      label: 'Douleur — Hanche/fesse gauche',
    },
    {
      id: 'wpi_hanche_d',
      type: 'boolean',
      label: 'Douleur — Hanche/fesse droite',
    },
    {
      id: 'wpi_cuisse_g',
      type: 'boolean',
      label: 'Douleur — Cuisse gauche',
    },
    {
      id: 'wpi_cuisse_d',
      type: 'boolean',
      label: 'Douleur — Cuisse droite',
    },
    {
      id: 'wpi_jambe_g',
      type: 'boolean',
      label: 'Douleur — Jambe gauche',
    },
    {
      id: 'wpi_jambe_d',
      type: 'boolean',
      label: 'Douleur — Jambe droite',
    },
    {
      id: 'wpi_maxillaire_g',
      type: 'boolean',
      label: 'Douleur — Mâchoire gauche',
    },
    {
      id: 'wpi_maxillaire_d',
      type: 'boolean',
      label: 'Douleur — Mâchoire droite',
    },
    {
      id: 'wpi_cou',
      type: 'boolean',
      label: 'Douleur — Cou',
    },
    {
      id: 'wpi_tb_haut',
      type: 'boolean',
      label: 'Douleur — Thorax haut / dos',
    },
    {
      id: 'wpi_tb_bas',
      type: 'boolean',
      label: 'Douleur — Thorax bas / lombaire',
    },
    {
      id: 'wpi_dos',
      type: 'boolean',
      label: 'Douleur — Milieu du dos / rachis thoracique',
    },
    {
      id: 'wpi_abdomen',
      type: 'boolean',
      label: 'Douleur — Abdomen',
    },
    {
      id: 'fatigue',
      type: 'radio',
      label: 'Sévérité de la fatigue (dernier mois)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Légère' },
        { value: 2, label: '2 — Modérée' },
        { value: 3, label: '3 — Sévère' },
      ],
    },
    {
      id: 'reveil_non_reposant',
      type: 'radio',
      label: 'Réveil non reposant / sommeil non réparateur',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Léger' },
        { value: 2, label: '2 — Modéré' },
        { value: 3, label: '3 — Sévère' },
      ],
    },
    {
      id: 'troubles_cognitifs',
      type: 'radio',
      label: 'Troubles cognitifs (brouillard mental, troubles de la concentration)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Légers' },
        { value: 2, label: '2 — Modérés' },
        { value: 3, label: '3 — Sévères' },
      ],
    },
    {
      id: 'symptomes_somatiques',
      type: 'radio',
      label: 'Symptômes somatiques associés (céphalées, côlon irritable, syndrome sec, etc.)',
      options: [
        { value: 0, label: '0 — Aucun' },
        { value: 1, label: '1 — Peu nombreux (1–3 symptômes)' },
        { value: 2, label: '2 — Modérés (4–6 symptômes)' },
        { value: 3, label: '3 — Nombreux (> 7 symptômes)' },
      ],
    },
  ],
  calculate: (values) => {
    // WPI: count of painful areas (out of 19)
    const wpiAreas = [
      values.wpi_epaule_g, values.wpi_epaule_d,
      values.wpi_bras_g, values.wpi_bras_d,
      values.wpi_avantbras_g, values.wpi_avantbras_d,
      values.wpi_hanche_g, values.wpi_hanche_d,
      values.wpi_cuisse_g, values.wpi_cuisse_d,
      values.wpi_jambe_g, values.wpi_jambe_d,
      values.wpi_maxillaire_g, values.wpi_maxillaire_d,
      values.wpi_cou,
      values.wpi_tb_haut, values.wpi_tb_bas, values.wpi_dos,
      values.wpi_abdomen,
    ]
    const wpi = wpiAreas.filter(Boolean).length

    // SSS: sum of 3 symptom severity scores + somatic symptoms score
    const fatigue = values.fatigue ?? 0
    const reveil = values.reveil_non_reposant ?? 0
    const cognitif = values.troubles_cognitifs ?? 0
    const somatique = values.symptomes_somatiques ?? 0

    const sss = fatigue + reveil + cognitif + somatique

    // ACR 2016 criteria (modified): WPI >= 7 AND SSS >= 5
    // OR WPI 4-6 AND SSS >= 9
    let diagnostic = false
    if (wpi >= 7 && sss >= 5) diagnostic = true
    if (wpi >= 4 && wpi <= 6 && sss >= 9) diagnostic = true

    if (diagnostic) {
      return {
        value: wpi,
        label: `WPI = ${wpi}/19, SSS = ${sss}/12 — Fibromyalgie (critères ACR 2016)`,
        severity: 'high',
        details: { wpi, sss },
        ranges: [
          { min: 0, max: 0, label: 'WPI ≥ 7 + SSS ≥ 5 OU WPI 4–6 + SSS ≥ 9 : critères ACR 2016 remplis', severity: 'high' },
        ],
      }
    }

    return {
      value: wpi,
      label: `WPI = ${wpi}/19, SSS = ${sss}/12 — Fibromyalgie non classifiable selon ACR 2016`,
      severity: 'low',
      details: { wpi, sss },
      ranges: [
        { min: 0, max: 0, label: 'WPI < 4 OU (WPI 4-6 et SSS < 9) OU (WPI ≥ 7 et SSS < 5) : critères ACR 2016 non remplis', severity: 'low' },
        { min: 1, max: 1, label: 'Critères ACR 2016 remplis', severity: 'high' },
      ],
    }
  },
  interpretation: `**Critères ACR 2010/2016 pour la fibromyalgie**

**WPI (Widespread Pain Index)** : nombre de zones douloureuses parmi 19 (score 0–19).

**SSS (Symptom Severity Scale)** : somme des 3 scores de sévérité (fatigue, sommeil non réparateur, troubles cognitifs) + symptômes somatiques (score 0–12).

**Critères ACR 2016 (modifiés) :**
- WPI ≥ 7 ET SSS ≥ 5
- OU WPI = 4–6 ET SSS ≥ 9

**Conditions requises :** Douleurs diffuses depuis ≥ 3 mois ET absence d\'autre pathologie expliquant les symptômes.

| WPI | SSS | Résultat |
|---|---|---|
| ≥ 7 | ≥ 5 | Fibromyalgie |
| 4–6 | ≥ 9 | Fibromyalgie |
| < 4 | — | Non classifiable |
| — | < 5 | Non classifiable |`,
  clinicalCommentary: `Les critères ACR 2016 sont les critères diagnostiques actuels de la fibromyalgie. Le WPI remplace la notion de points sensibles (tender points). Attention : ces critères sont destinés à la classification, pas au suivi de l\'évolution.`,
  references: [
    {
      type: 'pubmed',
      title: 'Wolfe F et al. The American College of Rheumatology preliminary diagnostic criteria for fibromyalgia. Arthritis Care Res 2010',
      pmid: '20533581',
    },
    {
      type: 'pubmed',
      title: 'Wolfe F et al. 2016 Revisions to the 2010/2011 fibromyalgia diagnostic criteria. Semin Arthritis Rheum 2016',
      pmid: '27384952',
    },
  ],
}

export default wpiSss
