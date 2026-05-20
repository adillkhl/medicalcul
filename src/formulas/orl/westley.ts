import type { FormulaDefinition } from '../types'

const westley: FormulaDefinition = {
  id: 'westley',
  slug: 'westley',
  name: 'Westley — Croup (laryngite sous-glottique)',
  specialty: 'orl',
  category: 'Pédiatrie ORL',
  description: 'Score de gravité du croup / laryngite striduleuse (enfant) — évalue la détresse respiratoire',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'stridor',
      type: 'radio',
      label: 'Stridor',
      options: [
        { value: 0, label: 'Absent' },
        { value: 1, label: 'Au repos (audible à distance)' },
        { value: 2, label: 'Au repos + sévère (difficile à calmer)' },
      ],
    },
    {
      id: 'tirage',
      type: 'radio',
      label: 'Tirage sus-sternal / rétractions',
      options: [
        { value: 0, label: 'Absent' },
        { value: 1, label: 'Léger (tirage intercostal)' },
        { value: 2, label: 'Modéré (tirage + battement des ailes du nez)' },
        { value: 3, label: 'Sévère (balancement thoraco-abdominal)' },
      ],
    },
    {
      id: 'entreeAir',
      type: 'radio',
      label: 'Entrée d\'air',
      options: [
        { value: 0, label: 'Normale' },
        { value: 1, label: 'Diminuée' },
        { value: 2, label: 'Très diminuée (silence auscultatoire)' },
      ],
    },
    {
      id: 'cyanose',
      type: 'radio',
      label: 'Cyanose en air ambiant',
      options: [
        { value: 0, label: 'Absente' },
        { value: 4, label: 'Présente (cyanose ou désaturation < 92%)' },
        {
          value: 5,
          label: 'Cyanose + agitation sévère (pré-arrêt)',
        },
      ],
    },
  ],
  calculate: (values) => {
    const s = values.stridor ?? 0
    const t = values.tirage ?? 0
    const e = values.entreeAir ?? 0
    const c = values.cyanose ?? 0
    const total = s + t + e + c

    if (total >= 12) {
      return {
        value: total,
        label: 'Croup TRÈS SÉVÈRE (Grade IV) — Urgence vitale',
        severity: 'critical',
        ranges: [
          { min: 12, max: 17, label: 'Grade IV — TRÈS SÉVÈRE — Insuffisance respiratoire imminente', severity: 'critical', recommendation: 'URGENCE VITALE. Adrénaline nébulisée (5 mg/5 mL) + dexaméthasone IM/IV. Intubation si faillite respiratoire. Transfert en réanimation pédiatrique. Appel anesthésiste ORL.' },
        ],
      }
    }

    if (total >= 7) {
      return {
        value: total,
        label: 'Croup SÉVÈRE (Grade III)',
        severity: 'high',
        ranges: [
          { min: 7, max: 11, label: 'Grade III — SÉVÈRE', severity: 'high', recommendation: 'Hospitalisation urgente. Dexaméthasone 0,6 mg/kg PO/IM/IV. Adrénaline nébulisée (5 mg/5 mL) si stridor au repos. Surveillance scopée + saturation continue. Si échec : envisager intubation.' },
        ],
      }
    }

    if (total >= 3) {
      return {
        value: total,
        label: 'Croup MODÉRÉ (Grade II)',
        severity: 'moderate',
        ranges: [
          { min: 3, max: 6, label: 'Grade II — MODÉRÉ', severity: 'moderate', recommendation: 'Corticothérapie : dexaméthasone 0,15–0,6 mg/kg PO (max 10 mg). Surveillance au moins 4h après traitement. Éducation parentale. Réévaluation à 4-6h. Si pas d\'amélioration : adrénaline nébulisée.' },
        ],
      }
    }

    return {
      value: total,
      label: 'Croup LÉGER (Grade I)',
      severity: 'low',
      ranges: [
        { min: 0, max: 2, label: 'Grade I — LÉGER', severity: 'low', recommendation: 'Corticothérapie faible dose : dexaméthasone 0,15 mg/kg PO (dose unique). Traitement ambulatoire. Surveillance parentale : rappel des signes d\'aggravation (stridor au repos, tirage, cyanose). Réévaluation si besoin.' },
      ],
    }
  },
  interpretation: `Le **score de Westley** évalue la sévérité du croup (laryngite sous-glottique) chez l’enfant de 6 mois à 6 ans.

**Items (0-17 points) :**
- Stridor : 0–2
- Tirage/rétractions : 0–3
- Entrée d’air : 0–2
- Cyanose : 0–5

**Grades :**
- 0–2 : Léger (ambulatoire)
- 3–6 : Modéré (surveillance + dexaméthasone)
- 7–11 : Sévère (hospitalisation + adrénaline)
- ≥ 12 : Très sévère (intubation probable)

Le croup est habituellement viral (parainfluenza type 1). L\'adrénaline nébulisée est réservée aux formes sévères avec stridor au repos ; son effet dure 2h.`,
  clinicalCommentary: `Le croup (laryngite sous-glottique) est une urgence ORL pédiatrique fréquente. Le score de Westley est l\'outil de référence pour grader la sévérité et décider de la prise en charge. Piège : ne pas confondre avec une épiglottite (plus rare, plus grave, fièvre élevée + dysphagie + hypersialorrhée + enfant toxique). L\'épiglottite ne répond PAS aux corticoïdes ni à l’adrénaline nébulisée — elle nécessite une intubation en environnement sécurisé. Le croup répond bien à la dexaméthasone (dose unique 0,15–0,6 mg/kg). L\'adrénaline nébulisée ne se fait qu’en milieu hospitalier avec surveillance scopée.`,
  references: [
    {
      type: 'pubmed',
      title: 'Westley CR et al. Nebulized racemic epinephrine in croup. J Pediatr 1978',
      pmid: '10178',
    },
    {
      type: 'guideline',
      title: 'HAS — Prise en charge du croup (laryngite) chez l\'enfant (2022)',
      url: 'https://www.has-sante.fr',
    },
  ],
}

export default westley
