import type { FormulaDefinition } from '../types'

const depistbpco: FormulaDefinition = {
  id: 'depistbpco',
  slug: 'depistbpco',
  name: 'BPCO, dépistage — Auto-questionnaire',
  specialty: 'pneumologie',
  category: 'BPCO',
  description: 'Auto-questionnaire de dépistage de la bronchopneumopathie chronique obstructive (score 0–10)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 0, label: '40–49 ans' },
        { value: 1, label: '50–59 ans' },
        { value: 2, label: '60–69 ans' },
        { value: 3, label: '≥ 70 ans' },
      ],
    },
    {
      id: 'tabac',
      type: 'radio',
      label: 'Tabagisme (paquets-années)',
      options: [
        { value: 0, label: '0–14 PA' },
        { value: 1, label: '15–29 PA' },
        { value: 2, label: '≥ 30 PA' },
      ],
    },
    {
      id: 'imc',
      type: 'radio',
      label: 'Indice de masse corporelle (kg/m²)',
      options: [
        { value: 1, label: '< 25,5 (IMC bas)' },
        { value: 0, label: '≥ 25,5' },
      ],
    },
    {
      id: 'toux',
      type: 'boolean',
      label: 'Toussez-vous le matin au réveil ?',
    },
    {
      id: 'expectorations',
      type: 'boolean',
      label: 'Avez-vous des expectorations (crachats) le matin ?',
    },
    {
      id: 'dyspnee',
      type: 'radio',
      label: 'Êtes-vous essoufflé(e) plus rapidement que les personnes de votre âge en montant une côte ?',
      options: [
        { value: 2, label: '2 — Oui, nettement' },
        { value: 1, label: '1 — Oui, légèrement' },
        { value: 0, label: '0 — Non' },
      ],
    },
    {
      id: 'allergenes',
      type: 'boolean',
      label: 'Avez-vous des allergies ?',
    },
  ],
  calculate: (values) => {
    let total = 0
    total += values.age ?? 0
    total += values.tabac ?? 0
    total += values.imc ?? 0
    if (values.toux) total += 1
    if (values.expectorations) total += 1
    total += values.dyspnee ?? 0
    if (!values.allergenes) total += 1 // Pas d’allergies = +1

    const severity = total <= 3 ? 'low' : total <= 5 ? 'moderate' : total <= 6 ? 'high' : 'critical'

    const label = total <= 3 ? 'Faible probabilité de BPCO' :
      total <= 5 ? 'Probabilité modérée de BPCO' :
      total <= 6 ? 'Probabilité élevée de BPCO' :
      'Probabilité très élevée de BPCO'

    return {
      value: total,
      label,
      severity,
      details: { score_dépistage: total },
      ranges: [
        { min: 0, max: 3, label: '0–3 — Faible probabilité', severity: 'low', recommendation: 'BPCO peu probable (< 10%). Pas d\'exploration fonctionnelle respiratoire systématique. Conseils de sevrage tabagique et activité physique.' },
        { min: 4, max: 5, label: '4–5 — Probabilité modérée', severity: 'moderate', recommendation: 'BPCO possible (20–40%). Réaliser des épreuves fonctionnelles respiratoires (EFR) avec test de réversibilité. Sevrage tabagique.' },
        { min: 6, max: 7, label: '6–7 — Probabilité élevée', severity: 'high', recommendation: 'BPCO probable (> 50%). EFR et consultation pneumologique. Bilan fonctionnel complet. Traitement si VEMS/CVF < 0,70.' },
        { min: 8, max: 10, label: '8–10 — Probabilité très élevée', severity: 'critical', recommendation: 'BPCO très probable (> 70%). Consultation pneumologique urgente. EFR, bilan complet. Traitement selon stade GOLD. Réhabilitation respiratoire.' },
      ],
    }
  },
  interpretation: `Ce **questionnaire de dépistage de la BPCO** (bronchopneumopathie chronique obstructive) permet d’identifier les patients à risque nécessitant des épreuves fonctionnelles respiratoires (EFR).

**Items :**
- Âge (0–3)
- Tabagisme en PA (0–2)
- IMC < 25,5 (0–1)
- Toux matinale (0–1)
- Expectorations (0–1)
- Dyspnée d'effort (0–2)
- Absence d'allergies (0–1)

**Score : 0–10.** Un score ≥ 6 justifie des EFR. Le diagnostic de BPCO repose sur le rapport VEMS/CVF < 0,70 post-bronchodilatateur.`,
  clinicalCommentary: `Ce questionnaire est utile en médecine générale pour le dépistage ciblé des fumeurs de > 40 ans. L'absence d’allergies augmente la probabilité de BPCO (vs asthme). L'IMC < 25,5 peut refléter l’emphysème (morphotype). Le dépistage précoce permet d’intervenir sur le sevrage tabagique qui est le seul traitement modifiant l'évolution. Le diagnostic définitif repose sur les EFR avec test de réversibilité.`,
  references: [
    {
      type: 'pubmed',
      title: 'Price DB et al. Development and validation of a self-scored COPD screening questionnaire. Prim Care Respir J 2006',
      pmid: '17161389',
    },
    {
      type: 'guideline',
      title: 'HAS — BPCO : diagnostic et prise en charge (2022)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default depistbpco
