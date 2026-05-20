import type { FormulaDefinition } from '../types'

const gleason: FormulaDefinition = {
  id: `gleason`, slug: `gleason`,
  name: `Score de Gleason pour le Cancer de la Prostate`,
  specialty: `urologie`, category: `Prostate`,
  description: `Classification histopathologique du cancer de la prostate basee sur l\'architecture glandulaire (2 grades dominants, score 2-10)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`grade1`,type:`radio`,label:`Grade primaire (le plus frequent)`,options:[
      {value:1,label:`Grade 1 - Petites glandes uniformes, tres differenciees`},
      {value:2,label:`Grade 2 - Glandes irregulieres, moins bien formees`},
      {value:3,label:`Grade 3 - Glandes infiltrees, differentes tailles`},
      {value:4,label:`Grade 4 - Glandes fusionnees, cribriformes`},
      {value:5,label:`Grade 5 - Masses solides, cellules en batonnets, comedonecrose`},
    ]},
    {id:`grade2`,type:`radio`,label:`Grade secondaire (le second plus frequent)`,options:[
      {value:1,label:`Grade 1 - Petites glandes uniformes, tres differenciees`},
      {value:2,label:`Grade 2 - Glandes irregulieres, moins bien formees`},
      {value:3,label:`Grade 3 - Glandes infiltrees, differentes tailles`},
      {value:4,label:`Grade 4 - Glandes fusionnees, cribriformes`},
      {value:5,label:`Grade 5 - Masses solides, cellules en batonnets, comedonecrose`},
    ]},
  ],
  calculate: (values) => {
    const g1 = values.grade1 ?? 3
    const g2 = values.grade2 ?? 3
    const score = g1 + g2
    
    let sev: 'low'|'moderate'|'high'
    let label
    if (score <= 6) { sev = 'low'; label = 'Bien differencie' }
    else if (score === 7) { sev = 'moderate'; label = g1 === 4 ? 'Peu differencie (4+3)' : 'Moyennement differencie (3+4)' }
    else { sev = 'high'; label = 'Peu / non differencie' }

    return {value:score, label:`Gleason ${g1}+${g2}=${score} - ${label}`, severity: sev,
      details:{grade_primaire:g1,grade_secondaire:g2,score_total:score},
      ranges:[
        {min:2,max:6,label:`Gleason 6 (ou moins) - Faible risque`,severity:'low',recommendation:`Pronostic favorable. Surveillance active ou traitement curatif selon le contexte.`},
        {min:7,max:7,label:`Gleason 7 - Risque intermediaire`,severity:'moderate',recommendation:`Pronostic intermediaire. Distinguer 3+4 (favorable) vs 4+3 (defavorable). Traitement curatif.`},
        {min:8,max:10,label:`Gleason 8-10 - Haut risque`,severity:'high',recommendation:`Pronostic defavorable. Traitement multimodal (radiotherapie + hormonotherapie longue).`},
      ]}
  },
  interpretation: `Le score de Gleason est le systeme de gradation histologique du cancer de la prostate. Le grade primaire represente l\'architecture predominante (la plus frequente), le grade secondaire est la seconde plus frequente. Score total = grade1 + grade2 (de 2 a 10). Le pronostic est correle au score.`,
  clinicalCommentary: `Pièce fondamentale : biopsie prostatique (trocart) ou piece de prostatectomie. Le Gleason 3+3=6 (grade groupe 1) est le moins agressif. Le Gleason 4+3=7 (grade groupe 3) est plus agressif que 3+4=7 (grade groupe 2). Le Gleason 8 (grade groupe 4) et 9-10 (grade groupe 5) sont de haut risque. La classification ISUP 2014 (5 groupes) remplace progressivement le score simple. Ne pas additionner les grades a partir de biopsies multiples - chaque carotte a son propre score.`,
  references: [
    {type:`pubmed`,title:`Gleason DF, Mellinger GT. Prediction of prognosis for prostatic adenocarcinoma. J Urol 1974`,pmid:`4133650`},
    {type:`pubmed`,title:`Epstein JI et al. The 2014 International Society of Urological Pathology (ISUP) Consensus Conference on Gleason Grading. Am J Surg Pathol 2016`,pmid:`26492179`},
  ],
}
export default gleason
