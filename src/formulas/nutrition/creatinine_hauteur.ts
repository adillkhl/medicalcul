import type { FormulaDefinition } from '../types'

const creatinine_hauteur: FormulaDefinition = {
  id: `creatinine_hauteur`, slug: `creatinine_hauteur`,
  name: `Index Creatinine-Taille (ICT)`,
  specialty: `nutrition`, category: `Evaluation Nutritionnelle`,
  description: `Index de masse maigre base sur la creatinine urinaire des 24h et la taille du patient`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`creatinine_urinaire`,type:`number`,label:`Creatinine urinaire des 24h (mg/24h)`,unit:`mg/24h`,min:0,max:5000,step:1,placeholder:`Ex: 800`},
    {id:`taille`,type:`number`,label:`Taille (cm)`,unit:`cm`,min:0,max:250,step:0.5,placeholder:`Ex: 170`},
    {id:`sexe`,type:`radio`,label:`Sexe`,options:[
      {value:0,label:`Femme`},{value:1,label:`Homme`},
    ]},
  ],
  calculate: (values) => {
    const crea = parseFloat(values.creatinine_urinaire||0)
    const taille = parseFloat(values.taille||0)
    const homme = parseInt(values.sexe||0)
    
    // Valeur ideal de creatinine urinaire selon la taille
    const crea_ideal_h = (taille - 100) * 23
    const crea_ideal_f = (taille - 100) * 18
    const crea_ideal = homme ? crea_ideal_h : crea_ideal_f
    
    const ict = crea_ideal > 0 ? (crea / crea_ideal) * 100 : 0
    
    return {value:Math.round(ict), unit:`%`, label:ict>=90?'Normal':ict>=60?'Denutrition moderee':'Denutrition severe', severity: ict>=90?'low':ict>=60?'moderate':'high',
      details:{
        creatinine_ideale: Math.round(crea_ideal),
        creatinine_mesuree: crea,
      },
      ranges:[
        {min:90,max:999,label:'Normal (≥ 90%)',severity:'low'},
        {min:60,max:89,label:'Denutrition moderee (60-89%)',severity:'moderate'},
        {min:0,max:59,label:'Denutrition severe (< 60%)',severity:'high'},
      ]}
  },
  interpretation: `L'Index Creatinine-Taille (ICT) estime la masse musculaire. La creatinine urinaire des 24h est proportionnelle a la masse musculaire. L'ICT = (creatinine mesuree / creatinine ideale pour la taille) × 100.<br/><br/>• ≥ 90%: Normal<br/>• 60-89%: Denutrition moderee (fonte musculaire)<br/>• < 60%: Denutrition severe`,
  clinicalCommentary: `L'ICT est un bon marqueur de la masse maigre mais est peu utilise en pratique courante. Necessite un recueil urinaire de 24h fiable, souvent difficile chez le sujet age. Influence par l'insuffisance renale (baisse de l'excretion de creatinine) et par la consommation de viande.`,
  references: [
    {type:`pubmed`,title:`Bistrian BR et al. JPEN J Parenter Enteral Nutr 1977`,pmid:`pubmed-link`},
    {type:`pubmed`,title:`Forse RA, Shizgal HM. JPEN 1980`,pmid:`7392162`},
  ],
}
export default creatinine_hauteur
