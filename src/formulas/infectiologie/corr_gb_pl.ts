import type { FormulaDefinition } from '../types'

const corrGbPl: FormulaDefinition = {
  id: 'corr_gb_pl',
  slug: 'corr_gb_pl',
  name: 'Correction Leucocytes dans LCR',
  specialty: 'infectiologie',
  category: 'Méningites',
  description: 'Correction du nombre de leucocytes dans le liquide céphalo-rachidien (LCR) en cas de contamination par une ponction lombaire hémorragique.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'gb_lcr',
      type: 'number',
      label: 'Leucocytes dans le LCR (/mm³ ou /µL)',
      min: 0,
      max: 50000,
      step: 1,
      placeholder: 'ex: 150',
    },
    {
      id: 'gr_lcr',
      type: 'number',
      label: 'Globules rouges dans le LCR (/mm³ ou /µL)',
      min: 0,
      max: 1000000,
      step: 1,
      placeholder: 'ex: 5000',
    },
    {
      id: 'gb_sang',
      type: 'number',
      label: 'Leucocytes sanguins (/mm³ ou /µL)',
      min: 0,
      max: 100000,
      step: 1,
      placeholder: 'ex: 8000',
    },
    {
      id: 'gr_sang',
      type: 'number',
      label: 'Globules rouges sanguins (/mm³ ou /µL)',
      min: 0,
      max: 8000000,
      step: 1,
      placeholder: 'ex: 5000000',
    },
  ],
  calculate: (values) => {
    const gbLcr = parseInt(values.gb_lcr) || 0
    const grLcr = parseInt(values.gr_lcr) || 0
    const gbSang = parseInt(values.gb_sang) || 0
    const grSang = parseInt(values.gr_sang) || 0

    if (grLcr === 0 || grSang === 0) {
      return {
        value: gbLcr,
        label: gbLcr <= 5 ? 'LCR normal' : 'LCR anormal (sans correction nécessaire)',
        severity: gbLcr <= 5 ? 'low' : 'high',
        ranges: [
          { min: 0, max: 5, label: 'Normal', severity: 'low', recommendation: 'Pas de méningite. Pas d antibiothérapie.' },
          { min: 6, max: 50000, label: 'Anormal', severity: 'high', recommendation: 'Suspect méningite. Antibiothérapie empirique. Prélèvement sanguin. Bilan étiologique.' },
        ],
      }
    }

    const ratioGr = grLcr / grSang
    const gbAttendus = ratioGr * gbSang
    const gbCorriges = Math.max(0, Math.round(gbLcr - gbAttendus))

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    if (gbCorriges <= 5) severity = 'low'
    else if (gbCorriges <= 50) severity = 'moderate'
    else if (gbCorriges <= 500) severity = 'high'
    else severity = 'critical'

    return {
      value: gbCorriges,
      label: `Leucocytes corrigés : ${gbCorriges} /mm³`,
      severity,
      details: {
        'Leucocytes mesurés LCR': `${gbLcr} /mm³`,
        'GR LCR': `${grLcr} /mm³`,
        'Leucocytes sanguins': `${gbSang} /mm³`,
        'GR sanguins': `${grSang} /mm³`,
        'Ratio GR': ratioGr.toFixed(6),
        'Leucocytes attendus (contamination)': `${Math.round(gbAttendus)} /mm³`,
        'Leucocytes corrigés': `${gbCorriges} /mm³`,
      },
      ranges: [
        { min: 0, max: 5, label: 'Normal (≤ 5/mm³)', severity: 'low', recommendation: 'Pas de méningite. La pléiocytose initiale était due à la contamination sanguine.' },
        { min: 6, max: 50, label: 'Pléiocytose légère', severity: 'moderate', recommendation: 'Suspect possible (méningite virale, début de méningite bactérienne, inflammation). Contrôle à 48h si indication.' },
        { min: 51, max: 500, label: 'Pleiocytose moderee', severity: 'high', recommendation: 'Meningite probable. Antibiotherapie empirique (cephalosporine 3e G + amoxicilline + aciclovir selon contexte). Bilan etiologique complet.' },
        { min: 501, max: 50000, label: 'Pléiocytose sévère', severity: 'critical', recommendation: 'Méningite très probable. Antibiothérapie IV urgente. Corticothérapie (dexaméthasone) avant antibiotiques si suspicion méningite bactérienne. Transfert USC.' },
      ],
    }
  },
  interpretation: `La **correction des leucocytes dans le LCR** permet d estimer le nombre réel de globules blancs en cas de ponction lombaire (PL) hémorragique.

**Formule :**
*Leucocytes corrigés = Leucocytes LCR - (GR LCR × Leucocytes sang / GR sang)*

**Valeurs normales :**
- LCR normal : < 5 leucocytes/mm³
- Si GR présents : 1 leucocyte pour 500-1000 GR est attendu (selon la formule)

Cette correction estime le nombre de leucocytes réellement présents dans le LCR, après soustraction de ceux provenant de la contamination sanguine.`,
  clinicalCommentary: `La ponction lombaire hémorragique (traumatique) est fréquente, surtout chez l enfant et le sujet âgé. La correction des leucocytes n est qu une estimation. D autres paramètres sont utiles : recherche de bilirubine (xanthochromie), dosage des lactates, PCR entérovirus/herpès. En cas de PL hémorragique, répéter la PL à l étage supérieur peut être envisagé. La décision d antibiothérapie ne repose pas uniquement sur la formule de correction.`,
  references: [
    {
      type: 'pubmed',
      title: 'Negrini B et al. Correction of CSF white blood cell counts for blood contamination. Pediatr Infect Dis J 2002',
      pmid: '11932575',
    },
    {
      type: 'guideline',
      title: 'SPILF — Méningites infectieuses (Recommandations 2021)',
      url: 'https://www.infectiologie.com',
    },
  ],
}
export default corrGbPl
