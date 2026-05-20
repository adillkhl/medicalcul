import type { FormulaDefinition } from '../types'

const balthazar: FormulaDefinition = {
  id: 'balthazar',
  slug: 'balthazar',
  name: 'Balthazar (Score) — Pancréatite aiguë au scanner',
  specialty: 'gastroenterologie',
  category: 'Pancréatite',
  description: 'Score tomodensitométrique de gravité de la pancréatite aiguë',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'grade_scanner',
      type: 'radio',
      label: 'Grade tomodensitométrique (Balthazar)',
      options: [
        { value: 0, label: 'Grade A — Pancréas normal' },
        { value: 1, label: 'Grade B — Élargissement focal ou diffus du pancréas' },
        { value: 2, label: 'Grade C — Infiltration de la graisse péripancréatique' },
        { value: 3, label: 'Grade D — Une seule coulée de nécrose (phlegmon)' },
        { value: 4, label: 'Grade E — ≥ 2 coulées de nécrose ou abcès gazeux' },
      ],
    },
    {
      id: 'necrose',
      type: 'radio',
      label: 'Nécrose pancréatique (au scanner avec injection)',
      options: [
        { value: 0, label: 'Absence de nécrose' },
        { value: 2, label: 'Nécrose < 30 % du pancréas' },
        { value: 4, label: 'Nécrose 30–50 % du pancréas' },
        { value: 6, label: 'Nécrose > 50 % du pancréas' },
      ],
    },
  ],
  calculate: (values) => {
    const grade = Number(values.grade_scanner) || 0
    const necrose = Number(values.necrose) || 0
    const score = grade + necrose

    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let label = ''
    let recommendation = ''

    if (score <= 3) {
      severity = 'low'
      label = 'Score ≤ 3 — Pancréatite peu sévère'
      recommendation = 'Risque de complications faible. Prise en charge médicale standard : jeûne, réhydratation, antalgiques. Surveillance simple.'
    } else if (score <= 6) {
      severity = 'high'
      label = 'Score 4-6 — Pancréatite modérément sévère'
      recommendation = 'Surveillance en unité de soins intensifs recommandée. Risque de complications locorégionales. TDM de contrôle à 48-72h.'
    } else if (score <= 10) {
      severity = 'critical'
      label = 'Score 7-10 — Pancréatite sévère'
      recommendation = 'Prise en charge en réanimation. Risque élevé de mortalité. Surveillance rapprochée, TDM de contrôle, discussion drainage/ nécrosectomie si surinfection.'
    }

    return {
      value: score,
      label,
      severity,
      ranges: [
        { min: 0, max: 3, label: '≤ 3 — Peu sévère', severity: 'low', recommendation: 'Prise en charge médicale standard.' },
        { min: 4, max: 6, label: '4-6 — Modérément sévère', severity: 'high', recommendation: 'Soins intensifs. TDM de contrôle à J2-J3.' },
        { min: 7, max: 10, label: '7-10 — Sévère', severity: 'critical', recommendation: 'Réanimation. TDM injectée. Nécrosectomie si surinfection.' },
      ],
    }
  },
  interpretation: `Le **score de Balthazar** (index de sévérité tomodensitométrique — CT severity index) évalue la gravité de la pancréatite aiguë au scanner.

**Grades tomodensitométriques :**
- **Grade A** (0 pt) : Pancréas normal
- **Grade B** (1 pt) : Élargissement pancréatique
- **Grade C** (2 pts) : Infiltration péri-pancréatique
- **Grade D** (3 pts) : Une seule coulée de nécrose
- **Grade E** (4 pts) : ≥ 2 coulées de nécrose

**Nécrose pancréatique :**
- Absente (0 pt) / < 30 % (2 pts) / 30-50 % (4 pts) / > 50 % (6 pts)

Le score total (grade + nécrose) ≤ 3 est associé à un faible risque de complications, ≥ 7 à une mortalité élevée.`,
  clinicalCommentary: `Le score de Balthazar original n’inclut pas les complications extrapancréatiques (épanchements pleuraux, ascite). La version modifiée (score de Mortele) ajoute ces critères. Idéalement, le scanner avec injection doit être réalisé 48-72h après l’admission, car la nécrose n\'est pas visible avant. Le scanner précoce (< 24h) sous-estime la sévérité.`,
  references: [
    {
      type: 'pubmed',
      title: 'Balthazar EJ et al. Acute pancreatitis: value of CT in establishing prognosis. Radiology 1990',
      pmid: '2195591',
    },
  ],
}

export default balthazar
