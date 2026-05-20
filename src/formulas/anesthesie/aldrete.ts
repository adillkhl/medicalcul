import type { FormulaDefinition } from '../types'

const aldrete: FormulaDefinition = {
  id: `aldrete`, slug: `aldrete`,
  name: `Aldrete (Score)`,
  specialty: `anesthesie`, category: `Reveil`,
  description: `Score de sortie de salle de reveil post-anesthesie`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`conscience`,type:`radio`,label:`Conscience`,options:[{value:0,label:`Aucune reponse`},{value:1,label:`Reponse a la stimulation`},{value:2,label:`Eveille, alerte`}]},
    {id:`respiration`,type:`radio`,label:`Respiration`,options:[{value:0,label:`Apnee`},{value:1,label:`Dyspnee, superficielle`},{value:2,label:`Profonde, tousse`}]},
    {id:`circulation`,type:`radio`,label:`Circulation (PA)`,options:[{value:0,label:`± 50% normale`},{value:1,label:`± 20-50%`},{value:2,label:`± 20% normale`}]},
    {id:`motricite`,type:`radio`,label:`Motricite`,options:[{value:0,label:`Aucun mouvement`},{value:1,label:`2 membres`},{value:2,label:`4 membres`}]},
    {id:`saturation`,type:`radio`,label:`SpO2`,options:[{value:0,label:`< 90%`},{value:1,label:`90-95%`},{value:2,label:`> 95%`}]},
  ],
  calculate: (values) => {
    const s = (values.conscience??0)+(values.respiration??0)+(values.circulation??0)+(values.motricite??0)+(values.saturation??0)
    const sev = s < 7 ? 'high' : s < 9 ? 'moderate' : 'low'
    const autorise = s >= 9
    const label = autorise ? "Sortie de SSPI autorisee" : "Surveillance prolongee necessaire"
    return {value:s, label, severity: sev,
      ranges:[
      {min:9,max:10,label:`Sortie autorisee`,severity:`low`},
      {min:7,max:8,label:`Surveillance prolongee`,severity:`moderate`},
      {min:0,max:6,label:`Reveil incomplet, intubation?`,severity:`high`},
      ]}
  },
  interpretation: `Le score d'Aldrete evalue le reveil post-anesthesie. Un score >= 9/10 autorise la sortie de SSPI.`,
  clinicalCommentary: `Outil valide mais tendance a l'abandon au profit d'echelles plus modernes.`,
  references: [
    {type:`pubmed`,title:`Aldrete JA, Kroulik D. Anesth Analg 1970`,pmid:`5534692`}
  ],
}
export default aldrete
