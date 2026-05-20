import type { FormulaDefinition } from '../types'

const d_amico: FormulaDefinition = {
  id: `d_amico`, slug: `d_amico`,
  name: `Classification de D'Amico pour le Cancer de la Prostate`,
  specialty: `urologie`, category: `Prostate`,
  description: `Stratification du risque de cancer de la prostate selon le PSA, le score de Gleason et le stade clinique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`psa`,type:`radio`,label:`PSA total (ng/mL)`,options:[{value:0,label:`< 10`},{value:1,label:`10-20`},{value:2,label:`> 20`}]},
    {id:`gleason`,type:`radio`,label:`Score de Gleason`,options:[{value:0,label:`Gleason <= 6`},{value:1,label:`Gleason 7 (3+4 ou 4+3)`},{value:2,label:`Gleason 8-10`}]},
    {id:`stade`,type:`radio`,label:`Stade clinique (TNM)`,options:[{value:0,label:`T1-T2a`},{value:1,label:`T2b-T2c`},{value:2,label:`T3a ou plus`}]},
  ],
  calculate: (values) => {
    const psa = values.psa ?? 0
    const gleason = values.gleason ?? 0
    const stade = values.stade ?? 0
    
    let groupe: string
    let sev: 'low'|'moderate'|'high'
    
    // D'Amico classification
    if (psa <= 0 && gleason <= 0 && stade <= 0) {
      groupe = 'Faible risque'
      sev = 'low'
    } else if (gleason >= 2 || (gleason === 1) || psa >= 2 || stade >= 1) {
      // At least one high-risk feature
      if (gleason >= 2 || psa >= 2 || stade >= 2) {
        groupe = 'Haut risque'
        sev = 'high'
      } else {
        groupe = 'Risque intermediaire'
        sev = 'moderate'
      }
    } else {
      groupe = 'Faible risque'
      sev = 'low'
    }

    return {value:psa+gleason+stade, label:`D'Amico : ${groupe}`, severity: sev,
      details:{PSA:`${psa>0?psa===1?'10-20':'>20':'<10'} ng/mL`,gleason:`${gleason===0?'<=6':gleason===1?'7':'8-10'}`,stade:`${stade===0?'T1-T2a':stade===1?'T2b-T2c':'T3a+'}`},
      ranges:[
        {min:0,max:0,label:`Faible risque : PSA < 10 ET Gleason <= 6 ET T1-T2a`,severity:'low',recommendation:`Surveillance active ou traitement curatif (prostatectomie ou radiotherapie).`},
        {min:1,max:2,label:`Risque intermediaire : PSA 10-20 OU Gleason 7 OU T2b-T2c`,severity:'moderate',recommendation:`Traitement curatif (prostatectomie + curage ou radiotherapie +/- hormonotherapie).`},
        {min:3,max:6,label:`Haut risque : PSA > 20 OU Gleason 8-10 OU T3a+`,severity:'high',recommendation:`Traitement multimodal : radiotherapie + hormonotherapie longue. Prostatectomie chez selectionnes.`},
      ]}
  },
  interpretation: `La classification de D'Amico (1998) stratifie le risque de recidive biologique du cancer de la prostate en 3 groupes : faible risque (PSA < 10, Gleason <= 6, T1-T2a), risque intermediaire (PSA 10-20 ou Gleason 7 ou T2b-T2c), haut risque (PSA > 20 ou Gleason 8-10 ou T3a+).`,
  clinicalCommentary: `Classification historique toujours utilisee. Les guidelines EAU 2023 ont affine la stratification (5 groupes de risque). Ne pas utiliser pour la decision therapeutique seule : integrer l'age, les comorbidites, l'IRM et les nomogrammes. Le groupe intermediaire a une stratification interne (favorable vs defavorable) importante.`,
  references: [
    {type:`pubmed`,title:`D'Amico AV et al. Biochemical outcome after radical prostatectomy, external beam radiation therapy, or interstitial radiation therapy. JAMA 1998`,pmid:`9722303`},
    {type:`guideline`,title:`EAU - Prostate Cancer Guidelines (2023)`,url:`https://uroweb.org/guidelines/prostate-cancer`},
  ],
}
export default d_amico
