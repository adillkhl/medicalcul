// Types pour les formules Medicalcul

export type Specialty =
  | 'urgence'
  | 'orl'
  | 'cardiologie'
  | 'neurologie'
  | 'pneumologie'
  | 'pediatrie'
  | 'gynecologie'
  | 'gastroenterologie'
  | 'nephrologie'
  | 'hematologie'
  | 'rhumatologie'
  | 'psychiatrie'
  | 'infectiologie'
  | 'reanimation'
  | 'dermatologie'
  | 'nutrition'
  | 'toxicologie'
  | 'ophtalmologie'
  | 'divers'
  // Extended matching Medicalcul specialties
  | 'anesthesie'
  | 'brules'
  | 'chirurgie'
  | 'geriatrie'
  | 'medecine_interne'
  | 'oncologie'
  | 'orthopedie'
  | 'soins_infirmiers'
  | 'stomatologie'
  | 'urologie'
  | 'medecine_sport'
  | 'medecine_legale'

export type EvidenceLevel = 'A' | 'B' | 'C' | 'D' | 'avis'

// --- Input types ---

export interface BooleanInput {
  id: string
  type: 'boolean'
  label: string
  weight?: number
  condition?: string // JS expression evaluated against current values
}

export interface NumberInput {
  id: string
  type: 'number'
  label: string
  unit?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

export interface RadioInput {
  id: string
  type: 'radio'
  label: string
  options: { value: number; label: string }[]
}

export interface SelectInput {
  id: string
  type: 'select'
  label: string
  options: { value: number | string; label: string }[]
}

export type FormulaInput = BooleanInput | NumberInput | RadioInput | SelectInput

// --- Result ---

export interface ResultRange {
  min: number
  max: number
  risk?: number
  label: string
  recommendation?: string
  severity?: 'low' | 'moderate' | 'high' | 'critical'
}

export interface FormulaResult {
  value: number
  label?: string
  risk?: number
  riskUnit?: string
  severity?: 'low' | 'moderate' | 'high' | 'critical'
  ranges?: ResultRange[]
  details?: Record<string, string | number | undefined>
}

export interface Reference {
  type: 'pubmed' | 'guideline' | 'url'
  title: string
  url?: string
  pmid?: string
}

// --- Formula definition ---

export interface FormulaDefinition {
  id: string
  slug: string
  name: string
  specialty: Specialty
  category: string
  description: string
  version: string
  lastValidated: string // ISO date
  evidenceLevel: EvidenceLevel
  inputs: FormulaInput[]
  calculate: (values: Record<string, any>) => FormulaResult
  interpretation: string
  clinicalCommentary?: string
  references: Reference[]
}

export interface FormulaMeta {
  id: string
  slug: string
  name: string
  specialty: Specialty
  category: string
  description: string
  version: string
  lastValidated: string
  evidenceLevel: EvidenceLevel
}
