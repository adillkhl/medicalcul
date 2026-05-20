import type { FormulaDefinition } from '../types'

const four: FormulaDefinition = {
  id: 'four',
  slug: 'four',
  name: 'FOUR (Score) — Full Outline of UnResponsiveness',
  specialty: 'neurologie',
  category: 'Neurologie',  // Note: 'Neurologie' is a valid category name
  description: 'Évaluation du niveau de conscience et du tronc cérébral en réanimation neurologique (score 0–16)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'oeil',
      type: 'radio',
      label: 'Réponse oculaire (E — Eyes)',
      options: [
        { value: 4, label: '4 — Yeux ouverts, contact visuel, suit le doigt' },
        { value: 3, label: '3 — Yeux ouverts, pas de contact visuel' },
        { value: 2, label: '2 — Yeux fermés, s\'ouvrent à la voix' },
        { value: 1, label: '1 — Yeux fermés, s\'ouvrent à la douleur' },
        { value: 0, label: '0 — Yeux fermés, pas d\'ouverture' },
      ],
    },
    {
      id: 'moteur',
      type: 'radio',
      label: 'Réponse motrice (M — Motor)',
      options: [
        { value: 4, label: '4 — Obéit aux ordres (pouce levé, poing serré)' },
        { value: 3, label: '3 — Localise la douleur' },
        { value: 2, label: '2 — Flexion à la douleur (retrait)' },
        { value: 1, label: '1 — Extension à la douleur (décérébration)' },
        { value: 0, label: '0 — Aucune réponse / myoclonies' },
      ],
    },
    {
      id: 'tronc',
      type: 'radio',
      label: 'Réflexes du tronc cérébral (B — Brainstem)',
      options: [
        { value: 4, label: '4 — Réflexes photomoteur ET cornéen présents' },
        { value: 3, label: '3 — 1 réflexe présent, 1 absent' },
        { value: 2, label: '2 — Réflexe cornéen ou photomoteur absent' },
        { value: 1, label: '1 — Réflexe photomoteur ET cornéen absents MAIS réflexe de toux présent' },
        { value: 0, label: '0 — Aucun réflexe du tronc (photomoteur, cornéen, toux absents)' },
      ],
    },
    {
      id: 'respiration',
      type: 'radio',
      label: 'Respiration (R — Respiration)',
      options: [
        { value: 4, label: '4 — Rythme respiratoire normal, pas de ventilation' },
        { value: 3, label: '3 — Respiration de Cheyne-Stokes' },
        { value: 2, label: '2 — Respiration irrégulière / hyperventilation' },
        { value: 1, label: '1 — Respire en opposition avec le respirateur / FC mal tolérée' },
        { value: 0, label: '0 — Apnée / ventilation contrôlée sans respiration spontanée' },
      ],
    },
  ],
  calculate: (values) => {
    const oeil = values.oeil ?? 0
    const moteur = values.moteur ?? 0
    const tronc = values.tronc ?? 0
    const respiration = values.respiration ?? 0
    const total = oeil + moteur + tronc + respiration

    const getSeverity = (s: number): 'low' | 'moderate' | 'high' | 'critical' => {
      if (s >= 13) return 'low'
      if (s >= 9) return 'moderate'
      if (s >= 5) return 'high'
      return 'critical'
    }

    return {
      value: total,
      label: total >= 13 ? 'Conscience normale / légère altération' : total >= 9 ? 'Altération modérée de la conscience' : total >= 5 ? 'Altération sévère de la conscience' : 'Coma / état végétatif',
      severity: getSeverity(total),
      details: { E: oeil, M: moteur, B: tronc, R: respiration },
      ranges: [
        { min: 13, max: 16, label: 'FOUR 13–16 — Conscience normale / légère altération', severity: 'low', recommendation: 'Fonctions du tronc cérébral préservées. Surveillance neurologique standard.' },
        { min: 9, max: 12, label: 'FOUR 9–12 — Altération modérée', severity: 'moderate', recommendation: 'Atteinte neurologique modérée. Surveillance rapprochée en réanimation. Bilan étiologique urgent (TDM/IRM cérébrale).' },
        { min: 5, max: 8, label: 'FOUR 5–8 — Altération sévère', severity: 'high', recommendation: 'Coma sévère. Protection des voies aériennes. Bilan étiologique complet. Pronostic réservé.' },
        { min: 0, max: 4, label: 'FOUR 0–4 — Coma profond / état végétatif', severity: 'critical', recommendation: 'Coma aréactif. Absence de réflexes du tronc = signe de gravité extrême. Discuter pronostic et limitations thérapeutiques. EEG, potentiels évoqués.' },
      ],
    }
  },
  interpretation: `Le **score FOUR** (Full Outline of UnResponsiveness) est une alternative au Glasgow Coma Scale, spécifiquement développé pour les patients en réanimation neurologique. Il évalue 4 composantes :

**E — Eyes** (0–4) : réponse oculaire et poursuite visuelle
**M — Motor** (0–4) : réponse motrice
**B — Brainstem** (0–4) : réflexes du tronc cérébral (photomoteur, cornéen, toux)
**R — Respiration** (0–4) : patterns respiratoires

**Total : 0–16.** Avantages par rapport au GCS : évalue les réflexes du tronc cérébral, détecte les myoclonies, reconnaît le Locked-In Syndrome, ne nécessite pas la réponse verbale.`,
  clinicalCommentary: `Le FOUR est supérieur au GCS chez les patients intubés, sédatés, ou avec Locked-In Syndrome. Il est validé en réanimation neurologique. Permet de détecter une hernie transtentielle précocement (perte des réflexes du tronc). L'item respiration est particulièrement utile pour les patients ventilés. En pratique, le GCS reste plus utilisé en préhospitalier et aux urgences, le FOUR est préféré en réanimation neurologique. Un score FOUR ≤ 4 est corrélé à une très mauvaise évolution neurologique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Wijdicks EF et al. Validation of a new coma scale: The FOUR score. Ann Neurol 2005',
      pmid: '16178024',
    },
    {
      type: 'pubmed',
      title: 'Wijdicks EF et al. The FOUR score: a reliable alternative to the Glasgow Coma Scale. Neurocrit Care 2006',
      pmid: '16960292',
    },
  ],
}

export default four
