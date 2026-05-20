import type { FormulaDefinition } from '../types'

const feverpain: FormulaDefinition = {
  id: 'feverpain',
  slug: 'feverpain',
  name: 'FeverPAIN — Angine streptococcique (NICE)',
  specialty: 'orl',
  category: 'Infectiologie ORL',
  description: 'Score clinique FeverPAIN recommandé par le NICE pour l\'angine streptococcique — meilleure sensibilité que Centor',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'fever',
      type: 'boolean',
      label: 'Fièvre > 38°C dans les 24h',
    },
    {
      id: 'exudate',
      type: 'boolean',
      label: 'Exsudats ou pus amygdalien',
    },
    {
      id: 'attendance',
      type: 'boolean',
      label: 'Consultation rapide (< 3 jours du début des symptômes)',
    },
    {
      id: 'adenopathy',
      type: 'boolean',
      label: 'Adénopathies cervicales antérieures sensibles',
    },
    {
      id: 'cough',
      type: 'boolean',
      label: 'Absence de toux ou de rhinorrhée',
    },
  ],
  calculate: (values) => {
    let score = 0
    if (values.fever) score++
    if (values.exudate) score++
    if (values.attendance) score++
    if (values.adenopathy) score++
    if (values.cough) score++

    if (score >= 4) {
      return {
        value: score,
        label: 'Score 4–5 — Streptocoque très probable',
        risk: 62,
        riskUnit: '% risque SGA',
        severity: 'high',
        ranges: [
          { min: 4, max: 5, label: 'Score ≥ 4 — HAUT RISQUE (NICE: ATB immédiate)', severity: 'high', recommendation: 'Antibiothérapie immédiate sans TDR (NICE). Amoxicilline 50 mg/kg/j 6j ou 500 mg × 2/j 6j (adulte). Alternative : clarithromycine 250 mg × 2/j 5j.' },
          { min: 2, max: 3, label: 'Score 2–3 — RISQUE MODÉRÉ (NICE: ATB différée ou TDR)', severity: 'moderate', recommendation: 'Prescription différée d\'ATB (à prendre si pas d\'amélioration à 48h) OU TDR rapide. Conseiller antalgiques, AINS, hydratation. Retour si aggravation.' },
          { min: 0, max: 1, label: 'Score 0–1 — FAIBLE RISQUE (NICE: pas d\'ATB)', severity: 'low', recommendation: 'Pas d\'antibiothérapie. Étiologie virale quasi certaine. Antalgiques simples (paracétamol, ibuprofène). Aucun examen complémentaire.' },
        ],
      }
    }

    if (score >= 2) {
      return {
        value: score,
        label: `Score ${score} — Risque modéré`,
        risk: 28,
        riskUnit: '% risque SGA',
        severity: 'moderate',
        ranges: [
          { min: 0, max: 1, label: 'Score 0–1 — FAIBLE', severity: 'low', recommendation: 'Pas d\'ATB.' },
          { min: 2, max: 3, label: 'Score 2–3 — MODÉRÉ', severity: 'moderate', recommendation: 'ATB différée ou TDR.' },
          { min: 4, max: 5, label: 'Score 4–5 — HAUT', severity: 'high', recommendation: 'ATB immédiate.' },
        ],
      }
    }

    return {
      value: score,
      label: `Score ${score} — Faible risque`,
      risk: 13,
      riskUnit: '% risque SGA',
      severity: 'low',
      ranges: [
        { min: 0, max: 1, label: 'Score 0–1 — FAIBLE', severity: 'low', recommendation: 'Pas d\'ATB.' },
        { min: 2, max: 3, label: 'Score 2–3 — MODÉRÉ', severity: 'moderate' },
        { min: 4, max: 5, label: 'Score 4–5 — HAUT', severity: 'high' },
      ],
    }
  },
  interpretation: `Le **FeverPAIN** est le score recommandé par le NICE (National Institute for Health and Care Excellence) pour l’angine, avec une meilleure sensibilité que le Centor.

**5 critères (1 point chacun) :**
- **Fe** — Fièvre > 38°C
- **P** — Pus/exsudats amygdaliens
- **A** — Attendance rapide (< 3 jours)
- **I** — Adénopathies cervicales antérieures (Inflamed)
- **N** — Absence de toux/rhinorrhée (No cough)

**Conduite NICE :**
- 0–1 : pas d’ATB (13% risque SGA)
- 2–3 : ATB différée (prescription à prendre si pas d'amélioration à 48h)
- 4–5 : ATB immédiate (62% risque SGA)`,
  clinicalCommentary: `Le NICE recommande désormais le FeverPAIN plutôt que le Centor pour sa meilleure valeur prédictive. L'approche "prescription différée" (donner l’ordonnance mais demander d’attendre 48h avant de l'utiliser si l'état ne s’améliore pas) réduit significativement la consommation d’ATB. En France, la HAS recommande encore le Centor/Mac Isaac + TDR — dans le doute, utiliser FeverPAIN pour l’angine de l'adulte. Les 2 scores sont complémentaires.`,
  references: [
    {
      type: 'pubmed',
      title: 'Little P et al. FeverPAIN score for streptococcal pharyngitis. BMJ 2013',
      pmid: '23982467',
    },
    {
      type: 'guideline',
      title: 'NICE — Sore throat (acute): antimicrobial prescribing (NG84, 2018)',
      url: 'https://www.nice.org.uk/guidance/ng84',
    },
  ],
}

export default feverpain
