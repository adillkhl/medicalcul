import type { FormulaDefinition } from '../types'

const mwd6: FormulaDefinition = {
  id: 'mwd6',
  slug: 'mwd6',
  name: 'Test de Marche 6 minutes (6MWT)',
  specialty: 'medecine_interne',
  category: 'Fonctionnel',
  description: 'Test de marche de 6 minutes — Évaluation de la capacité fonctionnelle sous-maximale à l\'effort.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'distance',
      type: 'number',
      label: 'Distance parcourue en 6 minutes (mètres)',
      min: 10,
      max: 900,
      step: 1,
      placeholder: '450',
    },
    {
      id: 'sexe',
      type: 'radio',
      label: 'Sexe du patient',
      options: [
        { value: 1, label: 'Homme' },
        { value: 2, label: 'Femme' },
      ],
    },
    {
      id: 'age',
      type: 'number',
      label: 'Âge (ans)',
      min: 18,
      max: 100,
      step: 1,
      placeholder: '60',
    },
    {
      id: 'taille',
      type: 'number',
      label: 'Taille (cm)',
      min: 120,
      max: 220,
      step: 1,
      placeholder: '170',
    },
    {
      id: 'poids',
      type: 'number',
      label: 'Poids (kg)',
      min: 30,
      max: 250,
      step: 1,
      placeholder: '75',
    },
  ],
  calculate: (values) => {
    const dist = values.distance ?? 450
    const sexe = values.sexe ?? 1
    const age = values.age ?? 60
    const taille = values.taille ?? 170
    const poids = values.poids ?? 75

    // Reference equations (Enright & Sherrill 1998)
    let distPredite: number
    if (sexe === 1) {
      distPredite = 7.57 * taille - 5.02 * age - 1.76 * poids - 309
    } else {
      distPredite = 2.11 * taille - 5.78 * age - 2.29 * poids + 667
    }
    distPredite = Math.round(distPredite)
    const pourcentage = Math.round((dist / distPredite) * 100)

    if (pourcentage >= 100) {
      return {
        value: dist,
        label: `Distance = ${dist} m (${pourcentage}% de la théorique) — Normale`,
        severity: 'low',
        ranges: [
          { min: 100, max: 999, label: '≥ 100% de la théorique : Normale', severity: 'low' },
          { min: 80, max: 99, label: '80–99% : Légèrement diminuée', severity: 'low' },
          { min: 60, max: 79, label: '60–79% : Modérément diminuée', severity: 'moderate' },
          { min: 0, max: 59, label: '< 60% : Sévèrement diminuée', severity: 'high' },
        ],
      }
    }
    if (pourcentage >= 80) {
      return {
        value: dist,
        label: `Distance = ${dist} m (${pourcentage}% de la théorique) — Légère diminution`,
        severity: 'low',
        ranges: [
          { min: 0, max: 59, label: '< 60% : Sévère', severity: 'high' },
          { min: 60, max: 79, label: '60–79% : Modérée', severity: 'moderate' },
          { min: 80, max: 99, label: '80–99% : Légère', severity: 'low' },
          { min: 100, max: 999, label: '≥ 100% : Normale', severity: 'low' },
        ],
      }
    }
    if (pourcentage >= 60) {
      return {
        value: dist,
        label: `Distance = ${dist} m (${pourcentage}% de la théorique) — Diminution modérée`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 59, label: '< 60% : Sévère', severity: 'high' },
          { min: 60, max: 79, label: '60–79% : Modérée', severity: 'moderate' },
          { min: 80, max: 99, label: '80–99% : Légère', severity: 'low' },
          { min: 100, max: 999, label: '≥ 100% : Normale', severity: 'low' },
        ],
      }
    }
    return {
      value: dist,
      label: `Distance = ${dist} m (${pourcentage}% de la théorique) — Diminution sévère`,
      severity: 'high',
      ranges: [
        { min: 0, max: 59, label: '< 60% : Sévère', severity: 'high' },
        { min: 60, max: 79, label: '60–79% : Modérée', severity: 'moderate' },
        { min: 80, max: 99, label: '80–99% : Légère', severity: 'low' },
        { min: 100, max: 999, label: '≥ 100% : Normale', severity: 'low' },
      ],
    }
  },
  interpretation: `**Test de Marche 6 minutes (6MWT)** : mesure la distance maximale parcourue en 6 min sur un terrain plat.

**Équations de référence (Enright & Sherrill) :**
- Homme : 6MWD (m) = 7,57 × taille(cm) − 5,02 × âge − 1,76 × poids(kg) − 309
- Femme : 6MWD (m) = 2,11 × taille(cm) − 5,78 × âge − 2,29 × poids(kg) + 667

**Interprétation :**
- < 80% de la théorique : altération significative de la capacité fonctionnelle
- < 60% : handicap sévère`,
  clinicalCommentary: `Très utilisé en médecine interne pour évaluer la réserve fonctionnelle (BPCO, IC, fibrose pulmonaire, HTP, myopathies). La distance minimale cliniquement importante (MCID) est d'environ 30 m. Toujours réaliser 2 tests à 30 min d'intervalle (effet apprentissage). Contre-indications : IDM récent (< 1 mois), angor instable.`,
  references: [
    {
      type: 'pubmed',
      title: 'Enright PL, Sherrill DL. Reference equations for the six-minute walk in healthy adults. Am J Respir Crit Care Med 1998',
      pmid: '9728604',
    },
    {
      type: 'guideline',
      title: 'ATS Statement: Guidelines for the Six-Minute Walk Test 2002',
      pmid: '12034143',
    },
  ],
}

export default mwd6
