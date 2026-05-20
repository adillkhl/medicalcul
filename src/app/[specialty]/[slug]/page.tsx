import { getAllFormulas } from '@/formulas/registry'
import FormulaClient from './formula-client'

export function generateStaticParams() {
  return getAllFormulas().map((f) => ({
    specialty: f.specialty,
    slug: f.slug,
  }))
}

export default async function FormulaPage(props: { params: Promise<{ specialty: string; slug: string }> }) {
  const { specialty, slug } = await props.params
  return <FormulaClient specialty={specialty} slug={slug} />
}
