import type { FormulaDefinition } from '../types'

const king: FormulaDefinition = {
  id: 'king',
  slug: 'king',
  name: "King's College (Critères) — Hépatite fulminante",
  specialty: 'gastroenterologie',
  category: 'Hépatologie',
  description: "Critères de King's College pour la transplantation hépatique dans l’hépatite fulminante",
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'type_intoxication',
      type: 'radio',
      label: "Type d’hépatite fulminante",
      options: [
        { value: 1, label: 'Intoxication au paracétamol' },
        { value: 2, label: 'Hépatite fulminante non paracétamol (virale, médicamenteuse, auto-immune, etc.)' },
      ],
    },
    {
      id: 'ph',
      type: 'number',
      label: 'pH artériel',
      unit: '',
      min: 6.5,
      max: 7.6,
      step: 0.01,
      placeholder: 'Ex: 7.30',
    },
    {
      id: 'tp',
      type: 'number',
      label: 'Taux de prothrombine (TP)',
      unit: '%',
      min: 0,
      max: 100,
      step: 1,
      placeholder: 'Ex: 25',
    },
    {
      id: 'creatinine',
      type: 'number',
      label: 'Créatininémie',
      unit: 'µmol/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 200',
    },
    {
      id: 'encephalopathie',
      type: 'boolean',
      label: 'Encéphalopathie hépatique stade III-IV',
    },
    {
      id: 'bilirubine',
      type: 'number',
      label: 'Bilirubine totale (pour hépatite non paracétamol)',
      unit: 'µmol/L',
      min: 0,
      max: 1000,
      step: 1,
      placeholder: 'Ex: 300',
    },
    {
      id: 'age',
      type: 'number',
      label: 'Âge (pour hépatite non paracétamol)',
      unit: 'ans',
      min: 0,
      max: 120,
      step: 1,
      placeholder: 'Ex: 45',
    },
    {
      id: 'duree_ictere',
      type: 'number',
      label: "Durée de l’ictère avant encéphalopathie (pour hépatite non paracétamol)",
      unit: 'jours',
      min: 0,
      max: 30,
      step: 1,
      placeholder: 'Ex: 10',
    },
  ],
  calculate: (values) => {
    const type = Number(values.type_intoxication)
    const ph = Number(values.ph)
    const tp = Number(values.tp)
    const creat = Number(values.creatinine)
    const encephalopathie = values.encephalopathie
    const bili = Number(values.bilirubine)
    const age = Number(values.age)
    const ictere = Number(values.duree_ictere)

    if (type === 1) {
      let eligible = false
      let criteres: string[] = []

      if (ph !== undefined && ph < 7.30) {
        eligible = true
        criteres.push('pH artériel < 7.30 (après réhydratation)')
      }

      if ((tp !== undefined && tp < 20) || (creat !== undefined && creat > 300)) {
        eligible = true
        criteres.push('TP < 20 % ET/OU créatinine > 300 µmol/L')
      }

      if (eligible) {
        const severity = ph !== undefined && ph < 7.30 ? 'critical' as const : 'high' as const
        return {
          value: 1,
          label: "King's College POSITIF — Transplantation indiquée",
          severity,
          details: { 'Criteres': criteres.join(' ; ') },
          ranges: [
            { min: 0, max: 0, label: "Négatif — Pas d’indication", severity: 'low', recommendation: 'Surveillance rapprochée. Réévaluer à 24-48h.' },
            { min: 1, max: 1, label: "Positif — Transplantation urgente", severity: 'critical', recommendation: 'Inscription sur liste de transplantation hépatique en urgence. Transfert en centre de transplantation.' },
          ],
        }
      }

      return {
        value: 0,
        label: "King's College NÉGATIF",
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: "Négatif — Poursuite surveillance", severity: 'low', recommendation: 'Surveillance rapprochée en réanimation. Réévaluer les critères à 24-48h.' },
        ],
      }
    }

    // Non paracétamol
    if (type === 2) {
      let eligible = false
      let criteres: string[] = []

      if (tp !== undefined && tp < 10) {
        eligible = true
        criteres.push('TP < 10 %')
      }
      if (tp !== undefined && tp < 20 && encephalopathie) {
        eligible = true
        criteres.push('Encéphalopathie + TP < 20 %')
      }

      // Facteurs de mauvais pronostic additionnels
      if (age !== undefined && age < 10) criteres.push('Âge < 10 ans')
      if (age !== undefined && age > 40) criteres.push('Âge > 40 ans')
      if (ictere !== undefined && ictere > 7) criteres.push('Ictère > 7 jours avant encéphalopathie')
      if (bili !== undefined && bili > 300) criteres.push('Bilirubine > 300 µmol/L')

      if (eligible) {
        return {
          value: 1,
          label: "King's College POSITIF — Transplantation indiquée",
          severity: 'critical',
          details: { 'Criteres': criteres.join(' ; ') },
          ranges: [
            { min: 0, max: 0, label: "Négatif — Pas d’indication", severity: 'low', recommendation: 'Surveillance rapprochée.' },
            { min: 1, max: 1, label: "Positif — Transplantation urgente", severity: 'critical', recommendation: 'Inscription transplantation hépatique urgente.' },
          ],
        }
      }

      return {
        value: 0,
        label: "King's College NÉGATIF",
        severity: 'low',
        ranges: [
          { min: 0, max: 0, label: "Négatif — Poursuite surveillance", severity: 'low', recommendation: 'Surveillance. Réévaluer les critères à 24-48h.' },
        ],
      }
    }

    return {
      value: 0,
      label: 'Type non spécifié',
      severity: 'low',
      ranges: [
        { min: 0, max: 0, label: 'Données insuffisantes', severity: 'low', recommendation: 'Renseigner le type d\'hépatite.' },
      ],
    }
  },
  interpretation: `Les **critères de King's College** (KCH) permettent d’identifier les patients atteints d\'hépatite fulminante nécessitant une transplantation hépatique en urgence.\n\n**Intoxication au paracétamol :**\n- pH < 7.30 (après réhydratation) OU\n- TP < 20 % + créatinine > 300 µmol/L + encéphalopathie stade III-IV\n\n**Hépatite fulminante non paracétamol :**\n- TP < 10 % (quel que soit le stade d\'encéphalopathie) OU\n- TP < 20 % + encéphalopathie stade III-IV\n\nFacteurs de mauvais pronostic : âge < 10 ou > 40 ans, ictère > 7 jours avant encéphalopathie, bilirubine > 300 µmol/L.`,
  clinicalCommentary: `Les critères de King's College ont une spécificité élevée mais une sensibilité modérée. Un patient qui ne remplit pas les critères peut quand même nécessiter une transplantation. Le score Clichy (patients avec encéphalopathie + facteur V < 20-30 %) peut être utilisé en complément. L\'encéphalopathie hépatique est un critère majeur : toute hépatite aiguë avec encéphalopathie = hépatite fulminante = hospitalisation en réanimation.`,
  references: [
    {
      type: 'pubmed',
      title: "O'Grady JG et al. Early indicators of prognosis in fulminant hepatic failure. Gastroenterology 1989",
      pmid: '2920864',
    },
  ],
}

export default king
