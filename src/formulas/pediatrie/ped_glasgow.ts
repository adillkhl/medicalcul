import type { FormulaDefinition } from '../types'

const ped_glasgow: FormulaDefinition = {
  id: `ped_glasgow`, slug: `ped_glasgow`,
  name: `Echelle de Glasgow Pediatrique (GCS adapte a l'age)`,
  specialty: `pediatrie`, category: `Neurologie`,
  description: `Evaluation du niveau de conscience chez l'enfant et le nourrisson avec adaptation verbale selon l'age (score 3-15)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`oeil`,type:`radio`,label:`Ouverture des yeux`,options:[
      {value:4,label:`Spontanee`},
      {value:3,label:`A la demande verbale`},
      {value:2,label:`A la douleur`},
      {value:1,label:`Aucune`},
    ]},
    {id:`verbal`,type:`radio`,label:`Reponse verbale (adaptee a l'age)`,options:[
      {value:5,label:`< 2 ans : Cris normaux / > 2 ans : Orientee`},
      {value:4,label:`< 2 ans : Pleure / > 2 ans : Confuse`},
      {value:3,label:`< 2 ans : Cris inappropries / > 2 ans : Inapproprie`},
      {value:2,label:`< 2 ans : Geint / > 2 ans : Incomprehensible`},
      {value:1,label:`Aucune`},
    ]},
    {id:`moteur`,type:`radio`,label:`Reponse motrice`,options:[
      {value:6,label:`Obeyt aux ordres`},
      {value:5,label:`Localise la douleur`},
      {value:4,label:`Retrait a la douleur`},
      {value:3,label:`Flexion a la douleur (decortication)`},
      {value:2,label:`Extension a la douleur (decerebration)`},
      {value:1,label:`Aucune`},
    ]},
    {id:`age`,type:`radio`,label:`Age`,options:[{value:0,label:`< 2 ans (nourrisson)`},{value:1,label:`>= 2 ans (enfant)`}]},
  ],
  calculate: (values) => {
    const oeil = values.oeil ?? 0
    const verbal = values.verbal ?? 0
    const moteur = values.moteur ?? 0
    const total = oeil + verbal + moteur
    const sev = total >= 13 ? `low` : total >= 9 ? `moderate` : `high`
    return {value:total, label:`GCS ${total}/15`, severity: sev,
      details:{Y:oeil,V:verbal,M:moteur},
      ranges:[
        {min:13,max:15,label:`GCS 13-15 - Traumatisme cranien leger`,severity:`low`,recommendation:`Surveillance neurologique. Scanner cerebrale selon regles de decision clinique (NICE/PECARN).`},
        {min:9,max:12,label:`GCS 9-12 - Traumatisme cranien modere`,severity:`moderate`,recommendation:`Scanner cerebral en urgence. Hospitalisation. Surveillance neurochirurgicale.`},
        {min:3,max:8,label:`GCS 3-8 - Coma (TC severe)`,severity:`high`,recommendation:`Intubation et ventilation. Reanimation. Scanner. Avis neurochirurgical urgent.`},
      ]}
  },
  interpretation: `Le Glasgow pediatric adapte l'item verbal selon l'age de l'enfant (< 2 ans : cris, pleurs, geignements ; >= 2 ans : langage oriente, confus, inapproprie). Memes items oculaire et moteur que le GCS adulte. Score total 3-15.`,
  clinicalCommentary: `Reference pour la neurologie pediatrique aux urgences. Chez le nourrisson, l'item verbal est difficile : se baser sur les vocalisations appropriees. L'item moteur est le meme quel que soit l'age. Un enfant avec GCS <= 8 doit etre intube. Attention aux sedations et aux barrières linguistiques. La regle PECARN aide a decider du scanner chez l'enfant.`,
  references: [
    {type:`pubmed`,title:`James HE, Anas NG. The Glasgow Coma Scale in infants and children. Crit Care Med 1982`,pmid:`7083868`},
    {type:`guideline`,title:`PECARN - Pediatric Emergency Care Applied Research Network (2021)`,url:`https://pecarn.org/`},
  ],
}
export default ped_glasgow
