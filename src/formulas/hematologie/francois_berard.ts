import type { FormulaDefinition } from '../types'

const francois_berard: FormulaDefinition = {
  id: `francois_berard`, slug: `francois_berard`,
  name: `Francois-Berard - Classification de l\'Anemie Ferriprive`,
  specialty: `hematologie`, category: `Anemie`,
  description: `Classification de l\'anemie par carence martiale selon les valeurs d\'hemoglobine, ferritine, coefficient de saturation de la transferrine`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`hb`,type:`number`,label:`Hemoglobine (g/dL)`,unit:`g/dL`,min:0,max:20,step:0.1,placeholder:`Ex: 10.5`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[
      {value:1,label:`Homme`},{value:0,label:`Femme`},
    ]},
    {id:`ferritine`,type:`number`,label:`Ferritine (ng/mL)`,unit:`ng/mL`,min:0,max:2000,step:1,placeholder:`Ex: 15`},
    {id:`cst`,type:`number`,label:`Coefficient de Saturation de la Transferrine (%)`,unit:`%`,min:0,max:100,step:1,placeholder:`Ex: 12`},
    {id:`crp`,type:`number`,label:`CRP (mg/L)`,unit:`mg/L`,min:0,max:500,step:1,placeholder:`Ex: 5`},
  ],
  calculate: (values) => {
    const hb = parseFloat(values.hb||0)
    const fer = parseFloat(values.ferritine||0)
    const cst = parseFloat(values.cst||0)
    const crp = parseFloat(values.crp||0)
    const homme = parseInt(values.sexe||0)
    const seuil = homme ? 13 : 12
    
    let stade = ``
    let type_carence = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    
    // Stade de severite
    if (hb < 7) stade = `Anemie severe`
    else if (hb < seuil) stade = `Anemie`
    else stade = `Pas d\'anemie`
    
    // Type de carence
    if (crp > 10) {
      if (fer < 30) type_carence = `Carence martiale vraie (ferritine basse avec CRP elevee)`
      else if (fer < 100) type_carence = `Carence martiale possible (ferritine normale-basse avec inflammation)`
      else type_carence = `Anemie inflammatoire (ferritine normale/haute, CRP elevee)`
    } else {
      if (fer < 15) type_carence = `Carence martiale franche`
      else if (fer < 30) type_carence = `Carence martiale debutante (ferritine basse)`
      else type_carence = `Pas de carence martiale`
    }
    
    // Severite
    if (hb < seuil && fer < 30) sev = `moderate`
    if (hb < 7) sev = `high`
    
    return {value:hb, unit:`g/dL`, label:`${stade} - ${type_carence}`, severity: sev,
      details:{ ferritine: fer, cst: cst, crp: crp },
      ranges:[
        {min:seuil*2||24,max:99,label:'Normal',severity:'low'},
        {min:seuil-1,max:seuil+(seuil>12?12:12),label:'Anemie legere',severity:'low'},
        {min:seuil-3,max:seuil-1.1,label:'Anemie moderee',severity:'moderate'},
        {min:0,max:seuil-3,label:'Anemie severe',severity:'high'},
      ]}
  },
  interpretation: `Le diagnostic de carence martiale repose sur:<br/>• Ferritine < 15 ng/mL: carence martiale certaine (inflammation absente)<br/>• Ferritine < 30 ng/mL: carerence martiale probable (meme avec inflammation)<br/>• CST < 16%: carence fonctionnelle<br/>• CRP > 10 mg/L: syndrome inflammatoire compliquant l\'interpretation<br/><br/>L\'anemie inflammatoire se caracterise par ferritine normale/elevee avec CRP elevee et CST basse.`,
  clinicalCommentary: `La ferritine est un reactif de phase aigue: elle peut etre faussement normale en cas d\'inflammation associee. En cas d\'inflammation (CRP > 10), un seuil de ferritine < 100 ng/mL peut encore evoquer une carence martiale. Le coefficient de saturation de la transferrine (CST) est moins sensible a l\'inflammation.`,
  references: [
    {type:`pubmed`,title:`Guyatt GH et al. CMAJ 1992`,pmid:`1735111`},
    {type:`pubmed`,title:`Weiss G, Goodnough LT. N Engl J Med 2005`,pmid:`15829538`},
  ],
}
export default francois_berard
