import type { FormulaDefinition } from '../types'

const centor: FormulaDefinition = {
  id: 'centor',
  slug: 'centor',
  name: 'Centor / Mac Isaac — Angine bactérienne',
  specialty: 'orl',
  category: 'Infectiologie ORL',
  description: 'Score clinique prédictif d\'angine streptococcique (Streptococcus pyogenes) — 4 critères de Centor + âge selon Mac Isaac',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'fever',
      type: 'boolean',
      label: 'Fièvre > 38°C (ou histoire de fièvre dans les 24h)',
    },
    {
      id: 'exudate',
      type: 'boolean',
      label: 'Exsudats amygdaliens (pus, enduit blanchâtre)',
    },
    {
      id: 'adenopathy',
      type: 'boolean',
      label: 'Adénopathies cervicales antérieures sensibles',
    },
    {
      id: 'cough',
      type: 'boolean',
      label: 'Absence de toux (toux = argument contre angine bactérienne)',
    },
    {
      id: 'age',
      type: 'radio',
      label: 'Âge du patient',
      options: [
        { value: -1, label: '≤ 3 ans' },
        { value: 0, label: '4–14 ans' },
        { value: 0, label: '15–44 ans' },
        { value: -1, label: '≥ 45 ans' },
      ],
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.fever) score++
    if (values.exudate) score++
    if (values.adenopathy) score++
    if (values.cough) score++

    // Mac Isaac adjustment for age
    const age = values.age ?? 0
    // age options above: some are -1, some are 0
    // The original Mac Isaac: subtract 1 if ≤3 or ≥45
    // In our radio: ≤3 ans = -1, ≥45 ans = -1, others = 0
    if (age === -1) score-- // ≤3 or ≥45

    const risk = score <= 0 ? 5 : score === 1 ? 10 : score === 2 ? 17 : score === 3 ? 32 : score >= 4 ? 56 : 5

    if (score >= 4) {
      return {
        value: score,
        label: 'Score 4 — Streptocoque très probable',
        risk,
        riskUnit: '% risque SGA',
        severity: 'high',
        ranges: [
          { min: 4, max: 5, label: 'Score ≥ 4 — HAUT RISQUE', severity: 'high', recommendation: 'TDR rapide streptocoque. Si positif ou forte suspicion : antibiothérapie probabiliste (amoxicilline 50 mg/kg/j 6j). Si allergie : céphalosporine ou macrolide. Aucune indication de TDR si score < 2.' },
          { min: 2, max: 3, label: 'Score 2–3 — RISQUE INTERMÉDIAIRE', severity: 'moderate', recommendation: 'TDR rapide streptocoque obligatoire. Antibiothérapie uniquement si TDR positif. Pas d\'antibiothérapie probabiliste sans TDR.' },
          { min: 0, max: 1, label: 'Score 0–1 — FAIBLE RISQUE', severity: 'low', recommendation: 'Pas de TDR. Pas d\'antibiothérapie. Traitement symptomatique (antalgiques, AINS). Cause virale quasi certaine.' },
        ],
      }
    }

    if (score >= 2) {
      return {
        value: score,
        label: `Score ${score} — Risque intermédiaire`,
        risk,
        riskUnit: '% risque SGA',
        severity: 'moderate',
        ranges: [
          { min: 0, max: 1, label: 'Score 0–1 — FAIBLE RISQUE', severity: 'low', recommendation: 'Pas de TDR. Pas d\'antibiothérapie.' },
          { min: 2, max: 3, label: 'Score 2–3 — INTERMÉDIAIRE', severity: 'moderate', recommendation: 'TDR obligatoire. ATB si TDR positif.' },
          { min: 4, max: 5, label: 'Score ≥ 4 — HAUT RISQUE', severity: 'high', recommendation: 'TDR + ATB probabiliste.' },
        ],
      }
    }

    return {
      value: score,
      label: `Score ${score} — Faible risque`,
      risk,
      riskUnit: '% risque SGA',
      severity: 'low',
      ranges: [
        { min: 0, max: 1, label: 'Score 0–1 — FAIBLE RISQUE', severity: 'low', recommendation: 'Cause virale > 95%. Pas d\'ATB.' },
        { min: 2, max: 3, label: 'Score 2–3 — INTERMÉDIAIRE', severity: 'moderate' },
        { min: 4, max: 5, label: 'Score ≥ 4 — HAUT RISQUE', severity: 'high' },
      ],
    }
  },
  interpretation: `Le **score de Centor** (4 critères) modifié par **Mac Isaac** (ajustement sur l'âge) est le score clinique recommandé par la HAS et la SFORL pour l’angine.

**Critères (1 point chacun) :**
- Fièvre > 38°C
- Exsudats amygdaliens
- Adénopathies cervicales douloureuses
- Absence de toux

**Ajustement Mac Isaac :**
- ≤ 3 ans : –1 point
- ≥ 45 ans : –1 point

**Conduite :**
- 0–1 : viral, pas de TDR, pas d’ATB
- 2–3 : TDR obligatoire, ATB si TDR+
- 4–5 : TDR + ATB probabiliste`,
  clinicalCommentary: `Score indispensable en consultation ORL et médecine générale. Ne pas oublier le TDR streptocoque pour les scores 2-3. L'angine érythémato-pultacée de l'adulte jeune peut aussi être virale (EBV, adénovirus). Le score ne remplace pas la clinique : une angine unilatérale avec odynophagie sévère peut être un abcès (péritonsillien) même avec un score bas. L'antibiothérapie de première intention reste l’amoxicilline 50 mg/kg/j × 6 jours.`,
  references: [
    {
      type: 'pubmed',
      title: 'Centor RM et al. The diagnosis of strep throat in adults. J Gen Intern Med 1981',
      pmid: '7054476',
    },
    {
      type: 'pubmed',
      title: 'McIsaac WJ et al. A clinical score to reduce unnecessary antibiotic use in sore throat. CMAJ 1998',
      pmid: '9583928',
    },
    {
      type: 'guideline',
      title: 'HAS — Antibiothérapie des infections ORL (2021)',
      url: 'https://www.has-sante.fr/jcms/c_1260832',
    },
  ],
}

export default centor
