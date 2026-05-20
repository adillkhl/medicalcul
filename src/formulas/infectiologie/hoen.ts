import type { FormulaDefinition } from '../types'

const hoen: FormulaDefinition = {
  id: 'hoen',
  slug: 'hoen',
  name: 'Hoen (Score)',
  specialty: 'infectiologie',
  category: 'Meningites',
  description: 'Score de Hoen pour différencier méningite bactérienne et méningite virale à partir des données du LCR et cliniques.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'gb_lcr',
      type: 'number',
      label: 'Leucocytes dans le LCR (/mm³)',
      min: 0,
      max: 50000,
      step: 1,
      placeholder: 'ex: 1200',
    },
    {
      id: 'pn_lcr',
      type: 'number',
      label: 'Polynucléaires neutrophiles dans le LCR (%)',
      min: 0,
      max: 100,
      step: 1,
      placeholder: 'ex: 80',
    },
    {
      id: 'glyc_lcr',
      type: 'number',
      label: 'Glycorachie (mmol/L)',
      min: 0,
      max: 20,
      step: 0.1,
      placeholder: 'ex: 2.0',
    },
    {
      id: 'prots_lcr',
      type: 'number',
      label: 'Protéinorachie (g/L)',
      min: 0,
      max: 20,
      step: 0.01,
      placeholder: 'ex: 1.2',
    },
    {
      id: 'glyc_sang',
      type: 'number',
      label: 'Glycémie (mmol/L)',
      min: 0,
      max: 30,
      step: 0.1,
      placeholder: 'ex: 5.5',
    },
    {
      id: 'age',
      type: 'number',
      label: 'Age du patient (années)',
      min: 0,
      max: 120,
      step: 1,
      placeholder: 'ex: 45',
    },
  ],
  calculate: (values) => {
    const gbLcr = parseFloat(values.gb_lcr) || 0
    const pn = parseFloat(values.pn_lcr) || 0
    const glycLcr = parseFloat(values.glyc_lcr) || 0
    const prots = parseFloat(values.prots_lcr) || 0
    const glycSang = parseFloat(values.glyc_sang) || 0
    const age = parseFloat(values.age) || 0

    if (gbLcr <= 0) {
      return { value: 0, label: 'Entrez les données du LCR', severity: 'low', ranges: [] }
    }

    const rapportGluc = glycSang > 0 ? glycLcr / glycSang : 0
    const scoreHoen = (0.8 * (pn > 50 ? 1 : 0)) + (0.5 * (gbLcr > 1000 ? 1 : 0)) + (0.3 * (prots > 1 ? 1 : 0)) + (0.2 * (rapportGluc < 0.4 ? 1 : 0))
    const probaBact = scoreHoen * 100

    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let label: string
    if (probaBact < 30) { severity = 'low'; label = 'Meningite virale probable' }
    else if (probaBact < 60) { severity = 'moderate'; label = 'Indetermine — Bactérienne possible' }
    else { severity = 'critical'; label = 'Meningite bactérienne probable' }

    return {
      value: parseFloat(probaBact.toFixed(1)),
      label: `Probabilité méningite bactérienne : ${probaBact.toFixed(0)} % — ${label}`,
      severity,
      details: {
        'GB LCR': `${gbLcr} /mm³`,
        'PN (%)': `${pn} %`,
        'Glycorachie': `${glycLcr} mmol/L`,
        'Protéinorachie': `${prots} g/L`,
        'Rapport glycorachie/glycémie': rapportGluc.toFixed(2),
        'Score Hoen': scoreHoen.toFixed(2),
      },
      ranges: [
        { min: 0, max: 29, label: 'Virale probable (< 30 %)', severity: 'low', recommendation: 'PCR entérovirus/herpès. Aciclovir si suspicion herpétique. Antibiothérapie à arrêter si confirmation virale. Hospitalisation surveillance.' },
        { min: 30, max: 59, label: 'Indeterminé (30-59 %)', severity: 'moderate', recommendation: 'Antibiothérapie empirique (céphalosporine 3e G + amoxicilline + aciclovir). Bilan étendu. Attendre PCR et culture.' },
        { min: 60, max: 100, label: 'Bactérienne probable (≥ 60 %)', severity: 'critical', recommendation: 'URGENCE. Antibiothérapie IV immédiate : céfotaxime 200 mg/kg/j + amoxicilline 200 mg/kg/j + dexaméthasone 10 mg avant ou avec la 1ère dose. Transfert USC. Scanner cérébral si signe d engagement.' },
      ],
    }
  },
  interpretation: `Le **score de Hoen** est un score validé pour distinguer méningite bactérienne et méningite virale. Il est calculé à partir de 4 critères.

**Critères (poids 0.2-0.8) :**
- Polynucléaires neutrophiles > 50 % : +0.8
- GB LCR > 1000/mm³ : +0.5
- Protéinorachie > 1 g/L : +0.3
- Rapport glycorachie/glycémie < 0.4 : +0.2

**Score total transformé en probabilité :**
- < 30 % : méningite virale probable
- 30-59 % : indéterminé
- ≥ 60 % : méningite bactérienne probable`,
  clinicalCommentary: `Le score de Hoen ne remplace pas le jugement clinique. Ne pas retarder l antibiothérapie en cas de suspicion forte de méningite bactérienne, même si le score est bas. La dexaméthasone doit être administrée avant ou avec la première dose d antibiotiques si suspicion de méningite bactérienne (réduction de la mortalité et des séquelles neurologiques). La PCR entérovirus et herpès simplex doit être demandée systématiquement.`,
  references: [
    {
      type: 'pubmed',
      title: 'Hoen B et al. Distinguishing bacterial from viral meningitis. Lancet 1994',
      pmid: '7913222',
    },
    {
      type: 'guideline',
      title: 'SPILF — Prise en charge des méningites infectieuses (Recommandations 2021)',
      url: 'https://www.infectiologie.com',
    },
  ],
}
export default hoen
