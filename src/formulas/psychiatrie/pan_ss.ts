import type { FormulaDefinition } from '../types'

const pan_ss: FormulaDefinition = {
  id: `pan_ss`, slug: `pan_ss`,
  name: `PANSS (Positive And Negative Syndrome Scale)`,
  specialty: `psychiatrie`, category: `Schizophrenie`,
  description: `Echelle de 30 items evaluant les symptomes positifs (7), negatifs (7) et generaux (16) de la schizophrenie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`delires`,type:`radio`,label:`P1 - Delires`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`desorganisation`,type:`radio`,label:`P2 - Desorganisation conceptuelle`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`hallucinations`,type:`radio`,label:`P3 - Hallucinations`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`excitation`,type:`radio`,label:`P4 - Excitation`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`grandeur`,type:`radio`,label:`P5 - Idees de grandeur`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`meffiance`,type:`radio`,label:`P6 - Meffiance / persecution`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`hostilite`,type:`radio`,label:`P7 - Hostilite`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`affect_emousse`,type:`radio`,label:`N1 - Affect emousse`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`retrait_affectif`,type:`radio`,label:`N2 - Retrait affectif`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`mauvais_contact`,type:`radio`,label:`N3 - Mauvais contact`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`retrait_social`,type:`radio`,label:`N4 - Retrait social passif / apathie`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`pensee_abstraite`,type:`radio`,label:`N5 - Difficulte de pensee abstraite`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`spontaneite`,type:`radio`,label:`N6 - Absence de spontaneite / flux de conversation`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`pensee_stereotype`,type:`radio`,label:`N7 - Pensee stereotypee`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`somatiques`,type:`radio`,label:`G1 - Preoccupations somatiques`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`anxiete`,type:`radio`,label:`G2 - Anxiete`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`culpabilite`,type:`radio`,label:`G3 - Culpabilite`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`tension`,type:`radio`,label:`G4 - Tension`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`manieres`,type:`radio`,label:`G5 - Manieres / postures`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`depression`,type:`radio`,label:`G6 - Depression`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`retard_moteur`,type:`radio`,label:`G7 - Retard moteur`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`cooperation`,type:`radio`,label:`G8 - Manque de cooperation`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`pensees_inhabituelles`,type:`radio`,label:`G9 - Contenu de la pensee inhabituel`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`desorientation`,type:`radio`,label:`G10 - Desorientation`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`attention`,type:`radio`,label:`G11 - Deficit d'attention`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`jugement`,type:`radio`,label:`G12 - Manque de jugement et d'insight`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`volition`,type:`radio`,label:`G13 - Trouble de la volition`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`contenance`,type:`radio`,label:`G14 - Mauvaise maitrise des impulsions`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`autisme`,type:`radio`,label:`G15 - Preoccupation autistique`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
    {id:`evitement_social`,type:`radio`,label:`G16 - Evitement social actif`,options:[{value:1,label:`Absent`},{value:2,label:`Minime`},{value:3,label:`Leger`},{value:4,label:`Modere`},{value:5,label:`Moyen`},{value:6,label:`Severe`},{value:7,label:`Extreme`}]},
  ],
  calculate: (values) => {
    const items_pos = ['delires','desorganisation','hallucinations','excitation','grandeur','meffiance','hostilite']
    const items_neg = ['affect_emousse','retrait_affectif','mauvais_contact','retrait_social','pensee_abstraite','spontaneite','pensee_stereotype']
    const items_gen = ['somatiques','anxiete','culpabilite','tension','manieres','depression','retard_moteur','cooperation','pensees_inhabituelles','desorientation','attention','jugement','volition','contenance','autisme','evitement_social']
    const pos = items_pos.reduce((acc,id) => acc + (values[id]??0), 0)
    const neg = items_neg.reduce((acc,id) => acc + (values[id]??0), 0)
    const gen = items_gen.reduce((acc,id) => acc + (values[id]??0), 0)
    const total = pos + neg + gen
    const sev = total >= 80 ? 'high' as const : total >= 60 ? 'moderate' as const : 'low' as const
    return {value:total, label:`PANSS Total ${total} | P${pos} N${neg} G${gen}`, severity: sev,
      details:{positif:pos,negatif:neg,general:gen},
      ranges:[
        {min:30,max:44,label:`Normal ou asymptomatique`,severity:'low'},
        {min:45,max:59,label:`Symptomes legers`,severity:'moderate'},
        {min:60,max:79,label:`Symptomes moderes`,severity:'moderate'},
        {min:80,max:210,label:`Symptomes severes`,severity:'high'},
      ]}
  },
  interpretation: `La PANSS evalue les symptomes de la schizophrenie sur 30 items (7 positifs P1-P7, 7 negatifs N1-N7, 16 generaux G1-G16). Chaque item cote de 1 (absent) a 7 (extreme). Score total de 30 a 210. Les sous-scores P, N, G sont calculables separement.`,
  clinicalCommentary: `Reference internationale pour la schizophrenie dans les essais therapeutiques. Necessite un entretien semi-structure d'environ 30-45 min. Les 30 items cotent la semaine ecoulee. Distinction fondamentale entre les symptomes positifs (productifs) et negatifs (deficitaires). L'item insight (G12) est important pour le pronostic.`,
  references: [
    {type:`pubmed`,title:`Kay SR et al. The PANSS: rationale and standardization. Schizophr Bull 1987`,pmid:`3626516`},
    {type:`pubmed`,title:`Kay SR et al. Reliability and validity of the PANSS. Schizophr Res 1988`},
  ],
}
export default pan_ss
