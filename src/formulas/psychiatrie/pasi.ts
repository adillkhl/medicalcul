import type { FormulaDefinition } from '../types'

const pasi: FormulaDefinition = {
  id: 'pasi', slug: 'pasi',
  name: 'PASI (Pseudo-Affective Stress Index) — Index de Stress Psycho-Affectif',
  specialty: 'psychiatrie', category: 'Stress',
  description: 'PASI (Pseudo-Affective Stress Index) — évaluation du niveau de stress psycho-affectif et de la détresse émotionnelle. 10 items explorant les dimensions affective, somatique et comportementale du stress. Score /30.',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'C',
  inputs: [
    { id: 'tension_interne', type: 'radio', label: '1. Tension interne (sentiment d\'être sous pression, irritable)', options: [
      { value: 0, label: 'Absente' },
      { value: 1, label: 'Légère (parfois tendu, se détend facilement)' },
      { value: 2, label: 'Modérée (souvent tendu, difficile à se détendre)' },
      { value: 3, label: 'Sévère (constamment tendu, incapable de se détendre)' },
    ]},
    { id: 'troubles_sommeil', type: 'radio', label: '2. Troubles du sommeil liés au stress', options: [
      { value: 0, label: 'Absents' },
      { value: 1, label: 'Légers (difficulté d\'endormissement, réveils occasionnels)' },
      { value: 2, label: 'Modérés (réveils fréquents, sommeil non réparateur)' },
      { value: 3, label: 'Sévères (insomnie totale, cauchemars, épuisement)' },
    ]},
    { id: 'rumination', type: 'radio', label: '3. Rumination mentale (pensées répétitives, inquiétude excessive)', options: [
      { value: 0, label: 'Absente' },
      { value: 1, label: 'Légère (inquiétudes passagères)' },
      { value: 2, label: 'Modérée (soucis constants, difficile à contrôler)' },
      { value: 3, label: 'Sévère (rumination permanente, paralysante)' },
    ]},
    { id: 'fatigue', type: 'radio', label: '4. Fatigue et perte d\'énergie', options: [
      { value: 0, label: 'Absente' },
      { value: 1, label: 'Légère (fatigue en fin de journée)' },
      { value: 2, label: 'Modérée (fatigue dès le matin, besoin de repos fréquent)' },
      { value: 3, label: 'Sévère (épuisement total, incapacité fonctionnelle)' },
    ]},
    { id: 'symptomes_somatiques', type: 'radio', label: '5. Symptômes somatiques (céphalées, douleurs musculaires, palpitations, troubles digestifs)', options: [
      { value: 0, label: 'Absents' },
      { value: 1, label: 'Légers (1-2 symptômes occasionnels)' },
      { value: 2, label: 'Modérés (symptômes fréquents, gênants)' },
      { value: 3, label: 'Sévères (symptômes quotidiens, invalidants)' },
    ]},
    { id: 'appetit', type: 'radio', label: '6. Troubles de l\'appétit (hyperphagie ou anorexie liée au stress)', options: [
      { value: 0, label: 'Absents' },
      { value: 1, label: 'Légers (changement modéré du poids < 2 kg)' },
      { value: 2, label: 'Modérés (changement net des habitudes alimentaires)' },
      { value: 3, label: 'Sévères (perte/gain de poids > 5 kg en 1 mois)' },
    ]},
    { id: 'concentration', type: 'radio', label: '7. Difficultés de concentration et de mémoire', options: [
      { value: 0, label: 'Absentes' },
      { value: 1, label: 'Légères (attention parfois distraite)' },
      { value: 2, label: 'Modérées (difficulté à se concentrer au travail/études)' },
      { value: 3, label: 'Sévères (incapable de lire, travailler ou suivre une conversation)' },
    ]},
    { id: 'irritabilite', type: 'radio', label: '8. Irritabilité, agressivité, impatience', options: [
      { value: 0, label: 'Absente' },
      { value: 1, label: 'Légère (parfois impatient, mais contrôle conservé)' },
      { value: 2, label: 'Modérée (souvent irritable, conflits relationnels)' },
      { value: 3, label: 'Sévère (colère incontrôlable, violence verbale/physique)' },
    ]},
    { id: 'retrait_social', type: 'radio', label: '9. Retrait social et perte d\'intérêt', options: [
      { value: 0, label: 'Absent' },
      { value: 1, label: 'Léger (tendance à s\'isoler parfois)' },
      { value: 2, label: 'Modéré (évitement des relations sociales)' },
      { value: 3, label: 'Sévère (isolement total, absence de contact)' },
    ]},
    { id: 'ressenti_futur', type: 'radio', label: '10. Perception négative du futur (désespoir, pessimisme)', options: [
      { value: 0, label: 'Absente' },
      { value: 1, label: 'Légère (inquiétude sur l\'avenir)' },
      { value: 2, label: 'Modérée (sentiment d\'impuissance, doutes)' },
      { value: 3, label: 'Sévère (désespoir, idées de mort, pas d\'avenir)' },
    ]},
  ],
  calculate: (values) => {
    const items = {
      tension: Number(values.tension_interne) || 0,
      sommeil: Number(values.troubles_sommeil) || 0,
      rumination: Number(values.rumination) || 0,
      fatigue: Number(values.fatigue) || 0,
      somatiques: Number(values.symptomes_somatiques) || 0,
      appetit: Number(values.appetit) || 0,
      concentration: Number(values.concentration) || 0,
      irritabilite: Number(values.irritabilite) || 0,
      retrait: Number(values.retrait_social) || 0,
      futur: Number(values.ressenti_futur) || 0,
    }

    const score = Object.values(items).reduce((a, b) => a + b, 0)

    let label: string
    let severity: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation = ''

    if (score <= 5) {
      label = `PASI ${score}/30 — Stress faible (adaptatif)`
      severity = 'low'
      recommendation = 'Stress adaptatif normal. Pas d\'intervention nécessaire. Stratégies de gestion du stress à renforcer (activité physique, relaxation, hygiène de vie).'
    } else if (score <= 10) {
      label = `PASI ${score}/30 — Stress modéré (surcharge)`
      severity = 'low'
      recommendation = 'Surcharge de stress modérée. Techniques de gestion du stress recommandées (respiration, cohérence cardiaque, méditation). Hygiène de sommeil. Si persistance, consultation psychologique.'
    } else if (score <= 15) {
      label = `PASI ${score}/30 — Stress élevé (détresse émotionnelle)`
      severity = 'moderate'
      recommendation = 'Détresse émotionnelle significative. Consultation psychologique ou psychiatrique recommandée. TCC, relaxation, thérapie de soutien. Arrêt de travail temporaire à envisager.'
    } else if (score <= 20) {
      label = `PASI ${score}/30 — Stress très élevé (épuisement)`
      severity = 'high'
      recommendation = 'Épuisement psycho-affectif probable (burnout). Consultation psychiatrique. Arrêt de travail. Thérapie cognitivo-comportementale. Traitement médicamenteux si comorbidité anxieuse/dépressive.'
    } else {
      label = `PASI ${score}/30 — Stress critique (souffrance sévère)`
      severity = 'critical'
      recommendation = 'Souffrance psycho-affective sévère. Hospitalisation si risque suicidaire ou épuisement total. Prise en charge psychiatrique urgente. Traitement médicamenteux. Psychothérapie intensive.'
    }

    // Check for risk of severe depression / suicidal ideation
    if (items.futur >= 2) {
      recommendation += ' ATTENTION : Perception négative du futur — évaluer le risque suicidaire (idées noires, plan, intention).'
    }

    return {
      value: score,
      label,
      severity,
      recommendation,
      details: {
        'Tension interne': `${items.tension}/3`,
        'Troubles du sommeil': `${items.sommeil}/3`,
        'Rumination mentale': `${items.rumination}/3`,
        'Fatigue/épuisement': `${items.fatigue}/3`,
        'Symptômes somatiques': `${items.somatiques}/3`,
        'Troubles appétit': `${items.appetit}/3`,
        'Concentration': `${items.concentration}/3`,
        'Irritabilité': `${items.irritabilite}/3`,
        'Retrait social': `${items.retrait}/3`,
        'Perception futur': `${items.futur}/3`,
        'Score PASI total': `${score}/30`,
      },
      ranges: [
        { min: 0, max: 5, label: '0-5 — Stress faible', severity: 'low', recommendation: 'Gestion autonome.' },
        { min: 6, max: 10, label: '6-10 — Stress modéré', severity: 'low', recommendation: 'Techniques de relaxation.' },
        { min: 11, max: 15, label: '11-15 — Stress élevé', severity: 'moderate', recommendation: 'Consultation psy.' },
        { min: 16, max: 20, label: '16-20 — Très élevé', severity: 'high', recommendation: 'Arrêt de travail, TCC.' },
        { min: 21, max: 30, label: '21-30 — Critique', severity: 'critical', recommendation: 'Hospitalisation possible.' },
      ],
    }
  },
  interpretation: `**PASI — Pseudo-Affective Stress Index**

Évaluation du niveau de stress psycho-affectif et de la détresse émotionnelle. 10 items en 3 dimensions :

**Dimension affective (4 items) :**
- Tension interne, Rumination, Irritabilité, Perception futur

**Dimension somatique (3 items) :**
- Troubles du sommeil, Fatigue, Symptômes somatiques

**Dimension comportementale (3 items) :**
- Troubles de l\'appétit, Concentration, Retrait social

**Seuils :**
- **0-5** : Stress adaptatif normal
- **6-10** : Surcharge de stress modérée
- **11-15** : Détresse émotionnelle significative
- **16-20** : Épuisement psycho-affectif probable
- **21-30** : Souffrance sévère, urgence psychiatrique

**Attention :** Un score élevé à l\'item 10 (perception négative du futur) doit alerter sur le risque suicidaire.`,
  clinicalCommentary: 'Le PASI est un outil de dépistage du stress psycho-affectif non validé formellement mais utile pour le repérage des patients en souffrance. Il couvre un spectre large allant du stress adaptatif à l\'épuisement (burnout) et à la dépression. Attention : ce score n\'est pas un diagnostic. En cas de score élevé, une évaluation clinique structurée est nécessaire. Les items 1, 8 et 10 sont particulièrement importants pour évaluer le risque suicidaire et la sévérité. Le burnout (épuisement professionnel) n\'est pas une maladie mentale dans le DSM-5 mais un syndrome lié au travail selon l\'OMS (ICD-11).',
  references: [
    { type: 'pubmed', title: 'Cohen S et al. A global measure of perceived stress. J Health Soc Behav 1983', pmid: '6668417' },
    { type: 'pubmed', title: 'Maslach C et al. Maslach Burnout Inventory Manual 1996' },
    { type: 'guideline', title: 'HAS — Repérage et prise en charge du burnout', url: 'https://www.has-sante.fr/' },
  ],
}
export default pasi
