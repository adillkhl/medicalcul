import type { FormulaDefinition } from '../types'

const timi_sca: FormulaDefinition = {
  id: `timi_sca`, slug: `timi_sca`,
  name: `TIMI SCA non ST+ (Score)`,
  specialty: `cardiologie`, category: `Coronarien`,
  description: `Estimation de la mortalite a 14 jours dans le SCA sans sus-decalage ST`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`age65`,type:`boolean`,label:`Age ≥ 65 ans`,weight:1},
    {id:`coro`,type:`boolean`,label:`≥ 3 facteurs de risque coronarien`,weight:1},
    {id:`coronaropathie`,type:`boolean`,label:`Coronaropathie connue (stenose ≥ 50%)`,weight:1},
    {id:`asa`,type:`boolean`,label:`Aspirine dans les 7 jours`,weight:1},
    {id:`angor`,type:`boolean`,label:`Angor severe (≥ 2 episodes en 24h)`,weight:1},
    {id:`enzymes`,type:`boolean`,label:`Enzymes cardiaques elevees (CK-MB/Tropo)`,weight:1},
    {id:`st`,type:`boolean`,label:`ST ≥ 0.5 mm deplacement`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.age65?1:0)+(values.coro?1:0)+(values.coronaropathie?1:0)+(values.asa?1:0)+(values.angor?1:0)+(values.enzymes?1:0)+(values.st?1:0)
        const sev = s >= 5 ? 'high' : s >= 3 ? 'moderate' : 'low'
        const mort: Record<number, number>= {0:4.7,1:10.6,2:13.2,3:22.6,4:32,5:45.2,6:57.4,7:77.7}
        const label = s + ' - Mortalite à 14j: ' + (mort[s]||0) + '%'
        const retval = s
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Risque faible (5-11%)',severity:'low' as const},
          {min:2,max:3,label:'Risque modere (13-23%)',severity:'moderate' as const},
          {min:4,max:5,label:'Risque eleve (32-45%)',severity:'high' as const},
          {min:6,max:7,label:'Risque tres eleve (57-78%)',severity:'critical' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le TIMI NSTEMI (SCA non ST+) est un score pronostique a 14 jours. Il guide la decision de coronarographie precoce (si score ≥ 3).`,
  clinicalCommentary: `Un score TIMI eleve (> 4) justifie une strategie invasive precoce (< 24h). La mise a jour du score avec la troponine haute sensibilite ameliore la stratification. Le GRACE offre une meilleure discrimination en continu.`,
  references: [
    {type:`pubmed`,title:`Antman EM et al. JAMA 2000`,pmid:`11015594`}
  ],
}
export default timi_sca
