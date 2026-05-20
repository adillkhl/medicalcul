import { getAllFormulas } from '@/formulas/registry'
import FormulaClient from './formula-client'

export function generateStaticParams() {
  return getAllFormulas().map((f) => ({
    specialty: f.specialty,
    slug: f.slug,
  }))
}

export default function FormulaPage({ params }: { params: { specialty: string; slug: string } }) {
  return <FormulaClient specialty={params.specialty} slug={params.slug} />
}
