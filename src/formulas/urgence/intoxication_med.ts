import type { FormulaDefinition } from '../types'

const intoxication_med: FormulaDefinition = {
  id: `intoxication_med`, slug: `intoxication_med`,
  name: `Intoxication medicamenteuse (Gravite)`,
  specialty: `urgence`, category: `Toxicologie`,
  description: `Evaluation de la gravite d\'une intoxication medicamenteuse aigue`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`produit`,type:`radio`,label:`Produit`,options:[{value:0,label:`Paracetamol`},{value:1,label:`Benzodiazepine`},{value:2,label:`Antidepresseur`},{value:3,label:`Lithium`},{value:4,label:`Beta-bloquant / IC`},{value:5,label:`Autre`}]},
    {id:`trouble_conscience`,type:`boolean`,label:`Trouble de conscience`,weight:1},
    {id:`convulsion`,type:`boolean`,label:`Convulsion`,weight:1},
    {id:`ecg`,type:`boolean`,label:`Trouble ECG (QRS > 120, QT long)`,weight:1},
    {id:`hypotension`,type:`boolean`,label:`Hypotension / choc`,weight:1},
    {id:`dose_elevee`,type:`boolean`,label:`Dose elevee / suicide`,weight:1},
  ],
  calculate: (values) => {
    const prod = parseInt(values.produit)||0; const s = (values.trouble_conscience?2:0)+(values.convulsion?2:0)+(values.ecg?2:0)+(values.hypotension?2:0)+(values.dose_elevee?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        let label = 'Score: ' + s
        if (prod === 0 && s >= 2) label += ' - Dosage paracetamolemie + NAC';
        if (s >= 4) label += ' - Reanimation + antidote';
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'Surveillance',severity:'low' as const},
          {min:2,max:3,label:'Surveillance rapprochee',severity:'moderate' as const},
          {min:4,max:999,label:'Reanimation',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Evaluation de la gravite d\'une intoxication medicamenteuse: signes vitaux, ECG, trouble de conscience.`,
  clinicalCommentary: `L\'intoxication au paracetamol necessite un dosage a H4 (normogramme de Prescott). Le N-acetylcysteine (NAC) est efficace dans les 8h.`,
  references: [
    {type:`pubmed`,title:`Bateman DN. Lancet 2010`,pmid:`20116844`}
  ],
}
export default intoxication_med
