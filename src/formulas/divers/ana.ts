import type { FormulaDefinition } from '../types'

const ana: FormulaDefinition = {
  id: `ana`, slug: `ana`,
  name: `Anticorps antinucleaires (ANA)`,
  specialty: `divers`, category: `Immunologie`,
  description: `Interpretation des ANA`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`titre`,type:`radio`,label:`Titre`,options:[{value:0,label:`< 1/160`},{value:1,label:`1/160`},{value:2,label:`1/320`},{value:3,label:`>= 1/640`}]},
    {id:`profil`,type:`radio`,label:`Profil`,options:[{value:0,label:`Homogene`},{value:1,label:`Mouchete`},{value:2,label:`Nucleolaire`},{value:3,label:`Centromere`}]},
  ],
  calculate: (values) => {
    const t = parseInt(values.titre)||0; const p = parseInt(values.profil)||0; const sev = t >= 2 ? 'moderate' : 'low'
        const profils = ['Homogene (anti-ADN)','Mouchete (anti-ENA)','Nucleolaire (sclerodermie)','Centromere (CREST)']
        const label = 'Titre 1/' + [0,160,320,640][t] + ' - ' + (profils[p]||'')
        const retval = t; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:0,label:'Negatif',severity:'low' as const},{min:1,max:1,label:'Faible',severity:'low' as const},{min:2,max:2,label:'Positif - Bilan specifique',severity:'moderate' as const},{min:3,max:3,label:'Fort positif',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `ANA: depistage des connectivites. Titre >= 1/160 = positif. Profil oriente le diagnostic.`,
  clinicalCommentary: `Faux positifs: 5-15%. Titre >= 1/640 evocateur de LED.`,
  references: [
    {type:`pubmed`,title:`Petri M. Arthritis Rheum 2012`,pmid:`22553017`}
  ],
}
export default ana
