import type { FormulaDefinition, FormulaMeta, Specialty } from './types'

import abcd2 from './neurologie/abcd2'
import absi from './brules/absi'
import act12 from './pneumologie/act12'
import adroguemadias from './medecine_interne/adroguemadias'
import afc_resection from './chirurgie/afc_resection'
import afsr_endometriose from './gynecologie/afsr_endometriose'
import agegest_hu from './gynecologie/agegest_hu'
import albi from './gastroenterologie/albi'
import aldrete from './anesthesie/aldrete'
import altemeier from './infectiologie/altemeier'
import alvarado from './chirurgie/alvarado'
import antidotes from './toxicologie/antidotes'
import apfel from './anesthesie/apfel'
import apgar_chir from './chirurgie/apgar_chir'
import apri from './gastroenterologie/apri'
import aquitaintvp from './cardiologie/aquitaintvp'
import ariscat from './anesthesie/ariscat'
import asa from './anesthesie/asa'
import asdas from './rhumatologie/asdas'
import balthazar from './gastroenterologie/balthazar'
import balthazar_modifie from './gastroenterologie/balthazar_modifie'
import bangui from './infectiologie/bangui'
import barthel from './neurologie/barthel'
import basdai from './rhumatologie/basdai'
import basfi from './rhumatologie/basfi'
import baumgarten from './gynecologie/baumgarten'
import berlin from './orl/berlin'
import bisap from './gastroenterologie/bisap'
import bishop from './gynecologie/bishop'
import borg from './pneumologie/borg'
import braden from './dermatologie/braden'
import bref from './neurologie/bref'
import burch_wartofsky from './medecine_interne/burch-wartofsky'
import bvaswg from './medecine_interne/bvaswg'
import cacorrigee from './medecine_interne/cacorrigee'
import cage_deta from './toxicologie/cage_deta'
import calgrossesse from './gynecologie/calgrossesse'
import call from './infectiologie/call'
import caprini from './anesthesie/caprini'
import cardiac_souffle from './cardiologie/cardiac_souffle'
import cash from './dermatologie/cash'
import cauchoix from './orthopedie/cauchoix'
import ccsangina from './cardiologie/ccsangina'
import centor from './orl/centor'
import cha2ds2_va from './urgence/cha2ds2-va'
import cha2ds2_vasc from './urgence/cha2ds2-vasc'
import charlson from './medecine_interne/charlson'
import chevillebrasidx from './cardiologie/chevillebrasidx'
import child_pugh from './gastroenterologie/child_pugh'
import ciwaar from './toxicologie/ciwaar'
import ckdepi_2009 from './nephrologie/ckdepi_2009'
import convergencespp from './gynecologie/convergencespp'
import cormack from './anesthesie/cormack'
import corr_gb_pl from './infectiologie/corr_gb_pl'
import crb_65 from './urgence/crb-65'
import creus from './gastroenterologie/creus'
import crusade from './cardiologie/crusade'
import curb65 from './pneumologie/curb65'
import cushman from './toxicologie/cushman'
import dakar from './infectiologie/dakar'
import dapt from './cardiologie/dapt'
import das28 from './rhumatologie/das28'
import dasi from './cardiologie/dasi'
import datationlcc from './gynecologie/datationlcc'
import debit_perfusion_glucose from './gastroenterologie/debit_perfusion_glucose'
import def_eaulibre from './medecine_interne/def_eaulibre'
import def_sodium from './medecine_interne/def_sodium'
import deltapp from './anesthesie/deltapp'
import depistbpco from './pneumologie/depistbpco'
import detection_ascite from './gastroenterologie/detection_ascite'
import dissec_aorte from './cardiologie/dissec_aorte'
import dlqi from './dermatologie/dlqi'
import ecog from './oncologie/ecog'
import eczemascorad from './dermatologie/eczemascorad'
import edssech from './neurologie/edssech'
import ehra_fa from './cardiologie/ehra_fa'
import eisinger from './oncologie/eisinger'
import epworth from './neurologie/epworth'
import euroscore1log from './cardiologie/euroscore1log'
import fagerstrom from './toxicologie/fagerstrom'
import fernandez from './gynecologie/fernandez'
import feverpain from './orl/feverpain'
import fhscore from './medecine_interne/fhscore'
import fib4 from './gastroenterologie/fib4'
import figomyome from './gynecologie/figomyome'
import figotropho from './gynecologie/figotropho'
import findrisc from './medecine_interne/findrisc'
import firstquest from './rhumatologie/firstquest'
import fistule_anale_parks from './gastroenterologie/fistule_anale_parks'
import ford from './gastroenterologie/ford'
import forrest from './gastroenterologie/forrest'
import four from './neurologie/four'
import framingham from './cardiologie/framingham'
import fructo_hba1c from './medecine_interne/fructo_hba1c'
import g8quest from './oncologie/g8quest'
import garden from './orthopedie/garden'
import gastvol_perlas from './anesthesie/gastvol_perlas'
import gerdq from './gastroenterologie/gerdq'
import glasgow from './urgence/glasgow'
import glasgow_blatchford from './gastroenterologie/glasgow_blatchford'
import grace from './cardiologie/grace'
import gustilo from './orthopedie/gustilo'
import had from './neurologie/had'
import haq from './rhumatologie/haq'
import has_bled from './urgence/has-bled'
import hasbled from './cardiologie/hasbled'
import hba1c2gpm from './medecine_interne/hba1c2gpm'
import heart from './cardiologie/heart'
import hemorr2hages from './cardiologie/hemorr2hages'
import herdoo2 from './cardiologie/herdoo2'
import higham from './gynecologie/higham'
import hints from './orl/hints'
import hoen from './infectiologie/hoen'
import homa_ir from './medecine_interne/homa_ir'
import house_brackmann from './orl/house-brackmann'
import iesr from './neurologie/iesr'
import indcornell from './cardiologie/indcornell'
import inhalation_fumee from './brules/inhalation_fumee'
import isis from './orthopedie/isis'
import jonesraa from './infectiologie/jonesraa'
import karnofsky from './oncologie/karnofsky'
import kcorrigee from './medecine_interne/kcorrigee'
import khorana from './oncologie/khorana'
import killip from './cardiologie/killip'
import king from './gastroenterologie/king'
import lagrange_rigault from './orthopedie/lagrange_rigault'
import landry from './oncologie/landry'
import le_fort from './orl/le-fort'
import lee from './anesthesie/lee'
import lequesne_genou from './orthopedie/lequesne_genou'
import lequesne_hanche from './orthopedie/lequesne_hanche'
import lila from './gastroenterologie/lila'
import lund_browder from './brules/lund_browder'
import maccabe from './infectiologie/maccabe'
import macocha from './anesthesie/macocha'
import malinas from './gynecologie/malinas'
import mallampati from './anesthesie/mallampati'
import mannheim from './chirurgie/mannheim'
import manning from './gynecologie/manning'
import meds from './infectiologie/meds'
import melascore from './dermatologie/melascore'
import meld from './gastroenterologie/meld'
import meld_na from './gastroenterologie/meld_na'
import mmrc from './pneumologie/mmrc'
import mms from './neurologie/mms'
import moore_rate from './chirurgie/moore_rate'
import mwd6 from './medecine_interne/mwd6'
import myasthenic_garche from './medecine_interne/myasthenic_garche'
import nacorrigee from './medecine_interne/nacorrigee'
import nafld from './gastroenterologie/nafld'
import neurodn4 from './neurologie/neurodn4'
import nihss from './neurologie/nihss'
import nijmegen_goutte from './rhumatologie/nijmegen_goutte'
import npi from './neurologie/npi'
import nrs from './neurologie/nrs'
import nutric from './neurologie/nutric'
import nyha from './cardiologie/nyha'
import ohwidmark from './toxicologie/ohwidmark'
import opioides_equiv from './toxicologie/opioides_equiv'
import osmoplasma from './medecine_interne/osmoplasma'
import ottawacheville from './orthopedie/ottawacheville'
import ottawagenou from './orthopedie/ottawagenou'
import packyear from './toxicologie/packyear'
import palugrav from './infectiologie/palugrav'
import paradise from './orl/paradise'
import parc from './chirurgie/parc'
import pas from './chirurgie/pas'
import peakflow from './pneumologie/peakflow'
import peakflowped from './pneumologie/peakflowped'
import perc from './urgence/perc'
import phototype_fitzpatrick from './dermatologie/phototype_fitzpatrick'
import pomi from './toxicologie/pomi'
import pr_acreular from './rhumatologie/pr_acreular'
import precisedapt from './cardiologie/precisedapt'
import prematspia from './gynecologie/prematspia'
import psoriasis_pasi from './dermatologie/psoriasis_pasi'
import puqe from './gynecologie/puqe'
import qsofa from './urgence/qsofa'
import ramsay from './anesthesie/ramsay'
import rankin from './neurologie/rankin'
import ranson from './gastroenterologie/ranson'
import rass from './anesthesie/rass'
import rempbruleadulte from './brules/rempbruleadulte'
import rempbruleenfant from './brules/rempbruleenfant'
import rissc from './infectiologie/rissc'
import rockall from './gastroenterologie/rockall'
import rudkin from './anesthesie/rudkin'
import salter from './orthopedie/salter'
import sapsii from './neurologie/sapsii'
import score4peps from './cardiologie/score4peps'
import sdai from './rhumatologie/sdai'
import selle from './neurologie/selle'
import sepsis3 from './infectiologie/sepsis3'
import spia from './gynecologie/spia'
import spondperiph_asas from './rhumatologie/spondperiph_asas'
import spondylo_amor from './rhumatologie/spondylo_amor'
import spondylo_asas from './rhumatologie/spondylo_asas'
import spondylo_essg from './rhumatologie/spondylo_essg'
import stadenvip from './toxicologie/stadenvip'
import stesmith3v from './cardiologie/stesmith3v'
import stesmith4v from './cardiologie/stesmith4v'
import stess from './neurologie/stess'
import stop_bang from './orl/stop-bang'
import sudbury from './orl/sudbury'
import timinst from './cardiologie/timinst'
import toronto from './brules/toronto'
import trouanioniquep from './medecine_interne/trouanioniquep'
import trouanioniqueu from './medecine_interne/trouanioniqueu'
import vauthey from './chirurgie/vauthey'
import volventiladulte from './anesthesie/volventiladulte'
import wall from './neurologie/wall'
import wallace from './brules/wallace'
import wells_pe from './urgence/wells-pe'
import wellstvp from './cardiologie/wellstvp'
import westley from './orl/westley'
import wfns from './neurologie/wfns'
import wpi_sss from './rhumatologie/wpi_sss'

