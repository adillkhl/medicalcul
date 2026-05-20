import type { FormulaDefinition } from '../types'

const nihss: FormulaDefinition = {
  id: 'nihss',
  slug: 'nihss',
  name: 'NIHSS — National Institutes of Health Stroke Scale',
  specialty: 'neurologie',
  category: 'Accident Vasculaire Cérébral',
  description: 'Évaluation quantitative de la sévérité des déficits neurologiques dans l\'AVC ischémique (score 0–42)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'conscience',
      type: 'radio',
      label: '1a — Niveau de conscience (GCS simplifié)',
      options: [
        { value: 0, label: '0 — Éveillé, répond normalement' },
        { value: 1, label: '1 — Répond aux stimulations mineures' },
        { value: 2, label: '2 — Répond uniquement à des stimulations répétées/douloureuses' },
        { value: 3, label: '3 — Aucune réponse / aréactif' },
      ],
    },
    {
      id: 'questions',
      type: 'radio',
      label: '1b — Questions (mois et âge du patient)',
      options: [
        { value: 0, label: '0 — Les deux réponses correctes' },
        { value: 1, label: '1 — Une réponse correcte' },
        { value: 2, label: '2 — Aucune réponse correcte' },
      ],
    },
    {
      id: 'ordres',
      type: 'radio',
      label: '1c — Ordres (fermer les yeux, serrer la main)',
      options: [
        { value: 0, label: '0 — Les deux ordres exécutés' },
        { value: 1, label: '1 — Un ordre exécuté' },
        { value: 2, label: '2 — Aucun ordre exécuté' },
      ],
    },
    {
      id: 'regard',
      type: 'radio',
      label: '2 — Regard (poursuite oculaire horizontale)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Paralysie partielle du regard (déviation corrigeable)' },
        { value: 2, label: '2 — Déviation forcée du regard / paralysie totale' },
      ],
    },
    {
      id: 'visuel',
      type: 'radio',
      label: '3 — Champ visuel (confrontation)',
      options: [
        { value: 0, label: '0 — Normal' },
        { value: 1, label: '1 — Hémianopsie latérale homonyme partielle' },
        { value: 2, label: '2 — Hémianopsie latérale homonyme complète' },
        { value: 3, label: '3 — Cécité bilatérale / hémianopsie bilatérale' },
      ],
    },
    {
      id: 'facial',
      type: 'radio',
      label: '4 — Paralysie faciale',
      options: [
        { value: 0, label: '0 — Mouvement normal et symétrique' },
        { value: 1, label: '1 — Asymétrie légère (effacement du sillon nasogénien)' },
        { value: 2, label: '2 — Paralysie faciale inférieure franche' },
        { value: 3, label: '3 — Paralysie faciale complète (supérieure et inférieure)' },
      ],
    },
    {
      id: 'brachial_g',
      type: 'radio',
      label: '5a — Motricité bras gauche (bras à 90°, 10 secondes)',
      options: [
        { value: 0, label: '0 — Maintient le bras 10s sans chute' },
        { value: 1, label: '1 — Chute avant 10s (ne touche pas le lit)' },
        { value: 2, label: '2 — Chute sur le lit avant 10s (peut résister à la gravité un temps)' },
        { value: 3, label: '3 — Aucun effort contre gravité (bras tombe immédiatement)' },
        { value: 4, label: '4 — Aucun mouvement' },
        { value: 0, label: 'NT — Amputation / fusion articulaire (non testable)' },
      ],
    },
    {
      id: 'brachial_d',
      type: 'radio',
      label: '5b — Motricité bras droit (bras à 90°, 10 secondes)',
      options: [
        { value: 0, label: '0 — Maintient 10s sans chute' },
        { value: 1, label: '1 — Chute avant 10s' },
        { value: 2, label: '2 — Chute sur le lit avant 10s' },
        { value: 3, label: '3 — Aucun effort contre gravité' },
        { value: 4, label: '4 — Aucun mouvement' },
        { value: 0, label: 'NT — Amputation / fusion articulaire (non testable)' },
      ],
    },
    {
      id: 'crural_g',
      type: 'radio',
      label: '6a — Motricité jambe gauche (jambe à 30°, 5 secondes)',
      options: [
        { value: 0, label: '0 — Maintient 5s sans chute' },
        { value: 1, label: '1 — Chute avant 5s (touche le lit mais reste élevée)' },
        { value: 2, label: '2 — Chute sur le lit, résiste partiellement à la gravité' },
        { value: 3, label: '3 — Chute immédiate, pas d\'effort contre gravité' },
        { value: 4, label: '4 — Aucun mouvement' },
        { value: 0, label: 'NT — Amputation / fusion articulaire (non testable)' },
      ],
    },
    {
      id: 'crural_d',
      type: 'radio',
      label: '6b — Motricité jambe droite (jambe à 30°, 5 secondes)',
      options: [
        { value: 0, label: '0 — Maintient 5s sans chute' },
        { value: 1, label: '1 — Chute avant 5s' },
        { value: 2, label: '2 — Chute sur le lit, résiste partiellement' },
        { value: 3, label: '3 — Chute immédiate' },
        { value: 4, label: '4 — Aucun mouvement' },
        { value: 0, label: 'NT — Amputation / fusion articulaire (non testable)' },
      ],
    },
    {
      id: 'ataxie',
      type: 'radio',
      label: '7 — Ataxie des membres (doigt-nez, talon-genou)',
      options: [
        { value: 0, label: '0 — Absente' },
        { value: 1, label: '1 — Ataxie d\'un membre' },
        { value: 2, label: '2 — Ataxie de deux membres' },
      ],
    },
    {
      id: 'sensoriel',
      type: 'radio',
      label: '8 — Sensibilité (épingle, face/bras/tronc/jambe)',
      options: [
        { value: 0, label: '0 — Normale' },
        { value: 1, label: '1 — Hypoesthésie légère à modérée' },
        { value: 2, label: '2 — Perte sensorielle sévère ou totale' },
      ],
    },
    {
      id: 'langage',
      type: 'radio',
      label: '9 — Langage (description d\'image, dénomination)',
      options: [
        { value: 0, label: '0 — Normal (pas d\'aphasie)' },
        { value: 1, label: '1 — Aphasie légère à modérée (compréhension partielle)' },
        { value: 2, label: '2 — Aphasie sévère (langage stéréotypé, inapproprié)' },
        { value: 3, label: '3 — Mutisme / aphasie globale (aucun langage)' },
      ],
    },
    {
      id: 'dysarthrie',
      type: 'radio',
      label: '10 — Dysarthrie (prononciation)',
      options: [
        { value: 0, label: '0 — Normale' },
        { value: 1, label: '1 — Légère à modérée (parle difficilement mais compréhensible)' },
        { value: 2, label: '2 — Sévère (incompréhensible / anarthrie)' },
      ],
    },
    {
      id: 'negligence',
      type: 'radio',
      label: '11 — Extinction / Négligence (stimulation simultanée)',
      options: [
        { value: 0, label: '0 — Aucune anomalie' },
        { value: 1, label: '1 — Extinction sensorielle visuelle/tactile/auditive' },
        { value: 2, label: '2 — Héminégligence sévère (ne reconnaît pas sa main)' },
      ],
    },
  ],
  calculate: (values) => {
    const items = ['conscience', 'questions', 'ordres', 'regard', 'visuel', 'facial', 'brachial_g', 'brachial_d', 'crural_g', 'crural_d', 'ataxie', 'sensoriel', 'langage', 'dysarthrie', 'negligence']
    const scores = items.map(id => values[id] ?? 0)
    const total = scores.reduce((a, b) => a + b, 0)

    const getLabel = (t: number) => {
      if (t <= 4) return 'AVC mineur'
      if (t <= 10) return 'AVC modéré'
      if (t <= 15) return 'AVC modéré-sévère'
      if (t <= 20) return 'AVC sévère'
      return 'AVC très sévère'
    }

    const severity = total <= 4 ? 'low' : total <= 10 ? 'moderate' : total <= 15 ? 'high' : 'critical'

    return {
      value: total,
      label: `NIHSS ${total} — ${getLabel(total)}`,
      severity,
      details: { NIHSS: total },
      ranges: [
        { min: 0, max: 4, label: 'AVC mineur (NIHSS 0–4)', severity: 'low', recommendation: 'Pronostic favorable. Thrombolyse à discuter si < 4,5h et pas de contre-indication. Hospitalisation en UNV.' },
        { min: 5, max: 10, label: 'AVC modéré (NIHSS 5–10)', severity: 'moderate', recommendation: 'Thrombolyse si < 4,5h. Thrombectomie si occlusion proximale (TDM/Angio-IRM). Hospitalisation UNV.' },
        { min: 11, max: 15, label: 'AVC modéré-sévère (NIHSS 11–15)', severity: 'high', recommendation: 'Thrombolyse et thrombectomie selon critères. Hospitalisation en UNV. Surveillance rapprochée (risque d\'extension).' },
        { min: 16, max: 20, label: 'AVC sévère (NIHSS 16–20)', severity: 'high', recommendation: 'Thrombectomie mécanique si occlusion proximale. Hospitalisation USINV. Pronostic réservé.' },
        { min: 21, max: 42, label: 'AVC très sévère (NIHSS > 20)', severity: 'critical', recommendation: 'Pronostic sévère. Discussion collégiale des objectifs de soins. Soins intensifs neurovasculaires. Prise en charge multidisciplinaire.' },
      ],
    }
  },
  interpretation: `Le **NIHSS** (National Institutes of Health Stroke Scale) est l’outil standardisé d\'évaluation de la sévérité de l\'AVC ischémique en phase aiguë.

**15 items scorés 0–2, 0–3 ou 0–4 :**
1a. Vigilance (0–3)
1b. Questions (0–2)
1c. Ordres (0–2)
2. Regard (0–2)
3. Champ visuel (0–3)
4. Paralysie faciale (0–3)
5a. Bras gauche (0–4)
5b. Bras droit (0–4)
6a. Jambe gauche (0–4)
6b. Jambe droite (0–4)
7. Ataxie (0–2)
8. Sensibilité (0–2)
9. Langage (0–3)
10. Dysarthrie (0–2)
11. Négligence (0–2)

**Score : 0–42.** Un NIHSS ≥ 10 prédit un risque hémorragique post-thrombolyse. Un NIHSS ≥ 22 prédit une mortalité élevée.`,
  clinicalCommentary: `Le NIHSS est l\'échelle de référence pour l\'évaluation initiale et le suivi de l’AVC ischémique. Formez-vous (certification en ligne). Le score influence la décision de thrombolyse et de thrombectomie. Attention : le NIHSS a été conçu pour l\'AVC ischémique, pas pour l\'hémorragie méningée ou intracérébrale. Le score est pondéré sur l’hémisphère gauche (langage) — un AVC de l\'hémisphère droit peut avoir un NIHSS bas malgré un handicap significatif (négligence sous-estimée). Le NIHSS à l\'admission prédit la mortalité et le devenir fonctionnel à 3 mois.`,
  references: [
    {
      type: 'pubmed',
      title: 'Brott T et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke 1989',
      pmid: '2922746',
    },
    {
      type: 'pubmed',
      title: 'Lyden P et al. Underlying structure of the National Institutes of Health Stroke Scale. Stroke 2001',
      pmid: '11157898',
    },
  ],
}

export default nihss
