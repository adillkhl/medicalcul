'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Stethoscope, ArrowRight, Clock, BookOpen } from 'lucide-react'
import { getFormulaMetas, getSpecialties, searchFormulas } from '@/formulas/registry'
import type { Specialty } from '@/formulas/types'

const specialtyLabels: Record<Specialty, string> = {
  urgence: 'Médecine d\'Urgence',
  orl: 'ORL',
  cardiologie: 'Cardiologie',
  neurologie: 'Neurologie',
  pneumologie: 'Pneumologie',
  pediatrie: 'Pédiatrie',
  gynecologie: 'Gynécologie',
  gastroenterologie: 'Gastro-Entérologie',
  nephrologie: 'Néphrologie',
  hematologie: 'Hématologie',
  rhumatologie: 'Rhumatologie',
  psychiatrie: 'Psychiatrie',
  infectiologie: 'Infectiologie',
  reanimation: 'Réanimation',
  dermatologie: 'Dermatologie',
  nutrition: 'Nutrition',
  toxicologie: 'Toxicologie',
  ophtalmologie: 'Ophtalmologie',
  divers: 'Divers',
}

export default function Home() {
  const [query, setQuery] = useState('')
  const metas = useMemo(() => getFormulaMetas(), [])
  const specialties = useMemo(() => getSpecialties(), [])
  const results = useMemo(() => {
    if (!query.trim()) return null
    return searchFormulas(query)
  }, [query])

  const recentFormulas = metas.slice(0, 3)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-blue-600">Medi</span>calcul
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Calculateurs et scores médicaux — références scientifiques validées
        </p>
      </header>

      {/* Search */}
      <div className="relative mx-auto mb-10 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Rechercher un score, une spécialité…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Search results */}
      {results && results.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Résultats ({results.length})
          </h2>
          <div className="space-y-1">
            {results.map((f) => (
              <Link
                key={f.slug}
                href={`/${f.specialty}/${f.slug}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-zinc-50"
              >
                <Stethoscope className="size-4 shrink-0 text-blue-500" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium">{f.name}</span>
                  <span className="ml-2 text-xs text-zinc-400">{specialtyLabels[f.specialty]}</span>
                  <p className="truncate text-xs text-zinc-500">{f.description}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-zinc-300" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {results && results.length === 0 && (
        <p className="mb-10 text-center text-sm text-zinc-400">Aucun résultat pour « {query} »</p>
      )}

      {/* Specialties grid */}
      {!query && (
        <>
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Spécialités
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {specialties.map((s) => (
                <Link
                  key={s}
                  href={`/${s}`}
                  className="rounded-xl border border-zinc-100 bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-zinc-200 hover:bg-zinc-50"
                >
                  {specialtyLabels[s]}
                </Link>
              ))}
            </div>
          </section>

          {/* Recent / featured */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Scores récemment ajoutés
            </h2>
            <div className="space-y-2">
              {recentFormulas.map((f) => (
                <Link
                  key={f.slug}
                  href={`/${f.specialty}/${f.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-zinc-100 px-4 py-3 transition-colors hover:border-zinc-200"
                >
                  <BookOpen className="size-4 shrink-0 text-zinc-400" />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{f.name}</span>
                    <span className="ml-2 text-xs text-zinc-400">{f.category}</span>
                    <p className="truncate text-xs text-zinc-500">{f.description}</p>
                  </div>
                  <Clock className="size-4 shrink-0 text-zinc-300" />
                </Link>
              ))}
            </div>
          </section>

          <footer className="mt-12 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-400">
            <p>
              L&apos;évaluation d&apos;un patient est avant tout clinique et/ou biologique. Les résultats fournis ne
              remplacent pas le jugement clinique.
            </p>
          </footer>
        </>
      )}
    </div>
  )
}
