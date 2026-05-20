import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFormulasByCategory, getFormulaMetas } from '@/formulas/registry'

export function generateStaticParams() {
  const metas = getFormulaMetas()
  return [...new Set(metas.map((f) => f.specialty))].map((specialty) => ({ specialty }))
}

export default function SpecialtyPage({ params }: { params: { specialty: string } }) {
  const specialty = params.specialty as any
  const categories = getFormulasByCategory(specialty)
  const count = Object.values(categories).flat().length

  if (count === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Spécialité en construction</h1>
        <p className="mt-2 text-sm text-zinc-500">Les formules pour cette spécialité arrivent bientôt.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600 underline">Retour à l&apos;accueil</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/" className="mb-6 inline-block text-xs text-zinc-400 hover:text-zinc-600">← Accueil</Link>
      <h1 className="mb-1 text-2xl font-bold capitalize">{specialty}</h1>
      <p className="mb-8 text-sm text-zinc-500">{count} score{count > 1 ? 's' : ''}</p>

      {Object.entries(categories).map(([category, formulas]) => (
        <section key={category} className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">{category}</h2>
          <div className="space-y-1">
            {formulas.map((f) => (
              <Link
                key={f.slug}
                href={`/${specialty}/${f.slug}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-50"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium">{f.name}</span>
                  <p className="truncate text-xs text-zinc-500">{f.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-400">{f.evidenceLevel}</span>
                  <ArrowRight className="size-4 text-zinc-300" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
