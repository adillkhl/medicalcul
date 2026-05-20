import type { FormulaDefinition } from '../types'

const houseBrackmann: FormulaDefinition = {
  id: 'house-brackmann',
  slug: 'house-brackmann',
  name: 'House & Brackmann — Paralysie faciale',
  specialty: 'orl',
  category: 'Paralysie faciale',
  description: 'Classification standardisée de la paralysie faciale périphérique (grade I–VI)',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'front',
      type: 'radio',
      label: 'Front — Mouvement',
      options: [
        { value: 1, label: 'Froncement normal, symétrique' },
        { value: 2, label: 'Froncement possible, léger affaiblissement' },
        { value: 0, label: 'Absence de mouvement, asymétrie marquée' },
      ],
    },
    {
      id: 'oeil',
      type: 'radio',
      label: 'Œil — Fermeture',
      options: [
        { value: 1, label: 'Fermeture complète, normale' },
        { value: 2, label: 'Fermeture complète avec effort minime' },
        { value: 0, label: 'Fermeture incomplète, lagophtalmie' },
      ],
    },
    {
      id: 'bouche',
      type: 'radio',
      label: 'Bouche — Mouvement',
      options: [
        { value: 1, label: 'Symétrique au repos et au mouvement' },
        { value: 2, label: 'Léger affaiblissement, asymétrie à l\'effort' },
        { value: 0, label: 'Asymétrie marquée, mouvement à peine visible' },
      ],
    },
    {
      id: 'syncinesies',
      type: 'boolean',
      label: 'Syncinésies / contractures / spasme hémifacial',
    },
    {
      id: 'lagophtalmie',
      type: 'boolean',
      label: 'Lagophtalmie sévère (exposition cornée)',
    },
  ],
  calculate: (values) => {
    const front = values.front ?? 0
    const oeil = values.oeil ?? 0
    const bouche = values.bouche ?? 0
    const syncinesies = !!values.syncinesies
    const lagophtalmie = !!values.lagophtalmie

    // Valid combinations for classification
    const totalMotor = front + oeil + bouche

    if (lagophtalmie && (syncinesies || totalMotor <= 2)) {
      return {
        value: 6,
        label: 'Grade VI — Paralysie totale',
        severity: 'critical',
        ranges: [
          { min: 6, max: 6, label: 'Grade VI — Paralysie totale', severity: 'critical', recommendation: 'Aucun mouvement. Lagophtalmie sévère ± syncinésies. Protection cornéenne immédiate. Considérer décompression chirurgicale selon étiologie et ENMG.' },
        ],
      }
    }

    if (lagophtalmie || (totalMotor <= 2 && syncinesies)) {
      return {
        value: 5,
        label: 'Grade V — Paralysie sévère',
        severity: 'critical',
        ranges: [
          { min: 5, max: 5, label: 'Grade V — Paralysie sévère', severity: 'critical', recommendation: 'Mouvement à peine visible. Lagophtalmie. Protection cornéenne. ENMG à J10-J21. Réhabilitation chirurgicale à distance si récupération incomplète.' },
        ],
      }
    }

    if (syncinesies && totalMotor >= 4) {
      return {
        value: 4,
        label: 'Grade IV — Paralysie modérée à sévère',
        severity: 'high',
        ranges: [
          { min: 4, max: 4, label: 'Grade IV — Paralysie modérée à sévère', severity: 'high', recommendation: 'Syncinésies. Rééducation orthophonique / kiné. Protection oculaire nocturne. ENMG. Suivi chirurgical si non-récupération à 6 mois.' },
        ],
      }
    }

    if (totalMotor >= 5 && syncinesies) {
      return {
        value: 3,
        label: 'Grade III — Paralysie modérée',
        severity: 'moderate',
        ranges: [
          { min: 3, max: 3, label: 'Grade III — Paralysie modérée', severity: 'moderate', recommendation: 'Syncinésies visibles. Asymétrie à l\'effort. Protection oculaire. Rééducation. ENMG si persistant > 3 semaines.' },
        ],
      }
    }

    if (totalMotor >= 5) {
      return {
        value: 2,
        label: 'Grade II — Paralysie légère',
        severity: 'low',
        ranges: [
          { min: 2, max: 2, label: 'Grade II — Paralysie légère', severity: 'low', recommendation: 'Léger affaiblissement. Fermeture oculaire complète. Pas de syncinésie. Surveillance. Traitement étiologique (corticoïdes si PFP a frigore).' },
        ],
      }
    }

    return {
      value: 1,
      label: 'Grade I — Fonction normale',
      severity: 'low',
      ranges: [
        { min: 1, max: 1, label: 'Grade I — Fonction normale', severity: 'low', recommendation: 'Fonction normale et symétrique. Aucune séquelle.' },
      ],
    }
  },
  interpretation: `La classification de **House & Brackmann** est la référence internationale pour évaluer la paralysie faciale (1985, révisée 2009).

**Grades :**
| Grade | Fonction | Caractéristiques |
|-------|----------|-----------------|
| I | Normale | Fonction normale |
| II | Légère | Léger affaiblissement, fermeture œil complète |
| III | Modérée | Asymétrie visible, syncinésies possibles |
| IV | Modérée-sévère | Syncinésies, fermeture œil incomplète |
| V | Sévère | Mouvement à peine visible, lagophtalmie |
| VI | Totale | Aucun mouvement |

Cotation : évaluer le patient au repos, puis en mouvement (froncement, fermeture œil, sourire). Toujours coter le côté atteint.`,
  clinicalCommentary: `Indispensable en consultation ORL pour évaluer les PFP (a frigore, zona, post-chirurgicale, tumorale). La cotation est dynamique : elle change dans les premières semaines. Faire une cotation initiale puis à J10, J21, J45, M3. ENMG à J10–J21 si grade ≥ IV. Pour les PFP a frigore : corticoïdes si grade ≥ II dans les 48h. Protection oculaire systématique si lagophtalmie : larmes artificielles (Hylan H) + pommade noc + patch nocturne.`,
  references: [
    {
      type: 'pubmed',
      title: 'House JW, Brackmann DE. Facial nerve grading system. Otolaryngol Head Neck Surg 1985',
      pmid: '3931001',
    },
    {
      type: 'guideline',
      title: 'SFORL — Prise en charge des paralysies faciales (2021)',
      url: 'https://www.sforl.org',
    },
  ],
}

export default houseBrackmann
