import type { FormulaDefinition } from '../types'

const chevillebrasidx: FormulaDefinition = {
  id: 'cheville-bras',
  slug: 'chevillebrasidx',
  name: 'Index Cheville-Bras (IPS)',
  specialty: 'cardiologie',
  category: 'Artériopathie',
  description: 'Index de pression systolique cheville/bras pour le dépistage de l\'artériopathie oblitérante des membres inférieurs',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'A',
  inputs: [
    { id: 'pas_brachiale', type: 'number', label: 'Pression systolique brachiale (la plus élevée des 2 bras)', unit: 'mmHg', min: 50, max: 300, step: 1, placeholder: 'Ex: 130' },
    { id: 'pas_cheville_d', type: 'number', label: 'Pression systolique cheville droite (artère tibiale postérieure ou pédieuse)', unit: 'mmHg', min: 20, max: 300, step: 1, placeholder: 'Ex: 120' },
    { id: 'pas_cheville_g', type: 'number', label: 'Pression systolique cheville gauche', unit: 'mmHg', min: 20, max: 300, step: 1, placeholder: 'Ex: 125' },
  ],
  calculate: (values) => {
    const brachiale = values.pas_brachiale || 120
    const cheville_d = values.pas_cheville_d || 120
    const cheville_g = values.pas_cheville_g || 120
    const ips_d = Math.round((cheville_d / brachiale) * 100) / 100
    const ips_g = Math.round((cheville_g / brachiale) * 100) / 100
    const ips_min = Math.min(ips_d, ips_g)

    let label = ''
    let severity: 'low'|'moderate'|'high'|'critical' = 'low'
    let rec = ''

    if (ips_min > 1.40) {
      label = 'IPS > 1,40 — Artères incompressibles (calcifications)'
      severity = 'moderate'
      rec = 'Artères incompressibles (souvent diabète, IRC). IPS non fiable. Réaliser un index orteil/bras (IPO) ou écho-Doppler.'
    } else if (ips_min > 0.90) {
      label = 'IPS ≥ 0,90 — Normal'
      severity = 'low'
      rec = 'IPS normal. Pas d\'AOMI hémodynamiquement significative. Si forte suspicion clinique, réaliser un test de marche ou IPS d\'effort.'
    } else if (ips_min > 0.70) {
      label = 'IPS 0,70-0,90 — AOMI légère à modérée'
      severity = 'moderate'
      rec = 'AOMI confirmée. Bilan vasculaire complet. Facteurs de risque cardiovasculaire. Traitement médical : antiagrégant, statine, activité physique.'
    } else if (ips_min > 0.50) {
      label = 'IPS 0,50-0,70 — AOMI modérée'
      severity = 'high'
      rec = 'AOMI modérée. Écho-Doppler artériel des MI. Traitement médical + réadaptation. Discuter revascularisation si claudication invalidante.'
    } else if (ips_min > 0.00) {
      label = 'IPS < 0,50 — AOMI sévère'
      severity = 'critical'
      rec = 'AOMI sévère. Risque d\'ischémie critique. Écho-Doppler urgent. Avis chirurgie vasculaire. Revascularisation probable.'
    }

    return {
      value: Math.round(ips_min * 100) / 100,
      label: label,
      severity: severity,
      details: { 'IPS droit': String(ips_d), 'IPS gauche': String(ips_g) },
      ranges: [
        { min: 0, max: 0.49, label: 'AOMI sévère', severity: 'critical', recommendation: 'Ischémie critique possible. Avis chirurgical urgent.' },
        { min: 0.50, max: 0.69, label: 'AOMI modérée', severity: 'high', recommendation: 'Claudication. Bilan vasculaire.' },
        { min: 0.70, max: 0.89, label: 'AOMI légère', severity: 'moderate', recommendation: 'Traitement médical. Surveillance.' },
        { min: 0.90, max: 1.40, label: 'Normal', severity: 'low', recommendation: 'Pas d\'AOMI significative.' },
        { min: 1.41, max: 5, label: 'Artères incompressibles', severity: 'moderate', recommendation: 'IPS non fiable. Faire IPO.' },
      ],
    }
  },
  interpretation: `L'**Index de Pression Systolique (IPS)** ou index cheville-bras est le test de référence pour le dépistage de l’AOMI.

**Interprétation :**
- > 1,40 : artères incompressibles (diabète, IRC)
- 0,90-1,40 : normal
- 0,70-0,89 : AOMI légère
- 0,50-0,69 : AOMI modérée
- < 0,50 : AOMI sévère

Mesure : patient au repos ≥ 5 min, brassard adapté à la cheville, sonde Doppler ou oscillométrie.`,
  clinicalCommentary: `L\'IPS est systématique devant toute suspicion d’AOMI. Un IPS < 0,90 a une sensibilité de 95% pour le diagnostic. Attention : chez le diabétique et l\'insuffisant rénal, les artères peuvent être incompressibles (IPS > 1,40) — utiliser alors l’index orteil/bras. Un IPS > 1,40 n’est pas rassurant : il témoigne de calcifications.`,
  references: [
    { type: 'pubmed', title: 'Aboyans V et al. ESC Guidelines on PAD. Eur Heart J 2018', pmid: '28886622' },
    { type: 'guideline', title: 'HAS — Artériopathie oblitérante des membres inférieurs', url: 'https://www.has-sante.fr' },
  ],
}
export default chevillebrasidx