import type { FormulaDefinition } from '../types'

const debtransfu: FormulaDefinition = {
  id: 'debtransfu', slug: 'debtransfu',
  name: 'Débit de Transfusion Sanguine',
  specialty: 'soins_infirmiers', category: 'Débits',
  description: 'Calcul du débit de transfusion sanguine (CGR, PFC, CPA) en mL/h et durée recommandée',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'volume_ml', type: 'number', label: 'Volume à transfuser (mL)', min: 50, max: 1000, step: 10 },
    { id: 'produit', type: 'radio', label: 'Type de produit', options: [
      { value: 0, label: 'CGR (Concentré de Globules Rouges)' },
      { value: 1, label: 'PFC (Plasma Frais Congelé)' },
      { value: 2, label: 'CPA (Concentré de Plaquettes)' },
    ]},
    { id: 'urgence', type: 'radio', label: 'Contexte', options: [{ value: 0, label: 'Transfusion standard' }, { value: 1, label: 'Urgence vitale (débit rapide)' }] },
  ],
  calculate: (values) => {
    const v = values.volume_ml ?? 300
    const pdt = values.produit ?? 0
    const urg = values.urgence ?? 0
    let duree_min = 90
    let debit = v / (duree_min / 60)
    if (urg === 1) { duree_min = 30; debit = v / 0.5 }
    else if (pdt === 0) { duree_min = 120; debit = v / 2 }
    else if (pdt === 1) { duree_min = 60; debit = v / 1 }
    else { duree_min = 60; debit = v / 1 }
    if (urg === 1) { debit = v / 0.5; duree_min = 30 }
    return { value: parseFloat(debit.toFixed(0)), label: `Débit : ${debit.toFixed(0)} mL/h (durée : ${duree_min} min)`, severity: 'low' }
  },
  interpretation: 'CGR : 2h max par poche (risque de contamination). PFC : décongélation immédiate, perfuser sur 30-60 min. CPA : perfuser sur 30-60 min.',
  clinicalCommentary: 'Transfusion standard d\'un CGR : 2-4h. Ne jamais dépasser 4h par poche. En urgence hémorragique, utiliser un réchauffeur et un perfuseur à débit rapide.',
  references: [{ type: 'guideline', title: 'HAS — Transfusion de globules rouges homologues. 2014' }],
}
export default debtransfu
