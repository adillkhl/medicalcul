import type { FormulaDefinition, FormulaMeta, Specialty } from './types'

import abcd2 from './neurologie/abcd2'
import absi from './brules/absi'
import act12 from './pneumologie/act12'
import adl from './geriatrie/adl'
import adroguemadias from './medecine_interne/adroguemadias'
import afc_resection from './chirurgie/afc_resection'
import afsr_endometriose from './gynecologie/afsr_endometriose'
import agegest_hu from './gynecologie/agegest_hu'
import albi from './gastroenterologie/albi'
import albumine_creatinine_ratio from './nephrologie/albumine_creatinine_ratio'
import aldrete from './anesthesie/aldrete'
import altemeier from './infectiologie/altemeier'
import alvarado from './chirurgie/alvarado'
import ana from './divers/ana'
import anaphylaxie from './urgence/anaphylaxie'
import anemiedef from './hematologie/anemiedef'
import antidotes from './toxicologie/antidotes'
import apache2 from './reanimation/apache2'
import apfel from './anesthesie/apfel'
import apgar_chir from './chirurgie/apgar_chir'
import apgar_nais from './pediatrie/apgar_nais'
import apri from './gastroenterologie/apri'
import aquitaintvp from './cardiologie/aquitaintvp'
import ariscat from './anesthesie/ariscat'
import asa from './anesthesie/asa'
import ascite from './divers/ascite'
import asdas from './rhumatologie/asdas'
import audit from './psychiatrie/audit'
import ballard from './pediatrie/ballard'
import balthazar from './gastroenterologie/balthazar'
import balthazar_modifie from './gastroenterologie/balthazar_modifie'
import bangui from './infectiologie/bangui'
import barthel from './neurologie/barthel'
import basdai from './rhumatologie/basdai'
import basfi from './rhumatologie/basfi'
import baumgarten from './gynecologie/baumgarten'
import beck from './psychiatrie/beck'
import berlin from './orl/berlin'
import bessman from './hematologie/bessman'
import bisap from './gastroenterologie/bisap'
import bishop from './gynecologie/bishop'
import bmi from './nutrition/bmi'
import borg from './pneumologie/borg'
import braden from './dermatologie/braden'
import bref from './neurologie/bref'
import bristol_stool from './pediatrie/bristol_stool'
import broca from './nutrition/broca'
import bronchectasie from './pneumologie/bronchectasie'
import bronchite_asthme from './pneumologie/bronchite_asthme'
import brulure_gravite from './urgence/brulure_gravite'
import burch_wartofsky from './medecine_interne/burch-wartofsky'
import bvaswg from './medecine_interne/bvaswg'
import cacorrigee from './medecine_interne/cacorrigee'
import cage_deta from './toxicologie/cage_deta'
import calgrossesse from './gynecologie/calgrossesse'
import call from './infectiologie/call'
import calorie_besoin from './nutrition/calorie_besoin'
import caprini from './anesthesie/caprini'
import cardiac_souffle from './cardiologie/cardiac_souffle'
import cash from './dermatologie/cash'
import cauchoix from './orthopedie/cauchoix'
import ccsangina from './cardiologie/ccsangina'
import centor from './orl/centor'
import cgi from './psychiatrie/cgi'
import cha2ds2_va from './urgence/cha2ds2-va'
import cha2ds2_vasc from './urgence/cha2ds2-vasc'
import chad from './hematologie/chad'
import chads2 from './cardiologie/chads2'
import charlson from './medecine_interne/charlson'
import chevillebrasidx from './cardiologie/chevillebrasidx'
import chikungunya from './infectiologie/chikungunya'
import child_growth from './pediatrie/child_growth'
import child_pugh from './gastroenterologie/child_pugh'
import ciwaar from './toxicologie/ciwaar'
import ckdepi_2009 from './nephrologie/ckdepi_2009'
import clairance_phosphore from './nephrologie/clairance_phosphore'
import clairance_urea from './nephrologie/clairance_urea'
import clock_test from './geriatrie/clock_test'
import cockcroft from './nephrologie/cockcroft'
import convergencespp from './gynecologie/convergencespp'
import cormack from './anesthesie/cormack'
import corr_gb_pl from './infectiologie/corr_gb_pl'
import cpk from './divers/cpk'
import crb_65 from './urgence/crb-65'
import creatinine_hauteur from './nutrition/creatinine_hauteur'
import creus from './gastroenterologie/creus'
import crusade from './cardiologie/crusade'
import curb65 from './pneumologie/curb65'
import curma from './hematologie/curma'
import cushman from './toxicologie/cushman'
import d_amico from './urologie/d_amico'
import dakar from './infectiologie/dakar'
import dapt from './cardiologie/dapt'
import das28 from './rhumatologie/das28'
import dasi from './cardiologie/dasi'
import datationlcc from './gynecologie/datationlcc'
import debit_perfusion_glucose from './gastroenterologie/debit_perfusion_glucose'
import def_eaulibre from './medecine_interne/def_eaulibre'
import def_sodium from './medecine_interne/def_sodium'
import dehydration_enfant from './pediatrie/dehydration_enfant'
import deltapp from './anesthesie/deltapp'
import dengue from './infectiologie/dengue'
import denutrition_has from './nutrition/denutrition_has'
import depistbpco from './pneumologie/depistbpco'
import detection_ascite from './gastroenterologie/detection_ascite'
import diabetique_acidocetose from './urgence/diabetique_acidocetose'
import dissec_aorte from './cardiologie/dissec_aorte'
import diurese_interp from './soins_infirmiers/diurese_interp'
import dlqi from './dermatologie/dlqi'
import drake from './nephrologie/drake'
import dysmorphisme from './pediatrie/dysmorphisme'
import dyspnee_mrc from './pneumologie/dyspnee_mrc'
import ecog from './oncologie/ecog'
import eczemascorad from './dermatologie/eczemascorad'
import edssech from './neurologie/edssech'
import ehra_fa from './cardiologie/ehra_fa'
import eisinger from './oncologie/eisinger'
import embolie_pulm_wells from './pneumologie/embolie_pulm_wells'
import epds from './psychiatrie/epds'
import epworth from './neurologie/epworth'
import etat_confusion from './urgence/etat_confusion'
import etat_epileptique from './urgence/etat_epileptique'
import euroscore1log from './cardiologie/euroscore1log'
import eva from './soins_infirmiers/eva'
import evendol from './soins_infirmiers/evendol'
import evs from './soins_infirmiers/evs'
import fagerstrom from './toxicologie/fagerstrom'
import fernandez from './gynecologie/fernandez'
import feverpain from './orl/feverpain'
import fhscore from './medecine_interne/fhscore'
import fib4 from './gastroenterologie/fib4'
import fibrose_pulm from './pneumologie/fibrose_pulm'
import figomyome from './gynecologie/figomyome'
import figotropho from './gynecologie/figotropho'
import filtration_glom from './nephrologie/filtration_glom'
import findrisc from './medecine_interne/findrisc'
import firstquest from './rhumatologie/firstquest'
import fistule_anale_parks from './gastroenterologie/fistule_anale_parks'
import fleming from './hematologie/fleming'
import foie_transaminases from './divers/foie_transaminases'
import ford from './gastroenterologie/ford'
import forrest from './gastroenterologie/forrest'
import four from './neurologie/four'
import framingham from './cardiologie/framingham'
import francois_berard from './hematologie/francois_berard'
import fructo_hba1c from './medecine_interne/fructo_hba1c'
import g8quest from './oncologie/g8quest'
import gaf from './psychiatrie/gaf'
import garden from './orthopedie/garden'
import gastvol_perlas from './anesthesie/gastvol_perlas'
import gazometrie from './pneumologie/gazometrie'
import gcs from './divers/gcs'
import gerdq from './gastroenterologie/gerdq'
import get_up_and_go from './geriatrie/get_up_and_go'
import glasgow from './urgence/glasgow'
import glasgow_blatchford from './gastroenterologie/glasgow_blatchford'
import glasgow_reanimation from './reanimation/glasgow_reanimation'
import gleason from './urologie/gleason'
import glycemie_jeune from './nutrition/glycemie_jeune'
import grace from './cardiologie/grace'
import gustilo from './orthopedie/gustilo'
import had from './neurologie/had'
import hama from './psychiatrie/hama'
import hamd from './psychiatrie/hamd'
import haq from './rhumatologie/haq'
import has_bled from './urgence/has-bled'
import hasbled from './cardiologie/hasbled'
import hba1c2gpm from './medecine_interne/hba1c2gpm'
import heart from './cardiologie/heart'
import hematurie from './nephrologie/hematurie'
import hemoptysie_gravite from './pneumologie/hemoptysie_gravite'
import hemorr2hages from './cardiologie/hemorr2hages'
import herdoo2 from './cardiologie/herdoo2'
import higham from './gynecologie/higham'
import hints from './orl/hints'
import hoen from './infectiologie/hoen'
import homa_ir from './medecine_interne/homa_ir'
import house_brackmann from './orl/house-brackmann'
import hypercalcemie_diag from './nephrologie/hypercalcemie_diag'
import hyperkaliemie_diag from './nephrologie/hyperkaliemie_diag'
import hyponatremie_diag from './nephrologie/hyponatremie_diag'
import hypothermie from './urgence/hypothermie'
import iadl from './geriatrie/iadl'
import iesr from './neurologie/iesr'
import iga_nephro from './pediatrie/iga_nephro'
import impc from './nutrition/impc'
import indcornell from './cardiologie/indcornell'
import inhalation_fumee from './brules/inhalation_fumee'
import inr from './divers/inr'
import insuf_renale_aigue from './nephrologie/insuf_renale_aigue'
import intoxication_med from './urgence/intoxication_med'
import ipi from './hematologie/ipi'
import hematologie_ipss from './hematologie/ipss'
import ipss_r from './hematologie/ipss_r'
import urologie_ipss from './urologie/ipss'
import isis from './orthopedie/isis'
import jonesraa from './infectiologie/jonesraa'
import karnofsky from './oncologie/karnofsky'
import kcorrigee from './medecine_interne/kcorrigee'
import kdoqui from './nephrologie/kdoqui'
import khorana from './oncologie/khorana'
import killip from './cardiologie/killip'
import king from './gastroenterologie/king'
import lagrange_rigault from './orthopedie/lagrange_rigault'
import landry from './oncologie/landry'
import le_fort from './orl/le-fort'
import lee from './anesthesie/lee'
import leptospirose from './infectiologie/leptospirose'
import lequesne_genou from './orthopedie/lequesne_genou'
import lequesne_hanche from './orthopedie/lequesne_hanche'
import leuka_acute_class from './hematologie/leuka_acute_class'
import leukemia_lal from './hematologie/leukemia_lal'
import lila from './gastroenterologie/lila'
import lipides from './divers/lipides'
import livedo from './divers/livedo'
import lods from './reanimation/lods'
import lorenz from './nutrition/lorenz'
import lund_browder from './brules/lund_browder'
import lymphome_annarbor from './hematologie/lymphome_annarbor'
import maccabe from './infectiologie/maccabe'
import macocha from './anesthesie/macocha'
import madrs from './psychiatrie/madrs'
import nutrition_maigreur_enfant from './nutrition/maigreur_enfant'
import pediatrie_maigreur_enfant from './pediatrie/maigreur_enfant'
import malinas from './gynecologie/malinas'
import mallampati from './anesthesie/mallampati'
import mannheim from './chirurgie/mannheim'
import manning from './gynecologie/manning'
import mdrd from './nephrologie/mdrd'
import meds from './infectiologie/meds'
import melascore from './dermatologie/melascore'
import meld from './gastroenterologie/meld'
import meld_na from './gastroenterologie/meld_na'
import mini_gds from './geriatrie/mini_gds'
import mini_nutritionnel from './geriatrie/mini_nutritionnel'
import mmrc from './pneumologie/mmrc'
import mms from './neurologie/mms'
import mmse from './geriatrie/mmse'
import moore_rate from './chirurgie/moore_rate'
import morse from './geriatrie/morse'
import murray from './reanimation/murray'
import must from './nutrition/must'
import mwd6 from './medecine_interne/mwd6'
import myasthenic_garche from './medecine_interne/myasthenic_garche'
import nacorrigee from './medecine_interne/nacorrigee'
import nafld from './gastroenterologie/nafld'
import nash from './gastroenterologie/nash'
import nephrocalcinose from './nephrologie/nephrocalcinose'
import neurodn4 from './neurologie/neurodn4'
import news2 from './soins_infirmiers/news2'
import ni_coma_scale from './neurologie/ni_coma_scale'
import nihss from './neurologie/nihss'
import nijmegen_goutte from './rhumatologie/nijmegen_goutte'
import nodscore from './hematologie/nodscore'
import noyade from './urgence/noyade'
import npi from './neurologie/npi'
import nrs from './neurologie/nrs'
import nrs_2002 from './nutrition/nrs_2002'
import nutric from './neurologie/nutric'
import nutriscore from './nutrition/nutriscore'
import nyha from './cardiologie/nyha'
import obp from './nutrition/obp'
import ohwidmark from './toxicologie/ohwidmark'
import one_leg_balance from './geriatrie/one_leg_balance'
import opioides_equiv from './toxicologie/opioides_equiv'
import osla from './pneumologie/osla'
import osmoplasma from './medecine_interne/osmoplasma'
import ottawacheville from './orthopedie/ottawacheville'
import ottawagenou from './orthopedie/ottawagenou'
import oxypnoe from './pneumologie/oxypnoe'
import packyear from './toxicologie/packyear'
import palugrav from './infectiologie/palugrav'
import pam from './cardiologie/pam'
import pan_ss from './psychiatrie/pan_ss'
import pao2_fio2 from './pneumologie/pao2_fio2'
import paradise from './orl/paradise'
import parc from './chirurgie/parc'
import pas from './chirurgie/pas'
import peakflow from './pneumologie/peakflow'
import peakflowped from './pneumologie/peakflowped'
import ped_appendicite from './pediatrie/ped_appendicite'
import ped_glasgow from './pediatrie/ped_glasgow'
import perc from './urgence/perc'
import performance from './oncologie/performance'
import pft from './pneumologie/pft'
import phototype_fitzpatrick from './dermatologie/phototype_fitzpatrick'
import pneumopathie_infect from './pneumologie/pneumopathie_infect'
import pneumothorax from './pneumologie/pneumothorax'
import poids_ideal from './nutrition/poids_ideal'
import pomi from './toxicologie/pomi'
import potassium_urinaire from './nephrologie/potassium_urinaire'
import pr_acreular from './rhumatologie/pr_acreular'
import precisedapt from './cardiologie/precisedapt'
import prematspia from './gynecologie/prematspia'
import proteine_24h from './nephrologie/proteine_24h'
import psoriasis_pasi from './dermatologie/psoriasis_pasi'
import puqe from './gynecologie/puqe'
import purpura from './divers/purpura'
import qsofa from './urgence/qsofa'
import qsofa_rea from './reanimation/qsofa_rea'
import qt_corrige from './cardiologie/qt_corrige'
import ramsay from './anesthesie/ramsay'
import rankin from './neurologie/rankin'
import ranson from './gastroenterologie/ranson'
import rass from './anesthesie/rass'
import rempbruleadulte from './brules/rempbruleadulte'
import rempbruleenfant from './brules/rempbruleenfant'
import riete from './cardiologie/riete'
import rissc from './infectiologie/rissc'
import rituximab_ipi from './hematologie/rituximab_ipi'
import rockall from './gastroenterologie/rockall'
import rudkin from './anesthesie/rudkin'
import salter from './orthopedie/salter'
import saps3 from './reanimation/saps3'
import sapsii from './neurologie/sapsii'
import saturation from './pneumologie/saturation'
import score from './cardiologie/score'
import score2 from './cardiologie/score2'
import score4peps from './cardiologie/score4peps'
import sdai from './rhumatologie/sdai'
import selle from './neurologie/selle'
import sepsis3 from './infectiologie/sepsis3'
import short_physical from './geriatrie/short_physical'
import sideremie from './divers/sideremie'
import silverman from './pediatrie/silverman'
import snellen from './soins_infirmiers/snellen'
import social_isolation from './geriatrie/social_isolation'
import sofa from './reanimation/sofa'
import spia from './gynecologie/spia'
import spondperiph_asas from './rhumatologie/spondperiph_asas'
import spondylo_amor from './rhumatologie/spondylo_amor'
import spondylo_asas from './rhumatologie/spondylo_asas'
import spondylo_essg from './rhumatologie/spondylo_essg'
import st_andre_tvp from './cardiologie/st_andre_tvp'
import stadenvip from './toxicologie/stadenvip'
import stesmith3v from './cardiologie/stesmith3v'
import stesmith4v from './cardiologie/stesmith4v'
import stess from './neurologie/stess'
import stone_score from './urologie/stone_score'
import stop_bang from './orl/stop-bang'
import sudbury from './orl/sudbury'
import surface_valvulaire from './cardiologie/surface_valvulaire'
import syndrome_nephrotique from './nephrologie/syndrome_nephrotique'
import tabac_dependance from './pneumologie/tabac_dependance'
import taille_enfant from './pediatrie/taille_enfant'
import timed_up_and_go from './geriatrie/timed_up_and_go'
import timi_coronarographique from './cardiologie/timi_coronarographique'
import timi_hemorragies from './cardiologie/timi_hemorragies'
import timi_sca from './cardiologie/timi_sca'
import timinst from './cardiologie/timinst'
import tnm from './oncologie/tnm'
import toronto from './brules/toronto'
import trouanioniquep from './medecine_interne/trouanioniquep'
import trouanioniqueu from './medecine_interne/trouanioniqueu'
import tsh from './divers/tsh'
import tubulopathie from './nephrologie/tubulopathie'
import tv from './cardiologie/tv'
import urea_interpretation from './nephrologie/urea_interpretation'
import urgence_hta from './urgence/urgence_hta'
import vauthey from './chirurgie/vauthey'
import villalta from './cardiologie/villalta'
import vitamine_d from './divers/vitamine_d'
import volventiladulte from './anesthesie/volventiladulte'
import wall from './neurologie/wall'
import wallace from './brules/wallace'
import waterlow from './geriatrie/waterlow'
import wells_cath from './hematologie/wells_cath'
import wells_pe from './urgence/wells-pe'
import wellstvp from './cardiologie/wellstvp'
import westley from './orl/westley'
import wfns from './neurologie/wfns'
import wpi_sss from './rhumatologie/wpi_sss'
import ybocs from './psychiatrie/ybocs'

