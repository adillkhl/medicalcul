import type { FormulaDefinition } from '../types'

const schemdent: FormulaDefinition = {
  id: 'schemdent', slug: 'schemdent',
  name: 'Schéma Dentaire (Nomenclature)',
  specialty: 'stomatologie', category: 'Nomenclature',
  description: 'Nomenclature internationale des dents — système FDI (2 chiffres) et nomenclature de Palmer',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'avis',
  inputs: [
    { id: 'type_schema', type: 'radio', label: 'Type de schéma', options: [
      { value: 0, label: 'FDI (2 chiffres) — Standard international' },
      { value: 1, label: 'Palmer (quadrants + chiffres)' },
    ]},
  ],
  calculate: (values) => {
    return { value: 0, label: 'Nomenclature dentaire', severity: 'low',
      details: (values.type_schema ?? 0) === 0
        ? { '11-18': 'Incisives/Dents supérieures droites', '21-28': 'Incisives/Dents supérieures gauches', '31-38': 'Incisives/Dents inférieures gauches', '41-48': 'Incisives/Dents inférieures droites', 'Note': '1er chiffre = quadrant (1-4), 2e = dent (1-8)' }
        : { '1-8 (↘)': 'Supérieur droit', '9-16 (↗)': 'Supérieur gauche', '17-24 (↖)': 'Inférieur gauche', '25-32 (↗)': 'Inférieur droit', 'Note': 'Quadrants ∟⎿⎺⎽ selon les angles' },
    }
  },
  interpretation: 'Système FDI : 1er chiffre = quadrant, 2e chiffre = dent de 1 (centrale) à 8 (3e molaire). Palmer : 4 quadrants avec symboles.',
  clinicalCommentary: 'Le FDI est le standard OMS. Les dents de lait sont numérotées 5-8 en FDI (50-85).',
  references: [{ type: 'guideline', title: 'OMS — FDI World Dental Federation notation' }],
}
export default schemdent
