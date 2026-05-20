import type { FormulaDefinition } from '../types'

const cgi: FormulaDefinition = {
  id: `cgi`, slug: `cgi`,
  name: `Clinical Global Impression (CGI)`,
  specialty: `psychiatrie`, category: `Echelles Globales`,
  description: `Evaluation globale de la severite (CGI-S), de l\'amelioration (CGI-I) et de l\'efficacite/tolerance (CGI-E) en psychiatrie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`severite`,type:`radio`,label:`CGI-S - Severite de la maladie`,options:[
      {value:0,label:`Non evalue`},{value:1,label:`Normal, pas du tout malade`},{value:2,label:`A la limite des troubles`},
      {value:3,label:`Legerement malade`},{value:4,label:`Moderement malade`},{value:5,label:`Nettement malade`},
      {value:6,label:`Gravement malade`},{value:7,label:`Extremement malade`},
    ]},
    {id:`amelioration`,type:`radio`,label:`CGI-I - Amelioration globale`,options:[
      {value:0,label:`Non evalue`},{value:1,label:`Tres nettement ameliore`},{value:2,label:`Nettement ameliore`},
      {value:3,label:`Legerement ameliore`},{value:4,label:`Pas de changement`},{value:5,label:`Legerement empire`},
      {value:6,label:`Nettement empire`},{value:7,label:`Tres nettement empire`},
    ]},
    {id:`efficacite`,type:`radio`,label:`CGI-E - Efficacite therapeutique / Tolerance`,options:[
      {value:0,label:`Non evalue`},{value:1,label:`Marquee - sans effet indesirable`},{value:2,label:`Marquee - EI genants`},
      {value:3,label:`Moderee - sans EI`},{value:4,label:`Moderee - EI genants`},{value:5,label:`Minime - sans EI`},
      {value:6,label:`Minime - EI genants`},{value:7,label:`Inchangee ou aggravee`},
    ]},
  ],
  calculate: (values) => {
    const severite = values.severite ?? 1
    const amelioration = values.amelioration ?? 4
    const efficacite = values.efficacite ?? 0
    const sev = severite >= 5 ? 'high' as const : severite >= 3 ? 'moderate' as const : 'low' as const
    return {value:severite, label:`CGI-S ${severite} | CGI-I ${amelioration} | CGI-E ${efficacite}`, severity: sev,
      details:{severite:`${severite}/7`,amelioration:`${amelioration}/7`,efficacite:`${efficacite}/7`},
      ranges:[
        {min:1,max:2,label:`Normal ou limite`,severity:'low'},
        {min:3,max:4,label:`Leger a modere`,severity:'moderate'},
        {min:5,max:7,label:`Grave a extremement malade`,severity:'high'},
      ]}
  },
  interpretation: `Le CGI comporte 3 sous-echelles : CGI-S (severite de la maladie, 1-7), CGI-I (amelioration globale, 1-7) et CGI-E (efficacite therapeutique et tolerance). Utilise comme mesure globale de l\'etat clinique et de la reponse au traitement.`,
  clinicalCommentary: `Largement utilise dans les essais therapeutiques en psychiatrie. Le CGI-S est evalue a l\'inclusion, le CGI-I en cours de traitement. Le CGI-E combine efficacite et tolerance. Simple et rapide, mais dependant du clinicien.`,
  references: [
    {type:`pubmed`,title:`Guy W. ECDEU Assessment Manual for Psychopharmacology. US DHEW 1976`,pmid:`None`},
    {type:`pubmed`,title:`Busner J, Targum SD. The CGI Scale. Psychiatry (Edgmont) 2007`,pmid:`20526405`},
  ],
}
export default cgi
