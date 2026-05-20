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
import afsr_endometriose from './gynecologie/afsr_endometriose'
import agegest_hu from './gynecologie/agegest_hu'
import baumgarten from './gynecologie/baumgarten'
import bishop from './gynecologie/bishop'
import calgrossesse from './gynecologie/calgrossesse'
import convergencespp from './gynecologie/convergencespp'
import datationlcc from './gynecologie/datationlcc'
import fernandez from './gynecologie/fernandez'
import figomyome from './gynecologie/figomyome'
import figotropho from './gynecologie/figotropho'
import higham from './gynecologie/higham'
import malinas from './gynecologie/malinas'
import manning from './gynecologie/manning'
import prematspia from './gynecologie/prematspia'
import puqe from './gynecologie/puqe'
import spia from './gynecologie/spia'
import altemeier from './infectiologie/altemeier'
import bangui from './infectiologie/bangui'
import call from './infectiologie/call'
import corr_gb_pl from './infectiologie/corr_gb_pl'
import dakar from './infectiologie/dakar'
import hoen from './infectiologie/hoen'
import jonesraa from './infectiologie/jonesraa'
import maccabe from './infectiologie/maccabe'
import meds from './infectiologie/meds'
import palugrav from './infectiologie/palugrav'
import rissc from './infectiologie/rissc'
import sepsis3 from './infectiologie/sepsis3'
import adroguemadias from './medecine_interne/adroguemadias'
import burch_wartofsky from './medecine_interne/burch-wartofsky'
import bvaswg from './medecine_interne/bvaswg'
import cacorrigee from './medecine_interne/cacorrigee'
import charlson from './medecine_interne/charlson'
import def_eaulibre from './medecine_interne/def_eaulibre'
import def_sodium from './medecine_interne/def_sodium'
import fhscore from './medecine_interne/fhscore'
import findrisc from './medecine_interne/findrisc'
import fructo_hba1c from './medecine_interne/fructo_hba1c'
import hba1c2gpm from './medecine_interne/hba1c2gpm'
import homa_ir from './medecine_interne/homa_ir'
import kcorrigee from './medecine_interne/kcorrigee'
import mwd6 from './medecine_interne/mwd6'
import myasthenic_garche from './medecine_interne/myasthenic_garche'
import nacorrigee from './medecine_interne/nacorrigee'
import osmoplasma from './medecine_interne/osmoplasma'
import trouanioniquep from './medecine_interne/trouanioniquep'
import trouanioniqueu from './medecine_interne/trouanioniqueu'
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
import ecog from './oncologie/ecog'
import eisinger from './oncologie/eisinger'
import g8quest from './oncologie/g8quest'
import karnofsky from './oncologie/karnofsky'
import khorana from './oncologie/khorana'
import landry from './oncologie/landry'
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
import cauchoix from './orthopedie/cauchoix'
import garden from './orthopedie/garden'
import gustilo from './orthopedie/gustilo'
import isis from './orthopedie/isis'
import lagrange_rigault from './orthopedie/lagrange_rigault'
import lequesne_genou from './orthopedie/lequesne_genou'
import lequesne_hanche from './orthopedie/lequesne_hanche'
import ottawacheville from './orthopedie/ottawacheville'
import ottawagenou from './orthopedie/ottawagenou'
import salter from './orthopedie/salter'
import act12 from './pneumologie/act12'
import borg from './pneumologie/borg'
import curb65 from './pneumologie/curb65'
import depistbpco from './pneumologie/depistbpco'
import mmrc from './pneumologie/mmrc'
import peakflow from './pneumologie/peakflow'
import peakflowped from './pneumologie/peakflowped'
import asdas from './rhumatologie/asdas'
import basdai from './rhumatologie/basdai'
import basfi from './rhumatologie/basfi'
import das28 from './rhumatologie/das28'
import firstquest from './rhumatologie/firstquest'
import haq from './rhumatologie/haq'
import nijmegen_goutte from './rhumatologie/nijmegen_goutte'
import pr_acreular from './rhumatologie/pr_acreular'
import sdai from './rhumatologie/sdai'
import spondperiph_asas from './rhumatologie/spondperiph_asas'
import spondylo_amor from './rhumatologie/spondylo_amor'
import spondylo_asas from './rhumatologie/spondylo_asas'
import spondylo_essg from './rhumatologie/spondylo_essg'
import wpi_sss from './rhumatologie/wpi_sss'
import antidotes from './toxicologie/antidotes'
import cage_deta from './toxicologie/cage_deta'
import ciwaar from './toxicologie/ciwaar'
import cushman from './toxicologie/cushman'
import fagerstrom from './toxicologie/fagerstrom'
import ohwidmark from './toxicologie/ohwidmark'
import opioides_equiv from './toxicologie/opioides_equiv'
import packyear from './toxicologie/packyear'
import pomi from './toxicologie/pomi'
import stadenvip from './toxicologie/stadenvip'
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
  // gynecologie
  afsr_endometriose,
  agegest_hu,
  baumgarten,
  bishop,
  calgrossesse,
  convergencespp,
  datationlcc,
  fernandez,
  figomyome,
  figotropho,
  higham,
  malinas,
  manning,
  prematspia,
  puqe,
  spia,
  // infectiologie
  altemeier,
  bangui,
  call,
  corr_gb_pl,
  dakar,
  hoen,
  jonesraa,
  maccabe,
  meds,
  palugrav,
  rissc,
  sepsis3,
  // medecine_interne
  adroguemadias,
  burch_wartofsky,
  bvaswg,
  cacorrigee,
  charlson,
  def_eaulibre,
  def_sodium,
  fhscore,
  findrisc,
  fructo_hba1c,
  hba1c2gpm,
  homa_ir,
  kcorrigee,
  mwd6,
  myasthenic_garche,
  nacorrigee,
  osmoplasma,
  trouanioniquep,
  trouanioniqueu,
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
  // oncologie
  ecog,
  eisinger,
  g8quest,
  karnofsky,
  khorana,
  landry,
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
  // orthopedie
  cauchoix,
  garden,
  gustilo,
  isis,
  lagrange_rigault,
  lequesne_genou,
  lequesne_hanche,
  ottawacheville,
  ottawagenou,
  salter,
  // pneumologie
  act12,
  borg,
  curb65,
  depistbpco,
  mmrc,
  peakflow,
  peakflowped,
  // rhumatologie
  asdas,
  basdai,
  basfi,
  das28,
  firstquest,
  haq,
  nijmegen_goutte,
  pr_acreular,
  sdai,
  spondperiph_asas,
  spondylo_amor,
  spondylo_asas,
  spondylo_essg,
  wpi_sss,
  // toxicologie
  antidotes,
  cage_deta,
  ciwaar,
  cushman,
  fagerstrom,
  ohwidmark,
  opioides_equiv,
  packyear,
  pomi,
  stadenvip,
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

