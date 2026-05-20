import type { FormulaDefinition } from '../types'

const glasgow_reanimation: FormulaDefinition = {
  id: `glasgow_reanimation`, slug: `glasgow_reanimation`,
  name: `Echelle de Glasgow (GCS) pour Reanimation`,
  specialty: `reanimation`, category: `Neurologie`,
  description: `Evaluation du niveau de conscience adaptee au contexte de reanimation (patient intube, sedate, etc.)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`oeil`,type:`radio`,label:`Ouverture des yeux`,options:[
      {value:4,label:`Spontanee`},
      {value:3,label:`A la demande verbale`},
      {value:2,label:`A la douleur`},
      {value:1,label:`Aucune`},
    ]},
    {id:`verbal`,type:`radio`,label:`Reponse verbale (adapter si intube : VT = 1)`,options:[
      {value:5,label:`Orientee`},
      {value:4,label:`Confuse`},
      {value:3,label:`Inapproprie`},
      {value:2,label:`Incomprehensible`},
      {value:1,label:`Aucune / Intube (VT)`},
    ]},
    {id:`moteur`,type:`radio`,label:`Reponse motrice`,options:[
      {value:6,label:`Obeyt aux ordres`},
      {value:5,label:`Localise la douleur`},
      {value:4,label:`Retrait a la douleur`},
      {value:3,label:`Flexion a la douleur (decortication)`},
      {value:2,label:`Extension a la douleur (decerebration)`},
      {value:1,label:`Aucune`},
    ]},
    {id:`intube`,type:`radio`,label:`Patient intube`,options:[{value:1,label:`Non`},{value:0,label:`Oui (verbal = 1T)`}]},
  ],
  calculate: (values) => {
    const oeil = values.oeil ?? 1
    const verbal_brut = values.verbal ?? 1
    const moteur = values.moteur ?? 1
    const intube = values.intube ?? 1
    // If intubated, verbal = 1 (T)
    const verbal = intube === 0 ? 1 : verbal_brut
    const total = oeil + verbal + moteur
    const sev = total >= 13 ? 'low' as const : total >= 9 ? 'moderate' as const : 'high' as const
    return {value:total, label:`GCS ${total}/15 (Y${oeil} V${verbal} M${moteur})`, severity: sev,
      details:{Y:oeil,V:verbal,M:moteur,intube:intube===0?'Oui':'Non'},
      ranges:[
        {min:13,max:15,label:`GCS 13-15 - Eveil conservé`,severity:'low',recommendation:`Surveillance neurologique. Evaluation de la sedation.`},
        {min:9,max:12,label:`GCS 9-12 - Obnubilation / confusion`,severity:'moderate',recommendation:`Surveillance rapprochee. Scanner cerebral si deterioration. Evaluer la sedation.`},
        {min:3,max:8,label:`GCS 3-8 - Coma`,severity:'high',recommendation:`Patient comateux. Protection des voies aeriennes si non intube. Bilan etiologique (TDM, IRM, EEG). Monitorage de la PIC si HTIC.`},
      ]}
  },
  interpretation: `L\'echelle de Glasgow (GCS) est l\'outil universel d\'evaluation de la conscience. En reanimation, attention particuliere au patient intube (V = 1T) et a la sedation qui peut masquer le score. Le score moteur est l\'element le plus predictif du pronostic.`,
  clinicalCommentary: `Indispensable en reanimation. Un GCS <= 8 = coma = indication d\'intubation pour protection des VA. Chez le patient sedate, noter le meilleur score avant sedation ou la raison pour laquelle il ne peut pas etre evalue. L\'item verbal est inutilisable chez l\'intube (coter 1T). Ne pas confondre avec le RASS pour la sedation. Le score moteur est le plus fiable pour le pronostic a long terme. Attention aux myorelaxants qui abolissent la reponse motrice.`,
  references: [
    {type:`pubmed`,title:`Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet 1974`,pmid:`4136544`},
    {type:`pubmed`,title:`Teasdale G et al. The Glasgow Coma Scale at 40. J Neurosurg 2014`,pmid:`24978640`},
  ],
}
export default glasgow_reanimation
