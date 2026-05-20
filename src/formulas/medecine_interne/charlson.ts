import type { FormulaDefinition } from '../types'

const charlson: FormulaDefinition = {
  id: 'charlson',
  slug: 'charlson',
  name: 'Charlson — Index de comorbidités',
  specialty: 'medecine_interne',
  category: 'Comorbidités',
  description: 'Index de Charlson — Prédiction de la mortalité à 1 an selon les comorbidités et l\'âge.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'A',
  inputs: [
    {
      id: 'age',
      type: 'number',
      label: 'Âge du patient (ans)',
      min: 18,
      max: 120,
      step: 1,
      placeholder: '65',
    },
    {
      id: 'infarctus',
      type: 'boolean',
      label: 'Infarctus du myocarde (antécédent)',
    },
    {
      id: 'insuf_card',
      type: 'boolean',
      label: 'Insuffisance cardiaque congestive',
    },
    {
      id: 'arteriopathie',
      type: 'boolean',
      label: 'Artériopathie périphérique (claudication, AOMI)',
    },
    {
      id: 'avc',
      type: 'boolean',
      label: 'Accident vasculaire cérébral / AIT',
    },
    {
      id: 'demence',
      type: 'boolean',
      label: 'Démence',
    },
    {
      id: 'bpco',
      type: 'boolean',
      label: 'BPCO',
    },
    {
      id: 'conn_tissu',
      type: 'boolean',
      label: 'Maladie du tissu conjonctif (LED, PR, sclérodermie)',
    },
    {
      id: 'ulcere',
      type: 'boolean',
      label: 'Ulcère gastro-duodénal',
    },
    {
      id: 'hepatite_legere',
      type: 'boolean',
      label: 'Hépatopathie légère (sans cirrhose)',
    },
    {
      id: 'diabete',
      type: 'boolean',
      label: 'Diabète non compliqué',
    },
    {
      id: 'diabete_compl',
      type: 'boolean',
      label: 'Diabète avec complications (rétinopathie, néphropathie, neuropathie)',
    },
    {
      id: 'hemiplegie',
      type: 'boolean',
      label: 'Hémiplégie / paraplégie',
    },
    {
      id: 'renal_mod_sev',
      type: 'boolean',
      label: 'Insuffisance rénale modérée à sévère (créatinine > 3 mg/dL ou dialyse)',
    },
    {
      id: 'tumeur_solide',
      type: 'boolean',
      label: 'Tumeur solide sans métastases (exclu si > 5 ans)',
    },
    {
      id: 'leucemie',
      type: 'boolean',
      label: 'Leucémie',
    },
    {
      id: 'lymphome',
      type: 'boolean',
      label: 'Lymphome (malin)',
    },
    {
      id: 'hepatite_severe',
      type: 'boolean',
      label: 'Hépatopathie sévère (cirrhose décompensée, HTAP)',
    },
    {
      id: 'tumeur_meta',
      type: 'boolean',
      label: 'Tumeur solide métastatique',
    },
    {
      id: 'sida',
      type: 'boolean',
      label: 'Sida (non simple séropositivité VIH)',
    },
  ],
  calculate: (values) => {
    let score = 0
    const age = values.age ?? 65
    if (values.infractus ?? values.infarctus) score += 1
    if (values.insuf_card) score += 1
    if (values.arteriopathie) score += 1
    if (values.avc) score += 1
    if (values.demence) score += 1
    if (values.bpco) score += 1
    if (values.conn_tissu) score += 1
    if (values.ulcere) score += 1
    if (values.hepatite_legere) score += 1
    if (values.diabete) score += 1
    if (values.diabete_compl) score += 2
    if (values.hemiplegie) score += 2
    if (values.renal_mod_sev) score += 2
    if (values.tumeur_solide) score += 2
    if (values.leucemie) score += 2
    if (values.lymphome) score += 2
    if (values.hepatite_severe) score += 3
    if (values.tumeur_meta) score += 6
    if (values.sida) score += 6

    // Age adjustment (1 point per decade over 50)
    let ageScore = 0
    if (age >= 50) ageScore = Math.floor((age - 50) / 10)

    const total = score + ageScore

    const mortalityRate = total <= 1 ? '2%' : total === 2 ? '5%' : total === 3 ? '10%' : total === 4 ? '15%' : total === 5 ? '24%' : total === 6 ? '30%' : total === 7 ? '43%' : total === 8 ? '59%' : '85%+'
    const survie1an = total <= 1 ? '96%' : total === 2 ? '90%' : total === 3 ? '77%' : total === 4 ? '53%' : total === 5 ? '53%' : total >= 6 ? '< 25%' : '95%+'

    if (total >= 6) {
      return {
        value: total,
        label: `Charlson = ${total} — Comorbidités sévères`,
        severity: 'high',
        ranges: [
          { min: 0, max: 1, label: '0–1 : Faible comorbidité', severity: 'low' },
          { min: 2, max: 3, label: '2–3 : Comorbidité modérée', severity: 'moderate' },
          { min: 4, max: 5, label: '4–5 : Comorbidité élevée', severity: 'moderate' },
          { min: 6, max: 999, label: '≥ 6 : Très élevée — mortalité 1 an > 75%', severity: 'high' },
        ],
      }
    }
    if (total >= 4) {
      return {
        value: total,
        label: `Charlson = ${total} — Comorbidité élevée`,
        severity: 'moderate',
        ranges: [
          { min: 0, max: 1, label: '0–1 : Faible', severity: 'low' },
          { min: 2, max: 3, label: '2–3 : Modérée', severity: 'moderate' },
          { min: 4, max: 5, label: '4–5 : Élevée', severity: 'moderate' },
          { min: 6, max: 999, label: '≥ 6 : Très élevée', severity: 'high' },
        ],
      }
    }
    return {
      value: total,
      label: `Charlson = ${total} — Faible comorbidité`,
      severity: 'low',
      ranges: [
        { min: 0, max: 1, label: '0–1 : Faible', severity: 'low' },
        { min: 2, max: 3, label: '2–3 : Modérée', severity: 'moderate' },
        { min: 4, max: 5, label: '4–5 : Élevée', severity: 'moderate' },
        { min: 6, max: 999, label: '≥ 6 : Très élevée', severity: 'high' },
      ],
    }
  },
  interpretation: `**Index de Charlson** — Prédiction de la mortalité à 1 an.

**Pondération :**
- 1 point : infarctus, IC, AOMI, AVC, démence, BPCO, connectivite, ulcère, hépatite légère, diabète
- 2 points : diabète compliqué, hémiplégie, IR mod-sévère, tumeur non métastatique, leucémie, lymphome
- 3 points : hépatite sévère (cirrhose)
- 6 points : tumeur métastatique, sida

**Âge** : +1 point par décennie au-delà de 50 ans.

**Mortalité à 1 an :** Score 0–1 : 2%, Score 2 : 5%, Score 3 : 10%, Score 4 : 15%, Score 5 : 24%, Score 6 : 30%, Score 7 : 43%, Score 8 : 59%, Score ≥ 9 : > 85%.`,
  clinicalCommentary: `L'index de Charlson est largement utilisé en médecine interne et en épidémiologie pour ajuster le risque de mortalité. Utile avant une chirurgie lourde ou une chimiothérapie. Version simplifiée utile en clinique quotidienne.`,
  references: [
    {
      type: 'pubmed',
      title: 'Charlson ME et al. A new method of classifying prognostic comorbidity. J Chronic Dis 1987',
      pmid: '3558716',
    },
    {
      type: 'pubmed',
      title: 'Charlson M et al. Validation of a combined comorbidity index. J Clin Epidemiol 1994',
      pmid: '7722560',
    },
  ],
}

export default charlson
