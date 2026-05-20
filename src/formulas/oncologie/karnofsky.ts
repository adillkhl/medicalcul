import type { FormulaDefinition } from '../types'

const karnofsky: FormulaDefinition = {
  id: 'karnofsky',
  slug: 'karnofsky',
  name: 'Karnofsky (Echelle)',
  specialty: 'oncologie',
  category: 'État général',
  description: 'Échelle de Karnofsky (KPS) — mesure de l\'état général du patient cancéreux, de l\'autonomie et de la capacité à réaliser les activités quotidiennes. Complémentaire à l\'ECOG.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'kps_percent',
      type: 'radio',
      label: 'Niveau fonctionnel du patient',
      options: [
        { value: 100, label: '100% — Normal, pas de plainte, pas de signe de maladie' },
        { value: 90, label: '90% — Activité normale, signes ou symptômes mineurs de maladie' },
        { value: 80, label: '80% — Activité normale avec effort, quelques signes de maladie' },
        { value: 70, label: '70% — Capable de s\'occuper de soi, incapable de mener une activité normale' },
        { value: 60, label: '60% — Nécessite une aide occasionnelle mais s\'occupe de la plupart de ses besoins' },
        { value: 50, label: '50% — Nécessite une aide importante et des soins médicaux fréquents' },
        { value: 40, label: '40% — Handicapé, nécessite des soins spéciaux et une assistance' },
        { value: 30, label: '30% — Handicapé sévèrement, hospitalisation nécessaire' },
        { value: 20, label: '20% — Très malade, hospitalisation nécessaire, traitement de support actif' },
        { value: 10, label: '10% — Moribond, processus fatal progressant rapidement' },
        { value: 0, label: '0% — Décès' },
      ],
    },
  ],
  calculate: (values) => {
    const kps = values.kps_percent as number

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''
    let ecogEquivalent = ''

    if (kps >= 80) {
      ecogEquivalent = 'ECOG 0-1'
      severity = 'low'
      label = `KPS ${kps}% — Autonomie préservée`
      recommendation = 'Chimiothérapie standard possible. Tous types de protocoles oncologiques envisageables. Chirurgie et radiothérapie sans restriction.'
    } else if (kps >= 60) {
      ecogEquivalent = 'ECOG 2'
      severity = 'moderate'
      label = `KPS ${kps}% — Autonomie partielle`
      recommendation = 'Chimiothérapie adaptée (monothérapie, protocoles allégés). Évaluation gériatrique si > 70 ans. Soins de support. Thérapies ciblées possibles.'
    } else if (kps >= 40) {
      ecogEquivalent = 'ECOG 3'
      severity = 'high'
      label = `KPS ${kps}% — Autonomie limitée`
      recommendation = 'Pas de chimiothérapie cytotoxique. Soins palliatifs prédominants. Thérapie ciblée ou hormonothérapie si bon profil. Avis spécialisé en soins palliatifs.'
    } else if (kps >= 10) {
      ecogEquivalent = 'ECOG 4'
      severity = 'critical'
      label = `KPS ${kps}% — Patient grabataire`
      recommendation = 'Soins palliatifs exclusifs. Prise en charge symptomatique de la douleur et des symptômes. Accompagnement de fin de vie. Pas de chimiothérapie.'
    } else {
      ecogEquivalent = 'ECOG 5'
      severity = 'critical'
      label = 'KPS 0% — Décès'
      recommendation = 'Aucune intervention oncologique active.'
    }

    return {
      value: kps,
      label,
      severity,
      risk: 100 - kps,
      riskUnit: '% de perte fonctionnelle',
      details: {
        'KPS': `${kps}%`,
        'ECOG équivalent': ecogEquivalent,
      },
      ranges: [
        { min: 80, max: 100, label: 'KPS ≥ 80% — Autonome', severity: 'low' },
        { min: 60, max: 79, label: 'KPS 60-70% — Autonomie partielle', severity: 'moderate' },
        { min: 40, max: 59, label: 'KPS 40-50% — Dépendance modérée', severity: 'high' },
        { min: 10, max: 39, label: 'KPS 10-30% — Dépendance sévère', severity: 'critical' },
        { min: 0, max: 0, label: 'KPS 0% — Décès', severity: 'critical' },
      ],
    }
  },
  interpretation: "L'**échelle de Karnofsky** (KPS, 0-100%) évalue l\'état général du patient cancéreux.\n\n**Correspondance avec l\'ECOG :**\n- KPS 100% = ECOG 0\n- KPS 80-90% = ECOG 1\n- KPS 60-70% = ECOG 2\n- KPS 40-50% = ECOG 3\n- KPS < 40% = ECOG 4\n\n**Seuil thérapeutique :** KPS ≥ 60% → chimiothérapie possible. KPS < 60% → soins de support.",
  clinicalCommentary: "Le KPS est utilisé depuis les années 1950 et reste l\'un des indicateurs pronostiques les plus puissants en oncologie. Il est corrélé à la survie, à la réponse au traitement et à la qualité de vie. Le KPS est souvent préféré à l\'ECOG dans les essais cliniques américains, tandis que l\'ECOG est plus utilisé en Europe. Les deux échelles sont interchangeables à l\'aide de tables de conversion.",
  references: [
    {
      type: 'pubmed',
      title: 'Karnofsky DA, Burchenal JH. The clinical evaluation of chemotherapeutic agents in cancer. In: MacLeod CM, ed. Evaluation of Chemotherapeutic Agents. Columbia Univ Press 1949',
      pmid: 'null',
    },
    {
      type: 'pubmed',
      title: 'Schag CC et al. Karnofsky performance status revisited. J Clin Oncol 1984',
      pmid: '6376697',
    },
  ],
}

export default karnofsky
