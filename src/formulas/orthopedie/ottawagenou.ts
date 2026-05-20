import type { FormulaDefinition } from '../types'

const ottawagenou: FormulaDefinition = {
  id: 'ottawa-genou',
  slug: 'ottawagenou',
  name: 'Ottawa, Genou (Critères)',
  specialty: 'orthopedie',
  category: 'Genou',
  description: "Règles d'Ottawa pour le genou — critères cliniques permettant de déterminer la nécessité de réaliser une radiographie en cas de traumatisme du genou, réduisant les examens radiologiques inutiles.",
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'age',
      type: 'radio',
      label: 'Âge',
      options: [
        { value: 1, label: '< 55 ans' },
        { value: 0, label: '≥ 55 ans — CRITÈRE POSITIF' },
      ],
    },
    {
      id: 'patella_tenderness',
      type: 'boolean',
      label: 'Douleur à la palpation de la rotule (patella)',
    },
    {
      id: 'fibula_head_tenderness',
      type: 'boolean',
      label: 'Douleur à la palpation de la tête de la fibula (péroné)',
    },
    {
      id: 'flexion_impossible',
      type: 'boolean',
      label: "Incapacité de fléchir le genou à au moins 90°",
    },
    {
      id: 'weight_bearing',
      type: 'radio',
      label: 'Capacité de mise en charge',
      options: [
        { value: 0, label: "Incapable de faire 4 pas immédiatement ET aux urgences" },
        { value: 1, label: "Capable de faire 4 pas (même avec boiterie)" },
      ],
    },
  ],
  calculate: (values) => {
    const age55 = values.age as number === 0
    const patellaPain = values.patella_tenderness as boolean
    const fibulaPain = values.fibula_head_tenderness as boolean
    const noFlexion = values.flexion_impossible as boolean
    const unableBear = values.weight_bearing as number === 0

    const needXray = age55 || patellaPain || fibulaPain || noFlexion || unableBear

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (!needXray) {
      label = 'Ottawa genou NÉGATIF — Radiographie non nécessaire'
      severity = 'low'
      recommendation = "Pas de radiographie. Traitement symptomatique : repos, glace, compression. Reprise d'activité progressive. Consultation si persistance des symptômes > 7 jours."
    } else {
      label = 'Ottawa genou POSITIF — Radiographie indiquée'
      severity = 'moderate'
      recommendation = 'Radiographie du genou (face, profil, incidence axiale rotule). Rechercher : fracture du fémur distal, de la rotule, de la tête fibulaire, du plateau tibial. Classification des fractures (Schatzker pour plateau tibial).'
    }

    return {
      value: needXray ? 1 : 0,
      label,
      severity,
      details: {
        'Âge ≥ 55': age55 ? 'Oui (CRITÈRE POSITIF)' : 'Non',
        'Douleur rotule': patellaPain ? 'Oui (CRITÈRE POSITIF)' : 'Non',
        'Douleur tête fibula': fibulaPain ? 'Oui (CRITÈRE POSITIF)' : 'Non',
        'Flexion < 90°': noFlexion ? 'Oui (CRITÈRE POSITIF)' : 'Non',
        'Incapacité mise en charge': unableBear ? 'Oui (CRITÈRE POSITIF)' : 'Non',
        'Radiographie': needXray ? 'Indiquée' : 'Non nécessaire',
      },
      ranges: [
        { min: 0, max: 0, label: 'Radiographie non nécessaire', severity: 'low', recommendation: 'Traitement conservateur RICE' },
        { min: 1, max: 1, label: 'Radiographie INDISPENSABLE', severity: 'moderate', recommendation: 'Radio genou face + profil + rotule' },
      ],
    }
  },
  interpretation: "Les **règles d'Ottawa pour le genou** sont des critères cliniques de décision pour la radiographie.\n\n**Une radiographie est indiquée si UN critère est présent :**\n- Âge ≥ 55 ans\n- Douleur isolée de la rotule (sans autre douleur osseuse)\n- Douleur à la tête de la fibula\n- Incapacité de fléchir le genou à 90°\n- Incapacité de faire 4 pas (immédiatement ET à l'examen)\n\n**Performance :** sensibilité 98-100%, spécificité 25-48%.",
  clinicalCommentary: "Les règles d'Ottawa genou sont validées pour les traumatismes aigus (moins de 7 jours). Elles permettent de réduire les radiographies inutiles de 25% sans augmenter le risque de fracture méconnue. Attention : ne s'applique pas aux patients polytraumatisés, aux plaies pénétrantes, aux fractures évidentes, ou en cas d'intoxication. Le critère d'incapacité de mise en charge est le plus puissant prédicteur de fracture.",
  references: [
    {
      type: 'pubmed',
      title: 'Stiell IG et al. Derivation of a clinical decision rule for the use of radiography in acute knee injuries. Ann Emerg Med 1995',
      pmid: '7741361',
    },
    {
      type: 'pubmed',
      title: 'Stiell IG et al. Validation of the Ottawa knee rules. Ann Emerg Med 1995',
      pmid: '7741362',
    },
  ],
}

export default ottawagenou