const registry = new Map<string, FormulaDefinition>()

const formulas: FormulaDefinition[] = [
  abcd2,
  absi,
  act12,
  adl,
  adroguemadias,
  afc_resection,
  afsr_endometriose,
  agegest_hu,
  albi,
  albumine_creatinine_ratio,
  aldrete,
  altemeier,
  alvarado,
  ana,
  anaphylaxie,
  anemiedef,
  antidotes,
  apache2,
  apfel,
  apgar_chir,
  apgar_nais,
  apri,
  aquitaintvp,
  ariscat,
  asa,
  ascite,
  asdas,
  audit,
  ballard,
  balthazar,
  balthazar_modifie,
  bangui,
  barthel,
  basdai,
  basfi,
  baumgarten,
  beck,
  berlin,
  bessman,
  bisap,
  bishop,
  bmi,
  borg,
  braden,
  bref,
  bristol_stool,
  broca,
  bronchectasie,
  bronchite_asthme,
  brulure_gravite,
  burch_wartofsky,
  bvaswg,
  cacorrigee,
  cage_deta,
  calgrossesse,
  call,
  calorie_besoin,
  caprini,
  cardiac_souffle,
  cash,
  cauchoix,
  ccsangina,
  centor,
  cgi,
  cha2ds2_va,
  cha2ds2_vasc,
  chad,
  chads2,
  charlson,
  chevillebrasidx,
  chikungunya,
  child_growth,
  child_pugh,
  ciwaar,
  ckdepi_2009,
  clairance_phosphore,
  clairance_urea,
  clock_test,
  cockcroft,
  convergencespp,
  cormack,
  corr_gb_pl,
  cpk,
  crb_65,
  creatinine_hauteur,
  creus,
  crusade,
  curb65,
  curma,
  cushman,
  d_amico,
  dakar,
  dapt,
  das28,
  dasi,
  datationlcc,
  debit_perfusion_glucose,
  def_eaulibre,
  def_sodium,
  dehydration_enfant,
  deltapp,
  dengue,
  denutrition_has,
  depistbpco,
  detection_ascite,
  diabetique_acidocetose,
  dissec_aorte,
  diurese_interp,
  dlqi,
  drake,
  dysmorphisme,
  dyspnee_mrc,
  ecog,
  eczemascorad,
  edssech,
  ehra_fa,
  eisinger,
  embolie_pulm_wells,
  epds,
  epworth,
  etat_confusion,
  etat_epileptique,
  euroscore1log,
  eva,
  evendol,
  evs,
  fagerstrom,
  fernandez,
  feverpain,
  fhscore,
  fib4,
  fibrose_pulm,
  figomyome,
  figotropho,
  filtration_glom,
  findrisc,
  firstquest,
  fistule_anale_parks,
  fleming,
  foie_transaminases,
  ford,
  forrest,
  four,
  framingham,
  francois_berard,
  fructo_hba1c,
  g8quest,
  gaf,
  garden,
  gastvol_perlas,
  gazometrie,
  gcs,
  gerdq,
  get_up_and_go,
  glasgow,
  glasgow_blatchford,
  glasgow_reanimation,
  gleason,
  glycemie_jeune,
  grace,
  gustilo,
  had,
  hama,
  hamd,
  haq,
  has_bled,
  hasbled,
  hba1c2gpm,
  heart,
  hematurie,
  hemoptysie_gravite,
  hemorr2hages,
  herdoo2,
  higham,
  hints,
  hoen,
  homa_ir,
  house_brackmann,
  hypercalcemie_diag,
  hyperkaliemie_diag,
  hyponatremie_diag,
  hypothermie,
  iadl,
  iesr,
  iga_nephro,
  impc,
  indcornell,
  inhalation_fumee,
  inr,
  insuf_renale_aigue,
  intoxication_med,
  ipi,
  hematologie_ipss,
  ipss_r,
  isis,
  jonesraa,
  karnofsky,
  kcorrigee,
  kdoqui,
  khorana,
  killip,
  king,
  lagrange_rigault,
  landry,
  le_fort,
  lee,
  leptospirose,
  lequesne_genou,
  lequesne_hanche,
  leuka_acute_class,
  leukemia_lal,
  lila,
  lipides,
  livedo,
  lods,
  lorenz,
  lund_browder,
  lymphome_annarbor,
  maccabe,
  macocha,
  madrs,
  nutrition_maigreur_enfant,
  malinas,
  mallampati,
  mannheim,
  manning,
  mdrd,
  meds,
  melascore,
  meld,
  meld_na,
  mini_gds,
  mini_nutritionnel,
  mmrc,
  mms,
  mmse,
  moore_rate,
  morse,
  murray,
  must,
  mwd6,
  myasthenic_garche,
  nacorrigee,
  nafld,
  nash,
  nephrocalcinose,
  neurodn4,
  news2,
  ni_coma_scale,
  nihss,
  nijmegen_goutte,
  nodscore,
  noyade,
  npi,
  nrs,
  nrs_2002,
  nutric,
  nutriscore,
  nyha,
  obp,
  ohwidmark,
  one_leg_balance,
  opioides_equiv,
  osla,
  osmoplasma,
  ottawacheville,
  ottawagenou,
  oxypnoe,
  packyear,
  palugrav,
  pam,
  pan_ss,
  pao2_fio2,
  paradise,
  parc,
  pas,
  peakflow,
  peakflowped,
  ped_appendicite,
  ped_glasgow,
  pediatrie_maigreur_enfant,
  perc,
  performance,
  pft,
  phototype_fitzpatrick,
  pneumopathie_infect,
  pneumothorax,
  poids_ideal,
  pomi,
  potassium_urinaire,
  pr_acreular,
  precisedapt,
  prematspia,
  proteine_24h,
  psoriasis_pasi,
  puqe,
  purpura,
  qsofa,
  qsofa_rea,
  qt_corrige,
  ramsay,
  rankin,
  ranson,
  rass,
  rempbruleadulte,
  rempbruleenfant,
  riete,
  rissc,
  rituximab_ipi,
  rockall,
  rudkin,
  salter,
  saps3,
  sapsii,
  saturation,
  score,
  score2,
  score4peps,
  sdai,
  selle,
  sepsis3,
  short_physical,
  sideremie,
  silverman,
  snellen,
  social_isolation,
  sofa,
  spia,
  spondperiph_asas,
  spondylo_amor,
  spondylo_asas,
  spondylo_essg,
  st_andre_tvp,
  stadenvip,
  stesmith3v,
  stesmith4v,
  stess,
  stone_score,
  stop_bang,
  sudbury,
  surface_valvulaire,
  syndrome_nephrotique,
  tabac_dependance,
  taille_enfant,
  timed_up_and_go,
  timi_coronarographique,
  timi_hemorragies,
  timi_sca,
  timinst,
  tnm,
  toronto,
  trouanioniquep,
  trouanioniqueu,
  tsh,
  tubulopathie,
  tv,
  urea_interpretation,
  urgence_hta,
  urologie_ipss,
  vauthey,
  villalta,
  vitamine_d,
  volventiladulte,
  wall,
  wallace,
  waterlow,
  wells_cath,
  wells_pe,
  wellstvp,
  westley,
  wfns,
  wpi_sss,
  ybocs,
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