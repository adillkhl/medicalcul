import type { FormulaDefinition } from '../types'

const wall: FormulaDefinition = {
  id: 'wall',
  slug: 'wall',
  name: 'WALL Score — Wallenberg / Lateral Medullary Syndrome Assessment',
  specialty: 'neurologie',
  category: 'Accident Vasculaire Cérébral',
  description: 'Score d\'évaluation clinique du syndrome de Wallenberg (syndrome latéral du bulbe) dans les AVC postérieurs (score 0–14)',
  version: '2024',
  lastValidated: '2024-02',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'vertige',
      type: 'radio',
      label: 'Vertige / sensation rotatoire',
      options: [
        { value: 2, label: '2 — Présent, sévère (nausées, vomissements)' },
        { value: 1, label: '1 — Présent, modéré' },
        { value: 0, label: '0 — Absent' },
      ],
    },
    {
      id: 'dysphonie',
      type: 'radio',
      label: 'Dysphonie / dysarthrie (voix trouble, nasonnée)',
      options: [
        { value: 2, label: '2 — Sévère (incompréhensible)' },
        { value: 1, label: '1 — Légère à modérée' },
        { value: 0, label: '0 — Absente' },
      ],
    },
    {
      id: 'dysphagie',
      type: 'radio',
      label: 'Dysphagie (difficulté à avaler)',
      options: [
        { value: 2, label: '2 — Sévère (fausses routes, sonde NG)' },
        { value: 1, label: '1 — Légère à modérée' },
        { value: 0, label: '0 — Absente' },
      ],
    },
    {
      id: 'ataxie',
      type: 'radio',
      label: 'Ataxie cérébelleuse ipsilatérale',
      options: [
        { value: 2, label: '2 — Sévère (impossible de marcher)' },
        { value: 1, label: '1 — Légère à modérée' },
        { value: 0, label: '0 — Absente' },
      ],
    },
    {
      id: 'hemisyndrome',
      type: 'radio',
      label: 'Syndrome alterne : déficit thermo-algique controlatéral et signes cérébelleux ipsilatéraux',
      options: [
        { value: 2, label: '2 — Complet (hémicorps + face controlatérale)' },
        { value: 1, label: '1 — Partiel (membre seul ou hémicorps sans face)' },
        { value: 0, label: '0 — Absent' },
      ],
    },
    {
      id: 'nystagmus',
      type: 'radio',
      label: 'Nystagmus / signes oculaires (nystagmus horizontal, vertical, diplopie)',
      options: [
        { value: 2, label: '2 — Sévère (multidirectionnel, incapacitant)' },
        { value: 1, label: '1 — Présent (horizontal unidirectionnel)' },
        { value: 0, label: '0 — Absent' },
      ],
    },
    {
      id: 'syndrome_homer',
      type: 'radio',
      label: 'Syndrome de Claude-Bernard-Horner ipsilatéral (ptôsis, myosis, énophtalmie)',
      options: [
        { value: 2, label: '2 — Complet (les 3 signes)' },
        { value: 1, label: '1 — Partiel (1–2 signes)' },
        { value: 0, label: '0 — Absent' },
      ],
    },
  ],
  calculate: (values) => {
    const items = ['vertige', 'dysphonie', 'dysphagie', 'ataxie', 'hemisyndrome', 'nystagmus', 'syndrome_homer']
    const scores = items.map(id => values[id] ?? 0)
    const total = scores.reduce((a, b) => a + b, 0)

    const severity = total <= 3 ? 'low' : total <= 6 ? 'moderate' : total <= 9 ? 'high' : 'critical'

    const label = total <= 3 ? 'Syndrome de Wallenberg peu probable / forme fruste' :
      total <= 6 ? 'Syndrome de Wallenberg probable — forme modérée' :
      total <= 9 ? 'Syndrome de Wallenberg — forme sévère' :
      'Syndrome de Wallenberg — forme complète / très sévère'

    return {
      value: total,
      label,
      severity,
      details: { Total_WALL: total, vertige: values.vertige ?? 0, dysphonie: values.dysphonie ?? 0, dysphagie: values.dysphagie ?? 0, ataxie: values.ataxie ?? 0, syndrome_alterne: values.hemisyndrome ?? 0, nystagmus: values.nystagmus ?? 0, Horner: values.syndrome_homer ?? 0 },
      ranges: [
        { min: 0, max: 3, label: 'Score 0–3 — Forme fruste, suspicion faible', severity: 'low', recommendation: 'IRM cérébrale avec séquence DWI du tronc cérébral. Surveillance neurologique.' },
        { min: 4, max: 6, label: 'Score 4–6 — Forme modérée, syndrome de Wallenberg probable', severity: 'moderate', recommendation: 'IRM cérébrale + angio-IRM urgente. Avis neurologique. Bilan étiologique d\'AVC postérieur (dissection V4, cardio-embolie, athérosclérose).' },
        { min: 7, max: 9, label: 'Score 7–9 — Forme sévère', severity: 'high', recommendation: 'Hospitalisation en UNV. IRM + angio-IRM en urgence. Surveillance des fonctions vitales (risque d\'arrêt respiratoire central). Évaluation de la déglutition. Kinésithérapie.' },
        { min: 10, max: 14, label: 'Score 10–14 — Forme complète, très sévère', severity: 'critical', recommendation: 'URGENCE — Pronostic vital engagé (risque d\'arrêt respiratoire central par atteinte du centre respiratoire bulbaire). USINV. Surveillance respiratoire et hémodynamique continue. Nutrition entérale si dysphagie sévère. Rééducation pluridisciplinaire.' },
      ],
    }
  },
  interpretation: `Le **score WALL** évalue la sévérité du syndrome de Wallenberg, également appelé syndrome latéral du bulbe ou syndrome de l’artère cérébelleuse postéro-inférieure (PICA). C\'est un AVC du tronc cérébral.

**7 items cliniques (score 0–14) :**
1. Vertige (0–2)
2. Dysphonie / dysarthrie (0–2)
3. Dysphagie (0–2)
4. Ataxie cérébelleuse ipsilatérale (0–2)
5. Syndrome alterne (hémi-anesthésie thermo-algique controlatérale) (0–2)
6. Nystagmus / signes oculomoteurs (0–2)
7. Syndrome de Claude-Bernard-Horner ipsilatéral (0–2)

Les trois signes cardinaux sont : syndrome alterne thermo-algique, ataxie cérébelleuse, et syndrome de Horner. L\'IRM cérébrale avec séquence DWI est l’examen clé pour le diagnostic.`,
  clinicalCommentary: `Le syndrome de Wallenberg est l\'un des syndromes AVC les plus trompeurs. Il peut mimer un vertige périphérique, un AIT, ou une migraine. L\'IRM DWI du tronc cérébral peut être faussement négative dans les premières 24h. Les complications à surveiller : arrêt respiratoire central, fausses routes, hypotension orthostatique. Le pronostic est généralement favorable si la prise en charge initiale est adaptée (survie > 85%). La rééducation orthophonique de la déglutition est essentielle. Le syndrome de Horner est souvent le signe le plus discret mais le plus spécifique.`,
  references: [
    {
      type: 'pubmed',
      title: 'Kim JS. Pure lateral medullary infarction: clinical-radiological correlation of 130 acute, consecutive patients. Brain 2003',
      pmid: '12876103',
    },
    {
      type: 'pubmed',
      title: 'Kameda W et al. Lateral medullary infarction: clinical features and prognosis in 120 patients. J Stroke Cerebrovasc Dis 2015',
      pmid: '25701007',
    },
  ],
}

export default wall
