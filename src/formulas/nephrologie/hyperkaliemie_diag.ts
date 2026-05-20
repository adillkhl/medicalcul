import type { FormulaDefinition } from '../types'

const hyperkaliemie_diag: FormulaDefinition = {
  id: `hyperkaliemie_diag`, slug: `hyperkaliemie_diag`,
  name: `Hyperkaliemie (Diagnostic)`,
  specialty: `nephrologie`, category: `Potassium`,
  description: `Approche diagnostique et urgente de l'hyperkaliemie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`k`,type:`radio`,label:`Kaliemie`,options:[{value:0,label:`5.5-5.9 mmol/L legere`},{value:1,label:`6.0-6.4 mmol/L moderee`},{value:2,label:`>= 6.5 mmol/L severe`}]},
    {id:`ecg`,type:`boolean`,label:`Anomalies ECG (ondes T amples, QRS larges)`,weight:1},
    {id:`insuf_renale`,type:`boolean`,label:`Insuffisance renale`,weight:1},
    {id:`medicaments`,type:`boolean`,label:`IEC/ARA2/spironolactone/AINS`,weight:1},
  ],
  calculate: (values) => {
    let k = parseInt(values.k)||0; const ecg = values.ecg?1:0; const s = (values.insuf_renale?1:0)+(values.medicaments?1:0)
        let sev = k === 2 ? 'critical' : k === 1 ? 'high' : 'low'
        if (ecg) sev = 'critical'
        const retval = k; const retlabel = (k===0?'Legere':k===1?'Moderee':'Severe')+(ecg?' + ECG anormal':''); const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Legere - Kayexalate + surveillance',severity:'low' as const},
          {min:1,max:1,label:'Moderee - ECG + insuline/glucose',severity:'high' as const},
          {min:2,max:2,label:'URGENCE - Gluconate Ca IV',severity:'critical' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L'hyperkaliemie est une urgence vitale. ECG immediat si K+ > 6.0.`,
  clinicalCommentary: `Traitement urgent: Gluconate Ca (protection cardiaque), Insuline+Glucose, B2-agonistes, Kayexalate.`,
  references: [
    {type:`pubmed`,title:`Palmer BF. N Engl J Med 2021`,pmid:`33657290`}
  ],
}
export default hyperkaliemie_diag
