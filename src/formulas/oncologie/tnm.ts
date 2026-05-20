import type { FormulaDefinition } from '../types'

const tnm: FormulaDefinition = {
  id: `tnm`, slug: `tnm`,
  name: `TNM (Classification)`,
  specialty: `oncologie`, category: `Stadification`,
  description: `Classification TNM des tumeurs solides (principe general)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`t`,type:`radio`,label:`T - Tumeur primitive`,options:[{value:0,label:`T0 - Pas de tumeur`},{value:1,label:`T1 - Petite tumeur`},{value:2,label:`T2 - Taille/ganglionnaire`},{value:3,label:`T3 - Extension locale`},{value:4,label:`T4 - Invasion organes voisins`}]},
    {id:`n`,type:`radio`,label:`N - Ganglions`,options:[{value:0,label:`N0 - Pas d'adenopathie`},{value:1,label:`N1 - Ganglions régionaux`},{value:2,label:`N2 - Multiples/bilateral`},{value:3,label:`N3 - Ganglions a distance`}]},
    {id:`m`,type:`radio`,label:`M - Metastases`,options:[{value:0,label:`M0 - Pas de metastases`},{value:1,label:`M1 - Metastases a distance`}]},
  ],
  calculate: (values) => {
    const t = parseInt(values.t)||0; const n = parseInt(values.n)||0; const m = parseInt(values.m)||0
        const stade = {0:'Stade 0 (in situ)',1:'Stade I (localise)',2:'Stade II (localise avance)',3:'Stade III (regional)',4:'Stade IV (metastatique)'}
        const maxTn = Math.max(t, n); const idx = m === 1 ? 4 : maxTn >= 4 ? 4 : maxTn >= 3 ? 3 : maxTn >= 2 ? 2 : maxTn >= 1 ? 1 : 0
        const sev = idx >= 3 ? 'high' : idx >= 2 ? 'moderate' : 'low'
        const retval = idx; const retlabel = 'T' + t + 'N' + n + 'M' + m + ' - ' + (stade[idx]||''); const retsev = sev
        const ranges = [{min:0,max:0,label:'In situ',severity:'low' as const},{min:1,max:1,label:'Localise',severity:'low' as const},{min:2,max:2,label:'Localise avance',severity:'moderate' as const},{min:3,max:3,label:'Regional',severity:'high' as const},{min:4,max:4,label:'Metastatique',severity:'critical' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le TNM est le systeme de classification standard des cancers. T = tumeur, N = ganglion, M = metastase.`,
  clinicalCommentary: `Chaque organe a sa propre definition TNM. Le stade TNM determine le pronostic et le traitement.`,
  references: [
    {type:`pubmed`,title:`Brierley JD. Wiley 2017`,pmid:`---`}
  ],
}
export default tnm
