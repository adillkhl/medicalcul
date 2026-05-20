import type { FormulaDefinition, FormulaMeta, Specialty } from './types'

import aquitaintvp from './cardiologie/aquitaintvp'
import cardiac_souffle from './cardiologie/cardiac_souffle'
import ccsangina from './cardiologie/ccsangina'
import chevillebrasidx from './cardiologie/chevillebrasidx'
import crusade from './cardiologie/crusade'
import dapt from './cardiologie/dapt'
import dasi from './cardiologie/dasi'
import dissec_aorte from './cardiologie/dissec_aorte'
import ehra_fa from './cardiologie/ehra_fa'
import euroscore1log from './cardiologie/euroscore1log'
import framingham from './cardiologie/framingham'
import grace from './cardiologie/grace'
import hasbled from './cardiologie/hasbled'
import heart from './cardiologie/heart'
import hemorr2hages from './cardiologie/hemorr2hages'
import herdoo2 from './cardiologie/herdoo2'
import indcornell from './cardiologie/indcornell'
import killip from './cardiologie/killip'
import nyha from './cardiologie/nyha'
import precisedapt from './cardiologie/precisedapt'
import score4peps from './cardiologie/score4peps'
import stesmith3v from './cardiologie/stesmith3v'
import stesmith4v from './cardiologie/stesmith4v'
import timinst from './cardiologie/timinst'
import wellstvp from './cardiologie/wellstvp'
import albi from './gastroenterologie/albi'
import apri from './gastroenterologie/apri'
import balthazar from './gastroenterologie/balthazar'
import balthazar_modifie from './gastroenterologie/balthazar_modifie'
import bisap from './gastroenterologie/bisap'
import child_pugh from './gastroenterologie/child_pugh'
import creus from './gastroenterologie/creus'
import debit_perfusion_glucose from './gastroenterologie/debit_perfusion_glucose'
import detection_ascite from './gastroenterologie/detection_ascite'
import fib4 from './gastroenterologie/fib4'
import fistule_anale_parks from './gastroenterologie/fistule_anale_parks'
import ford from './gastroenterologie/ford'
import forrest from './gastroenterologie/forrest'
import gerdq from './gastroenterologie/gerdq'
import glasgow_blatchford from './gastroenterologie/glasgow_blatchford'
import king from './gastroenterologie/king'
import lila from './gastroenterologie/lila'
import meld from './gastroenterologie/meld'
import meld_na from './gastroenterologie/meld_na'
import nafld from './gastroenterologie/nafld'
import ranson from './gastroenterologie/ranson'
import rockall from './gastroenterologie/rockall'
import ckdepi_2009 from './nephrologie/ckdepi_2009'
import abcd2 from './neurologie/abcd2'
import barthel from './neurologie/barthel'
import bref from './neurologie/bref'
import edssech from './neurologie/edssech'
import epworth from './neurologie/epworth'
import four from './neurologie/four'
import had from './neurologie/had'
import iesr from './neurologie/iesr'
import mms from './neurologie/mms'
import neurodn4 from './neurologie/neurodn4'
import nihss from './neurologie/nihss'
import npi from './neurologie/npi'
import nrs from './neurologie/nrs'
import nutric from './neurologie/nutric'
import rankin from './neurologie/rankin'
import rass from './neurologie/rass'
import sapsii from './neurologie/sapsii'
import selle from './neurologie/selle'
import stess from './neurologie/stess'
import wall from './neurologie/wall'
import wfns from './neurologie/wfns'
import berlin from './orl/berlin'
import centor from './orl/centor'
import feverpain from './orl/feverpain'
import hints from './orl/hints'
import house_brackmann from './orl/house-brackmann'
import le_fort from './orl/le-fort'
import paradise from './orl/paradise'
import stop_bang from './orl/stop-bang'
import sudbury from './orl/sudbury'
import westley from './orl/westley'
import act12 from './pneumologie/act12'
import borg from './pneumologie/borg'
import curb65 from './pneumologie/curb65'
import depistbpco from './pneumologie/depistbpco'
import mmrc from './pneumologie/mmrc'
import peakflow from './pneumologie/peakflow'
import peakflowped from './pneumologie/peakflowped'
import cha2ds2_va from './urgence/cha2ds2-va'
import cha2ds2_vasc from './urgence/cha2ds2-vasc'
import crb_65 from './urgence/crb-65'
import glasgow from './urgence/glasgow'
import has_bled from './urgence/has-bled'
import perc from './urgence/perc'
import qsofa from './urgence/qsofa'
import wells_pe from './urgence/wells-pe'

const registry = new Map<string, FormulaDefinition>()

const formulas: FormulaDefinition[] = [
  // cardiologie
  aquitaintvp,
  cardiac_souffle,
  ccsangina,
  chevillebrasidx,
  crusade,
  dapt,
  dasi,
  dissec_aorte,
  ehra_fa,
  euroscore1log,
  framingham,
  grace,
  hasbled,
  heart,
  hemorr2hages,
  herdoo2,
  indcornell,
  killip,
  nyha,
  precisedapt,
  score4peps,
  stesmith3v,
  stesmith4v,
  timinst,
  wellstvp,
  // gastroenterologie
  albi,
  apri,
  balthazar,
  balthazar_modifie,
  bisap,
  child_pugh,
  creus,
  debit_perfusion_glucose,
  detection_ascite,
  fib4,
  fistule_anale_parks,
  ford,
  forrest,
  gerdq,
  glasgow_blatchford,
  king,
  lila,
  meld,
  meld_na,
  nafld,
  ranson,
  rockall,
  // nephrologie
  ckdepi_2009,
  // neurologie
  abcd2,
  barthel,
  bref,
  edssech,
  epworth,
  four,
  had,
  iesr,
  mms,
  neurodn4,
  nihss,
  npi,
  nrs,
  nutric,
  rankin,
  rass,
  sapsii,
  selle,
  stess,
  wall,
  wfns,
  // orl
  berlin,
  centor,
  feverpain,
  hints,
  house_brackmann,
  le_fort,
  paradise,
  stop_bang,
  sudbury,
  westley,
  // pneumologie
  act12,
  borg,
  curb65,
  depistbpco,
  mmrc,
  peakflow,
  peakflowped,
  // urgence
  cha2ds2_va,
  cha2ds2_vasc,
  crb_65,
  glasgow,
  has_bled,
  perc,
  qsofa,
  wells_pe,
]

formulas.forEach((f) => registry.set(f.slug, f))

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

