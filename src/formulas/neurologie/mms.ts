import type { FormulaDefinition } from '../types'

const mms: FormulaDefinition = {
  id: 'mms',
  slug: 'mms',
  name: 'MMS — Mini Mental State (Folstein)',
  specialty: 'neurologie',
  category: 'Neuropsychologie',
  description: 'Évaluation cognitive globale de dépistage de la démence (score 0–30)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'orientation_temps',
      type: 'radio',
      label: 'Orientation temporelle (5 items — date, mois, année, saison, jour)',
      options: [
        { value: 5, label: '5/5 — Aucune erreur' },
        { value: 4, label: '4/5 — 1 erreur' },
        { value: 3, label: '3/5 — 2 erreurs' },
        { value: 2, label: '2/5 — 3 erreurs' },
        { value: 1, label: '1/5 — 4 erreurs' },
        { value: 0, label: '0/5 — 5 erreurs' },
      ],
    },
    {
      id: 'orientation_lieu',
      type: 'radio',
      label: 'Orientation spatiale (5 items — hôpital/ville, étage, département, région, pays)',
      options: [
        { value: 5, label: '5/5 — Aucune erreur' },
        { value: 4, label: '4/5 — 1 erreur' },
        { value: 3, label: '3/5 — 2 erreurs' },
        { value: 2, label: '2/5 — 3 erreurs' },
        { value: 1, label: '1/5 — 4 erreurs' },
        { value: 0, label: '0/5 — 5 erreurs' },
      ],
    },
    {
      id: 'apprentissage',
      type: 'radio',
      label: 'Apprentissage (3 mots — répéter et mémoriser : cigare, fleur, porte)',
      options: [
        { value: 3, label: '3/3 — 3 mots retenus' },
        { value: 2, label: '2/3 — 2 mots retenus' },
        { value: 1, label: '1/3 — 1 mot retenu' },
        { value: 0, label: '0/3 — Aucun mot retenu' },
      ],
    },
    {
      id: 'calcul',
      type: 'radio',
      label: 'Attention / Calcul (5 soustractions de 7 à partir de 100, ou épeler « MONDE » à l\'envers)',
      options: [
        { value: 5, label: '5/5 — 5 bonnes réponses' },
        { value: 4, label: '4/5 — 4 bonnes réponses' },
        { value: 3, label: '3/5 — 3 bonnes réponses' },
        { value: 2, label: '2/5 — 2 bonnes réponses' },
        { value: 1, label: '1/5 — 1 bonne réponse' },
        { value: 0, label: '0/5 — 0 bonne réponse' },
      ],
    },
    {
      id: 'rappel',
      type: 'radio',
      label: 'Rappel différé (3 mots — cigare, fleur, porte)',
      options: [
        { value: 3, label: '3/3 — 3 mots rappelés' },
        { value: 2, label: '2/3 — 2 mots rappelés' },
        { value: 1, label: '1/3 — 1 mot rappelé' },
        { value: 0, label: '0/3 — Aucun mot rappelé' },
      ],
    },
    {
      id: 'denomination',
      type: 'radio',
      label: 'Dénomination (2 items — crayon, montre)',
      options: [
        { value: 2, label: '2/2 — 2 objets nommés correctement' },
        { value: 1, label: '1/2 — 1 objet nommé' },
        { value: 0, label: '0/2 — Aucun' },
      ],
    },
    {
      id: 'repetition',
      type: 'radio',
      label: 'Répétition — « Pas de si, ni de mais »',
      options: [
        { value: 1, label: '1 — Répétition correcte' },
        { value: 0, label: '0 — Répétition incorrecte' },
      ],
    },
    {
      id: 'consigne3',
      type: 'radio',
      label: 'Compréhension orale — consigne en 3 temps (prenez le papier ▸ pliez-le ▸ jetez-le par terre)',
      options: [
        { value: 3, label: '3/3 — 3 actions réalisées' },
        { value: 2, label: '2/3 — 2 actions' },
        { value: 1, label: '1/3 — 1 action' },
        { value: 0, label: '0/3 — Aucune action' },
      ],
    },
    {
      id: 'lecture',
      type: 'radio',
      label: 'Lecture — « FERMEZ LES YEUX » écrit sur une feuille',
      options: [
        { value: 1, label: '1 — Exécute l\'ordre correctement' },
        { value: 0, label: '0 — N\'exécute pas l\'ordre' },
      ],
    },
    {
      id: 'ecriture',
      type: 'radio',
      label: 'Écriture — une phrase complète (sujet, verbe, sens)',
      options: [
        { value: 1, label: '1 — Phrase correcte' },
        { value: 0, label: '0 — Pas de phrase ou incorrecte' },
      ],
    },
    {
      id: 'copie',
      type: 'radio',
      label: 'Copie du dessin — deux pentagones qui s\'intersectent',
      options: [
        { value: 1, label: '1 — Copie correcte (10 angles, 2 intersections)' },
        { value: 0, label: '0 — Copie incorrecte' },
      ],
    },
  ],
  calculate: (values) => {
    const orientationTemps = values.orientation_temps ?? 0
    const orientationLieu = values.orientation_lieu ?? 0
    const apprentissage = values.apprentissage ?? 0
    const calcul = values.calcul ?? 0
    const rappel = values.rappel ?? 0
    const denomination = values.denomination ?? 0
    const repetition = values.repetition ?? 0
    const consigne3 = values.consigne3 ?? 0
    const lecture = values.lecture ?? 0
    const ecriture = values.ecriture ?? 0
    const copie = values.copie ?? 0

    const total = orientationTemps + orientationLieu + apprentissage + calcul + rappel + denomination + repetition + consigne3 + lecture + ecriture + copie

    const severity = total >= 27 ? 'low' : total >= 24 ? 'moderate' : total >= 19 ? 'high' : 'critical'
    const label = total >= 27 ? 'Normal' : total >= 24 ? 'Troubles cognitifs légers' : total >= 19 ? 'Démence légère à modérée' : total >= 10 ? 'Démence modérée à sévère' : 'Démence sévère'

    return {
      value: total,
      label,
      severity,
      details: { Orientation_temporelle: orientationTemps, Orientation_spatiale: orientationLieu, Apprentissage: apprentissage, Calcul: calcul, Rappel: rappel, Dénomination: denomination, Répétition: repetition, Consigne3Temps: consigne3, Lecture: lecture, Écriture: ecriture, Copie: copie },
      ranges: [
        { min: 27, max: 30, label: 'Normal', severity: 'low', recommendation: 'Absence de trouble cognitif significatif. Pas d\'exploration complémentaire nécessaire.' },
        { min: 24, max: 26, label: 'Troubles cognitifs légers (MCI suspecté)', severity: 'moderate', recommendation: 'Bilan neuropsychologique complet (évaluation des 5 domaines cognitifs). Surveillance à 6–12 mois. Recherche de facteurs de risque vasculaire.' },
        { min: 19, max: 23, label: 'Démence légère à modérée', severity: 'high', recommendation: 'Bilan étiologique complet : IRM cérébrale, bilan sanguin (TSH, B12, folate, sérologies). Consultation mémoire. Traitement symptomatique (anticholinestérasique si Alzheimer).' },
        { min: 10, max: 18, label: 'Démence modérée à sévère', severity: 'critical', recommendation: 'Prise en charge gériatrique/neurologique spécialisée. Aides sociales et humaines. Traitement médicamenteux et non médicamenteux.' },
        { min: 0, max: 9, label: 'Démence sévère', severity: 'critical', recommendation: 'Soins palliatifs cognitifs. Accompagnement institutionnel (EHPAD). Prise en charge pluridisciplinaire (IDE, ergothérapeute, psychologue).' },
      ],
    }
  },
  interpretation: `Le **Mini Mental State** (MMS ou MMSE) de Folstein est le test de dépistage cognitif le plus utilisé au monde. Il évalue 11 items en 5–10 minutes. Score sur 30.

**Domaines évalués :**
- Orientation temporelle (5 points)
- Orientation spatiale (5 points)
- Apprentissage (3 points)
- Attention / Calcul (5 points)
- Rappel différé (3 points)
- Langage : dénomination (2), répétition (1), compréhension (3), lecture (1), écriture (1)
- Praxie constructive : copie de dessin (1)

**Seuils (selon niveau socioculturel) :**
- Normal : ≥ 27
- Suspect : 24–26 (ajuster selon âge et scolarité)
- Démence légère-modérée : 19–23
- Démence modérée-sévère : 10–18
- Démence sévère : < 10

Le MMS est sensible au déclin cognitif surtout dans la maladie d’Alzheimer, mais peu sensible aux démences fronto-temporales et sous-cortico-frontales.`,
  clinicalCommentary: `Le MMS est soumis à des droits d\'auteur (© PAR) et doit être utilisé avec la version officielle. Il est très influencé par l\'âge et le niveau socioculturel. Un MMS normal n\'élimine pas un trouble cognitif débutant chez un sujet de haut niveau (effet plafond). Chez les patients avec atteinte vasculaire cérébrale, le MMS sous-estime les séquelles cognitives. Alternative libre : le MoCA (Montreal Cognitive Assessment) est plus sensible pour les troubles légers. En France, le MMS est remplacé progressivement par le MoCA dans les consultations mémoire.`,
  references: [
    {
      type: 'pubmed',
      title: 'Folstein MF et al. "Mini-mental state". A practical method for grading the cognitive state of patients for the clinician. J Psychiatr Res 1975',
      pmid: '1202204',
    },
    {
      type: 'guideline',
      title: 'HAS — Maladie d\'Alzheimer et maladies apparentées : diagnostic et prise en charge (2023)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default mms
