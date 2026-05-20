'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calculator, ArrowLeft, BookOpen, FileText, AlertCircle } from 'lucide-react'
import { getFormula } from '@/formulas/registry'
import type { FormulaDefinition, FormulaInput, FormulaResult } from '@/formulas/types'

const severityColors = {
  low: 'bg-green-50 text-green-700 border-green-200',
  moderate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
  critical: 'bg-red-100 text-red-800 border-red-300',
}

function InputField({ input, value, onChange }: { input: FormulaInput; value: any; onChange: (id: string, v: any) => void }) {
  switch (input.type) {
    case 'boolean':
      return (
        <label className="flex items-start gap-3 rounded-lg border border-zinc-100 px-3 py-2.5 transition-colors hover:border-zinc-200 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(input.id, e.target.checked)}
            className="mt-0.5 size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-200"
          />
          <span className="text-sm leading-snug">{input.label}</span>
        </label>
      )

    case 'number':
      return (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-100 px-3 py-2.5">
          <label htmlFor={input.id} className="flex-1 text-sm">{input.label}</label>
          <div className="flex items-center gap-1">
            <input
              id={input.id}
              type="number"
              min={input.min}
              max={input.max}
              step={input.step ?? 1}
              placeholder={input.placeholder}
              value={value ?? ''}
              onChange={(e) => onChange(input.id, e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-20 rounded-md border border-zinc-200 px-2 py-1 text-right text-sm outline-none focus:border-blue-400"
            />
            {input.unit && <span className="text-xs text-zinc-400 w-8">{input.unit}</span>}
          </div>
        </div>
      )

    case 'radio':
      return (
        <fieldset className="rounded-lg border border-zinc-100 px-3 py-2.5">
          <legend className="mb-2 text-sm font-medium">{input.label}</legend>
          <div className="space-y-1.5">
            {input.options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name={input.id}
                  checked={value === opt.value}
                  onChange={() => onChange(input.id, opt.value)}
                  className="size-4 border-zinc-300 text-blue-600 focus:ring-blue-200"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )

    case 'select':
      return (
        <div className="rounded-lg border border-zinc-100 px-3 py-2.5">
          <label htmlFor={input.id} className="mb-1 block text-sm">{input.label}</label>
          <select
            id={input.id}
            value={value ?? ''}
            onChange={(e) => onChange(input.id, e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400"
          >
            <option value="">—</option>
            {input.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )

    default:
      return null
  }
}

export default function FormulaPage() {
  const params = useParams()
  const formula = getFormula(params.slug as string)
  const [values, setValues] = useState<Record<string, any>>({})
  const [result, setResult] = useState<FormulaResult | null>(null)

  const setValue = useCallback((id: string, v: any) => {
    setValues((prev) => ({ ...prev, [id]: v }))
  }, [])

  const handleCalculate = useCallback(() => {
    if (!formula) return
    const res = formula.calculate(values)
    setResult(res)
  }, [formula, values])

  if (!formula) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-4 size-8 text-zinc-300" />
        <h1 className="text-xl font-semibold">Score introuvable</h1>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600 underline">Retour à l&apos;accueil</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link
        href={`/${params.specialty}`}
        className="mb-4 inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600"
      >
        <ArrowLeft className="size-3" /> {params.specialty}
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight">{formula.name}</h1>
      <p className="mt-1 text-sm text-zinc-500">{formula.description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
          {formula.category}
        </span>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
          Niveau {formula.evidenceLevel}
        </span>
        <span className="rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-400">
          v{formula.version} · {formula.lastValidated}
        </span>
      </div>

      {/* Calculator */}
      <div className="mt-8 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Calculator className="size-4 text-zinc-400" /> Calculateur
        </h2>

        <div className="space-y-2">
          {formula.inputs.map((input) => (
            <InputField
              key={input.id}
              input={input}
              value={values[input.id]}
              onChange={setValue}
            />
          ))}
        </div>

        <button
          onClick={handleCalculate}
          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Calculer
        </button>

        {/* Result */}
        {result && (
          <div className="mt-5 space-y-3">
            <hr className="border-zinc-100" />

            <div className={`rounded-xl border p-4 ${result.severity ? severityColors[result.severity] : 'bg-zinc-50'}`}>
              <div className="text-center">
                <span className="text-4xl font-bold tabular-nums">{result.value}</span>
                {result.risk !== undefined && (
                  <p className="mt-1 text-sm">
                    Risque : <strong>{result.risk}</strong>{result.riskUnit ? ` ${result.riskUnit}` : ''}
                  </p>
                )}
                {result.label && <p className="mt-1 text-sm font-medium">{result.label}</p>}
              </div>
            </div>

            {/* Ranges table */}
            {result.ranges && result.ranges.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">Interprétation des seuils :</p>
                {result.ranges.map((r, i) => {
                  const isActive = result.value >= r.min && result.value <= r.max
                  return (
                    <div
                      key={i}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        isActive ? 'border-blue-200 bg-blue-50' : 'border-zinc-100 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-medium">{r.label}</span>
                          {r.recommendation && <p className="text-xs mt-0.5">{r.recommendation}</p>}
                        </div>
                        <span className="shrink-0 text-xs tabular-nums">
                          {r.min === r.max ? `= ${r.min}` : `${r.min}–${r.max}`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Interpretation text */}
            <div className="rounded-lg bg-zinc-50 px-4 py-3">
              <p className="text-xs font-semibold text-zinc-500 mb-2">Interprétation</p>
              <div className="text-sm leading-relaxed text-zinc-700 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: formula.interpretation }} />
            </div>

            {/* Clinical commentary */}
            {formula.clinicalCommentary && (
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-xs font-semibold text-amber-600 mb-1">⚠️ En pratique</p>
                <div className="text-sm leading-relaxed text-amber-800" dangerouslySetInnerHTML={{ __html: formula.clinicalCommentary }} />
              </div>
            )}

            {/* References */}
            {formula.references.length > 0 && (
              <div className="pt-2">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                  <FileText className="size-3" /> Références
                </p>
                <ul className="space-y-1">
                  {formula.references.map((ref, i) => (
                    <li key={i} className="text-xs text-zinc-500">
                      {ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600"
                        >
                          {ref.title}
                        </a>
                      ) : ref.pmid ? (
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600"
                        >
                          {ref.title} (PMID: {ref.pmid})
                        </a>
                      ) : (
                        ref.title
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-xs text-zinc-400">
        Dernière validation : {formula.lastValidated} · Niveau de preuve : {formula.evidenceLevel}
      </footer>
    </div>
  )
}