const registry = new Map<string, FormulaDefinition>()

const formulas: FormulaDefinition[] = [
  abcd2,
  absi,
  act12,
  adroguemadias,
  afc_resection,
  afsr_endometriose,
  agegest_hu,
  albi,
  aldrete,
  altemeier,
  alvarado,
  antidotes,
  apfel,
  apgar_chir,
  apri,
  aquitaintvp,
  ariscat,
  asa,
  asdas,
  balthazar,
  balthazar_modifie,
  bangui,
  barthel,
  basdai,
  basfi,
  baumgarten,
  berlin,
  bisap,
  bishop,
  borg,
  braden,
  bref,
  burch_wartofsky,
  bvaswg,
  cacorrigee,
  cage_deta,
  calgrossesse,
  call,
  caprini,
  cardiac_souffle,
  cash,
  cauchoix,
  ccsangina,
  centor,
  cha2ds2_va,
  cha2ds2_vasc,
  charlson,
  chevillebrasidx,
  child_pugh,
  ciwaar,
  ckdepi_2009,
  convergencespp,
  cormack,
  corr_gb_pl,
  crb_65,
  creus,
  crusade,
  curb65,
  cushman,
  dakar,
  dapt,
  das28,
  dasi,
  datationlcc,
  debit_perfusion_glucose,
  def_eaulibre,
  def_sodium,
  deltapp,
  depistbpco,
  detection_ascite,
  dissec_aorte,
  dlqi,
  ecog,
  eczemascorad,
  edssech,
  ehra_fa,
  eisinger,
  epworth,
  euroscore1log,
  fagerstrom,
  fernandez,
  feverpain,
  fhscore,
  fib4,
  figomyome,
  figotropho,
  findrisc,
  firstquest,
  fistule_anale_parks,
  ford,
  forrest,
  four,
  framingham,
  fructo_hba1c,
  g8quest,
  garden,
  gastvol_perlas,
  gerdq,
  glasgow,
  glasgow_blatchford,
  grace,
  gustilo,
  had,
  haq,
  has_bled,
  hasbled,
  hba1c2gpm,
  heart,
  hemorr2hages,
  herdoo2,
  higham,
  hints,
  hoen,
  homa_ir,
  house_brackmann,
  iesr,
  indcornell,
  inhalation_fumee,
  isis,
  jonesraa,
  karnofsky,
  kcorrigee,
  khorana,
  killip,
  king,
  lagrange_rigault,
  landry,
  le_fort,
  lee,
  lequesne_genou,
  lequesne_hanche,
  lila,
  lund_browder,
  maccabe,
  macocha,
  malinas,
  mallampati,
  mannheim,
  manning,
  meds,
  melascore,
  meld,
  meld_na,
  mmrc,
  mms,
  moore_rate,
  mwd6,
  myasthenic_garche,
  nacorrigee,
  nafld,
  neurodn4,
  nihss,
  nijmegen_goutte,
  npi,
  nrs,
  nutric,
  nyha,
  ohwidmark,
  opioides_equiv,
  osmoplasma,
  ottawacheville,
  ottawagenou,
  packyear,
  palugrav,
  paradise,
  parc,
  pas,
  peakflow,
  peakflowped,
  perc,
  phototype_fitzpatrick,
  pomi,
  pr_acreular,
  precisedapt,
  prematspia,
  psoriasis_pasi,
  puqe,
  qsofa,
  ramsay,
  rankin,
  ranson,
  rass,
  rempbruleadulte,
  rempbruleenfant,
  rissc,
  rockall,
  rudkin,
  salter,
  sapsii,
  score4peps,
  sdai,
  selle,
  sepsis3,
  spia,
  spondperiph_asas,
  spondylo_amor,
  spondylo_asas,
  spondylo_essg,
  stadenvip,
  stesmith3v,
  stesmith4v,
  stess,
  stop_bang,
  sudbury,
  timinst,
  toronto,
  trouanioniquep,
  trouanioniqueu,
  vauthey,
  volventiladulte,
  wall,
  wallace,
  wells_pe,
  wellstvp,
  westley,
  wfns,
  wpi_sss,
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