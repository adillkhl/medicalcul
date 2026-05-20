import type { FormulaDefinition } from '../types'

const abaq_ped: FormulaDefinition = {
  id: 'abaq_ped', slug: 'abaq_ped',
  name: 'Abaques et Normes Pédiatriques',
  specialty: 'pediatrie', category: 'Croissance',
  description: 'Valeurs normales des principaux paramètres vitaux par âge chez l\'enfant (FC, FR, PA)',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'age_mois', type: 'number', label: 'Âge (mois)', min: 0, max: 216, step: 1 },
  ],
  calculate: (values) => {
    const age = values.age_mois ?? 0
    const a = age / 12
    let fr, fc, pas, pad
    if (age <= 1) { fr = 30; fc = 140; pas = 70; pad = 50 }
    else if (age <= 12) { fr = 24; fc = 120; pas = 90; pad = 60 }
    else if (age <= 24) { fr = 22; fc = 110; pas = 95; pad = 65 }
    else if (age <= 60) { fr = 20; fc = 100; pas = 100; pad = 65 }
    else if (age <= 144) { fr = 18; fc = 85; pas = 110; pad = 70 }
    else { fr = 16; fc = 80; pas = 120; pad = 80 }
    return { value: 0, label: `Âge ${a.toFixed(1)} an(s) — Normes vitales`,
      details: { 'FC (/min)': `${fc - 30}–${fc + 30}`, 'FR (/min)': `${fr - 8}–${fr + 8}`, 'PAS (mmHg)': `${pas - 15}–${pas + 15}`, 'PAD (mmHg)': `${pad - 10}–${pad + 10}` },
      severity: 'low',
      ranges: [{ min: -Infinity, max: Infinity, label: 'Normes de référence selon âge', severity: 'low' }],
    }
  },
  interpretation: 'Les normes vitales pédiatriques varient avec l\'âge. Utiliser les références OMS ou PALS selon le contexte.',
  clinicalCommentary: 'Adapter au sexe et à la courbe individuelle. En urgence, privilégier les algorithmes PALS/APLS.',
  references: [
    { type: 'pubmed', title: 'OMS — Courbes de croissance', url: 'https://www.who.int/childgrowth/standards/en/' },
  ],
}
export default abaq_ped
