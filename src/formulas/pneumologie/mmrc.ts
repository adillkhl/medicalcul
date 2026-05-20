import type { FormulaDefinition } from '../types'

const mmrc: FormulaDefinition = {
  id: 'mmrc',
  slug: 'mmrc',
  name: 'mMRC — Échelle de Dyspnée modifiée du Medical Research Council',
  specialty: 'pneumologie',
  category: 'Dyspnée',
  description: 'Évaluation du retentissement de la dyspnée sur les activités quotidiennes, utilisée dans la BPCO et les pathologies respiratoires (grade 0–4)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'grade',
      type: 'radio',
      label: 'Degré de dyspnée dans la vie quotidienne',
      options: [
        { value: 0, label: '0 — Pas d\'essoufflement sauf en cas d\'effort important' },
        { value: 1, label: '1 — Essoufflement en montant une côte ou en marchant vite' },
        { value: 2, label: '2 — Marche plus lente que les gens du même âge à cause de l\'essoufflement ou doit s\'arrêter en marchant à son rythme' },
        { value: 3, label: '3 — S\'arrête pour reprendre son souffle après 100 m ou après quelques minutes sur le plat' },
        { value: 4, label: '4 — Trop essoufflé(e) pour quitter la maison ou s\'essouffle en s\'habillant / se déshabillant' },
      ],
    },
  ],
  calculate: (values) => {
    const grade = values.grade ?? 0

    const severity = grade <= 1 ? 'low' : grade === 2 ? 'moderate' : grade === 3 ? 'high' : 'critical'

    const label = grade === 0 ? 'mMRC 0 — Pas de dyspnée' :
      grade === 1 ? 'mMRC 1 — Dyspnée légère' :
      grade === 2 ? 'mMRC 2 — Dyspnée modérée' :
      grade === 3 ? 'mMRC 3 — Dyspnée sévère' :
      'mMRC 4 — Dyspnée très sévère'

    return {
      value: grade,
      label,
      severity,
      details: { mMRC: grade },
      ranges: [
        { min: 0, max: 0, label: 'mMRC 0 — Pas de dyspnée', severity: 'low', recommendation: 'Activité normale. Pas de limitation fonctionnelle. Groupe A (GOLD).' },
        { min: 1, max: 1, label: 'mMRC 1 — Dyspnée légère', severity: 'low', recommendation: 'Activité légèrement limitée. Groupe A/B (GOLD). Traitement bronchodilatateur de première intention si BPCO. Sevrage tabagique.' },
        { min: 2, max: 2, label: 'mMRC 2 — Dyspnée modérée', severity: 'moderate', recommendation: 'Limitation fonctionnelle modérée. Groupe B/D (GOLD). Réhabilitation respiratoire. Traitement bronchodilatateur double (LABA+LAMA).' },
        { min: 3, max: 3, label: 'mMRC 3 — Dyspnée sévère', severity: 'high', recommendation: 'Limitation sévère. Groupe E (GOLD). Réhabilitation respiratoire. Oxygenothérapie de longue durée si insuffisance respiratoire. Évaluation pour transplantation si éligible.' },
        { min: 4, max: 4, label: 'mMRC 4 — Dyspnée très sévère', severity: 'critical', recommendation: 'Handicap majeur. BPCO très sévère. Oxygenothérapie 24h/24. Soins palliatifs à discuter. Prise en charge pluridisciplinaire.' },
      ],
    }
  },
  interpretation: `L'**échelle mMRC** (modified Medical Research Council) est l\'échelle la plus utilisée pour évaluer le retentissement de la dyspnée dans la BPCO et les pathologies respiratoires chroniques.

**Grades :**
- **Grade 0** : pas d’essoufflement sauf effort important
- **Grade 1** : essoufflement en montant une côte ou en marchant vite
- **Grade 2** : marche plus lente que les gens du même âge ou doit s’arrêter en marchant à son rythme
- **Grade 3** : s\'arrête après 100 m ou quelques minutes sur le plat
- **Grade 4** : trop essoufflé pour quitter la maison ou s\'habiller

Le mMRC est un des critères de la classification GOLD ABCD (mMRC ≥ 2 = symptomatique). Il est simple, rapide et reproductible.`,
  clinicalCommentary: `Le mMRC est systématique dans l\'évaluation initiale et le suivi de la BPCO. Grade ≥ 2 = seuil de symptômes significatifs (groupe B/D dans GOLD). Le mMRC ne mesure pas la dyspnée instantanée (utiliser Borg pour ça). Simple et rapide (30 secondes), mais moins sensible que le questionnaire CAT (COPD Assessment Test) pour détecter les changements.`,
  references: [
    {
      type: 'pubmed',
      title: 'Fletcher CM. Standardised questionnaire on respiratory symptoms: a statement prepared and approved by the MRC Committee. BMJ 1960',
      pmid: 'None',
    },
    {
      type: 'guideline',
      title: 'GOLD 2024 — Global Strategy for the Diagnosis, Management and Prevention of COPD',
      url: 'https://goldcopd.org',
    },
  ],
}

export default mmrc
