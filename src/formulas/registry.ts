import type { FormulaDefinition, FormulaMeta, Specialty } from './types'

// Import all formulas
import cha2ds2vasc from './urgence/cha2ds2-vasc'
import cha2ds2va from './urgence/cha2ds2-va'
import crb65 from './urgence/crb-65'
import hasbled from './urgence/has-bled'
import qsofa from './urgence/qsofa'
import glasgow from './urgence/glasgow'
import wells from './urgence/wells-pe'
import perc from './urgence/perc'

// Registry: id → formula
const registry = new Map<string, FormulaDefinition>()

// Register all formulas
const formulas: FormulaDefinition[] = [
  cha2ds2vasc,
  cha2ds2va,
  crb65,
  hasbled,
  qsofa,
  glasgow,
  wells,
  perc,
]

formulas.forEach((f) => registry.set(f.slug, f))

// --- Public API ---

export function getFormula(slug: string): FormulaDefinition | undefined {
  return registry.get(slug)
}

export function getAllFormulas(): FormulaDefinition[] {
  return formulas
}

export function getFormulaMetas(): FormulaMeta[] {
  return formulas.map(({ calculate, ...meta }) => meta)
}

export function getFormulasBySpecialty(specialty: Specialty): FormulaDefinition[] {
  return formulas.filter((f) => f.specialty === specialty)
}

export function searchFormulas(query: string): FormulaMeta[] {
  const q = query.toLowerCase()
  return getFormulaMetas().filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.specialty.includes(q)
  )
}

export function getSpecialties(): Specialty[] {
  return Array.from(new Set(formulas.map((f) => f.specialty)))
}

export function getFormulasByCategory(specialty: Specialty): Record<string, FormulaDefinition[]> {
  return groupBy(getFormulasBySpecialty(specialty), 'category')
}

// --- Helpers ---

function groupBy<T extends Record<string, any>>(arr: T[], key: string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = item[key]
      ;(acc[k] ??= []).push(item)
      return acc
    },
    {} as Record<string, T[]>
  )
}
