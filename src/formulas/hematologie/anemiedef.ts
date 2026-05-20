import type { FormulaDefinition } from '../types'

const anemiedef: FormulaDefinition = {
  id: `anemiedef`, slug: `anemiedef`,
  name: `Classification des Anemies`,
  specialty: `hematologie`, category: `Anemie`,
  description: `Classification des anemies selon le VGM, la reticulocytose et l'hemoglobine`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`hb`,type:`number`,label:`Hemoglobine (g/dL)`,unit:`g/dL`,min:0,max:20,step:0.1,placeholder:`Ex: 10.5`},
    {id:`sexe`,type:`radio`,label:`Sexe du patient`,options:[
      {value:1,label:`Homme`},{value:0,label:`Femme`},
    ]},
    {id:`vgm`,type:`number`,label:`Volume Globulaire Moyen (fL)`,unit:`fL`,min:0,max:150,step:1,placeholder:`Ex: 85`},
    {id:`reticulocytes`,type:`number`,label:`Reticulocytes (G/L)`,unit:`G/L`,min:0,max:500,step:1,placeholder:`Ex: 60`},
  ],
  calculate: (values) => {
    const hb = parseFloat(values.hb||0)
    const vgm = parseFloat(values.vgm||0)
    const ret = parseFloat(values.reticulocytes||0)
    const homme = parseInt(values.sexe||0)
    const seuil = homme ? 13 : 12
    const severite = hb < 7 ? 'severe' : hb < 10 ? 'moderee' : 'legere'
    
    let type_anemie = `Anemie normocytaire normochrome`
    if (vgm < 80) type_anemie = `Anemie microcytaire hypochrome`
    else if (vgm > 100) type_anemie = `Anemie macrocytaire`
    
    let type_regenerative = ``
    if (ret > 0) {
      const ret_pct = (ret*1000/5000000)*100
      type_regenerative = ret_pct > 2 ? ` (regenerative: IR > 2%)` : ` (aregenerative: IR < 2%)`
    }
    
    const label = `${type_anemie}${type_regenerative} - ${severite} (Hb: ${hb.toFixed(1)} g/dL)`
    
    return {value:hb, unit:`g/dL`, label, severity: hb < seuil ? 'moderate' : 'low',
      ranges:[
        {min:seuil*2||24,max:99,label:'Normal',severity:'low'},
        {min:seuil-1,max:seuil+(seuil>12?12:12),label:'Anemie legere',severity:'low'},
        {min:seuil-3,max:seuil-1.1,label:'Anemie moderee',severity:'moderate'},
        {min:0,max:seuil-3,label:'Anemie severe',severity:'high'},
      ]}
  },
  interpretation: `L'anemie est definie par un taux d'hemoglobine < 13 g/dL chez l'homme et < 12 g/dL chez la femme. Le VGM oriente le diagnostic:<br/>• Microcytaire (< 80 fL): carence martiale, thalassemie, inflammation<br/>• Normocytaire (80-100 fL): hemorragie, hemolyse, IRC, carence mixte<br/>• Macrocytaire (> 100 fL): carence B12/folates, alcohol, MDS, hypothyroidie`,
  clinicalCommentary: `L'interpretation doit tenir compte du contexte clinique. Le taux de reticulocytes (< 120 G/L = aregeneratif) permet de distinguer anemie centrale (moelle) vs peripherique (hemorragie/hemolyse). Un index de reticulocytes (IR = reticulocytes% × Hb/45) < 2% = aregeneratif.`,
  references: [
    {type:`pubmed`,title:`World Health Organization. Nutritional anaemias 1968`,pmid:`pubmed-link`},
    {type:`guideline`,title:`OMS Classification des anemies`,url:`https://www.who.int/nutrition/publications/micronutrients/anaemias/en/`},
  ],
}
export default anemiedef
