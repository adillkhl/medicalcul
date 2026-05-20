import type { FormulaDefinition } from '../types'

const fine: FormulaDefinition = {
  id: 'fine', slug: 'fine',
  name: 'Fine Score (Pneumonia Severity Index — PSI)',
  specialty: 'pneumologie', category: 'Pneumonie',
  description: 'Score de gravité de la pneumonie communautaire (PSI de Fine) — prédiction de la mortalité à 30 jours',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'age', type: 'number', label: 'Âge (ans)', min: 0, max: 120, step: 1 },
    { id: 'sexe', type: 'radio', label: 'Sexe', options: [{ value: 0, label: 'Homme' }, { value: 1, label: 'Femme' }] },
    { id: 'comorbidite_neoplasie', type: 'boolean', label: 'Néoplasie active' },
    { id: 'comorbidite_hepatique', type: 'boolean', label: 'Hépatopathie' },
    { id: 'comorbidite_ic', type: 'boolean', label: 'Insuffisance cardiaque congestive' },
    { id: 'comorbidite_avc', type: 'boolean', label: 'AVC / pathologie cérébrovasculaire' },
    { id: 'comorbidite_renale', type: 'boolean', label: 'Insuffisance rénale chronique' },
    { id: 'confusion', type: 'boolean', label: 'Confusion / altération conscience' },
    { id: 'fr', type: 'radio', label: 'Fréquence respiratoire', options: [{ value: 0, label: '< 30/min' }, { value: 1, label: '≥ 30/min' }] },
    { id: 'pas', type: 'radio', label: 'Pression artérielle systolique', options: [{ value: 0, label: '≥ 90 mmHg' }, { value: 1, label: '< 90 mmHg' }] },
    { id: 'temperature', type: 'radio', label: 'Température', options: [{ value: 0, label: '35-40°C' }, { value: 1, label: '< 35°C ou ≥ 40°C' }] },
    { id: 'fc', type: 'radio', label: 'Fréquence cardiaque', options: [{ value: 0, label: '< 125/min' }, { value: 1, label: '≥ 125/min' }] },
    { id: 'ph_arteriel', type: 'radio', label: 'pH artériel', options: [{ value: 0, label: '≥ 7.35' }, { value: 1, label: '< 7.35' }] },
    { id: 'uree_mmol', type: 'radio', label: 'Urée sanguine', options: [{ value: 0, label: '< 11 mmol/L' }, { value: 1, label: '≥ 11 mmol/L' }] },
    { id: 'natremie', type: 'radio', label: 'Natrémie', options: [{ value: 0, label: '≥ 130 mmol/L' }, { value: 1, label: '< 130 mmol/L' }] },
    { id: 'glycemie', type: 'radio', label: 'Glycémie', options: [{ value: 0, label: '< 14 mmol/L' }, { value: 1, label: '≥ 14 mmol/L' }] },
    { id: 'hematocrite', type: 'radio', label: 'Hématocrite', options: [{ value: 0, label: '≥ 30%' }, { value: 1, label: '< 30%' }] },
    { id: 'pao2', type: 'radio', label: 'PaO₂ (air ambiant)', options: [{ value: 0, label: '≥ 60 mmHg' }, { value: 1, label: '< 60 mmHg' }] },
    { id: 'epanchement', type: 'boolean', label: 'Épanchement pleural (radio)' },
  ],
  calculate: (values) => {
    const age = values.age ?? 40
    let total = age
    if ((values.sexe ?? 0) === 1) total -= 10
    if (values.comorbidite_neoplasie) total += 30
    if (values.comorbidite_hepatique) total += 20
    if (values.comorbidite_ic) total += 10
    if (values.comorbidite_avc) total += 10
    if (values.comorbidite_renale) total += 10
    if (values.confusion) total += 20
    if ((values.fr ?? 0) === 1) total += 20
    if ((values.pas ?? 0) === 1) total += 20
    if ((values.temperature ?? 0) === 1) total += 15
    if ((values.fc ?? 0) === 1) total += 10
    if ((values.ph_arteriel ?? 0) === 1) total += 30
    if ((values.uree_mmol ?? 0) === 1) total += 20
    if ((values.natremie ?? 0) === 1) total += 20
    if ((values.glycemie ?? 0) === 1) total += 10
    if ((values.hematocrite ?? 0) === 1) total += 10
    if ((values.pao2 ?? 0) === 1) total += 10
    if (values.epanchement) total += 10
    let classe = 'I', sev: 'high'|'moderate'|'low' = 'low'
    if (total <= 50) { classe = 'II'; sev = 'low' }
    else if (total <= 70) { classe = 'III'; sev = 'moderate' }
    else if (total <= 90) { classe = 'IV'; sev = 'moderate' }
    else if (total > 90) { classe = 'V'; sev = 'high' }
    if (age <= 50 && total === age && !values.comorbidite_neoplasie && !values.comorbidite_hepatique && !values.comorbidite_ic && !values.comorbidite_avc && !values.comorbidite_renale) classe = 'I'
    return { value: total, label: `PSI (Fine) : Classe ${classe} (${total} pts)`, severity: sev,
      details: { Classe: classe, Points: `${total}`, 'Mortalité 30j': classe === 'I' ? '< 0.5%' : classe === 'II' ? '0.5-1%' : classe === 'III' ? '1-3%' : classe === 'IV' ? '5-10%' : '> 25%' } }
  },
  interpretation: 'Classes I-II = faible risque (ambulatoire possible). III = hospitalisation de courte durée. IV-V = hospitalisation conventionnelle ou soins intensifs.',
  clinicalCommentary: 'Le PSI/Fine score est l\'un des plus utilisés pour décider du lieu de prise en charge. Il est plus discriminant que le CURB-65 chez les jeunes.',
  references: [{ type: 'pubmed', title: 'Fine MJ et al. A prediction rule for community-acquired pneumonia. NEJM 1997', pmid: '8966581' }],
}
export default fine
