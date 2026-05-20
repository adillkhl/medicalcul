import type { FormulaDefinition } from '../types'

const peakflowped: FormulaDefinition = {
  id: 'peakflowped',
  slug: 'peakflowped',
  name: 'Débit Expiratoire de Pointe (Peak-Flow) — Valeurs théoriques pédiatriques',
  specialty: 'pneumologie',
  category: 'Exploration Fonctionnelle',
  description: 'Calcul du débit expiratoire de pointe (DEP) théorique chez l\'enfant selon la taille et le sexe (2–18 ans)',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'sexe',
      type: 'radio',
      label: 'Sexe',
      options: [
        { value: 0, label: 'Fille' },
        { value: 1, label: 'Garçon' },
      ],
    },
    {
      id: 'taille',
      type: 'number',
      label: 'Taille',
      unit: 'cm',
      min: 70,
      max: 200,
      step: 1,
      placeholder: 'Ex: 120',
    },
  ],
  calculate: (values) => {
    const sexe = values.sexe ?? 0
    const taille = values.taille ?? 120

    // Pediatric formula (based on height only, from Godfrey et al.)
    // DEP (L/min) = (taille - k) * factor
    // Boys: (taille * 5.3) - 424
    // Girls: (taille * 4.7) - 352
    let predicted: number
    if (sexe === 1) {
      predicted = (taille * 5.3) - 424
    } else {
      predicted = (taille * 4.7) - 352
    }

    predicted = Math.max(60, Math.round(predicted))
    const minNormal = Math.round(predicted * 0.8)

    return {
      value: predicted,
      label: `DEP théorique enfant: ${predicted} L/min`,
      severity: 'low' as const,
      details: { DEP_théorique: `${predicted} L/min`, limite_normale_basse: `${minNormal} L/min` },
      ranges: [
        { min: Math.round(predicted * 0.8), max: predicted, label: 'DEP normal (≥ 80% théorique)', severity: 'low', recommendation: 'Fonction respiratoire normale pour l\'âge et la taille.' },
        { min: Math.round(predicted * 0.6), max: Math.round(predicted * 0.8) - 1, label: 'DEP modérément diminué (60–79%)', severity: 'moderate', recommendation: 'Obstruction modérée. Réévaluation clinique. Traitement de fond à adapter. Consultation pneumopédiatrique.' },
        { min: 0, max: Math.round(predicted * 0.6) - 1, label: 'DEP sévèrement diminué (< 60%)', severity: 'high', recommendation: 'Obstruction sévère. Urgence. ß2-agonistes inhalés en nébulisation. Corticothérapie orale. Hospitalisation à discuter.' },
      ],
    }
  },
  interpretation: `Le **DEP pédiatrique** est calculé à partir de la taille de l’enfant (formule de Godfrey).

**Formules :**
- **Garçon** : DEP (L/min) = (T × 5,3) − 424
- **Fille** : DEP (L/min) = (T × 4,7) − 352

Où T = taille en cm. Applicable de 2 à 18 ans.

**Interprétation :**
- ≥ 80 % de la théorique : normal
- 60–79 % : diminution modérée
- < 60 % : diminution sévère

Le DEP en pédiatrie est utile pour le suivi de l\'asthme, la détection des exacerbations et l\'évaluation de la réponse au traitement. La variabilité diurne > 20 % évoque un asthme non contrôlé.`,
  clinicalCommentary: `Chez l’enfant, le DEP dépend essentiellement de la taille et moins de l\'âge et du sexe. La coopération de l\'enfant est essentielle : expliquer en s’amusant (souffler comme pour éteindre des bougies). Le DEP chez l’enfant a une plus grande variabilité que chez l\'adulte. Ne pas utiliser avant 5–6 ans (non reproductible). Le suivi du DEP est utile dans l\'asthme de l’enfant pour objectiver la réponse au traitement.`,
  references: [
    {
      type: 'pubmed',
      title: 'Godfrey S et al. Spirometry, lung volumes and airway resistance in normal children aged 5 to 18 years. Br J Dis Chest 1970',
      pmid: '5450099',
    },
    {
      type: 'guideline',
      title: 'Société de Pneumologie de Langue Française (SPLF) — Exploration fonctionnelle respiratoire de l\'enfant',
      url: 'https://splf.fr',
    },
  ],
}

export default peakflowped
