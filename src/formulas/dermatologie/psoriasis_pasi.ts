import type { FormulaDefinition } from '../types'

const psoriasis_pasi: FormulaDefinition = {
  id: `psoriasis_pasi`, slug: `psoriasis_pasi`,
  name: `Psoriasis PASI (Score)`,
  specialty: `dermatologie`, category: `Psoriasis`,
  description: `Psoriasis Area and Severity Index - severite du psoriasis`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`tete_erytheme`,type:`radio`,label:`Tete - Erytheme`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`tete_induration`,type:`radio`,label:`Tete - Induration`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`tete_desquamation`,type:`radio`,label:`Tete - Desquamation`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`tete_surface`,type:`radio`,label:`Tete - Surface atteinte`,options:[{value:0,label:`0`},{value:1,label:`< 10%`},{value:2,label:`10-30%`},{value:3,label:`30-50%`},{value:4,label:`50-70%`},{value:5,label:`70-90%`},{value:6,label:`> 90%`}]},
    {id:`tronc_erytheme`,type:`radio`,label:`Tronc - Erytheme`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`tronc_induration`,type:`radio`,label:`Tronc - Induration`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`tronc_desquamation`,type:`radio`,label:`Tronc - Desquamation`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`tronc_surface`,type:`radio`,label:`Tronc - Surface atteinte`,options:[{value:0,label:`0`},{value:1,label:`< 10%`},{value:2,label:`10-30%`},{value:3,label:`30-50%`},{value:4,label:`50-70%`},{value:5,label:`70-90%`},{value:6,label:`> 90%`}]},
    {id:`ms_erytheme`,type:`radio`,label:`MS - Erytheme`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`ms_induration`,type:`radio`,label:`MS - Induration`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`ms_desquamation`,type:`radio`,label:`MS - Desquamation`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`ms_surface`,type:`radio`,label:`MS - Surface atteinte`,options:[{value:0,label:`0`},{value:1,label:`< 10%`},{value:2,label:`10-30%`},{value:3,label:`30-50%`},{value:4,label:`50-70%`},{value:5,label:`70-90%`},{value:6,label:`> 90%`}]},
    {id:`mi_erytheme`,type:`radio`,label:`MI - Erytheme`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`mi_induration`,type:`radio`,label:`MI - Induration`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`mi_desquamation`,type:`radio`,label:`MI - Desquamation`,options:[{value:0,label:`0`},{value:1,label:`1`},{value:2,label:`2`},{value:3,label:`3`},{value:4,label:`4`}]},
    {id:`mi_surface`,type:`radio`,label:`MI - Surface atteinte`,options:[{value:0,label:`0`},{value:1,label:`< 10%`},{value:2,label:`10-30%`},{value:3,label:`30-50%`},{value:4,label:`50-70%`},{value:5,label:`70-90%`},{value:6,label:`> 90%`}]},
  ],
  calculate: (values) => {
    const tete = (parseInt(values.tete_erytheme)||0)+(parseInt(values.tete_induration)||0)+(parseInt(values.tete_desquamation)||0)
    const tronc = (parseInt(values.tronc_erytheme)||0)+(parseInt(values.tronc_induration)||0)+(parseInt(values.tronc_desquamation)||0)
    const ms = (parseInt(values.ms_erytheme)||0)+(parseInt(values.ms_induration)||0)+(parseInt(values.ms_desquamation)||0)
    const mi = (parseInt(values.mi_erytheme)||0)+(parseInt(values.mi_induration)||0)+(parseInt(values.mi_desquamation)||0)
    const s_tete = parseInt(values.tete_surface)||0
    const s_tronc = parseInt(values.tronc_surface)||0
    const s_ms = parseInt(values.ms_surface)||0
    const s_mi = parseInt(values.mi_surface)||0
    const pasi = Math.round((tete * s_tete * 0.1) + (tronc * s_tronc * 0.2) + (ms * s_ms * 0.2) + (mi * s_mi * 0.3) * 10) / 10
    const sev = pasi >= 10 ? 'high' : pasi >= 5 ? 'moderate' : 'low'
    const label = pasi < 5 ? 'Psoriasis leger' : pasi < 10 ? 'Psoriasis modere' : 'Psoriasis severe'
    return {value:pasi, label, severity: sev,
      ranges:[
        {min:0,max:4.9,label:'Psoriasis leger - Traitement topique',severity:'low'},
        {min:5,max:9.9,label:'Psoriasis modere - Phototherapie ou systemique',severity:'moderate'},
        {min:10,max:72,label:'Psoriasis severe - Biotherapie probable',severity:'high'},
      ]}
  },
  interpretation: `Le PASI (Psoriasis Area and Severity Index) est le score de reference pour evaluer la severite du psoriasis et la reponse au traitement.`,
  clinicalCommentary: `Le PASI combine 4 regions (tete 10%, tronc 30%, MS 20%, MI 40%). Une reduction de 75% (PASI75) est l\'objectif therapeutique standard.`,
  references: [
    {type:`pubmed`,title:`Fredriksson T, Pettersson U. Dermatologica 1978`,pmid:`781267`}
  ],
}
export default psoriasis_pasi
